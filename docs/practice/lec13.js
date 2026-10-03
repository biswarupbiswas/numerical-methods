/* Lecture 13 — LU Factorisation: practice tasks. */
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

/** L and U side by side, separated by a gap column. */
function drawLU(L, U, title, hl = {}) {
  const rows = L.map((r, i) => [...r, "", ...U[i]]);
  drawMatrix(rows, title, hl);
}

const L1 = [["1", "0", "0"], ["2", "1", "0"], ["4", "3", "1"]];
const U1 = [["2", "1", "1"], ["0", "1", "1"], ["0", "0", "2"]];

const TASKS = [
  { nav: "Read off L", title: "The multipliers are L",
    instr: TeX`<p>Gaussian elimination on \(A=\begin{bmatrix}2&1&1\\4&3&3\\8&7&9\end{bmatrix}\) without row swaps uses the multipliers \(m_{21},m_{31},m_{32}\).</p><p>What is the entry \(l_{31}\) of the unit lower triangular \(L\)?</p>`,
    hints: [TeX`\(l_{31}=m_{31}=a_{31}/a_{11}\).`],
    answer: TeX`\(l_{31}=m_{31}=8/2=4\).`,
    build(C) {
      drawMatrix([["2", "1", "1"], ["4", "3", "3"], ["8", "7", "9"]], TeX`The matrix \(A\)`, { "0,0": "gold", "2,0": "pos" });
      const inp = field(C, TeX`\(l_{31}=\)`, "ans1");
      return () => near(parseNum(inp.value), 4, 1e-9) ? ["done", TeX`Correct! The multiplier \(m_{31}=4\) is stored as \(l_{31}\).`] : ["wrong", "Not quite. Divide the entry below the pivot by the pivot."];
    } },

  { nav: "Forward", title: "Forward substitution",
    instr: TeX`<p>With \(L=\begin{bmatrix}1&0&0\\2&1&0\\4&3&1\end{bmatrix}\) and \(\mathbf b=(5,13,33)\), solve \(L\mathbf z=\mathbf b\) from the top down.</p><p>What is \(z_3\)?</p>`,
    hints: [TeX`\(z_1=5\), then \(z_2=13-2z_1=3\).`, TeX`\(z_3=33-4z_1-3z_2\).`],
    answer: TeX`\(z_3=33-20-9=4\).`,
    build(C) {
      drawMatrix([...L1.map((r, i) => [...r, ["5", "13", "33"][i]])], TeX`\([L\,|\,\mathbf b]\)`, { "2,0": "pos", "2,1": "pos", "2,2": "pos" });
      const inp = field(C, TeX`\(z_3=\)`, "ans1");
      return () => near(parseNum(inp.value), 4, 1e-9) ? ["done", TeX`Correct! \(\mathbf z=(5,3,4)\).`] : ["wrong", "Not quite. First find z1 and z2, then use the third row."];
    } },

  { nav: "Back", title: "Back substitution",
    instr: TeX`<p>Now solve \(U\mathbf x=\mathbf z\) with \(U=\begin{bmatrix}2&1&1\\0&1&1\\0&0&2\end{bmatrix}\) and \(\mathbf z=(5,3,4)\), from the bottom up.</p><p>Give \(x_3\) and \(x_1\).</p>`,
    hints: [TeX`\(x_3=4/2\).`, TeX`\(x_2=3-x_3\), then \(x_1=(5-x_2-x_3)/2\).`],
    answer: TeX`\(x_3=2,\ x_2=1,\ x_1=1\).`,
    build(C) {
      drawMatrix([...U1.map((r, i) => [...r, ["5", "3", "4"][i]])], TeX`\([U\,|\,\mathbf z]\)`, { "0,0": "gold", "1,1": "gold", "2,2": "gold" });
      const a = field(C, TeX`\(x_3=\)`, "ans1"), b = field(C, TeX`\(x_1=\)`, "ans2");
      return () => {
        if (!near(parseNum(a.value), 2, 1e-9)) return ["wrong", "Check x3 first: the last row has only one unknown."];
        return near(parseNum(b.value), 1, 1e-9) ? ["done", TeX`Correct! \(\mathbf x=(1,1,2)\), and indeed \(A\mathbf x=(5,13,33)\).`] : ["wrong", "x3 is right. Now find x2, then x1."];
      };
    } },

  { nav: "Doolittle", title: "A Doolittle entry",
    instr: TeX`<p>For \(A=\begin{bmatrix}1&1&1\\4&3&-1\\3&5&3\end{bmatrix}\), Doolittle's method gives \(l_{21}=4,\ l_{31}=3\), \(u_{22}=-1,\ u_{23}=-5\) and \(l_{32}=-2\).</p><p>Compute \(u_{33}=a_{33}-l_{31}u_{13}-l_{32}u_{23}\).</p>`,
    hints: [TeX`\(u_{13}=1\).`, TeX`\(3-3\cdot1-(-2)(-5)\).`],
    answer: TeX`\(u_{33}=3-3-10=-10\).`,
    build(C) {
      drawLU([["1", "0", "0"], ["4", "1", "0"], ["3", "-2", "1"]], [["1", "1", "1"], ["0", "-1", "-5"], ["0", "0", "?"]], TeX`\(L\) and \(U\)`, { "2,6": "gold", "2,1": "pos", "1,6": "pos" });
      const inp = field(C, TeX`\(u_{33}=\)`, "ans1");
      return () => near(parseNum(inp.value), -10, 1e-9) ? ["done", TeX`Correct! \(\det A=1\cdot(-1)\cdot(-10)=10\).`] : ["wrong", "Not quite. Watch the signs: (−2)(−5) = +10."];
    } },

  { nav: "Leading minors", title: "Does Doolittle's factorisation exist?",
    instr: TeX`<p>Doolittle's factorisation (without row swaps) is guaranteed when the leading principal minors \(D_1,\dots,D_{n-1}\) are non-zero.</p><p>For which matrix does it work?</p>`,
    hints: [TeX`Compute \(D_1=a_{11}\) and, for the \(3\times3\) one, \(D_2\).`],
    answer: TeX`\(\begin{bmatrix}2&1\\1&3\end{bmatrix}\): \(D_1=2\ne0\). The others have \(D_1=0\) or \(D_2=4-4=0\).`,
    build(C) {
      drawMatrix([["1", "2", "3"], ["2", "4", "5"], ["1", "3", "4"]], TeX`Here \(D_2=\begin{vmatrix}1&2\\2&4\end{vmatrix}\) …`, { "0,0": "gold", "0,1": "gold", "1,0": "gold", "1,1": "gold" });
      cards(C, [TeX`\(\begin{bmatrix}0&1\\2&1\end{bmatrix}\)`, TeX`\(\begin{bmatrix}1&2&3\\2&4&5\\1&3&4\end{bmatrix}\)`, TeX`\(\begin{bmatrix}2&1\\1&3\end{bmatrix}\)`]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 3 ? ["done", TeX`Right! \(L=\begin{bmatrix}1&0\\ \frac12&1\end{bmatrix},\ U=\begin{bmatrix}2&1\\0&\frac52\end{bmatrix}\).`] : ["wrong", "One of its leading minors is zero. Check D1 and D2."];
    } },

  { nav: "Crout", title: "A Crout entry",
    instr: TeX`<p>Crout's method for \(A=\begin{bmatrix}6&3&2\\3&8&1\\2&1&9\end{bmatrix}\) first gives the column \(l_{11}=6,\ l_{21}=3,\ l_{31}=2\) and then \(u_{12}=\tfrac36=\tfrac12\).</p><p>Compute \(l_{22}=a_{22}-l_{21}u_{12}\).</p>`,
    hints: [TeX`\(8-3\cdot\tfrac12\).`],
    answer: TeX`\(l_{22}=8-1.5=6.5\).`,
    build(C) {
      drawLU([["6", "0", "0"], ["3", "?", "0"], ["2", "", ""]], [["1", "1/2", "1/3"], ["0", "1", ""], ["0", "0", "1"]], TeX`Crout: \(U\) has ones on its diagonal`, { "1,1": "gold", "1,0": "pos", "0,5": "pos" });
      const inp = field(C, TeX`\(l_{22}=\)`, "ans1");
      return () => near(parseNum(inp.value), 6.5, 1e-9) ? ["done", TeX`Correct! \(l_{22}=\tfrac{13}{2}\).`] : ["wrong", "Not quite. Subtract l21 · u12 from a22."];
    } },

  { nav: "Not unique", title: "A singular matrix",
    instr: TeX`<p>Move the slider: for every \(t\), \(\begin{bmatrix}1&0\\t&1\end{bmatrix}\begin{bmatrix}0&0\\0&1\end{bmatrix}\) is the same matrix.</p><p>How many Doolittle factorisations does \(\begin{bmatrix}0&0\\0&1\end{bmatrix}\) have?</p>`,
    hints: ["Multiply the two factors: does t appear in the product?"],
    answer: "Infinitely many: the product never depends on t. Uniqueness needs A to be nonsingular.",
    build(C) {
      let t = 0;
      const draw = () => drawLU([["1", "0"], [t.toFixed(1), "1"]], [["0", "0"], ["0", "1"]], TeX`\(L(t)\) and \(U\): product \(\begin{bmatrix}0&0\\0&1\end{bmatrix}\) for every \(t\)`, { "1,0": "gold" });
      draw();
      slider(C, "t", "st", -3, 3, 0.1, 0, v => { t = v; draw(); });
      cards(C, ["Exactly one", "None", "Infinitely many"]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 3 ? ["done", "Right! The matrix is singular, so uniqueness fails."] : ["wrong", "Try a few values of t: the product does not change."];
    } },

  { nav: "Cost", title: "Many right-hand sides",
    instr: TeX`<p>For \(n=500\) and \(50\) right-hand sides, compare repeating Gaussian elimination, \(50\cdot\tfrac23n^3\), with LU: \(\tfrac23n^3+50\cdot2n^2\).</p><p>About how many times cheaper is LU? (whole number)</p>`,
    hints: [TeX`\(\tfrac23n^3\approx8.33\times10^7\), \(2n^2=5\times10^5\).`, TeX`\(4.17\times10^9\ /\ 1.08\times10^8\).`],
    answer: TeX`About \(38\) times cheaper (\(4.17\times10^9\) against \(1.08\times10^8\)).`,
    build(C) {
      P.setView(0, 3, 1e6, 1e10, { ylog: true, xticks: [] });
      P.seg(0.8, 1e6, 0.8, 4.17e9, { color: "neg", width: 40, cap: "butt" }); P.seg(2.2, 1e6, 2.2, 1.08e8, { color: "pos", width: 40, cap: "butt" });
      P.tex(0.8, 7e9, TeX`\text{elimination}`); P.tex(2.2, 2e8, TeX`LU`);
      setPlotTitle(TeX`Operations, log scale`); P.draw();
      const inp = field(C, "times cheaper ≈", "ans1");
      return () => Math.abs(parseNum(inp.value) - 38.46) <= 1 ? ["done", "Correct! Factorise once, then each right-hand side costs only about 2n² operations."] : ["wrong", "Not quite. Compute both totals and divide."];
    } },

  { nav: "Solve with PA = LU", title: "Put the steps in order",
    instr: `<p>Put the steps for solving Ax = b with partial pivoting in the right order using the menus.</p>`,
    hints: ["The factorisation comes first, and back substitution gives x at the very end."],
    answer: "1. Factorise PA = LU (elimination with row swaps)  2. Reorder b into Pb  3. Solve L z = Pb by forward substitution  4. Solve U x = z by back substitution",
    build(C) {
      const steps = ["Factorise PA = LU (elimination with row swaps)", "Reorder the right-hand side into Pb",
                     "Solve L z = Pb by forward substitution", "Solve U x = z by back substitution"];
      const order = [2, 0, 3, 1];
      const grid = el("div", { className: "order" }); C.append(grid);
      const sels = [0, 1, 2, 3].map(k => {
        const s = el("select", { id: `dd${k + 1}` });
        s.append(el("option", { value: "" }, "— choose —"), ...order.map(i => { const o = el("option", { value: i }); o.textContent = steps[i]; return o; }));
        grid.append(el("label", { htmlFor: `dd${k + 1}`, className: "steplabel" }, `Step ${k + 1}`), s); return s;
      });
      drawLU([["1", "0", "0"], ["2/3", "1", "0"], ["1/3", "1/11", "1"]], [["3", "4", "-2"], ["0", "-11/3", "13/3"], ["0", "0", "14/11"]], TeX`\(PA=LU\) from Lecture 12`);
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
  store: "nm-lec13-lu-v1", lecture: "Lecture 13", tasks: TASKS,
  finalPlot() { drawLU(L1, U1, TeX`\(A=LU\): \(\mathbf x=(1,1,2)\)`, { "1,0": "pos", "2,0": "pos", "2,1": "pos", "0,4": "gold", "1,5": "gold", "2,6": "gold" }); },
});
