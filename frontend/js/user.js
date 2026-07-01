/* ===========================
user.js — Masahati Project
Profile & Favorites Logic
   =========================== */

'use strict';

/* ===============================
   TOKEN EXPIRY HELPERS
   =============================== */

// Decode a JWT payload (client-side only, no signature check)
function decodeJwtPayload(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

// Returns true if the token is missing, unreadable, or expired
function isTokenExpired(token) {
  if (!token) return true;
  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp) return true;
  return Date.now() >= payload.exp * 1000;
}

// Clears the session and sends the user back to login
function forceLogout(message) {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  showToast(message || 'Your session has expired. Please log in again.', 'error');

  setTimeout(() => {
    window.location.href = "../pages/login.html";
  }, 1200);
}

// Used on page load AND on a recurring timer, so an expired token
// logs the user out even if they just leave the page open.
function checkSessionValidity() {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (!token || !user) {
    window.location.href = "../pages/login.html";
    return false;
  }

  if (isTokenExpired(token)) {
    forceLogout('Your session has expired. Please log in again.');
    return false;
  }

  return true;
}

/* ===============================
   PROFILE & favorites PAGE - AUTH GUARD
   =============================== */

document.addEventListener("DOMContentLoaded", () => {
  checkSessionValidity();
});

// Re-check periodically while the page stays open
setInterval(checkSessionValidity, 30000);

const favoritesLink = document.querySelector('a[href="favorites.html"]');

function updateFavoritesVisibility() {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (!favoritesLink) return;

  if (!token || !user) {
    favoritesLink.style.display = "none";
  } else {
    favoritesLink.style.display = "flex";
  }
}

updateFavoritesVisibility();
/* ================================================================
SHARED: Toggle password visibility (profile page)
   ================================================================ */
document.querySelectorAll('.toggle-password').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;
    const input = document.getElementById(targetId);
    const icon = btn.querySelector('i');
    if (!input) return;

    if (input.type === 'password') {
      input.type = 'text';
      icon.classList.replace('fa-eye-slash', 'fa-eye');
    } else {
      input.type = 'password';
      icon.classList.replace('fa-eye', 'fa-eye-slash');
    }
  });
});

/* ================================================================
   PROFILE PAGE
   ================================================================ */
const profileForm = document.getElementById('profileForm');

