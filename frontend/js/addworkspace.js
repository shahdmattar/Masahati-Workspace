/* Add Workspace page actions */
// Dark mode is handled globally in admin-layout.js

const addWorkspaceForm = document.querySelector('.form-add');
if (addWorkspaceForm) {
  addWorkspaceForm.addEventListener('submit', (event) => {
    event.preventDefault();
    window.open('about:blank', '_blank', 'noopener,noreferrer');
  });
}

document.querySelectorAll('.img-upload-box').forEach((box) => {
  const input = box.querySelector('input[type="file"]');
  if (!input) return;

  let removeBtn = box.querySelector('.img-remove');
  if (!removeBtn) {
    removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'img-remove';
    removeBtn.innerHTML = '×';
    box.appendChild(removeBtn);
  }

  input.addEventListener('change', () => {
    const file = input.files && input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      let img = box.querySelector('.preview-img');
      if (!img) {
        img = document.createElement('img');
        img.className = 'preview-img';
        box.appendChild(img);
      }
      img.src = e.target.result;
      box.classList.add('has-image');
    };
    reader.readAsDataURL(file);
  });

  removeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    input.value = '';
    const img = box.querySelector('.preview-img');
    if (img) img.remove();
    box.classList.remove('has-image');
  });
});

document.querySelectorAll('.english-number-input').forEach((input) => {
  input.addEventListener('input', function () {
    this.value = this.value
      .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
      .replace(/[^0-9]/g, '');
  });
});

/* Custom Working Hours picker */
(function () {
  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  function parseTime(value) {
    const match = String(value || '08:00 AM').match(/^(\d{2}):(\d{2})\s(AM|PM)$/);
    return match ? { hour: match[1], minute: match[2], period: match[3] } : { hour: '08', minute: '00', period: 'AM' };
  }

  function updatePicker(picker) {
    const input = picker.querySelector('.time-input');
    const hidden = picker.querySelector('input[type="hidden"]');
    const hour = picker.dataset.hour;
    const minute = picker.dataset.minute;
    const period = picker.dataset.period;
    const value = `${hour}:${minute} ${period}`;
    input.value = value;
    hidden.value = value;

    picker.querySelectorAll('.time-hours button').forEach((btn) => btn.classList.toggle('active', btn.dataset.value === hour));
    picker.querySelectorAll('.time-minutes button').forEach((btn) => btn.classList.toggle('active', btn.dataset.value === minute));
    picker.querySelectorAll('.time-periods button').forEach((btn) => btn.classList.toggle('active', btn.dataset.value === period));
  }

  document.querySelectorAll('.time-picker').forEach((picker) => {
    const initial = parseTime(picker.dataset.default || picker.querySelector('.time-input')?.value);
    picker.dataset.hour = initial.hour;
    picker.dataset.minute = initial.minute;
    picker.dataset.period = initial.period;

    const hoursCol = picker.querySelector('.time-hours');
    const minutesCol = picker.querySelector('.time-minutes');

    hoursCol.innerHTML = hours.map((h) => `<button type="button" data-type="hour" data-value="${h}">${h}</button>`).join('');
    minutesCol.innerHTML = minutes.map((m) => `<button type="button" data-type="minute" data-value="${m}">${m}</button>`).join('');

    picker.querySelector('.time-input').addEventListener('click', () => {
      document.querySelectorAll('.time-picker.open').forEach((p) => p !== picker && p.classList.remove('open'));
      picker.classList.toggle('open');
    });

    picker.querySelector('.time-clock').addEventListener('click', () => {
      document.querySelectorAll('.time-picker.open').forEach((p) => p !== picker && p.classList.remove('open'));
      picker.classList.toggle('open');
    });

    picker.querySelectorAll('.time-dropdown button').forEach((btn) => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type || 'period';
        if (type === 'hour') picker.dataset.hour = btn.dataset.value;
        if (type === 'minute') picker.dataset.minute = btn.dataset.value;
        if (type === 'period') picker.dataset.period = btn.dataset.value;
        updatePicker(picker);
      });
    });

    updatePicker(picker);
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.time-picker')) {
      document.querySelectorAll('.time-picker.open').forEach((picker) => picker.classList.remove('open'));
    }
  });
})();


/* Custom dropdowns for all selects on Add Workspace */
document.querySelectorAll('.custom-select').forEach((select) => {
  const btn = select.querySelector('.custom-select-btn');
  const text = btn ? btn.querySelector('span') : null;
  const hidden = select.querySelector('.custom-select-value');
  const options = select.querySelectorAll('.custom-option');

  if (!btn || !text) return;

  btn.addEventListener('click', (event) => {
    event.stopPropagation();
    document.querySelectorAll('.custom-select.open').forEach((other) => {
      if (other !== select) other.classList.remove('open');
    });
    select.classList.toggle('open');
  });

  options.forEach((option) => {
    option.addEventListener('click', (event) => {
      event.stopPropagation();
      text.textContent = option.textContent.trim();
      if (hidden) hidden.value = option.dataset.value || option.textContent.trim();
      options.forEach((item) => item.classList.remove('active'));
      option.classList.add('active');
      select.classList.remove('open');
    });
  });
});

document.addEventListener('click', () => {
  document.querySelectorAll('.custom-select.open').forEach((select) => {
    select.classList.remove('open');
  });
});
