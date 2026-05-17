/* ===========================
main.js — Masahati Project
Global Interactive Behaviour
   =========================== */

'use strict';

/* ================================================================
1. DARK MODE TOGGLE
   ================================================================ */
(function initTheme() {
const saved = localStorage.getItem('masahati_theme') || 'light';
applyTheme(saved);
})();

function applyTheme(theme) {
document.documentElement.setAttribute('data-theme', theme);
localStorage.setItem('masahati_theme', theme);

  // Sync all theme-toggle icons on the page
document.querySelectorAll('.theme-toggle i').forEach(icon => {
    icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
});
}

document.addEventListener('DOMContentLoaded', () => {

  /* ----------- Theme toggle ----------- */
document.querySelectorAll('#themeToggle, .theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
    });
});

/* ================================================================
    2. USER AVATAR DROPDOWN
     ================================================================ */
const avatarBtns = document.querySelectorAll('#userAvatarBtn, .user-avatar-btn');
let dropdown = document.getElementById('userDropdown');

  // Inject dropdown HTML if it doesn't exist yet
if (!dropdown && avatarBtns.length > 0) {
    const container = document.createElement('div');
    container.style.position = 'relative';
    container.style.flexShrink = '0';

    const firstBtn = avatarBtns[0];
    firstBtn.parentNode.insertBefore(container, firstBtn);
    container.appendChild(firstBtn);

    dropdown = document.createElement('div');
    dropdown.id = 'userDropdown';
    dropdown.className = 'user-dropdown';

    // Try to load user info from session
    const session = getSessionUser();
    const userName  = session?.name  || 'User';
    const userEmail = session?.email || '';

    dropdown.innerHTML = `
    <div class="user-dropdown-header">
        <p>${escapeHtml(userName)}</p>
        ${userEmail ? `<span>${escapeHtml(userEmail)}</span>` : ''}
    </div>
    <a href="../pages/profile.html">
        <i class="fa-regular fa-user"></i> My Profile
    </a>
    <a href="../pages/favorites.html">
        <i class="fa-regular fa-heart"></i> Favorites
    </a>
    <div class="dropdown-divider"></div>
    <button class="dropdown-item dropdown-danger" id="logoutBtn">
        <i class="fa-solid fa-arrow-right-from-bracket"></i> Log Out
    </button>
    `;
    container.appendChild(dropdown);
}

  // Toggle dropdown open/close
avatarBtns.forEach(btn => {
    btn.addEventListener('click', e => {
    e.stopPropagation();
    if (dropdown) dropdown.classList.toggle('open');
    });
});

  // Close on outside click
document.addEventListener('click', () => {
    dropdown?.classList.remove('open');
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
    4. SCROLL-TO-TOP BUTTON
     ================================================================ */
let scrollBtn = document.getElementById('scrollTopBtn');
if (!scrollBtn) {
    scrollBtn = document.createElement('button');
    scrollBtn.id = 'scrollTopBtn';
    scrollBtn.className = 'scroll-top-btn';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    scrollBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    document.body.appendChild(scrollBtn);
}

function handleScroll() {
    if (window.scrollY > 320) {
    scrollBtn.classList.add('visible');
    } else {
    scrollBtn.classList.remove('visible');
    }
}

window.addEventListener('scroll', handleScroll, { passive: true });
scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

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
 