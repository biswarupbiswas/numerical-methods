/* Lecture 8 — Errors and Floating-Point Numbers: practice tasks. */
"use strict";
const bits = s => String(s).trim().replace(/\s+/g, "").replace(/_?2$/, "");

/** A horizontal number line on [a, b] with tick marks at the given values. */
function numberLine(a, b, xticks, title) {
  P.setView(a, b, -1, 1, { xticks, yticks: [], noY: true });
  setPlotTitle(title);
}
const tick = (x, color = "curve", h = 0.35, width = 3) => P.seg(x, -h, x, h, { color, width, cap: "butt" });

/** Positive numbers of F(2, t, L, U). */
function toySystem(t, L, U) {
  const out = [];
  for (let e = L; e <= U; e++) for (let k = 2 ** (t - 1); k < 2 ** t; k++) out.push(k / 2 ** t * 2 ** e);
  return out;
}
/** Chop x > 0 to t binary digits. */
function chop2(x, t) { const e = Math.floor(Math.log2(x)) + 1; return Math.floor(x / 2 ** e * 2 ** t) / 2 ** t * 2 ** e; }

const TASKS = [
  { nav: "Relative error", title: "Absolute and relative error",
    instr: TeX`<p>The exact value is \(x = 250\) and the approximation is \(x^* = 250.5\).</p><p>Compute the relative error \(\dfrac{|x - x^*|}{|x|}\).</p>`,
    hints: [TeX`The absolute error is \(|250 - 250.5| = 0.5\).`, TeX`Divide by \(|x| = 250\).`],
    answer: TeX`\(\dfrac{0.5}{250} = 0.002\), that is \(0.2\%\).`,
    build(C) {
      numberLine(249.4, 251.1, [249.5, 250, 250.5, 251], TeX`\(x\) and \(x^*\) on the number line`);
      P.band(250, 250.5, -0.2, 0.2, { color: "neg", alpha: .25 });
      P.pt(250, 0, { color: "pos", r: 7 }); P.pt(250.5, 0, { color: "gold", r: 7 });
      P.tex(250, 0.45, "x", { color: "pos", size: 18 }); P.tex(250.5, 0.45, "x^*", { color: "gold", size: 18 });
      P.tex(250.25, -0.45, TeX`\text{absolute error } 0.5`, { color: "neg", size: 15 }); P.draw();
      const inp = field(C, "relative error =", "ans1");
      return () => {
        const v = parseNum(inp.value);
        if (Math.abs(v - 0.002) <= 2e-5) return ["done", TeX`Correct! \(0.5/250 = 0.002\). The same absolute error near \(1\) would be a \(50\%\) relative error.`];
        if (Math.abs(v - 0.5) <= 1e-9) return ["wrong", "That is the absolute error. Now divide by |x|."];
        return ["wrong", "Not quite. Divide the absolute error by |x| = 250."];
      };
    } },

  { nav: "Significant digits", title: "Count the significant digits",
    instr: TeX`<p>\(x^* = 2.718\) approximates \(e = 2.7182818\ldots\)</p>
               <p>\(x^*\) has \(t\) significant digits if \(\dfrac{|x - x^*|}{|x|} \le 5\times 10^{-t}\). What is the largest such \(t\)?</p>`,
    hints: [TeX`\(|e - 2.718| \approx 2.8\times10^{-4}\), so the relative error is about \(1.04\times10^{-4}\).`, TeX`Is \(1.04\times10^{-4} \le 5\times10^{-4}\)? Is it \(\le 5\times10^{-5}\)?`],
    answer: TeX`Relative error \(\approx 1.04\times10^{-4} \le 5\times10^{-4}\) but \(> 5\times10^{-5}\), so \(t = 4\).`,
    build(C) {
      P.setView(0.5, 6.5, 1e-7, 1e-2, { ylog: true, xlabel: "t", xticks: [1, 2, 3, 4, 5, 6] });
      P.fn(t => 5 * 10 ** -t, { color: "muted", width: 2, dash: true });
      for (let t = 1; t <= 6; t++) P.pt(t, 5 * 10 ** -t, { color: "muted", r: 5 });
      P.seg(0.5, 1.036e-4, 6.5, 1.036e-4, { color: "gold", width: 3 });
      P.tex(6.4, 2.2e-4, TeX`\text{relative error}`, { color: "gold", align: "right", size: 15 });
      P.tex(1.2, 2e-6, TeX`5\times10^{-t}`, { color: "muted", size: 15, align: "left" });
      setPlotTitle(TeX`Which thresholds \(5\times10^{-t}\) lie above the error?`); P.draw();
      const inp = field(C, TeX`\(t =\)`, "ans1");
      return () => {
        if (parseNum(inp.value) !== 4) return ["wrong", "Not quite. Find the last t whose threshold is still above the gold line."];
        return ["done", TeX`Correct! \(2.718\) has \(4\) significant digits.`];
      };
    } },

  { nav: "Integer to binary", title: "Write 25 in binary",
    instr: TeX`<p>Divide by \(2\) repeatedly and read the remainders from the bottom up.</p><p>What is \(25\) in base \(2\)?</p>`,
    hints: [TeX`\(25 = 12\cdot2 + 1\), \(12 = 6\cdot2 + 0\), \(6 = 3\cdot2 + 0\), \(3 = 1\cdot2 + 1\), \(1 = 0\cdot2 + 1\).`, TeX`Equivalently \(25 = 16 + 8 + 1\).`],
    answer: TeX`\(25 = 16 + 8 + 1 = 11001_2\).`,
    build(C) {
      const pw = [16, 8, 4, 2, 1], draw = on => {
        P.setView(-0.6, 4.6, 0, 18, { xticks: [], yticks: [0, 4, 8, 12, 16] });
        pw.forEach((p, i) => { P.seg(i, 0, i, p, { color: on && on[i] === "1" ? "pos" : "muted", width: 34, cap: "butt", alpha: on && on[i] === "1" ? 1 : .45 });
          P.tex(i, p, TeX`2^{${4 - i}}`, { dy: -12, size: 15 }); });
        setPlotTitle(on ? TeX`\(25 = 16 + 8 + 1\)` : "Powers of two"); P.draw();
      };
      draw(null);
      const inp = field(C, "25 =", "ans1", "binary digits, e.g. 101");
      return () => {
        const b = bits(inp.value);
        if (!/^[01]+$/.test(b)) return ["wrong", "Use only the digits 0 and 1."];
        if (parseInt(b, 2) !== 25) return ["wrong", TeX`That is ${parseInt(b, 2)} in decimal. Try again.`];
        draw("11001"); return ["done", TeX`Correct! \(25 = 11001_2\).`];
      };
    } },

  { nav: "Fraction to binary", title: "Write 0.625 in binary",
    instr: TeX`<p>Double repeatedly and read off the integer parts: \(0.625\times2 = 1.25 \to 1\), and so on.</p><p>What is \(0.625\) in base \(2\)?</p>`,
    hints: [TeX`\(0.25\times2 = 0.5 \to 0\), then \(0.5\times2 = 1.0 \to 1\).`],
    answer: TeX`\(0.625 = 0.101_2 = \tfrac12 + \tfrac18\).`,
    build(C) {
      numberLine(0, 1, [0, 0.25, 0.5, 0.75, 1], TeX`Halving \([0, 1]\): each binary digit picks a half`);
      [[0, 1, -0.15], [0.5, 1, -0.4], [0.5, 0.75, -0.65]].forEach(([a, b, y], k) => P.seg(a, y, b, y, { color: ["gold", "pos", "curve"][k], width: 6 }));
      for (let k = 0; k <= 8; k++) tick(k / 8, "muted", 0.12, 1.5);
      P.pt(0.625, 0.3, { color: "gold", r: 7 }); P.tex(0.625, 0.6, "0.625", { color: "gold", size: 15 }); P.draw();
      const inp = field(C, "0.625 =", "ans1", "e.g. 0.011");
      return () => {
        const b = bits(inp.value);
        if (!/^0?\.[01]+$/.test(b)) return ["wrong", "Write it as 0. followed by binary digits."];
        const v = [...b.split(".")[1]].reduce((s, d, i) => s + +d / 2 ** (i + 1), 0);
        if (v !== 0.625) return ["wrong", TeX`That is ${v} in decimal. Keep doubling.`];
        return ["done", TeX`Correct! \(0.625 = 0.101_2\): the right half, then the left half, then the right half.`];
      };
    } },

  { nav: "Finite in binary?", title: "Which number is exact in binary?",
    instr: TeX`<p>Only one of these numbers has a <b>finite</b> binary expansion, so it can be stored exactly. Which one?</p>`,
    hints: [TeX`A fraction has a finite binary expansion only if its denominator (in lowest terms) is a power of \(2\).`],
    answer: TeX`\(0.25 = \frac14 = 0.01_2\). The others (\(\frac1{10}, \frac15, \frac13\)) repeat forever.`,
    build(C) {
      numberLine(0, 0.5, [0, 0.125, 0.25, 0.375, 0.5], TeX`Binary grid \(k/16\) and the candidates`);
      for (let k = 0; k <= 8; k++) tick(k / 16, "muted", 0.15, 1.5);
      [[0.1, "0.1"], [0.2, "0.2"], [0.25, "0.25"], [1 / 3, "1/3"]].forEach(([x, s], i) => {
        P.pt(x, 0, { color: "gold", r: 6 }); P.tex(x, i % 2 ? -0.45 : 0.45, s, { color: "gold", size: 15 }); });
      P.draw();
      cards(C, [TeX`\(0.1\)`, TeX`\(0.2\)`, TeX`\(0.25\)`, TeX`\(1/3\)`]);
      return () => {
        if (!S.choice) return ["wrong", "Choose one of the options."];
        if (S.choice !== 3) return ["wrong", "Write it as a fraction in lowest terms. Is the denominator a power of 2?"];
        return ["done", TeX`Right! \(0.25 = 0.01_2\). By contrast \(0.1 = 0.0\overline{0011}_2\) never ends.`];
      };
    } },

  { nav: "Count the numbers", title: "How many numbers in the system?",
    instr: TeX`<p>The system \(F(\beta, t, L, U)\) has \(2(\beta - 1)\beta^{t-1}(U - L + 1) + 1\) numbers.</p><p>How many numbers does \(F(2, 4, -2, 3)\) contain?</p>`,
    hints: [TeX`\(\beta - 1 = 1\), \(\beta^{t-1} = 2^3 = 8\), \(U - L + 1 = 6\).`, TeX`\(2\cdot1\cdot8\cdot6 + 1\).`],
    answer: TeX`\(2\cdot1\cdot8\cdot6 + 1 = 97\): \(48\) positive, \(48\) negative and zero.`,
    build(C) {
      const xs = toySystem(4, -2, 3);
      numberLine(0, 8, [0, 1, 2, 3, 4, 5, 6, 7, 8], TeX`The positive numbers of \(F(2, 4, -2, 3)\)`);
      xs.forEach(x => tick(x, "curve", 0.3, 2)); P.pt(0, 0, { color: "ink", r: 4 }); P.draw();
      const inp = field(C, "count =", "ans1");
      return () => {
        const v = parseNum(inp.value);
        if (v === 96) return ["wrong", "Almost: don't forget zero."];
        if (v === 48) return ["wrong", "That is only the positive numbers. Add the negatives and zero."];
        if (v !== 97) return ["wrong", "Not quite. Put the four parameters into the formula."];
        return ["done", TeX`Correct! \(97\) numbers, from \(x_L = 2^{-3} = 0.125\) up to \(x_U = (1 - 2^{-4})\,2^3 = 7.5\).`];
      };
    } },

  { nav: "Spacing", title: "The gap between neighbours",
    instr: TeX`<p>The plot shows the positive numbers of \(F(2, 3, -1, 2)\). Drag the slider to highlight the numbers with exponent \(e\).</p>
               <p>What is the gap between consecutive numbers in \([2, 4)\)?</p>`,
    hints: ["Highlight e = 2 and read off the numbers.", TeX`They are \(2, 2.5, 3, 3.5\).`],
    answer: TeX`The gap is \(0.5 = 2^{e-t}\) with \(e = 2\), \(t = 3\). It doubles every time \(e\) goes up by one.`,
    build(C) {
      const redraw = e => {
        numberLine(0, 4, [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4], TeX`Exponent \(e = ${e}\): numbers in \([2^{${e - 1}}, 2^{${e}})\)`);
        toySystem(3, -1, 2).forEach(x => tick(x, "muted", 0.25, 2));
        [0.5, 0.625, 0.75, 0.875].forEach(m => tick(m * 2 ** e, "gold", 0.4, 4));
        P.band(2 ** (e - 1), 2 ** e, -0.5, 0.5, { color: "gold", alpha: .12 }); P.draw();
      };
      slider(C, "e", "se", -1, 2, 1, -1, redraw);
      const inp = field(C, "gap =", "ans1");
      return () => {
        if (!(Math.abs(parseNum(inp.value) - 0.5) <= 1e-9)) return ["wrong", "Not quite. Set e = 2 and subtract neighbouring gold ticks."];
        return ["done", TeX`Correct! Gaps \(\tfrac1{16}, \tfrac18, \tfrac14, \tfrac12\): uneven, but the same relative size.`];
      };
    } },

  { nav: "Chop and round", title: "Chop and round by hand",
    instr: TeX`<p>Use \(\beta = 10\) and \(t = 3\) digits. Write \(x = 0.0345678 = 0.345678\times10^{-1}\).</p>
               <p>Give the chopped and the rounded value of \(x\) (as ordinary decimals).</p>`,
    hints: [TeX`Keep three mantissa digits: \(0.345\,|\,678\times10^{-1}\).`, TeX`The dropped part \(678\) is more than half, so rounding goes up.`],
    answer: TeX`Chopped \(0.345\times10^{-1} = 0.0345\); rounded \(0.346\times10^{-1} = 0.0346\).`,
    build(C) {
      numberLine(0.03445, 0.03465, [0.0345, 0.0346], TeX`\(x\) between two neighbours of \(F(10, 3, L, U)\)`);
      [0.0345, 0.0346].forEach(x => tick(x, "curve", 0.4, 4));
      P.pt(0.0345678, 0, { color: "gold", r: 7 }); P.tex(0.0345678, 0.55, "x", { color: "gold", size: 18 });
      P.seg(0.03455, -0.6, 0.03455, 0.6, { color: "muted", dash: true, width: 1.5 }); P.tex(0.03455, -0.75, TeX`\text{midpoint}`, { color: "muted", size: 13 });
      P.draw();
      const a = field(C, "chopped =", "ans1"), b = field(C, "rounded =", "ans2");
      return () => {
        const va = parseNum(a.value), vb = parseNum(b.value);
        if (!near(va, 0.0345, 1e-9)) return ["wrong", "Check the chopped value: just drop the digits after the third."];
        if (!near(vb, 0.0346, 1e-9)) return ["wrong", "Check the rounded value: which neighbour is nearer to x?"];
        return ["done", TeX`Correct! Chopping always moves towards zero; rounding picks the nearer neighbour.`];
      };
    } },

  { nav: "Bound the error", title: "Bound the relative error",
    instr: TeX`<p>With chopping, \(\mathrm{fl}(x) = x(1 + \varepsilon)\) with \(|\varepsilon| < \beta^{1-t}\). The plot shows the actual relative error for \(\beta = 2\), \(t = 4\).</p>
               <p>A computer that chops to \(\beta = 2\), \(t = 24\) binary digits: what is the bound \(\beta^{1-t}\)? (You may type <code>2^-23</code>.)</p>`,
    hints: [TeX`\(\beta^{1-t} = 2^{1-24} = 2^{-23}\).`, TeX`\(2^{-23} \approx 1.19\times10^{-7}\).`],
    answer: TeX`\(2^{1-24} = 2^{-23} \approx 1.19\times10^{-7}\): every chopped number has relative error below this.`,
    build(C) {
      P.setView(1, 8, 0, 0.14, { xlabel: "x", yticks: [0, 0.0625, 0.125] });
      P.fn(x => (x - chop2(x, 4)) / x, { color: "neg", width: 2 });
      P.seg(1, 0.125, 8, 0.125, { color: "gold", dash: true, width: 2 }); P.tex(7.9, 0.133, TeX`\beta^{1-t} = 2^{-3}`, { color: "gold", align: "right", size: 15 });
      setPlotTitle(TeX`Relative chopping error \(\frac{x - \mathrm{fl}(x)}{x}\) for \(t = 4\)`); P.draw();
      const inp = field(C, TeX`\(\beta^{1-t} =\)`, "ans1");
      return () => {
        if (!(Math.abs(parseNum(inp.value) - 2 ** -23) <= 2e-9)) return ["wrong", "Not quite. Compute 2 to the power 1 − 24."];
        return ["done", TeX`Correct! \(2^{-23} \approx 1.19\times10^{-7}\): the error never reaches this level, whatever \(x\) is.`];
      };
    } },
];

startPractice({
  store: "nm-lec08-floating-point-v1", lecture: "Lecture 8", tasks: TASKS,
  finalPlot() {
    numberLine(0, 4, [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4], TeX`The 16 positive numbers of \(F(2, 3, -1, 2)\)`);
    const cols = ["curve", "gold", "pos", "neg"];
    [-1, 0, 1, 2].forEach((e, i) => [0.5, 0.625, 0.75, 0.875].forEach(m => tick(m * 2 ** e, cols[i], 0.4, 4)));
    P.draw();
  },
});
