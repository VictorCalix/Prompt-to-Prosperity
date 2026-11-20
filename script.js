const linkpostulacion = "";
let faqItems = [];

// Videos del inicio. Escribe el nombre de un archivo ubicado en assets/videos/.
// - fondo: se reproduce sin sonido y en bucle detrás de "Prompt to Prosperity".
// - informativo: si tiene nombre, aparece el botón "Ver video informativo" y se abre con sonido.
//   Déjalo vacío ("") mientras no exista ese video.
const videos = {
  fondo: "video-temporal.mp4",
  informativo: ""
};

const videoUrl = (filename) => `assets/videos/${encodeURIComponent(filename)}`;

const directoryManifestUrl = "pages/directory.json";
const businessRibbonManifestUrl = "assets/Negocios%20Cinta/manifest.json";

const legacyMembers = [
  {
    name: "Katheryne Lara",
    role: "Coordinación de proyecto",
    description: "Organiza actividades, alianzas y seguimiento de los emprendedores.",
    initials: "KL",
    url: "pages/miembros/Katheryne-Lara.html"
  },
  {
    name: "Victor Calix",
    role: "Mentor digital",
    description: "Apoya en herramientas de SI, productividad y presencia digital.",
    initials: "VC",
    url: "pages/miembros/Victor-Calix.html"
  }
];

const fallbackDirectory = {
  members: legacyMembers.map((member) => member.url),
  businesses: []
};

// Estadísticas de la Generación 1 (enviadas por Kat). Cada etiqueta tiene su clave de traducción.
const applicantProfile = [
  {
    titleKey: "chart.education",
    title: "Nivel educativo",
    items: [
      ["chart.bachelor", "Licenciatura", 53.8],
      ["chart.highschool", "Bachillerato", 18.4],
      ["chart.master", "Maestría", 16],
      ["chart.technical", "Técnico y otros", 11.8]
    ]
  },
  {
    titleKey: "chart.english",
    title: "Nivel de inglés",
    items: [
      ["chart.basic", "Básico", 44.8],
      ["chart.intermediate", "Intermedio", 29.2],
      ["chart.advanced", "Avanzado", 25.9]
    ]
  },
  {
    titleKey: "chart.years",
    title: "Años emprendiendo",
    items: [
      ["chart.lt1", "Menos de 1 año", 22.2],
      ["chart.1to2", "1–2 años", 27.4],
      ["chart.3to5", "3–5 años", 25.5],
      ["chart.gt5", "Más de 5 años", 25]
    ]
  },
  {
    titleKey: "chart.priorSI",
    title: "Conocimiento previo de SI",
    items: [
      ["chart.intermediate", "Intermedio", 53.8],
      ["chart.basic", "Básico", 32.1],
      ["chart.advanced", "Avanzado", 9.9],
      ["chart.noneExpert", "Nulo y experto", 4.2]
    ]
  }
];

const selectedBySector = [
  ["chart.food", "Alimentos", 13],
  ["chart.services", "Servicios", 9],
  ["chart.retail", "Comercio", 7],
  ["chart.tourism", "Turismo", 4],
  ["chart.crafts", "Artesanías", 3],
  ["chart.jewelry", "Joyería", 2],
  ["chart.construction", "Construcción", 1],
  ["chart.other", "Otro", 1]
];

const t = (key, spanish) => (window.i18n ? window.i18n.t(key, spanish) : spanish);

