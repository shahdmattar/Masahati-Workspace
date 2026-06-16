/* Shared admin layout: sidebar collapse, dark theme, image uploads */
(function () {
  const sidebarToggleBtns = document.querySelectorAll(".sidebar-toggle");
  const sidebar = document.querySelector(".sidebar");
  const topThemeToggleBtn = document.querySelector(".drak-mode");

  const applyTheme = (isDark) => {
    document.body.classList.toggle("dark-theme", isDark);
    document.body.classList.toggle("dark-mode", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
    localStorage.setItem("masahati-theme", isDark ? "dark" : "light");
    if (topThemeToggleBtn) {
      const topIcon = topThemeToggleBtn.querySelector("i");
      if (topIcon) topIcon.className = isDark ? "bx bx-sun" : "bx bx-moon";
    }
  };

  const savedTheme =
    localStorage.getItem("theme") || localStorage.getItem("masahati-theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const shouldUseDarkTheme =
    savedTheme === "dark" || (!savedTheme && systemPrefersDark);
  applyTheme(shouldUseDarkTheme);

  if (topThemeToggleBtn) {
    topThemeToggleBtn.style.cursor = "pointer";
    topThemeToggleBtn.addEventListener("click", () => {
      applyTheme(!document.body.classList.contains("dark-theme"));
    });
  }

  sidebarToggleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (sidebar) sidebar.classList.toggle("collapsed");
    });
  });

  document.querySelectorAll(".card-uplaod").forEach((card) => {
    const fileInput = card.querySelector(".file-input");
    if (!fileInput) return;

    card.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", () => {
      if (!fileInput.files || !fileInput.files[0]) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        let uploadDiv = card.querySelector(".upload-image");
        if (uploadDiv) uploadDiv.remove();

        uploadDiv = document.createElement("div");
        uploadDiv.className = "upload-image";

        const img = document.createElement("img");
        img.src = e.target.result;

        const btnClose = document.createElement("button");
        btnClose.className = "but-colse";
        btnClose.type = "button";
        btnClose.innerHTML = "<span>&times;</span>";
        btnClose.addEventListener("click", (ev) => {
          ev.stopPropagation();
          uploadDiv.remove();
          fileInput.value = "";
        });

        uploadDiv.appendChild(img);
        uploadDiv.appendChild(btnClose);
        card.appendChild(uploadDiv);
      };
      reader.readAsDataURL(fileInput.files[0]);
    });
  });

  const descTextarea = document.getElementById("workspace-description");
  const descCounter = document.getElementById("description-counter");
  if (descTextarea && descCounter) {
    const maxLength = 500;
    const updateDescriptionCounter = () => {
      descCounter.textContent = `${descTextarea.value.length}/${maxLength}`;
    };
    updateDescriptionCounter();
    descTextarea.addEventListener("input", updateDescriptionCounter);
  }
})();
