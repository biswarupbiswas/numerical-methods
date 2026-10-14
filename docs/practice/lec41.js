/* Lecture 41 — Stability of Numerical Methods for ODEs: practice tasks. */
"use strict";

/* Complex numbers as [re, im]. */
const cadd = (a, b) => [a[0] + b[0], a[1] + b[1]];
const cmul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cscale = (a, s) => [a[0] * s, a[1] * s];
const cabs = a => Math.hypot(a[0], a[1]);
const cinv = a => { const d = a[0] * a[0] + a[1] * a[1]; return [a[0] / d, -a[1] / d]; };
const cpow = (a, n) => { let r = [1, 0]; for (let k = 0; k < n; k++) r = cmul(r, a); return r; };

/** Growth factors G(z) of the four methods. */
const GE = z => cadd([1, 0], z);
const GR2 = z => cadd(GE(z), cscale(cmul(z, z), 0.5));
const GR4 = z => { const z2 = cmul(z, z), z3 = cmul(z2, z), z4 = cmul(z3, z); return cadd(cadd(GR2(z), cscale(z3, 1 / 6)), cscale(z4, 1 / 24)); };
const GBE = z => cinv([1 - z[0], -z[1]]);
const PURPLE = "#a66ee8";

/** Shade the stability region {|G(z)| ≤ 1} as a raster of small cells, with its boundary cells drawn darker. */
function region(G, view, color, n = 110) {
  const [x0, x1, y0, y1] = view, dx = (x1 - x0) / n, dy = (y1 - y0) / n;
  const inside = (i, j) => cabs(G([x0 + (i + 0.5) * dx, y0 + (j + 0.5) * dy])) <= 1;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    if (!inside(i, j)) continue;
    const edge = !inside(i - 1, j) || !inside(i + 1, j) || !inside(i, j - 1) || !inside(i, j + 1);
    P.band(x0 + i * dx, x0 + (i + 1) * dx + 1e-9, y0 + j * dy, y0 + (j + 1) * dy + 1e-9, { color, alpha: edge ? 0.95 : 0.22 });
  }
}
/** The complex z-plane with Re/Im axes. */
function zView(view, title) {
  const [x0, x1, y0, y1] = view;
  P.setView(x0, x1, y0, y1, { xticks: [-3, -2, -1, 0, 1, 2].filter(v => v >= x0 && v <= x1), yticks: [-3, -2, -1, 0, 1, 2, 3].filter(v => v >= y0 && v <= y1), xlabel: "\\mathrm{Re}\\,z" });
  P.seg(0, y0, 0, y1, { color: "muted", width: 1.5 });
  if (title) setPlotTitle(title);
}
/** Real sequence y_n = g^n, n = 0..N, as connected points. */
function seqPlot(g, N, title, color = "gold", yr = [-3, 3]) {
  P.setView(-0.3, N + 0.3, yr[0], yr[1], { xticks: [0, 2, 4, 6, 8, 10].filter(v => v <= N), xlabel: "n" });
  let prev = null;
  for (let n = 0; n <= N; n++) {
    const y = g ** n;
    if (prev !== null && Math.abs(prev) <= yr[1] * 3) P.seg(n - 1, prev, n, y, { color, width: 2.5 });
    if (y >= yr[0] && y <= yr[1]) P.pt(n, y, { color, r: 5 });
    prev = y;
  }
  setPlotTitle(title); P.draw();
}

