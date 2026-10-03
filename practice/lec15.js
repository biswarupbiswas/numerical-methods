/* Lecture 15 — Systems with Simple Structure: practice tasks. */
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

/** A sparsity pattern as filled cells. */
function drawPattern(fn, n, title) {
  P.setView(-0.4, n + 0.4, -0.4, n + 0.4, { xticks: [], yticks: [], noY: true });
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++)
    if (fn(i, j)) P.band(j + 0.06, j + 0.94, n - 1 - i + 0.06, n - i - 0.06, { color: "curve", alpha: 0.5 });
  setPlotTitle(title); P.draw();
}

const TASKS = [
  { nav: "Diagonal", title: "A diagonal system",
    instr: TeX`<p>Solve \(2x_1=6,\ 4x_2=2,\ 5x_3=10\).</p><p>What is \(x_2\)?</p>`,
    hints: [TeX`Each equation has one unknown: \(x_i=b_i/d_i\).`],
    answer: TeX`\(x_2=2/4=0.5\).`,
    build(C) {
      drawMatrix([["2", "0", "0", "6"], ["0", "4", "0", "2"], ["0", "0", "5", "10"]], TeX`\([D\,|\,\mathbf b]\)`, { "1,1": "gold", "1,3": "pos" });
      const inp = field(C, TeX`\(x_2=\)`, "ans1");
      return () => near(parseNum(inp.value), 0.5, 1e-9) ? ["done", TeX`Correct! \(\mathbf x=(3,\ 0.5,\ 2)\).`] : ["wrong", "Not quite. Divide b2 by d2."];
    } },

  { nav: "Back substitution", title: "Back substitution",
    instr: TeX`<p>Solve \(x_1+2x_2+x_3=8,\ \ 2x_2-2x_3=2,\ \ 3x_3=9\) from the bottom up.</p><p>Give \(x_2\) and \(x_1\).</p>`,
    hints: [TeX`\(x_3=3\).`, TeX`\(2x_2=2+2\cdot3\), then \(x_1=8-2x_2-x_3\).`],
    answer: TeX`\(x_3=3,\ x_2=4,\ x_1=8-8-3=-3\).`,
    build(C) {
      drawMatrix([["1", "2", "1", "8"], ["0", "2", "-2", "2"], ["0", "0", "3", "9"]], TeX`\([U\,|\,\mathbf b]\)`, { "2,2": "gold", "1,1": "curve", "0,0": "curve" });
      const a = field(C, TeX`\(x_2=\)`, "ans1"), b = field(C, TeX`\(x_1=\)`, "ans2");
      return () => {
        if (!near(parseNum(a.value), 4, 1e-9)) return ["wrong", "Check x2 first: use x3 = 3 in the second equation."];
        return near(parseNum(b.value), -3, 1e-9) ? ["done", "Correct! x = (−3, 4, 3)."] : ["wrong", "x2 is right. Now put x2 and x3 into the first equation."];
      };
    } },

  { nav: "Forward substitution", title: "Forward substitution",
    instr: TeX`<p>Solve \(3x_1=6,\ \ x_1+2x_2=6,\ \ 2x_1-x_2+4x_3=6\) from the top down.</p><p>What is \(x_3\)?</p>`,
    hints: [TeX`\(x_1=2\), \(x_2=(6-2)/2=2\).`, TeX`\(4x_3=6-2\cdot2+2\).`],
    answer: TeX`\(x_3=(6-4+2)/4=1\).`,
    build(C) {
      drawMatrix([["3", "0", "0", "6"], ["1", "2", "0", "6"], ["2", "-1", "4", "6"]], TeX`\([L\,|\,\mathbf b]\)`, { "0,0": "pos", "1,1": "pos", "2,2": "gold" });
      const inp = field(C, TeX`\(x_3=\)`, "ans1");
      return () => near(parseNum(inp.value), 1, 1e-9) ? ["done", "Correct! x = (2, 2, 1)."] : ["wrong", "Not quite. Find x1 and x2 first, then use the last row."];
    } },

  { nav: "Triangular cost", title: "The cost of a triangular solve",
    instr: TeX`<p>A triangular solve needs about \(n^2\) operations. For \(n=2000\), how many is that, in millions?</p>`,
    hints: [TeX`\(2000^2=4\times10^6\).`],
    answer: TeX`\(4\) million, against about \(5.3\times10^9\) for full elimination.`,
    build(C) {
      drawPattern((i, j) => j <= i, 10, "Row i needs about i operations");
      const inp = field(C, "millions =", "ans1");
      return () => near(parseNum(inp.value), 4, 1e-9) ? ["done", "Correct! About a thousand times less than elimination."] : ["wrong", "Not quite. Square 2000."];
    } },

  { nav: "Singular?", title: "Which triangular matrix is singular?",
    instr: TeX`<p>For a triangular matrix, \(\det\) is the product of the diagonal entries. Which matrix is singular?</p>`,
    hints: ["Look for a zero on the diagonal."],
    answer: TeX`\(\begin{bmatrix}2&5&1\\0&0&3\\0&0&4\end{bmatrix}\): its diagonal contains a \(0\), so \(\det=0\).`,
    build(C) {
      drawMatrix([["u11", "*", "*"], ["0", "u22", "*"], ["0", "0", "u33"]], TeX`\(\det U=u_{11}u_{22}u_{33}\)`, { "0,0": "gold", "1,1": "gold", "2,2": "gold" });
      cards(C, [TeX`\(\begin{bmatrix}1&0&0\\4&2&0\\7&5&3\end{bmatrix}\)`, TeX`\(\begin{bmatrix}2&5&1\\0&0&3\\0&0&4\end{bmatrix}\)`, TeX`\(\begin{bmatrix}5&0&0\\0&1&0\\0&0&2\end{bmatrix}\)`]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 2 ? ["done", "Right! Back substitution would have to divide by that zero."] : ["wrong", "All its diagonal entries are non-zero."];
    } },

  { nav: "A new pivot", title: "Thomas: the second pivot",
    instr: TeX`<p>A tridiagonal matrix has \(b_i=4\) on the diagonal and \(a_i=c_i=1\) beside it. The first pivot is \(\hat b_1=4\), so \(m_2=\tfrac14\).</p><p>Compute \(\hat b_2=b_2-m_2c_1\).</p>`,
    hints: [TeX`\(4-\tfrac14\cdot1\).`],
    answer: TeX`\(\hat b_2=3.75\).`,
    build(C) {
      drawMatrix([["4", "1", "0", "0"], ["1", "4", "1", "0"], ["0", "1", "4", "1"], ["0", "0", "1", "4"]], "The tridiagonal matrix", { "0,0": "gold", "1,0": "pos", "1,1": "curve" });
      const inp = field(C, TeX`\(\hat b_2=\)`, "ans1");
      return () => near(parseNum(inp.value), 3.75, 1e-9) ? ["done", "Correct! Only the diagonal entry of row 2 changes: no fill-in."] : ["wrong", "Not quite. Subtract m2 times c1 from b2."];
    } },

  { nav: "Next multiplier", title: "Thomas: the next multiplier",
    instr: TeX`<p>Continue: \(m_3=a_3/\hat b_2\) with \(a_3=1\) and \(\hat b_2=3.75\). Give \(m_3\) to 3 decimals.</p>`,
    hints: [TeX`\(1/3.75\).`],
    answer: TeX`\(m_3=0.267\), small because the matrix is diagonally dominant.`,
    build(C) {
      P.setView(0, 5, 0, 4.5, { xlabel: "k", xticks: [1, 2, 3, 4], yticks: [0, 1, 2, 3, 4] });
      let b = 4;
      const piv = [4];
      for (let k = 2; k <= 4; k++) { b = 4 - 1 / b; piv.push(b); }
      piv.forEach((v, k) => P.pt(k + 1, v, { color: "pos", r: 6 }));
      setPlotTitle(TeX`Pivots \(\hat b_k\) stay near \(3.73\): far from zero`); P.draw();
      const inp = field(C, TeX`\(m_3=\)`, "ans1");
      return () => near(parseNum(inp.value), 1 / 3.75, 0.002) ? ["done", "Correct! Multipliers stay small, so no pivoting is needed."] : ["wrong", "Not quite. Divide a3 by the new pivot."];
    } },

  { nav: "Fill-in", title: "What does elimination leave?",
    instr: TeX`<p>After Gaussian elimination (without pivoting) on a tridiagonal matrix, what does the upper triangular matrix look like?</p>`,
    hints: ["Each step changes only the diagonal entry of the next row."],
    answer: "Upper bidiagonal: the diagonal and one line above it. No new non-zeros appear.",
    build(C) {
      drawPattern((i, j) => Math.abs(i - j) <= 1, 8, "Before: tridiagonal");
      cards(C, ["A full upper triangle", "Upper bidiagonal (diagonal + one line above)", "Still tridiagonal"]);
      return () => {
        if (!S.choice) return ["wrong", "Choose one of the options."];
        if (S.choice !== 2) return ["wrong", "Think about which entries elimination can change."];
        drawPattern((i, j) => j === i || j === i + 1, 8, "After: upper bidiagonal");
        return ["done", "Right! That is why the Thomas algorithm needs only about 8n operations."];
      };
    } },

  { nav: "The algorithm", title: "Put the Thomas algorithm in order",
    instr: `<p>Put the steps of the Thomas algorithm in the right order using the menus.</p>`,
    hints: ["Go down first (multipliers, pivots, right-hand side), then come back up."],
    answer: "1. For i = 2..n: m = a(i)/b̂(i−1)  2. b̂(i) = b(i) − m·c(i−1) and d̂(i) = d(i) − m·d̂(i−1)  3. x(n) = d̂(n)/b̂(n)  4. For i = n−1..1: x(i) = (d̂(i) − c(i)·x(i+1))/b̂(i)",
    build(C) {
      const steps = ["For i = 2..n: m = a(i) / b̂(i−1)", "b̂(i) = b(i) − m·c(i−1) and d̂(i) = d(i) − m·d̂(i−1)",
                     "x(n) = d̂(n) / b̂(n)", "For i = n−1..1: x(i) = (d̂(i) − c(i)·x(i+1)) / b̂(i)"];
      const order = [2, 0, 3, 1];
      const grid = el("div", { className: "order" }); C.append(grid);
      const sels = [0, 1, 2, 3].map(k => {
        const s = el("select", { id: `dd${k + 1}` });
        s.append(el("option", { value: "" }, "— choose —"), ...order.map(i => { const o = el("option", { value: i }); o.textContent = steps[i]; return o; }));
        grid.append(el("label", { htmlFor: `dd${k + 1}`, className: "steplabel" }, `Step ${k + 1}`), s); return s;
      });
      drawMatrix([["2", "-1", "0", "0"], ["-1", "2", "-1", "0"], ["0", "-1", "2", "-1"], ["0", "0", "-1", "2"]], TeX`The lecture example: pivots \(2,\tfrac32,\tfrac43,\tfrac54\)`, { "0,0": "pos", "1,1": "pos", "2,2": "pos", "3,3": "pos" });
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
  store: "nm-lec15-special-v1", lecture: "Lecture 15", tasks: TASKS,
  finalPlot() { drawPattern((i, j) => Math.abs(i - j) <= 1, 10, "Tridiagonal: solved in about 8n operations"); },
});
