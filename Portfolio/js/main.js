(() => {
  "use strict";

  const loader = document.getElementById("loader");
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  const portraitImg = document.getElementById("profile-image");
  const portraitFallback = document.getElementById("portrait-fallback");
  const navLinks = document.querySelectorAll(".nav-links a");

  const hideLoader = () => {
    if (!loader) return;
    loader.classList.add("is-hidden");
    document.body.classList.remove("is-loading");
  };

  const scheduleHide = () => window.setTimeout(hideLoader, 350);
  if (document.readyState === "complete") scheduleHide();
  else {
    window.addEventListener("load", scheduleHide, { once: true });
    document.addEventListener("DOMContentLoaded", () => window.setTimeout(hideLoader, 1200), { once: true });
  }
  window.setTimeout(hideLoader, 1800);

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const closeMobileNav = () => {
    toggle?.classList.remove("is-open");
    mobileNav?.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    toggle?.setAttribute("aria-expanded", "false");
  };

  toggle?.addEventListener("click", () => {
    const open = !mobileNav?.classList.contains("is-open");
    toggle.classList.toggle("is-open", open);
    mobileNav?.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });

  mobileNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMobileNav();
  });

  if (portraitImg && portraitFallback) {
    const showFallback = () => {
      portraitImg.style.display = "none";
      portraitFallback.classList.add("is-visible");
    };
    portraitImg.addEventListener("error", showFallback);
    if (portraitImg.complete && portraitImg.naturalWidth === 0) showFallback();
  }

  const sections = ["about", "projects", "case-studies", "apps", "experience", "skills", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const setActiveNav = () => {
    let current = "top";
    const y = window.scrollY + 120;
    sections.forEach((section) => {
      if (section.offsetTop <= y) current = section.id;
    });
    navLinks.forEach((link) => {
      const href = link.getAttribute("href") || "";
      const id = href.replace("#", "") || "top";
      link.classList.toggle("is-active", id === current || (current === "top" && href === "#top"));
    });
  };
  window.addEventListener("scroll", setActiveNav, { passive: true });
  setActiveNav();

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((el) => el.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    revealItems.forEach((el) => observer.observe(el));
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  });
})();
