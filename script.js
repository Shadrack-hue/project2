document.addEventListener("DOMContentLoaded", () => {
    /* ----------------------------------------------------
       1. LOADER REMOVAL
       ---------------------------------------------------- */
    const loader = document.getElementById("loader");
    if (loader) {
        // Wait slightly for smooth transition
        setTimeout(() => {
            loader.style.opacity = "0";
            loader.style.visibility = "hidden";
            setTimeout(() => loader.remove(), 500);
        }, 800);
    }

    /* ----------------------------------------------------
       2. CUSTOM CURSOR
       ---------------------------------------------------- */
    const cursorDot = document.querySelector(".cursor-dot");
    const cursorOutline = document.querySelector(".cursor-outline");

    if (window.matchMedia("(pointer: fine)").matches && cursorDot && cursorOutline) {
        window.addEventListener("mousemove", (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.opacity = "1";
            cursorOutline.style.opacity = "1";

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 150, fill: "forwards" });
        });

        const interactables = document.querySelectorAll("a, button, input, textarea, .magnetic-btn");
        interactables.forEach(el => {
            el.addEventListener("mouseenter", () => cursorOutline.classList.add("hover-active"));
            el.addEventListener("mouseleave", () => cursorOutline.classList.remove("hover-active"));
        });

        document.addEventListener("mouseout", (e) => {
            if (e.relatedTarget === null) {
                cursorDot.style.opacity = "0";
                cursorOutline.style.opacity = "0";
            }
        });
    }

    /* ----------------------------------------------------
       3. DARK / LIGHT MODE TOGGLE
       ---------------------------------------------------- */
    const themeToggleBtn = document.getElementById("theme-toggle");
    const htmlElement = document.documentElement;

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const currentTheme = htmlElement.getAttribute("data-theme");
            const newTheme = currentTheme === "dark" ? "light" : "dark";
            htmlElement.setAttribute("data-theme", newTheme);
            
            // Toggle icon
            const icon = themeToggleBtn.querySelector("i");
            if (newTheme === "light") {
                icon.classList.remove("fa-moon");
                icon.classList.add("fa-sun");
            } else {
                icon.classList.remove("fa-sun");
                icon.classList.add("fa-moon");
            }
        });
    }

    /* ----------------------------------------------------
       4. SCROLL PROGRESS BAR
       ---------------------------------------------------- */
    const progressBar = document.getElementById("scroll-progress");
    if (progressBar) {
        window.addEventListener("scroll", () => {
            const scrollTotal = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrollTotal / height) * 100;
            progressBar.style.width = `${scrollPercent}%`;
        });
    }

    /* ----------------------------------------------------
       5. TYPEWRITER EFFECT
       ---------------------------------------------------- */
    const typedOutput = document.getElementById("typed-output");
    if (typedOutput) {
        const phrases = ["AI Intelligence", "Scalable Systems", "Clean Architecture"];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeLoop() {
            const currentPhrase = phrases[phraseIndex];
            
            if (isDeleting) {
                typedOutput.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typedOutput.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true;
                typeSpeed = 2000; // Pause at end of phrase
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 500; // Pause before starting new phrase
            }

            setTimeout(typeLoop, typeSpeed);
        }
        
        // Start typing after a short delay
        setTimeout(typeLoop, 1500);
    }

    /* ----------------------------------------------------
       6. SCROLL REVEAL ANIMATIONS
       ---------------------------------------------------- */
    const revealElements = document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right");
    
    // Disable CSS-only keyframes and wait for JS observer
    revealElements.forEach(el => el.style.animation = "none");

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ----------------------------------------------------
       7. FORMSPREE AJAX SUBMISSION (Premium UX)
       ---------------------------------------------------- */
    const contactForm = document.getElementById("contactForm");
    
    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault(); // Prevent default page redirect
            
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalBtnContent = btn.innerHTML;
            
            // Loading state
            btn.innerHTML = '<span>Transmitting... <i class="fas fa-spinner fa-spin"></i></span>';
            btn.disabled = true;
            
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Success state
                    btn.innerHTML = '<span>Data Sent <i class="fas fa-check"></i></span>';
                    btn.style.backgroundColor = "#22c55e"; // Green success color
                    contactForm.reset();
                } else {
                    // Error state
                    btn.innerHTML = '<span>Error. Try Again <i class="fas fa-times"></i></span>';
                    btn.style.backgroundColor = "#ef4444"; // Red error color
                }
            } catch (error) {
                btn.innerHTML = '<span>Error. Try Again <i class="fas fa-times"></i></span>';
                btn.style.backgroundColor = "#ef4444";
            }
            
            // Revert button back to normal after 3.5 seconds
            setTimeout(() => {
                btn.innerHTML = originalBtnContent;
                btn.style.backgroundColor = "";
                btn.disabled = false;
            }, 3500);
        });
    }
});