if (profileForm) {

  /* ---- Avatar preview ---- */
  const avatarBtn = document.getElementById('avatarBtn');
  const avatarInput = document.getElementById('avatarInput');
  const previewAvs = [
    document.getElementById('previewAvatar'),
    document.getElementById('bannerAvatar'),
    document.getElementById('navAvatar'),
  ].filter(Boolean);

  if (avatarBtn && avatarInput) {
    avatarBtn.addEventListener('click', () => avatarInput.click());

    avatarInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;

      // 2 MB check
      if (file.size > 2 * 1024 * 1024) {
        showToast('Image must be under 2 MB.', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = ev => {
        previewAvs.forEach(img => { img.src = ev.target.result; });
      };
      reader.readAsDataURL(file);
    });
  }

  /* ---- Form submit ---- */
  profileForm.addEventListener('submit', async e => {
    e.preventDefault();

    const fullName = document.getElementById('fullName');
    const currentPwd = document.getElementById('currentPassword');
    const newPwd = document.getElementById('newPassword');
    const confPwd = document.getElementById('confirmNewPassword');

    const isChangingPassword = !!(currentPwd.value || newPwd.value || confPwd.value);

    // Password match check
    if (newPwd.value && newPwd.value !== confPwd.value) {
      showToast('New passwords do not match.', 'error');
      confPwd.style.borderColor = 'var(--danger)';
      return;
    }

    confPwd.style.borderColor = '';

    // All 3 password fields are required together
    if (isChangingPassword && (!currentPwd.value || !newPwd.value || !confPwd.value)) {
      showToast('Please fill in all password fields to change your password.', 'error');
      return;
    }

    if (!fullName.value.trim()) {
      showToast('Full name cannot be empty.', 'error');
      return;
    }

    // Make sure the session is still valid before calling the API
    const token = localStorage.getItem('token');
    if (!token || isTokenExpired(token)) {
      forceLogout('Your session has expired. Please log in again.');
      return;
    }

    const saveBtn = profileForm.querySelector('.btn-save');
    const originalBtnHtml = saveBtn ? saveBtn.innerHTML : '';
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
    }

    try {
      // FormData lets us send the optional avatar file alongside the
      // text fields in a single multipart request to update.php
      const formData = new FormData();
      formData.append('name', fullName.value.trim());

      if (isChangingPassword) {
        formData.append('current_password', currentPwd.value);
        formData.append('new_password', newPwd.value);
        formData.append('confirm_new_password', confPwd.value);
      }

      if (avatarInput && avatarInput.files && avatarInput.files[0]) {
        formData.append('avatar', avatarInput.files[0]);
      }

      const response = await fetch(
        'http://localhost/Masahati-Workspace/backend/api/users/update.php',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
            // No Content-Type header: the browser sets the correct
            // multipart boundary automatically for FormData.
          },
          body: formData
        }
      );

      const rawText = await response.text();
      let resData;
      try {
        resData = JSON.parse(rawText);
      } catch (err) {
        console.error('JSON parse error', err);
        showToast('Invalid server response', 'error');
        return;
      }

      // Expired/invalid token while submitting -> log the user out
      if (response.status === 401 || resData.code === 'INVALID_TOKEN' || resData.code === 'NO_TOKEN') {
        forceLogout(resData.message || 'Your session has expired. Please log in again.');
        return;
      }

      if (!resData.success) {
        showToast(resData.message || 'Failed to update profile.', 'error');
        return;
      }

      // Sync localStorage + UI with the data returned from the server
      const updatedUser = resData.data && resData.data.user;
      if (updatedUser) {
        const bannerName = document.getElementById('bannerName');
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const mergedUser = {
          ...storedUser,
          name: updatedUser.name,
          email: updatedUser.email,
          avatar: updatedUser.avatar || storedUser.avatar
        };
        localStorage.setItem('user', JSON.stringify(mergedUser));

        if (bannerName) bannerName.textContent = mergedUser.name;

        previewAvs.forEach(img => {
          if (mergedUser.avatar) img.src = mergedUser.avatar;
        });

        const navbarUserImage = document.getElementById('navbarUserImage');
        if (navbarUserImage && mergedUser.avatar) navbarUserImage.src = mergedUser.avatar;

        const navbarUserName = document.getElementById('navbarUserName');
        if (navbarUserName) navbarUserName.textContent = mergedUser.name;

        const dropdownUserName = document.getElementById('dropdownUserName');
        if (dropdownUserName) dropdownUserName.textContent = mergedUser.name;
      }

      // Clear password fields after a successful save
      currentPwd.value = '';
      newPwd.value = '';
      confPwd.value = '';

      showToast('Profile updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Connection error to server', 'error');
    } finally {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalBtnHtml;
      }
    }
  });

  /* ---- Cancel ---- */
  document.getElementById('cancelBtn')?.addEventListener('click', () => {
    profileForm.reset();
    showToast('Changes discarded.', 'info');
  });
}

/* ================================================================
   FAVORITES PAGE (Dynamic Fetch & Render)
   ================================================================ */
const favoritesGrid = document.getElementById('favoritesGrid');
const emptyState = document.getElementById('emptyState');
const favCountEl = document.getElementById('favCount');

