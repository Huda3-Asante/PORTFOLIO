document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.querySelector(".ai-toggle");
  const chatbox = document.querySelector(".ai-chatbox");
  const closeBtn = document.querySelector(".ai-close");
  const messages = document.getElementById("aiMessages");
  const optionButtons = document.querySelectorAll(".ai-options button");
  const voiceBtn = document.querySelector(".ai-voice");

  if (!toggleBtn) return;

  toggleBtn.addEventListener("click", () => {
    chatbox.classList.toggle("active");
  });

  closeBtn.addEventListener("click", () => {
    chatbox.classList.remove("active");
  });

  optionButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;
      addUserMessage(btn.innerText);
      respond(action);
    });
  });

  /*TEXT TO SPEECH */
  function speak(text) {
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  }

  /*SPEECH TO TEXT*/
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  let recognition;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
  }

  voiceBtn.addEventListener("click", () => {
    if (!recognition) {
      alert("Voice recognition not supported in this browser.");
      return;
    }

    recognition.start();
    addBotMessage("🎤 Listening...");
  });

  recognition?.addEventListener("result", event => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    addUserMessage(transcript);
    handleVoiceCommand(transcript);
  });

 function handleVoiceCommand(text) {

  /* Wake word */
  if (text.includes("hey huda")) {
    addBotMessage("Hi! How can I help you?");
    return;
  }

  /* Internal navigation */
  if (text.includes("project")) {
    navigate("projects.html", "Opening projects page.");
    return;
  }

  if (text.includes("about")) {
    navigate("about.html", "Opening about page.");
    return;
  }

  if (text.includes("contact")) {
    navigate("contact.html", "Opening contact page.");
    return;
  }

  /* External links */
  if (text.includes("github")) {
    openExternal(
      "https://github.com/Huda3-Asante",
      "Opening GitHub profile."
    );
    return;
  }

  if (text.includes("linkedin")) {
    openExternal(
      "https://www.linkedin.com/in/hudaasante",
      "Opening LinkedIn profile."
    );
    return;
  }

  if (text.includes("email")) {
    openExternal(
      "mailto:huda@example.com",
      "Opening email."
    );
    return;
  }

  /* Project-specific commands */
  if (text.includes("kleankonnect")) {
    openExternal(
      "https://kleankonnect-api.onrender.com/docs",
      "Opening KleanKonnect project."
    );
    return;
  }

  if (text.includes("book search")) {
    openExternal(
      "https://github.com/Huda3-Asante/Book_Search.git",
      "Opening Book Search API project."
    );
    return;
  }

  /* Fallback */
  const msg =
    "Sorry, I didn’t understand. You can say open GitHub, go to projects, or open LinkedIn.";
  addBotMessage(msg);
  speak(msg);
}


  function addUserMessage(text) {
    const msg = document.createElement("div");
    msg.className = "ai-message user";
    msg.innerText = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  function addBotMessage(text) {
    const msg = document.createElement("div");
    msg.className = "ai-message bot";
    msg.innerText = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
    speak(text);
  }

  function respond(action) {
    setTimeout(() => {
      let response = "";

      switch (action) {
        case "projects":
          response =
            "Huda has built APIs, UI designs, and full web solutions. Visit the Projects page to explore her work.";
          break;

        case "skills":
          response =
            "Huda works with HTML, CSS, JavaScript, Python, FastAPI, MongoDB, REST APIs, and UI UX design.";
          break;

        case "contact":
          response =
            "You can contact Huda via the Contact page or connect with her on LinkedIn and GitHub.";
          break;

        case "about":
          response =
            "Huda is a creative developer focused on clean design and scalable backend solutions.";
          break;

        default:
          response = "How else can I assist you?";
      }

      addBotMessage(response);
    }, 600);
  }
  function navigate(page, message) {
  addBotMessage(message);
  setTimeout(() => {
    window.location.href = page;
  }, 1200);
}

function openExternal(url, message) {
  addBotMessage(message);
  setTimeout(() => {
    window.open(url, "_blank");
  }, 1200);
}

/* Auto open ONLY on landing page */
if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
  setTimeout(() => {
    chatbox.classList.add("active");
    speak("Hi, welcome to Huda’s portfolio. You can ask me to open projects, GitHub, or LinkedIn.");
  }, 3000);
}

});
