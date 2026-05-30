/* Home Search Tabs */

const searchTabs = document.querySelectorAll(".search-tabs button");
let selectedSearchType = "all";

searchTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    searchTabs.forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");

    const tabText = tab.textContent.trim().toLowerCase();
    if (tabText === "name") {
      selectedSearchType = "name";
    } else if (tabText === "city") {
      selectedSearchType = "city";
    } else if (tabText === "area") {
      selectedSearchType = "area";
    } else {
      selectedSearchType = "all";
    }
  });
});

/* Home Search Redirect */

const searchInput = document.querySelector(".search-box input");
const searchButton = document.querySelector(".search-box button");

function goToWorkspacesPage() {
  const searchValue = searchInput ? searchInput.value.trim() : "";

  localStorage.setItem("workspaceSearchValue", searchValue);
  localStorage.setItem("workspaceSearchType", selectedSearchType);

  window.location.href = "pages/workspaces.html";
}

if (searchButton) {
  searchButton.addEventListener("click", goToWorkspacesPage);
}

if (searchInput) {
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      goToWorkspacesPage();
    }
  });
}

/* Favorite Buttons */

const favoriteButtons = document.querySelectorAll(".favorite-btn");

favoriteButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();

    const icon = button.querySelector("i");

    if (!icon) return;

    icon.classList.toggle("fa-regular");
    icon.classList.toggle("fa-solid");

    button.classList.toggle("is-favorite");
  });
});

/* Workspace Card Click */
const workspaceCards = document.querySelectorAll(".workspace-card");

workspaceCards.forEach((card) => {
  card.addEventListener("click", () => {
    window.location.href = "pages/workspace-details.html";
  });
});

/* Prevent View Details link conflict */
const detailsButtons = document.querySelectorAll(".details-btn");
detailsButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
  });
});

const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const mobileOverlay = document.getElementById("mobileOverlay");
const mobileClose = document.getElementById("mobileClose");

if (menuToggle && mobileMenu && mobileOverlay && mobileClose) {
  menuToggle.addEventListener("click", () => {
    mobileMenu.classList.add("active");
    mobileOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  function closeMobileMenu() {
    mobileMenu.classList.remove("active");
    mobileOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  mobileClose.addEventListener("click", closeMobileMenu);
  mobileOverlay.addEventListener("click", closeMobileMenu);

  const mobileLinks = document.querySelectorAll(".mobile-links a");

  mobileLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });
}


/* Dark Mode */

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

function applySavedTheme() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");

    if (themeIcon) {
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun");
    }
  }
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");

  const isDark = document.body.classList.contains("dark-mode");

  localStorage.setItem("theme", isDark ? "dark" : "light");

  if (themeIcon) {
    themeIcon.classList.toggle("fa-moon", !isDark);
    themeIcon.classList.toggle("fa-sun", isDark);
  }
}

applySavedTheme();

if (themeToggle) {
  themeToggle.addEventListener("click", toggleTheme);
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

function getLoginPath() {
  const isInsidePages = window.location.pathname.includes("/pages/");
  return isInsidePages ? "login.html" : "pages/login.html";
}

function showGuestNavbar() {
  if (authActions) {
    authActions.classList.add("show");
  }

  if (userDropdown) {
    userDropdown.classList.remove("show");
    userDropdown.classList.remove("active");
  }
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

  if (navbarUserImage && user.image) {
    navbarUserImage.src = user.image;
  }
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