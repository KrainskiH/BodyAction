// js/footer.js
document.addEventListener("DOMContentLoaded", async () => {
  // 0) Se já existe um footer renderizado, não injeta outro
  if (document.querySelector(".ba-footer")) return;

  // 1) Caminhos possíveis (até 3 níveis)
  const footerPaths = [
    "includes/footer.html",
    "../includes/footer.html",
    "../../includes/footer.html",
    "/includes/footer.html",
  ];

  // 2) Tenta carregar o footer
  let footerHTML = null, usedPath = null;
  for (const p of footerPaths) {
    try {
      const res = await fetch(p, { cache: "no-store" });
      if (res.ok) { footerHTML = await res.text(); usedPath = p; break; }
    } catch (_) {}
  }
  if (!footerHTML) {
    console.error("[Footer] Não consegui carregar includes/footer.html. Dica: use um servidor (ex.: Live Server) — abrir como file:// bloqueia fetch.");
    return;
  }

  // 3) Injeta no #footer-slot (se existir) ou no fim do body
  const slot = document.getElementById("footer-slot");
  (slot || document.body).insertAdjacentHTML("beforeend", footerHTML);
  console.log(`[Footer] Injetado de: ${usedPath}`);

  // 4) Garante CSS do rodapé (pages/contato.css) apenas 1x
  const hasContatoCss = [...document.styleSheets].some(s => (s.href || "").includes("pages/contato.css"));
  if (!hasContatoCss) {
    const cssPaths = [
      "pages/contato.css",
      "../pages/contato.css",
      "../../pages/contato.css",
      "/pages/contato.css",
    ];
    for (const href of cssPaths) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.onload = () => console.log(`[Footer] CSS carregado: ${href}`);
      link.onerror = () => link.remove();
      document.head.appendChild(link);
      break;
    }
  }

  // 5) Garante Remix Icon (se não tiver)
  const hasRemix = [...document.styleSheets].some(s => (s.href || "").includes("remixicon.css"));
  if (!hasRemix) {
    const ri = document.createElement("link");
    ri.rel = "stylesheet";
    ri.href = "https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css";
    document.head.appendChild(ri);
  }

  // 6) Ano automático (se existir #ba-year)
  const yearSpan = document.getElementById("ba-year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});
