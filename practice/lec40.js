/* Lecture 40 — Runge–Kutta Methods: RK4: practice tasks. */
"use strict";

/** Classical RK4: arrays of t_n, y_n and the four slopes K of every step. */
const rk4Run = (f, t0, y0, h, N) => {
  const t = [t0], y = [y0], K = [];
  for (let n = 0; n < N; n++) {
    const k1 = h * f(t[n], y[n]), k2 = h * f(t[n] + h / 2, y[n] + k1 / 2);
    const k3 = h * f(t[n] + h / 2, y[n] + k2 / 2), k4 = h * f(t[n] + h, y[n] + k3);
    K.push([k1, k2, k3, k4]); y.push(y[n] + (k1 + 2 * k2 + 2 * k3 + k4) / 6); t.push(t[n] + h);
  }
  return [t, y, K];
};
const eulerRun = (f, t0, y0, h, N) => { const t = [t0], y = [y0]; for (let n = 0; n < N; n++) { y.push(y[n] + h * f(t[n], y[n])); t.push(t[n] + h); } return [t, y]; };
const fA = (t, y) => -2 * t * y, exA = t => Math.exp(-t * t);                    // y' = −2ty, y(0) = 1
const fB = (t, y) => t + y, exB = t => 2 * Math.exp(t) - t - 1;                   // y' = t + y, y(0) = 1
const fQ = (t, y) => y * y, exQ = t => 1 / (1 - t);                               // y' = y², y(0) = 1
const fE = (t, y) => y, exE = t => Math.exp(t);                                    // y' = y, y(0) = 1
const SC = ["neg", "pos", "#c58af9", "#f6ad55"];                                     // colours of K₁..K₄
const sci = v => v.toExponential(2).replace(/e([+-]\d+)/, "\\times10^{$1}");

/** Direction field: short segments of slope f(t, y), equal length on screen (canvas about 740 × 610 px). */
function dirField(f, view, nt = 12, ny = 10) {
  const [x0, x1, y0, y1] = view, sx = (x1 - x0) / 740, sy = (y1 - y0) / 610;
  for (let i = 0; i < nt; i++) for (let j = 0; j < ny; j++) {
    const t = x0 + (i + 0.5) * (x1 - x0) / nt, y = y0 + (j + 0.5) * (y1 - y0) / ny, s = f(t, y);
    const px = 1 / sx, py = s / sy, L = Math.hypot(px, py), d = 11 / L;
    P.seg(t - px * d * sx, y - py * d * sy, t + px * d * sx, y + py * d * sy, { color: "muted", width: 1.5, alpha: 0.55 });
  }
}
/** Short segment of slope s through (t, y), 60 px long on screen. */
function slopeSeg(view, t, y, s, color) {
  const [x0, x1, y0, y1] = view, sx = (x1 - x0) / 740, sy = (y1 - y0) / 610;
  const px = 1 / sx, py = s / sy, d = 30 / Math.hypot(px, py);
  P.seg(t - px * d * sx, y - py * d * sy, t + px * d * sx, y + py * d * sy, { color, width: 3 });
}
function polygon(t, y, col = "gold", r = 5) {
  t.forEach((ti, k) => { if (k) P.seg(t[k - 1], y[k - 1], ti, y[k], { color: col, width: 2.5 }); P.pt(ti, y[k], { color: col, r }); });
}

