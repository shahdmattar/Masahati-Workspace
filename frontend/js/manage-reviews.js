/* ===========================
   manage-reviews.js — Masahati Project
   Admin Manage Reviews page: lists every review on the platform
   and lets the admin delete/moderate any of them.
   =========================== */

(function () {
  'use strict';

  const BASE_URL = 'http://localhost/Masahati-Workspace/backend/api';

  function getToken() {
    return localStorage.getItem('token');
  }

  function formatDate(value) {
    if (!value) return '—';
    const date = new Date(value.replace(' ', 'T'));
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function formatTime(value) {
    if (!value) return '';
    const date = new Date(value.replace(' ', 'T'));
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  function initials(name) {
    if (!name) return '?';
    return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  }

  function starsMarkup(rating) {
    const full = Math.round(rating);
    let html = '';
    for (let i = 1; i <= 5; i++) {
      html += `<i class='bx ${i <= full ? 'bxs-star' : 'bx-star'}'></i>`;
    }
    return html;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str ?? '';
    return div.innerHTML;
  }

  async function updateBadge() {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`${BASE_URL}/admin/stats.php`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        const badge = document.querySelector('.menu-badge');
        if (badge) badge.textContent = data.data.pending_approvals;
      }
    } catch (err) {
      console.error('Failed to load stats for badge:', err);
    }
  }

  function buildRow(review) {
    const tr = document.createElement('tr');

    const userAvatar = review.avatar
      ? `<img src="${escapeHtml(review.avatar)}" alt="${escapeHtml(review.user_name)}" />`
      : `<span class="cell-avatar-fallback">${initials(review.user_name)}</span>`;

    const wsThumb = review.workspace_image
      ? `<img class="ws-thumb" src="${escapeHtml(review.workspace_image)}" alt="${escapeHtml(review.workspace_name)}" />`
      : `<span class="ws-thumb"></span>`;

    const comment = review.comment ? escapeHtml(review.comment) : '—';

    tr.innerHTML = `
      <td>
        <div class="cell-user">
          ${userAvatar}
          <div class="info">
            <h6>${escapeHtml(review.user_name)}</h6>
            <p>${escapeHtml(review.user_email || '')}</p>
          </div>
        </div>
      </td>
      <td>
        <div class="cell-workspace">
          ${wsThumb}
          <div class="info">
            <h6>${escapeHtml(review.workspace_name)}</h6>
            <p><i class='bx bx-map'></i>${escapeHtml(review.area || '')}${review.area ? ', ' : ''}${escapeHtml(review.city || '')}</p>
          </div>
        </div>
      </td>
      <td>
        <div class="rating-pill">
          <span class="stars">${starsMarkup(review.rating)}</span>
          ${Number(review.rating).toFixed(1)}
        </div>
      </td>
      <td class="cell-comment" title="${comment}">${comment}</td>
      <td class="cell-date">
        <div class="date-main">${formatDate(review.created_at)}</div>
        <div class="date-sub">${formatTime(review.created_at)}</div>
      </td>
      <td>
        <div class="row-actions"></div>
      </td>
    `;

    const actionsCell = tr.querySelector('.row-actions');

    const viewBtn = document.createElement('button');
    viewBtn.type = 'button';
    viewBtn.className = 'pill-btn pill-view';
    viewBtn.innerHTML = `<i class='bx bx-show'></i> View`;
    viewBtn.addEventListener('click', () => {
      window.open(`../pages/workspace-details.html?workspace_id=${review.workspace_id}`, '_blank');
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'pill-btn pill-delete';
    deleteBtn.innerHTML = `<i class='bx bx-trash'></i> Delete`;
    deleteBtn.addEventListener('click', () => deleteReview(review.id, tr));

    actionsCell.appendChild(viewBtn);
    actionsCell.appendChild(deleteBtn);

    return tr;
  }

  async function deleteReview(reviewId, row) {
    if (!window.confirm('Delete this review? This cannot be undone.')) return;

    const token = getToken();
    try {
      const res = await fetch(`${BASE_URL}/admin/delete_review.php`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ review_id: reviewId }),
      });
      const data = await res.json();

      if (data.success) {
        row.remove();
      } else {
        alert(data.message || 'Failed to delete review.');
      }
    } catch (err) {
      console.error('Failed to delete review:', err);
      alert('Server connection error.');
    }
  }

  async function loadReviews() {
    const tbody = document.getElementById('reviewsTableBody');
    if (!tbody) return;

    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`${BASE_URL}/admin/get_reviews.php`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!data.success) {
        tbody.innerHTML = `<tr class="empty-row"><td colspan="6">Failed to load reviews.</td></tr>`;
        return;
      }

      const avgEl = document.getElementById('avgRatingValue');
      const totalEl = document.getElementById('totalReviewsValue');
      if (avgEl) avgEl.textContent = data.data.stats.avg_rating;
      if (totalEl) totalEl.textContent = data.data.stats.total_reviews;

      const reviews = data.data.reviews;
      tbody.innerHTML = '';

      if (!reviews.length) {
        tbody.innerHTML = `<tr class="empty-row"><td colspan="6">No reviews yet.</td></tr>`;
        return;
      }

      reviews.forEach((review) => tbody.appendChild(buildRow(review)));
    } catch (err) {
      console.error('Failed to load reviews:', err);
      tbody.innerHTML = `<tr class="empty-row"><td colspan="6">Failed to load reviews.</td></tr>`;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadReviews();
    updateBadge();
  });
})();
