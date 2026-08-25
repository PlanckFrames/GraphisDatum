export function isFiniteNum(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

export function pairs(
  xs: (number | null)[],
  ys: (number | null)[],
): { x: number; y: number }[] {
  const out: { x: number; y: number }[] = [];
  const n = Math.min(xs.length, ys.length);
  for (let i = 0; i < n; i++) {
    const x = xs[i];
    const y = ys[i];
    if (isFiniteNum(x) && isFiniteNum(y)) out.push({ x, y });
  }
  return out;
}

export function nums(vs: (number | null)[]): number[] {
  return vs.filter(isFiniteNum);
}

export function mean(a: number[]) {
  if (!a.length) return NaN;
  return a.reduce((s, v) => s + v, 0) / a.length;
}

export function variance(a: number[], sample = true) {
  if (a.length < 2) return 0;
  const m = mean(a);
  const ss = a.reduce((s, v) => s + (v - m) ** 2, 0);
  return ss / (sample ? a.length - 1 : a.length);
}

export function sd(a: number[]) {
  return Math.sqrt(variance(a));
}

export function quantile(a: number[], q: number) {
  if (!a.length) return NaN;
  const s = [...a].sort((x, y) => x - y);
  const pos = (s.length - 1) * q;
  const b = Math.floor(pos);
  const rest = pos - b;
  return s[b + 1] !== undefined ? s[b] + rest * (s[b + 1] - s[b]) : s[b];
}

export function median(a: number[]) {
  return quantile(a, 0.5);
}

export function pearson(x: number[], y: number[]) {
  const n = Math.min(x.length, y.length);
  if (n < 3) return NaN;
  const mx = mean(x.slice(0, n));
  const my = mean(y.slice(0, n));
  let num = 0;
  let dx = 0;
  let dy = 0;
  for (let i = 0; i < n; i++) {
    const a = x[i] - mx;
    const b = y[i] - my;
    num += a * b;
    dx += a * a;
    dy += b * b;
  }
  return num / Math.sqrt(dx * dy);
}

export function spearman(x: number[], y: number[]) {
  const rank = (a: number[]) => {
    const idx = a.map((v, i) => ({ v, i })).sort((p, q) => p.v - q.v);
    const r = Array(a.length).fill(0);
    idx.forEach((p, k) => {
      r[p.i] = k + 1;
    });
    return r;
  };
  return pearson(rank(x), rank(y));
}

export function linreg(x: number[], y: number[]) {
  const n = Math.min(x.length, y.length);
  const mx = mean(x.slice(0, n));
  const my = mean(y.slice(0, n));
  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - mx;
    const dy = y[i] - my;
    sxx += dx * dx;
    sxy += dx * dy;
    syy += dy * dy;
  }
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  const r2 = (sxy * sxy) / (sxx * syy);
  const sse = syy - slope * sxy;
  const seSlope = Math.sqrt(sse / (n - 2) / sxx);
  const seInt = seSlope * Math.sqrt(mean(x.slice(0, n).map((v) => v * v)));
  return { slope, intercept, r2, seSlope, seInt, n, sse };
}

export function polyfit(x: number[], y: number[], deg: number) {
  const n = Math.min(x.length, y.length);
  const m = deg + 1;
  const A: number[][] = Array.from({ length: m }, () => Array(m).fill(0));
  const b: number[] = Array(m).fill(0);
  for (let i = 0; i < n; i++) {
    const xi = x[i];
    const yi = y[i];
    let pk = 1;
    for (let k = 0; k < m; k++) {
      b[k] += yi * pk;
      let pj = pk;
      for (let j = 0; j < m; j++) {
        A[k][j] += pj;
        pj *= xi;
      }
      pk *= xi;
    }
  }
  const coeff = solve(A, b);
  return coeff;
}

export function polyval(coeff: number[], x: number) {
  let y = 0;
  let p = 1;
  for (const c of coeff) {
    y += c * p;
    p *= x;
  }
  return y;
}

function solve(A: number[][], b: number[]) {
  const n = b.length;
  const M = A.map((row, i) => [...row, b[i]]);
  for (let i = 0; i < n; i++) {
    let max = i;
    for (let r = i + 1; r < n; r++) if (Math.abs(M[r][i]) > Math.abs(M[max][i])) max = r;
    [M[i], M[max]] = [M[max], M[i]];
    const piv = M[i][i] || 1e-12;
    for (let c = i; c <= n; c++) M[i][c] /= piv;
    for (let r = 0; r < n; r++) {
      if (r === i) continue;
      const f = M[r][i];
      for (let c = i; c <= n; c++) M[r][c] -= f * M[i][c];
    }
  }
  return M.map((row) => row[n]);
}

