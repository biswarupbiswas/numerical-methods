/* Lecture 35 — Gauss–Legendre Quadrature: practice tasks. */
"use strict";

const fx = x => 1 / (1 + x * x);
const R3 = 1 / Math.sqrt(3), R35 = Math.sqrt(3 / 5);
const GL = { 1: [[0], [2]], 2: [[-R3, R3], [1, 1]], 3: [[-R35, 0, R35], [5 / 9, 8 / 9, 5 / 9]] };
/** n-point Gauss–Legendre rule on [a, b]. */
const gaussN = (g, a, b, n) => { const [t, w] = GL[n]; return (b - a) / 2 * t.reduce((s, ti, i) => s + w[i] * g((b - a) / 2 * ti + (a + b) / 2), 0); };
const s13N = (g, a, b, n) => { const h = (b - a) / n; let s = g(a) + g(b); for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * g(a + i * h); return h / 3 * s; };
const trapN = (g, a, b, n) => { const h = (b - a) / n; let s = (g(a) + g(b)) / 2; for (let i = 1; i < n; i++) s += g(a + i * h); return h * s; };
const legendre = (n, x) => { let p0 = 1, p1 = x; if (n === 0) return 1; for (let k = 1; k < n; k++) [p0, p1] = [p1, ((2 * k + 1) * x * p1 - k * p0) / (k + 1)]; return p1; };

/** The rule as an area: bars of width (b − a)/2 · weight, side by side, at the heights f(node). */
function gaussPlot(g, a, b, t, w, view, title, curveColor = "curve") {
  P.setView(...view.box, { xticks: view.xticks, yticks: view.yticks });
  let x0 = a;
  t.forEach((ti, i) => {
    const x = (b - a) / 2 * ti + (a + b) / 2, y = g(x), wd = (b - a) / 2 * w[i];
    P.band(x0, x0 + wd, Math.min(0, y), Math.max(0, y), { color: "gold", alpha: 0.24 });
    P.seg(x0, y, x0 + wd, y, { color: "gold", width: 2 }); P.seg(x0, 0, x0, y, { color: "gold", width: 1, alpha: 0.6 }); P.seg(x0 + wd, 0, x0 + wd, y, { color: "gold", width: 1, alpha: 0.6 });
    P.seg(x, 0, x, y, { color: "gold", width: 1, dash: true });
    x0 += wd;
  });
  P.fn(g, { color: curveColor, width: 3, domain: [a, b] });
  t.forEach(ti => { const x = (b - a) / 2 * ti + (a + b) / 2; P.pt(x, g(x), { color: "gold", r: 6 }); });
  setPlotTitle(title); P.draw();
}
const SYM = { box: [-1.1, 1.1, 0, 1.15], xticks: [-1, -0.5, 0, 0.5, 1], yticks: [0, 0.5, 1] };
const EXV = { box: [-0.05, 1.05, 0, 1.15], xticks: [0, 0.5, 1], yticks: [0, 0.5, 1] };
const EXPV = { box: [-0.05, 1.05, 0, 2.9], xticks: [0, 0.5, 1], yticks: [0, 1, 2] };

