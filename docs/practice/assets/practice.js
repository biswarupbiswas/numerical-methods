/* Shared engine for the practice pages: canvas plotting with KaTeX fonts, task engine, helpers.
   A lecture script defines its tasks and calls startPractice({...}). */
"use strict";
const TeX = String.raw;

/* ---------------- maths typesetting ---------------- */
const MATH_DELIMS = [{ left: "\\[", right: "\\]", display: true }, { left: "\\(", right: "\\)", display: false }];
function typeset(node) {
  if (window.renderMathInElement && node) renderMathInElement(node, { delimiters: MATH_DELIMS, throwOnError: false });
}

/* Minimal TeX-like renderer for canvas labels, using KaTeX's own fonts so plots match the text.
   Supports: letters (italic), digits/operators (upright), _x _{..} ^x ^{..}, \text{..}, a few symbols. */
const SYMBOLS = { "\\varepsilon": "ε", "\\epsilon": "ε", "\\cdot": "·", "\\le": "≤", "\\ge": "≥", "\\approx": "≈",
  "\\to": "→", "\\ldots": "…", "\\infty": "∞", "\\pm": "±", "\\,": " ", "\\;": " ", "\\quad": "  ", "\\ ": " " };
function mathRuns(src, size) {
  const runs = [];
  const push = (text, kind, level) => { if (text) runs.push({ text, kind, level }); };
  const parse = (s, level) => {
    let i = 0;
    const group = () => {
      if (s[i] === "{") { let d = 1, j = i + 1; while (j < s.length && d) { if (s[j] === "{") d++; if (s[j] === "}") d--; j++; }
        const g = s.slice(i + 1, j - 1); i = j; return g; }
      if (s[i] === "\\") { const m = s.slice(i).match(/^\\[a-zA-Z]+|^\\./); i += m[0].length; return m[0]; }
      return s[i++];
    };
    while (i < s.length) {
      const ch = s[i];
      if (ch === "_" || ch === "^") { i++; parse(group(), ch === "_" ? level - 1 : level + 1); continue; }
      if (s.startsWith("\\text{", i)) { i += 5; push(group(), "text", level); continue; }
      if (ch === "\\") { const m = s.slice(i).match(/^\\[a-zA-Z]+|^\\./)[0]; i += m.length;
        const sym = SYMBOLS[m] ?? m.slice(1); push(sym, /^[εα-ω]$/.test(sym) ? "var" : "op", level); continue; }
      if (ch === "{" || ch === "}") { i++; continue; }
      if (/[A-Za-z]/.test(ch)) { push(ch, "var", level); i++; continue; }
      push(ch === "-" ? "−" : ch === "*" ? "∗" : ch, "op", level); i++;
    }
  };
  parse(src, 0);
  return runs.map(r => ({ ...r, size: size * (r.level === 0 ? 1 : 0.72), dy: r.level < 0 ? size * 0.28 : r.level > 0 ? -size * 0.38 : 0 }));
}
function runFont(r, bold) {
  const w = bold ? "bold " : "";
  if (r.kind === "var") return `italic ${w}${r.size}px KaTeX_Math, "Times New Roman", serif`;
  if (r.kind === "text") return `${w}${r.size * 0.92}px "IBM Plex Sans", sans-serif`;
  return `${w}${r.size}px KaTeX_Main, "Times New Roman", serif`;
}
function drawMath(c, src, x, y, size, color, align = "center", base = "middle", bold = false) {
  const runs = mathRuns(src, size);
  let w = 0; for (const r of runs) { c.font = runFont(r, bold); r.w = c.measureText(r.text).width; w += r.w; }
  let px = align === "left" ? x : align === "right" ? x - w : x - w / 2;
  c.fillStyle = color; c.textAlign = "left"; c.textBaseline = base;
  for (const r of runs) { c.font = runFont(r, bold); c.fillText(r.text, px, y + r.dy); px += r.w; }
}

