/* Lecture 17 — Sensitivity and Condition Number: practice tasks. */
"use strict";

/** Draw a small matrix as labelled cells; hl = {"i,j": colour}. */
function drawMatrix(rows, title, hl = {}) {
  const n = rows.length, m = rows[0].length;
  P.setView(-0.6, m + 0.6, -0.6, n + 0.4, { xticks: [], yticks: [], noY: true });
  rows.forEach((r, i) => r.forEach((v, j) => {
    const y = n - 1 - i, c = hl[`${i},${j}`];
    if (c) P.band(j + 0.08, j + 0.92, y + 0.1, y + 0.9, { color: c, alpha: 0.25 });
    P.tex(j + 0.5, y + 0.5, v, { size: 20, color: c || "ink" });
  }));
  setPlotTitle(title); P.draw();
}

const TASKS = [
  { nav: "Shift a line", title: "Nearly parallel lines",
    instr: TeX`<p>The lines \(x+y=2\) and \(x+1.2\,y=2.2+\delta\) cross at \((1,1)\) when \(\delta=0\). Drag the slider and watch the crossing.</p><p>What is \(y\) at the crossing when \(\delta=0.1\)?</p>`,
    hints: [TeX`Subtract the equations: \(0.2\,y=0.2+\delta\).`],
    answer: TeX`\(y=1+\delta/0.2=1.5\) (and \(x=0.5\)): a shift of \(0.1\) moves the solution by \(0.5\).`,
    build(C) {
      let d = 0;
      const draw = () => {
        P.setView(-0.6, 2.6, -0.6, 2.8, { xlabel: "x", xticks: [0, 1, 2], yticks: [0, 1, 2] });
        P.fn(x => 2 - x, { color: "curve" });
        P.fn(x => (2.2 + d - x) / 1.2, { color: "gold" });
        const y = 1 + d / 0.2;
        P.pt(2 - y, y, { color: "neg", r: 7 });
        setPlotTitle(TeX`\(\delta=${d.toFixed(2)}\): crossing at \((${(2 - y).toFixed(2)},\ ${y.toFixed(2)})\)`); P.draw();
      };
      draw();
      slider(C, "δ", "sd", 0, 0.2, 0.01, 0, v => { d = v; draw(); });
      const inp = field(C, TeX`\(y=\)`, "ans1");
      return () => near(parseNum(inp.value), 1.5, 1e-9) ? ["done", "Correct! A small shift of one line moves the crossing a long way."] : ["wrong", "Not quite. Subtract the two equations to find y."];
    } },

  { nav: "Compute κ∞", title: "A condition number",
    instr: TeX`<p>For \(A=\begin{bmatrix}1&2\\3&4\end{bmatrix}\), \(A^{-1}=\begin{bmatrix}-2&1\\1.5&-0.5\end{bmatrix}\).</p><p>Compute \(\kappa_\infty(A)=\lVert A\rVert_\infty\lVert A^{-1}\rVert_\infty\) (largest absolute row sums).</p>`,
    hints: [TeX`\(\lVert A\rVert_\infty=\max(3,7)\).`, TeX`\(\lVert A^{-1}\rVert_\infty=\max(3,2)\).`],
    answer: TeX`\(\kappa_\infty(A)=7\cdot3=21\).`,
    build(C) {
      drawMatrix([["1", "2", "", "-2", "1"], ["3", "4", "", "1.5", "-0.5"]], TeX`\(A\) and \(A^{-1}\)`, { "1,0": "gold", "1,1": "gold", "0,3": "pos", "0,4": "pos" });
      const inp = field(C, TeX`\(\kappa_\infty=\)`, "ans1");
      return () => near(parseNum(inp.value), 21, 1e-9) ? ["done", "Correct! κ = 21: relative errors can grow up to 21 times."] : ["wrong", "Not quite. Take the largest absolute row sum of each matrix, then multiply."];
    } },

  { nav: "Use the bound", title: "How big can the error be?",
    instr: TeX`<p>With \(\kappa(A)=21\), the right-hand side has a relative error of \(1\%\).</p><p>What is the largest possible relative error in \(\mathbf x\)? (as a decimal)</p>`,
    hints: [TeX`\(\dfrac{\lVert\delta\mathbf x\rVert}{\lVert\mathbf x\rVert}\le\kappa\,\dfrac{\lVert\delta\mathbf b\rVert}{\lVert\mathbf b\rVert}\).`],
    answer: TeX`\(21\times0.01=0.21\), i.e. up to \(21\%\).`,
    build(C) {
      P.setView(0, 3, 0, 0.25, { xticks: [], yticks: [0, 0.05, 0.1, 0.15, 0.2, 0.25] });
      P.seg(0.8, 0, 0.8, 0.01, { color: "gold", width: 40, cap: "butt" }); P.seg(2.2, 0, 2.2, 0.21, { color: "neg", width: 40, cap: "butt", alpha: 0.3 });
      P.tex(0.8, 0.03, TeX`\delta\mathbf b`); P.tex(2.2, 0.23, TeX`\delta\mathbf x\ ?`);
      setPlotTitle("Relative errors"); P.draw();
      const inp = field(C, "relative error ≤", "ans1");
      return () => near(parseNum(inp.value), 0.21, 1e-9) ? ["done", "Correct! The condition number is the worst-case amplifier."] : ["wrong", "Not quite. Multiply κ by the relative error in b."];
    } },

  { nav: "κ ≥ 1", title: "Which value is impossible?",
    instr: TeX`<p>Which of these can never be a condition number \(\kappa(A)=\lVert A\rVert\lVert A^{-1}\rVert\) (induced norm)?</p>`,
    hints: [TeX`\(1=\lVert I\rVert=\lVert AA^{-1}\rVert\le\lVert A\rVert\lVert A^{-1}\rVert\).`],
    answer: TeX`\(0.5\): every condition number is at least \(1\).`,
    build(C) {
      P.setView(0, 10, 0, 2, { xticks: [], yticks: [] });
      P.band(0, 1, 0, 2, { color: "neg", alpha: 0.15 }); P.band(1, 10, 0, 2, { color: "pos", alpha: 0.12 });
      P.tex(0.5, 1, TeX`<1`, { color: "neg", size: 20 }); P.tex(5.5, 1, TeX`\kappa\ge1`, { color: "pos", size: 22 });
      setPlotTitle("Possible values of κ"); P.draw();
      cards(C, [TeX`\(0.5\)`, TeX`\(1\)`, TeX`\(10^8\)`]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 1 ? ["done", "Right! κ = 1 happens (e.g. for the identity), but never less."] : ["wrong", "That one is possible. Look for a value below 1."];
    } },

  { nav: "Lost digits", title: "How many digits survive?",
    instr: TeX`<p>Double precision carries about \(16\) decimal digits. If \(\kappa(A)\approx10^{6}\), about how many correct digits can you expect in the computed \(\mathbf x\)?</p>`,
    hints: [TeX`About \(\log_{10}\kappa\) digits are lost.`],
    answer: TeX`About \(16-6=10\) digits.`,
    build(C) {
      P.setView(0, 16, 0, 1, { xticks: [0, 4, 8, 12, 16], yticks: [] });
      P.band(0, 10, 0.2, 0.8, { color: "pos", alpha: 0.35 }); P.band(10, 16, 0.2, 0.8, { color: "neg", alpha: 0.35 });
      setPlotTitle("16 digits: kept and lost"); P.draw();
      const inp = field(C, "correct digits ≈", "ans1");
      return () => Math.abs(parseNum(inp.value) - 10) <= 0.5 ? ["done", "Correct! About 6 digits are at risk."] : ["wrong", "Not quite. Subtract log10 κ from 16."];
    } },

  { nav: "Determinant", title: "The determinant is no test",
    instr: TeX`<p>For \(A=0.1\,I_3\), \(\det A=0.001\), which looks small.</p><p>What is \(\kappa(A)\)?</p>`,
    hints: [TeX`\(A^{-1}=10\,I_3\); in any induced norm \(\lVert A\rVert=0.1\).`],
    answer: TeX`\(\kappa=0.1\cdot10=1\): perfectly conditioned.`,
    build(C) {
      drawMatrix([["0.1", "0", "0"], ["0", "0.1", "0"], ["0", "0", "0.1"]], TeX`\(A=0.1\,I_3\)`, { "0,0": "gold", "1,1": "gold", "2,2": "gold" });
      const inp = field(C, TeX`\(\kappa(A)=\)`, "ans1");
      return () => near(parseNum(inp.value), 1, 1e-9) ? ["done", "Correct! A tiny determinant does not mean an ill-conditioned matrix."] : ["wrong", "Not quite. Multiply the norm of A by the norm of its inverse."];
    } },

  { nav: "Residual", title: "A small residual",
    instr: TeX`<p>For \(x+y=2,\ x+1.0001\,y=2.0001\) (true solution \((1,1)\)), take the wrong answer \(\tilde{\mathbf x}=(0,2)\).</p><p>Compute the second component of the residual \(r_2=2.0001-(\tilde x+1.0001\,\tilde y)\).</p>`,
    hints: [TeX`\(\tilde x+1.0001\,\tilde y=0+2.0002\).`],
    answer: TeX`\(r_2=2.0001-2.0002=-0.0001\): tiny, though the answer is \(100\%\) wrong.`,
    build(C) {
      drawMatrix([["1", "1", "2"], ["1", "1.0001", "2.0001"]], TeX`\([A\,|\,\mathbf b]\) and \(\tilde{\mathbf x}=(0,2)\)`, { "1,2": "gold" });
      const inp = field(C, TeX`\(r_2=\)`, "ans1");
      return () => near(parseNum(inp.value), -0.0001, 1e-6) ? ["done", "Correct! With κ ≈ 40 000, a small residual guarantees very little."] : ["wrong", "Not quite. Compute 0 + 1.0001 · 2 first."];
    } },

  { nav: "Hilbert", title: "The worst conditioned",
    instr: TeX`<p>Which of these matrices is the most ill conditioned?</p>`,
    hints: [TeX`\(\kappa_2(H_3)\approx524\), \(\kappa_2(H_5)\approx4.8\times10^5\).`],
    answer: TeX`\(H_5\), the \(5\times5\) Hilbert matrix: \(\kappa_2\approx4.8\times10^5\).`,
    build(C) {
      P.setView(0, 6, 0, 6, { xlabel: "n", xticks: [1, 2, 3, 4, 5], yticks: [0, 2, 4, 6] });
      [[1, 0], [2, 1.285], [3, 2.719], [4, 4.191], [5, 5.678]].forEach(([n, y]) => P.pt(n, y, { color: "gold", r: 6 }));
      setPlotTitle(TeX`\(\log_{10}\kappa_2(H_n)\)`); P.draw();
      cards(C, [TeX`\(H_3\)`, TeX`\(H_5\)`, TeX`\(0.1\,I_5\)`]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 2 ? ["done", "Right! Hilbert matrices become ill conditioned very quickly."] : ["wrong", "Look at the plot: κ grows fast with n, and 0.1 I has κ = 1."];
    } },

  { nav: "Ellipse", title: "κ₂ from the ellipse",
    instr: TeX`<p>A matrix maps the unit circle to an ellipse with semi-axes \(3\) and \(0.5\).</p><p>What is \(\kappa_2(A)\)?</p>`,
    hints: [TeX`\(\kappa_2=\sigma_{\max}/\sigma_{\min}\), the ratio of the semi-axes.`],
    answer: TeX`\(\kappa_2=3/0.5=6\).`,
    build(C) {
      P.setView(-3.4, 3.4, -2, 2, { xticks: [-3, 0, 3], yticks: [-1, 0, 1] });
      P.fn(x => Math.sqrt(Math.max(0, 1 - x * x)), { color: "curve" }); P.fn(x => -Math.sqrt(Math.max(0, 1 - x * x)), { color: "curve" });
      P.fn(x => 0.5 * Math.sqrt(Math.max(0, 1 - (x / 3) ** 2)), { color: "gold" }); P.fn(x => -0.5 * Math.sqrt(Math.max(0, 1 - (x / 3) ** 2)), { color: "gold" });
      setPlotTitle("unit circle and its image"); P.draw();
      const inp = field(C, TeX`\(\kappa_2=\)`, "ans1");
      return () => near(parseNum(inp.value), 6, 1e-9) ? ["done", "Correct! The thinner the ellipse, the worse the conditioning."] : ["wrong", "Not quite. Divide the longest semi-axis by the shortest."];
    } },
];

startPractice({
  store: "nm-lec17-conditioning-v1", lecture: "Lecture 17", tasks: TASKS,
  finalPlot() {
    P.setView(-0.6, 2.6, -0.6, 2.8, { xlabel: "x", xticks: [0, 1, 2], yticks: [0, 1, 2] });
    P.fn(x => 2 - x, { color: "curve" }); P.fn(x => (2.2 - x) / 1.2, { color: "gold" }); P.pt(1, 1, { color: "pos", r: 7 });
    setPlotTitle(TeX`\(\kappa(A)=\lVert A\rVert\,\lVert A^{-1}\rVert\)`); P.draw();
  },
});
