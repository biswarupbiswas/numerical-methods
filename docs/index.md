---
title: Numerical Methods
hide:
  - navigation
  - toc
---

<div class="nm-hero">
  <p class="nm-eyebrow">A visual course</p>
  <h1>Numerical Methods</h1>
  <p class="nm-lede">Short animated lectures on the algorithms behind scientific computing. Each lecture comes with notes and a self-paced practice page with live plots, hints and instant feedback.</p>
  <div class="nm-actions">
    <a class="md-button md-button--primary" href="lectures/lec01-bisection/">Start with Lecture 1</a>
  </div>
</div>

## Lectures

<div class="nm-lectures">
  <article class="nm-lecture">
    <a href="lectures/lec01-bisection/"><img src="assets/thumbnails/lec01_bisection.png" alt="Lecture 1: The Bisection Method"></a>
    <div>
      <div class="nm-num">Lecture 1 · 7 min</div>
      <h3><a href="lectures/lec01-bisection/">The Bisection Method</a></h3>
      <p>Bracket a root, cut the interval in half and keep the half with the sign change. Slow, but guaranteed: \(|c_n - r| \le \frac{b-a}{2^n}\).</p>
      <div class="nm-links">
        <a href="lectures/lec01-bisection/">Notes</a>
        <a href="https://www.youtube.com/watch?v=OyOAFWVk5Sc">Video</a>
        <a href="practice/lec01_bisection.html">Practice</a>
      </div>
    </div>
  </article>
  <article class="nm-lecture">
    <a href="lectures/lec02-secant/"><img src="assets/thumbnails/lec02_secant.png" alt="Lecture 2: The Secant Method"></a>
    <div>
      <div class="nm-num">Lecture 2 · 8 min</div>
      <h3><a href="lectures/lec02-secant/">The Secant Method</a></h3>
      <p>Replace the curve by the straight line through the last two points. Much faster than bisection, with order \(p = \frac{1+\sqrt5}{2} \approx 1.618\).</p>
      <div class="nm-links">
        <a href="lectures/lec02-secant/">Notes</a>
        <a href="https://www.youtube.com/watch?v=4c2-SlNsi70">Video</a>
        <a href="practice/lec02_secant.html">Practice</a>
      </div>
    </div>
  </article>
  <article class="nm-lecture">
    <a href="lectures/lec03-regula-falsi/"><img src="assets/thumbnails/lec03_regula_falsi.png" alt="Lecture 3: Regula Falsi"></a>
    <div>
      <div class="nm-num">Lecture 3 · 8 min</div>
      <h3><a href="lectures/lec03-regula-falsi/">Regula Falsi</a></h3>
      <p>Bisection's bracket with the secant's straight line. Safe, but an endpoint can get stuck, until the Illinois fix makes it superlinear.</p>
      <div class="nm-links">
        <a href="lectures/lec03-regula-falsi/">Notes</a>
        <a href="https://www.youtube.com/watch?v=mJpxcbBGdI4">Video</a>
        <a href="practice/lec03_regula_falsi.html">Practice</a>
      </div>
    </div>
  </article>
  <article class="nm-lecture">
    <a href="lectures/lec04-newton/"><img src="assets/thumbnails/lec04_newton.png" alt="Lecture 4: The Newton–Raphson Method"></a>
    <div>
      <div class="nm-num">Lecture 4 · 8 min</div>
      <h3><a href="lectures/lec04-newton/">The Newton–Raphson Method</a></h3>
      <p>Follow the tangent line down to the axis. Quadratic convergence, \(e_{n+1} \approx C\,e_n^2\): the correct digits double every step.</p>
      <div class="nm-links">
        <a href="lectures/lec04-newton/">Notes</a>
        <a href="https://www.youtube.com/watch?v=MIM5zopwb5o">Video</a>
        <a href="practice/lec04_newton.html">Practice</a>
      </div>
    </div>
  </article>
  <article class="nm-lecture nm-soon">
    <div><div class="nm-num">Coming next</div>Fixed-point iteration · Order of convergence · Floating-point numbers</div>
  </article>
</div>

## How each lecture works

<div class="nm-steps">
  <div class="nm-step"><b>Watch</b>A 6–8 minute animated video that builds the idea step by step.</div>
  <div class="nm-step"><b>Read</b>The notes: key formulas, the worked example and the algorithm.</div>
  <div class="nm-step"><b>Practise</b>Nine short interactive tasks. Your progress is saved as you go.</div>
</div>