export function r2Score(y: number[], yhat: number[]) {
  const my = mean(y);
  let sst = 0;
  let sse = 0;
  for (let i = 0; i < y.length; i++) {
    sst += (y[i] - my) ** 2;
    sse += (y[i] - yhat[i]) ** 2;
  }
  return 1 - sse / sst;
}

export function rmse(y: number[], yhat: number[]) {
  let s = 0;
  for (let i = 0; i < y.length; i++) s += (y[i] - yhat[i]) ** 2;
  return Math.sqrt(s / y.length);
}

/** Levenberg–Marquardt nonlinear least squares. */
export function nls(
  x: number[],
  y: number[],
  model: (p: number[], xi: number) => number,
  p0: number[],
  maxIter = 80,
) {
  let p = [...p0];
  let lambda = 1e-3;
  const m = p.length;
  const n = Math.min(x.length, y.length);
  const jac = (pp: number[], xi: number) => {
    const h = 1e-6;
    const g = Array(m).fill(0);
    const f0 = model(pp, xi);
    for (let j = 0; j < m; j++) {
      const q = [...pp];
      q[j] += h;
      g[j] = (model(q, xi) - f0) / h;
    }
    return g;
  };
  const cost = (pp: number[]) => {
    let s = 0;
    for (let i = 0; i < n; i++) {
      const e = y[i] - model(pp, x[i]);
      s += e * e;
    }
    return s;
  };
  let c = cost(p);
  for (let it = 0; it < maxIter; it++) {
    const JtJ: number[][] = Array.from({ length: m }, () => Array(m).fill(0));
    const Jtr: number[] = Array(m).fill(0);
    for (let i = 0; i < n; i++) {
      const g = jac(p, x[i]);
      const r = y[i] - model(p, x[i]);
      for (let j = 0; j < m; j++) {
        Jtr[j] += g[j] * r;
        for (let k = 0; k < m; k++) JtJ[j][k] += g[j] * g[k];
      }
    }
    for (let j = 0; j < m; j++) JtJ[j][j] *= 1 + lambda;
    let dp: number[];
    try {
      dp = solve(JtJ, Jtr);
    } catch {
      break;
    }
    const p2 = p.map((v, i) => v + dp[i]);
    const c2 = cost(p2);
    if (c2 < c) {
      p = p2;
      c = c2;
      lambda *= 0.3;
      if (Math.sqrt(dp.reduce((s, v) => s + v * v, 0)) < 1e-10) break;
    } else {
      lambda *= 3;
      if (lambda > 1e12) break;
    }
  }
  const yhat = x.slice(0, n).map((xi) => model(p, xi));
  const resid = y.slice(0, n).map((yi, i) => yi - yhat[i]);
  const sse = resid.reduce((s, v) => s + v * v, 0);
  const sigma2 = sse / Math.max(1, n - m);
  const JtJ: number[][] = Array.from({ length: m }, () => Array(m).fill(0));
  for (let i = 0; i < n; i++) {
    const g = jac(p, x[i]);
    for (let j = 0; j < m; j++) for (let k = 0; k < m; k++) JtJ[j][k] += g[j] * g[k];
  }
  const I = Array.from({ length: m }, (_, i) => Array.from({ length: m }, (__, j) => (i === j ? 1 : 0)));
  let cov: number[][] = I;
  try {
    cov = I.map((row) => solve(JtJ, row));
  } catch {
    /* keep I */
  }
  const paramErrors = cov.map((row, i) => Math.sqrt(Math.max(0, row[i] * sigma2)));
  return { params: p, yhat, resid, paramErrors, sse };
}

export function movingAverage(y: number[], win: number) {
  const w = Math.max(1, win | 0);
  const half = Math.floor(w / 2);
  return y.map((_, i) => {
    let s = 0;
    let c = 0;
    for (let k = i - half; k <= i + half; k++) {
      if (k >= 0 && k < y.length) {
        s += y[k];
        c++;
      }
    }
    return s / c;
  });
}

