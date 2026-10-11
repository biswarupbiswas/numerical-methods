/* Lecture 32 — Simpson's 1/3 Rule: practice tasks. */
"use strict";

const fx = x => 1 / (1 + x * x);
const trapN = (g, a, b, n) => { const h = (b - a) / n; let s = (g(a) + g(b)) / 2; for (let i = 1; i < n; i++) s += g(a + i * h); return h * s; };
const simpN = (g, a, b, n) => { const h = (b - a) / n; let s = g(a) + g(b), p = 4; for (let i = 1; i < n; i++) { s += p * g(a + i * h); p = 6 - p; } return h / 3 * s; };

/** The parabola through (x0, g(x0)), (x1, g(x1)), (x2, g(x2)), with x1 the midpoint. */
function parab(g, x0, x2) {
  const x1 = (x0 + x2) / 2, y0 = g(x0), y1 = g(x1), y2 = g(x2);
  return x => y0 * (x - x1) * (x - x2) / ((x0 - x1) * (x0 - x2)) + y1 * (x - x0) * (x - x2) / ((x1 - x0) * (x1 - x2)) + y2 * (x - x0) * (x - x1) / ((x2 - x0) * (x2 - x1));
}

/** g on [a, b] with n/2 Simpson panels (a parabola on every pair of pieces). */
function simpPlot(g, a, b, n, color, view, title) {
  P.setView(...view.box, { xticks: view.xticks, yticks: view.yticks });
  const h = (b - a) / n;
  for (let i = 0; i < n; i += 2) {
    const x0 = a + i * h, x2 = x0 + 2 * h, p = parab(g, x0, x2);
    for (let k = 0; k < 40; k++) {               // fill under the parabola as thin bands
      const u0 = x0 + 2 * h * k / 40, u1 = u0 + 2 * h / 40, yc = p((u0 + u1) / 2);
      P.band(u0, u1, Math.min(0, yc), Math.max(0, yc), { color, alpha: 0.22 });
    }
    P.fn(p, { color, width: 2, domain: [x0, x2] });
    P.seg(x0, 0, x0, g(x0), { color, width: 1, alpha: 0.6 }); P.seg(x2, 0, x2, g(x2), { color, width: 1, alpha: 0.6 });
  }
  P.fn(g, { color: "curve", width: 3 });
  for (let i = 0; i <= n; i++) P.pt(a + i * h, g(a + i * h), { color: "gold", r: 5 });
  setPlotTitle(title); P.draw();
}
const EXV = { box: [-0.05, 1.05, 0, 1.15], xticks: [0, 0.25, 0.5, 0.75, 1], yticks: [0, 0.5, 1] };
const EXPV = { box: [-0.05, 1.05, 0, 2.9], xticks: [0, 0.5, 1], yticks: [0, 1, 2] };

