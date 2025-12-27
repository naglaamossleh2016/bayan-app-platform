/**
 * Bayan Platform UI (Refactor)
 * ----------------------------
 * Features:
 * - Demo auth (login/logout) + protect internal pages
 * - Generic password toggle (via data-toggle-pass)
 * - Auto-hide offcanvas when switching to desktop (lg+)
 * - Users modal form: Bootstrap validation + password confirmation match
 * - UI helpers: app avatar (initials/logo) + apps table mode badges
 * - Role permissions page: "Select all / Clear all" for groups + app pages enable/disable
 *
 * Notes:
 * - This is UI/demo logic. Replace localStorage demo auth with real backend auth.
 * - The file is written to be safe to include on all pages (features activate only if elements exist).
 */

(() => {
  /* =========================
     1) Config (selectors/routes/storage)
  ========================= */
  const SELECTORS = {
    // Auth
    loginForm: "#loginForm",
    username: "#username",
    password: "#password",
    loginAlert: "#loginAlert",
    logoutBtn: "#logoutBtn",
    logoutBtnMobile: "#logoutBtnMobile",

    // Layout
    offcanvas: "#apOffcanvas",

    // Generic UI
    passToggle: "[data-toggle-pass]",

    // Apps page helpers
    avatar: ".ap-app-avatar",
    accessModeRow: "tr[data-access-mode]",

    // Users page (Add User modal form)
    addUserForm: "#addUserForm",
    userPassword: "#userPassword",
    userConfirmPassword: "#userConfirmPassword",
    confirmPasswordFeedback: "#confirmPasswordFeedback",
  };

  const ROUTES = {
    login: "login.html",
    afterLogin: "applications.html",
  };

  const STORAGE_KEYS = {
    isLoggedIn: "ap_isLoggedIn",
    username: "ap_username",
  };

  /* =========================
     2) Tiny DOM helpers
  ========================= */
  const isLoginPage = window.location.pathname
    .toLowerCase()
    .includes(ROUTES.login);

  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const getText = (el) => (el?.value ?? "").toString().trim();

  /* =========================
     3) Demo session helper (localStorage)
  ========================= */
  const Session = {
    set(username) {
      localStorage.setItem(STORAGE_KEYS.isLoggedIn, "1");
      localStorage.setItem(STORAGE_KEYS.username, username);
    },
    clear() {
      localStorage.removeItem(STORAGE_KEYS.isLoggedIn);
      localStorage.removeItem(STORAGE_KEYS.username);
    },
    isLoggedIn() {
      return localStorage.getItem(STORAGE_KEYS.isLoggedIn) === "1";
    },
  };

  /* =========================
     4) Login alert helper
  ========================= */
  const AlertUI = {
    show(msg) {
      const box = qs(SELECTORS.loginAlert);
      if (!box) return;
      box.textContent = msg;
      box.classList.remove("d-none");
    },
    hide() {
      const box = qs(SELECTORS.loginAlert);
      if (!box) return;
      box.textContent = "";
      box.classList.add("d-none");
    },
  };

  /* =========================
     5) Auth protection + logout binding
  ========================= */

  // Redirect to login if the user opens a protected page while not logged in (demo).
  function protectInternalPages() {
    if (isLoginPage) return;
    if (!Session.isLoggedIn()) window.location.href = ROUTES.login;
  }

  // Wire logout buttons (desktop + mobile) to clear the demo session and redirect to login.
  function bindLogout() {
    const buttons = [
      qs(SELECTORS.logoutBtn),
      qs(SELECTORS.logoutBtnMobile),
    ].filter(Boolean);

    buttons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        Session.clear();
        window.location.href = ROUTES.login;
      });
    });
  }

  /* =========================
     6) Login page (demo submit)
  ========================= */

  // Demo login validation (no real server request).
  function initLoginPage() {
    if (!isLoginPage) return;

    const form = qs(SELECTORS.loginForm);
    const usernameEl = qs(SELECTORS.username);
    const passwordEl = qs(SELECTORS.password);
    if (!form || !usernameEl || !passwordEl) return;

    const demoUsers = [{ username: "admin", password: "admin123" }];

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      AlertUI.hide();

      const u = getText(usernameEl);
      const p = getText(passwordEl);

      if (!u || !p) {
        AlertUI.show("من فضلك أدخل اسم المستخدم وكلمة المرور.");
        return;
      }

      const ok = demoUsers.some((x) => x.username === u && x.password === p);
      if (!ok) {
        AlertUI.show("اسم المستخدم أو كلمة المرور غير صحيحين.");
        return;
      }

      Session.set(u);
      window.location.href = ROUTES.afterLogin;
    });

    // Clear the alert as the user types.
    [usernameEl, passwordEl].forEach((el) =>
      el.addEventListener("input", () => AlertUI.hide())
    );
  }

  /* =========================
     7) Password toggles (generic)
  ========================= */

  // Any button with data-toggle-pass="#inputId" will toggle the input type + icon.
  function bindPasswordToggles() {
    qsa(SELECTORS.passToggle).forEach((btn) => {
      btn.addEventListener("click", () => {
        const sel = btn.getAttribute("data-toggle-pass");
        const input = sel ? qs(sel) : null;
        if (!input) return;

        const icon = btn.querySelector("i");
        const isHidden = input.type === "password";

        input.type = isHidden ? "text" : "password";
        if (icon) icon.className = isHidden ? "bi bi-eye-slash" : "bi bi-eye";

        // Optional accessibility text
        const label = isHidden ? "إخفاء كلمة المرور" : "إظهار كلمة المرور";
        btn.setAttribute("aria-label", label);
        btn.title = label;
      });
    });
  }

  /* =========================
     8) Offcanvas behavior
  ========================= */

  // If the user opens the offcanvas on mobile then resizes to desktop (lg+),
  // hide it to avoid overlay issues.
  function bindOffcanvasAutoHideOnDesktop() {
    window.addEventListener("resize", () => {
      if (window.innerWidth < 992) return; // Bootstrap lg breakpoint

      const el = qs(SELECTORS.offcanvas);
      if (!el || typeof bootstrap === "undefined") return;

      const instance = bootstrap.Offcanvas.getInstance(el);
      instance?.hide();
    });
  }

  /* =========================
     9) Apps avatar helper (initials + optional logo)
  ========================= */

  // Generates initials from Arabic/English names and replaces them with a logo if provided.
  function initAvatars() {
    const getInitials = (name) => {
      if (!name) return "؟";
      const cleaned = String(name).trim().replace(/\s+/g, " ");
      if (!cleaned) return "؟";

      const parts = cleaned.split(" ").filter(Boolean);
      if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
      return parts[0].slice(0, 2).toUpperCase();
    };

    qsa(SELECTORS.avatar).forEach((wrap) => {
      const name = wrap.getAttribute("data-app-name") || "";
      const initialsEl = wrap.querySelector(".ap-app-avatar-initials");
      if (initialsEl) initialsEl.textContent = getInitials(name);

      const logo = (wrap.getAttribute("data-logo") || "").trim();
      const isPlaceholder =
        !logo || logo.includes("[") || logo.includes("LogoUrl");
      if (isPlaceholder) return;

      const img = new Image();
      img.className = "ap-app-avatar-img";
      img.alt = name ? `${name} Logo` : "App Logo";
      img.src = logo;

      img.onload = () => {
        wrap.classList.add("has-image");
        wrap.prepend(img);
      };
      img.onerror = () => wrap.classList.remove("has-image");
    });
  }

  /* =========================
     10) Apps table helper (access mode)
  ========================= */

  // Based on row data-access-mode="app|platform":
  // - show the "pages" action only for platform mode
  // - show the correct mode badge
  function initAccessModeRows() {
    qsa(SELECTORS.accessModeRow).forEach((tr) => {
      const mode = tr.getAttribute("data-access-mode"); // app | platform

      const pagesBtn = tr.querySelector(".ap-action-pages");
      if (pagesBtn) pagesBtn.classList.toggle("d-none", mode !== "platform");

      const bApp = tr.querySelector(".ap-badge-mode-app");
      const bPlat = tr.querySelector(".ap-badge-mode-platform");
      if (bApp) bApp.classList.toggle("d-none", mode !== "app");
      if (bPlat) bPlat.classList.toggle("d-none", mode !== "platform");
    });
  }

  /* =========================
     11) Users form (Bootstrap validation + password match)
  ========================= */

  // Works for the "Add User" modal form:
  // - uses Bootstrap validation styles (was-validated)
  // - enforces password === confirm password using setCustomValidity()
  function initUsersForm() {
    const form = qs(SELECTORS.addUserForm);
    if (!form) return;

    const pass = qs(SELECTORS.userPassword);
    const confirm = qs(SELECTORS.userConfirmPassword);
    const confirmFeedback = qs(SELECTORS.confirmPasswordFeedback);

    function syncPasswordMatch() {
      if (!pass || !confirm) return true;

      const p = getText(pass);
      const c = getText(confirm);

      // Allow required validation to show its own message if confirm is empty.
      if (!c) {
        confirm.setCustomValidity("");
        if (confirmFeedback)
          confirmFeedback.textContent = "من فضلك أكّد كلمة المرور.";
        return true;
      }

      if (p !== c) {
        confirm.setCustomValidity("mismatch");
        if (confirmFeedback)
          confirmFeedback.textContent = "كلمتا المرور غير متطابقتين.";
        return false;
      }

      confirm.setCustomValidity("");
      if (confirmFeedback) confirmFeedback.textContent = "ممتاز.";
      return true;
    }

    confirm?.addEventListener("input", syncPasswordMatch);
    pass?.addEventListener("input", syncPasswordMatch);

    form.addEventListener("submit", (e) => {
      syncPasswordMatch();

      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      }
      form.classList.add("was-validated");
    });
  }

  /* =========================
     12) Boot (runs on every page safely)
  ========================= */
  protectInternalPages();
  bindLogout();
  initLoginPage();
  bindPasswordToggles();
  bindOffcanvasAutoHideOnDesktop();

  document.addEventListener("DOMContentLoaded", () => {
    initAvatars();
    initAccessModeRows();
    initUsersForm();
  });
})();

