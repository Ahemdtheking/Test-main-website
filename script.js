const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-navigation");

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    navigation.classList.toggle("is-open", !isOpen);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      navigation.classList.remove("is-open");
    }
  });
}

const currentPage = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".primary-navigation a").forEach((link) => {
  if (link.getAttribute("href") === currentPage) {
    link.setAttribute("aria-current", "page");
  }
});

document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

const siteData = window.NoobytesSiteData;
const pageTitle = document.title;
const escapeText = (element, value) => {
  element.textContent = value;
};

const renderSiteContent = () => {
  if (!siteData) return;
  const data = siteData.load();
  const settings = data.settings;
  document.title = pageTitle.replace(/Noobytes Studio/g, settings.studioName);
  document.querySelectorAll(".brand-name").forEach((brand) => {
    const name = brand.firstChild;
    if (name instanceof Text) name.textContent = settings.studioName;
  });
  document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
    const address = link.textContent.includes("@") ? link.textContent.trim() : settings.email;
    if (address.includes("@")) link.href = `mailto:${settings.email}`;
  });
  const contactEmail = document.querySelector(".contact-method a[href^='mailto:']");
  if (contactEmail) escapeText(contactEmail, settings.email);

  const heroHeading = document.querySelector(".hero h1");
  if (heroHeading) {
    const headingText = heroHeading.firstChild;
    if (headingText instanceof Text) headingText.textContent = `${settings.heroTitle} `;
  }
  const heroDescription = document.querySelector(".hero-lead");
  if (heroDescription && currentPage === "index.html") escapeText(heroDescription, settings.heroDescription);
  const ctaHeading = document.querySelector(".cta-panel h2");
  if (ctaHeading && currentPage === "index.html") escapeText(ctaHeading, settings.ctaTitle);

  document.querySelectorAll(".contact-sidebar .availability").forEach((notice) => {
    const text = notice.querySelector("p");
    if (!text) return;
    text.replaceChildren();
    const title = document.createElement("strong");
    title.textContent = settings.acceptingProjects ? "Currently accepting new projects" : "Not accepting new projects right now";
    text.append(title, document.createElement("br"), document.createTextNode(settings.acceptingProjects ? "Share a few details and we'll be in touch." : "Please get in touch to ask about future availability."));
  });

  data.services.forEach((service, index) => {
    const homeCard = document.querySelector(`.service-card:nth-child(${index + 1})`);
    const detailCard = document.getElementById(service.id);
    if (homeCard) {
      homeCard.hidden = service.visible === false;
      const heading = homeCard.querySelector("h3");
      const description = homeCard.querySelector("p");
      if (heading) escapeText(heading, service.name);
      if (description) escapeText(description, service.description);
    }
    if (detailCard) {
      detailCard.hidden = service.visible === false;
      const heading = detailCard.querySelector("h2");
      const description = detailCard.querySelector(":scope > p");
      if (heading) escapeText(heading, service.name);
      if (description) escapeText(description, service.description);
      detailCard.querySelectorAll('a[href*="service="]').forEach((link) => {
        link.href = `contact.html?service=${encodeURIComponent(service.name)}`;
      });
    }
  });

  const serviceInputs = document.querySelectorAll('#contact-form input[name="service"]');
  data.services.forEach((service, index) => {
    const input = serviceInputs[index];
    if (!(input instanceof HTMLInputElement)) return;
    input.value = service.name;
    const label = input.closest("label")?.querySelector("span");
    if (label) escapeText(label, service.name);
  });

  const productGrid = document.querySelector(".product-grid");
  if (productGrid) {
    productGrid.replaceChildren();
    data.products.filter((product) => product.visible !== false).forEach((product) => {
      const card = document.createElement("article");
      card.className = "product-card";
      const icon = document.createElement("div");
      icon.className = `app-icon app-icon-managed app-icon-${product.id}`;
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = product.name.slice(0, 1).toUpperCase();
      const category = document.createElement("span");
      category.className = "product-tag";
      category.textContent = product.category;
      const heading = document.createElement("h2");
      heading.textContent = product.name;
      const description = document.createElement("p");
      description.textContent = product.description;
      const button = document.createElement("button");
      button.className = "button button-warm product-more";
      button.type = "button";
      button.dataset.product = product.id;
      const arrow = document.createElement("span");
      arrow.textContent = "→";
      arrow.setAttribute("aria-hidden", "true");
      button.append(document.createTextNode("Learn more "), arrow);
      card.append(icon, category, heading, description, button);
      productGrid.append(card);
    });

    const comingSoon = document.createElement("article");
    comingSoon.className = "product-card product-coming-soon";
    const comingIcon = document.createElement("span");
    comingIcon.className = "coming-soon-icon";
    comingIcon.textContent = "✦";
    comingIcon.setAttribute("aria-hidden", "true");
    const comingTag = document.createElement("span");
    comingTag.className = "product-tag";
    comingTag.textContent = "In the works";
    const comingTitle = document.createElement("h2");
    comingTitle.textContent = "More good things";
    const comingDescription = document.createElement("p");
    comingDescription.textContent = "We're dreaming up what's next. Have an idea? We'd love to hear it.";
    comingSoon.append(
      comingIcon,
      comingTag,
      comingTitle,
      comingDescription
    );
    const ideaLink = document.createElement("a");
    ideaLink.className = "button button-warm";
    ideaLink.href = "contact.html?source=product%20idea";
    ideaLink.textContent = "Share an idea →";
    comingSoon.append(ideaLink);
    productGrid.append(comingSoon);
  }
};

