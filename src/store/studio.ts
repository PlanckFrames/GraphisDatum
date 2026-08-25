import { create } from "zustand";
import { persist } from "zustand/middleware";
import { uid } from "@/lib/utils";
import type { Column, Designation, FitModel, GraphSpec, PlotType, Project, SeriesStyle, Sheet } from "@/lib/plot/types";
import { PALETTE } from "@/lib/plot/types";
import { sampleSpectra } from "@/lib/plot/samples";
import { alignedXY, baselineLinear, describe, fftColumn, fitModel, integXY, normalizeMax, peaksFrom, smoothY } from "@/lib/plot/analysis";
import { parseCsv } from "@/lib/plot/export";

function defaultStyle(i: number): SeriesStyle {
  return {
    color: PALETTE[i % PALETTE.length],
    symbol: "circle",
    lineWidth: 1.6,
    lineStyle: "solid",
    fillOpacity: 0.18,
  };
}

function graphFromSheet(sheet: Sheet, type: PlotType = "lineSymbol"): GraphSpec {
  const x = sheet.columns.find((c) => c.designation === "X") ?? sheet.columns[0];
  const ys = sheet.columns.filter((c) => c.designation === "Y");
  const yErr = sheet.columns.find((c) => c.designation === "YErr");
  const z = sheet.columns.find((c) => c.designation === "Z");
  const series: Record<string, SeriesStyle> = {};
  ys.forEach((c, i) => {
    series[c.id] = defaultStyle(i);
  });
  return {
    id: uid("graph"),
    title: sheet.name,
    type,
    sheetId: sheet.id,
    xColId: x?.id ?? null,
    yColIds: ys.map((c) => c.id),
    yErrColId: yErr?.id ?? null,
    zColId: z?.id ?? null,
    theme: "publication",
    xLabel: x ? `${x.name}${x.unit ? ` (${x.unit})` : ""}` : "X",
    yLabel: ys[0] ? `${ys[0].name}${ys[0].unit ? ` (${ys[0].unit})` : ""}` : "Y",
    y2Label: "",
    logX: false,
    logY: false,
    showGrid: true,
    showLegend: true,
    autoX: true,
    autoY: true,
    xMin: 0,
    xMax: 1,
    yMin: 0,
    yMax: 1,
    panels: 1,
    gadget: "none",
    roi: null,
    rotX: 28,
    rotZ: 36,
    series,
    fitOverlay: null,
  };
}

function emptySheet(): Sheet {
  const n = 12;
  return {
    id: uid("sheet"),
    name: "Sheet1",
    columns: [
      { id: uid("col"), name: "X", unit: "", designation: "X", values: Array.from({ length: n }, (_, i) => i + 1) },
      { id: uid("col"), name: "Y", unit: "", designation: "Y", values: Array.from({ length: n }, () => null) },
    ],
  };
}

function seed(): Project {
  const sheet = sampleSpectra();
  const graph = graphFromSheet(sheet, "line");
  return {
    name: "LumenPlot project",
    sheets: [sheet],
    graphs: [graph],
    activeSheetId: sheet.id,
    activeGraphId: graph.id,
    analysisLog: ["Loaded UV-Vis demo spectrum. Try Peak find or Multi-Gaussian fit."],
  };
}

interface StudioState extends Project {
  log: (msg: string) => void;
  setName: (name: string) => void;
  activeSheet: () => Sheet | undefined;
  activeGraph: () => GraphSpec | undefined;
  setActiveSheet: (id: string) => void;
  setActiveGraph: (id: string) => void;
  patchGraph: (partial: Partial<GraphSpec>) => void;
  addSheet: (sheet?: Sheet, type?: PlotType) => void;
  addBlankSheet: () => void;
  renameSheet: (id: string, name: string) => void;
  addColumn: () => void;
  setCell: (colId: string, row: number, value: number | null) => void;
  setColMeta: (colId: string, patch: Partial<Pick<Column, "name" | "unit" | "designation">>) => void;
  importCsvText: (text: string, name?: string) => void;
  applyFormula: (colId: string, expr: string) => void;
  runFit: (model: FitModel) => void;
  runPeaks: () => void;
  runSmooth: () => void;
  runBaseline: () => void;
  runNormalize: () => void;
  runIntegrate: () => void;
  runFft: () => void;
  describeActive: () => ReturnType<typeof describe> | null;
  newProject: () => void;
  loadProject: (p: Project) => void;
}

function xyOf(state: StudioState) {
  const g = state.graphs.find((x) => x.id === state.activeGraphId);
  const s = state.sheets.find((x) => x.id === (g?.sheetId ?? state.activeSheetId));
  if (!g || !s) return null;
  const xCol = s.columns.find((c) => c.id === g.xColId);
  const yCol = s.columns.find((c) => c.id === g.yColIds[0]);
  const { x, y } = alignedXY(xCol, yCol);
  return { g, s, x, y, yCol };
}

