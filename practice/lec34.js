/* Lecture 34 — The Method of Undetermined Coefficients: practice tasks. */
"use strict";

/** Weights that make sum w_i g(x_i) exact for 1, x, ..., x^n on [a, b] (Gaussian elimination with pivoting). */
function ucWeights(xs, a, b) {
  const n = xs.length;
  const M = [];
  for (let k = 0; k < n; k++) M.push([...xs.map(x => x ** k), (b ** (k + 1) - a ** (k + 1)) / (k + 1)]);
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = 0; r < n; r++) if (r !== c) { const t = M[r][c] / M[c][c]; for (let j = c; j <= n; j++) M[r][j] -= t * M[c][j]; }
  }
  return M.map((row, i) => row[n] / row[i]);
}
const rule = (g, xs, ws) => xs.reduce((s, x, i) => s + ws[i] * g(x), 0);
const moment = (a, b, k) => (b ** (k + 1) - a ** (k + 1)) / (k + 1);

/** Stem plot of weights at the nodes (green positive, red negative). */
function stemPlot(xs, ws, view, title) {
  P.setView(...view.box, { xticks: view.xticks, yticks: view.yticks });
  xs.forEach((x, i) => { const col = ws[i] < -1e-12 ? "neg" : "pos"; P.seg(x, 0, x, ws[i], { color: col, width: 4 }); P.pt(x, ws[i], { color: col, r: 5 }); });
  setPlotTitle(title); P.draw();
}
/** The rule 3h/4 f(h/3) + h/4 f(h) on [0, 1] as two rectangles under g. */
function rectPlot(g, view, title) {
  P.setView(...view.box, { xticks: [0, 0.25, 0.5, 0.75, 1], yticks: view.yticks });
  for (let k = 0; k < 120; k++) { const u = k / 120, y = g(u + 1 / 240); P.band(u, u + 1 / 120, 0, y, { color: "curve", alpha: 0.12 }); }
  P.band(0, 0.75, 0, g(1 / 3), { color: "gold", alpha: 0.28 }); P.band(0.75, 1, 0, g(1), { color: "pos", alpha: 0.28 });
  P.seg(0.75, 0, 0.75, Math.max(g(1 / 3), g(1)), { color: "muted", width: 1, dash: true });
  P.fn(g, { color: "curve", width: 3 });
  P.pt(1 / 3, g(1 / 3), { color: "gold", r: 6 }); P.pt(1, g(1), { color: "pos", r: 6 }); P.pt(0, g(0), { color: "muted", r: 6, ring: true });
  setPlotTitle(title); P.draw();
}
/** Bars of the exact integral (blue) and the rule (gold) for x^k, k = 0..K. */
function ladder(xs, ws, a, b, K, title) {
  const vals = [];
  for (let k = 0; k <= K; k++) vals.push([moment(a, b, k), rule(x => x ** k, xs, ws)]);
  const top = Math.max(...vals.flat()) * 1.15;
  P.setView(-0.6, K + 0.6, 0, top, { xticks: [...Array(K + 1).keys()], xlabel: "k" });
  vals.forEach(([e, r], k) => {
    P.band(k - 0.32, k - 0.02, 0, e, { color: "curve", alpha: 0.75 });
    P.band(k + 0.02, k + 0.32, 0, r, { color: "gold", alpha: 0.75 });
  });
  setPlotTitle(title); P.draw();
}