// Check if the current page is the favorites page
if (favoritesGrid) {

  // Fetch favorites from the backend API
  const fetchFavorites = async () => {
    const token = localStorage.getItem("token");
    const apiUrl = "http://localhost/Masahati-Workspace/backend/api/favorites/get.php";

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      // Get the raw text first to see what PHP is actually outputting
      const rawText = await response.text();

      const resData = JSON.parse(rawText);

      if (response.status === 401 || resData.code === "INVALID_TOKEN" || resData.code === "NO_TOKEN") {
        forceLogout(resData.message || 'Your session has expired. Please log in again.');
        return;
      }

      if (resData.success) {
        renderFavorites(resData.data);
      } else {
        showToast(resData.message || "Failed to load favorites", "error");
        checkEmpty(0);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
      showToast("Connection error to server", "error");
      checkEmpty(0);
    }
  };
  // Render workspace cards dynamically inside the grid
  const renderFavorites = (workspaces) => {
    favoritesGrid.innerHTML = ""; // Clear existing static cards

    if (!workspaces || workspaces.length === 0) {
      checkEmpty(0);
      return;
    }

    workspaces.forEach(workspace => {
      // Use the first image from the array, or a default placeholder fallback
      const mainImage = workspace.images && workspace.images.length > 0
        ? workspace.images[0].image_path
        : "../assets/images/work-hub.png";

      // Format electricity status element
      const electricityStatus = parseInt(workspace.electricity) === 1
        ? '<span class="status-available">Available</span>'
        : '<span class="status-unavailable">Not Available</span>';

      // Build the card HTML layout structure
      const card = document.createElement('div');
      card.className = 'workspace-card fav-card';
      card.innerHTML = `
        <div class="workspace-card-img">
            <img src="${mainImage}" alt="${escapeHtml(workspace.workspace_name)}" onerror="this.src='../assets/images/work-hub.png';" />
            <button class="fav-btn active" data-id="${workspace.id}" aria-label="Remove from favorites">
                <i class="fa-solid fa-heart"></i>
            </button>
        </div>
        <div class="workspace-card-body">
            <h3>${escapeHtml(workspace.workspace_name)}</h3>
            <div class="workspace-card-meta-top">
                <p class="workspace-card-location"><i class="fa-solid fa-location-dot"></i> ${escapeHtml(workspace.city)} (${escapeHtml(workspace.area)})</p>
                <span class="workspace-card-rating">
                   <i class="fa-solid fa-star star"></i> 4.5 
                   <span style="color:var(--text-light);font-weight:400">(12)</span>
                </span>
            </div>
            <div class="workspace-card-meta">
                <span class="meta-item"><i class="fa-solid fa-bolt"></i> ${electricityStatus}</span>
                <span class="meta-item"><i class="fa-solid fa-wifi"></i> ${escapeHtml(workspace.internet || 'Fast')}</span>
                <span class="meta-item"><i class="fa-regular fa-user"></i> ${escapeHtml(workspace.seating || '0')} Seats</span>
                <span class="meta-item"><i class="fa-regular fa-clock"></i> ${workspace.hours_from.substring(0, 5)} – ${workspace.hours_to.substring(0, 5)}</span>
            </div>
            <div style="margin-top: 10px; font-weight: bold; color: var(--primary);">₪${workspace.price_per_hour} / Hour</div>

            <a href="workspace-details.html?workspace_id=${workspace.id}" class="btn-view-details" style="margin-top:10px;">View Details →</a>
        </div>
      `;
      favoritesGrid.appendChild(card);
    });

    updateFavCount(workspaces.length);
    checkEmpty(workspaces.length);
  };

  // Remove workspace from favorites when the heart icon button is clicked
  favoritesGrid.addEventListener('click', async (e) => {
    const btn = e.target.closest('.fav-btn');
    if (!btn) return;

    const card = btn.closest('.workspace-card');
    const workspaceId = btn.dataset.id;
    const token = localStorage.getItem("token");

    // Optimistic UI update: Animate card out immediately for responsive feel
    card.style.transition = 'opacity 0.3s, transform 0.3s';
    card.style.opacity = '0';
    card.style.transform = 'scale(0.95)';

    setTimeout(async () => {
      card.remove();

      // Recalculate layout metrics instantly
      const currentCount = favoritesGrid.querySelectorAll('.workspace-card').length;
      updateFavCount(currentCount);
      checkEmpty(currentCount);

      // Perform backend deletion request asynchronously
      try {
        const removeUrl = "http://localhost/Masahati-Workspace/backend/api/favorites/toggle.php";
        await fetch(removeUrl, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ workspace_id: workspaceId })
        });

        showToast('Removed from favorites.', 'info');
      } catch (err) {
        console.error("Error removing favorite from DB:", err);
      }
    }, 300);
  });

  function updateFavCount(count) {
    if (favCountEl) {
      favCountEl.textContent = `${count} workspace${count !== 1 ? 's' : ''} saved`;
    }
  }

  function checkEmpty(count) {
    if (emptyState) {
      emptyState.style.display = count === 0 ? 'block' : 'none';
    }
    const section = document.getElementById('favoritesSection');
    if (section) {
      section.style.display = count === 0 ? 'none' : 'block';
    }
  }

  // Initial call to populate the grid on load
  fetchFavorites();

  /* ---- Count Bar Smooth Collapse Animation Trigger ---- */
  const toggleBtn = document.querySelector('.favorites-count-bar button');
  const toggleIcon = toggleBtn?.querySelector('i');
  let isCollapsed = false;

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      isCollapsed = !isCollapsed;
      if (isCollapsed) {
        favoritesGrid.style.transition = 'opacity 0.3s ease, transform 0.3s ease, max-height 0.4s ease';
        favoritesGrid.style.overflow = 'hidden';
        favoritesGrid.style.maxHeight = '0';
        favoritesGrid.style.opacity = '0';
        favoritesGrid.style.transform = 'translateY(-10px)';
        if (toggleIcon) toggleIcon.style.transform = 'rotate(180deg)';
      } else {
        favoritesGrid.style.maxHeight = '2000px';
        favoritesGrid.style.opacity = '1';
        favoritesGrid.style.transform = 'translateY(0)';
        favoritesGrid.style.overflow = '';
        if (toggleIcon) toggleIcon.style.transform = 'rotate(0deg)';
      }
      if (toggleIcon) toggleIcon.style.transition = 'transform 0.3s ease';
    });
  }
}

