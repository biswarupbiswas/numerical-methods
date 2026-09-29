/* Lecture 4 — The Newton–Raphson Method: practice tasks. */
"use strict";
const f = x => x ** 3 + 2 * x ** 2 - x - 1;
const fp = x => 3 * x ** 2 + 4 * x - 1;
const ROOTS = [-2.2469796037174667, -0.5549581320873712, 0.8019377358048383];
const ROOT = ROOTS[2];
const newtonSeq = (g, gp, x, n) => { const xs = [x]; for (let k = 0; k < n; k++) { const d = gp(xs.at(-1)); if (d === 0) break; xs.push(xs.at(-1) - g(xs.at(-1)) / d); } return xs; };

/** f, a point x, its tangent (extended across the view), and optionally the next Newton point. */
function drawTangent(g, gp, x, view, title, o = {}) {
  const [v0, v1, w0, w1] = view, y = g(x), m = gp(x);
  if (!o.keep) { P.setView(v0, v1, w0, w1, { xlabel: "x" }); P.fn(g); }
  P.seg(v0, y + m * (v0 - x), v1, y + m * (v1 - x), { color: o.color || "gold", width: 2.5, alpha: o.alpha ?? 1 });
  P.seg(x, 0, x, y, { color: signCol(y), dash: true, width: 1.5 }); P.pt(x, y, { color: signCol(y), r: 7 });
  if (o.label) P.tex(x, 0, o.label, { dy: y > 0 ? 17 : -17, size: 18 });
  if (o.showNext && m !== 0) { const xn = x - y / m; P.pt(xn, 0, { color: "ink", r: 6 }); if (o.ln) P.tex(xn, 0, o.ln, { dy: g(xn) > 0 ? 19 : -19, size: 18 }); }
  if (o.root !== undefined) P.pt(o.root, 0, { color: "pos", r: 5, ring: true });
  if (title) setPlotTitle(title);
  P.draw();
}
const V1 = [0.7, 1.1, -0.6, 1.4];

