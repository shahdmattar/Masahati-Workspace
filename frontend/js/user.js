/* ===========================
user.js — Masahati Project
Profile & Favorites Logic
   =========================== */

'use strict';

/* ================================================================
SHARED: Toggle password visibility (profile page)
   ================================================================ */
document.querySelectorAll('.toggle-password').forEach(btn => {
btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;
    const input    = document.getElementById(targetId);
    const icon     = btn.querySelector('i');
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
  const avatarBtn   = document.getElementById('avatarBtn');
  const avatarInput = document.getElementById('avatarInput');
  const previewAvs  = [
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
  profileForm.addEventListener('submit', e => {
    e.preventDefault();

    const fullName = document.getElementById('fullName');
    const newPwd   = document.getElementById('newPassword');
    const confPwd  = document.getElementById('confirmNewPassword');

    // Password match check
    if (newPwd.value && newPwd.value !== confPwd.value) {
      showToast('New passwords do not match.', 'error');
      confPwd.style.borderColor = 'var(--danger)';
      return;
    }

    confPwd.style.borderColor = '';

    // Update banner name
    const bannerName = document.getElementById('bannerName');
    if (bannerName && fullName.value.trim()) {
      bannerName.textContent = fullName.value.trim();
    }

    showToast('Profile updated successfully!', 'success');
  });

  /* ---- Cancel ---- */
  document.getElementById('cancelBtn')?.addEventListener('click', () => {
    profileForm.reset();
    showToast('Changes discarded.', 'info');
  });
}

/* ================================================================
   FAVORITES PAGE
   ================================================================ */
const favoritesGrid = document.getElementById('favoritesGrid');
const emptyState    = document.getElementById('emptyState');
const favCountEl    = document.getElementById('favCount');

if (favoritesGrid) {

  /* Track which cards are removed */
  let removedIds = new Set(
    JSON.parse(localStorage.getItem('masahati_removed_favs') || '[]')
  );

  /* Hide already-removed cards on load */
  favoritesGrid.querySelectorAll('.workspace-card').forEach(card => {
    const btn = card.querySelector('.fav-btn');
    const id  = btn?.dataset.id;
    if (id && removedIds.has(id)) {
      card.remove();
    }
  });

  updateFavCount();
  checkEmpty();

  /* ---- Toggle collapse ---- */
  const toggleBtn  = document.querySelector('.favorites-count-bar button');
  const toggleIcon = toggleBtn?.querySelector('i');
  let isCollapsed  = false;

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      isCollapsed = !isCollapsed;

      if (isCollapsed) {
        favoritesGrid.style.transition = 'opacity 0.3s ease, transform 0.3s ease, max-height 0.4s ease';
        favoritesGrid.style.overflow   = 'hidden';
        favoritesGrid.style.maxHeight  = '0';
        favoritesGrid.style.opacity    = '0';
        favoritesGrid.style.transform  = 'translateY(-10px)';
        if (toggleIcon) toggleIcon.style.transform = 'rotate(180deg)';
      } else {
        favoritesGrid.style.maxHeight  = '2000px';
        favoritesGrid.style.opacity    = '1';
        favoritesGrid.style.transform  = 'translateY(0)';
        favoritesGrid.style.overflow   = '';
        if (toggleIcon) toggleIcon.style.transform = 'rotate(0deg)';
      }

      if (toggleIcon) toggleIcon.style.transition = 'transform 0.3s ease';
    });
  }

  /* Remove from favorites on heart click */
  favoritesGrid.addEventListener('click', e => {
    const btn = e.target.closest('.fav-btn');
    if (!btn) return;

    const card = btn.closest('.workspace-card');
    const id   = btn.dataset.id;

    // Animate out
    card.style.transition = 'opacity 0.3s, transform 0.3s';
    card.style.opacity    = '0';
    card.style.transform  = 'scale(0.95)';

    setTimeout(() => {
      card.remove();
      removedIds.add(id);
      localStorage.setItem('masahati_removed_favs', JSON.stringify([...removedIds]));
      updateFavCount();
      checkEmpty();
      showToast('Removed from favorites.', 'info');
    }, 300);
  });

  function updateFavCount() {
    const count = favoritesGrid.querySelectorAll('.workspace-card').length;
    if (favCountEl) {
      favCountEl.textContent = `${count} workspace${count !== 1 ? 's' : ''} saved`;
    }
  }

  function checkEmpty() {
    const count = favoritesGrid.querySelectorAll('.workspace-card').length;
    if (emptyState) {
      emptyState.style.display     = count === 0 ? 'block' : 'none';
    }
    const section = document.getElementById('favoritesSection');
    if (section) {
      section.style.display = count === 0 ? 'none' : 'block';
    }
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
    error:   { bg: '#ef4444', icon: '✕' },
    info:    { bg: '#3b82f6', icon: 'i' },
  };

  const { bg, icon } = colors[type] || colors.info;

  const toast = document.createElement('div');
  toast.className = 'masahati-toast';
  toast.innerHTML = `<span>${icon}</span> ${message}`;

  Object.assign(toast.style, {
    position:      'fixed',
    bottom:        '32px',
    right:         '32px',
    background:    bg,
    color:         '#fff',
    padding:       '14px 24px',
    borderRadius:  '12px',
    fontFamily:    'Plus Jakarta Sans, sans-serif',
    fontSize:      '0.9rem',
    fontWeight:    '600',
    boxShadow:     '0 8px 24px rgba(0,0,0,0.15)',
    zIndex:        '9999',
    display:       'flex',
    alignItems:    'center',
    gap:           '10px',
    opacity:       '0',
    transform:     'translateY(12px)',
    transition:    'opacity 0.3s, transform 0.3s',
  });

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity   = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity   = '0';
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

