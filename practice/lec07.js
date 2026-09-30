/* Lecture 7 — Order of Convergence and Modified Newton: practice tasks. */
"use strict";
const F = x => Math.expm1(x * x), dF = x => 2 * x * Math.exp(x * x);
const newtonSeq = (f, df, x, n, m = 1) => { const xs = [x]; for (let k = 0; k < n; k++) xs.push(xs.at(-1) - m * f(xs.at(-1)) / df(xs.at(-1))); return xs; };
const logClose = (v, t, tol = 0.08) => v > 0 && Math.abs(Math.log10(v) - Math.log10(t)) <= tol;

/** Log-log plot of (log e_n, log e_{n+1}) for one or more error sequences. */
function logLog(series, title) {
  P.setView(-13, 0, -13, 0, { xlabel: TeX`\log_{10} e_n`, xticks: [-12, -9, -6, -3, 0], yticks: [-12, -9, -6, -3, 0] });
  series.forEach(({ errs, color }) => {
    let prev = null;
    for (let i = 0; i + 1 < errs.length; i++) {
      const p = [Math.log10(errs[i]), Math.log10(errs[i + 1])];
      if (prev) P.seg(prev[0], prev[1], p[0], p[1], { color, width: 2 });
      P.pt(p[0], p[1], { color, r: 6 }); prev = p;
    }
  });
  setPlotTitle(title); P.draw();
}

