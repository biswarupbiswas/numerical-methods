/* Lecture 12 — Partial and Complete Pivoting: practice tasks. */
"use strict";

/** Draw a small matrix as labelled cells; hl = {"i,j": colour}. */
function drawMatrix(rows, title, hl = {}, bar = true) {
  const n = rows.length, m = rows[0].length;
  P.setView(-0.6, m + 0.6, -0.6, n + 0.4, { xticks: [], yticks: [], noY: true });
  rows.forEach((r, i) => r.forEach((v, j) => {
    const y = n - 1 - i, c = hl[`${i},${j}`];
    if (c) P.band(j + 0.08, j + 0.92, y + 0.1, y + 0.9, { color: c, alpha: 0.25 });
    P.tex(j + 0.5, y + 0.5, v, { size: 19, color: c || "ink" });
  }));
  if (bar && m > n) P.seg(n, -0.1, n, n + 0.1, { color: "muted", width: 1.5 });
  setPlotTitle(title); P.draw();
}

const TASKS = [
  { nav: "Choose the pivot", title: "Choose the pivot",
    instr: TeX`<p>At step \(k=1\) the first column is \((0.5,\ -3,\ 2,\ 1)^T\). With partial pivoting, which row becomes the pivot row?</p>`,
    hints: ["Compare absolute values."],
    answer: TeX`Row 2: \(|-3|=3\) is the largest absolute value.`,
    build(C) {
      drawMatrix([["0.5"], ["-3"], ["2"], ["1"]], "Column 1", {}, false);
      cards(C, ["Row 1", "Row 2", "Row 3", "Row 4"]);
      return () => {
        if (!S.choice) return ["wrong", "Choose one of the options."];
        if (S.choice !== 2) return ["wrong", "Look at the absolute values."];
        drawMatrix([["0.5"], ["-3"], ["2"], ["1"]], "Row 2 becomes the pivot row", { "1,0": "gold" }, false);
        return ["done", "Right! The sign does not matter, only the size."];
      };
    } },

  { nav: "Bounded multiplier", title: "The multiplier after the swap",
    instr: TeX`<p>After swapping, the system is \(5.291x_1-6.130x_2=46.78\), \(0.003000x_1+59.14x_2=59.17\).</p><p>Compute \(m_{21}\) (3 significant digits).</p>`,
    hints: [TeX`\(m_{21}=0.003000/5.291\).`],
    answer: TeX`\(m_{21}\approx0.000567\), much smaller than \(1\).`,
    build(C) {
      drawMatrix([["5.291", "-6.130", "46.78"], ["0.003", "59.14", "59.17"]], "After the row swap", { "0,0": "gold", "1,0": "pos" });
      const inp = field(C, TeX`\(m_{21}=\)`, "ans1");
      return () => Math.abs(parseNum(inp.value) - 0.000567) <= 0.000002 ? ["done", TeX`Correct! \(|m_{21}|\le1\), as partial pivoting guarantees.`] : ["wrong", "Not quite. Divide the entry below the pivot by the pivot."];
    } },

  { nav: "Without pivoting", title: "What goes wrong?",
    instr: TeX`<p>Without pivoting and with 4 digits, the same system gives \(x_2=1.001\). Then \(x_1=\dfrac{59.17-59.14\,x_2}{0.003000}\).</p><p>Compute this \(x_1\) with 4-digit rounding.</p>`,
    hints: [TeX`\(59.14\times1.001=59.20\) (4 digits).`, TeX`\((59.17-59.20)/0.003\).`],
    answer: TeX`\(x_1=\frac{-0.03}{0.003}=-10.00\), while the exact value is \(10\).`,
    build(C) {
      P.setView(-12, 12, -1, 1, { xticks: [-10, -5, 0, 5, 10], yticks: [], noY: true });
      P.pt(10, 0, { color: "pos", r: 7 }); P.tex(10, 0.45, TeX`\text{exact}`, { color: "pos" });
      setPlotTitle(TeX`Where does the computed \(x_1\) land?`); P.draw();
      const inp = field(C, TeX`\(x_1=\)`, "ans1");
      return () => {
        if (!near(parseNum(inp.value), -10, 1e-9)) return ["wrong", "Not quite. Round 59.14 × 1.001 to 4 digits first."];
        P.pt(-10, 0, { color: "neg", r: 7 }); P.tex(-10, 0.45, TeX`\text{computed}`, { color: "neg" }); P.draw();
        return ["done", TeX`Right: \(-10\). The error of \(0.001\) in \(x_2\) was multiplied by about \(20\,000\).`];
      };
    } },

  { nav: "Impossible multiplier", title: "Which multiplier cannot occur?",
    instr: TeX`<p>With partial pivoting, which of these multipliers can never occur?</p>`,
    hints: [TeX`The pivot is the largest entry of its column, so \(|m_{ik}|=|a_{ik}|/|a_{kk}|\le1\).`],
    answer: TeX`\(1764\): with partial pivoting every \(|m_{ik}|\le1\).`,
    build(C) {
      P.setView(0, 5, 0, 2, { xticks: [], yticks: [0, 1, 2] });
      P.band(0, 5, 0, 1, { color: "pos", alpha: 0.15 }); P.tex(2.5, 1.5, TeX`|m_{ik}|\le 1`, { color: "pos", size: 20 });
      setPlotTitle("Allowed range of multipliers"); P.draw();
      cards(C, [TeX`\(0.5\)`, TeX`\(-0.9\)`, TeX`\(1764\)`, TeX`\(1\)`]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 3 ? ["done", "Right! 1764 is the multiplier of the unpivoted example."] : ["wrong", "That one is allowed: its absolute value is at most 1."];
    } },

  { nav: "Scaled pivoting", title: "Scaled partial pivoting",
    instr: TeX`<p>Rows: \(30.00x_1+591400x_2=591700\) and \(5.291x_1-6.130x_2=46.78\). The row sizes are \(s_1=591400\), \(s_2=6.130\).</p>
               <p>Compute the scaled ratio \(\dfrac{|a_{21}|}{s_2}\) (3 decimals).</p>`,
    hints: [TeX`\(5.291/6.130\).`],
    answer: TeX`\(0.863\), against \(30/591400\approx0.00005\) for row 1, so row 2 is the pivot row.`,
    build(C) {
      drawMatrix([["30.00", "591400", "591700"], ["5.291", "-6.130", "46.78"]], "A badly scaled system", { "0,0": "neg", "1,0": "pos" });
      const inp = field(C, "ratio =", "ans1");
      return () => near(parseNum(inp.value), 5.291 / 6.130, 0.002) ? ["done", "Correct! Row 2 wins, and elimination gives x1 = 10 again."] : ["wrong", "Not quite. Divide |5.291| by the largest |entry| of row 2."];
    } },

  { nav: "Search cost", title: "The cost of the search",
    instr: TeX`<p>Partial pivoting compares \(n-k\) entries at step \(k\). How many comparisons in total for \(n=100\)?</p>`,
    hints: [TeX`\(\sum_{k=1}^{n-1}(n-k)=\frac{n(n-1)}{2}\).`],
    answer: TeX`\(\frac{100\cdot99}{2}=4950\), against about \(6.7\times10^5\) arithmetic operations.`,
    build(C) {
      P.setView(0, 3, 1, 1e6, { ylog: true, xticks: [] });
      P.seg(0.8, 1, 0.8, 4950, { color: "gold", width: 40, cap: "butt" }); P.seg(2.2, 1, 2.2, 666667, { color: "curve", width: 40, cap: "butt" });
      P.tex(0.8, 12000, TeX`\text{search}`); P.tex(2.2, 2e6 / 1.2, TeX`\text{arithmetic}`);
      setPlotTitle(TeX`\(n=100\), log scale`); P.draw();
      const inp = field(C, "comparisons =", "ans1");
      return () => parseNum(inp.value) === 4950 ? ["done", "Correct! The search is negligible."] : ["wrong", "Not quite. Add 99 + 98 + … + 1."];
    } },

  { nav: "Complete pivoting", title: "Complete pivoting",
    instr: TeX`<p>For \(A=\begin{bmatrix}1&2&-7\\4&-9&3\\5&0&2\end{bmatrix}\), complete pivoting moves the largest entry of the whole matrix to position \((1,1)\).</p>
               <p>Which unknown then comes first?</p>`,
    hints: [TeX`The largest \(|a_{ij}|\) is \(|-9|\), in row 2, column 2.`],
    answer: TeX`\(x_2\): swapping columns 1 and 2 swaps the unknowns \(x_1\) and \(x_2\).`,
    build(C) {
      drawMatrix([["1", "2", "-7"], ["4", "-9", "3"], ["5", "0", "2"]], "Search the whole matrix", { "1,1": "gold" }, false);
      cards(C, [TeX`\(x_1\)`, TeX`\(x_2\)`, TeX`\(x_3\)`]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 2 ? ["done", TeX`Right! The pivot \(-9\) is in column 2, so \(x_2\) moves to the front.`] : ["wrong", "Find the largest |entry|, and look at its column."];
    } },

  { nav: "Growth factor", title: "Wilkinson's growth factor",
    instr: TeX`<p>For Wilkinson's matrix, partial pivoting lets the largest entry double at every step: the growth factor is \(2^{n-1}\).</p><p>What is it for \(n=20\)?</p>`,
    hints: [TeX`\(2^{19}\).`],
    answer: TeX`\(2^{19}=524\,288\).`,
    build(C) {
      P.setView(1, 60, 1, 1e18, { ylog: true, xlabel: "n", xticks: [10, 20, 30, 40, 50, 60] });
      P.fn(n => 2 ** (n - 1), { color: "neg" }); P.seg(1, 1e16, 60, 1e16, { color: "muted", dash: true, width: 1.5 });
      P.tex(5, 3e16, TeX`10^{16}`, { color: "muted", align: "left" });
      setPlotTitle(TeX`Growth factor \(2^{n-1}\)`); P.draw();
      const inp = field(C, "growth =", "ans1");
      return () => parseNum(inp.value) === 524288 ? ["done", "Correct! Such matrices are very rare in practice."] : ["wrong", "Not quite. Compute 2 to the power 19."];
    } },

  { nav: "No pivoting needed", title: "Which matrix needs no pivoting?",
    instr: TeX`<p>For which matrix is Gaussian elimination without pivoting guaranteed to be safe?</p>`,
    hints: ["Look for strict diagonal dominance."],
    answer: TeX`\(\begin{bmatrix}5&1&2\\1&4&1\\2&1&6\end{bmatrix}\): each diagonal entry exceeds the sum of the others in its row.`,
    build(C) {
      drawMatrix([["5", "1", "2"], ["1", "4", "1"], ["2", "1", "6"]], "One of the candidates", { "0,0": "pos", "1,1": "pos", "2,2": "pos" }, false);
      cards(C, [TeX`\(\begin{bmatrix}0&1\\1&1\end{bmatrix}\)`, TeX`\(\begin{bmatrix}5&1&2\\1&4&1\\2&1&6\end{bmatrix}\)`, TeX`\(\begin{bmatrix}10^{-4}&1\\1&1\end{bmatrix}\)`]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 2 ? ["done", "Right! Strictly diagonally dominant: the pivots stay safely away from zero."] : ["wrong", "That matrix has a zero or tiny first pivot."];
    } },
];

startPractice({
  store: "nm-lec12-pivoting-v1", lecture: "Lecture 12", tasks: TASKS,
  finalPlot() { drawMatrix([["3", "4", "-2", "5"], ["0", "-11/3", "13/3", "17/3"], ["0", "0", "14/11", "42/11"]], TeX`With partial pivoting: \(x=1,\ y=2,\ z=3\)`, { "0,0": "gold", "1,1": "gold", "2,2": "gold" }); },
});
