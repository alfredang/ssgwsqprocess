/**
 * steps.js — Logic for the Steps page (sidebar + viewer panel)
 */

(function () {
  let activeStepId = null;

  const listEl = document.getElementById('steps-list');
  const searchInput = document.getElementById('search-input');
  const viewerContent = document.getElementById('viewer-content');
  const viewerTitle = document.getElementById('viewer-title');
  const viewerStepLabel = document.getElementById('viewer-step-label');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnClose = document.getElementById('btn-close');
  const btnOpen = document.getElementById('btn-open-tab');

  /* ---- Render step list ---- */
  function renderList(filter = '') {
    const lowerFilter = filter.toLowerCase();
    const filtered = WSQ_STEPS.filter(s =>
      s.title.toLowerCase().includes(lowerFilter) ||
      s.description.toLowerCase().includes(lowerFilter) ||
      String(s.id).includes(lowerFilter)
    );

    listEl.innerHTML = '';

    if (filtered.length === 0) {
      listEl.innerHTML = `<div style="padding:2rem;text-align:center;color:var(--text-muted);font-size:0.9rem;">No steps match your search.</div>`;
      return;
    }

    filtered.forEach((step, idx) => {
      const item = document.createElement('div');
      item.className = 'step-item' + (step.id === activeStepId ? ' active' : '');
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      item.setAttribute('aria-label', `Step ${step.id}: ${step.title}`);
      item.style.animationDelay = `${idx * 40}ms`;
      item.classList.add('animate-in');
      item.innerHTML = `
        <div class="step-number">${step.id}</div>
        <div class="step-info">
          <div class="step-title">${step.title}</div>
          <div class="step-desc">${step.description}</div>
        </div>
        <span class="step-arrow">\u203A</span>
      `;
      item.addEventListener('click', () => openStep(step.id));
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openStep(step.id); }
      });
      listEl.appendChild(item);
    });
  }

  /* ---- Open a step's PDF ---- */
  function openStep(id) {
    const step = WSQ_STEPS.find(s => s.id === id);
    if (!step) return;

    activeStepId = id;
    saveLastStep(id);
    renderList(searchInput.value);

    // Update toolbar
    viewerTitle.textContent = step.title;
    viewerStepLabel.textContent = `Step ${step.id} of ${WSQ_STEPS.length}`;

    // Show loading, then embed PDF
    viewerContent.innerHTML = `
      <div class="loading-overlay" id="pdf-loader"><div class="spinner"></div></div>
      <iframe src="${step.file}" title="${step.title}" id="pdf-frame"></iframe>
    `;

    const frame = document.getElementById('pdf-frame');
    const loader = document.getElementById('pdf-loader');

    frame.addEventListener('load', () => {
      loader.classList.add('hidden');
    });

    // Fallback: hide loader after 3s
    setTimeout(() => loader.classList.add('hidden'), 3000);

    // Update nav buttons
    updateNavButtons();
  }

  /* ---- Close the viewer ---- */
  function closeViewer() {
    activeStepId = null;
    renderList(searchInput.value);
    viewerTitle.textContent = '';
    viewerStepLabel.textContent = '';
    viewerContent.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">\u{1F4C4}</div>
        <h3>Select a Process Step</h3>
        <p>Click any step from the sidebar to view its PDF document here.</p>
      </div>
    `;
    updateNavButtons();
  }

  /* ---- Previous / Next ---- */
  function goToPrev() {
    if (!activeStepId) return;
    const idx = WSQ_STEPS.findIndex(s => s.id === activeStepId);
    if (idx > 0) openStep(WSQ_STEPS[idx - 1].id);
  }

  function goToNext() {
    if (!activeStepId) return;
    const idx = WSQ_STEPS.findIndex(s => s.id === activeStepId);
    if (idx < WSQ_STEPS.length - 1) openStep(WSQ_STEPS[idx + 1].id);
  }

  function updateNavButtons() {
    if (!activeStepId) {
      btnPrev.disabled = true;
      btnNext.disabled = true;
      return;
    }
    const idx = WSQ_STEPS.findIndex(s => s.id === activeStepId);
    btnPrev.disabled = idx <= 0;
    btnNext.disabled = idx >= WSQ_STEPS.length - 1;
  }

  /* ---- Open in new tab ---- */
  function openInNewTab() {
    const step = WSQ_STEPS.find(s => s.id === activeStepId);
    if (step) window.open(step.file, '_blank');
  }

  /* ---- Event Listeners ---- */
  searchInput.addEventListener('input', () => renderList(searchInput.value));
  btnPrev.addEventListener('click', goToPrev);
  btnNext.addEventListener('click', goToNext);
  btnClose.addEventListener('click', closeViewer);
  btnOpen.addEventListener('click', openInNewTab);

  // ESC to close viewer
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && activeStepId) closeViewer();
    if (e.key === 'ArrowUp' && activeStepId) { e.preventDefault(); goToPrev(); }
    if (e.key === 'ArrowDown' && activeStepId) { e.preventDefault(); goToNext(); }
  });

  /* ---- Init ---- */
  renderList();

  // Restore last step if available
  const last = getLastStep();
  if (last && WSQ_STEPS.find(s => s.id === last)) {
    openStep(last);
  }
})();
