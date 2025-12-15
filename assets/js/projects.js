document.addEventListener("DOMContentLoaded", () => {

    /*Mobile Navbar Toggle*/
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            navMenu.classList.toggle("active");
            hamburger.classList.toggle("active");
        });

        // Close menu when link is clicked (mobile)
        document.querySelectorAll(".nav-link").forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("active");
                hamburger.classList.remove("active");
            });
        });
    }

    /*Active Page Highlight*/
    const currentPage = window.location.pathname.split("/").pop();

    document.querySelectorAll(".nav-link").forEach(link => {
        const linkPage = link.getAttribute("href");
        if (linkPage === currentPage) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    /*Project Card Hover Fix*/
    const projectCards = document.querySelectorAll(".project-card");

    projectCards.forEach(card => {
        card.addEventListener("touchstart", () => {
            card.classList.add("hover");
        });

        card.addEventListener("touchend", () => {
            card.classList.remove("hover");
        });
    });

    /* Fallback Animation*/
    if (typeof AOS === "undefined") {
        projectCards.forEach((card, index) => {
            card.style.opacity = "0";
            card.style.transform = "translateY(30px)";

            setTimeout(() => {
                card.style.transition = "all 0.6s ease";
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
            }, index * 120);
        });
    }

});
