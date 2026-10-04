/* Lecture 18 — Jacobi and Gauss–Seidel: practice tasks. */
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

/** Iterates of 3x + y = 5, x + 2y = 5 from (0, 0). */
function iterates(k, gs) {
  const out = [[0, 0]];
  for (let i = 0; i < k; i++) {
    const [x, y] = out[out.length - 1];
    const nx = (5 - y) / 3, ny = (5 - (gs ? nx : x)) / 2;
    out.push([nx, ny]);
  }
  return out;
}

/** The two lines of the 2 × 2 example, with an optional path. */
function linesPlot(path, gs, title) {
  P.setView(-0.4, 3, -0.4, 3, { xlabel: "x", xticks: [0, 1, 2, 3], yticks: [0, 1, 2, 3] });
  P.fn(x => 5 - 3 * x, { color: "curve" });
  P.fn(x => (5 - x) / 2, { color: "gold" });
  for (let i = 1; i < path.length; i++) {
    const [a, b] = path[i - 1], [c, d] = path[i];
    if (gs) { P.seg(a, b, c, b, { color: "pos", width: 3 }); P.seg(c, b, c, d, { color: "pos", width: 3 }); }
    else P.seg(a, b, c, d, { color: "neg", width: 3 });
    P.pt(c, d, { color: gs ? "pos" : "neg", r: 4 });
  }
  P.pt(1, 2, { color: "ink", r: 6 });
  setPlotTitle(title); P.draw();
}

