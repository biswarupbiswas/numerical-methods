/* Lecture 42 — A-Stability and Stiff Problems: practice tasks. */
"use strict";

const L = 1000;
/** Exact solution of y' = −1000 (y − cos t), y(0) = 1. */
const exStiff = t => (1 - L * L / (L * L + 1)) * Math.exp(-L * t) + (L * L * Math.cos(t) + L * Math.sin(t)) / (L * L + 1);
const feStiff = (h, N) => { const y = [1]; let t = 0; for (let n = 0; n < N; n++) { y.push(y[n] - h * L * (y[n] - Math.cos(t))); t += h; } return y; };
const beStiff = (h, N) => { const y = [1]; let t = 0; for (let n = 0; n < N; n++) { t += h; y.push((y[n] + L * h * Math.cos(t)) / (1 + L * h)); } return y; };

function polygon(t, y, col = "gold", r = 5) {
  t.forEach((ti, k) => { if (k) P.seg(t[k - 1], y[k - 1], ti, y[k], { color: col, width: 2.5 }); P.pt(ti, y[k], { color: col, r }); });
}
const steps = (h, N) => Array.from({ length: N + 1 }, (_, k) => k * h);

/** Unit-radius disk around (cx, 0) in the complex plane: shaded with thin chords, plus its outline. */
function disk(cx, color, alpha = 0.22) {
  for (let k = -40; k <= 40; k++) { const y = k / 40, w = Math.sqrt(Math.max(0, 1 - y * y)); P.seg(cx - w, y, cx + w, y, { color, width: 6, alpha }); }
  circle(cx, 0, 1, color);
}
function circle(cx, cy, r, color, width = 2.5) {
  for (let k = 0; k < 96; k++) {
    const a = 2 * Math.PI * k / 96, b = 2 * Math.PI * (k + 1) / 96;
    P.seg(cx + r * Math.cos(a), cy + r * Math.sin(a), cx + r * Math.cos(b), cy + r * Math.sin(b), { color, width });
  }
}

function stiffPlot(title, withEuler = true) {
  P.setView(-0.1, 3.1, -1.6, 1.6, { xticks: [0, 1, 2, 3], yticks: [-1, 0, 1] });
  P.fn(Math.cos, { color: "muted", width: 6, alpha: 0.5 });
  P.fn(exStiff, { color: "curve", width: 2.5, domain: [0, 3] });
  if (withEuler) {
    const y = feStiff(0.0021, 238); let k = y.findIndex(v => Math.abs(v) > 1.6); if (k < 0) k = y.length;
    for (let n = 1; n < k; n++) P.seg((n - 1) * 0.0021, y[n - 1], n * 0.0021, y[n], { color: "neg", width: 1.5 });
  }
  const yb = beStiff(0.1, 30); yb.forEach((v, n) => P.pt(n * 0.1, v, { color: "pos", r: 4 }));
  setPlotTitle(title); P.draw();
}

