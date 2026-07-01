/* ===========================
   owner-reviews.js — Masahati Project
   Owner Reviews page: loads real review stats + reviews for the
   logged-in owner's workspaces, replacing all hardcoded content.
   =========================== */

(function () {
  'use strict';

  const BASE_URL = 'http://localhost/Masahati-Workspace/backend/api';

  function getToken() {
    return localStorage.getItem('token');
  }

  function formatDate(value) {
    if (!value) return '';
    const date = new Date(value.replace(' ', 'T'));
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  // Name + avatar in the top navbar are handled centrally by navbar-user.js

  function renderStats(stats) {
    const cards = document.querySelectorAll('.Card-custome-rview .content-status h2');
    if (cards[0]) cards[0].textContent = stats.avg_rating || 0;
    if (cards[1]) cards[1].textContent = stats.total_reviews || 0;
  }

  function buildStarIcons(rating) {
    const rounded = Math.round(rating);
    let html = '';
    for (let i = 1; i <= 5; i++) {
      html += `<span class="review-star${i > rounded ? ' star-bg-gray' : ''}" aria-hidden="true"></span>`;
    }
    return html;
  }

  function buildReviewCard(review) {
    const card = document.createElement('div');
    card.className = 'card-review';

    const avatar = review.avatar
      ? `http://localhost/Masahati-Workspace/backend/uploads/${review.avatar}`
      : '../assets/images/testimonial-4.jpg';

    const workspaceImg = review.workspace_image || '../assets/images/testimonial-2.jpg';

    card.innerHTML = `
      <div class="info-user-review">
        <img src="${avatar}" />
        <h6></h6>
      </div>
      <div class="review-detalis">
        <div class="flex-star">
          <article class="star-icon">${buildStarIcons(review.rating)}</article>
          <span>${Number(review.rating).toFixed(1)}</span>
        </div>
        <p></p>
      </div>
      <div class="product-review">
        <img src="${workspaceImg}" />
        <article>
          <h5></h5>
          <p><i class="bx bx-map"></i> <span></span></p>
        </article>
      </div>
    `;

    card.querySelector('h6').textContent = review.user_name;
    card.querySelector('.review-detalis p').textContent = review.comment || '';
    card.querySelector('.product-review h5').textContent = review.workspace_name;
    card.querySelector('.product-review span').textContent = formatDate(review.created_at);

    return card;
  }

  function renderReviews(reviews) {
    const container = document.querySelector('.All-carding-review');
    if (!container) return;

    container.innerHTML = '';

    if (!reviews.length) {
      const empty = document.createElement('p');
      empty.style.textAlign = 'center';
      empty.style.color = '#6b7280';
      empty.style.padding = '30px 0';
      empty.textContent = 'No reviews yet for your workspaces.';
      container.appendChild(empty);
      return;
    }

    reviews.forEach((review) => container.appendChild(buildReviewCard(review)));
  }

  /* ---- Filter dropdown: All Workspaces / by specific workspace the owner owns ---- */
  function wireFilterDropdown(allReviews, workspaces) {
    const dropdown = document.querySelector('.select-review .dropdown');
    if (!dropdown) return;

    // main.js's generic initDropdowns() already attached its own click
    // listener to this same toggle button. Clone it to strip that listener
    // so our handler below is the only one (avoids toggling 'open' twice
    // per click, which cancelled itself out and looked "dead").
    const oldToggle = dropdown.querySelector('.dropdown-toggle');
    const toggle = oldToggle.cloneNode(true);
    oldToggle.replaceWith(toggle);

    const label = toggle.querySelector('.dropdown-label');
    const menu = dropdown.querySelector('.dropdown-menu');
    if (!menu) return;

    const list = Array.isArray(workspaces) ? workspaces : [];

    menu.innerHTML = '<div class="active" data-workspace-id="">All Workspaces</div>'
      + list.map((ws) => `<div data-workspace-id="${ws.workspace_id}">${ws.workspace_name}</div>`).join('');

    function applyFilter(workspaceId) {
      if (!workspaceId) return allReviews.slice();
      return allReviews.filter((r) => String(r.workspace_id) === String(workspaceId));
    }

    function wireItems() {
      const items = menu.querySelectorAll('div');
      items.forEach((item) => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          items.forEach((i) => i.classList.remove('active'));
          item.classList.add('active');
          const workspaceId = item.dataset.workspaceId;
          label.textContent = item.textContent.trim();
          dropdown.classList.remove('open');
          renderReviews(applyFilter(workspaceId));
        });
      });
    }

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) dropdown.classList.remove('open');
    });

    wireItems();
  }

  async function loadReviews() {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`${BASE_URL}/reviews/owner_reviews.php`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        renderStats(data.data.stats);
        renderReviews(data.data.reviews);
        wireFilterDropdown(data.data.reviews, data.data.workspaces);
      }
    } catch (err) {
      console.error('Failed to load owner reviews:', err);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadReviews();
  });
})();