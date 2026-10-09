/* Lecture 24 — Least Squares: Fitting a Line: practice tasks. */
"use strict";

const XS = [1, 2, 3, 4, 5], YS = [2.3, 2.4, 3.9, 3.8, 5.6];

function lsFit(xs, ys) {
  const n = xs.length, sx = xs.reduce((a, b) => a + b, 0), sy = ys.reduce((a, b) => a + b, 0);
  const sxx = xs.reduce((a, x) => a + x * x, 0), sxy = xs.reduce((a, x, i) => a + x * ys[i], 0);
  const a1 = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  return [(sy - a1 * sx) / n, a1];
}

function sse(a0, a1, xs = XS, ys = YS) { return xs.reduce((s, x, i) => s + (ys[i] - a0 - a1 * x) ** 2, 0); }

/** Data, an optional line, and a square on every residual. */
function fitPlot(a0, a1, title, opts = {}) {
  const xs = opts.xs || XS, ys = opts.ys || YS, ymax = opts.ymax || 6.5;
  P.setView(0, 6.5, 0, ymax, { xticks: [1, 2, 3, 4, 5, 6], yticks: [...Array(Math.floor(ymax)).keys()].map(k => k + 1) });
  if (a1 !== null) {
    if (opts.squares) xs.forEach((x, i) => {
      const r = ys[i] - a0 - a1 * x, lo = Math.min(ys[i], a0 + a1 * x);
      P.band(x, x + Math.abs(r), lo, lo + Math.abs(r), { color: "neg", alpha: 0.3 });
    });
    xs.forEach((x, i) => P.seg(x, ys[i], x, a0 + a1 * x, { color: "neg", width: 2 }));
    P.fn(x => a0 + a1 * x, { color: "curve", width: 3 });
  }
  xs.forEach((x, i) => P.pt(x, ys[i], { color: "gold", r: 6 }));
  setPlotTitle(title); P.draw();
}

