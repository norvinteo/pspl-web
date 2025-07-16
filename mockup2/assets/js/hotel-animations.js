/* ===================================
   PSPL LUXURY HOTEL-INSPIRED ANIMATIONS
   Marble Restoration with Premium Hospitality Aesthetic
   =================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // GSAP LUXURY ANIMATION SYSTEM
    // ===================================
    
    // Check if GSAP loaded successfully
    if (typeof gsap === 'undefined') {
        console.error('GSAP failed to load - animations disabled');
        return;
    }
    
    // Add js-ready class to enable animations
    document.body.classList.add('js-ready');
    
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);
    
    // Register ScrollToPlugin if available
    if (typeof ScrollToPlugin !== 'undefined') {
        gsap.registerPlugin(ScrollToPlugin);
    } else {
        console.warn('ScrollToPlugin not loaded - smooth scrolling will use native fallback');
    }
    
    // Luxury animation defaults
    gsap.defaults({
        duration: 0.8,
        ease: "power2.out"
    });
    
    // ===================================
    // FLOATING NAVIGATION INTERACTIONS
    // ===================================
    
    const luxuryNav = document.querySelector('.luxury-nav');
    const navToggle = document.getElementById('luxuryToggle');
    const navMenu = document.getElementById('luxuryMenu');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('luxury-nav__menu--open');
            navToggle.classList.toggle('open');
        });
    }
    
    // Navigation scroll effect
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (luxuryNav) {
            if (currentScrollY > 100) {
                luxuryNav.style.background = 'rgba(254, 254, 254, 0.98)';
                luxuryNav.style.backdropFilter = 'blur(25px)';
                luxuryNav.style.boxShadow = 'var(--shadow-luxury-medium)';
            } else {
                luxuryNav.style.background = 'rgba(254, 254, 254, 0.95)';
                luxuryNav.style.backdropFilter = 'blur(20px)';
                luxuryNav.style.boxShadow = 'var(--shadow-luxury-soft)';
            }
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('.luxury-nav__link').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    // Check if ScrollToPlugin is available
                    if (gsap.plugins.scrollTo) {
                        gsap.to(window, {
                            duration: 1.2,
                            scrollTo: {
                                y: target,
                                offsetY: 100
                            },
                            ease: "power2.inOut"
                        });
                    } else {
                        // Fallback to native scrolling
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        console.warn('ScrollToPlugin not loaded - using native smooth scroll');
                    }
                }
            }
        });
    });
    
    // ===================================
    // LUXURY ENTRANCE ANIMATIONS
    // ===================================
    
    // Hero section entrance
    const heroTimeline = gsap.timeline();
    
    heroTimeline
        .from('.luxury-hero__subtitle', {
            y: 30,
            autoAlpha: 0,
            duration: 0.8,
            ease: "power2.out"
        })
        .from('.luxury-hero__title', {
            y: 50,
            autoAlpha: 0,
            duration: 1,
            ease: "power2.out"
        }, "-=0.4")
        .from('.luxury-hero__description', {
            y: 30,
            autoAlpha: 0,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.6")
        .from('.luxury-hero__cta .luxury-btn', {
            y: 30,
            autoAlpha: 0,
            duration: 0.6,
            stagger: 0.2,
            ease: "power2.out"
        }, "-=0.4");
    
    // ===================================
    // COUNTER ANIMATIONS
    // ===================================
    
    // Animate counters when they come into view
    function animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100; // Animate over 100 steps
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                if (current > target) current = target;
                
                // Format number with commas for large numbers
                if (target >= 1000) {
                    counter.textContent = Math.floor(current).toLocaleString();
                } else {
                    counter.textContent = Math.floor(current);
                }
                requestAnimationFrame(updateCounter);
            }
        };
        
        updateCounter();
    }
    
    // Initialize counters
    document.querySelectorAll('.counter').forEach(counter => {
        gsap.fromTo(counter, {
            textContent: 0
        }, {
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: counter,
                start: "top 85%",
                onEnter: () => animateCounter(counter),
                once: true
            }
        });
    });

    // ===================================
    // SCROLL-TRIGGERED ANIMATIONS
    // ===================================
    
    // Fade in animations
    gsap.utils.toArray('.luxury-fade-in').forEach(element => {
        gsap.fromTo(element, {
            y: 50,
            autoAlpha: 0
        }, {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                end: "bottom 20%",
                toggleActions: "play none none none"
            }
        });
    });
    
    // Fade in from left
    gsap.utils.toArray('.luxury-fade-in-left').forEach(element => {
        gsap.fromTo(element, {
            x: -50,
            autoAlpha: 0
        }, {
            x: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                toggleActions: "play none none none"
            }
        });
    });
    
    // Fade in from right
    gsap.utils.toArray('.luxury-fade-in-right').forEach(element => {
        gsap.fromTo(element, {
            x: 50,
            autoAlpha: 0
        }, {
            x: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                toggleActions: "play none none none"
            }
        });
    });
    
    // Scale in animations
    gsap.utils.toArray('.luxury-scale-in').forEach(element => {
        gsap.fromTo(element, {
            scale: 0.9,
            autoAlpha: 0
        }, {
            scale: 1,
            autoAlpha: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                toggleActions: "play none none none"
            }
        });
    });
    
    // Stagger animations for grids
    gsap.utils.toArray('.luxury-grid').forEach(grid => {
        const items = grid.querySelectorAll('.luxury-stagger-item');
        
        gsap.fromTo(items, {
            y: 30,
            autoAlpha: 0
        }, {
            y: 0,
            autoAlpha: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
                trigger: grid,
                start: "top 85%",
                toggleActions: "play none none none"
            }
        });
    });
    
    // ===================================
    // LUXURY BUTTON INTERACTIONS
    // ===================================
    
    // Enhanced button hover effects
    document.querySelectorAll('.luxury-btn').forEach(button => {
        button.addEventListener('mouseenter', function() {
            gsap.to(this, {
                y: -2,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        button.addEventListener('mouseleave', function() {
            gsap.to(this, {
                y: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        // Click animation
        button.addEventListener('click', function() {
            gsap.to(this, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut"
            });
        });
    });
    
    // ===================================
    // PARALLAX EFFECTS
    // ===================================
    
    // Hero background parallax
    gsap.to('.luxury-hero', {
        backgroundPosition: "50% 60%",
        ease: "none",
        scrollTrigger: {
            trigger: '.luxury-hero',
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });
    
    // ===================================
    // LUXURY LOADING ANIMATIONS
    // ===================================
    
    // Page load sequence
    const pageLoadTimeline = gsap.timeline();
    
    pageLoadTimeline
        .from('.luxury-nav', {
            y: -100,
            autoAlpha: 0,
            duration: 0.8,
            ease: "power2.out"
        });
    
    // ===================================
    // INTERSECTION OBSERVER FOR PERFORMANCE
    // ===================================
    
    // Optimize animations for elements in viewport
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '50px 0px'
    };
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);
    
    // Observe all animatable elements
    document.querySelectorAll('.luxury-fade-in, .luxury-scale-in, .luxury-stagger-item').forEach(el => {
        animationObserver.observe(el);
    });
    
    // ===================================
    // LUXURY CURSOR EFFECTS (DESKTOP ONLY)
    // ===================================
    
    if (window.innerWidth > 768) {
        // Custom cursor for luxury buttons
        document.querySelectorAll('.luxury-btn').forEach(button => {
            button.addEventListener('mouseenter', function() {
                document.body.style.cursor = 'pointer';
            });
            
            button.addEventListener('mouseleave', function() {
                document.body.style.cursor = 'default';
            });
        });
    }
    
    // ===================================
    // SCROLL PROGRESS INDICATOR
    // ===================================
    
    // Create subtle scroll progress for luxury experience
    const scrollProgress = document.createElement('div');
    scrollProgress.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--color-bronze-gold), var(--color-copper-rose));
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(scrollProgress);
    
    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        scrollProgress.style.width = scrolled + '%';
    });
    
    // ===================================
    // LUXURY REVEAL ANIMATIONS
    // ===================================
    
    // Text reveal animation for headings
    gsap.utils.toArray('h1, h2, h3').forEach(heading => {
        if (!heading.closest('.luxury-hero')) { // Skip hero titles (already animated)
            gsap.fromTo(heading, {
                y: 30,
                autoAlpha: 0
            }, {
                y: 0,
                autoAlpha: 1,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: heading,
                    start: "top 90%",
                    toggleActions: "play none none none"
                }
            });
        }
    });
    
    // ===================================
    // MOBILE OPTIMIZATIONS
    // ===================================
    
    // Reduce animations on mobile for performance
    if (window.innerWidth <= 768) {
        gsap.globalTimeline.timeScale(1.5); // Speed up animations on mobile
        
        // Disable heavy parallax effects on mobile
        ScrollTrigger.batch('.luxury-stagger-item', {
            onEnter: elements => gsap.fromTo(elements, {autoAlpha: 0}, {autoAlpha: 1, duration: 0.4, stagger: 0.1}),
            once: true
        });
    }
    
    console.log('🏨 PSPL Luxury Hotel Animations Initialized');
    
    // ===================================
    // FAILSAFE FOR VISIBILITY
    // ===================================
    
    // Ensure all animated elements are visible after 3 seconds
    // This prevents content from staying hidden if animations fail
    setTimeout(function() {
        const animatedElements = document.querySelectorAll(
            '.luxury-fade-in, .luxury-fade-in-left, .luxury-fade-in-right, ' +
            '.luxury-scale-in, .luxury-stagger-item'
        );
        
        animatedElements.forEach(element => {
            if (window.getComputedStyle(element).opacity === '0') {
                element.style.opacity = '1';
                element.style.transform = 'none';
                element.style.visibility = 'visible';
                console.warn('Failsafe activated for hidden element:', element);
            }
        });
    }, 3000);
});

// ===================================
// FALLBACK FOR NO JAVASCRIPT
// ===================================

// Add no-js class initially (will be removed when JS loads)
if (document.documentElement) {
    document.documentElement.classList.add('no-js');
}

// Remove no-js class when JS is available
window.addEventListener('load', function() {
    document.documentElement.classList.remove('no-js');
});

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Smooth scroll utility
function smoothScrollTo(target, offset = 100) {
    // Check if ScrollToPlugin is available
    if (gsap.plugins.scrollTo) {
        gsap.to(window, {
            duration: 1.2,
            scrollTo: {
                y: target,
                offsetY: offset
            },
            ease: "power2.inOut"
        });
    } else {
        // Fallback to native scrolling
        const element = typeof target === 'string' ? document.querySelector(target) : target;
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            console.warn('ScrollToPlugin not loaded - using native smooth scroll');
        }
    }
}

// Animation utility for dynamic content
function animateIn(element, options = {}) {
    const defaults = {
        y: 30,
        autoAlpha: 0,
        duration: 0.8,
        ease: "power2.out"
    };
    
    return gsap.fromTo(element, 
        { y: defaults.y, autoAlpha: defaults.autoAlpha },
        { ...defaults, ...options, y: 0, autoAlpha: 1 }
    );
}

// Export for use in other scripts
window.PSPLLuxury = {
    smoothScrollTo,
    animateIn
};