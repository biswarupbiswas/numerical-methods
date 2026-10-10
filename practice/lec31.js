/* Lecture 31 — The Trapezoidal Rule: practice tasks. */
"use strict";

const fx = x => 1 / (1 + x * x);
const I_EX = Math.PI / 4;
const trapN = (g, a, b, n) => { const h = (b - a) / n; let s = (g(a) + g(b)) / 2; for (let i = 1; i < n; i++) s += g(a + i * h); return h * s; };
const midN = (g, a, b, n) => { const h = (b - a) / n; let s = 0; for (let i = 0; i < n; i++) s += g(a + (i + 0.5) * h); return h * s; };

/** g on [a, b] with n trapezoids (chords through the nodes). */
function trapPlot(g, a, b, n, color, view, title) {
  P.setView(...view.box, { xticks: view.xticks, yticks: view.yticks });
  const h = (b - a) / n;
  for (let i = 0; i < n; i++) {
    const x0 = a + i * h, x1 = x0 + h, y0 = g(x0), y1 = g(x1);
    for (let k = 0; k < 24; k++) {               // fill the trapezoid as thin bands under the chord
      const u0 = x0 + h * k / 24, u1 = u0 + h / 24, yc = y0 + (y1 - y0) * (k + 0.5) / 24;
      P.band(u0, u1, Math.min(0, yc), Math.max(0, yc), { color, alpha: 0.22 });
    }
    P.seg(x0, y0, x1, y1, { color, width: 2 });
    P.seg(x0, 0, x0, y0, { color, width: 1, alpha: 0.6 }); P.seg(x1, 0, x1, y1, { color, width: 1, alpha: 0.6 });
  }
  P.fn(g, { color: "curve", width: 3 });
  for (let i = 0; i <= n; i++) P.pt(a + i * h, g(a + i * h), { color: "gold", r: 5 });
  setPlotTitle(title); P.draw();
}
const EXV = { box: [-0.05, 1.05, 0, 1.15], xticks: [0, 0.25, 0.5, 0.75, 1], yticks: [0, 0.5, 1] };
const EXPV = { box: [-0.05, 1.05, 0, 2.9], xticks: [0, 0.5, 1], yticks: [0, 1, 2] };

