---
title: Convergence of Fixed-Point Iteration
---

<p class="nm-eyebrow">Lecture 6</p>

# Convergence of Fixed-Point Iteration

<iframe class="nm-video" src="https://www.youtube-nocookie.com/embed/583PXs6cS4I" title="Lecture 6: Convergence of Fixed-Point Iteration" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<div class="nm-actions" markdown>
[Practise this lecture](../practice/lec06_fixed_point_convergence.html){ .md-button .md-button--primary }
[Watch on YouTube](https://www.youtube.com/watch?v=583PXs6cS4I){ .md-button }
</div>

<div class="nm-key" markdown>
#### Key results
- Near a fixed point, \(r - x_{n+1} = g'(\xi_n)(r - x_n)\): each step multiplies the error by a slope.
- \(|g'(r)| < 1\): the fixed point attracts (linear convergence, rate \(|g'(r)|\)); \(|g'(r)| > 1\): it repels.
- Contraction mapping theorem with error bounds \(|r - x_n| \le \frac{\lambda^n}{1-\lambda}|x_1 - x_0|\).
</div>

## Each step multiplies the error by a slope

Close to a fixed point \(c\), the graph of \(g\) looks like a straight line through \(c\) with slope \(g'(c)\). The mean value theorem makes this exact:

\[
c - x_{n+1} = g(c) - g(x_n) = g'(\xi_n)\,(c - x_n), \qquad \xi_n \text{ between } x_n \text{ and } c .
\]

So the slope decides everything:

| \(g'(c)\) | Cobweb | Behaviour |
|---|---|---|
| \(0 < g'(c) < 1\) | staircase | converges |
| \(-1 < g'(c) < 0\) | spiral | converges |
| \(g'(c) < -1\) | spiral | diverges |
| \(g'(c) > 1\) | staircase | diverges |

For the four rearrangements of \(x^3 - 2x - 5 = 0\) from Lecture 5: \((2x+5)^{1/3}\) has \(g'(r) \approx 0.15\), \(\sqrt{(2x+5)/x}\) has \(-0.27\), \((2x+5)/x^2\) has \(-1.54\), and \(x^3 - x - 5\) has \(12.2\). The first two converge, the last two diverge.

## Contraction mapping theorem

\(g\) is a **contraction** on \([a,b]\) if \(|g(x) - g(y)| \le \lambda|x - y|\) for all \(x, y \in [a,b]\), with \(0 < \lambda < 1\).

!!! note "Theorem"
    If \(g([a,b]) \subseteq [a,b]\) and \(g\) is a contraction on \([a,b]\), then \(g\) has exactly one fixed point \(r \in [a,b]\), and \(x_{n+1} = g(x_n)\) converges to \(r\) from every \(x_0 \in [a,b]\), with

    \[
    |r - x_n| \le \lambda^n |r - x_0| \le \frac{\lambda^n}{1-\lambda}\,|x_1 - x_0| .
    \]

*Uniqueness.* If \(c, d\) are fixed points, \(|c - d| = |g(c) - g(d)| \le \lambda|c - d|\), so \((1-\lambda)|c-d| \le 0\) and \(c = d\).

*Convergence.* \(|r - x_{n+1}| = |g(r) - g(x_n)| \le \lambda|r - x_n|\), hence \(|r - x_n| \le \lambda^n|r - x_0| \to 0\).

*Error bound.* \(|r - x_0| \le |r - x_1| + |x_1 - x_0| \le \lambda|r - x_0| + |x_1 - x_0|\) gives \(|r - x_0| \le \frac{1}{1-\lambda}|x_1 - x_0|\). The same argument gives the a posteriori bound

\[
|r - x_{n+1}| \le \frac{\lambda}{1-\lambda}\,|x_{n+1} - x_n| .
\]

**Finding \(\lambda\).** If \(g'\) is continuous and \(\lambda = \max_{[a,b]}|g'(x)| < 1\), the mean value theorem shows \(g\) is a contraction. For \(g(x) = (2x+5)^{1/3}\) on \([2,3]\): \(g'(x) = \frac23(2x+5)^{-2/3}\) is largest at \(x = 2\), so \(\lambda = \frac23\cdot 9^{-2/3} \approx 0.154\).

## Predicting the number of steps

With \(\lambda = 0.154\) and \(|x_1 - x_0| = 0.0801\), an error below \(10^{-6}\) needs \(\frac{0.154^n}{0.846}(0.0801) \le 10^{-6}\), i.e. \(n \ge 6.13\): **7 steps**.

| \(n\) | \(x_n\) | \(\lvert x_n - r\rvert\) | a priori bound |
|---:|---:|---:|---:|
| \(0\) | \(2.000000000\) | \(9.46\times10^{-2}\) | \(9.47\times10^{-2}\) |
| \(1\) | \(2.080083823\) | \(1.45\times10^{-2}\) | \(1.46\times10^{-2}\) |
| \(2\) | \(2.092350678\) | \(2.20\times10^{-3}\) | \(2.25\times10^{-3}\) |
| \(3\) | \(2.094216996\) | \(3.34\times10^{-4}\) | \(3.46\times10^{-4}\) |
| \(4\) | \(2.094500652\) | \(5.08\times10^{-5}\) | \(5.34\times10^{-5}\) |
| \(5\) | \(2.094543758\) | \(7.72\times10^{-6}\) | \(8.22\times10^{-6}\) |
| \(6\) | \(2.094550308\) | \(1.17\times10^{-6}\) | \(1.27\times10^{-6}\) |
| \(7\) | \(2.094551303\) | \(1.78\times10^{-7}\) | \(1.95\times10^{-7}\) |
| \(8\) | \(2.094551454\) | \(2.71\times10^{-8}\) | \(3.01\times10^{-8}\) |

After 6 steps the error is still just above \(10^{-6}\); after 7 it is below, as predicted.

## Rate and local convergence

\[
\lim_{n\to\infty}\frac{r - x_{n+1}}{r - x_n} = g'(r),
\]

so the convergence is linear with rate \(|g'(r)|\) when \(g'(r) \ne 0\) (for the cube-root form, about \(0.152\)). If \(|g'(r)| < 1\), continuity keeps \(|g'| < 1\) on a small interval around \(r\), so the iteration converges for every \(x_0\) close enough to \(r\): **local convergence**.

## Relaxation and higher order

Write \(g(x) = x - \alpha f(x)\). Its fixed points are the roots of \(f\), and \(g'(r) = 1 - \alpha f'(r)\). For \(x^3 - 2x - 5\), \(f'(r) \approx 11.16\):

| \(\alpha\) | \(g'(r)\) | Behaviour |
|---|---|---|
| \(0.05\) | \(0.44\) | slow |
| \(0.2\) | \(-1.23\) | diverges |
| \(1/f'(r) \approx 0.0896\) | \(0\) | very fast |

Newton's method takes \(\alpha = 1/f'(x_n)\) at every step. When \(g'(r) = 0\) the error is proportional to its square; in general, if \(g'(r) = \cdots = g^{(p-1)}(r) = 0\), the order of convergence is at least \(p\).

<div class="nm-actions" markdown>
[Practise this lecture](../practice/lec06_fixed_point_convergence.html){ .md-button .md-button--primary }
[← Previous: Fixed-Point Iteration](lec05-fixed-point.md){ .md-button }
[Next: Order and Modified Newton →](lec07-order-modified-newton.md){ .md-button }
</div>
