/* ===========================
   manage-workspaces.js — Masahati Project
   Admin Manage Workspaces page: lists all workspaces (with status
   tabs) and lets the admin approve/reject/delete them.
   =========================== */

(function () {
  'use strict';

  const BASE_URL = 'http://localhost/Masahati-Workspace/backend/api';
  let currentStatus = 'all';

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

  function statusPillMarkup(status) {
    const map = {
      approved: { cls: 'approved', icon: 'bx-check-circle', label: 'Approved' },
      rejected: { cls: 'rejected', icon: 'bx-x-circle', label: 'Rejected' },
      pending: { cls: 'pending', icon: 'bx-time-five', label: 'Pending' },
    };
    const info = map[status] || map.pending;
    return `<span class="status-pill ${info.cls}"><i class='bx ${info.icon}'></i>${info.label}</span>`;
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
      <td>${statusPillMarkup(ws.status)}</td>
      <td class="cell-date">
        <div class="date-main">${formatDate(ws.created_at)}</div>
        <div class="date-sub">${formatTime(ws.created_at)}</div>
      </td>
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
    actionsCell.appendChild(viewBtn);

    if (ws.status === 'pending') {
      const approveBtn = document.createElement('button');
      approveBtn.type = 'button';
      approveBtn.className = 'pill-btn pill-approve';
      approveBtn.innerHTML = `<i class='bx bx-check'></i> Approve`;
      approveBtn.addEventListener('click', () => changeStatus(ws.id, 'approved'));

      const rejectBtn = document.createElement('button');
      rejectBtn.type = 'button';
      rejectBtn.className = 'pill-btn pill-reject';
      rejectBtn.innerHTML = `<i class='bx bx-x'></i> Reject`;
      rejectBtn.addEventListener('click', () => changeStatus(ws.id, 'rejected'));

      actionsCell.appendChild(approveBtn);
      actionsCell.appendChild(rejectBtn);
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'pill-btn pill-delete';
    deleteBtn.innerHTML = `<i class='bx bx-trash'></i> Delete`;
    deleteBtn.addEventListener('click', () => deleteWorkspace(ws.id, tr));
    actionsCell.appendChild(deleteBtn);

    return tr;
  }

  async function changeStatus(workspaceId, status) {
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
        loadWorkspaces();
        updateBadge();
      } else {
        alert(data.message || 'Failed to update workspace status.');
      }
    } catch (err) {
      console.error('Failed to change workspace status:', err);
      alert('Server connection error.');
    }
  }

  async function deleteWorkspace(workspaceId, row) {
    if (!window.confirm('Delete this workspace? This cannot be undone.')) return;

    const token = getToken();
    try {
      const res = await fetch(`${BASE_URL}/admin/delete_workspace.php`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workspace_id: workspaceId }),
      });
      const data = await res.json();

      if (data.success) {
        row.remove();
        updateBadge();
      } else {
        alert(data.message || 'Failed to delete workspace.');
      }
    } catch (err) {
      console.error('Failed to delete workspace:', err);
      alert('Server connection error.');
    }
  }

  async function loadWorkspaces() {
    const tbody = document.getElementById('workspacesTableBody');
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:40px 0;">Loading workspaces…</td></tr>`;

    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`${BASE_URL}/admin/get_workspaces.php?status=${currentStatus}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      const workspaces = data.success ? data.data : [];
      tbody.innerHTML = '';

      if (!workspaces.length) {
        tbody.innerHTML = `<tr class="empty-row"><td colspan="6">No workspaces found for this filter.</td></tr>`;
        return;
      }

      workspaces.forEach((ws) => tbody.appendChild(buildRow(ws)));
    } catch (err) {
      console.error('Failed to load workspaces:', err);
      tbody.innerHTML = `<tr class="empty-row"><td colspan="6">Failed to load workspaces.</td></tr>`;
    }
  }

  function wireTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        currentStatus = tab.dataset.status;
        loadWorkspaces();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    wireTabs();
    loadWorkspaces();
    updateBadge();
  });
})();
