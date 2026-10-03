---
title: LU Factorisation
---

<p class="nm-eyebrow">Lecture 13</p>

# LU Factorisation

<iframe class="nm-video" src="https://www.youtube-nocookie.com/embed/qgsLgUwKv4I" title="Lecture 13: LU Factorisation" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<div class="nm-actions" markdown>
[Practise this lecture](../practice/lec13_lu.html){ .md-button .md-button--primary }
[Watch on YouTube](https://www.youtube.com/watch?v=qgsLgUwKv4I){ .md-button }
</div>

<div class="nm-key" markdown>
#### Key results
- \(A=LU\) turns \(A\mathbf x=\mathbf b\) into two triangular solves: \(L\mathbf z=\mathbf b\) (forward substitution) and \(U\mathbf x=\mathbf z\) (back substitution).
- Gaussian elimination gives \(U\); the multipliers \(m_{ik}\) are the entries of \(L\) below its unit diagonal.
- **Doolittle:** unit \(L\). **Crout:** unit \(U\). Both exist if the leading principal minors \(D_1,\dots,D_{n-1}\) are non-zero, and are unique for nonsingular \(A\).
- With partial pivoting \(PA=LU\) exists for every nonsingular \(A\). The factorisation costs about \(\frac23n^3\) once; every further right-hand side about \(2n^2\).
</div>

## Why factorise?

Triangular systems are cheap: \(L\mathbf z=\mathbf b\) is solved from the top down,

\[
z_1=\frac{b_1}{l_{11}},\qquad z_i=\frac{1}{l_{ii}}\Big(b_i-\sum_{j<i}l_{ij}z_j\Big),
\]

and \(U\mathbf x=\mathbf z\) from the bottom up, each in about \(n^2\) operations. So if \(A=LU\), then \(A\mathbf x=\mathbf b\) becomes \(L(U\mathbf x)=\mathbf b\): solve \(L\mathbf z=\mathbf b\), then \(U\mathbf x=\mathbf z\). When many systems share the same \(A\), the expensive part is done only once.

## L and U from elimination

Elimination on the system of Lecture 10 (\(2x_1-x_2+3x_3=9,\ x_1+x_2+x_3=6,\ 3x_1+4x_2-2x_3=5\)) uses the multipliers \(m_{21}=\frac12,\ m_{31}=\frac32,\ m_{32}=\frac{11}{3}\), and these are exactly the entries of \(L\):

\[
\begin{bmatrix}2&-1&3\\1&1&1\\3&4&-2\end{bmatrix}
=\underbrace{\begin{bmatrix}1&0&0\\ \frac12&1&0\\ \frac32&\frac{11}{3}&1\end{bmatrix}}_{L}
\underbrace{\begin{bmatrix}2&-1&3\\0&\frac32&-\frac12\\0&0&-\frac{14}{3}\end{bmatrix}}_{U}.
\]

With \(\mathbf b=(9,6,5)\): forward substitution gives \(\mathbf z=(9,\frac32,-14)\), back substitution gives \(x_3=3,\ x_2=2,\ x_1=1\).

The reason: \(E_{32}E_{31}E_{21}A=U\), so \(A=E_{21}^{-1}E_{31}^{-1}E_{32}^{-1}U\). Each inverse just adds the multiple back, and in the product every multiplier lands in its own place below the diagonal.

## Doolittle's factorisation

\(L\) has ones on its diagonal. Comparing \(A\) with \(LU\) entry by entry, row \(k\) of \(U\) and column \(k\) of \(L\) are found in turn:

\[
u_{kj}=a_{kj}-\sum_{p=1}^{k-1}l_{kp}u_{pj}\quad(j\ge k),\qquad
l_{ik}=\frac{1}{u_{kk}}\Big(a_{ik}-\sum_{p=1}^{k-1}l_{ip}u_{pk}\Big)\quad(i>k).
\]

For the example of the notes,

\[
\begin{bmatrix}4&2&2\\2&5&1\\2&1&6\end{bmatrix}
=\begin{bmatrix}1&0&0\\ \frac12&1&0\\ \frac12&0&1\end{bmatrix}
\begin{bmatrix}4&2&2\\0&4&0\\0&0&5\end{bmatrix},
\]

with \(u_{22}=5-\frac12\cdot2=4\), \(u_{23}=1-\frac12\cdot2=0\), \(l_{32}=0\), \(u_{33}=6-1=5\). The leading minors are \(D_1=4\) and \(D_2=16\), and \(\det A=4\cdot4\cdot5=80\).

- **Existence:** if \(D_1,\dots,D_{n-1}\neq0\), Doolittle's factorisation exists.
- **Uniqueness** (nonsingular \(A\)): from \(L_1U_1=L_2U_2\), \(L_2^{-1}L_1=U_2U_1^{-1}\) is both unit lower and upper triangular, hence \(I\).
- Without a fixed diagonal, \(LU=(LD)(D^{-1}U)\); and the singular matrix \(\begin{bmatrix}0&0\\0&1\end{bmatrix}=\begin{bmatrix}1&0\\t&1\end{bmatrix}\begin{bmatrix}0&0\\0&1\end{bmatrix}\) has one for every \(t\).

## Crout's factorisation

Now \(U\) has ones on its diagonal and \(L\) carries the pivots; a column of \(L\) is computed first, then a row of \(U\). The system \(3x_1+3x_2+9x_3=3,\ 3x_1+3x_2+5x_3=7,\ 2x_1-x_2+x_3=3\) has \(D_2=0\), so rows 1 and 3 are swapped first:

\[
\begin{bmatrix}2&-1&1\\3&3&5\\3&3&9\end{bmatrix}
=\begin{bmatrix}2&0&0\\3&\frac92&0\\3&\frac92&4\end{bmatrix}
\begin{bmatrix}1&-\frac12&\frac12\\0&1&\frac79\\0&0&1\end{bmatrix}.
\]

With \(\mathbf b=(3,7,3)\): \(\mathbf z=(\frac32,\frac59,-1)\) and \(x_3=-1,\ x_2=\frac43,\ x_1=\frac83\).

## PA = LU

\(\begin{bmatrix}0&1\\1&1\end{bmatrix}\) is nonsingular but has no \(LU\) factorisation (\(u_{11}=0\) would need \(l_{21}\cdot0=1\)). With partial pivoting one always gets \(PA=LU\); for the system of Lecture 10,

\[
\underbrace{\begin{bmatrix}0&0&1\\1&0&0\\0&1&0\end{bmatrix}}_{P}A=\underbrace{\begin{bmatrix}1&0&0\\ \frac23&1&0\\ \frac13&\frac1{11}&1\end{bmatrix}}_{L}\underbrace{\begin{bmatrix}3&4&-2\\0&-\frac{11}{3}&\frac{13}{3}\\0&0&\frac{14}{11}\end{bmatrix}}_{U},
\]

and \(L\mathbf z=P\mathbf b=(5,9,6)\) gives \(\mathbf z=(5,\frac{17}{3},\frac{42}{11})\), then \(U\mathbf x=\mathbf z\) gives \(\mathbf x=(1,2,3)\).

## Cost and practice

| task | operations |
|---|---|
| factorise \(A=LU\) (once) | \(\approx\frac23n^3\) |
| each right-hand side (forward + back) | \(\approx2n^2\) |
| compute \(A^{-1}\) | \(\approx2n^3\) |

For \(n=1000\) and \(100\) right-hand sides, repeated elimination needs about \(6.7\times10^{10}\) operations, \(LU\) about \(8.7\times10^{8}\). In memory, the multipliers overwrite the zeros of \(A\), so \(L\) and \(U\) share one array. As a bonus, \(\det A=u_{11}u_{22}\cdots u_{nn}\) (Doolittle).

| factorisation | unit diagonal | exists when |
|---|---|---|
| Doolittle | \(L\) | \(D_1,\dots,D_{n-1}\neq0\) |
| Crout | \(U\) | \(D_1,\dots,D_{n-1}\neq0\) |
| \(PA=LU\) | \(L\) | \(A\) nonsingular |

<div class="nm-actions" markdown>
[Practise this lecture](../practice/lec13_lu.html){ .md-button .md-button--primary }
[← Previous: Pivoting](lec12-pivoting.md){ .md-button }
[Next: Cholesky Factorisation →](lec14-cholesky.md){ .md-button }
</div>
