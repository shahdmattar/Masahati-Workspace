/* ===========================
   pending-workspace.js — Masahati Project
   Admin Pending Workspace Requests page: lists workspaces awaiting
   review and lets the admin approve/reject them.
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

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str ?? '';
    return div.innerHTML;
  }

  function buildRow(ws) {
    const tr = document.createElement('tr');

    const wsThumb = ws.images && ws.images.length
      ? `<img class="ws-thumb" src="${escapeHtml(ws.images[0])}" alt="${escapeHtml(ws.workspace_name)}" />`
      : `<span class="ws-thumb"></span>`;

    const ownerAvatar = ws.owner_avatar
      ? `<img src="${escapeHtml(ws.owner_avatar)}" alt="${escapeHtml(ws.owner_name)}" />`
      : `<span class="cell-avatar-fallback">${initials(ws.owner_name)}</span>`;

    const desc = ws.description ? escapeHtml(ws.description) : '';

    tr.innerHTML = `
      <td>
        <div class="cell-workspace">
          ${wsThumb}
          <div class="info">
            <h6>${escapeHtml(ws.workspace_name)}</h6>
            <p>${desc}</p>
          </div>
        </div>
      </td>
      <td>
        <div class="cell-user">
          ${ownerAvatar}
          <div class="info">
            <h6>${escapeHtml(ws.owner_name)}</h6>
            <p>${escapeHtml(ws.owner_email || '')}</p>
          </div>
        </div>
      </td>
      <td><p><i class='bx bx-map'></i> ${escapeHtml(ws.area || '')}${ws.area ? ', ' : ''}${escapeHtml(ws.city || '')}</p></td>
      <td class="cell-date">
        <div class="date-main">${formatDate(ws.created_at)}</div>
        <div class="date-sub">${formatTime(ws.created_at)}</div>
      </td>
      <td><span class="status-pill pending"><i class='bx bx-time-five'></i>Pending</span></td>
      <td><div class="row-actions"></div></td>
    `;

    const actionsCell = tr.querySelector('.row-actions');

    const viewBtn = document.createElement('button');
    viewBtn.type = 'button';
    viewBtn.className = 'pill-btn pill-view';
    viewBtn.innerHTML = `<i class='bx bx-show'></i> View`;
    viewBtn.addEventListener('click', () => {
      window.open(`../pages/workspace-details.html?workspace_id=${ws.id}`, '_blank');
    });

    const approveBtn = document.createElement('button');
    approveBtn.type = 'button';
    approveBtn.className = 'pill-btn pill-approve';
    approveBtn.innerHTML = `<i class='bx bx-check'></i> Approve`;
    approveBtn.addEventListener('click', () => changeStatus(ws.id, 'approved', tr));

    const rejectBtn = document.createElement('button');
    rejectBtn.type = 'button';
    rejectBtn.className = 'pill-btn pill-reject';
    rejectBtn.innerHTML = `<i class='bx bx-x'></i> Reject`;
    rejectBtn.addEventListener('click', () => changeStatus(ws.id, 'rejected', tr));

    actionsCell.appendChild(viewBtn);
    actionsCell.appendChild(approveBtn);
    actionsCell.appendChild(rejectBtn);

    return tr;
  }

  async function changeStatus(workspaceId, status, row) {
    const token = getToken();
    const formData = new FormData();
    formData.append('workspace_id', workspaceId);
    formData.append('status', status);

    try {
      const res = await fetch(`${BASE_URL}/admin/change_status.php`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        row.remove();
        updateBadgeCount();
        checkEmpty();
      } else {
        alert(data.message || 'Failed to update workspace status.');
      }
    } catch (err) {
      console.error('Failed to change workspace status:', err);
      alert('Server connection error.');
    }
  }

  function checkEmpty() {
    const tbody = document.getElementById('pendingTableBody');
    if (tbody && !tbody.querySelector('tr')) {
      tbody.innerHTML = `<tr class="empty-row"><td colspan="6">No pending workspace requests 🎉</td></tr>`;
    }
  }

  function updateBadgeCount() {
    const tbody = document.getElementById('pendingTableBody');
    const badge = document.querySelector('.menu-badge');
    if (!tbody || !badge) return;
    const rows = tbody.querySelectorAll('tr:not(.empty-row)');
    badge.textContent = rows.length;
  }

  async function loadPending() {
    const tbody = document.getElementById('pendingTableBody');
    if (!tbody) return;

    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`${BASE_URL}/admin/get_pending_workspaces.php`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      const workspaces = data.success ? data.data : [];
      tbody.innerHTML = '';

      if (!workspaces.length) {
        tbody.innerHTML = `<tr class="empty-row"><td colspan="6">No pending workspace requests 🎉</td></tr>`;
        const badge = document.querySelector('.menu-badge');
        if (badge) badge.textContent = 0;
        return;
      }

      workspaces.forEach((ws) => tbody.appendChild(buildRow(ws)));

      const badge = document.querySelector('.menu-badge');
      if (badge) badge.textContent = workspaces.length;
    } catch (err) {
      console.error('Failed to load pending workspaces:', err);
      tbody.innerHTML = `<tr class="empty-row"><td colspan="6">Failed to load pending workspaces.</td></tr>`;
    }
  }

  document.addEventListener('DOMContentLoaded', loadPending);
})();
