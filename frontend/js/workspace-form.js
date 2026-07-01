/* ===========================
   workspace-form.js — Masahati Project
   Handles both Add Workspace (create) and Edit Workspace (update)
   forms. Mode is read from <form id="workspace-form" data-mode="...">.
   =========================== */

(function () {
  'use strict';

  const BASE_URL = 'http://localhost/Masahati-Workspace/backend/api';

  function getToken() {
    return localStorage.getItem('token');
  }

  function getStoredUser() {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch (err) {
      return null;
    }
  }

  function findFieldByLabel(startText) {
    const fields = document.querySelectorAll('.all-input-faild');
    for (const field of fields) {
      const label = field.querySelector('label');
      if (label && label.textContent.trim().toLowerCase().startsWith(startText.toLowerCase())) {
        return field;
      }
    }
    return null;
  }

  function getDropdownValue(dropdown) {
    if (!dropdown) return '';
    const active = dropdown.querySelector('.dropdown-menu .active');
    if (!active) return '';
    return active.dataset.value || active.textContent.trim();
  }

  function setDropdownValue(dropdown, value, displayText) {
    if (!dropdown) return;
    const items = dropdown.querySelectorAll('.dropdown-menu div');
    items.forEach((item) => {
      const itemValue = item.dataset.value || item.textContent.trim();
      item.classList.toggle('active', itemValue === value);
    });
    const label = dropdown.querySelector('.dropdown-toggle .dropdown-label');
    if (label) label.textContent = displayText || value;
    dropdown.classList.remove('is-placeholder');
  }

  function getCityAreaDropdowns() {
    const cityField = findFieldByLabel('City');
    const areaField = findFieldByLabel('Area');
    return {
      cityDropdown: cityField ? cityField.querySelector('.dropdown') : null,
      areaDropdown: areaField ? areaField.querySelector('.dropdown') : null,
    };
  }

  function getSelectedFiles(form) {
    const inputs = form.querySelectorAll('.card-uplaod .file-input');
    const files = [];
    inputs.forEach((input) => {
      if (input.files && input.files[0]) files.push(input.files[0]);
    });
    return files;
  }

  function buildWhatsapp(form) {
    const countryInput = form.querySelector('[name="country_code"]');
    const numberInput = document.getElementById('whatsapp-number-input');
    const code = countryInput ? countryInput.value.trim() : '+972';
    const number = numberInput ? numberInput.value.trim().replace(/\D/g, '').replace(/^0+/, '') : '';
    return code + number;
  }

  function collectFormData(form) {
    const { cityDropdown, areaDropdown } = getCityAreaDropdowns();
    const internetDropdown = document.getElementById('internet-quality-dropdown');
    const electricityDropdown = document.getElementById('electricity-dropdown');
    const quietnessDropdown = document.getElementById('quietness-dropdown');
    const ladiesDropdown = document.getElementById('ladies-area-dropdown');

    const nameInput = document.getElementById('workspace-name-input');
    const descInput = document.getElementById('workspace-description');
    const seatingInput = document.getElementById('seating-input');
    const hoursFrom = document.getElementById('hours-from-input');
    const hoursTo = document.getElementById('hours-to-input');
    const priceInput = document.getElementById('price-input');

    const data = {
      workspace_name: nameInput ? nameInput.value.trim() : '',
      description: descInput ? descInput.value.trim() : '',
      city: getDropdownValue(cityDropdown),
      area: getDropdownValue(areaDropdown),
      internet: getDropdownValue(internetDropdown),
      electricity: getDropdownValue(electricityDropdown),
      seating: seatingInput ? seatingInput.value.trim() : '',
      hours_from: hoursFrom ? hoursFrom.value : '',
      hours_to: hoursTo ? hoursTo.value : '',
      quietness: getDropdownValue(quietnessDropdown),
      ladies_area: getDropdownValue(ladiesDropdown),
      price: priceInput ? priceInput.value.trim() : '',
      whatsapp: buildWhatsapp(form),
    };

    return data;
  }

  function validate(data, files, mode) {
    const required = [
      'workspace_name', 'description', 'city', 'area', 'internet',
      'electricity', 'seating', 'hours_from', 'hours_to', 'quietness',
      'ladies_area', 'price', 'whatsapp',
    ];
    for (const key of required) {
      if (!data[key]) return `Please fill in all required fields (missing: ${key.replace('_', ' ')}).`;
    }
    if (mode === 'create' && files.length === 0) {
      return 'Please upload at least one workspace image.';
    }
    if (files.length > 5) {
      return 'You can upload a maximum of 5 images.';
    }
    return null;
  }

  function setSubmitLoading(form, isLoading) {
    const btn = form.querySelector('.but-send');
    if (!btn) return;
    btn.disabled = isLoading;
    btn.dataset.originalText = btn.dataset.originalText || btn.innerHTML;
    btn.innerHTML = isLoading ? 'Submitting…' : btn.dataset.originalText;
  }

  async function handleSubmit(form, mode) {
    const files = getSelectedFiles(form);
    const data = collectFormData(form);

    const error = validate(data, files, mode);
    if (error) {
      alert(error);
      return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));
    files.forEach((file) => formData.append('images[]', file));

    if (mode === 'edit') {
      const workspaceId = new URLSearchParams(window.location.search).get('id');
      formData.append('workspace_id', workspaceId);
    }

    const endpoint = mode === 'create' ? 'workspaces/create.php' : 'workspaces/update.php';
    const token = getToken();

    setSubmitLoading(form, true);

    try {
      const res = await fetch(`${BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const result = await res.json();

      if (result.success) {
        alert(mode === 'create' ? 'Workspace submitted for review!' : 'Workspace updated successfully!');
        window.location.href = 'my-workspace.html';
      } else {
        alert(result.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Workspace form submit failed:', err);
      alert('Server connection error. Please try again.');
    } finally {
      setSubmitLoading(form, false);
    }
  }

  /* ---- Edit mode: fetch + prefill ---- */

  function timeToInputValue(value) {
    if (!value) return '';
    return value.slice(0, 5); // "HH:MM:SS" -> "HH:MM"
  }

  function detectCountryCode(whatsapp, form) {
    const items = form.querySelectorAll('.country-dropdown-menu li');
    let best = null;
    items.forEach((li) => {
      const code = li.dataset.code;
      if (whatsapp.startsWith(code) && (!best || code.length > best.length)) {
        best = code;
      }
    });
    return best || '+972';
  }

  function prefillCountryCode(form, code) {
    const items = form.querySelectorAll('.country-dropdown-menu li');
    const toggleFlag = form.querySelector('.country-dropdown-toggle .flag-img');
    const toggleCode = form.querySelector('.country-dropdown-toggle .country-code-val');
    const hiddenInput = form.querySelector('[name="country_code"]');

    items.forEach((li) => li.classList.toggle('active', li.dataset.code === code));
    const match = form.querySelector(`.country-dropdown-menu li[data-code="${code}"]`);
    if (match && toggleFlag) toggleFlag.src = match.dataset.flagUrl;
    if (toggleCode) toggleCode.textContent = code;
    if (hiddenInput) hiddenInput.value = code;
  }

  function renderExistingImages(form, images) {
    const cards = form.querySelectorAll('.card-uplaod');
    images.slice(0, cards.length).forEach((img, i) => {
      const card = cards[i];
      const uploadDiv = document.createElement('div');
      uploadDiv.className = 'upload-image';

      const imgEl = document.createElement('img');
      imgEl.src = img.image_path;
      uploadDiv.appendChild(imgEl);

      card.appendChild(uploadDiv);
    });
  }

  async function loadWorkspaceForEdit(form) {
    const workspaceId = new URLSearchParams(window.location.search).get('id');
    if (!workspaceId) {
      alert('No workspace selected to edit.');
      window.location.href = 'my-workspace.html';
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/workspaces/single.php?workspace_id=${workspaceId}`);
      const result = await res.json();

      if (!result.success) {
        alert(result.message || 'Failed to load workspace.');
        window.location.href = 'my-workspace.html';
        return;
      }

      const ws = result.data.workspace;
      const currentUser = getStoredUser();

      if (currentUser && Number(ws.owner_id) !== Number(currentUser.id)) {
        alert('You do not have permission to edit this workspace.');
        window.location.href = 'my-workspace.html';
        return;
      }

      document.getElementById('workspace-name-input').value = ws.workspace_name;
      document.getElementById('workspace-description').value = ws.description;
      document.getElementById('workspace-description').dispatchEvent(new Event('input'));
      document.getElementById('seating-input').value = ws.seating;
      document.getElementById('hours-from-input').value = timeToInputValue(ws.hours_from);
      document.getElementById('hours-to-input').value = timeToInputValue(ws.hours_to);
      document.getElementById('price-input').value = ws.price_per_hour;

      const { cityDropdown, areaDropdown } = getCityAreaDropdowns();
      setDropdownValue(cityDropdown, ws.city, ws.city);

      // Rebuild the Area menu for the workspace's saved city, then select area
      const areasByCity = {
        North: ["Jabalia", "Beit Lahia", "Beit Hanoun", "Tal Al-Hawa", "Sheikh Radwan", "Al-Saftawi", "Al-Rimal"],
        Center: ["Nuseirat", "Deir Al-Balah", "Bureij", "Maghazi", "Zawaida"],
        South: ["Khan Younis", "Rafah", "Mawasi Khan Younis", "Mawasi Al-Qarara"],
      };
      const areaMenu = areaDropdown.querySelector('.dropdown-menu');
      const areas = areasByCity[ws.city] || [];
      areaMenu.innerHTML = areas.map((a) => `<div>${a}</div>`).join('');
      setDropdownValue(areaDropdown, ws.area, ws.area);

      setDropdownValue(document.getElementById('internet-quality-dropdown'), ws.internet_quality, ws.internet_quality);
      setDropdownValue(document.getElementById('electricity-dropdown'), ws.electricity_status, ws.electricity_status);

      const quietnessLabelMap = { very_quiet: 'Very Quiet', quiet: 'Quiet', normal: 'Normal' };
      setDropdownValue(document.getElementById('quietness-dropdown'), ws.quietness_level, quietnessLabelMap[ws.quietness_level]);

      const ladiesValue = Number(ws.ladies_area) === 1 ? 'Available' : 'Not Available';
      setDropdownValue(document.getElementById('ladies-area-dropdown'), ladiesValue, ladiesValue);

      const code = detectCountryCode(ws.whatsapp || '', form);
      prefillCountryCode(form, code);
      const localNumber = (ws.whatsapp || '').replace(code, '');
      document.getElementById('whatsapp-number-input').value = localNumber;

      if (ws.images && ws.images.length) {
        renderExistingImages(form, ws.images);
      }
    } catch (err) {
      console.error('Failed to load workspace for edit:', err);
      alert('Server connection error while loading workspace.');
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('workspace-form');
    if (!form) return;

    const mode = form.dataset.mode;

    if (mode === 'edit') {
      // Give workspace-location.js a tick to build City/Area menus first
      setTimeout(() => loadWorkspaceForEdit(form), 50);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSubmit(form, mode);
    });
  });
})();
