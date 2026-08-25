import { uid } from "@/lib/utils";
import type { Column, Sheet } from "./types";

function col(name: string, designation: Column["designation"], values: number[], unit = ""): Column {
  return { id: uid("col"), name, unit, designation, values };
}

function linspace(a: number, b: number, n: number) {
  return Array.from({ length: n }, (_, i) => a + ((b - a) * i) / (n - 1));
}

function noise(s = 1) {
  return (Math.random() + Math.random() + Math.random() - 1.5) * s;
}

export function sampleSpectra(): Sheet {
  const x = linspace(400, 800, 401);
  const y = x.map((w) => {
    const g1 = 1.8 * Math.exp(-((w - 480) ** 2) / (2 * 12 ** 2));
    const g2 = 2.4 * Math.exp(-((w - 532) ** 2) / (2 * 8 ** 2));
    const g3 = 1.2 * Math.exp(-((w - 640) ** 2) / (2 * 18 ** 2));
    const g4 = 0.7 * Math.exp(-((w - 720) ** 2) / (2 * 10 ** 2));
    return g1 + g2 + g3 + g4 + 0.08 + noise(0.03);
  });
  return {
    id: uid("sheet"),
    name: "UV-Vis spectrum",
    columns: [
      col("Wavelength", "X", x, "nm"),
      col("Absorbance", "Y", y, "a.u."),
    ],
  };
}

export function sampleKinetics(): Sheet {
  const t = linspace(0, 40, 81);
  const y = t.map((ti) => 2.1 * (1 - Math.exp(-0.18 * ti)) + noise(0.04));
  const y2 = t.map((ti) => 1.7 * (1 - Math.exp(-0.11 * ti)) + noise(0.04));
  return {
    id: uid("sheet"),
    name: "Kinetics",
    columns: [
      col("Time", "X", t, "min"),
      col("Run A", "Y", y, "mM"),
      col("Run B", "Y", y2, "mM"),
    ],
  };
}

export function sampleArrhenius(): Sheet {
  const T = linspace(280, 360, 17);
  const k = T.map((ti) => 1.2e7 * Math.exp(-5200 / ti) * (1 + noise(0.04)));
  return {
    id: uid("sheet"),
    name: "Arrhenius",
    columns: [
      col("T", "X", T, "K"),
      col("k", "Y", k, "s⁻¹"),
    ],
  };
}

export function sampleDose(): Sheet {
  const conc = [0.01, 0.03, 0.1, 0.3, 1, 3, 10, 30, 100];
  const resp = conc.map((c) => 12 + 78 / (1 + Math.exp(-(Math.log10(c) - 0.4) / 0.28)) + noise(2));
  const err = conc.map(() => 2.4);
  return {
    id: uid("sheet"),
    name: "Dose-response",
    columns: [
      col("Dose", "X", conc, "µM"),
      col("Response", "Y", resp, "%"),
      col("SEM", "YErr", err, "%"),
    ],
  };
}

export function sampleGrouped(): Sheet {
  const groups = ["Control", "Low", "Mid", "High"];
  const x: number[] = [];
  const y: number[] = [];
  const lab: number[] = [];
  groups.forEach((g, gi) => {
    for (let i = 0; i < 12; i++) {
      x.push(gi + 1);
      y.push(4.2 + gi * 1.6 + noise(0.9));
      lab.push(gi);
    }
  });
  return {
    id: uid("sheet"),
    name: "Grouped assay",
    columns: [
      col("GroupIndex", "X", x, ""),
      col("Score", "Y", y, ""),
      col("Group", "Label", lab, ""),
    ],
  };
}

export function sampleSurface(): Sheet {
  const n = 24;
  const X: number[] = [];
  const Y: number[] = [];
  const Z: number[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const x = -3 + (6 * i) / (n - 1);
      const y = -3 + (6 * j) / (n - 1);
      const z =
        2.2 * Math.exp(-(x * x + y * y) / 2.2) +
        1.1 * Math.exp(-((x - 1.6) ** 2 + (y + 0.8) ** 2) / 0.9);
      X.push(x);
      Y.push(y);
      Z.push(z);
    }
  }
  return {
    id: uid("sheet"),
    name: "Surface XYZ",
    columns: [col("X", "X", X), col("Y", "Y", Y), col("Z", "Z", Z)],
  };
}

export function sampleOscillator(): Sheet {
  const t = linspace(0, 8 * Math.PI, 320);
  const y = t.map((ti) => Math.sin(ti) + 0.35 * Math.sin(3 * ti + 0.4) + noise(0.08));
  return {
    id: uid("sheet"),
    name: "Oscillator",
    columns: [col("t", "X", t, "s"), col("Signal", "Y", y, "V")],
  };
}

export const SAMPLE_LOADERS = [
  { id: "spectra", label: "UV-Vis peaks", load: sampleSpectra, type: "line" as const },
  { id: "kinetics", label: "Kinetics (2 runs)", load: sampleKinetics, type: "lineSymbol" as const },
  { id: "arrhenius", label: "Arrhenius", load: sampleArrhenius, type: "scatter" as const },
  { id: "dose", label: "Dose-response", load: sampleDose, type: "errorBar" as const },
  { id: "grouped", label: "Grouped assay", load: sampleGrouped, type: "box" as const },
  { id: "surface", label: "3D surface", load: sampleSurface, type: "surface3d" as const },
  { id: "osc", label: "Oscillator / FFT", load: sampleOscillator, type: "line" as const },
];
