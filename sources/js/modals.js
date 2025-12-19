// sources/js/modals.js
"use strict";

import { $ } from "./core.js";

document.addEventListener("DOMContentLoaded", () => {
  /* ===================== CERT MODAL ===================== */
  const certModal = $("#certModal");
  if (certModal) {
    certModal.addEventListener("show.bs.modal", (e) => {
      const cert = e.relatedTarget?.closest(".cert");
      if (!cert) return;

      $("#certTitle").textContent = cert.dataset.title || "";
      $("#certImg").src = cert.dataset.img || "";
      $("#certMeta").textContent = [cert.dataset.org, cert.dataset.date]
        .filter(Boolean)
        .join(" • ");
      $("#certDesc").textContent = cert.dataset.desc || "";
    });
  }

  /* ===================== IMAGE MODAL ===================== */
  const imgModal = $("#imgModal");
  if (imgModal) {
    imgModal.addEventListener("show.bs.modal", (e) => {
      const t = e.relatedTarget;
      if (!t) return;

      $("#imgModalTitle").textContent = t.dataset.imgTitle || "Dokumentasi";
      $("#imgModalImg").src = t.dataset.imgSrc || "";
      $("#imgModalCaption").textContent = t.dataset.imgCaption || "";
    });
  }
});
