let faqItems = [];

// Escribe aquí el nombre de un archivo ubicado en assets/videos/ para mostrarlo.
const featuredVideo = {
  filename: "",
  title: "Video de Prompt to Prosperity"
};

const directoryManifestUrl = "pages/directory.json";

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
    name: "Banco Atlantida",
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
const featuredVideoContainer = document.querySelector("#featuredVideo");

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
  const [role, ...descriptionParts] = summary.split(". ");

  return {
    name: name || url.split("/").pop().replace(".html", "").replace(/-/g, " "),
    role: role || "Perfil",
    description: descriptionParts.join(". ") || summary || "Perfil disponible en la comunidad.",
    initials,
    url
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
  const manifest = await loadDirectoryManifest();
  const [members, businesses] = await Promise.all([
    loadDirectoryItems(manifest.members || []),
    loadDirectoryItems(manifest.businesses || [])
  ]);

  renderCards(members, membersGrid);
  renderCards(businesses, businessesGrid);
  memberCount.textContent = members.length;
  businessCount.textContent = businesses.length;
}

function renderFeaturedVideo() {
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

function normalizeText(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function addMessage(text, sender = "bot") {
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
  chatPanel.classList.add("is-open");
  chatPanel.setAttribute("aria-hidden", "false");
  chatToggle.setAttribute("aria-expanded", "true");
}

function closeChatPanel() {
  chatPanel.classList.remove("is-open");
  chatPanel.setAttribute("aria-hidden", "true");
  chatToggle.setAttribute("aria-expanded", "false");
}

function renderQuestionBank(query = "") {
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
  container.innerHTML = "";

  items.forEach((item) => {
    const card = document.createElement("a");
    card.className = "directory-card";
    card.href = item.url;
    card.setAttribute("aria-label", `Ver perfil de ${item.name}`);
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

chatToggle.addEventListener("click", () => {
  if (chatPanel.classList.contains("is-open")) {
    closeChatPanel();
    return;
  }

  openChat();
  chatInput.focus();
});

closeChat.addEventListener("click", closeChatPanel);

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const firstQuestion = suggestedQuestions.querySelector(".question-option");

  if (firstQuestion) {
    askQuestion(firstQuestion.textContent);
  }

  chatInput.value = "";
  renderQuestionBank("");
});

chatInput.addEventListener("input", () => {
  renderQuestionBank(chatInput.value);
});

renderSponsors();
renderFeaturedVideo();
renderDirectory();

addMessage("Hola. Soy el asistente de Prompt to Prosperity. Elige una pregunta frecuente o escribe tu duda.");
loadFaqItems();
