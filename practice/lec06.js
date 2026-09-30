/* Lecture 6 — Convergence of Fixed-Point Iteration: practice tasks. */
"use strict";
const R = 2.094551481542327;                       // root of x^3 - 2x - 5
const f = x => x ** 3 - 2 * x - 5;
const FP = 3 * R * R - 2;                          // f'(r) ≈ 11.16
const g2 = x => Math.cbrt(2 * x + 5);
const LAM = 2 / 3 * Math.pow(9, -2 / 3);           // max |g2'| on [2, 3] ≈ 0.154
const iterate = (g, x0, n) => { const xs = [x0]; for (let k = 0; k < n; k++) { const v = g(xs.at(-1)); if (!Number.isFinite(v) || Math.abs(v) > 1e7) break; xs.push(v); } return xs; };
const XS = iterate(g2, 2, 12);

function cobweb(g, x0, n, lo, hi, title, color = "curve") {
  P.setView(lo, hi, lo, hi, { xlabel: "x" });
  P.seg(lo, lo, hi, hi, { color: "muted", dash: true, width: 1.5 });
  P.fn(g, { color });
  const xs = iterate(g, x0, n);
  let px = xs[0], py = lo;
  for (let k = 0; k < xs.length - 1; k++) {
    P.seg(px, py, xs[k], xs[k + 1], { color: "gold", width: 2 });
    P.seg(xs[k], xs[k + 1], xs[k + 1], xs[k + 1], { color: "gold", width: 2 });
    px = xs[k + 1]; py = xs[k + 1];
  }
  if (title) setPlotTitle(title);
  P.draw();
  return xs;
}
const logClose = (v, t, tol = 0.08) => v > 0 && Math.abs(Math.log10(v) - Math.log10(t)) <= tol;

