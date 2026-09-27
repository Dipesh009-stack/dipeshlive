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
      keywords: ["apple", "devops", "apprentice", "apprenticeship", "etl", "jenkins", "terraform", "grafana", "splunk", "dynatrace"],
      answer:
        "At Apple Inc., Dipesh worked as a DevOps Engineer apprentice from Feb 2025 to Aug 2025. He built AWS data processing pipelines with Python, automated ETL workflows with Jenkins, optimized SQL queries, deployed workloads on Kubernetes/EKS, used Terraform for reproducible infrastructure, and supported observability with Grafana, Splunk, and Dynatrace.",
    },
    {
      keywords: ["hyve", "current", "now", "present", "test specialist", "server", "rack", "slt", "rlt", "hardware", "bmc", "ipmi"],
      answer:
        "Dipesh is currently a Contract Test Specialist at Hyve Solutions in Fremont, CA, starting Aug 2025. He validates high-density server systems through Server-Level Testing and Rack-Level Testing, analyzes BMC/IPMI and system logs, troubleshoots rack components, supports root cause analysis, and maintains quality documentation.",
    },
    {
      keywords: ["ai project", "ai projects", "mcp", "llm", "query", "database", "email assistant", "n8n", "openai", "opencv", "face recognition"],
      answer:
        "Dipesh's AI-focused projects include an AI-Powered Data Query System using LLMs and MCP tools for natural-language database interaction, an AI Email Assistant using n8n and an LLM to draft email replies, and a Face Recognition Attendance System using Python, OpenCV, machine learning, and PostgreSQL.",
    },
    {
      keywords: ["kubernetes", "eks", "aws", "cloud", "pipeline", "docker", "deployment", "infrastructure"],
      answer:
        "Dipesh has cloud and infrastructure experience with AWS, EKS, Kubernetes, Docker, Terraform, Jenkins, and Google Cloud. His Kubernetes-Based Data Pipeline Deployment project focused on containerized data workflows on AWS EKS, scalable infrastructure, cloud networking, and deployment reliability.",
    },
    {
      keywords: ["skill", "skills", "strongest", "technical", "stack", "tools"],
      answer:
        "Dipesh's strongest technical areas are Python, SQL, Linux CLI, AWS, Kubernetes/EKS, Docker, Terraform, Jenkins, Git, networking fundamentals, server hardware validation, and AI tools like OpenAI, LLMs, MCP, OpenCV, and n8n.",
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
        "You can contact Dipesh at wostid48@gmail.com or +1 (760) 716-2149. His LinkedIn is linkedin.com/in/dipeshwosti. His portfolio notes that he is open to engineering roles, collaborations, and AI-driven opportunities.",
    },
    {
      keywords: ["resume", "summary", "about", "who", "background", "overview"],
      answer:
        "Dipesh is an AI master's student and engineer with experience across server validation, DevOps, cloud infrastructure, data pipelines, automation, and AI-assisted workflows. His background connects hardware diagnostics and Linux CLI work with AWS, Kubernetes, CI/CD, observability, and practical AI projects.",
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

    return "I can answer from Dipesh's resume and portfolio. Try asking about his Apple work, Hyve Solutions role, AI projects, Kubernetes/cloud work, technical skills, education, certifications, or contact info.";
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

})();
