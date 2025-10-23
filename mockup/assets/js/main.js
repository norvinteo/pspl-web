// ===================================
// PSPL Website - Main JavaScript
// Animation and Interaction Handler
// ===================================

// Wait for DOM and GSAP to be ready
document.addEventListener('DOMContentLoaded', function() {
    
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);
    
    // ===================================
    // HERO ANIMATIONS
    // ===================================
    
    // Hero content animation
    gsap.timeline()
        .from('.hero__headline', {
            duration: 1.2,
            y: 50,
            opacity: 0,
            ease: "power3.out"
        })
        .from('.hero__subheadline', {
            duration: 1,
            y: 30,
            opacity: 0,
            ease: "power2.out"
        }, "-=0.6")
        .from('.hero__cta', {
            duration: 0.8,
            y: 20,
            opacity: 0,
            ease: "power2.out"
        }, "-=0.4")
        .from('.trust-badges .trust-badge', {
            duration: 0.6,
            y: 20,
            opacity: 0,
            stagger: 0.15,
            ease: "power2.out"
        }, "-=0.3");
    
    // ===================================
    // SCROLL-TRIGGERED ANIMATIONS
    // ===================================
    
    // Fade in elements
    gsap.utils.toArray('.fade-in').forEach(element => {
        gsap.fromTo(element, {
            opacity: 0,
            y: 30
        }, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                end: "bottom 15%",
                toggleActions: "play none none reverse"
            }
        });
    });
    
    // Fade in from left
    gsap.utils.toArray('.fade-in-left').forEach(element => {
        gsap.fromTo(element, {
            opacity: 0,
            x: -50
        }, {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    });
    
    // Fade in from right
    gsap.utils.toArray('.fade-in-right').forEach(element => {
        gsap.fromTo(element, {
            opacity: 0,
            x: 50
        }, {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    });
    
    // Staggered animations
    gsap.utils.toArray('.stagger-item').forEach((element, index) => {
        gsap.fromTo(element, {
            opacity: 0,
            y: 30
        }, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            delay: index * 0.1,
            scrollTrigger: {
                trigger: element,
                start: "top 90%",
                toggleActions: "play none none reverse"
            }
        });
    });
    
    // ===================================
    // COUNTER ANIMATIONS
    // ===================================
    
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2;
        
        gsap.fromTo(element, {
            textContent: 0
        }, {
            textContent: target,
            duration: duration,
            ease: "power2.out",
            snap: { textContent: 1 },
            onUpdate: function() {
                const value = Math.ceil(this.targets()[0].textContent);
                if (target >= 1000) {
                    element.textContent = value.toLocaleString();
                } else {
                    element.textContent = value;
                }
            }
        });
    }
    
    // Trigger counters when stats section comes into view
    ScrollTrigger.create({
        trigger: '.stats-grid',
        start: "top 80%",
        onEnter: () => {
            document.querySelectorAll('.counter').forEach(counter => {
                animateCounter(counter);
            });
        },
        onLeaveBack: () => {
            document.querySelectorAll('.counter').forEach(counter => {
                counter.textContent = '0';
            });
        }
    });
    
    // ===================================
    // MOBILE MENU
    // ===================================
    
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('nav--open');
            mobileMenuToggle.classList.toggle('mobile-menu-toggle--open');
        });
        
        // Close menu when clicking nav links
        document.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('nav--open');
                mobileMenuToggle.classList.remove('mobile-menu-toggle--open');
            });
        });
    }
    
    // ===================================
    // SMOOTH SCROLLING
    // ===================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===================================
    // HEADER SCROLL EFFECT
    // ===================================
    
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
        
        lastScrollY = currentScrollY;
    });
    
    // ===================================
    // PORTFOLIO HOVER EFFECTS
    // ===================================
    
    document.querySelectorAll('.portfolio-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            gsap.to(this, {
                scale: 1.02,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        item.addEventListener('mouseleave', function() {
            gsap.to(this, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
    
    // ===================================
    // BUTTON HOVER EFFECTS
    // ===================================
    
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            if (!this.classList.contains('btn--emergency')) {
                gsap.to(this, {
                    scale: 1.05,
                    duration: 0.2,
                    ease: "power2.out"
                });
            }
        });
        
        btn.addEventListener('mouseleave', function() {
            if (!this.classList.contains('btn--emergency')) {
                gsap.to(this, {
                    scale: 1,
                    duration: 0.2,
                    ease: "power2.out"
                });
            }
        });
    });
    
    // ===================================
    // EMERGENCY BUTTON PULSE
    // ===================================
    
    gsap.to('.pulse-emergency', {
        scale: 1.1,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
    });
    
    // ===================================
    // CLIENT LOGO ANIMATION
    // ===================================
    
    ScrollTrigger.create({
        trigger: '.client-logo-grid',
        start: "top 80%",
        onEnter: () => {
            gsap.to('.client-logo', {
                filter: 'grayscale(0%)',
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out"
            });
        },
        onLeaveBack: () => {
            gsap.to('.client-logo', {
                filter: 'grayscale(100%)',
                duration: 0.5,
                ease: "power2.out"
            });
        }
    });
    
    // ===================================
    // PERFORMANCE OPTIMIZATION
    // ===================================
    
    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // ===================================
    // EMERGENCY CONTACT TRACKING
    // ===================================
    
    // Track emergency calls
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', function() {
            // Analytics tracking would go here
            console.log('Emergency call initiated:', this.href);
        });
    });
    
    // Track WhatsApp clicks
    document.querySelectorAll('a[href^="https://wa.me/"]').forEach(link => {
        link.addEventListener('click', function() {
            // Analytics tracking would go here
            console.log('WhatsApp emergency initiated:', this.href);
        });
    });
    
    // ===================================
    // FORM ENHANCEMENTS (if forms exist)
    // ===================================
    
    // Focus effects for form inputs
    document.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('form-group--focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('form-group--focused');
        });
    });
    
    console.log('PSPL Website initialized successfully');
});

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Debounce function for performance
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}