/* ===========================
   auth.js — Masahati Project
   Login & Signup Logic
   =========================== */

'use strict';

/* ---- Toggle password visibility ---- */
document.querySelectorAll('.toggle-password').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;
    const input    = document.getElementById(targetId);
    const icon     = btn.querySelector('i');

    if (!input) return;

    if (input.type === 'password') {
      input.type = 'text';
      icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
      input.type = 'password';
      icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
  });
});

/* ---- Helpers ---- */
function showError(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (input) input.classList.add('invalid');
  if (error) error.classList.add('show');
}

function clearError(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (input) input.classList.remove('invalid');
  if (error) error.classList.remove('show');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/* Clear errors on typing */
document.querySelectorAll('input, select').forEach(el => {
  el.addEventListener('input', () => {
    el.classList.remove('invalid');
    const sibling = el.closest('.form-group, .input-wrapper')
                      ?.parentElement
                      ?.querySelector('.input-error');
    if (sibling) sibling.classList.remove('show');
  });
});

/* ==========================
   LOGIN FORM
   ========================== */
const loginForm = document.getElementById('loginForm');

if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const email    = document.getElementById('email');
    const password = document.getElementById('password');

    clearError('email',    'emailError');
    clearError('password', 'passwordError');

    if (!email.value.trim() || !isValidEmail(email.value)) {
      showError('email', 'emailError');
      valid = false;
    }

    if (!password.value.trim()) {
      showError('password', 'passwordError');
      valid = false;
    }

    if (!valid) return;

    const submitBtn = loginForm.querySelector('.btn-primary');
    submitBtn.textContent = 'Logging in…';
    submitBtn.disabled = true;

    setTimeout(() => {
      sessionStorage.setItem('masahati_user', JSON.stringify({
        name:  'Ahmad User',
        email: email.value.trim(),
      }));
      window.location.href = '../index.html';
    }, 1000);
  });
}

/* ==========================
   SIGNUP FORM
   ========================== */
const signupForm = document.getElementById('signupForm');

if (signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const fullName        = document.getElementById('fullName');
    const email           = document.getElementById('email');
    const password        = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const role            = document.querySelector('input[name="role"]:checked');
    const terms           = document.getElementById('terms');

    // Clear all errors
    ['fullName', 'email', 'password', 'confirmPassword', 'role', 'terms'].forEach(id => {
      clearError(id, id + 'Error');
    });

    if (!fullName?.value.trim()) {
      showError('fullName', 'fullNameError');
      valid = false;
    }

    if (!email?.value.trim() || !isValidEmail(email.value)) {
      showError('email', 'emailError');
      valid = false;
    }

    if (!password?.value || password.value.length < 8) {
      showError('password', 'passwordError');
      valid = false;
    }

    if (!confirmPassword?.value || confirmPassword.value !== password?.value) {
      showError('confirmPassword', 'confirmPasswordError');
      valid = false;
    }

    if (!role) {
      const roleError = document.getElementById('roleError');
      if (roleError) roleError.classList.add('show');
      valid = false;
    }

    if (!terms?.checked) {
      const termsError = document.getElementById('termsError');
      if (termsError) termsError.classList.add('show');
      valid = false;
    }

    if (!valid) return;

    const submitBtn = signupForm.querySelector('.btn-primary');
    submitBtn.textContent = 'Creating account…';
    submitBtn.disabled = true;

    setTimeout(() => {
      sessionStorage.setItem('masahati_user', JSON.stringify({
        name:  fullName.value.trim(),
        email: email.value.trim(),
        role:  role.value,
      }));
      window.location.href = '../index.html';
    }, 1000);
  });
}
