---
title: Operation Count of Gaussian Elimination
---

<p class="nm-eyebrow">Lecture 11</p>

# Operation Count of Gaussian Elimination

<iframe class="nm-video" src="https://www.youtube-nocookie.com/embed/kdDhaVcJrUk" title="Lecture 11: Operation Count of Gaussian Elimination" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<div class="nm-actions" markdown>
[Practise this lecture](../practice/lec11_operation_count.html){ .md-button .md-button--primary }
[Watch on YouTube](https://www.youtube.com/watch?v=kdDhaVcJrUk){ .md-button }
</div>

<div class="nm-key" markdown>
#### Key results
- Forward elimination costs about \(\frac23n^3\) operations; back substitution about \(n^2\).
- Doubling \(n\) multiplies the work by \(8\).
- Cramer's rule with cofactor determinants needs about \((n+1)!\) operations; computing \(A^{-1}\) costs about \(2n^3\).
- With the elimination saved, each extra right-hand side costs only \(n^2\); a tridiagonal system costs \(O(n)\).
</div>

## Counting the work

At step \(k\) of forward elimination there are \(n-k\) rows below the pivot. Each needs one division (the multiplier), \((n-k)\) multiplications to update the row of \(A\) and one more for \(\mathbf{b}\). The block that changes is an \((n-k)\times(n-k)\) square that shrinks at every step; adding the squares gives \(\sum_{k=1}^{n-1}k^2\approx\frac{n^3}{3}\), the volume of a pyramid inside an \(n\times n\times n\) cube.

| | multiplications / divisions | additions / subtractions |
|---|---|---|
| forward elimination | \(\dfrac{2n^3+3n^2-5n}{6}\) | \(\dfrac{n^3-n}{3}\) |
| back substitution | \(\dfrac{n^2+n}{2}\) | \(\dfrac{n^2-n}{2}\) |
| total | \(\dfrac{n^3}{3}+n^2-\dfrac n3\) | \(\dfrac{n^3}{3}+\dfrac{n^2}{2}-\dfrac{5n}{6}\) |

## Some numbers

| \(n\) | operations | time at \(10^9\) operations per second |
|---:|---:|---:|
| \(3\) | \(28\) | |
| \(100\) | \(6.8\times10^5\) | |
| \(1000\) | \(6.7\times10^8\) | under a second |

## Comparisons

- **Cramer's rule** expands \(n+1\) determinants by cofactors, about \((n+1)!\) operations. For \(n=20\) that is \(5\times10^{19}\), more than a thousand years at \(10^9\) operations per second; elimination needs about \(5\,000\).
- **The inverse** costs about \(2n^3\), three times as much as elimination, and is less accurate. Never compute \(A^{-1}\) to solve \(A\mathbf{x}=\mathbf{b}\).
- **Many right-hand sides.** The elimination of \(A\) is the same for every \(\mathbf{b}\); saving the multipliers makes each new \(\mathbf{b}\) cost only \(n^2\). This is the \(LU\) factorisation.
- **Structure.** A triangular system costs \(n^2\), a tridiagonal one \(O(n)\).
- **Gauss–Jordan elimination** reduces \(A\) to the identity, eliminating above and below each pivot. It needs no back substitution but costs about \(n^3\) operations, \(1.5\) times as much as Gaussian elimination.
- **Determinants.** Eliminate and multiply the pivots: about \(3.3\times10^5\) multiplications for \(n=100\), against \(1.6\times10^{158}\) by cofactor expansion.
- **Faster computers.** Because the cost grows like \(n^3\), a computer twice as fast solves a system only \(2^{1/3}\approx1.26\) times larger in the same time; a thousand times faster, only ten times larger.

For \(n=1000\) the exact count is \(668\,165\,500\), against \(\frac23n^3=666\,666\,667\): the lower-order terms change it by \(0.22\%\), so the cost is \(\frac23n^3+O(n^2)\).

<div class="nm-actions" markdown>
[Practise this lecture](../practice/lec11_operation_count.html){ .md-button .md-button--primary }
[← Previous: Gaussian Elimination](lec10-gaussian-elimination.md){ .md-button }
[Next: Pivoting →](lec12-pivoting.md){ .md-button }
</div>