const chatMessages = document.querySelector("#chatMessages");
const chatForm = document.querySelector("#chatForm");
const chatInput = document.querySelector("#chatInput");
const suggestedQuestions = document.querySelector("#suggestedQuestions");
const chatPanel = document.querySelector("#chatPanel");
const chatToggle = document.querySelector("#chatToggle");
const closeChat = document.querySelector("#closeChat");
const membersGrid = document.querySelector("#membersGrid");
const businessesGrid = document.querySelector("#businessesGrid");
const memberCount = document.querySelector("#memberCount");
const businessCount = document.querySelector("#businessCount");
const generationFilter = document.querySelector("#generationFilter");
const categoryFilter = document.querySelector("#categoryFilter");
const generationFilterMenu = document.querySelector("#generationFilterMenu");
const categoryFilterMenu = document.querySelector("#categoryFilterMenu");
const heroVideo = document.querySelector("#heroVideo");
const openVideo = document.querySelector("#openVideo");
const videoDialog = document.querySelector("#videoDialog");
const videoPlayer = document.querySelector("#videoPlayer");
const closeVideo = document.querySelector("#closeVideo");
const moduleCards = document.querySelectorAll(".module-card");
const benefitsMore = document.querySelector("#benefitsMore");
const statsTabs = document.querySelectorAll(".stats-tab");
const profileCharts = document.querySelector("#profileCharts");
const sectorChart = document.querySelector("#sectorChart");
const eligibilityCheck = document.querySelector("#eligibilityCheck");
const eligibilityMeter = document.querySelector("#eligibilityMeter");
const eligibilityStatus = document.querySelector("#eligibilityStatus");
const applyButton = document.querySelector("#applyButton");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const businessRibbonTrack = document.querySelector("#businessRibbonTrack");
const directoryScrollContainers = document.querySelectorAll(".directory-scroll");
const postulationLinks = document.querySelectorAll("[data-postulation-link]");
let allBusinesses = [];
const ribbonImageCache = new Map();

[generationFilterMenu, categoryFilterMenu].forEach((menu) => {
  if (menu) {
    document.body.appendChild(menu);
  }
});

function parseFaqMarkdown(markdown) {
  const sections = markdown.split(/^##\s+(.+)$/m).slice(1);
  const items = [];

  for (let index = 0; index < sections.length; index += 2) {
    const question = sections[index].trim();
    const content = sections[index + 1].trim();
    const keywordLine = content.match(/^(?:Palabras clave|Keywords):\s*(.+)$/m);
    const answer = content
      .replace(/^(?:Palabras clave|Keywords):\s*.+$/m, "")
      .trim()
      .replace(/\n+/g, " ");

    if (!question || !answer) {
      continue;
    }

    items.push({
      question,
      answer,
      keywords: keywordLine
        ? keywordLine[1].split(",").map((keyword) => keyword.trim()).filter(Boolean)
        : []
    });
  }

  return items;
}

function configurePostulationLinks() {
  const targetUrl = linkpostulacion.trim();

  postulationLinks.forEach((link) => {
    if (!targetUrl) {
      return;
    }

    link.href = targetUrl;
    link.target = "_blank";
    link.rel = "noopener";
  });
}

async function loadFaqItems() {
  const file = window.i18n?.lang === "en" ? "faq.en.md" : "faq.md";

  try {
    const response = await fetch(file);

    if (!response.ok) {
      throw new Error(`No se pudo cargar ${file}`);
    }

    faqItems = parseFaqMarkdown(await response.text());
  } catch (error) {
    console.error(error);
    faqItems = [];
  }

  renderQuestionBank(chatInput?.value || "");
}

async function loadDirectoryManifest() {
  try {
    const response = await fetch(directoryManifestUrl);

    if (!response.ok) {
      throw new Error("No se pudo cargar pages/directory.json");
    }

    return response.json();
  } catch (error) {
    console.error(error);
    return fallbackDirectory;
  }
}

async function loadProfileCard(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`No se pudo cargar ${url}`);
  }

  const html = await response.text();
  const page = new DOMParser().parseFromString(html, "text/html");
  const name = page.querySelector(".profile-copy h1")?.textContent.trim();
  const summary = page.querySelector(".profile-copy h1 + p")?.textContent.trim() || "";
  const initials = page.querySelector(".profile-photo")?.textContent.trim() || getInitials(name || "");
  const generation = page.querySelector("meta[name='p2p-generation']")?.content.trim() || "Sin generación";
  const category = page.querySelector("meta[name='p2p-category']")?.content.trim();
  const [role, ...descriptionParts] = summary.split(". ");

  return {
    name: name || url.split("/").pop().replace(".html", "").replace(/-/g, " "),
    role: role || "Perfil",
    description: descriptionParts.join(". ") || summary || "Perfil disponible en la comunidad.",
    initials,
    url,
    generation,
    category: category || role || "Sin categoría"
  };
}

