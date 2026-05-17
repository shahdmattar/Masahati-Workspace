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
