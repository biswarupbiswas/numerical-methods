---
title: The Newton–Raphson Method
---

<p class="nm-eyebrow">Lecture 4</p>

# The Newton–Raphson Method

![Lecture 4: The Newton–Raphson Method](../assets/thumbnails/lec04_newton.png){ .nm-video }

<div class="nm-actions" markdown>
[Practise this lecture](../practice/lec04_newton.html){ .md-button .md-button--primary }
</div>

<div class="nm-key" markdown>
#### Key results
- \(x_{n+1} = x_n - \dfrac{f(x_n)}{f'(x_n)}\): follow the tangent line down to the axis.
- Near a simple root the convergence is **quadratic**: \(e_{n+1} \approx \frac{f''(r)}{2f'(r)}\,e_n^2\), so the correct digits double.
- It needs \(f'\) and a good starting guess; it can find the wrong root, meet a flat tangent, cycle or diverge.
</div>

## From secant to tangent

The secant method draws a line through two points of the curve. Slide the two points together and the secant becomes the **tangent**, the line with slope \(f'(x)\). Newton's method starts from a single guess \(x_0\), follows the tangent to the axis, and repeats.

## The formula

The tangent at \(x_n\) is \(y = f(x_n) + f'(x_n)\,(x - x_n)\). Setting \(y = 0\):

\[
x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}, \qquad n \ge 0 .
\]

For a straight line \(f(x) = ax + b\) the tangent is the line itself, so Newton reaches the root \(-b/a\) in one step from any \(x_0\).

## Worked example

\(f(x) = x^3 + 2x^2 - x - 1\), \(f'(x) = 3x^2 + 4x - 1\), starting at \(x_0 = 1\):

| \(n\) | \(x_n\) | \(\lvert f(x_n)\rvert\) | \(f'(x_n)\) | \(\lvert x_n - r\rvert\) |
|---:|---:|---:|---:|---:|
| \(0\) | \(1.0000000000\) | \(1.0\times10^{0}\) | \(6.0000\) | \(2.0\times10^{-1}\) |
| \(1\) | \(0.8333333333\) | \(1.3\times10^{-1}\) | \(4.4167\) | \(3.1\times10^{-2}\) |
| \(2\) | \(0.8029350105\) | \(4.1\times10^{-3}\) | \(4.1459\) | \(1.0\times10^{-3}\) |
| \(3\) | \(0.8019387932\) | \(4.4\times10^{-6}\) | \(4.1371\) | \(1.1\times10^{-6}\) |
| \(4\) | \(0.8019377358\) | \(4.9\times10^{-12}\) | \(4.1371\) | \(1.2\times10^{-12}\) |

The correct digits are about \(0.7,\ 1.5,\ 3.0,\ 6.0,\ 11.9\): they **double** at every step.

## Why the error is squared

Taylor's theorem around \(x_n\) gives \(0 = f(r) = f(x_n) + f'(x_n)(r - x_n) + \tfrac12 f''(\xi)(r - x_n)^2\). Dividing by \(f'(x_n)\):

\[
r - x_{n+1} = -\frac{f''(\xi)}{2f'(x_n)}\,(r - x_n)^2
\quad\Longrightarrow\quad
\lim_{n\to\infty}\frac{r - x_{n+1}}{(r - x_n)^2} = -\frac{f''(r)}{2f'(r)} .
\]

Equivalently, Newton is the one-point method \(x_{n+1} = g(x_n)\) with \(g(x) = x - f(x)/f'(x)\), and \(g'(x) = \dfrac{f(x)\,f''(x)}{f'(x)^2}\) vanishes at the root. That is what makes the order at least \(2\).

## The Babylonian square root

For \(f(x) = x^2 - 2\) Newton's method becomes \(x_{n+1} = \frac12\left(x_n + \frac{2}{x_n}\right)\): average \(x\) with \(2/x\). From \(x_0 = 1\): \(1.5,\ 1.41667,\ 1.4142157,\ 1.41421356237\), again doubling the digits.

## Cost per function evaluation

Each Newton step needs \(f\) and \(f'\), two evaluations; the secant method needs one. Per evaluation, Newton's order is \(\sqrt2 \approx 1.41\) and the secant method's is \(1.618\). When \(f'\) is expensive, the secant method can win.

## When Newton fails

- **The wrong root.** From \(x_0 = 0\), \(f'(0) = -1 < 0\) points the other way: \(0 \to -1 \to -0.5 \to -0.5556\), converging to \(-0.55496\) instead of \(0.80194\).
- **A flat tangent.** At \(x \approx 0.215\), \(f'(x) = 0\). Starting at \(0.2\) the tangent is nearly flat and the next guess is \(-13.7\).
- **A cycle.** For \(f(x) = x^3 - 2x + 2\) from \(x_0 = 0\): \(0 \to 1 \to 0 \to 1 \to \cdots\)
- **Divergence.** For \(f(x) = \arctan x\) from \(1.5\): \(-1.69,\ 2.32,\ -5.11,\ 32.3, \ldots\); from \(1.3\) it converges.

A sufficient condition for convergence is \(M\,|r - x_0| < 1\) with \(M = \dfrac{\max|f''|}{2\min|f'|}\) near the root; then \(M|r - x_n| \le (M|r - x_0|)^{2^n}\).

## Algorithm

```text
input  f, f', x0, tol, maxit
for n = 0 to maxit − 1
    if  f'(xn) = 0 :  error (zero derivative)
    x(n+1) ← xn − f(xn) / f'(xn)
    if  |x(n+1) − xn| ≤ tol :  return x(n+1)
end
error: no convergence within maxit
```

## Comparison

| | Guaranteed? | Order | Needs \(f'\)? |
|---|---|---|---|
| Bisection | yes | \(1\) | no |
| Regula Falsi | yes | \(1\) | no |
| Secant | no | \(1.618\) | no |
| Newton | no | \(2\) | yes |

In practice a safe method gets close to the root, and Newton finishes the job in a few steps.

<div class="nm-actions" markdown>
[Practise this lecture](../practice/lec04_newton.html){ .md-button .md-button--primary }
[← Previous: Regula Falsi](lec03-regula-falsi.md){ .md-button }
</div>