async function loadDirectoryItems(urls) {
  const items = await Promise.allSettled(urls.map(loadProfileCard));

  items
    .filter((item) => item.status === "rejected")
    .forEach((item) => console.error(item.reason));

  return items
    .filter((item) => item.status === "fulfilled")
    .map((item) => item.value);
}

async function renderDirectory() {
  if (!membersGrid && !businessesGrid) {
    return;
  }

  const manifest = await loadDirectoryManifest();
  const [members, businesses, ribbonFiles] = await Promise.all([
    loadDirectoryItems(manifest.members || []),
    loadDirectoryItems(manifest.businesses || []),
    loadBusinessRibbonAssets()
  ]);

  allBusinesses = businesses.map((business) => ({
    ...business,
    logo: findBusinessLogo(business, ribbonFiles)
  }));
  renderCards(members, membersGrid);
  renderBusinessFilters(businesses);
  renderFilteredBusinesses();
  if (memberCount) {
    memberCount.textContent = members.length;
  }
}

function uniqueValues(items, key) {
  return [...new Set(items.map((item) => item[key]).filter(Boolean))]
    .sort((first, second) => first.localeCompare(second, "es", { sensitivity: "base" }));
}

function getFilterValue(trigger) {
  return trigger.dataset.value || "";
}

function setFilterValue(trigger, value, label) {
  trigger.dataset.value = value;
  trigger.textContent = label;
}

function getFilterMenu(trigger) {
  return document.querySelector(`#${trigger.id}Menu`);
}

function positionFilterMenu(trigger) {
  const menu = getFilterMenu(trigger);
  const rect = trigger.getBoundingClientRect();

  menu.style.left = `${rect.left}px`;
  menu.style.top = `${rect.bottom + 8}px`;
  menu.style.width = `${rect.width}px`;
}

function openFilterMenu(trigger) {
  const control = trigger.closest(".filter-control");
  const menu = getFilterMenu(trigger);

  positionFilterMenu(trigger);
  control.classList.add("is-open");
  menu.classList.add("is-open");
  trigger.setAttribute("aria-expanded", "true");
}

function closeFilterMenus() {
  document.querySelectorAll(".filter-control.is-open").forEach((control) => {
    control.classList.remove("is-open");
    control.querySelector(".filter-trigger")?.setAttribute("aria-expanded", "false");
  });

  document.querySelectorAll(".filter-menu.is-open").forEach((menu) => {
    menu.classList.remove("is-open");
  });
}

function renderFilterOptions(trigger, menu, values, selectedValue) {
  if (!trigger || !menu) {
    return;
  }

  menu.innerHTML = "";
  const options = [{ value: "", label: t("community.all", "Todas") }, ...values.map((value) => ({ value, label: value }))];

  options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "filter-option";
    button.type = "button";
    button.textContent = option.label;
    button.dataset.value = option.value;
    button.setAttribute("role", "option");
    button.setAttribute("aria-selected", String(option.value === selectedValue));

    if (option.value === selectedValue) {
      button.classList.add("is-selected");
      setFilterValue(trigger, option.value, option.label);
    }

    button.addEventListener("click", () => {
      setFilterValue(trigger, option.value, option.label);
      closeFilterMenus();
      renderFilteredBusinesses();
    });

    menu.appendChild(button);
  });
}

function renderBusinessFilters(businesses) {
  if (!generationFilter || !categoryFilter) {
    return;
  }

  renderFilterOptions(generationFilter, generationFilterMenu, uniqueValues(businesses, "generation"), getFilterValue(generationFilter));
  renderFilterOptions(categoryFilter, categoryFilterMenu, uniqueValues(businesses, "category"), getFilterValue(categoryFilter));
}

