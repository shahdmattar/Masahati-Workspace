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

  function buildRow(ws) {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td class="ws-name-cell"></td>
      <td class="owner-cell"></td>
      <td class="loc-cell"></td>
      <td class="date-cell"></td>
      <td class="actions"></td>
    `;

    tr.querySelector('.ws-name-cell').textContent = ws.workspace_name;
    tr.querySelector('.owner-cell').textContent = ws.owner_name;
    tr.querySelector('.loc-cell').textContent = `${ws.area}, ${ws.city}`;
    tr.querySelector('.date-cell').textContent = formatDate(ws.created_at);

    const actionsCell = tr.querySelector('.actions');

    const approveBtn = document.createElement('button');
    approveBtn.type = 'button';
    approveBtn.className = 'but-approve';
    approveBtn.textContent = 'Approve';
    approveBtn.addEventListener('click', () => changeStatus(ws.id, 'approved', tr));

    const rejectBtn = document.createElement('button');
    rejectBtn.type = 'button';
    rejectBtn.className = 'but-reject';
    rejectBtn.textContent = 'Reject';
    rejectBtn.style.marginLeft = '8px';
    rejectBtn.addEventListener('click', () => changeStatus(ws.id, 'rejected', tr));

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
      tbody.innerHTML = `<tr class="empty-row"><td colspan="5">No pending workspace requests 🎉</td></tr>`;
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
        tbody.innerHTML = `<tr class="empty-row"><td colspan="5">No pending workspace requests 🎉</td></tr>`;
        const badge = document.querySelector('.menu-badge');
        if (badge) badge.textContent = 0;
        return;
      }

      workspaces.forEach((ws) => tbody.appendChild(buildRow(ws)));

      const badge = document.querySelector('.menu-badge');
      if (badge) badge.textContent = workspaces.length;
    } catch (err) {
      console.error('Failed to load pending workspaces:', err);
      tbody.innerHTML = `<tr class="empty-row"><td colspan="5">Failed to load pending workspaces.</td></tr>`;
    }
  }

  document.addEventListener('DOMContentLoaded', loadPending);
})();
