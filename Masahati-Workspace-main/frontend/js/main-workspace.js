document.addEventListener('DOMContentLoaded', function () {
  const table = document.querySelector('.table-card table');
  const tbody = table ? table.querySelector('tbody') : null;
  const rows = tbody ? Array.from(tbody.querySelectorAll('tr')) : [];

  const accordionList = document.querySelector('.workspace-accordion-list');
  const cards = accordionList ? Array.from(accordionList.querySelectorAll('.workspace-card-acc')) : [];

  const totalItems = Math.max(rows.length, cards.length);
  if (!totalItems) return;

  // rows per page — smaller on small screens
  const getRowsPerPage = () => (window.innerWidth <= 576 ? 3 : 5);
  let rowsPerPage = getRowsPerPage();
  let currentPage = 1;
  let pageCount = Math.max(1, Math.ceil(totalItems / rowsPerPage));

  // build pagination UI
  const pagination = document.createElement('div');
  pagination.className = 'ws-pagination';

  const isRTL = document.documentElement.dir === 'rtl' || document.documentElement.lang?.startsWith('ar');

  const prevBtn = document.createElement('button');
  prevBtn.className = 'ws-paging-prev';
  prevBtn.type = 'button';
  prevBtn.textContent = isRTL ? 'السابق ‹' : '‹ Prev';

  const pagesWrap = document.createElement('div');
  pagesWrap.className = 'ws-paging-pages';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'ws-paging-next';
  nextBtn.type = 'button';
  nextBtn.textContent = isRTL ? '› التالي' : 'Next ›';

  // For RTL languages keep visual order natural for Arabic readers
  if (isRTL) {
    pagination.appendChild(nextBtn);
    pagination.appendChild(pagesWrap);
    pagination.appendChild(prevBtn);
  } else {
    pagination.appendChild(prevBtn);
    pagination.appendChild(pagesWrap);
    pagination.appendChild(nextBtn);
  }

  // helper to render page buttons
  function renderPageButtons() {
    pagesWrap.innerHTML = '';
    for (let i = 1; i <= pageCount; i++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'ws-page-btn' + (i === currentPage ? ' active' : '');
      b.dataset.page = i;
      b.textContent = i;
      b.addEventListener('click', () => showPage(i));
      pagesWrap.appendChild(b);
    }
  }

  function showPage(page) {
    currentPage = Math.min(Math.max(1, page), pageCount);
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    rows.forEach((r, idx) => {
      r.style.display = idx >= start && idx < end ? '' : 'none';
    });
    
    cards.forEach((c, idx) => {
      c.style.display = idx >= start && idx < end ? '' : 'none';
    });

    renderPageButtons();
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === pageCount;
  }

  prevBtn.addEventListener('click', () => showPage(currentPage - 1));
  nextBtn.addEventListener('click', () => showPage(currentPage + 1));

  // insert pagination after table only if more than one page
  const containerNode = accordionList || document.querySelector('.table-card');
  if (pageCount > 1 && containerNode) {
    containerNode.parentNode.appendChild(pagination);
    // initial render
    showPage(1);
  } else {
    // show all rows if only one page
    rows.forEach((r) => (r.style.display = ''));
    cards.forEach((c) => (c.style.display = ''));
    // no pagination UI needed
  }

  // debug: optional logging when URL has ?wsdebug=1
  const urlParams = new URLSearchParams(window.location.search);
  const enableDebug = urlParams.get('wsdebug') === '1';
  if (enableDebug) {
    console.log('WS-Pagination debug:', {
      totalItems,
      rowsPerPage,
      pageCount,
      isRTL: isRTL,
    });
  }

  // update on resize (recompute rows per page)
  let resizeTimeout = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const newRows = getRowsPerPage();
      if (newRows !== rowsPerPage) {
        rowsPerPage = newRows;
        const newPageCount = Math.max(1, Math.ceil(totalItems / rowsPerPage));
        pageCount = newPageCount;
        currentPage = Math.min(currentPage, pageCount);
        if (pageCount > 1) {
          if (!pagination.parentNode && containerNode) containerNode.parentNode.appendChild(pagination);
          showPage(currentPage);
        } else {
          // remove pagination UI if present and show all rows
          if (pagination.parentNode) pagination.parentNode.removeChild(pagination);
          rows.forEach((r) => (r.style.display = ''));
          cards.forEach((c) => (c.style.display = ''));
        }
      }
    }, 150);
  });
});
