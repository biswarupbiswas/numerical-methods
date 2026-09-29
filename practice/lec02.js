/* Lecture 2 — The Secant Method: practice tasks. */
"use strict";
const f = x => x ** 3 + 2 * x ** 2 - x - 1;
const ROOT = 0.8019377358048383;
const secNext = (a, b) => b - f(b) * (b - a) / (f(b) - f(a));
function secSeq(x0, x1, n) { const xs = [x0, x1]; for (let k = 0; k < n; k++) { const a = xs.at(-2), b = xs.at(-1); if (f(a) === f(b)) break; xs.push(secNext(a, b)); } return xs; }
const XS = secSeq(0, 1, 7);                       // x_0 .. x_8 of the worked example
const sub = n => `x_{${n}}`;

/** Draw f, the secant through xa and xb (extended across the view), and optionally its crossing. */
function drawSecant(xa, xb, view, title, o = {}) {
  const [v0, v1, w0, w1] = view;
  P.setView(v0, v1, w0, w1, { xlabel: "x" }); P.fn(f);
  const m = (f(xb) - f(xa)) / (xb - xa);
  if (Number.isFinite(m)) P.seg(v0, f(xa) + m * (v0 - xa), v1, f(xa) + m * (v1 - xa), { color: o.lineColor || "gold", width: 2.5 });
  for (const [x, n] of [[xa, o.la], [xb, o.lb]]) {
    P.seg(x, 0, x, f(x), { color: signCol(f(x)), dash: true, width: 1.5 }); P.pt(x, f(x), { color: signCol(f(x)), r: 7 });
    if (n) P.tex(x, 0, n, { dy: f(x) > 0 ? 17 : -17, size: 18 });
  }
  if (o.showNext && Number.isFinite(m) && m !== 0) {
    const xn = secNext(xa, xb); P.pt(xn, 0, { color: "ink", r: 6 });
    if (o.ln) P.tex(xn, 0, o.ln, { dy: 19, size: 18 });
  }
  if (o.root) P.pt(ROOT, 0, { color: "pos", r: 5, ring: true });
  setPlotTitle(title); P.draw();
}

