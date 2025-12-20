# App Platform (HTML/CSS/JS) — Minimal JS

This is a **UI template** for a server-rendered platform (PHP / .NET).
- No JavaScript fills tables or loads data.
- Only Bootstrap bundle JS is included (modals/collapse).
- Developers will connect forms/tables to the database.

## Pages
- login.html
- index.html
- applications.html
- app-details.html
- design-catalog.html

## Assets
- assets/css/style.css  (Teal theme + RTL + login background)
- assets/js/site.js     (empty/minimal)

## Backend notes
- Replace placeholders like [UserName], [TotalApps].
- Render apps rows inside a server loop (Razor foreach / PHP foreach).
- Forms already have action/method; map them to your endpoints.


## Logo
- Replace `assets/img/logo-placeholder.svg` with your real logo (SVG/PNG).
- The UI uses `.ap-logo-wrap` containers in Login, Navbar, and Sidebar.