const TASKS = [
  { nav: "Estimate the order", title: "Estimate the order from data",
    instr: TeX`<p>Three consecutive errors of a method are \(e_{n-1} = 1.0\times10^{-3}\), \(e_n = 1.1\times10^{-6}\), \(e_{n+1} = 1.2\times10^{-12}\).</p>
               <p>Estimate the order \(p \approx \dfrac{\log(e_{n+1}/e_n)}{\log(e_n/e_{n-1})}\).</p>`,
    hints: [TeX`\(\log_{10}(1.2\times10^{-12}/1.1\times10^{-6}) \approx -5.96\).`, TeX`\(\log_{10}(1.1\times10^{-6}/10^{-3}) \approx -2.96\).`],
    answer: TeX`\(p \approx \frac{-5.96}{-2.96} \approx 2.0\): quadratic (these are Newton's errors).`,
    build(C) {
      logLog([{ errs: [1e-3, 1.1e-6, 1.2e-12], color: "pos" }], TeX`\(\log e_{n+1}\) against \(\log e_n\)`);
      const inp = field(C, TeX`\(p \approx\)`, "ans1");
      return () => {
        if (!(Math.abs(parseNum(inp.value) - 2.01) <= 0.1)) return ["wrong", "Not quite. Take logs of the two ratios and divide."];
        return ["done", TeX`Correct! \(p \approx 2\): the points lie on a line of slope \(2\).`];
      };
    } },

  { nav: "Read the slope", title: "Read the order off the plot",
    instr: TeX`<p>The plot shows \(\log e_{n+1}\) against \(\log e_n\) for an unknown method. The slope of the points is its order.</p><p>Which method is it?</p>`,
    hints: ["Estimate the slope from the first and last points.", "It is steeper than 1 but clearly less steep than 2."],
    answer: TeX`The secant method: slope \(\approx 1.6\).`,
    build(C) {
      const f = x => x ** 3 + 2 * x ** 2 - x - 1, r = 0.8019377358048383; const s = [0, 1];
      for (let k = 0; k < 6; k++) { const a = s.at(-2), b = s.at(-1); s.push(b - f(b) * (b - a) / (f(b) - f(a))); }
      logLog([{ errs: s.slice(3, 9).map(x => Math.abs(x - r)), color: "gold" }], "An unknown method");
      P.seg(-13, -13, 0, 0, { color: "muted", dash: true, width: 1 }); P.seg(-6.5, -13, 0, 0, { color: "muted", dash: true, width: 1 });
      P.tex(-1.5, -0.6, "p = 1", { color: "muted", size: 13 }); P.tex(-4.8, -9.5, "p = 2", { color: "muted", size: 13 }); P.draw();
      cards(C, [TeX`Bisection (\(p = 1\))`, TeX`Secant (\(p \approx 1.618\))`, TeX`Newton (\(p = 2\))`]);
      return () => {
        if (!S.choice) return ["wrong", "Choose one of the options."];
        if (S.choice !== 2) return ["wrong", "Compare the gold points with the two dashed guide lines."];
        return ["done", TeX`Right! The slope is about \(1.6\): the secant method's golden-ratio order.`];
      };
    } },

  { nav: "Digits double", title: "Correct digits with order 2",
    instr: TeX`<p>A quadratically convergent method currently has about 3 correct digits.</p><p>About how many correct digits will it have two steps later?</p>`,
    hints: ["With order 2 the number of correct digits roughly doubles each step.", "3 → 6 → ?"],
    answer: "About 12 digits (3 → 6 → 12).",
    build(C) {
      P.setView(-0.6, 2.6, 0, 14, { xlabel: TeX`\text{step}`, xticks: [], yticks: [0, 3, 6, 9, 12] });
      [[0, 3], [1, 6]].forEach(([i, d]) => { P.seg(i, 0, i, d, { color: "pos", width: 30, cap: "butt" }); P.tex(i, d, String(d), { dy: -12 }); });
      P.tex(2, 1, "?", { size: 24, color: "gold" }); setPlotTitle("Correct digits per step"); P.draw();
      const inp = field(C, "digits ≈", "ans1");
      return () => {
        if (!(Math.abs(parseNum(inp.value) - 12) <= 1)) return ["wrong", "Not quite. Double the digits at each of the two steps."];
        return ["done", "Correct! 3 → 6 → 12: order 2 doubles the correct digits every step."];
      };
    } },

  { nav: "One-point test", title: "The order of a square-root iteration",
    instr: TeX`<p>For \(\sqrt a\) consider \(g(x) = \frac{x}{2}\left(3 - \frac{x^2}{a}\right)\). Then \(g'(x) = \frac32\left(1 - \frac{x^2}{a}\right)\) and \(g''(x) = -\frac{3x}{a}\).</p>
               <p>What is the order of convergence to \(r = \sqrt a\)?</p>`,
    hints: [TeX`Evaluate \(g'\) and \(g''\) at \(x = \sqrt a\).`, TeX`\(g'(\sqrt a) = 0\) and \(g''(\sqrt a) = -3/\sqrt a \ne 0\).`],
    answer: TeX`Order exactly \(2\): \(g'(\sqrt a) = 0\) but \(g''(\sqrt a) = -\frac{3}{\sqrt a} \ne 0\).`,
    build(C) {
      const a = 2, g = x => x / 2 * (3 - x * x / a);
      P.setView(1.2, 1.6, 1.2, 1.6, { xlabel: "x" }); P.seg(1.2, 1.2, 1.6, 1.6, { color: "muted", dash: true, width: 1.5 }); P.fn(g, { color: "pos" });
      P.pt(Math.SQRT2, Math.SQRT2, { color: "gold", r: 7 }); setPlotTitle(TeX`\(y = g(x)\) for \(a = 2\): flat at \(\sqrt2\)`); P.draw();
      cards(C, ["Order 1 (linear)", "Order 2 (quadratic)", "Order 3 (cubic)"]);
      return () => {
        if (!S.choice) return ["wrong", "Choose one of the options."];
        if (S.choice !== 2) return ["wrong", "Find the first derivative of g that does not vanish at √a."];
        return ["done", TeX`Right! The first non-zero derivative at \(\sqrt a\) is \(g''\), so the order is exactly \(2\).`];
      };
    } },

  { nav: "Find the multiplicity", title: "Find the multiplicity",
    instr: TeX`<p>Let \(f(x) = x^3 - 3x + 2\) and \(r = 1\). Then \(f(1) = 0\), \(f'(x) = 3x^2 - 3\), \(f''(x) = 6x\).</p><p>What is the multiplicity \(m\) of the root \(r = 1\)?</p>`,
    hints: [TeX`\(f'(1) = 0\). What about \(f''(1)\)?`, TeX`\(f(x) = (x-1)^2(x+2)\).`],
    answer: TeX`\(m = 2\): \(f(1) = f'(1) = 0\) and \(f''(1) = 6 \ne 0\). Indeed \(f = (x-1)^2(x+2)\).`,
    build(C) {
      P.setView(-2.5, 2, -1, 5, { xlabel: "x" }); P.fn(x => x ** 3 - 3 * x + 2); P.pt(1, 0, { color: "gold", r: 7 }); P.pt(-2, 0, { color: "pos", r: 6 });
      setPlotTitle(TeX`\(f(x) = x^3 - 3x + 2\) touches the axis at \(1\)`); P.draw();
      const inp = field(C, TeX`\(m =\)`, "ans1");
      return () => {
        if (parseNum(inp.value) !== 2) return ["wrong", "Not quite. Find the first derivative that is non-zero at x = 1."];
        return ["done", TeX`Correct! A double root: the curve touches the axis at \(x = 1\).`];
      };
    } },

  { nav: "Estimate m", title: "Estimate m from Newton's ratio",
    instr: TeX`<p>On some function, Newton's method converges slowly and the error ratio \(e_{n+1}/e_n\) settles at \(\rho = 0.75\).</p>
               <p>Using \(\rho = 1 - \frac1m\), what is the multiplicity \(m\)?</p>`,
    hints: [TeX`Solve \(0.75 = 1 - \frac1m\) for \(m\).`, TeX`\(m = \frac{1}{1 - \rho}\).`],
    answer: TeX`\(m = \frac{1}{1 - 0.75} = 4\).`,
    build(C) {
      const f = x => (x - 1) ** 4 * (x + 1), df = x => 4 * (x - 1) ** 3 * (x + 1) + (x - 1) ** 4, xs = newtonSeq(f, df, 2, 12);
      P.setView(0.5, 12.5, 0, 1, { xlabel: "n", yticks: [0, 0.25, 0.5, 0.75, 1] });
      for (let n = 1; n < 12; n++) P.pt(n, Math.abs(xs[n + 1] - 1) / Math.abs(xs[n] - 1), { color: "neg", r: 5 });
      P.seg(0.5, 0.75, 12.5, 0.75, { color: "gold", dash: true, width: 1.5 }); setPlotTitle(TeX`Newton's error ratio \(e_{n+1}/e_n\)`); P.draw();
      const inp = field(C, TeX`\(m =\)`, "ans1");
      return () => {
        if (parseNum(inp.value) !== 4) return ["wrong", "Not quite. Compute 1/(1 − ρ)."];
        return ["done", TeX`Correct! A root of multiplicity \(4\), so the modified Newton method should use \(m = 4\).`];
      };
    } },

  { nav: "Rate at a triple root", title: "Newton at a triple root",
    instr: TeX`<p>At a root of multiplicity \(m\), Newton's iteration function has \(g'(r) = 1 - \frac1m\).</p><p>What is the rate of convergence at a triple root? (3 decimals)</p>`,
    hints: [TeX`Put \(m = 3\).`],
    answer: TeX`\(1 - \frac13 = \frac23 \approx 0.667\): each step removes only a third of the error.`,
    build(C) {
      P.setView(-0.2, 2.2, -1.2, 1.2, { xlabel: "x" }); P.fn(x => 1.2 * (x - 1) ** 3); P.pt(1, 0, { color: "gold", r: 7 });
      setPlotTitle(TeX`A triple root: \(f = (x-1)^3\,q(x)\)`); P.draw();
      const inp = field(C, "rate =", "ans1");
      return () => {
        if (!(Math.abs(parseNum(inp.value) - 2 / 3) <= 2e-3)) return ["wrong", "Not quite. Evaluate 1 − 1/m with m = 3."];
        return ["done", TeX`Correct! \(g'(r) = \frac23\), so Newton is linear with rate \(0.667\) at a triple root.`];
      };
    } },

  { nav: "A modified step", title: "One modified Newton step",
    instr: TeX`<p>For \(f(x) = e^{x^2} - 1\) (double root at \(0\)) at \(x_0 = 0.5\): \(f(0.5) = 0.2840\) and \(f'(0.5) = 1.2840\).</p>
               <p>Compute the modified Newton step \(x_1 = x_0 - 2\,\frac{f(x_0)}{f'(x_0)}\) (4 decimals).</p>`,
    hints: [TeX`\(\frac{0.2840}{1.2840} \approx 0.2212\).`, TeX`\(x_1 = 0.5 - 2\times0.2212\).`],
    answer: TeX`\(x_1 = 0.5 - 2(0.2212) \approx 0.0576\), versus \(0.2788\) for plain Newton.`,
    build(C) {
      const plain = newtonSeq(F, dF, 0.5, 8), mod = newtonSeq(F, dF, 0.5, 3, 2);
      P.setView(-0.5, 8.5, 1e-14, 1, { xlabel: "n", ylog: true, xticks: [0, 2, 4, 6, 8] });
      plain.forEach((x, n) => P.pt(n, Math.abs(x), { color: "neg", r: 5 }));
      mod.forEach((x, n) => P.pt(n, Math.abs(x), { color: "pos", r: 6 }));
      P.tex(8.3, 3e-3, TeX`\text{Newton}`, { color: "neg", align: "right", size: 15 }); P.tex(3.3, 1e-12, TeX`\text{modified}`, { color: "pos", align: "left", size: 15 });
      setPlotTitle(TeX`Error \(|x_n|\): plain vs modified Newton`); P.draw();
      const inp = field(C, TeX`\(x_1 =\)`, "ans1");
      return () => {
        if (!(Math.abs(parseNum(inp.value) - 0.0576) <= 5e-4)) return ["wrong", "Not quite. Double the Newton correction f/f' before subtracting."];
        return ["done", TeX`Correct! \(x_1 \approx 0.0576\), then \(9.5\times10^{-5}\), then \(4.3\times10^{-13}\).`];
      };
    } },

  { nav: "Unknown m", title: "When m is unknown",
    instr: TeX`<p>You suspect a multiple root, but you don't know its multiplicity \(m\).</p><p>Which approach still converges quadratically?</p>`,
    hints: [TeX`Which function has \(r\) as a <b>simple</b> root, whatever \(m\) is?`],
    answer: TeX`Newton's method on \(u(x) = f(x)/f'(x)\): \(r\) is a simple root of \(u\) for any \(m\) (the cost: \(u'\) needs \(f''\)).`,
    build(C) {
      P.setView(-0.6, 0.6, -0.4, 0.4, { xlabel: "x" }); P.fn(F, { color: "muted", width: 2 }); P.fn(x => F(x) / dF(x), { color: "pos" });
      P.tex(0.45, 0.33, "f", { color: "muted", size: 16 }); P.tex(0.42, 0.14, "u = f/f'", { color: "pos", size: 16 });
      setPlotTitle(TeX`\(f\) touches the axis; \(u = f/f'\) crosses it`); P.draw();
      cards(C, ["Plain Newton on f", TeX`Newton on \(f\) with the step multiplied by \(2\)`, TeX`Newton on \(u = f/f'\)`, "Bisection on f"]);
      return () => {
        if (!S.choice) return ["wrong", "Choose one of the options."];
        if (S.choice === 1) return ["wrong", "Plain Newton is only linear at a multiple root."];
        if (S.choice === 2) return ["wrong", "That only works if m really is 2."];
        if (S.choice === 4) return ["wrong", "At an even multiplicity f does not change sign, so bisection has nothing to bracket."];
        return ["done", TeX`Right! \(u = f/f'\) has a simple root at \(r\), so Newton on \(u\) is quadratic without knowing \(m\).`];
      };
    } },
];

startPractice({
  store: "nm-lec07-order-v1", lecture: "Lecture 7", tasks: TASKS,
  finalPlot() {
    const r = 0.8019377358048383, f = x => x ** 3 + 2 * x ** 2 - x - 1, fp = x => 3 * x * x + 4 * x - 1;
    logLog([{ errs: newtonSeq(f, fp, 1, 4).map(x => Math.abs(x - r)), color: "pos" }], "Order 2: slope 2 on the log-log plot");
  },
});
