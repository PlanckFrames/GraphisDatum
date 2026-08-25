import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Activity,
  BarChart3,
  Download,
  FileSpreadsheet,
  FlaskConical,
  Plus,
  RotateCcw,
  SlidersHorizontal,
  Upload,
} from "lucide-react";
import { useStudio } from "@/store/studio";
import type { Designation, FitModel, GadgetKind, GraphTheme, PlotType } from "@/lib/plot/types";
import { SAMPLE_LOADERS } from "@/lib/plot/samples";
import { renderGraph, type HoverInfo } from "@/lib/plot/render";
import { exportCsv, exportPdf, exportRaster } from "@/lib/plot/export";
import { describe, fmt } from "@/lib/plot/analysis";
import { alignedXY } from "@/lib/plot/analysis";
import { downloadBlob } from "@/lib/utils";
import { cn } from "@/lib/utils";

const PLOT_TYPES: { id: PlotType; label: string }[] = [
  { id: "scatter", label: "Scatter" },
  { id: "line", label: "Line" },
  { id: "lineSymbol", label: "Line + symbol" },
  { id: "errorBar", label: "Error bars" },
  { id: "column", label: "Column" },
  { id: "stackedColumn", label: "Stacked" },
  { id: "waterfall", label: "Waterfall" },
  { id: "area", label: "Area" },
  { id: "step", label: "Step" },
  { id: "histogram", label: "Histogram" },
  { id: "box", label: "Box" },
  { id: "violin", label: "Violin" },
  { id: "pie", label: "Pie" },
  { id: "polar", label: "Polar" },
  { id: "radar", label: "Radar" },
  { id: "ternary", label: "Ternary" },
  { id: "heatmap", label: "Heatmap" },
  { id: "contour", label: "Contour" },
  { id: "surface3d", label: "3D surface" },
  { id: "scatter3d", label: "3D scatter" },
  { id: "density", label: "Density" },
  { id: "residual", label: "Residuals" },
];

const FITS: { id: FitModel; label: string }[] = [
  { id: "linear", label: "Linear" },
  { id: "poly2", label: "Poly 2" },
  { id: "poly3", label: "Poly 3" },
  { id: "poly4", label: "Poly 4" },
  { id: "exp", label: "Exponential" },
  { id: "log", label: "Logarithmic" },
  { id: "power", label: "Power" },
  { id: "gauss", label: "Gaussian" },
  { id: "multigauss", label: "Multi-Gaussian" },
  { id: "lorentz", label: "Lorentzian" },
  { id: "logistic", label: "Logistic" },
  { id: "sine", label: "Sine" },
];

const DES: Designation[] = ["X", "Y", "YErr", "XErr", "Z", "Label", "None"];