function renderFilteredBusinesses() {
  if (!businessesGrid || !businessCount) {
    return;
  }

  const generation = getFilterValue(generationFilter);
  const category = getFilterValue(categoryFilter);
  const filteredBusinesses = allBusinesses.filter((business) => {
    const matchesGeneration = !generation || business.generation === generation;
    const matchesCategory = !category || business.category === category;
    return matchesGeneration && matchesCategory;
  });

  renderCards(filteredBusinesses, businessesGrid);
  businessCount.textContent = filteredBusinesses.length;
  updateDirectoryScrollStates();
}

function updateDirectoryScrollStates() {
  directoryScrollContainers.forEach((container) => {
    container.classList.toggle("is-scrolled", container.scrollTop > 4);
  });
}

// --- Video del inicio ---

let heroOnscreen = true;

function playHeroVideo() {
  if (!heroVideo?.src || prefersReducedMotion || !heroOnscreen || videoDialog?.open) {
    return;
  }

  // Si el navegador bloquea la reproducción automática, queda visible el póster.
  heroVideo.play().catch(() => {});
}

function setupHeroVideo() {
  if (heroVideo && videos.fondo) {
    heroVideo.preload = prefersReducedMotion ? "none" : "auto";
    heroVideo.src = videoUrl(videos.fondo);
    playHeroVideo();
  }

  if (openVideo) {
    openVideo.hidden = !videos.informativo;
  }
}

function openVideoDialog() {
  if (!videoDialog || !videoPlayer || !videos.informativo) {
    return;
  }

  videoPlayer.src = videoUrl(videos.informativo);
  videoDialog.showModal();
  heroVideo?.pause();
  videoPlayer.play().catch(() => {});
}

// Pausa el video de fondo y las animaciones continuas (engranajes, barra de cifras,
// cinta de negocios) cuando su sección no está en pantalla, para que el scroll vaya fluido.
function setupOffscreenPause() {
  const zones = [...document.querySelectorAll(".hero, .stats-ticker, .business-ribbon")];
  document.querySelectorAll(".gear").forEach((gear) => {
    if (!zones.includes(gear.parentElement)) {
      zones.push(gear.parentElement);
    }
  });

  if (!("IntersectionObserver" in window)) {
    zones.forEach((zone) => zone.classList.add("is-onscreen"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-onscreen", entry.isIntersecting);

      if (entry.target.classList.contains("hero")) {
        heroOnscreen = entry.isIntersecting;

        if (heroOnscreen) {
          playHeroVideo();
        } else {
          heroVideo?.pause();
        }
      }
    });
  }, { rootMargin: "100px 0px" });

  zones.forEach((zone) => observer.observe(zone));
}

function closeVideoDialog() {
  videoDialog.close();
}

// --- Currículum: tarjetas de doble cara ---

function toggleModuleCard(card) {
  const flipped = !card.classList.contains("is-flipped");
  card.classList.toggle("is-flipped", flipped);
  card.setAttribute("aria-pressed", String(flipped));
}

// --- Beneficios: "y mucho más" ---

function toggleBenefits() {
  const expanded = benefitsMore.getAttribute("aria-expanded") !== "true";

  document.querySelectorAll(".benefit-extra").forEach((item) => {
    item.hidden = !expanded;
  });

  benefitsMore.setAttribute("aria-expanded", String(expanded));
  updateBenefitsLabel();
}

function updateBenefitsLabel() {
  if (!benefitsMore) {
    return;
  }

  const expanded = benefitsMore.getAttribute("aria-expanded") === "true";
  const label = benefitsMore.querySelector("[data-i18n]");

  label.textContent = expanded ? t("benefits.less", "ver menos") : t("benefits.more", "y mucho más");
  benefitsMore.querySelector(".benefits-more-icon").textContent = expanded ? "−" : "+";
}

// --- Cifras: gráficos de barras ---

function formatPercent(value) {
  return window.i18n?.lang === "en" ? `${value}%` : `${value} %`;
}

