// ============================================
// MOBILE DETECTION (keep as is)
// ============================================
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

if (isMobileDevice()) {
    // Force CSS to load properly
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    
    // Disable hover effects
    document.body.classList.add('mobile-device');
    
    // Fix for iOS Safari
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        document.body.classList.add('ios-device');
        
        // Fix for iOS viewport height
        function setVH() {
            let vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }
        
        window.addEventListener('resize', setVH);
        window.addEventListener('orientationchange', setVH);
        setVH();
    }
}

// ============================================
// PROJECTS PAGE SPECIFIC CODE (MODIFIED)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Remove 300ms tap delay on mobile (keep)
    if ('ontouchstart' in window) {
        document.documentElement.style.touchAction = 'manipulation';
    }
    
    // ============================================
    // 1. CHECK IF WE'RE ON PROJECTS PAGE
    // ============================================
    const projectsGrid = document.querySelector('.projects-grid');
    const isProjectsPage = projectsGrid !== null;
    
    // ============================================
    // 2. PROJECTS PAGE SPECIFIC MOBILE FIXES
    // ============================================
    if (isProjectsPage) {
        console.log('Projects page detected, applying mobile fixes...');
        
        const projectCards = document.querySelectorAll('.project-card');
        const projectsSection = document.querySelector('.section.projects-section') || document.querySelector('.section');
        
        // CRITICAL: Force visibility on mobile for projects page
        if (isMobileDevice() || window.innerWidth <= 768) {
            console.log('Mobile device detected, forcing project display...');
            
            // Force projects grid to be visible
            if (projectsGrid) {
                projectsGrid.style.cssText = 'display: grid !important; grid-template-columns: 1fr !important; opacity: 1 !important; visibility: visible !important;';
                projectsGrid.setAttribute('data-mobile-fixed', 'true');
            }
            
            // Force all project cards to be visible
            projectCards.forEach(card => {
                card.style.cssText = 'display: block !important; opacity: 1 !important; visibility: visible !important; position: relative !important; transform: none !important;';
                card.setAttribute('data-mobile-fixed', 'true');
            });
            
            // Force section to be visible
            if (projectsSection) {
                projectsSection.style.cssText = 'display: block !important; opacity: 1 !important; visibility: visible !important; padding-top: 80px !important;';
            }
        }
        
        // ============================================
        // 3. PROJECT FILTERING - MOBILE FIXED VERSION
        // ============================================
        const filterBtns = document.querySelectorAll('.filter-btn');
        
        if (filterBtns.length > 0 && projectCards.length > 0) {
            // Mobile filter handler
            const handleFilter = function(e) {
                if (e.type === 'touchstart') e.preventDefault();
                
                // Remove active from all buttons, add to current
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                
                projectCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        // Show card with animation
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                            card.style.visibility = 'visible';
                        }, 10);
                    } else {
                        // Hide card with animation
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            };
            
            // Add both click and touch events for mobile
            filterBtns.forEach(btn => {
                btn.addEventListener('click', handleFilter);
                btn.addEventListener('touchstart', handleFilter);
            });
        }
        
        // ============================================
        // 4. EMERGENCY MOBILE FALLBACK
        // ============================================
        // If projects still not visible after 1 second, force them
        setTimeout(() => {
            if (isMobileDevice() || window.innerWidth <= 768) {
                const anyCardVisible = document.querySelector('.project-card[style*="display: block"], .project-card:not([style*="display: none"])');
                
                if (!anyCardVisible || projectCards.length === 0) {
                    console.log('Emergency fallback: Forcing project display');
                    
                    // Remove all inline styles that might be hiding content
                    projectCards.forEach(card => {
                        card.removeAttribute('style');
                        card.style.display = 'block';
                        card.style.opacity = '1';
                        card.style.visibility = 'visible';
                    });
                    
                    if (projectsGrid) {
                        projectsGrid.removeAttribute('style');
                        projectsGrid.style.display = 'grid';
                        projectsGrid.style.gridTemplateColumns = '1fr';
                    }
                }
            }
        }, 1000);
        
        // ============================================
        // 5. MOBILE RESIZE HANDLER (for projects page only)
        // ============================================
        window.addEventListener('resize', function() {
            if (isMobileDevice() || window.innerWidth <= 768) {
                // Reapply mobile fixes on resize
                projectCards.forEach(card => {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                });
                
                if (projectsGrid) {
                    projectsGrid.style.display = 'grid';
                    projectsGrid.style.gridTemplateColumns = '1fr';
                }
            }
        });
    }

    // FAQ Toggle (keep as is - for FAQ page)
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
        const question = item.querySelector(".faq-question");
        
        question.addEventListener("click", function () {
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove("active");
                }
            });
            
            item.classList.toggle("active");
        });
    });

    // Typing Animation (keep as is - for home page)
    const typingEl = document.querySelector(".typing-text");
    if (typingEl) {
        const text = "creative developer passionate about building beautiful, functional, and user-centered digital solutions that make an impact.";
        let i = 0;

        function typeEffect() {
            if (i < text.length) {
                typingEl.textContent += text.charAt(i);
                i++;
                setTimeout(typeEffect, 50);
            }
        }
        typeEffect();
    }
    // ============================================
