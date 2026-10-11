/* Lecture 33 — Simpson's 3/8 Rule: practice tasks. */
"use strict";

const fx = x => 1 / (1 + x * x);
const J_EXP = Math.E - 1;
const s13N = (g, a, b, n) => { const h = (b - a) / n; let s = g(a) + g(b); for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * g(a + i * h); return h / 3 * s; };
const s38N = (g, a, b, n) => { const h = (b - a) / n; let s = g(a) + g(b); for (let i = 1; i < n; i++) s += (i % 3 ? 3 : 2) * g(a + i * h); return 3 * h / 8 * s; };
const combN = (g, a, b, n) => {
  if (n % 2 === 0) return s13N(g, a, b, n);
  const h = (b - a) / n, m = a + (n - 3) * h;
  return (n > 3 ? s13N(g, a, m, n - 3) : 0) + s38N(g, m, b, 3);
};

/** Interpolating polynomial through (xs, ys), evaluated at x (Lagrange form). */
const lagr = (xs, ys, x) => xs.reduce((s, xi, i) => s + ys[i] * xs.reduce((p, xj, j) => (j === i ? p : p * (x - xj) / (xi - xj)), 1), 0);

/** Shade the area under the interpolant of each group of k pieces: [k, color] per group, h = (b - a)/n. */
function groupPlot(g, a, b, n, groups, view, title) {
  P.setView(...view.box, { xticks: view.xticks, yticks: view.yticks });
  const h = (b - a) / n;
  let i0 = 0;
  for (const [k, color] of groups) {
    const xs = [], ys = [];
    for (let j = 0; j <= k; j++) { xs.push(a + (i0 + j) * h); ys.push(g(a + (i0 + j) * h)); }
    const M = 24 * k;
    for (let q = 0; q < M; q++) {
      const u0 = xs[0] + k * h * q / M, u1 = u0 + k * h / M, yc = lagr(xs, ys, (u0 + u1) / 2);
      P.band(u0, u1, Math.min(0, yc), Math.max(0, yc), { color, alpha: 0.24 });
    }
    P.fn(x => lagr(xs, ys, x), { color, width: 2, domain: [xs[0], xs[k]] });
    P.seg(xs[0], 0, xs[0], ys[0], { color, width: 1, alpha: 0.6 }); P.seg(xs[k], 0, xs[k], ys[k], { color, width: 1, alpha: 0.6 });
    i0 += k;
  }
  P.fn(g, { color: "curve", width: 3 });
  for (let i = 0; i <= n; i++) P.pt(a + i * h, g(a + i * h), { color: "ink", r: 4 });
  setPlotTitle(title); P.draw();
}
/** The groups used by the combined rule: pairs (1/3, green), and the last three pieces (3/8, gold) when n is odd. */
const combGroups = n => { const gr = []; const pairs = n % 2 === 0 ? n / 2 : (n - 3) / 2; for (let k = 0; k < pairs; k++) gr.push([2, "pos"]); if (n % 2) gr.push([3, "gold"]); return gr; };
const EXPV = { box: [-0.05, 1.05, 0, 2.9], xticks: [0, 0.5, 1], yticks: [0, 1, 2] };
const EXV = { box: [-0.05, 1.05, 0, 1.15], xticks: [0, 0.5, 1], yticks: [0, 0.5, 1] };