const TASKS = [
  { nav: "Sweep the slope", title: "Which slopes converge?",
    instr: TeX`<p>Here \(g(x) = 2 + s\,(x - 2)\) is a straight line through the fixed point \(c = 2\) with slope \(s = g'(c)\). Drag \(s\) and watch the cobweb.</p>
               <p>For which slopes does the iteration converge?</p>`,
    hints: ["Try s = 0.5, −0.5, 1.5 and −1.5.", "Each step multiplies the distance to c by s."],
    answer: TeX`Exactly when \(|s| < 1\): staircase in for \(0 < s < 1\), spiral in for \(-1 < s < 0\).`,
    build(C) {
      const live = el("div", { className: "live" });
      slider(C, "s", "sa", -2, 2, 0.05, 0.5, s => {
        cobweb(x => 2 + s * (x - 2), 3.4, 16, 0, 4, TeX`\(g(x) = 2 + ${s.toFixed(2)}\,(x - 2)\)`);
        const kind = Math.abs(s) < 1 ? (s >= 0 ? "staircase in" : "spiral in") : (s >= 0 ? "staircase out" : "spiral out");
        live.innerHTML = `<span class="${Math.abs(s) < 1 ? "pos" : "neg"}">${kind}</span>`;
      });
      C.append(live);
      cards(C, [TeX`\(s < 1\)`, TeX`\(|s| < 1\)`, TeX`\(s > 0\)`, TeX`\(|s| > 1\)`]);
      return () => {
        if (!S.choice) return ["wrong", "Choose one of the options."];
        if (S.choice === 1) return ["wrong", "Try s = −1.5: it is less than 1, but does it converge?"];
        if (S.choice !== 2) return ["wrong", "Try slopes on both sides of 0, and larger than 1."];
        return ["done", TeX`Right! The distance to \(c\) is multiplied by \(s\) each step, so it shrinks exactly when \(|s| < 1\).`];
      };
    } },

  { nav: "Predict the cobweb", title: "Predict the cobweb",
    instr: TeX`<p>For \(g(x) = \sqrt{(2x+5)/x}\), the slope at the fixed point is \(g'(r) \approx -0.27\).</p><p>What does the cobweb look like?</p>`,
    hints: ["The sign tells you staircase or spiral; the size tells you in or out."],
    answer: TeX`A spiral that closes in: negative slope gives a spiral, \(|g'(r)| < 1\) makes it converge.`,
    build(C) {
      P.setView(2.0, 2.14, 2.0, 2.14, { xlabel: "x" }); P.seg(2, 2, 2.14, 2.14, { color: "muted", dash: true, width: 1.5 });
      P.fn(x => Math.sqrt((2 * x + 5) / x)); setPlotTitle(TeX`\(y = \sqrt{(2x+5)/x}\) and \(y = x\)`); P.draw();
      cards(C, ["Staircase in", "Spiral in", "Spiral out", "Staircase out"]);
      return () => {
        if (!S.choice) return ["wrong", "Choose one of the options."];
        if (S.choice !== 2) return ["wrong", TeX`Negative slope means the iterates alternate sides; \(|{-0.27}| < 1\) means they get closer.`];
        cobweb(x => Math.sqrt((2 * x + 5) / x), 2, 10, 2.0, 2.14, "A spiral closing in");
        return ["done", "Right! It spirals in, alternating above and below the fixed point."];
      };
    } },

  { nav: "Compute g′(r)", title: "The slope at the fixed point",
    instr: TeX`<p>For \(g(x) = (2x+5)^{1/3}\), \(g'(x) = \frac23 (2x+5)^{-2/3}\).</p><p>Compute \(g'(r)\) at \(r \approx 2.0946\) (3 decimals).</p>`,
    hints: [TeX`\(2r + 5 \approx 9.189\).`, TeX`\(9.189^{-2/3} \approx 0.2281\); multiply by \(\frac23\).`],
    answer: TeX`\(g'(r) \approx 0.152\).`,
    build(C) {
      cobweb(g2, 2, 8, 1.98, 2.12, TeX`\(y = (2x+5)^{1/3}\)`, "pos");
      const inp = field(C, TeX`\(g'(r) =\)`, "ans1");
      return () => {
        if (!(Math.abs(parseNum(inp.value) - 0.152) <= 0.003)) return ["wrong", "Not quite. Evaluate (2/3)(2r + 5)^(−2/3)."];
        return ["done", TeX`Correct! \(g'(r) \approx 0.152\): a staircase in, each error about \(0.152\) times the last.`];
      };
    } },

  { nav: "Find λ", title: "Find the contraction constant",
    instr: TeX`<p>On \([2, 3]\), \(g'(x) = \frac23 (2x+5)^{-2/3}\) is positive and decreasing.</p><p>What is \(\lambda = \max_{[2,3]} |g'(x)|\)? (3 decimals)</p>`,
    hints: ["A decreasing function is largest at the left end.", TeX`\(\lambda = g'(2) = \frac23 \cdot 9^{-2/3}\).`],
    answer: TeX`\(\lambda = g'(2) = \frac23\cdot 9^{-2/3} \approx 0.154\).`,
    build(C) {
      P.setView(2, 3, 0, 0.2, { xlabel: "x", yticks: [0, 0.05, 0.1, 0.15, 0.2] }); P.fn(x => 2 / 3 * Math.pow(2 * x + 5, -2 / 3), { color: "pos" });
      setPlotTitle(TeX`\(g'(x)\) on \([2, 3]\)`); P.draw();
      const inp = field(C, TeX`\(\lambda =\)`, "ans1");
      return () => {
        if (!(Math.abs(parseNum(inp.value) - LAM) <= 0.002)) return ["wrong", "Not quite. Evaluate g' at the end where it is largest."];
        P.seg(2, LAM, 3, LAM, { color: "gold", dash: true, width: 2 }); P.pt(2, LAM, { color: "gold", r: 7 }); P.draw();
        return ["done", TeX`Correct! \(\lambda \approx 0.154 < 1\), so \(g\) is a contraction on \([2, 3]\).`];
      };
    } },

  { nav: "A priori bound", title: "Bound the error in advance",
    instr: TeX`<p>With \(\lambda = 0.154\) and \(|x_1 - x_0| = 0.0801\), the a priori bound is \(|r - x_n| \le \frac{\lambda^n}{1-\lambda}\,|x_1 - x_0|\).</p>
               <p>Compute the bound for \(n = 3\). (You may type 3.5e-4.)</p>`,
    hints: [TeX`\(0.154^3 \approx 0.00365\) and \(1 - 0.154 = 0.846\).`, TeX`\(\frac{0.00365}{0.846}\times0.0801\).`],
    answer: TeX`\(\frac{0.154^3}{0.846}\times0.0801 \approx 3.46\times10^{-4}\) (the true error is \(3.34\times10^{-4}\)).`,
    build(C) {
      P.setView(-0.5, 8.5, 1e-8, 1, { xlabel: "n", ylog: true, xticks: [0, 2, 4, 6, 8] });
      for (let n = 0; n <= 8; n++) { P.pt(n, Math.abs(XS[n] - R), { color: "pos", r: 5 }); P.pt(n, LAM ** n / (1 - LAM) * 0.0801, { color: "gold", r: 7, ring: true }); }
      setPlotTitle(TeX`True error (green) and bound (gold rings)`); P.draw();
      const inp = field(C, "bound =", "ans1");
      return () => {
        if (!logClose(parseNum(inp.value), LAM ** 3 / (1 - LAM) * 0.0801, 0.06)) return ["wrong", "Not quite. Cube λ, divide by 1 − λ and multiply by 0.0801."];
        return ["done", TeX`Correct! About \(3.5\times10^{-4}\), and the true error \(3.34\times10^{-4}\) is indeed below it.`];
      };
    } },

  { nav: "How many steps?", title: "How many steps are enough?",
    instr: TeX`<p>We need \(\frac{0.154^n}{0.846}\,(0.0801) \le 10^{-10}\).</p><p>What is the smallest whole number \(n\)?</p>`,
    hints: [TeX`Take logarithms: \(n \ge \frac{\log(10^{-10}\cdot0.846/0.0801)}{\log 0.154}\).`, TeX`That gives \(n \ge 11.05\).`],
    answer: TeX`\(n = 12\), since \(n \ge 11.05\).`,
    build(C) {
      const live = el("div", { className: "live" });
      slider(C, "n", "sn", 1, 16, 1, 6, n => {
        const b = LAM ** n / (1 - LAM) * 0.0801;
        P.setView(0.5, 16.5, 1e-13, 1, { xlabel: "n", ylog: true, xticks: [2, 4, 6, 8, 10, 12, 14, 16] });
        P.seg(0.5, 1e-10, 16.5, 1e-10, { color: "neg", width: 2 });
        for (let k = 1; k <= 16; k++) P.pt(k, LAM ** k / (1 - LAM) * 0.0801, { color: "gold", r: 4 });
        P.pt(n, b, { color: "gold", r: 10, ring: true }); setPlotTitle(TeX`A priori bound vs \(\varepsilon = 10^{-10}\)`); P.draw();
        const [m, e] = b.toExponential(2).split("e");
        live.innerHTML = TeX`bound \(= ${m}\times10^{${+e}}\) <span class="${b <= 1e-10 ? "pos" : "neg"}">${b <= 1e-10 ? "✓" : "too big"}</span>`; typeset(live);
      });
      C.append(live);
      const inp = field(C, TeX`smallest \(n =\)`, "ans1");
      return () => {
        const v = parseNum(inp.value);
        if (v === 11) return ["wrong", "Close! At n = 11 the bound is still slightly above 10⁻¹⁰."];
        if (v !== 12) return ["wrong", "Not quite. Find where the ring first drops below the red line."];
        return ["done", "Correct! 12 steps guarantee an error below 10⁻¹⁰, before we compute a single iterate."];
      };
    } },

  { nav: "A posteriori bound", title: "Bound the error while iterating",
    instr: TeX`<p>During the run we have \(x_4 = 2.0945007\) and \(x_5 = 2.0945438\). The a posteriori bound is \(|r - x_5| \le \frac{\lambda}{1-\lambda}\,|x_5 - x_4|\) with \(\lambda = 0.154\).</p>
               <p>Compute this bound. (You may type 7.9e-6.)</p>`,
    hints: [TeX`\(|x_5 - x_4| \approx 4.31\times10^{-5}\).`, TeX`\(\frac{0.154}{0.846} \approx 0.182\).`],
    answer: TeX`\(0.182\times4.31\times10^{-5} \approx 7.85\times10^{-6}\) (the true error is \(7.72\times10^{-6}\)).`,
    build(C) {
      cobweb(g2, 2, 8, 1.98, 2.12, "The cube-root iteration", "pos");
      const inp = field(C, "bound =", "ans1");
      return () => {
        const want = LAM / (1 - LAM) * Math.abs(XS[5] - XS[4]);
        if (!logClose(parseNum(inp.value), want, 0.05)) return ["wrong", "Not quite. Multiply |x₅ − x₄| by λ/(1 − λ)."];
        return ["done", TeX`Correct! About \(7.9\times10^{-6}\), just above the true error \(7.7\times10^{-6}\). A practical stopping test.`];
      };
    } },

  { nav: "Tune the relaxation", title: "Tune the relaxation parameter",
    instr: TeX`<p>Iterate \(g(x) = x - \alpha\,f(x)\) for \(f(x) = x^3 - 2x - 5\). Then \(g'(r) = 1 - \alpha f'(r)\) with \(f'(r) \approx 11.16\).</p>
               <p>Drag \(\alpha\) until \(|g'(r)| < 0.05\), for very fast convergence.</p>`,
    hints: [TeX`You want \(\alpha f'(r) \approx 1\).`, TeX`Try \(\alpha\) near \(1/11.16 \approx 0.09\).`],
    answer: TeX`Any \(\alpha\) between about \(0.085\) and \(0.094\); the best is \(\alpha = 1/f'(r) \approx 0.0896\).`,
    build(C, T) {
      const live = el("div", { className: "live" }); let a = 0.05;
      slider(C, "\\alpha", "sa", 0, 0.25, 0.001, 0.05, v => {
        a = v; const s = 1 - a * FP;
        cobweb(x => x - a * f(x), 2.0, 10, 1.9, 2.3, TeX`\(g(x) = x - ${a.toFixed(3)}\,f(x)\)`, Math.abs(s) < 1 ? "pos" : "neg");
        live.innerHTML = TeX`\(g'(r) = ${s.toFixed(3)}\)`; typeset(live);
      });
      C.append(live);
      return () => {
        const s = 1 - a * FP;
        if (Math.abs(s) >= 1) return ["wrong", TeX`With \(g'(r) = ${s.toFixed(2)}\) the iteration diverges.`];
        if (Math.abs(s) >= 0.05) return ["wrong", TeX`\(g'(r) = ${s.toFixed(3)}\): it converges, but not fast enough yet.`];
        return ["done", TeX`Excellent! \(|g'(r)| < 0.05\). With \(\alpha = 1/f'(x_n)\) at every step, this becomes Newton's method.`];
      };
    } },

  { nav: "Which hypothesis fails?", title: "Two fixed points?",
    instr: TeX`<p>\(g(x) = x^2\) maps \([0, 1]\) into itself, but it has <b>two</b> fixed points there: \(0\) and \(1\).</p>
               <p>The contraction mapping theorem promises exactly one. Which hypothesis fails?</p>`,
    hints: [TeX`Check \(|g'(x)| = 2x\) on \([0, 1]\).`],
    answer: TeX`\(g\) is not a contraction on \([0,1]\): \(|g'(1)| = 2 > 1\), so no \(\lambda < 1\) works.`,
    build(C) {
      P.setView(-0.1, 1.2, -0.1, 1.2, { xlabel: "x" }); P.seg(-0.1, -0.1, 1.2, 1.2, { color: "muted", dash: true, width: 1.5 });
      P.fn(x => x * x); P.pt(0, 0, { color: "pos", r: 7 }); P.pt(1, 1, { color: "pos", r: 7 });
      setPlotTitle(TeX`\(y = x^2\) on \([0, 1]\)`); P.draw();
      cards(C, ["g is not continuous", "g does not map [0, 1] into itself", TeX`\(g\) is not a contraction: no \(\lambda < 1\)`]);
      return () => {
        if (!S.choice) return ["wrong", "Choose one of the options."];
        if (S.choice !== 3) return ["wrong", TeX`That one holds for \(x^2\) on \([0, 1]\).`];
        return ["done", TeX`Right! Near \(x = 1\) the slope is \(2\): \(g\) stretches distances there, so it is not a contraction. (The fixed point \(1\) repels; \(0\) attracts.)`];
      };
    } },
];

startPractice({
  store: "nm-lec06-fp-convergence-v1", lecture: "Lecture 6", tasks: TASKS,
  finalPlot() { cobweb(x => x - f(x) / FP, 2.0, 4, 1.9, 2.3, TeX`\(g'(r) = 0\): one step and done`, "pos"); P.pt(R, R, { color: "gold", r: 9 }); P.draw(); },
});
