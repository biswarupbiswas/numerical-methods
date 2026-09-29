// Render all maths with KaTeX so every page (and the practice pages) uses the same LaTeX fonts.
(function () {
  const opts = {
    delimiters: [
      { left: "\\[", right: "\\]", display: true },
      { left: "\\(", right: "\\)", display: false },
    ],
    throwOnError: false,
  };
  const render = () => { if (window.renderMathInElement) renderMathInElement(document.body, opts); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render); else render();
  // Material's instant navigation swaps page content without a reload.
  if (window.document$) window.document$.subscribe(render);
})();
