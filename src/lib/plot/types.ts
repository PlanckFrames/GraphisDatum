export type Designation = "X" | "Y" | "YErr" | "XErr" | "Z" | "Label" | "None";

export type PlotType =
  | "scatter"
  | "line"
  | "lineSymbol"
  | "column"
  | "stackedColumn"
  | "area"
  | "step"
  | "histogram"
  | "box"
  | "violin"
  | "errorBar"
  | "polar"
  | "waterfall"
  | "heatmap"
  | "contour"
  | "surface3d"
  | "scatter3d"
  | "pie"
  | "radar"
  | "ternary"
  | "density"
  | "residual";

export type GraphTheme = "publication" | "night" | "journal";

export type GadgetKind = "none" | "cursor" | "fit" | "integrate" | "peaks";

export type FitModel =
  | "linear"
  | "poly2"
  | "poly3"
  | "poly4"
  | "exp"
  | "log"
  | "power"
  | "gauss"
  | "lorentz"
  | "logistic"
  | "sine"
  | "multigauss";

export interface Column {
  id: string;
  name: string;
  unit: string;
  designation: Designation;
  values: (number | null)[];
}

export interface Sheet {
  id: string;
  name: string;
  columns: Column[];
}

export interface SeriesStyle {
  color: string;
  symbol: "circle" | "square" | "triangle" | "diamond" | "cross" | "none";
  lineWidth: number;
  lineStyle: "solid" | "dash" | "dot";
  fillOpacity: number;
}

export interface GraphSpec {
  id: string;
  title: string;
  type: PlotType;
  sheetId: string;
  xColId: string | null;
  yColIds: string[];
  yErrColId: string | null;
  zColId: string | null;
  theme: GraphTheme;
  xLabel: string;
  yLabel: string;
  y2Label: string;
  logX: boolean;
  logY: boolean;
  showGrid: boolean;
  showLegend: boolean;
  autoX: boolean;
  autoY: boolean;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  panels: 1 | 2 | 4;
  gadget: GadgetKind;
  roi: { x0: number; x1: number } | null;
  rotX: number;
  rotZ: number;
  series: Record<string, SeriesStyle>;
  fitOverlay: FitResult | null;
}

export interface FitResult {
  model: FitModel;
  params: number[];
  paramNames: string[];
  paramErrors: number[];
  r2: number;
  rmse: number;
  aic: number;
  n: number;
  equation: string;
  yHat: number[];
  residuals: number[];
  x: number[];
  y: number[];
}

export interface Peak {
  index: number;
  x: number;
  y: number;
  prominence: number;
  fwhm: number;
  area: number;
}

export interface StatBlock {
  n: number;
  mean: number;
  sd: number;
  se: number;
  min: number;
  max: number;
  median: number;
  q1: number;
  q3: number;
  skew: number;
}

export interface Project {
  name: string;
  sheets: Sheet[];
  graphs: GraphSpec[];
  activeSheetId: string;
  activeGraphId: string;
  analysisLog: string[];
}

export const PALETTE = [
  "#3d6b8a",
  "#c47a4a",
  "#5a8f6d",
  "#8a5a72",
  "#b0a056",
  "#6a7ca0",
  "#8c6b4a",
  "#4a8a8a",
];
