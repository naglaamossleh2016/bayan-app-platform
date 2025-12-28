# Bayan App Platform (HTML/CSS/JS) — Minimal JS (Server-Rendered Ready)

This repository is a **UI template** designed for server-rendered platforms (PHP / .NET / Node SSR).
It focuses on **clean RTL UI**, **consistent theme**, and **responsive tables**, with **minimal JavaScript**.

✅ **No JavaScript loads or fills data from APIs**  
✅ Developers will connect forms/tables to DB and render loops server-side  
✅ JavaScript is only for UI behavior (login demo, offcanvas, password toggle, validation helpers, permissions select-all)

---

## What’s Included

- **Bootstrap 5.3 RTL** layout and components
- A single shared theme file: `assets/css/style.css` (refactored, sectioned, reusable tokens)
- Minimal UI script: `assets/js/site.js` (refactored and commented in English)
- Responsive tables with **card layout on small screens** (no horizontal scroll)
- Roles permissions UI with:
  - **Platform permissions**
  - **Applications permissions** (apps as `<details>` accordion, collapsed by default)
  - “Select all / Clear all” buttons inside each group

---

## Pages

### Auth

- `login.html`

### Dashboard / Navigation

- `index.html`

### Apps

- `applications.html`

  - Apps list
  - Responsive stack table: **use `.ap-table-stack`**
  - Action buttons: text visible on desktop, icon-only on small screens (via `.ap-actions` + `.ap-btn-text`)

- `app-pages.html`
  - App internal pages/links
  - Responsive stack table: **use `.ap-pages-stack`**

### Users & Roles

- `roles.html`

  - Roles list + add/edit modals

- `users.html`

  - Users list
  - Add User as **modal** (not inline form)
  - Sidebar label is **"المستخدمين"**

- `role-permissions.html`
  - Role permissions UI (platform + apps)
  - Per-group “Select all / Clear all”
  - Apps appear under `<details class="ap-app">` and are **collapsed by default**

### Other

- `design-catalog.html`
- `change-password.html`

---

## Assets

### CSS

- `assets/css/style.css`
  - Single theme
  - RTL-friendly
  - Refactored into clear sections:
    - Design tokens
    - Layout & typography
    - Navbar / Sidebar / Cards
    - Tables + badges
    - Modals / Offcanvas
    - Helpers + permissions UI styles
    - Responsive rules

**Important helper classes you should use in HTML:**

- `.ap-table-stack` → makes **apps table** turn into cards under `max-width: 991.98px`
- `.ap-pages-stack` → makes **pages table** turn into cards under `max-width: 991.98px`
- `.ap-actions` → wrap action buttons inside tables
- `.ap-btn-text` → the text part of action buttons (hidden only on small screens)

### JS

- `assets/js/site.js`
  - Minimal JS for UI behavior only:
    - Demo Auth (protect pages + login/logout)
    - Password toggle using `[data-toggle-pass]`
    - Auto-close offcanvas when switching to desktop (lg+)
    - Users modal form validation + password match
    - App avatar initials + optional logo image
    - Apps table badges and “pages” button show/hide based on `data-access-mode`
    - Role permissions “Select all / Clear all” per group + app pages enable/disable

---