/* ---------------- canvas plot ---------------- */
class Plot {
  constructor(canvas) {
    this.cv = canvas; this.ctx = canvas.getContext("2d"); this.items = []; this.view = [0, 1, 0, 1]; this.opts = {};
    new ResizeObserver(() => this.draw()).observe(canvas);
    matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => this.draw());
    new MutationObserver(() => this.draw()).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    if (document.fonts) Promise.all(["16px KaTeX_Main", "italic 16px KaTeX_Math"].map(f => document.fonts.load(f))).then(() => this.draw());
  }
  setView(x0, x1, y0, y1, opts = {}) { this.view = [x0, x1, y0, y1]; this.opts = opts; this.items = []; }
  add(item) { this.items.push(item); return item; }
  fn(g, o = {}) { return this.add({ t: "fn", g, color: "curve", width: 3, ...o }); }
  seg(x1, y1, x2, y2, o = {}) { return this.add({ t: "seg", x1, y1, x2, y2, color: "ink", width: 2, ...o }); }
  pt(x, y, o = {}) { return this.add({ t: "pt", x, y, color: "ink", r: 6, ...o }); }
  /** A label written in TeX-lite (see mathRuns); wrap words in \text{...}. */
  tex(x, y, s, o = {}) { return this.add({ t: "tex", x, y, s, color: "ink", size: 16, align: "center", base: "middle", dx: 0, dy: 0, ...o }); }
  band(x1, x2, y1, y2, o = {}) { return this.add({ t: "band", x1, x2, y1, y2, color: "gold", alpha: .18, ...o }); }
  col(name) { return getComputedStyle(document.documentElement).getPropertyValue("--" + name).trim() || name; }
  draw() {
    const cv = this.cv, dpr = window.devicePixelRatio || 1, w = cv.clientWidth, hgt = cv.clientHeight;
    if (!w || !hgt) return;
    cv.width = Math.round(w * dpr); cv.height = Math.round(hgt * dpr);
    const c = this.ctx; c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, w, hgt);
    const [x0, x1, y0, y1] = this.view, log = !!this.opts.ylog;
    const pad = { l: log ? 54 : 46, r: 14, t: 12, b: 36 };
    const ty = v => (log ? Math.log10(v) : v);
    const X = x => pad.l + (x - x0) / (x1 - x0) * (w - pad.l - pad.r);
    const Y = y => pad.t + (ty(y1) - ty(y)) / (ty(y1) - ty(y0)) * (hgt - pad.t - pad.b);
    const muted = this.col("muted");
    c.lineWidth = 1; c.strokeStyle = this.col("line");
    for (const v of this.opts.xticks || ticks(x0, x1, 6)) {
      c.beginPath(); c.moveTo(X(v), pad.t); c.lineTo(X(v), hgt - pad.b); c.stroke();
      drawMath(c, fmtTick(v), X(v), hgt - pad.b + 14, 14, muted);
    }
    const yt = log ? range(Math.ceil(Math.log10(y0)), Math.floor(Math.log10(y1))).map(k => 10 ** k) : (this.opts.yticks || ticks(y0, y1, 6));
    for (const v of yt) {
      c.beginPath(); c.moveTo(pad.l, Y(v)); c.lineTo(w - pad.r, Y(v)); c.stroke();
      if (!this.opts.noY) drawMath(c, log ? `10^{${Math.round(Math.log10(v))}}` : fmtTick(v), pad.l - 7, Y(v), 14, muted, "right");
    }
    if (!log && y0 < 0 && y1 > 0) { c.strokeStyle = muted; c.lineWidth = 1.5; c.beginPath(); c.moveTo(pad.l, Y(0)); c.lineTo(w - pad.r, Y(0)); c.stroke(); }
    if (this.opts.xlabel) drawMath(c, this.opts.xlabel, w - pad.r, hgt - 10, 15, muted, "right");
    c.save(); c.beginPath(); c.rect(pad.l, pad.t, w - pad.l - pad.r, hgt - pad.t - pad.b); c.clip();
    for (const it of this.items) {
      const color = this.col(it.color);
      c.globalAlpha = it.alpha ?? 1; c.setLineDash(it.dash ? [6, 5] : []);
      if (it.t === "fn") {
        c.strokeStyle = color; c.lineWidth = it.width; c.beginPath(); let pen = false;
        const [a, b] = it.domain || [x0, x1];
        for (let i = 0; i <= 600; i++) {
          const x = a + (b - a) * i / 600, y = it.g(x);
          if (!isFinite(y) || (log && y <= 0)) { pen = false; continue; }
          const py = Y(y); if (py < -2000 || py > 4000) { pen = false; continue; }
          pen ? c.lineTo(X(x), py) : c.moveTo(X(x), py); pen = true;
        }
        c.stroke();
      } else if (it.t === "seg") {
        c.strokeStyle = color; c.lineWidth = it.width; c.lineCap = it.cap || "round";
        c.beginPath(); c.moveTo(X(it.x1), Y(it.y1)); c.lineTo(X(it.x2), Y(it.y2)); c.stroke();
      } else if (it.t === "pt") {
        c.beginPath(); c.arc(X(it.x), Y(it.y), it.r, 0, 2 * Math.PI);
        if (it.ring) { c.strokeStyle = color; c.lineWidth = 3; c.stroke(); } else { c.fillStyle = color; c.fill(); }
      } else if (it.t === "band") {
        c.fillStyle = color; c.fillRect(X(it.x1), Y(it.y2), X(it.x2) - X(it.x1), Y(it.y1) - Y(it.y2));
      } else if (it.t === "tex") {
        c.setLineDash([]);
        drawMath(c, it.s, X(it.x) + it.dx, Y(it.y) + it.dy, it.size, color, it.align, it.base, it.bold);
      }
    }
    c.restore(); c.globalAlpha = 1; c.setLineDash([]);
  }
}
function ticks(a, b, n) {
  const raw = (b - a) / n, mag = 10 ** Math.floor(Math.log10(raw)), s = [1, 2, 2.5, 5, 10].map(m => m * mag).find(m => m >= raw);
  const out = []; for (let v = Math.ceil(a / s) * s; v <= b + 1e-9; v += s) out.push(+v.toFixed(10)); return out;
}
function range(a, b) { const r = []; for (let k = a; k <= b; k++) r.push(k); return r; }
function fmtTick(v) { return Math.abs(v) < 1e-12 ? "0" : String(+v.toPrecision(6)); }

