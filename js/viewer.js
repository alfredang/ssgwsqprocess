/**
 * viewer.js — Logic for the standalone PDF viewer page (viewer.html)
 */

(function () {
  const params = new URLSearchParams(window.location.search);
  const fileParam = params.get('file');
  const stepParam = parseInt(params.get('step'), 10);

  const viewerTitle = document.getElementById('viewer-title');
  const viewerStepLabel = document.getElementById('viewer-step-label');
  const viewerContent = document.getElementById('viewer-content');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnBack = document.getElementById('btn-back');
  const btnOpen = document.getElementById('btn-open-tab');

  const step = WSQ_STEPS.find(s => s.id === stepParam);

  function loadPdf(s) {
    if (!s) {
      viewerTitle.textContent = 'Document Not Found';
      viewerStepLabel.textContent = '';
      viewerContent.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">\u26A0\uFE0F</div>
          <h3>Document Not Found</h3>
          <p>The requested PDF could not be loaded. Please go back and select a step.</p>
        </div>
      `;
      return;
    }

    viewerTitle.textContent = s.title;
    viewerStepLabel.textContent = `Step ${s.id} of ${WSQ_STEPS.length}`;
    saveLastStep(s.id);

    viewerContent.innerHTML = `
      <div class="loading-overlay" id="pdf-loader"><div class="spinner"></div></div>
      <iframe src="${s.file}" title="${s.title}" id="pdf-frame"></iframe>
    `;

    const frame = document.getElementById('pdf-frame');
    const loader = document.getElementById('pdf-loader');
    frame.addEventListener('load', () => loader.classList.add('hidden'));
    setTimeout(() => loader.classList.add('hidden'), 3000);

    updateNavButtons(s.id);
  }

  function navigate(id) {
    const s = WSQ_STEPS.find(x => x.id === id);
    if (!s) return;
    const url = new URL(window.location);
    url.searchParams.set('step', s.id);
    url.searchParams.set('file', s.file);
    window.history.pushState({}, '', url);
    loadPdf(s);
  }

  function updateNavButtons(id) {
    const idx = WSQ_STEPS.findIndex(s => s.id === id);
    btnPrev.disabled = idx <= 0;
    btnNext.disabled = idx >= WSQ_STEPS.length - 1;
  }

  btnPrev.addEventListener('click', () => {
    const currentStep = parseInt(new URLSearchParams(window.location.search).get('step'), 10);
    const idx = WSQ_STEPS.findIndex(s => s.id === currentStep);
    if (idx > 0) navigate(WSQ_STEPS[idx - 1].id);
  });

  btnNext.addEventListener('click', () => {
    const currentStep = parseInt(new URLSearchParams(window.location.search).get('step'), 10);
    const idx = WSQ_STEPS.findIndex(s => s.id === currentStep);
    if (idx < WSQ_STEPS.length - 1) navigate(WSQ_STEPS[idx + 1].id);
  });

  btnBack.addEventListener('click', () => {
    window.location.href = 'steps.html';
  });

  btnOpen.addEventListener('click', () => {
    const currentStep = parseInt(new URLSearchParams(window.location.search).get('step'), 10);
    const s = WSQ_STEPS.find(x => x.id === currentStep);
    if (s) window.open(s.file, '_blank');
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') window.location.href = 'steps.html';
  });

  window.addEventListener('popstate', () => {
    const p = new URLSearchParams(window.location.search);
    const id = parseInt(p.get('step'), 10);
    const s = WSQ_STEPS.find(x => x.id === id);
    loadPdf(s);
  });

  /* Init */
  loadPdf(step);
})();
