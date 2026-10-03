/* Lecture 16 — Vector and Matrix Norms: practice tasks. */
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

/** Unit circle of the p-norm (p = Infinity allowed) as a parametric curve. */
function ballPoints(p, n = 240) {
  const pts = [];
  for (let k = 0; k <= n; k++) {
    const t = 2 * Math.PI * k / n, c = Math.cos(t), s = Math.sin(t);
    const r = p === Infinity ? 1 / Math.max(Math.abs(c), Math.abs(s)) : 1 / Math.pow(Math.pow(Math.abs(c), p) + Math.pow(Math.abs(s), p), 1 / p);
    pts.push([r * c, r * s]);
  }
  return pts;
}

function drawBalls(extra) {
  P.setView(-1.6, 1.6, -1.4, 1.4, { xticks: [-1, 0, 1], yticks: [-1, 0, 1] });
  [[1, "neg"], [2, "pos"], [Infinity, "curve"]].forEach(([p, col]) => {
    const pts = ballPoints(p);
    for (let k = 0; k < pts.length - 1; k++) P.seg(pts[k][0], pts[k][1], pts[k + 1][0], pts[k + 1][1], { color: col, width: 2.5 });
  });
  if (extra) extra();
  setPlotTitle(TeX`Unit circles: \(\lVert\cdot\rVert_1\) (diamond), \(\lVert\cdot\rVert_2\), \(\lVert\cdot\rVert_\infty\) (square)`); P.draw();
}

