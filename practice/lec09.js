/* Lecture 9 — Machine Epsilon and Loss of Significance: practice tasks. */
"use strict";
const f32 = Math.fround;
/** Round to t significant decimal digits (the lecture's "t-digit arithmetic"). */
const rnd = (x, t) => (x === 0 ? 0 : +x.toPrecision(t));
const numberLine = (a, b, xticks, title) => { P.setView(a, b, -1, 1, { xticks, yticks: [], noY: true }); setPlotTitle(title); };
const tick = (x, color = "curve", h = 0.35, width = 3) => P.seg(x, -h, x, h, { color, width, cap: "butt" });

/** Draw the 32 bits of a single-precision word; `exp` may be null (shown as ?). */
function drawWord(sign, exp, frac, title) {
  P.setView(0, 32, -1, 1, { xticks: [], yticks: [], noY: true });
  const cells = [sign, ...(exp ?? "????????"), ...frac];
  cells.forEach((b, i) => {
    const col = i === 0 ? "neg" : i < 9 ? "pos" : "curve";
    P.band(i + 0.06, i + 0.94, -0.35, 0.35, { color: col, alpha: .22 });
    P.tex(i + 0.5, 0, b, { color: b === "?" ? "gold" : "ink", size: 15 });
  });
  P.tex(0.5, -0.65, TeX`\text{s}`, { color: "neg", size: 14 }); P.tex(5, -0.65, TeX`\text{exponent } E`, { color: "pos", size: 14 });
  P.tex(20.5, -0.65, TeX`\text{fraction } f \text{ (hidden 1 not stored)}`, { color: "curve", size: 14 });
  setPlotTitle(title); P.draw();
}

