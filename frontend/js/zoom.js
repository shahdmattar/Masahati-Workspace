/* Shared page zoom across all pages */
(function () {
  const STORAGE_KEY = 'masahati-zoom';
  const MIN_ZOOM = 0.75;
  const MAX_ZOOM = 1.30;
  const STEP = 0.05;

  function clamp(value) {
    return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
  }

  function applyZoom(value) {
    const zoom = clamp(Number(value) || 1);
    document.documentElement.style.setProperty('--app-zoom', zoom);
    document.body.style.zoom = String(zoom);
    localStorage.setItem(STORAGE_KEY, String(zoom));
  }

  function getZoom() {
    return clamp(Number(localStorage.getItem(STORAGE_KEY)) || 1);
  }

  // Apply saved zoom immediately on every page load.
  applyZoom(getZoom());

  document.addEventListener('DOMContentLoaded', function () {
    applyZoom(getZoom());

    const zoomInButtons = document.querySelectorAll('[data-zoom="in"], .zoom-in');
    const zoomOutButtons = document.querySelectorAll('[data-zoom="out"], .zoom-out');
    const zoomResetButtons = document.querySelectorAll('[data-zoom="reset"], .zoom-reset');

    zoomInButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyZoom(getZoom() + STEP);
      });
    });

    zoomOutButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyZoom(getZoom() - STEP);
      });
    });

    zoomResetButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyZoom(1);
      });
    });
  });

  // Keep app zoom consistent when using Ctrl + / Ctrl - / Ctrl 0 inside the project.
  document.addEventListener('keydown', function (event) {
    if (!event.ctrlKey && !event.metaKey) return;

    const key = event.key;
    if (key === '+' || key === '=') {
      event.preventDefault();
      applyZoom(getZoom() + STEP);
    }

    if (key === '-' || key === '_') {
      event.preventDefault();
      applyZoom(getZoom() - STEP);
    }

    if (key === '0') {
      event.preventDefault();
      applyZoom(1);
    }
  });
})();