const TASKS = [
  { nav: "Slope of the secant", title: "The slope of the secant",
    instr: TeX`<p>We solve \(f(x) = x^3 + 2x^2 - x - 1 = 0\) starting from \(x_0 = 0\) and \(x_1 = 1\).</p>
               <p>\(f(0) = -1\) and \(f(1) = 1\). What is the <b>slope</b> of the secant line through these two points?</p>`,
    hints: [TeX`Slope = rise over run = \(\frac{f(x_1) - f(x_0)}{x_1 - x_0}\).`, TeX`\(\frac{1 - (-1)}{1 - 0}\).`],
    answer: TeX`\(\text{slope} = \frac{1 - (-1)}{1 - 0} = 2\).`,
    build(C) {
      drawSecant(0, 1, [-0.3, 1.3, -1.6, 2.2], TeX`The secant through \((0, -1)\) and \((1, 1)\)`, { la: sub(0), lb: sub(1) });
      const s = field(C, "slope =", "ans1");
      return () => {
        const v = parseNum(s.value);
        if (near(v, 0.5)) return ["wrong", "That is run over rise. The slope is rise over run."];
        if (!near(v, 2)) return ["wrong", TeX`Not quite. Divide the change in \(f\) by the change in \(x\).`];
        return ["done", TeX`Correct! The secant rises 2 units in \(f\) for every unit in \(x\).`];
      };
    } },

  { nav: TeX`Next guess \(x_2\)`, title: "Where does the line cross?",
    instr: TeX`<p>From \(x_1 = 1\) we slide down the secant to the axis. We drop a height of \(f(x_1) = 1\), so we move left by \(f(x_1)/\text{slope}\).</p>
               <p>Use \(x_2 = x_1 - \dfrac{f(x_1)\,(x_1 - x_0)}{f(x_1) - f(x_0)}\) to find \(x_2\).</p>`,
    hints: [TeX`\(f(x_1)\,(x_1 - x_0) = 1 \times 1\) and \(f(x_1) - f(x_0) = 2\).`, TeX`\(x_2 = 1 - \frac12\).`],
    answer: TeX`\(x_2 = 1 - \frac{1\cdot(1 - 0)}{1 - (-1)} = 0.5\).`,
    build(C) {
      drawSecant(0, 1, [-0.3, 1.3, -1.6, 2.2], "Slide down the secant to the axis", { la: sub(0), lb: sub(1) });
      const s = field(C, TeX`\(x_2 =\)`, "ans1");
      return () => {
        if (!near(parseNum(s.value), 0.5)) return ["wrong", TeX`Not quite. Put \(x_0 = 0\), \(x_1 = 1\), \(f(x_0) = -1\), \(f(x_1) = 1\) into the formula.`];
        drawSecant(0, 1, [-0.3, 1.3, -1.6, 2.2], TeX`\(x_2 = 0.5\)`, { la: sub(0), lb: sub(1), showNext: true, ln: sub(2) });
        return ["done", TeX`Correct! The secant crosses the axis at \(x_2 = 0.5\), where \(f = -0.875\).`];
      };
    } },

  { nav: "Drag the points", title: "Drag the two points",
    instr: TeX`<p>Move the sliders to choose \(x_0\) and \(x_1\). The gold line is the secant and the black dot is the next guess \(x_2\).</p>
               <p>Your goal: make \(x_2\) land within \(0.02\) of the root \(r \approx 0.802\) (the green ring).</p>`,
    hints: ["Points far apart give a rough line. What happens when both points are near the root?", TeX`Try \(x_0\) and \(x_1\) both between \(0.6\) and \(1.0\).`],
    answer: TeX`Any two points close to the root work, for example \(x_0 = 0.7\) and \(x_1 = 0.9\).`,
    build(C) {
      let a = 0, b = 1.3; const live = el("div", { className: "live" });
      const redraw = () => {
        drawSecant(a, b, [-0.4, 1.4, -1.6, 2.4], TeX`Move \(x_0\) and \(x_1\)`, { la: sub(0), lb: sub(1), showNext: true, ln: sub(2), root: true });
        const x2 = secNext(a, b), d = Math.abs(x2 - ROOT);
        live.innerHTML = Number.isFinite(x2) && a !== b
          ? TeX`\(x_2 = ${x2.toFixed(4)}\), distance to root \(=\) <span class="${d < 0.02 ? "pos" : "neg"}">\(${d.toFixed(4)}\)</span>`
          : TeX`<span class="neg">\(x_0\) and \(x_1\) must be different points.</span>`;
        typeset(live);
      };
      slider(C, "x_0", "sa", -0.4, 1.4, 0.01, 0, v => { a = v; redraw(); });
      slider(C, "x_1", "sb", -0.4, 1.4, 0.01, 1.3, v => { b = v; redraw(); });
      C.append(live);
      return () => {
        if (a === b) return ["wrong", TeX`\(x_0\) and \(x_1\) must be different.`];
        const x2 = secNext(a, b);
        if (!(Math.abs(x2 - ROOT) < 0.02)) return ["wrong", TeX`\(x_2 = ${x2.toFixed(3)}\) is \(${Math.abs(x2 - ROOT).toFixed(3)}\) away from the root. Keep trying.`];
        return ["done", TeX`\(x_2 = ${x2.toFixed(4)}\) is within \(0.02\) of the root. Starting points close to the root give an excellent next guess.`];
      };
    } },

  { nav: "Secant by hand", title: "Secant by hand",
    instr: TeX`<p>Continue the example. Each step uses the <b>two newest</b> points:</p>
               <p>\[x_{n+1} = x_n - \frac{f(x_n)\,(x_n - x_{n-1})}{f(x_n) - f(x_{n-1})}\]</p>`,
    hints: [TeX`For the first step use \(x_1 = 1\) and \(x_2 = 0.5\); \(x_0\) is no longer needed.`, TeX`Watch the signs: \(f(x_2)\) is negative.`,
            "4 decimal places is enough."],
    answer: "",
    build(C, T) {
      let step = 0;
      const lbl = el("div", { className: "steplabel" }), info = el("div", { className: "live" });
      C.append(lbl, info);
      const inp = field(C, "", "ans1");
      const lab = inp.parentElement.querySelector("label");
      const setup = () => {
        const n = step + 3, a = XS[n - 2], b = XS[n - 1];
        lbl.innerHTML = TeX`Step ${step + 1} of 2: compute \(x_{${n}}\)`;
        lab.innerHTML = TeX`\(x_{${n}} =\)`; inp.value = "";
        info.innerHTML = TeX`\(x_{${n - 2}} = ${+a.toFixed(4)}\), \(f(x_{${n - 2}}) = ${f(a).toFixed(4)}\)<br>\(x_{${n - 1}} = ${+b.toFixed(4)}\), \(f(x_{${n - 1}}) = ${f(b).toFixed(4)}\)`;
        [lbl, lab, info].forEach(typeset);
        drawSecant(a, b, [-0.2, 1.2, -1.4, 1.6], TeX`Step ${step + 1}: the secant through \(x_{${n - 2}}\) and \(x_{${n - 1}}\)`, { la: sub(n - 2), lb: sub(n - 1) });
        T.answer = TeX`\(x_{${n}} = ${XS[n].toFixed(6)}\)`;
      };
      setup();
      return () => {
        const n = step + 3;
        if (!(Math.abs(parseNum(inp.value) - XS[n]) <= 5e-4)) return ["wrong", "Not quite. Check the signs in the formula carefully."];
        if (step === 0) { step = 1; setTimeout(setup, 350); return ["step", TeX`Correct! \(x_3 = ${XS[3].toFixed(4)}\). Now drop \(x_1\) and use \(x_2\) and \(x_3\).`]; }
        drawSecant(XS[2], XS[3], [-0.2, 1.2, -1.4, 1.6], TeX`\(x_4\) overshoots the root slightly`, { la: sub(2), lb: sub(3), showNext: true, ln: sub(4), root: true });
        let rows = "";
        for (let k = 0; k <= 8; k++) {
          const [m, e] = Math.abs(XS[k] - ROOT).toExponential(1).split("e");
          rows += TeX`<tr><td>\(${k}\)</td><td class="gold">\(${XS[k].toFixed(7)}\)</td><td class="${signCol(f(XS[k]))}">\(${f(XS[k]) >= 0 ? "+" : ""}${f(XS[k]).toFixed(6)}\)</td><td>\(${m}\times10^{${+e}}\)</td></tr>`;
        }
        C.innerHTML = TeX`<div class="question">The whole run, computed for you:</div><div class="tablewrap"><table class="iter"><thead><tr><th>\(n\)</th><th>\(x_n\)</th><th>\(f(x_n)\)</th><th>\(|x_n - r|\)</th></tr></thead><tbody>${rows}</tbody></table></div>`;
        typeset(C);
        return ["done", TeX`Excellent! \(x_4 = ${XS[4].toFixed(4)}\). By \(x_8\) the error is below \(10^{-10}\).`];
      };
    } },

  { nav: "No bracket", title: "Both points on one side",
    instr: TeX`<p>In the example, \(x_2 = 0.5\) and \(x_3 \approx 0.733\) both have \(f < 0\): both points are below the axis.</p>
               <p>What does the secant method do next?</p>`,
    hints: ["Look at the gold line in the plot. Does it stop at the two points?", "A straight line can be extended as far as we like."],
    answer: TeX`It extends the line beyond both points (extrapolation) and uses the crossing \(x_4 \approx 0.834\).`,
    build(C) {
      drawSecant(XS[2], XS[3], [0.3, 1.0, -1.2, 0.6], "Two points below the axis", { la: sub(2), lb: sub(3), root: true });
      cards(C, ["It stops: there is no sign change", "It extends the line beyond the points and uses its crossing", "It switches to bisection automatically"]);
      return () => {
        if (!S.choice) return ["wrong", "Choose one of the options."];
        if (S.choice === 1) return ["wrong", "Bisection would need a sign change, but the secant method does not."];
        if (S.choice === 3) return ["wrong", "The plain secant method never switches methods. Only hybrid methods do that."];
        drawSecant(XS[2], XS[3], [0.3, 1.0, -1.2, 0.6], TeX`Extrapolation: \(x_4 \approx 0.834\)`, { la: sub(2), lb: sub(3), showNext: true, ln: sub(4), root: true });
        return ["done", "Right! The secant method never keeps a bracket. It simply extends the line."];
      };
    } },

  { nav: "Correct digits", title: "Digits add up",
    instr: TeX`<p>For the secant method \(e_{n+1} \approx C\,e_n\,e_{n-1}\). Multiplying errors <b>adds</b> their numbers of correct digits.</p>
               <p>In the example \(x_4\), \(x_5\), \(x_6\) have about \(1.5\), \(2.6\) and \(4.1\) correct digits. Predict the number of correct digits of \(x_7\).</p>`,
    hints: ["The next number of digits is roughly the sum of the last two.", TeX`\(2.6 + 4.1 = {?}\)`],
    answer: TeX`About \(2.6 + 4.1 = 6.7\) digits. The actual value is \(6.69\).`,
    build(C) {
      const d = [1.50, 2.62, 4.10, 6.69, 10.76];
      const draw = k => {
        P.setView(0.4, 5.6, 0, 12, { xlabel: TeX`\text{guess}`, xticks: [], yticks: [0, 2, 4, 6, 8, 10, 12] });
        for (let i = 0; i < k; i++) {
          P.seg(i + 1, 0, i + 1, d[i], { color: i < 3 ? "curve" : "pos", width: 26, cap: "butt" });
          P.tex(i + 1, d[i], d[i].toFixed(1), { dy: -13, size: 16 });
        }
        for (let i = 0; i < 5; i++) P.tex(i + 1, 0, sub(i + 4), { dy: -14, color: "muted", size: 15 });
        setPlotTitle("Correct digits in each guess"); P.draw();
      };
      draw(3);
      const inp = field(C, TeX`digits of \(x_7 \approx\)`, "ans1");
      return () => {
        const v = parseNum(inp.value);
        if (!Number.isFinite(v)) return ["wrong", "Type a number of digits, for example 5.2."];
        if (Math.abs(v - 6.7) > 0.35) return ["wrong", "Not quite. Add the digits of the previous two guesses."];
        draw(5);
        return ["done", TeX`Correct! \(2.6 + 4.1 \approx 6.7\), and then \(4.1 + 6.7 \approx 10.8\). The digits grow like Fibonacci numbers.`];
      };
    } },

  { nav: "Order of convergence", title: "The order of convergence",
    instr: TeX`<p>If \(e_{n+1} \approx C\,e_n^{\,p}\), then \(p\) is the order of convergence. The plot races bisection against secant on the same problem.</p>
               <p>What is the order \(p\) of the secant method?</p>`,
    hints: ["The digits grow like Fibonacci numbers, and the ratio of consecutive Fibonacci numbers tends to a famous constant.",
            TeX`\(p\) is the positive solution of \(p^2 = p + 1\).`],
    answer: TeX`\(p = \frac{1+\sqrt5}{2} \approx 1.618\), the golden ratio.`,
    build(C) {
      P.setView(0, 12, 1e-12, 2, { xlabel: TeX`\text{step}`, ylog: true, xticks: [0, 2, 4, 6, 8, 10, 12] });
      let a = 0, b = 1, prev = null;
      for (let n = 1; n <= 12; n++) {
        const c = (a + b) / 2, e = Math.abs(c - ROOT);
        if (prev) P.seg(prev[0], prev[1], n, e, { color: "neg", width: 2 }); P.pt(n, e, { color: "neg", r: 4 }); prev = [n, e];
        if (f(a) * f(c) < 0) b = c; else a = c;
      }
      prev = null;
      for (let n = 1; n <= 7; n++) {
        const e = Math.abs(XS[n + 1] - ROOT);
        if (prev) P.seg(prev[0], prev[1], n, e, { color: "pos", width: 2.5 }); P.pt(n, e, { color: "pos", r: 5 }); prev = [n, e];
      }
      P.tex(11.8, 5e-4, TeX`\text{bisection}`, { color: "neg", align: "right", size: 16 });
      P.tex(7.3, 2e-11, TeX`\text{secant}`, { color: "pos", align: "left", size: 16 });
      setPlotTitle("Error per step (log scale)"); P.draw();
      cards(C, [TeX`\(p = 1\) (linear)`, TeX`\(p \approx 1.618\)`, TeX`\(p = 2\) (quadratic)`, TeX`\(p = 0.5\)`]);
      return () => {
        if (!S.choice) return ["wrong", "Choose one of the options."];
        if (S.choice === 1) return ["wrong", "That is bisection. The secant method is faster than linear."];
        if (S.choice === 3) return ["wrong", "Close, but not quite quadratic: the digits don't double each step."];
        if (S.choice === 4) return ["wrong", "An order below 1 would mean it doesn't converge."];
        return ["done", TeX`Right! \(p = \frac{1+\sqrt5}{2} \approx 1.618\), the golden ratio: superlinear convergence.`];
      };
    } },

  { nav: "When it fails", title: "When the secant method fails",
    instr: `<p>Click each pair of starting points to see its first secant step.</p>
            <p>Which pair makes the next guess <b>jump far away</b> from every root?</p>`,
    hints: ["Look for two points where the curve is almost flat.", TeX`When \(f(x_0) \approx f(x_1)\) the secant is nearly horizontal.`],
    answer: TeX`\(x_0 = 0.2\), \(x_1 = 0.3\). The curve is almost flat there, so the secant is nearly horizontal and crosses the axis at \(x_2 \approx 6.05\).`,
    build(C) {
      const pairs = [[0, 1], [0.2, 0.3], [0.7, 0.9], [-1.5, -1]];
      const view = [-2.6, 6.5, -2, 4];
      drawSecant(0, 1, view, "Pick a pair", {});
      const btns = cards(C, pairs.map(([p, q]) => TeX`\(x_0 = ${p},\ x_1 = ${q}\)`));
      btns.forEach((b, i) => b.addEventListener("click", () => {
        const [p, q] = pairs[i];
        drawSecant(p, q, view, TeX`\(x_0 = ${p},\ x_1 = ${q} \;\to\; x_2 = ${secNext(p, q).toFixed(3)}\)`, { showNext: true, ln: sub(2) });
      }));
      return () => {
        if (!S.choice) return ["wrong", "Choose one of the pairs."];
        if (S.choice !== 2) return ["wrong", "That first step stays close to a root. Try another pair."];
        return ["done", TeX`Right! \(f(0.2) \approx f(0.3)\), so the secant is nearly horizontal and \(x_2 \approx 6.05\). If the values were equal, we would divide by zero.`];
      };
    } },

  { nav: "The algorithm", title: "Put the algorithm in order",
    instr: `<p>Put the steps of the secant method in the right order using the menus.</p><p>When it is right, the plot runs the algorithm for you.</p>`,
    hints: ["You need two starting guesses first, and you must check the denominator before dividing.", "Compute the new point, then shift the points and test for convergence."],
    answer: TeX`1. Choose two starting guesses \(x_0, x_1\)<br>2. If \(f(x_1) = f(x_0)\), stop: zero denominator<br>3. Compute \(x_2 = x_1 - \frac{f(x_1)(x_1 - x_0)}{f(x_1) - f(x_0)}\)<br>4. Shift \(x_0 \leftarrow x_1\), \(x_1 \leftarrow x_2\); stop if \(|x_1 - x_0| < \text{tol}\), else repeat`,
    build(C) {
      // Menu options are plain text (native <select> cannot render maths).
      const steps = ["Choose two starting guesses x0 and x1", "If f(x1) = f(x0), stop: zero denominator",
                     "Compute x2 = x1 − f(x1)(x1 − x0) / (f(x1) − f(x0))", "Shift x0 ← x1, x1 ← x2; stop if |x1 − x0| < tol, else repeat"];
      const order = [2, 3, 0, 1];
      const grid = el("div", { className: "order" }); C.append(grid);
      const sels = [0, 1, 2, 3].map(k => {
        const s = el("select", { id: `dd${k + 1}` });
        s.append(el("option", { value: "" }, "— choose —"), ...order.map(i => { const o = el("option", { value: i }); o.textContent = steps[i]; return o; }));
        grid.append(el("label", { htmlFor: `dd${k + 1}`, className: "steplabel" }, `Step ${k + 1}`), s); return s;
      });
      drawSecant(0, 1, [-0.2, 1.2, -1.4, 1.6], TeX`\(f(x) = x^3 + 2x^2 - x - 1\)`, { la: sub(0), lb: sub(1) });
      return () => {
        const v = sels.map(s => s.value);
        if (v.includes("")) return ["wrong", "Choose an option for every step."];
        if (new Set(v).size < 4) return ["wrong", "Each option should be used exactly once."];
        const bad = v.findIndex((x, k) => +x !== k);
        if (bad >= 0) return ["wrong", `Step ${bad + 1} is not in the right place yet.`];
        let n = 1;
        const tick = () => {
          drawSecant(XS[n - 1], XS[n], [-0.2, 1.2, -1.4, 1.6], TeX`Iteration ${n}: \(x_{${n + 1}} = ${XS[n + 1].toFixed(7)}\)`, { showNext: true, root: true });
          if (++n < 7) setTimeout(tick, 650);
        };
        setTimeout(tick, 300);
        return ["done", "Perfect order! Watch the secant lines close in on the root."];
      };
    } },
];

startPractice({
  store: "nm-lec02-secant-v1", lecture: "Lecture 2", tasks: TASKS,
  finalPlot() {
    drawSecant(XS[6], XS[7], [0.7, 0.9, -0.4, 0.4], TeX`\(r \approx ${ROOT.toFixed(7)}\)`, { root: true });
    P.pt(ROOT, 0, { color: "gold", r: 9 }); P.draw();
  },
});
