---
title: Cholesky Factorisation
---

<p class="nm-eyebrow">Lecture 14</p>

# Cholesky Factorisation

<iframe class="nm-video" src="https://www.youtube-nocookie.com/embed/ePneb0UVD-M" title="Lecture 14: Cholesky Factorisation" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<div class="nm-actions" markdown>
[Practise this lecture](../practice/lec14_cholesky.html){ .md-button .md-button--primary }
[Watch on YouTube](https://www.youtube.com/watch?v=ePneb0UVD-M){ .md-button }
</div>

<div class="nm-key" markdown>
#### Key results
- A symmetric matrix is **positive definite** if \(\mathbf x^TA\mathbf x>0\) for all \(\mathbf x\neq\mathbf 0\); equivalently all eigenvalues, or all leading principal minors (Sylvester), are positive.
- Every symmetric positive definite \(A\) has a **unique** factorisation \(A=LL^T\) with \(L\) lower triangular and \(l_{kk}>0\).
- \(l_{kk}=\sqrt{a_{kk}-\sum_{j<k}l_{kj}^2}\), \(l_{ik}=\big(a_{ik}-\sum_{j<k}l_{ij}l_{kj}\big)/l_{kk}\), column by column.
- About \(\frac13n^3\) operations and \(n\) square roots, half of \(LU\); no pivoting is needed.
</div>

## Positive definite matrices

For a symmetric \(2\times2\) matrix, the level curves of \(q(\mathbf x)=\mathbf x^TA\mathbf x\) show the difference: for \(A=\begin{bmatrix}2&1\\1&2\end{bmatrix}\) they are ellipses (a bowl), for \(B=\begin{bmatrix}1&2\\2&1\end{bmatrix}\) they are hyperbolas (a saddle) — \(B\) is symmetric but not positive definite (eigenvalues \(3\) and \(-1\)). For

\[
A=\begin{bmatrix}4&2&2\\2&5&1\\2&1&6\end{bmatrix}
\]

the leading minors are \(D_1=4,\ D_2=16,\ D_3=80\), all positive. Stiffness matrices, covariance matrices and the normal equations of least squares are symmetric positive definite.

## From LU to LLᵀ

Symmetry turns \(A=LU\) (unit \(L\)) into \(A=LDL^T\), with the pivots in \(D\); positive definiteness makes them positive, so \(A=(LD^{1/2})(D^{1/2}L^T)\). For the matrix above,

\[
\begin{bmatrix}1&0&0\\ \frac12&1&0\\ \frac12&0&1\end{bmatrix}
\begin{bmatrix}2&&\\&2&\\&&\sqrt5\end{bmatrix}
=\begin{bmatrix}2&0&0\\1&2&0\\1&0&\sqrt5\end{bmatrix}=L .
\]

**Uniqueness:** from \(LL^T=MM^T\), \(L^{-1}M=L^T(M^T)^{-1}\) is both lower and upper triangular, hence a diagonal \(D\) with \(D^2=I\); positive diagonals give \(D=I\).

## Computing L

Comparing \(LL^T\) with \(A\) column by column: \(l_{11}=\sqrt4=2\), \(l_{21}=l_{31}=\frac22=1\), \(l_{22}=\sqrt{5-1^2}=2\), \(l_{32}=\frac{1-1\cdot1}{2}=0\), \(l_{33}=\sqrt{6-1-0}=\sqrt5\).

- **Solving** \(A\mathbf x=\mathbf b\) with \(\mathbf b=(8,8,9)\): \(L\mathbf y=\mathbf b\) gives \(\mathbf y=(4,2,\sqrt5)\), then \(L^T\mathbf x=\mathbf y\) gives \(\mathbf x=(1,1,1)\).
- **Inverting:** for \(A=\begin{bmatrix}2&-1&2\\-1&1&-1\\2&-1&3\end{bmatrix}\), \(L=\begin{bmatrix}\sqrt2&0&0\\-\frac1{\sqrt2}&\frac1{\sqrt2}&0\\ \sqrt2&0&1\end{bmatrix}\), \(L^{-1}=\begin{bmatrix}\frac1{\sqrt2}&0&0\\ \frac1{\sqrt2}&\sqrt2&0\\-1&0&1\end{bmatrix}\) and \(A^{-1}=(L^{-1})^TL^{-1}=\begin{bmatrix}2&1&-1\\1&2&0\\-1&0&1\end{bmatrix}\).
- **Failure:** for \(\begin{bmatrix}1&2\\2&1\end{bmatrix}\), \(l_{22}^2=1-2^2=-3\): no real square root, so the matrix is not positive definite. Attempting Cholesky is the cheapest test of positive definiteness.

## Cost and stability

Since \(a_{kk}=\sum_j l_{kj}^2\), every \(|l_{kj}|\le\sqrt{a_{kk}}\): the entries cannot grow, so no pivoting is needed (in the example the rows of \(L\) give \(4=2^2\), \(5=1^2+2^2\), \(6=1^2+0^2+(\sqrt5)^2\)). The variant \(A=LDL^T\) avoids square roots.

| | \(LU\) (with pivoting) | Cholesky |
|---|---|---|
| matrices | any nonsingular | symmetric positive definite |
| cost | \(\frac23n^3\) | \(\frac13n^3\) |
| pivoting | needed | never |
| storage | \(L\) and \(U\) | \(L\) only |

<div class="nm-actions" markdown>
[Practise this lecture](../practice/lec14_cholesky.html){ .md-button .md-button--primary }
[← Previous: LU Factorisation](lec13-lu.md){ .md-button }
[Next: Simple Structure →](lec15-special-systems.md){ .md-button }
</div>
