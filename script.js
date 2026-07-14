/**
 * Bhargav Nallan — Portfolio Site
 * Theme toggle, mobile navigation, smooth scrolling, and form handling.
 */

(function () {
  "use strict";

  const THEME_KEY = "portfolio-theme";
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const themeToggle = document.getElementById("theme-toggle");
  const contactForm = document.getElementById("contact-form");
  const formNote = document.getElementById("form-note");
  const yearEl = document.getElementById("year");
  const navLinks = document.querySelectorAll(".nav-link");

  /* --------------------------------------------------------------------------
     Theme
     -------------------------------------------------------------------------- */

  function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  function initTheme() {
    applyTheme(getPreferredTheme());

    themeToggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      applyTheme(current === "dark" ? "light" : "dark");
    });

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      if (!localStorage.getItem(THEME_KEY)) {
        applyTheme(e.matches ? "dark" : "light");
      }
    });
  }

  /* --------------------------------------------------------------------------
     Mobile Navigation
     -------------------------------------------------------------------------- */

  function closeNav() {
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation menu");
  }

  function openNav() {
    navMenu.classList.add("open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close navigation menu");
  }

  function initNav() {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.contains("open");
      isOpen ? closeNav() : openNav();
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("click", (e) => {
      if (
        navMenu.classList.contains("open") &&
        !navMenu.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        closeNav();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) closeNav();
    });
  }

  /* --------------------------------------------------------------------------
     Active Nav Link on Scroll
     -------------------------------------------------------------------------- */

  function initScrollSpy() {
    const sections = document.querySelectorAll("section[id]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) => {
              link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
            });
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
  }

  /* --------------------------------------------------------------------------
     Smooth Scroll (enhanced for nav offset)
     -------------------------------------------------------------------------- */

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const targetId = anchor.getAttribute("href");
        if (targetId === "#" || targetId === "#top") return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.pushState(null, "", targetId);
      });
    });
  }

  /* --------------------------------------------------------------------------
     Contact Form (client-side placeholder)
     -------------------------------------------------------------------------- */

  function initContactForm() {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();

      formNote.className = "form-note";

      if (!name || !email || !message) {
        formNote.textContent = "Please fill in all fields.";
        formNote.classList.add("error");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        formNote.textContent = "Please enter a valid email address.";
        formNote.classList.add("error");
        return;
      }

      const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      const mailto = `mailto:ncbhargav98@gmail.com?subject=${subject}&body=${body}`;

      window.location.href = mailto;

      formNote.textContent = "Opening your email client…";
      formNote.classList.add("success");
      contactForm.reset();
    });
  }

  /* --------------------------------------------------------------------------
     Footer Year
     -------------------------------------------------------------------------- */

  function initFooter() {
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  /* --------------------------------------------------------------------------
     Init
     -------------------------------------------------------------------------- */

  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initNav();
    initScrollSpy();
    initSmoothScroll();
    initContactForm();
    initFooter();
  });
})();
