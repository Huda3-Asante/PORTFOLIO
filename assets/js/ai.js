document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.querySelector(".ai-toggle");
  const chatbox = document.querySelector(".ai-chatbox");
  const closeBtn = document.querySelector(".ai-close");
  const messages = document.getElementById("aiMessages");
  const optionButtons = document.querySelectorAll(".ai-options button");
  const voiceBtn = document.querySelector(".ai-voice");

  const aiForm = document.getElementById("aiForm");
  const aiText = document.getElementById("aiText");

  if (!toggleBtn || !chatbox || !messages) return;

  const CONTACT_EMAIL = "asantehuda@gmail.com";
  const WHATSAPP_LINK = "https://wa.me/233559815445";
  const RESUME_FILE = "./Resume - Copy.pdf";
  const GITHUB_LINK = "https://github.com/Huda3-Asante";
  const LINKEDIN_LINK = "https://www.linkedin.com/in/hudaasante";
  const KLEANKONNET_LINK = "https://kleankonnect-api.onrender.com/docs";
  const BOOKSEARCH_LINK = "https://github.com/Huda3-Asante/Book_Search.git";

  const scrollToBottom = () => {
    messages.scrollTop = messages.scrollHeight;
  };

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

    if (speakIt) {
      speak(text);
    }
  }

  function speak(text) {
    if (!("speechSynthesis" in globalThis)) return;

    const trimmed = (text || "").trim();
    if (!trimmed) return;

    globalThis.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(trimmed);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.lang = "en-GB";

   globalThis.speechSynthesis.speak(utterance);
  }

  function navigate(page, message = "") {
    if (message) {
      addBotMessage(message);
      setTimeout(() => {
        globalThis.location.href = page;
      }, 600);
    } else {
      globalThis.location.href = page;
    }
  }

  function openExternal(url, message = "") {
    if (message) {
      addBotMessage(message);
    }

    setTimeout(() => {
      window.open(url, "_blank", "noopener,noreferrer");
    }, 700);
  }

  function openEmail(email, message = "") {
    if (message) {
      addBotMessage(message);
    }

    setTimeout(() => {
      globalThis.location.href = `mailto:${email}`;
    }, 500);
  }

  const COMMANDS = [
    {
      name: "projects",
      match: ["project", "projects", "portfolio work", "my work", "work"],
      run: () => navigate("projects.html", "Sure — here are Huda’s projects "),
    },
    {
      name: "about",
      match: ["about", "who are you", "who is huda", "bio", "background"],
      run: () => navigate("about.html", "Here’s a bit more about Huda "),
    },
    {
      name: "contact",
      match: ["contact", "reach", "message", "talk", "call"],
      run: () => navigate("contact.html", "Here’s how to contact Huda "),
    },
    {
      name: "services",
      match: ["service", "services", "what do you do", "offer", "pricing"],
      run: () => navigate("services.html", "Here are Huda’s services"),
    },
    {
      name: "github",
      match: ["github", "code", "repo", "repositories"],
      run: () => openExternal(GITHUB_LINK, "Opening Huda’s GitHub…"),
    },
    {
      name: "linkedin",
      match: ["linkedin", "profile", "professional"],
      run: () => openExternal(LINKEDIN_LINK, "Opening Huda’s LinkedIn…"),
    },
    {
      name: "email",
      match: ["email", "mail", "message you", "send mail"],
      run: () => openEmail(CONTACT_EMAIL, "Opening email…"),
    },
    {
      name: "resume",
      match: ["resume", "download resume", "download cv", "cv"],
      run: () => openExternal(RESUME_FILE, "Opening Huda’s resume…"),
    },
    {
      name: "whatsapp",
      match: ["whatsapp", "chat on whatsapp"],
      run: () => openExternal(WHATSAPP_LINK, "Opening WhatsApp…"),
    },
    {
      name: "tech",
      match: ["tech stack", "technologies", "skills", "stack"],
      run: () =>
        addBotMessage(
          "Huda is a Full Stack Developer working with:\n\nFrontend: HTML, CSS, JavaScript\nBackend: Python and FastAPI\nDatabases: MongoDB and MySQL\nTools: Git, GitHub, Figma, Canva, and Photoshop."
        ),
    },
    {
      name: "hazardwatch",
      match: ["hazardwatch", "hazard project"],
      run: () =>
        addBotMessage(
          "HazardWatch is a full-stack safety reporting platform where users can report hazards with location data, images, and descriptions. It also supports authentication, upvoting, and admin moderation."
        ),
    },
    {
      name: "klean",
      match: ["kleankonnect", "klean konnect", "klean connect"],
      run: () =>
        openExternal(
          KLEANKONNET_LINK,
          "Opening the KleanKonnet project…"
        ),
    },
    {
      name: "booksearch",
      match: ["book search", "book api", "book project"],
      run: () =>
        openExternal(
          BOOKSEARCH_LINK,
          "Opening the Book Search project…"
        ),
    },
    {
      name: "experience",
      match: ["experience", "work experience", "job"],
      run: () =>
        addBotMessage(
          "Huda works as a Computing Facilitator and also builds full-stack applications, APIs, and UI designs. She combines teaching, creativity, and software development."
        ),
    },
    {
      name: "hire",
      match: ["hire", "work with you", "freelance", "job opportunity", "full time"],
      run: () =>
        addBotMessage(
          "You can reach Huda via email at asantehuda@gmail.com or through WhatsApp using the green button. She is open to freelance, contract, and full-time opportunities."
        ),
    },
  ];

  function normalize(text) {
    return (text || "")
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function findCommand(text) {
    const t = normalize(text);
    if (!t) return null;

    if (
      t.includes("hey huda") ||
      t === "huda" ||
      t.includes("who are you")
    ) {
      return {
        run: () =>
          addBotMessage(
            "I’m Huda’s portfolio assistant. I can help you explore her projects, tech stack, experience, resume, and contact details."
          ),
      };
    }

    for (const cmd of COMMANDS) {
      for (const phrase of cmd.match) {
        if (t.includes(normalize(phrase))) {
          return cmd;
        }
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

    addBotMessage(
      "I’m not sure I understood that.\n\nTry asking about:\n• Projects\n• Tech stack\n• Experience\n• Resume\n• Contact"
    );
  }

  optionButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;
      addUserMessage(btn.innerText);

      setTimeout(() => {
        switch (action) {
          case "projects":
            navigate("projects.html", "Sure — here are Huda’s projects");
            break;

          case "skills":
            addBotMessage(
              "Huda works with HTML, CSS, JavaScript, Python, FastAPI, MongoDB, MySQL, Git, GitHub, Figma, Canva, and Photoshop."
            );
            break;

          case "contact":
            navigate("contact.html", "Here’s how to contact Huda");
            break;

          case "about":
            navigate("about.html", "Here’s a bit more about Huda");
            break;

          default:
            addBotMessage("How can I help?");
        }
      }, 300);
    });
  });

  toggleBtn.addEventListener("click", () => {
    chatbox.classList.toggle("active");
  });

  closeBtn?.addEventListener("click", () => {
    chatbox.classList.remove("active");
  });

  aiForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const text = aiText?.value?.trim();
    if (!text) return;

    aiText.value = "";
    handleUserText(text);
  });

  const SpeechRecognition =
    globalThis.SpeechRecognition || globalThis.webkitSpeechRecognition;

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
      addBotMessage("Voice didn’t work. You can type instead", {
        speakIt: false,
      });
    });
  }

  voiceBtn?.addEventListener("click", () => {
    if (!recognition) {
      addBotMessage("Voice recognition is not supported in this browser.", {
        speakIt: false,
      });
      return;
    }

    addBotMessage(" Listening…", { speakIt: false });
    recognition.start();
  });

  const path = globalThis.location.pathname.toLowerCase();
  const isHomePage = path.endsWith("/") || path.includes("index.html");

  if (isHomePage) {
    setTimeout(() => {
      chatbox.classList.add("active");
      addBotMessage(
        "Hi, I’m Huda’s AI assistant.\n\nI can help you explore her projects, tech stack, and experience.\n\nTry asking:\n• What projects has she built?\n• What technologies does she use?\n• View her resume\n• How can I contact her?"
      );
    }, 2500);
  }
});