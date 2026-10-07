---
title: The Power Method
---

<p class="nm-eyebrow">Lecture 21</p>

# The Power Method

<iframe class="nm-video" src="https://www.youtube-nocookie.com/embed/k9TRN17eKFk" title="Lecture 21: The Power Method" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<div class="nm-actions" markdown>
[Practise this lecture](../practice/lec21_power_method.html){ .md-button .md-button--primary }
[Watch on YouTube](https://www.youtube.com/watch?v=k9TRN17eKFk){ .md-button }
</div>

<div class="nm-key" markdown>
#### Key results
- **Power method:** \(\mathbf y^{(k)}=A\mathbf v^{(k-1)}\), \(\lambda^{(k)}=y^{(k)}_p\) (the entry of largest size, **with its sign**), \(\mathbf v^{(k)}=\mathbf y^{(k)}/\lambda^{(k)}\).
- It needs a unique eigenvalue of largest modulus, \(|\lambda_1|>|\lambda_2|\ge\dots\), and a start with a component \(c_1\neq0\) along its eigenvector \(\mathbf x_1\).
- The error shrinks like \(|\lambda_2/\lambda_1|^k\): linear convergence, slow when \(|\lambda_2|\) is close to \(|\lambda_1|\).
- For symmetric \(A\) the Rayleigh quotient \(r(\mathbf v)=\dfrac{\mathbf v^TA\mathbf v}{\mathbf v^T\mathbf v}\) squares the error.
</div>

## Why it works

Write the start in eigenvectors, \(\mathbf v^{(0)}=c_1\mathbf x_1+c_2\mathbf x_2+\dots+c_n\mathbf x_n\). Then

\[
A^k\mathbf v^{(0)}=\lambda_1^k\Big(c_1\mathbf x_1+\Big(\frac{\lambda_2}{\lambda_1}\Big)^kc_2\mathbf x_2+\dots+\Big(\frac{\lambda_n}{\lambda_1}\Big)^kc_n\mathbf x_n\Big),
\]

and every ratio \(|\lambda_i/\lambda_1|<1\), so only the \(\mathbf x_1\) part survives. For \(A=\begin{bmatrix}7&2\\1&4\end{bmatrix}\) and \(\mathbf v^{(0)}=(1,1)\), the direction of \(A^k\mathbf v^{(0)}\) turns from \(45^\circ\) to \(29.05^\circ,\ 21.67^\circ,\ 18.37^\circ,\ 16.90^\circ,\ 16.24^\circ\), towards the eigenvector at \(15.68^\circ\). The entries grow like \(\lambda_1^k\) (\(9,\ 73,\ 569,\ 4361,\ 33177\)), which is why each step is rescaled.

## The example from the notes

| \(k\) | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---:|---:|---:|---:|---:|---:|---:|
| \(\lambda^{(k)}\) | 9.0000 | 8.1111 | 7.7945 | 7.6643 | 7.6077 | 7.5824 | 7.5710 |
| \(v^{(k)}_2\) | 0.5556 | 0.3973 | 0.3322 | 0.3038 | 0.2912 | 0.2855 | 0.2829 |
| error ratio | | 0.382 | 0.424 | 0.441 | 0.449 | 0.452 | 0.453 |

The characteristic polynomial \(\lambda^2-11\lambda+26\) gives \(\lambda_1=\frac{11+\sqrt{17}}{2}\approx7.5616\), \(\lambda_2\approx3.4384\) and \(\mathbf x_1=(1,\ 0.2808)\). The error ratios approach \(|\lambda_2/\lambda_1|\approx0.455\); \(13\) iterations give an error below \(10^{-4}\).

## Slow convergence and the Rayleigh quotient

For \(A=\begin{bmatrix}3&1&0\\1&2&1\\0&1&4\end{bmatrix}\) the eigenvalues are \(4.5321\), \(3.3473\) and \(1.1206\), so the ratio is about \(0.74\): the estimates \(5,\ 4.8,\ 4.7083,\ 4.6549,\dots\) need about \(30\) iterations for four decimals. Since \(A\) is symmetric, the Rayleigh quotient does better: \(r(\mathbf v^{(3)})=4.4970\) against \(\lambda^{(3)}=4.7083\), and four decimals after \(14\) iterations.

## Sign, failures and cost

- **Keep the sign:** for \(A=\operatorname{diag}(-2,1)\), \(A(1,1)^T=(-2,1)^T\) gives \(\lambda^{(1)}=-2=\lambda_1\); scaling by \(\lVert\cdot\rVert_\infty\) would give \(+2\) and flip the vectors at every step.
- **Equal sizes:** for \(\begin{bmatrix}0&1\\1&0\end{bmatrix}\) (eigenvalues \(\pm1\)) the vector alternates between \((0.5,1)\) and \((1,0.5)\) for ever.
- **A bad start:** with \(c_1=0\) exact arithmetic never finds \(\lambda_1\); with \(c_1=10^{-10}\), \(\operatorname{diag}(2,1)\) needs \(35\) steps.
- **Cost:** one matrix–vector product per step, about \(n^2\) operations for a full matrix and far fewer for a sparse one.

<div class="nm-actions" markdown>
[Practise this lecture](../practice/lec21_power_method.html){ .md-button .md-button--primary }
[← Previous: SOR](lec20-sor.md){ .md-button }
[Next: The Inverse Power Method →](lec22-inverse-power.md){ .md-button }
</div>
