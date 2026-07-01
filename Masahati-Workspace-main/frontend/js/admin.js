/* =========================================================
   Masahati Admin — shared behavior
   Theme toggle, sidebar active state, toasts, and generic
   row actions (view / approve / reject) via delegation.
   ========================================================= */

const AdminLayout = (() => {
  const THEME_KEY = "masahati-admin-theme";

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const preferred = saved || "light";
    document.documentElement.setAttribute("data-theme", preferred);
    updateToggleIcon(preferred);

    const toggle = document.querySelector("[data-theme-toggle]");
    if (!toggle) return;

    toggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem(THEME_KEY, next);
      updateToggleIcon(next);
    });
  }

  function updateToggleIcon(theme) {
    const toggle = document.querySelector("[data-theme-toggle]");
    if (!toggle) return;
    toggle.innerHTML =
      theme === "dark"
        ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`
        : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"/></svg>`;
  }

  function markActiveNavLink() {
    const links = document.querySelectorAll(".sidebar-link[href]");
    const current = window.location.pathname.split("/").pop();
    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === current) {
        link.classList.add("active");
      }
    });
  }

  function init() {
    initTheme();
    markActiveNavLink();
  }

  return { init };
})();

/* ---------------------------------------------------------
   Lightweight toast notifications
   --------------------------------------------------------- */

const Toast = (() => {
  let container;

  function ensureContainer() {
    if (container) return container;
    container = document.createElement("div");
    container.setAttribute("aria-live", "polite");
    Object.assign(container.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      zIndex: 1000,
    });
    document.body.appendChild(container);
    return container;
  }

  function show(message, type = "success") {
    const el = document.createElement("div");
    el.textContent = message;
    const palette = {
      success: { bg: "#e7f5ec", color: "#1f7a4d", border: "#bbe5c8" },
      danger: { bg: "#fdecec", color: "#b91c1c", border: "#f3c6c6" },
      info: { bg: "#eef2ff", color: "#3730a3", border: "#c7d2fe" },
    }[type];

    Object.assign(el.style, {
      background: palette.bg,
      color: palette.color,
      border: `1px solid ${palette.border}`,
      padding: "12px 16px",
      borderRadius: "10px",
      fontSize: "13.5px",
      fontWeight: "600",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      minWidth: "220px",
    });

    ensureContainer().appendChild(el);
    setTimeout(() => {
      el.style.transition = "opacity 0.25s ease";
      el.style.opacity = "0";
      setTimeout(() => el.remove(), 250);
    }, 2600);
  }

  return { show };
})();

/* ---------------------------------------------------------
   Generic table row actions (view / approve / reject)
   Works against any table where rows carry [data-row]
   and action buttons carry [data-action] + [data-name].
   --------------------------------------------------------- */

const RowActions = (() => {
  function updatePendingBadge(delta) {
    const badge = document.querySelector("[data-pending-count]");
    if (!badge) return;
    const next = Math.max(0, parseInt(badge.textContent, 10) + delta);
    badge.textContent = next;
    if (next === 0) badge.style.display = "none";
  }

  function setRowStatus(row, status) {
    const badge = row.querySelector("[data-status-badge]");
    if (!badge) return;
    badge.className = `badge badge-${status}`;
    badge.textContent = status === "approved" ? "Approved" : "Rejected";
  }

  function handleClick(event) {
    const btn = event.target.closest("[data-action]");
    if (!btn) return;

    const row = btn.closest("[data-row]");
    const name = row?.getAttribute("data-name") || "This workspace";
    const action = btn.getAttribute("data-action");

    if (action === "view") {
      Toast.show(`Opening details for ${name}…`, "info");
      return;
    }

    if (action === "approve") {
      setRowStatus(row, "approved");
      updatePendingBadge(-1);
      Toast.show(`${name} approved`, "success");
      row.querySelectorAll("[data-action='approve'], [data-action='reject']").forEach(
        (b) => (b.disabled = true)
      );
      return;
    }

    if (action === "reject") {
      const confirmed = window.confirm(`Reject "${name}"? This cannot be undone.`);
      if (!confirmed) return;
      setRowStatus(row, "rejected");
      updatePendingBadge(-1);
      Toast.show(`${name} rejected`, "danger");
      row.querySelectorAll("[data-action='approve'], [data-action='reject']").forEach(
        (b) => (b.disabled = true)
      );
    }
  }

  function init() {
    document.body.addEventListener("click", handleClick);
  }

  return { init };
})();

document.addEventListener("DOMContentLoaded", () => {
  AdminLayout.init();
  RowActions.init();
});