renderSiteContent();
window.addEventListener("noobytes-data-updated", renderSiteContent);
window.addEventListener("storage", (event) => {
  if (siteData && event.key === siteData.storageKey) renderSiteContent();
});

const contactForm = document.querySelector("#contact-form");
if (contactForm instanceof HTMLFormElement) {
  const params = new URLSearchParams(window.location.search);
  const requestedService = params.get("service");
  const source = params.get("source");
  const contextField = contactForm.elements.namedItem("context");

  if (contextField instanceof HTMLInputElement) {
    contextField.value = source || requestedService || "";
  }
  if (requestedService) {
    contactForm.querySelectorAll('input[name="service"]').forEach((input) => {
      if (input instanceof HTMLInputElement && input.value === requestedService) {
        input.checked = true;
      }
    });
  }
  if (source) {
    const sourceField = contactForm.elements.namedItem("source");
    if (sourceField instanceof HTMLSelectElement) {
      const sourceOption = Array.from(sourceField.options).find((option) => option.text.toLowerCase() === source.toLowerCase());
      if (sourceOption) sourceField.value = sourceOption.value;
    }
  }

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const feedback = document.querySelector("#form-feedback");
    if (!(feedback instanceof HTMLElement)) return;

    if (!contactForm.reportValidity()) return;

    const formData = new FormData(contactForm);
    const services = formData.getAll("service").join(", ") || "Not specified";
    const subject = `Project inquiry from ${formData.get("name")}`;
    const inquiry = {
      id: typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `inquiry-${Date.now()}`,
      name: String(formData.get("name")).trim(),
      email: String(formData.get("email")).trim(),
      phone: String(formData.get("phone") || "").trim(),
      company: String(formData.get("company") || "").trim(),
      service: services,
      budget: String(formData.get("budget") || ""),
      timeline: String(formData.get("timeline") || ""),
      source: String(formData.get("source") || ""),
      context: String(formData.get("context") || ""),
      message: String(formData.get("message")).trim(),
      date: new Date().toISOString(),
      status: "new"
    };
    if (!siteData) {
      feedback.textContent = "The inquiry could not be saved. Please email us directly at noobytesstudio@gmail.com.";
      return;
    }
    const data = siteData.load();
    data.inquiries.unshift(inquiry);
    if (!siteData.save(data)) {
      feedback.textContent = "The inquiry could not be saved in this browser. Please email us directly at noobytesstudio@gmail.com.";
      return;
    }
    const body = [
      `Name: ${formData.get("name")}`,
      `Email: ${formData.get("email")}`,
      `Phone / WhatsApp: ${formData.get("phone") || "Not provided"}`,
      `Company: ${formData.get("company") || "Not provided"}`,
      `Service(s): ${services}`,
      `Estimated budget: ${formData.get("budget") || "Not specified"}`,
      `Timeline: ${formData.get("timeline") || "Not specified"}`,
      `How they heard about us: ${formData.get("source") || "Not specified"}`,
      `Inquiry context: ${formData.get("context") || "Not specified"}`,
      `Reference: ${inquiry.id}`,
      "",
      "Project details:",
      String(formData.get("message"))
    ].join("\n");
    const email = siteData.load().settings.email;
    const mailto = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    feedback.textContent = "Your inquiry was saved in this browser. Your email app should open with the message ready to send; for shared admin access, connect a server or form service.";
    window.location.href = mailto;
  });
}

const productDialog = document.querySelector(".product-dialog");
if (productDialog instanceof HTMLDialogElement) {
  const title = productDialog.querySelector("#dialog-title");
  const description = productDialog.querySelector(".dialog-description");
  const contactLink = productDialog.querySelector(".dialog-contact");

  document.querySelector(".product-grid")?.addEventListener("click", (event) => {
    const button = event.target.closest(".product-more");
    if (!button || !siteData) return;
    const product = siteData.load().products.find((item) => item.id === button.dataset.product);
    if (!product || !(title instanceof HTMLElement) || !(description instanceof HTMLElement)) return;
    title.textContent = product.name;
    description.textContent = product.details;
    if (contactLink instanceof HTMLAnchorElement) {
      contactLink.href = `contact.html?source=${encodeURIComponent(`${product.name} question`)}`;
    }
    productDialog.showModal();
  });

  productDialog.querySelector(".dialog-close")?.addEventListener("click", () => productDialog.close());
  productDialog.addEventListener("click", (event) => {
    if (event.target === productDialog) productDialog.close();
  });
}