const TASKS = [
  { nav: "One 3/8 step", title: "Simpson's 3/8 rule for e to the x",
    instr: TeX`<p>Approximate \(\int_0^1 e^x\,dx\) by Simpson's 3/8 rule \(\frac{3h}{8}\big(f_0+3f_1+3f_2+f_3\big)\) with \(h=\frac13\). (4 decimals)</p>`,
    hints: [TeX`\(\frac{3h}{8}=\frac18\). The values are \(1,\ e^{1/3}\approx1.395612,\ e^{2/3}\approx1.947734,\ e\approx2.718282\).`],
    answer: TeX`\(\frac18\big(1+3\cdot1.395612+3\cdot1.947734+2.718282\big)\approx1.7185\). The exact value is \(e-1\approx1.718282\): the error is only \(-2.6\times10^{-4}\).`,
    build(C) {
      groupPlot(Math.exp, 0, 1, 3, [[3, "gold"]], EXPV, TeX`\(\int_0^1 e^x\,dx\) and the cubic through four points`);
      const inp = field(C, "3/8 rule =", "ans1");
      return () => near(parseNum(inp.value), s38N(Math.exp, 0, 1, 3), 1e-4) ? ["done", "Correct! The cubic is almost indistinguishable from the curve."] : ["wrong", "Not quite. Weights 1, 3, 3, 1, then multiply by 3h/8 = 1/8."];
    } },

  { nav: "Test x⁴", title: "Where exactness stops",
    instr: TeX`<p>On \([0,3]\) with \(h=1\) the rule reads \(\frac38\big(f(0)+3f(1)+3f(2)+f(3)\big)\). It integrates \(1,x,x^2,x^3\) exactly. What does it give for \(\int_0^3x^4\,dx=48.6\)?</p>`,
    hints: [TeX`\(f(0)=0,\ f(1)=1,\ f(2)=16,\ f(3)=81\).`],
    answer: TeX`\(\frac38(0+3+48+81)=\frac38\cdot132=49.5\). The error constant is \(C=48.6-49.5=-\frac{9}{10}\), and \(\frac{C}{4!}=-\frac{3}{80}\): the error is \(-\frac{3h^5}{80}f^{(4)}(\xi)\). With \(f^{(4)}=24\) this is exactly \(-0.9\).`,
    build(C) {
      groupPlot(x => x ** 4, 0, 3, 3, [[3, "gold"]], { box: [-0.1, 3.1, 0, 85], xticks: [0, 1, 2, 3], yticks: [0, 20, 40, 60, 80] }, TeX`\(f(x)=x^4\) and its cubic interpolant on \([0,3]\)`);
      const inp = field(C, "rule =", "ans1");
      return () => near(parseNum(inp.value), 49.5, 1e-6) ? ["done", "Correct! 49.5 instead of 48.6: the degree of precision is 3."] : ["wrong", "Not quite. Weight the four values 1, 3, 3, 1 and multiply by 3/8."];
    } },

  { nav: "Composite weights", title: "Weights of the composite 3/8 rule",
    instr: TeX`<p>Which weights (before the factor \(\frac{3h}{8}\)) belong to the composite 3/8 rule with \(n=6\) pieces?</p>`,
    hints: ["The rule is applied to two groups of three pieces. The node where the groups meet belongs to both."],
    answer: TeX`\(1,3,3,2,3,3,1\): each group has weights \(1,3,3,1\), and the shared node \(x_3\) collects \(1+1=2\).`,
    build(C) {
      groupPlot(fx, 0, 1, 6, [[3, "gold"], [3, "curve"]], { box: [-0.05, 1.05, 0, 1.15], xticks: [0, 0.5, 1], yticks: [0, 0.5, 1] }, TeX`Two groups of three pieces on \(\int_0^1\frac{dx}{1+x^2}\)`);
      cards(C, [TeX`\(1,3,3,1,3,3,1\)`, TeX`\(1,3,3,2,3,3,1\)`, TeX`\(1,4,2,4,2,4,1\)`, TeX`\(1,3,3,3,3,3,1\)`]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 2 ? ["done", "Right! The weights add up to 16, and (3h/8)·16 = 6h = b − a."] : S.choice === 3 ? ["wrong", "Those are the weights of the composite 1/3 rule."] : ["wrong", "Look at the node shared by the two groups."];
    } },

  { nav: "Split an odd n", title: "Which pieces get which rule?",
    instr: TeX`<p>For odd \(n\), the combined rule uses the 1/3 rule on the first pieces and the 3/8 rule on the last three. Drag \(n\) to see the split. For \(n=11\), how many pieces does the <b>1/3 rule</b> cover?</p>`,
    hints: ["The 3/8 rule takes exactly three pieces; the rest must be an even number."],
    answer: TeX`\(11-3=8\) pieces, that is four pairs, followed by one 3/8 group on the last three.`,
    build(C) {
      const draw = n => groupPlot(fx, 0, 1, n, combGroups(n), EXV, TeX`\(n=${n}\): ${n % 2 ? `1/3 rule on ${n - 3} pieces (green), 3/8 rule on 3 (gold)` : "even: the 1/3 rule alone"}`);
      slider(C, "n", "s1", 2, 13, 1, 5, v => draw(v));
      const inp = field(C, "pieces for the 1/3 rule =", "ans1");
      return () => near(parseNum(inp.value), 8, 1e-9) ? ["done", "Correct! Every n from 2 on can be handled this way."] : ["wrong", "Not quite. Take three pieces away for the 3/8 rule."];
    } },

  { nav: "Combined by hand", title: "Five pieces",
    instr: TeX`<p>Approximate \(\int_0^1 e^x\,dx\) with \(n=5\), \(h=0.2\): the 1/3 rule on \([0,0.4]\) plus the 3/8 rule on \([0.4,1]\). (5 decimals)</p>`,
    hints: [TeX`\(\frac{0.2}{3}\big(f_0+4f_1+f_2\big)\approx0.491829\) and \(\frac{3\cdot0.2}{8}\big(f_2+3f_3+3f_4+f_5\big)\). Values: \(e^{0.2}\approx1.221403,\ e^{0.4}\approx1.491825,\ e^{0.6}\approx1.822119,\ e^{0.8}\approx2.225541,\ e\approx2.718282\).`],
    answer: TeX`\(0.491829+1.226481\approx1.71831\); the error is \(-2.9\times10^{-5}\), against \(-5.7\times10^{-3}\) for the trapezoidal rule with the same six values.`,
    build(C) {
      groupPlot(Math.exp, 0, 1, 5, combGroups(5), { box: [-0.05, 1.05, 0, 2.9], xticks: [0, 0.2, 0.4, 0.6, 0.8, 1], yticks: [0, 1, 2] }, TeX`\(n=5\): 1/3 rule (green) and 3/8 rule (gold)`);
      const inp = field(C, "combined rule =", "ans1");
      return () => near(parseNum(inp.value), combN(Math.exp, 0, 1, 5), 1e-5) ? ["done", "Correct! Both parts are of order h⁴."] : ["wrong", "Not quite. Add the two parts; the 3/8 part has the factor 3h/8 = 0.075."];
    } },

  { nav: "Same interval", title: "Compare the error constants",
    instr: TeX`<p>Over one interval of length \(L\), the 1/3 rule has error \(-\frac{L^5}{2880}f^{(4)}\) and the 3/8 rule \(-\frac{L^5}{6480}f^{(4)}\). By what factor is the 3/8 error smaller?</p>`,
    hints: [TeX`\(h=\frac L2\) gives \(\frac{h^5}{90}=\frac{L^5}{2880}\), and \(h=\frac L3\) gives \(\frac{3h^5}{80}=\frac{L^5}{6480}\). Divide.`],
    answer: TeX`\(\frac{6480}{2880}=2.25\). For \(e^x\) on \([0,1]\) the errors are \(5.8\times10^{-4}\) and \(2.6\times10^{-4}\): ratio \(2.24\). The price is a fourth function value.`,
    build(C) {
      groupPlot(Math.exp, 0, 1, 2, [[2, "pos"]], EXPV, TeX`One 1/3 step on \([0,1]\): \(|\text{error}|=5.8\times10^{-4}\)`);
      const inp = field(C, "factor =", "ans1");
      return () => near(parseNum(inp.value), 2.25, 1e-3) ? ["done", "Correct! Over a fixed interval the 3/8 rule wins by 2.25."] : ["wrong", "Not quite. Divide 6480 by 2880."];
    } },

  { nav: "Same nodes", title: "Twelve pieces: which rule?",
    instr: TeX`<p>You have \(13\) equally spaced values, so \(n=12\): both composite rules can be used. At the same \(h\) their errors are \(-\frac{(b-a)h^4}{180}f^{(4)}\) (1/3) and \(-\frac{(b-a)h^4}{80}f^{(4)}\) (3/8). Which one is more accurate?</p>`,
    hints: ["Compare 1/180 with 1/80. Over a fixed interval the 3/8 rule is better, but here the spacing h is fixed."],
    answer: TeX`The <b>1/3 rule</b>, by \(\frac{180}{80}=2.25\). For \(e^x\) on \([0,1]\) with \(n=12\): \(4.6\times10^{-7}\) against \(1.0\times10^{-6}\). Keep the 3/8 rule for an odd leftover.`,
    build(C) {
      P.setView(0, 100, 1e-11, 1e-3, { xticks: [6, 12, 24, 48, 96], ylog: true, xlabel: "n" });
      const line = (rule, ns, col) => ns.forEach((n, k) => { const e = Math.abs(J_EXP - rule(Math.exp, 0, 1, n)); P.pt(n, e, { color: col, r: 5 }); if (k) P.seg(ns[k - 1], Math.abs(J_EXP - rule(Math.exp, 0, 1, ns[k - 1])), n, e, { color: col, width: 2 }); });
      line(s13N, [6, 12, 24, 48, 96], "pos"); line(s38N, [6, 12, 24, 48, 96], "gold");
      setPlotTitle(TeX`\(\int_0^1e^x\,dx\): errors of the 1/3 rule (green) and the 3/8 rule (gold) on the same nodes`); P.draw();
      cards(C, ["the 1/3 rule", "the 3/8 rule", "they are equally accurate"]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 1 ? ["done", "Right! On the same nodes the 1/3 rule is 2.25 times more accurate."] : ["wrong", "Look at the plot: which line is lower?"];
    } },

  { nav: "Read the slope", title: "When the rate breaks down",
    instr: TeX`<p>The plot shows the errors of the composite 3/8 rule for \(\int_0^1e^x\,dx\) (gold) and for \(\int_0^1\sqrt x\,dx\) (red). When \(n\) is doubled, the error for \(\sqrt x\) is divided by about</p>`,
    hints: [TeX`Read two neighbouring red points, e.g. \(n=6\) and \(n=12\). The derivatives of \(\sqrt x\) blow up at \(x=0\).`],
    answer: TeX`About \(2.8=2^{1.5}\): \(0.0067\to0.0024\to0.00084\). The error formula needs a bounded \(f^{(4)}\); for \(e^x\) the drop is \(16\), the expected order \(h^4\).`,
    build(C) {
      P.setView(0, 100, 1e-11, 0.1, { xticks: [3, 12, 24, 48, 96], ylog: true, xlabel: "n" });
      const ns = [3, 6, 12, 24, 48, 96];
      const line = (g, I, col) => ns.forEach((n, k) => { const e = Math.abs(I - s38N(g, 0, 1, n)); P.pt(n, e, { color: col, r: 5 }); if (k) P.seg(ns[k - 1], Math.abs(I - s38N(g, 0, 1, ns[k - 1])), n, e, { color: col, width: 2 }); });
      line(Math.exp, J_EXP, "gold"); line(Math.sqrt, 2 / 3, "neg");
      setPlotTitle(TeX`Composite 3/8 errors: \(e^x\) (gold), \(\sqrt x\) (red)`); P.draw();
      cards(C, ["2.8", "4", "16"]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 1 ? ["done", "Right! The missing smoothness costs the rule its order h⁴."] : S.choice === 3 ? ["wrong", "That is the drop for the smooth e^x (gold), not for √x."] : ["wrong", "Read the red points for n = 6, 12, 24."];
    } },

  { nav: "The algorithm", title: "Simpson's rule for any n",
    instr: `<p>Put the steps of the combined rule (n at least 2) in the right order using the menus.</p>`,
    hints: ["h comes first. An even n needs no 3/8 step at all. The 3/8 rule always takes the last three pieces."],
    answer: "1. h = (b − a)/n  2. If n is even, return the composite 1/3 rule  3. Otherwise apply the 1/3 rule to the first n − 3 pieces (if any)  4. Add the 3/8 rule on the last three pieces and return the sum",
    build(C) {
      const steps = ["h = (b − a)/n", "If n is even, return the composite 1/3 rule", "Otherwise apply the 1/3 rule to the first n − 3 pieces (if any)", "Add the 3/8 rule on the last three pieces and return the sum"];
      const order = [3, 1, 0, 2];
      const grid = el("div", { className: "order" }); C.append(grid);
      const sels = [0, 1, 2, 3].map(k => {
        const s = el("select", { id: `dd${k + 1}` });
        s.append(el("option", { value: "" }, "— choose —"), ...order.map(i => { const o = el("option", { value: i }); o.textContent = steps[i]; return o; }));
        grid.append(el("label", { htmlFor: `dd${k + 1}`, className: "steplabel" }, `Step ${k + 1}`), s); return s;
      });
      groupPlot(fx, 0, 1, 7, combGroups(7), EXV, TeX`\(n=7\) on \(\int_0^1\frac{dx}{1+x^2}\): two pairs, then one 3/8 group`);
      return () => {
        const v = sels.map(s => s.value);
        if (v.includes("")) return ["wrong", "Choose an option for every step."];
        if (new Set(v).size < 4) return ["wrong", "Each option should be used exactly once."];
        const bad = v.findIndex((x, k) => +x !== k);
        return bad >= 0 ? ["wrong", `Step ${bad + 1} is not in the right place yet.`] : ["done", "Perfect order! n + 1 function values for every n."];
      };
    } },
];

startPractice({
  store: "nm-lec33-simpson-38-v1", lecture: "Lecture 33", tasks: TASKS,
  finalPlot() { groupPlot(fx, 0, 1, 5, combGroups(5), EXV, TeX`\(n=5\): \(0.785340\), error \(5.9\times10^{-5}\)`); },
});
