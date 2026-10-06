/* Lecture 21 — The Power Method: practice tasks. */
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

/** Power method with signed scaling for A = [[7,2],[1,4]] from (1,1): list of [lambda, v]. */
function powerSteps(k) {
  let v = [1, 1];
  const out = [];
  for (let i = 0; i < k; i++) {
    const y = [7 * v[0] + 2 * v[1], v[0] + 4 * v[1]];
    const lam = Math.abs(y[0]) >= Math.abs(y[1]) ? y[0] : y[1];
    v = [y[0] / lam, y[1] / lam];
    out.push([lam, v]);
  }
  return out;
}

/** Plane with the eigenvector direction of [[7,2],[1,4]] and the current vector. */
function swingPlot(k) {
  P.setView(-0.3, 1.5, -0.3, 1.3, { xlabel: "x", xticks: [0, 1], yticks: [0, 1] });
  const t = Math.atan2(0.2808, 1);
  P.seg(-0.2 * Math.cos(t), -0.2 * Math.sin(t), 1.5 * Math.cos(t), 1.5 * Math.sin(t), { color: "pos", width: 2, dash: [6, 5] });
  let v = [1, 1];
  for (let i = 0; i <= k; i++) {
    const n = Math.hypot(v[0], v[1]), a = i === k ? 1 : 0.25;
    P.seg(0, 0, 1.2 * v[0] / n, 1.2 * v[1] / n, { color: i === k ? "gold" : "curve", width: i === k ? 4 : 2, alpha: a });
    v = [7 * v[0] + 2 * v[1], v[0] + 4 * v[1]];
  }
}

