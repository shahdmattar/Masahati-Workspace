/* Add Workspace page actions */
// Dark mode is handled globally in admin-layout.js
// Real submit handling is in workspace-form.js

document.querySelectorAll('.img-upload-box').forEach((box) => {
  const input = box.querySelector('input[type="file"]');
  if (!input) return;

  let removeBtn = box.querySelector('.img-remove');
  if (!removeBtn) {
    removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'img-remove';
    removeBtn.innerHTML = '×';
    box.appendChild(removeBtn);
  }

  input.addEventListener('change', () => {
    const file = input.files && input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      let img = box.querySelector('.preview-img');
      if (!img) {
        img = document.createElement('img');
        img.className = 'preview-img';
        box.appendChild(img);
      }
      img.src = e.target.result;
      box.classList.add('has-image');
    };
    reader.readAsDataURL(file);
  });

  removeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    input.value = '';
    const img = box.querySelector('.preview-img');
    if (img) img.remove();
    box.classList.remove('has-image');
  });
});

document.querySelectorAll('.english-number-input').forEach((input) => {
  input.addEventListener('input', function () {
    this.value = this.value
      .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
      .replace(/[^0-9]/g, '');
  });
});

/* Custom Working Hours picker */
(function () {
  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  function parseTime(value) {
    const match = String(value || '08:00 AM').match(/^(\d{2}):(\d{2})\s(AM|PM)$/);
    return match ? { hour: match[1], minute: match[2], period: match[3] } : { hour: '08', minute: '00', period: 'AM' };
  }

  function updatePicker(picker) {
    const input = picker.querySelector('.time-input');
    const hidden = picker.querySelector('input[type="hidden"]');
    const hour = picker.dataset.hour;
    const minute = picker.dataset.minute;
    const period = picker.dataset.period;
    const value = `${hour}:${minute} ${period}`;
    input.value = value;
    hidden.value = value;

    picker.querySelectorAll('.time-hours button').forEach((btn) => btn.classList.toggle('active', btn.dataset.value === hour));
    picker.querySelectorAll('.time-minutes button').forEach((btn) => btn.classList.toggle('active', btn.dataset.value === minute));
    picker.querySelectorAll('.time-periods button').forEach((btn) => btn.classList.toggle('active', btn.dataset.value === period));
  }

  document.querySelectorAll('.time-picker').forEach((picker) => {
    const initial = parseTime(picker.dataset.default || picker.querySelector('.time-input')?.value);
    picker.dataset.hour = initial.hour;
    picker.dataset.minute = initial.minute;
    picker.dataset.period = initial.period;

    const hoursCol = picker.querySelector('.time-hours');
    const minutesCol = picker.querySelector('.time-minutes');

    hoursCol.innerHTML = hours.map((h) => `<button type="button" data-type="hour" data-value="${h}">${h}</button>`).join('');
    minutesCol.innerHTML = minutes.map((m) => `<button type="button" data-type="minute" data-value="${m}">${m}</button>`).join('');

    picker.querySelector('.time-input').addEventListener('click', () => {
      document.querySelectorAll('.time-picker.open').forEach((p) => p !== picker && p.classList.remove('open'));
      picker.classList.toggle('open');
    });

    picker.querySelector('.time-clock').addEventListener('click', () => {
      document.querySelectorAll('.time-picker.open').forEach((p) => p !== picker && p.classList.remove('open'));
      picker.classList.toggle('open');
    });

    picker.querySelectorAll('.time-dropdown button').forEach((btn) => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type || 'period';
        if (type === 'hour') picker.dataset.hour = btn.dataset.value;
        if (type === 'minute') picker.dataset.minute = btn.dataset.value;
        if (type === 'period') picker.dataset.period = btn.dataset.value;
        updatePicker(picker);
      });
    });

    updatePicker(picker);
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.time-picker')) {
      document.querySelectorAll('.time-picker.open').forEach((picker) => picker.classList.remove('open'));
    }
  });
})();


/* Custom dropdowns for all selects on Add Workspace */
document.querySelectorAll('.custom-select').forEach((select) => {
  const btn = select.querySelector('.custom-select-btn');
  const text = btn ? btn.querySelector('span') : null;
  const hidden = select.querySelector('.custom-select-value');
  const options = select.querySelectorAll('.custom-option');

  if (!btn || !text) return;

  btn.addEventListener('click', (event) => {
    event.stopPropagation();
    document.querySelectorAll('.custom-select.open').forEach((other) => {
      if (other !== select) other.classList.remove('open');
    });
    select.classList.toggle('open');
  });

  options.forEach((option) => {
    option.addEventListener('click', (event) => {
      event.stopPropagation();
      text.textContent = option.textContent.trim();
      if (hidden) hidden.value = option.dataset.value || option.textContent.trim();
      options.forEach((item) => item.classList.remove('active'));
      option.classList.add('active');
      select.classList.remove('open');
    });
  });
});

document.addEventListener('click', () => {
  document.querySelectorAll('.custom-select.open').forEach((select) => {
    select.classList.remove('open');
  });
});


(() => {
  /* ===============================
     Custom Dropdowns
  ================================= */

  const customSelects = document.querySelectorAll(".custom-select");

  customSelects.forEach((select) => {
    const button = select.querySelector(".custom-select-btn");
    const buttonText = select.querySelector(".custom-select-btn span");
    const options = select.querySelectorAll(".custom-select-menu li");

    if (!button || !buttonText) return;

    button.addEventListener("click", (event) => {
      event.stopPropagation();

      customSelects.forEach((item) => {
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