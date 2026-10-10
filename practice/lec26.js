/* Lecture 26 — Lagrange Interpolation: practice tasks. */
"use strict";

const XN = [1, 2, 3], YN = [2, 3, 5];
const BCOL = ["neg", "pos", "curve"];

/** Lagrange basis polynomial l_j for the given nodes, at x. */
function ell(nodes, j, x) {
  let l = 1;
  nodes.forEach((xm, m) => { if (m !== j) l *= (x - xm) / (nodes[j] - xm); });
  return l;
}
function lag(nodes, vals, x) { return vals.reduce((s, v, j) => s + v * ell(nodes, j, x), 0); }

/** The three basis polynomials for nodes 1, 2, 3 (each equals 1 at its own node). */
function basisPlot(title, opts = {}) {
  P.setView(0.4, 3.6, -0.8, 1.6, { xticks: [1, 2, 3], yticks: [-0.5, 0.5, 1] });
  P.seg(0.4, 1, 3.6, 1, { color: "muted", width: 1, dash: true });
  [0, 1, 2].forEach(j => P.fn(x => ell(XN, j, x), { color: BCOL[j], width: 3 }));
  [0, 1, 2].forEach(j => P.tex(XN[j], 1.34, `ℓ_${j}`, { size: 18, color: BCOL[j] }));
  if (opts.at !== undefined) {
    P.seg(opts.at, -0.8, opts.at, 1.6, { color: "muted", width: 1.5, dash: true });
    [0, 1, 2].forEach(j => P.pt(opts.at, ell(XN, j, opts.at), { color: BCOL[j], r: 5 }));
  }
  setPlotTitle(title); P.draw();
}

/** Scaled basis polynomials y_j l_j (faint) and their sum, the interpolant (gold). */
function sumPlot(ys, title, opts = {}) {
  P.setView(0.4, 3.6, -2.5, 7, { xticks: [1, 2, 3], yticks: [-2, 2, 4, 6] });
  [0, 1, 2].forEach(j => P.fn(x => ys[j] * ell(XN, j, x), { color: BCOL[j], width: 2, alpha: 0.5 }));
  P.fn(x => lag(XN, ys, x), { color: "gold", width: 4 });
  XN.forEach((x, j) => P.pt(x, ys[j], { color: "ink", r: 6 }));
  if (opts.at !== undefined) {
    P.seg(opts.at, -2.5, opts.at, 7, { color: "muted", width: 1.5, dash: true });
    P.pt(opts.at, lag(XN, ys, opts.at), { color: "gold", r: 7, ring: true });
  }
  setPlotTitle(title); P.draw();
}