/* ---------------- helpers ---------------- */
const $ = id => document.getElementById(id);
const el = (tag, attrs = {}, html = "") => { const e = document.createElement(tag); Object.assign(e, attrs); if (html) e.innerHTML = html; return e; };
const near = (v, t, tol = 1e-6) => Number.isFinite(v) && Math.abs(v - t) <= tol * Math.max(1, Math.abs(t));
const signCol = v => (v > 0 ? "pos" : "neg");
/** Number formatted as TeX, e.g. -0.125 -> "-0.125" (KaTeX draws a proper minus). */
const num = (v, d = 3) => (+v.toFixed(d)).toString();
const signed = v => TeX`<span class="${signCol(v)}">\(${v.toFixed(3)}\)</span> (${v > 0 ? "positive" : v < 0 ? "negative" : "zero"})`;
function parseNum(s) {
  s = String(s).trim().replace(/−/g, "-").replace(/,/g, ".");
  if (!s) return NaN;
  const n = Number(s); if (Number.isFinite(n)) return n;
  if (!/^[0-9+\-*/^().eE\s]+$/.test(s)) return NaN;             // arithmetic only, e.g. 1/32 or 2^-5
  try { const v = Function(`"use strict"; return (${s.replace(/\^/g, "**")});`)(); return Number.isFinite(v) ? v : NaN; }
  catch { return NaN; }
}
function field(parent, label, id, placeholder = "type a number") {
  const row = el("div", { className: "field" });
  row.append(el("label", { htmlFor: id }, label), el("input", { type: "text", id, placeholder, inputMode: "decimal", autocomplete: "off" }));
  parent.append(row); typeset(row); return row.querySelector("input");
}
function cards(parent, texts, question) {
  if (question) { const q = el("div", { className: "question" }, question); parent.append(q); typeset(q); }
  const box = el("div", { className: "cards" }); parent.append(box);
  const btns = texts.map((t, i) => {
    const b = el("button", { type: "button", className: "card", id: `opt${i + 1}` }, t);
    b.setAttribute("aria-pressed", "false");
    b.onclick = () => { S.choice = i + 1; btns.forEach(x => x.setAttribute("aria-pressed", String(x === b))); };
    box.append(b); return b;
  });
  typeset(box); return btns;
}
function slider(parent, label, id, min, max, step, value, oninput) {
  const row = el("div", { className: "slider" });
  const out = el("output", { htmlFor: id });
  const inp = el("input", { type: "range", id, min, max, step, value });
  inp.setAttribute("aria-label", label);
  const upd = () => { out.innerHTML = TeX`\(${label} = ${(+inp.value).toFixed(step < 1 ? 2 : 0)}\)`; typeset(out); oninput(+inp.value); };
  inp.oninput = upd; row.append(out, inp); parent.append(row); setTimeout(upd); return inp;
}
function setPlotTitle(html) { const t = $("plotTitle"); t.innerHTML = html; typeset(t); }

