---
title: "Simpson's 3/8 Rule"
---

<p class="nm-eyebrow">Lecture 33</p>

# Simpson's 3/8 Rule

<iframe class="nm-video" src="https://www.youtube-nocookie.com/embed/_ZVR0-UlZRY" title="Lecture 33: Simpson's 3/8 Rule" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<div class="nm-actions" markdown>
[Practise this lecture](../practice/lec33_simpson_38.html){ .md-button .md-button--primary }
[Watch on YouTube](https://www.youtube.com/watch?v=_ZVR0-UlZRY){ .md-button }
</div>

<div class="nm-key" markdown>
#### Key results
- **Simpson's 3/8 rule:** \(\int_a^b f(x)\,dx=\frac{3h}{8}\big(f_0+3f_1+3f_2+f_3\big)-\frac{3h^5}{80}f^{(4)}(\xi)\), with \(h=\frac{b-a}{3}\). Degree of precision \(3\), the same as the \(1/3\) rule.
- **Error constants.** Over one interval of length \(L\): \(\frac{L^5}{6480}\) against \(\frac{L^5}{2880}\) for the \(1/3\) rule, so the \(3/8\) rule is \(2.25\) times more accurate, with one more function value. At the same spacing \(h\) the composite \(1/3\) rule wins by the same factor.
- **Composite rule:** weights \(1,3,3,2,3,3,2,\dots,3,3,1\) times \(\frac{3h}{8}\), \(n\) a multiple of \(3\), error \(-\frac{(b-a)h^4}{80}f^{(4)}(\mu)=O(h^4)\).
- **Odd \(n\):** the \(1/3\) rule on the first \(n-3\) pieces and the \(3/8\) rule on the last three.
- For \(\int_0^1\frac{dx}{1+x^2}=\frac{\pi}{4}\): one step gives \(0.784615\) (error \(7.8\times10^{-4}\)), \(n=6\) gives \(0.785396\) (error \(2.3\times10^{-6}\)), and \(n=5\) with the combined rule \(0.785340\) (error \(5.9\times10^{-5}\)).
</div>

## Why another rule?

The composite \(1/3\) rule takes the pieces two at a time, so it needs an even \(n\). With data at six equally spaced points there are five pieces, and one is left over. A trapezoid on the leftover piece spoils the accuracy: on \(\int_0^1\frac{dx}{1+x^2}\) with \(n=5\) the error becomes \(3.3\times10^{-4}\). We need a rule that takes three pieces at once.

## The rule

Interpolate \(f\) by the cubic \(p_3\) through four equally spaced nodes \(x_0=a,\ x_1=a+h,\ x_2=a+2h,\ x_3=b\), with \(h=\frac{b-a}{3}\). With \(x=x_0+sh\), \(s\in[0,3]\), the Lagrange basis cubics integrate to

\[
a_0=\frac{3h}{8},\qquad a_1=\frac{9h}{8},\qquad a_2=\frac{9h}{8},\qquad a_3=\frac{3h}{8},
\]

so

\[
\int_a^b f(x)\,dx\approx\frac{3h}{8}\big(f(x_0)+3f(x_1)+3f(x_2)+f(x_3)\big).
\]

As a check, the weights add up to \(3h=b-a\).

## The error

On \([0,3]\) with \(h=1\) the rule integrates \(1,x,x^2,x^3\) exactly. For \(x^4\) the integral is \(\frac{243}{5}=48.6\) while the rule gives \(\frac38(0+3+48+81)=49.5\), so the error constant is \(C=-\frac{9}{10}h^5\). Dividing by \(4!\):

\[
\boxed{\int_a^b f(x)\,dx=\frac{3h}{8}\big(f_0+3f_1+3f_2+f_3\big)-\frac{3h^5}{80}f^{(4)}(\xi)}
\]

**The surprise.** One more node than the \(1/3\) rule, yet the same degree of precision \(3\) and the same order. The reason is the node polynomial: for three nodes, \(s(s-1)(s-2)\) is odd about the middle and \(\int_0^2 s(s-1)(s-2)\,ds=0\), which gives the \(1/3\) rule a free extra degree. For four nodes, \(s(s-1)(s-2)(s-3)\) is even about the middle and \(\int_0^3 s(s-1)(s-2)(s-3)\,ds=-\frac{9}{10}\neq0\): no free degree.

**Comparing the constants.** The two rules use different \(h\). Over an interval of length \(L\), the \(1/3\) rule has \(h=\frac L2\) and error \(\frac{h^5}{90}f^{(4)}=\frac{L^5}{2880}f^{(4)}\); the \(3/8\) rule has \(h=\frac L3\) and \(\frac{3h^5}{80}f^{(4)}=\frac{L^5}{6480}f^{(4)}\). The \(3/8\) rule is \(\frac{6480}{2880}=2.25\) times more accurate, at the price of a fourth function value.

## Worked example: one step

For \(I=\int_0^1\frac{dx}{1+x^2}=\frac{\pi}{4}\approx0.785398\) with \(h=\frac13\):

| \(i\) | 0 | 1 | 2 | 3 |
|---|---:|---:|---:|---:|
| \(x_i\) | 0 | \(\frac13\) | \(\frac23\) | 1 |
| \(f(x_i)\) | 1 | 0.9 | 0.6923 | 0.5 |
| weight | 1 | 3 | 3 | 1 |

The weighted sum is \(1+3(0.9+0.6923)+0.5=6.2769\), and \(\frac{3h}{8}=\frac18\), so the rule gives \(0.784615\), with error \(7.8\times10^{-4}\). Simpson's \(1/3\) rule gave \(0.783333\) (error \(2.1\times10^{-3}\)), \(2.6\) times larger.

## The composite 3/8 rule

Cut \([a,b]\) into \(n\) pieces of width \(h=\frac{b-a}{n}\), with \(n\) a multiple of \(3\), and apply the rule to each group of three pieces. A node shared by two groups collects the weight \(1+1=2\):

\[
\int_a^b f(x)\,dx\approx\frac{3h}{8}\Big(f_0+3f_1+3f_2+2f_3+3f_4+3f_5+2f_6+\dots+2f_{n-3}+3f_{n-2}+3f_{n-1}+f_n\Big).
\]

Adding the \(\frac n3\) group errors \(-\frac{3h^5}{80}f^{(4)}(\eta_k)\), with \(nh=b-a\),

\[
E(f)=-\frac{(b-a)\,h^4}{80}\,f^{(4)}(\mu),\qquad \mu\in[a,b].
\]

The error is \(O(h^4)\): halving \(h\) divides it by about \(16\).

**Example, \(n=6\).** With \(h=\frac16\), the values \(1,\ 0.9730,\ 0.9,\ 0.8,\ 0.6923,\ 0.5902,\ 0.5\) and weights \(1,3,3,2,3,3,1\) give the sum \(12.5663\); times \(\frac{3h}{8}=\frac1{16}\) this is \(0.785396\), with error \(2.3\times10^{-6}\).

**Same \(h\): the \(1/3\) rule wins.** The composite \(1/3\) rule has error \(-\frac{(b-a)h^4}{180}f^{(4)}(\mu)\), so on the same nodes it is \(2.25\) times more accurate. For \(\int_0^1e^x\,dx=e-1\):

| \(n\) | 6 | 12 | 24 | 48 |
|---|---:|---:|---:|---:|
| \(\lvert I-S^{1/3}_n\rvert\) | \(7.3\times10^{-6}\) | \(4.6\times10^{-7}\) | \(2.9\times10^{-8}\) | \(1.8\times10^{-9}\) |
| \(\lvert I-S^{3/8}_n\rvert\) | \(1.6\times10^{-5}\) | \(1.0\times10^{-6}\) | \(6.5\times10^{-8}\) | \(4.0\times10^{-9}\) |
| ratio | 2.24 | 2.25 | 2.25 | 2.25 |

On a log–log plot both Simpson rules give parallel lines of slope \(-4\), the trapezoidal rule a line of slope \(-2\). (The example \(\frac{1}{1+x^2}\) on \([0,1]\) is not used here: its third derivative vanishes at both end points, which makes all Simpson-type rules converge faster than \(h^4\) and hides the true rate.)

## Combining the rules: any \(n\)

- \(n\) even: the composite \(1/3\) rule.
- \(n\) odd: the \(1/3\) rule on the first \(n-3\) pieces (an even number, possibly zero) and the \(3/8\) rule on the last three.

Both parts are of order \(h^4\), so the combined rule is too. **Example, \(n=5\)** on \(\int_0^1\frac{dx}{1+x^2}\), \(h=0.2\):

\[
\tfrac{0.2}{3}\big(f_0+4f_1+f_2\big)=0.380548,\qquad \tfrac{3\cdot0.2}{8}\big(f_2+3f_3+3f_4+f_5\big)=0.404791,
\]

total \(0.785340\), error \(5.9\times10^{-5}\). With the same six values the trapezoid patch gives \(3.3\times10^{-4}\) and the trapezoidal rule \(1.7\times10^{-3}\).

## The Newton–Cotes family

The closed Newton–Cotes rules integrate the interpolating polynomial through equally spaced nodes, end points included:

| rule | pieces | weights | error | precision |
|---|:-:|:-:|:-:|:-:|
| trapezoid | 1 | \(\frac h2(1,1)\) | \(-\frac{h^3}{12}f''\) | 1 |
| Simpson \(1/3\) | 2 | \(\frac h3(1,4,1)\) | \(-\frac{h^5}{90}f^{(4)}\) | 3 |
| Simpson \(3/8\) | 3 | \(\frac{3h}{8}(1,3,3,1)\) | \(-\frac{3h^5}{80}f^{(4)}\) | 3 |
| Boole | 4 | \(\frac{2h}{45}(7,32,12,32,7)\) | \(-\frac{8h^7}{945}f^{(6)}\) | 5 |

With \(n\) pieces the precision is at least \(n\); when \(n\) is even the node polynomial is odd about the middle and one degree comes for free. So the precision climbs \(1,3,3,5,5,7,\dots\), and the \(3/8\) rule gains nothing in order over the \(1/3\) rule.

## Weak cases

- **Unbounded derivatives.** For \(\int_0^1\sqrt x\,dx=\frac23\) the composite \(3/8\) errors are \(0.0190,\ 0.0067,\ 0.0024,\ 0.0008\) for \(n=3,6,12,24\): doubling \(n\) divides the error by only \(2.8\), not \(16\).
- **On its own** the rule needs \(n\) to be a multiple of \(3\).
- **Even \(n\).** Prefer the \(1/3\) rule: on the same nodes it is \(2.25\) times more accurate.

## Algorithm (Simpson's rule for any \(n\ge2\))

1. \(h=(b-a)/n\).
2. If \(n\) is even, return the composite \(1/3\) rule.
3. Otherwise apply the composite \(1/3\) rule on the first \(n-3\) pieces (skip it if \(n=3\)).
4. Add \(\frac{3h}{8}\big(f_{n-3}+3f_{n-2}+3f_{n-1}+f_n\big)\) and return the sum.

It uses \(n+1\) function values for every \(n\). Next lecture: the method of undetermined coefficients, where the weights \(1,3,3,1\) come out of the conditions that the rule integrate \(1,x,x^2,x^3\) exactly.

<div class="nm-actions" markdown>
[Practise this lecture](../practice/lec33_simpson_38.html){ .md-button .md-button--primary }
[Watch on YouTube](https://www.youtube.com/watch?v=_ZVR0-UlZRY){ .md-button }
[← Previous: Simpson's 1/3 Rule](lec32-simpson-13.md){ .md-button }
[Next: Method of Undetermined Coefficients →](lec34-undetermined-coefficients.md){ .md-button }
</div>
