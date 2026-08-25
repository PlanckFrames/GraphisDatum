import { downloadBlob } from "@/lib/utils";
import type { GraphSpec, Sheet } from "./types";
import { renderGraph } from "./render";

export function sheetToCsv(sheet: Sheet) {
  const n = Math.max(0, ...sheet.columns.map((c) => c.values.length));
  const header = sheet.columns.map((c) => csvEscape(`${c.name}${c.unit ? ` (${c.unit})` : ""}`)).join(",");
  const rows = [header];
  for (let i = 0; i < n; i++) {
    rows.push(sheet.columns.map((c) => csvEscape(c.values[i] ?? "")).join(","));
  }
  return rows.join("\n");
}

function csvEscape(v: string | number) {
  const s = String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function parseCsv(text: string): { names: string[]; rows: number[][] } {
  const lines = text.replace(/\r/g, "").split("\n").filter((l) => l.trim().length);
  if (!lines.length) return { names: [], rows: [] };
  const split = (line: string) => {
    const out: string[] = [];
    let cur = "";
    let q = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (q) {
        if (ch === '"' && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else if (ch === '"') q = false;
        else cur += ch;
      } else if (ch === '"') q = true;
      else if (ch === "," || ch === "\t" || ch === ";") {
        out.push(cur);
        cur = "";
      } else cur += ch;
    }
    out.push(cur);
    return out;
  };
  const header = split(lines[0]);
  const numericHeader = header.every((h) => h.trim() === "" || !Number.isNaN(Number(h)));
  const names = numericHeader ? header.map((_, i) => `Col ${i + 1}`) : header.map((h) => h.trim() || "Col");
  const start = numericHeader ? 0 : 1;
  const rows: number[][] = [];
  for (let i = start; i < lines.length; i++) {
    const cells = split(lines[i]);
    rows.push(names.map((_, j) => {
      const n = Number(cells[j]);
      return Number.isFinite(n) ? n : NaN;
    }));
  }
  return { names, rows };
}

export function exportCsv(sheet: Sheet) {
  const csv = sheetToCsv(sheet);
  downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8" }), `${slug(sheet.name)}.csv`);
}

export function snapshotCanvas(source: HTMLCanvasElement, themePaper: string) {
  const out = document.createElement("canvas");
  out.width = source.width;
  out.height = source.height;
  const ctx = out.getContext("2d");
  if (!ctx) return source;
  ctx.fillStyle = themePaper;
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.drawImage(source, 0, 0);
  return out;
}

export function exportRaster(
  canvas: HTMLCanvasElement,
  kind: "png" | "jpg" | "npg",
  name: string,
) {
  const mime = kind === "jpg" ? "image/jpeg" : "image/png";
  const ext = kind === "jpg" ? "jpg" : kind === "npg" ? "npg" : "png";
  const quality = kind === "jpg" ? 0.92 : 0.96;
  canvas.toBlob(
    (blob) => {
      if (blob) downloadBlob(blob, `${slug(name)}.${ext}`);
    },
    mime,
    quality,
  );
}

/** Minimal PDF wrapping a JPEG of the graph (ISO raster page). */
export function exportPdf(canvas: HTMLCanvasElement, name: string) {
  const jpeg = canvasToJpegBytes(canvas, 0.92);
  const iw = canvas.width;
  const ih = canvas.height;
  const w = 792;
  const h = Math.max(1, Math.round((ih / Math.max(1, iw)) * w));
  const pdf = buildJpegPdf(jpeg, w, h, iw, ih);
  downloadBlob(new Blob([pdf], { type: "application/pdf" }), `${slug(name)}.pdf`);
}

function canvasToJpegBytes(canvas: HTMLCanvasElement, q: number) {
  const data = canvas.toDataURL("image/jpeg", q);
  const b64 = data.split(",")[1];
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function buildJpegPdf(jpeg: Uint8Array, pageW: number, pageH: number, imgW: number, imgH: number) {
  const objects: Uint8Array[] = [];
  const add = (s: string | Uint8Array) => {
    objects.push(typeof s === "string" ? te(s) : s);
  };
  add("1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n");
  add("2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n");
  add(
    `3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >> endobj\n`,
  );
  const imgDict = te(
    `4 0 obj << /Type /XObject /Subtype /Image /Width ${imgW} /Height ${imgH} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >> stream\n`,
  );
  const imgEnd = te("\nendstream\nendobj\n");
  add(concat([imgDict, jpeg, imgEnd]));
  const content = `q ${pageW} 0 0 ${pageH} 0 0 cm /Im0 Do Q`;
  add(`5 0 obj << /Length ${content.length} >> stream\n${content}\nendstream\nendobj\n`);

  const body = te("%PDF-1.4\n");
  const offsets = [0];
  const parts: Uint8Array[] = [body];
  let pos = body.length;
  for (const obj of objects) {
    offsets.push(pos);
    parts.push(obj);
    pos += obj.length;
  }
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i++) {
    xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  const xrefU = te(xref);
  const startxref = pos;
  parts.push(xrefU);
  parts.push(
    te(
      `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF\n`,
    ),
  );
  return concat(parts);
}

function te(s: string) {
  return new TextEncoder().encode(s);
}

function concat(parts: Uint8Array[]) {
  const len = parts.reduce((s, p) => s + p.length, 0);
  const out = new Uint8Array(len);
  let o = 0;
  for (const p of parts) {
    out.set(p as unknown as ArrayLike<number>, o);
    o += p.length;
  }
  return out;
}

function slug(s: string) {
  return s.replace(/[^\w.-]+/g, "_").slice(0, 48) || "lumenplot";
}

export function paintForExport(canvas: HTMLCanvasElement, graph: GraphSpec, cols: Parameters<typeof renderGraph>[2]) {
  renderGraph(canvas, graph, cols, null);
  return canvas;
}
