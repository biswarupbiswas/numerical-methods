---
title: "Least Squares: Fitting a Line"
---

<p class="nm-eyebrow">Lecture 24</p>

# Least Squares: Fitting a Line

<iframe class="nm-video" src="https://www.youtube-nocookie.com/embed/jsT3JQpnmfU" title="Lecture 24: Least Squares: Fitting a Line" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<div class="nm-actions" markdown>
[Practise this lecture](../practice/lec24_least_squares_line.html){ .md-button .md-button--primary }
[Watch on YouTube](https://www.youtube.com/watch?v=jsT3JQpnmfU){ .md-button }
</div>

<div class="nm-key" markdown>
#### Key results
- For data \((x_i,y_i),\ i=0,\dots,m\), least squares chooses \(a_0,a_1\) to minimise \(E(a_0,a_1)=\sum_{i=0}^{m}\big(y_i-(a_0+a_1x_i)\big)^2\), the sum of squared residuals.
- **Normal equations:** \((m+1)a_0+a_1\sum x_i=\sum y_i,\qquad a_0\sum x_i+a_1\sum x_i^2=\sum x_iy_i\).
- The residuals sum to zero, so the line passes through \((\bar x,\bar y)\); the slope is \(a_1=\dfrac{\sum(x_i-\bar x)(y_i-\bar y)}{\sum(x_i-\bar x)^2}\).
- In matrix form \(A^TA\,\mathbf a=A^T\mathbf y\). Centre the data to keep \(A^TA\) well conditioned; a pattern in the residuals means a line is the wrong model.
</div>

## Why squares?

The plain sum \(\sum r_i\) is useless: positive and negative residuals cancel, and every line through \((\bar x,\bar y)\) gives zero. The sum \(\sum|r_i|\) has corners where a residual vanishes. The sum of squares \(E\) is smooth, has a single minimum (a bowl over the \((a_0,a_1)\) plane), and punishes large errors most. At the bottom of the bowl,

\[
\frac{\partial E}{\partial a_0}=-2\sum_{i=0}^{m}\big(y_i-a_0-a_1x_i\big)=0,\qquad
\frac{\partial E}{\partial a_1}=-2\sum_{i=0}^{m}\big(y_i-a_0-a_1x_i\big)x_i=0,
\]

which rearrange to the normal equations.

## A worked example

For \((1,2.3),\ (2,2.4),\ (3,3.9),\ (4,3.8),\ (5,5.6)\): \(m+1=5\), \(\sum x_i=15\), \(\sum y_i=18\), \(\sum x_i^2=55\), \(\sum x_iy_i=62\), so

\[
5a_0+15a_1=18,\qquad 15a_0+55a_1=62,
\]

giving \(a_1=0.8\), \(a_0=1.2\): the least squares line is \(y=1.2+0.8x\).

| \(x_i\) | 1 | 2 | 3 | 4 | 5 |
|---|---:|---:|---:|---:|---:|
| \(y_i\) | 2.3 | 2.4 | 3.9 | 3.8 | 5.6 |
| \(1.2+0.8x_i\) | 2.0 | 2.8 | 3.6 | 4.4 | 5.2 |
| \(r_i\) | \(+0.3\) | \(-0.4\) | \(+0.3\) | \(-0.6\) | \(+0.4\) |

The residuals add up to \(0\) and \(E=\sum r_i^2=0.86\). The line through the first and last points gives \(E=1.48\), the line \(1.5+0.7x\) gives \(E=0.96\). The mean point is \((3,\ 3.6)\) and the slope is \(8/10=0.8\). At \(x=6\) the line predicts \(6.0\); the degree-four polynomial through all five points shoots up to \(19.3\).

The notes' example \((1,2.2),\ (2,2.8),\ (3,3.6),\ (4,4.5),\ (5,5.1)\) works the same way: \(5a_0+15a_1=18.2\), \(15a_0+55a_1=62.1\), so \(y=1.39+0.75x\) with \(E=0.027\).

With many measurements nothing changes: sixty scattered points need the same four sums and the same \(2\times2\) system.

## Outliers, conditioning and the wrong model

- Changing the last value from \(5.6\) to \(8.6\) changes the line to \(y=1.4x\): one outlier nearly doubles the slope.
- With \(x=2021,\dots,2025\) the matrix \(A^TA\) has condition number about \(8\times10^{12}\); with \(x=1,\dots,5\) about \(70\). Centring (\(x-\bar x\)) makes \(A^TA=\begin{bmatrix}5&0\\0&10\end{bmatrix}\).
- For the curved data \(1.0,\ 1.9,\ 3.9,\ 7.1,\ 11.2\) the line leaves residuals \(+1.1,\ -0.56,\ -1.12,\ -0.48,\ +1.06\): a pattern, so a curve is needed (next lecture).

<div class="nm-actions" markdown>
[Practise this lecture](../practice/lec24_least_squares_line.html){ .md-button .md-button--primary }
[← Previous: The Shifted Inverse Power Method](lec23-shifted-inverse-power.md){ .md-button }
[Next: Least Squares, Polynomial Fit →](lec25-least-squares-poly.md){ .md-button }
</div>
