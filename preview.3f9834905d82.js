(() => {
  const preview = document.querySelector('#preview');
  const switcher = preview.querySelector('.preview-switcher');
  const modes = [...preview.querySelectorAll('[data-preview-mode]')];
  const scenes = [...switcher.querySelectorAll('[data-preview-scene]')];
  const panels = [...preview.querySelectorAll('.preview-panel')];
  const request = preview.querySelector('.preview-request');
  const outcome = preview.querySelector('.preview-outcome');
  const reset = preview.querySelector('[data-preview-reset]');
  const allow = request.querySelector('[data-preview-decision="allow"]');
  const bots = [...preview.querySelectorAll('[data-preview-bot]')];
  const botViews = [...preview.querySelectorAll('[data-preview-bot-view]')];
  const botHeader = preview.querySelector('.preview-bot-header');
  const botList = preview.querySelector('.preview-bot-list');
  const chatChrome = preview.querySelector('.preview-chrome');
  const chatProject = preview.querySelector('.preview-project-chat');
  const newChat = preview.querySelector('.preview-new');
  const newBot = preview.querySelector('.preview-new-bot');
  const chatComposer = preview.querySelector('.preview-composer-chat');
  const botComposer = preview.querySelector('.preview-composer-bots');
  let scene = 'chat';
  let lastChatScene = 'chat';
  let activeBot = 'assistant';
  let currentBotView = 'conversation';

  function updateComposer() {
    const showingBots = scene === 'bots';
    preview.querySelector('.preview-composer').hidden = showingBots && currentBotView !== 'conversation';
    preview.querySelector('.preview-chat-engine').hidden = showingBots;
    for (const engine of preview.querySelectorAll('[data-bot-engine]')) {
      engine.hidden = !showingBots || engine.dataset.botEngine !== activeBot;
    }
  }

  function pressOnly(buttons, dataKey, value) {
    for (const button of buttons) {
      button.setAttribute('aria-pressed', String(button.dataset[dataKey] === value));
    }
  }

  function select(next, focusButton = false) {
    scene = next;
    const showingBots = scene === 'bots';
    if (!showingBots) lastChatScene = scene;

    pressOnly(scenes, 'previewScene', scene);
    pressOnly(modes, 'previewMode', showingBots ? 'bots' : 'chat');
    for (const panel of panels) panel.hidden = panel.dataset.previewPanel !== scene;
    for (const element of [botHeader, botList, newBot, botComposer]) element.hidden = !showingBots;
    for (const element of [chatChrome, chatProject, newChat, chatComposer]) element.hidden = showingBots;

    updateComposer();
    if (focusButton) scenes.find(button => button.dataset.previewScene === scene).focus();
  }

  function selectBotView(view) {
    currentBotView = view;
    pressOnly(botViews, 'previewBotView', view);
    for (const panel of preview.querySelectorAll('[data-bot-view]')) {
      panel.hidden = panel.dataset.botView !== view;
    }
    updateComposer();
  }

  function selectBot(bot) {
    activeBot = bot;
    pressOnly(bots, 'previewBot', bot);
    for (const profile of preview.querySelectorAll('[data-bot-profile]')) {
      profile.hidden = profile.dataset.botProfile !== bot;
    }
    for (const thread of preview.querySelectorAll('[data-bot-thread]')) {
      thread.hidden = thread.dataset.botThread !== bot;
    }
    selectBotView('conversation');
  }

  preview.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;

    if (button.dataset.previewScene) {
      select(button.dataset.previewScene);
    } else if (button.dataset.previewMode) {
      select(button.dataset.previewMode === 'bots' ? 'bots' : lastChatScene);
    } else if (button.dataset.previewBot) {
      selectBot(button.dataset.previewBot);
    } else if (button.dataset.previewBotView) {
      selectBotView(button.dataset.previewBotView);
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
  preview.querySelector('.preview-mode').hidden = false;
  for (const button of preview.querySelectorAll('[data-preview-go]')) button.hidden = false;
})();