const TASKS = [
  { nav: "Machine epsilon", title: "Machine epsilon of single precision",
    instr: TeX`<p>Machine epsilon is \(\varepsilon_M = \beta^{1-t}\), the gap between \(1\) and the next floating-point number.</p>
               <p>Single precision has \(\beta = 2\) and \(t = 24\) significant bits. What is \(\varepsilon_M\)? (You may type <code>2^-23</code>.)</p>`,
    hints: [TeX`\(1 - t = 1 - 24 = -23\).`, TeX`\(2^{-23} \approx 1.19\times10^{-7}\).`],
    answer: TeX`\(\varepsilon_M = 2^{-23} \approx 1.19\times10^{-7}\), and the unit round-off is \(u = 2^{-24} \approx 5.96\times10^{-8}\).`,
    build(C) {
      numberLine(0.5, 2, [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2], TeX`With \(t = 4\) bits: the gap after \(1\) is \(2^{1-4} = 0.125\)`);
      for (let k = 8; k < 16; k++) tick(k / 16, "muted", 0.25, 2);
      for (let k = 8; k <= 16; k++) tick(k / 8, "curve", 0.3, 3);
      P.band(1, 1.125, -0.5, 0.5, { color: "gold", alpha: .3 }); P.tex(1.0625, 0.65, TeX`\varepsilon_M`, { color: "gold", size: 18 }); P.draw();
      const inp = field(C, TeX`\(\varepsilon_M =\)`, "ans1");
      return () => {
        const v = parseNum(inp.value);
        if (Math.abs(v - 2 ** -24) <= 1e-10) return ["wrong", "That is the unit round-off u, half of machine epsilon."];
        if (!(Math.abs(v - 2 ** -23) <= 2e-9)) return ["wrong", "Not quite. Compute 2 to the power 1 − 24."];
        return ["done", TeX`Correct! \(2^{-23} \approx 1.19\times10^{-7}\): about \(7\) decimal digits.`];
      };
    } },

  { nav: "The halving loop", title: "When does 1 + e stop changing?",
    instr: TeX`<p>The plot shows \((1 + 2^{-k}) - 1\) computed in double precision on this page. Drag \(k\).</p>
               <p>What is the largest \(k\) for which \(1 + 2^{-k} > 1\)?</p>`,
    hints: ["Find where the bar disappears.", TeX`Double precision has \(t = 53\), so \(\varepsilon_M = 2^{1-53}\).`],
    answer: TeX`\(k = 52\): \(1 + 2^{-52} > 1\) but \(1 + 2^{-53} = 1\). So \(\varepsilon_M = 2^{-52} \approx 2.22\times10^{-16}\).`,
    build(C) {
      const redraw = k => {
        P.setView(44.5, 56.5, 1e-18, 1e-12, { ylog: true, xlabel: "k", xticks: [45, 48, 51, 54] });
        for (let j = 45; j <= 56; j++) { const v = (1 + 2 ** -j) - 1;
          if (v > 0) P.seg(j, 1e-18, j, v, { color: j === k ? "gold" : "curve", width: 14, cap: "butt", alpha: j === k ? 1 : .6 });
          else P.tex(j, 3e-18, "0", { color: j === k ? "gold" : "neg", size: 15 }); }
        const v = (1 + 2 ** -k) - 1;
        setPlotTitle(TeX`\(k = ${k}\): \((1 + 2^{-k}) - 1 = ${v ? v.toExponential(3).replace(/e(.*)/, "\\times 10^{$1}") : "0"}\)`); P.draw();
      };
      slider(C, "k", "sk", 45, 56, 1, 48, redraw);
      const inp = field(C, "largest k =", "ans1");
      return () => {
        const v = parseNum(inp.value);
        if (v === 53) return ["wrong", "At k = 53 the sum already rounds back to 1. Look one step earlier."];
        if (v !== 52) return ["wrong", "Not quite. Find the last k with a visible bar."];
        return ["done", TeX`Correct! \(\varepsilon_M = 2^{-52} \approx 2.22\times10^{-16}\) for doubles.`];
      };
    } },

  { nav: "Order matters", title: "Add the small numbers first",
    instr: TeX`<p>Use \(4\)-digit rounding after every operation. From left to right, \((1.000 + 0.0003) + 0.0003 = 1.000\).</p>
               <p>What is \(1.000 + (0.0003 + 0.0003)\)?</p>`,
    hints: [TeX`\(0.0003 + 0.0003 = 0.0006\) is exact.`, TeX`\(1.0006\) rounded to \(4\) digits.`],
    answer: TeX`\(1.000 + 0.0006 = 1.0006 \to 1.001\), the correctly rounded exact sum.`,
    build(C) {
      numberLine(0.9995, 1.0015, [1, 1.001], TeX`The \(4\)-digit numbers near \(1\)`);
      [1, 1.001].forEach(x => tick(x, "curve", 0.4, 4));
      P.pt(1.0003, 0, { color: "neg", r: 6 }); P.tex(1.0003, 0.5, "1.0003", { color: "neg", size: 14 });
      P.pt(1.0006, 0, { color: "gold", r: 6 }); P.tex(1.0006, -0.5, "1.0006", { color: "gold", size: 14 });
      P.seg(1.0005, -0.7, 1.0005, 0.7, { color: "muted", dash: true, width: 1.5 }); P.draw();
      const inp = field(C, "result =", "ans1");
      return () => {
        const v = parseNum(inp.value);
        if (v === 1) return ["wrong", "That is the left-to-right answer. Add the two small numbers first."];
        if (v === 1.0006) return ["wrong", "Now round 1.0006 to 4 significant digits."];
        if (!near(v, 1.001, 1e-12)) return ["wrong", "Not quite. Add 0.0003 + 0.0003, then add 1.000 and round."];
        return ["done", TeX`Correct! Grouping changes the answer: floating-point addition is not associative.`];
      };
    } },

  { nav: "Errors in products", title: "How errors travel through a product",
    instr: TeX`<p>\(x\) is known with relative error \(2\times10^{-4}\) and \(y\) with relative error \(3\times10^{-4}\) (both positive errors).</p>
               <p>About what is the relative error of \(xy\)?</p>`,
    hints: [TeX`\(x(1+\varepsilon_1)\,y(1+\varepsilon_2) \approx xy(1 + \varepsilon_1 + \varepsilon_2)\).`],
    answer: TeX`\(\varepsilon_1 + \varepsilon_2 = 5\times10^{-4}\). For \(x/y\) it would be \(\varepsilon_1 - \varepsilon_2 = -1\times10^{-4}\).`,
    build(C) {
      P.setView(-0.6, 2.6, 0, 6, { xticks: [], yticks: [0, 1, 2, 3, 4, 5] });
      [[0, 2, "pos", TeX`\varepsilon_1`], [1, 3, "curve", TeX`\varepsilon_2`]].forEach(([i, h, c, s]) => {
        P.seg(i, 0, i, h, { color: c, width: 40, cap: "butt" }); P.tex(i, h, s, { dy: -14, size: 17, color: c }); });
      P.tex(2, 1, "?", { size: 26, color: "gold" }); setPlotTitle(TeX`Relative errors in units of \(10^{-4}\)`); P.draw();
      const inp = field(C, "relative error ≈", "ans1", "e.g. 1e-4");
      return () => {
        const v = parseNum(inp.value);
        if (Math.abs(v - 6e-8) <= 1e-9) return ["wrong", "The errors are not multiplied: in a product they add."];
        if (!(Math.abs(v - 5e-4) <= 1e-6)) return ["wrong", "Not quite. Products add the relative errors."];
        return ["done", TeX`Correct! \(5\times10^{-4}\): multiplication and division are safe.`];
      };
    } },

  { nav: "Amplification", title: "The amplification factor of a sum",
    instr: TeX`<p>For \(x + y\), the relative error can be amplified by \(\dfrac{|x| + |y|}{|x + y|}\).</p><p>Compute this factor for \(x = 1.2345\), \(y = -1.2340\).</p>`,
    hints: [TeX`\(|x| + |y| = 2.4685\).`, TeX`\(|x + y| = 0.0005\).`],
    answer: TeX`\(\dfrac{2.4685}{0.0005} = 4937\): input errors of \(10^{-5}\) can become errors of about \(5\%\).`,
    build(C) {
      P.setView(-1.5, -0.5, 0, 50, { xlabel: TeX`y/x`, xticks: [-1.5, -1.25, -1, -0.75, -0.5], yticks: [0, 10, 20, 30, 40, 50] });
      P.fn(r => (1 + Math.abs(r)) / Math.abs(1 + r), { color: "gold" });
      P.seg(-1, 0, -1, 50, { color: "neg", dash: true, width: 1.5 }); P.tex(-0.98, 45, TeX`y = -x`, { color: "neg", align: "left", size: 15 });
      setPlotTitle(TeX`\(\frac{|x| + |y|}{|x + y|}\) blows up as \(y \to -x\)`); P.draw();
      const inp = field(C, "factor =", "ans1");
      return () => {
        if (!(Math.abs(parseNum(inp.value) - 4937) <= 2)) return ["wrong", "Not quite. Divide |x| + |y| by |x + y|."];
        return ["done", TeX`Correct! A factor of about \(5000\): catastrophic cancellation.`];
      };
    } },

  { nav: "Spot the cancellation", title: "Which formula loses digits?",
    instr: TeX`<p>The plot compares two formulas for the same quantity, computed in single precision, for large \(x\). Which formula suffers from cancellation?</p>`,
    hints: ["Look for a subtraction of two nearly equal numbers.", TeX`For large \(x\), \(\sqrt{x^2+1} \approx x\).`],
    answer: TeX`\(\sqrt{x^2+1} - x\): both terms are about \(x\). The equal form \(\frac{1}{\sqrt{x^2+1} + x}\) adds instead.`,
    build(C) {
      const exact = x => 1 / (Math.sqrt(x * x + 1) + x);
      const naive = x => f32(f32(Math.sqrt(f32(f32(f32(x) * f32(x)) + 1))) - f32(x));
      const stable = x => f32(1 / f32(f32(Math.sqrt(f32(f32(f32(x) * f32(x)) + 1))) + f32(x)));
      const rel = g => x => Math.max(Math.abs(g(x) - exact(x)) / exact(x), 1e-9);
      P.setView(1, 3000, 1e-9, 2, { ylog: true, xlabel: "x", xticks: [500, 1000, 1500, 2000, 2500, 3000] });
      P.fn(rel(naive), { color: "neg", width: 2 }); P.fn(rel(stable), { color: "pos", width: 2 });
      P.tex(2900, 0.3, TeX`\text{formula A}`, { color: "neg", align: "right", size: 15 }); P.tex(2900, 2e-8, TeX`\text{formula B}`, { color: "pos", align: "right", size: 15 });
      setPlotTitle("Relative error in single precision"); P.draw();
      cards(C, [TeX`A: \(\sqrt{x^2+1} - x\)`, TeX`B: \(\dfrac{1}{\sqrt{x^2+1} + x}\)`]);
      return () => {
        if (!S.choice) return ["wrong", "Choose one of the options."];
        if (S.choice !== 1) return ["wrong", "Formula B has no subtraction. Look at the red curve."];
        return ["done", TeX`Right! Formula A subtracts two numbers close to \(x\); by \(x = 3000\) its error is about \(46\%\).`];
      };
    } },

  { nav: "Rationalise", title: "Fix a cancellation",
    instr: TeX`<p>In \(6\)-digit arithmetic, \(\sqrt{10001} = 100.005\) and \(\sqrt{10000} = 100.000\), so the direct difference is \(0.005\): only one correct digit.</p>
               <p>Compute \(\dfrac{1}{\sqrt{10001} + \sqrt{10000}}\) instead, to \(6\) significant digits.</p>`,
    hints: [TeX`The denominator is \(100.005 + 100.000 = 200.005\).`, TeX`\(1/200.005\).`],
    answer: TeX`\(\frac{1}{200.005} = 0.00499988\) (true value \(0.004999875\ldots\)).`,
    build(C) {
      numberLine(0.0049994, 0.0050006, [0.0049995, 0.005, 0.0050005], TeX`Near \(0.005\)`);
      P.pt(0.005, 0, { color: "neg", r: 7 }); P.tex(0.005, 0.5, TeX`\text{direct}`, { color: "neg", size: 14 });
      P.pt(0.004999875, 0, { color: "pos", r: 7, ring: true }); P.tex(0.004999875, -0.5, TeX`\text{true}`, { color: "pos", size: 14 }); P.draw();
      const inp = field(C, "value =", "ans1");
      return () => {
        const v = parseNum(inp.value);
        if (near(v, 0.005, 1e-12)) return ["wrong", "That is the direct difference. Use the rewritten formula."];
        if (!(Math.abs(v - 0.004999875) <= 6e-9)) return ["wrong", "Not quite. Add the two square roots, then take the reciprocal."];
        return ["done", TeX`Correct! \(0.00499988\): every digit right, because we added instead of subtracting.`];
      };
    } },

  { nav: "Stable quadratic", title: "The small root of a quadratic",
    instr: TeX`<p>For \(x^2 + 40x + 1 = 0\), the formula \(\frac{-b + \sqrt{b^2 - 4ac}}{2a}\) subtracts nearly equal numbers.</p>
               <p>Use \(x_1 = \dfrac{-2c}{b + \sqrt{b^2 - 4ac}}\) to compute the small root (5 significant digits).</p>`,
    hints: [TeX`\(\sqrt{1600 - 4} = \sqrt{1596} \approx 39.9500\).`, TeX`\(x_1 = \frac{-2}{40 + 39.9500}\).`],
    answer: TeX`\(x_1 = \frac{-2}{79.9500} \approx -0.025016\). The other root is \(-39.975\).`,
    build(C) {
      P.setView(-0.05, 0.01, -0.6, 0.6, { xlabel: "x", xticks: [-0.04, -0.03, -0.02, -0.01, 0] });
      P.fn(x => x * x + 40 * x + 1); P.pt(-0.0250156, 0, { color: "gold", r: 7 });
      setPlotTitle(TeX`\(y = x^2 + 40x + 1\) near its small root`); P.draw();
      const inp = field(C, TeX`\(x_1 =\)`, "ans1");
      return () => {
        const v = parseNum(inp.value);
        if (Math.abs(v - 0.0250156) <= 3e-6) return ["wrong", "Check the sign: the root is negative."];
        if (!(Math.abs(v + 0.0250156) <= 3e-6)) return ["wrong", "Not quite. Compute b + √(b² − 4ac) first, then −2c divided by it."];
        return ["done", TeX`Correct! \(x_1 \approx -0.025016\), accurate because only additions of like signs occur.`];
      };
    } },

  { nav: "IEEE exponent", title: "Encode 10 in single precision",
    instr: TeX`<p>\(10 = 1010_2 = 1.010_2 \times 2^{3}\). Single precision stores the exponent as \(E = e + 127\) in \(8\) bits.</p>
               <p>What are the \(8\) exponent bits of \(10\)?</p>`,
    hints: [TeX`\(E = 3 + 127 = 130\).`, TeX`\(130 = 128 + 2\).`],
    answer: TeX`\(E = 130 = 10000010_2\). The word is \(0\;10000010\;0100\ldots0\).`,
    build(C) {
      drawWord("0", null, "01000000000000000000000", TeX`\(10 = (-1)^0 \times 1.01_2 \times 2^{E - 127}\)`);
      const inp = field(C, "E =", "ans1", "8 binary digits");
      return () => {
        const b = inp.value.trim().replace(/\s+/g, "");
        if (b === "130") return ["wrong", "Right value, E = 130. Now write it as 8 binary digits."];
        if (!/^[01]{8}$/.test(b)) return ["wrong", "Type exactly 8 binary digits."];
        if (parseInt(b, 2) !== 130) return ["wrong", TeX`That is ${parseInt(b, 2)}. You need \(3 + 127\).`];
        drawWord("0", b, "01000000000000000000000", TeX`\(10\) in single precision`);
        return ["done", TeX`Correct! \(E = 130 = 10000010_2\).`];
      };
    } },
];

startPractice({
  store: "nm-lec09-rounding-errors-v1", lecture: "Lecture 9", tasks: TASKS,
  finalPlot() {
    P.setView(-5, 60, 1e-17, 100, { ylog: true, xlabel: "j", xticks: [0, 10, 20, 30, 40, 50, 60] });
    P.fn(j => 2 ** (Math.floor(j) - 52), { color: "curve" });
    P.pt(0, 2 ** -52, { color: "gold", r: 7 }); P.tex(2, 2 ** -52, TeX`\varepsilon_M`, { color: "gold", align: "left", size: 16 });
    P.pt(53, 2, { color: "neg", r: 7 }); P.tex(51, 2, TeX`10^{16}: \text{ gap } 2`, { color: "neg", align: "right", size: 15 });
    setPlotTitle(TeX`Gap between doubles in \([2^j, 2^{j+1})\) is \(2^{j-52}\)`); P.draw();
  },
});
