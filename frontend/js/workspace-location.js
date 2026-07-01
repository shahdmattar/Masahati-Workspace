/* ===========================
   workspace-location.js — Masahati Project
   Dependent City -> Area select for the Add/Edit Workspace forms.
   Must run AFTER admin-main.js (which wires the generic .dropdown
   open/close + placeholder behavior) since this script replaces the
   City/Area menu items and takes over their selection behavior.

   Region -> areas mapping (single source of truth, must match the
   backend validation in workspaces/create.php and workspaces/update.php).
   =========================== */

(function () {
  'use strict';

  const areasData = {
    All: ["All"],
    North: ["All", "Jabalia", "Beit Lahia", "Beit Hanoun", "Tal Al-Hawa", "Sheikh Radwan", "Al-Saftawi", "Al-Rimal"],
    Center: ["All", "Nuseirat", "Deir Al-Balah", "Bureij", "Maghazi", "Zawaida"],
    South: ["All", "Khan Younis", "Rafah", "Mawasi Khan Younis", "Mawasi Al-Qarara"],
  };

  // Cities offered when creating/editing a workspace ("All" is a
  // search-filter-only concept, not a real workspace location).
  const CITY_OPTIONS = Object.keys(areasData).filter((key) => key !== 'All');

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

  function setDropdownLabel(dropdown, text) {
    const label = dropdown.querySelector('.dropdown-toggle .dropdown-label');
    if (label) label.textContent = text;
  }

  function areasFor(city) {
    return (areasData[city] || []).filter((area) => area !== 'All');
  }

  function initCityAreaDropdowns() {
    const cityField = findFieldByLabel('City');
    const areaField = findFieldByLabel('Area');
    if (!cityField || !areaField) return;

    const cityDropdown = cityField.querySelector('.dropdown');
    const areaDropdown = areaField.querySelector('.dropdown');
    if (!cityDropdown || !areaDropdown) return;

    const cityMenu = cityDropdown.querySelector('.dropdown-menu');
    const areaMenu = areaDropdown.querySelector('.dropdown-menu');
    if (!cityMenu || !areaMenu) return;

    const usesPlaceholder = cityDropdown.dataset.placeholder !== undefined;

    if (usesPlaceholder) {
      // Add Workspace form: nothing selected yet. admin-main.js already
      // set the placeholder label + "is-placeholder" class for both
      // dropdowns, we only need to swap the actual menu items.
      cityMenu.innerHTML = CITY_OPTIONS.map((city) => `<div>${city}</div>`).join('');
      areaMenu.innerHTML = ''; // no area choices until a city is picked
    } else {
      // Edit Workspace form: starts pre-filled. Default to the first
      // city/area so the form never shows the old Palestinian city list.
      const defaultCity = CITY_OPTIONS[0];
      const defaultAreas = areasFor(defaultCity);

      cityMenu.innerHTML = CITY_OPTIONS
        .map((city, i) => `<div${i === 0 ? ' class="active"' : ''}>${city}</div>`)
        .join('');
      setDropdownLabel(cityDropdown, defaultCity);

      areaMenu.innerHTML = defaultAreas
        .map((area, i) => `<div${i === 0 ? ' class="active"' : ''}>${area}</div>`)
        .join('');
      setDropdownLabel(areaDropdown, defaultAreas[0] || '');
    }

    // City selection -> rebuild Area options (event delegation so it
    // keeps working no matter how many times the menu is rebuilt)
    cityMenu.addEventListener('click', (e) => {
      const item = e.target.closest('div');
      if (!item || item.parentElement !== cityMenu) return;

      const city = item.textContent.trim();

      cityMenu.querySelectorAll('div').forEach((el) => el.classList.remove('active'));
      item.classList.add('active');
      setDropdownLabel(cityDropdown, city);
      cityDropdown.classList.remove('open');
      cityDropdown.classList.remove('is-placeholder');

      const areas = areasFor(city);
      areaMenu.innerHTML = areas.map((area) => `<div>${area}</div>`).join('');
      setDropdownLabel(areaDropdown, areaDropdown.dataset.placeholder || 'Select area');
      areaDropdown.classList.add('is-placeholder');
    });

    // Area selection
    areaMenu.addEventListener('click', (e) => {
      const item = e.target.closest('div');
      if (!item || item.parentElement !== areaMenu) return;

      areaMenu.querySelectorAll('div').forEach((el) => el.classList.remove('active'));
      item.classList.add('active');
      setDropdownLabel(areaDropdown, item.textContent.trim());
      areaDropdown.classList.remove('open');
      areaDropdown.classList.remove('is-placeholder');
    });
  }

  document.addEventListener('DOMContentLoaded', initCityAreaDropdowns);
})();
