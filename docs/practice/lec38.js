/* Lecture 38 — Taylor Series Methods: practice tasks. */
"use strict";

const exA = t => 2 * t - 2 + 5 * Math.exp(-t);                 // y' = 2t − y, y(0) = 3
const exB = t => 2 * Math.exp(t) - t - 1;                      // y' = t + y, y(0) = 1
/** Taylor-2 for y' = 2t − y (y'' = 2 − f): arrays of t_n and y_n. */
const taylorA = (h, N) => { const t = [0], y = [3]; for (let n = 0; n < N; n++) { const f = 2 * t[n] - y[n]; y.push(y[n] + h * f + h * h / 2 * (2 - f)); t.push(t[n] + h); } return [t, y]; };
/** Taylor method of order o for y' = t + y (every derivative from y'' on is 1 + t + y). */
function taylorB(N, o) {
  const h = 1 / N, t = [0], y = [1];
  let c = 0, fa = 1; for (let k = 2; k <= o; k++) { fa *= k; c += h ** k / fa; }
  for (let n = 0; n < N; n++) { const f = t[n] + y[n]; y.push(y[n] + h * f + c * (1 + f)); t.push(t[n] + h); }
  return [t, y];
}
/** The parabola y + s·d1 + s²/2·d2 of one Taylor-2 step, drawn as short segments. */
function arc(t0, y0, d1, d2, h, col = "pos") {
  const m = 16; let px = t0, py = y0;
  for (let k = 1; k <= m; k++) { const s = h * k / m, x = t0 + s, v = y0 + s * d1 + s * s / 2 * d2; P.seg(px, py, x, v, { color: col, width: 3 }); px = x; py = v; }
}
function polygon(t, y, col = "gold", r = 5) {
  t.forEach((ti, k) => { if (k) P.seg(t[k - 1], y[k - 1], ti, y[k], { color: col, width: 2.5 }); P.pt(ti, y[k], { color: col, r }); });
}
const VA = [-0.05, 1.05, 1.2, 3.2], VB = [-0.05, 1.05, 0.8, 3.6];

function plotA(N, title) {
  P.setView(...VA, { xticks: [0, 0.2, 0.4, 0.6, 0.8, 1], yticks: [1.5, 2, 2.5, 3] });
  P.fn(exA, { color: "curve", width: 3, domain: [0, 1] });
  const [t, y] = taylorA(0.2, N);
  for (let n = 0; n < N; n++) { const f = 2 * t[n] - y[n]; arc(t[n], y[n], f, 2 - f, 0.2); }
  t.forEach((ti, k) => P.pt(ti, y[k], { color: "pos", r: 5 }));
  setPlotTitle(title); P.draw();
}

