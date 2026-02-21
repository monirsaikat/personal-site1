(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const projectButtons = Array.from(document.querySelectorAll(".project-btn"));
  const projectDialog = document.getElementById("project-dialog");
  const dialogTitle = document.getElementById("dialog-title");
  const dialogDescription = document.getElementById("dialog-description");
  const dialogCloseBtn = document.getElementById("dialog-close");
  const toast = document.getElementById("toast");
  const contactForm = document.getElementById("contact-form");
  const terminalForm = document.getElementById("terminal-form");
  const terminalInput = document.getElementById("terminal-input");
  const terminalOutput = document.getElementById("terminal-output");
  const visitorCountEl = document.getElementById("visitor-count");
  const currentlyBuildingEl = document.getElementById("currently-building");
  const xpBar = document.getElementById("xp-bar");
  const xpLabel = document.getElementById("xp-label");
  const loadingScreen = document.getElementById("loading-screen");
  const pixelCursor = document.getElementById("pixel-cursor");

  const focusableSelector = "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])";
  const easterEggTarget = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  const projectData = {
    timodesk: {
      title: "TimoDesk",
      html: "<p><strong>Challenge:</strong> Track work accuracy across distributed teams.</p><p><strong>Solved:</strong> Desktop screenshots + activity monitoring + start/stop timer logic.</p><p><strong>Impact:</strong> Better payroll confidence and transparent productivity signals.</p>"
    },
    webbuilder: {
      title: "Tailwind Web Builder",
      html: "<p><strong>Challenge:</strong> Non-dev users needed controlled visual editing.</p><p><strong>Solved:</strong> Blocks/elements, direct text editing, typography controls.</p><p><strong>Impact:</strong> Faster page production with fewer regressions.</p>"
    },
    chat: {
      title: "Realtime Chat",
      html: "<p><strong>Challenge:</strong> Keep room messaging reliable in reconnect scenarios.</p><p><strong>Solved:</strong> Auth-aware Socket.IO room design with query-sync frontend.</p><p><strong>Impact:</strong> Consistent realtime UX with clean message lifecycle.</p>"
    },
    textile: {
      title: "Textile Management System",
      html: "<p><strong>Challenge:</strong> Production status lived in fragmented spreadsheets.</p><p><strong>Solved:</strong> Central order, inventory, and delivery dashboard.</p><p><strong>Impact:</strong> Better planning and reduced reporting overhead.</p>"
    },
    ruhani: {
      title: "Ruhani Software Platform",
      html: "<p><strong>Challenge:</strong> Needed a clear service and lead-management foundation.</p><p><strong>Solved:</strong> Built platform and structured offerings pipeline.</p><p><strong>Impact:</strong> Improved client trust and conversion workflow.</p>"
    },
    ollama: {
      title: "Ollama AI Employee Interface",
      html: "<p><strong>Challenge:</strong> Team knowledge retrieval was slow.</p><p><strong>Solved:</strong> Internal AI interface tuned for operations support.</p><p><strong>Impact:</strong> Faster response times for common internal queries.</p>"
    },
    expense: {
      title: "Expense Management System",
      html: "<p><strong>Challenge:</strong> Manual expense approvals lacked traceability.</p><p><strong>Solved:</strong> Built image-based claims with staged approval flow.</p><p><strong>Impact:</strong> Better finance clarity and reimbursement speed.</p>"
    },
    wordpress: {
      title: "WordPress Login Customizer",
      html: "<p><strong>Challenge:</strong> Default login lacked brand control and checks.</p><p><strong>Solved:</strong> Created custom login plugin with tailored rules.</p><p><strong>Impact:</strong> Better branded experience and safer auth flow.</p>"
    },
    desktoptools: {
      title: "Desktop Productivity Tools",
      html: "<p><strong>Challenge:</strong> Needed lightweight operational desktop helpers.</p><p><strong>Solved:</strong> Built Neutralino utilities for quick day-to-day tasks.</p><p><strong>Impact:</strong> Reduced repetitive manual activity.</p>"
    },
    timeapp: {
      title: "Time Tracking Desktop App",
      html: "<p><strong>Challenge:</strong> Improve personal/team time discipline.</p><p><strong>Solved:</strong> Shipped desktop timer with tracking workflow prototypes.</p><p><strong>Impact:</strong> More consistent logging behavior.</p>"
    },
    starterkit: {
      title: "Laravel + React Starter Kit",
      html: "<p><strong>Challenge:</strong> Repeating setup time across projects.</p><p><strong>Solved:</strong> Built reusable auth + role + dashboard baseline.</p><p><strong>Impact:</strong> Faster project kickoff and standardized quality.</p>"
    }
  };

  let lastFocusedElement = null;
  let easterEggBuffer = [];
  let buildingIndex = 0;

  const buildingItems = [
    "TimoDesk desktop sync module",
    "Realtime socket reliability improvements",
    "Laravel + React starter templates",
    "Internal Ollama knowledge assistant"
  ];

  function showToast(message, type) {
    toast.innerHTML = `<p class="nes-balloon from-right ${type === "error" ? "is-dark" : ""}">${message}</p>`;
    toast.classList.add("is-visible");
    clearTimeout(showToast.timeoutId);
    showToast.timeoutId = setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }

  function setTheme(theme) {
    const isNight = theme === "night";
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    themeToggle.textContent = isNight ? "Day Mode" : "Night Mode";
    themeToggle.setAttribute("aria-pressed", String(isNight));
  }

  function initTheme() {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(savedTheme || (prefersDark ? "night" : "day"));
  }

  function initVisitorCounter() {
    const key = "saikat_portfolio_visits";
    const current = Number(localStorage.getItem(key) || "0") + 1;
    localStorage.setItem(key, String(current));
    visitorCountEl.textContent = String(current);
  }

  function animateXP(target) {
    let value = 0;
    const timer = setInterval(() => {
      value += 2;
      xpBar.value = Math.min(value, target);
      xpLabel.textContent = `${xpBar.value} / 100 XP`;
      if (value >= target) clearInterval(timer);
    }, 28);
  }

  function initSmoothScroll() {
    navLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");
        if (!href || !href.startsWith("#")) return;
        const target = document.querySelector(href);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", href);
      });
    });
  }

  function setActiveLink(targetId) {
    navLinks.forEach((link) => {
      const match = link.getAttribute("href") === `#${targetId}`;
      link.classList.toggle("is-active", match);
      link.setAttribute("aria-current", match ? "page" : "false");
    });
  }

  function initSectionObserver() {
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveLink(entry.target.id);
        });
      },
      { threshold: 0.45, rootMargin: "-25% 0px -40% 0px" }
    );
    sections.forEach((section) => observer.observe(section));
  }

  function handleNavKeyboard(event) {
    const currentIndex = navLinks.indexOf(document.activeElement);
    if (currentIndex < 0) return;
    let nextIndex = -1;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % navLinks.length;
    if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + navLinks.length) % navLinks.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = navLinks.length - 1;
    if (nextIndex > -1) {
      event.preventDefault();
      navLinks[nextIndex].focus();
    }
  }

  function openDialog(projectKey) {
    const project = projectData[projectKey];
    if (!project) return;
    lastFocusedElement = document.activeElement;
    dialogTitle.textContent = project.title;
    dialogDescription.innerHTML = project.html;
    if (typeof projectDialog.showModal === "function") projectDialog.showModal();
    else projectDialog.setAttribute("open", "open");
    const focusables = projectDialog.querySelectorAll(focusableSelector);
    if (focusables.length) focusables[0].focus();
  }

  function closeDialog() {
    if (typeof projectDialog.close === "function") projectDialog.close();
    else projectDialog.removeAttribute("open");
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") lastFocusedElement.focus();
  }

  function trapFocus(event) {
    if (event.key !== "Tab" || !projectDialog.open) return;
    const focusables = Array.from(projectDialog.querySelectorAll(focusableSelector));
    if (!focusables.length) {
      event.preventDefault();
      return;
    }
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function setFieldError(id, message) {
    const input = document.getElementById(id);
    const error = document.getElementById(`${id}-error`);
    input.classList.toggle("is-error", Boolean(message));
    input.setAttribute("aria-invalid", String(Boolean(message)));
    error.textContent = message;
  }

  function validateForm() {
    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();
    let valid = true;
    setFieldError("name", "");
    setFieldError("email", "");
    setFieldError("message", "");

    if (!name) { setFieldError("name", "Name is required."); valid = false; }
    if (!email) { setFieldError("email", "Email is required."); valid = false; }
    else if (!validateEmail(email)) { setFieldError("email", "Enter a valid email."); valid = false; }
    if (!message) { setFieldError("message", "Message is required."); valid = false; }
    else if (message.length < 10) { setFieldError("message", "Message must be at least 10 characters."); valid = false; }

    return valid;
  }

  function runTerminalCommand(raw) {
    const cmd = raw.trim().toLowerCase();
    const lines = {
      help: "Commands: help, skills, projects, status, clear",
      skills: "Core: Laravel, React, MySQL, Electron, Socket.IO, Next.js",
      projects: "Featured: TimoDesk, Web Builder, Realtime Chat, Textile Management",
      status: "Current quest: Scaling TimoDesk + building AI employee tools"
    };

    if (!cmd) return;
    if (cmd === "clear") {
      terminalOutput.textContent = "> Terminal cleared.";
      return;
    }

    const response = lines[cmd] || `Unknown command: ${cmd}`;
    terminalOutput.textContent += `\n$ ${cmd}\n${response}`;
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function initBuildingTicker() {
    setInterval(() => {
      buildingIndex = (buildingIndex + 1) % buildingItems.length;
      currentlyBuildingEl.textContent = buildingItems[buildingIndex];
    }, 3800);
  }

  function initEasterEgg(event) {
    easterEggBuffer.push(event.key);
    if (easterEggBuffer.length > easterEggTarget.length) easterEggBuffer.shift();
    const match = easterEggTarget.every((key, index) => {
      const value = easterEggBuffer[index];
      return key.toLowerCase() === String(value).toLowerCase();
    });
    if (match) {
      showToast("Easter egg unlocked: +500 XP combo!", "success");
      xpBar.value = Math.min(100, xpBar.value + 12);
      xpLabel.textContent = `${xpBar.value} / 100 XP`;
      easterEggBuffer = [];
    }
  }

  function initPixelCursor() {
    document.addEventListener("mousemove", (event) => {
      pixelCursor.classList.add("is-active");
      pixelCursor.style.left = `${event.clientX}px`;
      pixelCursor.style.top = `${event.clientY}px`;
    });
  }

  function initLoading(onDone) {
    setTimeout(() => {
      loadingScreen.classList.add("is-hidden");
      if (typeof onDone === "function") onDone();
    }, 700);
  }

  function initEvents() {
    themeToggle.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "night" ? "day" : "night";
      setTheme(next);
    });

    document.getElementById("primary-nav").addEventListener("keydown", handleNavKeyboard);

    projectButtons.forEach((button) => {
      button.addEventListener("click", () => openDialog(button.dataset.project));
    });

    dialogCloseBtn.addEventListener("click", closeDialog);
    projectDialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeDialog();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && projectDialog.open) closeDialog();
      trapFocus(event);
      initEasterEgg(event);
    });

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!validateForm()) {
        showToast("Please fix form errors and try again.", "error");
        return;
      }
      showToast("Message sent successfully. I will get back soon.", "success");
      contactForm.reset();
      ["name", "email", "message"].forEach((id) => setFieldError(id, ""));
    });

    terminalForm.addEventListener("submit", (event) => {
      event.preventDefault();
      runTerminalCommand(terminalInput.value);
      terminalInput.value = "";
      terminalInput.focus();
    });
  }

  initTheme();
  initVisitorCounter();
  initLoading(() => animateXP(92));
  initSmoothScroll();
  initSectionObserver();
  initPixelCursor();
  initBuildingTicker();
  initEvents();
})();
