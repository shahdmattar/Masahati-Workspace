/* ===========================
   dashboard.js — Masahati Project
   Owner Dashboard: loads real stats + owner info from the backend
   and replaces all hardcoded placeholder values.
   =========================== */

(function () {
  'use strict';

  const BASE_URL = 'http://localhost/Masahati-Workspace/backend/api';

  function getToken() {
    return localStorage.getItem('token');
  }

  function getStoredUser() {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch (err) {
      return null;
    }
  }

  /* ---- Welcome header (name + avatar) ---- */
  function renderOwnerHeader(user) {
    if (!user) return;

    const nameEl = document.querySelector('.hero-left h1');
    if (nameEl) {
      const firstName = (user.name || '').split(' ')[0] || user.name || 'Owner';
      nameEl.textContent = `Welcome back, ${firstName}! 👋`;
    }

    const avatarEl = document.querySelector('.hero-left .avatar');
    if (avatarEl && user.avatar) {
      avatarEl.src = user.avatar;
    }
    // Top bar name + avatar is already handled by admin-layout.js
  }

  /* ---- Stats cards ---- */
  function renderStats(stats) {
    const statCards = document.querySelectorAll('.stats .stat');
    if (statCards.length < 4) return;

    const values = [
      stats.total_workspaces,
      stats.pending_workspaces,
      stats.average_rating,
      stats.total_reviews,
    ];

    statCards.forEach((card, index) => {
      const h2 = card.querySelector('h2');
      if (h2) h2.textContent = values[index] ?? 0;
    });
  }

  async function loadStats() {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`${BASE_URL}/owner/stats.php`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        renderStats(data.data);
      }
    } catch (err) {
      console.error('Failed to load owner stats:', err);
    }
  }

  /* ---- Quick actions wiring ---- */
  function wireQuickActions() {
    const actions = document.querySelectorAll('.actions-box .action');
    const targets = ['my-workspace.html', 'add-workspace.html', 'reviews.html', '../pages/profile.html'];

    actions.forEach((action, index) => {
      const target = targets[index];
      if (!target) return;
      action.style.cursor = 'pointer';
      action.addEventListener('click', () => {
        window.location.href = target;
      });
    });

    const editProfileBtn = document.querySelector('.hero-left .edit');
    if (editProfileBtn) {
      editProfileBtn.addEventListener('click', () => {
        window.location.href = '../pages/profile.html';
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderOwnerHeader(getStoredUser());
    wireQuickActions();
    loadStats();
  });
})();
