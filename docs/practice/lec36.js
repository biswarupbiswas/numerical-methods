/* Lecture 36 — Initial Value Problems: practice tasks. */
"use strict";

const F = (t, y) => y - t * t + 1;
/** Exact solution of y' = y − t² + 1 through (0, y0). */
const Yex = (t, y0 = 0.5) => (t + 1) ** 2 + (y0 - 1) * Math.exp(t);

/** Direction field: short segments with slope f(t, y), all the same length on screen. */
function slopeField(f, [x0, x1, y0, y1], nx = 14, ny = 12, o = {}) {
  const sx = 740 / (x1 - x0), sy = 610 / (y1 - y0), len = o.len ?? 22;
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
    const t = x0 + (x1 - x0) * (i + 0.5) / nx, y = y0 + (y1 - y0) * (j + 0.5) / ny;
    let s = f(t, y); if (!Number.isFinite(s)) s = 1e6;
    const px = sx, py = sy * s, n = Math.hypot(px, py), dt = len / 2 * px / n / sx, dy = len / 2 * py / n / sy;
    P.seg(t - dt, y - dy, t + dt, y + dy, { color: "muted", width: 1.6, alpha: 0.7 });
  }
}
function fieldPlot(f, view, title, extra = () => {}) {
  P.setView(...view.box, { xticks: view.xticks, yticks: view.yticks, xlabel: "t" });
  slopeField(f, view.box, view.nx, view.ny);
  extra(); setPlotTitle(title); P.draw();
}
const EXV = { box: [0, 2.05, -0.5, 7], xticks: [0, 0.5, 1, 1.5, 2], yticks: [0, 2, 4, 6] };
const H = 0.5, TJ = [0, 0.5, 1, 1.5, 2], YJ = [0.5, 1.25, 2.25, 3.375, 4.4375];

