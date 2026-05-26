/* Shared dark mode + mobile sidebar */

(function () {
  const STORAGE_KEY = "masahati-theme";

  function updateIcons(theme) {
    document.querySelectorAll(".theme-btn i, .topbar-moon i").forEach((icon) => {
      if (theme === "dark") {
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun", "fa-regular");
      } else {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon", "fa-regular");
      }
    });
  }

  function applyTheme(theme) {
    document.body.classList.toggle("dark-mode", theme === "dark");
    updateIcons(theme);
  }

  const savedTheme = localStorage.getItem(STORAGE_KEY);
  applyTheme(savedTheme === "dark" ? "dark" : "light");

  document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".dark-icon, .theme-btn, .topbar-moon");

    buttons.forEach((button) => {
      button.addEventListener("click", function () {
        const nextTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
        localStorage.setItem(STORAGE_KEY, nextTheme);
        applyTheme(nextTheme);
      });
    });

    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const sidebar = document.querySelector(".sidebar");
    const mobileOverlay = document.getElementById("mobileOverlay");

    if (mobileMenuBtn && sidebar && mobileOverlay) {
      mobileMenuBtn.addEventListener("click", () => {
        sidebar.classList.add("open");
        mobileOverlay.classList.add("show");
      });

      mobileOverlay.addEventListener("click", () => {
        sidebar.classList.remove("open");
        mobileOverlay.classList.remove("show");
      });
    }
  });
})();