/* Lecture 3 — Regula Falsi: practice tasks. */
"use strict";
const f = x => x ** 3 + 2 * x ** 2 - x - 1;
const ROOT = 0.8019377358048383;
const chordPoint = (a, fa, b, fb) => (a * fb - b * fa) / (fb - fa);

/** Regula Falsi steps [a, fa, b, fb, c]; Illinois halves the stored value of an endpoint kept twice. */
function rfSteps(a, b, n, illinois = false) {
  let fa = f(a), fb = f(b), side = 0; const out = [];
  for (let k = 0; k < n; k++) {
    const c = chordPoint(a, fa, b, fb), fc = f(c); out.push([a, fa, b, fb, c]);
    if (fa * fc < 0) { b = c; fb = fc; if (illinois && side === -1) fa /= 2; side = -1; }
    else { a = c; fa = fc; if (illinois && side === 1) fb /= 2; side = 1; }
  }
  return out;
}
const RF = rfSteps(0, 1, 10);            // RF[k] computes x_{k+2}
const ILL = rfSteps(0, 1, 8, true);

/** f, the bracket [a, b], the chord between (a, fa) and (b, fb) and its crossing. */
function drawChord(a, b, view, title, o = {}) {
  const [v0, v1, w0, w1] = view, fa = o.fa ?? f(a), fb = o.fb ?? f(b);
  P.setView(v0, v1, w0, w1, { xlabel: "x" }); P.fn(f);
  P.seg(a, 0, b, 0, { color: "gold", width: 7, cap: "butt", alpha: .85 });
  for (const [x, n] of [[a, "a"], [b, "b"]]) {
    P.seg(x, 0, x, f(x), { color: signCol(f(x)), dash: true, width: 1.5 }); P.pt(x, f(x), { color: signCol(f(x)), r: 7 });
    P.tex(x, 0, n, { dy: f(x) > 0 ? 17 : -17, size: 18 });
  }
  if (o.chord !== false) {
    P.seg(a, fa, b, fb, { color: o.chordColor || "gold", width: 2.5 });
    if (o.showC) { const c = chordPoint(a, fa, b, fb); P.pt(c, 0, { color: "ink", r: 6 }); P.tex(c, 0, "c", { dy: 18, size: 18 }); }
  }
  if (o.root) P.pt(ROOT, 0, { color: "pos", r: 5, ring: true });
  setPlotTitle(title); P.draw();
}
const V1 = [-0.1, 1.15, -1.3, 1.3];

