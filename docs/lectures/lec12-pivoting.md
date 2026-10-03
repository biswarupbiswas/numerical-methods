---
title: Partial and Complete Pivoting
---

<p class="nm-eyebrow">Lecture 12</p>

# Partial and Complete Pivoting

<iframe class="nm-video" src="https://www.youtube-nocookie.com/embed/LyZHx8Uyywk" title="Lecture 12: Partial and Complete Pivoting" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<div class="nm-actions" markdown>
[Practise this lecture](../practice/lec12_pivoting.html){ .md-button .md-button--primary }
[Watch on YouTube](https://www.youtube.com/watch?v=LyZHx8Uyywk){ .md-button }
</div>

<div class="nm-key" markdown>
#### Key results
- Small pivots give huge multipliers and wrong answers.
- **Partial pivoting:** before eliminating column \(k\), swap the row with the largest \(|a_{ik}|\), \(i\ge k\), into the pivot position. Then every \(|m_{ik}|\le1\).
- The search costs about \(\frac{n^2}{2}\) comparisons; the row swaps give \(PA=LU\).
- **Scaled partial pivoting** chooses by \(|a_{ik}|/s_i\) with \(s_i=\max_j|a_{ij}|\). **Complete pivoting** swaps rows and columns, at about \(\frac{n^3}{3}\) comparisons.
</div>

## A small pivot

\[
\begin{aligned} 0.003000\,x_1+59.14\,x_2&=59.17\\ 5.291\,x_1-6.130\,x_2&=46.78 \end{aligned}\qquad (x_1=10,\ x_2=1)
\]

| 4-digit arithmetic | multiplier | \(x_2\) | \(x_1\) |
|---|---:|---:|---:|
| no pivoting | \(1764\) | \(1.001\) | \(-10.00\) |
| partial pivoting (rows swapped) | \(0.000567\) | \(1.000\) | \(10.00\) |

Without pivoting, back substitution computes \(x_1=(59.17-59.14\,x_2)/0.003000\): the error of \(0.001\) in \(x_2\) is multiplied by \(59.14/0.003\approx20\,000\).

## Partial pivoting

At step \(k\) choose \(p\) with \(|a_{pk}|=\max_{i\ge k}|a_{ik}|\) and swap rows \(p\) and \(k\) (in \(A\) and \(\mathbf b\)), then eliminate as usual. For the system of Lecture 10 the swaps are \(R_1\leftrightarrow R_3\) and then \(R_2\leftrightarrow R_3\), leading to

\[
\underbrace{\begin{bmatrix}0&0&1\\1&0&0\\0&1&0\end{bmatrix}}_{P}A=\underbrace{\begin{bmatrix}1&0&0\\ \frac23&1&0\\ \frac13&\frac1{11}&1\end{bmatrix}}_{L}\underbrace{\begin{bmatrix}3&4&-2\\0&-\frac{11}{3}&\frac{13}{3}\\0&0&\frac{14}{11}\end{bmatrix}}_{U},
\]

and \(x=1,\ y=2,\ z=3\).

## Scaled and complete pivoting

- **Badly scaled rows.** Multiplying the first equation by \(10^4\) (\(30.00x_1+591400x_2=591700\)) makes partial pivoting keep row 1, and the 4-digit answer is again \(x_1=-10.00\). Scaled partial pivoting compares \(30.00/591400\approx0.00005\) with \(5.291/6.130\approx0.86\), chooses row 2 and gets \(x_1=10.00\).
- **Complete pivoting** searches the whole remaining submatrix and swaps rows and columns; column swaps reorder the unknowns. For the \(4\times4\) system of the notes the pivots are \(8\), \(\frac72\), \(\frac{15}{14}\), and the solution is \(x=1,\ y=2,\ z=3,\ w=4\).

## Stability

The entries can grow during elimination. For Wilkinson's matrix, partial pivoting gives growth \(2^{n-1}\) (\(\approx10^{17}\) for \(n=60\)), but such matrices are very rare and partial pivoting is stable in practice. Symmetric positive definite and strictly diagonally dominant matrices need no pivoting at all.

| strategy | search cost | safety |
|---|---|---|
| none | \(0\) | can fail |
| partial | \(\frac{n^2}{2}\) | safe in practice |
| scaled partial | \(\approx n^2\) | also for badly scaled rows |
| complete | \(\frac{n^3}{3}\) | safest, expensive |

<div class="nm-actions" markdown>
[Practise this lecture](../practice/lec12_pivoting.html){ .md-button .md-button--primary }
[← Previous: Operation Count](lec11-operation-count.md){ .md-button }
[Next: LU Factorisation →](lec13-lu.md){ .md-button }
</div>
