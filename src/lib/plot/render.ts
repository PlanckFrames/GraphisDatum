import type { Column, GraphSpec, GraphTheme, SeriesStyle } from "./types";
import { PALETTE } from "./types";
import { nums, ticks } from "./math";
import { alignedXY } from "./analysis";

export interface HoverInfo {
  x: number;
  y: number;
  label: string;
  px: number;
  py: number;
}

const THEMES: Record<
  GraphTheme,
  { paper: string; ink: string; grid: string; frame: string; muted: string }
> = {
  publication: {
    paper: "#f7f4ec",
    ink: "#1c2128",
    grid: "rgba(28,33,40,0.10)",
    frame: "#1c2128",
    muted: "#5c6370",
  },
  night: {
    paper: "#10151b",
    ink: "#e6ebe8",
    grid: "rgba(230,235,232,0.08)",
    frame: "#9eb0c4",
    muted: "#8d9399",
  },
  journal: {
    paper: "#ffffff",
    ink: "#111111",
    grid: "rgba(0,0,0,0.08)",
    frame: "#111111",
    muted: "#555555",
  },
};

function styleFor(g: GraphSpec, colId: string, i: number): SeriesStyle {
  return (
    g.series[colId] ?? {
      color: PALETTE[i % PALETTE.length],
      symbol: "circle",
      lineWidth: 1.6,
      lineStyle: "solid",
      fillOpacity: 0.18,
    }
  );
}

function mapLin(v: number, a: number, b: number, A: number, B: number) {
  if (b === a) return (A + B) / 2;
  return A + ((v - a) / (b - a)) * (B - A);
}

function mapX(v: number, min: number, max: number, L: number, R: number, log: boolean) {
  if (log) {
    const a = Math.log10(Math.max(1e-12, min));
    const b = Math.log10(Math.max(1e-12, max));
    return mapLin(Math.log10(Math.max(1e-12, v)), a, b, L, R);
  }
  return mapLin(v, min, max, L, R);
}

function mapY(v: number, min: number, max: number, T: number, B: number, log: boolean) {
  if (log) {
    const a = Math.log10(Math.max(1e-12, min));
    const b = Math.log10(Math.max(1e-12, max));
    return mapLin(Math.log10(Math.max(1e-12, v)), a, b, B, T);
  }
  return mapLin(v, min, max, B, T);
}

function dash(ctx: CanvasRenderingContext2D, style: SeriesStyle["lineStyle"]) {
  if (style === "dash") ctx.setLineDash([6, 4]);
  else if (style === "dot") ctx.setLineDash([1.5, 3.5]);
  else ctx.setLineDash([]);
}

function symbol(
  ctx: CanvasRenderingContext2D,
  kind: SeriesStyle["symbol"],
  x: number,
  y: number,
  r: number,
  color: string,
) {
  if (kind === "none") return;
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  if (kind === "circle") {
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  } else if (kind === "square") {
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  } else if (kind === "triangle") {
    ctx.moveTo(x, y - r);
    ctx.lineTo(x + r, y + r);
    ctx.lineTo(x - r, y + r);
    ctx.closePath();
    ctx.fill();
  } else if (kind === "diamond") {
    ctx.moveTo(x, y - r);
    ctx.lineTo(x + r, y);
    ctx.lineTo(x, y + r);
    ctx.lineTo(x - r, y);
    ctx.closePath();
    ctx.fill();
  } else if (kind === "cross") {
    ctx.moveTo(x - r, y - r);
    ctx.lineTo(x + r, y + r);
    ctx.moveTo(x + r, y - r);
    ctx.lineTo(x - r, y + r);
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }
}

export function dataBounds(g: GraphSpec, cols: Column[]) {
  const xCol = cols.find((c) => c.id === g.xColId);
  const ys = cols.filter((c) => g.yColIds.includes(c.id));
  let xmin = Infinity;
  let xmax = -Infinity;
  let ymin = Infinity;
  let ymax = -Infinity;
  for (const y of ys) {
    const { x, y: yy } = alignedXY(xCol, y);
    for (let i = 0; i < x.length; i++) {
      xmin = Math.min(xmin, x[i]);
      xmax = Math.max(xmax, x[i]);
      ymin = Math.min(ymin, yy[i]);
      ymax = Math.max(ymax, yy[i]);
    }
  }
  if (!Number.isFinite(xmin)) {
    xmin = 0;
    xmax = 1;
    ymin = 0;
    ymax = 1;
  }
  if (xmin === xmax) {
    xmin -= 1;
    xmax += 1;
  }
  if (ymin === ymax) {
    ymin -= 1;
    ymax += 1;
  }
  const dx = (xmax - xmin) * 0.04;
  const dy = (ymax - ymin) * 0.08;
  return { xmin: xmin - dx, xmax: xmax + dx, ymin: ymin - dy, ymax: ymax + dy };
}

