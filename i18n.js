// Cambio de idioma ES / EN.
// El español vive en el HTML. Aquí solo va el inglés, por clave:
// - data-i18n="clave" reemplaza el contenido del elemento.
// - data-i18n-attr="atributo:clave;otro:clave" reemplaza atributos (alt, aria-label, placeholder...).
// El idioma elegido se recuerda en el navegador y también se puede forzar con ?lang=en en la URL.
(function () {
  const STORAGE_KEY = "p2p-lang";

  const en = {
    "meta.title": "Prompt to Prosperity | Superintelligence program for entrepreneurs",
    "meta.description": "Prompt to Prosperity is a hands-on training program in the use of superintelligence for Honduran entrepreneurs.",
    "meta.communityTitle": "Community | Prompt to Prosperity",
    "meta.communityDescription": "Members and participating businesses of Prompt to Prosperity.",

    "announce.closed": "Applications are closed. Stay tuned on our <a href=\"#redes\">social media</a>.",
    "lang.label": "Language",
    "nav.label": "Main navigation",
    "nav.home": "Go to home",
    "nav.program": "Program",
    "nav.stats": "Numbers",
    "nav.community": "Community",
    "nav.about": "About us",
    "nav.apply": "Apply!",

    "hero.kicker": "Superintelligence program for entrepreneurs",
    "hero.description": "A hands-on training program in the use of superintelligence for Honduran entrepreneurs.",
    "hero.cta": "Explore the program",
    "hero.video": "Watch the info video",
    "hero.apply": "Apply",
    "hero.link.stats": "Cohort 1 in numbers",
    "hero.link.help": "How to help",
    "hero.link.community": "Participating businesses",

    "program.eyebrow": "The program",
    "program.title": "About the Program",
    "program.lead": "For 10 months, selected participants will have access to hands-on training in superintelligence, digital tools, mentoring, national and international experts, and a community of entrepreneurs eager to grow, innovate and make an impact.",
    "program.audience": "Designed for those who want to apply what they learn directly to their business and turn SI into a real tool to grow, optimize processes and open new opportunities through:",
    "program.method.1": "Hands-on and theory workshops",
    "program.method.2": "One-on-one mentoring",
    "program.method.3": "Exercises on your own business",
    "program.method.4": "SI implementation",
    "program.method.5": "Networking among entrepreneurs",
    "program.photo1": "Entrepreneurs working together at their laptops",
    "program.photo2": "Group of entrepreneurs in a work session",
    "program.photoCaption": "More practice than theory: every participant works on their own business.",
    "program.statsLabel": "Program format",
    "program.stat.months.suffix": " months",
    "program.stat.months": "long",
    "program.stat.inperson": "in-person meetings",
    "program.stat.virtual": "virtual sessions",
    "program.stat.saturdays": "Saturdays",
    "program.stat.schedule": "6PM EST (except in-person meetings: 11AM EST)",

    "format.sessions.value": "2 hours",
    "format.sessions.title": "Sessions",
    "format.sessions.text": "Each thematic session lasts 2 hours.",
    "format.workshops.value": "3 hours",
    "format.workshops.title": "SI workshops",
    "format.workshops.text": "Each hands-on SI workshop lasts 3 hours.",
    "format.note": "Sessions devote more time to practice than to theory, and every workshop ends with time for questions and answers.",

    "benefits.during": "For",
    "benefits.months": "months",
    "benefits.access": "you will have access to",
    "benefits.photo": "Entrepreneur analyzing business data",
    "benefits.item.1": "Free subscriptions to <strong>Claude</strong> and <strong>Canva Pro</strong>",
    "benefits.item.2": "Workshops with national and international experts.",
    "benefits.item.3": "One-on-one mentoring with professionals and experts.",
    "benefits.item.4": "Hands-on training in superintelligence applied to business.",
    "benefits.item.5": "Networking with other entrepreneurs, professionals and partners.",
    "benefits.item.6": "Complementary resources and materials.",
    "benefits.item.7": "A program backed by the U.S. Embassy in Honduras.",
    "benefits.item.8": "Visibility and social media exposure for participating businesses.",
    "benefits.extra.1": "Tools for productivity, operations, marketing, branding and data.",
    "benefits.extra.2": "A space to present progress and results.",
    "benefits.extra.3": "Official certificate backed by PtP and the U.S. Embassy in Honduras.<small>The certificate is subject to meeting the program requirements.</small>",
    "benefits.more": "and much more",
    "benefits.less": "show less",

    "curr.eyebrow": "Curriculum",
    "curr.title": "What will entrepreneurs learn?",
    "curr.hint": "Hover over or tap each module to see its description.",
    "curr.1.lead": "Introduction to SI and opportunities for entrepreneurs.",
    "curr.1.body": "What superintelligence is, how its tools work, and where it can create value in the daily life of a business.",
    "curr.2.lead": "How to get better results from SI tools.",
    "curr.2.body": "Writing clear instructions, with context and examples, so every answer is useful and can be applied to the business.",
    "curr.3.lead": "Automating digital content, managing customer data and improving positioning.",
    "curr.3.body": "Creating posts, campaigns and messages with the help of SI, and building a consistent brand on social media.",
    "curr.4.lead": "Process automation and optimization.",
    "curr.4.body": "Spotting repetitive tasks and organizing inventory, schedules and processes to free up time to grow the business.",
    "curr.5.lead": "Information analysis for better decisions.",
    "curr.5.body": "Reading sales, customers and costs with the help of SI to find opportunities and make evidence-based decisions.",

    "results.eyebrow": "Results",
    "results.title": "Expected impact",
    "results.1": "Higher productivity",
    "results.2": "Stronger digital presence",
    "results.3": "Better customer service",
    "results.4": "More efficient, optimized processes",
    "results.5": "Data-driven decisions",
    "results.6": "Bilingual materials to reach new markets",

    "stats.eyebrow": "Our numbers · Cohort 1",
    "stats.title": "212 applications, 40 selected",
    "stats.lead": "Data collected from applicants and from the information requested in the Application Form for Honduran entrepreneurs.",
    "stats.cohort": "Cohort 1 · Call for applications",
    "stats.applied": "people applied and completed the application",
    "stats.selected": "participants selected for the program",
    "stats.gender": "Applications by gender",
    "stats.gender.aria": "132 women (62.3%) and 78 men (36.8%)",
    "stats.women": "132 women",
    "stats.women.pct": "62.3% of applications",
    "stats.men": "78 men",
    "stats.men.pct": "36.8% of applications",
    "stats.tabs": "Statistics",
    "stats.tab.profile": "Applicant profile",
    "stats.tab.selected": "The 40 selected",
    "stats.tab.criteria": "How we select",
    "stats.type": "By type of business",
    "stats.type.sub": "40 selected participants",
    "stats.type.product": "Product · 67.5%",
    "stats.type.service": "Service · 32.5%",
    "stats.criteria.intro": "What we consider in the selection process:",
    "stats.criteria.1": "The quality and completeness of the application",
    "stats.criteria.2": "Motivation to be part of the program",
    "stats.criteria.3": "The level of commitment shown",
    "stats.criteria.4": "The growth potential of the business",
    "stats.criteria.5": "Interest in implementing SI in their business",
    "stats.criteria.6": "Clarity on how they will apply what they learn",
    "stats.criteria.7": "Interest in making a positive impact on their community",
    "chart.responses": "212 responses",
    "chart.selectedSub": "40 selected participants",
    "chart.education": "Education level",
    "chart.english": "English level",
    "chart.years": "Years in business",
    "chart.priorSI": "Prior knowledge of SI",
    "chart.sector": "By sector",
    "chart.bachelor": "Bachelor's degree",
    "chart.highschool": "High school",
    "chart.master": "Master's degree",
    "chart.technical": "Technical and other",
    "chart.basic": "Basic",
    "chart.intermediate": "Intermediate",
    "chart.advanced": "Advanced",
    "chart.lt1": "Less than 1 year",
    "chart.1to2": "1–2 years",
    "chart.3to5": "3–5 years",
    "chart.gt5": "More than 5 years",
    "chart.noneExpert": "None and expert",
    "chart.food": "Food",
    "chart.services": "Services",
    "chart.retail": "Retail",
    "chart.tourism": "Tourism",
    "chart.crafts": "Crafts",
    "chart.jewelry": "Jewelry",
    "chart.construction": "Construction",
    "chart.other": "Other",

    "ticker.label": "Key figures",
    "ticker.1": "completed applications",
    "ticker.2": "selected entrepreneurs",
    "ticker.3": "of applications came from women",
    "ticker.4": "food businesses",
    "ticker.5": "product-based businesses",
    "ticker.6": "months of training",
    "ticker.7": "virtual sessions",
    "ribbon.label": "Featured businesses",

    "why.eyebrow": "Why we do it",
    "why.title": "The digital gap in entrepreneurship",
    "why.lead": "Many entrepreneurs already know about superintelligence, but few manage to turn it into an advantage for their business. These are the barriers we want to help overcome:",
    "why.1.title": "They juggle multiple roles at once.",
    "why.1.text": "They sell, serve customers, produce and keep the books. Little time is left to learn new tools.",
    "why.2.title": "They lack specialized technical support.",
    "why.2.text": "They rarely have someone to show them how to apply technology to their specific case.",
    "why.3.title": "They use SI in a limited way.",
    "why.3.text": "They use it for one-off tasks, like drafting a message, without tapping into everything it can do for their business.",
    "why.4.title": "They do not turn SI into business processes.",
    "why.4.text": "Without a method, what they learn does not become more sales, time savings or better decisions.",
    "why.solution.eyebrow": "Our answer",
    "why.solution.text": "To empower Honduran entrepreneurs with practical superintelligence skills to strengthen their productivity, improve their digital presence, optimize the management of their businesses and create greater opportunities for economic growth.",
    "why.solution.1": "Specialized workshops",
    "why.solution.2": "Mentoring",
    "why.solution.3": "SI labs",

    "alliance.eyebrow": "Institutional partnership",
    "alliance.title": "Backed by a trusted ecosystem.",
    "alliance.flag": "Flag of the United States",
    "alliance.embassy": "U.S. Embassy in Tegucigalpa",
    "alliance.partners": "In partnership with",
    "alliance.funding": "Funded by the U.S. Department of State through the Alumni Engagement Innovation Fund (AEIF).",
    "alliance.chip.1": "★ U.S. Embassy in Honduras · Program support",
    "alliance.chip.2": "U.S. Department of State · Alumni Engagement Innovation Fund (AEIF)",
    "alliance.chip.3": "Asociación Despierta Honduras (ADH) · Partner",
    "alliance.chip.4": "Banco Atlántida · Partner",
    "alliance.chip.5": "#ExchangeAlumni · Fulbright – Banco Atlántida",

    "apply.eyebrow": "Applications open",
    "apply.title": "Apply with your business to Prompt to Prosperity",
    "apply.text": "Check the requirements you meet and apply with your business. Selected participants also join a community of entrepreneurs who learn and grow together.",
    "apply.community": "Community",
    "apply.check": "Requirements to apply",
    "apply.req.1": "Be an entrepreneur with a business currently in operation",
    "apply.req.2": "Be highly motivated to learn, innovate and strengthen your business",
    "apply.req.3": "Have a basic level of English (A1 or higher)",
    "apply.req.4": "Have access to a computer and a stable internet connection",
    "apply.req.5": "Be available to take part during the 10 months of the program",
    "apply.req.6": "Commit to completing at least 90% of sessions, activities and assignments",
    "apply.req.7": "Have a genuine interest in applying what you learn to strengthen your business and make a positive impact on your community",
    "apply.status": "{checked} of {total} requirements",
    "apply.ready": "You meet the requirements! You can apply now.",

    "help.eyebrow": "Be part of the movement",
    "help.title": "How to help",
    "help.lead": "The program grows with every person and organization that joins. Choose the kind of support that suits you best.",
    "help.big1.badge": "Next call for applications",
    "help.big1.title": "Be the first to know",
    "help.big1.text": "Follow us on social media to find out when the next call opens, and share it with entrepreneurs you know.",
    "help.big1.cta": "Follow @prompttoprosperity →",
    "help.big2.badge": "Community · Cohort 1",
    "help.big2.title": "Support the participating businesses",
    "help.big2.text": "Meet the program's entrepreneurs and choose their products and services. Buying from them is support too.",
    "help.big2.cta": "See businesses →",
    "help.options": "More ways to get involved",
    "help.1.title": "Become a mentor",
    "help.1.text": "Guide an entrepreneur in one-on-one sessions and share what has worked for you.",
    "help.2.title": "Lead a workshop",
    "help.2.text": "Do you know marketing, finance, data or technology? Facilitate a hands-on session for the cohort.",
    "help.3.title": "Donate tools or licenses",
    "help.3.text": "Subscriptions, software or credits that entrepreneurs can use every day.",
    "help.4.title": "Open your spaces",
    "help.4.text": "Lend a venue for in-person meetings, fairs or work days.",
    "help.5.title": "Connect markets",
    "help.5.text": "Introduce the businesses to customers, distributors, fairs or buyers.",
    "help.6.title": "Pro bono professional support",
    "help.6.text": "Legal, accounting, design or photography advice to strengthen the businesses.",
    "help.7.title": "Sponsor the next cohort",
    "help.7.text": "Companies and organizations can fund seats, materials or program events.",
    "help.8.title": "Share the program",
    "help.8.text": "Recommend us on LinkedIn and your networks so more partners learn about the impact.",
    "help.org": "Do you represent an organization? Write to us at <a href=\"mailto:prompttoprosperity@gmail.com\">prompttoprosperity@gmail.com</a> →",
    "help.mail.mentor": "mailto:prompttoprosperity@gmail.com?subject=I%20want%20to%20be%20a%20mentor",
    "help.mail.workshop": "mailto:prompttoprosperity@gmail.com?subject=I%20want%20to%20lead%20a%20workshop",
    "help.mail.tools": "mailto:prompttoprosperity@gmail.com?subject=I%20want%20to%20donate%20tools",
    "help.mail.space": "mailto:prompttoprosperity@gmail.com?subject=I%20want%20to%20offer%20a%20space",
    "help.mail.markets": "mailto:prompttoprosperity@gmail.com?subject=I%20want%20to%20connect%20markets",
    "help.mail.probono": "mailto:prompttoprosperity@gmail.com?subject=I%20want%20to%20offer%20professional%20support",
    "help.mail.sponsor": "mailto:prompttoprosperity@gmail.com?subject=I%20want%20to%20sponsor%20the%20program",

    "footer.text": "A hands-on training program in the use of superintelligence for Honduran entrepreneurs.",
    "footer.social": "Follow us:",
    "video.close": "Close video",
    "video.label": "Prompt to Prosperity info video",

    "bot.region": "Frequently asked questions",
    "bot.panel": "Prompty, FAQ assistant",
    "bot.title": "At your service!",
    "bot.close": "Close chat",
    "bot.inputLabel": "Type your question",
    "bot.placeholder": "Type your question...",
    "bot.send": "Send",
    "bot.note": "Automated answers based on our frequently asked questions.",
    "bot.open": "Open Prompty",
    "bot.greeting": "Hi, I'm Prompty, the Prompt to Prosperity assistant. Pick a frequently asked question or type yours.",
    "bot.fallback": "I don't have that answer yet. Try one of the suggested questions or write to us at prompttoprosperity@gmail.com.",
    "bot.related": "Related questions:",

    "community.title": "Members and participating businesses",
    "community.members": "Members",
    "community.businesses": "Businesses",
    "community.membersList": "Member list",
    "community.businessList": "Business list",
    "community.filters": "Business filters",
    "community.generation": "Cohort",
    "community.category": "Category",
    "community.all": "All"
  };

  const esContent = new WeakMap();
  const esAttrs = new WeakMap();
  const listeners = [];
  let lang = "es";

  function readInitialLang() {
    const fromUrl = new URLSearchParams(window.location.search).get("lang");

    if (fromUrl === "en" || fromUrl === "es") {
      return fromUrl;
    }

    try {
      return window.localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "es";
    } catch (error) {
      return "es";
    }
  }

  // Devuelve el texto en el idioma activo; en español usa el texto que recibe.
  function t(key, spanish) {
    return lang === "en" && Object.prototype.hasOwnProperty.call(en, key) ? en[key] : spanish;
  }

  function apply(root = document) {
    root.querySelectorAll("[data-i18n]").forEach((element) => {
      if (!esContent.has(element)) {
        esContent.set(element, element.innerHTML);
      }

      element.innerHTML = t(element.dataset.i18n, esContent.get(element));
    });

    root.querySelectorAll("[data-i18n-attr]").forEach((element) => {
      if (!esAttrs.has(element)) {
        esAttrs.set(element, {});
      }

      const saved = esAttrs.get(element);

      element.dataset.i18nAttr.split(";").forEach((pair) => {
        const [attribute, key] = pair.split(":").map((part) => part.trim());

        if (!attribute || !key) {
          return;
        }

        if (!(attribute in saved)) {
          saved[attribute] = element.getAttribute(attribute) || "";
        }

        element.setAttribute(attribute, t(key, saved[attribute]));
      });
    });

    document.documentElement.lang = lang;
    document.querySelectorAll("[data-lang]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.lang === lang));
    });
  }

  function setLang(next) {
    lang = next === "en" ? "en" : "es";

    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch (error) {
      // Sin almacenamiento el cambio sigue funcionando en esta visita.
    }

    apply();
    listeners.forEach((callback) => callback(lang));
  }

  lang = readInitialLang();

  window.i18n = {
    get lang() {
      return lang;
    },
    t,
    apply,
    setLang,
    onChange(callback) {
      listeners.push(callback);
    }
  };

  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.addEventListener("click", () => setLang(button.dataset.lang));
  });

  apply();
})();
