/* Lecture 19 — Convergence of Iterative Methods: practice tasks. */
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

/** Unit circle in the complex plane with eigenvalues [re, im]. */
function diskPlot(eigs, title) {
  P.setView(-1.6, 1.6, -1.35, 1.35, { xlabel: "Re", xticks: [-1, 0, 1], yticks: [-1, 0, 1] });
  P.fn(x => Math.sqrt(Math.max(0, 1 - x * x)), { color: "pos" });
  P.fn(x => -Math.sqrt(Math.max(0, 1 - x * x)), { color: "pos" });
  eigs.forEach(([a, b]) => P.pt(a, b, { color: Math.hypot(a, b) < 1 ? "gold" : "neg", r: 7 }));
  setPlotTitle(title); P.draw();
}

/** log10 of the error after k sweeps when it shrinks by rho each sweep. */
function errorPlot(rho, kmax, title) {
  P.setView(0, kmax, -8, 1, { xlabel: "k", xticks: [0, kmax / 2, kmax], yticks: [-8, -6, -4, -2, 0] });
  P.fn(k => Math.max(-8, k * Math.log10(rho)), { color: "gold" });
  P.seg(0, -6, kmax, -6, { color: "neg", width: 1, alpha: 0.6 });
  setPlotTitle(title); P.draw();
}