const TASKS = [
  { nav: "Read a slope", title: "One arrow of the direction field",
    instr: TeX`<p>For \(y'=y-t^2+1\) every point \((t,y)\) carries the slope \(f(t,y)\). What is the slope of the arrow at the gold point \((1.5,\,3)\)?</p>`,
    hints: [TeX`Substitute \(t=1.5\) and \(y=3\) into \(f(t,y)=y-t^2+1\).`],
    answer: TeX`\(f(1.5,3)=3-2.25+1=1.75\). The solution through that point rises with slope \(1.75\) there.`,
    build(C) {
      fieldPlot(F, EXV, TeX`Direction field of \(y'=y-t^2+1\)`, () => {
        const s = F(1.5, 3); P.seg(1.5 - 0.18, 3 - 0.18 * s, 1.5 + 0.18, 3 + 0.18 * s, { color: "gold", width: 4 }); P.pt(1.5, 3, { color: "gold", r: 6 });
      });
      const inp = field(C, "slope =", "ans1");
      return () => near(parseNum(inp.value), 1.75, 1e-6) ? ["done", "Correct! f(1.5, 3) = 1.75."] : ["wrong", "Not quite. Compute y − t² + 1 at t = 1.5, y = 3."];
    } },

  { nav: "Pick the curve", title: "Choose the initial value",
    instr: TeX`<p>The solutions of \(y'=y-t^2+1\) are \(y=(t+1)^2+(y_0-1)e^t\). Drag \(y_0\) until the curve passes through the gold point \((1,\,3)\). Which \(y_0=y(0)\) does it exactly? (4 decimals)</p>`,
    hints: [TeX`At \(t=1\): \(4+(y_0-1)e=3\). Solve for \(y_0\).`],
    answer: TeX`\((y_0-1)e=-1\), so \(y_0=1-\frac1e\approx0.6321\). The initial value picks exactly one curve of the family.`,
    build(C) {
      slider(C, "y_0", "s1", -0.5, 1.5, 0.01, 0.2, y0 => fieldPlot(F, EXV, TeX`Solution with \(y(0)=${y0.toFixed(2)}\): \(y(1)=${Yex(1, y0).toFixed(3)}\)`, () => {
        P.fn(t => Yex(t, y0), { color: "curve", width: 3, domain: [0, 2] }); P.pt(0, y0, { color: "curve", r: 6 }); P.pt(1, 3, { color: "gold", r: 7, ring: true });
      }));
      const inp = field(C, "y₀ =", "ans1");
      return () => near(parseNum(inp.value), 1 - 1 / Math.E, 1e-4) ? ["done", "Correct! y₀ = 1 − 1/e ≈ 0.6321."] : ["wrong", "Not quite. Put t = 1 and y = 3 into the family and solve for y₀."];
    } },

  { nav: "Integration as an IVP", title: "When f does not depend on y",
    instr: TeX`<p>Solve \(y'=3t^2\), \(y(1)=2\). What is \(y(2)\)? Notice in the plot that all arrows on a vertical line are parallel: the slope depends on \(t\) only.</p>`,
    hints: [TeX`\(y(2)=y(1)+\int_1^2 3t^2\,dt\).`],
    answer: TeX`\(y(2)=2+\big[t^3\big]_1^2=2+7=9\). Integration is the special case \(y'=f(t)\) of an initial value problem.`,
    build(C) {
      fieldPlot((t, y) => 3 * t * t, { box: [0, 2.1, 0, 10], xticks: [0, 0.5, 1, 1.5, 2], yticks: [0, 2, 4, 6, 8, 10], nx: 12, ny: 10 }, TeX`\(y'=3t^2\): the solution \(y=t^3+1\) through \((1,2)\)`, () => {
        P.fn(t => t ** 3 + 1, { color: "curve", width: 3, domain: [0, 2.1] }); P.pt(1, 2, { color: "gold", r: 6 });
      });
      const inp = field(C, "y(2) =", "ans1");
      return () => near(parseNum(inp.value), 9, 1e-6) ? ["done", "Correct! y(2) = 2 + 7 = 9."] : ["wrong", "Not quite. Add the integral of 3t² from 1 to 2 to the starting value 2."];
    } },

  { nav: "Lipschitz constant", title: "Find L",
    instr: TeX`<p>Find the smallest Lipschitz constant \(L\) of \(f(t,y)=-2ty\) in \(y\) on the strip \(0\le t\le1\), \(y\in\mathbb R\). The plot shows \(\big|\frac{\partial f}{\partial y}\big|\) against \(t\).</p>`,
    hints: [TeX`\(\frac{\partial f}{\partial y}=-2t\). How large can \(|{-2t}|\) be for \(0\le t\le1\)?`],
    answer: TeX`\(|f(t,y_1)-f(t,y_2)|=2t\,|y_1-y_2|\le2\,|y_1-y_2|\), so \(L=2\). Hence \(y'=-2ty\), \(y(0)=1\) is well-posed on \([0,1]\) (its solution is \(e^{-t^2}\)).`,
    build(C) {
      P.setView(-0.05, 1.1, 0, 2.6, { xticks: [0, 0.5, 1], yticks: [0, 1, 2], xlabel: "t" });
      P.fn(t => 2 * t, { color: "curve", width: 3, domain: [0, 1] }); P.seg(0, 2, 1.1, 2, { color: "gold", width: 2, dash: true });
      P.tex(0.3, 2.2, "L", { color: "gold", size: 18 }); P.pt(1, 2, { color: "gold", r: 6 });
      setPlotTitle(TeX`\(\big|\frac{\partial f}{\partial y}\big|=2t\) on \([0,1]\)`); P.draw();
      const inp = field(C, "L =", "ans1");
      return () => near(parseNum(inp.value), 2, 1e-6) ? ["done", "Correct! L = 2, so the problem is well-posed."] : ["wrong", "Not quite. Take the largest value of |∂f/∂y| = 2t on the strip."];
    } },

  { nav: "Spot the failure", title: "Which one is not Lipschitz?",
    instr: TeX`<p>On the strip \(0\le t\le3\), \(y\in\mathbb R\), which right-hand side is <b>not</b> Lipschitz in \(y\)? The plot shows the two solutions \(y\equiv0\) and \(y=\big(\frac{2t}{3}\big)^{3/2}\) of one of these equations with \(y(0)=0\).</p>`,
    hints: [TeX`Look for a \(\frac{\partial f}{\partial y}\) that is unbounded, for example near \(y=0\).`],
    answer: TeX`\(f=y^{1/3}\): \(\frac{\partial f}{\partial y}=\frac13y^{-2/3}\to\infty\) as \(y\to0\), and uniqueness fails. The others have \(L=3\) (\(t|y|\)), \(L=2\) (\(e^{-t}\sin2y+t^2\)) and \(L=1\) (\(y\cos t\)).`,
    build(C) {
      P.setView(-0.1, 3.1, -0.2, 3.2, { xticks: [0, 1, 2, 3], yticks: [0, 1, 2, 3], xlabel: "t" });
      slopeField((t, y) => Math.cbrt(y), [0, 3, 0, 3], 12, 10);
      P.seg(0, 0, 3, 0, { color: "gold", width: 4 }); P.fn(t => (2 * t / 3) ** 1.5, { color: "curve", width: 3, domain: [0, 3] });
      setPlotTitle(TeX`Two solutions from \((0,0)\): \(y\equiv0\) (gold) and \(\big(\tfrac{2t}{3}\big)^{3/2}\)`); P.draw();
      cards(C, [TeX`\(f=y\cos t\)`, TeX`\(f=t\,|y|\)`, TeX`\(f=e^{-t}\sin(2y)+t^2\)`, TeX`\(f=y^{1/3}\)`]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 4 ? ["done", "Right! The cube root has an infinite slope at y = 0, and y′ = y^(1/3), y(0) = 0 has two solutions."] : ["wrong", "That one is Lipschitz: its change in y is bounded by a constant times |y₁ − y₂|."];
    } },

  { nav: "Blow-up time", title: "When does the solution end?",
    instr: TeX`<p>Solve \(y'=y^2\), \(y(0)=2\) by separating variables. At which time \(t^*\) does the solution blow up?</p>`,
    hints: [TeX`\(-\frac1y=t+C\), and \(y(0)=2\) gives \(C=-\frac12\). So \(y=\frac{1}{\frac12-t}\).`],
    answer: TeX`\(y=\frac{2}{1-2t}\), which blows up at \(t^*=0.5\). Starting higher makes the blow-up come sooner: from \(y(0)=y_0>0\) it is at \(t=\frac1{y_0}\).`,
    build(C) {
      P.setView(0, 0.7, 0, 12, { xticks: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7], yticks: [0, 2, 4, 6, 8, 10, 12], xlabel: "t" });
      slopeField((t, y) => y * y, [0, 0.7, 0, 12], 10, 10);
      P.fn(t => 2 / (1 - 2 * t), { color: "curve", width: 3, domain: [0, 0.4999] }); P.pt(0, 2, { color: "gold", r: 6 });
      setPlotTitle(TeX`\(y'=y^2,\ y(0)=2\): the curve shoots off to infinity`); P.draw();
      const inp = field(C, "t* =", "ans1");
      return () => near(parseNum(inp.value), 0.5, 1e-6) ? ["done", "Correct! y = 2/(1 − 2t) blows up at t = 0.5."] : ["wrong", "Not quite. Find where the denominator of y = 1/(1/2 − t) vanishes."];
    } },

  { nav: "Pendulum as a system", title: "One arrow in the phase plane",
    instr: TeX`<p>The pendulum \(\theta''=-4\sin\theta\) becomes the system \(y_1'=y_2\), \(y_2'=-4\sin y_1\) with \(y_1=\theta\), \(y_2=\theta'\). At the gold point \(\theta=0.5\), \(\theta'=1\), what is \(y_2'\)? (4 decimals, radians)</p>`,
    hints: [TeX`\(y_2'=-4\sin(0.5)\). Use radians.`],
    answer: TeX`\(y_2'=-4\sin0.5\approx-1.9177\), and \(y_1'=y_2=1\): the arrow at that point is \((1,\,-1.9177)\). The angle grows while the angular velocity drops.`,
    build(C) {
      P.setView(-3.3, 3.3, -3.3, 3.3, { xticks: [-3, -2, -1, 0, 1, 2, 3], yticks: [-3, -2, -1, 0, 1, 2, 3], xlabel: "\\theta" });
      const sx = 740 / 6.6, sy = 610 / 6.6;
      for (let i = 0; i < 13; i++) for (let j = 0; j < 13; j++) {
        const th = -3 + i * 0.5, om = -3 + j * 0.5, a = om, b = -4 * Math.sin(th), n = Math.hypot(a * sx, b * sy); if (n < 1e-9) continue;
        const dt = 11 * a / n, dw = 11 * b / n; P.seg(th - dt, om - dw, th + dt, om + dw, { color: "muted", width: 1.6, alpha: 0.7 });
      }
      P.fn(x => Math.sqrt(Math.max(8 * (Math.cos(x) - Math.cos(1.2)), 0)), { color: "curve", width: 2, domain: [-1.2, 1.2] });
      P.fn(x => -Math.sqrt(Math.max(8 * (Math.cos(x) - Math.cos(1.2)), 0)), { color: "curve", width: 2, domain: [-1.2, 1.2] });
      const a = 1, b = -4 * Math.sin(0.5), n = Math.hypot(a, b); P.seg(0.5, 1, 0.5 + 0.7 * a / n, 1 + 0.7 * b / n, { color: "gold", width: 4 }); P.pt(0.5, 1, { color: "gold", r: 6 });
      setPlotTitle(TeX`Phase plane of \(\theta''=-4\sin\theta\): \(\theta\) across, \(\theta'\) up`); P.draw();
      const inp = field(C, "y₂′ =", "ans1");
      return () => near(parseNum(inp.value), -4 * Math.sin(0.5), 1e-4) ? ["done", "Correct! The field arrow there is (1, −1.9177)."] : ["wrong", "Not quite. Compute −4 sin(0.5) in radians (mind the sign)."];
    } },

  { nav: "Global error", title: "The gap at a grid point",
    instr: TeX`<p>A method with \(h=0.5\) gave, for \(y'=y-t^2+1\), \(y(0)=0.5\), the values \(y_0,\dots,y_4=0.5,\ 1.25,\ 2.25,\ 3.375,\ 4.4375\) at \(t_j=0,0.5,1,1.5,2\). The exact solution is \(y=(t+1)^2-\frac12e^t\). What is the global error \(|y(t_3)-y_3|\)? (4 decimals)</p>`,
    hints: [TeX`\(t_3=1.5\): \(y(1.5)=6.25-\frac12e^{1.5}\approx4.0092\).`],
    answer: TeX`\(|4.0092-3.375|\approx0.6342\). The errors grow along the way: \(0.18,\ 0.39,\ 0.63,\ 0.87\).`,
    build(C) {
      P.setView(-0.05, 2.1, 0, 6, { xticks: TJ, yticks: [0, 1, 2, 3, 4, 5, 6], xlabel: "t" });
      P.fn(t => Yex(t), { color: "curve", width: 3, domain: [0, 2] });
      TJ.forEach((t, j) => { if (j) P.seg(t, YJ[j], t, Yex(t), { color: "neg", width: 3 }); P.pt(t, YJ[j], { color: "gold", r: 6 }); });
      setPlotTitle(TeX`True curve \(y(t)\) and the computed values \(y_j\) (gold); gaps in red`); P.draw();
      const inp = field(C, "|y(t₃) − y₃| =", "ans1");
      return () => near(parseNum(inp.value), Yex(1.5) - 3.375, 1e-4) ? ["done", "Correct! 0.6342 at t = 1.5."] : ["wrong", "Not quite. Evaluate the exact solution at t₃ = 1.5 and subtract y₃ = 3.375."];
    } },

  { nav: "The procedure", title: "Solving an IVP numerically",
    instr: `<p>Put the steps of solving an initial value problem numerically in the right order using the menus.</p>`,
    hints: ["Theory comes before computing; the march goes forward from the initial value."],
    answer: "1. Check that f is continuous and Lipschitz in y (the problem is well-posed)  2. Choose a step h and the grid tⱼ = t₀ + jh  3. Start from y₀, the given initial value  4. Step from yⱼ to yⱼ₊₁ using the slopes f, for j = 0, 1, …, N − 1",
    build(C) {
      const steps = ["Check that f is continuous and Lipschitz in y (the problem is well-posed)", "Choose a step h and the grid tⱼ = t₀ + jh", "Start from y₀, the given initial value", "Step from yⱼ to yⱼ₊₁ using the slopes f, for j = 0, 1, …, N − 1"];
      const order = [2, 0, 3, 1];
      const grid = el("div", { className: "order" }); C.append(grid);
      const sels = [0, 1, 2, 3].map(k => {
        const s = el("select", { id: `dd${k + 1}` });
        s.append(el("option", { value: "" }, "— choose —"), ...order.map(i => { const o = el("option", { value: i }); o.textContent = steps[i]; return o; }));
        grid.append(el("label", { htmlFor: `dd${k + 1}`, className: "steplabel" }, `Step ${k + 1}`), s); return s;
      });
      fieldPlot(F, EXV, TeX`Grid \(t_j=jh\), \(h=0.5\), and computed values \(y_j\)`, () => {
        P.fn(t => Yex(t), { color: "curve", width: 3, domain: [0, 2] });
        TJ.forEach((t, j) => { P.seg(t, -0.5, t, 7, { color: "muted", width: 1, dash: true, alpha: 0.6 }); P.pt(t, YJ[j], { color: "gold", r: 6 }); });
      });
      return () => {
        const v = sels.map(s => s.value);
        if (v.includes("")) return ["wrong", "Choose an option for every step."];
        if (new Set(v).size < 4) return ["wrong", "Each option should be used exactly once."];
        const bad = v.findIndex((x, k) => +x !== k);
        return bad >= 0 ? ["wrong", `Step ${bad + 1} is not in the right place yet.`] : ["done", "Perfect order! Next lecture fills in step 4: Euler's method."];
      };
    } },
];

startPractice({
  store: "nm-lec36-ode-intro-v1", lecture: "Lecture 36", tasks: TASKS,
  finalPlot() {
    fieldPlot(F, EXV, TeX`\(y'=y-t^2+1\): one curve for each initial value`, () => {
      [0, 0.5, 1].forEach((y0, k) => { P.fn(t => Yex(t, y0), { color: ["pos", "gold", "curve"][k], width: 3, domain: [0, 2] }); P.pt(0, y0, { color: ["pos", "gold", "curve"][k], r: 5 }); });
    });
  },
});
