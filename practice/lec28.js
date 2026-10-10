/* Lecture 28 — The Interpolation Error: practice tasks. */
"use strict";

const E1 = Math.E - 1, E2 = (Math.E ** 2 - 2 * Math.E + 1) / 2;       // divided differences of e^x at 0, 1, 2
function p2(x) { return 1 + E1 * x + E2 * x * (x - 1); }
function wpoly(nodes) { return x => nodes.reduce((s, a) => s * (x - a), 1); }
function equi(a, b, n) { return Array.from({ length: n + 1 }, (_, k) => a + (b - a) * k / n); }

/** e^x, its quadratic interpolant at 0, 1, 2, and (optionally) the magnified error. */
function expPlot(title, showErr) {
  if (showErr) {
    P.setView(-0.1, 2.1, -0.26, 0.2, { xticks: [0.5, 1, 1.5, 2], yticks: [-0.2, -0.1, 0.1] });
    P.fn(x => Math.exp(x) - p2(x), { color: "neg", width: 3 });
    [0, 1, 2].forEach(x => P.pt(x, 0, { color: "gold", r: 6 }));
  } else {
    P.setView(-0.1, 2.2, 0, 8.5, { xticks: [0.5, 1, 1.5, 2], yticks: [2, 4, 6, 8] });
    P.fn(Math.exp, { color: "curve", width: 3 });
    P.fn(p2, { color: "gold", width: 2 });
    [0, 1, 2].forEach(x => P.pt(x, Math.exp(x), { color: "gold", r: 6 }));
  }
  setPlotTitle(title); P.draw();
}

/** The node polynomial for the given nodes. */
function wPlot(nodes, y, title, extra) {
  const w = wpoly(nodes), a = nodes[0], b = nodes[nodes.length - 1];
  P.setView(a - 0.05 * (b - a), b + 0.05 * (b - a), -y, y, { xticks: nodes.length <= 3 ? nodes : [a, (a + b) / 2, b], yticks: [] });
  P.fn(w, { color: "gold", width: 3 });
  nodes.forEach(x => P.pt(x, 0, { color: "curve", r: 5 }));
  if (extra) extra(w);
  setPlotTitle(title); P.draw();
}

