document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.querySelector(".ai-toggle");
  const chatbox = document.querySelector(".ai-chatbox");
  const closeBtn = document.querySelector(".ai-close");
  const messages = document.getElementById("aiMessages");
  const optionButtons = document.querySelectorAll(".ai-options button");
  const voiceBtn = document.querySelector(".ai-voice");

  // Optional typed input (only works if you add the form)
  const aiForm = document.getElementById("aiForm");
  const aiText = document.getElementById("aiText");

  if (!toggleBtn || !chatbox || !messages) return;

  // ===== Settings =====
  const CONTACT_EMAIL = "asantehuda@gmail.com"; 
  const WHATSAPP_LINK = "https://wa.me/233559815445"; 
  const RESUME_FILE = "./Resume - Copy.pdf"; 

  // ===== Helpers =====
  const scrollToBottom = () => (messages.scrollTop = messages.scrollHeight);

  function addUserMessage(text) {
    const msg = document.createElement("div");
    msg.className = "ai-message user";
    msg.innerText = text;
    messages.appendChild(msg);
    scrollToBottom();
  }

  function addBotMessage(text, { speakIt = true } = {}) {
    const msg = document.createElement("div");
    msg.className = "ai-message bot";
    msg.innerText = text;
    messages.appendChild(msg);
    scrollToBottom();
    if (speakIt) speak(text);
  }

  // ===== Text-to-speech (cleaner) =====
  function speak(text) {
    if (!("speechSynthesis" in window)) return;

    // Don’t speak very short system-ish messages
    const trimmed = (text || "").trim();
    if (!trimmed) return;

    // Cancel any previous queued speech so it doesn’t pile up
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(trimmed);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.lang = "en-GB"; // sounds more natural for Ghana than en-US (you can change)

    window.speechSynthesis.speak(utterance);
  }

  // ===== Navigation helpers =====
  function navigate(page, message) {
    addBotMessage(message);
    setTimeout(() => (window.location.href = page), 600);
  }

  function openExternal(url, message) {
    addBotMessage(message);
    setTimeout(() => window.open(url, "_blank", "noopener,noreferrer"), 900);
  }

  // ===== Smarter command matching =====
  const COMMANDS = [
    {
      name: "projects",
      match: ["project", "projects", "portfolio work", "my work", "work"],
      run: () => navigate("projects.html", "Opening the Projects page…"),
    },
    {
      name: "about",
      match: ["about", "who are you", "who is huda", "bio", "background"],
      run: () => navigate("about.html", "Opening the About page…"),
    },
    {
      name: "contact",
      match: ["contact", "reach", "message", "hire", "talk", "call"],
      run: () => navigate("contact.html", "Opening the Contact page…"),
    },
    {
      name: "services",
      match: ["service", "services", "what do you do", "offer", "pricing"],
      run: () => navigate("services.html", "Opening the Services page…"),
    },
    {
      name: "github",
      match: ["github", "code", "repo", "repositories"],
      run: () =>
        openExternal("https://github.com/Huda3-Asante", "Opening GitHub…"),
    },
    {
      name: "linkedin",
      match: ["linkedin", "cv", "profile", "professional"],
      run: () =>
        openExternal("https://www.linkedin.com/in/hudaasante", "Opening LinkedIn…"),
    },
    {
      name: "email",
      match: ["email", "mail", "message you", "send mail"],
      run: () => openExternal(`mailto:${CONTACT_EMAIL}`, "Opening email…"),
    },
    {
      name: "resume",
      match: ["resume", "cv", "download resume", "download cv"],
      run: () => openExternal(RESUME_FILE, "Opening your resume…"),
    },
    {
      name: "whatsapp",
      match: ["whatsapp", "wa", "chat on whatsapp"],
      run: () => openExternal(WHATSAPP_LINK, "Opening WhatsApp…"),
    },
    {
      name: "klean",
      match: ["kleankonnect", "klean konnect", "klean connect"],
      run: () =>
        openExternal("https://kleankonnect-api.onrender.com/docs", "Opening KleanKonnect…"),
    },
    {
      name: "booksearch",
      match: ["book search", "book api", "book project"],
      run: () =>
        openExternal("https://github.com/Huda3-Asante/Book_Search.git", "Opening Book Search…"),
    },
  ];

  function normalize(text) {
    return (text || "")
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  // Simple fuzzy: checks if any keyword appears
  function findCommand(text) {
    const t = normalize(text);
    if (!t) return null;

    // Wake word (optional)
    if (t.includes("hey huda") || t === "huda") {
      return { run: () => addBotMessage("Hi! You can say: projects, services, GitHub, LinkedIn, or contact.") };
    }

    // Match commands
    for (const cmd of COMMANDS) {
      for (const phrase of cmd.match) {
        if (t.includes(normalize(phrase))) return cmd;
      }
    }
    return null;
  }

  function handleUserText(text) {
    addUserMessage(text);

    const cmd = findCommand(text);
    if (cmd) {
      cmd.run();
      return;
    }

    // Friendly fallback with suggestions
    addBotMessage(
      "I didn’t catch that. Try: “show projects”, “open services”, “open GitHub”, “open LinkedIn”, or “contact”.",
      { speakIt: true }
    );
  }

  // ===== Button actions =====
  optionButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;
      addUserMessage(btn.innerText);

      setTimeout(() => {
        let response = "";
        switch (action) {
          case "projects":
            response = "Here are Huda’s projects. I can also open the Projects page for you.";
            addBotMessage(response);
            navigate("projects.html", "Opening Projects…");
            break;

          case "skills":
            response = "Tech: HTML, CSS, JavaScript, Python, FastAPI, MongoDB, MySQL, Git/GitHub, Figma, Canva, Photoshop.";
            addBotMessage(response);
            break;

          case "contact":
            response = "You can contact Huda via the Contact page, LinkedIn, or email.";
            addBotMessage(response);
            navigate("contact.html", "Opening Contact…");
            break;

          case "about":
            response = "Huda is a creative developer focused on clean design and scalable backend solutions.";
            addBotMessage(response);
            navigate("about.html", "Opening About…");
            break;

          default:
            addBotMessage("How can I help?");
        }
      }, 350);
    });
  });

  // ===== Toggle open/close =====
  toggleBtn.addEventListener("click", () => chatbox.classList.toggle("active"));
  closeBtn?.addEventListener("click", () => chatbox.classList.remove("active"));

  // ===== Typed input =====
  aiForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = aiText?.value?.trim();
    if (!text) return;
    aiText.value = "";
    handleUserText(text);
  });

  // ===== Voice recognition =====
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;

  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = "en-GB";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.addEventListener("result", (event) => {
      const transcript = event.results[0][0].transcript;
      handleUserText(transcript);
    });

    recognition.addEventListener("error", () => {
      addBotMessage("Voice didn’t work. You can type instead 🙂", { speakIt: false });
    });
  }

  voiceBtn?.addEventListener("click", () => {
    if (!recognition) {
      alert("Voice recognition not supported in this browser.");
      return;
    }
    // Don’t speak “Listening…” — it gets annoying
    addBotMessage("🎤 Listening…", { speakIt: false });
    recognition.start();
  });

  // ===== Auto open on landing page only =====
  const path = window.location.pathname.toLowerCase();
  if (path.endsWith("/") || path.includes("index.html")) {
    setTimeout(() => {
      chatbox.classList.add("active");
      addBotMessage("Hi 👋 Ask me to open projects, services, GitHub, LinkedIn, or contact.", { speakIt: true });
    }, 2500);
  }
});
