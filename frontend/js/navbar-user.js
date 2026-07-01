/* ===========================
   navbar-user.js — Masahati Project
   Single source of truth for populating the logged-in user's
   name + avatar in the top navbar, across both topbar layouts
   used in the project:
     - "profile-trigger" layout (owner/dashboard.html, my-workspace.html, add-workspace.html)
     - "user-dropdown-admin" layout (admin/*.html, owner/reviews.html, owner/edit-workspace.html)
   =========================== */

(function () {
  'use strict';

  const DEFAULT_AVATAR = '../assets/images/testimonial-4.jpg';

  function getStoredUser() {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch (err) {
      return null;
    }
  }

  function renderNavbarUser() {
    const user = getStoredUser();
    if (!user) return;

    // ---- Name (covers both layouts: it's always inside .info-admin-detalis h5) ----
    document.querySelectorAll('.info-admin-detalis h5').forEach((el) => {
      if (user.name) el.textContent = user.name;
    });

    // ---- Dropdown header name (different class per layout) ----
    document
      .querySelectorAll('.dropdown-username-header, .user-dropdown-name-admin')
      .forEach((el) => {
        if (user.name) el.textContent = user.name;
      });

    // ---- Avatar image (direct child of .profile-trigger OR .flex-info-admin) ----
    document
      .querySelectorAll('.profile-trigger > img, .flex-info-admin > img')
      .forEach((img) => {
        img.src = user.avatar || DEFAULT_AVATAR;
        img.onerror = () => {
          img.onerror = null;
          img.src = DEFAULT_AVATAR;
        };
      });
  }

  document.addEventListener('DOMContentLoaded', renderNavbarUser);
})();
