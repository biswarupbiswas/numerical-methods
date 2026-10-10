/* Lecture 25 — Least Squares: Polynomial Fit: practice tasks. */
"use strict";

const XS = [-2, -1, 0, 1, 2], YS = [3.1, 1.3, 1.6, 1.5, 5.5];
const BEST = [1, 0.5, 0.8];

function pval(a, x) { return a.reduce((s, c, k) => s + c * x ** k, 0); }
function sse(a) { return XS.reduce((s, x, i) => s + (YS[i] - pval(a, x)) ** 2, 0); }

/** Data, an optional polynomial with residuals, and an optional title. */
function polyPlot(a, title, opts = {}) {
  P.setView(-3, 3, -0.5, 7, { xticks: [-2, -1, 0, 1, 2], yticks: [1, 2, 3, 4, 5, 6] });
  if (a) {
    XS.forEach((x, i) => P.seg(x, YS[i], x, pval(a, x), { color: "neg", width: 2.5 }));
    P.fn(x => pval(a, x), { color: "curve", width: 3 });
  }
  XS.forEach((x, i) => P.pt(x, YS[i], { color: "gold", r: 6 }));
  setPlotTitle(title); P.draw();
}

const TASKS = [
  { nav: "A power sum", title: "Compute a power sum",
    instr: TeX`<p>The nodes are \(x=-2,-1,0,1,2\). Compute \(\sum x_i^4\), which appears in the normal equations of a quadratic.</p>`,
    hints: [TeX`\(16+1+0+1+16\).`],
    answer: TeX`\(\sum x_i^4=34\).`,
    build(C) {
      polyPlot(null, TeX`The five data points`);
      const inp = field(C, TeX`\(\sum x_i^4=\)`, "ans1");
      return () => near(parseNum(inp.value), 34, 1e-9) ? ["done", "Correct! Together with Σ1 = 5 and Σx² = 10 it fills the matrix."] : ["wrong", "Not quite. Raise each node to the fourth power and add."];
    } },

  { nav: "Fit by hand", title: "Fit the parabola yourself",
    instr: TeX`<p>Move \(a_0,a_1,a_2\) to fit \(P_2(x)=a_0+a_1x+a_2x^2\). The red lines are the residuals. Get \(E\) below \(1.2\).</p>`,
    hints: [TeX`Start with \(a_1=0.5\), then tune \(a_0\) and \(a_2\).`, TeX`The least squares quadratic is \(1+0.5x+0.8x^2\) with \(E=1.1\).`],
    answer: TeX`\(a_0=1,\ a_1=0.5,\ a_2=0.8\) gives the minimum \(E=1.1\).`,
    build(C) {
      const a = [2.5, 0, 0.3];
      const draw = () => polyPlot(a, TeX`\(E=${sse(a).toFixed(3)}\)`);
      draw();
      slider(C, "a₀", "s0", -1, 4, 0.01, a[0], v => { a[0] = v; draw(); });
      slider(C, "a₁", "s1", -1.5, 1.5, 0.01, a[1], v => { a[1] = v; draw(); });
      slider(C, "a₂", "s2", -0.5, 1.5, 0.01, a[2], v => { a[2] = v; draw(); });
      return () => sse(a) < 1.2 ? ["done", `Correct! E = ${sse(a).toFixed(3)}; the minimum is 1.1.`] : ["wrong", `E = ${sse(a).toFixed(3)}. Keep going: below 1.2.`];
    } },

  { nav: "How many equations?", title: "Count the normal equations",
    instr: TeX`<p>You fit a cubic \(P_3(x)=a_0+a_1x+a_2x^2+a_3x^3\) to \(20\) data points. How many normal equations do you solve?</p>`,
    hints: ["One equation per unknown coefficient."],
    answer: TeX`\(4\): one for each of \(a_0,a_1,a_2,a_3\), whatever the number of points.`,
    build(C) {
      polyPlot(BEST, TeX`A fitted quadratic has 3 coefficients`);
      const inp = field(C, "equations =", "ans1");
      return () => near(parseNum(inp.value), 4, 1e-9) ? ["done", "Correct! n + 1 equations for degree n."] : ["wrong", "Not quite. Count the unknowns, not the data points."];
    } },

  { nav: "Solve the system", title: "Find a₂",
    instr: TeX`<p>The normal equations are \(5a_0+10a_2=13\), \(10a_1=5\) and \(10a_0+34a_2=37.2\). Find \(a_2\).</p>`,
    hints: [TeX`From the first equation \(a_0=2.6-2a_2\). Substitute into the third.`],
    answer: TeX`\(26+14a_2=37.2\), so \(a_2=0.8\) and \(a_0=1\).`,
    build(C) {
      polyPlot(BEST, TeX`\(P_2(x)=a_0+a_1x+a_2x^2\)`);
      const inp = field(C, TeX`\(a_2=\)`, "ans1");
      return () => near(parseNum(inp.value), 0.8, 1e-6) ? ["done", "Correct! The best quadratic is 1 + 0.5x + 0.8x²."] : ["wrong", "Not quite. Eliminate a₀ between the first and the third equation."];
    } },

  { nav: "Why the zeros?", title: "Why does the system split?",
    instr: TeX`<p>For these nodes \(\sum x_i=0\) and \(\sum x_i^3=0\), so the middle equation contains only \(a_1\). Why are these sums zero?</p>`,
    hints: ["Look at where the nodes sit around 0."],
    answer: TeX`The nodes are symmetric about \(0\): each \(x_i\) has a partner \(-x_i\), so all odd powers cancel.`,
    build(C) {
      polyPlot(null, TeX`Nodes \(-2,-1,0,1,2\)`);
      cards(C, ["The nodes are symmetric about 0", "The y values are positive", "A quadratic has no odd terms"]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 1 ? ["done", "Right! Centring the data gives this for free."] : ["wrong", "The sums Σx and Σx³ involve only the nodes."];
    } },

  { nav: "Choose the degree", title: "Which model would you use?",
    instr: TeX`<p>For our five points, \(E\) for degree \(0,1,2,3,4\) is \(12.56,\ 10.06,\ 1.10,\ 0.70,\ 0\). Which degree is the best model of the data?</p>`,
    hints: ["Where does E stop dropping a lot? Degree 4 has E = 0: is that good?"],
    answer: "Degree 2: E drops sharply up to 2 and only a little after. Degree 4 passes through every point but swings wildly between and beyond them (25.1 at x = 3).",
    build(C) {
      const q4 = [1.6, -0.0667, -0.4917, 0.1667, 0.2917];
      P.setView(-3, 3, -0.5, 9, { xticks: [-2, -1, 0, 1, 2], yticks: [2, 4, 6, 8] });
      P.fn(x => pval(q4, x), { color: "gold", width: 2 });
      P.fn(x => pval(BEST, x), { color: "curve", width: 3 });
      XS.forEach((x, i) => P.pt(x, YS[i], { color: "gold", r: 6 }));
      setPlotTitle(TeX`degree 2 (blue) and degree 4 (gold)`); P.draw();
      cards(C, ["Degree 1", "Degree 2", "Degree 4"]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 2 ? ["done", "Right! Choose the simplest model that captures the trend."] : ["wrong", "Zero error is not the goal; the model should follow the trend, not the noise."];
    } },

  { nav: "Unique?", title: "How high can the degree go?",
    instr: TeX`<p>Your data have only \(3\) distinct \(x\) values (some repeated). What is the highest degree \(n\) for which the least squares polynomial is unique?</p>`,
    hints: [TeX`Uniqueness needs at least \(n+1\) distinct nodes.`],
    answer: TeX`\(n=2\): three distinct nodes allow at most \(n+1=3\) coefficients.`,
    build(C) {
      polyPlot(BEST, TeX`At least \(n+1\) distinct nodes`);
      const inp = field(C, TeX`\(n=\)`, "ans1");
      return () => near(parseNum(inp.value), 2, 1e-9) ? ["done", "Correct! With n + 1 distinct nodes, AᵀA is symmetric positive definite."] : ["wrong", "Not quite. n + 1 must not exceed the number of distinct nodes."];
    } },

  { nav: "Linearise", title: "Make it a straight line",
    instr: TeX`<p>You want to fit \(y=a\,e^{bx}\). Which relation is a straight line you can fit by least squares?</p>`,
    hints: ["Take the logarithm of both sides."],
    answer: TeX`\(\ln y=\ln a+b\,x\): a straight line of \(\ln y\) against \(x\), with intercept \(\ln a\) and slope \(b\).`,
    build(C) {
      P.setView(0, 4, 0, 6, { xticks: [1, 2, 3], yticks: [1, 2, 3, 4, 5] });
      P.fn(x => 1.5 * Math.exp(0.42 * x), { color: "curve", width: 3 });
      [[0, 1.5], [1, 2.5], [2, 3.5], [3, 5.0]].forEach(([x, y]) => P.pt(x, y, { color: "gold", r: 6 }));
      setPlotTitle(TeX`\(y=a\,e^{bx}\)`); P.draw();
      cards(C, ["ln y = ln a + b x", "ln y = ln a + b ln x", "y = a + b x"]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 1 ? ["done", "Right! Fit ln y against x, then a = e^(intercept)."] : ["wrong", "Take ln of y = a e^(bx) carefully."];
    } },

  { nav: "Back to a", title: "From c₁ to a",
    instr: TeX`<p>Fitting \(\ln y=c_1+c_2\ln x\) to the notes' data gave \(c_1=-0.3857\) and \(c_2=0.9194\). What is \(a\) in \(y=a\,x^b\)? (2 decimals)</p>`,
    hints: [TeX`\(c_1=\ln a\), so \(a=e^{c_1}\).`],
    answer: TeX`\(a=e^{-0.3857}\approx0.68\), and \(b=0.9194\).`,
    build(C) {
      const X = [1, 2, 5, 7, 10], Y = [0.5, 2, 3, 4, 5];
      P.setView(0, 11, 0, 7, { xticks: [2, 4, 6, 8, 10], yticks: [1, 2, 3, 4, 5, 6] });
      P.fn(x => 0.68 * x ** 0.9194, { color: "curve", width: 3 });
      X.forEach((x, i) => P.pt(x, Y[i], { color: "gold", r: 6 }));
      setPlotTitle(TeX`\(y=a\,x^{0.9194}\)`); P.draw();
      const inp = field(C, TeX`\(a=\)`, "ans1");
      return () => near(parseNum(inp.value), 0.68, 0.006) ? ["done", "Correct! Remember: this minimises the error of ln y, not of y."] : ["wrong", "Not quite. Undo the logarithm."];
    } },
];

startPractice({
  store: "nm-lec25-lspoly-v1", lecture: "Lecture 25", tasks: TASKS,
  finalPlot() { polyPlot(BEST, TeX`The least squares quadratic \(1+0.5x+0.8x^2\)`); },
});
