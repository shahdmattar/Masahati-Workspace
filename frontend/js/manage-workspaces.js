/* ===========================
   manage-workspaces.js — Masahati Project
   Admin Manage Workspaces page: lists all workspaces (with status
   tabs) and lets the admin approve/reject pending ones.
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

  function statusClass(status) {
    if (status === 'approved') return 'satus bg-apprevod';
    if (status === 'rejected') return 'satus bg-Rejected';
    return 'satus bg-pennding';
  }

  function statusLabel(status) {
    return status.charAt(0).toUpperCase() + status.slice(1);
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

    tr.innerHTML = `
      <td class="ws-name-cell"></td>
      <td class="owner-cell"></td>
      <td class="loc-cell"></td>
      <td class="rating-cell"></td>
      <td><span class="${statusClass(ws.status)}"></span></td>
      <td class="actions"></td>
    `;

    tr.querySelector('.ws-name-cell').textContent = ws.workspace_name;
    tr.querySelector('.owner-cell').textContent = ws.owner_name;
    tr.querySelector('.loc-cell').textContent = `${ws.area}, ${ws.city}`;
    tr.querySelector('.rating-cell').textContent = ws.average_rating
      ? `${ws.average_rating} ★ (${ws.total_reviews})`
      : 'No reviews';
    tr.querySelector('.satus').textContent = statusLabel(ws.status);

    const actionsCell = tr.querySelector('.actions');

    if (ws.status === 'pending') {
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
    } else {
      const viewBtn = document.createElement('button');
      viewBtn.type = 'button';
      viewBtn.className = 'but-view';
      viewBtn.textContent = 'View';
      viewBtn.addEventListener('click', () => {
        window.open(`../pages/workspace-details.html?workspace_id=${ws.id}`, '_blank');
      });
      actionsCell.appendChild(viewBtn);
    }

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