/* ================================================================
   TOAST NOTIFICATION
   ================================================================ */
function showToast(message, type = 'success') {
  // Remove existing toast
  document.querySelector('.masahati-toast')?.remove();

  const colors = {
    success: { bg: '#1a3c34', icon: '✓' },
    error: { bg: '#ef4444', icon: '✕' },
    info: { bg: '#3b82f6', icon: 'i' },
  };

  const { bg, icon } = colors[type] || colors.info;

  const toast = document.createElement('div');
  toast.className = 'masahati-toast';
  toast.innerHTML = `<span>${icon}</span> ${message}`;

  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '32px',
    right: '32px',
    background: bg,
    color: '#fff',
    padding: '14px 24px',
    borderRadius: '12px',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    fontSize: '0.9rem',
    fontWeight: '600',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    zIndex: '9999',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    opacity: '0',
    transform: 'translateY(12px)',
    transition: 'opacity 0.3s, transform 0.3s',
  });

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(12px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
/* ===========================
main.js — Masahati Project
Global Interactive Behaviour
   =========================== */

'use strict';

/* ================================================================
1. DARK MODE TOGGLE
   ================================================================ */
(function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    document.body.classList.add('dark-mode');
    const icon = document.getElementById('themeIcon');
    if (icon) {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    }
  }
})();

function applyTheme(isDark) {
  document.body.classList.toggle('dark-mode', isDark);
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  const icon = document.getElementById('themeIcon');
  if (icon) {
    icon.classList.toggle('fa-moon', !isDark);
    icon.classList.toggle('fa-sun', isDark);
  }
}

