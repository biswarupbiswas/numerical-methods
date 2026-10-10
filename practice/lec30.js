/* Lecture 30 — Introduction to Numerical Integration: practice tasks. */
"use strict";

const fx = x => 1 / (1 + x * x);
const I_EX = Math.PI / 4;
const rectN = (g, a, b, n) => { const h = (b - a) / n; let s = 0; for (let i = 0; i < n; i++) s += g(a + i * h); return h * s; };
const midN = (g, a, b, n) => { const h = (b - a) / n; let s = 0; for (let i = 0; i < n; i++) s += g(a + (i + 0.5) * h); return h * s; };

/** g on [a, b] with n rectangles whose heights are taken at a + (i + s) h (s = 0: left ends, s = 0.5: midpoints). */
function rectPlot(g, a, b, n, s, color, view, title) {
  P.setView(...view.box, { xticks: view.xticks, yticks: view.yticks });
  const h = (b - a) / n;
  for (let i = 0; i < n; i++) {
    const x0 = a + i * h, x1 = x0 + h, xs = x0 + s * h, y = g(xs);
    P.band(x0, x1, Math.min(0, y), Math.max(0, y), { color, alpha: 0.25 });
    P.seg(x0, y, x1, y, { color, width: 2 });
    P.seg(x0, 0, x0, y, { color, width: 1, alpha: 0.6 }); P.seg(x1, 0, x1, y, { color, width: 1, alpha: 0.6 });
    P.pt(xs, y, { color: "gold", r: 5 });
  }
  P.fn(g, { color: "curve", width: 3 });
  setPlotTitle(title); P.draw();
}
const EXV = { box: [-0.05, 1.05, 0, 1.15], xticks: [0, 0.25, 0.5, 0.75, 1], yticks: [0, 0.5, 1] };

