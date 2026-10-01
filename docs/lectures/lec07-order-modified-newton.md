---
title: Order of Convergence and Modified Newton
---

<p class="nm-eyebrow">Lecture 7</p>

# Order of Convergence and Modified Newton

<iframe class="nm-video" src="https://www.youtube-nocookie.com/embed/HGcmFTTwxts" title="Lecture 7: Order of Convergence and Modified Newton" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<div class="nm-actions" markdown>
[Practise this lecture](../practice/lec07_order_modified_newton.html){ .md-button .md-button--primary }
[Watch on YouTube](https://www.youtube.com/watch?v=HGcmFTTwxts){ .md-button }
</div>

<div class="nm-key" markdown>
#### Key results
- Order \(p\): \(e_{n+1} \approx C\,e_n^{\,p}\); on a log-log plot of \(e_{n+1}\) against \(e_n\) the slope is \(p\).
- One-point methods: \(g'(r) = \cdots = g^{(p-1)}(r) = 0\), \(g^{(p)}(r) \ne 0\) \(\Rightarrow\) order exactly \(p\).
- At a root of multiplicity \(m\), Newton has \(g'(r) = 1 - \frac1m\) (linear); modified Newton \(x_{n+1} = x_n - m\frac{f(x_n)}{f'(x_n)}\) restores order \(2\).
</div>

## Order of convergence

A sequence \(x_n \to r\) converges with **order** \(p \ge 1\) if

\[
|r - x_{n+1}| \le C\,|r - x_n|^p ,
\]

with \(C < 1\) required when \(p = 1\) (then \(C\) is the **rate**). With order \(1\) each step adds a fixed number of correct digits; with order \(p\) the number of correct digits is multiplied by about \(p\).

Taking logarithms, \(\log e_{n+1} \approx p\log e_n + \log C\): plotted against each other, the errors lie on a line of **slope \(p\)**. From three consecutive errors,

\[
p \approx \frac{\log(e_{n+1}/e_n)}{\log(e_n/e_{n-1})} .
\]

For Newton on \(x^3 + 2x^2 - x - 1\) from \(x_0 = 1\) this gives \(1.87,\ 1.99,\ 2.00\); for the fixed-point iteration \((2x+5)^{1/3}\) it gives \(1.00\).

| Method | Order |
|---|---|
| Bisection, Regula Falsi, fixed point (\(g'(r) \ne 0\)) | \(1\) |
| Illinois | \(\approx 1.44\) |
| Secant | \(\frac{1+\sqrt5}{2} \approx 1.618\) |
| Newton (simple root) | \(2\) |

## Order of one-point methods

If \(x_{n+1} = g(x_n)\), \(g(r) = r\) and \(g'(r) = g''(r) = \cdots = g^{(p-1)}(r) = 0\), then the order is at least \(p\), and

\[
\lim_{n\to\infty}\frac{x_{n+1} - r}{(x_n - r)^p} = \frac{g^{(p)}(r)}{p!} .
\]

**Example.** For \(\sqrt a\), \(g(x) = \frac{x}{2}\left(1 + \frac{a}{x^2}\right)\): \(g'(x) = \frac12 - \frac{a}{2x^2}\) so \(g'(\sqrt a) = 0\), and \(g''(x) = \frac{a}{x^3}\) so \(g''(\sqrt a) = \frac{1}{\sqrt a} \ne 0\). The order is exactly \(2\), with \(\epsilon_{n+1}/\epsilon_n^2 \to \frac{1}{2\sqrt a}\) (about \(0.354\) for \(a = 2\)).

## Multiple roots

\(r\) has **multiplicity** \(m\) if \(f(x) = (x - r)^m q(x)\) with \(q(r) \ne 0\). If \(f(r) = f'(r) = \cdots = f^{(m-1)}(r) = 0\) and \(f^{(m)}(r) \ne 0\), then \(r\) has multiplicity \(m\). For \(f(x) = e^{x^2} - 1\): \(f(0) = 0\), \(f'(0) = 0\), \(f''(0) = 2\), so \(0\) is a double root.

For Newton's \(g(x) = x - f(x)/f'(x)\) one finds \(g'(r) = 1 - \frac1m\): at a multiple root Newton is only **linear**, with rate \(1 - \frac1m\) (\(\frac12\) for a double root, \(\frac23\) for a triple root). Conversely, an observed ratio \(\rho\) suggests \(m \approx \frac{1}{1 - \rho}\).

## Modified Newton

\[
x_{n+1} = x_n - m\,\frac{f(x_n)}{f'(x_n)}
\]

has \(g'(r) = 0\), so quadratic convergence is restored. For \(f(x) = e^{x^2} - 1\), \(m = 2\), \(x_0 = 0.5\):

| \(n\) | Newton \(x_n\) | Modified Newton \(x_n\) |
|---:|---:|---:|
| \(0\) | \(0.50000\) | \(5.0000\times10^{-1}\) |
| \(1\) | \(0.27880\) | \(5.7602\times10^{-2}\) |
| \(2\) | \(0.14468\) | \(9.5454\times10^{-5}\) |
| \(3\) | \(0.07309\) | \(4.3486\times10^{-13}\) |
| \(4\) | \(0.03664\) | |
| \(5\) | \(0.01833\) | |
| \(6\) | \(0.00917\) | |

Here the convergence is even **cubic**: \(g(x) = x - \frac{1 - e^{-x^2}}{x} = \frac{x^3}{2} + \cdots\), so \(g'(0) = g''(0) = 0\).

**Unknown \(m\).** Apply Newton's method to \(u(x) = \dfrac{f(x)}{f'(x)}\), which has a simple root at \(r\) for any \(m\). This converges quadratically, but \(u' = 1 - \dfrac{f f''}{(f')^2}\) needs \(f''\).

!!! warning "Cancellation"
    For small \(x\), \(e^{x^2}\) is very close to \(1\), and computing \(e^{x^2} - 1\) directly subtracts nearly equal numbers, losing digits. The naive formula gives \(x_3 \approx 1.1\times10^{-12}\) instead of \(4.35\times10^{-13}\). A dedicated routine for \(e^y - 1\) (usually called `expm1`) avoids this. Lecture 9 explains why.

<div class="nm-actions" markdown>
[Practise this lecture](../practice/lec07_order_modified_newton.html){ .md-button .md-button--primary }
[← Previous: Fixed-Point Convergence](lec06-fixed-point-convergence.md){ .md-button }
[Next: Floating-Point Numbers →](lec08-floating-point.md){ .md-button }
</div>
