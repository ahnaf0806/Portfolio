// const SHEET_ID = "1EH8wH78Pr_x2-SLq32QzpDlMPEe7_qgMe-Ti2vR6E6w";
// const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=0`;

// let CACHE = null;

// function parseCSV(text) {
//   const rows = [];
//   let row = [],
//     cell = "",
//     q = false;
//   for (let i = 0; i < text.length; i++) {
//     const c = text[i],
//       n = text[i + 1];
//     if (c === '"') {
//       if (q && n === '"') {
//         cell += '"';
//         i++;
//       } else q = !q;
//       continue;
//     }
//     if (c === "," && !q) {
//       row.push(cell);
//       cell = "";
//       continue;
//     }
//     if ((c === "\n" || c === "\r") && !q) {
//       if (c === "\r" && n === "\n") i++;
//       row.push(cell);
//       rows.push(row);
//       row = [];
//       cell = "";
//       continue;
//     }
//     cell += c;
//   }
//   if (cell || row.length) {
//     row.push(cell);
//     rows.push(row);
//   }
//   return rows;
// }

// function normalizeCategory(raw) {
//   const s = String(raw || "").toLowerCase();
//   if (s.includes("akademik")) return "akademik";
//   if (s.includes("kampus")) return "kampus";
//   if (s.includes("luar")) return "luar";
//   if (s.includes("sertif")) return "sertifikat";
//   if (s.includes("project")) return "project";
//   return "";
// }

// export async function getSheetItems() {
//   if (CACHE) return CACHE;

//   const csv = await fetch(CSV_URL).then((r) => r.text());
//   const rows = parseCSV(csv);
//   const head = rows.shift().map((h) => h.toLowerCase());
//   const idx = (n) => head.indexOf(n);

//   CACHE = rows
//     .map((r) => ({
//       url: r[idx("link")] || "",
//       title: r[idx("title")] || "",
//       caption: r[idx("caption")] || "",
//       category: normalizeCategory(r[idx("kategori")]),
//     }))
//     .filter((i) => i.url);

//   return CACHE;
// }
