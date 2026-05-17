(function () {
  const root = document.body;
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const savedTheme = window.localStorage.getItem("theme");
  const initialTheme = savedTheme || "dark";

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    window.localStorage.setItem("theme", theme);
    themeToggle?.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
  }

  setTheme(initialTheme);

  themeToggle?.addEventListener("click", function () {
    const nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  });

  const emailLink = document.querySelector("[data-email-link]");
  const copyEmailButton = document.querySelector("[data-copy-email]");
  const contactForm = document.querySelector("#contact-form");
  const contactFormStatus = document.querySelector("[data-form-status]");

  function getPlatform() {
    const userAgentPlatform = navigator.userAgentData?.platform || navigator.platform || "";
    return userAgentPlatform.toLowerCase();
  }

  emailLink?.addEventListener("click", function (event) {
    if (event.target instanceof HTMLElement && event.target.closest("[data-copy-email]")) {
      return;
    }

    const emailAddress = emailLink.getAttribute("data-email-address");
    if (!emailAddress) return;

    const platform = getPlatform();
    let destination = `mailto:${emailAddress}`;

    if (platform.includes("win")) {
      destination = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailAddress)}`;
    }

    event.preventDefault();
    window.location.href = destination;
  });

  copyEmailButton?.addEventListener("click", async function (event) {
    event.preventDefault();
    event.stopPropagation();

    const emailAddress = copyEmailButton.getAttribute("data-email-address");
    if (!emailAddress) return;

    try {
      await navigator.clipboard.writeText(emailAddress);
      copyEmailButton.classList.add("is-copied");
      copyEmailButton.setAttribute("aria-label", "Email copied");

      window.setTimeout(() => {
        copyEmailButton.classList.remove("is-copied");
        copyEmailButton.setAttribute("aria-label", "Copy email address");
      }, 1600);
    } catch (_error) {
      window.setTimeout(() => {
        copyEmailButton.setAttribute("aria-label", "Copy email address");
      }, 1600);
    }
  });

  contactForm?.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const accessKey = formData.get("access_key");
    const submitButton = contactForm.querySelector(".contact-submit");

    if (!accessKey || accessKey === "YOUR_WEB3FORMS_ACCESS_KEY") {
      if (contactFormStatus) {
        contactFormStatus.textContent = "Add your Web3Forms access key to activate this form.";
      }
      return;
    }

    submitButton?.setAttribute("disabled", "true");
    if (contactFormStatus) {
      contactFormStatus.textContent = "Sending message...";
    }

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (response.ok && result.success) {
        contactForm.reset();
        if (contactFormStatus) {
          contactFormStatus.textContent = "Message sent successfully.";
        }
      } else {
        throw new Error(result.message || "Submission failed.");
      }
    } catch (error) {
      if (contactFormStatus) {
        contactFormStatus.textContent = error instanceof Error ? error.message : "Unable to send message right now.";
      }
    } finally {
      submitButton?.removeAttribute("disabled");
    }
  });

  const heroFrame = document.querySelector(".hero-frame");
  const heroSection = document.querySelector(".hero");
  const aboutSection = document.querySelector("#about");
  const experienceSection = document.querySelector("#experience");
  const experienceHeading = document.querySelector(".experience-heading-copy");
  const experienceHandScene = document.querySelector(".experience-hand-scene");
  const experienceHand = document.querySelector(".experience-hand");
  const experienceHandGlow = document.querySelector(".experience-hand-glow");
  const experienceHandShadow = document.querySelector(".experience-hand-shadow");
  const experienceList = document.querySelector(".experience-list");
  const latestExperienceItem = document.querySelector(".latest-experience-item");
  const projectsSection = document.querySelector("#projects");
  const projectsHeading = document.querySelector(".projects-heading-copy");
  const projectsRobotScene = document.querySelector(".projects-robot-scene");
  const projectsRobot = document.querySelector(".projects-robot");
  const projectsRobotGlow = document.querySelector(".projects-robot-glow");
  const projectsRobotShadow = document.querySelector(".projects-robot-shadow");
  const experienceItems = document.querySelectorAll(".experience-item");

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function updateScrollScenes(scrollY = window.scrollY) {
    if (heroFrame && heroSection) {
      const heroHeight = heroSection.offsetHeight || window.innerHeight;
      const progress = clamp(scrollY / (heroHeight * 0.92), 0, 1);
      const fade = 1 - Math.pow(progress, 1.08);

      heroFrame.style.setProperty("--hero-progress", progress.toFixed(4));
      heroFrame.style.setProperty("--hero-fade", fade.toFixed(4));
      heroFrame.style.setProperty("--hero-coin-scale", (1 + progress * 0.72).toFixed(4));
      heroFrame.style.setProperty("--hero-coin-shift-x", `${progress * 44}px`);
      heroFrame.style.setProperty("--hero-coin-shift-y", `${progress * -138}px`);
    }

    if (aboutSection) {
      const rect = aboutSection.getBoundingClientRect();
      const progress = clamp((window.innerHeight * 0.08 - rect.top) / (window.innerHeight * 0.78), 0, 1);
      aboutSection.style.setProperty("--about-scene-progress", progress.toFixed(4));
    }

    if (projectsSection) {
      const rect = projectsSection.getBoundingClientRect();
      const progress = clamp((window.innerHeight * 0.84 - rect.top) / (window.innerHeight * 0.62), 0, 1);
      projectsSection.style.setProperty("--projects-scene-progress", progress.toFixed(4));
    }

    if (experienceList && latestExperienceItem) {
      const rect = latestExperienceItem.getBoundingClientRect();
      const progress = clamp(
        (window.innerHeight * 0.74 - rect.top) / (window.innerHeight * 0.68),
        0,
        1
      );
      experienceList.style.setProperty("--latest-job-progress", progress.toFixed(4));
    }
  }

  let lenis = null;

  if (window.Lenis) {
    lenis = new window.Lenis({
      duration: 1.15,
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 0.92,
      touchMultiplier: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });

    function raf(time) {
      lenis.raf(time);
      window.requestAnimationFrame(raf);
    }

    window.requestAnimationFrame(raf);
    lenis.on("scroll", (event) => {
      updateScrollScenes(event.scroll);
      window.ScrollTrigger?.update();
    });

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");
        if (!href || href === "#") return;

        const target = document.querySelector(href);
        if (!target) return;

        event.preventDefault();
        lenis.scrollTo(target, {
          offset: -24,
          duration: 1.2,
        });
      });
    });
  } else {
    window.addEventListener("scroll", () => updateScrollScenes(), { passive: true });
  }

  if (window.gsap && window.ScrollTrigger && experienceSection) {
    window.gsap.registerPlugin(window.ScrollTrigger);

    if (experienceHeading && experienceHandScene && experienceHand) {
      // Experience heading: subtle scale/fade entrance on scroll.
      window.gsap.fromTo(
        experienceHeading,
        {
          opacity: 0.26,
          y: 42,
          scale: 0.92,
          force3D: true,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger: experienceSection,
            start: "top 82%",
            end: "top 24%",
            scrub: 1.1,
          },
        }
      );

      // Experience hand: 3D rotation, float, and layered parallax tied to scroll.
      const handTimeline = window.gsap.timeline({
        scrollTrigger: {
          trigger: experienceSection,
          start: "top 80%",
          end: "bottom 30%",
          scrub: 1.2,
        },
        defaults: {
          ease: "none",
          force3D: true,
        },
      });

      handTimeline
        .fromTo(
          experienceHandScene,
          {
            y: 34,
            opacity: 0.42,
          },
          {
            y: -26,
            opacity: 1,
          },
          0
        )
        .fromTo(
          experienceHand,
          {
            rotateX: 18,
            rotateY: -28,
            rotateZ: -14,
            y: 16,
            z: -24,
          },
          {
            rotateX: -12,
            rotateY: 20,
            rotateZ: 10,
            y: -18,
            z: 28,
          },
          0
        )
        .fromTo(
          experienceHandGlow,
          {
            y: 24,
            x: -10,
            scale: 0.88,
            opacity: 0.56,
          },
          {
            y: -18,
            x: 12,
            scale: 1.08,
            opacity: 0.92,
          },
          0
        )
        .fromTo(
          experienceHandShadow,
          {
            y: 12,
            scaleX: 0.84,
            opacity: 0.18,
          },
          {
            y: -10,
            scaleX: 1.08,
            opacity: 0.3,
          },
          0
        );
    }

    if (lenis) {
      lenis.on("scroll", window.ScrollTrigger.update);
    }

    window.ScrollTrigger.refresh();
  }

  if (window.gsap && window.ScrollTrigger && projectsSection && projectsHeading && projectsRobotScene && projectsRobot) {
    window.gsap.fromTo(
      projectsHeading,
      {
        opacity: 0.28,
        y: 42,
        scale: 0.93,
        force3D: true,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        ease: "none",
        force3D: true,
        scrollTrigger: {
          trigger: projectsSection,
          start: "top 82%",
          end: "top 26%",
          scrub: 1.05,
        },
      }
    );

    const robotTimeline = window.gsap.timeline({
      scrollTrigger: {
        trigger: projectsSection,
        start: "top 80%",
        end: "bottom 34%",
        scrub: 1.15,
      },
      defaults: {
        ease: "none",
        force3D: true,
      },
    });

    robotTimeline
      .fromTo(
        projectsRobotScene,
        {
          y: 30,
          opacity: 0.4,
        },
        {
          y: -24,
          opacity: 1,
        },
        0
      )
      .fromTo(
        projectsRobot,
        {
          rotateX: 10,
          rotateY: -20,
          rotateZ: -8,
          y: 16,
          z: -20,
        },
        {
          rotateX: -10,
          rotateY: 18,
          rotateZ: 6,
          y: -18,
          z: 26,
        },
        0
      )
      .fromTo(
        projectsRobotGlow,
        {
          y: 20,
          x: -8,
          scale: 0.9,
          opacity: 0.5,
        },
        {
          y: -14,
          x: 10,
          scale: 1.08,
          opacity: 0.88,
        },
        0
      )
      .fromTo(
        projectsRobotShadow,
        {
          y: 12,
          scaleX: 0.86,
          opacity: 0.16,
        },
        {
          y: -8,
          scaleX: 1.06,
          opacity: 0.28,
        },
        0
      );
  }

  experienceItems.forEach((item) => {
    const toggle = item.querySelector(".experience-toggle");
    if (!toggle) return;

    toggle.addEventListener("click", () => {
      const shouldOpen = !item.classList.contains("is-open");

      experienceItems.forEach((otherItem) => {
        const otherToggle = otherItem.querySelector(".experience-toggle");
        const isCurrent = otherItem === item && shouldOpen;
        otherItem.classList.toggle("is-open", isCurrent);
        otherToggle?.setAttribute("aria-expanded", isCurrent ? "true" : "false");
      });
    });
  });

  updateScrollScenes();

  const revealItems = document.querySelectorAll("[data-reveal]");

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));

  const coin = document.querySelector("[data-coin]");

  if (coin) {
    let start = performance.now();

    function animateCoin(now) {
      const elapsed = (now - start) / 1000;
      const spin = -18 + Math.sin(elapsed * 0.4) * 11;
      const tiltX = 73 + Math.sin(elapsed * 0.55) * 2;
      const tiltZ = -8 + Math.cos(elapsed * 0.45) * 1.8;

      coin.style.setProperty("--coin-spin-y", spin + "deg");
      coin.style.setProperty("--coin-tilt-x", tiltX + "deg");
      coin.style.setProperty("--coin-tilt-z", tiltZ + "deg");

      window.requestAnimationFrame(animateCoin);
    }

    window.requestAnimationFrame(animateCoin);
  }

})();
