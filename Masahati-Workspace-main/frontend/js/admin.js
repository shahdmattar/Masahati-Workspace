/* =========================================================
   Masahati Admin — table/list page behavior
   Sidebar collapse, dark-mode toggle, and the user dropdown
   are handled by the page's own inline script (copied from
   the real dashboard.html). This file only drives the
   view / approve / reject / delete / status-dropdown actions
   inside .admin-panel tables.
   ========================================================= */

/* ---------------------------------------------------------
   Lightweight toast notifications
   --------------------------------------------------------- */

const Toast = (() => {
  let container;

  function ensureContainer() {
    if (container) return container;
    container = document.createElement("div");
    container.className = "admin-toast-container";
    container.setAttribute("aria-live", "polite");
    document.body.appendChild(container);
    return container;
  }

  function show(message, type = "success") {
    const el = document.createElement("div");
    el.textContent = message;
    el.className = `admin-toast admin-toast-${type}`;
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
   Generic table row actions (view / approve / reject / delete)
   Works against any table where rows carry [data-row] +
   [data-name], and action buttons carry [data-action].
   --------------------------------------------------------- */

const RowActions = (() => {
  function updatePendingBadge(delta) {
    const badge = document.querySelector("[data-pending-count]");
    if (!badge) return;
    const next = Math.max(0, parseInt(badge.textContent, 10) + delta);
    badge.textContent = next;
    if (next === 0) badge.style.display = "none";
  }

  function updateTotalReviews(delta) {
    const totalEl = document.querySelector("[data-total-reviews]");
    if (!totalEl) return;
    const match = totalEl.textContent.match(/\d+/);
    if (!match) return;
    const next = Math.max(0, parseInt(match[0], 10) + delta);
    totalEl.textContent = totalEl.textContent.replace(/\d+/, next);
  }

  function setRowStatus(row, status) {
    const badge = row.querySelector("[data-status-badge]");
    if (!badge) return;
    badge.className = `status-badge status-badge-${status}`;
    badge.textContent = status === "approved" ? "Approved" : "Rejected";
  }

  function handleClick(event) {
    const btn = event.target.closest("[data-action]");
    if (!btn) return;

    const row = btn.closest("[data-row]");
    const name = row?.getAttribute("data-name") || "This item";
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
      return;
    }

    if (action === "delete") {
      const confirmed = window.confirm(`Delete "${name}"? This cannot be undone.`);
      if (!confirmed) return;
      row.classList.add("row-fade-out");
      Toast.show(`${name} deleted`, "danger");
      updateTotalReviews(-1);
      setTimeout(() => row.remove(), 250);
    }
  }

  function init() {
    document.body.addEventListener("click", handleClick);
  }

  return { init };
})();

/* ---------------------------------------------------------
   Status dropdown pills (Manage Workspaces table)
   Click a pill to open a small menu of status options.
   --------------------------------------------------------- */

const StatusDropdown = (() => {
  const labels = { approved: "Approved", pending: "Pending", rejected: "Rejected" };

  function closeAll(except) {
    document.querySelectorAll(".status-menu.open").forEach((menu) => {
      if (menu !== except) {
        menu.classList.remove("open");
        menu.previousElementSibling?.setAttribute("aria-expanded", "false");
      }
    });
  }

  function applyStatus(pill, status) {
    pill.className = `status-pill status-${status}`;
    pill.innerHTML = `${labels[status]}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg>`;
  }

  function handleClick(event) {
    const toggle = event.target.closest("[data-status-toggle]");
    const option = event.target.closest("[data-status]");

    if (toggle) {
      const menu = toggle.nextElementSibling;
      const isOpen = menu.classList.contains("open");
      closeAll();
      menu.classList.toggle("open", !isOpen);
      toggle.setAttribute("aria-expanded", String(!isOpen));
      return;
    }

    if (option && option.closest(".status-menu")) {
      const menu = option.closest(".status-menu");
      const pill = menu.previousElementSibling;
      const status = option.getAttribute("data-status");
      applyStatus(pill, status);
      pill.setAttribute("aria-expanded", "false");
      menu.classList.remove("open");
      Toast.show(`Status updated to ${labels[status]}`, "success");
      return;
    }

    closeAll();
  }

  function init() {
    document.body.addEventListener("click", handleClick);
  }

  return { init };
})();

document.addEventListener("DOMContentLoaded", () => {
  RowActions.init();
  StatusDropdown.init();
});