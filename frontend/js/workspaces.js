(() => {
  /* ===============================
     Custom Dropdown
  ================================= */

  const workspaceCustomSelects = document.querySelectorAll(".custom-select");

  workspaceCustomSelects.forEach((select) => {
    const button = select.querySelector(".custom-select-btn");
    const buttonText = select.querySelector(".custom-select-btn span");
    const options = select.querySelectorAll(".custom-select-menu li");

    if (!button || !buttonText) return;

    button.addEventListener("click", (event) => {
      event.stopPropagation();

      workspaceCustomSelects.forEach((item) => {
        if (item !== select) {
          item.classList.remove("active");
        }
      });

      select.classList.toggle("active");
    });

    options.forEach((option) => {
      option.addEventListener("click", () => {
        buttonText.textContent = option.dataset.value || option.textContent;

        options.forEach((item) => {
          item.classList.remove("selected");
        });

        option.classList.add("selected");
        select.classList.remove("active");
      });
    });
  });

  document.addEventListener("click", () => {
    workspaceCustomSelects.forEach((select) => {
      select.classList.remove("active");
    });
  });

  /* ===============================
     Mobile Filters Bottom Sheet
  ================================= */

  const workspaceOpenFiltersBtn = document.getElementById("openFilters");
  const workspaceFiltersSidebar = document.getElementById("filtersSidebar");
  const workspaceFilterOverlay = document.getElementById("filterOverlay");
  const workspaceFilterClose = document.getElementById("filterClose");
  const workspaceApplyFiltersBtn = document.querySelector(".apply-filters-btn");

  function openWorkspaceFilters() {
    if (!workspaceFiltersSidebar || !workspaceFilterOverlay) return;

    workspaceFiltersSidebar.classList.add("active");
    workspaceFilterOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeWorkspaceFilters() {
    if (!workspaceFiltersSidebar || !workspaceFilterOverlay) return;

    workspaceFiltersSidebar.classList.remove("active");
    workspaceFilterOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (workspaceOpenFiltersBtn) {
    workspaceOpenFiltersBtn.addEventListener("click", openWorkspaceFilters);
  }

  if (workspaceFilterClose) {
    workspaceFilterClose.addEventListener("click", closeWorkspaceFilters);
  }

  if (workspaceFilterOverlay) {
    workspaceFilterOverlay.addEventListener("click", closeWorkspaceFilters);
  }

  if (workspaceApplyFiltersBtn) {
    workspaceApplyFiltersBtn.addEventListener("click", closeWorkspaceFilters);
  }

  /* ===============================
     Favorite Button
  ================================= */

  const workspaceFavoriteButtons = document.querySelectorAll(".favorite-btn");

  workspaceFavoriteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const icon = button.querySelector("i");

      if (!icon) return;

      icon.classList.toggle("fa-regular");
      icon.classList.toggle("fa-solid");
      button.classList.toggle("active");
    });
  });
})();