const TASKS = [
  { nav: "One Simpson panel", title: "Simpson's rule for e to the x",
    instr: TeX`<p>Approximate \(\int_0^1 e^x\,dx\) by Simpson's rule \(\frac h3\big(f_0+4f_1+f_2\big)\) with \(h=\frac{b-a}{2}=0.5\). (4 decimals)</p>`,
    hints: [TeX`\(f_0=1\), \(f_1=e^{0.5}\approx1.648721\), \(f_2=e\approx2.718282\), and \(\frac h3=\frac16\).`],
    answer: TeX`\(\frac16\big(1+4\cdot1.648721+2.718282\big)\approx1.7189\). The exact value is \(e-1\approx1.718282\): the error is only \(-5.8\times10^{-4}\), against \(-0.1409\) for one trapezoid.`,
    build(C) {
      simpPlot(Math.exp, 0, 1, 2, "gold", EXPV, TeX`\(\int_0^1 e^x\,dx\) and the parabola through three points`);
      const inp = field(C, "Simpson's rule =", "ans1");
      return () => near(parseNum(inp.value), simpN(Math.exp, 0, 1, 2), 1e-4) ? ["done", "Correct! The parabola is almost indistinguishable from the curve."] : ["wrong", "Not quite. Weight the middle value by 4, the end values by 1, then multiply by h/3 = 1/6."];
    } },

  { nav: "Find the weight", title: "Which middle weight makes the rule exact?",
    instr: TeX`<p>Consider the rule \(\frac h3\big(f_0+w\,f_1+f_2\big)\) on \([0,2]\) with \(h=1\). Drag \(w\) until the rule integrates \(f(x)=x^2\) exactly (\(\int_0^2x^2\,dx=\frac83\)). Enter that \(w\).</p>`,
    hints: [TeX`The rule gives \(\frac13\big(0+w\cdot1+4\big)\). Set it equal to \(\frac83\).`],
    answer: TeX`\(\frac13(w+4)=\frac83\) gives \(w=4\): the weights \(1,4,1\) of Simpson's rule. They also make \(1\) and \(x\) exact, and even \(x^3\).`,
    build(C) {
      const g = x => x * x;
      const draw = w => {
        simpPlot(g, 0, 2, 2, "gold", { box: [-0.1, 2.1, 0, 4.3], xticks: [0, 1, 2], yticks: [0, 1, 2, 3, 4] },
          TeX`\(w=${w.toFixed(1)}\): rule \(=${((w + 4) / 3).toFixed(4)}\), exact \(=2.6667\)`);
      };
      slider(C, "w", "s1", 0, 6, 0.5, 2, v => draw(v));
      const inp = field(C, TeX`\(w=\)`, "ans1");
      return () => near(parseNum(inp.value), 4, 1e-9) ? ["done", "Correct! The weights 1, 4, 1 come out of the parabola."] : ["wrong", "Not quite. Watch the rule value in the plot title as you drag w."];
    } },

  { nav: "Cancel the errors", title: "Two thirds midpoint plus one third trapezoid",
    instr: TeX`<p>For \(\int_1^2\frac{dx}{x}=\ln2\) one trapezoid gives \(T=0.75\) and the midpoint rule gives \(M=\frac{1}{1.5}\approx0.666667\). Compute \(\frac{2M+T}{3}\). (4 decimals)</p>`,
    hints: [TeX`The two errors have opposite signs and \(I-T\approx-2\,(I-M)\), so the weights \(\frac23\) and \(\frac13\) cancel them.`],
    answer: TeX`\(\frac{2(0.666667)+0.75}{3}\approx0.6944\), which is Simpson's rule \(\frac16\big(1+4\cdot\frac23+\frac12\big)\). The error is \(-0.0013\), against \(-0.0569\) for \(T\) and \(+0.0265\) for \(M\).`,
    build(C) {
      P.setView(0.6, 0.8, -1, 1, { xticks: [0.6, 0.65, 0.7, 0.75, 0.8], noY: true });
      P.seg(0.6, 0, 0.8, 0, { color: "muted", width: 2 });
      const mk = (x, s, col, dy) => { P.pt(x, 0, { color: col, r: 7 }); P.tex(x, 0, s, { color: col, size: 18, dy }); };
      mk(0.75, "T", "neg", -22); mk(2 / 3, "M", "pos", -22); mk(Math.log(2), "I", "ink", 26);
      setPlotTitle(TeX`\(T\), \(M\) and the exact value \(I=\ln2\) on a number line`); P.draw();
      const inp = field(C, TeX`\(\frac{2M+T}{3}=\)`, "ans1");
      return () => near(parseNum(inp.value), (2 / 1.5 + 0.75) / 3, 1e-4) ? ["done", "Correct! The combination lands very close to ln 2."] : ["wrong", "Not quite. Double M, add T, divide by 3."];
    } },

  { nav: "Exact for cubics", title: "Simpson's rule on x cubed",
    instr: TeX`<p>Apply Simpson's rule to \(\int_0^2x^3\,dx\) with \(h=1\): \(\frac13\big(f(0)+4f(1)+f(2)\big)\). What value does it give?</p>`,
    hints: [TeX`\(f(0)=0\), \(f(1)=1\), \(f(2)=8\). Compare with \(\int_0^2x^3\,dx=\frac{2^4}{4}\).`],
    answer: TeX`\(\frac13(0+4+8)=4\), exactly \(\int_0^2x^3\,dx=4\). The curve lies above the parabola on one half and below on the other by the same area: the degree of precision is \(3\).`,
    build(C) {
      simpPlot(x => x ** 3, 0, 2, 2, "gold", { box: [-0.1, 2.1, -0.5, 8.5], xticks: [0, 1, 2], yticks: [0, 2, 4, 6, 8] },
        TeX`\(f(x)=x^3\) and its parabola through \(x=0,1,2\)`);
      const inp = field(C, "Simpson's rule =", "ans1");
      return () => near(parseNum(inp.value), 4, 1e-6) ? ["done", "Correct! Exact, although the rule was built from a parabola."] : ["wrong", "Not quite. Evaluate x³ at 0, 1, 2, weight 1, 4, 1, and multiply by h/3 = 1/3."];
    } },

  { nav: "Composite by hand", title: "Composite Simpson with four pieces",
    instr: TeX`<p>Compute \(S_4\) for \(\int_0^1e^{-x^2}\,dx\): \(h=0.25\), weights \(1,4,2,4,1\). The values are \(1,\ 0.939413,\ 0.778801,\ 0.569783,\ 0.367879\). (5 decimals)</p>`,
    hints: [TeX`Weighted sum \(=1+4(0.939413+0.569783)+2(0.778801)+0.367879\), then multiply by \(\frac h3=\frac{0.25}{3}\).`],
    answer: TeX`The weighted sum is \(8.962265\), so \(S_4=\frac{0.25}{3}\cdot8.962265\approx0.74686\). The exact value is \(0.746824\): error \(-3.1\times10^{-5}\).`,
    build(C) {
      const g = x => Math.exp(-x * x);
      simpPlot(g, 0, 1, 4, "gold", EXV, TeX`\(S_4\) for \(\int_0^1e^{-x^2}\,dx\): two parabolas`);
      const inp = field(C, TeX`\(S_4=\)`, "ans1");
      return () => near(parseNum(inp.value), simpN(g, 0, 1, 4), 2e-5) ? ["done", "Correct! Five function values, five correct digits."] : ["wrong", "Not quite. Odd nodes get weight 4, the middle even node weight 2, the ends weight 1."];
    } },

  { nav: "Read the slope", title: "Double n, divide the error by …",
    instr: TeX`<p>The plot shows \(|I-T_n|\) (red) and \(|I-S_n|\) (gold) for \(\int_0^1e^x\,dx\) on a log scale. When \(n\) is doubled, the <b>Simpson</b> error is divided by about</p>`,
    hints: [TeX`The composite Simpson error is \(-\frac{(b-a)h^4}{180}f^{(4)}(\mu)\). What happens to \(h^4\) when \(h\) is halved?`],
    answer: TeX`About \(16\): \(3.7\times10^{-5}\to2.3\times10^{-6}\to1.5\times10^{-7}\). The gold line is twice as steep as the red one (order \(h^4\) against \(h^2\)).`,
    build(C) {
      P.setView(0, 66, 1e-10, 1, { xticks: [2, 8, 16, 32, 64], ylog: true });
      const line = (g, ns, col) => { const E = n => Math.abs(Math.E - 1 - g(Math.exp, 0, 1, n)); for (let k = 0; k < ns.length; k++) { P.pt(ns[k], E(ns[k]), { color: col, r: 5 }); if (k) P.seg(ns[k - 1], E(ns[k - 1]), ns[k], E(ns[k]), { color: col, width: 2 }); } };
      line(trapN, [1, 2, 4, 8, 16, 32, 64], "neg"); line(simpN, [2, 4, 8, 16, 32, 64], "gold");
      setPlotTitle(TeX`Errors against \(n\): trapezoid (red), Simpson (gold)`); P.draw();
      cards(C, ["4", "8", "16"]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 3 ? ["done", "Right! Order h⁴: halve h and the error drops by 16."] : ["wrong", "Compare the gold points for n = 8, 16, 32."];
    } },

  { nav: "Extrapolate", title: "Simpson from two trapezoids",
    instr: TeX`<p>For \(\int_0^1\frac{dx}{1+x^2}=\frac\pi4\) we know \(T_4=0.782794\) and \(T_8=0.784747\). Use \(S_{2n}=\frac{4T_{2n}-T_n}{3}\) to get \(S_8\). (4 decimals)</p>`,
    hints: [TeX`\(4T_8=3.138988\); subtract \(T_4\) and divide by \(3\).`],
    answer: TeX`\(S_8=\frac{3.138988-0.782794}{3}\approx0.7854\). To six decimals it is \(0.785398=\frac\pi4\) (true error \(3.8\times10^{-8}\)): the line through the two trapezoid values, extended to \(h=0\).`,
    build(C) {
      P.setView(-0.005, 0.07, 0.7815, 0.7860, { xticks: [0, 0.015625, 0.0625], yticks: [0.782, 0.783, 0.784, 0.785, 0.786], xlabel: "h^2" });
      const T4 = trapN(fx, 0, 1, 4), T8 = trapN(fx, 0, 1, 8), S8 = (4 * T8 - T4) / 3;
      P.seg(0, Math.PI / 4, 0.07, Math.PI / 4, { color: "muted", width: 1, dash: true });
      P.seg(0.0625, T4, 0, S8, { color: "gold", width: 2, dash: true });
      P.pt(0.0625, T4, { color: "neg", r: 6 }); P.tex(0.0625, T4, "T_4", { color: "neg", dy: 18 });
      P.pt(0.015625, T8, { color: "neg", r: 6 }); P.tex(0.015625, T8, "T_8", { color: "neg", dy: 18 });
      P.pt(0, S8, { color: "gold", r: 6, ring: true });
      setPlotTitle(TeX`Trapezoid values against \(h^2\); dashed: \(\frac\pi4\)`); P.draw();
      const inp = field(C, TeX`\(S_8=\)`, "ans1");
      return () => near(parseNum(inp.value), S8, 1e-4) ? ["done", "Correct! Extrapolating the trapezoidal rule gives Simpson's rule."] : ["wrong", "Not quite. Compute (4 T₈ − T₄)/3."];
    } },

  { nav: "How many pieces?", title: "Choose an even n for a tolerance",
    instr: TeX`<p>For \(\int_0^1e^x\,dx\), \(\max_{[0,1]}|f^{(4)}|=e\), so the composite Simpson error is at most \(\frac{h^4}{180}\,e\) with \(h=\frac1n\). What is the smallest <b>allowed</b> \(n\) that guarantees an error of at most \(10^{-5}\)?</p>`,
    hints: [TeX`Solve \(\frac{e}{180\,n^4}\le10^{-5}\): \(n^4\ge\frac{e}{180}\cdot10^5\approx1510\). Then remember that \(n\) must be even.`],
    answer: TeX`\(n\ge6.23\), so \(n=7\) would be enough for the bound, but Simpson needs an even \(n\): \(n=8\). The true error is then \(2.3\times10^{-6}\).`,
    build(C) {
      const draw = n => {
        if (n % 2) { simpPlot(Math.exp, 0, 1, n - 1, "gold", EXPV, TeX`\(n=${n}\) is odd: Simpson's \(1/3\) rule cannot pair the pieces`); return; }
        simpPlot(Math.exp, 0, 1, n, "gold", EXPV, TeX`\(n=${n}\): bound \(=${(Math.E / (180 * n ** 4)).toExponential(2)}\), true error \(=${Math.abs(Math.E - 1 - simpN(Math.exp, 0, 1, n)).toExponential(2)}\)`);
      };
      slider(C, "n", "s1", 2, 14, 1, 4, v => draw(v));
      const inp = field(C, TeX`\(n=\)`, "ans1");
      return () => {
        const v = parseNum(inp.value);
        if (near(v, 8, 1e-9)) return ["done", "Correct! Round up, then up again to the next even number."];
        if (near(v, 7, 1e-9)) return ["wrong", "Close: the bound allows 7, but Simpson's 1/3 rule needs an even number of pieces."];
        return ["wrong", "Not quite. Solve e/(180 n⁴) ≤ 0.00001 and round up to an even n."];
      };
    } },

  { nav: "The algorithm", title: "Put the composite Simpson rule in order",
    instr: `<p>Put the steps in the right order using the menus. (n is even.)</p>`,
    hints: ["h is needed before any node can be found; the end values carry weight 1; inside the loop the weight p alternates 4, 2, 4, …; the sum is multiplied by h/3 at the very end."],
    answer: "1. h = (b − a)/n  2. sum = f(a) + f(b), p = 4  3. For i = 1, …, n − 1: add p · f(a + i h) to the sum, then p = 6 − p  4. Return h/3 · sum",
    build(C) {
      const steps = ["h = (b − a)/n", "sum = f(a) + f(b), p = 4", "For i = 1, …, n − 1: add p · f(a + i h) to the sum, then p = 6 − p", "Return h/3 · sum"];
      const order = [2, 0, 3, 1];
      const grid = el("div", { className: "order" }); C.append(grid);
      const sels = [0, 1, 2, 3].map(k => {
        const s = el("select", { id: `dd${k + 1}` });
        s.append(el("option", { value: "" }, "— choose —"), ...order.map(i => { const o = el("option", { value: i }); o.textContent = steps[i]; return o; }));
        grid.append(el("label", { htmlFor: `dd${k + 1}`, className: "steplabel" }, `Step ${k + 1}`), s); return s;
      });
      simpPlot(fx, 0, 1, 4, "gold", EXV, TeX`\(S_4\approx${simpN(fx, 0, 1, 4).toFixed(6)}\) for \(\int_0^1\frac{dx}{1+x^2}\)`);
      return () => {
        const v = sels.map(s => s.value);
        if (v.includes("")) return ["wrong", "Choose an option for every step."];
        if (new Set(v).size < 4) return ["wrong", "Each option should be used exactly once."];
        const bad = v.findIndex((x, k) => +x !== k);
        return bad >= 0 ? ["wrong", `Step ${bad + 1} is not in the right place yet.`] : ["done", "Perfect order! n + 1 function values, weights 1, 4, 2, 4, …, 4, 1."];
      };
    } },
];

startPractice({
  store: "nm-lec32-simpson-13-v1", lecture: "Lecture 32", tasks: TASKS,
  finalPlot() { simpPlot(fx, 0, 1, 4, "gold", EXV, TeX`\(S_4=0.785392\): error \(6.0\times10^{-6}\)`); },
});