const TASKS = [
  { nav: "Spot it", title: "Which problem is stiff?",
    instr: TeX`<p>All four solutions are smooth on \(0\le t\le3\). For which one does Euler's method need a step far smaller than accuracy requires?</p>`,
    hints: [TeX`Look for a rapidly decaying component: \(\partial f/\partial y\) large and negative.`],
    answer: TeX`\(y'=-1000\,(y-\cos t)\): here \(\partial f/\partial y=-1000\), so Euler needs \(h\lt 0.002\) although the solution just follows \(\cos t\).`,
    build(C) {
      stiffPlot(TeX`The solution of \(y'=-1000(y-\cos t)\) (blue) hugs \(\cos t\); Euler with \(h=0.0021\) (red) blows up, backward Euler with \(h=0.1\) (green) is fine`);
      cards(C, [TeX`\(y'=t+y\)`, TeX`\(y'=-y+\sin t\)`, TeX`\(y'=-1000\,(y-\cos t)\)`, TeX`\(y'=0.5\,y\)`]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 3 ? ["done", "Right! A component decaying like e^(−1000t) controls an explicit method's step."] : ["wrong", "Not quite. Which right-hand side has a large negative ∂f/∂y?"];
    } },

  { nav: "Euler's limit", title: "The largest stable step",
    instr: TeX`<p>For \(y'=-20y\), Euler multiplies by \(1+h\lambda=1-20h\) at each step. Drag \(h\) and watch the values. What is the largest \(h\) for which Euler is stable?</p>`,
    hints: [TeX`Stability needs \(-2\le h\lambda\le0\), that is \(|1-20h|\le1\).`],
    answer: TeX`\(h=2/20=0.1\). At \(h=0.1\) the factor is \(-1\): the values flip sign but do not grow; beyond it they explode.`,
    build(C) {
      const draw = h => {
        const g = 1 - 20 * h, N = 12;
        P.setView(-0.5, N + 0.5, -3, 3, { xticks: [0, 4, 8, 12], yticks: [-2, -1, 0, 1, 2], xlabel: "n" });
        for (let n = 0; n <= N; n++) { const v = Math.max(-3, Math.min(3, g ** n)); P.seg(n, 0, n, v, { color: Math.abs(g) <= 1 ? "pos" : "neg", width: 3 }); P.pt(n, v, { color: Math.abs(g) <= 1 ? "pos" : "neg", r: 4 }); }
        setPlotTitle(TeX`\(h=${h.toFixed(3)}\): \(y_n=(1-20h)^n=(${g.toFixed(2)})^n\)`); P.draw();
      };
      slider(C, "h", "s1", 0.01, 0.14, 0.01, 0.03, v => draw(v));
      const inp = field(C, "largest h =", "ans1");
      return () => near(parseNum(inp.value), 0.1, 1e-6) ? ["done", "Correct! h ≤ 2/|λ| = 0.1."] : ["wrong", "Not quite. Solve |1 − 20h| ≤ 1 for h > 0."];
    } },

  { nav: "Backward steps", title: "Backward Euler on y′ = −50y",
    instr: TeX`<p>With \(h=0.05\), backward Euler gives \(y_{n+1}=\dfrac{y_n}{1+50h}=\dfrac{y_n}{3.5}\). Starting from \(y_0=1\), what is \(y_2\)? (5 decimals)</p>`,
    hints: [TeX`\(y_1=1/3.5=0.28571\); divide by \(3.5\) again.`],
    answer: TeX`\(y_2=1/3.5^2=0.08163\). The exact value is \(e^{-5}=0.00674\); Euler gives \((-1.5)^2=2.25\).`,
    build(C) {
      P.setView(-0.005, 0.21, -4, 6, { xticks: [0, 0.05, 0.1, 0.15, 0.2], yticks: [-2, 0, 2, 4] });
      P.fn(t => Math.exp(-50 * t), { color: "curve", width: 3, domain: [0, 0.2] });
      const ts = steps(0.05, 4); polygon(ts, ts.map((_, n) => (-1.5) ** n), "neg", 5);
      polygon(ts.slice(0, 2), [1, 1 / 3.5], "pos", 5);
      setPlotTitle(TeX`Euler (red) zigzags and grows; backward Euler (green) decays`); P.draw();
      const inp = field(C, "y₂ =", "ans1");
      return () => near(parseNum(inp.value), 0.08163, 2e-5) ? ["done", "Correct! 0.08163: it decays, as the true solution does."] : ["wrong", "Not quite. Divide y₁ = 0.28571 by 3.5."];
    } },

  { nav: "Linear case", title: "Backward Euler on y′ = t + y",
    instr: TeX`<p>For \(y'=t+y\), \(y(0)=1\), \(h=0.1\), the implicit equation can be solved directly: \(y_{n+1}=\dfrac{y_n+h\,t_{n+1}}{1-h}\). With \(y_1=1.12222\), compute \(y_2\). (5 decimals)</p>`,
    hints: [TeX`\(t_2=0.2\), so the numerator is \(1.12222+0.02\).`],
    answer: TeX`\(y_2=1.14222/0.9=1.26914\). Exact \(y(0.2)=1.24281\); forward Euler gives \(1.22\): one below, one above.`,
    build(C) {
      P.setView(-0.01, 0.23, 0.95, 1.32, { xticks: [0, 0.1, 0.2], yticks: [1, 1.1, 1.2, 1.3] });
      P.fn(t => 2 * Math.exp(t) - t - 1, { color: "curve", width: 3, domain: [0, 0.23] });
      polygon([0, 0.1, 0.2], [1, 1.1, 1.22], "neg", 5);
      polygon([0, 0.1], [1, 1.12222], "pos", 5);
      setPlotTitle(TeX`Forward Euler (red) lands below the curve, backward Euler (green) above`); P.draw();
      const inp = field(C, "y₂ =", "ans1");
      return () => near(parseNum(inp.value), 1.26914, 1e-5) ? ["done", "Correct! 1.26914 against the exact 1.24281."] : ["wrong", "Not quite. y₂ = (1.12222 + 0.1 · 0.2) / 0.9."];
    } },

  { nav: "Newton step", title: "Solve the implicit equation",
    instr: TeX`<p>One backward Euler step with \(h=1\) for \(y'=-y^3\), \(y(0)=1\) needs the root of \(g(Y)=Y+Y^3-1\). Newton from \(Y^{(0)}=1\) gives \(Y^{(1)}=0.75\). Compute \(Y^{(2)}=Y^{(1)}-g(Y^{(1)})/g'(Y^{(1)})\). (5 decimals)</p>`,
    hints: [TeX`\(g(0.75)=0.75+0.421875-1=0.171875\) and \(g'(Y)=1+3Y^2=2.6875\).`],
    answer: TeX`\(Y^{(2)}=0.75-0.171875/2.6875=0.68605\). Two more steps settle at \(0.68233\).`,
    build(C) {
      const g = Y => Y + Y ** 3 - 1;
      P.setView(-0.02, 1.1, -1.1, 1.3, { xticks: [0, 0.25, 0.5, 0.75, 1], yticks: [-1, 0, 1], xlabel: "Y" });
      P.fn(g, { color: "curve", width: 3 });
      P.seg(1, 0, 1, 1, { color: "muted", width: 1.5, dash: true }); P.seg(1, 1, 0.75, 0, { color: "gold", width: 2.5 });
      P.pt(1, 0, { color: "ink", r: 5 }); P.pt(0.75, 0, { color: "gold", r: 5 });
      P.seg(0.75, 0, 0.75, g(0.75), { color: "muted", width: 1.5, dash: true }); P.pt(0.75, g(0.75), { color: "gold", r: 4, ring: true });
      setPlotTitle(TeX`\(g(Y)=Y+Y^3-1\): the first Newton tangent (gold)`); P.draw();
      const inp = field(C, "Y⁽²⁾ =", "ans1");
      return () => near(parseNum(inp.value), 0.686047, 2e-5) ? ["done", "Correct! 0.68605: Newton converges quickly to 0.68233."] : ["wrong", "Not quite. Compute g(0.75) and g′(0.75) = 1 + 3 · 0.75², then subtract the ratio."];
    } },

  { nav: "Regions", title: "Inside or outside?",
    instr: TeX`<p>Take \(z=h\lambda=-1.5+1.5i\). Drag the point if you like and compare it with the regions: Euler (red disk, \(|1+z|\le1\)) and backward Euler (everything outside the green circle, \(|1-z|\ge1\)). For \(z=-1.5+1.5i\) one also finds \(|G_{\mathrm{RK2}}|\approx0.90\) and \(|G_{\mathrm{RK4}}|\approx0.43\). Which methods are stable there?</p>`,
    hints: [TeX`\(|1+z|=|-0.5+1.5i|=\sqrt{2.5}\approx1.58\).`],
    answer: TeX`RK2, RK4 and backward Euler are stable; Euler is not, since \(|1+z|\approx1.58\gt1\).`,
    build(C) {
      let re = -1.5, im = 1.5;
      const draw = () => {
        P.setView(-3.2, 2.4, -2.2, 2.2, { xticks: [-3, -2, -1, 0, 1, 2], yticks: [-2, -1, 0, 1, 2], xlabel: "\\text{Re}\\,z" });
        disk(-1, "neg"); circle(1, 0, 1, "pos", 3);
        const z = [re, im], eu = Math.hypot(1 + re, im), be = Math.hypot(1 - re, im);
        P.pt(re, im, { color: "gold", r: 7 });
        setPlotTitle(TeX`\(z=${re.toFixed(2)}${im < 0 ? "" : "+"}${im.toFixed(2)}i\): \(|1+z|=${eu.toFixed(2)}\), \(|1-z|=${be.toFixed(2)}\)`); P.draw();
        return z;
      };
      slider(C, "\\mathrm{Re}\\,z", "s1", -3, 2, 0.1, -1.5, v => { re = v; draw(); });
      slider(C, "\\mathrm{Im}\\,z", "s2", -2, 2, 0.1, 1.5, v => { im = v; draw(); });
      draw();
      cards(C, ["Only backward Euler", "RK2, RK4 and backward Euler, but not Euler", "All four methods", "None of them"]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 2 ? ["done", "Right! The point lies outside Euler's disk but inside the larger RK regions, and in the left half-plane."] : ["wrong", "Not quite. Compare each |G| with 1."];
    } },

  { nav: "A-stable?", title: "Which methods are A-stable?",
    instr: TeX`<p>A method is A-stable when its stability region contains the whole left half-plane \(\mathrm{Re}\,z\le0\). Which list contains exactly the A-stable methods among Euler, RK4, backward Euler and the trapezoidal rule?</p>`,
    hints: [TeX`An explicit method has a polynomial \(G(z)\), which grows without bound.`],
    answer: TeX`Backward Euler (\(G=\frac1{1-z}\)) and the trapezoidal rule (\(G=\frac{1+z/2}{1-z/2}\)). Euler and RK4 have bounded regions.`,
    build(C) {
      P.setView(-6, 0.5, 0, 3, { xticks: [-6, -5, -4, -3, -2, -1, 0], yticks: [0, 1, 2, 3], xlabel: "z" });
      P.seg(-6, 1, 0.5, 1, { color: "muted", width: 1.5, dash: true });
      P.fn(x => Math.abs(1 + x), { color: "neg", width: 3 });
      P.fn(x => Math.abs(1 + x + x * x / 2 + x ** 3 / 6 + x ** 4 / 24), { color: "gold", width: 3 });
      P.fn(x => Math.abs(1 / (1 - x)), { color: "pos", width: 3, domain: [-6, 0.3] });
      P.fn(x => Math.abs((1 + x / 2) / (1 - x / 2)), { color: "curve", width: 3, domain: [-6, 0.3] });
      setPlotTitle(TeX`\(|G(z)|\) on the negative real axis: Euler (red), RK4 (gold), backward Euler (green), trapezoidal (blue)`); P.draw();
      cards(C, ["Euler and RK4", "Only backward Euler", "Backward Euler and the trapezoidal rule", "All four"]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 3 ? ["done", "Right! Both implicit methods keep |G| ≤ 1 on the whole left half-plane."] : ["wrong", "Not quite. Which curves stay below 1 however far left you go?"];
    } },

  { nav: "Count steps", title: "The price of stiffness",
    instr: TeX`<p>For \(y'=-1000\,(y-\cos t)\), Euler is stable only for \(h\le 2/1000\). How many Euler steps are needed, at least, to reach \(t=10\)? (Backward Euler does it in 100 steps with \(h=0.1\), error about \(5\times10^{-5}\).)</p>`,
    hints: [TeX`Number of steps \(=10/h\).`],
    answer: TeX`\(10/0.002=5000\) steps, fifty times more than backward Euler; RK4 would need about \(3591\) steps of four evaluations each.`,
    build(C) {
      P.setView(-0.5, 3.5, 0, 5600, { xticks: [], yticks: [0, 1000, 2000, 3000, 4000, 5000] });
      P.band(0.1, 0.9, 0, 5000, { color: "neg", alpha: 0.85 }); P.band(1.1, 1.9, 0, 3591, { color: "gold", alpha: 0.85 }); P.band(2.1, 2.9, 0, 100, { color: "pos", alpha: 0.95 });
      P.tex(0.5, 5300, "\\text{Euler}", { color: "neg" }); P.tex(1.5, 3900, "\\text{RK4}", { color: "gold" }); P.tex(2.5, 400, "\\text{backward Euler}", { color: "pos" });
      setPlotTitle(TeX`Steps needed to reach \(t=10\)`); P.draw();
      const inp = field(C, "steps =", "ans1");
      return () => near(parseNum(inp.value), 5000, 1e-6) ? ["done", "Correct! 5000 steps, just to stay stable."] : ["wrong", "Not quite. Divide 10 by the largest stable step 0.002."];
    } },

  { nav: "The algorithm", title: "Backward Euler with Newton",
    instr: `<p>Put the steps of one backward Euler step in the right order using the menus.</p>`,
    hints: ["Newton needs a starting guess, and the new value is only known when Newton has converged."],
    answer: "1. Set tₙ₊₁ = tₙ + h  2. Predict Y with a forward Euler step  3. Repeat the Newton update Y ← Y − g(Y)/(1 − h f_y) until the change is small  4. Set yₙ₊₁ = Y",
    build(C) {
      const stepsTxt = ["Set tₙ₊₁ = tₙ + h", "Predict Y with a forward Euler step", "Repeat the Newton update Y ← Y − g(Y)/(1 − h f_y) until the change is small", "Set yₙ₊₁ = Y"];
      const order = [3, 1, 0, 2];
      const grid = el("div", { className: "order" }); C.append(grid);
      const sels = [0, 1, 2, 3].map(k => {
        const s = el("select", { id: `dd${k + 1}` });
        s.append(el("option", { value: "" }, "— choose —"), ...order.map(i => { const o = el("option", { value: i }); o.textContent = stepsTxt[i]; return o; }));
        grid.append(el("label", { htmlFor: `dd${k + 1}`, className: "steplabel" }, `Step ${k + 1}`), s); return s;
      });
      stiffPlot(TeX`Backward Euler with \(h=0.1\) (green) on the stiff problem`, false);
      return () => {
        const v = sels.map(s => s.value);
        if (v.includes("")) return ["wrong", "Choose an option for every step."];
        if (new Set(v).size < 4) return ["wrong", "Each option should be used exactly once."];
        const bad = v.findIndex((x, k) => +x !== k);
        return bad >= 0 ? ["wrong", `Step ${bad + 1} is not in the right place yet.`] : ["done", "Perfect order! One equation solved per step."];
      };
    } },
];

startPractice({
  store: "nm-lec42-stiff-v1", lecture: "Lecture 42", tasks: TASKS,
  finalPlot() { stiffPlot(TeX`\(y'=-1000(y-\cos t)\): Euler with \(h=0.0021\) blows up, backward Euler with \(h=0.1\) follows \(\cos t\)`); },
});
