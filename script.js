(function () {
  "use strict";

  const tabs = Array.from(document.querySelectorAll("[data-tab]"));
  const panels = Array.from(document.querySelectorAll("[data-panel]"));
  const themeToggle = document.getElementById("theme-toggle");
  const year = document.getElementById("year");
  const THEME_KEY = "bhargav-portfolio-theme";

  function activateTab(name, updateHash = true) {
    const selectedTab = tabs.find((tab) => tab.dataset.tab === name) || tabs[0];
    const selectedName = selectedTab.dataset.tab;

    tabs.forEach((tab) => {
      const active = tab.dataset.tab === selectedName;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });

    panels.forEach((panel) => {
      const active = panel.dataset.panel === selectedName;
      panel.classList.toggle("active", active);
      panel.hidden = !active;
    });

    if (updateHash) {
      history.replaceState(null, "", `#${selectedName}`);
    }

    document.querySelector(".content-card")?.scrollIntoView({ block: "start" });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateTab(tab.dataset.tab));
    tab.addEventListener("keydown", (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;
      tabs[nextIndex].focus();
      activateTab(tabs[nextIndex].dataset.tab);
    });
  });

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
    themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
  }

  const storedTheme = localStorage.getItem(THEME_KEY);
  const preferredTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  applyTheme(storedTheme || preferredTheme);

  themeToggle.addEventListener("click", () => {
    applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  });

  const initialTab = location.hash.replace("#", "");
  activateTab(tabs.some((tab) => tab.dataset.tab === initialTab) ? initialTab : "about", false);

  window.addEventListener("hashchange", () => {
    const hashTab = location.hash.replace("#", "");
    if (tabs.some((tab) => tab.dataset.tab === hashTab)) activateTab(hashTab, false);
  });

  if (year) year.textContent = new Date().getFullYear();
})();