export function StudioApp() {
  const [tab, setTab] = useState<"data" | "graph" | "analyze">("graph");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    void Promise.resolve(useStudio.persist.rehydrate()).finally(() => setReady(true));
  }, []);
  if (!ready) {
    return <div className="flex h-dvh items-center justify-center bg-bg text-sm text-muted">Opening studio…</div>;
  }
  return (
    <div className="flex h-dvh min-h-0 flex-col bg-bg text-fg">
      <TopBar />
      <div className="hidden min-h-0 flex-1 lg:grid lg:grid-cols-[minmax(260px,0.9fr)_minmax(0,1.6fr)_minmax(260px,0.95fr)]">
        <WorkbookPanel />
        <GraphStage />
        <SidePanel />
      </div>
      <div className="flex min-h-0 flex-1 flex-col lg:hidden">
        {tab === "data" && <WorkbookPanel />}
        {tab === "graph" && <GraphStage />}
        {tab === "analyze" && <SidePanel />}
      </div>
      <nav className="grid grid-cols-3 border-t border-border bg-surface lg:hidden">
        {(
          [
            ["data", "Data", FileSpreadsheet],
            ["graph", "Graph", BarChart3],
            ["analyze", "Analyze", SlidersHorizontal],
          ] as const
        ).map(([id, label, Icon]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "flex min-h-12 flex-col items-center justify-center gap-0.5 text-[11px] font-medium",
              tab === id ? "text-fg" : "text-muted",
            )}
          >
            <Icon className="size-4" />
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}

function TopBar() {
  const fileRef = useRef<HTMLInputElement>(null);
  const name = useStudio((s) => s.name);
  const setName = useStudio((s) => s.setName);
  const importCsvText = useStudio((s) => s.importCsvText);
  const addBlankSheet = useStudio((s) => s.addBlankSheet);
  const addSheet = useStudio((s) => s.addSheet);
  const newProject = useStudio((s) => s.newProject);
  const sheets = useStudio((s) => s.sheets);
  const graphs = useStudio((s) => s.graphs);
  const activeSheetId = useStudio((s) => s.activeSheetId);
  const canvasRef = useGraphCanvasRef();

  return (
    <header className="flex flex-wrap items-center gap-2 border-b border-border bg-surface px-3 py-2">
      <div className="flex items-center gap-2 pr-2">
        <Mark />
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-tight">LumenPlot</div>
          <div className="text-[10px] uppercase tracking-[0.16em] text-muted">Scientific studio</div>
        </div>
      </div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="h-9 min-w-0 flex-1 rounded-sm border border-border bg-panel px-2 text-sm text-fg outline-none focus:border-border-strong md:max-w-xs"
      />
      <div className="flex flex-wrap items-center gap-1">
        <Btn onClick={() => newProject()}>New</Btn>
        <Btn onClick={() => addBlankSheet()}>
          <Plus className="size-3.5" /> Sheet
        </Btn>
        <Btn onClick={() => fileRef.current?.click()}>
          <Upload className="size-3.5" /> CSV
        </Btn>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv,text/plain"
          className="hidden"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            importCsvText(await f.text(), f.name.replace(/\.csv$/i, ""));
            e.target.value = "";
          }}
        />
        <select
          className="h-9 rounded-sm border border-border bg-panel px-2 text-xs text-fg"
          defaultValue=""
          onChange={(e) => {
            const item = SAMPLE_LOADERS.find((x) => x.id === e.target.value);
            if (item) addSheet(item.load(), item.type);
            e.target.value = "";
          }}
        >
          <option value="" disabled>
            Demo data
          </option>
          {SAMPLE_LOADERS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        <ExportMenu canvasRef={canvasRef} />
        <Btn
          onClick={() => {
            const p = {
              name,
              sheets,
              graphs,
              activeSheetId,
              activeGraphId: useStudio.getState().activeGraphId,
              analysisLog: useStudio.getState().analysisLog,
            };
            downloadBlob(
              new Blob([JSON.stringify(p, null, 2)], { type: "application/json" }),
              "lumenplot-project.json",
            );
          }}
        >
          Save JSON
        </Btn>
      </div>
    </header>
  );
}

const graphCanvasHolder: { current: HTMLCanvasElement | null } = { current: null };
function useGraphCanvasRef() {
  return graphCanvasHolder;
}

function Mark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
      <rect x="1" y="1" width="26" height="26" rx="6" fill="#151a20" stroke="#9eb0c4" strokeWidth="1" />
      <path d="M6 19 L11 11 L15 16 L22 7" fill="none" stroke="#9eb0c4" strokeWidth="1.6" />
      <circle cx="22" cy="7" r="1.5" fill="#d7dde6" />
    </svg>
  );
}

function Btn({
  children,
  onClick,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-sm border border-border bg-panel px-2.5 text-xs font-medium text-fg transition-colors hover:bg-raised",
        className,
      )}
    >
      {children}
    </button>
  );
}

function ExportMenu({ canvasRef }: { canvasRef: { current: HTMLCanvasElement | null } }) {
  const sheet = useStudio((s) => s.sheets.find((x) => x.id === s.activeSheetId));
  const graph = useStudio((s) => s.graphs.find((x) => x.id === s.activeGraphId));
  const run = (kind: "csv" | "pdf" | "jpg" | "png" | "npg") => {
    if (kind === "csv" && sheet) {
      exportCsv(sheet);
      return;
    }
    const c = canvasRef.current;
    if (!c || !graph) return;
    if (kind === "pdf") exportPdf(c, graph.title);
    else exportRaster(c, kind === "jpg" ? "jpg" : kind === "npg" ? "npg" : "png", graph.title);
  };
  return (
    <div className="flex items-center gap-1">
      <Download className="size-3.5 text-muted" />
      {(["csv", "pdf", "jpg", "png", "npg"] as const).map((k) => (
        <button
          key={k}
          type="button"
          onClick={() => run(k)}
          className="h-9 rounded-sm border border-border bg-primary px-2 text-[11px] font-semibold uppercase tracking-wide text-primary-fg hover:opacity-90"
        >
          {k}
        </button>
      ))}
    </div>
  );
}

