---
title: The Secant Method
---

<p class="nm-eyebrow">Lecture 2</p>

# The Secant Method

<iframe class="nm-video" src="https://www.youtube-nocookie.com/embed/4c2-SlNsi70" title="Lecture 2: The Secant Method" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<div class="nm-actions" markdown>
[Practise this lecture](../practice/lec02_secant.html){ .md-button .md-button--primary }
[Watch on YouTube](https://www.youtube.com/watch?v=4c2-SlNsi70){ .md-button }
</div>

<div class="nm-key" markdown>
#### Key results
- \(x_{n+1} = x_n - \dfrac{f(x_n)\,(x_n - x_{n-1})}{f(x_n) - f(x_{n-1})}\)
- \(e_{n+1} \approx C\,e_n\,e_{n-1}\), so the order is \(p = \frac{1+\sqrt5}{2} \approx 1.618\).
- One new function value per step and no derivatives, but convergence is only local.
</div>

## The idea

Bisection only uses the **signs** of \(f\). The secant method uses the **values**. Up close a smooth curve looks like a straight line, so we replace the curve by the line through the last two points and see where that line crosses the axis.

## The secant formula

The line through \((x_0, f(x_0))\) and \((x_1, f(x_1))\) crosses the axis at

\[
x_2 = x_1 - \frac{f(x_1)\,(x_1 - x_0)}{f(x_1) - f(x_0)} .
\]

Repeating with the two newest points gives

\[
x_{n+1} = x_n - \frac{f(x_n)\,(x_n - x_{n-1})}{f(x_n) - f(x_{n-1})}, \qquad n \ge 1 .
\]

## Worked example

\(f(x) = x^3 + 2x^2 - x - 1\) with \(x_0 = 0\) and \(x_1 = 1\). The root in \([0,1]\) is \(r = 0.8019377\ldots\)

| \(n\) | \(x_n\) | \(f(x_n)\) | \(\lvert x_n - r\rvert\) |
|---:|---:|---:|---:|
| \(0\) | \(0\) | \(-1\) | \(8.0\times10^{-1}\) |
| \(1\) | \(1\) | \(+1\) | \(2.0\times10^{-1}\) |
| \(2\) | \(0.5\) | \(-0.875\) | \(3.0\times10^{-1}\) |
| \(3\) | \(0.7333333\) | \(-0.2634\) | \(6.9\times10^{-2}\) |
| \(4\) | \(0.8338279\) | \(+0.1364\) | \(3.2\times10^{-2}\) |
| \(5\) | \(0.7995353\) | \(-0.0099\) | \(2.4\times10^{-3}\) |
| \(6\) | \(0.8018581\) | \(-0.00033\) | \(8.0\times10^{-5}\) |
| \(7\) | \(0.8019379\) | \(+8.4\times10^{-7}\) | \(2.0\times10^{-7}\) |
| \(8\) | \(0.8019377\) | \(\approx 0\) | \(1.7\times10^{-11}\) |

Notice that \(x_2\) and \(x_3\) are both **below** the axis. Unlike bisection, the secant method does not keep a bracket: the line simply extends beyond the two points.

## Why it is fast: the golden ratio

For the secant method

\[
e_{n+1} \approx C\, e_n\, e_{n-1}, \qquad C \approx \left|\frac{f''(r)}{2 f'(r)}\right| .
\]

Multiplying errors **adds** their numbers of correct digits, so the digits grow like the Fibonacci numbers. In the example they are \(1.5,\ 2.6,\ 4.1,\ 6.7,\ 10.8\). The ratio of consecutive Fibonacci numbers tends to the golden ratio, which gives the order of convergence

\[
p^2 = p + 1 \quad\Longrightarrow\quad p = \frac{1+\sqrt5}{2} \approx 1.618 .
\]

This is **superlinear** convergence: faster than bisection's \(p = 1\), slower than quadratic.

## When it fails

- **Flat curve.** If \(f(x_n) \approx f(x_{n-1})\) the line is nearly horizontal and the next guess shoots far away. From \(x_0 = 0.2\), \(x_1 = 0.3\) the example jumps to \(x_2 \approx 6.05\). If the two values are equal, we divide by zero.
- **No bracket.** Convergence is only local. From \(-1.5\) and \(-1\) the method converges, but to a different root, \(-0.555\).

## Algorithm

```text
input  f, x0, x1, tol, maxit
for k = 1 to maxit
    if  f(x1) = f(x0):  error (zero denominator)
    x2 ← x1 − f(x1)·(x1 − x0) / (f(x1) − f(x0))
    x0 ← x1
    x1 ← x2
    if  |x1 − x0| < tol:  return x1
end
```

## Bisection vs secant

| | Bisection | Secant |
|---|---|---|
| Always converges? | yes | no |
| Order \(p\) | \(1\) (linear) | \(1.618\) (superlinear) |
| Needs a bracket? | yes | no |
| Derivatives? | no | no |
| New \(f\)-values per step | \(1\) | \(1\) |

In practice the two ideas are combined: robust root finders keep a bracket like bisection but take fast secant-like steps whenever it is safe.

<div class="nm-actions" markdown>
[Practise this lecture](../practice/lec02_secant.html){ .md-button .md-button--primary }
[← Previous: The Bisection Method](lec01-bisection.md){ .md-button }
</div>
