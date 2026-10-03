/* Lecture 14 — Cholesky Factorisation: practice tasks. */
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

const A25 = [["25", "15", "-5"], ["15", "18", "0"], ["-5", "0", "11"]];

const TASKS = [
  { nav: "Positive definite?", title: "Which matrix is positive definite?",
    instr: TeX`<p>A symmetric matrix is positive definite exactly when all its leading principal minors are positive (Sylvester's criterion).</p><p>Which of these is positive definite?</p>`,
    hints: [TeX`Check \(D_1=a_{11}\) and \(D_2=\det A\) for each.`],
    answer: TeX`\(\begin{bmatrix}2&-1\\-1&2\end{bmatrix}\): \(D_1=2>0\), \(D_2=4-1=3>0\).`,
    build(C) {
      drawMatrix([["a", "b"], ["b", "c"]], TeX`\(2\times2\): \(D_1=a>0\) and \(D_2=ac-b^2>0\)`, { "0,0": "gold" });
      cards(C, [TeX`\(\begin{bmatrix}1&2\\2&1\end{bmatrix}\)`, TeX`\(\begin{bmatrix}2&-1\\-1&2\end{bmatrix}\)`, TeX`\(\begin{bmatrix}0&1\\1&3\end{bmatrix}\)`]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 2 ? ["done", "Right! Both leading minors are positive (and its eigenvalues are 1 and 3)."] : ["wrong", "One of its leading minors is zero or negative."];
    } },

  { nav: "A leading minor", title: "Sylvester's criterion",
    instr: TeX`<p>For \(A=\begin{bmatrix}25&15&-5\\15&18&0\\-5&0&11\end{bmatrix}\), compute the second leading principal minor \(D_2\).</p>`,
    hints: [TeX`\(D_2=\begin{vmatrix}25&15\\15&18\end{vmatrix}\).`],
    answer: TeX`\(D_2=25\cdot18-15\cdot15=450-225=225\).`,
    build(C) {
      drawMatrix(A25, TeX`The top-left \(2\times2\) block`, { "0,0": "gold", "0,1": "gold", "1,0": "gold", "1,1": "gold" });
      const inp = field(C, TeX`\(D_2=\)`, "ans1");
      return () => near(parseNum(inp.value), 225, 1e-9) ? ["done", TeX`Correct! With \(D_1=25\) and \(D_3=2025\), all minors are positive.`] : ["wrong", "Not quite. Compute 25·18 − 15·15."];
    } },

  { nav: "First column", title: "The first column of L",
    instr: TeX`<p>Start Cholesky on the same matrix: \(l_{11}=\sqrt{a_{11}}\) and \(l_{21}=a_{21}/l_{11}\).</p><p>Give \(l_{11}\) and \(l_{21}\).</p>`,
    hints: [TeX`\(\sqrt{25}=5\).`, TeX`\(15/5\).`],
    answer: TeX`\(l_{11}=5,\ l_{21}=3\) (and \(l_{31}=-5/5=-1\)).`,
    build(C) {
      drawMatrix(A25, TeX`\(A\)`, { "0,0": "gold", "1,0": "pos" });
      const a = field(C, TeX`\(l_{11}=\)`, "ans1"), b = field(C, TeX`\(l_{21}=\)`, "ans2");
      return () => {
        if (!near(parseNum(a.value), 5, 1e-9)) return ["wrong", "Check l11 first: it is a square root."];
        return near(parseNum(b.value), 3, 1e-9) ? ["done", "Correct! The first column of L is 5, 3, −1."] : ["wrong", "l11 is right. Now divide a21 by l11."];
      };
    } },

  { nav: "A diagonal entry", title: "The second diagonal entry",
    instr: TeX`<p>With \(l_{21}=3\), compute \(l_{22}=\sqrt{a_{22}-l_{21}^2}\).</p>`,
    hints: [TeX`\(\sqrt{18-9}\).`],
    answer: TeX`\(l_{22}=\sqrt{18-9}=3\).`,
    build(C) {
      drawMatrix([["5", "0", "0"], ["3", "?", "0"], ["-1", "", ""]], TeX`\(L\) so far`, { "1,1": "gold", "1,0": "pos" });
      const inp = field(C, TeX`\(l_{22}=\)`, "ans1");
      return () => near(parseNum(inp.value), 3, 1e-9) ? ["done", TeX`Correct! \(l_{22}=3\).`] : ["wrong", "Not quite. Subtract the square of l21 from a22, then take the root."];
    } },

  { nav: "The last entry", title: "Finish the factor",
    instr: TeX`<p>Now \(l_{32}=\dfrac{a_{32}-l_{31}l_{21}}{l_{22}}=\dfrac{0-(-1)(3)}{3}=1\).</p><p>Compute \(l_{33}=\sqrt{a_{33}-l_{31}^2-l_{32}^2}\).</p>`,
    hints: [TeX`\(\sqrt{11-1-1}\).`],
    answer: TeX`\(l_{33}=\sqrt{9}=3\), so \(L=\begin{bmatrix}5&0&0\\3&3&0\\-1&1&3\end{bmatrix}\).`,
    build(C) {
      drawMatrix([["5", "0", "0"], ["3", "3", "0"], ["-1", "1", "?"]], TeX`\(L\) so far`, { "2,2": "gold", "2,0": "pos", "2,1": "pos" });
      const inp = field(C, TeX`\(l_{33}=\)`, "ans1");
      return () => near(parseNum(inp.value), 3, 1e-9) ? ["done", TeX`Correct! Check: the squares of row 3 add up to \(1+1+9=11=a_{33}\).`] : ["wrong", "Not quite. Subtract the squares of the other entries in row 3 from a33."];
    } },

  { nav: "Forward", title: "Solve L y = b",
    instr: TeX`<p>With \(L=\begin{bmatrix}2&0&0\\1&2&0\\1&0&\sqrt5\end{bmatrix}\) and \(\mathbf b=(14,15,22)\), solve \(L\mathbf y=\mathbf b\) from the top.</p><p>What is \(y_2\)?</p>`,
    hints: [TeX`\(y_1=14/2=7\).`, TeX`\(y_2=(15-y_1)/2\).`],
    answer: TeX`\(y_2=(15-7)/2=4\).`,
    build(C) {
      drawMatrix([["2", "0", "0", "14"], ["1", "2", "0", "15"], ["1", "0", TeX`\sqrt5`, "22"]], TeX`\([L\,|\,\mathbf b]\)`, { "1,0": "pos", "1,1": "gold" });
      const inp = field(C, TeX`\(y_2=\)`, "ans1");
      return () => near(parseNum(inp.value), 4, 1e-9) ? ["done", TeX`Correct! Continuing, \(L^T\mathbf x=\mathbf y\) gives \(\mathbf x=(1,2,3)\).`] : ["wrong", "Not quite. Use y1 = 7 in the second row."];
    } },

  { nav: "When it fails", title: "Where does Cholesky stop?",
    instr: TeX`<p>For \(\begin{bmatrix}1&t\\t&1\end{bmatrix}\) we get \(l_{11}=1\), \(l_{21}=t\) and \(l_{22}^2=1-t^2\). Move the slider.</p><p>For which value of \(t\) does the factorisation fail?</p>`,
    hints: ["The number under the square root must be positive."],
    answer: TeX`\(t=1.2\): then \(l_{22}^2=1-1.44<0\), and the matrix is not positive definite.`,
    build(C) {
      let t = 0.5;
      const draw = () => {
        P.setView(-1.6, 1.6, -1.6, 1.3, { xlabel: "t", xticks: [-1.5, -1, -0.5, 0, 0.5, 1, 1.5], yticks: [-1, 0, 1] });
        P.band(-1, 1, 0, 1.2, { color: "pos", alpha: 0.12 });
        P.fn(x => 1 - x * x, { color: "curve" });
        P.pt(t, 1 - t * t, { color: 1 - t * t > 0 ? "pos" : "neg", r: 7 });
        setPlotTitle(TeX`\(l_{22}^2=1-t^2\) at \(t=${t.toFixed(2)}\)`); P.draw();
      };
      draw();
      slider(C, "t", "st", -1.5, 1.5, 0.05, 0.5, v => { t = v; draw(); });
      cards(C, [TeX`\(t=0.5\)`, TeX`\(t=0.9\)`, TeX`\(t=1.2\)`]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 3 ? ["done", TeX`Right! The matrix is positive definite exactly when \(|t|<1\).`] : ["wrong", "There 1 − t² is still positive. Try the slider."];
    } },

  { nav: "Cost", title: "Operations for Cholesky",
    instr: TeX`<p>Cholesky needs about \(\tfrac13 n^3\) operations. For \(n=3000\), how many is that, in billions (\(10^9\))?</p>`,
    hints: [TeX`\(3000^3=2.7\times10^{10}\).`],
    answer: TeX`\(\tfrac13\cdot2.7\times10^{10}=9\times10^9\): 9 billion, half of the 18 billion for \(LU\).`,
    build(C) {
      P.setView(0, 3, 0, 20, { xticks: [], yticks: [0, 5, 10, 15, 20] });
      P.seg(0.8, 0, 0.8, 18, { color: "curve", width: 40, cap: "butt" }); P.seg(2.2, 0, 2.2, 9, { color: "pos", width: 40, cap: "butt" });
      P.tex(0.8, 19, TeX`LU`); P.tex(2.2, 10, TeX`\text{Cholesky}`);
      setPlotTitle(TeX`Operations for \(n=3000\), in \(10^9\)`); P.draw();
      const inp = field(C, "billions =", "ans1");
      return () => near(parseNum(inp.value), 9, 1e-9) ? ["done", "Correct! Half the work of LU, and half the memory."] : ["wrong", "Not quite. Compute 3000³ / 3."];
    } },

  { nav: "The algorithm", title: "Put one Cholesky step in order",
    instr: `<p>Put the steps for column k of the Cholesky factorisation in the right order using the menus.</p>`,
    hints: ["The positivity check comes before the square root, and the entries below the diagonal need l(kk)."],
    answer: "1. s = a(kk) − sum of l(kj)² over j < k  2. If s ≤ 0, stop: A is not positive definite  3. l(kk) = √s  4. For i > k: l(ik) = (a(ik) − sum of l(ij) l(kj)) / l(kk)",
    build(C) {
      const steps = ["s = a(kk) − sum of l(kj)² over j < k", "If s ≤ 0, stop: A is not positive definite", "l(kk) = √s",
                     "For i > k: l(ik) = (a(ik) − sum of l(ij)·l(kj)) / l(kk)"];
      const order = [2, 0, 3, 1];
      const grid = el("div", { className: "order" }); C.append(grid);
      const sels = [0, 1, 2, 3].map(k => {
        const s = el("select", { id: `dd${k + 1}` });
        s.append(el("option", { value: "" }, "— choose —"), ...order.map(i => { const o = el("option", { value: i }); o.textContent = steps[i]; return o; }));
        grid.append(el("label", { htmlFor: `dd${k + 1}`, className: "steplabel" }, `Step ${k + 1}`), s); return s;
      });
      drawMatrix([["2", "0", "0"], ["1", "2", "0"], ["1", "0", TeX`\sqrt5`]], TeX`Cholesky factor of the lecture example`, { "0,0": "gold", "1,1": "gold", "2,2": "gold" });
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
  store: "nm-lec14-cholesky-v1", lecture: "Lecture 14", tasks: TASKS,
  finalPlot() { drawMatrix([["5", "0", "0"], ["3", "3", "0"], ["-1", "1", "3"]], TeX`\(A=LL^T\) for the exercise matrix`, { "0,0": "gold", "1,1": "gold", "2,2": "gold" }); },
});
