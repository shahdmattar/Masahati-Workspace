(() => {
  /* ===============================
     Custom Dropdowns
  ================================= */

 customSelects.forEach((select) => {
  const button = select.querySelector(".custom-select-btn");
  const buttonText = select.querySelector(".custom-select-btn span");
  const menu = select.querySelector(".custom-select-menu");
  const options = select.querySelectorAll(".custom-select-menu li");

  if (!button || !buttonText) return;

  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    event.stopPropagation();

    customSelects.forEach((item) => {
      if (item !== select) {
        item.classList.remove("active");
      }
    });

    select.classList.toggle("active");
  });

  if (menu) {
    menu.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
    });
  }

  options.forEach((option) => {
    option.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      event.stopPropagation();

      buttonText.textContent = option.dataset.value || option.textContent;

      options.forEach((item) => {
        item.classList.remove("selected");
      });

      option.classList.add("selected");
      select.classList.remove("active");
    });
  });
});

document.addEventListener("pointerdown", () => {
  customSelects.forEach((select) => {
    select.classList.remove("active");
  });
});

  /* ===============================
     Mobile Filters Bottom Sheet
  ================================= */

  const openFiltersBtn = document.getElementById("openFilters");
  const filtersSidebar = document.getElementById("filtersSidebar");
  const filterOverlay = document.getElementById("filterOverlay");
  const filterClose = document.getElementById("filterClose");
  const applyFiltersBtn = document.querySelector(".apply-filters-btn");

  function openFilters() {
    if (!filtersSidebar || !filterOverlay) return;

    filtersSidebar.classList.add("active");
    filterOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeFilters() {
    if (!filtersSidebar || !filterOverlay) return;

    filtersSidebar.classList.remove("active");
    filterOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (openFiltersBtn) {
    openFiltersBtn.addEventListener("click", openFilters);
  }

  if (filterClose) {
    filterClose.addEventListener("click", closeFilters);
  }

  if (filterOverlay) {
    filterOverlay.addEventListener("click", closeFilters);
  }

  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener("click", () => {
      console.log("Filters applied");
      closeFilters();
    });
  }

  /* ===============================
     Filter Accordion
  ================================= */

  const filterTitles = document.querySelectorAll(
    ".filters-sidebar .filter-group:not(.no-collapse) .filter-title"
  );

  filterTitles.forEach((title) => {
    title.addEventListener("click", () => {
      const group = title.closest(".filter-group");

      if (!group) return;

      group.classList.toggle("collapsed");
    });
  });

  /* ===============================
     Apply & Reset Filters
  ================================= */

  const resetFiltersBtn = document.querySelector(".reset-filters-btn");
  const resetAllFiltersBtn = document.querySelector(".reset-all-btn");

  const filterCheckboxes = document.querySelectorAll(
    ".filters-sidebar input[type='checkbox']"
  );

  const filterSelects = document.querySelectorAll(".filters-sidebar select");

  const filterRanges = document.querySelectorAll(
    ".filters-sidebar input[type='range']"
  );

  function resetFilters() {
    filterCheckboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });

    filterSelects.forEach((select) => {
      select.selectedIndex = 0;
    });

    filterRanges.forEach((range) => {
      range.value = range.defaultValue;
    });
  }

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener("click", resetFilters);
  }

  if (resetAllFiltersBtn) {
    resetAllFiltersBtn.addEventListener("click", resetFilters);
  }

  /* ===============================
     Favorite Buttons
     Workspaces + Details
  ================================= */

  const favoriteButtons = document.querySelectorAll(
    ".favorite-btn, .details-favorite"
  );

  favoriteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const icon = button.querySelector("i");

      button.classList.toggle("active");

      if (!icon) return;

      icon.classList.toggle("fa-regular");
      icon.classList.toggle("fa-solid");
    });
  });

  /* ===============================
     Details Gallery
  ================================= */

  const mainPhoto = document.querySelector(".main-photo img");
  const thumbs = document.querySelectorAll(".thumb");
  const photoCount = document.querySelector(".photo-count");

  thumbs.forEach((thumb, index) => {
    thumb.addEventListener("click", () => {
      const thumbImage = thumb.querySelector("img");

      if (!mainPhoto || !thumbImage) return;

      mainPhoto.src = thumbImage.src;

      thumbs.forEach((item) => {
        item.classList.remove("active");
      });

      thumb.classList.add("active");

      if (photoCount) {
        photoCount.textContent = `${index + 1} / ${thumbs.length}`;
      }
    });
  });

  /* ===============================
     Review Star Rating
  ================================= */

  const starInput = document.querySelector(".star-input");
  const reviewStars = document.querySelectorAll(".star-input i");
  let selectedRating = 0;

  function updateStars(rating) {
    reviewStars.forEach((star, index) => {
      if (index < rating) {
        star.classList.remove("fa-regular");
        star.classList.add("fa-solid", "active");
      } else {
        star.classList.remove("fa-solid", "active");
        star.classList.add("fa-regular");
      }
    });
  }

  reviewStars.forEach((star, index) => {
    star.addEventListener("mouseenter", () => {
      updateStars(index + 1);
    });

    star.addEventListener("click", () => {
      selectedRating = index + 1;
      updateStars(selectedRating);
    });
  });

  if (starInput) {
    starInput.addEventListener("mouseleave", () => {
      updateStars(selectedRating);
    });
  }

  /* ===============================
     Comment Counter
  ================================= */

  const commentTextarea = document.querySelector("#comment");
  const counter = document.querySelector(".post-row span");

  if (commentTextarea && counter) {
    commentTextarea.addEventListener("input", () => {
      counter.textContent = `${commentTextarea.value.length} / 500`;
    });
  }

  /* ===============================
     Submit Review
  ================================= */

  const reviewForm = document.querySelector(".review-form");

  if (reviewForm) {
    reviewForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const comment = commentTextarea ? commentTextarea.value.trim() : "";

      if (selectedRating === 0) {
        alert("Please select your rating.");
        return;
      }

      if (comment === "") {
        alert("Please write your comment.");
        return;
      }

      console.log("Review submitted:", {
        rating: selectedRating,
        comment,
      });

      reviewForm.reset();
      selectedRating = 0;
      updateStars(0);

      if (counter) {
        counter.textContent = "0 / 500";
      }

      alert("Your review has been submitted successfully.");
    });
  }
})();

button.addEventListener("pointerdown", (event) => {
  console.log("city clicked", buttonText.textContent);
});