const TASKS = [
  { nav: "A residual", title: "Measure one gap",
    instr: TeX`<p>The least squares line is \(y=1.2+0.8x\). What is the residual \(r=y_i-(a_0+a_1x_i)\) at the data point \((4,\ 3.8)\)?</p>`,
    hints: [TeX`The line gives \(1.2+0.8\cdot4=4.4\) at \(x=4\).`],
    answer: TeX`\(r=3.8-4.4=-0.6\): the point lies below the line.`,
    build(C) {
      fitPlot(1.2, 0.8, TeX`Residuals: vertical gaps from the points to the line`);
      const inp = field(C, "r =", "ans1");
      return () => near(parseNum(inp.value), -0.6, 1e-6) ? ["done", "Correct! A negative residual means the point is below the line."] : ["wrong", "Not quite. Compute 3.8 minus the value of the line at x = 4."];
    } },

  { nav: "Drag the line", title: "Make the squares small",
    instr: TeX`<p>Move the intercept \(a_0\) and the slope \(a_1\). The red squares sit on the residuals, and \(E\) is their total area. Get \(E\) below \(0.9\).</p>`,
    hints: [TeX`Try a slope near \(0.8\), then adjust the intercept.`, TeX`The best line is \(a_0=1.2,\ a_1=0.8\) with \(E=0.86\).`],
    answer: TeX`\(a_0=1.2,\ a_1=0.8\) gives the minimum \(E=0.86\).`,
    build(C) {
      let a0 = 2.4, a1 = 0.4;
      const draw = () => fitPlot(a0, a1, TeX`\(E=${sse(a0, a1).toFixed(3)}\)`, { squares: true });
      draw();
      slider(C, "a₀", "s0", 0, 3, 0.01, a0, v => { a0 = v; draw(); });
      slider(C, "a₁", "s1", 0, 1.5, 0.005, a1, v => { a1 = v; draw(); });
      return () => sse(a0, a1) < 0.9 ? ["done", `Correct! E = ${sse(a0, a1).toFixed(3)}; the least squares minimum is 0.86.`] : ["wrong", `E = ${sse(a0, a1).toFixed(3)}. Keep going: below 0.9.`];
    } },

  { nav: "Why squares?", title: "What is wrong with the plain sum?",
    instr: TeX`<p>Why do we not simply minimise the sum of the residuals \(\sum r_i\)?</p>`,
    hints: ["Residuals can be positive or negative."],
    answer: TeX`Positive and negative residuals cancel: every line through the mean point \((\bar x,\bar y)\) gives \(\sum r_i=0\), even a terrible one.`,
    build(C) {
      fitPlot(5.6, -0.6667, TeX`A bad line through \((3,\ 3.6)\): still \(\sum r_i=0\)`);
      cards(C, ["Positive and negative residuals cancel", "The sum is always too large", "It has no derivative"]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 1 ? ["done", "Right! This line is awful, yet its residuals add up to zero."] : ["wrong", "Look at the signs of the residuals in the plot."];
    } },

  { nav: "The sums", title: "Compute a sum",
    instr: TeX`<p>For the data \((1,2.3),(2,2.4),(3,3.9),(4,3.8),(5,5.6)\), compute \(\sum x_iy_i\).</p>`,
    hints: [TeX`\(2.3+4.8+11.7+15.2+28\).`],
    answer: TeX`\(\sum x_iy_i=62\).`,
    build(C) {
      fitPlot(0, null, TeX`The five data points`);
      const inp = field(C, TeX`\(\sum x_iy_i=\)`, "ans1");
      return () => near(parseNum(inp.value), 62, 1e-6) ? ["done", "Correct! With Σx = 15, Σy = 18 and Σx² = 55 we have all four sums."] : ["wrong", "Not quite. Multiply each x by its y and add."];
    } },

  { nav: "Normal equations", title: "Solve for the slope",
    instr: TeX`<p>The normal equations are \(5a_0+15a_1=18\) and \(15a_0+55a_1=62\). Find \(a_1\).</p>`,
    hints: [TeX`Multiply the first equation by 3 and subtract it from the second: \(10a_1=8\).`],
    answer: TeX`\(a_1=0.8\), then \(a_0=(18-15\cdot0.8)/5=1.2\).`,
    build(C) {
      fitPlot(1.2, 0.8, TeX`\(y=a_0+a_1x\)`);
      const inp = field(C, TeX`\(a_1=\)`, "ans1");
      return () => near(parseNum(inp.value), 0.8, 1e-6) ? ["done", "Correct! The least squares line is y = 1.2 + 0.8x."] : ["wrong", "Not quite. Eliminate a₀ first."];
    } },

  { nav: "The mean point", title: "Where does the line pass?",
    instr: TeX`<p>The least squares line always passes through the mean point \((\bar x,\bar y)\). What is \(\bar y\) for our data?</p>`,
    hints: [TeX`\(\bar y=18/5\).`],
    answer: TeX`\(\bar y=3.6\), and indeed \(1.2+0.8\cdot3=3.6\).`,
    build(C) {
      fitPlot(1.2, 0.8, TeX`The line and the mean point`);
      P.pt(3, 3.6, { color: "neg", r: 8, ring: true }); P.draw();
      const inp = field(C, TeX`\(\bar y=\)`, "ans1");
      return () => near(parseNum(inp.value), 3.6, 1e-6) ? ["done", "Correct! This follows from the first normal equation: the residuals sum to zero."] : ["wrong", "Not quite. Average the five y values."];
    } },

  { nav: "An outlier", title: "One bad point",
    instr: TeX`<p>Drag the last data value \(y_5\) and watch the line. At \(y_5=8.6\), what is the new slope \(a_1\)?</p>`,
    hints: ["Move the slider to 8.6 and read the slope in the title."],
    answer: TeX`\(a_1=1.4\) (and \(a_0=0\)): one point nearly doubles the slope.`,
    build(C) {
      let y5 = 5.6;
      const draw = () => { const ys = [...YS.slice(0, 4), y5]; const [a0, a1] = lsFit(XS, ys); fitPlot(a0, a1, TeX`\(y=${a0.toFixed(2)}+${a1.toFixed(2)}x\)`, { ys, ymax: 9 }); };
      draw();
      slider(C, "y₅", "s5", 3, 9, 0.1, y5, v => { y5 = v; draw(); });
      const inp = field(C, TeX`\(a_1=\)`, "ans1");
      return () => near(parseNum(inp.value), 1.4, 1e-3) ? ["done", "Correct! Squares punish large errors, so one outlier pulls hard."] : ["wrong", "Not quite. Set y₅ to 8.6 and read the slope."];
    } },

  { nav: "Read the residuals", title: "Is a line the right model?",
    instr: TeX`<p>A line was fitted to new data, and these are its residuals: \(+1.1,\ -0.56,\ -1.12,\ -0.48,\ +1.06\). What do they tell you?</p>`,
    hints: ["Random residuals have no pattern. Do these?"],
    answer: "The pattern + − − − + means the data curve: a line is the wrong model, so fit a polynomial.",
    build(C) {
      const rs = [1.1, -0.56, -1.12, -0.48, 1.06];
      P.setView(0, 6, -1.5, 1.5, { xticks: [1, 2, 3, 4, 5], yticks: [-1, 0, 1] });
      rs.forEach((r, i) => { P.seg(i + 1, 0, i + 1, r, { color: r > 0 ? "pos" : "neg", width: 5 }); P.pt(i + 1, r, { color: r > 0 ? "pos" : "neg", r: 6 }); });
      setPlotTitle(TeX`Residuals of the line`); P.draw();
      cards(C, ["The line fits well", "The data curve: a line is the wrong model", "There is one outlier"]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 2 ? ["done", "Right! A pattern in the residuals means a better model exists. Next lecture: polynomials."] : ["wrong", "Look at the signs: + − − − +. Is that random?"];
    } },

  { nav: "The algorithm", title: "Put least squares in order",
    instr: `<p>Put the steps in the right order using the menus.</p>`,
    hints: ["The sums come first; looking at the residuals comes last."],
    answer: "1. Compute Σx, Σy, Σx², Σxy  2. Form the two normal equations  3. Solve for a₀ and a₁  4. Compute the residuals and E, and look at them",
    build(C) {
      const steps = ["Compute Σx, Σy, Σx², Σxy", "Form the two normal equations", "Solve for a₀ and a₁", "Compute the residuals and E, and look at them"];
      const order = [2, 0, 3, 1];
      const grid = el("div", { className: "order" }); C.append(grid);
      const sels = [0, 1, 2, 3].map(k => {
        const s = el("select", { id: `dd${k + 1}` });
        s.append(el("option", { value: "" }, "— choose —"), ...order.map(i => { const o = el("option", { value: i }); o.textContent = steps[i]; return o; }));
        grid.append(el("label", { htmlFor: `dd${k + 1}`, className: "steplabel" }, `Step ${k + 1}`), s); return s;
      });
      fitPlot(1.2, 0.8, TeX`\(y=1.2+0.8x,\ E=0.86\)`, { squares: true });
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
  store: "nm-lec24-lsline-v1", lecture: "Lecture 24", tasks: TASKS,
  finalPlot() { fitPlot(1.2, 0.8, TeX`The least squares line \(y=1.2+0.8x\)`, { squares: true }); },
});
