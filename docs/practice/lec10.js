/* Lecture 10 — Gaussian Elimination: practice tasks. */
"use strict";

/** Draw a small matrix as a grid of labelled cells; hl = {"i,j": colour}. */
function drawMatrix(rows, title, hl = {}) {
  const n = rows.length, m = rows[0].length;
  P.setView(-0.6, m + 0.6, -0.6, n + 0.4, { xticks: [], yticks: [], noY: true });
  rows.forEach((r, i) => r.forEach((v, j) => {
    const y = n - 1 - i, c = hl[`${i},${j}`];
    if (c) P.band(j + 0.08, j + 0.92, y + 0.1, y + 0.9, { color: c, alpha: 0.25 });
    P.tex(j + 0.5, y + 0.5, v, { size: 20, color: c || "ink" });
  }));
  if (m > n) P.seg(n, -0.1, n, n + 0.1, { color: "muted", width: 1.5 });
  setPlotTitle(title); P.draw();
}

const TASKS = [
  { nav: "A multiplier", title: "Compute a multiplier",
    instr: TeX`<p>For the system \(4x+2y=8\), \(6x+5y=17\), elimination subtracts \(m_{21}\) times row 1 from row 2.</p><p>What is the multiplier \(m_{21}\)?</p>`,
    hints: [TeX`\(m_{21}=a_{21}/a_{11}\).`],
    answer: TeX`\(m_{21}=6/4=1.5\).`,
    build(C) {
      drawMatrix([["4", "2", "8"], ["6", "5", "17"]], TeX`Augmented matrix \([A\,|\,\mathbf b]\)`, { "0,0": "gold", "1,0": "pos" });
      const inp = field(C, TeX`\(m_{21}=\)`, "ans1");
      return () => near(parseNum(inp.value), 1.5, 1e-9) ? ["done", TeX`Correct! \(m_{21}=\frac{6}{4}=1.5\).`] : ["wrong", "Not quite. Divide the entry to be eliminated by the pivot."];
    } },

  { nav: "Eliminate", title: "Eliminate and solve",
    instr: TeX`<p>Carry out \(R_2\to R_2-1.5\,R_1\) on \(4x+2y=8\), \(6x+5y=17\).</p><p>Then give \(y\) and \(x\).</p>`,
    hints: [TeX`New row 2: \(0x+(5-1.5\cdot2)y=17-1.5\cdot8\), i.e.\ \(2y=5\).`, TeX`Then \(4x=8-2y\).`],
    answer: TeX`\(2y=5\Rightarrow y=2.5\), then \(4x=8-5\Rightarrow x=0.75\).`,
    build(C) {
      drawMatrix([["4", "2", "8"], ["0", "?", "?"]], TeX`After \(R_2\to R_2-1.5R_1\)`, { "1,0": "gold" });
      const y = field(C, TeX`\(y=\)`, "ans1"), x = field(C, TeX`\(x=\)`, "ans2");
      return () => {
        if (!near(parseNum(y.value), 2.5, 1e-9)) return ["wrong", "Check y: the new second row is 2y = 5."];
        if (!near(parseNum(x.value), 0.75, 1e-9)) return ["wrong", "Check x: substitute y into the first equation."];
        drawMatrix([["4", "2", "8"], ["0", "2", "5"]], TeX`Upper triangular: \(x=0.75,\ y=2.5\)`, { "1,0": "gold" });
        return ["done", TeX`Correct! \(x=0.75\), \(y=2.5\).`];
      };
    } },

  { nav: "Back substitution", title: "Back substitution",
    instr: TeX`<p>Solve the upper triangular system \(2x+y-z=1\), \(3y+2z=8\), \(4z=8\).</p><p>What is \(x\)? (4 decimals)</p>`,
    hints: [TeX`Start from the bottom: \(z=2\).`, TeX`Then \(3y=8-2z\), so \(y=\frac43\), and \(2x=1-y+z\).`],
    answer: TeX`\(z=2\), \(y=\frac43\), \(x=\frac{1-\frac43+2}{2}=\frac56\approx0.8333\).`,
    build(C) {
      drawMatrix([["2", "1", "-1", "1"], ["0", "3", "2", "8"], ["0", "0", "4", "8"]], "Solve from the bottom row up", { "2,2": "pos" });
      const inp = field(C, TeX`\(x=\)`, "ans1");
      return () => near(parseNum(inp.value), 5 / 6, 2e-4) ? ["done", TeX`Correct! \(x=\frac56\).`] : ["wrong", "Not quite. Find z, then y, then x."];
    } },

  { nav: "Geometry", title: "Make the line horizontal",
    instr: TeX`<p>The lines \(x+y=3\) and \(x-y=1\) cross at \((2,1)\). The operation \(R_2\to R_2-m\,R_1\) gives a new line through the same point.</p>
               <p>Drag \(m\). For which \(m\) is the new line horizontal (no \(x\))?</p>`,
    hints: [TeX`The new row is \((1-m)x+(-1-m)y=1-3m\).`, "The coefficient of x must vanish."],
    answer: TeX`\(m=1\): the new equation is \(-2y=-2\), the line \(y=1\).`,
    build(C) {
      let m = 0;
      const draw = () => {
        P.setView(-0.5, 4, -1, 3.5, { xlabel: "x", xticks: [0, 1, 2, 3, 4], yticks: [0, 1, 2, 3] });
        P.fn(x => 3 - x, { color: "curve" }); P.fn(x => x - 1, { color: "muted", width: 2 });
        const a = 1 - m, b = -1 - m, c = 1 - 3 * m;
        if (Math.abs(b) > 1e-9) P.fn(x => (c - a * x) / b, { color: "gold", width: 3 });
        P.pt(2, 1, { color: "pos", r: 6 });
        setPlotTitle(TeX`\(R_2-mR_1:\ (1-m)x+(-1-m)y=1-3m\)`); P.draw();
      };
      slider(C, "m", "sm", -1, 3, 0.1, 0, v => { m = v; draw(); });
      const inp = field(C, TeX`\(m=\)`, "ans1");
      return () => near(parseNum(inp.value), 1, 1e-9) ? ["done", TeX`Right! With \(m=1\) the new line is \(y=1\): \(x\) has been eliminated.`] : ["wrong", "Not quite. Choose m so that the coefficient of x is zero."];
    } },

  { nav: "Determinant", title: "The determinant from the pivots",
    instr: TeX`<p>Gaussian elimination without row swaps reduces \(A\) to an upper triangular \(U\) with pivots \(3\), \(-2\) and \(0.5\).</p><p>What is \(\det A\)?</p>`,
    hints: ["Row operations of the form R_i − m R_k do not change the determinant.", "The determinant of a triangular matrix is the product of its diagonal."],
    answer: TeX`\(\det A=3\cdot(-2)\cdot0.5=-3\).`,
    build(C) {
      drawMatrix([["3", "*", "*"], ["0", "-2", "*"], ["0", "0", "0.5"]], TeX`\(U\) with its pivots`, { "0,0": "gold", "1,1": "gold", "2,2": "gold" });
      const inp = field(C, TeX`\(\det A=\)`, "ans1");
      return () => near(parseNum(inp.value), -3, 1e-9) ? ["done", TeX`Correct! The product of the pivots is \(-3\).`] : ["wrong", "Not quite. Multiply the three pivots."];
    } },

  { nav: "Zero pivot", title: "Which system needs a row swap?",
    instr: TeX`<p>Elimination without row swaps stops if a pivot is zero. Which system needs a swap before it can start?</p>`,
    hints: ["Look at the coefficient of x in the first equation."],
    answer: TeX`\(0x+2y=4,\ 3x+y=5\): the first pivot is \(0\). Swapping the equations fixes it.`,
    build(C) {
      drawMatrix([["0", "2", "4"], ["3", "1", "5"]], "One of the candidate systems", { "0,0": "neg" });
      cards(C, [TeX`\(2x+y=3,\ 4x+5y=9\)`, TeX`\(0x+2y=4,\ 3x+y=5\)`, TeX`\(x+y=2,\ x-y=0\)`]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 2 ? ["done", "Right! The first pivot is zero; after a swap the solution x = 1, y = 2 is found."] : ["wrong", "Its first pivot is not zero. Look again."];
    } },

  { nav: "Singular", title: "No unique solution",
    instr: TeX`<p>Apply elimination to \(x+2y=3\), \(2x+4y=6\). What happens?</p>`,
    hints: [TeX`\(R_2\to R_2-2R_1\) gives \(0x+0y=0\).`],
    answer: "The second row becomes 0 = 0: the lines coincide and there are infinitely many solutions.",
    build(C) {
      P.setView(-1, 4, -1, 3, { xlabel: "x" }); P.fn(x => (3 - x) / 2, { color: "curve", width: 6 }); P.fn(x => (6 - 2 * x) / 4, { color: "gold", width: 2 });
      setPlotTitle(TeX`\(x+2y=3\) and \(2x+4y=6\)`); P.draw();
      cards(C, ["A unique solution", "No solution", "Infinitely many solutions"]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 3 ? ["done", TeX`Right! \(\det A=0\) and the two equations describe the same line.`] : ["wrong", "Do the elimination step and look at the second row."];
    } },

  { nav: "Count multipliers", title: "How many multipliers?",
    instr: TeX`<p>For a \(4\times4\) system, how many multipliers \(m_{ik}\) does forward elimination compute?</p>`,
    hints: ["Step 1 needs 3, step 2 needs 2, step 3 needs 1."],
    answer: TeX`\(3+2+1=6=\frac{n(n-1)}{2}\).`,
    build(C) {
      drawMatrix([["*", "*", "*", "*"], ["m", "*", "*", "*"], ["m", "m", "*", "*"], ["m", "m", "m", "*"]], "One multiplier for each zero below the diagonal",
        { "1,0": "pos", "2,0": "pos", "3,0": "pos", "2,1": "pos", "3,1": "pos", "3,2": "pos" });
      const inp = field(C, "multipliers =", "ans1");
      return () => parseNum(inp.value) === 6 ? ["done", TeX`Correct! \(\frac{n(n-1)}{2}=6\).`] : ["wrong", "Not quite. Count the entries below the diagonal."];
    } },

  { nav: "The algorithm", title: "Put the algorithm in order",
    instr: `<p>Put the steps of Gaussian elimination in the right order using the menus.</p>`,
    hints: ["Multipliers come before the row update, and back substitution comes last."],
    answer: "1. For k = 1, …, n−1 and each row i below k: compute m = a(ik)/a(kk)  2. Update row i: row i − m · row k, and b(i) − m · b(k)  3. Repeat for the next k  4. Solve U x = c by back substitution",
    build(C) {
      const steps = ["For k = 1, …, n−1 and each row i below k: compute m = a(ik)/a(kk)", "Update row i ← row i − m · row k and b(i) ← b(i) − m · b(k)",
                     "Move on to the next column k", "Solve U x = c by back substitution, from x(n) up to x(1)"];
      const order = [2, 0, 3, 1];
      const grid = el("div", { className: "order" }); C.append(grid);
      const sels = [0, 1, 2, 3].map(k => {
        const s = el("select", { id: `dd${k + 1}` });
        s.append(el("option", { value: "" }, "— choose —"), ...order.map(i => { const o = el("option", { value: i }); o.textContent = steps[i]; return o; }));
        grid.append(el("label", { htmlFor: `dd${k + 1}`, className: "steplabel" }, `Step ${k + 1}`), s); return s;
      });
      drawMatrix([["2", "-1", "3", "9"], ["0", "1.5", "-0.5", "1.5"], ["0", "0", "-14/3", "-14"]], "The worked example after elimination", { "2,2": "pos" });
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
  store: "nm-lec10-gauss-v1", lecture: "Lecture 10", tasks: TASKS,
  finalPlot() { drawMatrix([["2", "-1", "3", "9"], ["0", "3/2", "-1/2", "3/2"], ["0", "0", "-14/3", "-14"]], TeX`\(x=1,\ y=2,\ z=3\)`, { "0,0": "gold", "1,1": "gold", "2,2": "gold" }); },
});