const TASKS = [
  { nav: "One step by hand", title: "One power iteration",
    instr: TeX`<p>For \(A=\begin{bmatrix}7&2\\1&4\end{bmatrix}\) the first step gave \(\mathbf v^{(1)}=(1,\ 5/9)^T\).</p><p>Compute \(\mathbf y^{(2)}=A\mathbf v^{(1)}\) and the new estimate \(\lambda^{(2)}\), its entry of largest size. (4 decimals)</p>`,
    hints: [TeX`\(\mathbf y^{(2)}=\big(7+2\cdot\frac59,\ 1+4\cdot\frac59\big)\).`],
    answer: TeX`\(\mathbf y^{(2)}=(73/9,\ 29/9)\approx(8.1111,\ 3.2222)\), so \(\lambda^{(2)}=73/9\approx8.1111\).`,
    build(C) {
      drawMatrix([["7", "2", "", "1"], ["1", "4", "", "5/9"]], TeX`\(A\) and \(\mathbf v^{(1)}\)`, { "0,0": "gold", "0,1": "gold" });
      const inp = field(C, TeX`\(\lambda^{(2)}=\)`, "ans1");
      return () => near(parseNum(inp.value), 73 / 9, 2e-4) ? ["done", "Correct! The estimates go 9, 8.1111, 7.7945, … towards 7.5616."] : ["wrong", "Not quite. Multiply A by (1, 5/9) and take the larger entry."];
    } },

  { nav: "Watch it swing", title: "Where does the vector go?",
    instr: TeX`<p>Drag the slider to apply \(A=\begin{bmatrix}7&2\\1&4\end{bmatrix}\) again and again to \(\mathbf v^{(0)}=(1,1)\). The dashed line is the eigenvector of the dominant eigenvalue.</p><p>After many steps, what does the second entry of the scaled vector \(\mathbf v^{(k)}=(1,\ v_2)\) approach? (3 decimals)</p>`,
    hints: ["Read v₂ in the plot title for large k; it settles near the slope of the dashed line."],
    answer: TeX`\(v_2\to0.281\): the eigenvector is \(\mathbf x_1=(1,\ 0.2808)\).`,
    build(C) {
      let k = 0;
      const draw = () => {
        swingPlot(k);
        const s = k ? powerSteps(k)[k - 1] : [NaN, [1, 1]];
        setPlotTitle(TeX`\(k=${k}\): \(\mathbf v^{(k)}=(1,\ ${s[1][1].toFixed(4)})\)`); P.draw();
      };
      draw();
      slider(C, "steps k", "sk", 0, 10, 1, 0, v => { k = v; draw(); });
      const inp = field(C, TeX`\(v_2\to\)`, "ans1");
      return () => near(parseNum(inp.value), 0.2808, 2e-3) ? ["done", "Correct! Every start with a component along x₁ swings towards it."] : ["wrong", "Not quite. Move the slider to the right and read v₂."];
    } },

  { nav: "Predict the speed", title: "How many iterations?",
    instr: TeX`<p>A matrix has eigenvalues \(\lambda_1=10\) and \(\lambda_2=-8\) (the rest are smaller). About how many power iterations reduce the error by a factor \(10^{-6}\)?</p>`,
    hints: [TeX`The error shrinks by \(|\lambda_2/\lambda_1|=0.8\) per step: solve \(0.8^k=10^{-6}\).`],
    answer: TeX`\(k=\frac{6}{-\log_{10}0.8}\approx62\) iterations.`,
    build(C) {
      P.setView(0, 70, -7, 0.5, { xlabel: "k", xticks: [0, 20, 40, 60], yticks: [-6, -4, -2, 0] });
      P.fn(k => k * Math.log10(0.8), { color: "gold" });
      P.seg(0, -6, 70, -6, { color: "neg", width: 1, alpha: 0.6 });
      setPlotTitle(TeX`\(\log_{10}\) of the error factor \(0.8^k\)`); P.draw();
      const inp = field(C, "iterations ≈", "ans1");
      return () => Math.abs(parseNum(inp.value) - 61.9) <= 1.1 ? ["done", "Correct! A ratio of 0.8 means slow progress: about 10 steps per digit."] : ["wrong", "Not quite. Divide 6 by −log10(0.8)."];
    } },

  { nav: "Keep the sign", title: "A negative dominant eigenvalue",
    instr: TeX`<p>Apply one step to \(A=\begin{bmatrix}-3&0\\0&2\end{bmatrix}\) from \(\mathbf v^{(0)}=(1,1)\). What is \(\lambda^{(1)}\), the entry of largest size of \(A\mathbf v^{(0)}\) <em>with its sign</em>?</p>`,
    hints: [TeX`\(A\mathbf v^{(0)}=(-3,\ 2)\).`],
    answer: TeX`\(\lambda^{(1)}=-3\), the dominant eigenvalue itself. Using \(\lVert\cdot\rVert_\infty\) would give \(+3\).`,
    build(C) {
      drawMatrix([["-3", "0"], ["0", "2"]], TeX`\(A\)`, { "0,0": "neg" });
      const inp = field(C, TeX`\(\lambda^{(1)}=\)`, "ans1");
      return () => near(parseNum(inp.value), -3, 1e-9) ? ["done", "Correct! Keeping the sign gives the right eigenvalue and stops the vectors from flipping."] : ["wrong", "Not quite. Keep the minus sign of the largest entry."];
    } },

  { nav: "Spot the failure", title: "Which matrix defeats the method?",
    instr: TeX`<p>For which matrix does the power method from \(\mathbf v^{(0)}=(1,\ 0.5)\) <b>not</b> converge?</p>`,
    hints: ["Look for two eigenvalues of the same size."],
    answer: TeX`\(\begin{bmatrix}0&1\\1&0\end{bmatrix}\): its eigenvalues \(+1\) and \(-1\) have equal size, and the vector flips between \((0.5,1)\) and \((1,0.5)\).`,
    build(C) {
      P.setView(-1.5, 1.5, -1.5, 1.5, { xticks: [-1, 0, 1], yticks: [-1, 0, 1] });
      P.seg(-1.4, -1.4, 1.4, 1.4, { color: "pos", width: 2, dash: [6, 5] }); P.seg(-1.4, 1.4, 1.4, -1.4, { color: "neg", width: 2, dash: [6, 5] });
      setPlotTitle("Eigenvector directions of the first matrix"); P.draw();
      cards(C, [TeX`\(\begin{bmatrix}0&1\\1&0\end{bmatrix}\)`, TeX`\(\begin{bmatrix}2&1\\1&2\end{bmatrix}\)`, TeX`\(\begin{bmatrix}5&0\\0&1\end{bmatrix}\)`]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 1 ? ["done", "Right! Nothing dies away when |λ₂| = |λ₁|."] : ["wrong", "That one has a strictly dominant eigenvalue (3 or 5)."];
    } },

  { nav: "Rayleigh quotient", title: "A better estimate",
    instr: TeX`<p>For the symmetric \(A=\begin{bmatrix}2&1\\1&2\end{bmatrix}\) (dominant eigenvalue \(3\)) take the approximate eigenvector \(\mathbf v=(1,\ 0.9)\).</p><p>Compute the Rayleigh quotient \(r(\mathbf v)=\dfrac{\mathbf v^TA\mathbf v}{\mathbf v^T\mathbf v}\). (4 decimals)</p>`,
    hints: [TeX`\(A\mathbf v=(2.9,\ 2.8)\), \(\mathbf v^TA\mathbf v=5.42\), \(\mathbf v^T\mathbf v=1.81\).`],
    answer: TeX`\(r=5.42/1.81\approx2.9945\): an error of \(0.0055\), while the vector is off by \(0.1\) in one entry.`,
    build(C) {
      drawMatrix([["2", "1", "", "1"], ["1", "2", "", "0.9"]], TeX`\(A\) and \(\mathbf v\)`, { "0,3": "gold", "1,3": "gold" });
      const inp = field(C, TeX`\(r(\mathbf v)=\)`, "ans1");
      return () => near(parseNum(inp.value), 2.99448, 2e-4) ? ["done", "Correct! The error is of the order of the square of the vector error."] : ["wrong", "Not quite. Compute vᵀAv and vᵀv separately, then divide."];
    } },

  { nav: "The exact value", title: "Check with the characteristic polynomial",
    instr: TeX`<p>For \(A=\begin{bmatrix}7&2\\1&4\end{bmatrix}\), \(\det(A-\lambda I)=\lambda^2-11\lambda+26\).</p><p>Find the dominant eigenvalue \(\lambda_1\). (4 decimals)</p>`,
    hints: [TeX`\(\lambda=\frac{11\pm\sqrt{121-104}}{2}\).`],
    answer: TeX`\(\lambda_1=\frac{11+\sqrt{17}}{2}\approx7.5616\), and \(\lambda_2\approx3.4384\).`,
    build(C) {
      P.setView(0, 10, -8, 8, { xlabel: "λ", xticks: [0, 2, 4, 6, 8, 10], yticks: [-6, 0, 6] });
      P.fn(x => x * x - 11 * x + 26, { color: "curve" });
      P.pt(7.5616, 0, { color: "gold", r: 6 }); P.pt(3.4384, 0, { color: "ink", r: 5 });
      setPlotTitle(TeX`\(\lambda^2-11\lambda+26\)`); P.draw();
      const inp = field(C, TeX`\(\lambda_1=\)`, "ans1");
      return () => near(parseNum(inp.value), 7.56155, 2e-4) ? ["done", "Correct! The power method estimates 9, 8.11, 7.79, … approach it."] : ["wrong", "Not quite. Use the quadratic formula and take the larger root."];
    } },

  { nav: "Read the rate", title: "Recover λ₂ from the errors",
    instr: TeX`<p>The errors \(|\lambda^{(k)}-\lambda_1|\) of a power iteration are \(0.8,\ 0.4,\ 0.2,\ 0.1,\dots\) and \(\lambda_1=6\). What is \(|\lambda_2|\)?</p>`,
    hints: [TeX`The ratio of successive errors tends to \(|\lambda_2/\lambda_1|\).`],
    answer: TeX`The ratio is \(0.5=|\lambda_2|/6\), so \(|\lambda_2|=3\).`,
    build(C) {
      P.setView(0, 5, -1.3, 0.2, { xlabel: "k", xticks: [1, 2, 3, 4], yticks: [-1, 0] });
      [0.8, 0.4, 0.2, 0.1].forEach((e, i) => P.pt(i + 1, Math.log10(e), { color: "gold", r: 6 }));
      setPlotTitle(TeX`\(\log_{10}\) of the errors`); P.draw();
      const inp = field(C, TeX`\(|\lambda_2|=\)`, "ans1");
      return () => near(parseNum(inp.value), 3, 1e-9) ? ["done", "Correct! The slope of the error line reveals the second eigenvalue."] : ["wrong", "Not quite. The error halves each step: multiply that ratio by λ₁."];
    } },

  { nav: "The algorithm", title: "Put the power method in order",
    instr: `<p>Put the steps of one power iteration, and the test after it, in the right order using the menus.</p>`,
    hints: ["Multiply first; the eigenvalue estimate comes from the new vector."],
    answer: "1. y = A v  2. λ = entry of y with the largest size, with its sign  3. v = y / λ  4. Stop if |λ − λ_old| < tol·|λ|",
    build(C) {
      const steps = ["y = A v", "λ = entry of y with the largest size, with its sign", "v = y / λ", "Stop if |λ − λ_old| < tol·|λ|"];
      const order = [2, 0, 3, 1];
      const grid = el("div", { className: "order" }); C.append(grid);
      const sels = [0, 1, 2, 3].map(k => {
        const s = el("select", { id: `dd${k + 1}` });
        s.append(el("option", { value: "" }, "— choose —"), ...order.map(i => { const o = el("option", { value: i }); o.textContent = steps[i]; return o; }));
        grid.append(el("label", { htmlFor: `dd${k + 1}`, className: "steplabel" }, `Step ${k + 1}`), s); return s;
      });
      swingPlot(6); setPlotTitle("The vector turns towards the dominant eigenvector"); P.draw();
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
  store: "nm-lec21-power-v1", lecture: "Lecture 21", tasks: TASKS,
  finalPlot() { swingPlot(8); setPlotTitle(TeX`\(A^k\mathbf v_0\) turns towards \(\mathbf x_1\)`); P.draw(); },
});
