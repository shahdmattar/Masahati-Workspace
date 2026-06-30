
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

  document.addEventListener("click", (e) => {
    customSelects.forEach((select) => {
      if (!select.contains(e.target)) {
        select.classList.remove("active");
      }
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

  if (openFiltersBtn) openFiltersBtn.addEventListener("click", openFilters);
  if (filterClose) filterClose.addEventListener("click", closeFilters);
  if (filterOverlay) filterOverlay.addEventListener("click", closeFilters);
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener("click", () => {
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
  const filterCheckboxes = document.querySelectorAll(".filters-sidebar input[type='checkbox']");
  const filterSelects = document.querySelectorAll(".filters-sidebar select");
  const filterRanges = document.querySelectorAll(".filters-sidebar input[type='range']");

  function resetFilters() {
    filterCheckboxes.forEach((checkbox) => { checkbox.checked = false; });
    filterSelects.forEach((select) => { select.selectedIndex = 0; });
    filterRanges.forEach((range) => { range.value = range.defaultValue; });
  }

  if (resetFiltersBtn) resetFiltersBtn.addEventListener("click", resetFilters);
  if (resetAllFiltersBtn) resetAllFiltersBtn.addEventListener("click", resetFilters);

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
      thumbs.forEach((item) => { item.classList.remove("active"); });
      thumb.classList.add("active");
      if (photoCount) {
        photoCount.textContent = `${index + 1} / ${thumbs.length}`;
      }
    });
  });

  /* ===============================
    Review Star Rating (UI only)
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
    star.addEventListener("mouseenter", () => { updateStars(index + 1); });
    star.addEventListener("click", () => {
      selectedRating = index + 1;
      updateStars(selectedRating);
    });
  });

  if (starInput) {
    starInput.addEventListener("mouseleave", () => { updateStars(selectedRating); });
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

})();


/* ===============================
  Shared Helpers
================================= */
function formatTime(time) {
  if (!time) return "";

  let [h, m] = time.split(":");
  h = parseInt(h);
  m = parseInt(m);

  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;

  const minutes = m === 0 ? "" : `:${m.toString().padStart(2, "0")}`;

  return `${h}${minutes} ${ampm}`;
}
const BASE_URL = "http://localhost/Masahati-Workspace/backend/api";
function getToken() { return localStorage.getItem("token"); }

function showToast(message, type = "success") {
  const colors = {
    success: "#1a3c34",
    error: "#ef4444",
    info: "#3b82f6"
  };

  document.querySelectorAll(".masahati-toast").forEach(t => t.remove());

  const toast = document.createElement("div");
  toast.className = "masahati-toast";
  toast.textContent = message;

  Object.assign(toast.style, {
    position: "fixed",
    bottom: "32px",
    right: "32px",
    background: colors[type] || colors.info,
    color: "#fff",
    padding: "14px 24px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "600",
    zIndex: "99999",
    boxShadow: "0 8px 24px rgba(0,0,0,.15)"
  });

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

/* ===============================
  Workspaces Listing Page
================================= */

document.addEventListener("DOMContentLoaded", () => {

  const state = {
    search: "",
    region: "All",
    area: "All",
    internet: [],
    electricity: [],
    price: 15,
    seating: "Any",
    quietness: [],
    ladies: [],
    sort: "Highest Rated"
  };

  const grid = document.getElementById("workspacesGrid");
  const template = document.getElementById("workspaceTemplate");
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");
  const regionMenu = document.querySelectorAll(".custom-select-menu")[0];
  const areaMenu = document.querySelectorAll(".custom-select-menu")[1];
  const regionBtn = document.querySelectorAll(".custom-select-btn")[0];
  const areaBtn = document.querySelectorAll(".custom-select-btn")[1];
  const regionSpan = regionBtn?.querySelector("span");
  const areaSpan = areaBtn?.querySelector("span");
  const sortMenu = document.querySelector(".sort-custom-select .custom-select-menu");
  const sortBtn = document.querySelector(".sort-custom-select .custom-select-btn");
  const sortSpan = sortBtn?.querySelector("span");
  const applyBtn = document.querySelector(".apply-filters-btn");
  const resetBtn = document.querySelector(".reset-filters-btn");

  async function fetchWorkspaces() {
    const params = new URLSearchParams();
    params.append("search", state.search);
    params.append("region", state.region);
    params.append("area", state.area);
    params.append("internet", state.internet.join(","));
    params.append("electricity", state.electricity.join(","));
    params.append("price", state.price);
    params.append("seating", state.seating);
    params.append("quietness", state.quietness.join(","));
    params.append("ladies", state.ladies.join(","));
    params.append("sort", state.sort);

    const url = `${BASE_URL}/workspaces/get_all.php?${params.toString()}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      grid.innerHTML = "";

      if (!data.success || !data.data.length) {
        grid.innerHTML = `<p class="no-results">No workspaces found</p>`;
        return;
      }

      const total = data.data.length;
      const info = document.getElementById("resultsInfo");
      if (info) {
        info.textContent = total === 0 ? "No workspaces found" : `Showing ${total} workspaces`;
      }

      // Fetch current user favorites to mark active hearts on load
      let favoriteIds = [];
      const token = getToken();
      if (token) {
        try {
          const favRes = await fetch(`${BASE_URL}/favorites/get.php`, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          const favData = await favRes.json();
          if (favData.success && Array.isArray(favData.data)) {
            favoriteIds = favData.data.map(ws => String(ws.id));
          }
        } catch (e) { /* ignore */ }
      }

      data.data.forEach(ws => {
        const clone = template.cloneNode(true);
        clone.style.display = "block";
        clone.removeAttribute("id");
        clone.querySelector("img").src = ws.images?.[0] || "../assets/images/default-user.png";
        clone.querySelector("h3").textContent = ws.workspace_name;
        clone.querySelector(".location").innerHTML = `<i class="fa-solid fa-location-dot"></i> ${ws.area}, ${ws.city}`;
        clone.querySelector(".meta-seats").innerHTML = `<i class="fa-solid fa-chair"></i> ${ws.seating} Seats`;
        clone.querySelector(".meta-internet").innerHTML = `<i class="fa-solid fa-wifi"></i> ${ws.internet_quality}`;
        clone.querySelector(".meta-electricity").innerHTML = `<i class="fa-solid fa-bolt"></i> ${ws.electricity_status}`;
        clone.querySelector(".meta-hours").innerHTML = `<i class="fa-regular fa-clock"></i> ${formatTime(ws.hours_from)} - ${formatTime(ws.hours_to)}`;
        clone.querySelector(".meta-price").innerHTML = `<i class="fa-solid fa-shekel-sign"></i>  ${ws.price_per_hour}/ Hour  `;
        clone.querySelector(".details-btn").href = `workspace-details.html?workspace_id=${ws.id}`;

        // Fill rating
        const ratingEl = clone.querySelector(".rating span");
        if (ratingEl) {
          ratingEl.textContent = `${ws.average_rating || "0.0"} (${ws.total_reviews || 0})`;
        }

        // Favorite button
        const favCardBtn = clone.querySelector(".favorite-btn");
        if (favCardBtn) {
          const isFav = favoriteIds.includes(String(ws.id));
          const icon = favCardBtn.querySelector("i");

          if (isFav) {
            favCardBtn.classList.add("active");
            if (icon) icon.className = "fa-solid fa-heart";
          } else {
            if (icon) icon.className = "fa-regular fa-heart";
          }

          favCardBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (!token) {
              showToast("Please log in to save favorites. Redirecting...", "error");
              setTimeout(() => {
                window.location.href = "login.html";
              }, 1500);
              return;
            }
            try {
              const res = await fetch(`${BASE_URL}/favorites/toggle.php`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ workspace_id: parseInt(ws.id) })
              });

              const result = await res.json();

              if (result.success) {
                const added = result.data.status === "added";
                if (added) {
                  favCardBtn.classList.add("active");
                  if (icon) icon.className = "fa-solid fa-heart";
                  console.log("Favorite updated");
                  showToast('Added to favorites!', 'success');
                } else {
                  favCardBtn.classList.remove("active");
                  if (icon) icon.className = "fa-regular fa-heart";
                  console.log("Favorite updated");
                  console.log(window.masahati);
                  showToast('Removed from favorites.', 'info');
                }
              } else {
                showToast(result.message || 'Failed to update favorites.', 'error');
              }

            } catch (err) {
              console.error("Toggle favorite error:", err);
              showToast('Connection error to server', 'error');
            }
          });
        }

        grid.appendChild(clone);
      });

    } catch (err) {
      console.error("Fetch error:", err);
    }
  }

  function setSearch(value) {
    state.search = value;
    fetchWorkspaces();
  }

  searchBtn?.addEventListener("click", () => { setSearch(searchInput.value.trim()); });
  searchInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); setSearch(searchInput.value.trim()); }
  });

  regionMenu?.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
      state.region = e.target.dataset.value;
      state.area = "All";
      regionSpan.textContent = e.target.textContent;
      areaSpan.textContent = "All";
      updateAreaMenu(state.region);
      fetchWorkspaces();
    }
  });

  const areasData = {
    All: ["All"],
    North: ["All", "Jabalia", "Beit Lahia", "Beit Hanoun", "Tal Al-Hawa", "Sheikh Radwan", "Al-Saftawi", "Al-Rimal"],
    Center: ["All", "Nuseirat", "Deir Al-Balah", "Bureij", "Maghazi", "Zawaida"],
    South: ["All", "Khan Younis", "Rafah", "Mawasi Khan Younis", "Mawasi Al-Qarara"]
  };

  function updateAreaMenu(region) {
    const areas = areasData[region] || ["All"];
    areaMenu.innerHTML = areas.map(area => `<li data-value="${area}">${area}</li>`).join("");
  }

  areaMenu?.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
      state.area = e.target.dataset.value;
      areaSpan.textContent = e.target.textContent;
      fetchWorkspaces();
    }
  });

  sortMenu?.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
      state.sort = e.target.dataset.value;
      sortSpan.textContent = e.target.textContent;
      fetchWorkspaces();
    }
  });

  function getCheckedTexts(groupIndex) {
    return Array.from(
      document.querySelectorAll(".filter-group")[groupIndex]
        .querySelectorAll("input[type='checkbox']:checked")
    ).map(cb => cb.nextElementSibling.textContent.trim());
  }

  document.querySelectorAll(".filter-group")[0]?.querySelectorAll("input")
    .forEach(cb => cb.addEventListener("change", () => { state.internet = getCheckedTexts(0); }));

  document.querySelectorAll(".filter-group")[1]?.querySelectorAll("input")
    .forEach(cb => cb.addEventListener("change", () => { state.electricity = getCheckedTexts(1); }));

  document.querySelector(".price-range")?.addEventListener("input", (e) => { state.price = e.target.value; });
  document.querySelector(".filter-select")?.addEventListener("change", (e) => { state.seating = e.target.value; });

  document.querySelector('[data-filter="quietness"]')?.querySelectorAll("input")
    .forEach(cb => cb.addEventListener("change", () => {
      const map = { "Very Quiet": "very_quiet", "Quiet": "quiet", "Normal": "normal" };
      const group = document.querySelector('[data-filter="quietness"]');
      state.quietness = Array.from(group.querySelectorAll("input:checked"))
        .map(cb => map[cb.nextElementSibling.textContent.trim()]);
    }));

  document.querySelector('[data-filter="ladies"]')?.querySelectorAll("input")
    .forEach(cb => cb.addEventListener("change", () => {
      const map = { "Available": 1, "Not Available": 0 };
      state.ladies = Array.from(
        document.querySelector('[data-filter="ladies"]').querySelectorAll("input:checked")
      ).map(cb => map[cb.nextElementSibling.textContent.trim()]);
    }));

  applyBtn?.addEventListener("click", () => { fetchWorkspaces(); });

  resetBtn?.addEventListener("click", () => {
    state.internet = [];
    state.electricity = [];
    state.price = 15;
    state.seating = "Any";
    state.quietness = [];
    state.ladies = [];
    document.querySelectorAll("input[type='checkbox']").forEach(cb => cb.checked = false);
    document.querySelector(".price-range").value = 15;
    document.querySelector(".filter-select").selectedIndex = 0;
    fetchWorkspaces();
  });

  if (grid && template) { fetchWorkspaces(); }

});


/* ===============================
  Workspace Details Page
  - Fetch workspace data
  - Fetch & render reviews
  - Submit / delete review
  - Favorite toggle
================================= */

document.addEventListener("DOMContentLoaded", () => {

  const isDetailsPage = window.location.pathname.includes("workspace-details.html");
  if (!isDetailsPage) return;

  function getUser() {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  }

  function getWorkspaceId() {
    return new URLSearchParams(window.location.search).get("workspace_id");
  }



  function timeAgo(dateStr) {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    if (diff < 2592000) return `${Math.floor(diff / 604800)} weeks ago`;
    return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  }

  function starsHtml(rating) {
    let html = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) html += `<i class="fa-solid fa-star"></i>`;
      else html += `<i class="fa-regular fa-star"></i>`;
    }
    return html;
  }

  const detailsMain = document.getElementById("detailsMain");
  function revealDetailsPage() {
    if (detailsMain) detailsMain.classList.remove("loading");
  }

  const workspaceId = getWorkspaceId();
  if (!workspaceId) {
    revealDetailsPage();
    return;
  }

  // -------------------------
  // Fetch Workspace Details
  // -------------------------
  async function fetchWorkspaceDetails() {
    try {
      const res = await fetch(`${BASE_URL}/workspaces/single.php?workspace_id=${workspaceId}`);
      const data = await res.json();
      if (!data.success) { revealDetailsPage(); return; }
      renderWorkspace(data.data.workspace);
      revealDetailsPage();
    } catch (err) {
      console.error("Fetch workspace error:", err);
      revealDetailsPage();
    }
  }

  function renderWorkspace(ws) {
    const title = document.querySelector(".details-summary h1");
    if (title) title.textContent = ws.workspace_name;

    const location = document.querySelector(".details-location");
    if (location) location.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${ws.area}, ${ws.city}`;

    const desc = document.querySelector(".details-description");
    if (desc) desc.textContent = ws.description || "";

    const price = document.querySelector(".price strong");
    if (price) price.textContent = `$${ws.price_per_hour} / hour`;

    const hours = document.querySelector(".amenity:nth-child(4) strong");
    if (hours) hours.textContent = `${formatTime(ws.hours_from)} - ${formatTime(ws.hours_to)}`;

    const seats = document.querySelector(".amenity:nth-child(3) strong");
    if (seats) seats.textContent = `${ws.seating} Seats`;

    const internet = document.querySelector(".amenity:nth-child(1) strong");
    if (internet) internet.textContent = ws.internet_quality;

    const electricity = document.querySelector(".amenity:nth-child(2) strong");
    if (electricity) electricity.textContent = ws.electricity_status;

    const approvedBox = document.querySelector(".approved-box span");
    if (approvedBox && ws.created_at) {
      const date = new Date(ws.created_at);
      approvedBox.textContent = "Approved on " + date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    }

    const mainImg = document.querySelector(".main-photo img");
    const thumbsContainer = document.querySelector(".thumbs");
    if (mainImg && thumbsContainer && ws.images?.length) {
      mainImg.src = ws.images[0].image_path;
      thumbsContainer.innerHTML = "";
      ws.images.slice(1, 5).forEach((img, i) => {
        const btn = document.createElement("button");
        btn.className = "thumb" + (i === 0 ? " active" : "");
        btn.innerHTML = `<img src="${img.image_path}">`;
        btn.addEventListener("click", () => {
          mainImg.src = img.image_path;
          document.querySelectorAll(".thumb").forEach(t => t.classList.remove("active"));
          btn.classList.add("active");
        });
        thumbsContainer.appendChild(btn);
      });
    }

    const wa = document.querySelector(".whatsapp-btn");
    if (wa && ws.whatsapp) wa.href = `https://wa.me/${ws.whatsapp}`;
  }

  // -------------------------
  // Fetch Reviews
  // -------------------------
  async function fetchReviews() {
    try {
      const res = await fetch(`${BASE_URL}/reviews/workspace_reviews.php?workspace_id=${workspaceId}`);
      const data = await res.json();
      if (!data.success) return;
      renderReviews(data.data);
    } catch (err) {
      console.error("Fetch reviews error:", err);
    }
  }

  function renderReviews(data) {
    const { average_rating, total_reviews, reviews } = data;
    const user = getUser();

    const bigRatingEl = document.querySelector(".big-rating h2");
    if (bigRatingEl) bigRatingEl.textContent = average_rating || "0.0";

    const bigStarsEl = document.querySelector(".big-rating .stars");
    if (bigStarsEl) bigStarsEl.innerHTML = starsHtml(Math.round(average_rating));

    const bigCountEl = document.querySelector(".big-rating p");
    if (bigCountEl) bigCountEl.textContent = `(${total_reviews} Reviews)`;

    const detailsRatingVal = document.querySelector(".details-rating span:first-child");
    if (detailsRatingVal) detailsRatingVal.innerHTML = `<i class="fa-solid fa-star"></i> ${average_rating || "0.0"}`;

    const detailsRatingCount = document.querySelector(".details-rating span:last-child");
    if (detailsRatingCount) detailsRatingCount.textContent = `(${total_reviews} Reviews)`;

    const ratingCounts = [0, 0, 0, 0, 0];
    if (total_reviews > 0) {
      reviews.forEach(r => { ratingCounts[r.rating - 1]++; });
    }
    const barRows = document.querySelectorAll(".bar-row");
    barRows.forEach((row, i) => {
      const starLevel = 5 - i;
      const pct = total_reviews > 0
        ? Math.round((ratingCounts[starLevel - 1] / total_reviews) * 100)
        : 0;
      const bar = row.querySelector(".bar span");
      const label = row.querySelectorAll("span");
      if (bar) bar.style.width = `${pct}%`;
      if (label[2]) label[2].textContent = `${pct}%`;
    });

    const reviewsTitle = document.querySelector(".reviews-card h2");
    if (reviewsTitle) reviewsTitle.textContent = `Reviews (${total_reviews})`;

    const reviewsCard = document.querySelector(".reviews-card");
    if (!reviewsCard) return;

    reviewsCard.querySelectorAll(".review-item").forEach(el => el.remove());

    if (reviews.length === 0) {
      const empty = document.createElement("p");
      empty.style.cssText = "color:var(--text-light);text-align:center;padding:20px 0;";
      empty.textContent = "No reviews yet. Be the first to review!";
      reviewsCard.appendChild(empty);

      const quoteBoxText = document.querySelector(".quote-box p");
      const quoteBoxAuthor = document.querySelector(".quote-box strong");
      if (quoteBoxText) quoteBoxText.textContent = "No reviews yet — be the first to share your experience!";
      if (quoteBoxAuthor) quoteBoxAuthor.textContent = "";

      return;
    }

    reviews.forEach(review => {
      const isOwner = user && user.id === review.user_id;
      const avatarSrc = review.avatar
        ? `http://localhost/Masahati-Workspace/backend/uploads/${review.avatar}`
        : "https://ui-avatars.com/api/?name=" + encodeURIComponent(review.name) + "&background=1a3c34&color=fff&size=60";

      const item = document.createElement("div");
      item.className = "review-item";
      item.dataset.reviewId = review.id;
      item.innerHTML = `
        <img src="${avatarSrc}" alt="${review.name}" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=1a3c34&color=fff&size=60'" />
        <div style="flex:1;">
          <div class="review-head">
            <strong>${review.name}</strong>
            <div class="review-stars">${starsHtml(review.rating)}</div>
            <span>${timeAgo(review.created_at)}</span>
            ${isOwner ? `<button class="delete-review-btn" data-workspace-id="${workspaceId}" style="margin-left:auto;background:none;border:none;color:#ef4444;cursor:pointer;font-size:0.85rem;" title="Delete my review"><i class="fa-solid fa-trash"></i></button>` : ""}
          </div>
          <p>${review.comment || ""}</p>
        </div>
      `;
      reviewsCard.appendChild(item);
    });

    reviewsCard.querySelectorAll(".delete-review-btn").forEach(btn => {
      btn.addEventListener("click", () => deleteReview(btn.dataset.workspaceId));
    });

    if (reviews.length > 0) {
      const quoteBox = document.querySelector(".quote-box p");
      const quoteAuthor = document.querySelector(".quote-box strong");
      if (quoteBox) quoteBox.textContent = reviews[0].comment || "";
      if (quoteAuthor) quoteAuthor.textContent = reviews[0].name;
    }
  }

  // -------------------------
  // Submit Review
  // -------------------------
  const reviewFormCard = document.querySelector(".review-form-card");
  const reviewToken = getToken();
  const reviewSessionValid = !!reviewToken && !isTokenExpired(reviewToken);

  if (reviewFormCard) {
    const existingForm = reviewFormCard.querySelector(".review-form");
    if (existingForm && !reviewSessionValid) {
      existingForm.outerHTML = `
        <div class="review-login-prompt">
          <i class="fa-regular fa-circle-user"></i>
          <p>Please log in to add a review.</p>
       <a href="login.html" class="post-btn">
            Log In &#8594;
          </a>
        </div>
      `;
    }
  }

  const reviewForm = document.querySelector(".review-form");
  const commentTextarea = document.querySelector("#comment");
  const counterEl = document.querySelector(".post-row span");

  let detailsSelectedRating = 0;
  const detailsStars = document.querySelectorAll(".star-input i");

  function updateDetailStars(rating) {
    detailsStars.forEach((star, index) => {
      if (index < rating) {
        star.classList.remove("fa-regular");
        star.classList.add("fa-solid", "active");
      } else {
        star.classList.remove("fa-solid", "active");
        star.classList.add("fa-regular");
      }
    });
  }

  detailsStars.forEach((star, index) => {
    star.addEventListener("mouseenter", () => { updateDetailStars(index + 1); });
    star.addEventListener("click", () => {
      detailsSelectedRating = index + 1;
      updateDetailStars(detailsSelectedRating);
    });
  });

  document.querySelector(".star-input")?.addEventListener("mouseleave", () => {
    updateDetailStars(detailsSelectedRating);
  });

  if (reviewForm) {
    reviewForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const token = getToken();
      if (!token || isTokenExpired(token)) {
        showDetailsToast("Please log in to leave a review.", "error");
        setTimeout(() => { window.location.href = "login.html"; }, 1500);
        return;
      }

      const comment = commentTextarea?.value.trim() || "";

      if (detailsSelectedRating === 0) {
        showDetailsToast("Please select your rating.", "error");
        return;
      }

      const submitBtn = reviewForm.querySelector(".post-btn");
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Posting..."; }

      try {
        const res = await fetch(`${BASE_URL}/reviews/add.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            workspace_id: parseInt(workspaceId),
            rating: detailsSelectedRating,
            comment: comment
          })
        });

        const data = await res.json();

        if (data.success) {
          showDetailsToast("Your review has been posted!", "success");
          reviewForm.reset();
          detailsSelectedRating = 0;
          updateDetailStars(0);
          if (counterEl) counterEl.textContent = "0 / 500";
          fetchReviews();
        } else {
          if (data.error_code === "DUPLICATE_REVIEW") {
            showDetailsToast("You have already reviewed this workspace.", "error");
          } else {
            showDetailsToast(data.message || "Failed to post review.", "error");
          }
        }

      } catch (err) {
        console.error("Submit review error:", err);
        showDetailsToast("Something went wrong. Please try again.", "error");
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = `Post Review <i class="fa-regular fa-paper-plane"></i>`; }
      }
    });
  }

  // -------------------------
  // Delete Review
  // -------------------------
  async function deleteReview(wsId) {
    const token = getToken();
    if (!token) return;

    if (!confirm("Are you sure you want to delete your review?")) return;

    try {
      const res = await fetch(`${BASE_URL}/reviews/delete.php`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ workspace_id: parseInt(wsId) })
      });

      const data = await res.json();

      if (data.success) {
        showDetailsToast("Review deleted.", "info");
        fetchReviews();
      } else {
        showDetailsToast(data.message || "Failed to delete review.", "error");
      }

    } catch (err) {
      console.error("Delete review error:", err);
    }
  }

  // -------------------------
  // Favorite Toggle
  // -------------------------
  const favBtn = document.querySelector(".details-favorite");

  async function checkFavoriteStatus() {
    const token = getToken();
    if (!token || !favBtn) return;

    try {
      const res = await fetch(`${BASE_URL}/favorites/get.php`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        const isFav = data.data.some(ws => String(ws.id) === String(workspaceId));
        setFavBtn(isFav);
      }
    } catch (err) {
      console.error("Check favorite error:", err);
    }
  }

  function setFavBtn(isFav) {
    if (!favBtn) return;
    const icon = favBtn.querySelector("i");
    if (isFav) {
      favBtn.classList.add("active");
      if (icon) icon.className = "fa-solid fa-heart";
    } else {
      favBtn.classList.remove("active");
      if (icon) icon.className = "fa-regular fa-heart";
    }
  }

  if (favBtn) {
    favBtn.addEventListener("click", async () => {
      const token = getToken();
      if (!token) {
        showToast("Please log in to save favorites. Redirecting...", "error");
        setTimeout(() => {
          window.location.href = "login.html";
        }, 1500);
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/favorites/toggle.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ workspace_id: parseInt(workspaceId) })
        });

        const data = await res.json();

        if (data.success) {
          const added = data.data.status === "added";
          setFavBtn(added);
          showDetailsToast(added ? "Added to favorites!" : "Removed from favorites.", added ? "success" : "info");
        } else {
          showDetailsToast(data.message || "Failed to update favorites.", "error");
        }

      } catch (err) {
        console.error("Toggle favorite error:", err);
        showDetailsToast("Something went wrong.", "error");
      }
    });
  }

  // -------------------------
  // Toast Notification
  // -------------------------
  function showDetailsToast(message, type = "success") {
    if (window.masahati?.showToast) {
      window.masahati.showToast(message, type);
      return;
    }
    document.querySelectorAll(".masahati-toast").forEach(t => t.remove());
    const colors = { success: "#1a3c34", error: "#ef4444", info: "#3b82f6" };
    const toast = document.createElement("div");
    toast.className = "masahati-toast";
    toast.textContent = message;
    Object.assign(toast.style, {
      position: "fixed", bottom: "32px", right: "32px",
      background: colors[type] || colors.info,
      color: "#fff", padding: "14px 24px", borderRadius: "12px",
      fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.9rem",
      fontWeight: "600", zIndex: "9999", boxShadow: "0 8px 24px rgba(0,0,0,0.15)"
    });
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  // -------------------------
  // Init
  // -------------------------
  fetchWorkspaceDetails();
  fetchReviews();
  checkFavoriteStatus();

});