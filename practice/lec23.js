/* Lecture 23 — The Shifted Inverse Power Method: practice tasks. */
"use strict";

const EV = [1.1206, 3.3473, 4.5321];

/** Number line with eigenvalues, an optional shift sigma and the region it falls in. */
function shiftPlot(eigs, sigma, title) {
  const lo = Math.min(...eigs) - 1, hi = Math.max(...eigs) + 1;
  P.setView(lo, hi, -1, 1, { xticks: [...Array(Math.floor(hi) - Math.ceil(lo) + 1).keys()].map(i => i + Math.ceil(lo)), yticks: [], noY: true });
  const s = [...eigs].sort((a, b) => a - b);
  const cuts = [lo, ...s.slice(1).map((e, i) => (e + s[i]) / 2), hi], cols = ["pos", "gold", "curve", "neg"];
  for (let i = 0; i < s.length; i++) P.band(cuts[i], cuts[i + 1], -0.8, -0.1, { color: cols[i % 4], alpha: 0.18 });
  P.seg(lo, 0, hi, 0, { color: "ink", width: 1, alpha: 0.6 });
  s.forEach((e, i) => P.pt(e, 0, { color: cols[i % 4], r: 7 }));
  if (sigma !== undefined) { P.seg(sigma, 0.5, sigma, -0.9, { color: "neg", width: 3 }); P.tex(sigma, 0.7, TeX`\sigma`, { size: 18, color: "neg" }); }
  setPlotTitle(title); P.draw();
}

function rateFor(eigs, sigma) {
  const d = eigs.map(e => Math.abs(e - sigma)).sort((a, b) => a - b);
  return { rate: d[0] / d[1], found: eigs.reduce((b, e) => Math.abs(e - sigma) < Math.abs(b - sigma) ? e : b) };
}

