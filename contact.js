document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    status.innerText = "Sending message...";

    emailjs.sendForm(
      "service_e5vp4cw",     
      "template_u1z7932",    
      this
    )
    .then(() => {
      status.innerText = "Message sent successfully! 🎉";
      status.style.color = "green";
      form.reset();
    })
    .catch((error) => {
      console.error("EmailJS error:", error);
      status.innerText = "Failed to send message. Try again.";
      status.style.color = "red";
    });
  });
});