export function derivative(x: number[], y: number[]) {
  const d: number[] = [];
  for (let i = 0; i < y.length; i++) {
    if (i === 0) d.push((y[1] - y[0]) / (x[1] - x[0] || 1));
    else if (i === y.length - 1)
      d.push((y[i] - y[i - 1]) / (x[i] - x[i - 1] || 1));
    else d.push((y[i + 1] - y[i - 1]) / (x[i + 1] - x[i - 1] || 1));
  }
  return d;
}

export function trapz(x: number[], y: number[]) {
  let a = 0;
  const cum: number[] = [0];
  for (let i = 1; i < y.length; i++) {
    a += 0.5 * (y[i] + y[i - 1]) * (x[i] - x[i - 1]);
    cum.push(a);
  }
  return { area: a, cum };
}

export function fftMag(y: number[]) {
  const n = 1 << Math.ceil(Math.log2(Math.max(2, y.length)));
  const re = Array(n).fill(0);
  const im = Array(n).fill(0);
  for (let i = 0; i < y.length; i++) re[i] = y[i];
  const bits = Math.log2(n);
  for (let i = 0; i < n; i++) {
    let rev = 0;
    for (let b = 0; b < bits; b++) if (i & (1 << b)) rev |= 1 << (bits - 1 - b);
    if (i < rev) {
      [re[i], re[rev]] = [re[rev], re[i]];
      [im[i], im[rev]] = [im[rev], im[i]];
    }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (-2 * Math.PI) / len;
    const wr = Math.cos(ang);
    const wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let cr = 1;
      let ci = 0;
      for (let j = 0; j < len / 2; j++) {
        const ur = re[i + j];
        const ui = im[i + j];
        const vr = re[i + j + len / 2] * cr - im[i + j + len / 2] * ci;
        const vi = re[i + j + len / 2] * ci + im[i + j + len / 2] * cr;
        re[i + j] = ur + vr;
        im[i + j] = ui + vi;
        re[i + j + len / 2] = ur - vr;
        im[i + j + len / 2] = ui - vi;
        const ncr = cr * wr - ci * wi;
        ci = cr * wi + ci * wr;
        cr = ncr;
      }
    }
  }
  const mag = re.map((r, i) => Math.hypot(r, im[i]) / n);
  return mag.slice(0, n / 2);
}

export function findPeaks(x: number[], y: number[], minProm = 0) {
  const peaks: { index: number; x: number; y: number; prominence: number; fwhm: number }[] = [];
  const ymax = Math.max(...y);
  const floor = minProm || ymax * 0.08;
  for (let i = 1; i < y.length - 1; i++) {
    if (y[i] >= y[i - 1] && y[i] > y[i + 1] && y[i] - Math.min(...y) > floor) {
      let l = i;
      let r = i;
      while (l > 0 && y[l] >= y[l - 1] * 0.5) l--;
      while (r < y.length - 1 && y[r] >= y[r + 1] * 0.5) r++;
      const half = y[i] / 2;
      let li = i;
      let ri = i;
      while (li > 0 && y[li] > half) li--;
      while (ri < y.length - 1 && y[ri] > half) ri++;
      const fwhm = Math.abs(x[ri] - x[li]);
      const leftMin = Math.min(...y.slice(Math.max(0, i - 20), i + 1));
      const rightMin = Math.min(...y.slice(i, Math.min(y.length, i + 21)));
      const prominence = y[i] - Math.max(leftMin, rightMin) * 0.5;
      peaks.push({ index: i, x: x[i], y: y[i], prominence, fwhm });
    }
  }
  peaks.sort((a, b) => b.y - a.y);
  return peaks;
}

export function niceNum(range: number, round: boolean) {
  const exp = Math.floor(Math.log10(range || 1));
  const f = range / 10 ** exp;
  let nf: number;
  if (round) {
    if (f < 1.5) nf = 1;
    else if (f < 3) nf = 2;
    else if (f < 7) nf = 5;
    else nf = 10;
  } else {
    if (f <= 1) nf = 1;
    else if (f <= 2) nf = 2;
    else if (f <= 5) nf = 5;
    else nf = 10;
  }
  return nf * 10 ** exp;
}