export const useStudio = create<StudioState>()(
  persist(
    (set, get) => ({
      ...seed(),
      log: (msg) => set({ analysisLog: [msg, ...get().analysisLog].slice(0, 40) }),
      setName: (name) => set({ name }),
      activeSheet: () => get().sheets.find((s) => s.id === get().activeSheetId),
      activeGraph: () => get().graphs.find((g) => g.id === get().activeGraphId),
      setActiveSheet: (id) => {
        const g = get().graphs.find((x) => x.sheetId === id);
        set({ activeSheetId: id, activeGraphId: g?.id ?? get().activeGraphId });
      },
      setActiveGraph: (id) => {
        const g = get().graphs.find((x) => x.id === id);
        set({ activeGraphId: id, activeSheetId: g?.sheetId ?? get().activeSheetId });
      },
      patchGraph: (partial) =>
        set({
          graphs: get().graphs.map((g) => (g.id === get().activeGraphId ? { ...g, ...partial } : g)),
        }),
      addSheet: (sheet, type) => {
        const s = sheet ?? emptySheet();
        const g = graphFromSheet(s, type ?? "lineSymbol");
        set({
          sheets: [...get().sheets, s],
          graphs: [...get().graphs, g],
          activeSheetId: s.id,
          activeGraphId: g.id,
        });
      },
      addBlankSheet: () => get().addSheet(emptySheet(), "scatter"),
      renameSheet: (id, name) =>
        set({ sheets: get().sheets.map((s) => (s.id === id ? { ...s, name } : s)) }),
      addColumn: () => {
        const id = get().activeSheetId;
        set({
          sheets: get().sheets.map((s) => {
            if (s.id !== id) return s;
            const n = Math.max(0, ...s.columns.map((c) => c.values.length));
            const letter = String.fromCharCode(65 + s.columns.length);
            return {
              ...s,
              columns: [
                ...s.columns,
                {
                  id: uid("col"),
                  name: letter,
                  unit: "",
                  designation: "None" as Designation,
                  values: Array.from({ length: n }, () => null),
                },
              ],
            };
          }),
        });
      },
      setCell: (colId, row, value) => {
        const id = get().activeSheetId;
        set({
          sheets: get().sheets.map((s) => {
            if (s.id !== id) return s;
            return {
              ...s,
              columns: s.columns.map((c) => {
                if (c.id !== colId) return c;
                const values = [...c.values];
                while (values.length <= row) values.push(null);
                values[row] = value;
                return { ...c, values };
              }),
            };
          }),
        });
      },
      setColMeta: (colId, patch) => {
        const id = get().activeSheetId;
        set({
          sheets: get().sheets.map((s) =>
            s.id !== id
              ? s
              : { ...s, columns: s.columns.map((c) => (c.id === colId ? { ...c, ...patch } : c)) },
          ),
        });
      },
      importCsvText: (text, name) => {
        const { names, rows } = parseCsv(text);
        if (!names.length) return;
        const columns: Column[] = names.map((nm, i) => ({
          id: uid("col"),
          name: nm,
          unit: "",
          designation: (i === 0 ? "X" : "Y") as Designation,
          values: rows.map((r) => (Number.isFinite(r[i]) ? r[i] : null)),
        }));
        get().addSheet({ id: uid("sheet"), name: name || "Imported", columns }, "lineSymbol");
        get().log(`Imported ${rows.length} rows × ${names.length} columns.`);
      },
      applyFormula: (colId, expr) => {
        const s = get().activeSheet();
        if (!s) return;
        const n = Math.max(0, ...s.columns.map((c) => c.values.length));
        const values: (number | null)[] = [];
        for (let i = 0; i < n; i++) {
          try {
            const keys = s.columns.map((c) => c.name.replace(/\W/g, "_") || "col");
            const vals = keys.map((k, ki) => {
              const v = s.columns[ki].values[i];
              return typeof v === "number" ? v : NaN;
            });
            const fn = new Function(
              "i",
              "row",
              ...keys,
              `"use strict"; const {sin,cos,tan,exp,log,sqrt,abs,pow,min,max,PI,E,asin,acos,atan}=Math; return (${expr});`,
            );
            const v = Number(fn(i + 1, i + 1, ...vals));
            values.push(Number.isFinite(v) ? v : null);
          } catch {
            values.push(null);
          }
        }
        get().setColMeta(colId, {});
        set({
          sheets: get().sheets.map((sh) =>
            sh.id !== s.id
              ? sh
              : { ...sh, columns: sh.columns.map((c) => (c.id === colId ? { ...c, values } : c)) },
          ),
        });
        get().log(`Formula applied to column: ${expr}`);
      },
      runFit: (model) => {
        const pack = xyOf(get());
        if (!pack || pack.x.length < 3) {
          get().log("Fit needs an X and Y series with ≥ 3 points.");
          return;
        }
        let { x, y } = pack;
        const g = pack.g;
        if (g.roi) {
          const lo = Math.min(g.roi.x0, g.roi.x1);
          const hi = Math.max(g.roi.x0, g.roi.x1);
          const keep = x.map((xi, i) => ({ xi, yi: y[i] })).filter((p) => p.xi >= lo && p.xi <= hi);
          x = keep.map((p) => p.xi);
          y = keep.map((p) => p.yi);
        }
        try {
          const fit = fitModel(model, x, y);
          get().patchGraph({ fitOverlay: fit });
          get().log(
            `${model} fit  R²=${fit.r2.toFixed(4)}  RMSE=${fit.rmse.toPrecision(3)}  ${fit.equation}`,
          );
        } catch (e) {
          get().log(e instanceof Error ? e.message : "Fit failed.");
        }
      },
      runPeaks: () => {
        const pack = xyOf(get());
        if (!pack) return;
        const peaks = peaksFrom(pack.x, pack.y).slice(0, 8);
        get().log(
          peaks.length
            ? `Found ${peaks.length} peaks: ` +
                peaks.map((p) => `x=${p.x.toPrecision(4)} y=${p.y.toPrecision(3)} FWHM=${p.fwhm.toPrecision(3)}`).join(" · ")
            : "No peaks above prominence threshold.",
        );
      },
      runSmooth: () => {
        const pack = xyOf(get());
        if (!pack?.yCol) return;
        const y = smoothY(pack.y, 9);
        const values = pack.yCol.values.map((v, i) => (typeof pack.x[i] === "number" ? y[i] ?? v : v));
        set({
          sheets: get().sheets.map((s) =>
            s.id !== pack.s.id
              ? s
              : {
                  ...s,
                  columns: s.columns.map((c) => (c.id === pack.yCol!.id ? { ...c, values } : c)),
                },
          ),
        });
        get().log("Moving-average smooth (window 9) applied to active Y.");
      },
      runBaseline: () => {
        const pack = xyOf(get());
        if (!pack?.yCol) return;
        const y = baselineLinear(pack.x, pack.y);
        replaceY(set, get, pack.s.id, pack.yCol.id, pack.yCol.values, y);
        get().log("Linear endpoint baseline subtracted.");
      },
      runNormalize: () => {
        const pack = xyOf(get());
        if (!pack?.yCol) return;
        const y = normalizeMax(pack.y);
        replaceY(set, get, pack.s.id, pack.yCol.id, pack.yCol.values, y);
        get().log("Normalized Y to max = 1.");
      },
      runIntegrate: () => {
        const pack = xyOf(get());
        if (!pack) return;
        let { x, y } = pack;
        if (pack.g.roi) {
          const lo = Math.min(pack.g.roi.x0, pack.g.roi.x1);
          const hi = Math.max(pack.g.roi.x0, pack.g.roi.x1);
          const keep = x.map((xi, i) => ({ xi, yi: y[i] })).filter((p) => p.xi >= lo && p.xi <= hi);
          x = keep.map((p) => p.xi);
          y = keep.map((p) => p.yi);
        }
        const { area } = integXY(x, y);
        get().log(`Trapezoid integral = ${area.toPrecision(6)} (${x.length} pts${pack.g.roi ? ", ROI" : ""}).`);
      },
      runFft: () => {
        const pack = xyOf(get());
        if (!pack) return;
        const mag = fftColumn(pack.y);
        const freq = mag.map((_, i) => i);
        const sheet: Sheet = {
          id: uid("sheet"),
          name: "FFT magnitude",
          columns: [
            { id: uid("col"), name: "bin", unit: "", designation: "X", values: freq },
            { id: uid("col"), name: "Magnitude", unit: "", designation: "Y", values: mag },
          ],
        };
        get().addSheet(sheet, "line");
        get().log(`FFT computed (${mag.length} bins). New sheet created.`);
      },
      describeActive: () => {
        const pack = xyOf(get());
        if (!pack) return null;
        return describe(pack.y);
      },
      newProject: () => set({ ...seed(), analysisLog: ["New project."] }),
      loadProject: (p) => set({ ...p }),
    }),
    {
      name: "lumenplot-project-v1",
      skipHydration: true,
      partialize: (s) => ({
        name: s.name,
        sheets: s.sheets,
        graphs: s.graphs,
        activeSheetId: s.activeSheetId,
        activeGraphId: s.activeGraphId,
        analysisLog: s.analysisLog,
      }),
    },
  ),
);

function replaceY(
  set: (p: Partial<StudioState>) => void,
  get: () => StudioState,
  sheetId: string,
  colId: string,
  old: (number | null)[],
  y: number[],
) {
  const values = old.slice();
  for (let i = 0; i < y.length; i++) values[i] = y[i];
  set({
    sheets: get().sheets.map((s) =>
      s.id !== sheetId ? s : { ...s, columns: s.columns.map((c) => (c.id === colId ? { ...c, values } : c)) },
    ),
  });
}
