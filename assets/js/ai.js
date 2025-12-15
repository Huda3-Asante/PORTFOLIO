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
    if (text.includes("project")) respond("projects");
    else if (text.includes("skill")) respond("skills");
    else if (text.includes("contact")) respond("contact");
    else if (text.includes("about")) respond("about");
    else {
      const msg = "Sorry, I didn't understand. Try saying projects, skills, or contact.";
      addBotMessage(msg);
      speak(msg);
    }
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

  /* Auto open on landing page */
  setTimeout(() => {
    chatbox.classList.add("active");
    speak("Hi, welcome to Huda’s portfolio. You can talk to me or click an option below.");
  }, 3000);
});
