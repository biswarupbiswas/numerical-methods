/* Lecture 29 — The Runge Phenomenon: practice tasks. */
"use strict";

const runge = x => 1 / (1 + 25 * x * x);
const eqNodes = n => Array.from({ length: n + 1 }, (_, i) => -1 + 2 * i / n);
const chNodes = n => Array.from({ length: n + 1 }, (_, i) => Math.cos((2 * i + 1) * Math.PI / (2 * n + 2)));

/** The interpolant of g at the nodes, in barycentric form. */
function interp(nodes, g = runge) {
  const ys = nodes.map(g);
  const w = nodes.map((xj, j) => 1 / nodes.reduce((p, xk, k) => (k === j ? p : p * (xj - xk)), 1));
  return x => {
    let num = 0, den = 0;
    for (let j = 0; j < nodes.length; j++) {
      const d = x - nodes[j];
      if (Math.abs(d) < 1e-14) return ys[j];
      num += w[j] / d * ys[j]; den += w[j] / d;
    }
    return num / den;
  };
}
const wpoly = nodes => x => nodes.reduce((p, xi) => p * (x - xi), 1);
const GRID = Array.from({ length: 4001 }, (_, i) => -1 + i / 2000);
const maxErr = nodes => { const p = interp(nodes); return Math.max(...GRID.map(x => Math.abs(p(x) - runge(x)))); };
const maxW = nodes => { const w = wpoly(nodes); return Math.max(...GRID.map(x => Math.abs(w(x)))); };

/** Runge's function with the interpolant at the given nodes. */
function rungePlot(nodes, color, title) {
  P.setView(-1.05, 1.05, -0.6, 2.2, { xticks: [-1, -0.5, 0, 0.5, 1], yticks: [0, 1, 2] });
  P.fn(runge, { color: "curve", width: 3 });
  if (nodes) {
    P.fn(interp(nodes), { color, width: 2.5 });
    nodes.forEach(x => P.pt(x, runge(x), { color: "gold", r: 5 }));
  }
  setPlotTitle(title); P.draw();
}

