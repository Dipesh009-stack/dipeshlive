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

  const assistant = document.querySelector(".portfolio-assistant");
  const assistantPanel = document.querySelector("[data-assistant-panel]");
  const assistantOpenButton = document.querySelector("[data-assistant-open]");
  const assistantCloseButton = document.querySelector("[data-assistant-close]");
  const assistantForm = document.querySelector("[data-assistant-form]");
  const assistantInput = document.querySelector("[data-assistant-input]");
  const assistantMessages = document.querySelector("[data-assistant-messages]");
  const assistantPromptButtons = document.querySelectorAll("[data-assistant-prompt]");

  function setAssistantOpen(isOpen) {
    if (!assistant || !assistantPanel) return;
    assistant.classList.toggle("is-open", isOpen);
    assistantPanel.setAttribute("aria-hidden", isOpen ? "false" : "true");

    if (isOpen) {
      window.setTimeout(() => assistantInput?.focus(), 120);
    }
  }

  function addAssistantMessage(message, type = "bot") {
    if (!assistantMessages) return null;

    const messageEl = document.createElement("div");
    messageEl.className = `assistant-message assistant-message-${type}`;

    const paragraph = document.createElement("p");
    paragraph.textContent = message;
    messageEl.append(paragraph);
    assistantMessages.append(messageEl);
    assistantMessages.scrollTop = assistantMessages.scrollHeight;

    return messageEl;
  }

  function setAssistantLoading(isLoading) {
    if (!(assistantInput instanceof HTMLInputElement)) return;
    const sendButton = assistantForm?.querySelector(".assistant-send");
    assistantInput.disabled = isLoading;
    sendButton?.toggleAttribute("disabled", isLoading);
  }

  const assistantAnswers = [
    {
      keywords: ["apple", "devops", "intern", "internship", "eks", "kubernetes", "elk", "prometheus", "grafana", "production incident"],
      answer:
        "At Apple Inc., Dipesh worked as a DevOps Engineer intern from July 2025 to February 2026. He managed and maintained 8+ AWS EKS clusters, supported Kubernetes operations and deployments, monitored systems with ELK, Prometheus, and Grafana, and resolved production incidents through log analysis and root cause analysis.",
    },
    {
      keywords: ["figure", "robot", "robotics", "pilot", "triage", "current", "now", "present", "meta", "vr", "telemetry"],
      answer:
        "Dipesh is currently a Robot Pilot Support / Triage Specialist at Figure AI in San Jose, starting March 2026. He supports 70+ offsite robot pilot teams, triages 20+ technical issues daily, analyzes robot logs and telemetry, collaborates with robotics engineers on recurring failures, and drove a Meta VR application transition that increased data collection output by 20%.",
    },
    {
      keywords: ["hyve", "td synnex", "test specialist", "server", "rack", "slt", "rlt", "hardware", "bmc", "ipmi"],
      answer:
        "At TD Synnex / Hyve Solutions, Dipesh worked as a Server Test Specialist from February 2024 to July 2025. He performed Server-Level Testing and Rack-Level Testing on high-density systems and diagnosed hardware failures using BMC/IPMI logs, system event logs, and diagnostic outputs.",
    },
    {
      keywords: ["ai project", "ai projects", "mcp", "llm", "query", "database", "document search", "search engine", "tf-idf", "trie", "opencv", "face recognition"],
      answer:
        "Dipesh's projects include an AI-Powered Data Query System using Go, LLMs, and MCP tools for natural-language database interaction; a Document Search Engine using inverted indexing, trie autocomplete, TF-IDF ranking, and Top-K retrieval; and a Kubernetes-Based Data Pipeline Deployment.",
    },
    {
      keywords: ["kubernetes", "eks", "aws", "cloud", "pipeline", "docker", "deployment", "infrastructure"],
      answer:
        "Dipesh has cloud and infrastructure experience with AWS, EKS, Kubernetes, Docker, Terraform, CI/CD, and production observability. His Kubernetes-Based Data Pipeline Deployment project focused on containerized data workflows, scalable infrastructure, and deployment reliability.",
    },
    {
      keywords: ["skill", "skills", "strongest", "technical", "stack", "tools"],
      answer:
        "Dipesh's strongest technical areas are Python, Go, Java, Linux CLI, AWS, Kubernetes/EKS, Docker, Terraform, CI/CD, ELK, Prometheus, Grafana, robot systems triage, server hardware validation, and AI/ML tools including LangChain, LLMs, RAG, PyTorch, Hugging Face, and TensorFlow.",
    },
    {
      keywords: ["education", "degree", "school", "university", "sjsu", "tribhuvan", "year up", "yearup"],
      answer:
        "Dipesh is pursuing a Master's in Artificial Intelligence at San Jose State University. He also has a Bachelor of Science in Computer Science and Information Technology from Tribhuvan University, completed in 2020, and completed Year Up United's Information Technology career track in San Jose in 2025.",
    },
    {
      keywords: ["certification", "certifications", "certificate", "aws cloud practitioner", "coursera", "datacamp", "freecodecamp", "anthropic"],
      answer:
        "Dipesh's certifications include AWS Cloud Practitioner, Data Analyst with Python from freeCodeCamp, Data Analyst with Python from DataCamp, Google IT Support from Coursera, Claude 101 from Anthropic, and AI Fluency from Anthropic.",
    },
    {
      keywords: ["contact", "email", "phone", "linkedin", "reach", "hire", "open"],
      answer:
        "You can contact Dipesh at wostid48@gmail.com or +1 (760) 716-2149. His LinkedIn is linkedin.com/in/dipeshwosti. He is open to AI engineering roles focused on applied AI, agents, RAG, robotics, and reliable production platforms.",
    },
    {
      keywords: ["resume", "summary", "about", "who", "background", "overview"],
      answer:
        "Dipesh is an AI master's student and engineer with experience across robotics support, production triage, DevOps, cloud infrastructure, and server validation. His background connects robot logs and telemetry, Linux diagnostics, AWS and Kubernetes operations, observability, incident response, and practical AI projects.",
    },
  ];

  function normalizeQuestion(question) {
    return question.toLowerCase().replace(/[^a-z0-9+#./\s-]/g, " ");
  }

  function getLocalAssistantAnswer(question) {
    const normalizedQuestion = normalizeQuestion(question);

    const rankedAnswer = assistantAnswers
      .map((entry) => ({
        answer: entry.answer,
        score: entry.keywords.reduce((score, keyword) => {
          return normalizedQuestion.includes(keyword) ? score + 1 : score;
        }, 0),
      }))
      .sort((first, second) => second.score - first.score)[0];

    if (rankedAnswer?.score > 0) {
      return rankedAnswer.answer;
    }

    return "I can answer from Dipesh's resume and portfolio. Try asking about his Figure AI, Apple, or Hyve Solutions work, AI projects, Kubernetes/cloud experience, technical skills, education, certifications, or contact info.";
  }

  function askAssistant(question) {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;

    addAssistantMessage(trimmedQuestion, "user");
    const loadingMessage = addAssistantMessage("Checking Dipesh's resume...", "bot");
    setAssistantLoading(true);

    window.setTimeout(() => {
      if (loadingMessage) {
        loadingMessage.querySelector("p").textContent = getLocalAssistantAnswer(trimmedQuestion);
      }

      setAssistantLoading(false);
      assistantInput?.focus();
    }, 240);
  }

  assistantOpenButton?.addEventListener("click", () => setAssistantOpen(true));
  assistantCloseButton?.addEventListener("click", () => setAssistantOpen(false));

  assistantForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!(assistantInput instanceof HTMLInputElement)) return;
    const question = assistantInput.value;
    assistantInput.value = "";
    askAssistant(question);
  });

  assistantPromptButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const prompt = button.getAttribute("data-assistant-prompt") || "";
      setAssistantOpen(true);
      askAssistant(prompt);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setAssistantOpen(false);
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

  const isLocalPreview = ["localhost", "127.0.0.1"].includes(window.location.hostname);

  if (isLocalPreview) {
    const watchedAssets = ["./index.html", "./styles.css", "./script.js"];
    let localAssetSignature = "";

    function createContentSignature(content) {
      let hash = 0;

      for (let index = 0; index < content.length; index += 1) {
        hash = (hash * 31 + content.charCodeAt(index)) >>> 0;
      }

      return `${content.length}:${hash}`;
    }

    async function checkForLocalChanges() {
      try {
        const contents = await Promise.all(
          watchedAssets.map(async (asset) => {
            const separator = asset.includes("?") ? "&" : "?";
            const response = await fetch(`${asset}${separator}reload=${Date.now()}`, {
              cache: "no-store",
            });

            return response.ok ? response.text() : "";
          }),
        );
        const nextSignature = createContentSignature(contents.join("\n"));

        if (localAssetSignature && nextSignature !== localAssetSignature) {
          window.location.reload();
          return;
        }

        localAssetSignature = nextSignature;
      } catch {
        // Keep the local preview usable if the development server briefly restarts.
      }
    }

    checkForLocalChanges();
    window.setInterval(checkForLocalChanges, 1500);
  }

})();
