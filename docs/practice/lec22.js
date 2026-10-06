/* Lecture 22 — The Inverse Power Method: practice tasks. */
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

/** Two number lines: eigenvalues of A (top) and their reciprocals (bottom). */
function flipPlot(eigs, title) {
  P.setView(-1.2, 1.2, -1, 1.2, { xticks: [-1, 0, 1], yticks: [], noY: true });
  P.seg(-1.1, 0.7, 1.1, 0.7, { color: "ink", width: 1, alpha: 0.5 }); P.seg(-1.1, -0.4, 1.1, -0.4, { color: "ink", width: 1, alpha: 0.5 });
  P.tex(-0.95, 0.95, TeX`\lambda/10`, { size: 15 }); P.tex(-0.95, -0.15, TeX`1/\lambda`, { size: 15 });
  eigs.forEach(e => { P.pt(e / 10, 0.7, { color: "curve", r: 5 }); P.pt(1 / e, -0.4, { color: "gold", r: 6 }); });
  setPlotTitle(title); P.draw();
}

const TASKS = [
  { nav: "Flip the spectrum", title: "The dominant eigenvalue of A⁻¹",
    instr: TeX`<p>A matrix \(A\) has eigenvalues \(2\), \(5\) and \(-10\). What is the dominant eigenvalue of \(A^{-1}\)?</p>`,
    hints: [TeX`\(A^{-1}\) has eigenvalues \(\tfrac12,\ \tfrac15,\ -\tfrac1{10}\).`],
    answer: TeX`\(\tfrac12=0.5\): the smallest eigenvalue of \(A\) in size becomes the largest of \(A^{-1}\).`,
    build(C) {
      flipPlot([2, 5, -10], TeX`top: \(\lambda/10\); bottom: \(1/\lambda\)`);
      const inp = field(C, TeX`\(\lambda_{\max}(A^{-1})=\)`, "ans1");
      return () => near(parseNum(inp.value), 0.5, 1e-9) ? ["done", "Correct! So the power method on A⁻¹ finds λ = 2."] : ["wrong", "Not quite. Take the reciprocal of each eigenvalue and pick the largest in size."];
    } },

  { nav: "A step", title: "The second inverse power step",
    instr: TeX`<p>For \(A=\begin{bmatrix}4&3\\2&5\end{bmatrix}\) the first step gave \(\mathbf v^{(1)}=(1,\ -0.4)\). Solving \(A\mathbf y^{(2)}=\mathbf v^{(1)}\) gives \(\mathbf y^{(2)}\approx(0.442857,\ -0.257143)\).</p><p>What is \(\lambda^{(2)}=1/\alpha^{(2)}\)? (4 decimals)</p>`,
    hints: [TeX`\(\alpha^{(2)}\) is the entry of \(\mathbf y^{(2)}\) of largest size: \(0.442857=31/70\).`],
    answer: TeX`\(\lambda^{(2)}=70/31\approx2.2581\).`,
    build(C) {
      drawMatrix([["4", "3", "", "1"], ["2", "5", "", "-0.4"]], TeX`\(A\) and \(\mathbf v^{(1)}\)`, { "0,0": "gold", "1,1": "gold" });
      const inp = field(C, TeX`\(\lambda^{(2)}=\)`, "ans1");
      return () => near(parseNum(inp.value), 70 / 31, 2e-4) ? ["done", "Correct! The estimates go 2.8, 2.2581, 2.0766, … towards 2."] : ["wrong", "Not quite. Take the reciprocal of the largest entry of y."];
    } },

  { nav: "Predict the rate", title: "How many iterations?",
    instr: TeX`<p>A matrix has eigenvalues \(1\), \(3\) and \(10\). About how many inverse power iterations reduce the error by \(10^{-6}\)?</p>`,
    hints: [TeX`The rate is \(|\lambda_n/\lambda_{n-1}|=1/3\): solve \((1/3)^k=10^{-6}\).`],
    answer: TeX`\(k=\frac{6}{\log_{10}3}\approx12.6\), so about \(13\).`,
    build(C) {
      P.setView(0, 15, -7, 0.5, { xlabel: "k", xticks: [0, 5, 10, 15], yticks: [-6, -4, -2, 0] });
      P.fn(k => -k * Math.log10(3), { color: "gold" }); P.seg(0, -6, 15, -6, { color: "neg", width: 1, alpha: 0.6 });
      setPlotTitle(TeX`\(\log_{10}(1/3)^k\)`); P.draw();
      const inp = field(C, "iterations ≈", "ans1");
      return () => Math.abs(parseNum(inp.value) - 12.6) <= 0.7 ? ["done", "Correct! The power method would need 6/log10(10/3) ≈ 11.5 for λ = 10."] : ["wrong", "Not quite. Divide 6 by log10(3)."];
    } },

  { nav: "Which eigenvalue?", title: "What does it find?",
    instr: TeX`<p>\(A\) has eigenvalues \(-4\), \(0.5\) and \(3\). Which one does the inverse power method find?</p>`,
    hints: ["It finds the eigenvalue of smallest size."],
    answer: TeX`\(0.5\), the smallest in size (\(-4\) is the smallest number, but not in size).`,
    build(C) {
      flipPlot([-4, 0.5, 3], TeX`top: \(\lambda/10\); bottom: \(1/\lambda\)`);
      cards(C, [TeX`\(-4\)`, TeX`\(0.5\)`, TeX`\(3\)`]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 2 ? ["done", "Right! Size, not sign, decides."] : ["wrong", "Look at the sizes |λ|, not the values."];
    } },

  { nav: "Cost", title: "Factorise once",
    instr: TeX`<p>For \(n=2000\) and \(30\) iterations, compare factorising once (\(\frac{n^3}{3}+30\,n^2\) operations) with solving from scratch each step (\(30\cdot\frac{n^3}{3}\)). How many times cheaper is factorising once? (1 decimal)</p>`,
    hints: [TeX`The ratio is \(\dfrac{30\,n^3/3}{n^3/3+30\,n^2}=\dfrac{30n}{n+90}\).`],
    answer: TeX`\(\frac{60000}{2090}\approx28.7\) times cheaper.`,
    build(C) {
      P.setView(0, 3, 0, 9, { xticks: [], yticks: [0, 4, 8] });
      P.seg(0.9, 0, 0.9, 2.787, { color: "pos", width: 40, cap: "butt" }); P.seg(2.1, 0, 2.1, 80, { color: "neg", width: 40, cap: "butt", alpha: 0.6 });
      P.tex(0.9, 3.4, TeX`\text{once}`); P.tex(2.1, 8.5, TeX`\text{scratch (off scale)}`);
      setPlotTitle(TeX`operations in units of \(10^9\)`); P.draw();
      const inp = field(C, "times cheaper ≈", "ans1");
      return () => Math.abs(parseNum(inp.value) - 28.7) <= 0.3 ? ["done", "Correct! Each step costs n² instead of n³/3."] : ["wrong", "Not quite. Compute 30n/(n + 90) with n = 2000."];
    } },

  { nav: "Triangular solve", title: "Forward substitution",
    instr: TeX`<p>With \(L=\begin{bmatrix}1&0\\ \tfrac12&1\end{bmatrix}\), solve \(L\mathbf z=(1,\ 0)^T\). What is \(z_2\)?</p>`,
    hints: [TeX`\(z_1=1\), then \(\tfrac12 z_1+z_2=0\).`],
    answer: TeX`\(z_2=-\tfrac12\); then \(U\mathbf y=\mathbf z\) gives \(\mathbf y^{(1)}=(5/14,\ -1/7)\).`,
    build(C) {
      drawMatrix([["1", "0", "", "1"], ["1/2", "1", "", "0"]], TeX`\(L\) and the right-hand side`, { "1,0": "gold" });
      const inp = field(C, TeX`\(z_2=\)`, "ans1");
      return () => near(parseNum(inp.value), -0.5, 1e-9) ? ["done", "Correct! Two triangular solves replace multiplying by A⁻¹."] : ["wrong", "Not quite. Substitute z₁ = 1 into the second equation."];
    } },

  { nav: "Check the answer", title: "The residual",
    instr: TeX`<p>After four steps, \(\lambda=2.0221\) and \(\mathbf v=(1,\ -0.6593)\). Compute the second entry of the residual \(A\mathbf v-\lambda\mathbf v\) for \(A=\begin{bmatrix}4&3\\2&5\end{bmatrix}\). (4 decimals)</p>`,
    hints: [TeX`\((A\mathbf v)_2=2-5\cdot0.6593\) and \(\lambda v_2=-2.0221\cdot0.6593\).`],
    answer: TeX`\(-1.2965+1.3332\approx0.0367\): small, and it shrinks with more steps.`,
    build(C) {
      drawMatrix([["4", "3", "", "1"], ["2", "5", "", "-0.6593"]], TeX`\(A\) and \(\mathbf v\)`, { "1,0": "gold", "1,1": "gold" });
      const inp = field(C, TeX`\((A\mathbf v-\lambda\mathbf v)_2=\)`, "ans1");
      return () => near(parseNum(inp.value), 0.03667, 5e-4) ? ["done", "Correct! For an exact eigenpair the residual is zero."] : ["wrong", "Not quite. Compute 2 + 5·(−0.6593), then subtract 2.0221·(−0.6593)."];
    } },

  { nav: "Spot the failure", title: "When does it fail?",
    instr: TeX`<p>For which set of eigenvalues does the inverse power method <b>not</b> converge?</p>`,
    hints: ["It needs one eigenvalue of smallest size."],
    answer: TeX`\(\{1,\ -1,\ 5\}\): the two smallest have equal size, so nothing dies away.`,
    build(C) {
      flipPlot([1, -1, 5], TeX`\(\{1,-1,5\}\): two reciprocals of size 1`);
      cards(C, [TeX`\(\{1,\ -1,\ 5\}\)`, TeX`\(\{1,\ 2,\ 5\}\)`, TeX`\(\{0.5,\ 3,\ 4\}\)`]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 1 ? ["done", "Right! 1/1 and 1/(−1) have the same size."] : ["wrong", "That set has a unique smallest eigenvalue in size."];
    } },

  { nav: "The algorithm", title: "Put the inverse power method in order",
    instr: `<p>Put the steps in the right order using the menus.</p>`,
    hints: ["The factorisation is done once, before the loop."],
    answer: "1. Factorise A = LU once  2. Solve L z = v, then U y = z  3. α = entry of y with the largest size; λ = 1/α  4. v = y/α, and stop if λ has settled",
    build(C) {
      const steps = ["Factorise A = LU once", "Solve L z = v, then U y = z", "α = entry of y with the largest size; λ = 1/α", "v = y/α, and stop if λ has settled"];
      const order = [2, 0, 3, 1];
      const grid = el("div", { className: "order" }); C.append(grid);
      const sels = [0, 1, 2, 3].map(k => {
        const s = el("select", { id: `dd${k + 1}` });
        s.append(el("option", { value: "" }, "— choose —"), ...order.map(i => { const o = el("option", { value: i }); o.textContent = steps[i]; return o; }));
        grid.append(el("label", { htmlFor: `dd${k + 1}`, className: "steplabel" }, `Step ${k + 1}`), s); return s;
      });
      flipPlot([2, 7], TeX`\(\lambda=2,\ 7\ \to\ \tfrac12,\ \tfrac17\)`);
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
  store: "nm-lec22-inverse-power-v1", lecture: "Lecture 22", tasks: TASKS,
  finalPlot() { flipPlot([2, 7], TeX`\(A^{-1}\) turns the smallest eigenvalue into the largest`); },
});