// FUN FACTS COUNTERS (about page)
// ============================================
const counters = document.querySelectorAll('.counter[data-target]');
if (counters.length) {
    const prefersReducedMotion =
        window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const animateCounter = (el) => {
        if (el.dataset.animated === 'true') return;
        el.dataset.animated = 'true';

        const target = parseInt(el.dataset.target, 10) || 0;
        const suffix = el.dataset.suffix || '';
        const duration = parseInt(el.dataset.duration || '1200', 10);

        // If user prefers reduced motion OR target is too small
        if (prefersReducedMotion || target <= 1) {
            el.textContent = `${target}${suffix}`;
            return;
        }

        const start = 1;
        const startTime = performance.now();
        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

        const tick = (now) => {
            const progress = Math.min(1, (now - startTime) / duration);
            const eased = easeOutCubic(progress);
            const value = Math.floor(start + (target - start) * eased);

            el.textContent = `${value}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                el.textContent = `${target}${suffix}`;
            }
        };

        requestAnimationFrame(tick);
    };

    // Only start animation when counters enter the screen
    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.35 }
    );

    counters.forEach((c) => counterObserver.observe(c));
}

    // Scroll Animations (keep as is - for all pages)
    const elements = document.querySelectorAll(".section, .service-card, .photo-frame");
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("reveal");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.2 }
    );
    
    if (window.innerWidth <= 768) {
        elements.forEach(el => el.classList.add('reveal'));
    } else {
        elements.forEach(el => observer.observe(el));
    }

    // Coming Soon Countdown (keep as is - for coming soon page)
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    if (daysEl && hoursEl && minutesEl && secondsEl) {
        const targetDate = new Date("2025-12-31T23:59:59").getTime();

        function updateCountdown() {
            const now = new Date().getTime();
            const diff = targetDate - now;

            if (diff <= 0) return;

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            daysEl.textContent = days < 10 ? "0" + days : days;
            hoursEl.textContent = hours < 10 ? "0" + hours : hours;
            minutesEl.textContent = minutes < 10 ? "0" + minutes : minutes;
            secondsEl.textContent = seconds < 10 ? "0" + seconds : seconds;
        }

        setInterval(updateCountdown, 1000);
        updateCountdown();
    }

    // View All FAQ button (keep as is - for FAQ page)
    const viewAllBtn = document.getElementById("viewAllBtn");
    if (viewAllBtn) {
        viewAllBtn.addEventListener("click", () => {
            document.querySelectorAll(".hidden-faq").forEach(item => {
                item.classList.add("show");
            });
            viewAllBtn.style.display = "none";
        });
    }

    // ============================================
    // 7. ADDITIONAL MOBILE TOUCH FIXES (keep as is)
    // ============================================
    // Prevent zoom on double-tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // Fix for iOS hover states
    document.addEventListener('touchstart', function() {}, true);
    // ✅ Mobile Navbar Toggle (single source of truth)
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector("#nav-links"); // use ID, not .nav-menu

if (hamburger && navMenu) {
  const closeMenu = () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
    document.body.style.overflow = "auto";
  };

  hamburger.addEventListener("click", (e) => {
    e.preventDefault();
    const isOpen = navMenu.classList.toggle("active");
    hamburger.classList.toggle("active", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  });

  // Close when clicking a link
  navMenu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", closeMenu);
  });

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (!navMenu.classList.contains("active")) return;
    if (e.target.closest("#nav-links") || e.target.closest(".hamburger")) return;
    closeMenu();
  });

  // Close on Escape (nice UX)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
}
});

// ============================================
// 8. FINAL FALLBACK FOR PROJECTS PAGE
// ============================================
// Run after window loads completely
window.addEventListener('load', function() {
    const projectsGrid = document.querySelector('.projects-grid');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (projectsGrid && (isMobileDevice() || window.innerWidth <= 768)) {
        console.log('Window loaded on mobile, final check for projects...');
        
        // One more check after everything loads
        setTimeout(() => {
            const anyCardVisible = document.querySelector('.project-card[style*="display: block"], .project-card:not([style*="display: none"])');
            
            if (!anyCardVisible && projectCards.length > 0) {
                console.log('Final fallback: Removing all inline styles');
                
                // Emergency: remove all inline styles that might be hiding content
                projectCards.forEach(card => {
                    card.removeAttribute('style');
                    card.style.display = 'block';
                    card.style.opacity = '1';
                    card.style.visibility = 'visible';
                });
                
                projectsGrid.removeAttribute('style');
                projectsGrid.style.display = 'grid';
                projectsGrid.style.gridTemplateColumns = '1fr';
                projectsGrid.style.opacity = '1';
            }
        }, 500);
    }
});
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".navbar");
  if (!nav) return;

  const setNavHeight = () => {
    document.documentElement.style.setProperty("--nav-h", `${nav.offsetHeight}px`);
  };

  setNavHeight();
  window.addEventListener("resize", setNavHeight);
});
