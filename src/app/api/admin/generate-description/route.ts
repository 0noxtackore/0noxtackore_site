import { NextResponse } from "next/server";
import { spawn } from "node:child_process";
import path from "node:path";

export const dynamic = "force-dynamic";

type Body = { name?: string; category?: string; store?: string };

function runPython(input: Body): Promise<{ description?: string; error?: string }> {
  return new Promise((resolve) => {
    const python = path.join(process.cwd(), ".venv", "Scripts", "python.exe");
    const script = path.join(process.cwd(), "scripts", "generate_description.py");
    const child = spawn(python, [script], { cwd: process.cwd(), windowsHide: true });

    let out = "";
    let err = "";
    const timer = setTimeout(() => {
      child.kill();
      resolve({ error: "Tiempo agotado generando descripción. El modelo puede estar descargándose la primera vez." });
    }, 180000);

    child.stdout.on("data", (d) => { out += d.toString(); });
    child.stderr.on("data", (d) => { err += d.toString(); });
    child.on("error", (e) => { clearTimeout(timer); resolve({ error: String(e) }); });
    child.on("close", () => {
      clearTimeout(timer);
      try {
        const line = out.trim().split(/\r?\n/).filter(Boolean).pop() || "{}";
        const json = JSON.parse(line) as { description?: string; error?: string };
        if (json.error) return resolve({ error: json.error });
        if (json.description) return resolve({ description: json.description });
        return resolve({ error: err.trim().slice(0, 500) || "Sin respuesta del modelo" });
      } catch {
        resolve({ error: err.trim().slice(0, 500) || out.trim().slice(0, 500) || "Respuesta inválida del modelo" });
      }
    });

    child.stdin.write(JSON.stringify(input));
    child.stdin.end();
  });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const name = (body.name ?? "").trim();
    if (!name) return NextResponse.json({ error: "Falta el nombre del producto" }, { status: 400 });
    const result = await runPython({ name, category: body.category?.trim() || "", store: body.store?.trim() || "" });
    if (result.error) return NextResponse.json({ error: result.error }, { status: 500 });
    return NextResponse.json({ description: result.description });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