/** One RK4 step from (t0, y0): the four sample points with their slopes, and the blended step. */
function stagePicture(f, ex, t0, y0, h, view, ticks, title, showEnd = true) {
  P.setView(...view, ticks);
  dirField(f, view, 11, 9);
  P.fn(ex, { color: "curve", width: 3, domain: [view[0], view[1]] });
  const [, y, K] = rk4Run(f, t0, y0, h, 1), [k1, k2, k3] = K[0];
  const pts = [[t0, y0], [t0 + h / 2, y0 + k1 / 2], [t0 + h / 2, y0 + k2 / 2], [t0 + h, y0 + k3]];
  pts.forEach(([t, yy], i) => { slopeSeg(view, t, yy, f(t, yy), SC[i]); if (i) P.pt(t, yy, { color: SC[i], r: 6, ring: true }); });
  P.pt(t0, y0, { color: "ink", r: 5 });
  if (showEnd) { P.seg(t0, y0, t0 + h, y[1], { color: "gold", width: 3 }); P.pt(t0 + h, y[1], { color: "gold", r: 6 }); }
  setPlotTitle(title); P.draw();
}
const VA = [-0.02, 0.24, 0.9, 1.04], VQ = [-0.02, 0.56, 0.95, 2.15];
const pictA = (title, end) => stagePicture(fA, exA, 0, 1, 0.2, VA, { xticks: [0, 0.1, 0.2], yticks: [0.92, 0.96, 1] }, title, end);
const pictQ = title => stagePicture(fQ, exQ, 0, 1, 0.5, VQ, { xticks: [0, 0.25, 0.5], yticks: [1, 1.5, 2] }, title);

function plotB(N, title) {
  P.setView(-0.05, 1.05, 0.8, 3.6, { xticks: [0, 0.2, 0.4, 0.6, 0.8, 1], yticks: [1, 2, 3] });
  P.fn(exB, { color: "curve", width: 3, domain: [0, 1] });
  const [te, ye] = eulerRun(fB, 0, 1, 1 / N, N); polygon(te, ye, "neg", N > 20 ? 2.5 : 4);
  const [t, y] = rk4Run(fB, 0, 1, 1 / N, N); polygon(t, y, "gold", N > 20 ? 2.5 : 5);
  setPlotTitle(title); P.draw();
}

