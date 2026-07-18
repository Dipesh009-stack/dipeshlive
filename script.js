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

  const experienceItems = document.querySelectorAll(".experience-item");

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