const TASKS = [
  { nav: "Growth factor", title: "One Euler step on y′ = λy",
    instr: TeX`<p>Euler's method on \(y'=\lambda y\) gives \(y_{n+1}=G\,y_n\) with \(G=1+h\lambda\). For \(\lambda=-8\) and \(h=0.2\), what is \(G\)?</p>`,
    hints: [TeX`\(h\lambda=0.2\cdot(-8)=-1.6\).`],
    answer: TeX`\(G=1-1.6=-0.6\). Since \(|G|=0.6<1\) the values decay, flipping sign at every step: \(1,\,-0.6,\,0.36,\,-0.216,\dots\)`,
    build(C) {
      seqPlot(-0.6, 10, TeX`\(y_n=G^n\) for Euler with \(h\lambda=-1.6\)`, "gold", [-1.1, 1.1]);
      const inp = field(C, "G =", "ans1");
      return () => near(parseNum(inp.value), -0.6, 1e-6) ? ["done", "Correct! G = −0.6: an oscillating decay."] : ["wrong", "Not quite. Compute 1 + hλ with hλ = −1.6."];
    } },

  { nav: "Real λ", title: "Drag h into and out of the disk",
    instr: TeX`<p>For \(y'=-20y\), Euler's \(z=h\lambda=-20h\) moves left along the real axis as \(h\) grows. Drag \(h\) and watch the point and \(|G|=|1+z|\). What is the largest \(h\) for which Euler is stable?</p>`,
    hints: [TeX`The disk \(|1+z|\le1\) reaches \(z=-2\) on the real axis.`],
    answer: TeX`\(h=0.1\): there \(z=-2\) and \(G=-1\), so the values just flip between \(1\) and \(-1\). Any larger \(h\) makes them grow: \(h\le2/|\lambda|\).`,
    build(C) {
      const V = [-3.2, 1, -1.6, 1.6];
      const draw = h => {
        zView(V); region(GE, V, "neg", 100);
        const z = -20 * h, g = 1 + z;
        P.pt(z, 0, { color: Math.abs(g) <= 1 + 1e-9 ? "pos" : "neg", r: 8 });
        setPlotTitle(TeX`Euler disk; \(h=${h.toFixed(3)}\), \(z=${z.toFixed(2)}\), \(|G|=${Math.abs(g).toFixed(2)}\)`); P.draw();
      };
      slider(C, "h", "s1", 0, 0.14, 0.005, 0.03, v => draw(v));
      const inp = field(C, "largest h =", "ans1");
      return () => near(parseNum(inp.value), 0.1, 1e-6) ? ["done", "Correct! h ≤ 2/|λ| = 0.1."] : ["wrong", "Not quite. Find the h where z = −20h reaches the left end of the disk, z = −2."];
    } },

  { nav: "Complex λ", title: "A ray through the disk",
    instr: TeX`<p>Now \(\lambda=-4+4i\). As \(h\) grows, \(z=h\lambda\) walks along a ray. Use \(|1+z|^2=(1-4h)^2+16h^2\) to find the largest \(h\) for which Euler is stable.</p>`,
    hints: [TeX`\((1-4h)^2+16h^2=1-8h+32h^2\le1\iff 32h^2\le8h\).`],
    answer: TeX`\(h\le\tfrac14\). At \(h=0.25\), \(z=-1+i\), exactly on the circle \(|1+z|=1\).`,
    build(C) {
      const V = [-3.2, 1, -1.6, 2.2];
      const draw = h => {
        zView(V); region(GE, V, "neg", 100);
        P.seg(0, 0, -4 * 0.6, 4 * 0.6, { color: "muted", width: 2, dash: true });
        const z = [-4 * h, 4 * h], g = cabs(GE(z));
        P.pt(z[0], z[1], { color: g <= 1 + 1e-9 ? "pos" : "neg", r: 8 });
        setPlotTitle(TeX`\(h=${h.toFixed(3)}\): \(z=${z[0].toFixed(2)}+${z[1].toFixed(2)}i\), \(|G|=${g.toFixed(3)}\)`); P.draw();
      };
      slider(C, "h", "s1", 0, 0.5, 0.01, 0.1, v => draw(v));
      const inp = field(C, "largest h =", "ans1");
      return () => near(parseNum(inp.value), 0.25, 1e-6) ? ["done", "Correct! h = 1/4, where z = −1 + i lies on the circle."] : ["wrong", "Not quite. Solve 32h² ≤ 8h for h > 0."];
    } },

  { nav: "RK4 or Euler", title: "A step for RK4 only",
    instr: TeX`<p>For \(y'=-50y\), Euler needs \(h\le2/50=0.04\) and RK4 needs \(h\le2.785/50\approx0.0557\). Which step is stable for RK4 but not for Euler?</p>`,
    hints: [TeX`It has to lie strictly between \(0.04\) and \(0.0557\).`],
    answer: TeX`\(h=0.05\): \(z=-2.5\) lies outside the Euler disk (\(|G|=1.5\)) but inside the RK4 interval \([-2.785,0]\).`,
    build(C) {
      const V = [-3.2, 1, -3.2, 3.2];
      zView(V); region(GR4, V, PURPLE, 110); region(GE, V, "neg", 110);
      [0.03, 0.05, 0.06, 0.1].forEach(h => P.pt(-50 * h, 0, { color: "gold", r: 5 }));
      setPlotTitle(TeX`RK4 region (purple) and Euler disk (red); gold points: \(z=-50h\) for the four options`); P.draw();
      cards(C, ["h = 0.03", "h = 0.05", "h = 0.06", "h = 0.1"]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 2 ? ["done", "Right! z = −2.5 is inside RK4's interval but outside the Euler disk."] : ["wrong", "Not quite. Compute z = −50h for each option and compare with −2 and −2.785."];
    } },

  { nav: "Who survives?", title: "y′ = −20y with h = 0.12",
    instr: TeX`<p>With \(h=0.12\), \(z=-2.4\). The growth factors are \(G_{\text{Euler}}=-1.4\), \(G_{\text{RK2}}=1.48\), \(G_{\text{RK4}}=0.558\) and \(G_{\text{BE}}=\tfrac{1}{3.4}=0.294\). Which methods produce decaying values?</p>`,
    hints: ["A method decays when |G| < 1."],
    answer: TeX`RK4 and backward Euler. Euler and RK2 grow, because \(-2.4\) lies outside their real interval \([-2,0]\).`,
    build(C) {
      const V = [-3.2, 1, -3.2, 3.2];
      zView(V); region(GR4, V, PURPLE, 110); region(GR2, V, "gold", 110); region(GE, V, "neg", 110);
      P.pt(-2.4, 0, { color: "ink", r: 8 });
      setPlotTitle(TeX`\(z=-2.4\) (black) against the Euler, RK2 and RK4 regions`); P.draw();
      cards(C, ["Only backward Euler", "RK4 and backward Euler", "RK2, RK4 and backward Euler", "All four"]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 2 ? ["done", "Right! |G| < 1 only for RK4 (0.558) and backward Euler (0.294)."] : ["wrong", "Not quite. Check which of the four |G| values are below 1."];
    } },

  { nav: "Oscillation", title: "Which method damps the oscillation?",
    instr: TeX`<p>For \(\lambda=3i\) the exact solution \(e^{3it}\) keeps modulus \(1\). With \(h=0.1\) the moduli after ten steps are: Euler \(1.54\), RK2 \(1.01\), RK4 \(0.99995\), backward Euler \(0.65\). Drag the method and look at the points \(y_n=G^n\). Which method damps the oscillation?</p>`,
    hints: ["Damping means the points spiral inwards, so |G| < 1."],
    answer: TeX`Backward Euler: \(|G|=1/\sqrt{1+0.09}\approx0.958\) per step. Euler spirals outwards, RK2 very slightly outwards, RK4 almost exactly on the circle.`,
    build(C) {
      const Gs = [GE, GR2, GR4, GBE], names = ["Euler", "RK2", "RK4", "backward Euler"], cols = ["neg", "gold", PURPLE, "pos"];
      const draw = k => {
        P.setView(-1.8, 1.8, -1.6, 1.6, { xticks: [-1, 0, 1], yticks: [-1, 0, 1] });
        P.fn(x => Math.sqrt(Math.max(1 - x * x, 0)), { color: "curve", width: 2, domain: [-1, 1] });
        P.fn(x => -Math.sqrt(Math.max(1 - x * x, 0)), { color: "curve", width: 2, domain: [-1, 1] });
        const g = Gs[k]([0, 0.3]);
        let w = [1, 0];
        for (let n = 0; n < 40; n++) { const nw = cmul(w, g); P.seg(w[0], w[1], nw[0], nw[1], { color: cols[k], width: 2 }); P.pt(w[0], w[1], { color: cols[k], r: 3.5 }); w = nw; }
        setPlotTitle(TeX`${names[k]}: \(|G|=${cabs(g).toFixed(4)}\), 40 steps (blue: the unit circle)`); P.draw();
      };
      slider(C, "\\text{method}", "s1", 0, 3, 1, 0, v => draw(v));
      cards(C, ["Euler", "RK2", "RK4", "Backward Euler"]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 4 ? ["done", "Right! Backward Euler spirals inwards: |G| ≈ 0.958 per step."] : ["wrong", "Not quite. Look for the method whose modulus after ten steps is below 1."];
    } },

  { nav: "Implicit step", title: "One backward Euler step",
    instr: TeX`<p>Backward Euler on \(y'=t-y\), \(y(0)=1\), \(h=0.1\): \(y_1=y_0+h\,(t_1-y_1)\). Solve for \(y_1\). (5 decimals)</p>`,
    hints: [TeX`Collect the \(y_1\) terms: \((1+h)\,y_1=y_0+h\,t_1\).`],
    answer: TeX`\(y_1=\frac{1+0.01}{1.1}=0.91818\). The exact value is \(y(0.1)=0.1-1+2e^{-0.1}\approx0.90967\); forward Euler gives \(0.9\).`,
    build(C) {
      const ex = t => t - 1 + 2 * Math.exp(-t);
      P.setView(-0.005, 0.12, 0.88, 1.01, { xticks: [0, 0.05, 0.1], yticks: [0.9, 0.95, 1] });
      P.fn(ex, { color: "curve", width: 3, domain: [0, 0.12] });
      P.seg(0, 1, 0.1, 0.9, { color: "neg", width: 2, dash: true }); P.pt(0.1, 0.9, { color: "neg", r: 6 });
      P.pt(0, 1, { color: "ink", r: 5 });
      setPlotTitle(TeX`\(y=t-1+2e^{-t}\) and forward Euler (red); where does backward Euler land?`); P.draw();
      const inp = field(C, "y₁ =", "ans1");
      return () => near(parseNum(inp.value), 0.91818, 1e-5) ? ["done", "Correct! 0.91818: above the curve, while forward Euler (0.9) lies below."] : ["wrong", "Not quite. (1 + 0.1) y₁ = 1 + 0.1 · 0.1."];
    } },

  { nav: "Match the region", title: "Whose region is this?",
    instr: TeX`<p>The shaded set is the region of absolute stability of one of the methods of this lecture. Which growth factor does it belong to?</p>`,
    hints: ["It is unbounded, and only a disk around +1 is missing."],
    answer: TeX`\(G(z)=\frac{1}{1-z}\), backward Euler: \(|G|\le1\iff|1-z|\ge1\), everything outside the disk of radius 1 around \(+1\).`,
    build(C) {
      const V = [-3.2, 2.8, -2.6, 2.6];
      zView(V, TeX`A region of absolute stability (shaded)`); region(GBE, V, "pos", 110); P.draw();
      cards(C, [TeX`\(G=1+z\)`, TeX`\(G=1+z+\tfrac{z^2}{2}\)`, TeX`\(G=1+z+\tfrac{z^2}{2}+\tfrac{z^3}{6}+\tfrac{z^4}{24}\)`, TeX`\(G=\frac{1}{1-z}\)`]);
      return () => !S.choice ? ["wrong", "Choose one of the options."] : S.choice === 4 ? ["done", "Right! Backward Euler: stable everywhere except the disk |1 − z| < 1."] : ["wrong", "Not quite. A polynomial G gives a bounded region; this one is unbounded."];
    } },

  { nav: "Choosing h", title: "Choosing a stable step",
    instr: `<p>Put the steps for choosing a step size for an explicit method in the right order using the menus.</p>`,
    hints: ["You need λ before you can place hλ in the region."],
    answer: "1. Find λ: f_y along the solution, or the eigenvalues of the Jacobian  2. Find the largest h with |G(hλ)| ≤ 1  3. Find the step that the accuracy needs  4. Take the smaller of the two steps and run the method",
    build(C) {
      const steps = ["Find λ: f_y along the solution, or the eigenvalues of the Jacobian", "Find the largest h with |G(hλ)| ≤ 1", "Find the step that the accuracy needs", "Take the smaller of the two steps and run the method"];
      const order = [3, 1, 0, 2];
      const grid = el("div", { className: "order" }); C.append(grid);
      const sels = [0, 1, 2, 3].map(k => {
        const s = el("select", { id: `dd${k + 1}` });
        s.append(el("option", { value: "" }, "— choose —"), ...order.map(i => { const o = el("option", { value: i }); o.textContent = steps[i]; return o; }));
        grid.append(el("label", { htmlFor: `dd${k + 1}`, className: "steplabel" }, `Step ${k + 1}`), s); return s;
      });
      const V = [-3.2, 1, -3.2, 3.2];
      zView(V, TeX`The explicit regions: Euler (red), RK2 (gold), RK4 (purple)`);
      region(GR4, V, PURPLE, 110); region(GR2, V, "gold", 110); region(GE, V, "neg", 110); P.draw();
      return () => {
        const v = sels.map(s => s.value);
        if (v.includes("")) return ["wrong", "Choose an option for every step."];
        if (new Set(v).size < 4) return ["wrong", "Each option should be used exactly once."];
        const bad = v.findIndex((x, k) => +x !== k);
        return bad >= 0 ? ["wrong", `Step ${bad + 1} is not in the right place yet.`] : ["done", "Perfect order! Stability and accuracy both limit h; the smaller step wins."];
      };
    } },
];

startPractice({
  store: "nm-lec41-stability-v1", lecture: "Lecture 41", tasks: TASKS,
  finalPlot() {
    const V = [-3.2, 2.8, -3.2, 3.2];
    zView(V, TeX`Stability regions: Euler (red), RK2 (gold), RK4 (purple); backward Euler: outside the disk around \(+1\)`);
    region(GR4, V, PURPLE, 110); region(GR2, V, "gold", 110); region(GE, V, "neg", 110); P.draw();
  },
});
