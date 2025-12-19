"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const SHEET_ID = "1EH8wH78Pr_x2-SLq32QzpDlMPEe7_qgMe-Ti2vR6E6w";
  const SHEET_GID = "0";
  const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${SHEET_GID}`;

  const ALLOWED = new Set([
    "all",
    "akademik",
    "kampus",
    "luar",
    "sertifikat",
    "project",
  ]);

  const grid = document.getElementById("galleryGrid");
  if (!grid) return;

  const statusEl = document.getElementById("galleryStatus");
  const filterBtns = Array.from(
    document.querySelectorAll("[data-gallery-filter]")
  );

  const galleryModal = document.getElementById("galleryModal");
  const modalTitle = document.getElementById("galleryModalTitle");
  const modalImg = document.getElementById("galleryModalImg");
  const modalMeta = document.getElementById("galleryModalMeta");
  const modalCaption = document.getElementById("galleryModalCaption");

  const escapeHtml = (str) =>
    String(str ?? "").replace(
      /[&<>"']/g,
      (m) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;",
        }[m])
    );

  function parseCSV(text) {
    const rows = [];
    let row = [];
    let cell = "";
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const next = text[i + 1];

      if (ch === '"') {
        if (inQuotes && next === '"') {
          cell += '"';
          i++;
        } else inQuotes = !inQuotes;
        continue;
      }

      if (ch === "," && !inQuotes) {
        row.push(cell);
        cell = "";
        continue;
      }

      if ((ch === "\n" || ch === "\r") && !inQuotes) {
        if (ch === "\r" && next === "\n") i++;
        row.push(cell);
        rows.push(row);
        row = [];
        cell = "";
        continue;
      }

      cell += ch;
    }

    if (cell.length || row.length) {
      row.push(cell);
      rows.push(row);
    }

    return rows;
  }

  function normalizeCategory(raw) {
    const s = String(raw || "")
      .trim()
      .toLowerCase();
    if (!s) return "";

    if (s.includes("kegiatan akademik")) return "akademik";
    if (s.includes("kontribusi")) return "kampus";
    if (s.includes("kegiatan diluar kampus")) return "luar";
    if (s.includes("sertifikat")) return "sertifikat";
    if (s.includes("project") || s.includes("projek")) return "project";

    // fallback pendek
    if (ALLOWED.has(s)) return s;

    return "";
  }

  function labelCategory(cat) {
    return (
      {
        akademik: "Kegiatan Akademik",
        kampus: "Kontribusi Kampus",
        luar: "Kegiatan Diluar Kampus",
        sertifikat: "Sertifikat",
        project: "Project",
      }[cat] || ""
    );
  }

  function getInitialFilter() {
    const raw = new URLSearchParams(location.search).get("filter") || "all";
    return ALLOWED.has(raw) ? raw : "all";
  }

  function setActiveButton(cat) {
    filterBtns.forEach((b) => {
      b.classList.remove("btn-primary");
      b.classList.add("btn-outline-primary");
    });
    const btn =
      document.querySelector(`[data-gallery-filter="${cat}"]`) ||
      document.querySelector(`[data-gallery-filter="all"]`);
    if (btn) {
      btn.classList.add("btn-primary");
      btn.classList.remove("btn-outline-primary");
    }
  }

  function updateStatus(visible, cat) {
    if (!statusEl) return;
    statusEl.textContent = `Menampilkan ${visible} foto (${
      cat === "all" ? "Semua" : labelCategory(cat)
    })`;
  }

  let CACHE = null;
  async function fetchItems() {
    if (CACHE) return CACHE;
    const res = await fetch(CSV_URL);
    const text = await res.text();

    const rows = parseCSV(text).filter((r) => r.some((x) => String(x).trim()));
    const header = rows.shift().map((h) => h.toLowerCase());

    const idx = (n) => header.indexOf(n);
    const iUrl = idx("link");
    const iTitle = idx("title");
    const iCaption = idx("caption");
    const iCategory = idx("kategori");

    CACHE = rows
      .map((r) => ({
        url: (r[iUrl] || "").trim(),
        title: (r[iTitle] || "").trim(),
        caption: (r[iCaption] || "").trim(),
        category: normalizeCategory(r[iCategory] || ""),
      }))
      .filter((it) => it.url);

    return CACHE;
  }

  function render(items) {
    grid.innerHTML = items
      .map(
        (it) => `
      <div class="col-12 col-sm-6 col-lg-4 gallery-item" data-category="${
        it.category
      }">
        <div class="gallery-card">
          <button class="btn p-0 border-0 w-100 bg-transparent"
            data-bs-toggle="modal"
            data-bs-target="#galleryModal"
            data-img="${escapeHtml(it.url)}"
            data-title="${escapeHtml(it.title)}"
            data-meta="${labelCategory(it.category)}"
            data-caption="${escapeHtml(it.caption)}">
            <img class="gallery-img" src="${escapeHtml(it.url)}" loading="lazy">
          </button>
          <div class="mt-2">
            <div class="fw-semibold">${escapeHtml(it.title)}</div>
            <div class="text-muted small">${labelCategory(it.category)}</div>
          </div>
        </div>
      </div>
    `
      )
      .join("");
  }

  function applyFilter(cat) {
    const els = document.querySelectorAll(".gallery-item");
    let visible = 0;

    els.forEach((el) => {
      const c = el.dataset.category || "";
      const show = cat === "all" ? true : c === cat;
      el.style.display = show ? "" : "none";
      if (show) visible++;
    });

    updateStatus(visible, cat);
  }

  function bindFilters() {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const cat = btn.dataset.galleryFilter || "all";

        setActiveButton(cat);
        applyFilter(cat);

        // sync URL
        const url = new URL(location.href);
        if (cat === "all") url.searchParams.delete("filter");
        else url.searchParams.set("filter", cat);
        history.replaceState(null, "", url.toString());
      });
    });
  }

  function bindModal() {
    if (!galleryModal) return;
    galleryModal.addEventListener("show.bs.modal", (e) => {
      const t = e.relatedTarget;
      modalTitle.textContent = t.dataset.title;
      modalImg.src = t.dataset.img;
      modalMeta.textContent = t.dataset.meta;
      modalCaption.textContent = t.dataset.caption;
    });
  }

  (async () => {
    const items = await fetchItems();
    render(items);
    bindFilters();
    bindModal();

    const init = getInitialFilter();
    setActiveButton(init);
    applyFilter(init);
  })();
});
