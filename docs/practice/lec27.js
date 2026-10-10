/* Lecture 27 — Newton Divided Differences: practice tasks. */
"use strict";

const XS = [1, 3, 4, 5], YS = [2, 5, 6, 8];
const C3 = [2, 3 / 2, -1 / 6, 1 / 6];                 // top diagonal of the table
const X5 = [1, 3, 4, 5, 6], C4 = [2, 3 / 2, -1 / 6, 1 / 6, -1 / 6];   // after adding (6, 7)

/** Newton form with coefficients c and nodes xs. */
function newton(c, xs, x) { let s = 0, p = 1; c.forEach((ck, k) => { s += ck * p; p *= x - xs[k]; }); return s; }
/** Nested (Horner-like) evaluation, from the last coefficient inwards. */
function nested(c, xs, x) { let v = c[c.length - 1]; for (let k = c.length - 2; k >= 0; k--) v = c[k] + (x - xs[k]) * v; return v; }

/** The data and, optionally, Newton polynomials [{c, xs, color}] on a common view. */
function dataPlot(curves, title, extra = []) {
  P.setView(0, 7, -1, 11, { xticks: [1, 2, 3, 4, 5, 6], yticks: [0, 2, 4, 6, 8, 10] });
  curves.forEach(k => P.fn(x => newton(k.c, k.xs, x), { color: k.color || "curve", width: k.width || 3, alpha: k.alpha ?? 1 }));
  XS.forEach((x, i) => P.pt(x, YS[i], { color: "gold", r: 6 }));
  extra.forEach(([x, y, col]) => P.pt(x, y, { color: col, r: 7 }));
  setPlotTitle(title); P.draw();
}

/** A divided-difference table drawn on the canvas. cells[j][i] are labels ("" = empty, "?" = to find). */
function ddTable(xlabels, cells, title, opts = {}) {
  const n = xlabels.length, h = n > 4 ? 0.95 : 1.15, top = 8.7;
  const cx = [0.7, 2.2, 4.1, 6.0, 7.9, 9.6].map(v => n > 4 ? v * 0.95 : v);
  P.setView(0, 10.4, 0, 10, { xticks: [], yticks: [], noY: true });
  ["x_i", "f[x_i]", "\\text{1st}", "\\text{2nd}", "\\text{3rd}", "\\text{4th}"].slice(0, n + 1)
    .forEach((s, k) => P.tex(cx[k], 9.6, s, { color: "muted", size: 15 }));
  const pos = (i, j) => [cx[j + 1], top - (2 * i + j) * h];
  xlabels.forEach((x, i) => P.tex(cx[0], top - 2 * i * h, x, { color: "muted", size: 17 }));
  cells.forEach((col, j) => col.forEach((s, i) => {
    if (!s) return;
    const [x, y] = pos(i, j);
    if (j > 0) [[i, j - 1], [i + 1, j - 1]].forEach(([a, b]) => {
      const [px, py] = pos(a, b);
      P.seg(px + 0.45, py, x - 0.55, y, { color: "line", width: 1.5 });
    });
    const key = `${i},${j}`;
    const col_ = (opts.colors && opts.colors[key]) || (s === "?" ? "gold" : "ink");
    P.tex(x, y, s, { color: col_, size: 17, bold: s === "?" });
  }));
  setPlotTitle(title); P.draw();
}

const FULL = [["2", "5", "6", "8"], ["3/2", "1", "2"], ["-1/6", "1/2"], ["1/6"]];