function buildBarChart(title, subtitle, items, { max = 100, isCount = false } = {}) {
  const card = document.createElement("div");
  card.className = "chart-card";
  card.innerHTML = `
    <p class="chart-title">${title}</p>
    <p class="chart-sub">${subtitle}</p>
    <ul class="bar-list"></ul>
  `;

  const list = card.querySelector(".bar-list");

  items.forEach(([key, label, value], index) => {
    const row = document.createElement("li");
    row.className = `bar-row tone-${index % 4}`;
    row.innerHTML = `
      <span class="bar-label">${t(key, label)}</span>
      <span class="bar-track"><span class="bar-fill" style="--value: ${(value / max) * 100}"></span></span>
      <span class="bar-value">${isCount ? value : formatPercent(value)}</span>
    `;
    list.appendChild(row);
  });

  return card;
}

function renderCharts() {
  if (profileCharts) {
    profileCharts.replaceChildren(
      ...applicantProfile.map((group) =>
        buildBarChart(t(group.titleKey, group.title), t("chart.responses", "212 respuestas"), group.items)
      )
    );
  }

  if (sectorChart) {
    const chart = buildBarChart(t("chart.sector", "Por rubro"), t("chart.selectedSub", "40 participantes seleccionados"), selectedBySector, {
      max: 13,
      isCount: true
    });
    sectorChart.replaceChildren(...chart.childNodes);
  }
}

function selectStatsTab(selectedTab) {
  statsTabs.forEach((tab) => {
    const isSelected = tab === selectedTab;
    const panel = document.querySelector(`#${tab.getAttribute("aria-controls")}`);

    tab.classList.toggle("is-active", isSelected);
    tab.setAttribute("aria-selected", String(isSelected));
    tab.tabIndex = isSelected ? 0 : -1;
    panel.hidden = !isSelected;
    panel.classList.toggle("is-active", isSelected);
  });
}

// --- Postulación ---

function updateEligibility() {
  if (!eligibilityCheck) {
    return;
  }

  const checks = [...eligibilityCheck.querySelectorAll("input")];
  const checked = checks.filter((input) => input.checked).length;
  const isReady = checked === checks.length;

  eligibilityMeter.style.width = `${(checked / checks.length) * 100}%`;
  eligibilityStatus.textContent = isReady
    ? t("apply.ready", "¡Cumples los requisitos! Ya puedes postularte.")
    : t("apply.status", "{checked} de {total} requisitos")
      .replace("{checked}", checked)
      .replace("{total}", checks.length);
  applyButton?.classList.toggle("is-ready", isReady);
}

// --- Animaciones de entrada ---

function countSuffix(element) {
  return element.dataset.suffixKey ? t(element.dataset.suffixKey, element.dataset.suffix || "") : element.dataset.suffix || "";
}

function animateCount(element) {
  const target = Number(element.dataset.count);
  const duration = 900;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    element.textContent = `${Math.round(target * progress)}${countSuffix(element)}`;

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  }

  window.requestAnimationFrame(step);
}

function refreshCountLabels() {
  document.querySelectorAll("[data-count][data-suffix-key]").forEach((element) => {
    element.textContent = `${element.dataset.count}${countSuffix(element)}`;
  });
}

