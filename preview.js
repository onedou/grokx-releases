(() => {
  const preview = document.querySelector('#preview');
  const switcher = preview.querySelector('.preview-switcher');
  const buttons = [...switcher.querySelectorAll('button')];
  const panels = [...preview.querySelectorAll('.preview-panel')];
  const request = preview.querySelector('.preview-request');
  const outcome = preview.querySelector('.preview-outcome');
  const reset = preview.querySelector('[data-preview-reset]');
  const allow = request.querySelector('[data-preview-decision="allow"]');

  function select(scene, focusButton = false) {
    for (const button of buttons) {
      const active = button.dataset.previewScene === scene;
      button.setAttribute('aria-pressed', String(active));
      if (active && focusButton) button.focus();
    }
    for (const panel of panels) panel.hidden = panel.dataset.previewPanel !== scene;
  }

  preview.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;

    if (button.dataset.previewScene) {
      select(button.dataset.previewScene);
    } else if (button.dataset.previewGo) {
      select(button.dataset.previewGo, true);
    } else if (button.dataset.previewDecision) {
      request.hidden = true;
      outcome.hidden = false;
      for (const message of outcome.querySelectorAll('[data-preview-result]')) {
        message.hidden = message.dataset.previewResult !== button.dataset.previewDecision;
      }
      reset.focus();
    } else if (button === reset) {
      outcome.hidden = true;
      request.hidden = false;
      allow.focus();
    }
  });

  switcher.hidden = false;
  for (const button of preview.querySelectorAll('[data-preview-go]')) button.hidden = false;
})();
