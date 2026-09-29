/* Lecture 1 — The Bisection Method: practice tasks. */
"use strict";
const f = x => x ** 3 - x - 2;
const ROOT = 1.5213797068045676;

function drawBracket(a, b, title) {
  P.setView(0.9, 2.1, -3, 5, { xlabel: "x" });
  P.fn(f); P.seg(a, 0, b, 0, { color: "gold", width: 8, cap: "butt" });
  for (const x of [a, b]) { P.seg(x, 0, x, f(x), { color: signCol(f(x)), dash: true, width: 1.5 }); P.pt(x, f(x), { color: signCol(f(x)) }); }
  if (b - a > 0.05) { P.tex(a, 0, "a", { dy: 17, size: 18 }); P.tex(b, 0, "b", { dy: 17, size: 18 }); }
  setPlotTitle(title); P.draw();
}

const TASKS = [
  { nav: "Evaluate \\(f\\)", title: TeX`Evaluate \(f\) at the endpoints`,
    instr: TeX`<p>We want to solve \(f(x) = x^3 - x - 2 = 0\). A root is where the curve crosses the \(x\)-axis.</p>
               <p>Work out \(f(1)\) and \(f(2)\), then decide whether \(f\) changes sign on \([1, 2]\).</p>`,
    hints: [TeX`Substitute \(x = 1\): \(1^3 - 1 - 2\).`, TeX`\(f(2) = 2^3 - 2 - 2\). One value is negative and one is positive.`],
    answer: TeX`\(f(1) = -2\) and \(f(2) = 4\). They have opposite signs, so yes: \(f\) changes sign on \([1, 2]\).`,
    build(C) {
      P.setView(-0.5, 2.5, -4, 6, { xlabel: "x" }); P.fn(f); setPlotTitle(TeX`\(f(x) = x^3 - x - 2\)`); P.draw();
      const a = field(C, TeX`\(f(1) =\)`, "ans1"), b = field(C, TeX`\(f(2) =\)`, "ans2");
      cards(C, ["Yes", "No"], TeX`Does \(f\) change sign on \([1, 2]\)?`);
      return () => {
        if (!near(parseNum(a.value), -2)) return ["wrong", TeX`\(f(1)\) is not right yet.`];
        if (!near(parseNum(b.value), 4)) return ["wrong", TeX`\(f(2)\) is not right yet.`];
        if (!S.choice) return ["wrong", "Now choose Yes or No."];
        if (S.choice !== 1) return ["wrong", TeX`Look at the signs of \(f(1)\) and \(f(2)\) again.`];
        P.pt(1, -2, { color: "neg", r: 7 }); P.pt(2, 4, { color: "pos", r: 7 }); P.seg(1, 0, 2, 0, { color: "gold", width: 7, cap: "butt" }); P.draw();
        return ["done", TeX`\(f(1) = -2\) is negative and \(f(2) = 4\) is positive, so the curve must cross the axis in between.`];
      };
    } },

  { nav: "Starting interval", title: "Choose a starting interval",
    instr: TeX`<p>Bisection needs a starting interval \([a, b]\) where \(f(a)\) and \(f(b)\) have <b>opposite signs</b>, that is \(f(a)\,f(b) < 0\).</p>
               <p>Drag the two sliders to choose your own \(a\) and \(b\), then press <b>Check</b>.</p>`,
    hints: ["Watch the colours: red means negative, green means positive. You need one of each.",
            TeX`The curve crosses the axis near \(x = 1.5\). Put \(a\) on its left and \(b\) on its right.`],
    answer: TeX`Any interval with \(a\) to the left of \(1.52\) and \(b\) to the right works, for example \([0, 2]\) or \([1, 3]\).`,
    build(C) {
      let a = 2, b = 3; const live = el("div", { className: "live" });
      const redraw = () => {
        const ok = a < b && f(a) * f(b) < 0;
        P.setView(-1, 3, -6, 12, { xlabel: "x" }); P.fn(f);
        P.seg(Math.min(a, b), 0, Math.max(a, b), 0, { color: ok ? "gold" : "neg", width: 8, cap: "butt", alpha: .9 });
        for (const [x, n] of [[a, "a"], [b, "b"]]) {
          P.seg(x, 0, x, f(x), { color: signCol(f(x)), dash: true, width: 1.5 });
          P.pt(x, f(x), { color: signCol(f(x)), r: 7 }); P.tex(x, 0, n, { dy: f(x) > 0 ? 17 : -17, size: 18 });
        }
        setPlotTitle(TeX`Drag the sliders: trap the root between \(a\) and \(b\)`); P.draw();
        live.innerHTML = TeX`\(f(a)\) = ${signed(f(a))}<br>\(f(b)\) = ${signed(f(b))}`; typeset(live);
      };
      slider(C, "a", "sa", -1, 3, 0.05, 2, v => { a = v; redraw(); });
      slider(C, "b", "sb", -1, 3, 0.05, 3, v => { b = v; redraw(); });
      C.append(live);
      return () => {
        if (a >= b) return ["wrong", TeX`\(a\) must be to the left of \(b\).`];
        if (f(a) * f(b) > 0) return ["wrong", TeX`\(f(${a.toFixed(2)})\) and \(f(${b.toFixed(2)})\) have the same sign, so a root is not guaranteed.`];
        return ["done", TeX`\(f(${a.toFixed(2)})\,f(${b.toFixed(2)}) < 0\), so \([${a.toFixed(2)}, ${b.toFixed(2)}]\) is a valid starting interval.`];
      };
    } },

  { nav: "Continuity", title: "Why continuity matters",
    instr: TeX`<p>Look at \(g(x) = 1/x\) on \([-1, 1]\). \(g(-1) = -1\) and \(g(1) = 1\), so \(g(-1)\,g(1) < 0\).</p><p>Is there a root of \(g\) in \((-1, 1)\)?</p>`,
    hints: ["The Intermediate Value Theorem needs two things. Is g continuous on the whole interval?", TeX`What happens to \(1/x\) at \(x = 0\)?`],
    answer: TeX`No. \(1/x\) is not continuous at \(x = 0\): it jumps from \(-\infty\) to \(+\infty\) and never equals \(0\).`,
    build(C) {
      P.setView(-2, 2, -5, 5, { xlabel: "x" });
      P.fn(x => 1 / x, { domain: [-2, -0.15] }); P.fn(x => 1 / x, { domain: [0.15, 2] });
      P.seg(0, -5, 0, 5, { color: "gold", dash: true, width: 2 });
      P.pt(-1, -1, { color: "neg", r: 7 }); P.pt(1, 1, { color: "pos", r: 7 });
      setPlotTitle(TeX`\(g(x) = 1/x\)`); P.draw();
      cards(C, ["Yes, the Intermediate Value Theorem guarantees one", TeX`No, \(g\) is not continuous on \([-1, 1]\), so the theorem does not apply`, TeX`Yes, at \(x = 0\)`]);
      return () => {
        if (!S.choice) return ["wrong", "Choose one of the options."];
        if (S.choice !== 2) return ["wrong", TeX`Look closely at what happens at \(x = 0\).`];
        return ["done", TeX`Right! \(g\) jumps across the axis at \(x = 0\). Without continuity there is no guarantee.`];
      };
    } },

  { nav: "Bisection by hand", title: "Bisection by hand",
    instr: TeX`<p>Run bisection by hand on \([a, b] = [1, 2]\). For each step:</p>
               <p>1. compute the midpoint \(c = \frac{a+b}{2}\)<br>2. compute \(f(c)\) (3 decimals is enough)<br>3. choose the half where \(f\) changes sign.</p>`,
    hints: [TeX`\(c\) is exactly halfway between \(a\) and \(b\): add them and divide by \(2\).`, TeX`For \(f(c)\), compute \(c^3 - c - 2\). A calculator is fine.`,
            TeX`Keep the half whose two endpoints have opposite signs of \(f\).`],
    answer: "",
    build(C, T) {
      let a = 1, b = 2, step = 1;
      const lbl = el("div", { className: "steplabel" }); C.append(lbl);
      const ci = field(C, TeX`Midpoint \(c =\)`, "ans1"), fi = field(C, TeX`\(f(c) =\)`, "ans2");
      const box = el("div"); C.append(box);
      const setAnswer = () => { const c = (a + b) / 2; T.answer = TeX`\(c = ${c}\), \(f(c) = ${f(c).toFixed(4)}\), keep the ${f(a) * f(c) < 0 ? "left" : "right"} half.`; };
      const newStep = () => {
        lbl.innerHTML = TeX`Step ${step} of 3: \([a, b] = [${a}, ${b}]\)`; typeset(lbl);
        ci.value = ""; fi.value = ""; box.innerHTML = ""; S.choice = 0;
        cards(box, [TeX`Left half \([${a}, c]\)`, TeX`Right half \([c, ${b}]\)`], "Which half contains the root?");
        drawBracket(a, b, TeX`Step ${step}: \([a, b] = [${a}, ${b}]\)`); setAnswer();
      };
      newStep();
      return () => {
        const c = (a + b) / 2, fc = f(c);
        if (!near(parseNum(ci.value), c)) return ["wrong", "The midpoint is not right yet."];
        P.seg(c, 0, c, fc, { color: signCol(fc), dash: true, width: 2 }); P.pt(c, 0, { color: "ink", r: 5 }); P.draw();
        if (!(Math.abs(parseNum(fi.value) - fc) <= 5e-4)) return ["wrong", TeX`\(c = ${c}\) is right. Now check your value of \(f(c)\).`];
        P.pt(c, fc, { color: signCol(fc), r: 7 }); P.draw();
        if (!S.choice) return ["wrong", "Good! Now choose which half to keep."];
        const left = f(a) * fc < 0;
        if (S.choice !== (left ? 1 : 2)) return ["wrong", TeX`\(f(a) = ${f(a).toFixed(3)}\) and \(f(c) = ${fc.toFixed(3)}\). Which half has endpoints with opposite signs?`];
        if (left) b = c; else a = c;
        if (step < 3) { step++; setTimeout(newStep, 350); return ["step", TeX`Correct! The root is now trapped in \([${a}, ${b}]\). On to step ${step}.`]; }
        drawBracket(a, b, TeX`After 3 steps: \([a, b] = [${a}, ${b}]\)`);
        let rows = "", A = a, B = b;
        for (let n = 4; n <= 10; n++) {
          const m = (A + B) / 2, fm = f(m);
          rows += TeX`<tr><td>\(${n}\)</td><td>\(${A.toFixed(6)}\)</td><td>\(${B.toFixed(6)}\)</td><td class="gold">\(${m.toFixed(6)}\)</td><td class="${signCol(fm)}">\(${fm >= 0 ? "+" : ""}${fm.toFixed(5)}\)</td></tr>`;
          if (f(A) * fm < 0) B = m; else A = m;
        }
        C.innerHTML = TeX`<div class="question">The next steps, computed for you:</div><div class="tablewrap"><table class="iter"><thead><tr><th>\(n\)</th><th>\(a\)</th><th>\(b\)</th><th>\(c\)</th><th>\(f(c)\)</th></tr></thead><tbody>${rows}</tbody></table></div><div class="live">True root: <span class="pos">\(x^* = ${ROOT.toFixed(6)}\)</span></div>`;
        typeset(C);
        return ["done", TeX`Excellent! After 3 steps the root is in \([${a}, ${b}]\).`];
      };
    } },

  { nav: "Stopping criteria", title: "Stopping criteria",
    instr: TeX`<p>We stop when the answer is accurate enough. Which stopping test <b>guarantees</b> that \(|c - x^*| < \text{tol}\)?</p><p>The plot shows a clue.</p>`,
    hints: [TeX`In the plot, \(|f(c)|\) is tiny at \(c = 1.25\), but \(c\) is still \(0.25\) away from the root.`,
            TeX`The root is always inside \([a, b]\) and \(c\) is its midpoint. How far can \(c\) be from the root?`],
    answer: TeX`\(\frac{b-a}{2} < \text{tol}\). The root is inside \([a, b]\), so the midpoint is at most \(\frac{b-a}{2}\) away from it.`,
    build(C) {
      const tol = 2e-3, g = x => (x - 1.5) ** 5;
      P.setView(1, 2, -0.01, 0.01, { xlabel: "x", yticks: [-0.01, -0.005, 0, 0.005, 0.01] });
      P.band(1, 2, -tol, tol); P.fn(g); P.pt(1.25, g(1.25), { color: "neg", r: 7 }); P.pt(1.5, 0, { color: "pos", r: 8 });
      P.tex(1.25, 0.0045, TeX`c = 1.25\text{:}\ |f(c)| < \text{tol}`, { size: 15 });
      P.tex(1.5, -0.0045, TeX`\text{root } x^* = 1.5`, { size: 15 });
      P.tex(1.88, tol * 1.7, TeX`|f| < \text{tol}`, { size: 14, color: "muted" });
      setPlotTitle(TeX`A very flat function: \(f(x) = (x - 1.5)^5\)`); P.draw();
      cards(C, [TeX`\(|f(c)| < \text{tol}\)`, TeX`\(\frac{b-a}{2} < \text{tol}\)`, TeX`\(n \ge N_{\max}\) (a maximum number of steps)`]);
      return () => {
        if (!S.choice) return ["wrong", "Choose one of the options."];
        if (S.choice === 1) return ["wrong", TeX`Look at the plot: \(|f(c)|\) is small at \(c = 1.25\), but \(c\) is far from the root.`];
        if (S.choice === 3) return ["wrong", "A cap on the steps is a safety net. It says nothing about accuracy."];
        return ["done", TeX`Right! \(|c - x^*| \le \frac{b-a}{2}\), so this test guarantees the accuracy.`];
      };
    } },

  { nav: "Error bound", title: "The error bound",
    instr: TeX`<p>Start with \([a, b] = [1, 2]\). Drag the slider to see the interval after each halving.</p>
               <p>The \(n\)-th midpoint satisfies \(|c_n - x^*| \le \frac{b-a}{2^n}\). What is this bound for \(n = 5\)? (You may type 1/32.)</p>`,
    hints: [TeX`\(b - a = 1\), so the bound is \(1/2^5\).`, "You can type the answer as 1/32 or 2^-5."],
    answer: TeX`\(1/2^5 = 1/32 = 0.03125\).`,
    build(C) {
      const bars = n => {
        P.setView(0.95, 2.8, -4.8, 0.8, { xlabel: "x", noY: true, yticks: [] });
        let a = 1, b = 2; const cols = ["curve", "curve", "gold", "gold", "gold"];
        for (let k = 0; k <= n; k++) {
          P.seg(a, -k, b, -k, { color: cols[k], width: 10, cap: "butt", alpha: 1 - k * 0.08 });
          P.tex(2.08, -k, TeX`\text{width} = 1/2^{${k}} = ${1 / 2 ** k}`, { align: "left", size: 15 });
          const c = (a + b) / 2; if (f(a) * f(c) < 0) b = c; else a = c;
        }
        P.seg(ROOT, -4.8, ROOT, 0.8, { color: "pos", dash: true, width: 2 });
        P.tex(ROOT, 0.5, TeX`x^*`, { color: "pos", align: "left", dx: 6, size: 17 });
        setPlotTitle(`After ${n} halving${n === 1 ? "" : "s"}`); P.draw();
      };
      slider(C, TeX`\text{halvings}`, "sn", 0, 4, 1, 0, bars);
      const inp = field(C, TeX`Bound for \(n = 5\):`, "ans1");
      return () => {
        const v = parseNum(inp.value);
        if (!Number.isFinite(v)) return ["wrong", "Type a number, for example 0.1 or 1/10."];
        if (near(v, 1 / 16)) return ["wrong", TeX`That is the bound for \(n = 4\). Halve it once more.`];
        if (!near(v, 1 / 32)) return ["wrong", TeX`Not quite. Use \(\frac{b-a}{2^n}\) with \(n = 5\).`];
        return ["done", TeX`Correct! After 5 steps the midpoint is within \(1/32 = 0.03125\) of the root.`];
      };
    } },

  { nav: "Number of iterations", title: "How many iterations?",
    instr: TeX`<p>To guarantee an error at most \(\varepsilon\) we need \(\frac{b-a}{2^n} \le \varepsilon\), that is \(n \ge \log_2\frac{b-a}{\varepsilon}\).</p>
               <p>On \([1, 2]\) with \(\varepsilon = 10^{-4}\), what is the smallest number of iterations \(n\)? Use the slider or the formula.</p>`,
    hints: ["Move the slider until the ring first drops below the red line.", TeX`\(\log_2(10^4) \approx ${Math.log2(1e4).toFixed(2)}\), and \(n\) must be a whole number.`],
    answer: TeX`\(n = 14\), because \(1/2^{13} \approx 1.2\times10^{-4}\) is too big and \(1/2^{14} \approx 6.1\times10^{-5} \le 10^{-4}\).`,
    build(C) {
      const live = el("div", { className: "live" });
      const draw = n => {
        P.setView(0, 20, 1e-7, 2, { xlabel: "n", ylog: true, xticks: [0, 4, 8, 12, 16, 20] });
        P.seg(0, 1e-4, 20, 1e-4, { color: "neg", width: 2 }); P.tex(19.8, 1e-4, TeX`\varepsilon = 10^{-4}`, { color: "neg", align: "right", dy: -12, size: 16 });
        P.fn(k => 2 ** -k, { width: 2 });
        for (let k = 0; k <= 20; k++) P.pt(k, 2 ** -k, { color: "curve", r: 4 });
        P.pt(n, 2 ** -n, { color: "gold", r: 10, ring: true });
        setPlotTitle(TeX`Error bound \(1/2^n\) on \([1, 2]\) (log scale)`); P.draw();
        const ok = 2 ** -n <= 1e-4, [m, e] = (2 ** -n).toExponential(2).split("e");
        live.innerHTML = TeX`\(n = ${n}\): bound \(= ${m}\times10^{${+e}}\) <span class="${ok ? "pos" : "neg"}">${ok ? TeX`\(\le \varepsilon\) ✓` : "too big"}</span>`;
        typeset(live);
      };
      slider(C, "n", "sn", 0, 20, 1, 4, draw); C.append(live);
      const inp = field(C, TeX`Smallest \(n =\)`, "ans1");
      return () => {
        const v = parseNum(inp.value);
        if (!Number.isFinite(v)) return ["wrong", "Type a whole number."];
        if (v === 13) return ["wrong", TeX`Close! \(1/2^{13} \approx 1.22\times10^{-4}\) is still bigger than \(\varepsilon\).`];
        if (v > 14 && Number.isInteger(v)) return ["wrong", TeX`That works, but it is not the smallest \(n\).`];
        if (v !== 14) return ["wrong", "Not quite. Find where the bound first drops below the red line."];
        return ["done", TeX`Correct! 14 iterations guarantee an error of at most \(10^{-4}\).`];
      };
    } },

  { nav: "When it fails", title: "When bisection fails",
    instr: TeX`<p>Each function below has a root in \([0, 2]\).</p><p>Which one can bisection <b>not</b> find, starting from \([0, 2]\)?</p>`,
    hints: [TeX`Check the sign of each function at \(x = 0\) and at \(x = 2\).`, "Look for a curve that touches the axis without crossing it."],
    answer: TeX`\((x - 1)^2\). It is positive at both ends and only touches the axis at \(x = 1\), so there is no sign change.`,
    build(C) {
      const fs = [[x => x ** 3 - 1, "curve", "x^3 - 1"], [x => (x - 1) ** 2, "neg", "(x - 1)^2"], [x => x - 1, "pos", "x - 1"], [x => Math.cos(x) - 0.5, "gold", TeX`\cos x - 0.5`]];
      P.setView(0, 2, -1.5, 2, { xlabel: "x" });
      fs.forEach(([g, c, n], i) => { P.fn(g, { color: c }); P.seg(0.06, 1.85 - i * 0.24, 0.18, 1.85 - i * 0.24, { color: c, width: 4 });
        P.tex(0.22, 1.85 - i * 0.24, n, { color: c, align: "left", size: 16 }); });
      setPlotTitle(TeX`Four functions, each with a root in \([0, 2]\)`); P.draw();
      const btns = cards(C, fs.map(x => TeX`\(${x[2]}\)`));
      btns.forEach((b, i) => { b.style.color = `var(--${fs[i][1]})`; });
      return () => {
        if (!S.choice) return ["wrong", "Choose one of the functions."];
        if (S.choice !== 2) return ["wrong", TeX`\(${fs[S.choice - 1][2]}\) changes sign on \([0, 2]\), so bisection can find its root.`];
        return ["done", TeX`Right! \((x - 1)^2\) touches the axis without changing sign, so bisection has nothing to grab.`];
      };
    } },

  { nav: "The algorithm", title: "Put the algorithm in order",
    instr: `<p>Put the steps of the bisection method in the right order using the menus.</p><p>When it is right, the plot runs the algorithm for you.</p>`,
    hints: ["You need a valid starting interval before anything else.", "Compute c, use it to shrink the interval, then decide whether to stop."],
    answer: TeX`1. Choose \(a, b\) with \(f(a)\,f(b) < 0\)<br>2. Compute the midpoint \(c = \frac{a+b}{2}\)<br>3. If \(f(a)\,f(c) < 0\) set \(b = c\), otherwise set \(a = c\)<br>4. If \(\frac{b-a}{2} < \text{tol}\) stop, otherwise repeat`,
    build(C) {
      // Menu options are plain text (native <select> cannot render maths).
      const steps = ["Choose a, b with f(a)·f(b) < 0", "Compute the midpoint c = (a + b)/2", "If f(a)·f(c) < 0 set b = c, otherwise set a = c", "If (b − a)/2 < tol stop, otherwise repeat"];
      const order = [2, 0, 3, 1];
      const grid = el("div", { className: "order" }); C.append(grid);
      const sels = [0, 1, 2, 3].map(k => {
        const s = el("select", { id: `dd${k + 1}` });
        s.append(el("option", { value: "" }, "— choose —"), ...order.map(i => { const o = el("option", { value: i }); o.textContent = steps[i]; return o; }));
        grid.append(el("label", { htmlFor: `dd${k + 1}`, className: "steplabel" }, `Step ${k + 1}`), s); return s;
      });
      drawBracket(1, 2, TeX`\(f(x) = x^3 - x - 2\) on \([1, 2]\)`);
      return () => {
        const v = sels.map(s => s.value);
        if (v.includes("")) return ["wrong", "Choose an option for every step."];
        if (new Set(v).size < 4) return ["wrong", "Each option should be used exactly once."];
        const bad = v.findIndex((x, k) => +x !== k);
        if (bad >= 0) return ["wrong", `Step ${bad + 1} is not in the right place yet.`];
        let a = 1, b = 2, n = 0;
        const tick = () => {
          const c = (a + b) / 2; if (f(a) * f(c) < 0) b = c; else a = c; n++;
          drawBracket(a, b, TeX`Iteration ${n}: \([a, b] = [${a.toFixed(5)}, ${b.toFixed(5)}]\)`); if (n < 8) setTimeout(tick, 380);
        };
        setTimeout(tick, 300);
        return ["done", "Perfect order! Watch the algorithm run on the plot."];
      };
    } },
];

startPractice({
  store: "nm-lec01-bisection-v1", lecture: "Lecture 1", tasks: TASKS,
  finalPlot() {
    let a = 1, b = 2; for (let n = 0; n < 12; n++) { const c = (a + b) / 2; if (f(a) * f(c) < 0) b = c; else a = c; }
    drawBracket(a, b, TeX`\(x^* \approx ${ROOT.toFixed(6)}\)`); P.pt(ROOT, 0, { color: "gold", r: 9 }); P.draw();
  },
});
