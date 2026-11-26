import json
import sys

MODEL_ID = "Qwen/Qwen2.5-0.5B-Instruct"


def load_model():
    from transformers import AutoModelForCausalLM, AutoTokenizer
    import torch

    tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
    model = AutoModelForCausalLM.from_pretrained(
        MODEL_ID,
        torch_dtype=torch.float32,
        device_map="cpu",
    )
    return tokenizer, model


def generate(name: str, category: str = "", store: str = "") -> str:
    tokenizer, model = load_model()
    prompt = (
        "Eres un redactor de e-commerce tech. Escribe una descripción corta, clara y útil en español "
        "para un producto. No inventes especificaciones que no estén en el nombre. "
        "Máximo 45 palabras, 1 párrafo, tono profesional y directo.\n\n"
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
    import torch

    with torch.no_grad():
        output = model.generate(
            **inputs,
            max_new_tokens=120,
            do_sample=True,
            temperature=0.7,
            top_p=0.9,
            pad_token_id=tokenizer.eos_token_id,
        )
    generated = output[0][inputs["input_ids"].shape[1]:]
    result = tokenizer.decode(generated, skip_special_tokens=True).strip()
    # clean common prefixes
    for p in ["Descripción:", "Descripcion:", "Description:"]:
        if result.lower().startswith(p.lower()):
            result = result[len(p):].strip()
    return result.strip().strip('"').strip()


def main():
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
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)


if __name__ == "__main__":
    main()
