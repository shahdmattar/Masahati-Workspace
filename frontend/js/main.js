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
// Select elements
const next1 = document.getElementById('next1');
const next2 = document.getElementById('next2');
const prev1 = document.getElementById('prev1');
const prev2 = document.getElementById('prev2');

const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const step3 = document.getElementById('step-3');
const progressBar = document.getElementById('progress-bar');

const loader = document.getElementById('loader');
const titleLoader = document.getElementById(`titleLoader`);
const confirmation = document.getElementById('confirmation');

// Event Listeners for Next Buttons
if (next1 && step1 && step2 && progressBar) {
    next1.addEventListener('click', function() {
        step1.classList.remove('active');
        step2.classList.add('active');
        progressBar.style.width = '40%';
    });
}

if (next2 && step2 && step3 && progressBar && loader && titleLoader && confirmation) {
    next2.addEventListener('click', function() {
        step2.classList.remove('active');
        step3.classList.add('active');
        progressBar.style.width = '80%';

        // Show loader for 3 seconds, then show confirmation
        loader.style.display = 'block';
        setTimeout(function() {
            loader.style.display = 'none';
            titleLoader.style.display='none';
            confirmation.style.display = 'block';
            progressBar.style.width = '100%';
        }, 3000);
    });
}

// Event Listeners for Previous Buttons
if (prev1 && step1 && step2 && progressBar) {
    prev1.addEventListener('click', function() {
        step2.classList.remove('active');
        step1.classList.add('active');
        progressBar.style.width = '0%';
    });
}

if (prev2 && step2 && step3 && progressBar) {
    prev2.addEventListener('click', function() {
        step3.classList.remove('active');
        step2.classList.add('active');
        progressBar.style.width = '40%';
    });
}


// -------------------
// Custom dropdown handler (all .dropdown on the page)
function setDropdownLabel(toggle, text) {
    let label = toggle.querySelector('.dropdown-label');
    if (!label) {
        label = document.createElement('span');
        label.className = 'dropdown-label';
        const arrow = toggle.querySelector('.arrow');
        toggle.insertBefore(label, arrow || null);
    }
    label.textContent = text;
}

function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menuItems = dropdown.querySelectorAll('.dropdown-menu div');
        if (!toggle || !menuItems.length) return;

        const defaultItem = menuItems[dropdown.dataset.defaultIndex || 0] || menuItems[0];
        const defaultText = (dropdown.dataset.default || defaultItem.textContent).trim();
        setDropdownLabel(toggle, defaultText);
        menuItems.forEach(item => item.classList.remove('active'));
        defaultItem.classList.add('active');

        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdowns.forEach(d => {
                if (d !== dropdown) d.classList.remove('open');
            });
            dropdown.classList.toggle('open');
        });

        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                setDropdownLabel(toggle, item.textContent.trim());
                menuItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                dropdown.classList.remove('open');
            });
        });
    });

    document.addEventListener('click', (e) => {
        dropdowns.forEach(dropdown => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('open');
            }
        });
    });
}

initDropdowns();

// -------------------
// Get all custom select containers
const allSelects = document.querySelectorAll('.custom-select');

allSelects.forEach(select => {
    const selectBtn = select.querySelector('.select-btn');
    const selectMenu = select.querySelector('.select-menu');
    const menuItems = selectMenu.querySelectorAll('li');

    // Toggle menu visibility for each select
    selectBtn.addEventListener('click', function() {
        selectMenu.classList.toggle('open');
        selectBtn.classList.toggle('active'); // Rotate the arrow
    });

    // Set first option as default
    if (menuItems.length) {
        const firstValue = menuItems[0].getAttribute('data-value') || menuItems[0].textContent.trim();
        selectBtn.innerHTML = `${firstValue} <span class=" bx bx-chevron-down arrow"></span>`;
        menuItems[0].classList.add('active');
    }

    // Update button text and close menu when an option is clicked
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const selectedValue = item.getAttribute('data-value') || item.textContent.trim();
            selectBtn.innerHTML = `${selectedValue} <span class=" bx bx-chevron-down arrow"></span>`;
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            selectMenu.classList.remove('open');
            selectBtn.classList.remove('active');
        });
    });

    // Close the menu if clicking outside
    document.addEventListener('click', function(event) {
        if (!select.contains(event.target)) {
            selectMenu.classList.remove('open');
            selectBtn.classList.remove('active');
        }
    });
});