const TASKS = [
  { nav: "Chain rule", title: "The second derivative",
    instr: TeX`<p>For \(y'=f(t,y)=t\,y\), the chain rule gives \(y''=f_t+f_y\,f\). Compute \(y''\) at the point \(t=1,\ y=2\).</p>`,
    hints: [TeX`Here \(f_t=y\) and \(f_y=t\), so \(y''=y+t\cdot(t\,y)=y\,(1+t^2)\).`],
    answer: TeX`\(y''=y+t\cdot ty=2+1\cdot2=4\). In general \(y''=y(1+t^2)\) for this equation.`,
    build(C) {
      P.setView(-0.05, 1.6, 0, 7, { xticks: [0, 0.5, 1, 1.5], yticks: [0, 2, 4, 6] });
      const ex = t => 2 * Math.exp((t * t - 1) / 2);
      P.fn(ex, { color: "curve", width: 3, domain: [0, 1.6] });
      P.pt(1, 2, { color: "gold", r: 6 }); P.seg(0.7, 2 - 0.6, 1.3, 2 + 0.6, { color: "gold", width: 2.5 });
      P.tex(1, 2, "(1,2)", { dx: -40, dy: -14, color: "gold", size: 16 });
      setPlotTitle(TeX`The solution of \(y'=ty\) through \((1,2)\): slope \(2\); how fast does the slope change?`); P.draw();
      const inp = field(C, "y″ =", "ans1");
      return () => near(parseNum(inp.value), 4, 1e-6) ? ["done", "Correct! y″ = f_t + f_y·f = 2 + 1·2 = 4."] : ["wrong", "Not quite. f_t = y = 2, f_y = t = 1 and f = ty = 2."];
    } },

  { nav: "One step", title: "A Taylor-2 step by hand",
    instr: TeX`<p>For \(y'=2t-y\), \(y(0)=3\): differentiating gives \(y''=2-y'\). With \(h=0.2\), compute \(y_1=y_0+h\,y_0'+\frac{h^2}{2}\,y_0''\).</p>`,
    hints: [TeX`At the start \(y_0'=2\cdot0-3=-3\) and \(y_0''=2-(-3)=5\).`],
    answer: TeX`\(y_1=3+0.2(-3)+0.02\cdot5=3-0.6+0.1=2.5\). The exact value is \(y(0.2)\approx2.4937\); Euler gave \(2.4\).`,
    build(C) {
      plotA(1, TeX`\(y'=2t-y\): exact solution (blue) and one Taylor-2 step along its parabola (green)`);
      const inp = field(C, "y₁ =", "ans1");
      return () => near(parseNum(inp.value), 2.5, 1e-6) ? ["done", "Correct! 3 − 0.6 + 0.1 = 2.5, much closer than Euler's 2.4."] : ["wrong", "Not quite. Add h·y′ = −0.6 and (h²/2)·y″ = 0.02·5 = 0.1 to y₀ = 3."];
    } },

  { nav: "March to t = 1", title: "Five steps",
    instr: TeX`<p>Carry on with \(h=0.2\) up to \(t=1\), using \(f=2t_n-y_n\) and \(y_{n+1}=y_n+0.2\,f+0.02\,(2-f)\). What is \(y_5\approx y(1)\)? (4 decimals)</p>`,
    hints: [TeX`\(y_1=2.5,\ y_2=2.162,\ y_3=1.95684,\ y_4\approx1.86061\). One more step at \(t_4=0.8\).`],
    answer: TeX`\(y_5\approx1.8537\). The exact value is \(5/e\approx1.8394\): error \(0.014\), against \(0.20\) for Euler with the same step.`,
    build(C) {
      plotA(5, TeX`Five Taylor-2 steps with \(h=0.2\) against \(y=2t-2+5e^{-t}\)`);
      const inp = field(C, "y₅ =", "ans1");
      return () => near(parseNum(inp.value), taylorA(0.2, 5)[1][5], 1e-4) ? ["done", "Correct! 1.8537 against 1.8394: error 0.014, about 14 times smaller than Euler's."] : ["wrong", "Not quite. At t₄ = 0.8, f = 1.6 − 1.86061 = −0.26061."];
    } },

  { nav: "Spot the order", title: "Which method is it?",
    instr: TeX`<p>The log–log plot shows the global error at \(t=1\) of four Taylor methods against \(h\). A method whose error is divided by about \(8\) each time \(h\) is halved has which order?</p>`,
    hints: [TeX`A method of order \(p\) has global error \(\approx Ch^p\). Halving \(h\) divides it by \(2^p\).`],
    answer: TeX`\(2^3=8\): order \(3\), the line of slope \(3\). Order \(1\) divides by \(2\), order \(2\) by \(4\), order \(4\) by \(16\).`,
    build(C) {
      const hs = [0.2, 0.1, 0.05, 0.025, 0.0125], cols = ["gold", "pos", "curve", "neg"];
      P.setView(-2.05, -0.55, -10, 0.3, { xticks: [-2, -1.5, -1], yticks: [-10, -8, -6, -4, -2, 0] });
      [1, 2, 3, 4].forEach((o, i) => {
        const pts = hs.map(h => [Math.log10(h), Math.log10(exB(1) - taylorB(Math.round(1 / h), o)[1][Math.round(1 / h)])]);
        pts.forEach((p, k) => { if (k) P.seg(pts[k - 1][0], pts[k - 1][1], p[0], p[1], { color: cols[i], width: 2.5 }); P.pt(p[0], p[1], { color: cols[i], r: 4 }); });
        P.tex(pts[0][0], pts[0][1], String(o), { dx: 14, color: cols[i], size: 18 });
      });
      setPlotTitle(TeX`\(\log_{10}\) of the error at \(t=1\) against \(\log_{10}h\), \(y'=t+y\), orders 1 to 4`); P.draw();
      cards(C, ["order 1", "order 2", "order 3", "order 4"]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 3 ? ["done", "Right! 2³ = 8: order 3."] : ["wrong", "Not quite. Halving h divides the error by 2 to the power of the order."];
    } },

  { nav: "Hit the target", title: "How many steps?",
    instr: TeX`<p>For \(y'=t+y\), \(y(0)=1\), drag the order \(p\) and the number of steps \(N\) (\(h=1/N\)). With the <b>second-order</b> Taylor method, what is the smallest \(N\) that gives an error below \(10^{-3}\) at \(t=1\)?</p>`,
    hints: [TeX`Set the order to 2 and increase \(N\) until the error in the title drops below \(0.001\). Euler would need \(2718\) steps.`],
    answer: TeX`\(N=30\) steps. Euler needs \(2718\), order three needs \(6\) and order four only \(3\).`,
    build(C) {
      let o = 2, N = 10;
      const draw = () => {
        P.setView(...VB, { xticks: [0, 0.2, 0.4, 0.6, 0.8, 1], yticks: [1, 2, 3] });
        P.fn(exB, { color: "curve", width: 3, domain: [0, 1] });
        const [t, y] = taylorB(N, o); polygon(t, y, "pos", N > 20 ? 2.5 : 5);
        setPlotTitle(TeX`Order \(${o}\), \(N=${N}\): error at \(t=1\) is \(${(exB(1) - y[N]).toExponential(2).replace("e", "\\times10^{") + "}"}\)`); P.draw();
      };
      slider(C, "p", "s1", 1, 4, 1, 2, v => { o = v; draw(); });
      slider(C, "N", "s2", 2, 60, 1, 10, v => { N = v; draw(); });
      const inp = field(C, "smallest N =", "ans1");
      return () => near(parseNum(inp.value), 30, 0.1) ? ["done", "Correct! 30 steps of Taylor-2 against 2718 steps of Euler."] : ["wrong", "Not quite. Set the order to 2 and find where the error first drops below 1.00 × 10⁻³."];
    } },

  { nav: "Local error", title: "The error of one step",
    instr: TeX`<p>For \(y'=y\), \(y(0)=1\), every derivative equals \(y\). One Taylor-2 step with \(h=0.1\) gives \(y_1=1+0.1+0.005=1.105\). Compute the local truncation error \(\tau=e^{0.1}-1.105\). (6 decimals)</p>`,
    hints: [TeX`\(e^{0.1}\approx1.1051709\). Check: \(\tau=\frac{h^3}{6}y'''(\eta)\) lies between \(0.000167\) and \(0.000184\).`],
    answer: TeX`\(\tau\approx0.000171\), of order \(h^3\). Euler's one-step error was \(0.00517\), thirty times larger.`,
    build(C) {
      P.setView(-0.01, 0.13, 0.98, 1.15, { xticks: [0, 0.05, 0.1], yticks: [1, 1.05, 1.1, 1.15] });
      P.fn(Math.exp, { color: "curve", width: 3, domain: [0, 0.13] });
      P.seg(0, 1, 0.1, 1.1, { color: "gold", width: 2.5 }); P.pt(0.1, 1.1, { color: "gold", r: 5 });
      arc(0, 1, 1, 1, 0.1); P.pt(0, 1, { color: "ink", r: 5 }); P.pt(0.1, 1.105, { color: "pos", r: 6 });
      setPlotTitle(TeX`One step on \(y=e^t\): Euler (gold) lands at \(1.1\), Taylor-2 (green) at \(1.105\), almost on the curve`); P.draw();
      const inp = field(C, "τ =", "ans1");
      return () => near(parseNum(inp.value), Math.exp(0.1) - 1.105, 2e-6) ? ["done", "Correct! τ ≈ 0.000171, of order h³."] : ["wrong", "Not quite. Subtract 1.105 from e^0.1 ≈ 1.1051709."];
    } },

  { nav: "Nonlinear", title: "y′ = −2ty², second step",
    instr: TeX`<p>For \(y'=-2ty^2\), \(y''=8t^2y^3-2y^2\). With \(h=0.2\) the first step gave \(y(0.2)\approx0.96\). Compute the next step \(y(0.4)\approx y_1+h\,y_1'+\frac{h^2}{2}y_1''\) at \(t_1=0.2\). (5 decimals)</p>`,
    hints: [TeX`\(y_1'=-2(0.2)(0.96)^2=-0.36864\) and \(y_1''=8(0.04)(0.96)^3-2(0.96)^2\approx-1.56008\).`],
    answer: TeX`\(0.96-0.073728-0.0312017\approx0.85507\). The exact value is \(1/(1+0.16)\approx0.86207\).`,
    build(C) {
      P.setView(-0.02, 0.65, 0.65, 1.05, { xticks: [0, 0.2, 0.4, 0.6], yticks: [0.7, 0.8, 0.9, 1] });
      P.fn(t => 1 / (1 + t * t), { color: "curve", width: 3, domain: [0, 0.65] });
      arc(0, 1, 0, -2, 0.2); P.pt(0, 1, { color: "ink", r: 5 }); P.pt(0.2, 0.96, { color: "pos", r: 6 });
      setPlotTitle(TeX`\(y=1/(1+t^2)\) and the first Taylor-2 parabola; take the second step`); P.draw();
      const inp = field(C, "y(0.4) ≈", "ans1");
      return () => near(parseNum(inp.value), 0.85507, 1e-5) ? ["done", "Correct! 0.85507; one more step gives 0.72485 at t = 0.6."] : ["wrong", "Not quite. 0.96 + 0.2·(−0.36864) + 0.02·(−1.56008)."];
    } },

  { nav: "Stable step", title: "The largest stable step",
    instr: TeX`<p>On \(y'=-20y\) the Taylor-2 method multiplies \(y\) by \(G=1+h\lambda+\frac{(h\lambda)^2}{2}\) at every step. Drag \(h\) and watch the values. What is the largest \(h\) for which \(|G|\le1\)?</p>`,
    hints: [TeX`\(G\le1\) needs \(-2\le h\lambda\le0\), with \(\lambda=-20\). Check: at \(h\lambda=-2\), \(G=1-2+2=1\).`],
    answer: TeX`\(h=\frac{2}{20}=0.1\), the same limit as Euler. Below it the values decay without changing sign; above it they grow.`,
    build(C) {
      const draw = h => {
        const z = -20 * h, g = 1 + z + z * z / 2;
        P.setView(-0.5, 12.5, -0.2, 3.2, { xticks: [0, 2, 4, 6, 8, 10, 12], yticks: [0, 1, 2, 3] });
        for (let n = 0; n <= 12; n++) { const v = Math.min(3.2, g ** n), col = g <= 1 + 1e-9 ? "pos" : "neg"; P.seg(n, 0, n, v, { color: col, width: 2.5 }); P.pt(n, v, { color: col, r: 5 }); }
        setPlotTitle(TeX`\(y_n=G^n\) with \(G=${g.toFixed(3)}\) (\(h\lambda=${z.toFixed(2)}\))`); P.draw();
      };
      slider(C, "h", "s1", 0.01, 0.13, 0.01, 0.05, v => draw(v));
      const inp = field(C, "largest h =", "ans1");
      return () => near(parseNum(inp.value), 0.1, 1e-6) ? ["done", "Correct! h ≤ 2/|λ| = 0.1, as for Euler."] : ["wrong", "Not quite. Solve 1 + z + z²/2 = 1 for z = hλ < 0."];
    } },

  { nav: "The algorithm", title: "The Taylor method step by step",
    instr: `<p>Put the stages of the Taylor method of order n in the right order using the menus.</p>`,
    hints: ["The derivative formulas are worked out once, before any step is taken."],
    answer: "1. Differentiate y′ = f to get formulas for y″, …, y⁽ⁿ⁾  2. Evaluate y′, …, y⁽ⁿ⁾ at (tₖ, yₖ)  3. Set yₖ₊₁ = yₖ + Σ hʲ/j!·y⁽ʲ⁾  4. Set tₖ₊₁ = tₖ + h and repeat until k = N",
    build(C) {
      const steps = ["Differentiate y′ = f to get formulas for y″, …, y⁽ⁿ⁾", "Evaluate y′, …, y⁽ⁿ⁾ at (tₖ, yₖ)", "Set yₖ₊₁ = yₖ + Σ hʲ/j!·y⁽ʲ⁾", "Set tₖ₊₁ = tₖ + h and repeat until k = N"];
      const order = [2, 0, 3, 1];
      const grid = el("div", { className: "order" }); C.append(grid);
      const sels = [0, 1, 2, 3].map(k => {
        const s = el("select", { id: `dd${k + 1}` });
        s.append(el("option", { value: "" }, "— choose —"), ...order.map(i => { const o = el("option", { value: i }); o.textContent = steps[i]; return o; }));
        grid.append(el("label", { htmlFor: `dd${k + 1}`, className: "steplabel" }, `Step ${k + 1}`), s); return s;
      });
      plotA(5, TeX`The Taylor method of order 2: one parabola per step`);
      return () => {
        const v = sels.map(s => s.value);
        if (v.includes("")) return ["wrong", "Choose an option for every step."];
        if (new Set(v).size < 4) return ["wrong", "Each option should be used exactly once."];
        const bad = v.findIndex((x, k) => +x !== k);
        return bad >= 0 ? ["wrong", `Step ${bad + 1} is not in the right place yet.`] : ["done", "Perfect order! With n = 1 this is Euler's method."];
      };
    } },
];

startPractice({
  store: "nm-lec38-taylor-v1", lecture: "Lecture 38", tasks: TASKS,
  finalPlot() { plotA(5, TeX`Taylor-2 with \(h=0.2\) on \(y'=2t-y\): \(y_5=1.8537\), exact \(1.8394\)`); },
});
