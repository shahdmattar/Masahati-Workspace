/* ===========================
   admin-dashboard.js — Masahati Project
   Admin Dashboard: loads real platform stats from the backend
   and replaces all hardcoded placeholder values.
   =========================== */

(function () {
  'use strict';

  const BASE_URL = 'http://localhost/Masahati-Workspace/backend/api';

  function getToken() {
    return localStorage.getItem('token');
  }

  // Name + avatar in the top navbar are handled centrally by navbar-user.js

  function renderStats(stats) {
    const cards = document.querySelectorAll('.group-status-flex .content-status h2');
    const values = [
      stats.total_workspaces,
      stats.pending_approvals,
      stats.total_users,
      stats.pending_approvals,
    ];

    cards.forEach((card, index) => {
      if (values[index] !== undefined) card.textContent = values[index];
    });

    const sidebarBadge = document.querySelector('.menu-badge');
    if (sidebarBadge) sidebarBadge.textContent = stats.pending_approvals;
  }

  async function loadStats() {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`${BASE_URL}/admin/stats.php`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) renderStats(data.data);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadStats();
  });
})();