/**
 * Role Permissions UI helpers
 * --------------------------
 * - "Select all / Clear all" buttons for permission groups
 * - App pages are enabled only if the app itself is allowed (ap-app-access checked)
 *
 * This block is intentionally independent, so you can remove it if a page doesn't need it.
 */
(() => {
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /**
   * Check/uncheck all checkboxes inside a container element.
   * Note: This is a generic helper; per-app behavior is handled separately below.
   */
  function setCheckedInScope(scopeEl, checked) {
    if (!scopeEl) return;
    qsa('input[type="checkbox"]', scopeEl).forEach((cb) => {
      cb.checked = checked;
    });
  }

  /**
   * Handle clicks on "Select all" / "Clear all" using event delegation.
   * This works even if buttons are rendered later by the server.
   */
  document.addEventListener("click", (e) => {
    const selectBtn = e.target.closest(".ap-select-all");
    const clearBtn = e.target.closest(".ap-clear-all");
    if (!selectBtn && !clearBtn) return;

    const btn = selectBtn || clearBtn;
    const targetSel = btn.getAttribute("data-target");
    const scopeEl = targetSel ? qs(targetSel) : null;
    if (!scopeEl) return;

    // If the buttons are inside an app <details>, apply app-specific logic.
    const appRoot = btn.closest("details.ap-app");
    if (appRoot) {
      const access = qs(".ap-app-access", appRoot);
      const pagesGroup = qs(".ap-app-pages-group", appRoot);

      if (selectBtn) {
        // Selecting pages implies enabling app access first.
        if (access) access.checked = true;

        if (pagesGroup) {
          qsa('input.ap-page[type="checkbox"]', pagesGroup).forEach((cb) => {
            cb.disabled = false;
            cb.checked = true;
          });
        }
      } else {
        // Clearing pages will disable them and also revoke app access.
        if (pagesGroup) {
          qsa('input.ap-page[type="checkbox"]', pagesGroup).forEach((cb) => {
            cb.checked = false;
            cb.disabled = true;
          });
        }
        if (access) access.checked = false;
      }
      return;
    }

    // Platform groups: direct select/clear.
    setCheckedInScope(scopeEl, !!selectBtn);
  });

  /**
   * Enable/disable app page checkboxes depending on app access checkbox.
   * If access is OFF, pages are cleared and disabled.
   */
  function syncAppPages(appDetails) {
    const access = qs(".ap-app-access", appDetails);
    const pagesGroup = qs(".ap-app-pages-group", appDetails);
    if (!pagesGroup) return;

    const enable = !!access?.checked;
    qsa('input.ap-page[type="checkbox"]', pagesGroup).forEach((cb) => {
      cb.disabled = !enable;
      if (!enable) cb.checked = false;
    });
  }

  /**
   * Boot permissions UI: sync all apps once + bind change listeners.
   */
  document.addEventListener("DOMContentLoaded", () => {
    qsa("details.ap-app").forEach((d) => {
      syncAppPages(d);

      const access = qs(".ap-app-access", d);
      if (access) access.addEventListener("change", () => syncAppPages(d));
    });
  });
})();
