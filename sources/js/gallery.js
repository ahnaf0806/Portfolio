"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // ===================== CONFIG =====================
  const SHEET_ID = "1EH8wH78Pr_x2-SLq32QzpDlMPEe7_qgMe-Ti2vR6E6w";
  const SHEET_GID = "0";
  const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${SHEET_GID}`;

  // kategori yang diizinkan oleh UI filter
  const ALLOWED = new Set([
    "all",
    "akademik",
    "kampus",
    "luar",
    "sertifikat",
    "project",
  ]);

  // ===================== DOM =====================
  const grid = document.getElementById("galleryGrid");
  if (!grid) return; // hanya jalan di galeri.html

  const statusEl = document.getElementById("galleryStatus");
  const filterBtns = Array.from(
    document.querySelectorAll("[data-gallery-filter]")
  );

  const galleryModal = document.getElementById("galleryModal");
  const modalTitle = document.getElementById("galleryModalTitle");
  const modalImg = document.getElementById("galleryModalImg");
  const modalMeta = document.getElementById("galleryModalMeta");
  const modalCaption = document.getElementById("galleryModalCaption");

  // ===================== UTIL =====================
  const escapeHtml = (str) =>
    String(str ?? "").replace(/[&<>"']/g, (m) => {
      return (
        {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;",
        }[m] || m
      );
    });

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
        } else {
          inQuotes = !inQuotes;
        }
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

  // Normalisasi kategori agar pasti cocok dengan filter UI
  function normalizeCategory(raw) {
    const s = String(raw || "")
      .trim()
      .toLowerCase();
    if (!s) return "";
    if (s.includes("akademik")) return "akademik";
    if (s.includes("kampus") || s.includes("kontribusi")) return "kampus";
    if (s.includes("luar")) return "luar";
    if (s.includes("sertif")) return "sertifikat";
    if (s.includes("project") || s.includes("projek")) return "project";
    // jika sheet sudah isi kategori pendek (akademik/kampus/luar/sertifikat/project)
    if (ALLOWED.has(s)) return s;
    return "";
  }

  function labelCategory(cat) {
    if (cat === "akademik") return "Kegiatan Akademik";
    if (cat === "kampus") return "Kontribusi Kampus";
    if (cat === "luar") return "Luar Kampus";
    if (cat === "sertifikat") return "Sertifikat";
    if (cat === "project") return "Project";
    return cat || "";
  }

  function getInitialFilter() {
    const params = new URLSearchParams(location.search);
    const raw = (params.get("filter") || "all").toLowerCase();
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
      btn.classList.remove("btn-outline-primary");
      btn.classList.add("btn-primary");
    }
  }

  function updateStatus(visible, cat) {
    if (!statusEl) return;
    const label = cat === "all" ? "Semua" : labelCategory(cat);
    statusEl.textContent = `Menampilkan ${visible} foto (${label})`;
  }

  // ===================== DATA FETCH (cached) =====================
  let ITEMS_CACHE_PROMISE = null;

  function fetchItems() {
    if (ITEMS_CACHE_PROMISE) return ITEMS_CACHE_PROMISE;

    ITEMS_CACHE_PROMISE = fetch(CSV_URL, { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error(`Fetch CSV failed: ${r.status}`);
        return r.text();
      })
      .then((csv) => {
        const rows = parseCSV(csv).filter((r) =>
          r.some((x) => String(x).trim() !== "")
        );
        const header = (rows.shift() || []).map((h) =>
          String(h).trim().toLowerCase()
        );

        // support header variasi
        const idx = (names) => {
          for (const n of names) {
            const i = header.indexOf(n);
            if (i >= 0) return i;
          }
          return -1;
        };

        const iUrl = idx(["link", "url", "image", "gambar"]);
        const iTitle = idx(["title", "judul", "nama"]);
        const iCaption = idx(["caption", "keterangan", "deskripsi"]);
        const iCategory = idx(["kategori", "category", "cat"]);

        if (iUrl < 0) {
          throw new Error(
            `Kolom link/url tidak ditemukan. Header terbaca: ${header.join(
              ", "
            )}`
          );
        }

        return rows
          .map((r) => ({
            url: (r[iUrl] || "").trim(),
            title: (iTitle >= 0 ? r[iTitle] || "" : "").trim(),
            caption: (iCaption >= 0 ? r[iCaption] || "" : "").trim(),
            category: normalizeCategory(
              iCategory >= 0 ? r[iCategory] || "" : ""
            ),
          }))
          .filter((it) => it.url);
      });

    return ITEMS_CACHE_PROMISE;
  }

  // ===================== RENDER =====================
  function render(items) {
    grid.innerHTML = items
      .map((it, idx) => {
        const title = escapeHtml(it.title || "Dokumentasi");
        const caption = escapeHtml(it.caption || "");
        const url = escapeHtml(it.url);
        const cat = escapeHtml(it.category || "");
        const meta = escapeHtml(labelCategory(it.category));

        return `
          <div class="col-12 col-sm-6 col-lg-4 gallery-item" data-category="${cat}">
            <div class="gallery-card">
              <button type="button" class="btn p-0 border-0 w-100 bg-transparent"
                data-bs-toggle="modal" data-bs-target="#galleryModal"
                data-img="${url}" data-title="${title}" data-meta="${meta}" data-caption="${caption}">
                <img class="gallery-img" src="${url}" alt="${title}" loading="lazy" />
              </button>
              <div class="mt-2">
                <div class="fw-semibold">${title}</div>
                <div class="text-muted" style="font-size:13px">${
                  meta || "-"
                }</div>
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    // fallback jika gambar error → tetap tampil kartu tapi gambar diganti placeholder
    grid.querySelectorAll("img.gallery-img").forEach((img) => {
      img.addEventListener("error", () => {
        img.remove();
        const holder = document.createElement("div");
        holder.className = "text-muted small";
        holder.style.padding = "12px 0";
        holder.textContent = "Gagal memuat gambar (cek link gambar).";
        // button adalah parent langsung img
        const btn = img.closest("button");
        if (btn) btn.appendChild(holder);
      });
    });
  }

  function applyFilter(cat) {
    const els = Array.from(document.querySelectorAll(".gallery-item"));
    let visible = 0;

    els.forEach((el) => {
      const c = el.dataset.category || "";
      const show = cat === "all" || c === cat;
      el.style.display = show ? "" : "none";
      if (show) visible++;
    });

    updateStatus(visible, cat);
  }

  function bindFilters() {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const cat = (btn.dataset.galleryFilter || "all").toLowerCase();
        const safe = ALLOWED.has(cat) ? cat : "all";
        setActiveButton(safe);
        applyFilter(safe);

        // update URL tanpa reload
        const url = new URL(location.href);
        if (safe === "all") url.searchParams.delete("filter");
        else url.searchParams.set("filter", safe);
        history.replaceState(null, "", url.toString());
      });
    });
  }

  // ===================== MODAL =====================
  function bindModal() {
    if (!galleryModal) return;

    galleryModal.addEventListener("show.bs.modal", (event) => {
      const trigger = event.relatedTarget;
      if (!trigger) return;

      const img = trigger.getAttribute("data-img") || "";
      const title = trigger.getAttribute("data-title") || "Dokumentasi";
      const meta = trigger.getAttribute("data-meta") || "";
      const caption = trigger.getAttribute("data-caption") || "";

      if (modalTitle) modalTitle.textContent = title;
      if (modalImg) {
        modalImg.src = img;
        modalImg.alt = title;
      }
      if (modalMeta) modalMeta.textContent = meta;
      if (modalCaption) modalCaption.textContent = caption;
    });
  }

  // ===================== INIT =====================
  (async function init() {
    try {
      if (statusEl)
        statusEl.textContent = "Memuat data galeri dari Google Sheets...";

      const items = await fetchItems();
      render(items);

      bindFilters();
      bindModal();

      const initial = getInitialFilter();
      setActiveButton(initial);
      applyFilter(initial);
    } catch (err) {
      console.error(err);
      if (statusEl) {
        statusEl.textContent =
          "Gagal memuat galeri. Pastikan Google Sheet public/publish CSV, dan header kolom minimal punya 'link'.";
      }
    }
  })();
});