const TASKS = [
  { nav: "Move the node", title: "Where should the single node go?",
    instr: TeX`<p>The one-node rule \((b-a)\,f(x_0)\) approximates \(\int_0^1\frac{dx}{1+x^2}=\frac{\pi}{4}\). Drag the node \(x_0\) and find the position, in steps of \(0.05\), with the smallest error.</p>`,
    hints: ["Watch the error in the plot title as you drag.", "The two errors on either side of the node should balance."],
    answer: TeX`\(x_0=0.5\), the midpoint: error \(0.0146\). The left end \(x_0=0\) (the rectangle rule) has error \(0.2146\).`,
    build(C) {
      const draw = s => rectPlot(fx, 0, 1, 1, s, "pos", EXV, TeX`\(x_0=${s.toFixed(2)}\): rule \(=${fx(s).toFixed(4)}\), error \(=${Math.abs(I_EX - fx(s)).toFixed(4)}\)`);
      slider(C, "x_0", "s1", 0, 1, 0.05, 0, v => draw(v));
      const inp = field(C, TeX`\(x_0=\)`, "ans1");
      return () => near(parseNum(inp.value), 0.5, 1e-9) ? ["done", "Correct! The midpoint balances the area cut off against the area added."] : ["wrong", "Not quite. Drag the node and read the error in the title."];
    } },

  { nav: "Midpoint by hand", title: "The midpoint rule for e to the x",
    instr: TeX`<p>Approximate \(\int_0^1 e^x\,dx\) by the midpoint rule \((b-a)\,f\!\left(\frac{a+b}{2}\right)\). (4 decimals)</p>`,
    hints: [TeX`The midpoint is \(\frac12\), so the rule gives \(1\cdot e^{0.5}\).`],
    answer: TeX`\(e^{0.5}\approx1.6487\). The exact value is \(e-1\approx1.7183\) (error \(0.0696\)); the rectangle rule gives \(e^0=1\) (error \(0.7183\)).`,
    build(C) {
      rectPlot(Math.exp, 0, 1, 1, 0.5, "pos", { box: [-0.05, 1.05, 0, 2.9], xticks: [0, 0.5, 1], yticks: [0, 1, 2] }, TeX`\(\int_0^1 e^x\,dx\) and the midpoint rectangle`);
      const inp = field(C, "midpoint rule =", "ans1");
      return () => near(parseNum(inp.value), Math.exp(0.5), 1e-4) ? ["done", "Correct! The error 0.0696 is ten times smaller than that of the rectangle rule."] : ["wrong", "Not quite. Evaluate e to the power 0.5."];
    } },

  { nav: "Bound the error", title: "A guaranteed bound",
    instr: TeX`<p>The midpoint error is \(\frac{h^3}{24}f''(c)\) for some \(c\in[a,b]\). For \(\int_0^1 e^x\,dx\), use the largest value of \(|f''|\) on \([0,1]\) to bound the error. (4 decimals)</p>`,
    hints: [TeX`\(f''(x)=e^x\) is largest at \(x=1\), and \(h=1\).`],
    answer: TeX`\(|E|\le\frac{1^3}{24}\,e\approx0.1133\). The true error, \(0.0696\), lies inside the bound.`,
    build(C) {
      P.setView(-0.05, 1.05, 0, 3, { xticks: [0, 0.5, 1], yticks: [0, 1, 2, 3] });
      P.fn(Math.exp, { color: "gold", width: 3, domain: [0, 1] });
      P.pt(1, Math.E, { color: "neg", r: 6 });
      P.seg(0, Math.E, 1, Math.E, { color: "muted", width: 1, dash: true });
      P.tex(0.75, 2.85, "\\max|f''|=e", { color: "neg", size: 16 });
      setPlotTitle(TeX`\(f''(x)=e^x\) on \([0,1]\)`); P.draw();
      const inp = field(C, TeX`bound on \(|E|\) =`, "ans1");
      return () => near(parseNum(inp.value), Math.E / 24, 1e-3) ? ["done", "Correct! Bounds use the maximum because c is unknown."] : ["wrong", "Not quite. Divide e by 24."];
    } },

  { nav: "Precision", title: "Which one is integrated exactly?",
    instr: TeX`<p>The midpoint rule has degree of precision \(1\). On \([0,1]\), which of these does it integrate <b>exactly</b>?</p>`,
    hints: [TeX`Exact for every polynomial of degree at most \(1\).`],
    answer: TeX`\(4x-3\): the rule gives \(4\cdot\frac12-3=-1\), and \(\int_0^1(4x-3)\,dx=-1\). For \(x^2\) it gives \(\frac14\) instead of \(\frac13\); for \(x^3\), \(\frac18\) instead of \(\frac14\).`,
    build(C) {
      P.setView(-0.05, 1.05, -3.2, 1.2, { xticks: [0, 0.5, 1], yticks: [-3, -2, -1, 0, 1] });
      P.fn(x => 4 * x - 3, { color: "curve", width: 3 });
      P.band(0, 1, -1, 0, { color: "pos", alpha: 0.2 });
      P.pt(0.5, -1, { color: "gold", r: 6 });
      setPlotTitle(TeX`A straight line and the midpoint rectangle`); P.draw();
      cards(C, [TeX`\(x^2\)`, TeX`\(4x-3\)`, TeX`\(x^3\)`]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 2 ? ["done", "Right! For a straight line the triangles above and below the rectangle cancel exactly."] : ["wrong", "That one has degree above 1; check the rule against the exact integral."];
    } },

  { nav: "Composite rule", title: "Two midpoints",
    instr: TeX`<p>Compute the composite midpoint rule \(M_2\) for \(\int_0^1\frac{dx}{1+x^2}\): \(h=0.5\), midpoints \(0.25\) and \(0.75\). (4 decimals)</p>`,
    hints: [TeX`\(f(0.25)=\frac{1}{1.0625}\approx0.941176\) and \(f(0.75)=\frac{1}{1.5625}=0.64\).`, TeX`\(M_2=0.5\,(0.941176+0.64)\).`],
    answer: TeX`\(M_2=0.5\,(0.941176+0.64)\approx0.7906\); error \(0.0052\), against \(0.0146\) for one midpoint.`,
    build(C) {
      rectPlot(fx, 0, 1, 2, 0.5, "pos", EXV, TeX`\(M_2\) for \(\int_0^1\frac{dx}{1+x^2}\)`);
      const inp = field(C, TeX`\(M_2=\)`, "ans1");
      return () => near(parseNum(inp.value), midN(fx, 0, 1, 2), 1e-4) ? ["done", "Correct! Halving h cut the error by almost a factor of 3 here, and by 4 for larger n."] : ["wrong", "Not quite. Add the two heights and multiply by h = 0.5."];
    } },

  { nav: "Read the slopes", title: "Double n, divide the error by …",
    instr: TeX`<p>The plot shows \(|I-R_n|\) (red) and \(|I-M_n|\) (green) for \(\int_0^1\frac{dx}{1+x^2}\) on a log scale. When \(n\) is doubled, the <b>midpoint</b> error is divided by about</p>`,
    hints: [TeX`The composite midpoint error is \(\frac{b-a}{24}h^2f''(c)\). What happens to \(h^2\) when \(h\) is halved?`],
    answer: TeX`About \(4\): \(0.0013\to3.3\times10^{-4}\to8.1\times10^{-5}\). The rectangle error, of order \(h\), only halves.`,
    build(C) {
      P.setView(0, 66, 1e-6, 1, { xticks: [1, 8, 16, 32, 64], ylog: true });
      const ns = [1, 2, 4, 8, 16, 32, 64];
      const line = (g, col) => { for (let k = 0; k < ns.length; k++) { const e = Math.abs(I_EX - g(fx, 0, 1, ns[k])); P.pt(ns[k], e, { color: col, r: 5 }); if (k) P.seg(ns[k - 1], Math.abs(I_EX - g(fx, 0, 1, ns[k - 1])), ns[k], e, { color: col, width: 2 }); } };
      line(rectN, "neg"); line(midN, "pos");
      setPlotTitle(TeX`Errors against \(n\): rectangle (red), midpoint (green)`); P.draw();
      cards(C, ["2", "4", "8"]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 2 ? ["done", "Right! Order h²: halve h and the error drops by 4."] : ["wrong", "Look at the green points for n = 8, 16, 32."];
    } },

  { nav: "How many pieces?", title: "Choose n from the bound",
    instr: TeX`<p>For \(\int_0^1\frac{dx}{1+x^2}\), \(\max|f''|=2\), so the composite midpoint error is at most \(\frac{1}{24}h^2\cdot2\) with \(h=\frac1n\). What is the smallest \(n\) that guarantees an error of at most \(10^{-4}\)?</p>`,
    hints: [TeX`Solve \(\frac{2}{24n^2}\le10^{-4}\), i.e. \(n^2\ge\frac{10^4}{12}\).`],
    answer: TeX`\(n^2\ge833.3\), so \(n\ge28.87\): \(n=29\) (true error \(2.5\times10^{-5}\)).`,
    build(C) {
      const draw = n => rectPlot(fx, 0, 1, n, 0.5, "pos", EXV, TeX`\(n=${n}\): bound \(=${(1 / (12 * n * n)).toExponential(2)}\), true error \(=${Math.abs(I_EX - midN(fx, 0, 1, n)).toExponential(2)}\)`);
      slider(C, "n", "s1", 1, 40, 1, 8, v => draw(v));
      const inp = field(C, TeX`\(n=\)`, "ans1");
      return () => near(parseNum(inp.value), 29, 1e-9) ? ["done", "Correct! The bound is safe; the true error is even smaller."] : ["wrong", "Not quite. Solve 1/(12 n²) ≤ 0.0001 and round up."];
    } },

  { nav: "Fooled by samples", title: "When does the midpoint rule return 0?",
    instr: TeX`<p>The exact value of \(\int_0^1\bigl(1+\cos 8\pi x\bigr)\,dx\) is \(1\). Drag \(n\) for the composite midpoint rule. For which \(n\) does \(M_n\) return \(0\)?</p>`,
    hints: ["Look for the n at which every midpoint lands in a trough of the curve."],
    answer: TeX`\(n=4\): the midpoints \(\frac18,\frac38,\frac58,\frac78\) all land where \(f=0\). The rule only sees its samples; from \(n=5\) on it gives \(1\).`,
    build(C) {
      const g = x => 1 + Math.cos(8 * Math.PI * x);
      const draw = n => rectPlot(g, 0, 1, n, 0.5, "pos", { box: [-0.05, 1.05, 0, 2.2], xticks: [0, 0.25, 0.5, 0.75, 1], yticks: [0, 1, 2] }, TeX`\(n=${n}\): \(M_n=${midN(g, 0, 1, n).toFixed(4)}\)`);
      slider(C, "n", "s1", 1, 12, 1, 3, v => draw(v));
      const inp = field(C, TeX`\(n=\)`, "ans1");
      return () => near(parseNum(inp.value), 4, 1e-9) ? ["done", "Correct! Nothing in the numbers warns you: check with a different n."] : ["wrong", "Not quite. Drag n and read M_n in the title."];
    } },

  { nav: "The algorithm", title: "Put the composite midpoint rule in order",
    instr: `<p>Put the steps in the right order using the menus.</p>`,
    hints: ["h is needed before any midpoint can be found; the sum is multiplied by h at the very end."],
    answer: "1. h = (b − a)/n, sum = 0  2. For i = 0, …, n − 1  3. add f(a + (i + 1/2) h) to the sum  4. Return h · sum",
    build(C) {
      const steps = ["h = (b − a)/n, sum = 0", "For i = 0, …, n − 1", "add f(a + (i + 1/2) h) to the sum", "Return h · sum"];
      const order = [3, 1, 0, 2];
      const grid = el("div", { className: "order" }); C.append(grid);
      const sels = [0, 1, 2, 3].map(k => {
        const s = el("select", { id: `dd${k + 1}` });
        s.append(el("option", { value: "" }, "— choose —"), ...order.map(i => { const o = el("option", { value: i }); o.textContent = steps[i]; return o; }));
        grid.append(el("label", { htmlFor: `dd${k + 1}`, className: "steplabel" }, `Step ${k + 1}`), s); return s;
      });
      rectPlot(fx, 0, 1, 4, 0.5, "pos", EXV, TeX`\(M_4\approx${midN(fx, 0, 1, 4).toFixed(4)}\) for \(\int_0^1\frac{dx}{1+x^2}\)`);
      return () => {
        const v = sels.map(s => s.value);
        if (v.includes("")) return ["wrong", "Choose an option for every step."];
        if (new Set(v).size < 4) return ["wrong", "Each option should be used exactly once."];
        const bad = v.findIndex((x, k) => +x !== k);
        return bad >= 0 ? ["wrong", `Step ${bad + 1} is not in the right place yet.`] : ["done", "Perfect order! n function values, the same cost as the rectangle rule."];
      };
    } },
];

startPractice({
  store: "nm-lec30-integration-intro-v1", lecture: "Lecture 30", tasks: TASKS,
  finalPlot() { rectPlot(fx, 0, 1, 8, 0.5, "pos", EXV, TeX`\(M_8\): error \(3.3\times10^{-4}\)`); },
});
