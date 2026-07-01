/* ===========================
   auth.js — Masahati Project
   Login & Signup Logic
   =========================== */

'use strict';

/* ---- Toggle password visibility ---- */
document.querySelectorAll('.toggle-password').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;
    const input = document.getElementById(targetId);
    const icon = btn.querySelector('i');

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


function showToast(message, type = "success") {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.className = `${type} show`;

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}
/* ==========================
   LOGIN FORM
   ========================== */
const loginForm = document.getElementById('loginForm');

if (loginForm) {
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    let valid = true;

    const email = document.getElementById('email');
    const password = document.getElementById('password');

    clearError('email', 'emailError');
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
    try {

      const response = await fetch(
        'http://localhost/Masahati-Workspace/backend/api/auth/login.php',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email.value.trim(),
            password: password.value
          })
        }
      );


      const text = await response.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error("JSON parse error", err);
        showToast("Invalid server response", "error");
        submitBtn.textContent = 'Login';
        submitBtn.disabled = false;
        return;
      }

      if (data.success) {

        localStorage.setItem('token', data.data.token);

        localStorage.setItem(
          'user',
          JSON.stringify(data.data.user)
        );

        showToast("Welcome back 👋", "success");

        const role = data.data.user?.role;
        let redirectTo = "../index.html";
        if (role === "admin") redirectTo = "../admin/dashboard.html";
        else if (role === "owner") redirectTo = "../owner/dashboard.html";

        setTimeout(() => {
          window.location.href = redirectTo;
        }, 1500);

      } else {

        showToast(data.message, "error");

        submitBtn.textContent = 'Login';
        submitBtn.disabled = false;
      }

    } catch (error) {

      console.error(error);

      showToast("Server connection error", "error");

      submitBtn.textContent = 'Login';
      submitBtn.disabled = false;
    }
  });
}

/* ==========================
   SIGNUP FORM
   ========================== */
const signupForm = document.getElementById('signupForm');

if (signupForm) {
  signupForm.addEventListener('submit', async e => {
    e.preventDefault();
    let valid = true;

    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const role = document.querySelector('input[name="role"]:checked');
    const terms = document.getElementById('terms');

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
    try {

      const response = await fetch(
        'http://localhost/Masahati-Workspace/backend/api/auth/register.php',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: fullName.value.trim(),
            email: email.value.trim(),
            password: password.value,
            confirm_password: confirmPassword.value,
            is_owner: role.value === 'owner'
          })
        }
      );

      const data = await response.json();
      if (data.success) {


        showToast(data.message, "success");
        setTimeout(() => {
          window.location.href = '../index.html';
        }, 1500);

      } else {

        showToast(data.message, "error");
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign Up';
      }
    } catch (error) {

      console.error(error);

      showToast('Server connection error', 'error');

      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign Up';
    }
  });
}


