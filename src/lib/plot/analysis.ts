import type { Column, FitModel, FitResult, Peak, StatBlock } from "./types";
import {
  anova,
  derivative,
  fftMag,
  findPeaks,
  linreg,
  mean,
  median,
  movingAverage,
  nls,
  nums,
  pairs,
  pearson,
  polyfit,
  polyval,
  quantile,
  r2Score,
  rmse,
  sd,
  skewness,
  spearman,
  trapz,
  tTest,
} from "./math";

export function alignedXY(xCol: Column | undefined, yCol: Column | undefined) {
  if (!xCol || !yCol) return { x: [] as number[], y: [] as number[] };
  const pts = pairs(xCol.values, yCol.values).sort((a, b) => a.x - b.x);
  return { x: pts.map((p) => p.x), y: pts.map((p) => p.y) };
}

export function describe(vs: (number | null)[]): StatBlock {
  const a = nums(vs);
  const n = a.length;
  const m = mean(a);
  const s = sd(a);
  return {
    n,
    mean: m,
    sd: s,
    se: s / Math.sqrt(n || 1),
    min: Math.min(...a),
    max: Math.max(...a),
    median: median(a),
    q1: quantile(a, 0.25),
    q3: quantile(a, 0.75),
    skew: skewness(a),
  };
}

function pack(
  model: FitModel,
  params: number[],
  names: string[],
  errors: number[],
  x: number[],
  y: number[],
  yHat: number[],
  equation: string,
): FitResult {
  const residuals = y.map((yi, i) => yi - yHat[i]);
  const r2 = r2Score(y, yHat);
  const err = rmse(y, yHat);
  const aic = y.length * Math.log(Math.max(1e-18, err * err)) + 2 * params.length;
  return {
    model,
    params,
    paramNames: names,
    paramErrors: errors,
    r2,
    rmse: err,
    aic,
    n: y.length,
    equation,
    yHat,
    residuals,
    x,
    y,
  };
}

export function fitModel(model: FitModel, x: number[], y: number[]): FitResult {
  if (x.length < 3) throw new Error("Need at least 3 points to fit.");
  if (model === "linear") {
    const lr = linreg(x, y);
    const yHat = x.map((xi) => lr.slope * xi + lr.intercept);
    return pack(
      model,
      [lr.intercept, lr.slope],
      ["a", "b"],
      [lr.seInt, lr.seSlope],
      x,
      y,
      yHat,
      `y = ${lr.intercept.toPrecision(4)} + ${lr.slope.toPrecision(4)} x`,
    );
  }
  if (model.startsWith("poly")) {
    const deg = Number(model.slice(4));
    const c = polyfit(x, y, deg);
    const yHat = x.map((xi) => polyval(c, xi));
    const names = c.map((_, i) => `c${i}`);
    const eq = c.map((v, i) => `${v.toPrecision(3)}${i ? ` x^${i}` : ""}`).join(" + ");
    return pack(model, c, names, c.map(() => NaN), x, y, yHat, `y = ${eq}`);
  }
  if (model === "exp") {
    const lr = linreg(x, y.map((v) => Math.log(Math.max(1e-12, Math.abs(v)))));
    const res = nls(x, y, (p, xi) => p[0] * Math.exp(p[1] * xi) + p[2], [
      Math.exp(lr.intercept),
      lr.slope,
      0,
    ]);
    const [a, b, c] = res.params;
    return pack(
      model,
      res.params,
      ["a", "b", "c"],
      res.paramErrors,
      x,
      y,
      res.yhat,
      `y = ${a.toPrecision(4)} exp(${b.toPrecision(4)} x) + ${c.toPrecision(4)}`,
    );
  }
  if (model === "log") {
    const xx = x.map((v) => Math.log(Math.max(1e-12, Math.abs(v))));
    const lr = linreg(xx, y);
    const yHat = xx.map((xi) => lr.slope * xi + lr.intercept);
    return pack(
      model,
      [lr.intercept, lr.slope],
      ["a", "b"],
      [lr.seInt, lr.seSlope],
      x,
      y,
      yHat,
      `y = ${lr.intercept.toPrecision(4)} + ${lr.slope.toPrecision(4)} ln(x)`,
    );
  }
  if (model === "power") {
    const xx = x.map((v) => Math.log(Math.max(1e-12, Math.abs(v))));
    const yy = y.map((v) => Math.log(Math.max(1e-12, Math.abs(v))));
    const lr = linreg(xx, yy);
    const a = Math.exp(lr.intercept);
    const b = lr.slope;
    const yHat = x.map((xi) => a * xi ** b);
    return pack(model, [a, b], ["a", "b"], [NaN, lr.seSlope], x, y, yHat, `y = ${a.toPrecision(4)} x^${b.toPrecision(4)}`);
  }
  if (model === "gauss" || model === "multigauss") {
    const ymax = Math.max(...y);
    const ymin = Math.min(...y);
    const imax = y.indexOf(ymax);
    const peaks = findPeaks(x, y).slice(0, model === "gauss" ? 1 : 3);
    const use = peaks.length ? peaks : [{ x: x[imax], y: ymax, fwhm: (x.at(-1)! - x[0]) / 8, index: imax, prominence: ymax }];
    const p0: number[] = [ymin];
    const names = ["y0"];
    use.forEach((pk, i) => {
      p0.push(pk.y - ymin, pk.x, Math.max(1e-6, pk.fwhm / 2.355));
      names.push(`A${i + 1}`, `μ${i + 1}`, `σ${i + 1}`);
    });
    const fn = (p: number[], xi: number) => {
      let v = p[0];
      for (let i = 1; i < p.length; i += 3) {
        const A = p[i];
        const mu = p[i + 1];
        const sig = Math.max(1e-9, p[i + 2]);
        v += A * Math.exp(-((xi - mu) ** 2) / (2 * sig * sig));
      }
      return v;
    };
    const res = nls(x, y, fn, p0);
    const eq = res.params
      .slice(1)
      .reduce((s, _, i, arr) => {
        if (i % 3) return s;
        return s + ` + ${arr[i].toPrecision(3)} exp(-((x-${arr[i + 1].toPrecision(3)})^2)/(2 ${arr[i + 2].toPrecision(3)}^2))`;
      }, res.params[0].toPrecision(3));
    return pack(model === "gauss" ? "gauss" : "multigauss", res.params, names, res.paramErrors, x, y, res.yhat, `y = ${eq}`);
  }
  if (model === "lorentz") {
    const ymax = Math.max(...y);
    const imax = y.indexOf(ymax);
    const res = nls(
      x,
      y,
      (p, xi) => p[0] + (p[1] * p[3] ** 2) / ((xi - p[2]) ** 2 + p[3] ** 2),
      [Math.min(...y), ymax - Math.min(...y), x[imax], (x.at(-1)! - x[0]) / 20],
    );
    const [y0, A, mu, g] = res.params;
    return pack(
      model,
      res.params,
      ["y0", "A", "μ", "γ"],
      res.paramErrors,
      x,
      y,
      res.yhat,
      `y = ${y0.toPrecision(3)} + ${A.toPrecision(3)} γ² / ((x-${mu.toPrecision(3)})² + γ²), γ=${g.toPrecision(3)}`,
    );
  }
  if (model === "logistic") {
    const ymin = Math.min(...y);
    const ymax = Math.max(...y);
    const mid = x[Math.floor(x.length / 2)];
    const res = nls(
      x,
      y,
      (p, xi) => p[0] + p[1] / (1 + Math.exp(-(xi - p[2]) / p[3])),
      [ymin, ymax - ymin, mid, (x.at(-1)! - x[0]) / 8],
    );
    const [a, b, c, d] = res.params;
    return pack(
      model,
      res.params,
      ["A", "B", "x0", "k"],
      res.paramErrors,
      x,
      y,
      res.yhat,
      `y = ${a.toPrecision(3)} + ${b.toPrecision(3)} / (1 + exp(-(x-${c.toPrecision(3)})/${d.toPrecision(3)}))`,
    );
  }
  if (model === "sine") {
    const my = mean(y);
    const amp = (Math.max(...y) - Math.min(...y)) / 2;
    const span = x.at(-1)! - x[0];
    const res = nls(x, y, (p, xi) => p[0] + p[1] * Math.sin(p[2] * xi + p[3]), [my, amp, (2 * Math.PI) / (span / 4 || 1), 0]);
    const [a, b, w, ph] = res.params;
    return pack(
      model,
      res.params,
      ["offset", "amp", "ω", "φ"],
      res.paramErrors,
      x,
      y,
      res.yhat,
      `y = ${a.toPrecision(3)} + ${b.toPrecision(3)} sin(${w.toPrecision(3)} x + ${ph.toPrecision(3)})`,
    );
  }
  throw new Error("Unknown model");
}

