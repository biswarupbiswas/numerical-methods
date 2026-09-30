/* Lecture 5 — Fixed-Point Iteration: practice tasks. */
"use strict";
const R = 2.094551481542327;                       // root of x^3 - 2x - 5
const COSFIX = 0.7390851332151607;
const G = {
  g1: [x => x ** 3 - x - 5, "neg", "x^3 - x - 5"],
  g2: [x => Math.cbrt(2 * x + 5), "pos", "(2x+5)^{1/3}"],
  g3: [x => Math.sqrt((2 * x + 5) / x), "curve", "\\sqrt{(2x+5)/x}"],
  g4: [x => (2 * x + 5) / x ** 2, "gold", "(2x+5)/x^2"],
};
const iterate = (g, x0, n) => { const xs = [x0]; for (let k = 0; k < n; k++) { const v = g(xs.at(-1)); if (!Number.isFinite(v) || Math.abs(v) > 1e7) break; xs.push(v); } return xs; };

/** y = g(x), the diagonal and a cobweb from x0 on a square view [lo, hi]². */
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
  P.pt(x0, lo, { color: "ink", r: 5 });
  if (title) setPlotTitle(title);
  P.draw();
  return xs;
}

const TASKS = [
  { nav: "Is it a fixed point?", title: "Is it a fixed point?",
    instr: TeX`<p>A number \(c\) is a <b>fixed point</b> of \(g\) if \(g(c) = c\).</p><p>Is \(c = 2\) a fixed point of \(g(x) = x^2 - 2\)?</p>`,
    hints: [TeX`Compute \(g(2) = 2^2 - 2\).`],
    answer: TeX`Yes: \(g(2) = 4 - 2 = 2\). (So is \(c = -1\).)`,
    build(C) {
      const g = x => x * x - 2;
      P.setView(-2.5, 3, -2.5, 3, { xlabel: "x" }); P.seg(-2.5, -2.5, 3, 3, { color: "muted", dash: true, width: 1.5 }); P.fn(g);
      P.tex(2.6, 2.3, "y = x", { color: "muted", size: 15 }); P.tex(1.2, 2.6, "y = x^2 - 2", { color: "curve", size: 15 });
      setPlotTitle(TeX`\(y = g(x)\) and the diagonal \(y = x\)`); P.draw();
      cards(C, ["Yes", "No"]);
      return () => {
        if (!S.choice) return ["wrong", "Choose Yes or No."];
        if (S.choice !== 1) return ["wrong", TeX`Compute \(g(2)\) and compare it with \(2\).`];
        P.pt(2, 2, { color: "pos", r: 8 }); P.pt(-1, -1, { color: "pos", r: 8 }); P.draw();
        return ["done", TeX`Right! \(g(2) = 2\). Fixed points are exactly where the curve meets the diagonal: here \(c = 2\) and \(c = -1\).`];
      };
    } },

  { nav: "The cosine experiment", title: "Press cos once",
    instr: TeX`<p>Start with \(x_0 = 1\) and iterate \(x_{n+1} = \cos x_n\) (in radians).</p><p>What is \(x_1 = \cos 1\)? (4 decimals)</p>`,
    hints: ["Make sure your calculator is in radians.", TeX`\(\cos 1 \approx 0.54\).`],
    answer: TeX`\(x_1 = \cos 1 \approx 0.5403\).`,
    build(C) {
      cobweb(Math.cos, 1, 0, 0, 1.6, TeX`\(y = \cos x\) and \(y = x\)`);
      const inp = field(C, TeX`\(x_1 =\)`, "ans1");
      return () => {
        if (!(Math.abs(parseNum(inp.value) - Math.cos(1)) <= 5e-4)) return ["wrong", "Not quite. Is your calculator in radians?"];
        cobweb(Math.cos, 1, 1, 0, 1.6, TeX`\(x_1 = \cos 1 \approx 0.5403\)`);
        return ["done", TeX`Correct! Keep pressing cos and the values settle on \(0.7390851\ldots\)`];
      };
    } },

  { nav: "Draw a cobweb", title: "Where does the cobweb end?",
    instr: TeX`<p>Drag the starting point \(x_0\). The gold cobweb shows the iteration \(x_{n+1} = \cos x_n\).</p>
               <p>Whatever \(x_0\) you choose in \([0, 1.6]\), where do the iterates end up?</p>`,
    hints: ["Try several starting points and look at the last value.", "The limit is where the curve meets the diagonal."],
    answer: TeX`Always at \(c \approx 0.739\), the fixed point of \(\cos\).`,
    build(C) {
      const live = el("div", { className: "live" });
      slider(C, "x_0", "sa", 0, 1.6, 0.01, 0.1, v => {
        const xs = cobweb(Math.cos, v, 12, 0, 1.6, "Cobweb for cos x");
        live.innerHTML = TeX`\(x_1 = ${xs[1].toFixed(4)}\), \(x_2 = ${xs[2].toFixed(4)}\), …, \(x_{12} = ${xs[12].toFixed(4)}\)`; typeset(live);
      });
      C.append(live);
      cards(C, [TeX`At \(0\)`, TeX`At about \(0.739\)`, TeX`At \(1\)`, TeX`It depends on \(x_0\)`]);
      return () => {
        if (!S.choice) return ["wrong", "Choose one of the options."];
        if (S.choice !== 2) return ["wrong", "Move the slider to a few different places and compare the last value."];
        return ["done", TeX`Right! Every start in \([0, 1.6]\) spirals in to \(c \approx 0.739\), where \(\cos c = c\).`];
      };
    } },

  { nav: "Rewrite as x = g(x)", title: "Which rewrite is wrong?",
    instr: TeX`<p>We want to solve \(x^3 - 2x - 5 = 0\) by writing it as \(x = g(x)\).</p><p>Which of these is <b>not</b> a correct rearrangement?</p>`,
    hints: [TeX`Substitute each one back: does \(x = g(x)\) give \(x^3 - 2x - 5 = 0\)?`, TeX`For example \(x = \frac{x^3 - 5}{2}\) gives \(2x = x^3 - 5\), which is correct.`],
    answer: TeX`\(x = x^3 - 2x + 5\): it gives \(x^3 - 3x + 5 = 0\), a different equation.`,
    build(C) {
      P.setView(1.5, 3, -4, 12, { xlabel: "x" }); P.fn(x => x ** 3 - 2 * x - 5); P.pt(R, 0, { color: "pos", r: 6 });
      setPlotTitle(TeX`\(f(x) = x^3 - 2x - 5\), root \(r \approx 2.0946\)`); P.draw();
      cards(C, [TeX`\(x = (2x+5)^{1/3}\)`, TeX`\(x = \frac{x^3 - 5}{2}\)`, TeX`\(x = x^3 - 2x + 5\)`, TeX`\(x = \frac{2x+5}{x^2}\)`]);
      return () => {
        if (!S.choice) return ["wrong", "Choose one of the options."];
        if (S.choice !== 3) return ["wrong", "That one is correct: substitute it back and simplify."];
        return ["done", TeX`Right! \(x = x^3 - 2x + 5\) means \(x^3 - 3x + 5 = 0\), not our equation.`];
      };
    } },

  { nav: "One step", title: "One step of the cube root form",
    instr: TeX`<p>Iterate \(x_{n+1} = (2x_n + 5)^{1/3}\) from \(x_0 = 2\).</p><p>Compute \(x_1\) (4 decimals).</p>`,
    hints: [TeX`\(2\cdot2 + 5 = 9\).`, TeX`\(9^{1/3} \approx 2.08\).`],
    answer: TeX`\(x_1 = 9^{1/3} \approx 2.0801\).`,
    build(C) {
      cobweb(G.g2[0], 2, 0, 1.98, 2.12, TeX`\(y = (2x+5)^{1/3}\)`, "pos");
      const inp = field(C, TeX`\(x_1 =\)`, "ans1");
      return () => {
        if (!(Math.abs(parseNum(inp.value) - Math.cbrt(9)) <= 5e-4)) return ["wrong", "Not quite. Take the cube root of 9."];
        cobweb(G.g2[0], 2, 8, 1.98, 2.12, "A staircase up to the fixed point", "pos");
        return ["done", TeX`Correct! \(x_1 \approx 2.0801\). The cobweb is a staircase climbing to \(r \approx 2.0946\).`];
      };
    } },

  { nav: "Converge or diverge?", title: "Which one flies apart?",
    instr: TeX`<p>Click each rearrangement to see its cobweb from \(x_0 = 2\).</p><p>Which one gives a spiral that <b>moves away</b> from the fixed point?</p>`,
    hints: ["A diverging spiral gets wider with every loop.", "Look for the one that is steeper than the diagonal near the crossing."],
    answer: TeX`\(x = \frac{2x+5}{x^2}\): its spiral swings wider and wider (\(2.25, 1.88, 2.49, 1.61, \ldots\)).`,
    build(C) {
      const keys = ["g2", "g3", "g4", "g1"], views = { g1: [-6, 3], g2: [1.98, 2.12], g3: [2.0, 2.14], g4: [0.8, 4.0] };
      cobweb(G.g2[0], 2, 0, 1.98, 2.12, "Pick a rearrangement", "pos");
      const btns = cards(C, keys.map(k => TeX`\(x = ${G[k][2]}\)`));
      btns.forEach((b, i) => b.addEventListener("click", () => {
        const k = keys[i]; cobweb(G[k][0], 2, k === "g1" ? 3 : 10, ...views[k], TeX`\(x = ${G[k][2]}\)`, G[k][1]);
      }));
      return () => {
        if (!S.choice) return ["wrong", "Choose one of the rearrangements."];
        if (S.choice === 4) return ["wrong", "That one diverges too, but it explodes rather than spiralling. Look for a spiral."];
        if (S.choice !== 3) return ["wrong", "That cobweb closes in on the fixed point."];
        return ["done", "Right! It spirals outwards. The cube root and square root forms converge; the other two diverge."];
      };
    } },

  { nav: "Existence", title: "Does g map [2, 3] into itself?",
    instr: TeX`<p>\(g(x) = (2x+5)^{1/3}\) is increasing and \(g(2) \approx 2.0801\).</p><p>Compute \(g(3)\) (4 decimals). If both values lie in \([2, 3]\), a fixed point is guaranteed.</p>`,
    hints: [TeX`\(2\cdot3 + 5 = 11\).`, TeX`\(11^{1/3} \approx 2.224\).`],
    answer: TeX`\(g(3) = 11^{1/3} \approx 2.2240\). Both values are in \([2,3]\), so \(g([2,3]) \subseteq [2,3]\) and a fixed point exists.`,
    build(C) {
      P.setView(1.9, 3.1, 1.9, 3.1, { xlabel: "x" });
      [[2, 2, 3, 2], [3, 2, 3, 3], [3, 3, 2, 3], [2, 3, 2, 2]].forEach(([a, b, c, d]) => P.seg(a, b, c, d, { color: "gold", width: 2.5 }));
      P.seg(1.9, 1.9, 3.1, 3.1, { color: "muted", dash: true, width: 1.5 }); P.fn(G.g2[0], { color: "pos", domain: [2, 3] });
      setPlotTitle(TeX`The box \([2,3] \times [2,3]\)`); P.draw();
      const inp = field(C, TeX`\(g(3) =\)`, "ans1");
      return () => {
        if (!(Math.abs(parseNum(inp.value) - Math.cbrt(11)) <= 5e-4)) return ["wrong", "Not quite. Take the cube root of 11."];
        P.pt(2, Math.cbrt(9), { color: "pos", r: 6 }); P.pt(3, Math.cbrt(11), { color: "pos", r: 6 }); P.pt(R, R, { color: "ink", r: 6 }); P.draw();
        return ["done", TeX`Correct! The graph stays inside the box, so it must cross the diagonal: a fixed point exists in \([2, 3]\).`];
      };
    } },

  { nav: "Error ratio", title: "How fast does it converge?",
    instr: TeX`<p>For the cube root form, the errors \(|x_n - r|\) for \(n = 2, 3, 4\) are \(2.2\times10^{-3}\), \(3.3\times10^{-4}\), \(5.1\times10^{-5}\).</p>
               <p>By roughly what factor does the error shrink at each step?</p>`,
    hints: [TeX`Divide consecutive errors, e.g. \(\frac{3.3\times10^{-4}}{2.2\times10^{-3}}\).`],
    answer: TeX`About \(0.15\) each step: linear convergence. (Next lecture shows this is \(g'(r) \approx 0.152\).)`,
    build(C) {
      const xs = iterate(G.g2[0], 2, 9);
      P.setView(-0.5, 9.5, 1e-9, 1, { xlabel: "n", ylog: true, xticks: [0, 2, 4, 6, 8] });
      let prev = null; xs.forEach((x, n) => { const e = Math.abs(x - R); if (prev) P.seg(prev[0], prev[1], n, e, { color: "pos", width: 2 }); P.pt(n, e, { color: "pos", r: 5 }); prev = [n, e]; });
      setPlotTitle(TeX`Error \(|x_n - r|\) (log scale)`); P.draw();
      const inp = field(C, "factor ≈", "ans1");
      return () => {
        const v = parseNum(inp.value);
        if (!Number.isFinite(v)) return ["wrong", "Type a number, for example 0.5."];
        if (Math.abs(v - 0.152) > 0.025) return ["wrong", "Not quite. Divide one error by the previous one."];
        return ["done", TeX`Correct! A constant factor \(\approx 0.15\): linear convergence, a straight line on the log plot.`];
      };
    } },

  { nav: "Newton as g", title: "Newton as a fixed-point iteration",
    instr: TeX`<p>Newton's method is \(x_{n+1} = g(x_n)\) with \(g(x) = x - \frac{f(x)}{f'(x)}\), so \(g'(x) = \frac{f(x)\,f''(x)}{f'(x)^2}\).</p>
               <p>What is \(g'(r)\) at the root \(r\), where \(f(r) = 0\)?</p>`,
    hints: [TeX`Put \(f(r) = 0\) into the numerator.`],
    answer: TeX`\(g'(r) = 0\): Newton's \(g\) is flat at the fixed point, which is why it converges so fast.`,
    build(C) {
      const f = x => x ** 3 - 2 * x - 5, gN = x => x - f(x) / (3 * x * x - 2);
      cobweb(gN, 2.5, 3, 1.6, 2.6, TeX`Newton's \(g\) for \(x^3 - 2x - 5\)`, "pos");
      cards(C, [TeX`\(g'(r) = 0\)`, TeX`\(g'(r) = 1\)`, TeX`\(g'(r) = f'(r)\)`, TeX`\(g'(r) = -1\)`]);
      return () => {
        if (!S.choice) return ["wrong", "Choose one of the options."];
        if (S.choice !== 1) return ["wrong", TeX`Remember \(f(r) = 0\).`];
        return ["done", TeX`Right! \(g'(r) = 0\): the curve is flat where it meets the diagonal, so the cobweb reaches the fixed point almost at once.`];
      };
    } },
];

startPractice({
  store: "nm-lec05-fixed-point-v1", lecture: "Lecture 5", tasks: TASKS,
  finalPlot() { cobweb(Math.cos, 0.1, 20, 0, 1.6, TeX`\(\cos c = c,\ c \approx ${COSFIX.toFixed(7)}\)`); P.pt(COSFIX, COSFIX, { color: "gold", r: 9 }); P.draw(); },
});
