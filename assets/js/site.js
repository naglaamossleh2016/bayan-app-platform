/**
 * Demo Auth (Quick Login) + Password Toggle
 * ----------------------------------------
 * For UI demo only.
 */

(function () {
  const isLoginPage = window.location.pathname
    .toLowerCase()
    .includes("login.html");

  // ===== Helpers =====
  function showAlert(msg) {
    const alertBox = document.getElementById("loginAlert");
    if (!alertBox) return;
    alertBox.textContent = msg;
    alertBox.classList.remove("d-none");
  }

  function hideAlert() {
    const alertBox = document.getElementById("loginAlert");
    if (!alertBox) return;
    alertBox.textContent = "";
    alertBox.classList.add("d-none");
  }

  function setSession(username) {
    localStorage.setItem("ap_isLoggedIn", "1");
    localStorage.setItem("ap_username", username);
  }

  function clearSession() {
    localStorage.removeItem("ap_isLoggedIn");
    localStorage.removeItem("ap_username");
  }

  function isLoggedIn() {
    return localStorage.getItem("ap_isLoggedIn") === "1";
  }

  // ===== 1) Protect internal pages (Demo) =====
  if (!isLoginPage) {
    // If user opens any page without being logged in -> redirect to login
    if (!isLoggedIn()) {
      window.location.href = "login.html";
      return;
    }
  }
  document.getElementById("logoutBtn")?.addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.removeItem("ap_isLoggedIn");
    localStorage.removeItem("ap_username");
    window.location.href = "login.html";
  });

  // ===== 2) Fill user name in navbar if you add a span id="currentUserName" =====
  const nameSlot = document.getElementById("currentUserName");
  if (nameSlot) {
    nameSlot.textContent = localStorage.getItem("ap_username") || "User";
  }

  // ===== 3) Login page logic =====
  if (isLoginPage) {
    const form = document.getElementById("loginForm");
    const usernameEl = document.getElementById("username");
    const passwordEl = document.getElementById("password");

    // Password eye toggle
    const toggleBtn = document.getElementById("togglePasswordBtn");
    const toggleIcon = document.getElementById("togglePasswordIcon");

    if (toggleBtn && passwordEl && toggleIcon) {
      toggleBtn.addEventListener("click", function () {
        const isHidden = passwordEl.type === "password";
        passwordEl.type = isHidden ? "text" : "password";
        toggleIcon.className = isHidden ? "bi bi-eye-slash" : "bi bi-eye";
        toggleBtn.setAttribute(
          "aria-label",
          isHidden ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
        );
        toggleBtn.title = isHidden ? "إخفاء كلمة المرور" : "إظهار كلمة المرور";
      });
    }

    // Quick login (demo users)
    const demoUsers = [{ username: "admin", password: "admin123" }];

    if (form && usernameEl && passwordEl) {
      form.addEventListener("submit", function (e) {
        // Demo mode: prevent real POST
        e.preventDefault();
        hideAlert();

        const u = (usernameEl.value || "").trim();
        const p = (passwordEl.value || "").trim();

        if (!u || !p) {
          showAlert("من فضلك أدخل اسم المستخدم وكلمة المرور.");
          return;
        }

        const ok = demoUsers.some((x) => x.username === u && x.password === p);
        if (!ok) {
          showAlert("اسم المستخدم أو كلمة المرور غير صحيحين.");
          return;
        }

        setSession(u);
        window.location.href = "applications.html";
      });

      // Hide error when typing
      [usernameEl, passwordEl].forEach((el) =>
        el.addEventListener("input", hideAlert)
      );
    }
  }

  // ===== 4) Optional: Logout button demo =====
  // If your navbar has <form action="/logout">, for demo you can convert it to a button with id="logoutBtn"
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      clearSession();
      window.location.href = "login.html";
    });
  }
})();
window.addEventListener("resize", () => {
  if (window.innerWidth >= 992) {
    // lg breakpoint
    const el = document.getElementById("apOffcanvas");
    if (!el) return;
    const instance = bootstrap.Offcanvas.getInstance(el);
    instance?.hide();
  }
});
document.querySelectorAll("[data-toggle-pass]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const sel = btn.getAttribute("data-toggle-pass");
    const input = document.querySelector(sel);
    if (!input) return;

    const icon = btn.querySelector("i");
    const isHidden = input.type === "password";
    input.type = isHidden ? "text" : "password";
    if (icon) icon.className = isHidden ? "bi bi-eye-slash" : "bi bi-eye";
  });
});
// <!-- UI logic (Avatar + badges + show/hide pages actions + edit modal helper) -->

document.addEventListener("DOMContentLoaded", () => {
  // ===== Avatar (initials + image) =====
  function getInitials(name) {
    if (!name) return "؟";
    const cleaned = String(name).trim().replace(/\s+/g, " ");
    if (!cleaned) return "؟";
    const parts = cleaned.split(" ").filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  }

  document.querySelectorAll(".ap-app-avatar").forEach((wrap) => {
    const name = wrap.getAttribute("data-app-name") || "";
    const initialsEl = wrap.querySelector(".ap-app-avatar-initials");
    if (initialsEl) initialsEl.textContent = getInitials(name);

    const logo = (wrap.getAttribute("data-logo") || "").trim();
    if (!logo || logo.includes("[") || logo.includes("LogoUrl")) return;

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

  // ===== Table: show/hide pages button + badges =====
  document.querySelectorAll("tr[data-access-mode]").forEach((tr) => {
    const mode = tr.getAttribute("data-access-mode"); // app | platform

    const pagesBtn = tr.querySelector(".ap-action-pages");
    if (pagesBtn) pagesBtn.classList.toggle("d-none", mode !== "platform");

    const bApp = tr.querySelector(".ap-badge-mode-app");
    const bPlat = tr.querySelector(".ap-badge-mode-platform");
    if (bApp) bApp.classList.toggle("d-none", mode !== "app");
    if (bPlat) bPlat.classList.toggle("d-none", mode !== "platform");
  });

  // ===== Edit modal: show/hide "Manage links" helper =====
  const editModal = document.getElementById("editAppModal");
  const editWrap = document.getElementById("editPagesActionWrap");
  function syncEditWrap() {
    if (!editModal || !editWrap) return;
    const checked = editModal.querySelector('input[name="accessMode"]:checked');
    const v = checked ? checked.value : "app";
    editWrap.classList.toggle("d-none", v !== "platform");
  }
  if (editModal && editWrap) {
    editModal.querySelectorAll('input[name="accessMode"]').forEach((r) => {
      r.addEventListener("change", syncEditWrap);
    });
    editModal.addEventListener("shown.bs.modal", syncEditWrap);
    syncEditWrap();
  }
});
