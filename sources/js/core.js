// sources/js/core.js
"use strict";

/* ===================== UTIL ===================== */
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

/* ===================== FOOTER YEAR ===================== */
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

/* ===================== SMOOTH SCROLL ===================== */
document.addEventListener("click", (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;

  if (link.hasAttribute("data-bs-toggle")) return;

  const id = link.getAttribute("href");
  if (!id || id === "#") return;

  const target = document.querySelector(id);
  if (!target) return;

  e.preventDefault();
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(null, "", id);
});

/* ===================== CLOSE OFFCANVAS ===================== */
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-close-offcanvas]");
  if (!btn) return;

  const menu = $("#menu");
  if (!menu || !window.bootstrap) return;

  const inst = bootstrap.Offcanvas.getInstance(menu);
  if (inst) inst.hide();
});

/* ===================== SCROLLSPY ===================== */
document.addEventListener("DOMContentLoaded", () => {
  const sections = $$("section[id]");
  if (!sections.length) return;

  const navLinks = $$('a.navlink[href^="#"]');

  const setActive = (hash) => {
    navLinks.forEach((a) => {
      const active = a.getAttribute("href") === hash;
      a.classList.toggle("active", active);
      active
        ? a.setAttribute("aria-current", "page")
        : a.removeAttribute("aria-current");
    });
  };

  if (location.hash) setActive(location.hash);

  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive("#" + visible.target.id);
      },
      {
        threshold: [0.2, 0.4, 0.6],
        rootMargin: "-25% 0px -55% 0px",
      }
    );

    sections.forEach((s) => obs.observe(s));
  }
});
