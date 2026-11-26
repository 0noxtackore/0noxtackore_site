import { NextResponse } from "next/server";
import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import path from "node:path";

export const dynamic = "force-dynamic";

type Body = { name?: string; category?: string; store?: string };
type WorkerResult = { description?: string; error?: string };
type Pending = {
  resolve: (value: WorkerResult) => void;
  reject: (reason?: unknown) => void;
  timer: NodeJS.Timeout;
};

let worker: ChildProcessWithoutNullStreams | null = null;
let stdoutBuffer = "";
let lastStderr = "";
let requestSeq = 0;
let queue: Promise<void> = Promise.resolve();
const pending = new Map<string, Pending>();

function rejectPending(message: string) {
  for (const [id, p] of pending) {
    clearTimeout(p.timer);
    p.reject(new Error(message));
    pending.delete(id);
  }
}

function handleLine(line: string) {
  if (!line.trim()) return;
  try {
    const json = JSON.parse(line) as WorkerResult & { id?: string | null; ready?: boolean };
    if (json.ready) return;
    const id = json.id == null ? "" : String(json.id);
    const p = pending.get(id);
    if (!p) return;
    clearTimeout(p.timer);
    pending.delete(id);
    p.resolve({ description: json.description, error: json.error });
  } catch {
    // Líneas no JSON (logs) se ignoran; Qwen imprime respuestas JSON en stdout.
  }
}

function getWorker() {
  if (worker && !worker.killed) return worker;

  const python = path.join(process.cwd(), ".venv", "Scripts", "python.exe");
  const script = path.join(process.cwd(), "scripts", "generate_description.py");
  const child = spawn(python, [script, "--server"], { cwd: process.cwd(), windowsHide: true });
  worker = child;
  stdoutBuffer = "";
  lastStderr = "";

  child.stdout.on("data", (d) => {
    stdoutBuffer += d.toString();
    let idx: number;
    while ((idx = stdoutBuffer.indexOf("\n")) >= 0) {
      const line = stdoutBuffer.slice(0, idx);
      stdoutBuffer = stdoutBuffer.slice(idx + 1);
      handleLine(line.replace(/\r$/, ""));
    }
  });

  child.stderr.on("data", (d) => { lastStderr = `${lastStderr}${d.toString()}`.slice(-1000); });
  child.on("error", (err) => {
    rejectPending(String(err));
    worker = null;
  });
  child.on("close", () => {
    rejectPending(lastStderr.trim() || "Worker Qwen cerrado");
    worker = null;
  });

  return child;
}

function requestGenerate(input: Body & { name: string }): Promise<WorkerResult> {
  const child = getWorker();
  const id = String(++requestSeq);

  return new Promise<WorkerResult>((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(id);
      child.kill();
      reject(new Error("Tiempo agotado generando descripción. El modelo puede estar descargándose la primera vez."));
    }, 180000);

    pending.set(id, { resolve, reject, timer });
    child.stdin.write(JSON.stringify({ id, ...input }) + "\n");
  });
}

function queuedGenerate(input: Body & { name: string }): Promise<WorkerResult> {
  const run = queue.then(() => requestGenerate(input));
  queue = run.then(() => undefined, () => undefined);
  return run;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const name = (body.name ?? "").trim();
    if (!name) return NextResponse.json({ error: "Falta el nombre del producto" }, { status: 400 });

    const result = await queuedGenerate({
      name,
      category: body.category?.trim() || "",
      store: body.store?.trim() || "",
    });

    if (result.error) return NextResponse.json({ error: result.error }, { status: 500 });
    return NextResponse.json({ description: result.description });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