document.addEventListener('DOMContentLoaded', () => {

  /* ----------- Theme toggle ----------- */
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.body.classList.contains('dark-mode');
      applyTheme(!isDark);
    });
  }

  /* ----------- Mobile menu (existing HTML structure) ----------- */
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileClose = document.getElementById('mobileClose');

  if (menuToggle && mobileMenu && mobileOverlay && mobileClose) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.add('active');
      mobileOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    function closeMobileMenu() {
      mobileMenu.classList.remove('active');
      mobileOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    mobileClose.addEventListener('click', closeMobileMenu);
    mobileOverlay.addEventListener('click', closeMobileMenu);
    document.querySelectorAll('.mobile-links a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  /* ===============================
     Navbar Auth State
  ================================= */

  const authActions = document.querySelector("#authActions");
  const userDropdown = document.querySelector("#userDropdown");
  const userMenuBtn = document.querySelector("#userMenuBtn");
  const logoutBtn = document.querySelector("#logoutBtn");

  const navbarUserName = document.querySelector("#navbarUserName");
  const dropdownUserName = document.querySelector("#dropdownUserName");
  const navbarUserImage = document.querySelector("#navbarUserImage");
  const dashboardLink = document.querySelector("#dashboardLink");
  const dashboardLinkMobile = document.querySelector("#dashboardLinkMobile");

  function getLoginPath() {
    const isInsidePages = window.location.pathname.includes("/pages/");
    return isInsidePages ? "login.html" : "pages/login.html";
  }

  function getDashboardPath(role) {
    if (role === "admin") return "../admin/dashboard.html";
    if (role === "owner") return "../owner/dashboard.html";
    return "#";
  }

  function updateDashboardNav(user) {
    const role = user?.role;
    const show = role === "admin" || role === "owner";
    const href = getDashboardPath(role);

    [dashboardLink, dashboardLinkMobile].forEach(link => {
      if (!link) return;
      if (show) {
        link.href = href;
        link.classList.remove("hidden");
      } else {
        link.classList.add("hidden");
      }
    });
  }

  function hideDashboardNav() {
    [dashboardLink, dashboardLinkMobile].forEach(link => {
      if (link) link.classList.add("hidden");
    });
  }

  function showGuestNavbar() {
    if (authActions) {
      authActions.classList.add("show");
    }

    if (userDropdown) {
      userDropdown.classList.remove("show");
      userDropdown.classList.remove("active");
    }

    hideDashboardNav();
  }

  function showLoggedInNavbar(user) {
    if (authActions) {
      authActions.classList.remove("show");
    }

    if (userDropdown) {
      userDropdown.classList.add("show");
    }

    if (navbarUserName) {
      navbarUserName.textContent = user.name || "User";
    }

    if (dropdownUserName) {
      dropdownUserName.textContent = user.name || "User";
    }

    if (navbarUserImage && user.avatar) {
      navbarUserImage.src = user.avatar;
    }

    updateDashboardNav(user);
  }

  function checkAuthState() {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      showGuestNavbar();
      return;
    }

    try {
      const user = JSON.parse(userData);
      showLoggedInNavbar(user);
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      showGuestNavbar();
    }
  }

  checkAuthState();

  /* ===============================
     User Dropdown Toggle
  ================================= */

  if (userDropdown && userMenuBtn) {
    userMenuBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      userDropdown.classList.toggle("active");
    });

    document.addEventListener("click", () => {
      userDropdown.classList.remove("active");
    });

    userDropdown.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }

  /* ===============================
     Logout
  ================================= */

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      showGuestNavbar();

      window.location.href = getLoginPath();
    });
  }

  /* ================================================================
      4. SCROLL-TO-TOP BUTTON (removed)
       ================================================================ */

  /* ================================================================
      5. NAVBAR: active link & scroll shadow
       ================================================================ */
  const navbar = document.querySelector('.navbar');
  const path = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-links li a').forEach(link => {
    const linkPage = link.getAttribute('href')?.split('/').pop();
    if (linkPage === path) link.classList.add('active');
  });

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.style.boxShadow = window.scrollY > 8
        ? '0 4px 24px rgba(0,0,0,0.1)'
        : '';
    }, { passive: true });
  }

  /* ================================================================
      6. FAVORITE BUTTONS (toggle heart on any page)
       ================================================================ */
  let savedFavs = new Set(
    JSON.parse(localStorage.getItem('masahati_favs') || '[]')
  );

  // Apply saved state on page load
  document.querySelectorAll('.fav-btn').forEach(btn => {
    const id = btn.dataset.id;
    if (id && savedFavs.has(id)) {
      btn.classList.add('active');
      const icon = btn.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-heart';
    }
  });

  // Handle click
  document.addEventListener('click', e => {
    const btn = e.target.closest('.fav-btn');
    if (!btn) return;
    const id = btn.dataset.id;
    if (!id) return;

    btn.classList.toggle('active');
    const icon = btn.querySelector('i');

    if (btn.classList.contains('active')) {
      if (icon) icon.className = 'fa-solid fa-heart';
      savedFavs.add(id);
      showToast('Added to favorites!', 'success');
    } else {
      if (icon) icon.className = 'fa-regular fa-heart';
      savedFavs.delete(id);
      showToast('Removed from favorites.', 'info');
    }

    localStorage.setItem('masahati_favs', JSON.stringify([...savedFavs]));
  });

  /* ================================================================
      7. HERO SEARCH BAR
       ================================================================ */
  const heroForm = document.getElementById('heroSearchForm');
  if (heroForm) {
    heroForm.addEventListener('submit', e => {
      e.preventDefault();
      const q = heroForm.querySelector('input')?.value.trim();
      if (q) {
        window.location.href = `pages/workspaces.html?q=${encodeURIComponent(q)}`;
      }
    });
  }

  /* ================================================================
     8. CATEGORY PILLS FILTER
     ================================================================ */
  document.querySelectorAll('.category-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const category = pill.dataset.category || 'all';
      filterWorkspacesByCategory(category);
    });
  });

  function filterWorkspacesByCategory(category) {
    const cards = document.querySelectorAll('.workspace-card');
    let visible = 0;

    cards.forEach(card => {
      if (category === 'all' || card.dataset.category === category) {
        card.style.display = '';
        card.classList.remove('fade-in-up');
        // Force reflow for re-animation
        void card.offsetWidth;
        card.classList.add('fade-in-up');
        visible++;
      } else {
        card.style.display = 'none';
      }
    });

    // Update count badge if present
    const countEl = document.getElementById('workspaceCount');
    if (countEl) countEl.textContent = `${visible} workspace${visible !== 1 ? 's' : ''} found`;
  }

  /* ================================================================
     9. INTERSECTION OBSERVER — animate on scroll
     ================================================================ */
  const observeTargets = document.querySelectorAll(
    '.feature-card, .workspace-card, .stat-card, .cta-banner'
  );

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-up');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    observeTargets.forEach(el => {
      el.style.opacity = '0';
      io.observe(el);
    });
  }

  /* ================================================================
     10. COUNTERS — animate numbers in hero stats
     ================================================================ */
  const counters = document.querySelectorAll('[data-count]');

  if (counters.length) {
    const counterIO = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterIO.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();

    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3); // ease-out cubic
      el.textContent = Math.round(ease * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ================================================================
     11. POPULATE USER INFO FROM SESSION
     ================================================================ */
  const session = getSessionUser();
  if (session) {
    document.querySelectorAll('#bannerName').forEach(el => el.textContent = session.name);
    document.querySelectorAll('#bannerEmail').forEach(el => el.textContent = session.email);
    document.querySelectorAll('#fullName').forEach(el => { el.value = session.name; });
  }

  /* ================================================================
     12. SEARCH INPUT — clear on Escape
     ================================================================ */
  document.querySelectorAll('input[type="search"], .nav-search input').forEach(input => {
    input.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        input.value = '';
        input.blur();
      }
    });
  });

  /* ================================================================
     13. CTA BUTTON (generic)
     ================================================================ */
  document.querySelectorAll('[data-cta="browse"]').forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.href = 'pages/workspaces.html';
    });
  });

}); // end DOMContentLoaded