const TASKS = [
  { nav: "One trapezoid", title: "The trapezoidal rule for e to the x",
    instr: TeX`<p>Approximate \(\int_0^1 e^x\,dx\) by the trapezoidal rule \(\frac h2\big(f(a)+f(b)\big)\) with \(h=b-a\). (4 decimals)</p>`,
    hints: [TeX`\(h=1\), \(f(0)=1\), \(f(1)=e\approx2.718282\).`],
    answer: TeX`\(\frac12(1+e)\approx1.8591\). The exact value is \(e-1\approx1.7183\), so the rule overestimates by \(0.1409\): \(e^x\) is convex.`,
    build(C) {
      trapPlot(Math.exp, 0, 1, 1, "gold", EXPV, TeX`\(\int_0^1 e^x\,dx\) and one trapezoid`);
      const inp = field(C, "trapezoidal rule =", "ans1");
      return () => near(parseNum(inp.value), (1 + Math.E) / 2, 1e-4) ? ["done", "Correct! The chord lies above the convex curve, so the value is too large."] : ["wrong", "Not quite. Average f(0) and f(1), then multiply by h = 1."];
    } },

  { nav: "Over or under?", title: "Read the sign from the picture",
    instr: TeX`<p>The trapezoidal rule is applied to \(\int_1^2\frac{dx}{x}=\ln2\). Without computing, does it overestimate or underestimate?</p>`,
    hints: [TeX`The error is \(-\frac{h^3}{12}f''(c)\). Find the sign of \(f''(x)=\frac{2}{x^3}\) on \([1,2]\).`],
    answer: TeX`It <b>overestimates</b>: \(f''>0\), the curve is convex and the chord lies above it. Indeed \(T_1=\frac12(1+\frac12)=0.75\) against \(\ln2\approx0.6931\).`,
    build(C) {
      trapPlot(x => 1 / x, 1, 2, 1, "gold", { box: [0.95, 2.05, 0, 1.15], xticks: [1, 1.5, 2], yticks: [0, 0.5, 1] }, TeX`\(f(x)=\frac1x\) on \([1,2]\) and its chord`);
      cards(C, ["overestimates", "underestimates", "exact"]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 1 ? ["done", "Right! Convex function: the chord is above the curve, so T is too big."] : ["wrong", "Look at where the chord lies relative to the curve."];
    } },

  { nav: "Composite by hand", title: "Two trapezoids",
    instr: TeX`<p>Compute the composite trapezoidal rule \(T_2\) for \(\int_0^1 e^x\,dx\): \(h=0.5\), nodes \(0,\ 0.5,\ 1\). (4 decimals)</p>`,
    hints: [TeX`\(T_2=\frac{h}{2}\big(f(0)+2f(0.5)+f(1)\big)\) with \(f(0.5)=e^{0.5}\approx1.648721\).`],
    answer: TeX`\(T_2=0.25\,(1+2\cdot1.648721+2.718282)\approx1.7539\); error \(-0.0356\), about a quarter of the \(-0.1409\) of \(T_1\).`,
    build(C) {
      trapPlot(Math.exp, 0, 1, 2, "gold", EXPV, TeX`\(T_2\) for \(\int_0^1 e^x\,dx\)`);
      const inp = field(C, TeX`\(T_2=\)`, "ans1");
      return () => near(parseNum(inp.value), trapN(Math.exp, 0, 1, 2), 1e-4) ? ["done", "Correct! Halving h divided the error by about 4."] : ["wrong", "Not quite. The interior value gets weight 2, the end values weight 1, then multiply by h/2 = 0.25."];
    } },

  { nav: "Check the formula", title: "The error formula is exact for x squared",
    instr: TeX`<p>For \(\int_0^1x^2\,dx=\frac13\) the composite rule with \(n=2\) gives \(T_2=0.375\). Compute the error \(I-T_2\) from the formula \(-\frac{(b-a)h^2}{12}f''(\mu)\). (4 decimals)</p>`,
    hints: [TeX`\(f''=2\) everywhere, \(b-a=1\), \(h=0.5\).`],
    answer: TeX`\(-\frac{1\cdot0.25}{12}\cdot2=-\frac{1}{24}\approx-0.0417\), exactly \(\frac13-0.375\): for a quadratic \(f''\) is constant, so the formula has no unknown \(\mu\).`,
    build(C) {
      trapPlot(x => x * x, 0, 1, 2, "gold", { box: [-0.05, 1.05, 0, 1.1], xticks: [0, 0.5, 1], yticks: [0, 0.5, 1] }, TeX`\(f(x)=x^2\) and \(T_2=0.375\)`);
      const inp = field(C, TeX`\(I-T_2=\)`, "ans1");
      return () => near(parseNum(inp.value), -1 / 24, 1e-3) ? ["done", "Correct! The formula and the direct computation agree exactly."] : ["wrong", "Not quite. Mind the minus sign: the rule overestimates a convex function."];
    } },

  { nav: "Read the slope", title: "Double n, divide the error by …",
    instr: TeX`<p>The plot shows \(|I-T_n|\) (gold) and \(|I-M_n|\) (green) for \(\int_0^1\frac{dx}{1+x^2}\) on a log scale. When \(n\) is doubled, the <b>trapezoidal</b> error is divided by about</p>`,
    hints: [TeX`The composite error is \(-\frac{(b-a)h^2}{12}f''(\mu)\). What happens to \(h^2\) when \(h\) is halved?`],
    answer: TeX`About \(4\): \(0.0026\to6.5\times10^{-4}\to1.6\times10^{-4}\). The two lines are parallel (both order \(h^2\)); the trapezoidal line is a factor \(2\) higher.`,
    build(C) {
      P.setView(0, 66, 1e-6, 1, { xticks: [1, 8, 16, 32, 64], ylog: true });
      const ns = [1, 2, 4, 8, 16, 32, 64];
      const line = (g, col) => { for (let k = 0; k < ns.length; k++) { const e = Math.abs(I_EX - g(fx, 0, 1, ns[k])); P.pt(ns[k], e, { color: col, r: 5 }); if (k) P.seg(ns[k - 1], Math.abs(I_EX - g(fx, 0, 1, ns[k - 1])), ns[k], e, { color: col, width: 2 }); } };
      line(trapN, "gold"); line(midN, "pos");
      setPlotTitle(TeX`Errors against \(n\): trapezoid (gold), midpoint (green)`); P.draw();
      cards(C, ["2", "4", "8"]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 2 ? ["done", "Right! Order h²: halve h and the error drops by 4."] : ["wrong", "Look at the gold points for n = 8, 16, 32."];
    } },

  { nav: "How many pieces?", title: "Choose n for a tolerance",
    instr: TeX`<p>For \(\int_0^1e^{-x^2}\,dx\), \(\max_{[0,1]}|f''|=2\) (at \(x=0\)), so the composite trapezoidal error is at most \(\frac{h^2}{12}\cdot2=\frac{h^2}{6}\) with \(h=\frac1n\). What is the smallest \(n\) that guarantees an error of at most \(10^{-3}\)?</p>`,
    hints: [TeX`Solve \(\frac{1}{6n^2}\le10^{-3}\), i.e. \(n^2\ge\frac{1000}{6}\).`],
    answer: TeX`\(n^2\ge166.7\), so \(n\ge12.9\): \(n=13\) (\(h\approx0.0769\)). The true error is then \(3.6\times10^{-4}\).`,
    build(C) {
      const g = x => Math.exp(-x * x), I = 0.7468241328124269;
      const draw = n => trapPlot(g, 0, 1, n, "gold", EXV, TeX`\(n=${n}\): bound \(=${(1 / (6 * n * n)).toExponential(2)}\), true error \(=${Math.abs(I - trapN(g, 0, 1, n)).toExponential(2)}\)`);
      slider(C, "n", "s1", 1, 30, 1, 5, v => draw(v));
      const inp = field(C, TeX`\(n=\)`, "ans1");
      return () => near(parseNum(inp.value), 13, 1e-9) ? ["done", "Correct! The bound guarantees the tolerance; the true error is even smaller."] : ["wrong", "Not quite. Solve 1/(6 n²) ≤ 0.001 and round up."];
    } },

  { nav: "Reuse the nodes", title: "Halve h for free",
    instr: TeX`<p>For \(\int_0^1\frac{dx}{1+x^2}\) we already know \(T_4=0.782794\) and \(M_4=0.786700\). Use \(T_{2n}=\frac{T_n+M_n}{2}\) to get \(T_8\). (4 decimals)</p>`,
    hints: ["The nodes of T₈ are the nodes of T₄ plus the midpoints used by M₄."],
    answer: TeX`\(T_8=\frac{0.782794+0.786700}{2}\approx0.7847\); error \(6.5\times10^{-4}\), a quarter of that of \(T_4\).`,
    build(C) {
      trapPlot(fx, 0, 1, 8, "gold", EXV, TeX`\(T_8\): old nodes of \(T_4\) and the midpoints of \(M_4\)`);
      for (let i = 0; i < 4; i++) P.pt((i + 0.5) / 4, fx((i + 0.5) / 4), { color: "pos", r: 6 });
      P.draw();
      const inp = field(C, TeX`\(T_8=\)`, "ans1");
      return () => near(parseNum(inp.value), trapN(fx, 0, 1, 8), 1e-4) ? ["done", "Correct! No function value was wasted."] : ["wrong", "Not quite. Average the two numbers."];
    } },

  { nav: "Fooled by samples", title: "When does the rule return 2?",
    instr: TeX`<p>The exact value of \(\int_0^1\bigl(1+\cos 8\pi x\bigr)\,dx\) is \(1\). Drag \(n\). What is the <b>largest</b> \(n\le12\) for which the trapezoidal rule \(T_n\) returns \(2\)?</p>`,
    hints: ["Look for the n at which every node lands on a peak of the curve."],
    answer: TeX`\(n=4\): the nodes \(0,\frac14,\frac12,\frac34,1\) all sit on peaks where \(f=2\) (so do those of \(n=1,2\)). With \(n=8\) the rule gives exactly \(1\).`,
    build(C) {
      const g = x => 1 + Math.cos(8 * Math.PI * x);
      const draw = n => trapPlot(g, 0, 1, n, "gold", { box: [-0.05, 1.05, 0, 2.2], xticks: [0, 0.25, 0.5, 0.75, 1], yticks: [0, 1, 2] }, TeX`\(n=${n}\): \(T_n=${trapN(g, 0, 1, n).toFixed(4)}\)`);
      slider(C, "n", "s1", 1, 12, 1, 3, v => draw(v));
      const inp = field(C, TeX`\(n=\)`, "ans1");
      return () => near(parseNum(inp.value), 4, 1e-9) ? ["done", "Correct! The rule only sees its samples: check with a different n."] : ["wrong", "Not quite. Drag n and read T_n in the title."];
    } },

  { nav: "The algorithm", title: "Put the composite trapezoidal rule in order",
    instr: `<p>Put the steps in the right order using the menus.</p>`,
    hints: ["h is needed before any node can be found; the end values carry weight one half; the sum is multiplied by h at the very end."],
    answer: "1. h = (b − a)/n  2. sum = (f(a) + f(b))/2  3. For i = 1, …, n − 1 add f(a + i h) to the sum  4. Return h · sum",
    build(C) {
      const steps = ["h = (b − a)/n", "sum = (f(a) + f(b))/2", "For i = 1, …, n − 1 add f(a + i h) to the sum", "Return h · sum"];
      const order = [2, 0, 3, 1];
      const grid = el("div", { className: "order" }); C.append(grid);
      const sels = [0, 1, 2, 3].map(k => {
        const s = el("select", { id: `dd${k + 1}` });
        s.append(el("option", { value: "" }, "— choose —"), ...order.map(i => { const o = el("option", { value: i }); o.textContent = steps[i]; return o; }));
        grid.append(el("label", { htmlFor: `dd${k + 1}`, className: "steplabel" }, `Step ${k + 1}`), s); return s;
      });
      trapPlot(fx, 0, 1, 4, "gold", EXV, TeX`\(T_4\approx${trapN(fx, 0, 1, 4).toFixed(6)}\) for \(\int_0^1\frac{dx}{1+x^2}\)`);
      return () => {
        const v = sels.map(s => s.value);
        if (v.includes("")) return ["wrong", "Choose an option for every step."];
        if (new Set(v).size < 4) return ["wrong", "Each option should be used exactly once."];
        const bad = v.findIndex((x, k) => +x !== k);
        return bad >= 0 ? ["wrong", `Step ${bad + 1} is not in the right place yet.`] : ["done", "Perfect order! n + 1 function values in all."];
      };
    } },
];

startPractice({
  store: "nm-lec31-trapezoidal-v1", lecture: "Lecture 31", tasks: TASKS,
  finalPlot() { trapPlot(fx, 0, 1, 8, "gold", EXV, TeX`\(T_8\): error \(6.5\times10^{-4}\)`); },
});
