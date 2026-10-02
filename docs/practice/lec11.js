/* Lecture 11 — Operation Count of Gaussian Elimination: practice tasks. */
"use strict";
const fwdMD = n => (2 * n ** 3 + 3 * n ** 2 - 5 * n) / 6;
const fwdAS = n => (n ** 3 - n) / 3;
const total = n => fwdMD(n) + fwdAS(n) + n * n;
const relClose = (v, t, tol = 0.03) => Number.isFinite(v) && Math.abs(v - t) <= tol * Math.abs(t);

/** An n x n grid; cells in `on` (a predicate i,j) are highlighted. */
function drawGrid(n, on, title, col = "curve") {
  P.setView(-0.3, n + 0.3, -0.3, n + 0.3, { xticks: [], yticks: [], noY: true });
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const y = n - 1 - i;
    P.band(j + 0.06, j + 0.94, y + 0.06, y + 0.94, { color: on(i, j) ? col : "muted", alpha: on(i, j) ? 0.45 : 0.08 });
  }
  setPlotTitle(title); P.draw();
}

/** Log-log plot of operation counts. */
function costPlot(extra) {
  P.setView(1, 1000, 1, 1e10, { ylog: true, xlabel: "n", xticks: [100, 250, 500, 750, 1000] });
  P.fn(n => (2 / 3) * n ** 3, { color: "curve" }); P.fn(n => n * n, { color: "pos" });
  P.tex(990, 2e8, TeX`\tfrac23n^3`, { color: "curve", align: "right" }); P.tex(990, 3e5, TeX`n^2`, { color: "pos", align: "right" });
  if (extra) extra();
  setPlotTitle("Operations against n (log scale)"); P.draw();
}