function WorkbookPanel() {
  const sheets = useStudio((s) => s.sheets);
  const activeSheetId = useStudio((s) => s.activeSheetId);
  const setActiveSheet = useStudio((s) => s.setActiveSheet);
  const sheet = sheets.find((x) => x.id === activeSheetId);
  const setCell = useStudio((s) => s.setCell);
  const setColMeta = useStudio((s) => s.setColMeta);
  const addColumn = useStudio((s) => s.addColumn);
  const applyFormula = useStudio((s) => s.applyFormula);
  const [formula, setFormula] = useState("sin(i/8)*2 + 0.4");
  const [formulaCol, setFormulaCol] = useState("");
  const rows = sheet ? Math.max(12, ...sheet.columns.map((c) => c.values.length), 0) + 4 : 12;

  useEffect(() => {
    if (sheet && !formulaCol && sheet.columns[1]) setFormulaCol(sheet.columns[1].id);
  }, [sheet, formulaCol]);

  if (!sheet) return null;
  return (
    <section className="flex min-h-0 flex-col border-r border-border bg-surface">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <FileSpreadsheet className="size-3.5 text-accent" />
        <span className="text-xs font-medium uppercase tracking-wider text-muted">Workbook</span>
      </div>
      <div className="flex gap-1 overflow-x-auto px-2 py-2">
        {sheets.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveSheet(s.id)}
            className={cn(
              "h-8 shrink-0 rounded-sm px-2.5 text-xs",
              s.id === activeSheetId ? "bg-raised text-fg" : "text-muted hover:text-fg",
            )}
          >
            {s.name}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full min-w-max border-collapse font-mono text-[11px] tabular-nums">
          <thead className="sticky top-0 z-10 bg-panel">
            <tr>
              <th className="w-10 border-b border-border px-1 py-1 text-subtle">#</th>
              {sheet.columns.map((c) => (
                <th key={c.id} className="min-w-28 border-b border-l border-border px-1 py-1">
                  <input
                    value={c.name}
                    onChange={(e) => setColMeta(c.id, { name: e.target.value })}
                    className="w-full bg-transparent text-center font-sans text-[11px] font-medium text-fg outline-none"
                  />
                  <select
                    value={c.designation}
                    onChange={(e) => setColMeta(c.id, { designation: e.target.value as Designation })}
                    className="mt-0.5 w-full bg-transparent text-center text-[10px] text-muted"
                  >
                    {DES.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }, (_, r) => (
              <tr key={r} className="odd:bg-bg/40">
                <td className="border-b border-border px-1 py-0.5 text-center text-subtle">{r + 1}</td>
                {sheet.columns.map((c) => (
                  <td key={c.id} className="border-b border-l border-border p-0">
                    <input
                      className="h-7 w-full bg-transparent px-1 text-right text-fg outline-none focus:bg-raised"
                      value={c.values[r] ?? ""}
                      onChange={(e) => {
                        const t = e.target.value.trim();
                        setCell(c.id, r, t === "" ? null : Number(t));
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-1.5 border-t border-border p-2">
        <div className="flex gap-1">
          <Btn onClick={addColumn}>Add column</Btn>
          <select
            value={formulaCol}
            onChange={(e) => setFormulaCol(e.target.value)}
            className="h-9 flex-1 rounded-sm border border-border bg-panel px-2 text-xs"
          >
            {sheet.columns.map((c) => (
              <option key={c.id} value={c.id}>
                Formula → {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-1">
          <input
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
            placeholder="i, sin, exp, col names…"
            className="h-9 flex-1 rounded-sm border border-border bg-panel px-2 font-mono text-xs outline-none"
          />
          <Btn onClick={() => formulaCol && applyFormula(formulaCol, formula)}>Run</Btn>
        </div>
      </div>
    </section>
  );
}

function GraphStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const graph = useStudio((s) => s.graphs.find((x) => x.id === s.activeGraphId));
  const sheet = useStudio((s) => s.sheets.find((x) => x.id === (graph?.sheetId ?? s.activeSheetId)));
  const patchGraph = useStudio((s) => s.patchGraph);
  const graphs = useStudio((s) => s.graphs);
  const setActiveGraph = useStudio((s) => s.setActiveGraph);
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const drag = useRef<{ x0: number } | null>(null);

  useEffect(() => {
    graphCanvasHolder.current = canvasRef.current;
  }, []);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c || !graph || !sheet) return;
    const draw = () => renderGraph(c, graph, sheet.columns, null);
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(c);
    return () => ro.disconnect();
  }, [graph, sheet]);

  if (!graph || !sheet) return <div className="flex-1 bg-bg" />;

  const invertX = (px: number) => {
    const w = canvasRef.current?.clientWidth ?? 1;
    const L = 58;
    const R = w - 18;
    const t = (px - L) / (R - L);
    const xs = alignedXY(
      sheet.columns.find((c) => c.id === graph.xColId),
      sheet.columns.find((c) => c.id === graph.yColIds[0]),
    ).x;
    const xmin = xs.length ? Math.min(...xs) : 0;
    const xmax = xs.length ? Math.max(...xs) : 1;
    return xmin + t * (xmax - xmin);
  };

  return (
    <section className="flex min-h-0 flex-col bg-bg">
      <div className="flex items-center gap-2 overflow-x-auto border-b border-border px-2 py-1.5">
        {graphs.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => setActiveGraph(g.id)}
            className={cn(
              "h-8 shrink-0 rounded-sm px-2.5 text-xs",
              g.id === graph.id ? "bg-raised text-fg" : "text-muted",
            )}
          >
            {g.title}
          </button>
        ))}
        <select
          value={graph.type}
          onChange={(e) => patchGraph({ type: e.target.value as PlotType })}
          className="ml-auto h-8 rounded-sm border border-border bg-panel px-2 text-xs"
        >
          {PLOT_TYPES.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>
      <div className="relative min-h-0 flex-1 p-2">
        <canvas
          ref={canvasRef}
          className="h-full w-full rounded-md border border-border"
          onMouseMove={(e) => {
            const c = canvasRef.current;
            if (!c || !graph || !sheet) return;
            const r = c.getBoundingClientRect();
            const pt = { x: e.clientX - r.left, y: e.clientY - r.top };
            const info = renderGraph(c, graph, sheet.columns, pt);
            setHover(info);
            if (drag.current && graph.gadget !== "none" && graph.gadget !== "cursor") {
              patchGraph({ roi: { x0: drag.current.x0, x1: invertX(pt.x) } });
            }
          }}
          onMouseDown={(e) => {
            if (graph.gadget === "none" || graph.gadget === "cursor") return;
            const c = canvasRef.current;
            if (!c) return;
            const r = c.getBoundingClientRect();
            const x = invertX(e.clientX - r.left);
            drag.current = { x0: x };
            patchGraph({ roi: { x0: x, x1: x } });
          }}
          onMouseUp={() => {
            drag.current = null;
          }}
        />
      </div>
      <footer className="flex h-8 items-center justify-between border-t border-border px-3 font-mono text-[11px] text-muted">
        <span>
          {hover
            ? `${hover.label}   x=${fmt(hover.x)}  y=${fmt(hover.y)}`
            : `${sheet.columns[0]?.values.length ?? 0} rows · ${graph.type}`}
        </span>
        <span className="hidden sm:inline">Drag ROI with Fit / Integrate / Peaks gadget on</span>
      </footer>
    </section>
  );
}

function SidePanel() {
  const graph = useStudio((s) => s.graphs.find((x) => x.id === s.activeGraphId));
  const sheet = useStudio((s) => s.sheets.find((x) => x.id === (graph?.sheetId ?? s.activeSheetId)));
  const patchGraph = useStudio((s) => s.patchGraph);
  const runFit = useStudio((s) => s.runFit);
  const runPeaks = useStudio((s) => s.runPeaks);
  const runSmooth = useStudio((s) => s.runSmooth);
  const runBaseline = useStudio((s) => s.runBaseline);
  const runNormalize = useStudio((s) => s.runNormalize);
  const runIntegrate = useStudio((s) => s.runIntegrate);
  const runFft = useStudio((s) => s.runFft);
  const log = useStudio((s) => s.analysisLog);
  const yCol = sheet?.columns.find((c) => c.id === graph?.yColIds[0]);
  const stats = yCol ? describe(yCol.values) : null;
  const fit = graph?.fitOverlay;

  if (!graph || !sheet) return null;
  return (
    <aside className="flex min-h-0 flex-col overflow-auto border-l border-border bg-surface">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <FlaskConical className="size-3.5 text-accent" />
        <span className="text-xs font-medium uppercase tracking-wider text-muted">Inspector</span>
      </div>
      <div className="space-y-4 p-3">
        <Field label="Title">
          <input
            value={graph.title}
            onChange={(e) => patchGraph({ title: e.target.value })}
            className="h-9 w-full rounded-sm border border-border bg-panel px-2 text-sm"
          />
        </Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label="X axis">
            <input
              value={graph.xLabel}
              onChange={(e) => patchGraph({ xLabel: e.target.value })}
              className="h-9 w-full rounded-sm border border-border bg-panel px-2 text-xs"
            />
          </Field>
          <Field label="Y axis">
            <input
              value={graph.yLabel}
              onChange={(e) => patchGraph({ yLabel: e.target.value })}
              className="h-9 w-full rounded-sm border border-border bg-panel px-2 text-xs"
            />
          </Field>
        </div>
        <Field label="X column">
          <select
            value={graph.xColId ?? ""}
            onChange={(e) => patchGraph({ xColId: e.target.value })}
            className="h-9 w-full rounded-sm border border-border bg-panel px-2 text-xs"
          >
            {sheet.columns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Y series (multi-select)">
          <div className="flex flex-col gap-1 rounded-sm border border-border bg-panel p-2">
            {sheet.columns.map((c) => {
              const on = graph.yColIds.includes(c.id);
              return (
                <label key={c.id} className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() =>
                      patchGraph({
                        yColIds: on ? graph.yColIds.filter((id) => id !== c.id) : [...graph.yColIds, c.id],
                      })
                    }
                  />
                  {c.name}
                </label>
              );
            })}
          </div>
        </Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Y error">
            <select
              value={graph.yErrColId ?? ""}
              onChange={(e) => patchGraph({ yErrColId: e.target.value || null })}
              className="h-9 w-full rounded-sm border border-border bg-panel px-2 text-xs"
            >
              <option value="">None</option>
              {sheet.columns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Z / C">
            <select
              value={graph.zColId ?? ""}
              onChange={(e) => patchGraph({ zColId: e.target.value || null })}
              className="h-9 w-full rounded-sm border border-border bg-panel px-2 text-xs"
            >
              <option value="">None</option>
              {sheet.columns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Toggle
            label="Log X"
            on={graph.logX}
            set={(v) => patchGraph({ logX: v })}
          />
          <Toggle label="Log Y" on={graph.logY} set={(v) => patchGraph({ logY: v })} />
          <Toggle label="Grid" on={graph.showGrid} set={(v) => patchGraph({ showGrid: v })} />
          <Toggle label="Legend" on={graph.showLegend} set={(v) => patchGraph({ showLegend: v })} />
        </div>
        <Field label="Theme">
          <div className="grid grid-cols-3 gap-1">
            {(["publication", "night", "journal"] as GraphTheme[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => patchGraph({ theme: t })}
                className={cn(
                  "h-8 rounded-sm text-[11px] capitalize",
                  graph.theme === t ? "bg-primary text-primary-fg" : "bg-panel text-muted",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Panels">
          <div className="grid grid-cols-3 gap-1">
            {([1, 2, 4] as const).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => patchGraph({ panels: n })}
                className={cn(
                  "h-8 rounded-sm text-xs",
                  graph.panels === n ? "bg-primary text-primary-fg" : "bg-panel text-muted",
                )}
              >
                {n === 1 ? "Single" : n === 2 ? "1×2" : "2×2"}
              </button>
            ))}
          </div>
        </Field>
        {(graph.type === "surface3d" || graph.type === "scatter3d") && (
          <div className="grid grid-cols-2 gap-2">
            <Field label={`Rot X ${graph.rotX}°`}>
              <input
                type="range"
                min={-80}
                max={80}
                value={graph.rotX}
                onChange={(e) => patchGraph({ rotX: Number(e.target.value) })}
                className="w-full"
              />
            </Field>
            <Field label={`Rot Z ${graph.rotZ}°`}>
              <input
                type="range"
                min={-180}
                max={180}
                value={graph.rotZ}
                onChange={(e) => patchGraph({ rotZ: Number(e.target.value) })}
                className="w-full"
              />
            </Field>
          </div>
        )}
        <Field label="Gadget">
          <select
            value={graph.gadget}
            onChange={(e) => patchGraph({ gadget: e.target.value as GadgetKind })}
            className="h-9 w-full rounded-sm border border-border bg-panel px-2 text-xs"
          >
            <option value="none">None</option>
            <option value="cursor">Vertical cursor</option>
            <option value="fit">Quick-fit ROI</option>
            <option value="integrate">Integrate ROI</option>
            <option value="peaks">Peaks ROI</option>
          </select>
        </Field>

        <div className="h-px bg-border" />
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted">
          <Activity className="size-3.5" /> Curve fitting
        </div>
        <div className="grid grid-cols-2 gap-1">
          {FITS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => runFit(f.id)}
              className="h-8 rounded-sm bg-panel text-[11px] hover:bg-raised"
            >
              {f.label}
            </button>
          ))}
        </div>
        {fit && (
          <div className="rounded-md border border-border bg-panel p-2 font-mono text-[11px] leading-relaxed">
            <div className="text-accent">{fit.equation}</div>
            <div>
              R² {fmt(fit.r2)} · RMSE {fmt(fit.rmse)} · n {fit.n}
            </div>
            {fit.paramNames.map((n, i) => (
              <div key={n}>
                {n} = {fmt(fit.params[i])}
                {Number.isFinite(fit.paramErrors[i]) ? ` ± ${fmt(fit.paramErrors[i])}` : ""}
              </div>
            ))}
            <button
              type="button"
              className="mt-1 text-[11px] text-muted hover:text-fg"
              onClick={() => patchGraph({ fitOverlay: null })}
            >
              Clear overlay
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-1">
          <Btn onClick={runPeaks}>Peak find</Btn>
          <Btn onClick={runIntegrate}>Integrate</Btn>
          <Btn onClick={runSmooth}>Smooth</Btn>
          <Btn onClick={runBaseline}>Baseline</Btn>
          <Btn onClick={runNormalize}>Normalize</Btn>
          <Btn onClick={runFft}>FFT</Btn>
        </div>

        {stats && (
          <div className="rounded-md border border-border bg-panel p-2">
            <div className="mb-1 text-[11px] uppercase tracking-wider text-muted">Descriptive</div>
            <dl className="grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[11px]">
              <Row k="n" v={String(stats.n)} />
              <Row k="mean" v={fmt(stats.mean)} />
              <Row k="sd" v={fmt(stats.sd)} />
              <Row k="se" v={fmt(stats.se)} />
              <Row k="median" v={fmt(stats.median)} />
              <Row k="IQR" v={fmt(stats.q3 - stats.q1)} />
              <Row k="min" v={fmt(stats.min)} />
              <Row k="max" v={fmt(stats.max)} />
            </dl>
          </div>
        )}

        <div>
          <div className="mb-1 flex items-center gap-1 text-[11px] uppercase tracking-wider text-muted">
            <RotateCcw className="size-3" /> Analysis log
          </div>
          <div className="max-h-40 space-y-1 overflow-auto rounded-md border border-border bg-bg p-2 text-[11px] leading-snug text-muted">
            {log.map((l, i) => (
              <p key={i}>{l}</p>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] uppercase tracking-wider text-muted">{label}</span>
      {children}
    </label>
  );
}

function Toggle({ label, on, set }: { label: string; on: boolean; set: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => set(!on)}
      className={cn(
        "h-8 rounded-sm text-[11px]",
        on ? "bg-primary text-primary-fg" : "bg-panel text-muted",
      )}
    >
      {label}
    </button>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <>
      <dt className="text-subtle">{k}</dt>
      <dd className="text-right text-fg">{v}</dd>
    </>
  );
}
