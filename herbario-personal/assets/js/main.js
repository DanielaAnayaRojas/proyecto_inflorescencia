/* ============================================
   HERBARIO PERSONAL — lógica de catálogo
   Lee las fichas (JSON) desde la carpeta content/flowers
   directamente vía la API pública de GitHub. No necesita
   servidor ni proceso de compilación (build).
   ============================================ */

// ⚠️ EDITA ESTAS DOS LÍNEAS con tu usuario y repositorio de GitHub
const GITHUB_USER = "TU-USUARIO";
const GITHUB_REPO = "TU-REPOSITORIO";
const BRANCH = "main";

const FOLDER = "content/flowers";
const API_URL = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${FOLDER}?ref=${BRANCH}`;

const grid = document.getElementById("grid");
const statTotal = document.getElementById("stat-total");
const statLatest = document.getElementById("stat-latest");

const overlay = document.getElementById("detailOverlay");
document.getElementById("detailClose").addEventListener("click", closeDetail);
overlay.addEventListener("click", (e) => { if (e.target === overlay) closeDetail(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDetail(); });

function closeDetail() {
  overlay.hidden = true;
}

function openDetail(flor) {
  document.getElementById("detailScientific").textContent = flor.scientific_name || "";
  document.getElementById("detailTitle").textContent = flor.title || "Sin título";
  const img = document.getElementById("detailPhoto");
  img.src = flor.image || "";
  img.alt = flor.title || "";

  const meta = document.getElementById("detailMeta");
  meta.innerHTML = "";
  [
    flor.date ? formatDate(flor.date) : null,
    flor.season || null,
    flor.color || null,
  ].filter(Boolean).forEach((txt) => {
    const span = document.createElement("span");
    span.textContent = txt;
    meta.appendChild(span);
  });

  document.getElementById("detailBody").textContent = flor.body || "";
  overlay.hidden = false;
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
  } catch { return iso; }
}

function specimenCard(flor, index) {
  const card = document.createElement("article");
  card.className = "specimen-card";
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `Ver ficha completa de ${flor.title || "flor"}`);

  const num = String(index + 1).padStart(3, "0");

  card.innerHTML = `
    <span class="specimen-tag">N.º ${num}</span>
    <div class="specimen-photo-frame">
      <img src="${flor.image || ''}" alt="${flor.title || ''}" loading="lazy">
    </div>
    <h3 class="specimen-name">${flor.title || "Sin título"}</h3>
    <p class="specimen-scientific">${flor.scientific_name || ""}</p>
    <p class="specimen-excerpt">${(flor.body || "").slice(0, 120)}${(flor.body || "").length > 120 ? "…" : ""}</p>
    <div class="specimen-meta">
      ${flor.date ? `<span>${formatDate(flor.date)}</span>` : ""}
      ${flor.season ? `<span>${flor.season}</span>` : ""}
      ${flor.color ? `<span>${flor.color}</span>` : ""}
    </div>
  `;

  card.addEventListener("click", () => openDetail(flor));
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openDetail(flor); }
  });

  return card;
}

function renderEmpty(message) {
  grid.innerHTML = `<div class="empty-state">${message}</div>`;
}

async function loadCatalog() {
  if (GITHUB_USER === "TU-USUARIO" || GITHUB_REPO === "TU-REPOSITORIO") {
    renderEmpty(
      "Configura tu usuario y repositorio en assets/js/main.js (líneas GITHUB_USER / GITHUB_REPO) para que el catálogo cargue tus fichas."
    );
    return;
  }

  try {
    const listRes = await fetch(API_URL);
    if (listRes.status === 404) {
      renderEmpty("Aún no hay fichas en content/flowers. Agrega la primera desde el panel /admin.");
      return;
    }
    if (!listRes.ok) throw new Error(`GitHub API respondió ${listRes.status}`);

    const files = (await listRes.json()).filter((f) => f.name.endsWith(".json"));

    if (files.length === 0) {
      renderEmpty("Aún no hay fichas en content/flowers. Agrega la primera desde el panel /admin.");
      return;
    }

    const flores = await Promise.all(
      files.map(async (f) => {
        const res = await fetch(f.download_url);
        return res.json();
      })
    );

    flores.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

    grid.innerHTML = "";
    flores.forEach((flor, i) => grid.appendChild(specimenCard(flor, i)));

    statTotal.textContent = flores.length;
    statLatest.textContent = flores[0]?.date ? formatDate(flores[0].date) : "—";
  } catch (err) {
    console.error(err);
    renderEmpty("No se pudo cargar el catálogo. Revisa la consola para más detalles.");
  }
}

loadCatalog();
