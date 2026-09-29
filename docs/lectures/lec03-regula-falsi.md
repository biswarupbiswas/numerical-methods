---
title: Regula Falsi
---

<p class="nm-eyebrow">Lecture 3</p>

# Regula Falsi

<iframe class="nm-video" src="https://www.youtube-nocookie.com/embed/mJpxcbBGdI4" title="Lecture 3: Regula Falsi" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<div class="nm-actions" markdown>
[Practise this lecture](../practice/lec03_regula_falsi.html){ .md-button .md-button--primary }
[Watch on YouTube](https://www.youtube.com/watch?v=mJpxcbBGdI4){ .md-button }
</div>

<div class="nm-key" markdown>
#### Key results
- Chord point \(c = \dfrac{a\,f(b) - b\,f(a)}{f(b) - f(a)}\); keep the part of \([a,b]\) with the sign change.
- It always keeps a bracket, but for convex or concave \(f\) one endpoint gets stuck: **linear** convergence.
- The Illinois modification halves the value of a stuck endpoint and makes it **superlinear**.
</div>

## The idea

Bisection keeps a bracket but ignores the values of \(f\); the secant method uses the values but keeps no bracket. **Regula Falsi** (the method of false position) does both: start from a bracket \([a,b]\) with \(f(a)\,f(b) < 0\), draw the chord joining \((a, f(a))\) and \((b, f(b))\), and cut where the chord crosses the axis:

\[
c = b - \frac{f(b)\,(b-a)}{f(b)-f(a)} = \frac{a\,f(b) - b\,f(a)}{f(b) - f(a)} .
\]

This is the secant formula applied to the two endpoints. Then, as in bisection, keep \([a, c]\) if \(f(a)\,f(c) < 0\) and \([c, b]\) otherwise, so the root stays trapped.

## Worked example

\(f(x) = x^3 + 2x^2 - x - 1\) on \([0, 1]\), the same example as the secant method. The iterates are numbered \(x_2, x_3, \ldots\) to compare with the secant method.

| \(n\) | \(a\) | \(b\) | \(x_n\) | \(f(x_n)\) | secant \(x_n\) |
|---:|---:|---:|---:|---:|---:|
| \(2\) | \(0.0000\) | \(1\) | \(0.500000\) | \(-0.8750\) | \(0.500000\) |
| \(3\) | \(0.5000\) | \(1\) | \(0.733333\) | \(-0.2634\) | \(0.733333\) |
| \(4\) | \(0.7333\) | \(1\) | \(0.788931\) | \(-0.0531\) | \(0.833828\) |
| \(5\) | \(0.7889\) | \(1\) | \(0.799567\) | \(-0.0098\) | \(0.799535\) |
| \(6\) | \(0.7996\) | \(1\) | \(0.801509\) | \(-0.0018\) | \(0.801858\) |
| \(7\) | \(0.8015\) | \(1\) | \(0.801860\) | \(-0.0003\) | \(0.801938\) |

## The stuck endpoint

Every new point lands to the **left** of the root, so \(a\) is replaced each time and \(b = 1\) never moves: all the chords pivot around \((1, 1)\). The reason is the shape of the curve: \(f''(x) = 6x + 4 > 0\), so \(f\) is **convex** on \([0,1]\). The chord of a convex curve lies above the graph, so it crosses the axis too early. (For a concave curve the same happens on the other side.)

With one endpoint frozen, the errors shrink by a constant factor:

\[
\frac{e_{n+1}}{e_n} \;\to\; 1 - \frac{f'(r)\,(b - r)}{f(b)} \approx 0.18 ,
\]

which is **linear** convergence. By \(x_7\) Regula Falsi has error \(7.7\times10^{-5}\), while the secant method already has \(2.0\times10^{-7}\).

!!! warning "The bracket does not shrink to zero"
    The width \(b - a\) tends to \(b - r \approx 0.198\), not to \(0\). So Regula Falsi cannot stop when the bracket is small; it stops when the residual \(|f(c)|\) is small.

Stagnation can be dramatic. For \(f(x) = x^{10} - 1\) on \([0, 1.3]\), six correct digits take **20** bisection steps but **61** Regula Falsi steps.

## The Illinois fix

Whenever the same endpoint is kept twice in a row, halve its stored function value in the chord formula. This tilts the chord, pulls the next point across the root, and makes the stuck endpoint move. On our example the error of \(x_8\) drops from \(1.4\times10^{-5}\) to \(1.9\times10^{-9}\); on \(x^{10} - 1\) the step count drops from \(61\) to \(13\). The Illinois method keeps the bracket and converges superlinearly (order \(\sqrt[3]{3} \approx 1.44\)).

## Algorithm

```text
input  f, a, b  with  f(a)·f(b) < 0, tol, maxit
fa ← f(a),  fb ← f(b)
for k = 1 to maxit
    c ← (a·fb − b·fa) / (fb − fa)
    fc ← f(c)
    if  |fc| ≤ tol :  return c
    if  fa·fc < 0
        b ← c,  fb ← fc          # Illinois: if a was kept twice, fa ← fa/2
    else
        a ← c,  fa ← fc          # Illinois: if b was kept twice, fb ← fb/2
end
```

## Comparison

| | Guaranteed? | Order | Weak spot |
|---|---|---|---|
| Bisection | yes | \(1\) (rate \(\frac12\)) | slow |
| Regula Falsi | yes | \(1\) (often) | stuck endpoint |
| Secant | no | \(1.618\) | can wander off |
| Illinois | yes | \(\approx 1.44\) | — |

<div class="nm-actions" markdown>
[Practise this lecture](../practice/lec03_regula_falsi.html){ .md-button .md-button--primary }
[← Previous: The Secant Method](lec02-secant.md){ .md-button }
[Next: Newton–Raphson →](lec04-newton.md){ .md-button }
</div>
