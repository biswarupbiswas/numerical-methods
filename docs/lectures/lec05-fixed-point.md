---
title: Fixed-Point Iteration
---

<p class="nm-eyebrow">Lecture 5</p>

# Fixed-Point Iteration

<iframe class="nm-video" src="https://www.youtube-nocookie.com/embed/64pMPsAbHUE" title="Lecture 5: Fixed-Point Iteration" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<div class="nm-actions" markdown>
[Practise this lecture](../practice/lec05_fixed_point.html){ .md-button .md-button--primary }
[Watch on YouTube](https://www.youtube.com/watch?v=64pMPsAbHUE){ .md-button }
</div>

<div class="nm-key" markdown>
#### Key results
- \(c\) is a **fixed point** of \(g\) if \(g(c) = c\): where \(y = g(x)\) meets \(y = x\).
- \(f(c) = 0 \iff c\) is a fixed point of \(g(x) = x - f(x)\); iterate \(x_{n+1} = g(x_n)\).
- If \(g\) is continuous and \(g([a,b]) \subseteq [a,b]\), then \(g\) has a fixed point in \([a,b]\).
</div>

## Fixed points and roots

A number \(c\) is a fixed point of \(g\) if \(g(c) = c\). Graphically it is where the curve \(y = g(x)\) crosses the diagonal \(y = x\).

If \(f(c) = 0\), then \(c\) is a fixed point of \(g(x) = x - f(x)\); conversely \(g(c) = c\) makes \(c\) a root of \(f(x) = x - g(x)\). Every root-finding problem can be recast as a fixed-point problem, and Newton's method is one: \(x_{n+1} = g(x_n)\) with \(g(x) = x - f(x)/f'(x)\).

## The iteration and cobweb diagrams

Pick \(x_0\) and feed each output back in:

\[
x_{n+1} = g(x_n), \qquad n \ge 0 .
\]

If \(x_n \to c\) and \(g\) is continuous, then \(c = \lim x_{n+1} = g(\lim x_n) = g(c)\): the limit is a fixed point.

A **cobweb diagram** draws the iteration: from \(x_n\) go vertically to the curve (height \(g(x_n) = x_{n+1}\)), then horizontally to the diagonal, and repeat. For \(g(x) = \cos x\) from \(x_0 = 1\) (radians) the values are \(0.5403,\ 0.8576,\ 0.6543,\ 0.7935, \ldots\) and they settle on \(c = 0.7390851\ldots\), the number whose cosine is itself.

## Example: four rearrangements

\(x^3 - 2x - 5 = 0\) has a root \(r \approx 2.0945515\) in \([2,3]\). It can be written as \(x = g(x)\) in many ways, all with the same fixed point:

\[
x = x^3 - x - 5, \qquad x = (2x+5)^{1/3}, \qquad x = \sqrt{\frac{2x+5}{x}}, \qquad x = \frac{2x+5}{x^2} .
\]

Starting from \(x_0 = 2\):

| \(n\) | \((2x+5)^{1/3}\) | \(\sqrt{(2x+5)/x}\) | \((2x+5)/x^2\) | \(x^3 - x - 5\) |
|---:|---:|---:|---:|---:|
| \(0\) | \(2.000000\) | \(2.000000\) | \(2.0000\) | \(2\) |
| \(1\) | \(2.080084\) | \(2.121320\) | \(2.2500\) | \(1\) |
| \(2\) | \(2.092351\) | \(2.087348\) | \(1.8765\) | \(-5\) |
| \(3\) | \(2.094217\) | \(2.096517\) | \(2.4857\) | \(-125\) |
| \(4\) | \(2.094501\) | \(2.094017\) | \(1.6139\) | \(-1953005\) |
| \(5\) | \(2.094544\) | \(2.094697\) | \(3.1590\) | \(\cdots\) |
| \(6\) | \(2.094550\) | \(2.094512\) | \(1.1342\) | \(\cdots\) |

The cube-root form climbs a **staircase** to \(r\) (each error about \(0.15\) times the previous one); the square-root form **spirals in**; \((2x+5)/x^2\) **spirals out**; and \(x^3 - x - 5\) **explodes**. Near the fixed point, a curve gentler than the diagonal closes in and a steeper one flies apart. Lecture 6 makes this precise with \(g'\).

## When does a fixed point exist?

If \(g\) is continuous on \([a,b]\) and \(g([a,b]) \subseteq [a,b]\), then \(g\) has at least one fixed point in \([a,b]\).

*Proof.* Let \(h(x) = g(x) - x\). Since \(g\) takes values in \([a,b]\), \(h(a) = g(a) - a \ge 0\) and \(h(b) = g(b) - b \le 0\). By the Intermediate Value Theorem \(h(c) = 0\) for some \(c \in [a,b]\), i.e. \(g(c) = c\).

For \(g(x) = (2x+5)^{1/3}\): \(g\) is increasing, \(g(2) = 9^{1/3} \approx 2.0801\) and \(g(3) = 11^{1/3} \approx 2.2240\), so \(g([2,3]) \subseteq [2,3]\) and a fixed point is guaranteed.

## Algorithm

```text
input  g, x0, tol, maxit
for n = 0 to maxit − 1
    x(n+1) ← g(xn)
    if  |x(n+1) − xn| < tol :  return x(n+1)
end
error: no convergence within maxit
```

<div class="nm-actions" markdown>
[Practise this lecture](../practice/lec05_fixed_point.html){ .md-button .md-button--primary }
[← Previous: Newton–Raphson](lec04-newton.md){ .md-button }
[Next: Fixed-Point Convergence →](lec06-fixed-point-convergence.md){ .md-button }
</div>