/* ================================================================
    2. USER AVATAR DROPDOWN
     ================================================================ */
const userMenuBtn      = document.getElementById('userMenuBtn');
const userDropdown     = document.getElementById('userDropdown');
const userDropdownMenu = document.getElementById('userDropdownMenu');
const navbarUserImage  = document.getElementById('navbarUserImage');
const navbarUserName   = document.getElementById('navbarUserName');
const dropdownUserName = document.getElementById('dropdownUserName');
const authActions      = document.getElementById('authActions');

  // Populate user info from session
const sessionUser = getSessionUser();

if (sessionUser) {
    // Show user dropdown, hide guest login/signup buttons
    if (userDropdown)  userDropdown.style.display  = 'flex';
    if (authActions)   authActions.style.display   = 'none';

    // Fill in name & avatar
    if (navbarUserName)  navbarUserName.textContent  = sessionUser.name  || 'User';
    if (dropdownUserName) dropdownUserName.textContent = sessionUser.name || 'User';
    if (navbarUserImage && sessionUser.avatar) navbarUserImage.src = sessionUser.avatar;
} else {
    // Guest: hide user dropdown, show auth buttons
    if (userDropdown) userDropdown.style.display = 'none';
    if (authActions)  authActions.style.display  = 'flex';
}

  // Toggle dropdown open/close on avatar button click
if (userMenuBtn && userDropdownMenu) {
    userMenuBtn.addEventListener('click', e => {
        e.stopPropagation();
        userDropdownMenu.classList.toggle('open');
    });
}

  // Close on outside click
document.addEventListener('click', () => {
    userDropdownMenu?.classList.remove('open');
});

  // Logout
document.addEventListener('click', e => {
    if (e.target.closest('#logoutBtn')) {
        sessionStorage.removeItem('masahati_user');
        showToast('You have been logged out.', 'info');
        setTimeout(() => window.location.href = '../pages/login.html', 1200);
    }
});

/* ================================================================
    3. MOBILE NAVIGATION
     ================================================================ */
const hamburger = document.getElementById('navHamburger');
let mobileNav   = document.getElementById('mobileNav');

if (hamburger && !mobileNav) {
    // Build mobile nav panel
    mobileNav = document.createElement('div');
    mobileNav.id = 'mobileNav';
    mobileNav.className = 'mobile-nav';

    const backdrop = document.createElement('div');
    backdrop.className = 'mobile-nav-backdrop';

    const panel = document.createElement('div');
    panel.className = 'mobile-nav-panel';

    // Grab links from desktop nav
    const desktopLinks = document.querySelectorAll('.nav-links li a');
    const closeBtn = document.createElement('div');
    closeBtn.className = 'mobile-nav-close';
    closeBtn.innerHTML = '<button aria-label="Close menu"><i class="fa-solid fa-xmark"></i></button>';

    panel.appendChild(closeBtn);

    desktopLinks.forEach(link => {
    const a = document.createElement('a');
    a.href = link.href;
    a.className = link.className;
    a.innerHTML = link.innerHTML;
    panel.appendChild(a);
    });

    mobileNav.appendChild(backdrop);
    mobileNav.appendChild(panel);
    document.body.appendChild(mobileNav);

    hamburger.addEventListener('click', () => {
    mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';
    });

    function closeMobileNav() {
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
    }

    backdrop.addEventListener('click', closeMobileNav);
    closeBtn.querySelector('button').addEventListener('click', closeMobileNav);
}

/* ================================================================
    4. SCROLL-TO-TOP BUTTON (removed)
     ================================================================ */

/* ================================================================
    5. NAVBAR: active link & scroll shadow
     ================================================================ */
const navbar = document.querySelector('.navbar');
const path   = window.location.pathname.split('/').pop() || 'index.html';

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
    const target   = parseInt(el.dataset.count, 10);
    const suffix   = el.dataset.suffix || '';
    const duration = 1600;
    const start    = performance.now();
 
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
    document.querySelectorAll('#bannerName').forEach(el  => el.textContent = session.name);
    document.querySelectorAll('#bannerEmail').forEach(el => el.textContent = session.email);
    document.querySelectorAll('#fullName').forEach(el    => { el.value = session.name; });
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
    error:   { bg: '#ef4444', icon: '✕' },
    info:    { bg: '#3b82f6', icon: 'i' },
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
 