// Custom Country Dropdown Handler
document.querySelectorAll('.country-dropdown').forEach(dropdown => {
    const toggle = dropdown.querySelector('.country-dropdown-toggle');
    const menu = dropdown.querySelector('.country-dropdown-menu');
    const menuItems = dropdown.querySelectorAll('.country-dropdown-menu li');
    const selectedInfo = dropdown.querySelector('.selected-country-info');
    const hiddenInput = dropdown.querySelector('.country-code-input');

    // Toggle menu
    toggle.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdown.classList.toggle('open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
        }
    });

    // Handle selection
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Get data attributes
            const code = item.getAttribute('data-code');
            const flagUrl = item.getAttribute('data-flag-url');
            const imgEl = item.querySelector('img');
            const countryName = imgEl ? imgEl.getAttribute('alt') : 'Flag';

            // Update toggle display
            selectedInfo.innerHTML = `
                <img src="${flagUrl}" class="flag-img" alt="${countryName}">
                <span class="country-code-val">${code}</span>
            `;

            // Update hidden input
            if (hiddenInput) {
                hiddenInput.value = code;
                hiddenInput.dispatchEvent(new Event('change'));
            }

            // Update active state in menu
            menuItems.forEach(li => li.classList.remove('active'));
            item.classList.add('active');

            // Close menu
            dropdown.classList.remove('open');
        });
    });
});

// Sidebar: highlight active nav item (page + hash for Add workspace)
function initSidebarActiveNav() {
    const menuLinks = document.querySelectorAll('.sidebar .sidebar-content .menu-list .menu-link[href]');
    if (!menuLinks.length) return;

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const currentHash = window.location.hash;

    menuLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;

        const hashIndex = href.indexOf('#');
        const linkPage = (hashIndex >= 0 ? href.slice(0, hashIndex) : href).split('/').pop().split('?')[0];
        const linkHash = hashIndex >= 0 ? href.slice(hashIndex) : '';

        let isActive = linkPage === currentPage;

        if (isActive && currentPage === 'edit-workspace.html') {
            if (linkHash) {
                isActive = currentHash === linkHash;
            } else {
                isActive = !currentHash || currentHash === '#';
            }
        }

        link.classList.toggle('active', isActive);
        const menuItem = link.closest('.menu-item');
        if (menuItem) menuItem.classList.toggle('active', isActive);
    });
}

function setupSidebarNav() {
    initSidebarActiveNav();
    window.addEventListener('hashchange', initSidebarActiveNav);

    document.querySelectorAll('.sidebar .sidebar-content .menu-list .menu-link[href]').forEach(link => {
        link.addEventListener('click', () => {
            requestAnimationFrame(initSidebarActiveNav);
        });
    });
}

setupSidebarNav();

// Mobile/tablet sidebar: start hidden, close on outside tap
function setupResponsiveSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    const mobileQuery = window.matchMedia('(max-width: 991.98px)');

    const syncSidebarMode = () => {
        if (mobileQuery.matches) {
            if (!sidebar.dataset.mobileInit) {
                sidebar.classList.add('collapsed');
                sidebar.dataset.mobileInit = 'true';
            }
        } else {
            delete sidebar.dataset.mobileInit;
            sidebar.classList.remove('collapsed');
        }
    };

    syncSidebarMode();
    mobileQuery.addEventListener('change', syncSidebarMode);

    document.addEventListener('click', (event) => {
        if (!mobileQuery.matches || sidebar.classList.contains('collapsed')) return;
        if (sidebar.contains(event.target) || event.target.closest('.sidebar-toggle')) return;
        sidebar.classList.add('collapsed');
    });
}

setupResponsiveSidebar();

