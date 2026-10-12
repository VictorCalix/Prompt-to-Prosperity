const linkpostulacion = "";
let faqItems = [];

// Escribe aquí el nombre de un archivo ubicado en assets/videos/ para mostrarlo.
const featuredVideo = {
  filename: "",
  title: "Video de Prompt to Prosperity"
};

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
    description: "Apoya en herramientas de IA, productividad y presencia digital.",
    initials: "VC",
    url: "pages/miembros/Victor-Calix.html"
  }
];

const legacyBusinesses = [
  {
    name: "Café Aurora",
    role: "Alimentos y bebidas",
    description: "Negocio local en proceso de mejorar pedidos, contenido y atención digital.",
    initials: "CA",
    url: "pages/negocios/cafe-aurora.html"
  },
  {
    name: "Studio Verde",
    role: "Servicios creativos",
    description: "Emprendimiento que busca ordenar procesos y captar clientes en línea.",
    initials: "SV",
    url: "pages/negocios/studio-verde.html"
  }
];

const fallbackDirectory = {
  members: legacyMembers.map((member) => member.url),
  businesses: legacyBusinesses.map((business) => business.url)
};

// Agrega aliados estratégicos con { name, logo, url }. Ejemplo de logo: "assets/aliados/marca.png".
const sponsors = [
  {
    name: "Banco Atlántida",
    logo: "",
    url: "https://bancatlan.hn/"
  }
];

const chatMessages = document.querySelector("#chatMessages");
const chatForm = document.querySelector("#chatForm");
const chatInput = document.querySelector("#chatInput");
const suggestedQuestions = document.querySelector("#suggestedQuestions");
const chatPanel = document.querySelector("#chatPanel");
const chatToggle = document.querySelector("#chatToggle");
const closeChat = document.querySelector("#closeChat");
const membersGrid = document.querySelector("#membersGrid");
const businessesGrid = document.querySelector("#businessesGrid");
const sponsorsGrid = document.querySelector("#sponsorsGrid");
const memberCount = document.querySelector("#memberCount");
const businessCount = document.querySelector("#businessCount");
const generationFilter = document.querySelector("#generationFilter");
const categoryFilter = document.querySelector("#categoryFilter");
const generationFilterMenu = document.querySelector("#generationFilterMenu");
const categoryFilterMenu = document.querySelector("#categoryFilterMenu");
const featuredVideoContainer = document.querySelector("#featuredVideo");
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
    const keywordLine = content.match(/^Palabras clave:\s*(.+)$/m);
    const answer = content
      .replace(/^Palabras clave:\s*.+$/m, "")
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
  try {
    const response = await fetch("faq.md");

    if (!response.ok) {
      throw new Error("No se pudo cargar faq.md");
    }

    faqItems = parseFaqMarkdown(await response.text());
  } catch (error) {
    console.error(error);
  }
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
  const [members, businesses] = await Promise.all([
    loadDirectoryItems(manifest.members || []),
    loadDirectoryItems(manifest.businesses || [])
  ]);

  allBusinesses = businesses;
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
  const options = [{ value: "", label: "Todas" }, ...values.map((value) => ({ value, label: value }))];

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

function renderFeaturedVideo() {
  if (!featuredVideoContainer) {
    return;
  }

  if (!featuredVideo.filename) {
    featuredVideoContainer.hidden = true;
    return;
  }

  const video = document.createElement("video");
  video.controls = true;
  video.preload = "metadata";
  video.playsInline = true;
  video.setAttribute("aria-label", featuredVideo.title);
  video.src = `assets/videos/${encodeURIComponent(featuredVideo.filename)}`;
  featuredVideoContainer.replaceChildren(video);
  featuredVideoContainer.hidden = false;
}

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

function normalizeText(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
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

function findAnswer(userQuestion) {
  const normalizedQuestion = normalizeText(userQuestion);

  const directMatch = faqItems.find((item) =>
    normalizeText(item.question).includes(normalizedQuestion)
  );

  if (directMatch) {
    return directMatch.answer;
  }

  const keywordMatch = faqItems.find((item) =>
    item.keywords.some((keyword) => normalizedQuestion.includes(normalizeText(keyword)))
  );

  if (keywordMatch) {
    return keywordMatch.answer;
  }

  return "Todavía no tengo esa respuesta en el banco de preguntas. Puedes intentar con una pregunta sugerida o escribirnos para agregarla al FAQ.";
}

function scoreQuestion(item, query) {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) {
    return 1;
  }

  const question = normalizeText(item.question);
  const keywords = item.keywords.map(normalizeText);
  let score = 0;

  if (question.includes(normalizedQuery)) {
    score += 6;
  }

  normalizedQuery.split(/\s+/).forEach((word) => {
    if (word.length < 3) {
      return;
    }

    if (question.includes(word)) {
      score += 2;
    }

    if (keywords.some((keyword) => keyword.includes(word))) {
      score += 3;
    }
  });

  return score;
}

function askQuestion(question) {
  if (!question) {
    return;
  }

  openChat();
  addMessage(question, "user");
  window.setTimeout(() => {
    addMessage(findAnswer(question), "bot");
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

function renderQuestionBank(query = "") {
  if (!suggestedQuestions) {
    return;
  }

  suggestedQuestions.innerHTML = "";

  if (!query.trim()) {
    return;
  }

  const rankedQuestions = faqItems
    .map((item) => ({ ...item, score: scoreQuestion(item, query) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  rankedQuestions.forEach((item) => {
    const button = document.createElement("button");
    button.className = "question-option";
    button.type = "button";
    button.textContent = item.question;
    button.addEventListener("click", () => askQuestion(item.question));
    suggestedQuestions.appendChild(button);
  });
}

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

    card.innerHTML = `
      <div class="photo-preview" aria-label="Vista previa de foto de ${item.name}">${item.initials}</div>
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

function renderSponsors() {
  if (!sponsorsGrid) {
    return;
  }

  sponsorsGrid.innerHTML = "";

  sponsors.forEach((sponsor) => {
    const card = document.createElement(sponsor.url ? "a" : "article");
    card.className = "sponsor-card";

    if (sponsor.url) {
      card.href = sponsor.url;
      card.target = "_blank";
      card.rel = "noopener";
    }

    const logo = document.createElement("div");
    logo.className = "sponsor-logo";

    if (sponsor.logo) {
      const image = document.createElement("img");
      image.src = sponsor.logo;
      image.alt = `Logo de ${sponsor.name}`;
      logo.appendChild(image);
    } else {
      logo.textContent = getInitials(sponsor.name);
      logo.setAttribute("aria-label", `Logo pendiente de ${sponsor.name}`);
    }

    const name = document.createElement("h3");
    name.textContent = sponsor.name;

    card.append(logo, name);
    sponsorsGrid.appendChild(card);
  });
}

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
  const firstQuestion = suggestedQuestions?.querySelector(".question-option");

  if (firstQuestion) {
    askQuestion(firstQuestion.textContent);
  }

  chatInput.value = "";
  renderQuestionBank("");
});

chatInput?.addEventListener("input", () => {
  renderQuestionBank(chatInput.value);
});

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

window.addEventListener("resize", closeFilterMenus);
window.addEventListener("scroll", closeFilterMenus, true);

configurePostulationLinks();
renderSponsors();
renderFeaturedVideo();
renderDirectory();
renderBusinessRibbon();
updateDirectoryScrollStates();

addMessage("Hola. Soy el asistente de Prompt to Prosperity. Elige una pregunta frecuente o escribe tu duda.");
loadFaqItems();
