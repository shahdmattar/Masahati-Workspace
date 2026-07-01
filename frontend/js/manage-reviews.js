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

    tr.innerHTML = `
      <td class="user-cell"></td>
      <td class="ws-cell"></td>
      <td class="rating-cell"></td>
      <td class="comment-cell" style="max-width:280px;"></td>
      <td class="date-cell"></td>
      <td class="actions"></td>
    `;

    tr.querySelector('.user-cell').textContent = review.user_name;
    tr.querySelector('.ws-cell').textContent = review.workspace_name;
    tr.querySelector('.rating-cell').textContent = `${review.rating} ★`;
    tr.querySelector('.comment-cell').textContent = review.comment || '—';
    tr.querySelector('.date-cell').textContent = formatDate(review.created_at);

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'but-reject';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteReview(review.id, tr));

    tr.querySelector('.actions').appendChild(deleteBtn);

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
