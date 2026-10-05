---
title: Successive Over-Relaxation (SOR)
---

<p class="nm-eyebrow">Lecture 20</p>

# Successive Over-Relaxation (SOR)

<iframe class="nm-video" src="https://www.youtube-nocookie.com/embed/69iKRvNSOBw" title="Lecture 20: Successive Over-Relaxation (SOR)" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<div class="nm-actions" markdown>
[Practise this lecture](../practice/lec20_sor.html){ .md-button .md-button--primary }
[Watch on YouTube](https://www.youtube.com/watch?v=69iKRvNSOBw){ .md-button }
</div>

<div class="nm-key" markdown>
#### Key results
- **SOR:** \(x_i^{(k+1)}=(1-\omega)\,x_i^{(k)}+\omega\,x_i^{GS}\), where \(x_i^{GS}\) is the Gauss–Seidel value; \(\omega=1\) is Gauss–Seidel.
- Iteration matrix \(H(\omega)=(D+\omega L)^{-1}\big[(1-\omega)D-\omega U\big]\).
- **Kahan:** \(\rho(H(\omega))\ge|\omega-1|\), so only \(0<\omega<2\) can converge. **Ostrowski–Reich:** for symmetric positive definite \(A\), every \(0<\omega<2\) works.
- **Young** (consistently ordered \(A\), e.g. tridiagonal): \(\omega_{\text{opt}}=\dfrac{2}{1+\sqrt{1-\mu^2}}\) with \(\mu=\rho(H_J)\), and \(\rho\big(H(\omega_{\text{opt}})\big)=\omega_{\text{opt}}-1\).
</div>

## Why Kahan's bound holds

Since \(D+\omega L\) and \((1-\omega)D-\omega U\) are triangular,

\[
\det H(\omega)=\frac{\det\big((1-\omega)D-\omega U\big)}{\det(D+\omega L)}=\frac{(1-\omega)^n\det D}{\det D}=(1-\omega)^n=\lambda_1\lambda_2\cdots\lambda_n,
\]

so the largest \(|\lambda_i|\) is at least \(|1-\omega|\).

## An example

\[
\begin{aligned}3x+2y&=4.5\\2x+3y-z&=5\\-y+2z&=-0.5\end{aligned}\qquad \mathbf x=(0.5,\ 1.5,\ 0.5).
\]

The Jacobi eigenvalues are \(0,\ \pm\sqrt{11/18}\), so \(\mu\approx0.7817\), \(\omega_{\text{opt}}\approx1.2318\) and \(\rho\approx0.2318\). One SOR sweep from \(\mathbf 0\) with this \(\omega\) gives \(\mathbf x^{(1)}\approx(1.8477,\ 0.5356,\ 0.0220)\).

| method | \(\rho\) | rate \(-\log_{10}\rho\) | sweeps to \(10^{-6}\) |
|---|---:|---:|---:|
| Jacobi | 0.7817 | 0.107 | 58 |
| Gauss–Seidel | 0.6111 | 0.214 | 29 |
| SOR, \(\omega_{\text{opt}}\) | 0.2318 | 0.635 | 13 |

The curve \(\rho(H(\omega))\) is steep to the left of \(\omega_{\text{opt}}\) and a straight line of slope \(1\) to the right, so it is better to overestimate \(\omega_{\text{opt}}\) than to underestimate it. In practice \(\rho(H_J)\) is estimated from how fast the changes shrink, or a few values of \(\omega\) are tried on a smaller problem; \(\omega<1\) (under-relaxation) can damp oscillations.

## A large problem

For the tridiagonal model matrix \(\operatorname{tridiag}(-1,2,-1)\) with \(n=50\): \(\rho(H_J)=\cos\frac{\pi}{51}\approx0.9981\), \(\omega_{\text{opt}}\approx1.884\), and the sweeps to reach \(10^{-6}\) are

| Jacobi | Gauss–Seidel | SOR |
|---:|---:|---:|
| 7278 | 3639 | 113 |

<div class="nm-actions" markdown>
[Practise this lecture](../practice/lec20_sor.html){ .md-button .md-button--primary }
[← Previous: Convergence of Iterative Methods](lec19-iterative-convergence.md){ .md-button }
</div>
