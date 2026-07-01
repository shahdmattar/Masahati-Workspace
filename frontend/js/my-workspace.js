/* ===========================
   my-workspace.js — Masahati Project
   Owner "My Workspaces" page: loads the owner's real workspaces
   from the backend and renders both the desktop table and the
   mobile accordion list. Runs before main-workspace.js so the
   pagination script operates on real rows.
   =========================== */

(function () {
  'use strict';

  const BASE_URL = 'http://localhost/Masahati-Workspace/backend/api';
  const FALLBACK_IMAGE =
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=140&h=140&fit=crop&auto=format';

  function getToken() {
    return localStorage.getItem('token');
  }

  function formatDate(value) {
    if (!value) return '—';
    const date = new Date(value.replace(' ', 'T'));
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function statusBadgeClass(status) {
    if (status === 'approved') return 'badge approved';
    if (status === 'rejected') return 'badge rejected';
    return 'badge pending';
  }

  function statusLabel(status) {
    if (status === 'approved') return 'Approved';
    if (status === 'rejected') return 'Rejected';
    return 'Pending';
  }

  function buildTableRow(ws) {
    const tr = document.createElement('tr');
    const thumbUrl = (ws.images && ws.images[0]) || FALLBACK_IMAGE;

    tr.innerHTML = `
      <td>
        <div class="ws-cell">
          <div class="ws-thumb" style="background-image:url('${thumbUrl}')"></div>
          <div>
            <div class="ws-name"></div>
            <div class="ws-desc"></div>
          </div>
        </div>
      </td>
      <td><span class="loc"></span></td>
      <td><span class="${statusBadgeClass(ws.status)}">${statusLabel(ws.status)}</span></td>
      <td><span class="date-val">${formatDate(ws.created_at)}</span></td>
      <td class="actions">
        <button type="button" class="btn-action btn-view">View</button>
        <button type="button" class="btn-action btn-edit">Edit</button>
        <button type="button" class="btn-action btn-delete">Delete</button>
      </td>
    `;

    tr.querySelector('.ws-name').textContent = ws.workspace_name;
    tr.querySelector('.ws-desc').textContent = ws.description || '';
    tr.querySelector('.loc').textContent = `${ws.area}, ${ws.city}`;

    tr.querySelector('.btn-view').addEventListener('click', () => {
      window.location.href = `../pages/workspace-details.html?workspace_id=${ws.id}`;
    });
    tr.querySelector('.btn-edit').addEventListener('click', () => {
      window.location.href = `edit-workspace.html?id=${ws.id}`;
    });
    tr.querySelector('.btn-delete').addEventListener('click', () => deleteWorkspace(ws.id, tr, null));

    return tr;
  }

  function buildAccordionCard(ws) {
    const card = document.createElement('div');
    card.className = 'workspace-card-acc';
    const thumbUrl = (ws.images && ws.images[0]) || FALLBACK_IMAGE;

    card.innerHTML = `
      <div class="ws-acc-header">
        <div class="ws-acc-info">
          <div class="ws-acc-thumb" style="background-image:url('${thumbUrl}')"></div>
          <div class="ws-acc-titles">
            <div class="ws-acc-name"></div>
            <div class="ws-acc-subtitle"></div>
          </div>
        </div>
        <div class="ws-acc-status">
          <span class="${statusBadgeClass(ws.status)}">${statusLabel(ws.status)}</span>
          <i class='bx bx-chevron-down acc-icon'></i>
        </div>
      </div>
      <div class="ws-acc-body">
        <div class="ws-acc-details">
          <div class="ws-detail-col">
            <span class="detail-label">Location</span>
            <span class="detail-value"></span>
          </div>
          <div class="ws-detail-col">
            <span class="detail-label">Created Date</span>
            <span class="detail-value">${formatDate(ws.created_at)}</span>
          </div>
        </div>
        <div class="ws-acc-buttons">
          <button type="button" class="btn-acc-outline btn-view"><i class='bx bx-show'></i> View</button>
          <button type="button" class="btn-acc-outline btn-edit"><i class='bx bx-edit-alt'></i> Edit</button>
          <button type="button" class="btn-acc-outline btn-delete"><i class='bx bx-trash'></i> Delete</button>
        </div>
      </div>
    `;

    card.querySelector('.ws-acc-name').textContent = ws.workspace_name;
    card.querySelector('.ws-acc-subtitle').textContent = ws.description || '';
    card.querySelectorAll('.detail-value')[0].textContent = `${ws.area}, ${ws.city}`;

    card.querySelector('.ws-acc-header').addEventListener('click', () => {
      card.classList.toggle('active');
    });
    card.querySelector('.btn-view').addEventListener('click', (e) => {
      e.stopPropagation();
      window.location.href = `../pages/workspace-details.html?workspace_id=${ws.id}`;
    });
    card.querySelector('.btn-edit').addEventListener('click', (e) => {
      e.stopPropagation();
      window.location.href = `edit-workspace.html?id=${ws.id}`;
    });
    card.querySelector('.btn-delete').addEventListener('click', (e) => {
      e.stopPropagation();
      deleteWorkspace(ws.id, null, card);
    });

    return card;
  }

  async function deleteWorkspace(id, tableRow, accordionCard) {
    if (!window.confirm('Delete this workspace? This cannot be undone.')) return;

    const token = getToken();
    try {
      const res = await fetch(`${BASE_URL}/workspaces/delete.php`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workspace_id: id }),
      });
      const data = await res.json();

      if (data.success) {
        if (tableRow) tableRow.remove();
        if (accordionCard) accordionCard.remove();
      } else {
        alert(data.message || 'Failed to delete workspace.');
      }
    } catch (err) {
      console.error('Delete workspace failed:', err);
      alert('Server connection error while deleting the workspace.');
    }
  }

  function showEmptyState(table, accordionList) {
    const emptyRow = document.createElement('tr');
    emptyRow.innerHTML = `<td colspan="5" style="text-align:center;padding:40px 0;color:#6b7280;">
      You haven't listed any workspaces yet.
    </td>`;
    if (table) table.querySelector('tbody').appendChild(emptyRow);

    if (accordionList) {
      const emptyCard = document.createElement('div');
      emptyCard.style.textAlign = 'center';
      emptyCard.style.padding = '24px 0';
      emptyCard.style.color = '#6b7280';
      emptyCard.textContent = "You haven't listed any workspaces yet.";
      accordionList.appendChild(emptyCard);
    }
  }

  async function loadWorkspaces() {
    const table = document.querySelector('.table-card table');
    const tbody = table ? table.querySelector('tbody') : null;
    const accordionList = document.querySelector('.workspace-accordion-list');

    // Clear hardcoded placeholder rows
    if (tbody) tbody.innerHTML = '';
    if (accordionList) accordionList.innerHTML = '';

    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`${BASE_URL}/owner/workspaces.php`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      const workspaces = data.success ? data.data : [];

      if (!workspaces.length) {
        showEmptyState(table, accordionList);
        return;
      }

      workspaces.forEach((ws) => {
        if (tbody) tbody.appendChild(buildTableRow(ws));
        if (accordionList) accordionList.appendChild(buildAccordionCard(ws));
      });
    } catch (err) {
      console.error('Failed to load owner workspaces:', err);
      showEmptyState(table, accordionList);
    } finally {
      // Let main-workspace.js know the rows are ready
      document.dispatchEvent(new Event('workspaces:loaded'));
    }
  }

  document.addEventListener('DOMContentLoaded', loadWorkspaces);
})();