const TASKS = [
  { nav: "Zeros of the error", title: "Where is the error zero?",
    instr: TeX`<p>The plot shows the error \(f(x)-P_2(x)\) for \(f(x)=e^x\) with nodes \(0,1,2\). How many zeros does it have on \([0,2]\)?</p>`,
    hints: [TeX`At every node \(P_2(x_i)=f(x_i)\).`],
    answer: TeX`\(3\): one at each node, where the interpolant matches \(f\). The error changes sign there.`,
    build(C) {
      expPlot(TeX`\(e^x-P_2(x)\)`, true);
      const inp = field(C, "zeros =", "ans1");
      return () => near(parseNum(inp.value), 3, 1e-9) ? ["done", "Correct! The error vanishes at the n + 1 nodes."] : ["wrong", "Not quite. Count the points where the red curve crosses the axis."];
    } },

  { nav: "Divided difference", title: "A divided difference without a table",
    instr: TeX`<p>For \(f(x)=x^3\) and any four distinct nodes, \(f[x_0,x_1,x_2,x_3]=\dfrac{f'''(\xi)}{3!}\). What is its value?</p>`,
    hints: [TeX`\(f'''(x)=6\) for every \(x\), so \(\xi\) does not matter.`],
    answer: TeX`\(f[x_0,x_1,x_2,x_3]=\dfrac{6}{6}=1\), whatever the nodes.`,
    build(C) {
      P.setView(-0.3, 3.3, -2, 30, { xticks: [0, 1, 2, 3], yticks: [10, 20] });
      P.fn(x => x ** 3, { color: "curve", width: 3 });
      [0, 1, 2, 3].forEach(x => P.pt(x, x ** 3, { color: "gold", r: 6 }));
      setPlotTitle(TeX`\(f(x)=x^3\) at four nodes`); P.draw();
      const inp = field(C, TeX`\(f[x_0,x_1,x_2,x_3]=\)`, "ans1");
      return () => near(parseNum(inp.value), 1, 1e-9) ? ["done", "Correct! Check with the nodes 0, 1, 2, 3: the table gives 1 too."] : ["wrong", "Not quite. Differentiate x³ three times and divide by 3!."];
    } },

  { nav: "Node polynomial", title: "Evaluate the node polynomial",
    instr: TeX`<p>For the nodes \(0,1,2\), compute \(w(0.5)=(0.5-0)(0.5-1)(0.5-2)\).</p>`,
    hints: [TeX`\(0.5\cdot(-0.5)\cdot(-1.5)\): two negative factors.`],
    answer: TeX`\(w(0.5)=0.375\).`,
    build(C) {
      wPlot([0, 1, 2], 0.5, TeX`\(w(x)=x(x-1)(x-2)\)`, w => P.pt(0.5, w(0.5), { color: "neg", r: 6 }));
      const inp = field(C, TeX`\(w(0.5)=\)`, "ans1");
      return () => near(parseNum(inp.value), 0.375, 1e-6) ? ["done", "Correct! With e^x, the error at 0.5 is 0.1586 = e^ξ/6 · 0.375, so ξ = 0.931."] : ["wrong", "Not quite. Multiply the three factors, watching the signs."];
    } },

  { nav: "Where is w big?", title: "Find where |w| is large",
    instr: TeX`<p>Seven equally spaced nodes on \([-1,1]\). Drag \(x\) to a point where \(|w(x)|>0.03\).</p>`,
    hints: ["Compare the humps in the middle with those at the ends.", TeX`The end humps reach about \(0.044\); the middle ones only \(0.0057\).`],
    answer: TeX`Any \(x\) in the first or last gap near its hump, e.g. \(x\approx\pm0.89\), where \(|w|\approx0.044\).`,
    build(C) {
      const nodes = equi(-1, 1, 6), w = wpoly(nodes);
      let x = 0.15;
      const draw = () => wPlot(nodes, 0.05, TeX`\(|w(${x.toFixed(2)})|=${Math.abs(w(x)).toFixed(4)}\)`, () => {
        P.seg(x, 0, x, w(x), { color: "neg", width: 3 }); P.pt(x, w(x), { color: "neg", r: 6 });
      });
      draw();
      slider(C, "x", "s1", -1, 1, 0.01, x, v => { x = v; draw(); });
      return () => Math.abs(w(x)) > 0.03 ? ["done", `Correct! |w| = ${Math.abs(w(x)).toFixed(4)}: almost eight times the middle humps.`] : ["wrong", `|w| = ${Math.abs(w(x)).toFixed(4)}. Try nearer the ends.`];
    } },

  { nav: "Linear bound", title: "Bound a linear interpolation",
    instr: TeX`<p>You interpolate \(\sin x\) linearly between nodes \(0.1\) apart. Use \(|f-P_1|\le\dfrac{h^2}{8}\max|f''|\) with \(\max|f''|\le1\). What is the bound?</p>`,
    hints: [TeX`\(h^2=0.01\).`],
    answer: TeX`\(\dfrac{0.01}{8}\cdot1=0.00125\).`,
    build(C) {
      P.setView(0, 0.35, 0, 0.36, { xticks: [0.1, 0.2, 0.3], yticks: [0.1, 0.2, 0.3] });
      P.fn(Math.sin, { color: "curve", width: 3 });
      [0, 0.1, 0.2, 0.3].forEach((a, k, A) => { if (k < 3) P.seg(a, Math.sin(a), A[k + 1], Math.sin(A[k + 1]), { color: "gold", width: 2 }); P.pt(a, Math.sin(a), { color: "gold", r: 5 }); });
      setPlotTitle(TeX`\(\sin x\) and its linear interpolant, \(h=0.1\)`); P.draw();
      const inp = field(C, "bound =", "ans1");
      return () => near(parseNum(inp.value), 0.00125, 2e-6) ? ["done", "Correct! Halving h would cut it by four, to 0.0003125."] : ["wrong", "Not quite. Compute h²/8 with h = 0.1."];
    } },

  { nav: "New nodes", title: "The notes' function, new nodes",
    instr: TeX`<p>Interpolate \(f(x)=\sqrt{1+x^2}\) linearly on the nodes \(1.0\) and \(1.2\). Here \(f''(x)=(1+x^2)^{-3/2}\) decreases. Bound the error (4 decimals).</p>`,
    hints: [TeX`The largest \(f''\) is at the left node: \(f''(1)=2^{-3/2}\approx0.3536\).`, TeX`\(\dfrac{0.2^2}{8}\cdot0.3536\).`],
    answer: TeX`\(\dfrac{0.04}{8}\cdot0.3536=0.0018\) (more precisely \(0.00177\)).`,
    build(C) {
      const f = x => Math.sqrt(1 + x * x);
      P.setView(0.95, 1.25, 1.38, 1.6, { xticks: [1, 1.1, 1.2], yticks: [1.4, 1.5] });
      P.fn(f, { color: "curve", width: 3 });
      P.seg(1, f(1), 1.2, f(1.2), { color: "gold", width: 2 });
      [1, 1.2].forEach(x => P.pt(x, f(x), { color: "gold", r: 6 }));
      setPlotTitle(TeX`\(\sqrt{1+x^2}\) on \([1,\,1.2]\)`); P.draw();
      const inp = field(C, "bound =", "ans1");
      return () => near(parseNum(inp.value), 0.00177, 6e-5) ? ["done", "Correct! Smaller than the notes' 0.0024, because f'' is smaller here."] : ["wrong", "Not quite. Use f''(1) = 0.3536 and h = 0.2."];
    } },

  { nav: "Table spacing", title: "Choose the table spacing",
    instr: TeX`<p>A table of \(e^x\) on \([0,1]\) will be read by linear interpolation. Find the largest spacing \(h\) with \(\dfrac{h^2}{8}\,e\le10^{-6}\) (3 significant figures).</p>`,
    hints: [TeX`On \([0,1]\), \(\max|f''|=\max e^x=e\).`, TeX`\(h=\sqrt{8\cdot10^{-6}/e}\).`],
    answer: TeX`\(h=\sqrt{8\times10^{-6}/2.71828}\approx0.00172\).`,
    build(C) {
      P.setView(0, 1.05, 0.9, 2.9, { xticks: [0.25, 0.5, 0.75, 1], yticks: [1, 2] });
      P.fn(Math.exp, { color: "curve", width: 3 });
      setPlotTitle(TeX`\(e^x\) on \([0,1]\): \(\max|f''|=e\)`); P.draw();
      const inp = field(C, TeX`\(h=\)`, "ans1");
      return () => near(parseNum(inp.value), 0.0017155, 1.5e-5) ? ["done", "Correct! About 583 intervals on [0, 1]."] : ["wrong", "Not quite. Solve h² ≤ 8·10⁻⁶ / e."];
    } },

  { nav: "Where is it worst?", title: "Where should you trust the interpolant?",
    instr: TeX`<p>You interpolate a smooth function at \(11\) equally spaced nodes on \([-1,1]\). Where is the error typically largest?</p>`,
    hints: [TeX`The error is \(f^{(n+1)}(\xi)/(n+1)!\) times \(w(x)\). Look at \(w\).`],
    answer: TeX`Near the ends: there \(|w|\) is about \(87\) times larger than in the middle.`,
    build(C) {
      wPlot(equi(-1, 1, 10), 0.0095, TeX`\(w(x)\) for 11 equally spaced nodes`);
      cards(C, ["In the middle of the interval", "Near the ends of the interval", "Equally large everywhere"]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 2 ? ["done", "Right! Next lecture shows how bad this can get, and how to place the nodes better."] : ["wrong", "Look at the size of the humps of w."];
    } },

  { nav: "The proof", title: "Put the proof in order",
    instr: `<p>Put the steps of the proof of the error formula in the right order using the menus.</p>`,
    hints: ["First build the auxiliary function, then count its zeros."],
    answer: "1. Fix x and set φ(t) = f(t) − Pₙ(t) − λ w(t) with φ(x) = 0  2. φ has n + 2 zeros: the nodes and x  3. Rolle n + 1 times: φ⁽ⁿ⁺¹⁾(ξ) = 0  4. Pₙ⁽ⁿ⁺¹⁾ = 0 and w⁽ⁿ⁺¹⁾ = (n+1)!, so λ = f⁽ⁿ⁺¹⁾(ξ)/(n+1)!",
    build(C) {
      const steps = ["Fix x and set φ(t) = f(t) − Pₙ(t) − λ w(t) with φ(x) = 0", "φ has n + 2 zeros: the nodes and x",
        "Apply Rolle n + 1 times: φ⁽ⁿ⁺¹⁾(ξ) = 0", "Pₙ⁽ⁿ⁺¹⁾ = 0 and w⁽ⁿ⁺¹⁾ = (n+1)!, so λ = f⁽ⁿ⁺¹⁾(ξ)/(n+1)!"];
      const order = [2, 0, 3, 1];
      const grid = el("div", { className: "order" }); C.append(grid);
      const sels = [0, 1, 2, 3].map(k => {
        const s = el("select", { id: `dd${k + 1}` });
        s.append(el("option", { value: "" }, "— choose —"), ...order.map(i => { const o = el("option", { value: i }); o.textContent = steps[i]; return o; }));
        grid.append(el("label", { htmlFor: `dd${k + 1}`, className: "steplabel" }, `Step ${k + 1}`), s); return s;
      });
      expPlot(TeX`\(e^x-P_2(x)\): zero at the nodes`, true);
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
  store: "nm-lec28-interperror-v1", lecture: "Lecture 28", tasks: TASKS,
  finalPlot() { expPlot(TeX`\(e^x\) and \(P_2(x)\): exact at the nodes, close in between`, false); },
});
