/* Lecture 20 — Successive Over-Relaxation (SOR): practice tasks. */
"use strict";

/** ρ(H(ω)) for a consistently ordered matrix whose Jacobi radius is mu (Young's relation). */
function rhoSor(w, mu) {
  const d = w * w * mu * mu - 4 * (w - 1);
  return d >= 0 ? Math.max(Math.abs(w - 1), ((w * mu + Math.sqrt(d)) / 2) ** 2) : Math.abs(w - 1);
}

const MU = Math.sqrt(11 / 18);                       // the lecture example
const WOPT = 2 / (1 + Math.sqrt(1 - MU * MU));

/** The curve ρ(H(ω)) on (0, 2), with an optional marked ω. */
function curvePlot(mu, w, title) {
  P.setView(0, 2, 0, 1.05, { xlabel: "ω", xticks: [0, 0.5, 1, 1.5, 2], yticks: [0, 0.25, 0.5, 0.75, 1] });
  P.fn(x => rhoSor(Math.min(Math.max(x, 1e-3), 1.999), mu), { color: "curve" });
  if (w !== undefined) { P.seg(w, 0, w, rhoSor(w, mu), { color: "gold", width: 1 }); P.pt(w, rhoSor(w, mu), { color: "gold", r: 7 }); }
  setPlotTitle(title); P.draw();
}

