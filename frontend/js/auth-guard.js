/* ===========================
   auth-guard.js — Masahati Project
   Client-side route guard for /admin/ and /owner/ pages.

   NOTE: this only improves UX (hides pages from the wrong role in the
   browser). The real security boundary is enforced on the backend,
   where every protected endpoint validates the JWT and checks the
   user's role before returning any data.
   =========================== */

(function () {
  'use strict';

  const path = window.location.pathname;

  let requiredRole = null;
  if (path.includes('/admin/')) requiredRole = 'admin';
  else if (path.includes('/owner/')) requiredRole = 'owner';

  // Not a protected page, nothing to guard
  if (!requiredRole) return;

  function decodeJwtPayload(token) {
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(decodeURIComponent(escape(atob(base64))));
    } catch (err) {
      return null;
    }
  }

  function goToLogin() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.replace('../pages/login.html');
  }

  function goHome() {
    window.location.replace('../index.html');
  }

  const token = localStorage.getItem('token');
  const rawUser = localStorage.getItem('user');

  if (!token || !rawUser) {
    goToLogin();
    return;
  }

  let user;
  try {
    user = JSON.parse(rawUser);
  } catch (err) {
    goToLogin();
    return;
  }

  const payload = decodeJwtPayload(token);
  const nowInSeconds = Math.floor(Date.now() / 1000);

  // No payload, or token expired
  if (!payload || (payload.exp && payload.exp < nowInSeconds)) {
    goToLogin();
    return;
  }

  const roleFromToken = payload.data ? payload.data.role : payload.role;
  const effectiveRole = roleFromToken || user.role;

  if (effectiveRole !== requiredRole) {
    // Logged in, but wrong role for this section
    goHome();
  }
})();