export function ticks(min: number, max: number, n = 6) {
  const range = niceNum(max - min || 1, false);
  const d = niceNum(range / (n - 1), true);
  const graphMin = Math.floor(min / d) * d;
  const graphMax = Math.ceil(max / d) * d;
  const out: number[] = [];
  for (let v = graphMin; v <= graphMax + d * 0.5; v += d) out.push(Number(v.toPrecision(12)));
  return { ticks: out, min: graphMin, max: graphMax };
}

export function tTest(a: number[], b?: number[]) {
  if (!b) {
    const m = mean(a);
    const s = sd(a);
    const t = m / (s / Math.sqrt(a.length));
    const df = a.length - 1;
    return { t, df, p: twoTailedP(t, df), mean: m };
  }
  const m1 = mean(a);
  const m2 = mean(b);
  const s1 = variance(a);
  const s2 = variance(b);
  const n1 = a.length;
  const n2 = b.length;
  const sp = Math.sqrt(((n1 - 1) * s1 + (n2 - 1) * s2) / (n1 + n2 - 2));
  const t = (m1 - m2) / (sp * Math.sqrt(1 / n1 + 1 / n2));
  const df = n1 + n2 - 2;
  return { t, df, p: twoTailedP(t, df), mean1: m1, mean2: m2 };
}

export function anova(groups: number[][]) {
  const k = groups.length;
  const N = groups.reduce((s, g) => s + g.length, 0);
  const grand = mean(groups.flat());
  let ssb = 0;
  let ssw = 0;
  for (const g of groups) {
    const m = mean(g);
    ssb += g.length * (m - grand) ** 2;
    ssw += g.reduce((s, v) => s + (v - m) ** 2, 0);
  }
  const dfb = k - 1;
  const dfw = N - k;
  const msb = ssb / dfb;
  const msw = ssw / dfw;
  const F = msb / msw;
  return { F, dfb, dfw, p: fP(F, dfb, dfw), ssb, ssw };
}

function erf(x: number) {
  const s = Math.sign(x);
  const a = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * a);
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
      t *
      Math.exp(-a * a);
  return s * y;
}

function twoTailedP(t: number, df: number) {
  const x = df / (df + t * t);
  const a = 0.5 * incBeta(x, df / 2, 0.5);
  return Math.min(1, Math.max(0, 2 * a));
}

function incBeta(x: number, a: number, b: number) {
  const bt =
    x === 0 || x === 1
      ? 0
      : Math.exp(
          gammaln(a + b) - gammaln(a) - gammaln(b) + a * Math.log(x) + b * Math.log(1 - x),
        );
  if (x < (a + 1) / (a + b + 2)) return (bt * betacf(x, a, b)) / a;
  return 1 - (bt * betacf(1 - x, b, a)) / b;
}

function betacf(x: number, a: number, b: number) {
  const maxIt = 100;
  const eps = 3e-7;
  let am = 1;
  let bm = 1;
  let az = 1;
  let qab = a + b;
  let qap = a + 1;
  let qam = a - 1;
  let bz = 1 - (qab * x) / qap;
  for (let m = 1; m <= maxIt; m++) {
    const em = m;
    const tem = em + em;
    let d = (em * (b - m) * x) / ((qam + tem) * (a + tem));
    let ap = az + d * am;
    let bp = bz + d * bm;
    d = (-(a + em) * (qab + em) * x) / ((a + tem) * (qap + tem));
    const app = ap + d * az;
    const bpp = bp + d * bz;
    const aold = az;
    am = ap / bpp;
    bm = bp / bpp;
    az = app / bpp;
    bz = 1;
    if (Math.abs(az - aold) < eps * Math.abs(az)) return az;
  }
  return az;
}

function gammaln(z: number) {
  const c = [
    76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155,
    0.001208650973866179, -5.395239384953e-6,
  ];
  let x = z;
  let y = z;
  let tmp = x + 5.5;
  tmp -= (x + 0.5) * Math.log(tmp);
  let ser = 1.000000000190015;
  for (let j = 0; j < 6; j++) ser += c[j] / ++y;
  return Math.log((2.5066282746310005 * ser) / x) - tmp;
}

function fP(F: number, d1: number, d2: number) {
  if (!(F > 0)) return 1;
  const x = d2 / (d2 + d1 * F);
  return incBeta(x, d2 / 2, d1 / 2);
}

export function skewness(a: number[]) {
  const m = mean(a);
  const s = sd(a) || 1;
  return mean(a.map((v) => ((v - m) / s) ** 3));
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export { erf };