const TASKS = [
  { nav: "Work at step k", title: "The work at one step",
    instr: TeX`<p>In a \(5\times5\) system, at step \(k=2\) of forward elimination, how many entries of \(A\) are updated (one multiplication each)?</p>`,
    hints: [TeX`The block that changes has \(n-k\) rows and \(n-k\) columns.`],
    answer: TeX`\((n-k)^2=3^2=9\).`,
    build(C) {
      drawGrid(5, (i, j) => i >= 2 && j >= 2, TeX`Step \(k=2\): the shrinking square`);
      const inp = field(C, "entries =", "ans1");
      return () => parseNum(inp.value) === 9 ? ["done", TeX`Correct! \((5-2)^2=9\).`] : ["wrong", "Not quite. Count the highlighted block."];
    } },

  { nav: "Forward elimination", title: "Use the formula",
    instr: TeX`<p>Forward elimination needs \(\dfrac{2n^3+3n^2-5n}{6}\) multiplications and divisions.</p><p>How many for \(n=4\)?</p>`,
    hints: [TeX`\(2\cdot64+3\cdot16-20=156\).`],
    answer: TeX`\(\frac{156}{6}=26\).`,
    build(C) {
      drawGrid(4, (i, j) => i > j, TeX`\(n=4\)`);
      const inp = field(C, "count =", "ans1");
      return () => parseNum(inp.value) === 26 ? ["done", "Correct! 26 multiplications and divisions."] : ["wrong", "Not quite. Put n = 4 into the formula."];
    } },

  { nav: "Back substitution", title: "The cost of back substitution",
    instr: TeX`<p>Back substitution needs \(\dfrac{n^2+n}{2}\) multiplications and divisions. How many for \(n=10\)?</p>`,
    hints: [TeX`\(\frac{100+10}{2}\).`],
    answer: "55.",
    build(C) {
      drawGrid(10, (i, j) => j >= i, "Back substitution uses the upper triangle", "pos");
      const inp = field(C, "count =", "ans1");
      return () => parseNum(inp.value) === 55 ? ["done", "Correct! 55, compared with about 670 for the elimination."] : ["wrong", "Not quite. Put n = 10 into the formula."];
    } },

  { nav: "Doubling n", title: "What happens when n doubles?",
    instr: TeX`<p>The cost of elimination is about \(\frac23n^3\). By what factor does it grow when \(n\) is doubled?</p>`,
    hints: [TeX`\(\frac23(2n)^3=8\cdot\frac23n^3\).`],
    answer: "8.",
    build(C) {
      costPlot(() => { P.pt(250, (2 / 3) * 250 ** 3, { color: "gold" }); P.pt(500, (2 / 3) * 500 ** 3, { color: "gold" }); });
      const inp = field(C, "factor =", "ans1");
      return () => parseNum(inp.value) === 8 ? ["done", TeX`Correct! \(2^3=8\).`] : ["wrong", "Not quite. Replace n by 2n in n³."];
    } },

  { nav: "Predict the time", title: "Predict the running time",
    instr: TeX`<p>A computer performs \(10^9\) operations per second. About how many seconds does Gaussian elimination take for \(n=2000\)? (Use \(\frac23n^3\).)</p>`,
    hints: [TeX`\(\frac23(2000)^3\approx5.33\times10^9\).`],
    answer: TeX`About \(5.3\) seconds.`,
    build(C) {
      costPlot(() => P.pt(1000, (2 / 3) * 1e9, { color: "gold" }));
      const inp = field(C, "seconds ≈", "ans1");
      return () => relClose(parseNum(inp.value), 16 / 3, 0.05) ? ["done", TeX`Correct! About \(5.3\) s; for \(n=20\,000\) it would be over an hour.`] : ["wrong", "Not quite. Compute (2/3)·2000³ and divide by 10⁹."];
    } },

  { nav: "Cramer's rule", title: "Cramer's rule",
    instr: TeX`<p>Cramer's rule with cofactor determinants needs about \((n+1)!\) operations. How many is that for \(n=6\)?</p>`,
    hints: [TeX`\(7!=7\cdot6\cdot5\cdot4\cdot3\cdot2\cdot1\).`],
    answer: TeX`\(7!=5040\), against \(\frac23\cdot6^3=144\) for elimination.`,
    build(C) {
      P.setView(1.5, 12.5, 1, 1e10, { ylog: true, xlabel: "n", xticks: [2, 4, 6, 8, 10, 12] });
      for (let n = 2; n <= 12; n++) { let f = 1; for (let k = 2; k <= n + 1; k++) f *= k; P.pt(n, f, { color: "neg", r: 5 }); P.pt(n, (2 / 3) * n ** 3, { color: "pos", r: 5 }); }
      P.tex(12, 5e9, TeX`(n+1)!`, { color: "neg", align: "right" }); P.tex(12, 3e2, TeX`\tfrac23n^3`, { color: "pos", align: "right" });
      setPlotTitle("Cramer's rule against elimination"); P.draw();
      const inp = field(C, "operations =", "ans1");
      return () => parseNum(inp.value) === 5040 ? ["done", "Correct! The factorial overtakes n³ very quickly."] : ["wrong", "Not quite. Compute 7!."];
    } },

  { nav: "The inverse", title: "Why not use the inverse?",
    instr: TeX`<p>Computing \(A^{-1}\) costs about \(2n^3\) operations; elimination costs about \(\frac23n^3\). How many times more work is the inverse?</p>`,
    hints: [TeX`\(2\div\frac23\).`],
    answer: "3 times, and the result is also less accurate.",
    build(C) {
      P.setView(0, 3, 0, 2.6, { xticks: [], yticks: [0, 1, 2] });
      P.seg(0.8, 0, 0.8, 2 / 3, { color: "pos", width: 40, cap: "butt" }); P.seg(2.2, 0, 2.2, 2, { color: "neg", width: 40, cap: "butt" });
      P.tex(0.8, 0.9, TeX`\text{elimination}`); P.tex(2.2, 2.25, TeX`A^{-1}`);
      setPlotTitle(TeX`Cost in units of \(n^3\)`); P.draw();
      const inp = field(C, "factor =", "ans1");
      return () => parseNum(inp.value) === 3 ? ["done", "Correct! Three times the work."] : ["wrong", "Not quite. Divide 2 by 2/3."];
    } },

  { nav: "Many right-hand sides", title: "Many right-hand sides",
    instr: TeX`<p>A \(100\times100\) system must be solved for \(50\) right-hand sides. Eliminating \(A\) once costs \(\frac23n^3\), and each right-hand side then costs \(n^2\).</p><p>About how many operations in total?</p>`,
    hints: [TeX`\(\frac23\cdot10^6+50\cdot10^4\).`],
    answer: TeX`\(\approx6.7\times10^5+5\times10^5\approx1.17\times10^6\), against \(3.3\times10^7\) if elimination were repeated \(50\) times.`,
    build(C) {
      P.setView(0, 3, 0, 36, { xticks: [], yticks: [0, 10, 20, 30] });
      P.seg(0.8, 0, 0.8, 1.17, { color: "pos", width: 40, cap: "butt" }); P.seg(2.2, 0, 2.2, 33.3, { color: "neg", width: 40, cap: "butt" });
      P.tex(0.8, 3, TeX`\text{once}`); P.tex(2.2, 35, TeX`50\times`);
      setPlotTitle("Millions of operations"); P.draw();
      const inp = field(C, "operations ≈", "ans1", "e.g. 1.2e6");
      return () => relClose(parseNum(inp.value), 1166667, 0.04) ? ["done", "Correct! About 1.17 million: the reuse saves a factor of almost 30."] : ["wrong", "Not quite. Add the one elimination and the 50 cheap solves."];
    } },

  { nav: "Structure", title: "Which system is cheapest?",
    instr: TeX`<p>Which \(n\times n\) system can be solved with only \(O(n)\) operations?</p>`,
    hints: ["Count the non-zero entries."],
    answer: TeX`A tridiagonal system: elimination touches only the three central diagonals.`,
    build(C) {
      drawGrid(8, (i, j) => Math.abs(i - j) <= 1, "Non-zero pattern of a tridiagonal matrix", "gold");
      cards(C, ["A full (dense) system", "An upper triangular system", "A tridiagonal system"]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 3 ? ["done", TeX`Right! Tridiagonal: \(O(n)\). Triangular needs \(n^2\), dense \(\frac23n^3\).`] : ["wrong", "That one needs more than O(n) operations."];
    } },
];

startPractice({
  store: "nm-lec11-opcount-v1", lecture: "Lecture 11", tasks: TASKS,
  finalPlot() { costPlot(); },
});