const TASKS = [
  { nav: "The chord point", title: "Where does the chord cross?",
    instr: TeX`<p>Regula Falsi starts from a bracket. Here \(f(x) = x^3 + 2x^2 - x - 1\) on \([a, b] = [0, 1]\), with \(f(0) = -1\) and \(f(1) = 1\).</p>
               <p>Use \(c = \dfrac{a\,f(b) - b\,f(a)}{f(b) - f(a)}\) to find where the chord crosses the axis.</p>`,
    hints: [TeX`Numerator: \(0\cdot 1 - 1\cdot(-1) = 1\).`, TeX`Denominator: \(1 - (-1) = 2\).`],
    answer: TeX`\(c = \frac{0\cdot1 - 1\cdot(-1)}{1-(-1)} = \frac12 = 0.5\).`,
    build(C) {
      drawChord(0, 1, V1, TeX`The chord joining \((0, -1)\) and \((1, 1)\)`);
      const c = field(C, TeX`\(c =\)`, "ans1");
      return () => {
        if (!near(parseNum(c.value), 0.5)) return ["wrong", "Not quite. Put a = 0, b = 1, f(a) = −1, f(b) = 1 into the formula."];
        drawChord(0, 1, V1, TeX`\(c = 0.5\)`, { showC: true });
        return ["done", TeX`Correct! The chord crosses at \(c = 0.5\), the same as the first secant step.`];
      };
    } },

  { nav: "Keep the bracket", title: "Which part do we keep?",
    instr: TeX`<p>At \(c = 0.5\) we get \(f(0.5) = -0.875\).</p><p>Which part of \([0, 1]\) still contains the root?</p>`,
    hints: ["Keep the part whose two endpoints have opposite signs of f.", TeX`\(f(0.5)\) is negative, like \(f(0)\).`],
    answer: TeX`\([0.5, 1]\): \(f(0.5) < 0 < f(1)\).`,
    build(C) {
      drawChord(0, 1, V1, TeX`\(f(0.5) = -0.875\)`, { showC: true });
      P.pt(0.5, f(0.5), { color: "neg", r: 7 }); P.seg(0.5, 0, 0.5, f(0.5), { color: "neg", dash: true, width: 1.5 }); P.draw();
      cards(C, [TeX`\([0, 0.5]\)`, TeX`\([0.5, 1]\)`, "Both parts"]);
      return () => {
        if (!S.choice) return ["wrong", "Choose one of the options."];
        if (S.choice === 1) return ["wrong", TeX`\(f(0)\) and \(f(0.5)\) are both negative: no sign change there.`];
        if (S.choice === 3) return ["wrong", "Only one part can have a sign change here."];
        drawChord(0.5, 1, V1, TeX`New bracket \([0.5, 1]\)`, { root: true });
        return ["done", TeX`Right! The new bracket is \([0.5, 1]\), and the root is still trapped inside it.`];
      };
    } },

  { nav: "Chord vs midpoint", title: "Chord point vs midpoint",
    instr: TeX`<p>Drag \(a\) and \(b\). The gold chord gives the Regula Falsi point \(c\); the grey line is the bisection midpoint.</p>
               <p>Goal: find a valid bracket where \(c\) is <b>at least 5 times closer</b> to the root than the midpoint.</p>`,
    hints: ["The chord is a good guess when the curve is nearly straight between a and b.", TeX`Try a short bracket just around the root, for example \(a\) near \(0.78\) and \(b\) near \(0.9\).`],
    answer: TeX`For example \([0.78, 0.9]\): \(c \approx 0.7998\) is \(0.002\) from the root, while the midpoint \(0.84\) is \(0.038\) away, about 18 times farther.`,
    build(C) {
      let a = 0, b = 1.1; const live = el("div", { className: "live" });
      const redraw = () => {
        const ok = a < b && f(a) * f(b) < 0;
        drawChord(a, b, [-0.4, 1.4, -1.6, 3.2], "Chord point vs midpoint", { chord: ok, showC: ok, root: true });
        if (ok) { const m = (a + b) / 2; P.seg(m, -1.6, m, 3.2, { color: "muted", dash: true, width: 1.5 }); P.draw();
          const c = chordPoint(a, f(a), b, f(b)), ec = Math.abs(c - ROOT), em = Math.abs(m - ROOT);
          live.innerHTML = TeX`chord: \(|c - r| = ${ec.toFixed(4)}\)<br>midpoint: \(|m - r| = ${em.toFixed(4)}\)`; }
        else live.innerHTML = TeX`<span class="neg">Not a valid bracket: \(f(a)\,f(b)\) must be negative.</span>`;
        typeset(live);
      };
      slider(C, "a", "sa", -0.4, 1.4, 0.01, 0, v => { a = v; redraw(); });
      slider(C, "b", "sb", -0.4, 1.4, 0.01, 1.1, v => { b = v; redraw(); });
      C.append(live);
      return () => {
        if (!(a < b && f(a) * f(b) < 0)) return ["wrong", "First make [a, b] a valid bracket."];
        const c = chordPoint(a, f(a), b, f(b)), m = (a + b) / 2, ec = Math.abs(c - ROOT), em = Math.abs(m - ROOT);
        if (!(5 * ec < em)) return ["wrong", TeX`Now \(|c - r| = ${ec.toFixed(4)}\) and \(|m - r| = ${em.toFixed(4)}\). Keep trying.`];
        return ["done", "The chord point wins by a factor of 5 or more. When the curve is nearly straight, the chord is an excellent guess."];
      };
    } },

  { nav: "A step by hand", title: "A step by hand",
    instr: TeX`<p>After two steps the bracket is \([a, b] = [0.7333, 1]\) with \(f(a) = -0.2634\) and \(f(b) = 1\).</p>
               <p>Compute the next point \(x_4 = \dfrac{a\,f(b) - b\,f(a)}{f(b) - f(a)}\) (4 decimals).</p>`,
    hints: [TeX`Numerator: \(0.7333\cdot1 - 1\cdot(-0.2634) = 0.9967\).`, TeX`Denominator: \(1 - (-0.2634) = 1.2634\).`],
    answer: TeX`\(x_4 = 0.9967 / 1.2634 \approx 0.7889\).`,
    build(C) {
      const [a, fa, b, fb, c] = RF[2];
      drawChord(a, b, [0.6, 1.08, -0.5, 1.2], TeX`Bracket \([0.7333, 1]\)`);
      const inp = field(C, TeX`\(x_4 =\)`, "ans1");
      return () => {
        if (!(Math.abs(parseNum(inp.value) - c) <= 5e-4)) return ["wrong", "Not quite. Watch the minus sign in f(a)."];
        drawChord(a, b, [0.6, 1.08, -0.5, 1.2], TeX`\(x_4 \approx 0.7889\)`, { showC: true, root: true });
        return ["done", TeX`Correct! \(x_4 \approx 0.7889\). The secant method gave \(0.8338\) here, but Regula Falsi keeps the bracket.`];
      };
    } },

  { nav: "The stuck endpoint", title: "The stuck endpoint",
    instr: `<p>The plot shows the first six chords of Regula Falsi on this example.</p><p>Which endpoint of the bracket <b>never moves</b>?</p>`,
    hints: ["Look where all the chords meet.", TeX`Every new point lands on the left of the root, where \(f < 0\).`],
    answer: TeX`\(b = 1\). Every new point replaces \(a\), so all chords pivot around \((1, 1)\).`,
    build(C) {
      P.setView(-0.1, 1.15, -1.3, 1.3, { xlabel: "x" }); P.fn(f);
      RF.slice(0, 6).forEach(([a, fa, b, fb, c]) => { P.seg(a, fa, b, fb, { color: "gold", width: 2, alpha: .8 }); P.pt(c, 0, { color: "ink", r: 4 }); });
      P.pt(ROOT, 0, { color: "pos", r: 5, ring: true });
      setPlotTitle("Six Regula Falsi chords"); P.draw();
      cards(C, [TeX`The left endpoint \(a\)`, TeX`The right endpoint \(b\)`, "Both endpoints move"]);
      return () => {
        if (!S.choice) return ["wrong", "Choose one of the options."];
        if (S.choice !== 2) return ["wrong", "Follow the chords: which end do they all share?"];
        P.pt(1, 1, { color: "neg", r: 12, ring: true }); P.draw();
        return ["done", TeX`Right! \(b = 1\) is stuck, so the chords pivot around it like a door on a hinge.`];
      };
    } },

  { nav: "Why it gets stuck", title: "Why does it get stuck?",
    instr: TeX`<p>On \([0, 1]\), \(f''(x) = 6x + 4 > 0\), so \(f\) is <b>convex</b>: it bends upwards.</p>
               <p>For a convex, increasing \(f\), where does the chord's crossing always land?</p>`,
    hints: ["For a convex curve, the chord between two points lies above the graph.", "A line above the curve reaches the axis before the curve does."],
    answer: "To the left of the root, so the left endpoint is replaced every time and b never moves.",
    build(C) {
      const [a, fa, b, fb] = RF[2];
      drawChord(a, b, [0.6, 1.08, -0.5, 1.2], "A convex curve and its chord", { root: true });
      cards(C, ["Always to the left of the root", "Always to the right of the root", "Exactly on the root"]);
      return () => {
        if (!S.choice) return ["wrong", "Choose one of the options."];
        if (S.choice === 3) return ["wrong", "Only if f were a straight line."];
        if (S.choice === 2) return ["wrong", "Look at the plot: is the chord above or below the curve?"];
        drawChord(a, b, [0.6, 1.08, -0.5, 1.2], "The chord crosses too early", { showC: true, root: true });
        return ["done", "Right! The chord lies above the curve, so it crosses the axis too early, on the left of the root."];
      };
    } },

  { nav: "Error ratio", title: "Linear convergence",
    instr: TeX`<p>The Regula Falsi errors \(|x_n - r|\) for \(n = 4, 5, 6, 7\) are</p>
               <p>\(1.3\times10^{-2},\ 2.4\times10^{-3},\ 4.3\times10^{-4},\ 7.7\times10^{-5}\).</p>
               <p>By roughly what factor does the error shrink at each step?</p>`,
    hints: [TeX`Divide one error by the previous one, for example \(\frac{4.3\times10^{-4}}{2.4\times10^{-3}}\).`, TeX`\(\frac{7.7}{43} \approx 0.18\).`],
    answer: TeX`About \(0.18\): each error is \(0.18\) times the previous one (linear convergence).`,
    build(C) {
      P.setView(1.5, 10.5, 1e-7, 1, { xlabel: "n", ylog: true, xticks: [2, 4, 6, 8, 10] });
      let prev = null;
      RF.slice(0, 9).forEach((s, i) => { const n = i + 2, e = Math.abs(s[4] - ROOT);
        if (prev) P.seg(prev[0], prev[1], n, e, { color: "neg", width: 2 }); P.pt(n, e, { color: "neg", r: 5 }); prev = [n, e]; });
      setPlotTitle(TeX`Regula Falsi error \(|x_n - r|\) (log scale)`); P.draw();
      const inp = field(C, "factor ≈", "ans1");
      return () => {
        const v = parseNum(inp.value);
        if (!Number.isFinite(v)) return ["wrong", "Type a number, for example 0.5."];
        if (v > 1) return ["wrong", "The errors get smaller, so the factor is less than 1."];
        if (Math.abs(v - 0.18) > 0.03) return ["wrong", "Not quite. Divide consecutive errors."];
        return ["done", TeX`Correct! A constant factor \(\approx 0.18\) means linear convergence: a straight line on the log plot.`];
      };
    } },

  { nav: "When to stop", title: "Which stopping test?",
    instr: TeX`<p>The plot shows the bracket width \(b - a\) for bisection and for Regula Falsi on our example.</p>
               <p>Which stopping test should Regula Falsi use?</p>`,
    hints: ["Does the Regula Falsi bracket shrink to zero?", TeX`The width levels off at \(b - r \approx 0.198\).`],
    answer: TeX`\(|f(c)| \le \text{tol}\). The bracket width does not shrink to zero, so \(\frac{b-a}{2} < \text{tol}\) may never happen.`,
    build(C) {
      P.setView(0, 10, 0, 1.05, { xlabel: "n", yticks: [0, 0.2, 0.4, 0.6, 0.8, 1] });
      let a = 0, b = 1, pb = [0, 1];
      for (let n = 1; n <= 10; n++) { const c = (a + b) / 2; if (f(a) * f(c) < 0) b = c; else a = c;
        P.seg(pb[0], pb[1], n, b - a, { color: "curve", width: 2 }); P.pt(n, b - a, { color: "curve", r: 4 }); pb = [n, b - a]; }
      let pr = [0, 1];
      RF.slice(0, 10).forEach((s, i) => { const [A, fA, B, , c] = s; const w = fA * f(c) < 0 ? c - A : B - c;
        P.seg(pr[0], pr[1], i + 1, w, { color: "neg", width: 2.5 }); P.pt(i + 1, w, { color: "neg", r: 4 }); pr = [i + 1, w]; });
      P.seg(0, 1 - ROOT, 10, 1 - ROOT, { color: "gold", dash: true, width: 1.5 });
      P.tex(9.8, 0.3, TeX`\text{Regula Falsi}`, { color: "neg", align: "right", size: 15 });
      P.tex(9.8, 0.06, TeX`\text{bisection}`, { color: "curve", align: "right", size: 15 });
      setPlotTitle(TeX`Bracket width \(b - a\)`); P.draw();
      cards(C, [TeX`\(\frac{b-a}{2} < \text{tol}\)`, TeX`\(|f(c)| \le \text{tol}\)`, TeX`\(|x_{n+1} - x_n| < \text{tol}\) only`]);
      return () => {
        if (!S.choice) return ["wrong", "Choose one of the options."];
        if (S.choice === 1) return ["wrong", "Look at the red curve: the bracket width never gets below about 0.2."];
        if (S.choice === 3) return ["wrong", "Small steps can happen far from the root when the method stagnates."];
        return ["done", TeX`Right! Regula Falsi stops when the residual \(|f(c)|\) is small.`];
      };
    } },

  { nav: "The Illinois fix", title: "The Illinois fix",
    instr: TeX`<p>The endpoint \(b = 1\) has been kept twice, so the Illinois method <b>halves its stored value</b>: use \(f(b) = 0.5\) instead of \(1\).</p>
               <p>With \(a = 0.7333\), \(f(a) = -0.2634\), compute the new point \(c = \dfrac{a\,f(b) - b\,f(a)}{f(b) - f(a)}\).</p>`,
    hints: [TeX`Numerator: \(0.7333\cdot0.5 - 1\cdot(-0.2634) = 0.6301\).`, TeX`Denominator: \(0.5 - (-0.2634) = 0.7634\).`],
    answer: TeX`\(c = 0.6301 / 0.7634 \approx 0.8253\), past the root, so \(b\) finally moves.`,
    build(C) {
      const [a, fa, b, fb, c] = ILL[2];
      drawChord(a, b, [0.6, 1.08, -0.5, 1.2], TeX`Chord to the halved value \((1, 0.5)\)`, { fb, chordColor: "pos", root: true });
      P.pt(1, fb, { color: "gold", r: 8 }); P.draw();
      const inp = field(C, TeX`\(c =\)`, "ans1");
      return () => {
        if (!(Math.abs(parseNum(inp.value) - c) <= 5e-4)) return ["wrong", "Not quite. Use f(b) = 0.5, not 1."];
        drawChord(a, b, [0.6, 1.08, -0.5, 1.2], TeX`\(c \approx 0.8253\): past the root`, { fb, chordColor: "pos", showC: true, root: true });
        P.pt(1, fb, { color: "gold", r: 8 }); P.draw();
        return ["done", TeX`Correct! \(c \approx 0.8253\) lands past the root, so \(b\) moves. By \(x_8\) the Illinois error is about \(2\times10^{-9}\).`];
      };
    } },
];

startPractice({
  store: "nm-lec03-regula-falsi-v1", lecture: "Lecture 3", tasks: TASKS,
  finalPlot() {
    P.setView(0.7, 0.9, -0.4, 0.4, { xlabel: "x" }); P.fn(f);
    ILL.slice(3, 7).forEach(([a, fa, b, fb]) => P.seg(a, fa, b, fb, { color: "pos", width: 2 }));
    P.pt(ROOT, 0, { color: "gold", r: 9 }); setPlotTitle(TeX`\(r \approx ${ROOT.toFixed(7)}\)`); P.draw();
  },
});
