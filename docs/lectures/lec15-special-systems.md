---
title: Systems with Simple Structure
---

<p class="nm-eyebrow">Lecture 15</p>

# Systems with Simple Structure

<iframe class="nm-video" src="https://www.youtube-nocookie.com/embed/qRzSPQMZxNo" title="Lecture 15: Systems with Simple Structure" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<div class="nm-actions" markdown>
[Practise this lecture](../practice/lec15_special_systems.html){ .md-button .md-button--primary }
[Watch on YouTube](https://www.youtube.com/watch?v=qRzSPQMZxNo){ .md-button }
</div>

<div class="nm-key" markdown>
#### Key results
- **Diagonal:** \(x_i=b_i/d_i\), \(n\) operations.
- **Triangular:** back substitution (upper) or forward substitution (lower), about \(n^2\) operations; \(\det\) is the product of the diagonal, so a zero on the diagonal means a singular matrix.
- **Tridiagonal:** elimination creates no fill-in; the **Thomas algorithm** needs about \(8n\) operations and \(4n\) storage.
- Diagonally dominant tridiagonal matrices need no pivoting; a band with \(p\) diagonals on each side costs about \(np^2\).
</div>

## Diagonal and triangular systems

For a diagonal matrix each equation has one unknown, \(x_i=b_i/d_i\). For an upper triangular \(U\), back substitution goes from the bottom up,

\[
x_n=\frac{b_n}{u_{nn}},\qquad x_i=\frac{1}{u_{ii}}\Big(b_i-\sum_{j>i}u_{ij}x_j\Big),
\]

and for a lower triangular \(L\) forward substitution goes from the top down. The two examples of the lecture:

| system | solution |
|---|---|
| \(2x_1+x_2-x_3=1,\ 3x_2+2x_3=12,\ 4x_3=12\) | \(x_3=3,\ x_2=\frac{12-6}{3}=2,\ x_1=\frac{1-2+3}{2}=1\) |
| \(2x_1=2,\ x_1+3x_2=7,\ -x_1+2x_2+4x_3=15\) | \(x_1=1,\ x_2=\frac{7-1}{3}=2,\ x_3=\frac{15+1-4}{4}=3\) |

Row \(i\) needs about \(i\) multiplications and additions, so a triangular solve costs about \(n^2\) operations (\(10^6\) for \(n=1000\), against \(6.7\times10^8\) for full elimination). Since \(\det U=u_{11}u_{22}\cdots u_{nn}\), a zero on the diagonal means \(U\) is singular.

## Tridiagonal systems: the Thomas algorithm

Tridiagonal matrices arise when each unknown is coupled only to its neighbours (temperature along a rod, masses and springs in a chain, splines). With sub-, main and super-diagonals \(a_i,b_i,c_i\) and right-hand side \(d_i\), elimination needs one multiplier per column and changes only one entry, so no fill-in appears:

\[
m_i=\frac{a_i}{\hat b_{i-1}},\quad \hat b_i=b_i-m_ic_{i-1},\quad \hat d_i=d_i-m_i\hat d_{i-1};\qquad
x_n=\frac{\hat d_n}{\hat b_n},\quad x_i=\frac{\hat d_i-c_ix_{i+1}}{\hat b_i}.
\]

For \(b_i=2\), \(a_i=c_i=-1\) and \(\mathbf d=(0,0,0,5)\):

| \(i\) | \(m_i\) | \(\hat b_i\) | \(\hat d_i\) | \(x_i\) |
|---:|---:|---:|---:|---:|
| 1 | | \(2\) | \(0\) | \(1\) |
| 2 | \(-\frac12\) | \(\frac32\) | \(0\) | \(2\) |
| 3 | \(-\frac23\) | \(\frac43\) | \(0\) | \(3\) |
| 4 | \(-\frac34\) | \(\frac54\) | \(5\) | \(4\) |

The pivots \(\hat b_k=\frac{k+1}{k}\) stay above \(1\): the matrix is diagonally dominant and no pivoting is needed. If a pivot vanishes (e.g. \(b_1=0\)), row swaps are needed and add one extra diagonal of fill-in.

## Cost, storage and an application

| structure | operations | \(n=1000\) |
|---|---|---:|
| diagonal | \(n\) | \(10^3\) |
| tridiagonal | \(\approx8n\) | \(8\times10^3\) |
| triangular | \(\approx n^2\) | \(10^6\) |
| full | \(\approx\frac23n^3\) | \(6.7\times10^8\) |

A tridiagonal system with \(10^6\) unknowns needs about \(8\times10^6\) operations and four vectors of storage; full elimination would need \(6.7\times10^{17}\). Banded matrices with \(p\) diagonals on each side keep their band and cost about \(np^2\).

**Heat in a rod:** \(-u''=1\), \(u(0)=u(1)=0\), discretised with step \(h\), gives \(-u_{i-1}+2u_i-u_{i+1}=h^2\) — exactly the tridiagonal system above. The Thomas algorithm returns grid values that lie on \(u(x)=\frac{x(1-x)}{2}\).

<div class="nm-actions" markdown>
[Practise this lecture](../practice/lec15_special_systems.html){ .md-button .md-button--primary }
[← Previous: Cholesky](lec14-cholesky.md){ .md-button }
[Next: Norms →](lec16-norms.md){ .md-button }
</div>