export function peaksFrom(x: number[], y: number[]): Peak[] {
  return findPeaks(x, y).map((p) => {
    const half = p.y / 2;
    let l = p.index;
    let r = p.index;
    while (l > 0 && y[l] > half) l--;
    while (r < y.length - 1 && y[r] > half) r++;
    let area = 0;
    for (let i = l + 1; i <= r; i++) area += 0.5 * (y[i] + y[i - 1]) * (x[i] - x[i - 1]);
    return { ...p, area };
  });
}

export function smoothY(y: number[], win = 7) {
  return movingAverage(y, win);
}

export function diffXY(x: number[], y: number[]) {
  return { x, y: derivative(x, y) };
}

export function integXY(x: number[], y: number[]) {
  return trapz(x, y);
}

export function fftColumn(y: number[]) {
  return fftMag(y);
}

export function corr(x: number[], y: number[]) {
  return { pearson: pearson(x, y), spearman: spearman(x, y) };
}

export function runTTest(a: number[], b?: number[]) {
  return tTest(a, b);
}

export function runAnova(groups: number[][]) {
  return anova(groups);
}

export function interpolate(x: number[], y: number[], xq: number) {
  if (xq <= x[0]) return y[0];
  if (xq >= x.at(-1)!) return y.at(-1)!;
  let i = 1;
  while (i < x.length && x[i] < xq) i++;
  const t = (xq - x[i - 1]) / (x[i] - x[i - 1] || 1);
  return y[i - 1] + t * (y[i] - y[i - 1]);
}

export function baselineLinear(x: number[], y: number[]) {
  const a = y[0];
  const b = y.at(-1)!;
  const x0 = x[0];
  const x1 = x.at(-1)!;
  return y.map((yi, i) => yi - (a + ((b - a) * (x[i] - x0)) / (x1 - x0 || 1)));
}

export function normalizeMax(y: number[]) {
  const m = Math.max(...y.map(Math.abs), 1e-12);
  return y.map((v) => v / m);
}

export function fmt(n: number, d = 4) {
  if (!Number.isFinite(n)) return "—";
  const a = Math.abs(n);
  if (a !== 0 && (a < 1e-3 || a >= 1e5)) return n.toExponential(d - 1);
  return n.toPrecision(d);
}