const TASKS = [
  { nav: "First DD", title: "The first divided difference",
    instr: TeX`<p>For the points \((1,2)\) and \((3,5)\), compute \(f[x_0,x_1]=\dfrac{f(x_1)-f(x_0)}{x_1-x_0}\).</p>`,
    hints: [TeX`\(\dfrac{5-2}{3-1}\). It is the slope of the line through the two points.`],
    answer: TeX`\(f[x_0,x_1]=\dfrac{3}{2}=1.5\).`,
    build(C) {
      P.setView(0, 7, -1, 11, { xticks: [1, 2, 3, 4, 5, 6], yticks: [0, 2, 4, 6, 8, 10] });
      P.fn(x => 2 + 1.5 * (x - 1), { color: "curve", width: 3 });
      P.seg(1, 2, 3, 2, { color: "muted", dash: true }); P.seg(3, 2, 3, 5, { color: "muted", dash: true });
      P.pt(1, 2, { color: "gold", r: 7 }); P.pt(3, 5, { color: "gold", r: 7 });
      setPlotTitle(TeX`The line through \((1,2)\) and \((3,5)\)`); P.draw();
      const inp = field(C, TeX`\(f[x_0,x_1]=\)`, "ans1", "e.g. 3/2");
      return () => near(parseNum(inp.value), 1.5, 1e-9) ? ["done", "Correct! A first divided difference is a secant slope."] : ["wrong", "Not quite. Difference of values divided by difference of nodes."];
    } },

  { nav: "Second DD", title: "A second divided difference",
    instr: TeX`<p>With nodes \(x_0=1,\ x_1=3,\ x_2=4\) we have \(f[x_0,x_1]=\tfrac32\) and \(f[x_1,x_2]=1\). Compute \(f[x_0,x_1,x_2]\). Fractions such as <code>-1/6</code> are accepted.</p>`,
    hints: [TeX`Subtract the upper parent from the lower one and divide by the spread \(x_2-x_0\).`, TeX`\(\dfrac{1-\frac32}{4-1}\).`],
    answer: TeX`\(f[x_0,x_1,x_2]=\dfrac{1-\frac32}{4-1}=-\dfrac16\).`,
    build(C) {
      ddTable(["1", "3", "4", "5"], [["2", "5", "6", "8"], ["3/2", "1", ""], ["?", ""], [""]], TeX`Fill the gold entry`);
      const inp = field(C, TeX`\(f[x_0,x_1,x_2]=\)`, "ans1", "e.g. -1/6");
      return () => near(parseNum(inp.value), -1 / 6, 1e-6) ? ["done", "Correct! Note the denominator is x₂ − x₀ = 3, not 1."] : ["wrong", "Not quite. Check the denominator: it spans all three nodes."];
    } },

  { nav: "Finish the table", title: "The last entry",
    instr: TeX`<p>The second column of the table is \(-\tfrac16\) and \(\tfrac12\). Compute the third divided difference \(f[x_0,x_1,x_2,x_3]\) with \(x_0=1\), \(x_3=5\).</p>`,
    hints: [TeX`\(\dfrac{\frac12-\left(-\frac16\right)}{5-1}\).`],
    answer: TeX`\(\dfrac{\frac12+\frac16}{4}=\dfrac{2/3}{4}=\dfrac16\).`,
    build(C) {
      ddTable(["1", "3", "4", "5"], [["2", "5", "6", "8"], ["3/2", "1", "2"], ["-1/6", "1/2"], ["?"]], TeX`The table for \((1,2),(3,5),(4,6),(5,8)\)`);
      const inp = field(C, TeX`\(f[x_0,x_1,x_2,x_3]=\)`, "ans1", "e.g. 1/6");
      return () => near(parseNum(inp.value), 1 / 6, 1e-6) ? ["done", "Correct! The table is complete."] : ["wrong", "Not quite. Lower parent minus upper parent, over x₃ − x₀."];
    } },

  { nav: "Read the coefficients", title: "Where are the coefficients?",
    instr: TeX`<p>Newton's form is \(P_3(x)=c_0+c_1(x-1)+c_2(x-1)(x-3)+c_3(x-1)(x-3)(x-4)\). What is \(c_2\)?</p>`,
    hints: ["The coefficients sit along the top edge of the table."],
    answer: TeX`\(c_2=f[x_0,x_1,x_2]=-\tfrac16\): the top entry of the second-DD column.`,
    build(C) {
      ddTable(["1", "3", "4", "5"], FULL, TeX`Coefficients: the top diagonal`, { colors: { "0,0": "gold", "0,1": "gold", "0,2": "gold", "0,3": "gold" } });
      cards(C, [TeX`\(c_2=-\tfrac16\)`, TeX`\(c_2=\tfrac12\)`, TeX`\(c_2=1\)`]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 1 ? ["done", "Right! c₀ = 2, c₁ = 3/2, c₂ = −1/6, c₃ = 1/6."] : ["wrong", "That entry is not on the top diagonal. Use f[x₀, x₁, x₂]."];
    } },

  { nav: "Grow the curve", title: "Add terms one by one",
    instr: TeX`<p>Move the slider to add terms of Newton's form. Each \(P_k\) passes through the first \(k+1\) points. What is \(P_2(2)\)? (3 decimals)</p>`,
    hints: [TeX`\(P_2(2)=2+\tfrac32(2-1)-\tfrac16(2-1)(2-3)\).`],
    answer: TeX`\(P_2(2)=2+\tfrac32+\tfrac16=\tfrac{11}{3}\approx3.667\).`,
    build(C) {
      const cols = ["muted", "neg", "pos", "curve"];
      const draw = k => {
        const curves = [];
        for (let m = 0; m <= k; m++) curves.push({ c: C3.slice(0, m + 1), xs: XS, color: cols[m], alpha: m === k ? 1 : 0.3 });
        const v = newton(C3.slice(0, k + 1), XS, 2);
        P.setView(0, 7, -1, 11, { xticks: [1, 2, 3, 4, 5, 6], yticks: [0, 2, 4, 6, 8, 10] });
        curves.forEach(q => P.fn(x => newton(q.c, q.xs, x), { color: q.color, width: 3, alpha: q.alpha }));
        P.seg(2, -1, 2, 11, { color: "muted", dash: true, width: 1.5 });
        XS.forEach((x, i) => P.pt(x, YS[i], { color: "gold", r: 6 }));
        P.pt(2, v, { color: cols[k], r: 7 });
        setPlotTitle(TeX`\(P_${k}(2)=${num(v, 4)}\)`); P.draw();
      };
      slider(C, "k", "s1", 0, 3, 1, 0, v => draw(Math.round(v)));
      const inp = field(C, TeX`\(P_2(2)=\)`, "ans1");
      return () => near(parseNum(inp.value), 11 / 3, 1e-3) ? ["done", "Correct! The estimates climb 2, 3.5, 3.667, 4 as terms are added."] : ["wrong", "Not quite. Use the first three terms only."];
    } },

  { nav: "Nested evaluation", title: "Evaluate from the inside out",
    instr: TeX`<p>In nested form \(P_3(x)=2+(x-1)\Big[\tfrac32+(x-3)\big[-\tfrac16+(x-4)\cdot\tfrac16\big]\Big]\). Evaluate \(P_3(6)\), starting with the innermost bracket.</p>`,
    hints: [TeX`Innermost: \(-\tfrac16+2\cdot\tfrac16=\tfrac16\).`, TeX`Middle: \(\tfrac32+3\cdot\tfrac16=2\). Outer: \(2+5\cdot2\).`],
    answer: TeX`\(\tfrac16\), then \(2\), then \(2+5\cdot2=12\). So \(P_3(6)=12\).`,
    build(C) {
      dataPlot([{ c: C3, xs: XS }], TeX`\(P_3\) and the point \(x=6\)`);
      P.seg(6, -1, 6, 11, { color: "muted", dash: true, width: 1.5 }); P.draw();
      const inp = field(C, TeX`\(P_3(6)=\)`, "ans1");
      return () => near(parseNum(inp.value), nested(C3, XS, 6), 1e-9) ? ["done", "Correct! Three multiplications for a cubic."] : ["wrong", "Not quite. Work from the innermost bracket outwards."];
    } },

  { nav: "A new point", title: "Add the point (6, 7)",
    instr: TeX`<p>A fifth point \((6,7)\) arrives. The new bottom diagonal gives \(f[x_1,\dots,x_4]=-\tfrac23\), and the old table has \(f[x_0,\dots,x_3]=\tfrac16\). Compute the new coefficient \(f[x_0,\dots,x_4]\) (\(x_0=1,\ x_4=6\)).</p>`,
    hints: [TeX`\(\dfrac{-\frac23-\frac16}{6-1}\).`],
    answer: TeX`\(\dfrac{-\frac56}{5}=-\dfrac16\), so \(P_4(x)=P_3(x)-\tfrac16(x-1)(x-3)(x-4)(x-5)\).`,
    build(C) {
      ddTable(["1", "3", "4", "5", "6"], [["2", "5", "6", "8", "7"], ["3/2", "1", "2", "-1"], ["-1/6", "1/2", "-3/2"], ["1/6", "-2/3"], ["?"]],
        TeX`One new diagonal`, { colors: { "4,0": "pos", "3,1": "pos", "2,2": "pos", "1,3": "pos" } });
      const inp = field(C, TeX`\(f[x_0,\dots,x_4]=\)`, "ans1", "e.g. -1/6");
      return () => {
        if (!near(parseNum(inp.value), -1 / 6, 1e-6)) return ["wrong", "Not quite. Lower parent minus upper parent, over x₄ − x₀."];
        dataPlot([{ c: C3, xs: XS, alpha: 0.35 }, { c: C4, xs: X5, color: "neg" }], TeX`\(P_3\) (faint) and \(P_4\) (red)`, [[6, 7, "neg"]]);
        return ["done", "Correct! Only one new term; P₄ still passes through the four old points, and P₄(2) = 5."];
      };
    } },

  { nav: "Spot the error", title: "Find the wrong entry",
    instr: TeX`<p>A student built this table. One entry was computed wrongly, and the mistake then spread to the right. Which entry is the first mistake?</p>`,
    hints: [TeX`Check every denominator: a second divided difference spans three nodes.`],
    answer: TeX`\(f[x_1,x_2,x_3]\) should be \(\dfrac{2-1}{5-3}=\tfrac12\); the student divided by \(5-4\). That error then made \(f[x_0,\dots,x_3]=\tfrac{7}{24}\) wrong too.`,
    build(C) {
      ddTable(["1", "3", "4", "5"], [["2", "5", "6", "8"], ["3/2", "1", "2"], ["-1/6", "1"], ["7/24"]], TeX`The student's table`);
      cards(C, [TeX`\(f[x_0,x_1]=\tfrac32\)`, TeX`\(f[x_0,x_1,x_2]=-\tfrac16\)`, TeX`\(f[x_1,x_2,x_3]=1\)`, TeX`\(f[x_0,\dots,x_3]=\tfrac{7}{24}\)`]);
      return () => {
        if (!S.choice) return ["wrong", "Choose one of the options."];
        if (S.choice === 3) {
          ddTable(["1", "3", "4", "5"], [["2", "5", "6", "8"], ["3/2", "1", "2"], ["-1/6", "1"], ["7/24"]], TeX`The error and the entry it spoiled`, { colors: { "1,2": "neg", "0,3": "neg" } });
          return ["done", "Right! The denominator must be x₃ − x₁ = 2, giving 1/2; the last entry inherits the error."];
        }
        if (S.choice === 4) return ["wrong", "This one is wrong, but only because an entry to its left is wrong. Find the first mistake."];
        return ["wrong", "That entry is correct. Check the denominators in the second-DD column."];
      };
    } },

  { nav: "The algorithm", title: "Put the algorithm in order",
    instr: `<p>Put the steps of Newton's divided-difference interpolation in the right order using the menus.</p>`,
    hints: ["You need the data in the table before any division.", "Coefficients come from the finished table; evaluation comes last."],
    answer: TeX`1. Write the nodes \(x_i\) and values \(f(x_i)\) in the first two columns<br>2. Fill each new column: (lower parent − upper parent) / (spread of the nodes)<br>3. Read the coefficients \(c_k=f[x_0,\dots,x_k]\) off the top diagonal<br>4. Evaluate \(P(x)\) by nested multiplication, from \(c_n\) inwards`,
    build(C) {
      // Menu options are plain text (native <select> cannot render maths).
      const steps = ["Write the nodes x_i and values f(x_i) in the first two columns",
                     "Fill each new column: (lower parent − upper parent) / (spread of the nodes)",
                     "Read the coefficients c_k = f[x_0, …, x_k] off the top diagonal",
                     "Evaluate P(x) by nested multiplication, from c_n inwards"];
      const order = [2, 0, 3, 1];
      const grid = el("div", { className: "order" }); C.append(grid);
      const sels = [0, 1, 2, 3].map(k => {
        const s = el("select", { id: `dd${k + 1}` });
        s.append(el("option", { value: "" }, "— choose —"), ...order.map(i => { const o = el("option", { value: i }); o.textContent = steps[i]; return o; }));
        grid.append(el("label", { htmlFor: `dd${k + 1}`, className: "steplabel" }, `Step ${k + 1}`), s); return s;
      });
      ddTable(["1", "3", "4", "5"], FULL, TeX`The finished table`);
      return () => {
        const v = sels.map(s => s.value);
        if (v.includes("")) return ["wrong", "Choose an option for every step."];
        if (new Set(v).size < 4) return ["wrong", "Each option should be used exactly once."];
        const bad = v.findIndex((x, k) => +x !== k);
        if (bad >= 0) return ["wrong", `Step ${bad + 1} is not in the right place yet.`];
        dataPlot([{ c: C3, xs: XS }], TeX`\(P_3(x)\) through all four points, \(P_3(2)=4\)`, [[2, 4, "curve"]]);
        return ["done", "Perfect order! The plot shows the resulting cubic."];
      };
    } },
];

startPractice({
  store: "nm-lec27-divdiff-v1", lecture: "Lecture 27", tasks: TASKS,
  finalPlot() { dataPlot([{ c: C3, xs: XS }, { c: C4, xs: X5, color: "neg", alpha: 0.5 }], TeX`Newton's form grows one term at a time`, [[6, 7, "neg"]]); },
});
