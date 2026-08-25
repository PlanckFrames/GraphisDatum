# GraphisDatum

Free, in-browser scientific graphing and data-analysis studio. Built for publication-quality figures, Origin-style workbooks, curve fitting, peak tools, and one-click export.

## What it does

- Workbook with column designations (X, Y, YErr, Z, Label)
- 20+ graph types: scatter, line, error bars, column, stacked, waterfall, area, step, histogram, box, violin, pie, polar, radar, ternary, heatmap, contour, 3D surface/scatter, density, residuals
- Multi-panel layouts, log axes, themes (Publication / Night / Journal)
- Gadgets: vertical cursor, ROI fit, ROI integrate, ROI peaks
- Fitting: linear, polynomial, exponential, log, power, Gaussian, multi-Gaussian deconvolution, Lorentzian, logistic, sine (Levenberg–Marquardt)
- Peak find (prominence + FWHM + area), smooth, baseline, normalize, FFT, trapezoid integration
- Descriptive statistics
- Column formulas
- CSV import, demo datasets (UV-Vis, kinetics, Arrhenius, dose-response, grouped assay, 3D surface, oscillator)
- Export: **CSV**, **PDF**, **JPG**, and **PNG**.

Projects persist in the browser (localStorage) and can be downloaded as JSON.

## Stack

React 19, TanStack Start, Tailwind v4, Zustand, custom Canvas 2D engine