const TASKS = [
  { nav: "An SOR update", title: "Go further than Gauss–Seidel",
    instr: TeX`<p>The old value is \(x_i^{(k)}=1\) and the Gauss–Seidel value is \(x_i^{GS}=2\).</p><p>With \(\omega=1.5\), compute \(x_i^{(k+1)}=(1-\omega)\,x_i^{(k)}+\omega\,x_i^{GS}\).</p>`,
    hints: [TeX`\((1-1.5)\cdot1+1.5\cdot2\).`],
    answer: TeX`\(-0.5+3=2.5\): SOR moves \(1.5\) times as far as Gauss–Seidel.`,
    build(C) {
      P.setView(0, 3, -1, 1, { xlabel: "x", xticks: [0, 1, 2, 3], yticks: [], noY: true });
      P.seg(0, 0, 3, 0, { color: "ink", width: 1 });
      P.pt(1, 0, { color: "ink", r: 7 }); P.tex(1, -0.35, TeX`x_i^{(k)}`);
      P.pt(2, 0, { color: "pos", r: 7 }); P.tex(2, -0.35, TeX`x_i^{GS}`, { color: "pos" });
      P.seg(1, 0.3, 2, 0.3, { color: "pos", width: 3 });
      setPlotTitle("The Gauss–Seidel step; where does SOR land?"); P.draw();
      const inp = field(C, TeX`\(x_i^{(k+1)}=\)`, "ans1");
      return () => near(parseNum(inp.value), 2.5, 1e-9) ? ["done", "Correct! Over-relaxation stretches the step by ω."] : ["wrong", "Not quite. Compute (1 − ω)·1 + ω·2 with ω = 1.5."];
    } },

  { nav: "Find the best ω", title: "Drag ω to the bottom",
    instr: TeX`<p>The plot shows \(\rho(H(\omega))\) for the lecture example. Drag \(\omega\) to make \(\rho\) as small as possible.</p><p>Which \(\omega\) is best? (2 decimals)</p>`,
    hints: ["The minimum is at the corner where the curve turns into a straight line."],
    answer: TeX`\(\omega_{\text{opt}}\approx1.23\), where \(\rho\approx0.232\).`,
    build(C) {
      let w = 1;
      const draw = () => curvePlot(MU, w, TeX`\(\omega=${w.toFixed(2)}\): \(\rho=${rhoSor(w, MU).toFixed(3)}\)`);
      draw();
      slider(C, "ω", "sw", 0.05, 1.95, 0.01, 1, v => { w = v; draw(); });
      const inp = field(C, TeX`\(\omega_{\text{opt}}\approx\)`, "ans1");
      return () => Math.abs(parseNum(inp.value) - WOPT) <= 0.02 ? ["done", "Correct! Young's formula gives ω_opt = 1.2318."] : ["wrong", "Not quite. Watch the value of ρ in the plot title as you drag."];
    } },

  { nav: "Kahan", title: "Which ω can never work?",
    instr: TeX`<p>Kahan's theorem says \(\rho(H(\omega))\ge|\omega-1|\) for every matrix.</p><p>Which value of \(\omega\) can never give a convergent SOR iteration?</p>`,
    hints: [TeX`Convergence needs \(\rho<1\), so \(|\omega-1|<1\).`],
    answer: TeX`\(\omega=2.2\): then \(\rho\ge1.2\).`,
    build(C) {
      P.setView(-0.5, 2.5, 0, 1.6, { xlabel: "ω", xticks: [0, 1, 2], yticks: [0, 0.5, 1, 1.5] });
      P.band(0, 2, 0, 1, { color: "pos", alpha: 0.15 });
      P.fn(x => Math.abs(x - 1), { color: "neg" }); P.seg(-0.5, 1, 2.5, 1, { color: "ink", width: 1, alpha: 0.5 });
      setPlotTitle(TeX`Lower bound \(|\omega-1|\)`); P.draw();
      cards(C, [TeX`\(\omega=0.5\)`, TeX`\(\omega=1.8\)`, TeX`\(\omega=2.2\)`]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 3 ? ["done", "Right! Only 0 < ω < 2 can work."] : ["wrong", "That one is inside (0, 2). Look for one outside."];
    } },

  { nav: "Young's formula", title: "Compute the optimal ω",
    instr: TeX`<p>For a consistently ordered matrix with \(\mu=\rho(H_J)=0.8\), compute</p><p>\(\omega_{\text{opt}}=\dfrac{2}{1+\sqrt{1-\mu^2}}\).</p>`,
    hints: [TeX`\(\sqrt{1-0.64}=0.6\).`],
    answer: TeX`\(\omega_{\text{opt}}=2/1.6=1.25\).`,
    build(C) {
      curvePlot(0.8, 1.25, TeX`\(\rho(H(\omega))\) for \(\mu=0.8\)`);
      const inp = field(C, TeX`\(\omega_{\text{opt}}=\)`, "ans1");
      return () => near(parseNum(inp.value), 1.25, 1e-6) ? ["done", "Correct! The minimum of the curve sits at ω = 1.25."] : ["wrong", "Not quite. Compute 1 − 0.8² first, then its square root."];
    } },

  { nav: "ρ at the optimum", title: "How fast at the best ω?",
    instr: TeX`<p>Now take \(\mu=0.6\). Then \(\omega_{\text{opt}}=\dfrac{2}{1+0.8}=\tfrac{10}{9}\).</p><p>What is \(\rho\big(H(\omega_{\text{opt}})\big)\)? (3 decimals)</p>`,
    hints: [TeX`Young: \(\rho\big(H(\omega_{\text{opt}})\big)=\omega_{\text{opt}}-1\).`],
    answer: TeX`\(\tfrac{10}{9}-1=\tfrac19\approx0.111\), against \(\mu^2=0.36\) for Gauss–Seidel.`,
    build(C) {
      curvePlot(0.6, 10 / 9, TeX`\(\rho(H(\omega))\) for \(\mu=0.6\)`);
      const inp = field(C, TeX`\(\rho=\)`, "ans1");
      return () => near(parseNum(inp.value), 1 / 9, 1.5e-3) ? ["done", "Correct! At the optimum, ρ = ω_opt − 1."] : ["wrong", "Not quite. Subtract 1 from ω_opt."];
    } },

  { nav: "Rates", title: "Sweeps for SOR",
    instr: TeX`<p>With \(\mu=0.8\): Gauss–Seidel has \(\rho=0.64\) and needs about \(31\) sweeps to reach \(10^{-6}\). SOR with \(\omega_{\text{opt}}=1.25\) has \(\rho=0.25\).</p><p>About how many SOR sweeps are needed?</p>`,
    hints: [TeX`\(k\approx6/(-\log_{10}0.25)=6/0.602\).`],
    answer: TeX`About \(10\) sweeps.`,
    build(C) {
      P.setView(0, 35, -7, 0.5, { xlabel: "k", xticks: [0, 10, 20, 30], yticks: [-6, -4, -2, 0] });
      P.fn(k => k * Math.log10(0.64), { color: "pos" }); P.fn(k => Math.max(-7, k * Math.log10(0.25)), { color: "gold" });
      P.seg(0, -6, 35, -6, { color: "neg", width: 1, alpha: 0.6 });
      setPlotTitle(TeX`\(\log_{10}\) error: Gauss–Seidel (green), SOR (gold)`); P.draw();
      const inp = field(C, "sweeps ≈", "ans1");
      return () => Math.abs(parseNum(inp.value) - 9.97) <= 1.05 ? ["done", "Correct! Three times fewer sweeps for the same accuracy."] : ["wrong", "Not quite. Divide 6 by −log10(0.25)."];
    } },

  { nav: "Steep side", title: "A rough guess for ω",
    instr: TeX`<p>For the lecture example \(\omega_{\text{opt}}\approx1.23\). You can only guess \(\omega\) to within \(0.1\).</p><p>Which guess gives the smaller \(\rho\)?</p>`,
    hints: ["Look at the slopes on the two sides of the minimum."],
    answer: TeX`\(\omega=1.33\) gives \(\rho=0.33\); \(\omega=1.13\) gives \(\rho\approx0.49\). Overestimate rather than underestimate.`,
    build(C) {
      curvePlot(MU, undefined, TeX`\(\rho(H(\omega))\) for the example`);
      P.pt(1.13, rhoSor(1.13, MU), { color: "neg", r: 6 }); P.pt(1.33, rhoSor(1.33, MU), { color: "pos", r: 6 }); P.draw();
      cards(C, [TeX`\(\omega=1.13\)`, TeX`\(\omega=1.33\)`]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 2 ? ["done", "Right! The curve is steep to the left of ω_opt and gentle to the right."] : ["wrong", "Compare the heights of the two dots."];
    } },

  { nav: "Determinant", title: "Why 0 < ω < 2",
    instr: TeX`<p>For an \(n\times n\) matrix, \(\det H(\omega)=(1-\omega)^n\).</p><p>Compute \(\det H(\omega)\) for \(n=3\), \(\omega=1.5\).</p>`,
    hints: [TeX`\((1-1.5)^3=(-0.5)^3\).`],
    answer: TeX`\(-0.125\). The eigenvalues multiply to this, so \(\rho^3\ge0.125\) and \(\rho\ge0.5=|\omega-1|\).`,
    build(C) {
      curvePlot(MU, 1.5, TeX`At \(\omega=1.5\) the example has \(\rho=0.5=|\omega-1|\)`);
      const inp = field(C, TeX`\(\det H(1.5)=\)`, "ans1");
      return () => near(parseNum(inp.value), -0.125, 1e-9) ? ["done", "Correct! That is the heart of Kahan's theorem."] : ["wrong", "Not quite. Cube (1 − 1.5)."];
    } },

  { nav: "The algorithm", title: "Put SOR in order",
    instr: `<p>Put the steps of SOR in the right order using the menus.</p>`,
    hints: ["Inside each sweep: first the Gauss–Seidel value, then the blend."],
    answer: "1. Choose ω in (0, 2)  2. For i = 1..n: g = (b(i) − Σ_(j≠i) a(ij)·x(j)) / a(ii)  3. x(i) = (1 − ω)·x(i) + ω·g  4. Repeat sweeps until the change is below the tolerance",
    build(C) {
      const steps = ["Choose ω in (0, 2)", "For i = 1..n: g = (b(i) − Σ_(j≠i) a(ij)·x(j)) / a(ii)",
                     "x(i) = (1 − ω)·x(i) + ω·g", "Repeat sweeps until the change is below the tolerance"];
      const order = [2, 0, 3, 1];
      const grid = el("div", { className: "order" }); C.append(grid);
      const sels = [0, 1, 2, 3].map(k => {
        const s = el("select", { id: `dd${k + 1}` });
        s.append(el("option", { value: "" }, "— choose —"), ...order.map(i => { const o = el("option", { value: i }); o.textContent = steps[i]; return o; }));
        grid.append(el("label", { htmlFor: `dd${k + 1}`, className: "steplabel" }, `Step ${k + 1}`), s); return s;
      });
      curvePlot(MU, WOPT, TeX`\(\omega_{\text{opt}}\approx1.2318\)`);
      return () => {
        const v = sels.map(s => s.value);
        if (v.includes("")) return ["wrong", "Choose an option for every step."];
        if (new Set(v).size < 4) return ["wrong", "Each option should be used exactly once."];
        const bad = v.findIndex((x, k) => +x !== k);
        return bad >= 0 ? ["wrong", `Step ${bad + 1} is not in the right place yet.`] : ["done", "Perfect order!"];
      };
    } },
];

startPractice({
  store: "nm-lec20-sor-v1", lecture: "Lecture 20", tasks: TASKS,
  finalPlot() { curvePlot(MU, WOPT, TeX`\(\omega_{\text{opt}}=\dfrac{2}{1+\sqrt{1-\mu^2}}\approx1.2318\)`); },
});
