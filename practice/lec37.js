/* Lecture 37 — Euler's Method: practice tasks. */
"use strict";

/** Euler's method: arrays of t_n and y_n. */
const eulerRun = (f, t0, y0, h, N) => { const t = [t0], y = [y0]; for (let n = 0; n < N; n++) { y.push(y[n] + h * f(t[n], y[n])); t.push(t[n] + h); } return [t, y]; };
const fA = (t, y) => 2 * t - y, exA = t => 2 * t - 2 + 5 * Math.exp(-t);          // y' = 2t − y, y(0) = 3
const fB = (t, y) => t + y, exB = t => 2 * Math.exp(t) - t - 1;                   // y' = t + y, y(0) = 1

/** Direction field: short segments of slope f(t, y), equal length on screen (canvas about 740 × 610 px). */
function dirField(f, view, nt = 12, ny = 10) {
  const [x0, x1, y0, y1] = view, sx = (x1 - x0) / 740, sy = (y1 - y0) / 610;
  for (let i = 0; i < nt; i++) for (let j = 0; j < ny; j++) {
    const t = x0 + (i + 0.5) * (x1 - x0) / nt, y = y0 + (j + 0.5) * (y1 - y0) / ny, s = f(t, y);
    const px = 1 / sx, py = s / sy, L = Math.hypot(px, py), d = 11 / L;
    P.seg(t - px * d * sx, y - py * d * sy, t + px * d * sx, y + py * d * sy, { color: "muted", width: 1.5, alpha: 0.55 });
  }
}
function polygon(t, y, col = "gold", r = 5) {
  t.forEach((ti, k) => { if (k) P.seg(t[k - 1], y[k - 1], ti, y[k], { color: col, width: 2.5 }); P.pt(ti, y[k], { color: col, r }); });
}
const VA = [-0.05, 1.05, 1.2, 3.2], VB = [-0.05, 1.05, 0.8, 3.6];

function plotA(N, title) {
  P.setView(...VA, { xticks: [0, 0.2, 0.4, 0.6, 0.8, 1], yticks: [1.5, 2, 2.5, 3] });
  dirField(fA, VA);
  P.fn(exA, { color: "curve", width: 3, domain: [0, 1] });
  const [t, y] = eulerRun(fA, 0, 3, 0.2, N); polygon(t, y);
  setPlotTitle(title); P.draw();
}