const TASKS = [
  { nav: "A basis value", title: "Evaluate a basis polynomial",
    instr: TeX`<p>For the nodes \(1,2,3\), the first basis polynomial is \(\ell_0(x)=\dfrac{(x-2)(x-3)}{(1-2)(1-3)}\). Compute \(\ell_0(2.5)\).</p>`,
    hints: [TeX`The denominator is \((-1)(-2)=2\). The numerator at \(2.5\) is \((0.5)(-0.5)\).`],
    answer: TeX`\(\ell_0(2.5)=\dfrac{(0.5)(-0.5)}{2}=-0.125\).`,
    build(C) {
      basisPlot(TeX`\(\ell_0,\ \ell_1,\ \ell_2\) for the nodes \(1,2,3\)`, { at: 2.5 });
      const inp = field(C, TeX`\(\ell_0(2.5)=\)`, "ans1");
      return () => near(parseNum(inp.value), -0.125, 1e-6) ? ["done", "Correct! Between the other two nodes, ℓ₀ dips slightly below zero."] : ["wrong", "Not quite. Multiply (2.5 − 2)(2.5 − 3) and divide by (1 − 2)(1 − 3)."];
    } },

  { nav: "Drag the data", title: "Make the interpolant a straight line",
    instr: TeX`<p>Move \(y_0,y_1,y_2\), the data values at \(x=1,2,3\). The faint curves are \(y_j\,\ell_j(x)\); the gold curve is their sum \(L(x)\). Make \(L\) a straight line (the coefficient of \(x^2\) within \(0.02\) of zero), with \(y_0\ne y_2\).</p>`,
    hints: [TeX`For these nodes the coefficient of \(x^2\) is \(\tfrac12(y_0-2y_1+y_2)\).`, TeX`Put \(y_1\) exactly halfway between \(y_0\) and \(y_2\).`],
    answer: TeX`Any data with \(y_1=\tfrac12(y_0+y_2)\), for example \(y_0=2,\ y_1=3.5,\ y_2=5\): the three points are on a line, so the unique interpolant is that line.`,
    build(C) {
      const y = [2, 3, 5];
      const a2 = () => (y[0] - 2 * y[1] + y[2]) / 2;
      const draw = () => sumPlot(y, TeX`\(x^2\) coefficient \(=${num(a2(), 3)}\)`);
      slider(C, "y_0", "s0", 0, 6, 0.05, y[0], v => { y[0] = v; draw(); });
      slider(C, "y_1", "s1", 0, 6, 0.05, y[1], v => { y[1] = v; draw(); });
      slider(C, "y_2", "s2", 0, 6, 0.05, y[2], v => { y[2] = v; draw(); });
      draw();
      return () => Math.abs(y[0] - y[2]) < 1e-9 ? ["wrong", "Make y₀ and y₂ different, so the line is not flat."]
        : Math.abs(a2()) <= 0.02 ? ["done", "Correct! Three points on a line: the degree-2 interpolant is that line."]
          : ["wrong", `The x² coefficient is ${a2().toFixed(3)}. Move y₁ halfway between y₀ and y₂.`];
    } },

  { nav: "Evaluate L", title: "Evaluate the interpolant",
    instr: TeX`<p>At \(x=2.5\) the basis values are \(\ell_0=-0.125,\ \ell_1=0.75,\ \ell_2=0.375\). With the data \(y=2,3,5\), compute \(L(2.5)=\sum_j y_j\,\ell_j(2.5)\).</p>`,
    hints: [TeX`\(2(-0.125)+3(0.75)+5(0.375)\).`],
    answer: TeX`\(L(2.5)=-0.25+2.25+1.875=3.875\).`,
    build(C) {
      sumPlot(YN, TeX`\(L(x)=2\ell_0+3\ell_1+5\ell_2\)`, { at: 2.5 });
      const inp = field(C, TeX`\(L(2.5)=\)`, "ans1");
      return () => near(parseNum(inp.value), 3.875, 1e-6) ? ["done", "Correct! And ½(2.5² − 2.5 + 4) = 3.875 too."] : ["wrong", "Not quite. Multiply each basis value by its y value and add."];
    } },

  { nav: "Build ℓ₁", title: "Normalise the middle basis polynomial",
    instr: TeX`<p>For the nodes \(1,2,3\), the polynomial \((x-1)(x-3)\) is zero at the other two nodes. By what number must you divide it so that \(\ell_1(2)=1\)?</p>`,
    hints: [TeX`Evaluate \((x-1)(x-3)\) at the node \(x=2\).`],
    answer: TeX`\((2-1)(2-3)=-1\), so \(\ell_1(x)=-(x-1)(x-3)\).`,
    build(C) {
      P.setView(0.4, 3.6, -1.6, 1.6, { xticks: [1, 2, 3], yticks: [-1, 1] });
      P.seg(0.4, 1, 3.6, 1, { color: "muted", width: 1, dash: true });
      P.fn(x => (x - 1) * (x - 3), { color: "muted", width: 2 });
      P.fn(x => ell(XN, 1, x), { color: "pos", width: 3 });
      P.pt(2, -1, { color: "muted", r: 5 }); P.pt(2, 1, { color: "pos", r: 6 });
      P.pt(1, 0, { color: "pos", r: 6, ring: true }); P.pt(3, 0, { color: "pos", r: 6, ring: true });
      setPlotTitle(TeX`\((x-1)(x-3)\) (grey) and \(\ell_1\) (green)`); P.draw();
      const inp = field(C, "divide by", "ans1");
      return () => near(parseNum(inp.value), -1, 1e-9) ? ["done", "Correct! Dividing by −1 flips the parabola so it reaches 1 at x = 2."] : ["wrong", "Not quite. What is (2 − 1)(2 − 3)?"];
    } },

  { nav: "Partition of unity", title: "Use the partition of unity",
    instr: TeX`<p>At \(x=0.5\) (outside the nodes) you know \(\ell_0(0.5)=1.875\) and \(\ell_1(0.5)=-1.25\). Without computing the product, find \(\ell_2(0.5)\).</p>`,
    hints: [TeX`\(\ell_0(x)+\ell_1(x)+\ell_2(x)=1\) for every \(x\).`],
    answer: TeX`\(\ell_2(0.5)=1-1.875+1.25=0.375\). Check: \(\tfrac12(0.5-1)(0.5-2)=0.375\).`,
    build(C) {
      P.setView(0.4, 3.6, -1.6, 2.2, { xticks: [1, 2, 3], yticks: [-1, 1, 2] });
      P.seg(0.4, 1, 3.6, 1, { color: "gold", width: 3 });
      [0, 1, 2].forEach(j => P.fn(x => ell(XN, j, x), { color: BCOL[j], width: 3 }));
      P.seg(0.5, -1.6, 0.5, 2.2, { color: "muted", width: 1.5, dash: true });
      setPlotTitle(TeX`\(\ell_0+\ell_1+\ell_2=1\) (gold)`); P.draw();
      const inp = field(C, TeX`\(\ell_2(0.5)=\)`, "ans1");
      return () => near(parseNum(inp.value), 0.375, 1e-6) ? ["done", "Correct! The basis polynomials always add up to 1."] : ["wrong", "Not quite. The three values must add up to 1."];
    } },

  { nav: "Two points", title: "Linear interpolation",
    instr: TeX`<p>Use the Lagrange form with the two points \((1,2)\) and \((3,5)\): \(L(x)=2\,\dfrac{x-3}{1-3}+5\,\dfrac{x-1}{3-1}\). Compute \(L(2)\).</p>`,
    hints: [TeX`Both fractions equal \(\tfrac12\) at \(x=2\).`],
    answer: TeX`\(L(2)=2\cdot\tfrac12+5\cdot\tfrac12=3.5\), the midpoint value.`,
    build(C) {
      P.setView(0, 4, -0.5, 6.5, { xticks: [1, 2, 3], yticks: [1, 2, 3, 4, 5, 6] });
      P.fn(x => 2 * (x - 3) / (1 - 3), { color: "neg", width: 2, alpha: 0.5 });
      P.fn(x => 5 * (x - 1) / (3 - 1), { color: "pos", width: 2, alpha: 0.5 });
      P.fn(x => 2 + 1.5 * (x - 1), { color: "gold", width: 4 });
      P.pt(1, 2, { color: "ink", r: 6 }); P.pt(3, 5, { color: "ink", r: 6 });
      P.seg(2, -0.5, 2, 6.5, { color: "muted", width: 1.5, dash: true });
      setPlotTitle(TeX`\(y_0\ell_0\) (red) \(+\ y_1\ell_1\) (green) \(=L\) (gold)`); P.draw();
      const inp = field(C, TeX`\(L(2)=\)`, "ans1");
      return () => near(parseNum(inp.value), 3.5, 1e-6) ? ["done", "Correct! With two points the Lagrange form is ordinary linear interpolation."] : ["wrong", "Not quite. Evaluate each fraction at x = 2."];
    } },

  { nav: "Who is right?", title: "Two answers, one polynomial?",
    instr: TeX`<p>Through \((1,2),(2,3),(3,5)\), Ana solves the Vandermonde system and gets \(2-\tfrac12x+\tfrac12x^2\). Ben uses the Lagrange form and gets \(\tfrac12(x^2-x+4)\). Who is right?</p>`,
    hints: ["Expand Ben's answer. And remember the uniqueness theorem."],
    answer: TeX`Both: \(\tfrac12(x^2-x+4)=2-\tfrac12x+\tfrac12x^2\). Through \(n+1\) distinct nodes there is exactly one polynomial of degree at most \(n\).`,
    build(C) {
      sumPlot(YN, TeX`The interpolant through the three points`);
      cards(C, ["Only Ana", "Only Ben", "Both: it is the same polynomial"]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 3 ? ["done", "Right! The interpolating polynomial is unique; only its form differs."] : ["wrong", "Expand ½(x² − x + 4) and compare."];
    } },

  { nav: "Spot the failure", title: "What went wrong?",
    instr: TeX`<p>The grey curve is \(f(x)=\dfrac{1}{1+25x^2}\). The red curve interpolates it at \(11\) equally spaced nodes, and its error near the ends is about \(1.92\). What is the cause?</p>`,
    hints: ["The polynomial matches every node. Look at where it goes wrong, and at its degree."],
    answer: "High degree on equally spaced nodes: the degree-10 interpolant oscillates near the ends (the Runge phenomenon). Adding more equally spaced nodes makes it worse.",
    build(C) {
      const N = Array.from({ length: 11 }, (_, k) => -1 + k / 5), f = x => 1 / (1 + 25 * x * x), V = N.map(f);
      P.setView(-1.1, 1.1, -0.5, 2.2, { xticks: [-1, -0.5, 0, 0.5, 1], yticks: [1, 2] });
      P.fn(f, { color: "muted", width: 3 });
      P.fn(x => lag(N, V, x), { color: "neg", width: 3, domain: [-1, 1] });
      N.forEach((x, i) => P.pt(x, V[i], { color: "gold", r: 5 }));
      setPlotTitle(TeX`degree 10 through 11 equally spaced nodes`); P.draw();
      cards(C, ["Too few nodes", "High degree on equally spaced nodes", "A mistake in one data value"]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 2 ? ["done", "Right! This is the Runge phenomenon; it has its own lecture later."] : ["wrong", "Every node is matched exactly. The trouble is the wiggling between nodes near the ends."];
    } },

  { nav: "The algorithm", title: "Put the evaluation in order",
    instr: `<p>Put the steps for evaluating the Lagrange polynomial at a point \\(x_q\\) in the right order using the menus.</p>`,
    hints: ["Start the sum at zero; inside the loop over j, build ℓⱼ first, then add its contribution."],
    answer: "1. Set y_q = 0  2. For each j, set l = 1  3. Multiply l by (x_q − x_m)/(x_j − x_m) for every m ≠ j  4. Add y_j · l to y_q",
    build(C) {
      const steps = ["Set y_q = 0", "For each j, set l = 1", "Multiply l by (x_q − x_m)/(x_j − x_m) for every m ≠ j", "Add y_j · l to y_q"];
      const order = [2, 0, 3, 1];
      const grid = el("div", { className: "order" }); C.append(grid);
      const sels = [0, 1, 2, 3].map(k => {
        const s = el("select", { id: `dd${k + 1}` });
        s.append(el("option", { value: "" }, "— choose —"), ...order.map(i => { const o = el("option", { value: i }); o.textContent = steps[i]; return o; }));
        grid.append(el("label", { htmlFor: `dd${k + 1}`, className: "steplabel" }, `Step ${k + 1}`), s); return s;
      });
      basisPlot(TeX`Each \(\ell_j\) is built as a product of factors`);
      return () => {
        const v = sels.map(s => s.value);
        if (v.includes("")) return ["wrong", "Choose an option for every step."];
        if (new Set(v).size < 4) return ["wrong", "Each option should be used exactly once."];
        const bad = v.findIndex((x, k) => +x !== k);
        return bad >= 0 ? ["wrong", `Step ${bad + 1} is not in the right place yet.`] : ["done", "Perfect order! About n² operations per point, no linear system."];
      };
    } },
];

startPractice({
  store: "nm-lec26-lagrange-v1", lecture: "Lecture 26", tasks: TASKS,
  finalPlot() { sumPlot(YN, TeX`\(L(x)=\tfrac12(x^2-x+4)\) through \((1,2),(2,3),(3,5)\)`); },
});
