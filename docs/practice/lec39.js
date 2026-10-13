/* Lecture 39 — Runge–Kutta Methods: RK2: practice tasks. */
"use strict";

/** Two-stage RK with c₂ = a₂₁ = α, W₂ = 1/(2α): arrays of t_n, y_n and the predicted points. */
const rk2Run = (f, t0, y0, h, N, a = 1) => {
  const t = [t0], y = [y0], w2 = 1 / (2 * a);
  for (let n = 0; n < N; n++) {
    const k1 = h * f(t[n], y[n]), k2 = h * f(t[n] + a * h, y[n] + a * k1);
    y.push(y[n] + (1 - w2) * k1 + w2 * k2); t.push(t[n] + h);
  }
  return [t, y];
};
const eulerRun = (f, t0, y0, h, N) => { const t = [t0], y = [y0]; for (let n = 0; n < N; n++) { y.push(y[n] + h * f(t[n], y[n])); t.push(t[n] + h); } return [t, y]; };
const fA = (t, y) => 2 * t - y, exA = t => 2 * t - 2 + 5 * Math.exp(-t);          // y' = 2t − y, y(0) = 3
const fB = (t, y) => t + y, exB = t => 2 * Math.exp(t) - t - 1;                   // y' = t + y, y(0) = 1
const fQ = (t, y) => y * y, exQ = t => 1 / (1 - t);                               // y' = y², y(0) = 1

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
const VA = [-0.05, 1.05, 1.2, 3.2], VB = [-0.05, 1.05, 0.8, 3.6], VQ = [-0.01, 0.56, 0.95, 2.1];

/** One Heun step on y' = 2t − y from (0, 3) with h = 0.2: Euler prediction, both slopes, the averaged step. */
function heunPicture(title, showEnd) {
  P.setView(-0.02, 0.26, 2.3, 3.1, { xticks: [0, 0.1, 0.2], yticks: [2.4, 2.6, 2.8, 3] });
  dirField(fA, [-0.02, 0.26, 2.3, 3.1], 10, 8);
  P.fn(exA, { color: "curve", width: 3, domain: [0, 0.25] });
  P.seg(0, 3, 0.2, 2.4, { color: "neg", width: 2, dash: [6, 5] });
  P.pt(0.2, 2.4, { color: "neg", r: 6, ring: true });
  slopeSeg([-0.02, 0.26, 2.3, 3.1], 0.2, 2.4, fA(0.2, 2.4), "pos");
  P.pt(0, 3, { color: "ink", r: 5 });
  if (showEnd) { P.seg(0, 3, 0.2, 2.5, { color: "gold", width: 3 }); P.pt(0.2, 2.5, { color: "gold", r: 6 }); }
  setPlotTitle(title); P.draw();
}

function plotA(N, title) {
  P.setView(...VA, { xticks: [0, 0.2, 0.4, 0.6, 0.8, 1], yticks: [1.5, 2, 2.5, 3] });
  dirField(fA, VA);
  P.fn(exA, { color: "curve", width: 3, domain: [0, 1] });
  const [te, ye] = eulerRun(fA, 0, 3, 0.2, N); polygon(te, ye, "neg", 4);
  const [t, y] = rk2Run(fA, 0, 3, 0.2, N); polygon(t, y);
  setPlotTitle(title); P.draw();
}

