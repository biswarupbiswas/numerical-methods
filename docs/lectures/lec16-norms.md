---
title: Vector and Matrix Norms
---

<p class="nm-eyebrow">Lecture 16</p>

# Vector and Matrix Norms

<iframe class="nm-video" src="https://www.youtube-nocookie.com/embed/Bs2GWHUXsD4" title="Lecture 16: Vector and Matrix Norms" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<div class="nm-actions" markdown>
[Practise this lecture](../practice/lec16_norms.html){ .md-button .md-button--primary }
[Watch on YouTube](https://www.youtube.com/watch?v=Bs2GWHUXsD4){ .md-button }
</div>

<div class="nm-key" markdown>
#### Key results
- A **norm** is positive (zero only for zero), homogeneous (\(\lVert c\mathbf x\rVert=|c|\lVert\mathbf x\rVert\)) and satisfies the triangle inequality.
- \(\lVert\mathbf x\rVert_1=\sum|x_i|\), \(\lVert\mathbf x\rVert_2=\sqrt{\sum x_i^2}\), \(\lVert\mathbf x\rVert_\infty=\max|x_i|\); all norms on \(\mathbb R^n\) are equivalent.
- Induced norms measure the biggest stretch \(\max\lVert A\mathbf x\rVert/\lVert\mathbf x\rVert\): \(\lVert A\rVert_1\) = largest column sum, \(\lVert A\rVert_\infty\) = largest row sum, \(\lVert A\rVert_2=\sqrt{\lambda_{\max}(A^TA)}\).
- \(\rho(A)\le\lVert A\rVert\) for induced norms, but \(\rho\) is not a norm; consistency \(\lVert A\mathbf x\rVert\le\lVert A\rVert\,\lVert\mathbf x\rVert\).
</div>

## Vector norms

| \(\mathbf x\) | \(\lVert\mathbf x\rVert_1\) | \(\lVert\mathbf x\rVert_2\) | \(\lVert\mathbf x\rVert_\infty\) |
|---|---:|---:|---:|
| \((1,-1,2,0,3)\) | \(7\) | \(\sqrt{15}\approx3.87\) | \(3\) |
| \((3,4)\) | \(7\) (taxicab) | \(5\) (bird) | \(4\) (chess king) |

The unit circles \(\{\lVert\mathbf x\rVert=1\}\) are a diamond (\(p=1\)), a circle (\(p=2\)) and a square (\(p=\infty\)); the \(p\)-norm \(\lVert\mathbf x\rVert_p=\big(\sum|x_i|^p\big)^{1/p}\) morphs between them. Since \(\lVert\mathbf x\rVert_\infty\le\lVert\mathbf x\rVert_2\le\sqrt n\,\lVert\mathbf x\rVert_\infty\), an error that is small in one norm is small in all.

**Errors.** For \(\mathbf x=(1,2,3)\) and \(\hat{\mathbf x}=(1.01,1.98,3.02)\), the error \(\mathbf e=(0.01,-0.02,0.02)\) has \(\lVert\mathbf e\rVert_1=0.05\), \(\lVert\mathbf e\rVert_2=0.03\), \(\lVert\mathbf e\rVert_\infty=0.02\), and the relative error \(\lVert\mathbf e\rVert_\infty/\lVert\mathbf x\rVert_\infty=0.02/3\approx0.0067\).

## Matrix norms

Besides the three axioms we ask for **submultiplicativity** \(\lVert AB\rVert\le\lVert A\rVert\lVert B\rVert\) and **consistency** \(\lVert A\mathbf x\rVert\le\lVert A\rVert\lVert\mathbf x\rVert\).

- **Frobenius:** \(\lVert A\rVert_F=\sqrt{\sum_{i,j}a_{ij}^2}\); for \(\begin{bmatrix}1&2\\3&4\end{bmatrix}\), \(\sqrt{30}\approx5.48\).
- **Induced:** \(\lVert A\rVert=\max_{\mathbf x\ne\mathbf0}\lVert A\mathbf x\rVert/\lVert\mathbf x\rVert\). \(A\) maps the unit circle to an ellipse, and \(\lVert A\rVert_2\) is its longest semi-axis.
- In the 1-norm the corners of the diamond are the unit vectors, and \(A\mathbf e_j\) is column \(j\): \(\lVert A\rVert_1=\max_j\sum_i|a_{ij}|\). In the \(\infty\)-norm the corners are \((\pm1,\dots,\pm1)\): \(\lVert A\rVert_\infty=\max_i\sum_j|a_{ij}|\).

For the matrix of the notes,

\[
A=\begin{bmatrix}3&8&9&7\\6&2&4&5\\9&7&6&3\\8&1&5&2\end{bmatrix}:\quad
\text{column sums } 26,18,24,17,\ \ \text{row sums } 27,17,25,16,
\]

so \(\lVert A\rVert_1=26\), \(\lVert A\rVert_\infty=27\) and \(\lVert A\rVert_F=\sqrt{553}\approx23.52\).

**Spectral norm.** \(\lVert A\rVert_2=\sqrt{\lambda_{\max}(A^TA)}\). For \(A=\begin{bmatrix}1&2\\3&4\end{bmatrix}\), \(A^TA=\begin{bmatrix}10&14\\14&20\end{bmatrix}\), \(\lambda_{\max}=15+\sqrt{221}\approx29.87\) and \(\lVert A\rVert_2\approx5.465\). The eigenvalues of \(A\) itself are \(\approx-0.37\) and \(5.37\), so \(\rho(A)\approx5.37\le\lVert A\rVert_2\). The spectral radius is not a norm: \(\rho\begin{bmatrix}0&1\\0&0\end{bmatrix}=0\).

| norm | compute | typical use |
|---|---|---|
| \(\lVert\cdot\rVert_1,\ \lVert\cdot\rVert_\infty\) | sums of absolute values | error estimates |
| \(\lVert\cdot\rVert_2\) | eigenvalues of \(A^TA\) | geometry |
| \(\lVert\cdot\rVert_F\) | sum of squares | proofs, quick bounds |

Note that \(\lVert I\rVert_F=\sqrt n\) while every induced norm gives \(\lVert I\rVert=1\): the Frobenius norm is not induced.

<div class="nm-actions" markdown>
[Practise this lecture](../practice/lec16_norms.html){ .md-button .md-button--primary }
[← Previous: Simple Structure](lec15-special-systems.md){ .md-button }
[Next: Condition Number →](lec17-conditioning.md){ .md-button }
</div>