const TASKS = [
  { nav: "Second slope", title: "Compute K₂",
    instr: TeX`<p>RK4 on \(y'=-2ty\), \(y(0)=1\), \(h=0.2\). The first slope is \(K_1=h\,f(0,1)=0\). Compute \(K_2=h\,f\big(t_0+\tfrac h2,\ y_0+\tfrac{K_1}{2}\big)\).</p>`,
    hints: [TeX`The midpoint is \((0.1,\ 1+0)=(0.1,\ 1)\), where \(f=-2\cdot0.1\cdot1\).`],
    answer: TeX`\(f(0.1,\,1)=-0.2\), so \(K_2=0.2\cdot(-0.2)=-0.04\).`,
    build(C) {
      pictA(TeX`The four sample points of one step (red, green, violet, orange) on \(y'=-2ty\)`, false);
      const inp = field(C, "K₂ =", "ans1");
      return () => near(parseNum(inp.value), -0.04, 1e-6) ? ["done", "Correct! K₂ = −0.04. Then K₃ = −0.0392 and K₄ = −0.076864."] : ["wrong", "Not quite. Evaluate f = −2ty at (0.1, 1), then multiply by h = 0.2."];
    } },

  { nav: "Blend", title: "Take the RK4 step",
    instr: TeX`<p>The four slopes are \(K_1=0\), \(K_2=-0.04\), \(K_3=-0.0392\), \(K_4=-0.076864\). Compute \(y_1=y_0+\tfrac16(K_1+2K_2+2K_3+K_4)\) to 6 decimals.</p>`,
    hints: [TeX`\(K_1+2K_2+2K_3+K_4=0-0.08-0.0784-0.076864=-0.235264\).`],
    answer: TeX`\(y_1=1-0.235264/6=0.960789\). The exact value is \(e^{-0.04}=0.9607894\): six correct decimals in one step.`,
    build(C) {
      pictA(TeX`One RK4 step (gold) lands on the curve \(y=e^{-t^2}\)`, true);
      const inp = field(C, "y₁ =", "ans1");
      return () => near(parseNum(inp.value), 0.960789, 2e-6) ? ["done", "Correct! 0.960789 against e^(−0.04) = 0.9607894."] : ["wrong", "Not quite. Add one sixth of −0.235264 to y₀ = 1."];
    } },

  { nav: "Weights", title: "Which weights?",
    instr: TeX`<p>The plot shows the four slopes of one big step, \(h=0.5\), on \(y'=y^2\). With which weights does the classical RK4 method combine \(K_1,K_2,K_3,K_4\)?</p>`,
    hints: ["The two middle slopes count twice, and the weights add up to 1."],
    answer: TeX`\(\tfrac16(1,2,2,1)\). The start and the end count once, the two midpoint slopes twice: together that is Simpson's weights \(\tfrac16(1,4,1)\).`,
    build(C) {
      pictQ(TeX`\(y'=y^2,\ h=0.5\): RK4 gives \(1.98845\), the exact value is \(2\)`);
      cards(C, [TeX`\(\tfrac14(1,1,1,1)\)`, TeX`\(\tfrac16(1,2,2,1)\)`, TeX`\(\tfrac12(1,0,0,1)\)`, TeX`\(\tfrac16(1,4,0,1)\)`]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 2 ? ["done", "Right! 1, 2, 2, 1 over 6."] : ["wrong", "Not quite. The midpoint slopes K₂ and K₃ each get twice the weight of K₁ and K₄."];
    } },

  { nav: "Simpson", title: "When f depends on t only",
    instr: TeX`<p>Take \(y'=3t^2\), \(y(0)=0\), and one RK4 step with \(h=1\). Here \(K_2=K_3\), and RK4 is Simpson's rule. What is \(y_1\)?</p>`,
    hints: [TeX`\(K_1=3\cdot0^2=0\), \(K_2=K_3=3\cdot0.5^2=0.75\), \(K_4=3\cdot1^2=3\).`],
    answer: TeX`\(y_1=\tfrac16(0+1.5+1.5+3)=1\), exactly \(y(1)=1\): Simpson's rule is exact for cubics, and \(y=t^3\) is one.`,
    build(C) {
      P.setView(-0.05, 1.1, -0.2, 3.3, { xticks: [0, 0.5, 1], yticks: [0, 1, 2, 3] });
      P.fn(t => 3 * t * t, { color: "curve", width: 3, domain: [0, 1.05] });
      [[0, 0, "neg"], [0.5, 0.75, "pos"], [1, 3, "#f6ad55"]].forEach(([t, v, c]) => { P.seg(t, 0, t, v, { color: c, width: 2, dash: [5, 4] }); P.pt(t, v, { color: c, r: 6 }); });
      P.tex(0.5, 0.75, "4\\times", { dx: -26, dy: -14, color: "pos", size: 16 });
      setPlotTitle(TeX`\(f(t)=3t^2\) at the start, middle (weight 4) and end of the step`); P.draw();
      const inp = field(C, "y₁ =", "ans1");
      return () => near(parseNum(inp.value), 1, 1e-6) ? ["done", "Correct! y₁ = 1 exactly, like Simpson's rule for a cubic."] : ["wrong", "Not quite. y₁ = (K₁ + 2K₂ + 2K₃ + K₄)/6 with h = 1."];
    } },

  { nav: "March to t = 1", title: "Two steps on y′ = y",
    instr: TeX`<p>On \(y'=y\), one RK4 step multiplies \(y\) by \(1+h+\tfrac{h^2}{2}+\tfrac{h^3}{6}+\tfrac{h^4}{24}\). With \(h=0.5\) and \(y(0)=1\), what is \(y_2\approx y(1)\)? (4 decimals)</p>`,
    hints: [TeX`The factor is \(1+0.5+0.125+0.0208333+0.0026042=1.6484375\). Square it.`],
    answer: TeX`\(y_2=1.6484375^2=2.7173\). The exact value is \(e=2.71828\): error \(0.0009\) with only two steps. Euler gives \(1.5^2=2.25\).`,
    build(C) {
      P.setView(-0.05, 1.08, 0.9, 2.9, { xticks: [0, 0.5, 1], yticks: [1, 1.5, 2, 2.5] });
      P.fn(exE, { color: "curve", width: 3, domain: [0, 1.05] });
      const [te, ye] = eulerRun(fE, 0, 1, 0.5, 2); polygon(te, ye, "neg", 5);
      const [t, y] = rk4Run(fE, 0, 1, 0.5, 2); polygon(t, y, "gold", 6);
      setPlotTitle(TeX`\(y'=y\) with \(h=0.5\): RK4 (gold) against Euler (red) and \(y=e^t\)`); P.draw();
      const inp = field(C, "y₂ =", "ans1");
      return () => near(parseNum(inp.value), 2.7173, 1e-4) ? ["done", "Correct! 2.7173 against e = 2.71828."] : ["wrong", "Not quite. Multiply y₀ = 1 by the factor 1.6484375 twice."];
    } },

  { nav: "Halve the step", title: "Fourth order in action",
    instr: TeX`<p>For \(y'=t+y\), \(y(0)=1\), RK4 with \(h=0.1\) misses \(y(1)\) by \(4.2\times10^{-6}\). Drag the number of steps \(N\) (so \(h=1/N\)). About what is the error with \(h=0.05\)?</p>`,
    hints: ["RK4 is fourth order: the global error is proportional to h⁴."],
    answer: TeX`About \(2.6\times10^{-7}\) (exactly \(2.72\times10^{-7}\)): halving \(h\) divides the error by \(2^4=16\).`,
    build(C) {
      const draw = N => plotB(N, TeX`RK4 (gold) and Euler (red), \(N=${N}\): RK4 error at \(t=1\) is \(${sci(exB(1) - rk4Run(fB, 0, 1, 1 / N, N)[1][N])}\)`);
      slider(C, "N", "s1", 2, 40, 1, 10, v => draw(v));
      cards(C, [TeX`about \(2.1\times10^{-6}\)`, TeX`about \(1.0\times10^{-6}\)`, TeX`about \(2.6\times10^{-7}\)`, TeX`about \(1.6\times10^{-8}\)`]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 3 ? ["done", "Right! h/2 gives error/16: fourth order."] : ["wrong", "Not quite. For a fourth-order method the error is proportional to h⁴."];
    } },

  { nav: "Equal work", title: "Accuracy per evaluation of f",
    instr: TeX`<p>Up to \(t=1\) on \(y'=t+y\), Euler with \(h=0.025\), Heun with \(h=0.05\) and RK4 with \(h=0.1\) all use \(40\) evaluations of \(f\). The errors are \(0.0664\), \(0.00218\) and \(4.2\times10^{-6}\). How many times more accurate than Euler is RK4 for the same work?</p>`,
    hints: ["Divide 0.0664 by 0.0000042."],
    answer: TeX`About \(16\,000\) times: \(0.0664/4.17\times10^{-6}\approx15\,900\).`,
    build(C) {
      P.setView(-0.5, 3.5, -6.5, -0.5, { xticks: [], yticks: [-6, -5, -4, -3, -2, -1] });
      [[0.5, 0.0664, "neg", "\\text{Euler}"], [1.5, 0.00218, "pos", "\\text{Heun}"], [2.5, 4.17e-6, "gold", "\\text{RK4}"]].forEach(([x, e, c, l]) => {
        P.band(x - 0.35, x + 0.35, -6.5, Math.log10(e), { color: c, alpha: 0.85 }); P.tex(x, Math.log10(e), l, { dy: -14, color: c, size: 16 });
      });
      setPlotTitle(TeX`\(\log_{10}\) of the error at \(t=1\), 40 evaluations of \(f\) each`); P.draw();
      cards(C, ["about 30 times", "about 300 times", "about 16 000 times", "about 2 million times"]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 3 ? ["done", "Right! About 16 000 times more accurate for the same work."] : ["wrong", "Not quite. Divide Euler's error by RK4's."];
    } },

  { nav: "Stable step", title: "The largest stable step",
    instr: TeX`<p>On \(y'=\lambda y\), RK4 multiplies \(y\) by \(G(h\lambda)=1+z+\tfrac{z^2}{2}+\tfrac{z^3}{6}+\tfrac{z^4}{24}\), \(z=h\lambda\), and \(|G|\le1\) for real \(z\) between about \(-2.785\) and \(0\). Drag \(z\) to see \(G\). For \(\lambda=-50\), what is the largest stable step \(h\)? (3 decimals)</p>`,
    hints: [TeX`\(h\,|\lambda|\le2.785\), so \(h\le2.785/50\).`],
    answer: TeX`\(h\le2.785/50\approx0.056\). Euler would need \(h\le2/50=0.04\).`,
    build(C) {
      const G = z => 1 + z + z * z / 2 + z ** 3 / 6 + z ** 4 / 24;
      const draw = z => {
        P.setView(-3.3, 0.5, -1.4, 1.8, { xticks: [-3, -2, -1, 0], yticks: [-1, 0, 1] });
        P.band(-2.785, 0, -1, 1, { color: "pos", alpha: 0.12 });
        P.fn(G, { color: "gold", width: 3, domain: [-3.3, 0.5] });
        P.fn(z_ => 1 + z_, { color: "neg", width: 2, domain: [-2.4, 0.5] });
        P.pt(z, G(z), { color: Math.abs(G(z)) <= 1 ? "pos" : "neg", r: 7 });
        setPlotTitle(TeX`\(z=${z.toFixed(2)}\): \(G(z)=${G(z).toFixed(3)}\) (gold RK4, red Euler \(1+z\))`); P.draw();
      };
      slider(C, "z = hλ", "s1", -3.2, 0.4, 0.01, -1, v => draw(v));
      const inp = field(C, "h =", "ans1");
      return () => near(parseNum(inp.value), 0.0557, 0.01) ? ["done", "Correct! h ≤ 0.0557, a little more room than Euler's 0.04."] : ["wrong", "Not quite. Divide 2.785 by |λ| = 50."];
    } },

  { nav: "The algorithm", title: "RK4 step by step",
    instr: `<p>Put the steps inside one pass of RK4 in the right order using the menus.</p>`,
    hints: ["Each slope uses the one before it; the new y needs all four."],
    answer: "1. K₁ = h·f(tₖ, yₖ)  2. K₂ = h·f(tₖ + h/2, yₖ + K₁/2)  3. K₃ = h·f(tₖ + h/2, yₖ + K₂/2)  4. K₄ = h·f(tₖ + h, yₖ + K₃)  5. yₖ₊₁ = yₖ + (K₁ + 2K₂ + 2K₃ + K₄)/6, tₖ₊₁ = tₖ + h",
    build(C) {
      const steps = ["Compute K₁ = h·f(tₖ, yₖ)", "Compute K₂ = h·f(tₖ + h/2, yₖ + K₁/2)", "Compute K₃ = h·f(tₖ + h/2, yₖ + K₂/2)",
        "Compute K₄ = h·f(tₖ + h, yₖ + K₃)", "Set yₖ₊₁ = yₖ + (K₁ + 2K₂ + 2K₃ + K₄)/6 and tₖ₊₁ = tₖ + h"];
      const order = [3, 0, 4, 2, 1];
      const grid = el("div", { className: "order" }); C.append(grid);
      const sels = [0, 1, 2, 3, 4].map(k => {
        const s = el("select", { id: `dd${k + 1}` });
        s.append(el("option", { value: "" }, "— choose —"), ...order.map(i => { const o = el("option", { value: i }); o.textContent = steps[i]; return o; }));
        grid.append(el("label", { htmlFor: `dd${k + 1}`, className: "steplabel" }, `Step ${k + 1}`), s); return s;
      });
      pictQ(TeX`RK4: four looks at the slope, then one blended step`);
      return () => {
        const v = sels.map(s => s.value);
        if (v.includes("")) return ["wrong", "Choose an option for every step."];
        if (new Set(v).size < 5) return ["wrong", "Each option should be used exactly once."];
        const bad = v.findIndex((x, k) => +x !== k);
        return bad >= 0 ? ["wrong", `Step ${bad + 1} is not in the right place yet.`] : ["done", "Perfect order! Four evaluations of f per step."];
      };
    } },
];

startPractice({
  store: "nm-lec40-rk4-v1", lecture: "Lecture 40", tasks: TASKS,
  finalPlot() { plotB(10, TeX`RK4 with \(h=0.1\) on \(y'=t+y\): \(y_{10}=3.4365595\), exact \(3.4365637\)`); },
});
