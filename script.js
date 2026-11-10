const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

const hero = document.querySelector(".hero");
const heroImages = [...hero.querySelectorAll(".hero-image")];
const heroControls = hero.querySelector(".hero-controls");
const heroButtons = [...heroControls.querySelectorAll(".hero-slide")];
const heroToggle = heroControls.querySelector(".hero-toggle");
const heroCaption = hero.querySelector(".hero-caption");
let activeSlide = 0;
let heroTimer;
let heroPaused = motionPreference.matches;

function showHeroSlide(index) {
  heroImages[activeSlide].classList.remove("is-active");
  heroButtons[activeSlide].setAttribute("aria-pressed", "false");
  activeSlide = index;
  heroImages[activeSlide].classList.add("is-active");
  heroButtons[activeSlide].setAttribute("aria-pressed", "true");
  heroCaption.textContent = heroButtons[activeSlide].dataset.caption;
}

function updateHeroRotation() {
  window.clearInterval(heroTimer);
  heroToggle.textContent = heroPaused ? "Sambung tayangan" : "Jeda tayangan";
  if (!heroPaused && !document.hidden) {
    heroTimer = window.setInterval(() => showHeroSlide((activeSlide + 1) % heroImages.length), 6500);
  }
}

function pauseHeroRotation() {
  heroPaused = true;
  updateHeroRotation();
}

heroButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    pauseHeroRotation();
    showHeroSlide(index);
  });
});

heroToggle.addEventListener("click", () => {
  heroPaused = !heroPaused;
  updateHeroRotation();
});

hero.addEventListener("focusin", (event) => {
  if (event.target !== heroToggle) pauseHeroRotation();
});
document.addEventListener("visibilitychange", updateHeroRotation);
motionPreference.addEventListener("change", (event) => {
  if (event.matches) pauseHeroRotation();
});

heroControls.hidden = false;
updateHeroRotation();

if ("IntersectionObserver" in window && !motionPreference.matches) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }
  }, { rootMargin: "0px 0px -24px 0px" });

  for (const section of document.querySelectorAll("[data-reveal]")) {
    if (section.getBoundingClientRect().top > window.innerHeight) {
      section.classList.add("reveal-ready");
      observer.observe(section);
    }
  }
}

const lightbox = document.querySelector(".lightbox");

if (typeof lightbox.showModal === "function") {
  const preview = lightbox.querySelector("img");
  const caption = lightbox.querySelector("#tajuk-gambar");

  for (const link of document.querySelectorAll("[data-gallery]")) {
    link.addEventListener("click", (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

      event.preventDefault();
      preview.src = link.href;
      preview.alt = link.querySelector("img").alt;
      caption.textContent = link.closest("figure").querySelector("h3").textContent;
      lightbox.showModal();
    });
  }
}
