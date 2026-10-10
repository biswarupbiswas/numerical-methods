---
title: "Least Squares: Polynomial Fit"
---

<p class="nm-eyebrow">Lecture 25</p>

# Least Squares: Polynomial Fit

<iframe class="nm-video" src="https://www.youtube-nocookie.com/embed/vgrpEhggNaw" title="Lecture 25: Least Squares: Polynomial Fit" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<div class="nm-actions" markdown>
[Practise this lecture](../practice/lec25_least_squares_poly.html){ .md-button .md-button--primary }
[Watch on YouTube](https://www.youtube.com/watch?v=vgrpEhggNaw){ .md-button }
</div>

<div class="nm-key" markdown>
#### Key results
- For \(P_n(x)=a_0+a_1x+\dots+a_nx^n\), minimising \(E=\sum_{i=0}^{m}\big(y_i-P_n(x_i)\big)^2\) gives \(n+1\) **normal equations** with power sums, \(A^TA\,\mathbf a=A^T\mathbf b\), where row \(i\) of \(A\) is \((1,x_i,x_i^2,\dots,x_i^n)\).
- The fit is unique when the data contain at least \(n+1\) distinct nodes: then \(A^TA\) is symmetric positive definite (Cholesky).
- Higher degree always lowers \(E\) but can overfit; \(\kappa(A^TA)=\kappa(A)^2\) grows fast with \(n\).
- \(y=ax^b\) and \(y=ae^{bx}\) become straight lines after taking logarithms; this minimises the error of \(\ln y\), not of \(y\).
</div>

## The normal equations

Setting \(\partial E/\partial a_k=-2\sum_i\big(y_i-P_n(x_i)\big)x_i^{\,k}=0\) for \(k=0,\dots,n\) gives

\[
\sum_{j=0}^{n}a_j\sum_{i=0}^{m}x_i^{\,j+k}=\sum_{i=0}^{m}x_i^{\,k}y_i,\qquad k=0,1,\dots,n,
\]

that is \(A^TA\,\mathbf a=A^T\mathbf b\) with \(E=\lVert A\mathbf a-\mathbf b\rVert_2^2\). For \(n=1\) these are the two equations of the previous lecture.

## A worked example

For \((-2,3.1),\ (-1,1.3),\ (0,1.6),\ (1,1.5),\ (2,5.5)\) and a quadratic: \(\sum x_i=0\), \(\sum x_i^2=10\), \(\sum x_i^3=0\), \(\sum x_i^4=34\), \(\sum y_i=13\), \(\sum x_iy_i=5\), \(\sum x_i^2y_i=37.2\), so

\[
5a_0+10a_2=13,\qquad 10a_1=5,\qquad 10a_0+34a_2=37.2 .
\]

The symmetric nodes make the odd sums vanish and the system splits: \(a_1=0.5\), \(a_2=0.8\), \(a_0=1\). The least squares quadratic is \(P_2(x)=1+0.5x+0.8x^2\), with residuals \(-0.1,\ 0,\ 0.6,\ -0.8,\ 0.3\) and \(E=1.1\); the best straight line has \(E=10.06\).

| degree \(n\) | 0 | 1 | 2 | 3 | 4 |
|---|---:|---:|---:|---:|---:|
| \(E\) | 12.56 | 10.06 | 1.10 | 0.70 | 0 |

Degree \(4\) passes through all five points but swings wildly: at \(x=3\) it gives \(25.1\) against \(9.7\) for the quadratic. With sixty noisy points around a parabola, degree \(9\) lowers \(E\) only from \(29.4\) to \(28.2\) while chasing the noise; choose the simplest model that captures the trend.

## Conditioning

For \(11\) equally spaced points on \([0,1]\), \(\kappa(A^TA)\approx3.8\times10^2\) for \(n=2\), \(9.8\times10^6\) for \(n=5\) and \(1.4\times10^{16}\) for \(n=10\). For high degree use orthogonal polynomials or a QR factorisation.

## Nonlinear models: the notes' example

To fit \(y=ax^b\) to \((1,0.5),\ (2,2),\ (5,3),\ (7,4),\ (10,5)\), take \(u=\ln x\), \(v=\ln y\) and fit \(v=c_1+c_2u\): \(\sum u_i=6.5511\), \(\sum v_i=4.0943\), \(\sum u_i^2=12.1592\), \(\sum u_iv_i=8.6521\) give \(c_1=-0.3857\), \(c_2=0.9194\), so \(a=e^{c_1}\approx0.68\), \(b\approx0.9194\). Its error in \(y\) is \(\sum(y_i-ax_i^b)^2=0.97\); the true nonlinear least squares fit \(a\approx0.96\), \(b\approx0.72\) has \(0.40\).

<div class="nm-actions" markdown>
[Practise this lecture](../practice/lec25_least_squares_poly.html){ .md-button .md-button--primary }
[← Previous: Least Squares, Fitting a Line](lec24-least-squares-line.md){ .md-button }
</div>