const TASKS = [
  { nav: "Two weights", title: "A two-point rule on any nodes",
    instr: TeX`<p>Find \(\lambda_0,\lambda_1\) in \(\int_0^1 f\,dx\approx\lambda_0f(0)+\lambda_1f\big(\tfrac23\big)\) so that \(f=1\) and \(f=x\) are integrated exactly. Enter \(\lambda_0\).</p>`,
    hints: [TeX`\(f=1\): \(\lambda_0+\lambda_1=1\). \(f=x\): \(\lambda_0\cdot0+\lambda_1\cdot\frac23=\frac12\).`],
    answer: TeX`\(\lambda_1=\frac12\cdot\frac32=\frac34\), so \(\lambda_0=\frac14\): \(\int_0^1f\,dx\approx\frac14f(0)+\frac34f\big(\frac23\big)\).`,
    build(C) {
      P.setView(-0.05, 1.05, 0, 1.05, { xticks: [0, 0.5, 1], yticks: [0, 0.5, 1] });
      for (let k = 0; k < 100; k++) { const u = k / 100; P.band(u, u + 0.01, 0, u + 0.005, { color: "curve", alpha: 0.2 }); }
      P.fn(x => x, { color: "curve", width: 3 });
      P.seg(2 / 3, 0, 2 / 3, 2 / 3, { color: "gold", width: 2, dash: true }); P.pt(0, 0, { color: "gold", r: 6 }); P.pt(2 / 3, 2 / 3, { color: "gold", r: 6 });
      P.tex(2 / 3, 0.06, "x_1=2/3", { color: "gold", align: "left", dx: 8 });
      setPlotTitle(TeX`\(f(x)=x\): area \(\frac12\), sampled at \(0\) and \(\frac23\)`); P.draw();
      const inp = field(C, TeX`\(\lambda_0=\)`, "ans1");
      return () => near(parseNum(inp.value), 0.25, 1e-6) ? ["done", "Correct! The stems in the plot have heights 1/4 and 3/4."] : ["wrong", "Not quite. Solve the x-equation for λ₁ first."];
    } },

  { nav: "One row", title: "The condition for x squared",
    instr: TeX`<p>For a rule \(\sum_i\lambda_if(x_i)\) on \([a,b]\), which equation says that \(f(x)=x^2\) is integrated exactly?</p>`,
    hints: [TeX`Put \(f=x^2\) on both sides: the rule gives \(\sum_i\lambda_i x_i^2\), the integral is \(\int_a^bx^2\,dx\).`],
    answer: TeX`\(\sum_i\lambda_ix_i^2=\frac{b^3-a^3}{3}\). The matrix of these conditions is the transposed Vandermonde matrix.`,
    build(C) {
      const xs = [0.2, 0.5, 0.9];
      P.setView(-0.05, 1.05, 0, 1.05, { xticks: [0, 0.2, 0.5, 0.9, 1], yticks: [0, 0.5, 1] });
      for (let k = 0; k < 100; k++) { const u = k / 100; P.band(u, u + 0.01, 0, (u + 0.005) ** 2, { color: "curve", alpha: 0.2 }); }
      P.fn(x => x * x, { color: "curve", width: 3 });
      xs.forEach(x => { P.seg(x, 0, x, x * x, { color: "gold", width: 2 }); P.pt(x, x * x, { color: "gold", r: 5 }); });
      setPlotTitle(TeX`\(f(x)=x^2\): the area against the sampled values \(x_i^2\)`); P.draw();
      cards(C, [TeX`\(\sum_i\lambda_i x_i=\frac{b^2-a^2}{2}\)`, TeX`\(\sum_i\lambda_i x_i^2=\frac{b^3-a^3}{3}\)`, TeX`\(\sum_i\lambda_i^2 x_i=\frac{b^3-a^3}{3}\)`, TeX`\(\sum_i\lambda_i x_i^2=b^2-a^2\)`]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 2 ? ["done", "Right! The weights appear linearly: each condition is a linear equation."] : S.choice === 1 ? ["wrong", "That is the condition for f = x."] : ["wrong", "The unknown weights must appear linearly, and the right side is the integral of x²."];
    } },

  { nav: "Read the ladder", title: "Degree of precision from the bars",
    instr: TeX`<p>The bars compare \(\int_0^1x^k\,dx\) (blue) with the rule \(\frac34f\big(\frac13\big)+\frac14f(1)\) (gold) for \(k=0,1,\dots,4\). What is the degree of precision \(p\)?</p>`,
    hints: ["Find the first k where the two bars differ. The precision is one less."],
    answer: TeX`\(p=2\): the bars match for \(1,x,x^2\), and for \(x^3\) the rule gives \(\frac{5}{18}\approx0.278\) instead of \(\frac14\).`,
    build(C) {
      ladder([1 / 3, 1], [0.75, 0.25], 0, 1, 4, TeX`\(\int_0^1x^k\,dx\) (blue) and the rule (gold)`);
      const inp = field(C, TeX`\(p=\)`, "ans1");
      return () => near(parseNum(inp.value), 2, 1e-9) ? ["done", "Correct! Exact for every parabola, not for every cubic."] : ["wrong", "Not quite. Look for the first pair of bars of different height."];
    } },

  { nav: "A free degree?", title: "Test the next monomial",
    instr: TeX`<p>The rule \(\frac14f(0)+\frac34f\big(\frac23\big)\) from Task 1 was built to be exact for \(1\) and \(x\). Is it also exact for \(x^2\) on \([0,1]\)?</p>`,
    hints: [TeX`Compare \(\int_0^1x^2\,dx=\frac13\) with \(\frac14\cdot0+\frac34\cdot\frac49\).`],
    answer: TeX`Yes: \(\frac34\cdot\frac49=\frac13\). A free degree, as for Simpson's rule. For \(x^3\) it fails: \(\frac34\cdot\frac{8}{27}=\frac29\neq\frac14\), so \(p=2\).`,
    build(C) {
      ladder([0, 2 / 3], [0.25, 0.75], 0, 1, 1, TeX`\(\int_0^1x^k\,dx\) (blue) and \(\frac14f(0)+\frac34f(\frac23)\) (gold)`);
      cards(C, ["yes, exact for x²", "no, it fails for x²"]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 1 ? ["done", "Right! Always test the next monomial: the rule may beat what you imposed."] : ["wrong", "Compute 3/4 · (2/3)² and compare with 1/3."];
    } },

  { nav: "Error constant", title: "The first monomial that fails",
    instr: TeX`<p>For the same rule \(\frac14f(0)+\frac34f\big(\frac23\big)\) on \([0,1]\), compute the error constant \(C=\int_0^1x^3\,dx-\big(\frac14\cdot0^3+\frac34\big(\frac23\big)^3\big)\). (4 decimals)</p>`,
    hints: [TeX`\(\int_0^1x^3\,dx=\frac14\) and \(\frac34\cdot\frac{8}{27}=\frac29\).`],
    answer: TeX`\(C=\frac14-\frac29=\frac1{36}\approx0.0278\). With \(p=2\) the error is \(\frac{C}{3!}f'''(\eta)=\frac{1}{216}f'''(\eta)\).`,
    build(C) {
      P.setView(-0.05, 1.05, 0, 1.05, { xticks: [0, 0.5, 1], yticks: [0, 0.5, 1] });
      for (let k = 0; k < 100; k++) { const u = k / 100; P.band(u, u + 0.01, 0, (u + 0.005) ** 3, { color: "curve", alpha: 0.2 }); }
      P.fn(x => x ** 3, { color: "curve", width: 3 });
      P.pt(0, 0, { color: "gold", r: 5 }); P.pt(2 / 3, 8 / 27, { color: "gold", r: 6 });
      setPlotTitle(TeX`\(f(x)=x^3\): area \(\frac14\), rule \(\frac29\)`); P.draw();
      const inp = field(C, TeX`\(C=\)`, "ans1");
      return () => near(parseNum(inp.value), 1 / 36, 2e-4) ? ["done", "Correct! C/3! = 1/216 is the error constant of the rule."] : ["wrong", "Not quite. Subtract the rule's value 2/9 from 1/4."];
    } },

  { nav: "Use the rule", title: "Three quarters and one quarter",
    instr: TeX`<p>Approximate \(\int_0^1\frac{dx}{1+x}=\ln2\) by the rule from the lecture, \(\int_0^hf\,dx\approx\frac{3h}{4}f\big(\frac h3\big)+\frac h4f(h)\), with \(h=1\). (4 decimals)</p>`,
    hints: [TeX`\(f\big(\frac13\big)=\frac34\) and \(f(1)=\frac12\).`],
    answer: TeX`\(\frac34\cdot\frac34+\frac14\cdot\frac12=0.5625+0.125=0.6875\). The exact value is \(\ln2\approx0.693147\), so the error is \(5.6\times10^{-3}\); \(f(0)\) was never used.`,
    build(C) {
      const g = x => 1 / (1 + x);
      rectPlot(g, { box: [-0.05, 1.05, 0, 1.1], yticks: [0, 0.5, 1] }, TeX`\(\frac1{1+x}\) and the two rectangles of widths \(\frac34\) and \(\frac14\)`);
      const inp = field(C, "rule =", "ans1");
      return () => near(parseNum(inp.value), 0.6875, 1e-4) ? ["done", "Correct! Two values, error about 0.0056."] : ["wrong", "Not quite. Use f(1/3) = 3/4 and f(1) = 1/2."];
    } },

  { nav: "Move a node", title: "When is f(0) not needed?",
    instr: TeX`<p>On \([0,1]\) take the nodes \(0,\ c,\ 1\) and make the rule exact for \(1,x,x^2\). Drag \(c\) and watch the three weights. For which \(c\) is the weight at \(x=0\) exactly zero? (3 decimals)</p>`,
    hints: [TeX`At \(c=\frac12\) you get Simpson's weights \(\frac16,\frac23,\frac16\). The lecture's rule had its middle node at \(\frac h3\).`],
    answer: TeX`\(c=\frac13\approx0.333\): the weights are \(0,\frac34,\frac14\). For \(c\) below \(\frac13\) the weight at \(0\) turns negative.`,
    build(C) {
      const draw = c => {
        const ws = ucWeights([0, c, 1], 0, 1);
        stemPlot([0, c, 1], ws, { box: [-0.08, 1.08, -0.4, 1.1], xticks: [0, 0.25, 0.5, 0.75, 1], yticks: [-0.25, 0, 0.25, 0.5, 0.75, 1] },
          TeX`\(c=${c.toFixed(2)}\): weight at \(0\) is \(${(Math.abs(ws[0]) < 5e-4 ? 0 : ws[0]).toFixed(3)}\)`);
      };
      slider(C, "c", "s1", 0.2, 0.8, 0.01, 0.5, draw);
      const inp = field(C, TeX`\(c=\)`, "ans1");
      return () => near(parseNum(inp.value), 1 / 3, 3e-3) ? ["done", "Correct! With c = h/3 the rule needs only two values of f."] : ["wrong", "Not quite. Watch the left stem as you drag c."];
    } },

  { nav: "Negative weights", title: "Many equally spaced nodes",
    instr: TeX`<p>Drag \(n\) to see the weights of the rule on \(n+1\) equally spaced nodes on \([0,1]\) (closed Newton–Cotes). What is the smallest \(n\) with a negative weight?</p>`,
    hints: ["Red stems are negative. Step through n one at a time."],
    answer: TeX`\(n=8\). Then the weights swing more and more (\(n=10\): from \(-0.44\) to \(0.71\)), and \(\sum_i|\lambda_i|\) grows, which amplifies errors in the data.`,
    build(C) {
      const draw = n => {
        const xs = Array.from({ length: n + 1 }, (_, i) => i / n), ws = ucWeights(xs, 0, 1);
        const s = ws.reduce((t, w) => t + Math.abs(w), 0);
        stemPlot(xs, ws, { box: [-0.05, 1.05, -1.5, 1.6], xticks: [0, 0.5, 1], yticks: [-1, -0.5, 0, 0.5, 1, 1.5] },
          TeX`\(n=${n}\): \(\sum_i|\lambda_i|=${s.toFixed(2)}\)`);
      };
      slider(C, "n", "s1", 1, 12, 1, 4, draw);
      const inp = field(C, TeX`\(n=\)`, "ans1");
      return () => near(parseNum(inp.value), 8, 1e-9) ? ["done", "Correct! High degree on equally spaced nodes is a bad idea."] : ["wrong", "Not quite. Look for the first red stem."];
    } },

  { nav: "The algorithm", title: "Undetermined coefficients, step by step",
    instr: `<p>Put the steps of the method in the right order using the menus.</p>`,
    hints: ["The weights must be known before you can test anything. The error formula needs C and p."],
    answer: "1. Choose the nodes (shifted to a convenient interval)  2. Write one equation per monomial 1, x, …, xⁿ  3. Solve the linear system for the weights  4. Test the next monomials: the first failure gives p and C, and the error C/(p+1)! · f^(p+1)(η)",
    build(C) {
      const steps = ["Choose the nodes (shifted to a convenient interval)", "Write one equation per monomial 1, x, …, xⁿ",
        "Solve the linear system for the weights", "Test the next monomials: the first failure gives p, C and the error"];
      const order = [2, 3, 0, 1];
      const grid = el("div", { className: "order" }); C.append(grid);
      const sels = [0, 1, 2, 3].map(k => {
        const s = el("select", { id: `dd${k + 1}` });
        s.append(el("option", { value: "" }, "— choose —"), ...order.map(i => { const o = el("option", { value: i }); o.textContent = steps[i]; return o; }));
        grid.append(el("label", { htmlFor: `dd${k + 1}`, className: "steplabel" }, `Step ${k + 1}`), s); return s;
      });
      ladder([0, 0.5, 1], [1 / 6, 2 / 3, 1 / 6], 0, 1, 4, TeX`Simpson's rule on \([0,1]\): exact up to \(x^3\), fails at \(x^4\)`);
      return () => {
        const v = sels.map(s => s.value);
        if (v.includes("")) return ["wrong", "Choose an option for every step."];
        if (new Set(v).size < 4) return ["wrong", "Each option should be used exactly once."];
        const bad = v.findIndex((x, k) => +x !== k);
        return bad >= 0 ? ["wrong", `Step ${bad + 1} is not in the right place yet.`] : ["done", "Perfect order! The same steps give every rule in this lecture."];
      };
    } },
];

startPractice({
  store: "nm-lec34-undetermined-coefficients-v1", lecture: "Lecture 34", tasks: TASKS,
  finalPlot() { rectPlot(x => -1.2 * x * x + 2.4 * x + 0.4, { box: [-0.05, 1.05, 0, 1.9], yticks: [0, 0.5, 1, 1.5] }, TeX`\(\frac{3h}{4}f(\frac h3)+\frac h4f(h)\): exact for every parabola`); },
});
