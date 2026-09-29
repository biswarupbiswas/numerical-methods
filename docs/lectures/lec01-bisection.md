---
title: The Bisection Method
---

<p class="nm-eyebrow">Lecture 1</p>

# The Bisection Method

<iframe class="nm-video" src="https://www.youtube-nocookie.com/embed/OyOAFWVk5Sc" title="Lecture 1: The Bisection Method" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<div class="nm-actions" markdown>
[Practise this lecture](../practice/lec01_bisection.html){ .md-button .md-button--primary }
[Watch on YouTube](https://www.youtube.com/watch?v=OyOAFWVk5Sc){ .md-button }
</div>

<div class="nm-key" markdown>
#### Key results
- If \(f\) is continuous on \([a,b]\) and \(f(a)\,f(b) < 0\), there is a root in \((a,b)\).
- Midpoint \(c = \frac{a+b}{2}\); keep the half where \(f\) changes sign.
- Error bound \(|c_n - r| \le \frac{b-a}{2^n}\); linear convergence with rate \(\frac12\).
</div>

## The problem

Many equations have no closed-form solution, for example

\[
f(x) = x^3 - x - 2 = 0 .
\]

We look for a **root** \(r\), a number with \(f(r) = 0\). Graphically, it is where the curve crosses the \(x\)-axis.

## Intermediate Value Theorem

If \(f\) is continuous on \([a,b]\) and \(f(a)\,f(b) < 0\), then there is at least one \(r \in (a,b)\) with \(f(r) = 0\).

!!! warning "Continuity matters"
    \(g(x) = 1/x\) has \(g(-1)\,g(1) < 0\) but no root in \((-1, 1)\): it jumps across the axis at \(x = 0\).

## The idea

Cut the interval at the midpoint \(c = \frac{a+b}{2}\), check the sign of \(f(c)\), and keep the half where the sign changes. The root stays trapped while the interval halves at every step.

## Worked example

\(f(x) = x^3 - x - 2\) on \([1, 2]\), with \(f(1) = -2\) and \(f(2) = 4\).

| \(n\) | \(a\) | \(b\) | \(c\) | \(f(c)\) |
|---:|---:|---:|---:|---:|
| \(1\) | \(1\) | \(2\) | \(1.5\) | \(-0.1250\) |
| \(2\) | \(1.5\) | \(2\) | \(1.75\) | \(+1.6094\) |
| \(3\) | \(1.5\) | \(1.75\) | \(1.625\) | \(+0.6660\) |
| \(4\) | \(1.5\) | \(1.625\) | \(1.5625\) | \(+0.2522\) |
| \(5\) | \(1.5\) | \(1.5625\) | \(1.53125\) | \(+0.0591\) |
| \(6\) | \(1.5\) | \(1.53125\) | \(1.515625\) | \(-0.0341\) |

The true root is \(r = 1.5213797\ldots\)

## Algorithm

```text
input  f, a, b  with  f(a)·f(b) < 0,  tol
repeat
    c ← (a + b) / 2
    if  f(a)·f(c) < 0
        b ← c          # root in left half
    else
        a ← c          # root in right half
until  (b − a)/2 < tol
return c
```

**Stopping criteria.** Only \(\frac{b-a}{2} < \text{tol}\) guarantees \(|c - r| < \text{tol}\). A small \(|f(c)|\) does not, because the function may be very flat, and a maximum number of iterations is a safety net.

## Error bound and number of iterations

\[
|c_n - r| \le \frac{b-a}{2^n}
\qquad\Longrightarrow\qquad
n \ge \log_2\frac{b-a}{\varepsilon} .
\]

For \([1,2]\) and \(\varepsilon = 10^{-6}\): \(n \ge \log_2(10^6) \approx 19.93\), so \(20\) iterations are enough. Convergence is **linear** with rate \(\frac12\): about \(3.3\) iterations per correct decimal digit.

## Strengths and weaknesses

| Strengths | Weaknesses |
|---|---|
| Always converges for continuous \(f\) with a sign change | Slow: linear convergence |
| Simple to program | Needs a starting interval with a sign change |
| Guaranteed error bound | Misses roots that only touch the axis, such as \((x-1)^2\) |

<div class="nm-actions" markdown>
[Practise this lecture](../practice/lec01_bisection.html){ .md-button .md-button--primary }
[Next: The Secant Method →](lec02-secant.md){ .md-button }
</div>