export function renderGraph(
  canvas: HTMLCanvasElement,
  g: GraphSpec,
  cols: Column[],
  hoverPx?: { x: number; y: number } | null,
): HoverInfo | null {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  if (w < 8 || h < 8) return null;
  if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const th = THEMES[g.theme];
  ctx.fillStyle = th.paper;
  ctx.fillRect(0, 0, w, h);

  const panels = g.panels;
  const rows = panels === 4 ? 2 : 1;
  const colsN = panels === 1 ? 1 : 2;
  const ySets = g.yColIds.length ? g.yColIds : [];
  let hover: HoverInfo | null = null;

  for (let p = 0; p < panels; p++) {
    const pr = Math.floor(p / colsN);
    const pc = p % colsN;
    const pw = w / colsN;
    const ph = h / rows;
    const ox = pc * pw;
    const oy = pr * ph;
    const yIds =
      panels === 1 ? ySets : ySets.length ? [ySets[p % ySets.length]] : [];
    const local: GraphSpec = { ...g, yColIds: yIds.length ? yIds : g.yColIds };
    const hov = drawPanel(ctx, local, cols, ox, oy, pw, ph, th, hoverPx);
    if (hov) hover = hov;
  }
  return hover;
}

function drawPanel(
  ctx: CanvasRenderingContext2D,
  g: GraphSpec,
  cols: Column[],
  ox: number,
  oy: number,
  w: number,
  h: number,
  th: (typeof THEMES)[GraphTheme],
  hoverPx?: { x: number; y: number } | null,
): HoverInfo | null {
  const m = { l: 58, r: 18, t: 36, b: 46 };
  const L = ox + m.l;
  const R = ox + w - m.r;
  const T = oy + m.t;
  const B = oy + h - m.b;
  const bounds = dataBounds(g, cols);
  const xmin = g.autoX ? bounds.xmin : g.xMin;
  const xmax = g.autoX ? bounds.xmax : g.xMax;
  const ymin = g.autoY ? bounds.ymin : g.yMin;
  const ymax = g.autoY ? bounds.ymax : g.yMax;

  ctx.fillStyle = th.ink;
  ctx.font = "600 13px 'IBM Plex Sans', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(g.title || "Untitled graph", (L + R) / 2, oy + 18);

  if (g.type === "pie") return drawPie(ctx, g, cols, L, T, R, B, th);
  if (g.type === "polar" || g.type === "radar") return drawPolar(ctx, g, cols, L, T, R, B, th);
  if (g.type === "ternary") return drawTernary(ctx, g, cols, L, T, R, B, th);
  if (g.type === "surface3d" || g.type === "scatter3d" || g.type === "heatmap" || g.type === "contour")
    return drawField(ctx, g, cols, L, T, R, B, th);

  const xt = ticks(xmin, xmax, 6);
  const yt = ticks(ymin, ymax, 6);
  if (g.showGrid) {
    ctx.strokeStyle = th.grid;
    ctx.lineWidth = 1;
    for (const v of xt.ticks) {
      const px = mapX(v, xmin, xmax, L, R, g.logX);
      ctx.beginPath();
      ctx.moveTo(px, T);
      ctx.lineTo(px, B);
      ctx.stroke();
    }
    for (const v of yt.ticks) {
      const py = mapY(v, ymin, ymax, T, B, g.logY);
      ctx.beginPath();
      ctx.moveTo(L, py);
      ctx.lineTo(R, py);
      ctx.stroke();
    }
  }
  ctx.strokeStyle = th.frame;
  ctx.lineWidth = 1.2;
  ctx.strokeRect(L, T, R - L, B - T);

  ctx.fillStyle = th.muted;
  ctx.font = "11px 'IBM Plex Sans', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  for (const v of xt.ticks) {
    const px = mapX(v, xmin, xmax, L, R, g.logX);
    ctx.fillText(formatTick(v), px, B + 6);
  }
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (const v of yt.ticks) {
    const py = mapY(v, ymin, ymax, T, B, g.logY);
    ctx.fillText(formatTick(v), L - 6, py);
  }
  ctx.fillStyle = th.ink;
  ctx.font = "12px 'IBM Plex Sans', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(g.xLabel || "X", (L + R) / 2, oy + h - 10);
  ctx.save();
  ctx.translate(ox + 14, (T + B) / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(g.yLabel || "Y", 0, 0);
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.rect(L, T, R - L, B - T);
  ctx.clip();

  const xCol = cols.find((c) => c.id === g.xColId);
  const yCols = cols.filter((c) => g.yColIds.includes(c.id));
  const hoverBox: { v: HoverInfo | null } = { v: null };

  if (g.type === "histogram") {
    yCols.forEach((yc, i) => {
      const st = styleFor(g, yc.id, i);
      const vals = nums(yc.values);
      const bins = 18;
      const lo = Math.min(...vals);
      const hi = Math.max(...vals);
      const counts = Array(bins).fill(0);
      vals.forEach((v) => {
        const bi = Math.min(bins - 1, Math.floor(((v - lo) / (hi - lo || 1)) * bins));
        counts[bi]++;
      });
      const maxc = Math.max(...counts, 1);
      const bw = (R - L) / bins;
      counts.forEach((c, bi) => {
        const x = L + bi * bw;
        const bh = (c / maxc) * (B - T) * 0.92;
        ctx.fillStyle = st.color;
        ctx.globalAlpha = 0.85;
        ctx.fillRect(x + 1, B - bh, bw - 2, bh);
        ctx.globalAlpha = 1;
      });
    });
  } else if (g.type === "box" || g.type === "violin") {
    yCols.forEach((yc, i) => {
      const st = styleFor(g, yc.id, i);
      const vals = nums(yc.values).sort((a, b) => a - b);
      if (!vals.length) return;
      const q1 = quantileLocal(vals, 0.25);
      const q2 = quantileLocal(vals, 0.5);
      const q3 = quantileLocal(vals, 0.75);
      const slot = (R - L) / (yCols.length + 1);
      const cx = L + slot * (i + 1);
      const boxW = Math.min(42, slot * 0.45);
      const yq1 = mapY(q1, ymin, ymax, T, B, g.logY);
      const yq2 = mapY(q2, ymin, ymax, T, B, g.logY);
      const yq3 = mapY(q3, ymin, ymax, T, B, g.logY);
      const yw = mapY(vals[0], ymin, ymax, T, B, g.logY);
      const yh = mapY(vals.at(-1)!, ymin, ymax, T, B, g.logY);
      ctx.strokeStyle = st.color;
      ctx.fillStyle = st.color;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(cx, yw);
      ctx.lineTo(cx, yh);
      ctx.stroke();
      ctx.globalAlpha = 0.25;
      ctx.fillRect(cx - boxW / 2, yq3, boxW, yq1 - yq3);
      ctx.globalAlpha = 1;
      ctx.strokeRect(cx - boxW / 2, yq3, boxW, yq1 - yq3);
      ctx.beginPath();
      ctx.moveTo(cx - boxW / 2, yq2);
      ctx.lineTo(cx + boxW / 2, yq2);
      ctx.stroke();
      if (g.type === "violin") {
        ctx.globalAlpha = 0.2;
        ctx.beginPath();
        ctx.ellipse(cx, (yq1 + yq3) / 2, boxW * 0.7, Math.abs(yq1 - yq3) * 0.9, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    });
  } else if (g.type === "column" || g.type === "stackedColumn" || g.type === "waterfall") {
    const cats = xCol ? nums(xCol.values) : yCols[0] ? yCols[0].values.map((_, i) => i + 1) : [];
    const n = cats.length;
    const groupW = (R - L) / Math.max(1, n);
    for (let i = 0; i < n; i++) {
      let acc = 0;
      yCols.forEach((yc, si) => {
        const st = styleFor(g, yc.id, si);
        const v = Number(yc.values[i] ?? 0);
        const base = g.type === "stackedColumn" || g.type === "waterfall" ? acc : 0;
        const y0 = mapY(base, ymin, ymax, T, B, false);
        const y1 = mapY(base + v, ymin, ymax, T, B, false);
        const bw = g.type === "column" ? groupW / (yCols.length + 0.4) : groupW * 0.62;
        const x0 =
          L +
          i * groupW +
          (g.type === "column" ? si * bw + groupW * 0.15 : groupW * 0.19);
        ctx.fillStyle = st.color;
        ctx.globalAlpha = 0.88;
        ctx.fillRect(x0, Math.min(y0, y1), bw * 0.9, Math.abs(y1 - y0));
        ctx.globalAlpha = 1;
        if (g.type === "stackedColumn" || g.type === "waterfall") acc += v;
      });
    }
  } else {
    yCols.forEach((yc, i) => {
      const st = styleFor(g, yc.id, i);
      const { x, y } = alignedXY(xCol, yc);
      const errCol = g.yErrColId ? cols.find((c) => c.id === g.yErrColId) : undefined;
      ctx.strokeStyle = st.color;
      ctx.fillStyle = st.color;
      ctx.lineWidth = st.lineWidth;
      dash(ctx, st.lineStyle);
      if (g.type === "area") {
        ctx.beginPath();
        x.forEach((xi, k) => {
          const px = mapX(xi, xmin, xmax, L, R, g.logX);
          const py = mapY(y[k], ymin, ymax, T, B, g.logY);
          if (k === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.lineTo(mapX(x.at(-1) ?? 0, xmin, xmax, L, R, g.logX), B);
        ctx.lineTo(mapX(x[0] ?? 0, xmin, xmax, L, R, g.logX), B);
        ctx.closePath();
        ctx.globalAlpha = st.fillOpacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      if (g.type === "line" || g.type === "lineSymbol" || g.type === "step" || g.type === "area" || g.type === "density") {
        ctx.beginPath();
        x.forEach((xi, k) => {
          const px = mapX(xi, xmin, xmax, L, R, g.logX);
          const py = mapY(y[k], ymin, ymax, T, B, g.logY);
          if (g.type === "step" && k) {
            const px0 = mapX(x[k - 1], xmin, xmax, L, R, g.logX);
            ctx.lineTo(px, mapY(y[k - 1], ymin, ymax, T, B, g.logY));
            ctx.lineTo(px, py);
            void px0;
          } else if (k === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.stroke();
      }
      ctx.setLineDash([]);
      x.forEach((xi, k) => {
        const px = mapX(xi, xmin, xmax, L, R, g.logX);
        const py = mapY(y[k], ymin, ymax, T, B, g.logY);
        if (errCol && isFiniteNum(errCol.values[k])) {
          const e = Number(errCol.values[k]);
          const y0 = mapY(y[k] - e, ymin, ymax, T, B, g.logY);
          const y1 = mapY(y[k] + e, ymin, ymax, T, B, g.logY);
          ctx.beginPath();
          ctx.moveTo(px, y0);
          ctx.lineTo(px, y1);
          ctx.moveTo(px - 4, y0);
          ctx.lineTo(px + 4, y0);
          ctx.moveTo(px - 4, y1);
          ctx.lineTo(px + 4, y1);
          ctx.stroke();
        }
        if (
          g.type === "scatter" ||
          g.type === "lineSymbol" ||
          g.type === "errorBar" ||
          g.type === "density" ||
          g.type === "residual"
        ) {
          const r = g.type === "density" ? 2.2 : 3.1;
          symbol(ctx, st.symbol === "none" ? "circle" : st.symbol, px, py, r, st.color);
        }
        if (hoverPx) {
          const d = Math.hypot(hoverPx.x - px, hoverPx.y - py);
          if (d < 10) {
            hoverBox.v = { x: xi, y: y[k], label: yc.name, px, py };
          }
        }
      });
    });
  }

  if (g.fitOverlay && g.fitOverlay.x.length) {
    ctx.strokeStyle = "#c47a4a";
    ctx.lineWidth = 1.8;
    ctx.setLineDash([]);
    ctx.beginPath();
    const xs = linspace(g.fitOverlay.x[0], g.fitOverlay.x.at(-1)!, 200);
    const model = g.fitOverlay;
    xs.forEach((xi, k) => {
      const yi = interpFit(model, xi);
      const px = mapX(xi, xmin, xmax, L, R, g.logX);
      const py = mapY(yi, ymin, ymax, T, B, g.logY);
      if (k === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();
  }

  if (g.roi && (g.gadget === "fit" || g.gadget === "integrate" || g.gadget === "peaks")) {
    const x0 = mapX(g.roi.x0, xmin, xmax, L, R, g.logX);
    const x1 = mapX(g.roi.x1, xmin, xmax, L, R, g.logX);
    ctx.fillStyle = "rgba(158,176,196,0.16)";
    ctx.fillRect(Math.min(x0, x1), T, Math.abs(x1 - x0), B - T);
    ctx.strokeStyle = "rgba(158,176,196,0.7)";
    ctx.strokeRect(Math.min(x0, x1), T, Math.abs(x1 - x0), B - T);
  }

  if (g.gadget === "cursor" && hoverPx && hoverPx.x >= L && hoverPx.x <= R) {
    ctx.strokeStyle = th.muted;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(hoverPx.x, T);
    ctx.lineTo(hoverPx.x, B);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  ctx.restore();

  if (g.showLegend && yCols.length) {
    let lx = L + 8;
    const ly = T + 12;
    ctx.font = "11px 'IBM Plex Sans', sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    yCols.forEach((yc, i) => {
      const st = styleFor(g, yc.id, i);
      ctx.fillStyle = st.color;
      ctx.fillRect(lx, ly - 4, 12, 8);
      ctx.fillStyle = th.ink;
      ctx.fillText(yc.name, lx + 16, ly);
      lx += ctx.measureText(yc.name).width + 36;
    });
  }

  if (hoverBox.v) {
    const hover = hoverBox.v;
    const boxW = 128;
    const bx = Math.min(R - boxW - 4, hover.px + 12);
    const by = Math.max(T + 4, hover.py - 36);
    ctx.fillStyle = g.theme === "night" ? "rgba(16,21,27,0.92)" : "rgba(247,244,236,0.94)";
    ctx.strokeStyle = th.frame;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(bx, by, boxW, 40, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = th.ink;
    ctx.font = "11px 'IBM Plex Mono', monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(hover.label, bx + 8, by + 6);
    ctx.fillText(`x ${formatTick(hover.x)}   y ${formatTick(hover.y)}`, bx + 8, by + 22);
  }

  return hoverBox.v;
}

function drawPie(
  ctx: CanvasRenderingContext2D,
  g: GraphSpec,
  cols: Column[],
  L: number,
  T: number,
  R: number,
  B: number,
  th: (typeof THEMES)[GraphTheme],
): HoverInfo | null {
  const yc = cols.find((c) => g.yColIds.includes(c.id));
  if (!yc) return null;
  const vals = nums(yc.values).map((v) => Math.abs(v));
  const sum = vals.reduce((s, v) => s + v, 0) || 1;
  const cx = (L + R) / 2;
  const cy = (T + B) / 2;
  const r = Math.min(R - L, B - T) * 0.36;
  let a = -Math.PI / 2;
  vals.forEach((v, i) => {
    const da = (v / sum) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, a, a + da);
    ctx.closePath();
    ctx.fillStyle = PALETTE[i % PALETTE.length];
    ctx.fill();
    a += da;
  });
  ctx.fillStyle = th.ink;
  ctx.font = "12px 'IBM Plex Sans', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(yc.name, cx, B - 8);
  return null;
}

function drawPolar(
  ctx: CanvasRenderingContext2D,
  g: GraphSpec,
  cols: Column[],
  L: number,
  T: number,
  R: number,
  B: number,
  th: (typeof THEMES)[GraphTheme],
): HoverInfo | null {
  const cx = (L + R) / 2;
  const cy = (T + B) / 2;
  const r = Math.min(R - L, B - T) * 0.38;
  ctx.strokeStyle = th.grid;
  for (let i = 1; i <= 4; i++) {
    ctx.beginPath();
    ctx.arc(cx, cy, (r * i) / 4, 0, Math.PI * 2);
    ctx.stroke();
  }
  for (let k = 0; k < 8; k++) {
    const a = (k * Math.PI) / 4;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
    ctx.stroke();
  }
  const xCol = cols.find((c) => c.id === g.xColId);
  const yCol = cols.find((c) => c.id === g.yColIds[0]);
  if (!xCol || !yCol) return null;
  const { x, y } = alignedXY(xCol, yCol);
  const rmax = Math.max(...y.map(Math.abs), 1e-6);
  ctx.strokeStyle = PALETTE[0];
  ctx.beginPath();
  x.forEach((tht, i) => {
    const rr = (Math.abs(y[i]) / rmax) * r;
    const px = cx + rr * Math.cos(tht);
    const py = cy + rr * Math.sin(tht);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  ctx.stroke();
  ctx.strokeStyle = th.frame;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  return null;
}

function drawTernary(
  ctx: CanvasRenderingContext2D,
  g: GraphSpec,
  cols: Column[],
  L: number,
  T: number,
  R: number,
  B: number,
  th: (typeof THEMES)[GraphTheme],
): HoverInfo | null {
  const ax = (L + R) / 2;
  const ay = T + 16;
  const bx = L + 24;
  const by = B - 12;
  const cx = R - 24;
  const cy = B - 12;
  ctx.strokeStyle = th.frame;
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(bx, by);
  ctx.lineTo(cx, cy);
  ctx.closePath();
  ctx.stroke();
  const A = cols.find((c) => c.id === g.xColId);
  const Yc = cols.find((c) => c.id === g.yColIds[0]);
  const Zc = cols.find((c) => c.id === g.zColId) ?? cols.find((c) => c.designation === "Z");
  if (!A || !Yc || !Zc) {
    ctx.fillStyle = th.muted;
    ctx.font = "12px 'IBM Plex Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Assign X, Y, and Z (A, B, C fractions)", (L + R) / 2, (T + B) / 2);
    return null;
  }
  ctx.fillStyle = PALETTE[1];
  const n = Math.min(A.values.length, Yc.values.length, Zc.values.length);
  for (let i = 0; i < n; i++) {
    const a = Number(A.values[i]);
    const b = Number(Yc.values[i]);
    const c = Number(Zc.values[i]);
    if (![a, b, c].every(Number.isFinite)) continue;
    const s = a + b + c || 1;
    const px = (a / s) * ax + (b / s) * bx + (c / s) * cx;
    const py = (a / s) * ay + (b / s) * by + (c / s) * cy;
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  return null;
}

function drawField(
  ctx: CanvasRenderingContext2D,
  g: GraphSpec,
  cols: Column[],
  L: number,
  T: number,
  R: number,
  B: number,
  th: (typeof THEMES)[GraphTheme],
): HoverInfo | null {
  const xCol = cols.find((c) => c.id === g.xColId);
  const yCol = cols.find((c) => c.id === g.yColIds[0]);
  const zCol = cols.find((c) => c.id === g.zColId) ?? cols.find((c) => c.designation === "Z");
  if (!xCol || !yCol || !zCol) {
    ctx.fillStyle = th.muted;
    ctx.font = "12px 'IBM Plex Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Need X, Y, and Z columns", (L + R) / 2, (T + B) / 2);
    return null;
  }
  const n = Math.min(xCol.values.length, yCol.values.length, zCol.values.length);
  const pts: { x: number; y: number; z: number }[] = [];
  for (let i = 0; i < n; i++) {
    const x = xCol.values[i];
    const y = yCol.values[i];
    const z = zCol.values[i];
    if (typeof x === "number" && typeof y === "number" && typeof z === "number") pts.push({ x, y, z });
  }
  if (!pts.length) return null;
  const xmin = Math.min(...pts.map((p) => p.x));
  const xmax = Math.max(...pts.map((p) => p.x));
  const ymin = Math.min(...pts.map((p) => p.y));
  const ymax = Math.max(...pts.map((p) => p.y));
  const zmin = Math.min(...pts.map((p) => p.z));
  const zmax = Math.max(...pts.map((p) => p.z));

  if (g.type === "heatmap" || g.type === "contour") {
    const size = 4;
    pts.forEach((p) => {
      const px = mapLin(p.x, xmin, xmax, L, R);
      const py = mapLin(p.y, ymin, ymax, B, T);
      const t = (p.z - zmin) / (zmax - zmin || 1);
      ctx.fillStyle = heat(t);
      ctx.fillRect(px - size / 2, py - size / 2, size + 1, size + 1);
    });
    if (g.type === "contour") {
      ctx.strokeStyle = th.ink;
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 0.8;
      for (let k = 1; k <= 5; k++) {
        const level = zmin + (k / 6) * (zmax - zmin);
        ctx.beginPath();
        let started = false;
        pts.forEach((p) => {
          if (Math.abs(p.z - level) < (zmax - zmin) * 0.03) {
            const px = mapLin(p.x, xmin, xmax, L, R);
            const py = mapLin(p.y, ymin, ymax, B, T);
            if (!started) {
              ctx.moveTo(px, py);
              started = true;
            } else ctx.lineTo(px, py);
          }
        });
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
    drawColorbar(ctx, R - 10, T, B, zmin, zmax, th);
    return null;
  }

  const rx = (g.rotX * Math.PI) / 180;
  const rz = (g.rotZ * Math.PI) / 180;
  const project = (p: { x: number; y: number; z: number }) => {
    const nx = ((p.x - xmin) / (xmax - xmin || 1)) * 2 - 1;
    const ny = ((p.y - ymin) / (ymax - ymin || 1)) * 2 - 1;
    const nz = ((p.z - zmin) / (zmax - zmin || 1)) * 2 - 1;
    const x1 = nx * Math.cos(rz) - ny * Math.sin(rz);
    const y1 = nx * Math.sin(rz) + ny * Math.cos(rz);
    const y2 = y1 * Math.cos(rx) - nz * Math.sin(rx);
    const z2 = y1 * Math.sin(rx) + nz * Math.cos(rx);
    const cx = (L + R) / 2;
    const cy = (T + B) / 2;
    const s = Math.min(R - L, B - T) * 0.38;
    return { px: cx + x1 * s, py: cy + y2 * s, depth: z2, z: p.z };
  };
  const proj = pts.map(project).sort((a, b) => a.depth - b.depth);
  proj.forEach((p) => {
    const t = (p.z - zmin) / (zmax - zmin || 1);
    ctx.fillStyle = heat(t);
    ctx.beginPath();
    ctx.arc(p.px, p.py, g.type === "surface3d" ? 3.4 : 2.6, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = th.muted;
  ctx.font = "11px 'IBM Plex Sans', sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`rot X ${g.rotX}°  Z ${g.rotZ}°`, L, B + 18);
  return null;
}

function heat(t: number) {
  const u = Math.min(1, Math.max(0, t));
  const r = Math.round(30 + 180 * u);
  const g = Math.round(60 + 80 * (1 - Math.abs(u - 0.5) * 2));
  const b = Math.round(140 - 90 * u);
  return `rgb(${r},${g},${b})`;
}

function drawColorbar(
  ctx: CanvasRenderingContext2D,
  x: number,
  T: number,
  B: number,
  zmin: number,
  zmax: number,
  th: (typeof THEMES)[GraphTheme],
) {
  const h = B - T;
  for (let i = 0; i < h; i++) {
    ctx.fillStyle = heat(1 - i / h);
    ctx.fillRect(x, T + i, 8, 1);
  }
  ctx.fillStyle = th.muted;
  ctx.font = "10px 'IBM Plex Mono', monospace";
  ctx.textAlign = "right";
  ctx.fillText(formatTick(zmax), x - 4, T + 8);
  ctx.fillText(formatTick(zmin), x - 4, B);
}

function formatTick(v: number) {
  if (!Number.isFinite(v)) return "";
  const a = Math.abs(v);
  if (a !== 0 && (a < 0.01 || a >= 10000)) return v.toExponential(1);
  return String(Number(v.toPrecision(4)));
}

function quantileLocal(s: number[], q: number) {
  const pos = (s.length - 1) * q;
  const b = Math.floor(pos);
  const rest = pos - b;
  return s[b + 1] !== undefined ? s[b] + rest * (s[b + 1] - s[b]) : s[b];
}

function linspace(a: number, b: number, n: number) {
  return Array.from({ length: n }, (_, i) => a + ((b - a) * i) / (n - 1));
}

function interpFit(model: { x: number[]; yHat: number[] }, xi: number) {
  const x = model.x;
  const y = model.yHat;
  if (xi <= x[0]) return y[0];
  if (xi >= x.at(-1)!) return y.at(-1)!;
  let i = 1;
  while (i < x.length && x[i] < xi) i++;
  const t = (xi - x[i - 1]) / (x[i] - x[i - 1] || 1);
  return y[i - 1] + t * (y[i] - y[i - 1]);
}

function isFiniteNum(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}