const TASKS = [
  { nav: "Iteration matrix", title: "Build the Jacobi matrix",
    instr: TeX`<p>For \(A=\begin{bmatrix}2&1\\1&2\end{bmatrix}\), Jacobi has \(H_J=-D^{-1}(L+U)\).</p><p>What is the entry \(h_{12}\) of \(H_J\)?</p>`,
    hints: [TeX`\(h_{12}=-a_{12}/a_{11}\).`],
    answer: TeX`\(h_{12}=-1/2\), so \(H_J=\begin{bmatrix}0&-\tfrac12\\-\tfrac12&0\end{bmatrix}\) with eigenvalues \(\pm\tfrac12\).`,
    build(C) {
      drawMatrix([["2", "1"], ["1", "2"]], TeX`\(A\): diagonal \(D\) in gold`, { "0,0": "gold", "1,1": "gold" });
      const inp = field(C, TeX`\(h_{12}=\)`, "ans1");
      return () => near(parseNum(inp.value), -0.5, 1e-9) ? ["done", "Correct! ρ(H_J) = 1/2."] : ["wrong", "Not quite. Divide the off-diagonal entry by the diagonal one, and mind the minus sign."];
    } },

  { nav: "Spectral radius", title: "Read off ρ(H)",
    instr: TeX`<p>An iteration matrix has eigenvalues \(0.5,\ -0.8\) and \(0.3\pm0.4i\) (plotted).</p><p>What is its spectral radius \(\rho(H)\)?</p>`,
    hints: [TeX`\(\rho(H)=\max|\lambda_i|\); \(|0.3\pm0.4i|=0.5\).`],
    answer: TeX`\(\rho(H)=0.8\): the iteration converges.`,
    build(C) {
      diskPlot([[0.5, 0], [-0.8, 0], [0.3, 0.4], [0.3, -0.4]], "Eigenvalues and the unit circle");
      const inp = field(C, TeX`\(\rho(H)=\)`, "ans1");
      return () => near(parseNum(inp.value), 0.8, 1e-9) ? ["done", "Correct! All eigenvalues are inside the unit circle."] : ["wrong", "Not quite. Take the largest absolute value."];
    } },

  { nav: "Where it breaks", title: "Drag until it diverges",
    instr: TeX`<p>The matrix \(H=\begin{bmatrix}0&a\\a&0\end{bmatrix}\) has eigenvalues \(\pm a\). Drag \(a\) and watch the eigenvalues and the error \(\lVert H^k\mathbf e^{(0)}\rVert\).</p><p>Up to what value of \(a>0\) does the iteration converge?</p>`,
    hints: [TeX`It converges exactly when \(\rho(H)=|a|<1\).`],
    answer: TeX`For every \(a<1\); at \(a=1\) the error no longer shrinks.`,
    build(C) {
      let a = 0.5;
      const draw = () => {
        P.setView(0, 20, -4, 3, { xlabel: "k", xticks: [0, 10, 20], yticks: [-4, -2, 0, 2] });
        P.fn(k => Math.max(-4, Math.min(3, k * Math.log10(a))), { color: a < 1 ? "pos" : "neg" });
        setPlotTitle(TeX`\(a=${a.toFixed(2)}\): \(\log_{10}\) of the error after \(k\) sweeps`); P.draw();
      };
      draw();
      slider(C, "a", "sa", 0.1, 1.4, 0.05, 0.5, v => { a = v; draw(); });
      const inp = field(C, "converges for a below", "ans1");
      return () => near(parseNum(inp.value), 1, 1e-9) ? ["done", "Correct! ρ(H) < 1 is the whole story."] : ["wrong", "Not quite. Find where the curve stops going down."];
    } },

  { nav: "How many sweeps?", title: "Predict the number of sweeps",
    instr: TeX`<p>If \(\rho(H)=0.5\), about how many sweeps reduce the error by a factor \(10^{-6}\)?</p>`,
    hints: [TeX`Solve \(0.5^k=10^{-6}\): \(k=6/\log_{10}2\).`],
    answer: TeX`\(k\approx6/0.301\approx20\) sweeps.`,
    build(C) {
      errorPlot(0.5, 30, TeX`\(\log_{10}\) error with \(\rho=0.5\); red line: \(10^{-6}\)`);
      const inp = field(C, "sweeps ≈", "ans1");
      return () => Math.abs(parseNum(inp.value) - 19.93) <= 1.1 ? ["done", "Correct! About 20 sweeps (the 2 × 2 example in the lecture)."] : ["wrong", "Not quite. Divide 6 by log10(2)."];
    } },

  { nav: "Rate", title: "Sweeps per digit",
    instr: TeX`<p>With \(\rho(H)=0.9\), how many sweeps does each extra correct digit cost?</p>`,
    hints: [TeX`The rate is \(-\log_{10}\rho\) digits per sweep; take its reciprocal.`],
    answer: TeX`\(1/(-\log_{10}0.9)=1/0.0458\approx22\) sweeps per digit.`,
    build(C) {
      errorPlot(0.9, 140, TeX`\(\log_{10}\) error with \(\rho=0.9\)`);
      const inp = field(C, "sweeps per digit ≈", "ans1");
      return () => Math.abs(parseNum(inp.value) - 21.85) <= 1.0 ? ["done", "Correct! ρ close to 1 means painfully slow progress."] : ["wrong", "Not quite. Compute 1 / (−log10 0.9)."];
    } },

  { nav: "Gauss–Seidel ρ", title: "The Gauss–Seidel matrix",
    instr: TeX`<p>For \(A=\begin{bmatrix}2&1\\1&2\end{bmatrix}\), \(H_{GS}=-(L+D)^{-1}U=\begin{bmatrix}0&-\tfrac12\\0&\tfrac14\end{bmatrix}\).</p><p>What is \(\rho(H_{GS})\)?</p>`,
    hints: [TeX`\(H_{GS}\) is triangular: its eigenvalues are its diagonal entries.`],
    answer: TeX`\(\rho(H_{GS})=\tfrac14=\big(\rho(H_J)\big)^2\): Gauss–Seidel is twice as fast here.`,
    build(C) {
      diskPlot([[0, 0], [0.25, 0]], TeX`Eigenvalues of \(H_{GS}\)`);
      const inp = field(C, TeX`\(\rho(H_{GS})=\)`, "ans1");
      return () => near(parseNum(inp.value), 0.25, 1e-9) ? ["done", "Correct! About 10 sweeps instead of 20."] : ["wrong", "Not quite. Read the eigenvalues off the diagonal."];
    } },

  { nav: "Norm bound", title: "A guaranteed reduction",
    instr: TeX`<p>For the notes' example, \(\lVert H_J\rVert_\infty=0.8\), so \(\lVert\mathbf e^{(k)}\rVert_\infty\le0.8^k\,\lVert\mathbf e^{(0)}\rVert_\infty\).</p><p>By what factor is the error at least reduced after \(10\) sweeps? (3 decimals)</p>`,
    hints: [TeX`Compute \(0.8^{10}\).`],
    answer: TeX`\(0.8^{10}\approx0.107\).`,
    build(C) {
      drawMatrix([["0", "-1/3", "1/3"], ["0.4", "0", "0.4"], ["-0.1", "-0.1", "0"]], TeX`\(H_J\): row sums \(\tfrac23,\ 0.8,\ 0.2\)`, { "1,0": "gold", "1,2": "gold" });
      const inp = field(C, "factor =", "ans1");
      return () => near(parseNum(inp.value), 0.1074, 1.5e-3) ? ["done", "Correct! The true factor is smaller still, since ρ(H_J) ≈ 0.45."] : ["wrong", "Not quite. Raise 0.8 to the 10th power."];
    } },

  { nav: "Dominance", title: "Dominance gives a bound",
    instr: TeX`<p>For a diagonally dominant \(A\), \(\lVert H_J\rVert_\infty=\max_i\sum_{j\ne i}|a_{ij}|/|a_{ii}|\).</p><p>Compute it for \(A=\begin{bmatrix}4&1&2\\1&5&1\\2&1&6\end{bmatrix}\).</p>`,
    hints: [TeX`The row ratios are \(3/4,\ 2/5,\ 3/6\).`],
    answer: TeX`\(\max(0.75,\ 0.4,\ 0.5)=0.75<1\), so Jacobi converges.`,
    build(C) {
      drawMatrix([["4", "1", "2"], ["1", "5", "1"], ["2", "1", "6"]], "Compare each row with its diagonal", { "0,0": "gold", "1,1": "gold", "2,2": "gold" });
      const inp = field(C, TeX`\(\lVert H_J\rVert_\infty=\)`, "ans1");
      return () => near(parseNum(inp.value), 0.75, 1e-9) ? ["done", "Correct! Below 1, so convergence is guaranteed."] : ["wrong", "Not quite. Compute the ratio in each row and take the largest."];
    } },

  { nav: "Neither always wins", title: "Which method converges?",
    instr: TeX`<p>For \(A=\begin{bmatrix}1&2&-2\\1&1&1\\2&2&1\end{bmatrix}\): \(H_J^3=0\) and \(\rho(H_{GS})=2\).</p><p>Which method converges?</p>`,
    hints: [TeX`If \(H^3=0\), all eigenvalues of \(H\) are \(0\).`],
    answer: TeX`Only Jacobi: \(\rho(H_J)=0\) (it finishes in 3 sweeps), while \(\rho(H_{GS})=2>1\).`,
    build(C) {
      P.setView(-1.6, 2.4, -1.35, 1.35, { xlabel: "Re", xticks: [-1, 0, 1, 2], yticks: [-1, 0, 1] });
      P.fn(x => Math.sqrt(Math.max(0, 1 - x * x)), { color: "pos" }); P.fn(x => -Math.sqrt(Math.max(0, 1 - x * x)), { color: "pos" });
      P.pt(0, 0, { color: "gold", r: 7 }); P.pt(2, 0, { color: "neg", r: 7 });
      setPlotTitle(TeX`\(\rho(H_J)=0\) (gold) and \(\rho(H_{GS})=2\) (red)`); P.draw();
      cards(C, ["Only Jacobi", "Only Gauss–Seidel", "Both", "Neither"]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 1 ? ["done", "Right! Gauss–Seidel is usually faster, but not always better."] : ["wrong", "Compare each spectral radius with 1."];
    } },
];

startPractice({
  store: "nm-lec19-convergence-v1", lecture: "Lecture 19", tasks: TASKS,
  finalPlot() { diskPlot([[0.45, 0], [-0.45, 0], [0.27, 0], [0, 0.2], [0, -0.2]], TeX`Converges \(\iff\rho(H)<1\)`); },
});
