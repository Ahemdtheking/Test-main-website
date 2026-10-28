(() => {
  const storageKey = "noobytes-studio-site-data";
  const defaults = {
    settings: {
      studioName: "Noobytes Studio",
      email: "noobytesstudio@gmail.com",
      heroTitle: "Empowering businesses through exceptional web and software",
      heroDescription: "We don't just build websites — we build digital experiences that turn visitors into customers, ideas into products, and businesses into brands.",
      ctaTitle: "Want to scale your business without the guesswork?",
      acceptingProjects: true
    },
    products: [
      { id: "streaks", name: "Streaks", category: "Fitness", description: "A friendly fitness habit tracker to help you keep your momentum going.", details: "Make the healthy choice a little easier to repeat. Streaks is a fitness habit tracker designed to help you build consistency, celebrate progress, and keep moving at your own pace.", visible: true },
      { id: "prayer", name: "Prayer Tracker", category: "Faith & wellbeing", description: "A simple way to track your daily prayers and build a consistent routine.", details: "A calm, straightforward way to keep track of your daily prayers and build a routine that feels meaningful to you.", visible: true },
      { id: "calculator", name: "NBS Calculator", category: "Everyday tools", description: "A clean, no-fuss calculator for the little sums life sends your way.", details: "An easy-to-use calculator for everyday sums, with a clean interface that keeps the focus on what you need.", visible: true }
    ],
    services: [
      { id: "design", name: "UI / UX Creative Design", description: "Research-backed interfaces that feel effortless to use and help your customers find their way.", visible: true },
      { id: "software", name: "Software Development", description: "Purpose-built software, from a quick MVP to a dependable platform that grows with your business.", visible: true },
      { id: "websites", name: "Website Development", description: "Fast, responsive websites with thoughtful details that turn a first visit into a lasting impression.", visible: true }
    ],
    inquiries: []
  };

  const cloneDefaults = () => JSON.parse(JSON.stringify(defaults));
  const load = () => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (!saved) return cloneDefaults();
      const parsed = JSON.parse(saved);
      if (!parsed || typeof parsed !== "object" || !parsed.settings || !Array.isArray(parsed.products) || !Array.isArray(parsed.services) || !Array.isArray(parsed.inquiries)) {
        throw new Error("Saved site data has an invalid structure.");
      }
      return {
        ...cloneDefaults(),
        ...parsed,
        settings: { ...defaults.settings, ...parsed.settings }
      };
    } catch (error) {
      console.error("Could not read the Noobytes Studio local data.", error);
      return cloneDefaults();
    }
  };
  const save = (data) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent("noobytes-data-updated", { detail: data }));
      return true;
    } catch (error) {
      console.error("Could not save the Noobytes Studio local data.", error);
      return false;
    }
  };
  const reset = () => {
    try {
      localStorage.removeItem(storageKey);
      window.dispatchEvent(new CustomEvent("noobytes-data-updated", { detail: cloneDefaults() }));
      return true;
    } catch (error) {
      console.error("Could not reset the Noobytes Studio local data.", error);
      return false;
    }
  };

  window.NoobytesSiteData = { storageKey, defaults: cloneDefaults, load, save, reset };
})();