const TASKS = [
  { nav: "Which eigenvalue?", title: "What does σ find?",
    instr: TeX`<p>\(A\) has eigenvalues \(1\), \(4\) and \(9\). Which one does the shifted inverse power method with \(\sigma=5\) find?</p>`,
    hints: ["It finds the eigenvalue nearest to σ."],
    answer: TeX`\(4\): it is \(1\) away from \(5\), while \(9\) is \(4\) away.`,
    build(C) {
      shiftPlot([1, 4, 9], 5, TeX`Regions: each eigenvalue is found by the shifts nearest to it`);
      const inp = field(C, "eigenvalue found =", "ans1");
      return () => near(parseNum(inp.value), 4, 1e-9) ? ["done", "Correct! σ = 5 lies in the region of 4."] : ["wrong", "Not quite. Which eigenvalue is closest to 5?"];
    } },

  { nav: "Predict the rate", title: "How fast?",
    instr: TeX`<p>Same eigenvalues \(1,\ 4,\ 9\) and \(\sigma=5\). What is the rate \(\dfrac{|\lambda_J-\sigma|}{|\lambda_K-\sigma|}\)?</p>`,
    hints: [TeX`Nearest: \(|4-5|=1\). Next nearest: \(|9-5|=4\) (and \(|1-5|=4\) too).`],
    answer: TeX`\(1/4=0.25\).`,
    build(C) {
      shiftPlot([1, 4, 9], 5, TeX`\(\sigma=5\)`);
      const inp = field(C, "rate =", "ans1");
      return () => near(parseNum(inp.value), 0.25, 1e-9) ? ["done", "Correct! The error shrinks by a factor 4 each step."] : ["wrong", "Not quite. Divide the nearest distance by the next nearest."];
    } },

  { nav: "Slide the shift", title: "Make it fast",
    instr: TeX`<p>The matrix of the lecture has eigenvalues \(1.1206,\ 3.3473,\ 4.5321\). Drag \(\sigma\) and watch which eigenvalue it finds and at what rate.</p><p>Find a shift with rate below \(0.01\), and type it.</p>`,
    hints: ["Put σ very close to one of the eigenvalues, e.g. within 0.01 of 3.3473."],
    answer: TeX`Any \(\sigma\) close enough to an eigenvalue, e.g. \(\sigma=3.34\) (rate \(0.006\)).`,
    build(C) {
      let s = 2.5;
      const draw = () => { const r = rateFor(EV, s); shiftPlot(EV, s, TeX`\(\sigma=${s.toFixed(3)}\): finds \(${r.found}\), rate \(${r.rate.toFixed(3)}\)`); };
      draw();
      slider(C, "σ", "ss", 0.2, 5.4, 0.005, 2.5, v => { s = v; draw(); });
      const inp = field(C, TeX`\(\sigma=\)`, "ans1");
      return () => { const x = parseNum(inp.value); return isFinite(x) && rateFor(EV, x).rate < 0.01 ? ["done", "Correct! The closer the shift, the faster the convergence."] : ["wrong", "That shift gives a rate of 0.01 or more. Move it closer to an eigenvalue."]; };
    } },

  { nav: "A shifted step", title: "One step by hand",
    instr: TeX`<p>For \(A=\begin{bmatrix}4&3\\2&5\end{bmatrix}\) and \(\sigma=6\), \((A-6I)^{-1}=\tfrac14\begin{bmatrix}1&3\\2&2\end{bmatrix}\). From \(\mathbf v^{(0)}=(1,0)\), compute \(\mathbf y^{(1)}\), \(\alpha^{(1)}\) and \(\lambda^{(1)}=\sigma+1/\alpha^{(1)}\).</p>`,
    hints: [TeX`\(\mathbf y^{(1)}=\tfrac14(1,\ 2)\), so \(\alpha^{(1)}=\tfrac12\).`],
    answer: TeX`\(\lambda^{(1)}=6+2=8\); then \(7.1429,\ 7.0769,\ 7.0097,\dots\to7\).`,
    build(C) {
      shiftPlot([2, 7], 6, TeX`\(\lambda=2,\ 7\) and \(\sigma=6\)`);
      const inp = field(C, TeX`\(\lambda^{(1)}=\)`, "ans1");
      return () => near(parseNum(inp.value), 8, 1e-9) ? ["done", "Correct! Don't forget to add σ back."] : ["wrong", "Not quite. Compute 1/α and add σ = 6."];
    } },

  { nav: "Undo the shift", title: "From α to λ",
    instr: TeX`<p>With \(\sigma=3.3\) the method returns \(\alpha=21.1\). What is the eigenvalue estimate? (4 decimals)</p>`,
    hints: [TeX`\(\lambda=\sigma+\frac1\alpha\).`],
    answer: TeX`\(3.3+\frac{1}{21.1}\approx3.3474\), the middle eigenvalue \(3.3473\).`,
    build(C) {
      shiftPlot(EV, 3.3, TeX`\(\sigma=3.3\)`);
      const inp = field(C, TeX`\(\lambda\approx\)`, "ans1");
      return () => near(parseNum(inp.value), 3.34739, 2e-4) ? ["done", "Correct! A large α means σ was very close."] : ["wrong", "Not quite. Add 1/21.1 to 3.3."];
    } },

  { nav: "Region boundary", title: "Where does the answer switch?",
    instr: TeX`<p>\(A\) has eigenvalues \(2\) and \(7\). Above which value of \(\sigma\) does the method find \(7\) instead of \(2\)?</p>`,
    hints: ["The boundary lies halfway between the two eigenvalues."],
    answer: TeX`\(\sigma=4.5\). Exactly at \(4.5\) both are equally near and the rate is \(1\): no convergence.`,
    build(C) {
      shiftPlot([2, 7], 4.5, TeX`\(\sigma=4.5\)`);
      const inp = field(C, TeX`\(\sigma>\)`, "ans1");
      return () => near(parseNum(inp.value), 4.5, 1e-9) ? ["done", "Correct! At the boundary the two distances are equal."] : ["wrong", "Not quite. Take the midpoint of 2 and 7."];
    } },

  { nav: "A shift on λ", title: "σ exactly an eigenvalue",
    instr: TeX`<p>What happens if \(\sigma\) is exactly an eigenvalue of \(A\)?</p>`,
    hints: [TeX`Then \(\lambda-\sigma=0\) for that eigenvalue.`],
    answer: TeX`\(A-\sigma I\) is singular, so the system cannot be solved in exact arithmetic. In floating point a nearly exact shift is fine: the huge solution points along the eigenvector.`,
    build(C) {
      shiftPlot([2, 7], 7, TeX`\(\sigma=7\) sits on an eigenvalue`);
      cards(C, ["A − σI is singular", "The method finds the other eigenvalue", "The rate becomes 1"]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 1 ? ["done", "Right! But in floating point, a nearly singular shift actually works very well."] : ["wrong", "Look at the eigenvalue λ − σ of A − σI."];
    } },

  { nav: "Rayleigh iteration", title: "How fast is Rayleigh quotient iteration?",
    instr: TeX`<p>Updating \(\sigma\) with the Rayleigh quotient each step gave errors \(2.0\times10^{-1},\ 9.0\times10^{-3},\ 5.4\times10^{-7},\ 8.9\times10^{-16}\). What kind of convergence is this?</p>`,
    hints: ["Compare the exponents: −1, −2 (roughly), −6, −15."],
    answer: "Cubic: the number of correct digits roughly triples (2 → 6 → 15).",
    build(C) {
      P.setView(0, 5, -17, 1, { xlabel: "k", xticks: [1, 2, 3, 4], yticks: [-15, -10, -5, 0] });
      [-0.7, -2.05, -6.27, -15.05].forEach((e, i) => P.pt(i + 1, e, { color: "gold", r: 6 }));
      setPlotTitle(TeX`\(\log_{10}\) of the errors`); P.draw();
      cards(C, ["linear", "quadratic", "cubic"]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 3 ? ["done", "Right! But each step needs a new factorisation."] : ["wrong", "Look at how the number of correct digits grows: 2, 6, 15."];
    } },

  { nav: "The algorithm", title: "Put the shifted method in order",
    instr: `<p>Put the steps in the right order using the menus.</p>`,
    hints: ["Choose the shift before factorising."],
    answer: "1. Choose σ and factorise A − σI = LU  2. Solve L z = v, then U y = z  3. α = largest entry of y; λ = σ + 1/α  4. v = y/α, and stop if λ has settled",
    build(C) {
      const steps = ["Choose σ and factorise A − σI = LU", "Solve L z = v, then U y = z", "α = largest entry of y; λ = σ + 1/α", "v = y/α, and stop if λ has settled"];
      const order = [2, 0, 3, 1];
      const grid = el("div", { className: "order" }); C.append(grid);
      const sels = [0, 1, 2, 3].map(k => {
        const s = el("select", { id: `dd${k + 1}` });
        s.append(el("option", { value: "" }, "— choose —"), ...order.map(i => { const o = el("option", { value: i }); o.textContent = steps[i]; return o; }));
        grid.append(el("label", { htmlFor: `dd${k + 1}`, className: "steplabel" }, `Step ${k + 1}`), s); return s;
      });
      shiftPlot(EV, 3.3, TeX`\(\sigma=3.3\) finds the middle eigenvalue`);
      return () => {
        const v = sels.map(s => s.value);
        if (v.includes("")) return ["wrong", "Choose an option for every step."];
        if (new Set(v).size < 4) return ["wrong", "Each option should be used exactly once."];
        const bad = v.findIndex((x, k) => +x !== k);
        return bad >= 0 ? ["wrong", `Step ${bad + 1} is not in the right place yet.`] : ["done", "Perfect order!"];
      };
    } },
];

startPractice({
  store: "nm-lec23-shifted-v1", lecture: "Lecture 23", tasks: TASKS,
  finalPlot() { shiftPlot(EV, 3.3, TeX`\(\sigma\) finds the nearest eigenvalue`); },
});
