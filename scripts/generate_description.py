import json
import os
import sys

MODEL_ID = "Qwen/Qwen2.5-0.5B-Instruct"
MAX_NEW_TOKENS = 48


def load_model():
    import torch
    from transformers import AutoModelForCausalLM, AutoTokenizer

    cpu_count = os.cpu_count() or 1
    torch.set_num_threads(max(1, min(cpu_count, 8)))
    try:
        torch.set_num_interop_threads(1)
    except RuntimeError:
        pass

    tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
    model = AutoModelForCausalLM.from_pretrained(
        MODEL_ID,
        torch_dtype=torch.float32,
        device_map="cpu",
    )
    model.eval()
    return tokenizer, model


def generate_with_model(tokenizer, model, name: str, category: str = "", store: str = "") -> str:
    import torch

    prompt = (
        "Eres un redactor de e-commerce tech. Escribe 1 párrafo corto, claro y útil en español. "
        "No inventes especificaciones que no estén en el nombre. Máximo 45 palabras. "
        "Sin comillas ni títulos.\n\n"
        f"Producto: {name}\n"
        f"Categoría: {category or 'Tecnología'}\n"
        f"Tienda: {store or 'Tienda online'}\n\n"
        "Descripción:"
    )
    messages = [
        {"role": "system", "content": "Responde solo con la descripción en español, sin comillas ni títulos."},
        {"role": "user", "content": prompt},
    ]
    text = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    inputs = tokenizer([text], return_tensors="pt")

    with torch.inference_mode():
        output = model.generate(
            **inputs,
            max_new_tokens=MAX_NEW_TOKENS,
            do_sample=False,
            pad_token_id=tokenizer.eos_token_id,
        )
    generated = output[0][inputs["input_ids"].shape[1]:]
    result = tokenizer.decode(generated, skip_special_tokens=True).strip()
    for prefix in ["Descripción:", "Descripcion:", "Description:"]:
        if result.lower().startswith(prefix.lower()):
            result = result[len(prefix):].strip()
    return result.strip().strip('"').strip()


def generate(name: str, category: str = "", store: str = "") -> str:
    tokenizer, model = load_model()
    return generate_with_model(tokenizer, model, name, category, store)


def serve():
    tokenizer, model = load_model()
    print(json.dumps({"ready": True}, ensure_ascii=False), flush=True)
    for line in sys.stdin:
        if not line.strip():
            continue
        request_id = None
        try:
            data = json.loads(line)
            request_id = data.get("id")
            name = str(data.get("name", "")).strip()
            category = str(data.get("category", "")).strip()
            store = str(data.get("store", "")).strip()
            if not name:
                raise ValueError("Falta el nombre del producto")
            description = generate_with_model(tokenizer, model, name, category, store)
            print(json.dumps({"id": request_id, "description": description}, ensure_ascii=False), flush=True)
        except Exception as exc:
            print(json.dumps({"id": request_id, "error": str(exc)}, ensure_ascii=False), flush=True)


def main():
    if "--server" in sys.argv:
        serve()
        return
    try:
        raw = sys.stdin.read().strip()
        data = json.loads(raw) if raw else {}
        name = str(data.get("name", "")).strip()
        category = str(data.get("category", "")).strip()
        store = str(data.get("store", "")).strip()
        if not name:
            print(json.dumps({"error": "Falta el nombre del producto"}))
            sys.exit(1)
        description = generate(name, category, store)
        print(json.dumps({"description": description}, ensure_ascii=False))
    except Exception as exc:
        print(json.dumps({"error": str(exc)}))
        sys.exit(1)


if __name__ == "__main__":
    main()
