#!/usr/bin/env python3
"""CrewAI + Ollama product pipeline for 0NOXTACKORE.
Replaces the previous opencode/freellmapi pipeline.
Outputs tmp/products/polished.json in the same format expected by scripts/import-drafts.mjs.
"""
from __future__ import annotations

import json
import os
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TMP = ROOT / "tmp" / "products"
POLISHED = TMP / "polished.json"

MODEL = os.getenv("OLLAMA_MODEL", "ollama/llama3.2:1b")
BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")


def log(msg: str) -> None:
    print(f"[crewai-pipeline] {msg}", flush=True)


def ensure_dirs() -> None:
    TMP.mkdir(parents=True, exist_ok=True)


def load_json(path: Path, default):
    if not path.exists():
        return default
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return default


def save_json(path: Path, data) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def build_crew():
    from crewai import Agent, Crew, LLM, Process, Task

    llm = LLM(model=MODEL, base_url=BASE_URL, temperature=0.4)

    scout = Agent(
        role="Product Scout",
        goal="Find real, attractive tech products for an affiliate store (Amazon or AliExpress).",
        backstory="You research useful tech products for creators, gamers, and professionals in LATAM.",
        llm=llm,
        verbose=False,
        allow_delegation=False,
    )
    marketer = Agent(
        role="Affiliate Marketing Copywriter",
        goal="Turn raw product ideas into clear bilingual ES/EN drafts ready for Firestore import.",
        backstory="You write honest, concise, conversion-focused affiliate copy. No fake claims.",
        llm=llm,
        verbose=False,
        allow_delegation=False,
    )

    scout_task = Task(
        description=(
            "Generate 5 real tech product ideas for 0NOXTACKORE (affiliate store, LATAM audience). "
            "Mix categories like Gaming, Accesorios, PC & Componentes. "
            "For each product include: store (Amazon or AliExpress), name, category, affiliateUrl (realistic URL), "
            "imageUrl (empty string if unknown), priceNoteEs, priceNoteEn, short descriptionEs, descriptionEn. "
            "Return ONLY valid JSON array."
        ),
        expected_output="JSON array of 5 product objects.",
        agent=scout,
    )
    market_task = Task(
        description=(
            "Take the scouted products and produce polished drafts for import. "
            "Return ONLY valid JSON object with key 'items' containing objects with exact keys: "
            "active (false), store, category, affiliateUrl, imageUrl, imageSource ('affiliate'), "
            "priceNoteEs, priceNoteEn, nameEs, nameEn, hookEs, hookEn, descriptionEs, descriptionEn, "
            "badgeEs, badgeEn. Keep descriptions honest, 1-2 sentences. No markdown, no extra text."
        ),
        expected_output="JSON object: {\"items\": [...]} matching import-drafts.mjs format.",
        agent=marketer,
        context=[scout_task],
    )

    crew = Crew(agents=[scout, marketer], tasks=[scout_task, market_task], process=Process.sequential, verbose=False)
    return crew


def extract_json(text: str):
    text = text.strip()
    if not text:
        raise ValueError("empty output")
    try:
        return json.loads(text)
    except Exception:
        pass
    # try to find JSON object/array
    for start_char, end_char in [("{", "}"), ("[", "]")]:
        s = text.find(start_char)
        e = text.rfind(end_char)
        if s != -1 and e != -1 and e > s:
            try:
                return json.loads(text[s : e + 1])
            except Exception:
                continue
    raise ValueError("no valid JSON found in model output")


def normalize_items(data) -> list[dict]:
    if isinstance(data, dict) and isinstance(data.get("items"), list):
        items = data["items"]
    elif isinstance(data, list):
        items = data
    else:
        items = []
    out = []
    now = datetime.now(timezone.utc).isoformat()
    for it in items:
        if not isinstance(it, dict):
            continue
        store = str(it.get("store", "Amazon")).strip()
        if store not in ("Amazon", "AliExpress"):
            store = "Amazon"
        name_es = str(it.get("nameEs") or it.get("name") or "").strip()
        name_en = str(it.get("nameEn") or it.get("name") or name_es).strip()
        if not name_es or not name_en:
            continue
        affiliate = str(it.get("affiliateUrl") or it.get("url") or "").strip()
        if not affiliate.startswith("http"):
            continue
        out.append({
            "active": False,
            "store": store,
            "category": str(it.get("category") or "Accesorios").strip(),
            "affiliateUrl": affiliate,
            "imageUrl": str(it.get("imageUrl") or it.get("image") or "").strip(),
            "imageSource": "affiliate",
            "priceNoteEs": str(it.get("priceNoteEs") or ("Precio en Amazon" if store == "Amazon" else "Precio en AliExpress")).strip(),
            "priceNoteEn": str(it.get("priceNoteEn") or ("Price on Amazon" if store == "Amazon" else "Price on AliExpress")).strip(),
            "nameEs": name_es,
            "nameEn": name_en,
            "descriptionEs": str(it.get("descriptionEs") or it.get("hookEs") or name_es).strip(),
            "descriptionEn": str(it.get("descriptionEn") or it.get("hookEn") or name_en).strip(),
            "badgeEs": str(it.get("badgeEs") or "").strip(),
            "badgeEn": str(it.get("badgeEn") or "").strip(),
            "createdAt": now,
            "updatedAt": now,
        })
    return out


def run_import() -> int:
    cmd = ["node", str(ROOT / "scripts" / "import-drafts.mjs")]
    log("running importer: " + " ".join(cmd))
    r = subprocess.run(cmd, cwd=str(ROOT), shell=False)
    return r.returncode


def main() -> int:
    ensure_dirs()
    log(f"model={MODEL} base_url={BASE_URL}")
    try:
        crew = build_crew()
        log("starting crew...")
        result = crew.kickoff()
        raw = str(result)
        data = extract_json(raw)
    except Exception as e:
        log(f"crew failed: {e}")
        log("writing empty polished.json so pipeline can report failure cleanly")
        save_json(POLISHED, {"items": [], "error": str(e), "generatedAt": datetime.now(timezone.utc).isoformat()})
        return 1

    items = normalize_items(data)
    save_json(POLISHED, {"items": items, "generatedAt": datetime.now(timezone.utc).isoformat(), "source": "crewai+ollama"})
    log(f"wrote {len(items)} items to {POLISHED}")

    if not items:
        log("no valid items generated; skipping import")
        return 1

    rc = run_import()
    log(f"import finished rc={rc}")
    return rc


if __name__ == "__main__":
    raise SystemExit(main())
