const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

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