const TASKS = [
  { nav: "1-norm", title: "The taxicab norm",
    instr: TeX`<p>Compute \(\lVert\mathbf x\rVert_1\) for \(\mathbf x=(3,-4,0,12)\).</p>`,
    hints: [TeX`Add the absolute values: \(3+4+0+12\).`],
    answer: TeX`\(\lVert\mathbf x\rVert_1=19\).`,
    build(C) {
      drawMatrix([["3"], ["-4"], ["0"], ["12"]], TeX`\(\mathbf x\)`, {});
      const inp = field(C, TeX`\(\lVert\mathbf x\rVert_1=\)`, "ans1");
      return () => near(parseNum(inp.value), 19, 1e-9) ? ["done", "Correct! Absolute values: the −4 counts as 4."] : ["wrong", "Not quite. Add the absolute values of the entries."];
    } },

  { nav: "2- and ∞-norm", title: "Euclidean and maximum norms",
    instr: TeX`<p>For the same \(\mathbf x=(3,-4,0,12)\), give \(\lVert\mathbf x\rVert_2\) and \(\lVert\mathbf x\rVert_\infty\).</p>`,
    hints: [TeX`\(\sqrt{9+16+0+144}=\sqrt{169}\).`, TeX`The largest absolute entry.`],
    answer: TeX`\(\lVert\mathbf x\rVert_2=13\), \(\lVert\mathbf x\rVert_\infty=12\). Note \(12\le13\le19\).`,
    build(C) {
      drawMatrix([["3"], ["-4"], ["0"], ["12"]], TeX`\(\mathbf x\)`, { "3,0": "gold" });
      const a = field(C, TeX`\(\lVert\mathbf x\rVert_2=\)`, "ans1"), b = field(C, TeX`\(\lVert\mathbf x\rVert_\infty=\)`, "ans2");
      return () => {
        if (!near(parseNum(a.value), 13, 1e-9)) return ["wrong", "Check the 2-norm: square, add, take the root."];
        return near(parseNum(b.value), 12, 1e-9) ? ["done", TeX`Correct! \(\lVert\mathbf x\rVert_\infty\le\lVert\mathbf x\rVert_2\le\lVert\mathbf x\rVert_1\).`] : ["wrong", "The 2-norm is right. The ∞-norm is the largest absolute entry."];
      };
    } },

  { nav: "Unit circles", title: "On which unit circle?",
    instr: TeX`<p>Drag the slider to move the point \((1,\,t)\). For \(t=0.5\), on which unit circle does the point lie?</p>`,
    hints: [TeX`Compute \(\max(|1|,|0.5|)\), \(\sqrt{1+0.25}\) and \(1+0.5\).`],
    answer: TeX`On the \(\infty\)-norm circle (the square): \(\max(1,0.5)=1\).`,
    build(C) {
      let t = 0.5;
      const draw = () => drawBalls(() => P.pt(1, t, { color: "gold", r: 7 }));
      draw();
      slider(C, "t", "st", -1, 1, 0.05, 0.5, v => { t = v; draw(); });
      cards(C, [TeX`\(\lVert\cdot\rVert_1\) (diamond)`, TeX`\(\lVert\cdot\rVert_2\) (circle)`, TeX`\(\lVert\cdot\rVert_\infty\) (square)`]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 3 ? ["done", "Right! Every point (1, t) with |t| ≤ 1 lies on the square."] : ["wrong", "Compute that norm of (1, 0.5): it is not 1."];
    } },

  { nav: "Relative error", title: "A relative error",
    instr: TeX`<p>The true solution is \(\mathbf x=(2,4)\), the computed one \(\hat{\mathbf x}=(2.1,\,3.9)\).</p><p>Compute the relative error \(\lVert\hat{\mathbf x}-\mathbf x\rVert_\infty/\lVert\mathbf x\rVert_\infty\).</p>`,
    hints: [TeX`\(\hat{\mathbf x}-\mathbf x=(0.1,-0.1)\).`, TeX`\(0.1/4\).`],
    answer: TeX`\(0.1/4=0.025\).`,
    build(C) {
      drawMatrix([["2", "2.1"], ["4", "3.9"]], TeX`\(\mathbf x\) and \(\hat{\mathbf x}\)`, { "1,0": "gold" });
      const inp = field(C, "relative error =", "ans1");
      return () => near(parseNum(inp.value), 0.025, 1e-9) ? ["done", "Correct! A relative error of 2.5%."] : ["wrong", "Not quite. Divide the largest error entry by the largest solution entry."];
    } },

  { nav: "Column sums", title: "The 1-norm of a matrix",
    instr: TeX`<p>Compute \(\lVert A\rVert_1\) for \(A=\begin{bmatrix}1&-2\\3&4\end{bmatrix}\).</p>`,
    hints: ["Largest absolute column sum."],
    answer: TeX`Column sums \(4\) and \(6\): \(\lVert A\rVert_1=6\).`,
    build(C) {
      drawMatrix([["1", "-2"], ["3", "4"]], TeX`\(A\)`, { "0,1": "neg", "1,1": "neg" });
      const inp = field(C, TeX`\(\lVert A\rVert_1=\)`, "ans1");
      return () => near(parseNum(inp.value), 6, 1e-9) ? ["done", "Correct! |−2| + |4| = 6."] : ["wrong", "Not quite. Add absolute values down each column and take the largest."];
    } },

  { nav: "Row sums", title: "The ∞-norm of a matrix",
    instr: TeX`<p>Compute \(\lVert A\rVert_\infty\) for \(A=\begin{bmatrix}2&-1&0\\1&3&-2\\0&1&4\end{bmatrix}\).</p>`,
    hints: ["Largest absolute row sum."],
    answer: TeX`Row sums \(3,\ 6,\ 5\): \(\lVert A\rVert_\infty=6\).`,
    build(C) {
      drawMatrix([["2", "-1", "0"], ["1", "3", "-2"], ["0", "1", "4"]], TeX`\(A\)`, {});
      const inp = field(C, TeX`\(\lVert A\rVert_\infty=\)`, "ans1");
      return () => near(parseNum(inp.value), 6, 1e-9) ? ["done", "Correct! The middle row: 1 + 3 + 2 = 6."] : ["wrong", "Not quite. Add absolute values along each row and take the largest."];
    } },

  { nav: "Frobenius", title: "The Frobenius norm",
    instr: TeX`<p>Compute \(\lVert A\rVert_F\) for \(A=\begin{bmatrix}1&2\\2&1\end{bmatrix}\) (3 decimals).</p>`,
    hints: [TeX`\(\sqrt{1+4+4+1}\).`],
    answer: TeX`\(\sqrt{10}\approx3.162\).`,
    build(C) {
      drawMatrix([["1", "2"], ["2", "1"]], TeX`\(A\)`, {});
      const inp = field(C, TeX`\(\lVert A\rVert_F=\)`, "ans1");
      return () => near(parseNum(inp.value), Math.sqrt(10), 0.0005) ? ["done", "Correct! The square root of the sum of all squares."] : ["wrong", "Not quite. Square every entry, add, take the root."];
    } },

  { nav: "Biggest stretch", title: "Find the biggest stretch",
    instr: TeX`<p>Turn the unit vector \(\mathbf x\) with the slider and watch \(A\mathbf x\) for \(A=\begin{bmatrix}2&1\\1&2\end{bmatrix}\).</p><p>What is the largest value of \(\lVert A\mathbf x\rVert_2\), i.e. \(\lVert A\rVert_2\)?</p>`,
    hints: ["Try the direction at 45°.", TeX`\(A(1,1)/\sqrt2=(3,3)/\sqrt2\), of length \(3\).`],
    answer: TeX`\(\lVert A\rVert_2=3\), reached for \(\mathbf x=(1,1)/\sqrt2\).`,
    build(C) {
      let th = 0;
      const draw = () => {
        P.setView(-3.4, 3.4, -3.2, 3.2, { xticks: [-3, -2, -1, 0, 1, 2, 3], yticks: [-3, -2, -1, 0, 1, 2, 3] });
        const pts = [];
        for (let k = 0; k <= 200; k++) { const t = 2 * Math.PI * k / 200; pts.push([2 * Math.cos(t) + Math.sin(t), Math.cos(t) + 2 * Math.sin(t)]); }
        for (let k = 0; k < 200; k++) P.seg(pts[k][0], pts[k][1], pts[k + 1][0], pts[k + 1][1], { color: "gold", width: 2 });
        for (let k = 0; k < 200; k++) { const a = 2 * Math.PI * k / 200, b = 2 * Math.PI * (k + 1) / 200; P.seg(Math.cos(a), Math.sin(a), Math.cos(b), Math.sin(b), { color: "pos", width: 2 }); }
        const x = [Math.cos(th), Math.sin(th)], y = [2 * x[0] + x[1], x[0] + 2 * x[1]];
        P.seg(0, 0, x[0], x[1], { color: "pos", width: 4 }); P.seg(0, 0, y[0], y[1], { color: "gold", width: 4 });
        P.pt(y[0], y[1], { color: "gold", r: 6 });
        setPlotTitle(TeX`\(\lVert A\mathbf x\rVert_2=${Math.hypot(y[0], y[1]).toFixed(3)}\)`); P.draw();
      };
      draw();
      slider(C, "angle (degrees)", "sth", 0, 180, 1, 0, v => { th = v * Math.PI / 180; draw(); });
      const inp = field(C, TeX`\(\lVert A\rVert_2=\)`, "ans1");
      return () => near(parseNum(inp.value), 3, 0.001) ? ["done", "Correct! The long semi-axis of the ellipse is 3."] : ["wrong", "Not quite. Find the angle where the yellow arrow is longest."];
    } },

  { nav: "Not a norm", title: "Which one is not a norm?",
    instr: TeX`<p>Which of these is <em>not</em> a matrix norm?</p>`,
    hints: [TeX`Look at \(\begin{bmatrix}0&1\\0&0\end{bmatrix}\): a norm can be zero only for the zero matrix.`],
    answer: TeX`The spectral radius \(\rho(A)=\max|\lambda_i|\): it is \(0\) for \(\begin{bmatrix}0&1\\0&0\end{bmatrix}\neq0\).`,
    build(C) {
      drawMatrix([["0", "1"], ["0", "0"]], TeX`Eigenvalues \(0,0\), but not the zero matrix`, { "0,1": "neg" });
      cards(C, [TeX`\(\lVert A\rVert_\infty\) (largest row sum)`, TeX`\(\rho(A)=\max|\lambda_i|\)`, TeX`\(\lVert A\rVert_F\)`]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 2 ? ["done", TeX`Right! But \(\rho(A)\le\lVert A\rVert\) for every induced norm.`] : ["wrong", "That one satisfies all three norm axioms."];
    } },
];

startPractice({
  store: "nm-lec16-norms-v1", lecture: "Lecture 16", tasks: TASKS,
  finalPlot() { drawBalls(); },
});