/* ---------------- engine ---------------- */
let P, S;
function startPractice(cfg) {
  const { store, lecture, tasks: TASKS, finalPlot } = cfg;
  const note = el("div", { className: "calc-note", role: "note" },
    "<b>Before you start:</b> keep a calculator ready. Some tasks ask you to compute a step by hand. If you don't have one, the calculator app on your phone is fine.");
  document.querySelector("main.wrap")?.before(note);
  P = new Plot($("cv"));
  // status: 0 = not done, 1 = solved without help, 2 = solved with help, 3 = answer shown
  S = { cur: 0, status: TASKS.map(() => 0), attempts: 0, hintIdx: 0, hintUsed: false, choice: 0, check: null, task: null };
  try { const saved = JSON.parse(localStorage.getItem(store) || "null");
    if (saved && saved.status?.length === TASKS.length) { S.status = saved.status; S.cur = saved.cur || 0; } } catch {}
  const save = () => { try { localStorage.setItem(store, JSON.stringify({ status: S.status, cur: S.cur })); } catch {} };

  function feedback(kind, msg) {
    const fb = $("feedback"); fb.className = "feedback " + (kind || "");
    fb.innerHTML = !kind ? "" : kind === "ok" ? "✓ " + msg : kind === "bad" ? "✗ " + msg : kind === "hint" ? "<b>Hint:</b> " + msg : msg;
    typeset(fb);
  }
  function chrome() {
    const segs = $("segs"), nav = $("nav"); segs.innerHTML = ""; nav.innerHTML = "";
    nav.append(el("div", { className: "nav-label" }, "Tasks"));
    TASKS.forEach((t, i) => {
      const s = S.status[i], cls = s === 1 || s === 2 ? "done" : s === 3 ? "shown" : "";
      segs.append(el("div", { className: `seg ${cls || (i === S.cur ? "cur" : "")}` }));
      const b = el("button", { type: "button", className: `nav-item ${cls} ${i === S.cur ? "cur" : ""}` },
        `<span class="mark">${["○", "★", "✓", "!"][s]}</span><span>${i + 1}. ${t.nav}</span>`);
      if (i === S.cur) b.setAttribute("aria-current", "step");
      b.onclick = () => show(i); nav.append(b);
    });
    const n = st => S.status.filter(x => x === st).length;
    nav.append(el("div", { className: "tally" }, `<span>★ ${n(1)} solved first time</span><span>✓ ${n(2)} solved with help</span><span>! ${n(3)} answers shown</span>`));
    typeset(nav);
    $("count").textContent = `${S.status.filter(x => x > 0).length} / ${TASKS.length} done`;
    $("nextBtn").textContent = S.cur === TASKS.length - 1 ? "Finish →" : S.status[S.cur] ? "Next →" : "Skip →";
  }
  function show(i) {
    S.cur = i; S.attempts = 0; S.hintIdx = 0; S.hintUsed = false; S.choice = 0; save();
    const t = S.task = { ...TASKS[i] };
    $("eyebrow").textContent = `Task ${i + 1} of ${TASKS.length}`; $("title").innerHTML = t.title; $("instr").innerHTML = t.instr;
    typeset($("title")); typeset($("instr"));
    const C = $("controls"); C.innerHTML = ""; feedback("", "");
    ["hintBtn", "revealBtn", "checkBtn"].forEach(id => { $(id).hidden = false; }); $("checkBtn").disabled = false;
    S.check = t.build(C, t); chrome();
  }
  function onCheck() {
    const [res, msg] = S.check();
    if (res === "done") { if (!S.status[S.cur]) S.status[S.cur] = S.attempts || S.hintUsed ? 2 : 1; feedback("ok", msg); $("checkBtn").disabled = true; save(); }
    else if (res === "step") feedback("ok", msg);
    else { S.attempts++; feedback("bad", msg + (S.attempts >= 2 && S.hintIdx < S.task.hints.length ? " Stuck? Try the <b>Hint</b> button." : "")); }
    chrome();
  }
  function onHint() { S.hintUsed = true; S.hintIdx = Math.min(S.hintIdx + 1, S.task.hints.length); feedback("hint", S.task.hints[S.hintIdx - 1]); }
  function onReveal() { if (!S.status[S.cur]) S.status[S.cur] = 3; save(); feedback("info", "<b>Answer:</b> " + S.task.answer); chrome(); }
  function onNext() { if (S.cur < TASKS.length - 1) show(S.cur + 1); else summary(); }
  function summary() {
    const solved = S.status.filter(x => x === 1 || x === 2).length, stars = S.status.filter(x => x === 1).length;
    $("eyebrow").textContent = "Complete"; $("title").textContent = `${lecture} complete!`;
    $("instr").innerHTML = `<p>You solved <b>${solved} of ${TASKS.length}</b> tasks, <b>${stars}</b> of them first time.</p>
      <p>Tasks marked ! or ○ are worth another look: rewatch that part of the video, then pick the task on the left to try again.</p>`;
    const labels = ["not done", "★ first time", "✓ with help", "! answer shown"];
    $("controls").innerHTML = `<div class="tablewrap"><table class="iter results"><thead><tr><th>Task</th><th>Result</th></tr></thead><tbody>${
      TASKS.map((t, i) => `<tr><td>${i + 1}. ${t.title}</td><td>${labels[S.status[i]]}</td></tr>`).join("")}</tbody></table></div>`;
    typeset($("controls"));
    feedback("ok", `Well done! Score: ${solved} / ${TASKS.length}`);
    ["hintBtn", "revealBtn", "checkBtn"].forEach(id => { $(id).hidden = true; });
    $("nextBtn").textContent = "Start over";
    $("nextBtn").onclick = () => { S.status = TASKS.map(() => 0); $("nextBtn").onclick = onNext; show(0); };
    finalPlot();
  }
  $("checkBtn").onclick = onCheck; $("hintBtn").onclick = onHint; $("revealBtn").onclick = onReveal; $("nextBtn").onclick = onNext;
  document.addEventListener("keydown", e => { if (e.key === "Enter" && e.target.matches("input[type=text]") && !$("checkBtn").disabled) onCheck(); });
  show(S.cur);
}