/* ================================================================
   UTILITIES
   ================================================================ */

/**
 * Show a toast notification.
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 */
function showToast(message, type = 'success') {
  // Remove any existing toast
  document.querySelectorAll('.masahati-toast').forEach(t => t.remove());

  const palette = {
    success: { bg: '#1a3c34', icon: '✓' },
    error: { bg: '#ef4444', icon: '✕' },
    info: { bg: '#3b82f6', icon: 'i' },
  };
  const { bg, icon } = palette[type] || palette.info;

  const toast = document.createElement('div');
  toast.className = 'masahati-toast';
  toast.innerHTML = `
    <div class="masahati-toast-icon">${icon}</div>
    <span>${escapeHtml(message)}</span>
  `;
  toast.style.background = bg;
  document.body.appendChild(toast);

  // Trigger transition
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 320);
  }, 3200);
}

/**
 * Safely escape HTML to avoid XSS in dynamic content.
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Retrieve logged-in user from sessionStorage.
 */
function getSessionUser() {
  try {
    return JSON.parse(sessionStorage.getItem('masahati_user') || 'null');
  } catch {
    return null;
  }
}

// Expose globally for other scripts
window.masahati = { showToast, getSessionUser, escapeHtml };



document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return;

  const bannerAvatar = document.getElementById("bannerAvatar");
  const bannerName = document.getElementById("bannerName");
  const bannerEmail = document.getElementById("bannerEmail");
  const previewAvatar = document.getElementById("previewAvatar");
  const fullName = document.getElementById("fullName");

  if (bannerAvatar) {
    bannerAvatar.src = user.avatar || "../assets/images/avatar.jpeg";
  }

  if (bannerName) {
    bannerName.textContent = user.name || "User";
  }

  if (bannerEmail) {
    bannerEmail.textContent = user.email || "";
  }

  if (previewAvatar) {
    previewAvatar.src = user.avatar || "../assets/images/avatar.jpeg";
  }
  if (fullName) {
    fullName.value = user.name || "";
  }
});

/* ================================================================
   PROFILE STATS (Favorites count + Reviews written count)
   ================================================================ */
function loadProfileStats() {
  const favCountEl = document.getElementById('favCountStat');
  const reviewCountEl = document.getElementById('reviewCountStat');

  // Only run this on the profile page (elements won't exist elsewhere)
  if (!favCountEl && !reviewCountEl) return;

  const token = localStorage.getItem('token');
  if (!token) return;

  fetch('http://localhost/Masahati-Workspace/backend/api/users/stats.php', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(resData => {
      if (!resData.success) return;
      if (favCountEl) favCountEl.textContent = resData.data.favorites_count;
      if (reviewCountEl) reviewCountEl.textContent = resData.data.reviews_count;
    })
    .catch(err => console.error('Error loading profile stats:', err));
}

document.addEventListener('DOMContentLoaded', loadProfileStats);