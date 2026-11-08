  (() => {
    const dayStart = 7;
    const nightStart = 19;
    const storageKey = 'grokx-theme-mode';
    let mode = 'auto';
    let timer;
    function readMode() {
      try {
        const saved = localStorage.getItem(storageKey);
        mode = saved === 'light' || saved === 'dark' ? saved : 'auto';
      } catch {}
    }

    readMode();

    function updateTheme() {
      clearTimeout(timer);
      if (mode !== 'auto') {
        document.documentElement.dataset.theme = mode;
        return;
      }

      const now = new Date();
      const hour = now.getHours();
      const isDay = hour >= dayStart && hour < nightStart;
      document.documentElement.dataset.theme = isDay ? 'light' : 'dark';

      const next = new Date(now);
      next.setHours(isDay ? nightStart : dayStart, 0, 0, 0);
      if (hour >= nightStart) next.setDate(next.getDate() + 1);
      timer = setTimeout(updateTheme, next - now);
    }

    updateTheme();
    document.addEventListener('DOMContentLoaded', () => {
      const select = document.querySelector('.theme-select');
      select.value = mode;
      select.hidden = false;
      select.addEventListener('change', () => {
        mode = select.value;
        updateTheme();
        try { localStorage.setItem(storageKey, mode); } catch {}
      });
    });
    addEventListener('pageshow', (event) => {
      if (event.persisted) {
        readMode();
        document.querySelector('.theme-select').value = mode;
      }
      updateTheme();
    });
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) updateTheme();
    });
  })();

  document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const button = document.querySelector('.language-toggle');
    const storageKey = 'grokx-language';
    const translations = Array.from(document.querySelectorAll('[data-en], [data-en-label], [data-en-content]'), (element) => {
      const attribute = element.hasAttribute('data-en-label') ? 'aria-label' :
        element.hasAttribute('data-en-content') ? 'content' : null;
      const zh = attribute ? element.getAttribute(attribute) : element.textContent;
      const en = element.dataset.enLabel ?? element.dataset.enContent ?? element.dataset.en;
      return { element, attribute, zh, en };
    });

    function setLanguage(language) {
      if (root.lang !== language) document.dispatchEvent(new Event('grokx:before-language-change'));
      root.lang = language;
      const english = language === 'en';
      for (const { element, attribute, zh, en } of translations) {
        const text = english ? en : zh;
        if (attribute) element.setAttribute(attribute, text);
        else element.textContent = text;
      }
      button.textContent = english ? '中文' : 'English';
      button.lang = english ? 'zh-CN' : 'en';
    }

    function preferredLanguage() {
      let saved;
      try { saved = localStorage.getItem(storageKey); } catch {}
      if (saved === 'en' || saved === 'zh-CN') return saved;
      return /^zh(?:-|$)/i.test(navigator.language) ? 'zh-CN' : 'en';
    }

    setLanguage(preferredLanguage());
    button.hidden = false;
    addEventListener('pageshow', (event) => {
      if (event.persisted && root.lang !== preferredLanguage()) setLanguage(preferredLanguage());
    });

    button.addEventListener('click', () => {
      const language = root.lang === 'en' ? 'zh-CN' : 'en';
      setLanguage(language);
      try { localStorage.setItem(storageKey, language); } catch {}
    });
  });
