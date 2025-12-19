// sources/js/khs.js
"use strict";

import { $ } from "./core.js";

// ===================== DATA KHS (MODULE SCOPE) =====================
const KHS_DATA = {
  1: {
    note: "KHS Semester 1.",
    totalSks: 18,
    totalMutu: 72,
    ipk: "4,00",
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
      { no: 3, kode: "153", mk: "PTIK", sks: 3, nilai: "A", mutu: 12 },
      {
        no: 4,
        kode: "207",
        mk: "LOGIKA & ALGORITMA",
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
  },

  2: {
    note: "KHS Semester 2.",
    totalSks: 37,
    totalMutu: 140,
    ipk: "3,78",
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
        mk: "LOGIKA & ALGORITMA",
        sks: 4,
        nilai: "A",
        mutu: 16,
      },
      { no: 4, kode: "101", mk: "PANCASILA", sks: 2, nilai: "A", mutu: 8 },
      { no: 5, kode: "104", mk: "INGGRIS I", sks: 2, nilai: "A", mutu: 8 },
      { no: 6, kode: "153", mk: "PTIK", sks: 3, nilai: "A", mutu: 12 },
      { no: 7, kode: "694", mk: "BASIS DATA", sks: 3, nilai: "A", mutu: 12 },
      {
        no: 8,
        kode: "106",
        mk: "KEWARGANEGARAAN",
        sks: 2,
        nilai: "B",
        mutu: 6,
      },
      { no: 9, kode: "105", mk: "INGGRIS II", sks: 2, nilai: "A", mutu: 8 },
      {
        no: 10,
        kode: "0610",
        mk: "WEB PROGRAMMING I",
        sks: 3,
        nilai: "A",
        mutu: 12,
      },
      { no: 11, kode: "0521", mk: "UI/UX DESIGN", sks: 3, nilai: "B", mutu: 9 },
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
        mk: "DATA SCIENCE",
        sks: 3,
        nilai: "A",
        mutu: 12,
      },
    ],
  },
};

// ===================== IPK PROGRESS (AUTO DARI KHS) =====================
function updateIpkProgress(sem) {
  const d = KHS_DATA[String(sem)] || KHS_DATA["1"];
  const rawIpk = d.ipk || "0";

  const ipkValue = parseFloat(String(rawIpk).replace(",", "."));
  if (Number.isNaN(ipkValue)) return;

  const maxIpk = 4.0;
  const percent = Math.min((ipkValue / maxIpk) * 100, 100);

  const targets = [
    { text: "#ipkTextTarget", bar: "#ipkProgressTarget" },
    { text: "#ipkTextNilai", bar: "#ipkProgressNilai" },
  ];

  targets.forEach(({ text, bar }) => {
    const t = document.querySelector(text);
    const b = document.querySelector(bar);
    if (!t || !b) return;

    t.textContent = `${ipkValue.toFixed(2)} / 4.00`;

    requestAnimationFrame(() => {
      b.style.width = percent.toFixed(1) + "%";
      b.setAttribute("aria-valuenow", ipkValue);
    });
  });
}

// ===================== INIT KHS =====================
function initKhs() {
  const select = $("#semesterSelect");
  const tbody = $("#khsTbody");
  if (!select || !tbody) return;

  const noteEl = $("#khsNote");
  const totalSksEl = $("#khsTotalSks");
  const totalMutuEl = $("#khsTotalMutu");
  const ipkEl = $("#khsIpk");

  const render = (sem) => {
    const d = KHS_DATA[String(sem)] || KHS_DATA["1"];

    if (noteEl) noteEl.textContent = d.note;
    if (totalSksEl) totalSksEl.textContent = d.totalSks;
    if (totalMutuEl) totalMutuEl.textContent = d.totalMutu;
    if (ipkEl) ipkEl.textContent = d.ipk;

    tbody.innerHTML = d.rows
      .map(
        (r) => `
          <tr>
            <td>${r.no}</td>
            <td>${r.kode}</td>
            <td>${r.mk}</td>
            <td>${r.sks}</td>
            <td>${r.nilai}</td>
            <td>${r.mutu}</td>
          </tr>
        `
      )
      .join("");

    // update progress IPK sesuai semester aktif
    updateIpkProgress(sem);
  };

  select.addEventListener("change", () => render(select.value));
  render(select.value || "1");
}

// module script aman: DOMContentLoaded
document.addEventListener("DOMContentLoaded", initKhs);