const TASKS = [
  { nav: "Two slopes", title: "Compute K₁ and K₂",
    instr: TeX`<p>Heun's method on \(y'=2t-y\), \(y(0)=3\), \(h=0.2\): \(K_1=h\,f(t_0,y_0)=0.2\cdot(-3)=-0.6\). Now compute \(K_2=h\,f(t_0+h,\ y_0+K_1)\).</p>`,
    hints: [TeX`The predicted point is \((0.2,\ 3-0.6)=(0.2,\ 2.4)\), where \(f=2\cdot0.2-2.4\).`],
    answer: TeX`\(f(0.2,\,2.4)=0.4-2.4=-2\), so \(K_2=0.2\cdot(-2)=-0.4\).`,
    build(C) {
      heunPicture(TeX`The Euler prediction (red ring) and the slope there (green)`, false);
      const inp = field(C, "K₂ =", "ans1");
      return () => near(parseNum(inp.value), -0.4, 1e-6) ? ["done", "Correct! The slope at the predicted point is −2, so K₂ = −0.4."] : ["wrong", "Not quite. Evaluate f at (0.2, 2.4), then multiply by h = 0.2."];
    } },

  { nav: "Heun step", title: "Average the two slopes",
    instr: TeX`<p>With \(K_1=-0.6\) and \(K_2=-0.4\), compute \(y_1=y_0+\tfrac12(K_1+K_2)\).</p>`,
    hints: [TeX`\(\tfrac12(-0.6-0.4)=-0.5\).`],
    answer: TeX`\(y_1=3-0.5=2.5\). The exact value is \(y(0.2)\approx2.4937\): error \(0.006\), against \(0.094\) for Euler's \(2.4\).`,
    build(C) {
      heunPicture(TeX`Euler lands at \(2.4\); the averaged slope lands much closer to the curve`, true);
      const inp = field(C, "y₁ =", "ans1");
      return () => near(parseNum(inp.value), 2.5, 1e-6) ? ["done", "Correct! 2.5 against the exact 2.4937."] : ["wrong", "Not quite. Add half of K₁ + K₂ = −1 to y₀ = 3."];
    } },

  { nav: "Midpoint step", title: "The midpoint method",
    instr: TeX`<p>For \(y'=y^2\), \(y(0)=1\), \(h=0.1\), take one midpoint step: \(K_1=0.1\), \(K_2=h\,f\big(t_0+\tfrac h2,\ y_0+\tfrac{K_1}{2}\big)\), \(y_1=y_0+K_2\). What is \(y_1\)? (5 decimals)</p>`,
    hints: [TeX`The midpoint is at \(y=1.05\), where \(f=1.05^2=1.1025\).`],
    answer: TeX`\(K_2=0.1\cdot1.1025=0.11025\), so \(y_1=1.11025\). Exact: \(y(0.1)=1/0.9=1.11111\). Heun gives \(1.1105\).`,
    build(C) {
      const V = [-0.01, 0.13, 0.98, 1.16];
      P.setView(...V, { xticks: [0, 0.05, 0.1], yticks: [1, 1.05, 1.1, 1.15] });
      dirField(fQ, V, 10, 8);
      P.fn(exQ, { color: "curve", width: 3, domain: [0, 0.125] });
      P.seg(0, 1, 0.05, 1.05, { color: "neg", width: 2, dash: [6, 5] }); P.pt(0.05, 1.05, { color: "neg", r: 6, ring: true });
      slopeSeg(V, 0.05, 1.05, fQ(0.05, 1.05), "pos"); P.pt(0, 1, { color: "ink", r: 5 });
      setPlotTitle(TeX`Half an Euler step to the midpoint, and the slope there (green)`); P.draw();
      const inp = field(C, "y₁ =", "ans1");
      return () => near(parseNum(inp.value), 1.11025, 1e-5) ? ["done", "Correct! 1.11025: one slope, read at the midpoint, used for the whole step."] : ["wrong", "Not quite. K₂ = 0.1 · 1.05², then y₁ = 1 + K₂."];
    } },

  { nav: "The family", title: "Slide α",
    instr: TeX`<p>The second-order methods are \(c_2=a_{21}=\alpha\), \(W_2=\frac1{2\alpha}\), \(W_1=1-\frac1{2\alpha}\). Drag \(\alpha\): the green slope is sampled at \(t_0+\alpha h\). For which \(\alpha\) is \(W_1=0\), so that only \(K_2\) is used?</p>`,
    hints: [TeX`Solve \(1-\frac1{2\alpha}=0\).`],
    answer: TeX`\(\alpha=\tfrac12\): \(W_1=0,\ W_2=1\), the midpoint method. \(\alpha=1\) is Heun's method and \(\alpha=\tfrac23\) Ralston's.`,
    build(C) {
      const draw = a => {
        const h = 0.5, w2 = 1 / (2 * a), k1 = h * fQ(0, 1), ts = a * h, ys = 1 + a * k1, k2 = h * fQ(ts, ys), y1 = 1 + (1 - w2) * k1 + w2 * k2;
        P.setView(...VQ, { xticks: [0, 0.25, 0.5], yticks: [1, 1.5, 2] });
        dirField(fQ, VQ);
        P.fn(exQ, { color: "curve", width: 3, domain: [0, 0.53] });
        P.seg(0, 1, 0.55, 1.55, { color: "neg", width: 2, dash: [6, 5] });
        P.pt(ts, ys, { color: "pos", r: 6, ring: true }); slopeSeg(VQ, ts, ys, fQ(ts, ys), "pos");
        P.seg(0, 1, h, y1, { color: "gold", width: 3 }); P.pt(h, y1, { color: "gold", r: 6 }); P.pt(0, 1, { color: "ink", r: 5 });
        setPlotTitle(TeX`\(y'=y^2,\ h=0.5\): \(\alpha=${a.toFixed(2)},\ W_1=${(1 - w2).toFixed(3)},\ W_2=${w2.toFixed(3)},\ y_1=${y1.toFixed(4)}\)`); P.draw();
      };
      slider(C, "α", "s1", 0.3, 1.2, 0.05, 1, v => draw(v));
      const inp = field(C, "α =", "ans1");
      return () => near(parseNum(inp.value), 0.5, 1e-6) ? ["done", "Correct! α = 1/2 is the midpoint method."] : ["wrong", "Not quite. W₁ = 1 − 1/(2α) is zero when 2α = 1."];
    } },

  { nav: "Order conditions", title: "Which one is not second order?",
    instr: TeX`<p>A two-stage method is second order when \(W_1+W_2=1\), \(W_2c_2=\tfrac12\) and \(W_2a_{21}=\tfrac12\). Which of these coefficient sets fails?</p>`,
    hints: [TeX`Check \(W_2c_2\) for each set.`],
    answer: TeX`The last one: \(W_2c_2=\tfrac12\cdot\tfrac12=\tfrac14\neq\tfrac12\). The others are Heun (\(\alpha=1\)), midpoint (\(\alpha=\tfrac12\)) and the member \(\alpha=\tfrac34\) of the family.`,
    build(C) {
      plotA(5, TeX`Heun (gold) and Euler (red) with \(h=0.2\) on \(y'=2t-y\)`);
      cards(C, [TeX`\(W_1=W_2=\tfrac12,\ c_2=a_{21}=1\)`, TeX`\(W_1=0,\ W_2=1,\ c_2=a_{21}=\tfrac12\)`,
                TeX`\(W_1=\tfrac13,\ W_2=\tfrac23,\ c_2=a_{21}=\tfrac34\)`, TeX`\(W_1=W_2=\tfrac12,\ c_2=a_{21}=\tfrac12\)`]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 4 ? ["done", "Right! W₂c₂ = 1/4: this one is only first order."] : ["wrong", "Not quite. That set satisfies all three conditions; compute W₂c₂ for each option."];
    } },

  { nav: "March to t = 1", title: "Five Heun steps",
    instr: TeX`<p>For \(y'=2t-y\), \(y(0)=3\), \(h=0.2\), one Heun step simplifies to \(y_{n+1}=0.82\,y_n+0.36\,t_n+0.04\). Starting from \(y_1=2.5\), what is \(y_5\approx y(1)\)? (4 decimals)</p>`,
    hints: [TeX`\(y_2=0.82\cdot2.5+0.36\cdot0.2+0.04=2.162\). Three more steps with \(t=0.4,\,0.6,\,0.8\).`],
    answer: TeX`\(y_3=1.95684,\ y_4=1.86061,\ y_5=1.8537\). The exact value is \(5/e\approx1.8394\): error \(0.014\), against \(0.20\) for Euler.`,
    build(C) {
      plotA(5, TeX`Five steps with \(h=0.2\): Heun (gold) against Euler (red) and \(y=2t-2+5e^{-t}\)`);
      const inp = field(C, "y₅ =", "ans1");
      return () => near(parseNum(inp.value), 1.8537, 1e-4) ? ["done", "Correct! 1.8537 against 1.8394: error 0.014, fourteen times smaller than Euler's."] : ["wrong", "Not quite. Apply y_{n+1} = 0.82 yₙ + 0.36 tₙ + 0.04 with tₙ = 0.2, 0.4, 0.6, 0.8."];
    } },

  { nav: "Halve the step", title: "Second order in action",
    instr: TeX`<p>For \(y'=t+y\), \(y(0)=1\), Heun with \(h=0.1\) misses \(y(1)\) by \(0.0084\). Drag the number of steps \(N\) (so \(h=1/N\)). Roughly what is the error with \(h=0.025\)?</p>`,
    hints: ["Heun is second order: the global error is proportional to h². Here h is divided by 4."],
    answer: TeX`About \(0.0005\) (exactly \(5.56\times10^{-4}\)): dividing \(h\) by \(4\) divides the error by \(4^2=16\).`,
    build(C) {
      const draw = N => {
        P.setView(...VB, { xticks: [0, 0.2, 0.4, 0.6, 0.8, 1], yticks: [1, 2, 3] });
        P.fn(exB, { color: "curve", width: 3, domain: [0, 1] });
        const [t, y] = rk2Run(fB, 0, 1, 1 / N, N); polygon(t, y, "gold", N > 20 ? 2.5 : 5);
        setPlotTitle(TeX`Heun, \(N=${N}\) steps: error at \(t=1\) is \(${(exB(1) - y[N]).toExponential(2).replace(/e([+-]\d+)/, "\\times10^{$1}")}\)`); P.draw();
      };
      slider(C, "N", "s1", 2, 40, 1, 10, v => draw(v));
      cards(C, ["about 0.0042", "about 0.0021", "about 0.0005", "about 0.00003"]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 3 ? ["done", "Right! h/4 gives error/16: second order."] : ["wrong", "Not quite. For a second-order method the error is proportional to h²."];
    } },

  { nav: "Equal work", title: "Accuracy per evaluation of f",
    instr: TeX`<p>Up to \(t=1\) on \(y'=t+y\), Euler with \(h=0.025\) and Heun with \(h=0.05\) both use \(40\) evaluations of \(f\). Euler's error is \(0.0664\), Heun's \(0.00218\). Which statement is right?</p>`,
    hints: ["Divide the two errors."],
    answer: TeX`Heun is about \(30\) times more accurate for the same work: \(0.0664/0.00218\approx30\). The gap widens as the target error shrinks.`,
    build(C) {
      P.setView(-0.5, 2.5, 0, 0.075, { xticks: [], yticks: [0, 0.02, 0.04, 0.06] });
      P.band(0.1, 0.9, 0, 0.0664, { color: "neg", alpha: 0.85 }); P.band(1.1, 1.9, 0, 0.00218, { color: "gold", alpha: 0.9 });
      P.tex(0.5, 0.0664, "\\text{Euler},\\ h=0.025", { dy: -14, color: "neg", size: 16 });
      P.tex(1.5, 0.004, "\\text{Heun},\\ h=0.05", { dy: -14, color: "gold", size: 16 });
      setPlotTitle(TeX`Error at \(t=1\) with 40 evaluations of \(f\) each`); P.draw();
      cards(C, ["Euler is better: it takes more steps", "They are about equally accurate", "Heun is about 3 times more accurate", "Heun is about 30 times more accurate"]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 4 ? ["done", "Right! 0.0664 / 0.00218 ≈ 30 for the same work."] : ["wrong", "Not quite. Compare the two errors directly."];
    } },

  { nav: "The algorithm", title: "Heun's method step by step",
    instr: `<p>Put the steps inside one pass of Heun's method in the right order using the menus.</p>`,
    hints: ["K₂ needs K₁, and the new y needs both."],
    answer: "1. Compute K₁ = h·f(tₖ, yₖ)  2. Compute K₂ = h·f(tₖ + h, yₖ + K₁)  3. Set yₖ₊₁ = yₖ + (K₁ + K₂)/2  4. Set tₖ₊₁ = tₖ + h and repeat until k = N",
    build(C) {
      const steps = ["Compute K₁ = h·f(tₖ, yₖ)", "Compute K₂ = h·f(tₖ + h, yₖ + K₁)", "Set yₖ₊₁ = yₖ + (K₁ + K₂)/2", "Set tₖ₊₁ = tₖ + h and repeat until k = N"];
      const order = [2, 0, 3, 1];
      const grid = el("div", { className: "order" }); C.append(grid);
      const sels = [0, 1, 2, 3].map(k => {
        const s = el("select", { id: `dd${k + 1}` });
        s.append(el("option", { value: "" }, "— choose —"), ...order.map(i => { const o = el("option", { value: i }); o.textContent = steps[i]; return o; }));
        grid.append(el("label", { htmlFor: `dd${k + 1}`, className: "steplabel" }, `Step ${k + 1}`), s); return s;
      });
      heunPicture(TeX`Heun's method: predict with Euler, then average the two slopes`, true);
      return () => {
        const v = sels.map(s => s.value);
        if (v.includes("")) return ["wrong", "Choose an option for every step."];
        if (new Set(v).size < 4) return ["wrong", "Each option should be used exactly once."];
        const bad = v.findIndex((x, k) => +x !== k);
        return bad >= 0 ? ["wrong", `Step ${bad + 1} is not in the right place yet.`] : ["done", "Perfect order! Two evaluations of f per step."];
      };
    } },
];

startPractice({
  store: "nm-lec39-rk2-v1", lecture: "Lecture 39", tasks: TASKS,
  finalPlot() { plotA(5, TeX`Heun with \(h=0.2\) on \(y'=2t-y\): \(y_5=1.8537\), exact \(1.8394\)`); },
});