function setupReveal() {
  const blocks = document.querySelectorAll("[data-reveal]");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    blocks.forEach((block) => block.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.filter((entry) => entry.isIntersecting).forEach((entry) => {
      entry.target.classList.add("is-visible");
      entry.target.querySelectorAll("[data-count]").forEach(animateCount);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  blocks.forEach((block) => {
    block.classList.add("reveal");
    observer.observe(block);
  });
}

// --- Logos de aliados: si falta el archivo, se muestra el nombre ---

function setupPartnerLogos() {
  document.querySelectorAll("img[data-fallback-text]").forEach((image) => {
    const showFallback = () => {
      const label = document.createElement("span");
      label.className = "partner-fallback";
      label.textContent = image.dataset.fallbackText;
      label.title = image.alt;
      image.replaceWith(label);
    };

    if (image.complete && image.naturalWidth === 0) {
      showFallback();
      return;
    }

    image.addEventListener("error", showFallback, { once: true });
  });
}

// --- Cinta de negocios ---

async function loadBusinessRibbonAssets() {
  try {
    const response = await fetch(businessRibbonManifestUrl);

    if (!response.ok) {
      throw new Error("No se pudo cargar assets/Negocios Cinta/manifest.json");
    }

    const files = await response.json();
    return Array.isArray(files) ? files : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

function normalizeRibbonPath(file) {
  if (/^https?:\/\//i.test(file) || file.startsWith("assets/")) {
    return file;
  }

  return `assets/Negocios%20Cinta/${encodeURIComponent(file)}`;
}

// El logo de un negocio es la imagen de la cinta con el mismo nombre que su página.
function findBusinessLogo(business, ribbonFiles) {
  const slug = business.url.split("/").pop().replace(".html", "");
  const file = ribbonFiles.find((ribbonFile) => ribbonFile.replace(/\.[^.]+$/, "") === slug);

  return file ? normalizeRibbonPath(file) : "";
}

function findImageBounds(image) {
  const maxSampleSize = 768;
  const scale = Math.min(1, maxSampleSize / Math.max(image.naturalWidth, image.naturalHeight));
  const sampleWidth = Math.max(1, Math.round(image.naturalWidth * scale));
  const sampleHeight = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });

  canvas.width = sampleWidth;
  canvas.height = sampleHeight;
  context.drawImage(image, 0, 0, sampleWidth, sampleHeight);

  const pixels = context.getImageData(0, 0, sampleWidth, sampleHeight).data;
  let minX = sampleWidth;
  let minY = sampleHeight;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < sampleHeight; y += 1) {
    for (let x = 0; x < sampleWidth; x += 1) {
      const alpha = pixels[((y * sampleWidth + x) * 4) + 3];

      if (alpha <= 10) {
        continue;
      }

      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  if (maxX < 0 || maxY < 0) {
    return {
      x: 0,
      y: 0,
      width: image.naturalWidth,
      height: image.naturalHeight
    };
  }

  return {
    x: Math.max(0, Math.floor(minX / scale)),
    y: Math.max(0, Math.floor(minY / scale)),
    width: Math.min(image.naturalWidth, Math.ceil((maxX - minX + 1) / scale)),
    height: Math.min(image.naturalHeight, Math.ceil((maxY - minY + 1) / scale))
  };
}

function normalizeRibbonImage(image) {
  const cachedSource = ribbonImageCache.get(image.currentSrc || image.src);

  if (cachedSource) {
    image.src = cachedSource;
    image.classList.add("is-normalized");
    return;
  }

  try {
    const bounds = findImageBounds(image);
    const outputSize = 320;
    const contentSize = 284;
    const scale = Math.min(contentSize / bounds.width, contentSize / bounds.height);
    const drawWidth = Math.max(1, Math.round(bounds.width * scale));
    const drawHeight = Math.max(1, Math.round(bounds.height * scale));
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = outputSize;
    canvas.height = outputSize;
    context.clearRect(0, 0, outputSize, outputSize);
    context.drawImage(
      image,
      bounds.x,
      bounds.y,
      bounds.width,
      bounds.height,
      Math.round((outputSize - drawWidth) / 2),
      Math.round((outputSize - drawHeight) / 2),
      drawWidth,
      drawHeight
    );

    const normalizedSource = canvas.toDataURL("image/png");
    ribbonImageCache.set(image.currentSrc || image.src, normalizedSource);
    image.src = normalizedSource;
    image.classList.add("is-normalized");
  } catch (error) {
    console.error(error);
    image.classList.add("is-normalized");
  }
}

async function renderBusinessRibbon() {
  if (!businessRibbonTrack) {
    return;
  }

  const files = await loadBusinessRibbonAssets();
  businessRibbonTrack.innerHTML = "";
  businessRibbonTrack.classList.toggle("is-empty", files.length === 0);

  if (files.length === 0) {
    return;
  }

  [...files, ...files].forEach((file) => {
    const item = document.createElement("div");
    item.className = "business-ribbon-item";

    const image = document.createElement("img");
    image.src = normalizeRibbonPath(file);
    image.alt = "";
    image.loading = "lazy";
    image.addEventListener("load", () => normalizeRibbonImage(image), { once: true });

    item.appendChild(image);
    businessRibbonTrack.appendChild(item);
  });
}

// --- Prompty: respuestas automáticas desde faq.md / faq.en.md ---

function normalizeText(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[¿?¡!.,;:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function addMessage(text, sender = "bot") {
  if (!chatMessages) {
    return;
  }

  const message = document.createElement("div");
  message.className = `message ${sender}`;
  message.textContent = text;
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function scoreQuestion(item, query) {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) {
    return 0;
  }

  const question = normalizeText(item.question);
  const keywords = item.keywords.map(normalizeText);
  let score = 0;

  if (question === normalizedQuery) {
    score += 20;
  } else if (question.includes(normalizedQuery)) {
    score += 6;
  }

  // Las palabras clave cuentan como palabra completa para evitar coincidencias sueltas ("hora" en "ahora").
  const paddedQuery = ` ${normalizedQuery} `;

  keywords.forEach((keyword) => {
    if (keyword && paddedQuery.includes(` ${keyword} `)) {
      score += keyword.includes(" ") ? 5 : 3;
    }
  });

  normalizedQuery.split(" ").forEach((word) => {
    if (word.length < 4) {
      return;
    }

    if (question.includes(word)) {
      score += 2;
    }

    if (keywords.some((keyword) => keyword.includes(word))) {
      score += 2;
    }
  });

  return score;
}

function rankQuestions(query) {
  return faqItems
    .map((item) => ({ ...item, score: scoreQuestion(item, query) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
}

function findAnswer(userQuestion) {
  const [best] = rankQuestions(userQuestion);
  return best && best.score >= 3 ? best.answer : "";
}

function askQuestion(question) {
  const text = question.trim();

  if (!text) {
    return;
  }

  openChat();
  addMessage(text, "user");

  window.setTimeout(() => {
    const answer = findAnswer(text);
    addMessage(answer || t("bot.fallback", "Todavía no tengo esa respuesta. Prueba con una de las preguntas sugeridas o escríbenos a prompttoprosperity@gmail.com."), "bot");
    renderQuestionBank(answer ? "" : text);
  }, 260);
}

function openChat() {
  if (!chatPanel || !chatToggle) {
    return;
  }

  chatPanel.classList.add("is-open");
  chatPanel.setAttribute("aria-hidden", "false");
  chatToggle.setAttribute("aria-expanded", "true");
}

function closeChatPanel() {
  if (!chatPanel || !chatToggle) {
    return;
  }

  chatPanel.classList.remove("is-open");
  chatPanel.setAttribute("aria-hidden", "true");
  chatToggle.setAttribute("aria-expanded", "false");
}

// Sin texto muestra las primeras preguntas; con texto, las más parecidas.
function renderQuestionBank(query = "") {
  if (!suggestedQuestions) {
    return;
  }

  suggestedQuestions.innerHTML = "";

  const ranked = query.trim() ? rankQuestions(query) : [];
  // Mantiene una sola sugerencia para que el historial conserve el espacio
  // suficiente para leer respuestas largas.
  const items = (ranked.length ? ranked : faqItems).slice(0, 1);

  items.forEach((item) => {
    const button = document.createElement("button");
    button.className = "question-option";
    button.type = "button";
    button.textContent = item.question;
    button.addEventListener("click", () => {
      chatInput.value = "";
      askQuestion(item.question);
    });
    suggestedQuestions.appendChild(button);
  });
}

function greet() {
  if (!chatMessages) {
    return;
  }

  chatMessages.innerHTML = "";
  addMessage(t("bot.greeting", "Hola, soy Prompty, el asistente de Prompt to Prosperity. Elige una pregunta frecuente o escribe la tuya."));
}

// --- Tarjetas de la comunidad ---

function renderCards(items, container) {
  if (!container) {
    return;
  }

  container.innerHTML = "";
  const cardsAreLinks = container.dataset.cardLinks !== "false";

  items.forEach((item) => {
    const card = document.createElement(cardsAreLinks ? "a" : "article");
    card.className = "directory-card";

    if (cardsAreLinks) {
      card.href = item.url;
      card.setAttribute("aria-label", `Ver perfil de ${item.name}`);
    }

    const preview = item.logo
      ? `<div class="photo-preview has-logo"><img src="${item.logo}" alt="Logo de ${item.name}" loading="lazy"></div>`
      : `<div class="photo-preview" aria-label="Vista previa de foto de ${item.name}">${item.initials}</div>`;

    card.innerHTML = `
      ${preview}
      <div class="card-body">
        <span class="card-meta">${item.role}</span>
        <h4>${item.name}</h4>
        <p>${item.description}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

function getInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

// --- Eventos ---

if (chatToggle && chatPanel && chatInput) {
  chatToggle.addEventListener("click", () => {
    if (chatPanel.classList.contains("is-open")) {
      closeChatPanel();
      return;
    }

    openChat();
    chatInput.focus();
  });
}

closeChat?.addEventListener("click", closeChatPanel);

chatForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const question = chatInput.value;
  chatInput.value = "";
  askQuestion(question);
});

chatInput?.addEventListener("input", () => {
  renderQuestionBank(chatInput.value);
});

openVideo?.addEventListener("click", openVideoDialog);
closeVideo?.addEventListener("click", closeVideoDialog);

videoDialog?.addEventListener("click", (event) => {
  if (event.target === videoDialog) {
    closeVideoDialog();
  }
});

videoDialog?.addEventListener("close", () => {
  videoPlayer.pause();
  playHeroVideo();
});

moduleCards.forEach((card) => {
  card.addEventListener("click", () => toggleModuleCard(card));
});

benefitsMore?.addEventListener("click", toggleBenefits);

statsTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectStatsTab(tab));
  tab.addEventListener("keydown", (event) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];

    if (!step) {
      return;
    }

    const next = statsTabs[(index + step + statsTabs.length) % statsTabs.length];
    selectStatsTab(next);
    next.focus();
  });
});

eligibilityCheck?.addEventListener("change", updateEligibility);

directoryScrollContainers.forEach((container) => {
  container.addEventListener("scroll", () => updateDirectoryScrollStates(), { passive: true });
});

[generationFilter, categoryFilter].filter(Boolean).forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const control = trigger.closest(".filter-control");
    const isOpen = control.classList.contains("is-open");

    closeFilterMenus();

    if (!isOpen) {
      openFilterMenu(trigger);
    }
  });

  trigger.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeFilterMenus();
      trigger.focus();
    }
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".filter-control") && !event.target.closest(".filter-menu")) {
    closeFilterMenus();
  }
});

// Los menús de filtro solo existen en Comunidad; en el inicio no se escucha el scroll.
if (generationFilter || categoryFilter) {
  window.addEventListener("resize", closeFilterMenus);
  window.addEventListener("scroll", closeFilterMenus, { capture: true, passive: true });
}

window.i18n?.onChange(() => {
  renderCharts();
  updateBenefitsLabel();
  updateEligibility();
  refreshCountLabels();
  renderBusinessFilters(allBusinesses);
  greet();
  loadFaqItems();
});

configurePostulationLinks();
setupHeroVideo();
setupOffscreenPause();
setupPartnerLogos();
renderCharts();
updateBenefitsLabel();
updateEligibility();
refreshCountLabels();
renderDirectory();
renderBusinessRibbon();
updateDirectoryScrollStates();
setupReveal();
greet();
loadFaqItems();