const TASKS = [
  { nav: "Slide the nodes", title: "Two nodes, exact for x²",
    instr: TeX`<p>The rule \(f(-c)+f(c)\) is the area of two bars of width \(1\). Drag \(c\) until the bars have the same area as \(\int_{-1}^1x^2\,dx=\frac23\). Which value of \(c\) makes the rule exact for \(x^2\)? (4 decimals)</p>`,
    hints: [TeX`The bars have area \(c^2+c^2=2c^2\). Solve \(2c^2=\frac23\).`],
    answer: TeX`\(c^2=\frac13\), so \(c=\frac{1}{\sqrt3}\approx0.5774\). Odd functions are exact by symmetry, so the rule \(f(-\frac1{\sqrt3})+f(\frac1{\sqrt3})\) is exact for every cubic.`,
    build(C) {
      const sq = x => x * x;
      slider(C, "c", "s1", 0.1, 1, 0.01, 0.9, c => gaussPlot(sq, -1, 1, [-c, c], [1, 1], SYM,
        TeX`\(x^2\): bars \(2c^2=${(2 * c * c).toFixed(3)}\), curve \(\tfrac23\approx0.667\)`));
      const inp = field(C, "c =", "ans1");
      return () => near(parseNum(inp.value), R3, 2e-4) ? ["done", "Correct! These are the two-point Gauss nodes ±1/√3."] : ["wrong", "Not quite. Solve 2c² = 2/3 for c > 0."];
    } },

  { nav: "Map the nodes", title: "From [−1, 1] to [2, 5]",
    instr: TeX`<p>The map \(x=\frac{b-a}{2}t+\frac{a+b}{2}\) takes \([-1,1]\) to \([a,b]=[2,5]\). Where does the node \(t=\frac{1}{\sqrt3}\) go? (4 decimals)</p>`,
    hints: [TeX`Here \(\frac{b-a}{2}=1.5\) and \(\frac{a+b}{2}=3.5\).`],
    answer: TeX`\(x=1.5\cdot0.57735+3.5\approx4.3660\); the other node goes to \(2.6340\). Do not forget the factor \(\frac{b-a}{2}=1.5\) in front of the sum.`,
    build(C) {
      P.setView(1.6, 5.4, -1, 1.6, { xticks: [2, 3, 4, 5], yticks: [], noY: true });
      const T = t => 3.5 + 0.75 * t, X = t => 3.5 + 1.5 * t;
      P.seg(T(-1), 1, T(1), 1, { color: "muted", width: 2 }); P.seg(2, 0, 5, 0, { color: "muted", width: 2 });
      [-1, 0, 1].forEach(k => P.tex(T(k), 1, String(k), { dy: -16, color: "muted", size: 15 }));
      P.tex(T(1), 1, "t", { dx: 18, color: "muted" }); P.tex(5, 0, "x", { dx: 12, dy: -12, color: "muted" });
      [-1, 1].forEach(k => P.seg(T(k), 1, X(k), 0, { color: "muted", width: 1, dash: true }));
      [-R3, R3].forEach(t => { P.seg(T(t), 1, X(t), 0, { color: "gold", width: 1.5, dash: true }); P.pt(T(t), 1, { color: "gold", r: 6 }); P.pt(X(t), 0, { color: "gold", r: 6, ring: true }); });
      setPlotTitle(TeX`The two Gauss nodes of \([-1,1]\) mapped to \([2,5]\)`); P.draw();
      const inp = field(C, "x =", "ans1");
      return () => near(parseNum(inp.value), 1.5 * R3 + 3.5, 3e-5) ? ["done", "Correct! The map is a stretch by 1.5 and a shift by 3.5."] : ["wrong", "Not quite. Multiply t by (b − a)/2 = 1.5 and add (a + b)/2 = 3.5."];
    } },

  { nav: "Two points by hand", title: "The two-point rule for e to the x",
    instr: TeX`<p>Approximate \(\int_0^1e^x\,dx\) by the two-point Gauss–Legendre rule. (5 decimals)</p>`,
    hints: [TeX`The nodes map to \(x=\frac12\mp\frac{1}{2\sqrt3}\approx0.211325,\ 0.788675\), and the factor is \(\frac{b-a}{2}=\frac12\).`],
    answer: TeX`\(\frac12\big(e^{0.211325}+e^{0.788675}\big)=\frac12(1.235314+2.200479)\approx1.71790\). The exact value is \(e-1\approx1.718282\): error \(3.9\times10^{-4}\), with only two function values (the trapezoid is off by \(0.14\)).`,
    build(C) {
      gaussPlot(Math.exp, 0, 1, GL[2][0], GL[2][1], EXPV, TeX`\(\int_0^1 e^x\,dx\): two bars of width \(\tfrac12\)`);
      const inp = field(C, "G₂ =", "ans1");
      return () => near(parseNum(inp.value), gaussN(Math.exp, 0, 1, 2), 1e-5) ? ["done", "Correct! Two values, error 3.9 × 10⁻⁴."] : ["wrong", "Not quite. Map both nodes, add e^x at them, and multiply by 1/2."];
    } },

  { nav: "Exact for cubics", title: "Why is the answer exact?",
    instr: TeX`<p>Apply the two-point rule to \(\int_0^4\big(x^3-3x^2+5\big)\,dx\). The nodes are \(x=2\mp\frac{2}{\sqrt3}\) and the factor is \(2\). What does the rule give?</p>`,
    hints: [TeX`\(f(0.845299)\approx3.460399\) and \(f(3.154701)\approx6.539601\).`],
    answer: TeX`\(2\,(3.460399+6.539601)=20\), and the exact integral is \(64-64+20=20\). The two-point rule has degree of precision \(3\), so it is exact for every cubic.`,
    build(C) {
      const g = x => x ** 3 - 3 * x * x + 5;
      gaussPlot(g, 0, 4, GL[2][0], GL[2][1], { box: [-0.15, 4.15, 0, 22], xticks: [0, 1, 2, 3, 4], yticks: [0, 5, 10, 15, 20] }, TeX`\(f(x)=x^3-3x^2+5\) on \([0,4]\): two bars of width \(2\)`);
      const inp = field(C, "rule =", "ans1");
      return () => near(parseNum(inp.value), 20, 1e-4) ? ["done", "Correct! Exactly 20: two points are exact for cubics."] : ["wrong", "Not quite. Add the two values and multiply by (b − a)/2 = 2."];
    } },

  { nav: "Three points by hand", title: "The three-point rule",
    instr: TeX`<p>Apply the three-point rule \(\frac{b-a}{2}\big(\frac59f(x_0)+\frac89f(x_1)+\frac59f(x_2)\big)\) to \(\int_2^4\frac{dx}{1+x^2}\). (5 decimals)</p>`,
    hints: [TeX`The factor is \(1\) and the nodes are \(3\mp\sqrt{3/5}\approx2.225403,\ 3.774597\) and \(3\). Values: \(0.167999,\ 0.1,\ 0.065584\).`],
    answer: TeX`\(\frac59(0.167999+0.065584)+\frac89\cdot0.1\approx0.21866\). The exact value is \(\arctan4-\arctan2\approx0.218669\): error \(1.2\times10^{-5}\).`,
    build(C) {
      gaussPlot(fx, 2, 4, GL[3][0], GL[3][1], { box: [1.9, 4.1, 0, 0.22], xticks: [2, 2.5, 3, 3.5, 4], yticks: [0, 0.1, 0.2] }, TeX`\(\int_2^4\frac{dx}{1+x^2}\): bar widths \(\tfrac59,\ \tfrac89,\ \tfrac59\)`);
      const inp = field(C, "G₃ =", "ans1");
      return () => near(parseNum(inp.value), gaussN(fx, 2, 4, 3), 1e-5) ? ["done", "Correct! Three values, five correct digits."] : ["wrong", "Not quite. Weights 5/9, 8/9, 5/9; the factor (b − a)/2 is 1 here."];
    } },

  { nav: "Legendre roots", title: "Nodes from a Legendre polynomial",
    instr: TeX`<p>Drag \(n\) to see \(P_n\) on \([-1,1]\); its roots (gold) are the \(n\)-point Gauss nodes. What is the positive root of \(P_3(x)=\frac12\big(5x^3-3x\big)\)? (4 decimals)</p>`,
    hints: [TeX`\(P_3(x)=\frac x2\big(5x^2-3\big)\): one root is \(0\), the others solve \(5x^2=3\).`],
    answer: TeX`\(x=\sqrt{3/5}\approx0.7746\). The three-point nodes are \(0,\ \pm0.7746\).`,
    build(C) {
      const draw = n => {
        P.setView(-1.1, 1.1, -1.15, 1.15, { xticks: [-1, -0.5, 0, 0.5, 1], yticks: [-1, 0, 1] });
        P.fn(x => legendre(n, x), { color: "curve", width: 3, domain: [-1, 1] });
        const roots = []; for (let i = 0; i < 4000; i++) { const a = -1 + 2 * i / 4000, b = a + 2 / 4000; if (legendre(n, a) * legendre(n, b) <= 0 && legendre(n, a) !== 0) roots.push((a + b) / 2); }
        roots.forEach(r => P.pt(r, 0, { color: "gold", r: 6 }));
        setPlotTitle(TeX`\(P_{${n}}\) and its ${n} roots`); P.draw();
      };
      slider(C, "n", "s1", 1, 5, 1, 2, v => draw(v));
      const inp = field(C, "positive root of P₃ =", "ans1");
      return () => near(parseNum(inp.value), R35, 1e-4) ? ["done", "Correct! √(3/5) ≈ 0.7746."] : ["wrong", "Not quite. Factor out x and solve 5x² − 3 = 0."];
    } },

  { nav: "Gauss vs Simpson", title: "Three values each",
    instr: TeX`<p>The plot shows the errors for \(\int_0^1e^x\,dx\) against the number of function values. With three values, Simpson's rule has error \(5.8\times10^{-4}\) and the three-point Gauss rule \(8.2\times10^{-7}\). How many times smaller is the Gauss error?</p>`,
    hints: ["Divide the two errors. Read the points above 3 on the plot."],
    answer: TeX`About \(700\): \(\frac{5.8\times10^{-4}}{8.2\times10^{-7}}\approx703\). Each extra Gauss point gains about three digits for a smooth integrand.`,
    build(C) {
      const J = Math.E - 1;
      P.setView(0.5, 9.5, 1e-14, 1, { xticks: [1, 2, 3, 4, 5, 6, 7, 8, 9], ylog: true, xlabel: "\\text{values}" });
      const line = (pts, col) => pts.forEach(([m, e], k) => { P.pt(m, e, { color: col, r: 5 }); if (k) P.seg(pts[k - 1][0], pts[k - 1][1], m, e, { color: col, width: 2 }); });
      const gl5 = [1, 2, 3].map(m => [m, Math.abs(J - gaussN(Math.exp, 0, 1, m))]).concat([[4, 9.33e-10], [5, 6.54e-13]]);
      line([2, 3, 4, 5, 6, 7, 8, 9].map(m => [m, Math.abs(J - trapN(Math.exp, 0, 1, m - 1))]), "neg");
      line([3, 5, 7, 9].map(m => [m, Math.abs(J - s13N(Math.exp, 0, 1, m - 1))]), "pos");
      line(gl5, "gold");
      setPlotTitle(TeX`\(|\text{error}|\): trapezoid (red), Simpson (green), Gauss (gold)`); P.draw();
      cards(C, ["about 7", "about 70", "about 700", "about 7000"]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 3 ? ["done", "Right! The same three values, about 700 times more accurate."] : ["wrong", "Divide 5.8 × 10⁻⁴ by 8.2 × 10⁻⁷."];
    } },

  { nav: "Spot the failure", title: "When not to use Gauss",
    instr: `<p>For which of these integrals is a Gauss–Legendre rule <b>not</b> a sensible choice?</p>`,
    hints: ["A Gauss rule needs f at its own nodes, which are irrational numbers."],
    answer: TeX`The tabulated data: the Gauss nodes (for example \(0.2113\) and \(0.7887\) on \([0,1]\)) are not on the grid, so the values are not available. Use the trapezoidal or Simpson's rule on the table instead.`,
    build(C) {
      P.setView(-0.05, 1.05, 0, 1.15, { xticks: [0, 0.5, 1], yticks: [0, 0.5, 1] });
      P.fn(fx, { color: "curve", width: 2, alpha: 0.4 });
      for (let i = 0; i <= 10; i++) P.pt(i / 10, fx(i / 10), { color: "ink", r: 4 });
      [0.5 - R3 / 2, 0.5 + R3 / 2].forEach(x => { P.seg(x, 0, x, fx(x), { color: "gold", width: 1.5, dash: true }); P.pt(x, fx(x), { color: "gold", r: 6, ring: true }); });
      setPlotTitle(TeX`A table at \(x=0,0.1,\dots,1\) (dots) and the two Gauss nodes (gold rings)`); P.draw();
      cards(C, [TeX`\(\int_0^3e^x\,dx\)`, TeX`\(\int_0^1 f\,dx\) with \(f\) known only at \(x=0,0.1,\dots,1\)`, TeX`\(\int_0^1\frac{dx}{1+x^2}\)`, TeX`\(\int_0^{\pi}\sin x\,dx\)`]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 2 ? ["done", "Right! Gauss nodes are irrational, so they miss every grid point."] : ["wrong", "That integrand is smooth and can be evaluated anywhere: Gauss works very well."];
    } },

  { nav: "The algorithm", title: "The Gauss–Legendre rule on [a, b]",
    instr: `<p>Put the steps of the n-point Gauss–Legendre rule on [a, b] in the right order using the menus.</p>`,
    hints: ["The nodes and weights live on [−1, 1]; the factor (b − a)/2 comes at the very end."],
    answer: "1. Look up the nodes tᵢ and weights λᵢ for n points on [−1, 1]  2. Map each node: xᵢ = (b − a)/2 · tᵢ + (a + b)/2  3. Add up λᵢ f(xᵢ)  4. Multiply the sum by (b − a)/2 and return it",
    build(C) {
      const steps = ["Look up the nodes tᵢ and weights λᵢ for n points on [−1, 1]", "Map each node: xᵢ = (b − a)/2 · tᵢ + (a + b)/2", "Add up λᵢ f(xᵢ)", "Multiply the sum by (b − a)/2 and return it"];
      const order = [2, 3, 0, 1];
      const grid = el("div", { className: "order" }); C.append(grid);
      const sels = [0, 1, 2, 3].map(k => {
        const s = el("select", { id: `dd${k + 1}` });
        s.append(el("option", { value: "" }, "— choose —"), ...order.map(i => { const o = el("option", { value: i }); o.textContent = steps[i]; return o; }));
        grid.append(el("label", { htmlFor: `dd${k + 1}`, className: "steplabel" }, `Step ${k + 1}`), s); return s;
      });
      gaussPlot(fx, 0, 1, GL[3][0], GL[3][1], EXV, TeX`Three points on \(\int_0^1\frac{dx}{1+x^2}\)`);
      return () => {
        const v = sels.map(s => s.value);
        if (v.includes("")) return ["wrong", "Choose an option for every step."];
        if (new Set(v).size < 4) return ["wrong", "Each option should be used exactly once."];
        const bad = v.findIndex((x, k) => +x !== k);
        return bad >= 0 ? ["wrong", `Step ${bad + 1} is not in the right place yet.`] : ["done", "Perfect order! n function values, precision 2n − 1."];
      };
    } },
];

startPractice({
  store: "nm-lec35-gauss-legendre-v1", lecture: "Lecture 35", tasks: TASKS,
  finalPlot() { gaussPlot(fx, 0, 1, GL[3][0], GL[3][1], EXV, TeX`Three points on \(\frac\pi4\): \(0.785267\), error \(1.3\times10^{-4}\)`); },
});