const TASKS = [
  { nav: "Add nodes", title: "When does it break?",
    instr: TeX`<p>Drag \(n\) to interpolate \(f(x)=\frac{1}{1+25x^2}\) at \(n+1\) equally spaced nodes. Find the smallest even \(n\) for which the maximum error on \([-1,1]\) is larger than \(1\).</p>`,
    hints: ["Watch the swings near x = ±1 and the error in the plot title.", "It happens before n = 10."],
    answer: TeX`\(n=8\): the maximum error is \(1.05\) (it was \(0.62\) at \(n=6\)).`,
    build(C) {
      const draw = n => rungePlot(eqNodes(n), "neg", TeX`\(n=${n}\): \(\max|f-p_n|=${maxErr(eqNodes(n)).toFixed(3)}\)`);
      slider(C, "n", "s1", 2, 16, 2, 4, v => draw(v));
      const inp = field(C, TeX`\(n=\)`, "ans1");
      return () => near(parseNum(inp.value), 8, 1e-9) ? ["done", "Correct! From here on the error roughly doubles every two degrees."] : ["wrong", "Not quite. Drag n and read the maximum error in the title."];
    } },

  { nav: "Where is the error?", title: "Where does p₁₀ go wrong?",
    instr: TeX`<p>The plot shows the error \(f(x)-p_{10}(x)\) for \(11\) equally spaced nodes. Where is the error largest?</p>`,
    hints: ["Compare the size of the swings in the middle and at the sides."],
    answer: TeX`Near the ends \(x=\pm1\), between the last nodes (about \(1.92\) at \(x\approx\pm0.94\)); in the middle it stays below \(0.12\).`,
    build(C) {
      const p = interp(eqNodes(10));
      P.setView(-1.05, 1.05, -2.1, 0.5, { xticks: [-1, -0.5, 0, 0.5, 1], yticks: [-2, -1, 0] });
      P.fn(x => runge(x) - p(x), { color: "neg", width: 3 });
      eqNodes(10).forEach(x => P.pt(x, 0, { color: "gold", r: 5 }));
      setPlotTitle(TeX`\(f(x)-p_{10}(x)\), equally spaced nodes`); P.draw();
      cards(C, ["In the middle, near x = 0", "Near the ends, x = ±1", "Exactly at the nodes"]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 2 ? ["done", "Right! The trouble lives at the edges, where w(x) is large."] : ["wrong", "Look again: at the nodes the error is zero, and the middle is calm."];
    } },

  { nav: "Compute w(x)", title: "Evaluate the node polynomial",
    instr: TeX`<p>For the nodes \(-1,0,1\), the node polynomial is \(w(x)=(x+1)(x-0)(x-1)\). Compute \(w(0.5)\).</p>`,
    hints: [TeX`\(w(0.5)=(1.5)(0.5)(-0.5)\).`],
    answer: TeX`\(w(0.5)=1.5\cdot0.5\cdot(-0.5)=-0.375\).`,
    build(C) {
      const w = wpoly([-1, 0, 1]);
      P.setView(-1.1, 1.1, -0.5, 0.5, { xticks: [-1, -0.5, 0, 0.5, 1], yticks: [-0.4, -0.2, 0, 0.2, 0.4] });
      P.fn(w, { color: "gold", width: 3 });
      [-1, 0, 1].forEach(x => P.pt(x, 0, { color: "gold", r: 5 }));
      P.seg(0.5, 0, 0.5, w(0.5), { color: "muted", width: 1.5, dash: true });
      setPlotTitle(TeX`\(w(x)=(x+1)\,x\,(x-1)\)`); P.draw();
      const inp = field(C, TeX`\(w(0.5)=\)`, "ans1");
      return () => near(parseNum(inp.value), -0.375, 1e-6) ? ["done", "Correct! w is a product of the distances to the nodes (with signs)."] : ["wrong", "Not quite. Multiply the three factors; watch the sign of (0.5 − 1)."];
    } },

  { nav: "Why the ends?", title: "Why is w large near the ends?",
    instr: TeX`<p>With \(11\) equally spaced nodes, \(|w(0.9)|\approx6.5\times10^{-3}\) but \(|w(0.1)|\approx9.8\times10^{-5}\). Why is \(w\) so much larger near the end?</p>`,
    hints: [TeX`\(|w(x)|\) is the product of the distances \(|x-x_i|\).`],
    answer: "From x = 0.9 the nodes on the far side are almost 2 units away, while from x = 0.1 every node is at most 1.1 away; the product of eleven distances is therefore much larger near the end.",
    build(C) {
      P.setView(-1.1, 1.1, -0.3, 1.2, { xticks: [-1, -0.5, 0, 0.5, 1], noY: true, yticks: [] });
      eqNodes(10).forEach(x => { P.seg(0.9, 0.8, x, 0, { color: "neg", width: 1.5, alpha: 0.7 }); P.seg(0.1, 0.4, x, 0, { color: "pos", width: 1.5, alpha: 0.7 }); });
      eqNodes(10).forEach(x => P.pt(x, 0, { color: "gold", r: 5 }));
      P.pt(0.9, 0.8, { color: "neg", r: 6 }); P.pt(0.1, 0.4, { color: "pos", r: 6 });
      setPlotTitle(TeX`Distances from \(x=0.1\) (green) and \(x=0.9\) (red) to the nodes`); P.draw();
      cards(C, ["Runge's function is large near the ends", "Near the end, many nodes are far away, so the product of distances is large", "There are more nodes near the ends"]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 2 ? ["done", "Right! w depends only on the nodes; f does not enter it at all."] : ["wrong", "w(x) does not involve f, and equally spaced nodes are spread evenly."];
    } },

  { nav: "Chebyshev nodes", title: "Compute a Chebyshev node",
    instr: TeX`<p>The Chebyshev nodes are \(x_i=\cos\frac{(2i+1)\pi}{2n+2}\). For \(n=2\) (three nodes), compute the largest node \(x_0\). (3 decimals)</p>`,
    hints: [TeX`\(x_0=\cos\frac{\pi}{6}\).`],
    answer: TeX`\(x_0=\cos\frac{\pi}{6}=\frac{\sqrt3}{2}\approx0.866\); the three nodes are \(0.866,\ 0,\ -0.866\).`,
    build(C) {
      P.setView(-1.2, 1.2, -0.15, 1.15, { xticks: [-1, -0.5, 0, 0.5, 1], noY: true, yticks: [] });
      P.fn(x => Math.sqrt(Math.max(0, 1 - x * x)), { color: "muted", width: 2, domain: [-1, 1] });
      [Math.PI / 6, Math.PI / 2, 5 * Math.PI / 6].forEach(t => {
        P.seg(0, 0, Math.cos(t), Math.sin(t), { color: "line", width: 1.5 });
        P.seg(Math.cos(t), Math.sin(t), Math.cos(t), 0, { color: "curve", width: 1.5, dash: true });
        P.pt(Math.cos(t), Math.sin(t), { color: "curve", r: 6 }); P.pt(Math.cos(t), 0, { color: "pos", r: 6 });
      });
      setPlotTitle(TeX`Three equally spaced angles on a semicircle, and their shadows`); P.draw();
      const inp = field(C, TeX`\(x_0=\)`, "ans1");
      return () => near(parseNum(inp.value), 0.866, 0.001) ? ["done", "Correct! The shadows of equally spaced angles crowd towards the ends."] : ["wrong", "Not quite. Use radians: (2·0 + 1)π / (2·2 + 2) = π/6."];
    } },

  { nav: "Other interval", title: "Chebyshev nodes on [0, 4]",
    instr: TeX`<p>To use Chebyshev nodes on \([a,b]\), map them by \(\frac{a+b}{2}+\frac{b-a}{2}x_i\). For three nodes on \([0,4]\), what is the smallest node? (3 decimals)</p>`,
    hints: [TeX`On \([-1,1]\) the smallest node is \(-0.866\). Here \(\frac{a+b}{2}=2\) and \(\frac{b-a}{2}=2\).`],
    answer: TeX`\(2+2\cdot(-0.866)=0.268\); the nodes are \(0.268,\ 2,\ 3.732\).`,
    build(C) {
      P.setView(-0.3, 4.3, -0.5, 0.5, { xticks: [0, 1, 2, 3, 4], noY: true, yticks: [] });
      P.seg(0, 0, 4, 0, { color: "muted", width: 2 });
      [0, 4].forEach(x => P.pt(x, 0, { color: "muted", r: 4 }));
      P.pt(2, 0, { color: "pos", r: 6 });
      setPlotTitle(TeX`The interval \([0,4]\) and its middle node`); P.draw();
      const inp = field(C, "smallest node =", "ans1");
      return () => near(parseNum(inp.value), 2 - Math.sqrt(3), 0.001) ? ["done", "Correct! The mapped nodes still cluster near the ends."] : ["wrong", "Not quite. Scale −0.866 by 2 and shift by 2."];
    } },

  { nav: "Smallest max|w|", title: "The Chebyshev value of max |w|",
    instr: TeX`<p>With \(n+1\) Chebyshev nodes, \(w(x)=2^{-n}T_{n+1}(x)\) and \(|T_{n+1}|\le1\) on \([-1,1]\). What is \(\max|w(x)|\) for \(n=5\) (six nodes)?</p>`,
    hints: [TeX`\(\max|w|=2^{-n}\).`],
    answer: TeX`\(2^{-5}=\frac{1}{32}=0.03125\), the smallest possible for six nodes in \([-1,1]\).`,
    build(C) {
      const w = wpoly(chNodes(5));
      P.setView(-1.05, 1.05, -0.05, 0.05, { xticks: [-1, -0.5, 0, 0.5, 1], yticks: [-0.04, -0.02, 0, 0.02, 0.04] });
      P.seg(-1, 1 / 32, 1, 1 / 32, { color: "muted", width: 1, dash: true });
      P.seg(-1, -1 / 32, 1, -1 / 32, { color: "muted", width: 1, dash: true });
      P.fn(w, { color: "pos", width: 3 });
      chNodes(5).forEach(x => P.pt(x, 0, { color: "pos", r: 5 }));
      setPlotTitle(TeX`\(w(x)\) for six Chebyshev nodes: all bumps the same height`); P.draw();
      const inp = field(C, TeX`\(\max|w|=\)`, "ans1");
      return () => near(parseNum(inp.value), 1 / 32, 1e-3) ? ["done", "Correct! Every bump of w has the same height 2⁻ⁿ."] : ["wrong", "Not quite. Compute 2 to the power −5."];
    } },

  { nav: "Compare w", title: "How much smaller?",
    instr: TeX`<p>Drag \(n\). Red is \(w(x)\) for equally spaced nodes, green for Chebyshev nodes. Find the smallest even \(n\) for which the equispaced \(\max|w|\) is more than \(20\) times the Chebyshev one.</p>`,
    hints: ["The ratio is shown in the title. It is about 8.7 at n = 10."],
    answer: TeX`\(n=14\): the ratio is about \(31.6\) (it is \(16.4\) at \(n=12\)).`,
    build(C) {
      const draw = n => {
        const we = wpoly(eqNodes(n)), wc = wpoly(chNodes(n)), m = maxW(eqNodes(n)), r = m / 2 ** -n;
        P.setView(-1.05, 1.05, -1.15 * m, 1.15 * m, { xticks: [-1, -0.5, 0, 0.5, 1], noY: true, yticks: [0] });
        P.fn(we, { color: "neg", width: 2.5 }); P.fn(wc, { color: "pos", width: 3 });
        setPlotTitle(TeX`\(n=${n}\): ratio of the maxima \(=${r.toFixed(1)}\)`); P.draw();
      };
      slider(C, "n", "s1", 2, 20, 2, 6, v => draw(v));
      const inp = field(C, TeX`\(n=\)`, "ans1");
      return () => near(parseNum(inp.value), 14, 1e-9) ? ["done", "Correct! The gap keeps growing: about 245 times at n = 20."] : ["wrong", "Not quite. Drag n and read the ratio in the title."];
    } },

  { nav: "Pick the cure", title: "Measured data at equal steps",
    instr: TeX`<p>Your data come from a sensor read every second, so the nodes are equally spaced and cannot be moved. You need a good interpolant over the whole range of \(41\) readings. What should you do?</p>`,
    hints: ["Moving the nodes is not an option here. What keeps the degree low?"],
    answer: "Use piecewise interpolation with low-degree pieces (for example piecewise linear, or splines). A single degree-40 polynomial on equally spaced nodes would oscillate wildly near the ends.",
    build(C) {
      const xs = eqNodes(10);
      P.setView(-1.05, 1.05, -0.6, 2.2, { xticks: [-1, -0.5, 0, 0.5, 1], yticks: [0, 1, 2] });
      P.fn(runge, { color: "curve", width: 3 });
      P.fn(interp(xs), { color: "neg", width: 2, alpha: 0.5 });
      for (let i = 0; i < xs.length - 1; i++) P.seg(xs[i], runge(xs[i]), xs[i + 1], runge(xs[i + 1]), { color: "pos", width: 3 });
      xs.forEach(x => P.pt(x, runge(x), { color: "gold", r: 5 }));
      setPlotTitle(TeX`Equally spaced data: \(p_{10}\) (red) and piecewise linear (green)`); P.draw();
      cards(C, ["One polynomial of degree 40 through all readings", "Use Chebyshev nodes", "Piecewise interpolation with low-degree pieces"]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 3 ? ["done", "Right! On the 11 nodes shown, piecewise linear has max error 0.067 against 1.92 for p₁₀."] : S.choice === 2 ? ["wrong", "Chebyshev nodes would be ideal, but the readings are fixed at equal steps."] : ["wrong", "That is exactly the Runge situation: the error grows with the degree."];
    } },
];

startPractice({
  store: "nm-lec29-runge-v1", lecture: "Lecture 29", tasks: TASKS,
  finalPlot() { rungePlot(chNodes(16), "pos", TeX`Chebyshev nodes, \(n=16\): \(\max|f-p_n|=0.033\)`); },
});