const TASKS = [
  { nav: "A Jacobi step", title: "One Jacobi sweep",
    instr: TeX`<p>Solve \(3x+y=5,\ x+2y=5\) by Jacobi from \((x,y)=(0,0)\):</p><p>\(x^{(1)}=\tfrac13(5-y^{(0)}),\quad y^{(1)}=\tfrac12(5-x^{(0)})\).</p><p>What is \(y^{(1)}\)?</p>`,
    hints: [TeX`Jacobi uses only the old values: \(x^{(0)}=0\).`],
    answer: TeX`\(y^{(1)}=\tfrac12(5-0)=2.5\), and \(x^{(1)}=\tfrac53\approx1.667\).`,
    build(C) {
      linesPlot([[0, 0]], false, TeX`\(3x+y=5\) and \(x+2y=5\); solution \((1,2)\)`);
      const inp = field(C, TeX`\(y^{(1)}=\)`, "ans1");
      return () => near(parseNum(inp.value), 2.5, 1e-9) ? ["done", "Correct! The first Jacobi point is (1.667, 2.5)."] : ["wrong", "Not quite. Put the old value x = 0 into the second equation."];
    } },

  { nav: "A Gauss–Seidel step", title: "One Gauss–Seidel sweep",
    instr: TeX`<p>Same system, same start \((0,0)\), but now Gauss–Seidel: first \(x^{(1)}=\tfrac13(5-0)=\tfrac53\), then</p><p>\(y^{(1)}=\tfrac12\big(5-x^{(1)}\big)\).</p><p>What is \(y^{(1)}\)? (3 decimals)</p>`,
    hints: [TeX`Use the new value \(x^{(1)}=5/3\) at once.`],
    answer: TeX`\(y^{(1)}=\tfrac12\big(5-\tfrac53\big)=\tfrac53\approx1.667\).`,
    build(C) {
      linesPlot(iterates(1, true), true, "Gauss–Seidel: the first step of the staircase");
      const inp = field(C, TeX`\(y^{(1)}=\)`, "ans1");
      return () => near(parseNum(inp.value), 5 / 3, 2e-3) ? ["done", "Correct! Gauss–Seidel lands on (1.667, 1.667), closer than Jacobi."] : ["wrong", "Not quite. Use the new x = 5/3, not the old one."];
    } },

  { nav: "Zig-zag vs staircase", title: "Watch both methods",
    instr: TeX`<p>Drag the slider to add sweeps. Red: Jacobi. Green: Gauss–Seidel.</p><p>After how many Gauss–Seidel sweeps is \(|x^{(k)}-1|\) first below \(0.01\)?</p>`,
    hints: [TeX`The Gauss–Seidel \(x\)-values are \(1.667,\ 1.111,\ 1.019,\ 1.003,\dots\)`],
    answer: TeX`\(4\) sweeps: \(|x^{(4)}-1|\approx0.003\) (after 3 sweeps it is still \(0.019\)).`,
    build(C) {
      let k = 1;
      const draw = () => {
        const J = iterates(k, false), G = iterates(k, true);
        P.setView(-0.4, 3, -0.4, 3, { xlabel: "x", xticks: [0, 1, 2, 3], yticks: [0, 1, 2, 3] });
        P.fn(x => 5 - 3 * x, { color: "curve" }); P.fn(x => (5 - x) / 2, { color: "gold" });
        for (let i = 1; i <= k; i++) {
          P.seg(...J[i - 1], ...J[i], { color: "neg", width: 2, alpha: 0.7 });
          P.seg(G[i - 1][0], G[i - 1][1], G[i][0], G[i - 1][1], { color: "pos", width: 3 });
          P.seg(G[i][0], G[i - 1][1], G[i][0], G[i][1], { color: "pos", width: 3 });
        }
        P.pt(1, 2, { color: "ink", r: 6 });
        setPlotTitle(TeX`\(k=${k}\): Gauss–Seidel \(x^{(k)}=${G[k][0].toFixed(4)}\)`); P.draw();
      };
      draw();
      slider(C, "sweeps k", "sk", 1, 8, 1, 1, v => { k = v; draw(); });
      const inp = field(C, "sweeps =", "ans1");
      return () => near(parseNum(inp.value), 4, 1e-9) ? ["done", "Correct! Each Gauss–Seidel sweep cuts the error by a factor of 6 here."] : ["wrong", "Not quite. Read the x-value in the plot title as you move the slider."];
    } },

  { nav: "The notes' example", title: "A second Jacobi sweep",
    instr: TeX`<p>For \(3x_1+x_2-x_3=7,\ 2x_1-5x_2+2x_3=-8,\ x_1+x_2+10x_3=6\), Jacobi from \(\mathbf 0\) gives \(\mathbf x^{(1)}=(2.3333,\ 1.6,\ 0.6)\).</p><p>Compute \(x_1^{(2)}=\tfrac13\big(7-x_2^{(1)}+x_3^{(1)}\big)\).</p>`,
    hints: [TeX`\(7-1.6+0.6=6\).`],
    answer: TeX`\(x_1^{(2)}=6/3=2.0000\).`,
    build(C) {
      drawMatrix([["3", "1", "-1", "7"], ["2", "-5", "2", "-8"], ["1", "1", "10", "6"]], TeX`\([A\,|\,\mathbf b]\)`, { "0,0": "gold", "1,1": "gold", "2,2": "gold" });
      const inp = field(C, TeX`\(x_1^{(2)}=\)`, "ans1");
      return () => near(parseNum(inp.value), 2, 1e-6) ? ["done", "Correct! x⁽²⁾ = (2.0000, 2.7733, 0.2067)."] : ["wrong", "Not quite. Use x₂ = 1.6 and x₃ = 0.6 from the first sweep."];
    } },

  { nav: "Diagonal dominance", title: "Which matrix is dominant?",
    instr: TeX`<p>Which matrix is <b>strictly diagonally dominant</b>, \(|a_{ii}|>\sum_{j\ne i}|a_{ij}|\) in every row?</p>`,
    hints: [TeX`Check every row, not just the first.`],
    answer: TeX`\(\begin{bmatrix}5&-2&1\\1&4&-2\\2&1&6\end{bmatrix}\): \(5>3,\ 4>3,\ 6>3\).`,
    build(C) {
      drawMatrix([["5", "-2", "1"], ["1", "4", "-2"], ["2", "1", "6"]], "Check each row", { "0,0": "pos", "1,1": "pos", "2,2": "pos" });
      cards(C, [TeX`\(\begin{bmatrix}5&-2&1\\1&4&-2\\2&1&6\end{bmatrix}\)`, TeX`\(\begin{bmatrix}4&2&1\\1&2&3\\0&1&5\end{bmatrix}\)`, TeX`\(\begin{bmatrix}1&2\\3&1\end{bmatrix}\)`]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 1 ? ["done", "Right! Then Jacobi and Gauss–Seidel are guaranteed to converge."] : ["wrong", "Look again: one row fails the test in that matrix."];
    } },

  { nav: "Spot the failure", title: "The same equations, swapped",
    instr: TeX`<p>We write the same two equations in the other order, \(x+2y=5,\ 3x+y=5\), and run Jacobi: \(x=5-2y,\ y=5-3x\).</p><p>The plot shows the iterates \((5,5),\ (-5,-10),\ (25,20),\dots\) What happens?</p>`,
    hints: [TeX`The diagonal entries \(1,\ 1\) are now smaller than the off-diagonal ones.`],
    answer: "The iteration diverges: the points move further away at every sweep.",
    build(C) {
      const pts = [[0, 0], [5, 5], [-5, -10], [25, 20]];
      P.setView(-12, 28, -14, 24, { xlabel: "x", xticks: [-10, 0, 10, 20], yticks: [-10, 0, 10, 20] });
      P.fn(x => (5 - x) / 2, { color: "gold" }); P.fn(x => 5 - 3 * x, { color: "curve" });
      for (let i = 1; i < pts.length; i++) { P.seg(...pts[i - 1], ...pts[i], { color: "neg", width: 2 }); P.pt(...pts[i], { color: "neg", r: 5 }); }
      P.pt(1, 2, { color: "ink", r: 6 });
      setPlotTitle("Jacobi on the swapped system"); P.draw();
      cards(C, ["It converges to (1, 2)", "It diverges", "It converges to a different point"]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 2 ? ["done", "Right! Without diagonal dominance the error grows (ρ ≈ 2.45 here). Reordering fixes it."] : ["wrong", "Look at how far each point is from (1, 2)."];
    } },

  { nav: "Cost", title: "How many sweeps for one elimination?",
    instr: TeX`<p>For a dense \(1000\times1000\) system, one sweep costs about \(n^2=10^6\) operations and Gaussian elimination about \(\tfrac23n^3\).</p><p>How many sweeps cost as much as one elimination?</p>`,
    hints: [TeX`\(\tfrac23n^3/n^2=\tfrac23n\).`],
    answer: TeX`\(\tfrac23\cdot1000\approx667\) sweeps.`,
    build(C) {
      P.setView(0, 3, 0, 7.5, { xticks: [], yticks: [0, 2, 4, 6] });
      P.seg(0.9, 0, 0.9, 0.01, { color: "pos", width: 40, cap: "butt" }); P.seg(2.1, 0, 2.1, 6.67, { color: "neg", width: 40, cap: "butt", alpha: 0.5 });
      P.tex(0.9, 0.5, TeX`\text{one sweep}`); P.tex(2.1, 7.1, TeX`\text{elimination}`);
      setPlotTitle(TeX`operations, in units of \(10^8\)`); P.draw();
      const inp = field(C, "sweeps ≈", "ans1");
      return () => Math.abs(parseNum(inp.value) - 666.67) <= 5 ? ["done", "Correct! And for sparse matrices a sweep is far cheaper still."] : ["wrong", "Not quite. Divide (2/3)n³ by n²."];
    } },

  { nav: "When to stop", title: "The size of a change",
    instr: TeX`<p>Two Gauss–Seidel iterates are \(\mathbf x^{(2)}=(1.1111,\ 1.9444)\) and \(\mathbf x^{(3)}=(1.0185,\ 1.9907)\).</p><p>Compute \(\lVert\mathbf x^{(3)}-\mathbf x^{(2)}\rVert_\infty\), the quantity a stopping test compares with the tolerance.</p>`,
    hints: [TeX`The largest of \(|1.0185-1.1111|\) and \(|1.9907-1.9444|\).`],
    answer: TeX`\(\max(0.0926,\ 0.0463)=0.0926\).`,
    build(C) {
      linesPlot(iterates(3, true), true, "Gauss–Seidel: three sweeps");
      const inp = field(C, "change =", "ans1");
      return () => near(parseNum(inp.value), 0.0926, 1e-3) ? ["done", "Correct! Stop when this change is below the tolerance."] : ["wrong", "Not quite. Take the largest absolute difference of the components."];
    } },

  { nav: "The algorithm", title: "Put Gauss–Seidel in order",
    instr: `<p>Put the steps of one Gauss–Seidel sweep, and the test after it, in the right order using the menus.</p>`,
    hints: ["Keep a copy of the old vector first, so you can measure the change at the end."],
    answer: "1. Save the old vector  2. For i = 1..n: add up a(ij)·x(j) for j ≠ i  3. Overwrite x(i) = (b(i) − sum) / a(ii) at once  4. Stop if the change is below the tolerance",
    build(C) {
      const steps = ["Save the old vector", "For i = 1..n: add up a(ij)·x(j) for j ≠ i",
                     "Overwrite x(i) = (b(i) − sum) / a(ii) at once", "Stop if the change is below the tolerance"];
      const order = [2, 0, 3, 1];
      const grid = el("div", { className: "order" }); C.append(grid);
      const sels = [0, 1, 2, 3].map(k => {
        const s = el("select", { id: `dd${k + 1}` });
        s.append(el("option", { value: "" }, "— choose —"), ...order.map(i => { const o = el("option", { value: i }); o.textContent = steps[i]; return o; }));
        grid.append(el("label", { htmlFor: `dd${k + 1}`, className: "steplabel" }, `Step ${k + 1}`), s); return s;
      });
      linesPlot(iterates(4, true), true, "Gauss–Seidel climbs a staircase");
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
  store: "nm-lec18-jacobi-gs-v1", lecture: "Lecture 18", tasks: TASKS,
  finalPlot() {
    P.setView(-0.4, 3, -0.4, 3, { xlabel: "x", xticks: [0, 1, 2, 3], yticks: [0, 1, 2, 3] });
    P.fn(x => 5 - 3 * x, { color: "curve" }); P.fn(x => (5 - x) / 2, { color: "gold" });
    const J = iterates(6, false), G = iterates(6, true);
    for (let i = 1; i < 7; i++) {
      P.seg(...J[i - 1], ...J[i], { color: "neg", width: 2, alpha: 0.7 });
      P.seg(G[i - 1][0], G[i - 1][1], G[i][0], G[i - 1][1], { color: "pos", width: 3 });
      P.seg(G[i][0], G[i - 1][1], G[i][0], G[i][1], { color: "pos", width: 3 });
    }
    P.pt(1, 2, { color: "ink", r: 6 });
    setPlotTitle("Jacobi zig-zags, Gauss–Seidel climbs a staircase"); P.draw();
  },
});
