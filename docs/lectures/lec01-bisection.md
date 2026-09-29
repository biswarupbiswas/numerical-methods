# Lecture 1 · The Bisection Method

![Lecture 1 thumbnail](../assets/thumbnails/lec01_bisection.png){ .nm-thumb }

<div class="nm-actions" markdown>
[:material-pencil-box-outline: Practise this lecture](../practice/lec01_bisection.html){ .md-button .md-button--primary }
[:material-download: MATLAB version (optional)](../downloads/bisection_onramp.m){ .md-button }
</div>

## The problem

Many equations have no closed-form solution, for example

\[
f(x) = x^3 - x - 2 = 0 .
\]

We look for a **root** \(r\), a number with \(f(r) = 0\): graphically, the point where the curve crosses the \(x\)-axis.

## Intermediate Value Theorem

If \(f\) is continuous on \([a,b]\) and \(f(a)\,f(b) < 0\), then there is at least one \(r \in (a,b)\) with \(f(r) = 0\).

!!! warning "Continuity matters"
    \(g(x) = 1/x\) has \(g(-1)\,g(1) < 0\) but no root in \((-1, 1)\): it jumps across the axis at \(x = 0\).

## The idea

Cut the interval at the midpoint \(c = \tfrac{a+b}{2}\), check the sign of \(f(c)\), and keep the half where the sign changes. The root stays trapped while the interval halves every step.

## Worked example

\(f(x) = x^3 - x - 2\) on \([1, 2]\): \(f(1) = -2\), \(f(2) = 4\).

| \(n\) | \(a\) | \(b\) | \(c\) | \(f(c)\) |
|---:|---:|---:|---:|---:|
| 1 | 1 | 2 | 1.5 | −0.1250 |
| 2 | 1.5 | 2 | 1.75 | +1.6094 |
| 3 | 1.5 | 1.75 | 1.625 | +0.6660 |
| 4 | 1.5 | 1.625 | 1.5625 | +0.2522 |
| 5 | 1.5 | 1.5625 | 1.53125 | +0.0591 |
| 6 | 1.5 | 1.53125 | 1.515625 | −0.0341 |

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

**Stopping criteria.** Only \((b-a)/2 < \text{tol}\) guarantees \(|c - r| < \text{tol}\). A small \(|f(c)|\) does not (the function may be very flat), and a maximum number of iterations is a safety net.

## Error bound and number of iterations

\[
|c_n - r| \le \frac{b-a}{2^n}
\qquad\Longrightarrow\qquad
n \ge \log_2\!\left(\frac{b-a}{\varepsilon}\right).
\]

For \([1,2]\) and \(\varepsilon = 10^{-6}\): \(n \ge \log_2(10^6) \approx 19.93\), so **20 iterations**.

Convergence is **linear** with rate \(\tfrac12\): about 3.3 iterations per correct decimal digit.

## Strengths and weaknesses

| Strengths | Weaknesses |
|---|---|
| Always converges (continuous \(f\), sign change) | Slow: linear convergence |
| Simple to code | Needs a starting interval with a sign change |
| Guaranteed error bound | Misses roots that only touch the axis, e.g. \((x-1)^2\) |

[:material-pencil-box-outline: Practise this lecture](../practice/lec01_bisection.html){ .md-button .md-button--primary }
