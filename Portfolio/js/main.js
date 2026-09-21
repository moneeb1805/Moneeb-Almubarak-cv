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

  /* Scroll progress + back to top */
  const progressBar = document.getElementById("scroll-progress-bar");
  const backToTop = document.getElementById("back-to-top");
  const onProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    if (progressBar) progressBar.style.width = `${(ratio * 100).toFixed(2)}%`;
    backToTop?.classList.toggle("is-visible", window.scrollY > 600);
  };
  onProgress();
  window.addEventListener("scroll", onProgress, { passive: true });
  window.addEventListener("resize", onProgress);
  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  /* Animated counters */
  const counters = document.querySelectorAll(".count[data-count]");
  const runCounter = (el) => {
    const target = Number(el.getAttribute("data-count")) || 0;
    if (reduceMotion) {
      el.textContent = String(target);
      return;
    }
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (counters.length) {
    if (!("IntersectionObserver" in window)) {
      counters.forEach(runCounter);
    } else {
      const counterObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            runCounter(entry.target);
            counterObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.5 }
      );
      counters.forEach((el) => counterObserver.observe(el));
    }
  }

  /* Role rotator */
  const rotator = document.getElementById("role-rotator");
  if (rotator) {
    const items = Array.from(rotator.querySelectorAll(".rotator-item"));
    let index = 0;
    if (items.length > 1 && !reduceMotion) {
      window.setInterval(() => {
        const current = items[index];
        index = (index + 1) % items.length;
        const next = items[index];
        current.classList.remove("is-active");
        current.classList.add("is-leaving");
        window.setTimeout(() => current.classList.remove("is-leaving"), 500);
        next.classList.add("is-active");
      }, 2600);
    }
  }

  /* Tilt + spotlight */
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".tilt").forEach((card) => {
      let frame = 0;
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        if (frame) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const px = x / rect.width - 0.5;
          const py = y / rect.height - 0.5;
          card.style.setProperty("--mx", `${x}px`);
          card.style.setProperty("--my", `${y}px`);
          card.style.setProperty("--rx", `${(-py * 8).toFixed(2)}deg`);
          card.style.setProperty("--ry", `${(px * 10).toFixed(2)}deg`);
          card.classList.add("is-tilting");
        });
      });
      card.addEventListener("pointerleave", () => {
        if (frame) cancelAnimationFrame(frame);
        card.classList.remove("is-tilting");
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      });
    });
  }

  /* Hero particle network */
  const canvas = document.getElementById("hero-canvas");
  if (canvas && !reduceMotion && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let particles = [];
    let pointer = { x: -9999, y: -9999 };
    let running = true;
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(28, Math.min(90, Math.floor((width * height) / 16000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1 + Math.random() * 1.6,
      }));
    };

    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);
      const linkDist = 130;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        const dxp = p.x - pointer.x;
        const dyp = p.y - pointer.y;
        const dp = Math.hypot(dxp, dyp);
        if (dp < 140) {
          p.x += (dxp / dp) * 0.6;
          p.y += (dyp / dp) * 0.6;
        }

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d = Math.hypot(dx, dy);
          if (d < linkDist) {
            ctx.strokeStyle = `rgba(96,165,250,${(0.28 * (1 - d / linkDist)).toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
        ctx.fillStyle = "rgba(147,197,253,0.9)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(draw);
    };

    const hero = canvas.closest(".hero");
    hero?.addEventListener("pointermove", (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    });
    hero?.addEventListener("pointerleave", () => {
      pointer = { x: -9999, y: -9999 };
    });

    if ("IntersectionObserver" in window) {
      const canvasObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const wasRunning = running;
          running = entry.isIntersecting;
          if (running && !wasRunning) requestAnimationFrame(draw);
        });
      });
      canvasObserver.observe(canvas);
    }

    resize();
    window.addEventListener("resize", resize);
    requestAnimationFrame(draw);
  }
})();
