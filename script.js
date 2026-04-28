// Mobile navigation toggle + accessibility attributes
const navToggle = document.getElementById("nav-toggle");
const primaryNav = document.getElementById("primary-nav");

if (navToggle && primaryNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute(
      "aria-label",
      isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación",
    );
  });

  // Close menu when a nav link is clicked (mobile UX)
  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      primaryNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Abrir menú de navegación");
    });
  });
}

// Footer year auto-update
const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}