const TASKS = [
  { nav: "The derivative", title: "Slope of the tangent",
    instr: TeX`<p>We solve \(f(x) = x^3 + 2x^2 - x - 1 = 0\) with Newton's method, starting at \(x_0 = 1\).</p>
               <p>Newton needs the slope \(f'(x) = 3x^2 + 4x - 1\). What is \(f'(1)\)?</p>`,
    hints: [TeX`Substitute \(x = 1\): \(3 + 4 - 1\).`],
    answer: TeX`\(f'(1) = 3 + 4 - 1 = 6\).`,
    build(C) {
      drawTangent(f, fp, 1, V1, TeX`The tangent at \(x_0 = 1\)`, { label: "x_0" });
      const s = field(C, TeX`\(f'(1) =\)`, "ans1");
      return () => {
        if (!near(parseNum(s.value), 6)) return ["wrong", "Not quite. Put x = 1 into 3x² + 4x − 1."];
        return ["done", TeX`Correct! The tangent at \(x_0 = 1\) has slope \(6\).`];
      };
    } },

  { nav: TeX`First step \(x_1\)`, title: "Follow the tangent",
    instr: TeX`<p>Newton's formula is \(x_{n+1} = x_n - \dfrac{f(x_n)}{f'(x_n)}\).</p>
               <p>With \(f(1) = 1\) and \(f'(1) = 6\), compute \(x_1\) (4 decimals).</p>`,
    hints: [TeX`\(x_1 = 1 - \frac{1}{6}\).`],
    answer: TeX`\(x_1 = 1 - \frac16 \approx 0.8333\).`,
    build(C) {
      drawTangent(f, fp, 1, V1, "Where does the tangent cross the axis?", { label: "x_0" });
      const s = field(C, TeX`\(x_1 =\)`, "ans1");
      return () => {
        if (!(Math.abs(parseNum(s.value) - 5 / 6) <= 5e-4)) return ["wrong", "Not quite. Divide f(1) by f'(1) and subtract from 1."];
        drawTangent(f, fp, 1, V1, TeX`\(x_1 \approx 0.8333\)`, { label: "x_0", showNext: true, ln: "x_1", root: ROOT });
        return ["done", TeX`Correct! \(x_1 \approx 0.8333\). One more step gives \(0.8029\), already within \(10^{-3}\) of the root.`];
      };
    } },

  { nav: "Which root?", title: "Which root do you get?",
    instr: TeX`<p>Drag the starting point \(x_0\). The plot shows the first tangents and where Newton's method ends up.</p>
               <p>Goal: find a starting point from which Newton converges to the root near \(-2.25\).</p>`,
    hints: ["Starting on the far left, the tangents stay on the left.", TeX`Try \(x_0\) below \(-1.6\). A few points near \(0.2\), where the tangent is almost flat, also end up there.`],
    answer: TeX`Any \(x_0 < -1.55\) works, for example \(x_0 = -3\). Some points near \(0.2\) also end there, after a big jump.`,
    build(C) {
      let x0 = 1; const live = el("div", { className: "live" });
      const colors = ["curve", "neg", "pos"];
      const redraw = () => {
        const xs = newtonSeq(f, fp, x0, 60), end = xs.at(-1);
        const k = ROOTS.findIndex(r => Math.abs(end - r) < 1e-6);
        P.setView(-3.2, 1.6, -3, 3, { xlabel: "x" }); P.fn(f);
        ROOTS.forEach((r, i) => P.pt(r, 0, { color: colors[i], r: 5, ring: true }));
        for (let i = 0; i < Math.min(4, xs.length - 1); i++) {
          const x = xs[i], y = f(x), m = fp(x);
          P.seg(x, y, xs[i + 1], 0, { color: "gold", width: 2, alpha: 1 - i * 0.2 });
          P.seg(xs[i + 1], 0, xs[i + 1], f(xs[i + 1]), { color: "muted", dash: true, width: 1 });
          P.pt(x, y, { color: signCol(y), r: 5 });
        }
        P.tex(x0, 0, "x_0", { dy: f(x0) > 0 ? 17 : -17, size: 17 });
        setPlotTitle("Newton's path from your starting point"); P.draw();
        live.innerHTML = k >= 0 ? TeX`converges to \(r = ${ROOTS[k].toFixed(4)}\)` : "does not settle on a root";
        typeset(live);
      };
      slider(C, "x_0", "sa", -3, 1.5, 0.01, 1, v => { x0 = v; redraw(); });
      C.append(live);
      return () => {
        const end = newtonSeq(f, fp, x0, 60).at(-1);
        if (!(Math.abs(end - ROOTS[0]) < 1e-6)) return ["wrong", "Not yet. From this x₀ Newton reaches a different root."];
        return ["done", TeX`Yes! From \(x_0 = ${x0.toFixed(2)}\) Newton converges to \(-2.2470\). The root you get depends on where you start.`];
      };
    } },

  { nav: "Digits double", title: "Digits double",
    instr: TeX`<p>From \(x_0 = 1\), the guesses \(x_1, x_2, x_3\) have about \(1.5\), \(3.0\) and \(6.0\) correct digits.</p>
               <p>About how many correct digits does \(x_4\) have?</p>`,
    hints: ["Look at the pattern: each number is twice the previous one."],
    answer: TeX`About \(12\) (the actual value is \(11.9\)).`,
    build(C) {
      const d = [0.7, 1.5, 3.0, 6.0, 11.9];
      const draw = k => {
        P.setView(-0.6, 4.6, 0, 13, { xlabel: TeX`\text{guess}`, xticks: [], yticks: [0, 2, 4, 6, 8, 10, 12] });
        for (let i = 0; i < k; i++) { P.seg(i, 0, i, d[i], { color: i < 4 ? "curve" : "pos", width: 26, cap: "butt" });
          P.tex(i, d[i], d[i].toFixed(1), { dy: -13, size: 16 }); }
        for (let i = 0; i < 5; i++) P.tex(i, 0, `x_{${i}}`, { dy: -14, color: "muted", size: 15 });
        setPlotTitle("Correct digits in each guess"); P.draw();
      };
      draw(4);
      const inp = field(C, TeX`digits of \(x_4 \approx\)`, "ans1");
      return () => {
        const v = parseNum(inp.value);
        if (!Number.isFinite(v)) return ["wrong", "Type a number of digits."];
        if (Math.abs(v - 12) > 1) return ["wrong", "Not quite. Continue the pattern 1.5, 3, 6, …"];
        draw(5);
        return ["done", "Correct! The digits double every step: quadratic convergence."];
      };
    } },

  { nav: "Squaring the error", title: "Squaring the error",
    instr: TeX`<p>Near the root \(e_{n+1} \approx C\,e_n^{\,2}\) with \(C = \frac{f''(r)}{2f'(r)} \approx 1.06\) for our example.</p>
               <p>If \(e_n = 10^{-3}\), roughly what is \(e_{n+1}\)? (You may type 1e-6.)</p>`,
    hints: [TeX`Square \(10^{-3}\) and multiply by about \(1\).`],
    answer: TeX`\(e_{n+1} \approx 1.06 \times (10^{-3})^2 \approx 10^{-6}\).`,
    build(C) {
      P.setView(0, 5, 1e-13, 1, { xlabel: "n", ylog: true, xticks: [0, 1, 2, 3, 4, 5] });
      const xs = newtonSeq(f, fp, 1, 4); let prev = null;
      xs.forEach((x, n) => { const e = Math.abs(x - ROOT); if (prev) P.seg(prev[0], prev[1], n, e, { color: "pos", width: 2.5 }); P.pt(n, e, { color: "pos", r: 6 }); prev = [n, e]; });
      setPlotTitle(TeX`Newton error \(e_n\) (log scale)`); P.draw();
      const inp = field(C, TeX`\(e_{n+1} \approx\)`, "ans1");
      return () => {
        const v = parseNum(inp.value);
        if (!(v > 0)) return ["wrong", "Type a positive number, for example 1e-6."];
        if (Math.abs(Math.log10(v) + 6) > 0.35) return ["wrong", TeX`Not quite. Square the error: \((10^{-3})^2\).`];
        return ["done", TeX`Correct! One step turns an error of \(10^{-3}\) into about \(10^{-6}\).`];
      };
    } },

  { nav: "The Babylonian √2", title: "The Babylonian square root",
    instr: TeX`<p>For \(f(x) = x^2 - 2\), Newton's method becomes \(x_{n+1} = \frac12\left(x_n + \frac{2}{x_n}\right)\).</p>
               <p>From \(x_1 = 1.5\), compute \(x_2\) (5 decimals).</p>`,
    hints: [TeX`\(2 / 1.5 = 1.33333\).`, TeX`Average \(1.5\) and \(1.33333\).`],
    answer: TeX`\(x_2 = \frac12(1.5 + 1.33333) = 1.41667\).`,
    build(C) {
      const g = x => x * x - 2, gp = x => 2 * x;
      drawTangent(g, gp, 1.5, [0.9, 1.7, -1.2, 1.0], TeX`\(f(x) = x^2 - 2\) and its tangent at \(1.5\)`, { label: "x_1", root: Math.SQRT2 });
      const inp = field(C, TeX`\(x_2 =\)`, "ans1");
      return () => {
        if (!(Math.abs(parseNum(inp.value) - 17 / 12) <= 5e-5)) return ["wrong", "Not quite. Average 1.5 and 2/1.5."];
        drawTangent(g, gp, 1.5, [0.9, 1.7, -1.2, 1.0], TeX`\(x_2 \approx 1.41667\)`, { label: "x_1", showNext: true, ln: "x_2", root: Math.SQRT2 });
        return ["done", TeX`Correct! \(x_2 = 17/12 \approx 1.41667\), and the next step gives \(1.4142157\), already 6 correct digits.`];
      };
    } },

  { nav: "A straight line", title: "Newton on a straight line",
    instr: TeX`<p>Take the straight line \(f(x) = 3x - 6\) and start at \(x_0 = 10\).</p><p>What is \(x_1\)?</p>`,
    hints: [TeX`\(f(10) = 24\) and \(f'(x) = 3\) everywhere.`, TeX`\(x_1 = 10 - \frac{24}{3}\).`],
    answer: TeX`\(x_1 = 10 - 24/3 = 2\), the exact root, in one step.`,
    build(C) {
      const g = x => 3 * x - 6, gp = () => 3;
      drawTangent(g, gp, 10, [0, 11, -8, 26], TeX`\(f(x) = 3x - 6\)`, { label: "x_0" });
      const inp = field(C, TeX`\(x_1 =\)`, "ans1");
      return () => {
        if (!near(parseNum(inp.value), 2)) return ["wrong", "Not quite. Use x₁ = x₀ − f(x₀)/f'(x₀)."];
        drawTangent(g, gp, 10, [0, 11, -8, 26], TeX`\(x_1 = 2\): the exact root`, { label: "x_0", showNext: true, ln: "x_1" });
        return ["done", TeX`Correct! For a straight line the tangent is the line itself, so Newton lands on the root \(-\frac{b}{a} = 2\) in one step.`];
      };
    } },

  { nav: "Spot the failure", title: "Spot the failure",
    instr: TeX`<p>The plot shows Newton's method on \(f(x) = x^3 - 2x + 2\) starting at \(x_0 = 0\).</p><p>What goes wrong?</p>`,
    hints: ["Follow the tangents: where does each one land?", TeX`From \(0\) we go to \(1\). Where does the tangent at \(1\) go?`],
    answer: "A cycle: 0 → 1 → 0 → 1 → … forever.",
    build(C) {
      const g = x => x ** 3 - 2 * x + 2, gp = x => 3 * x * x - 2, view = [-2.2, 1.8, -1.5, 4];
      drawTangent(g, gp, 0, view, TeX`\(f(x) = x^3 - 2x + 2\) from \(x_0 = 0\)`, { label: "x_0" });
      drawTangent(g, gp, 1, view, null, { keep: true, color: "neg" });
      cards(C, ["It finds a different root", "A flat tangent (f' = 0)", "It cycles between two points", "It diverges to infinity"]);
      return () => {
        if (!S.choice) return ["wrong", "Choose one of the options."];
        if (S.choice !== 3) return ["wrong", "Look where the second tangent lands."];
        return ["done", TeX`Right! The tangent at \(0\) lands on \(1\), and the tangent at \(1\) lands back on \(0\): a 2-cycle.`];
      };
    } },

  { nav: "Where it breaks", title: "Where is the step undefined?",
    instr: TeX`<p>The Newton step divides by \(f'(x) = 3x^2 + 4x - 1\).</p>
               <p>Find the <b>positive</b> \(x\) where \(f'(x) = 0\), so the tangent is flat and the step is undefined (3 decimals).</p>`,
    hints: [TeX`Solve \(3x^2 + 4x - 1 = 0\) with the quadratic formula.`, TeX`\(x = \frac{-4 + \sqrt{28}}{6}\).`],
    answer: TeX`\(x = \frac{-4 + \sqrt{28}}{6} \approx 0.215\). Starting at \(0.2\), close to it, Newton jumps to \(-13.7\).`,
    build(C) {
      P.setView(-0.6, 1.1, -1.6, 1.6, { xlabel: "x" }); P.fn(f); P.fn(fp, { color: "gold", width: 2, dash: true });
      P.tex(1.0, 1.35, "f'", { color: "gold", size: 17 });
      setPlotTitle(TeX`\(f\) (blue) and \(f'\) (gold, dashed)`); P.draw();
      const inp = field(C, TeX`\(x =\)`, "ans1");
      return () => {
        const xc = (-4 + Math.sqrt(28)) / 6;
        if (!(Math.abs(parseNum(inp.value) - xc) <= 2e-3)) return ["wrong", "Not quite. Find where the gold curve crosses zero."];
        drawTangent(f, fp, xc, [-0.6, 1.1, -1.6, 1.6], TeX`A flat tangent at \(x \approx 0.215\)`, { color: "neg" });
        return ["done", TeX`Correct! At \(x \approx 0.215\) the tangent is horizontal, so it never meets the axis.`];
      };
    } },
];

startPractice({
  store: "nm-lec04-newton-v1", lecture: "Lecture 4", tasks: TASKS,
  finalPlot() {
    const xs = newtonSeq(f, fp, 1, 3);
    P.setView(0.78, 1.02, -0.2, 1.1, { xlabel: "x" }); P.fn(f);
    xs.slice(0, 3).forEach(x => drawTangent(f, fp, x, [0.78, 1.02, -0.2, 1.1], null, { keep: true, color: "pos" }));
    P.pt(ROOT, 0, { color: "gold", r: 9 }); setPlotTitle(TeX`\(r \approx ${ROOT.toFixed(7)}\)`); P.draw();
  },
});
