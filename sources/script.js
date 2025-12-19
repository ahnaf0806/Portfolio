// Tahun footer
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const id = link.getAttribute("href");
    if (!id || id === "#") return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", id);
  });
});

// Close offcanvas when clicking menu item
document.querySelectorAll("[data-close-offcanvas]").forEach((a) => {
  a.addEventListener("click", () => {
    const el = document.getElementById("menu");
    if (!el || !window.bootstrap) return;
    const inst = bootstrap.Offcanvas.getInstance(el);
    if (inst) inst.hide();
  });
});

// Scrollspy (menu aktif mengikuti section yang sedang terlihat)
(function () {
  const sections = Array.from(document.querySelectorAll("section[id]"));
  if (!sections.length) return;

  const navLinks = Array.from(
    document.querySelectorAll('a.navlink[href^="#"]')
  );

  function setActive(hash) {
    navLinks.forEach((a) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const isActive = href === hash;
      a.classList.toggle("active", isActive);
      if (isActive) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  // initial
  if (location.hash) setActive(location.hash);

  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      (entries) => {
        // Ambil entry yang paling "kuat" terlihat
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive("#" + visible.target.id);
      },
      {
        root: null,
        threshold: [0.15, 0.3, 0.45, 0.6],
        rootMargin: "-25% 0px -55% 0px",
      }
    );

    sections.forEach((sec) => obs.observe(sec));
  } else {
    // fallback sederhana
    window.addEventListener("scroll", () => {
      const fromTop = window.scrollY + 120;
      let current = sections[0];
      sections.forEach((sec) => {
        if (sec.offsetTop <= fromTop) current = sec;
      });
      setActive("#" + current.id);
    });
  }
})();
(() => {
  const KHS_DATA = {
    1: {
      note: "KHS Semester 1.",
      rows: [
        {
          no: 1,
          kode: "101",
          mk: "PENDIDIKAN PANCASILA",
          sks: 2,
          nilai: "A",
          mutu: 8,
        },
        {
          no: 2,
          kode: "104",
          mk: "BAHASA INGGRIS I",
          sks: 2,
          nilai: "A",
          mutu: 8,
        },
        {
          no: 3,
          kode: "153",
          mk: "PENGANTAR TEKNOLOGI INFORMASI DAN KOMUNIKASI",
          sks: 3,
          nilai: "A",
          mutu: 12,
        },
        {
          no: 4,
          kode: "207",
          mk: "LOGIKA DAN ALGORITMA",
          sks: 4,
          nilai: "A",
          mutu: 16,
        },
        {
          no: 5,
          kode: "712",
          mk: "ENTREPRENEURSHIP",
          sks: 3,
          nilai: "A",
          mutu: 12,
        },
        {
          no: 6,
          kode: "894",
          mk: "DASAR PEMROGRAMAN",
          sks: 4,
          nilai: "A",
          mutu: 16,
        },
      ],
      totalSks: 18,
      totalMutu: 72,
      ipk: "4,00",
    },

    2: {
      note: " KHS Semester 2.",
      rows: [
        {
          no: 1,
          kode: "894",
          mk: "DASAR PEMROGRAMAN",
          sks: 4,
          nilai: "A",
          mutu: 16,
        },
        {
          no: 2,
          kode: "712",
          mk: "ENTREPRENEURSHIP",
          sks: 3,
          nilai: "A",
          mutu: 12,
        },
        {
          no: 3,
          kode: "207",
          mk: "LOGIKA DAN ALGORITMA",
          sks: 4,
          nilai: "A",
          mutu: 16,
        },
        {
          no: 4,
          kode: "101",
          mk: "PENDIDIKAN PANCASILA",
          sks: 2,
          nilai: "A",
          mutu: 8,
        },
        {
          no: 5,
          kode: "104",
          mk: "BAHASA INGGRIS I",
          sks: 2,
          nilai: "A",
          mutu: 8,
        },
        {
          no: 6,
          kode: "153",
          mk: "PENGANTAR TEKNOLOGI INFORMASI DAN KOMUNIKASI",
          sks: 3,
          nilai: "A",
          mutu: 12,
        },
        {
          no: 7,
          kode: "694",
          mk: "APLIKASI BASIS DATA",
          sks: 3,
          nilai: "A",
          mutu: 12,
        },
        {
          no: 8,
          kode: "106",
          mk: "PENDIDIKAN KEWARGANEGARAAN",
          sks: 2,
          nilai: "B",
          mutu: 6,
        },
        {
          no: 9,
          kode: "105",
          mk: "BAHASA INGGRIS II",
          sks: 2,
          nilai: "A",
          mutu: 8,
        },
        {
          no: 10,
          kode: "0610",
          mk: "WEB PROGRAMMING I",
          sks: 3,
          nilai: "A",
          mutu: 12,
        },
        {
          no: 11,
          kode: "0521",
          mk: "UI/UX DESIGN",
          sks: 3,
          nilai: "B",
          mutu: 9,
        },
        {
          no: 12,
          kode: "0515",
          mk: "KONSEP BASIS DATA",
          sks: 3,
          nilai: "B",
          mutu: 9,
        },
        {
          no: 13,
          kode: "0511",
          mk: "ALGORITMA DATA SCIENCE",
          sks: 3,
          nilai: "A",
          mutu: 12,
        },
      ],
      totalSks: 37,
      totalMutu: 140,
      ipk: "3,78",
    },
  };

  const select = document.getElementById("semesterSelect");
  const tbody = document.getElementById("khsTbody");
  const noteEl = document.getElementById("khsNote");
  const totalSksEl = document.getElementById("khsTotalSks");
  const totalMutuEl = document.getElementById("khsTotalMutu");
  const ipkEl = document.getElementById("khsIpk");

  if (!select || !tbody) return;

  const escapeHtml = (str) =>
    String(str).replace(
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

  function renderKhs(semester) {
    const data = KHS_DATA[String(semester)] || KHS_DATA["1"];

    if (noteEl) noteEl.textContent = data.note;

    tbody.innerHTML = data.rows
      .map(
        (r) => `
      <tr>
        <td>${r.no}</td>
        <td>${escapeHtml(r.kode)}</td>
        <td>${escapeHtml(r.mk)}</td>
        <td>${r.sks}</td>
        <td>${escapeHtml(r.nilai)}</td>
        <td>${r.mutu}</td>
      </tr>
    `
      )
      .join("");

    if (totalSksEl) totalSksEl.textContent = data.totalSks;
    if (totalMutuEl) totalMutuEl.textContent = data.totalMutu;
    if (ipkEl) ipkEl.textContent = data.ipk;
  }

  select.addEventListener("change", () => renderKhs(select.value));

  // default tampil semester 1
  select.value = select.value || "1";
  renderKhs(select.value);
})();

// ===================== GALERI (Google Sheets -> CSV) =====================
(() => {
  const grid = document.getElementById("galleryGrid");
  if (!grid) return; // hanya jalan di galeri.html

  const statusEl = document.getElementById("galleryStatus");
  const filterBtns = Array.from(
    document.querySelectorAll("[data-gallery-filter]")
  );
  const modalEl = document.getElementById("galleryModal");

  const SHEET_ID = "1EH8wH78Pr_x2-SLq32QzpDlMPEe7_qgMe-Ti2vR6E6w";
  const SHEET_GID = "0";
  const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${SHEET_GID}`;

  const ALLOWED = new Set(["all", "akademik", "kampus", "luar", "sertifikat"]);

  function escapeHtml(str) {
    return String(str ?? "").replace(
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
  }

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

  function normalizeCategory(raw) {
    const s = String(raw || "")
      .trim()
      .toLowerCase();
    if (!s) return "";
    if (s.includes("akademik")) return "akademik";
    if (
      s.includes("kontribusi") ||
      (s.includes("kampus") && !s.includes("luar"))
    )
      return "kampus";
    if (s.includes("luar")) return "luar";
    if (s.includes("sertif")) return "sertifikat";
    return s;
  }

  function labelCategory(cat) {
    if (cat === "akademik") return "Kegiatan Akademik";
    if (cat === "kampus") return "Kontribusi Kampus";
    if (cat === "luar") return "Luar Kampus";
    if (cat === "sertifikat") return "Sertifikat";
    return cat || "";
  }

  function setActiveButton(targetCat) {
    filterBtns.forEach((b) => {
      b.classList.remove("btn-primary");
      b.classList.add("btn-outline-primary");
    });
    const btn =
      document.querySelector(`[data-gallery-filter="${targetCat}"]`) ||
      document.querySelector(`[data-gallery-filter="all"]`);
    if (btn) {
      btn.classList.remove("btn-outline-primary");
      btn.classList.add("btn-primary");
    }
  }

  function applyFilter(cat) {
    const items = Array.from(document.querySelectorAll(".gallery-item"));
    let visible = 0;
    items.forEach((el) => {
      const c = el.getAttribute("data-category") || "";
      const show = cat === "all" || c === cat;
      el.style.display = show ? "" : "none";
      if (show) visible++;
    });
    if (statusEl)
      statusEl.textContent = `Menampilkan ${visible} foto (${
        cat === "all" ? "Semua" : labelCategory(cat)
      })`;
  }

  function getInitialFilter() {
    const params = new URLSearchParams(location.search);
    const raw = (params.get("filter") || "all").toLowerCase();
    return ALLOWED.has(raw) ? raw : "all";
  }

  function render(items) {
    grid.innerHTML = items
      .map((it) => {
        const title = escapeHtml(it.title || "Dokumentasi");
        const caption = escapeHtml(it.caption || "");
        const url = escapeHtml(it.url);
        const cat = escapeHtml(it.category);
        const meta = escapeHtml(labelCategory(it.category));

        return `
        <div class="col-12 col-sm-6 col-lg-4 gallery-item" data-category="${cat}">
          <div class="gallery-card">
            <button type="button" class="btn p-0 border-0 w-100 bg-transparent"
              data-bs-toggle="modal" data-bs-target="#galleryModal"
              data-img="${url}" data-title="${title}" data-meta="${meta}" data-caption="${caption}">
              <img class="gallery-img" src="${url}" alt="${title}"
                onerror="this.style.display='none'; this.closest('.gallery-item').style.display='none';" />
            </button>

            <div class="mt-2">
              <div class="fw-semibold">${title}</div>
              <div class="text-muted" style="font-size: 13px">${meta}</div>
            </div>
          </div>
        </div>
      `;
      })
      .join("");
  }

  async function init() {
    try {
      if (statusEl)
        statusEl.textContent = "Memuat data galeri dari Google Sheets...";
      const res = await fetch(CSV_URL);
      const text = await res.text();

      const rows = parseCSV(text).filter((r) =>
        r.some((x) => String(x).trim() !== "")
      );
      const header = (rows.shift() || []).map((h) =>
        String(h).trim().toLowerCase()
      );
      const idx = (name) => header.indexOf(name);

      const iUrl = idx("link");
      const iTitle = idx("title");
      const iCaption = idx("caption");
      const iCategory = idx("kategori");

      const items = rows
        .map((r) => ({
          url: (r[iUrl] || "").trim(),
          title: (r[iTitle] || "").trim(),
          caption: (r[iCaption] || "").trim(),
          category: normalizeCategory(r[iCategory] || ""),
        }))
        .filter((it) => it.url);

      render(items);

      filterBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          const cat = (
            btn.getAttribute("data-gallery-filter") || "all"
          ).toLowerCase();
          setActiveButton(cat);
          applyFilter(cat);
        });
      });

      const initial = getInitialFilter();
      setActiveButton(initial);
      applyFilter(initial);

      if (modalEl) {
        modalEl.addEventListener("show.bs.modal", (event) => {
          const trigger = event.relatedTarget;
          if (!trigger) return;

          const img = trigger.getAttribute("data-img") || "";
          const title = trigger.getAttribute("data-title") || "Dokumentasi";
          const meta = trigger.getAttribute("data-meta") || "";
          const caption = trigger.getAttribute("data-caption") || "";

          const t = document.getElementById("galleryModalTitle");
          const im = document.getElementById("galleryModalImg");
          const m = document.getElementById("galleryModalMeta");
          const c = document.getElementById("galleryModalCaption");

          if (t) t.textContent = title;
          if (im) {
            im.src = img;
            im.alt = title;
          }
          if (m) m.textContent = meta;
          if (c) c.textContent = caption;
        });
      }
    } catch (err) {
      console.error(err);
      if (statusEl) {
        statusEl.textContent =
          "Gagal memuat galeri. Pastikan Sheet public/publish CSV, header kolom benar (link,title,caption,kategori), dan link imgbb direct (i.ibb.co).";
      }
    }
  }

  init();
})();
// ===================== FOTO ACCORDION DARI GOOGLE SHEETS =====================
(() => {
  const holders = document.querySelectorAll("[data-sheet-photos]");
  if (!holders.length) return; // hanya jalan kalau ada wadahnya

  // === ganti sesuai sheet kamu ===
  const SHEET_ID = "1EH8wH78Pr_x2-SLq32QzpDlMPEe7_qgMe-Ti2vR6E6w";
  const SHEET_GID = "0";
  const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${SHEET_GID}`;

  // --- util ---
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
    if (s.includes("akademik")) return "akademik";
    if (
      s.includes("kontribusi") ||
      (s.includes("kampus") && !s.includes("luar"))
    )
      return "kampus";
    if (s.includes("luar")) return "luar";
    if (s.includes("sertif")) return "sertifikat";
    return s;
  }

  // cache biar tidak fetch berkali-kali
  window.__SHEET_ITEMS_PROMISE__ =
    window.__SHEET_ITEMS_PROMISE__ ||
    fetch(CSV_URL)
      .then((r) => r.text())
      .then((csv) => {
        const rows = parseCSV(csv).filter((r) =>
          r.some((x) => String(x).trim() !== "")
        );
        const header = (rows.shift() || []).map((h) =>
          String(h).trim().toLowerCase()
        );

        const idx = (name) => header.indexOf(name);
        const iUrl = idx("link");
        const iTitle = idx("title");
        const iCaption = idx("caption");
        const iCategory = idx("kategori");

        return rows
          .map((r) => ({
            url: (r[iUrl] || "").trim(),
            title: (r[iTitle] || "").trim(),
            caption: (r[iCaption] || "").trim(),
            category: normalizeCategory(r[iCategory] || ""),
          }))
          .filter((it) => it.url);
      });

  function renderPhotos(holder, items) {
    const t = (holder.getAttribute("data-title") || "").trim().toLowerCase();
    const c = normalizeCategory(holder.getAttribute("data-category") || "");

    const matches = items.filter((it) => {
      const sameTitle = it.title.trim().toLowerCase() === t;
      const sameCat = !c || it.category === c;
      return sameTitle && sameCat;
    });

    if (!matches.length) {
      holder.innerHTML = `<div class="text-muted small">Belum ada foto untuk "${escapeHtml(
        holder.getAttribute("data-title")
      )}" di Sheets.</div>`;
      return;
    }

    holder.innerHTML = `
      <div class="row g-2">
        ${matches
          .map(
            (it) => `
          <div class="col-12 col-sm-6 col-lg-4">
            <div class="ph-card">
              <button type="button" class="btn p-0 border-0 w-100 bg-transparent"
                data-bs-toggle="modal" data-bs-target="#imgModal"
                data-img-src="${escapeHtml(it.url)}"
                data-img-title="${escapeHtml(it.title || "Dokumentasi")}"
                data-img-caption="${escapeHtml(it.caption || "")}">
                <img src="${escapeHtml(it.url)}" alt="${escapeHtml(
              it.title || "Dokumentasi"
            )}"
              </button>
              <div class="mt-2">
                <div class="fw-semibold">${escapeHtml(
                  it.title || "Dokumentasi"
                )}</div>
                ${
                  it.caption
                    ? `<div class="text-muted" style="font-size:13px">${escapeHtml(
                        it.caption
                      )}</div>`
                    : ""
                }
              </div>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  }

  // Modal imgModal
  const imgModal = document.getElementById("imgModal");
  if (imgModal) {
    imgModal.addEventListener("show.bs.modal", (event) => {
      const trigger = event.relatedTarget;
      if (!trigger) return;

      const src = trigger.getAttribute("data-img-src") || "";
      const title = trigger.getAttribute("data-img-title") || "Dokumentasi";
      const caption = trigger.getAttribute("data-img-caption") || "";

      const titleEl = document.getElementById("imgModalTitle");
      const imgEl = document.getElementById("imgModalImg");
      const capEl = document.getElementById("imgModalCaption");

      if (titleEl) titleEl.textContent = title;
      if (imgEl) {
        imgEl.src = src;
        imgEl.alt = title;
      }
      if (capEl) capEl.textContent = caption;
    });
  }

  // jalanin
  window.__SHEET_ITEMS_PROMISE__
    .then((items) => holders.forEach((h) => renderPhotos(h, items)))
    .catch((e) => {
      console.error(e);
      holders.forEach(
        (h) =>
          (h.innerHTML = `<div class="text-danger small">Gagal memuat foto dari Sheets.</div>`)
      );
    });
})();
