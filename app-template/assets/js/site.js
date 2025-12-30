/* Bayan Admin - minimal JS
   - Desktop: toggle sidebar collapse (icons-only)
   - Mobile: offcanvas handled by Bootstrap attributes
   - Active nav link based on current path
*/
(function () {
  const body = document.body;

  // Desktop collapse toggle
  const toggleBtn = document.getElementById("apSidebarToggle");
  const storageKey = "apSidebarCollapsed";

  function setCollapsed(isCollapsed) {
    body.classList.toggle("ap-sidebar-collapsed", isCollapsed);
    try { localStorage.setItem(storageKey, isCollapsed ? "1" : "0"); } catch (e) {}
  }

  // Restore state (desktop only)
  const isDesktop = window.matchMedia("(min-width: 992px)").matches;
  if (isDesktop) {
    let saved = "0";
    try { saved = localStorage.getItem(storageKey) || "0"; } catch (e) {}
    setCollapsed(saved === "1");
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", function () {
      const isCollapsed = body.classList.contains("ap-sidebar-collapsed");
      setCollapsed(!isCollapsed);
    });
  }

  // Active nav link (both sidebar and offcanvas)
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll('[data-ap-nav] a.nav-link[href]').forEach(a => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    if (!href) return;
    const normalized = href.split("/").pop();
    if (normalized === path) a.classList.add("active");
  });

  // Tooltips for collapsed sidebar (desktop)
  function initTooltips() {
    if (typeof bootstrap === "undefined") return;
    const shouldEnable = window.matchMedia("(min-width: 992px)").matches && body.classList.contains("ap-sidebar-collapsed");
    // Dispose existing
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
      const inst = bootstrap.Tooltip.getInstance(el);
      if (inst) inst.dispose();
    });
    if (!shouldEnable) return;
    document.querySelectorAll("[data-ap-tooltip]").forEach(el => {
      el.setAttribute("data-bs-toggle", "tooltip");
      el.setAttribute("data-bs-placement", "left");
      new bootstrap.Tooltip(el);
    });
  }

  initTooltips();
  window.addEventListener("resize", initTooltips);

  // Re-init tooltips after toggle
  if (toggleBtn) toggleBtn.addEventListener("click", () => setTimeout(initTooltips, 50));
})();