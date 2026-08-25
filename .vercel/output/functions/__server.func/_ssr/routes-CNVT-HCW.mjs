import { i as __toESM } from "../_runtime.mjs";
import { L as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Plus, c as Download, i as RotateCcw, l as ChartColumn, o as FlaskConical, r as SlidersHorizontal, s as FileSpreadsheet, t as Upload, u as Activity } from "../_libs/lucide-react.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CNVT-HCW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid(prefix = "id") {
	return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
function downloadBlob(blob, filename) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.rel = "noopener";
	document.body.appendChild(a);
	a.click();
	a.remove();
	setTimeout(() => URL.revokeObjectURL(url), 1500);
}
var PALETTE = [
	"#3d6b8a",
	"#c47a4a",
	"#5a8f6d",
	"#8a5a72",
	"#b0a056",
	"#6a7ca0",
	"#8c6b4a",
	"#4a8a8a"
];
function col(name, designation, values, unit = "") {
	return {
		id: uid("col"),
		name,
		unit,
		designation,
		values
	};
}
function linspace$1(a, b, n) {
	return Array.from({ length: n }, (_, i) => a + (b - a) * i / (n - 1));
}
function noise(s = 1) {
	return (Math.random() + Math.random() + Math.random() - 1.5) * s;
}
function sampleSpectra() {
	const x = linspace$1(400, 800, 401);
	const y = x.map((w) => {
		const g1 = 1.8 * Math.exp(-((w - 480) ** 2) / 288);
		const g2 = 2.4 * Math.exp(-((w - 532) ** 2) / 128);
		const g3 = 1.2 * Math.exp(-((w - 640) ** 2) / 648);
		const g4 = .7 * Math.exp(-((w - 720) ** 2) / 200);
		return g1 + g2 + g3 + g4 + .08 + noise(.03);
	});
	return {
		id: uid("sheet"),
		name: "UV-Vis spectrum",
		columns: [col("Wavelength", "X", x, "nm"), col("Absorbance", "Y", y, "a.u.")]
	};
}
function sampleKinetics() {
	const t = linspace$1(0, 40, 81);
	const y = t.map((ti) => 2.1 * (1 - Math.exp(-.18 * ti)) + noise(.04));
	const y2 = t.map((ti) => 1.7 * (1 - Math.exp(-.11 * ti)) + noise(.04));
	return {
		id: uid("sheet"),
		name: "Kinetics",
		columns: [
			col("Time", "X", t, "min"),
			col("Run A", "Y", y, "mM"),
			col("Run B", "Y", y2, "mM")
		]
	};
}
function sampleArrhenius() {
	const T = linspace$1(280, 360, 17);
	const k = T.map((ti) => 12e6 * Math.exp(-5200 / ti) * (1 + noise(.04)));
	return {
		id: uid("sheet"),
		name: "Arrhenius",
		columns: [col("T", "X", T, "K"), col("k", "Y", k, "s⁻¹")]
	};
}
function sampleDose() {
	const conc = [
		.01,
		.03,
		.1,
		.3,
		1,
		3,
		10,
		30,
		100
	];
	const resp = conc.map((c) => 12 + 78 / (1 + Math.exp(-(Math.log10(c) - .4) / .28)) + noise(2));
	const err = conc.map(() => 2.4);
	return {
		id: uid("sheet"),
		name: "Dose-response",
		columns: [
			col("Dose", "X", conc, "µM"),
			col("Response", "Y", resp, "%"),
			col("SEM", "YErr", err, "%")
		]
	};
}
function sampleGrouped() {
	const groups = [
		"Control",
		"Low",
		"Mid",
		"High"
	];
	const x = [];
	const y = [];
	const lab = [];
	groups.forEach((g, gi) => {
		for (let i = 0; i < 12; i++) {
			x.push(gi + 1);
			y.push(4.2 + gi * 1.6 + noise(.9));
			lab.push(gi);
		}
	});
	return {
		id: uid("sheet"),
		name: "Grouped assay",
		columns: [
			col("GroupIndex", "X", x, ""),
			col("Score", "Y", y, ""),
			col("Group", "Label", lab, "")
		]
	};
}
function sampleSurface() {
	const n = 24;
	const X = [];
	const Y = [];
	const Z = [];
	for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
		const x = -3 + 6 * i / 23;
		const y = -3 + 6 * j / 23;
		const z = 2.2 * Math.exp(-(x * x + y * y) / 2.2) + 1.1 * Math.exp(-((x - 1.6) ** 2 + (y + .8) ** 2) / .9);
		X.push(x);
		Y.push(y);
		Z.push(z);
	}
	return {
		id: uid("sheet"),
		name: "Surface XYZ",
		columns: [
			col("X", "X", X),
			col("Y", "Y", Y),
			col("Z", "Z", Z)
		]
	};
}
function sampleOscillator() {
	const t = linspace$1(0, 8 * Math.PI, 320);
	const y = t.map((ti) => Math.sin(ti) + .35 * Math.sin(3 * ti + .4) + noise(.08));
	return {
		id: uid("sheet"),
		name: "Oscillator",
		columns: [col("t", "X", t, "s"), col("Signal", "Y", y, "V")]
	};
}
var SAMPLE_LOADERS = [
	{
		id: "spectra",
		label: "UV-Vis peaks",
		load: sampleSpectra,
		type: "line"
	},
	{
		id: "kinetics",
		label: "Kinetics (2 runs)",
		load: sampleKinetics,
		type: "lineSymbol"
	},
	{
		id: "arrhenius",
		label: "Arrhenius",
		load: sampleArrhenius,
		type: "scatter"
	},
	{
		id: "dose",
		label: "Dose-response",
		load: sampleDose,
		type: "errorBar"
	},
	{
		id: "grouped",
		label: "Grouped assay",
		load: sampleGrouped,
		type: "box"
	},
	{
		id: "surface",
		label: "3D surface",
		load: sampleSurface,
		type: "surface3d"
	},
	{
		id: "osc",
		label: "Oscillator / FFT",
		load: sampleOscillator,
		type: "line"
	}
];
function isFiniteNum$1(n) {
	return typeof n === "number" && Number.isFinite(n);
}
function pairs(xs, ys) {
	const out = [];
	const n = Math.min(xs.length, ys.length);
	for (let i = 0; i < n; i++) {
		const x = xs[i];
		const y = ys[i];
		if (isFiniteNum$1(x) && isFiniteNum$1(y)) out.push({
			x,
			y
		});
	}
	return out;
}
function nums(vs) {
	return vs.filter(isFiniteNum$1);
}
function mean(a) {
	if (!a.length) return NaN;
	return a.reduce((s, v) => s + v, 0) / a.length;
}
function variance(a, sample = true) {
	if (a.length < 2) return 0;
	const m = mean(a);
	return a.reduce((s, v) => s + (v - m) ** 2, 0) / (sample ? a.length - 1 : a.length);
}
function sd(a) {
	return Math.sqrt(variance(a));
}
function quantile(a, q) {
	if (!a.length) return NaN;
	const s = [...a].sort((x, y) => x - y);
	const pos = (s.length - 1) * q;
	const b = Math.floor(pos);
	const rest = pos - b;
	return s[b + 1] !== void 0 ? s[b] + rest * (s[b + 1] - s[b]) : s[b];
}
function median(a) {
	return quantile(a, .5);
}
function linreg(x, y) {
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
	const r2 = sxy * sxy / (sxx * syy);
	const sse = syy - slope * sxy;
	const seSlope = Math.sqrt(sse / (n - 2) / sxx);
	return {
		slope,
		intercept,
		r2,
		seSlope,
		seInt: seSlope * Math.sqrt(mean(x.slice(0, n).map((v) => v * v))),
		n,
		sse
	};
}
function polyfit(x, y, deg) {
	const n = Math.min(x.length, y.length);
	const m = deg + 1;
	const A = Array.from({ length: m }, () => Array(m).fill(0));
	const b = Array(m).fill(0);
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
	return solve(A, b);
}
function polyval(coeff, x) {
	let y = 0;
	let p = 1;
	for (const c of coeff) {
		y += c * p;
		p *= x;
	}
	return y;
}
function solve(A, b) {
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
function r2Score(y, yhat) {
	const my = mean(y);
	let sst = 0;
	let sse = 0;
	for (let i = 0; i < y.length; i++) {
		sst += (y[i] - my) ** 2;
		sse += (y[i] - yhat[i]) ** 2;
	}
	return 1 - sse / sst;
}
function rmse(y, yhat) {
	let s = 0;
	for (let i = 0; i < y.length; i++) s += (y[i] - yhat[i]) ** 2;
	return Math.sqrt(s / y.length);
}
/** Levenberg–Marquardt nonlinear least squares. */
function nls(x, y, model, p0, maxIter = 80) {
	let p = [...p0];
	let lambda = .001;
	const m = p.length;
	const n = Math.min(x.length, y.length);
	const jac = (pp, xi) => {
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
	const cost = (pp) => {
		let s = 0;
		for (let i = 0; i < n; i++) {
			const e = y[i] - model(pp, x[i]);
			s += e * e;
		}
		return s;
	};
	let c = cost(p);
	for (let it = 0; it < maxIter; it++) {
		const JtJ = Array.from({ length: m }, () => Array(m).fill(0));
		const Jtr = Array(m).fill(0);
		for (let i = 0; i < n; i++) {
			const g = jac(p, x[i]);
			const r = y[i] - model(p, x[i]);
			for (let j = 0; j < m; j++) {
				Jtr[j] += g[j] * r;
				for (let k = 0; k < m; k++) JtJ[j][k] += g[j] * g[k];
			}
		}
		for (let j = 0; j < m; j++) JtJ[j][j] *= 1 + lambda;
		let dp;
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
			lambda *= .3;
			if (Math.sqrt(dp.reduce((s, v) => s + v * v, 0)) < 1e-10) break;
		} else {
			lambda *= 3;
			if (lambda > 0xe8d4a51000) break;
		}
	}
	const yhat = x.slice(0, n).map((xi) => model(p, xi));
	const resid = y.slice(0, n).map((yi, i) => yi - yhat[i]);
	const sse = resid.reduce((s, v) => s + v * v, 0);
	const sigma2 = sse / Math.max(1, n - m);
	const JtJ = Array.from({ length: m }, () => Array(m).fill(0));
	for (let i = 0; i < n; i++) {
		const g = jac(p, x[i]);
		for (let j = 0; j < m; j++) for (let k = 0; k < m; k++) JtJ[j][k] += g[j] * g[k];
	}
	const I = Array.from({ length: m }, (_, i) => Array.from({ length: m }, (__, j) => i === j ? 1 : 0));
	let cov = I;
	try {
		cov = I.map((row) => solve(JtJ, row));
	} catch {}
	const paramErrors = cov.map((row, i) => Math.sqrt(Math.max(0, row[i] * sigma2)));
	return {
		params: p,
		yhat,
		resid,
		paramErrors,
		sse
	};
}
function movingAverage(y, win) {
	const w = Math.max(1, win | 0);
	const half = Math.floor(w / 2);
	return y.map((_, i) => {
		let s = 0;
		let c = 0;
		for (let k = i - half; k <= i + half; k++) if (k >= 0 && k < y.length) {
			s += y[k];
			c++;
		}
		return s / c;
	});
}
function trapz(x, y) {
	let a = 0;
	const cum = [0];
	for (let i = 1; i < y.length; i++) {
		a += .5 * (y[i] + y[i - 1]) * (x[i] - x[i - 1]);
		cum.push(a);
	}
	return {
		area: a,
		cum
	};
}
function fftMag(y) {
	const n = 1 << Math.ceil(Math.log2(Math.max(2, y.length)));
	const re = Array(n).fill(0);
	const im = Array(n).fill(0);
	for (let i = 0; i < y.length; i++) re[i] = y[i];
	const bits = Math.log2(n);
	for (let i = 0; i < n; i++) {
		let rev = 0;
		for (let b = 0; b < bits; b++) if (i & 1 << b) rev |= 1 << bits - 1 - b;
		if (i < rev) {
			[re[i], re[rev]] = [re[rev], re[i]];
			[im[i], im[rev]] = [im[rev], im[i]];
		}
	}
	for (let len = 2; len <= n; len <<= 1) {
		const ang = -2 * Math.PI / len;
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
	return re.map((r, i) => Math.hypot(r, im[i]) / n).slice(0, n / 2);
}
function findPeaks(x, y, minProm = 0) {
	const peaks = [];
	const ymax = Math.max(...y);
	const floor = minProm || ymax * .08;
	for (let i = 1; i < y.length - 1; i++) if (y[i] >= y[i - 1] && y[i] > y[i + 1] && y[i] - Math.min(...y) > floor) {
		let l = i;
		let r = i;
		while (l > 0 && y[l] >= y[l - 1] * .5) l--;
		while (r < y.length - 1 && y[r] >= y[r + 1] * .5) r++;
		const half = y[i] / 2;
		let li = i;
		let ri = i;
		while (li > 0 && y[li] > half) li--;
		while (ri < y.length - 1 && y[ri] > half) ri++;
		const fwhm = Math.abs(x[ri] - x[li]);
		const leftMin = Math.min(...y.slice(Math.max(0, i - 20), i + 1));
		const rightMin = Math.min(...y.slice(i, Math.min(y.length, i + 21)));
		const prominence = y[i] - Math.max(leftMin, rightMin) * .5;
		peaks.push({
			index: i,
			x: x[i],
			y: y[i],
			prominence,
			fwhm
		});
	}
	peaks.sort((a, b) => b.y - a.y);
	return peaks;
}
function niceNum(range, round) {
	const exp = Math.floor(Math.log10(range || 1));
	const f = range / 10 ** exp;
	let nf;
	if (round) {
		if (f < 1.5) nf = 1;
		else if (f < 3) nf = 2;
		else if (f < 7) nf = 5;
		else nf = 10;
	} else if (f <= 1) nf = 1;
	else if (f <= 2) nf = 2;
	else if (f <= 5) nf = 5;
	else nf = 10;
	return nf * 10 ** exp;
}
function ticks(min, max, n = 6) {
	const d = niceNum(niceNum(max - min || 1, false) / (n - 1), true);
	const graphMin = Math.floor(min / d) * d;
	const graphMax = Math.ceil(max / d) * d;
	const out = [];
	for (let v = graphMin; v <= graphMax + d * .5; v += d) out.push(Number(v.toPrecision(12)));
	return {
		ticks: out,
		min: graphMin,
		max: graphMax
	};
}
function skewness(a) {
	const m = mean(a);
	const s = sd(a) || 1;
	return mean(a.map((v) => ((v - m) / s) ** 3));
}
function alignedXY(xCol, yCol) {
	if (!xCol || !yCol) return {
		x: [],
		y: []
	};
	const pts = pairs(xCol.values, yCol.values).sort((a, b) => a.x - b.x);
	return {
		x: pts.map((p) => p.x),
		y: pts.map((p) => p.y)
	};
}
function describe(vs) {
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
		q1: quantile(a, .25),
		q3: quantile(a, .75),
		skew: skewness(a)
	};
}
function pack(model, params, names, errors, x, y, yHat, equation) {
	const residuals = y.map((yi, i) => yi - yHat[i]);
	const r2 = r2Score(y, yHat);
	const err = rmse(y, yHat);
	return {
		model,
		params,
		paramNames: names,
		paramErrors: errors,
		r2,
		rmse: err,
		aic: y.length * Math.log(Math.max(1e-18, err * err)) + 2 * params.length,
		n: y.length,
		equation,
		yHat,
		residuals,
		x,
		y
	};
}
function fitModel(model, x, y) {
	if (x.length < 3) throw new Error("Need at least 3 points to fit.");
	if (model === "linear") {
		const lr = linreg(x, y);
		const yHat = x.map((xi) => lr.slope * xi + lr.intercept);
		return pack(model, [lr.intercept, lr.slope], ["a", "b"], [lr.seInt, lr.seSlope], x, y, yHat, `y = ${lr.intercept.toPrecision(4)} + ${lr.slope.toPrecision(4)} x`);
	}
	if (model.startsWith("poly")) {
		const c = polyfit(x, y, Number(model.slice(4)));
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
			0
		]);
		const [a, b, c] = res.params;
		return pack(model, res.params, [
			"a",
			"b",
			"c"
		], res.paramErrors, x, y, res.yhat, `y = ${a.toPrecision(4)} exp(${b.toPrecision(4)} x) + ${c.toPrecision(4)}`);
	}
	if (model === "log") {
		const xx = x.map((v) => Math.log(Math.max(1e-12, Math.abs(v))));
		const lr = linreg(xx, y);
		const yHat = xx.map((xi) => lr.slope * xi + lr.intercept);
		return pack(model, [lr.intercept, lr.slope], ["a", "b"], [lr.seInt, lr.seSlope], x, y, yHat, `y = ${lr.intercept.toPrecision(4)} + ${lr.slope.toPrecision(4)} ln(x)`);
	}
	if (model === "power") {
		const lr = linreg(x.map((v) => Math.log(Math.max(1e-12, Math.abs(v)))), y.map((v) => Math.log(Math.max(1e-12, Math.abs(v)))));
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
		const use = peaks.length ? peaks : [{
			x: x[imax],
			y: ymax,
			fwhm: (x.at(-1) - x[0]) / 8,
			index: imax,
			prominence: ymax
		}];
		const p0 = [ymin];
		const names = ["y0"];
		use.forEach((pk, i) => {
			p0.push(pk.y - ymin, pk.x, Math.max(1e-6, pk.fwhm / 2.355));
			names.push(`A${i + 1}`, `μ${i + 1}`, `σ${i + 1}`);
		});
		const fn = (p, xi) => {
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
		const eq = res.params.slice(1).reduce((s, _, i, arr) => {
			if (i % 3) return s;
			return s + ` + ${arr[i].toPrecision(3)} exp(-((x-${arr[i + 1].toPrecision(3)})^2)/(2 ${arr[i + 2].toPrecision(3)}^2))`;
		}, res.params[0].toPrecision(3));
		return pack(model === "gauss" ? "gauss" : "multigauss", res.params, names, res.paramErrors, x, y, res.yhat, `y = ${eq}`);
	}
	if (model === "lorentz") {
		const ymax = Math.max(...y);
		const imax = y.indexOf(ymax);
		const res = nls(x, y, (p, xi) => p[0] + p[1] * p[3] ** 2 / ((xi - p[2]) ** 2 + p[3] ** 2), [
			Math.min(...y),
			ymax - Math.min(...y),
			x[imax],
			(x.at(-1) - x[0]) / 20
		]);
		const [y0, A, mu, g] = res.params;
		return pack(model, res.params, [
			"y0",
			"A",
			"μ",
			"γ"
		], res.paramErrors, x, y, res.yhat, `y = ${y0.toPrecision(3)} + ${A.toPrecision(3)} γ² / ((x-${mu.toPrecision(3)})² + γ²), γ=${g.toPrecision(3)}`);
	}
	if (model === "logistic") {
		const ymin = Math.min(...y);
		const ymax = Math.max(...y);
		const mid = x[Math.floor(x.length / 2)];
		const res = nls(x, y, (p, xi) => p[0] + p[1] / (1 + Math.exp(-(xi - p[2]) / p[3])), [
			ymin,
			ymax - ymin,
			mid,
			(x.at(-1) - x[0]) / 8
		]);
		const [a, b, c, d] = res.params;
		return pack(model, res.params, [
			"A",
			"B",
			"x0",
			"k"
		], res.paramErrors, x, y, res.yhat, `y = ${a.toPrecision(3)} + ${b.toPrecision(3)} / (1 + exp(-(x-${c.toPrecision(3)})/${d.toPrecision(3)}))`);
	}
	if (model === "sine") {
		const my = mean(y);
		const amp = (Math.max(...y) - Math.min(...y)) / 2;
		const span = x.at(-1) - x[0];
		const res = nls(x, y, (p, xi) => p[0] + p[1] * Math.sin(p[2] * xi + p[3]), [
			my,
			amp,
			2 * Math.PI / (span / 4 || 1),
			0
		]);
		const [a, b, w, ph] = res.params;
		return pack(model, res.params, [
			"offset",
			"amp",
			"ω",
			"φ"
		], res.paramErrors, x, y, res.yhat, `y = ${a.toPrecision(3)} + ${b.toPrecision(3)} sin(${w.toPrecision(3)} x + ${ph.toPrecision(3)})`);
	}
	throw new Error("Unknown model");
}
function peaksFrom(x, y) {
	return findPeaks(x, y).map((p) => {
		const half = p.y / 2;
		let l = p.index;
		let r = p.index;
		while (l > 0 && y[l] > half) l--;
		while (r < y.length - 1 && y[r] > half) r++;
		let area = 0;
		for (let i = l + 1; i <= r; i++) area += .5 * (y[i] + y[i - 1]) * (x[i] - x[i - 1]);
		return {
			...p,
			area
		};
	});
}
function smoothY(y, win = 7) {
	return movingAverage(y, win);
}
function integXY(x, y) {
	return trapz(x, y);
}
function fftColumn(y) {
	return fftMag(y);
}
function baselineLinear(x, y) {
	const a = y[0];
	const b = y.at(-1);
	const x0 = x[0];
	const x1 = x.at(-1);
	return y.map((yi, i) => yi - (a + (b - a) * (x[i] - x0) / (x1 - x0 || 1)));
}
function normalizeMax(y) {
	const m = Math.max(...y.map(Math.abs), 1e-12);
	return y.map((v) => v / m);
}
function fmt(n, d = 4) {
	if (!Number.isFinite(n)) return "—";
	const a = Math.abs(n);
	if (a !== 0 && (a < .001 || a >= 1e5)) return n.toExponential(d - 1);
	return n.toPrecision(d);
}
var THEMES = {
	publication: {
		paper: "#f7f4ec",
		ink: "#1c2128",
		grid: "rgba(28,33,40,0.10)",
		frame: "#1c2128",
		muted: "#5c6370"
	},
	night: {
		paper: "#10151b",
		ink: "#e6ebe8",
		grid: "rgba(230,235,232,0.08)",
		frame: "#9eb0c4",
		muted: "#8d9399"
	},
	journal: {
		paper: "#ffffff",
		ink: "#111111",
		grid: "rgba(0,0,0,0.08)",
		frame: "#111111",
		muted: "#555555"
	}
};
function styleFor(g, colId, i) {
	return g.series[colId] ?? {
		color: PALETTE[i % PALETTE.length],
		symbol: "circle",
		lineWidth: 1.6,
		lineStyle: "solid",
		fillOpacity: .18
	};
}
function mapLin(v, a, b, A, B) {
	if (b === a) return (A + B) / 2;
	return A + (v - a) / (b - a) * (B - A);
}
function mapX(v, min, max, L, R, log) {
	if (log) return mapLin(Math.log10(Math.max(1e-12, v)), Math.log10(Math.max(1e-12, min)), Math.log10(Math.max(1e-12, max)), L, R);
	return mapLin(v, min, max, L, R);
}
function mapY(v, min, max, T, B, log) {
	if (log) return mapLin(Math.log10(Math.max(1e-12, v)), Math.log10(Math.max(1e-12, min)), Math.log10(Math.max(1e-12, max)), B, T);
	return mapLin(v, min, max, B, T);
}
function dash(ctx, style) {
	if (style === "dash") ctx.setLineDash([6, 4]);
	else if (style === "dot") ctx.setLineDash([1.5, 3.5]);
	else ctx.setLineDash([]);
}
function symbol(ctx, kind, x, y, r, color) {
	if (kind === "none") return;
	ctx.beginPath();
	ctx.strokeStyle = color;
	ctx.fillStyle = color;
	if (kind === "circle") {
		ctx.arc(x, y, r, 0, Math.PI * 2);
		ctx.fill();
	} else if (kind === "square") ctx.fillRect(x - r, y - r, r * 2, r * 2);
	else if (kind === "triangle") {
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
function dataBounds(g, cols) {
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
	const dx = (xmax - xmin) * .04;
	const dy = (ymax - ymin) * .08;
	return {
		xmin: xmin - dx,
		xmax: xmax + dx,
		ymin: ymin - dy,
		ymax: ymax + dy
	};
}
function renderGraph(canvas, g, cols, hoverPx) {
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
	let hover = null;
	for (let p = 0; p < panels; p++) {
		const pr = Math.floor(p / colsN);
		const pc = p % colsN;
		const pw = w / colsN;
		const ph = h / rows;
		const ox = pc * pw;
		const oy = pr * ph;
		const yIds = panels === 1 ? ySets : ySets.length ? [ySets[p % ySets.length]] : [];
		const hov = drawPanel(ctx, {
			...g,
			yColIds: yIds.length ? yIds : g.yColIds
		}, cols, ox, oy, pw, ph, th, hoverPx);
		if (hov) hover = hov;
	}
	return hover;
}
function drawPanel(ctx, g, cols, ox, oy, w, h, th, hoverPx) {
	const m = {
		l: 58,
		r: 18,
		t: 36,
		b: 46
	};
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
	if (g.type === "surface3d" || g.type === "scatter3d" || g.type === "heatmap" || g.type === "contour") return drawField(ctx, g, cols, L, T, R, B, th);
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
	const hoverBox = { v: null };
	if (g.type === "histogram") yCols.forEach((yc, i) => {
		const st = styleFor(g, yc.id, i);
		const vals = nums(yc.values);
		const bins = 18;
		const lo = Math.min(...vals);
		const hi = Math.max(...vals);
		const counts = Array(bins).fill(0);
		vals.forEach((v) => {
			const bi = Math.min(17, Math.floor((v - lo) / (hi - lo || 1) * bins));
			counts[bi]++;
		});
		const maxc = Math.max(...counts, 1);
		const bw = (R - L) / bins;
		counts.forEach((c, bi) => {
			const x = L + bi * bw;
			const bh = c / maxc * (B - T) * .92;
			ctx.fillStyle = st.color;
			ctx.globalAlpha = .85;
			ctx.fillRect(x + 1, B - bh, bw - 2, bh);
			ctx.globalAlpha = 1;
		});
	});
	else if (g.type === "box" || g.type === "violin") yCols.forEach((yc, i) => {
		const st = styleFor(g, yc.id, i);
		const vals = nums(yc.values).sort((a, b) => a - b);
		if (!vals.length) return;
		const q1 = quantileLocal(vals, .25);
		const q2 = quantileLocal(vals, .5);
		const q3 = quantileLocal(vals, .75);
		const slot = (R - L) / (yCols.length + 1);
		const cx = L + slot * (i + 1);
		const boxW = Math.min(42, slot * .45);
		const yq1 = mapY(q1, ymin, ymax, T, B, g.logY);
		const yq2 = mapY(q2, ymin, ymax, T, B, g.logY);
		const yq3 = mapY(q3, ymin, ymax, T, B, g.logY);
		const yw = mapY(vals[0], ymin, ymax, T, B, g.logY);
		const yh = mapY(vals.at(-1), ymin, ymax, T, B, g.logY);
		ctx.strokeStyle = st.color;
		ctx.fillStyle = st.color;
		ctx.lineWidth = 1.4;
		ctx.beginPath();
		ctx.moveTo(cx, yw);
		ctx.lineTo(cx, yh);
		ctx.stroke();
		ctx.globalAlpha = .25;
		ctx.fillRect(cx - boxW / 2, yq3, boxW, yq1 - yq3);
		ctx.globalAlpha = 1;
		ctx.strokeRect(cx - boxW / 2, yq3, boxW, yq1 - yq3);
		ctx.beginPath();
		ctx.moveTo(cx - boxW / 2, yq2);
		ctx.lineTo(cx + boxW / 2, yq2);
		ctx.stroke();
		if (g.type === "violin") {
			ctx.globalAlpha = .2;
			ctx.beginPath();
			ctx.ellipse(cx, (yq1 + yq3) / 2, boxW * .7, Math.abs(yq1 - yq3) * .9, 0, 0, Math.PI * 2);
			ctx.fill();
			ctx.globalAlpha = 1;
		}
	});
	else if (g.type === "column" || g.type === "stackedColumn" || g.type === "waterfall") {
		const n = (xCol ? nums(xCol.values) : yCols[0] ? yCols[0].values.map((_, i) => i + 1) : []).length;
		const groupW = (R - L) / Math.max(1, n);
		for (let i = 0; i < n; i++) {
			let acc = 0;
			yCols.forEach((yc, si) => {
				const st = styleFor(g, yc.id, si);
				const v = Number(yc.values[i] ?? 0);
				const base = g.type === "stackedColumn" || g.type === "waterfall" ? acc : 0;
				const y0 = mapY(base, ymin, ymax, T, B, false);
				const y1 = mapY(base + v, ymin, ymax, T, B, false);
				const bw = g.type === "column" ? groupW / (yCols.length + .4) : groupW * .62;
				const x0 = L + i * groupW + (g.type === "column" ? si * bw + groupW * .15 : groupW * .19);
				ctx.fillStyle = st.color;
				ctx.globalAlpha = .88;
				ctx.fillRect(x0, Math.min(y0, y1), bw * .9, Math.abs(y1 - y0));
				ctx.globalAlpha = 1;
				if (g.type === "stackedColumn" || g.type === "waterfall") acc += v;
			});
		}
	} else yCols.forEach((yc, i) => {
		const st = styleFor(g, yc.id, i);
		const { x, y } = alignedXY(xCol, yc);
		const errCol = g.yErrColId ? cols.find((c) => c.id === g.yErrColId) : void 0;
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
					mapX(x[k - 1], xmin, xmax, L, R, g.logX);
					ctx.lineTo(px, mapY(y[k - 1], ymin, ymax, T, B, g.logY));
					ctx.lineTo(px, py);
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
			if (g.type === "scatter" || g.type === "lineSymbol" || g.type === "errorBar" || g.type === "density" || g.type === "residual") {
				const r = g.type === "density" ? 2.2 : 3.1;
				symbol(ctx, st.symbol === "none" ? "circle" : st.symbol, px, py, r, st.color);
			}
			if (hoverPx) {
				if (Math.hypot(hoverPx.x - px, hoverPx.y - py) < 10) hoverBox.v = {
					x: xi,
					y: y[k],
					label: yc.name,
					px,
					py
				};
			}
		});
	});
	if (g.fitOverlay && g.fitOverlay.x.length) {
		ctx.strokeStyle = "#c47a4a";
		ctx.lineWidth = 1.8;
		ctx.setLineDash([]);
		ctx.beginPath();
		const xs = linspace(g.fitOverlay.x[0], g.fitOverlay.x.at(-1), 200);
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
			ctx.fillStyle = styleFor(g, yc.id, i).color;
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
function drawPie(ctx, g, cols, L, T, R, B, th) {
	const yc = cols.find((c) => g.yColIds.includes(c.id));
	if (!yc) return null;
	const vals = nums(yc.values).map((v) => Math.abs(v));
	const sum = vals.reduce((s, v) => s + v, 0) || 1;
	const cx = (L + R) / 2;
	const cy = (T + B) / 2;
	const r = Math.min(R - L, B - T) * .36;
	let a = -Math.PI / 2;
	vals.forEach((v, i) => {
		const da = v / sum * Math.PI * 2;
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
function drawPolar(ctx, g, cols, L, T, R, B, th) {
	const cx = (L + R) / 2;
	const cy = (T + B) / 2;
	const r = Math.min(R - L, B - T) * .38;
	ctx.strokeStyle = th.grid;
	for (let i = 1; i <= 4; i++) {
		ctx.beginPath();
		ctx.arc(cx, cy, r * i / 4, 0, Math.PI * 2);
		ctx.stroke();
	}
	for (let k = 0; k < 8; k++) {
		const a = k * Math.PI / 4;
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
		const rr = Math.abs(y[i]) / rmax * r;
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
function drawTernary(ctx, g, cols, L, T, R, B, th) {
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
		if (![
			a,
			b,
			c
		].every(Number.isFinite)) continue;
		const s = a + b + c || 1;
		const px = a / s * ax + b / s * bx + c / s * cx;
		const py = a / s * ay + b / s * by + c / s * cy;
		ctx.beginPath();
		ctx.arc(px, py, 3, 0, Math.PI * 2);
		ctx.fill();
	}
	return null;
}
function drawField(ctx, g, cols, L, T, R, B, th) {
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
	const pts = [];
	for (let i = 0; i < n; i++) {
		const x = xCol.values[i];
		const y = yCol.values[i];
		const z = zCol.values[i];
		if (typeof x === "number" && typeof y === "number" && typeof z === "number") pts.push({
			x,
			y,
			z
		});
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
			ctx.fillStyle = heat((p.z - zmin) / (zmax - zmin || 1));
			ctx.fillRect(px - size / 2, py - size / 2, 5, 5);
		});
		if (g.type === "contour") {
			ctx.strokeStyle = th.ink;
			ctx.globalAlpha = .35;
			ctx.lineWidth = .8;
			for (let k = 1; k <= 5; k++) {
				const level = zmin + k / 6 * (zmax - zmin);
				ctx.beginPath();
				let started = false;
				pts.forEach((p) => {
					if (Math.abs(p.z - level) < (zmax - zmin) * .03) {
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
	const rx = g.rotX * Math.PI / 180;
	const rz = g.rotZ * Math.PI / 180;
	const project = (p) => {
		const nx = (p.x - xmin) / (xmax - xmin || 1) * 2 - 1;
		const ny = (p.y - ymin) / (ymax - ymin || 1) * 2 - 1;
		const nz = (p.z - zmin) / (zmax - zmin || 1) * 2 - 1;
		const x1 = nx * Math.cos(rz) - ny * Math.sin(rz);
		const y1 = nx * Math.sin(rz) + ny * Math.cos(rz);
		const y2 = y1 * Math.cos(rx) - nz * Math.sin(rx);
		const z2 = y1 * Math.sin(rx) + nz * Math.cos(rx);
		const cx = (L + R) / 2;
		const cy = (T + B) / 2;
		const s = Math.min(R - L, B - T) * .38;
		return {
			px: cx + x1 * s,
			py: cy + y2 * s,
			depth: z2,
			z: p.z
		};
	};
	pts.map(project).sort((a, b) => a.depth - b.depth).forEach((p) => {
		ctx.fillStyle = heat((p.z - zmin) / (zmax - zmin || 1));
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
function heat(t) {
	const u = Math.min(1, Math.max(0, t));
	return `rgb(${Math.round(30 + 180 * u)},${Math.round(60 + 80 * (1 - Math.abs(u - .5) * 2))},${Math.round(140 - 90 * u)})`;
}
function drawColorbar(ctx, x, T, B, zmin, zmax, th) {
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
function formatTick(v) {
	if (!Number.isFinite(v)) return "";
	const a = Math.abs(v);
	if (a !== 0 && (a < .01 || a >= 1e4)) return v.toExponential(1);
	return String(Number(v.toPrecision(4)));
}
function quantileLocal(s, q) {
	const pos = (s.length - 1) * q;
	const b = Math.floor(pos);
	const rest = pos - b;
	return s[b + 1] !== void 0 ? s[b] + rest * (s[b + 1] - s[b]) : s[b];
}
function linspace(a, b, n) {
	return Array.from({ length: n }, (_, i) => a + (b - a) * i / (n - 1));
}
function interpFit(model, xi) {
	const x = model.x;
	const y = model.yHat;
	if (xi <= x[0]) return y[0];
	if (xi >= x.at(-1)) return y.at(-1);
	let i = 1;
	while (i < x.length && x[i] < xi) i++;
	const t = (xi - x[i - 1]) / (x[i] - x[i - 1] || 1);
	return y[i - 1] + t * (y[i] - y[i - 1]);
}
function isFiniteNum(n) {
	return typeof n === "number" && Number.isFinite(n);
}
function sheetToCsv(sheet) {
	const n = Math.max(0, ...sheet.columns.map((c) => c.values.length));
	const rows = [sheet.columns.map((c) => csvEscape(`${c.name}${c.unit ? ` (${c.unit})` : ""}`)).join(",")];
	for (let i = 0; i < n; i++) rows.push(sheet.columns.map((c) => csvEscape(c.values[i] ?? "")).join(","));
	return rows.join("\n");
}
function csvEscape(v) {
	const s = String(v);
	if (/[",\n]/.test(s)) return `"${s.replace(/"/g, "\"\"")}"`;
	return s;
}
function parseCsv(text) {
	const lines = text.replace(/\r/g, "").split("\n").filter((l) => l.trim().length);
	if (!lines.length) return {
		names: [],
		rows: []
	};
	const split = (line) => {
		const out = [];
		let cur = "";
		let q = false;
		for (let i = 0; i < line.length; i++) {
			const ch = line[i];
			if (q) {
				if (ch === "\"" && line[i + 1] === "\"") {
					cur += "\"";
					i++;
				} else if (ch === "\"") q = false;
				else cur += ch;
			} else if (ch === "\"") q = true;
			else if (ch === "," || ch === "	" || ch === ";") {
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
	const rows = [];
	for (let i = start; i < lines.length; i++) {
		const cells = split(lines[i]);
		rows.push(names.map((_, j) => {
			const n = Number(cells[j]);
			return Number.isFinite(n) ? n : NaN;
		}));
	}
	return {
		names,
		rows
	};
}
function exportCsv(sheet) {
	const csv = sheetToCsv(sheet);
	downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8" }), `${slug(sheet.name)}.csv`);
}
function exportRaster(canvas, kind, name) {
	const mime = kind === "jpg" ? "image/jpeg" : "image/png";
	const ext = kind === "jpg" ? "jpg" : kind === "npg" ? "npg" : "png";
	const quality = kind === "jpg" ? .92 : .96;
	canvas.toBlob((blob) => {
		if (blob) downloadBlob(blob, `${slug(name)}.${ext}`);
	}, mime, quality);
}
/** Minimal PDF wrapping a JPEG of the graph (ISO raster page). */
function exportPdf(canvas, name) {
	const jpeg = canvasToJpegBytes(canvas, .92);
	const iw = canvas.width;
	const ih = canvas.height;
	const w = 792;
	const pdf = buildJpegPdf(jpeg, w, Math.max(1, Math.round(ih / Math.max(1, iw) * w)), iw, ih);
	downloadBlob(new Blob([pdf], { type: "application/pdf" }), `${slug(name)}.pdf`);
}
function canvasToJpegBytes(canvas, q) {
	const b64 = canvas.toDataURL("image/jpeg", q).split(",")[1];
	const bin = atob(b64);
	const bytes = new Uint8Array(bin.length);
	for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
	return bytes;
}
function buildJpegPdf(jpeg, pageW, pageH, imgW, imgH) {
	const objects = [];
	const add = (s) => {
		objects.push(typeof s === "string" ? te(s) : s);
	};
	add("1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n");
	add("2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n");
	add(`3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >> endobj\n`);
	add(concat([
		te(`4 0 obj << /Type /XObject /Subtype /Image /Width ${imgW} /Height ${imgH} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >> stream\n`),
		jpeg,
		te("\nendstream\nendobj\n")
	]));
	const content = `q ${pageW} 0 0 ${pageH} 0 0 cm /Im0 Do Q`;
	add(`5 0 obj << /Length ${content.length} >> stream\n${content}\nendstream\nendobj\n`);
	const body = te("%PDF-1.4\n");
	const offsets = [0];
	const parts = [body];
	let pos = body.length;
	for (const obj of objects) {
		offsets.push(pos);
		parts.push(obj);
		pos += obj.length;
	}
	let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
	for (let i = 1; i <= objects.length; i++) xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
	const xrefU = te(xref);
	const startxref = pos;
	parts.push(xrefU);
	parts.push(te(`trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF\n`));
	return concat(parts);
}
function te(s) {
	return new TextEncoder().encode(s);
}
function concat(parts) {
	const len = parts.reduce((s, p) => s + p.length, 0);
	const out = new Uint8Array(len);
	let o = 0;
	for (const p of parts) {
		out.set(p, o);
		o += p.length;
	}
	return out;
}
function slug(s) {
	return s.replace(/[^\w.-]+/g, "_").slice(0, 48) || "lumenplot";
}
function defaultStyle(i) {
	return {
		color: PALETTE[i % PALETTE.length],
		symbol: "circle",
		lineWidth: 1.6,
		lineStyle: "solid",
		fillOpacity: .18
	};
}
function graphFromSheet(sheet, type = "lineSymbol") {
	const x = sheet.columns.find((c) => c.designation === "X") ?? sheet.columns[0];
	const ys = sheet.columns.filter((c) => c.designation === "Y");
	const yErr = sheet.columns.find((c) => c.designation === "YErr");
	const z = sheet.columns.find((c) => c.designation === "Z");
	const series = {};
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
		fitOverlay: null
	};
}
function emptySheet() {
	const n = 12;
	return {
		id: uid("sheet"),
		name: "Sheet1",
		columns: [{
			id: uid("col"),
			name: "X",
			unit: "",
			designation: "X",
			values: Array.from({ length: n }, (_, i) => i + 1)
		}, {
			id: uid("col"),
			name: "Y",
			unit: "",
			designation: "Y",
			values: Array.from({ length: n }, () => null)
		}]
	};
}
function seed() {
	const sheet = sampleSpectra();
	const graph = graphFromSheet(sheet, "line");
	return {
		name: "LumenPlot project",
		sheets: [sheet],
		graphs: [graph],
		activeSheetId: sheet.id,
		activeGraphId: graph.id,
		analysisLog: ["Loaded UV-Vis demo spectrum. Try Peak find or Multi-Gaussian fit."]
	};
}
function xyOf(state) {
	const g = state.graphs.find((x) => x.id === state.activeGraphId);
	const s = state.sheets.find((x) => x.id === (g?.sheetId ?? state.activeSheetId));
	if (!g || !s) return null;
	const xCol = s.columns.find((c) => c.id === g.xColId);
	const yCol = s.columns.find((c) => c.id === g.yColIds[0]);
	const { x, y } = alignedXY(xCol, yCol);
	return {
		g,
		s,
		x,
		y,
		yCol
	};
}
var useStudio = create()(persist((set, get) => ({
	...seed(),
	log: (msg) => set({ analysisLog: [msg, ...get().analysisLog].slice(0, 40) }),
	setName: (name) => set({ name }),
	activeSheet: () => get().sheets.find((s) => s.id === get().activeSheetId),
	activeGraph: () => get().graphs.find((g) => g.id === get().activeGraphId),
	setActiveSheet: (id) => {
		set({
			activeSheetId: id,
			activeGraphId: get().graphs.find((x) => x.sheetId === id)?.id ?? get().activeGraphId
		});
	},
	setActiveGraph: (id) => {
		set({
			activeGraphId: id,
			activeSheetId: get().graphs.find((x) => x.id === id)?.sheetId ?? get().activeSheetId
		});
	},
	patchGraph: (partial) => set({ graphs: get().graphs.map((g) => g.id === get().activeGraphId ? {
		...g,
		...partial
	} : g) }),
	addSheet: (sheet, type) => {
		const s = sheet ?? emptySheet();
		const g = graphFromSheet(s, type ?? "lineSymbol");
		set({
			sheets: [...get().sheets, s],
			graphs: [...get().graphs, g],
			activeSheetId: s.id,
			activeGraphId: g.id
		});
	},
	addBlankSheet: () => get().addSheet(emptySheet(), "scatter"),
	renameSheet: (id, name) => set({ sheets: get().sheets.map((s) => s.id === id ? {
		...s,
		name
	} : s) }),
	addColumn: () => {
		const id = get().activeSheetId;
		set({ sheets: get().sheets.map((s) => {
			if (s.id !== id) return s;
			const n = Math.max(0, ...s.columns.map((c) => c.values.length));
			const letter = String.fromCharCode(65 + s.columns.length);
			return {
				...s,
				columns: [...s.columns, {
					id: uid("col"),
					name: letter,
					unit: "",
					designation: "None",
					values: Array.from({ length: n }, () => null)
				}]
			};
		}) });
	},
	setCell: (colId, row, value) => {
		const id = get().activeSheetId;
		set({ sheets: get().sheets.map((s) => {
			if (s.id !== id) return s;
			return {
				...s,
				columns: s.columns.map((c) => {
					if (c.id !== colId) return c;
					const values = [...c.values];
					while (values.length <= row) values.push(null);
					values[row] = value;
					return {
						...c,
						values
					};
				})
			};
		}) });
	},
	setColMeta: (colId, patch) => {
		const id = get().activeSheetId;
		set({ sheets: get().sheets.map((s) => s.id !== id ? s : {
			...s,
			columns: s.columns.map((c) => c.id === colId ? {
				...c,
				...patch
			} : c)
		}) });
	},
	importCsvText: (text, name) => {
		const { names, rows } = parseCsv(text);
		if (!names.length) return;
		const columns = names.map((nm, i) => ({
			id: uid("col"),
			name: nm,
			unit: "",
			designation: i === 0 ? "X" : "Y",
			values: rows.map((r) => Number.isFinite(r[i]) ? r[i] : null)
		}));
		get().addSheet({
			id: uid("sheet"),
			name: name || "Imported",
			columns
		}, "lineSymbol");
		get().log(`Imported ${rows.length} rows × ${names.length} columns.`);
	},
	applyFormula: (colId, expr) => {
		const s = get().activeSheet();
		if (!s) return;
		const n = Math.max(0, ...s.columns.map((c) => c.values.length));
		const values = [];
		for (let i = 0; i < n; i++) try {
			const keys = s.columns.map((c) => c.name.replace(/\W/g, "_") || "col");
			const vals = keys.map((k, ki) => {
				const v = s.columns[ki].values[i];
				return typeof v === "number" ? v : NaN;
			});
			const fn = new Function("i", "row", ...keys, `"use strict"; const {sin,cos,tan,exp,log,sqrt,abs,pow,min,max,PI,E,asin,acos,atan}=Math; return (${expr});`);
			const v = Number(fn(i + 1, i + 1, ...vals));
			values.push(Number.isFinite(v) ? v : null);
		} catch {
			values.push(null);
		}
		get().setColMeta(colId, {});
		set({ sheets: get().sheets.map((sh) => sh.id !== s.id ? sh : {
			...sh,
			columns: sh.columns.map((c) => c.id === colId ? {
				...c,
				values
			} : c)
		}) });
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
			const keep = x.map((xi, i) => ({
				xi,
				yi: y[i]
			})).filter((p) => p.xi >= lo && p.xi <= hi);
			x = keep.map((p) => p.xi);
			y = keep.map((p) => p.yi);
		}
		try {
			const fit = fitModel(model, x, y);
			get().patchGraph({ fitOverlay: fit });
			get().log(`${model} fit  R²=${fit.r2.toFixed(4)}  RMSE=${fit.rmse.toPrecision(3)}  ${fit.equation}`);
		} catch (e) {
			get().log(e instanceof Error ? e.message : "Fit failed.");
		}
	},
	runPeaks: () => {
		const pack = xyOf(get());
		if (!pack) return;
		const peaks = peaksFrom(pack.x, pack.y).slice(0, 8);
		get().log(peaks.length ? `Found ${peaks.length} peaks: ` + peaks.map((p) => `x=${p.x.toPrecision(4)} y=${p.y.toPrecision(3)} FWHM=${p.fwhm.toPrecision(3)}`).join(" · ") : "No peaks above prominence threshold.");
	},
	runSmooth: () => {
		const pack = xyOf(get());
		if (!pack?.yCol) return;
		const y = smoothY(pack.y, 9);
		const values = pack.yCol.values.map((v, i) => typeof pack.x[i] === "number" ? y[i] ?? v : v);
		set({ sheets: get().sheets.map((s) => s.id !== pack.s.id ? s : {
			...s,
			columns: s.columns.map((c) => c.id === pack.yCol.id ? {
				...c,
				values
			} : c)
		}) });
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
			const keep = x.map((xi, i) => ({
				xi,
				yi: y[i]
			})).filter((p) => p.xi >= lo && p.xi <= hi);
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
		const sheet = {
			id: uid("sheet"),
			name: "FFT magnitude",
			columns: [{
				id: uid("col"),
				name: "bin",
				unit: "",
				designation: "X",
				values: freq
			}, {
				id: uid("col"),
				name: "Magnitude",
				unit: "",
				designation: "Y",
				values: mag
			}]
		};
		get().addSheet(sheet, "line");
		get().log(`FFT computed (${mag.length} bins). New sheet created.`);
	},
	describeActive: () => {
		const pack = xyOf(get());
		if (!pack) return null;
		return describe(pack.y);
	},
	newProject: () => set({
		...seed(),
		analysisLog: ["New project."]
	}),
	loadProject: (p) => set({ ...p })
}), {
	name: "lumenplot-project-v1",
	skipHydration: true,
	partialize: (s) => ({
		name: s.name,
		sheets: s.sheets,
		graphs: s.graphs,
		activeSheetId: s.activeSheetId,
		activeGraphId: s.activeGraphId,
		analysisLog: s.analysisLog
	})
}));
function replaceY(set, get, sheetId, colId, old, y) {
	const values = old.slice();
	for (let i = 0; i < y.length; i++) values[i] = y[i];
	set({ sheets: get().sheets.map((s) => s.id !== sheetId ? s : {
		...s,
		columns: s.columns.map((c) => c.id === colId ? {
			...c,
			values
		} : c)
	}) });
}
var PLOT_TYPES = [
	{
		id: "scatter",
		label: "Scatter"
	},
	{
		id: "line",
		label: "Line"
	},
	{
		id: "lineSymbol",
		label: "Line + symbol"
	},
	{
		id: "errorBar",
		label: "Error bars"
	},
	{
		id: "column",
		label: "Column"
	},
	{
		id: "stackedColumn",
		label: "Stacked"
	},
	{
		id: "waterfall",
		label: "Waterfall"
	},
	{
		id: "area",
		label: "Area"
	},
	{
		id: "step",
		label: "Step"
	},
	{
		id: "histogram",
		label: "Histogram"
	},
	{
		id: "box",
		label: "Box"
	},
	{
		id: "violin",
		label: "Violin"
	},
	{
		id: "pie",
		label: "Pie"
	},
	{
		id: "polar",
		label: "Polar"
	},
	{
		id: "radar",
		label: "Radar"
	},
	{
		id: "ternary",
		label: "Ternary"
	},
	{
		id: "heatmap",
		label: "Heatmap"
	},
	{
		id: "contour",
		label: "Contour"
	},
	{
		id: "surface3d",
		label: "3D surface"
	},
	{
		id: "scatter3d",
		label: "3D scatter"
	},
	{
		id: "density",
		label: "Density"
	},
	{
		id: "residual",
		label: "Residuals"
	}
];
var FITS = [
	{
		id: "linear",
		label: "Linear"
	},
	{
		id: "poly2",
		label: "Poly 2"
	},
	{
		id: "poly3",
		label: "Poly 3"
	},
	{
		id: "poly4",
		label: "Poly 4"
	},
	{
		id: "exp",
		label: "Exponential"
	},
	{
		id: "log",
		label: "Logarithmic"
	},
	{
		id: "power",
		label: "Power"
	},
	{
		id: "gauss",
		label: "Gaussian"
	},
	{
		id: "multigauss",
		label: "Multi-Gaussian"
	},
	{
		id: "lorentz",
		label: "Lorentzian"
	},
	{
		id: "logistic",
		label: "Logistic"
	},
	{
		id: "sine",
		label: "Sine"
	}
];
var DES = [
	"X",
	"Y",
	"YErr",
	"XErr",
	"Z",
	"Label",
	"None"
];
function StudioApp() {
	const [tab, setTab] = (0, import_react.useState)("graph");
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		Promise.resolve(useStudio.persist.rehydrate()).finally(() => setReady(true));
	}, []);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-dvh items-center justify-center bg-bg text-sm text-muted",
		children: "Opening studio…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh min-h-0 flex-col bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden min-h-0 flex-1 lg:grid lg:grid-cols-[minmax(260px,0.9fr)_minmax(0,1.6fr)_minmax(260px,0.95fr)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkbookPanel, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraphStage, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidePanel, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-1 flex-col lg:hidden",
				children: [
					tab === "data" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkbookPanel, {}),
					tab === "graph" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraphStage, {}),
					tab === "analyze" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidePanel, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "grid grid-cols-3 border-t border-border bg-surface lg:hidden",
				children: [
					[
						"data",
						"Data",
						FileSpreadsheet
					],
					[
						"graph",
						"Graph",
						ChartColumn
					],
					[
						"analyze",
						"Analyze",
						SlidersHorizontal
					]
				].map(([id, label, Icon]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setTab(id),
					className: cn("flex min-h-12 flex-col items-center justify-center gap-0.5 text-[11px] font-medium", tab === id ? "text-fg" : "text-muted"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), label]
				}, id))
			})
		]
	});
}
function TopBar() {
	const fileRef = (0, import_react.useRef)(null);
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "flex flex-wrap items-center gap-2 border-b border-border bg-surface px-3 py-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 pr-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "leading-tight",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-semibold tracking-tight",
						children: "LumenPlot"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] uppercase tracking-[0.16em] text-muted",
						children: "Scientific studio"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: name,
				onChange: (e) => setName(e.target.value),
				className: "h-9 min-w-0 flex-1 rounded-sm border border-border bg-panel px-2 text-sm text-fg outline-none focus:border-border-strong md:max-w-xs"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
						onClick: () => newProject(),
						children: "New"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
						onClick: () => addBlankSheet(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), " Sheet"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
						onClick: () => fileRef.current?.click(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3.5" }), " CSV"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: fileRef,
						type: "file",
						accept: ".csv,text/csv,text/plain",
						className: "hidden",
						onChange: async (e) => {
							const f = e.target.files?.[0];
							if (!f) return;
							importCsvText(await f.text(), f.name.replace(/\.csv$/i, ""));
							e.target.value = "";
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "h-9 rounded-sm border border-border bg-panel px-2 text-xs text-fg",
						defaultValue: "",
						onChange: (e) => {
							const item = SAMPLE_LOADERS.find((x) => x.id === e.target.value);
							if (item) addSheet(item.load(), item.type);
							e.target.value = "";
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							disabled: true,
							children: "Demo data"
						}), SAMPLE_LOADERS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: s.id,
							children: s.label
						}, s.id))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExportMenu, { canvasRef }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
						onClick: () => {
							const p = {
								name,
								sheets,
								graphs,
								activeSheetId,
								activeGraphId: useStudio.getState().activeGraphId,
								analysisLog: useStudio.getState().analysisLog
							};
							downloadBlob(new Blob([JSON.stringify(p, null, 2)], { type: "application/json" }), "lumenplot-project.json");
						},
						children: "Save JSON"
					})
				]
			})
		]
	});
}
var graphCanvasHolder = { current: null };
function useGraphCanvasRef() {
	return graphCanvasHolder;
}
function Mark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: "28",
		height: "28",
		viewBox: "0 0 28 28",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "1",
				y: "1",
				width: "26",
				height: "26",
				rx: "6",
				fill: "#151a20",
				stroke: "#9eb0c4",
				strokeWidth: "1"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M6 19 L11 11 L15 16 L22 7",
				fill: "none",
				stroke: "#9eb0c4",
				strokeWidth: "1.6"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "22",
				cy: "7",
				r: "1.5",
				fill: "#d7dde6"
			})
		]
	});
}
function Btn({ children, onClick, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("inline-flex h-9 items-center gap-1.5 rounded-sm border border-border bg-panel px-2.5 text-xs font-medium text-fg transition-colors hover:bg-raised", className),
		children
	});
}
function ExportMenu({ canvasRef }) {
	const sheet = useStudio((s) => s.sheets.find((x) => x.id === s.activeSheetId));
	const graph = useStudio((s) => s.graphs.find((x) => x.id === s.activeGraphId));
	const run = (kind) => {
		if (kind === "csv" && sheet) {
			exportCsv(sheet);
			return;
		}
		const c = canvasRef.current;
		if (!c || !graph) return;
		if (kind === "pdf") exportPdf(c, graph.title);
		else exportRaster(c, kind === "jpg" ? "jpg" : kind === "npg" ? "npg" : "png", graph.title);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5 text-muted" }), [
			"csv",
			"pdf",
			"jpg",
			"png",
			"npg"
		].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => run(k),
			className: "h-9 rounded-sm border border-border bg-primary px-2 text-[11px] font-semibold uppercase tracking-wide text-primary-fg hover:opacity-90",
			children: k
		}, k))]
	});
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
	const [formula, setFormula] = (0, import_react.useState)("sin(i/8)*2 + 0.4");
	const [formulaCol, setFormulaCol] = (0, import_react.useState)("");
	const rows = sheet ? Math.max(12, ...sheet.columns.map((c) => c.values.length), 0) + 4 : 12;
	(0, import_react.useEffect)(() => {
		if (sheet && !formulaCol && sheet.columns[1]) setFormulaCol(sheet.columns[1].id);
	}, [sheet, formulaCol]);
	if (!sheet) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex min-h-0 flex-col border-r border-border bg-surface",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 border-b border-border px-3 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "size-3.5 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-medium uppercase tracking-wider text-muted",
					children: "Workbook"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1 overflow-x-auto px-2 py-2",
				children: sheets.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setActiveSheet(s.id),
					className: cn("h-8 shrink-0 rounded-sm px-2.5 text-xs", s.id === activeSheetId ? "bg-raised text-fg" : "text-muted hover:text-fg"),
					children: s.name
				}, s.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-0 flex-1 overflow-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-max border-collapse font-mono text-[11px] tabular-nums",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "sticky top-0 z-10 bg-panel",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "w-10 border-b border-border px-1 py-1 text-subtle",
							children: "#"
						}), sheet.columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
							className: "min-w-28 border-b border-l border-border px-1 py-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: c.name,
								onChange: (e) => setColMeta(c.id, { name: e.target.value }),
								className: "w-full bg-transparent text-center font-sans text-[11px] font-medium text-fg outline-none"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: c.designation,
								onChange: (e) => setColMeta(c.id, { designation: e.target.value }),
								className: "mt-0.5 w-full bg-transparent text-center text-[10px] text-muted",
								children: DES.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: d }, d))
							})]
						}, c.id))] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: Array.from({ length: rows }, (_, r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "odd:bg-bg/40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "border-b border-border px-1 py-0.5 text-center text-subtle",
							children: r + 1
						}), sheet.columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "border-b border-l border-border p-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "h-7 w-full bg-transparent px-1 text-right text-fg outline-none focus:bg-raised",
								value: c.values[r] ?? "",
								onChange: (e) => {
									const t = e.target.value.trim();
									setCell(c.id, r, t === "" ? null : Number(t));
								}
							})
						}, c.id))]
					}, r)) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-1.5 border-t border-border p-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
						onClick: addColumn,
						children: "Add column"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: formulaCol,
						onChange: (e) => setFormulaCol(e.target.value),
						className: "h-9 flex-1 rounded-sm border border-border bg-panel px-2 text-xs",
						children: sheet.columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: c.id,
							children: ["Formula → ", c.name]
						}, c.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: formula,
						onChange: (e) => setFormula(e.target.value),
						placeholder: "i, sin, exp, col names…",
						className: "h-9 flex-1 rounded-sm border border-border bg-panel px-2 font-mono text-xs outline-none"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
						onClick: () => formulaCol && applyFormula(formulaCol, formula),
						children: "Run"
					})]
				})]
			})
		]
	});
}
function GraphStage() {
	const canvasRef = (0, import_react.useRef)(null);
	const graph = useStudio((s) => s.graphs.find((x) => x.id === s.activeGraphId));
	const sheet = useStudio((s) => s.sheets.find((x) => x.id === (graph?.sheetId ?? s.activeSheetId)));
	const patchGraph = useStudio((s) => s.patchGraph);
	const graphs = useStudio((s) => s.graphs);
	const setActiveGraph = useStudio((s) => s.setActiveGraph);
	const [hover, setHover] = (0, import_react.useState)(null);
	const drag = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		graphCanvasHolder.current = canvasRef.current;
	}, []);
	(0, import_react.useEffect)(() => {
		const c = canvasRef.current;
		if (!c || !graph || !sheet) return;
		const draw = () => renderGraph(c, graph, sheet.columns, null);
		draw();
		const ro = new ResizeObserver(draw);
		ro.observe(c);
		return () => ro.disconnect();
	}, [graph, sheet]);
	if (!graph || !sheet) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 bg-bg" });
	const invertX = (px) => {
		const w = canvasRef.current?.clientWidth ?? 1;
		const L = 58;
		const R = w - 18;
		const t = (px - L) / (R - L);
		const xs = alignedXY(sheet.columns.find((c) => c.id === graph.xColId), sheet.columns.find((c) => c.id === graph.yColIds[0])).x;
		const xmin = xs.length ? Math.min(...xs) : 0;
		return xmin + t * ((xs.length ? Math.max(...xs) : 1) - xmin);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex min-h-0 flex-col bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 overflow-x-auto border-b border-border px-2 py-1.5",
				children: [graphs.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setActiveGraph(g.id),
					className: cn("h-8 shrink-0 rounded-sm px-2.5 text-xs", g.id === graph.id ? "bg-raised text-fg" : "text-muted"),
					children: g.title
				}, g.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					value: graph.type,
					onChange: (e) => patchGraph({ type: e.target.value }),
					className: "ml-auto h-8 rounded-sm border border-border bg-panel px-2 text-xs",
					children: PLOT_TYPES.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: p.id,
						children: p.label
					}, p.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative min-h-0 flex-1 p-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
					ref: canvasRef,
					className: "h-full w-full rounded-md border border-border",
					onMouseMove: (e) => {
						const c = canvasRef.current;
						if (!c || !graph || !sheet) return;
						const r = c.getBoundingClientRect();
						const pt = {
							x: e.clientX - r.left,
							y: e.clientY - r.top
						};
						const info = renderGraph(c, graph, sheet.columns, pt);
						setHover(info);
						if (drag.current && graph.gadget !== "none" && graph.gadget !== "cursor") patchGraph({ roi: {
							x0: drag.current.x0,
							x1: invertX(pt.x)
						} });
					},
					onMouseDown: (e) => {
						if (graph.gadget === "none" || graph.gadget === "cursor") return;
						const c = canvasRef.current;
						if (!c) return;
						const r = c.getBoundingClientRect();
						const x = invertX(e.clientX - r.left);
						drag.current = { x0: x };
						patchGraph({ roi: {
							x0: x,
							x1: x
						} });
					},
					onMouseUp: () => {
						drag.current = null;
					}
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "flex h-8 items-center justify-between border-t border-border px-3 font-mono text-[11px] text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: hover ? `${hover.label}   x=${fmt(hover.x)}  y=${fmt(hover.y)}` : `${sheet.columns[0]?.values.length ?? 0} rows · ${graph.type}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden sm:inline",
					children: "Drag ROI with Fit / Integrate / Peaks gadget on"
				})]
			})
		]
	});
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "flex min-h-0 flex-col overflow-auto border-l border-border bg-surface",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 border-b border-border px-3 py-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlaskConical, { className: "size-3.5 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs font-medium uppercase tracking-wider text-muted",
				children: "Inspector"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4 p-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Title",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: graph.title,
						onChange: (e) => patchGraph({ title: e.target.value }),
						className: "h-9 w-full rounded-sm border border-border bg-panel px-2 text-sm"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "X axis",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: graph.xLabel,
							onChange: (e) => patchGraph({ xLabel: e.target.value }),
							className: "h-9 w-full rounded-sm border border-border bg-panel px-2 text-xs"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Y axis",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: graph.yLabel,
							onChange: (e) => patchGraph({ yLabel: e.target.value }),
							className: "h-9 w-full rounded-sm border border-border bg-panel px-2 text-xs"
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "X column",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: graph.xColId ?? "",
						onChange: (e) => patchGraph({ xColId: e.target.value }),
						className: "h-9 w-full rounded-sm border border-border bg-panel px-2 text-xs",
						children: sheet.columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: c.id,
							children: c.name
						}, c.id))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Y series (multi-select)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col gap-1 rounded-sm border border-border bg-panel p-2",
						children: sheet.columns.map((c) => {
							const on = graph.yColIds.includes(c.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: on,
									onChange: () => patchGraph({ yColIds: on ? graph.yColIds.filter((id) => id !== c.id) : [...graph.yColIds, c.id] })
								}), c.name]
							}, c.id);
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Y error",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: graph.yErrColId ?? "",
							onChange: (e) => patchGraph({ yErrColId: e.target.value || null }),
							className: "h-9 w-full rounded-sm border border-border bg-panel px-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "None"
							}), sheet.columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c.id,
								children: c.name
							}, c.id))]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Z / C",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: graph.zColId ?? "",
							onChange: (e) => patchGraph({ zColId: e.target.value || null }),
							className: "h-9 w-full rounded-sm border border-border bg-panel px-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "None"
							}), sheet.columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c.id,
								children: c.name
							}, c.id))]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							label: "Log X",
							on: graph.logX,
							set: (v) => patchGraph({ logX: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							label: "Log Y",
							on: graph.logY,
							set: (v) => patchGraph({ logY: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							label: "Grid",
							on: graph.showGrid,
							set: (v) => patchGraph({ showGrid: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							label: "Legend",
							on: graph.showLegend,
							set: (v) => patchGraph({ showLegend: v })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Theme",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-3 gap-1",
						children: [
							"publication",
							"night",
							"journal"
						].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => patchGraph({ theme: t }),
							className: cn("h-8 rounded-sm text-[11px] capitalize", graph.theme === t ? "bg-primary text-primary-fg" : "bg-panel text-muted"),
							children: t
						}, t))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Panels",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-3 gap-1",
						children: [
							1,
							2,
							4
						].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => patchGraph({ panels: n }),
							className: cn("h-8 rounded-sm text-xs", graph.panels === n ? "bg-primary text-primary-fg" : "bg-panel text-muted"),
							children: n === 1 ? "Single" : n === 2 ? "1×2" : "2×2"
						}, n))
					})
				}),
				(graph.type === "surface3d" || graph.type === "scatter3d") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: `Rot X ${graph.rotX}°`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: -80,
							max: 80,
							value: graph.rotX,
							onChange: (e) => patchGraph({ rotX: Number(e.target.value) }),
							className: "w-full"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: `Rot Z ${graph.rotZ}°`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: -180,
							max: 180,
							value: graph.rotZ,
							onChange: (e) => patchGraph({ rotZ: Number(e.target.value) }),
							className: "w-full"
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Gadget",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: graph.gadget,
						onChange: (e) => patchGraph({ gadget: e.target.value }),
						className: "h-9 w-full rounded-sm border border-border bg-panel px-2 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "none",
								children: "None"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "cursor",
								children: "Vertical cursor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "fit",
								children: "Quick-fit ROI"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "integrate",
								children: "Integrate ROI"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "peaks",
								children: "Peaks ROI"
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px bg-border" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "size-3.5" }), " Curve fitting"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-1",
					children: FITS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => runFit(f.id),
						className: "h-8 rounded-sm bg-panel text-[11px] hover:bg-raised",
						children: f.label
					}, f.id))
				}),
				fit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md border border-border bg-panel p-2 font-mono text-[11px] leading-relaxed",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-accent",
							children: fit.equation
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							"R² ",
							fmt(fit.r2),
							" · RMSE ",
							fmt(fit.rmse),
							" · n ",
							fit.n
						] }),
						fit.paramNames.map((n, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							n,
							" = ",
							fmt(fit.params[i]),
							Number.isFinite(fit.paramErrors[i]) ? ` ± ${fmt(fit.paramErrors[i])}` : ""
						] }, n)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "mt-1 text-[11px] text-muted hover:text-fg",
							onClick: () => patchGraph({ fitOverlay: null }),
							children: "Clear overlay"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
							onClick: runPeaks,
							children: "Peak find"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
							onClick: runIntegrate,
							children: "Integrate"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
							onClick: runSmooth,
							children: "Smooth"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
							onClick: runBaseline,
							children: "Baseline"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
							onClick: runNormalize,
							children: "Normalize"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
							onClick: runFft,
							children: "FFT"
						})
					]
				}),
				stats && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md border border-border bg-panel p-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-1 text-[11px] uppercase tracking-wider text-muted",
						children: "Descriptive"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[11px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "n",
								v: String(stats.n)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "mean",
								v: fmt(stats.mean)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "sd",
								v: fmt(stats.sd)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "se",
								v: fmt(stats.se)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "median",
								v: fmt(stats.median)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "IQR",
								v: fmt(stats.q3 - stats.q1)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "min",
								v: fmt(stats.min)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "max",
								v: fmt(stats.max)
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-1 flex items-center gap-1 text-[11px] uppercase tracking-wider text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3" }), " Analysis log"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-h-40 space-y-1 overflow-auto rounded-md border border-border bg-bg p-2 text-[11px] leading-snug text-muted",
					children: log.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: l }, i))
				})] })
			]
		})]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mb-1 block text-[11px] uppercase tracking-wider text-muted",
			children: label
		}), children]
	});
}
function Toggle({ label, on, set }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: () => set(!on),
		className: cn("h-8 rounded-sm text-[11px]", on ? "bg-primary text-primary-fg" : "bg-panel text-muted"),
		children: label
	});
}
function Row({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-subtle",
		children: k
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "text-right text-fg",
		children: v
	})] });
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioApp, {});
}
//#endregion
export { Home as component };