const TASKS = [
  { nav: "One step", title: "The first Euler step",
    instr: TeX`<p>For \(y'=2t-y\), \(y(0)=3\) and \(h=0.2\), compute \(y_1=y_0+h\,f(t_0,y_0)\).</p>`,
    hints: [TeX`The slope at the start is \(f(0,3)=2\cdot0-3=-3\).`],
    answer: TeX`\(y_1=3+0.2\cdot(-3)=2.4\). The exact value is \(y(0.2)=2(0.2)-2+5e^{-0.2}\approx2.4936\).`,
    build(C) {
      plotA(1, TeX`\(y'=2t-y\): the field, the exact solution (blue) and one Euler step (gold)`);
      const inp = field(C, "y₁ =", "ans1");
      return () => near(parseNum(inp.value), 2.4, 1e-6) ? ["done", "Correct! One step down the tangent: 3 − 0.6 = 2.4."] : ["wrong", "Not quite. Multiply the slope −3 by h = 0.2 and add it to y₀ = 3."];
    } },

  { nav: "March to t = 1", title: "Five steps",
    instr: TeX`<p>Carry on with \(h=0.2\) up to \(t=1\). Here \(y_{n+1}=y_n+0.2\,(2t_n-y_n)=0.8\,y_n+0.4\,t_n\). What is \(y_5\approx y(1)\)? (4 decimals)</p>`,
    hints: [TeX`\(y_1=2.4,\ y_2=2.0,\ y_3=1.76\). Two more steps.`],
    answer: TeX`\(y_4=0.8\cdot1.76+0.4\cdot0.6=1.648\) and \(y_5=0.8\cdot1.648+0.4\cdot0.8=1.6384\). The exact value is \(y(1)=5/e\approx1.8394\): error \(0.20\).`,
    build(C) {
      plotA(5, TeX`Five Euler steps with \(h=0.2\) against \(y=2t-2+5e^{-t}\)`);
      const inp = field(C, "y₅ =", "ans1");
      return () => near(parseNum(inp.value), 1.6384, 1e-4) ? ["done", "Correct! 1.6384 against 1.8394: the error has grown to 0.20."] : ["wrong", "Not quite. Use y_{n+1} = 0.8 yₙ + 0.4 tₙ with t = 0, 0.2, 0.4, 0.6, 0.8."];
    } },

  { nav: "Halve the step", title: "First order in action",
    instr: TeX`<p>For \(y'=t+y\), \(y(0)=1\), Euler with \(h=0.1\) misses \(y(1)\) by \(0.249\). Drag the number of steps \(N\) (so \(h=1/N\)) to see the polygon. Roughly what is the error at \(t=1\) with \(h=0.025\)?</p>`,
    hints: ["Euler is first order: the global error is proportional to h. Here h is divided by 4."],
    answer: TeX`About \(0.06\) (exactly \(0.0664\)): the error is roughly \(e\cdot h\), so a four times smaller step gives a four times smaller error.`,
    build(C) {
      const draw = N => {
        P.setView(...VB, { xticks: [0, 0.2, 0.4, 0.6, 0.8, 1], yticks: [1, 2, 3] });
        P.fn(exB, { color: "curve", width: 3, domain: [0, 1] });
        const [t, y] = eulerRun(fB, 0, 1, 1 / N, N); polygon(t, y, "gold", N > 20 ? 2.5 : 5);
        setPlotTitle(TeX`\(N=${N}\) steps: error at \(t=1\) is \(${(exB(1) - y[N]).toFixed(4)}\)`); P.draw();
      };
      slider(C, "N", "s1", 4, 40, 1, 10, v => draw(v));
      cards(C, ["about 0.12", "about 0.06", "about 0.016", "about 0.004"]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 2 ? ["done", "Right! h/4 gives error/4: first order."] : ["wrong", "Not quite. For a first-order method the error is proportional to h, not to h² or h³."];
    } },

  { nav: "Local error", title: "The error of one step",
    instr: TeX`<p>For \(y'=y\), \(y(0)=1\) one Euler step with \(h=0.1\) gives \(y_1=1.1\), while \(y(0.1)=e^{0.1}\). Compute the local truncation error \(\tau=e^{0.1}-1.1\). (5 decimals)</p>`,
    hints: [TeX`\(e^{0.1}\approx1.105171\). Check: \(\tau=\frac{h^2}{2}y''(\xi)=0.005\,e^{\xi}\) lies between \(0.005\) and \(0.00553\).`],
    answer: TeX`\(\tau\approx0.00517\). It is of order \(h^2\): with \(h=0.05\) it is \(e^{0.05}-1.05\approx0.00127\), four times smaller.`,
    build(C) {
      P.setView(-0.01, 0.13, 0.98, 1.15, { xticks: [0, 0.05, 0.1], yticks: [1, 1.05, 1.1, 1.15] });
      P.fn(Math.exp, { color: "curve", width: 3, domain: [0, 0.13] });
      P.seg(0, 1, 0.1, 1.1, { color: "gold", width: 3 }); P.pt(0, 1, { color: "ink", r: 5 }); P.pt(0.1, 1.1, { color: "gold", r: 6 });
      P.pt(0.1, Math.exp(0.1), { color: "curve", r: 6, ring: true }); P.seg(0.1, 1.1, 0.1, Math.exp(0.1), { color: "neg", width: 3 });
      P.tex(0.1, 1.1025, "\\tau", { dx: 16, color: "neg", size: 18 });
      setPlotTitle(TeX`One step along the tangent of \(y=e^t\); the red gap is \(\tau\)`); P.draw();
      const inp = field(C, "τ =", "ans1");
      return () => near(parseNum(inp.value), Math.exp(0.1) - 1.1, 1e-5) ? ["done", "Correct! τ ≈ 0.00517, of order h²."] : ["wrong", "Not quite. Subtract 1.1 from e^0.1 ≈ 1.105171."];
    } },

  { nav: "Local to global", title: "How the errors add up",
    instr: TeX`<p>On \([0,1]\) with \(h=0.01\), Euler takes \(100\) steps, and each step makes a local error of about \(10^{-4}\) (order \(h^2\)). Roughly how large is the global error at \(t=1\)?</p>`,
    hints: [TeX`The local errors are carried along and add up over \(N=1/h\) steps.`],
    answer: TeX`About \(10^{-2}\): \(100\) steps \(\times\,10^{-4}=10^{-2}\). In general \(\frac1h\cdot O(h^2)=O(h)\), so Euler is first order.`,
    build(C) {
      P.setView(-0.5, 10.5, 0, 0.032, { xticks: [0, 2, 4, 6, 8, 10], yticks: [0, 0.01, 0.02, 0.03] });
      const t = [], y = []; let yy = 1, tt = 0;
      for (let n = 0; n <= 10; n++) { t.push(tt); y.push(yy); yy += 0.1 * (tt + yy); tt += 0.1; }
      const C_ = t.map((ti, k) => (y[k] + ti + 1) * Math.exp(-ti));
      for (let n = 0; n < 10; n++) {
        const loc = (C_[n] - C_[n + 1]) * Math.exp(t[n + 1]), car = (C_[n] - C_[n + 1]) * Math.E;
        P.band(n - 0.35, n - 0.02, 0, loc, { color: "muted", alpha: 0.8 }); P.band(n + 0.02, n + 0.35, 0, car, { color: "gold", alpha: 0.85 });
      }
      setPlotTitle(TeX`\(y'=t+y,\ h=0.1\): local error of each step (grey) and the same error carried to \(t=1\) (gold); the gold bars add up to \(0.249\)`); P.draw();
      cards(C, [TeX`\(10^{-6}\)`, TeX`\(10^{-4}\)`, TeX`\(10^{-2}\)`, TeX`\(1\)`]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 3 ? ["done", "Right! 100 local errors of 10⁻⁴ add up to about 10⁻²."] : ["wrong", "Not quite. The error of each step is not the end: N = 100 of them accumulate."];
    } },

  { nav: "Stable step", title: "The largest stable step",
    instr: TeX`<p>For \(y'=-20y\), Euler gives \(y_n=(1-20h)^n\,y_0\). Drag \(h\) and watch the values. What is the largest \(h\) for which \(|1+h\lambda|\le1\)?</p>`,
    hints: [TeX`Stability needs \(-2\le h\lambda\le0\) with \(\lambda=-20\).`],
    answer: TeX`\(h=\frac{2}{|\lambda|}=\frac{2}{20}=0.1\). For \(h\) above \(0.1\) the factor \(1-20h\) is below \(-1\), and the values oscillate and grow.`,
    build(C) {
      const draw = h => {
        const g = 1 - 20 * h;
        P.setView(-0.5, 12.5, -3.2, 3.2, { xticks: [0, 2, 4, 6, 8, 10, 12], yticks: [-3, -2, -1, 0, 1, 2, 3] });
        for (let n = 0; n <= 12; n++) { const v = Math.max(-3.2, Math.min(3.2, g ** n)), col = Math.abs(g) <= 1 + 1e-9 ? "pos" : "neg"; P.seg(n, 0, n, v, { color: col, width: 2.5 }); P.pt(n, v, { color: col, r: 5 }); }
        setPlotTitle(TeX`\(y_n=(1-20h)^n\) with \(1-20h=${g.toFixed(2)}\)`); P.draw();
      };
      slider(C, "h", "s1", 0.01, 0.15, 0.01, 0.03, v => draw(v));
      const inp = field(C, "largest h =", "ans1");
      return () => near(parseNum(inp.value), 0.1, 1e-6) ? ["done", "Correct! h ≤ 2/|λ| = 0.1."] : ["wrong", "Not quite. Solve |1 − 20h| = 1 for h > 0."];
    } },

  { nav: "Spot the behaviour", title: "Decay, oscillation or blow-up?",
    instr: TeX`<p>Euler with \(h=0.15\) is used on \(y'=-10y\), \(y(0)=1\). What do the computed values do?</p>`,
    hints: [TeX`Compute the factor \(1+h\lambda=1-10\cdot0.15\).`],
    answer: TeX`The factor is \(1-1.5=-0.5\): the values \(1,\ -0.5,\ 0.25,\ -0.125,\dots\) flip sign at every step but decay, since \(|-0.5|<1\).`,
    build(C) {
      P.setView(-0.02, 1.0, -1.1, 1.1, { xticks: [0, 0.25, 0.5, 0.75, 1], yticks: [-1, -0.5, 0, 0.5, 1] });
      P.fn(t => Math.exp(-10 * t), { color: "curve", width: 3, domain: [0, 1] });
      setPlotTitle(TeX`The exact solution \(e^{-10t}\); where will the Euler points go?`); P.draw();
      cards(C, ["They decay smoothly, like the exact solution", "They flip sign at every step but decay", "They flip sign and grow without bound", "They grow without changing sign"]);
      return () => {
        if (!S.choice) return ["wrong", "Choose one of the options."];
        if (S.choice !== 2) return ["wrong", "Not quite. Look at the sign and the size of 1 + hλ."];
        P.setView(-0.02, 1.0, -1.1, 1.1, { xticks: [0, 0.25, 0.5, 0.75, 1], yticks: [-1, -0.5, 0, 0.5, 1] });
        P.fn(t => Math.exp(-10 * t), { color: "curve", width: 3, domain: [0, 1] });
        const [t, y] = eulerRun((s, v) => -10 * v, 0, 1, 0.15, 6); polygon(t, y);
        setPlotTitle(TeX`Euler with \(h=0.15\): factor \(-0.5\)`); P.draw();
        return ["done", "Right! Factor −0.5: oscillating, but still decaying."];
      };
    } },

  { nav: "A system", title: "Two steps on y″ = −y",
    instr: TeX`<p>Write \(y''=-y\) as \(y'=v,\ v'=-y\), with \(y(0)=1,\ v(0)=0\) and \(h=0.1\). After two Euler steps, what is \(y_2^2+v_2^2\)? (The exact solution keeps it equal to \(1\).)</p>`,
    hints: [TeX`Step 1: \(y_1=1+0.1\cdot0=1,\ v_1=0-0.1\cdot1=-0.1\). Step 2: \(y_2=y_1+0.1\,v_1,\ v_2=v_1-0.1\,y_1\).`],
    answer: TeX`\(y_2=0.99,\ v_2=-0.2\), so \(y_2^2+v_2^2=0.9801+0.04=1.0201=(1+h^2)^2\). Every step multiplies it by \(1+h^2\): Euler spirals outward.`,
    build(C) {
      P.setView(-1.6, 1.6, -1.35, 1.35, { xticks: [-1, 0, 1], yticks: [-1, 0, 1] });
      P.fn(x => Math.sqrt(Math.max(0, 1 - x * x)), { color: "curve", width: 3, domain: [-1, 1] });
      P.fn(x => -Math.sqrt(Math.max(0, 1 - x * x)), { color: "curve", width: 3, domain: [-1, 1] });
      const t = [1], v = [0]; for (let n = 0; n < 63; n++) { t.push(t[n] + 0.1 * v[n]); v.push(v[n] - 0.1 * t[n]); }
      for (let n = 1; n <= 63; n++) P.seg(t[n - 1], v[n - 1], t[n], v[n], { color: "gold", width: 2 });
      P.pt(1, 0, { color: "ink", r: 5 });
      setPlotTitle(TeX`Phase plane \((y,v)\): the unit circle (exact) and 63 Euler steps with \(h=0.1\)`); P.draw();
      const inp = field(C, "y₂² + v₂² =", "ans1");
      return () => near(parseNum(inp.value), 1.0201, 1e-5) ? ["done", "Correct! 1.0201 = 1.01²: the radius grows at every step."] : ["wrong", "Not quite. y₂ = 0.99 and v₂ = −0.2."];
    } },

  { nav: "The algorithm", title: "Euler's method step by step",
    instr: `<p>Put the steps inside one pass of Euler's method in the right order using the menus.</p>`,
    hints: ["The slope is read at the old point, before anything is updated."],
    answer: "1. Start from tₙ, yₙ  2. Compute the slope s = f(tₙ, yₙ)  3. Set yₙ₊₁ = yₙ + h·s  4. Set tₙ₊₁ = tₙ + h and repeat until n = N",
    build(C) {
      const steps = ["Start from tₙ, yₙ", "Compute the slope s = f(tₙ, yₙ)", "Set yₙ₊₁ = yₙ + h·s", "Set tₙ₊₁ = tₙ + h and repeat until n = N"];
      const order = [2, 0, 3, 1];
      const grid = el("div", { className: "order" }); C.append(grid);
      const sels = [0, 1, 2, 3].map(k => {
        const s = el("select", { id: `dd${k + 1}` });
        s.append(el("option", { value: "" }, "— choose —"), ...order.map(i => { const o = el("option", { value: i }); o.textContent = steps[i]; return o; }));
        grid.append(el("label", { htmlFor: `dd${k + 1}`, className: "steplabel" }, `Step ${k + 1}`), s); return s;
      });
      plotA(5, TeX`Euler's method: follow the tangent for one step, then repeat`);
      return () => {
        const v = sels.map(s => s.value);
        if (v.includes("")) return ["wrong", "Choose an option for every step."];
        if (new Set(v).size < 4) return ["wrong", "Each option should be used exactly once."];
        const bad = v.findIndex((x, k) => +x !== k);
        return bad >= 0 ? ["wrong", `Step ${bad + 1} is not in the right place yet.`] : ["done", "Perfect order! One evaluation of f per step."];
      };
    } },
];

startPractice({
  store: "nm-lec37-euler-v1", lecture: "Lecture 37", tasks: TASKS,
  finalPlot() { plotA(5, TeX`Euler with \(h=0.2\) on \(y'=2t-y\): \(y_5=1.6384\), exact \(1.8394\)`); },
});
