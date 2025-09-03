// PSPL Website - Optimized Animations with Batching
console.log('animations-final.js loading...');

// Only hide critical above-fold elements to reduce initial processing
const hideSelectors = [
    '.timeline-item',
    '.portfolio-item',
    '.testimonial-card',
    '.card',
    'h2:not(#heroTitle)'
];

// Create style tag to hide elements immediately
const hideStyle = document.createElement('style');
hideStyle.textContent = hideSelectors.map(sel => 
    `${sel} { opacity: 0 !important; }`
).join('\n');
document.head.appendChild(hideStyle);

// Wait for Motion library
function waitForMotion() {
    return new Promise((resolve) => {
        const checkMotion = () => {
            if (window.Motion) {
                resolve(window.Motion);
            } else {
                requestAnimationFrame(checkMotion);
            }
        };
        requestAnimationFrame(checkMotion);
    });
}

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Initializing final animations...');
    const { animate, scroll, inView, stagger } = await waitForMotion();
    
    // Remove the hide style to allow animations to control opacity
    hideStyle.remove();
    
    // Mobile and accessibility detection
    const isMobile = window.innerWidth <= 768;
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Skip all animations if reduced motion is preferred
    if (isReducedMotion) {
        hideStyle.remove();
        document.querySelectorAll('*').forEach(el => {
            el.style.opacity = '';
            el.style.transform = '';
        });
        return;
    }
    
    // Aggressive throttle for better performance
    const throttle = (func, delay) => {
        let timeoutId;
        let lastExecTime = 0;
        return function (...args) {
            const currentTime = Date.now();
            if (currentTime - lastExecTime > delay) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = currentTime;
                }, 16); // Next frame
            }
        };
    };
    
    // Adjust animation settings for mobile and reduced motion
    const getAnimationDuration = (desktopDuration) => {
        if (isReducedMotion) return 0.01;
        return isMobile ? Math.min(desktopDuration * 0.5, 0.3) : desktopDuration;
    };
    
    const getAnimationDelay = (desktopDelay) => {
        if (isReducedMotion) return 0;
        if (typeof desktopDelay === 'function') {
            return isMobile ? stagger(0.01) : desktopDelay;
        }
        return isMobile ? desktopDelay * 0.3 : desktopDelay;
    };
    
    // Helper to set initial state - simplified
    function hideElement(el, transform = 'translateY(20px)') {
        el.style.opacity = '0';
        el.style.transform = transform;
    }
    
    // Batch animations for better performance
    const animationBatch = [];
    let batchTimeout = null;
    
    function batchAnimate(element, options) {
        animationBatch.push({ element, options });
        
        if (!batchTimeout) {
            batchTimeout = requestAnimationFrame(() => {
                // Process batch
                animationBatch.forEach(({ element, options }) => {
                    animate(element, options.props, options.config);
                });
                animationBatch.length = 0;
                batchTimeout = null;
            });
        }
    }
    
    // Helper to check viewport
    function isInViewport(el) {
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }
    
    // ====================
    // 1. HERO SECTION (immediate animations - simplified reveal)
    // ====================
    const heroTitle = document.querySelector('#heroTitle');
    const heroSubtitle = document.querySelector('#heroSubtitle');
    const heroValue = document.querySelector('#heroValue');
    const heroButtons = document.querySelector('#heroButtons');
    
    // Simple reveal animation for hero elements
    if (heroTitle) {
        hideElement(heroTitle, 'translateY(40px)');
        animate(heroTitle, 
            { opacity: [0, 1], transform: ['translateY(40px)', 'translateY(0)'] },
            { duration: 0.8, easing: 'ease-out' }
        );
    }
    
    if (heroSubtitle) {
        hideElement(heroSubtitle, 'translateY(40px)');
        animate(heroSubtitle,
            { opacity: [0, 1], transform: ['translateY(40px)', 'translateY(0)'] },
            { duration: 0.8, delay: 0.2, easing: 'ease-out' }
        );
    }
    
    if (heroValue) {
        hideElement(heroValue, 'translateY(30px)');
        animate(heroValue,
            { opacity: [0, 1], transform: ['translateY(30px)', 'translateY(0)'] },
            { duration: 0.8, delay: 0.3, easing: 'ease-out' }
        );
    }
    
    if (heroButtons) {
        hideElement(heroButtons, 'translateY(30px)');
        animate(heroButtons,
            { opacity: [0, 1], transform: ['translateY(30px)', 'translateY(0)'] },
            { duration: 0.8, delay: 0.4, easing: 'ease-out' }
        );
    }
    
    
    // ====================
    // 2. SCROLL-TRIGGERED ANIMATIONS
    // ====================
    
    // Core Values - Simple fade
    const coreValueItems = document.querySelectorAll('.core-value-item');
    coreValueItems.forEach(item => {
        hideElement(item, 'translateY(20px)');
        inView(item, () => {
            item.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, { margin: "-100px" });
    });
    
    // Statistics Wrappers - Simple fade
    const statWrappers = document.querySelectorAll('.stat-wrapper');
    statWrappers.forEach((wrapper) => {
        hideElement(wrapper, 'none');
        inView(wrapper, () => {
            wrapper.style.transition = 'opacity 0.4s ease-out';
            wrapper.style.opacity = '1';
            wrapper.style.transform = 'none';
        }, { margin: "-100px" });
    });
    
    // Statistics (if any remain with old class)
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach((item, i) => {
        hideElement(item, 'scale(0.8)');
        inView(item, () => {
            animate(item, {
                opacity: [0, 1],
                transform: ['scale(0.8)', 'scale(1)']
            }, {
                duration: 0.5,
                delay: i * 0.1,
                easing: [0.68, -0.55, 0.265, 1.55]
            });
        }, { margin: "-100px" });
    });
    
    // Counters
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target || counter.getAttribute('data-target'));
        if (target && !isNaN(target)) {
            counter.textContent = '0';
            inView(counter, () => {
                animate((progress) => {
                    counter.textContent = Math.round(progress * target);
                }, {
                    duration: 2,
                    easing: [0.22, 0.61, 0.36, 1]
                });
            }, { margin: "-100px" });
        }
    });
    
    // All Cards - Simple CSS transition
    const allCards = document.querySelectorAll('.purpose-card, .service-card, .pillar-card, .promise-card, .card');
    allCards.forEach((card, i) => {
        hideElement(card, 'translateY(20px)');
        inView(card, throttle(() => {
            setTimeout(() => {
                card.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, (i % 3) * 50);
        }, 200), { margin: "-100px" });
    });
    
    // Timeline Items - Simplified fade-in only
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, i) => {
        hideElement(item, 'translateY(20px)');
        inView(item, throttle(() => {
            item.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 150), { margin: "-50px" });
    });
    
    // Portfolio Items - Simplified for performance
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    if (portfolioItems.length > 0) {
        // Use single observer for all portfolio items
        const observePortfolio = throttle(() => {
            portfolioItems.forEach((item, i) => {
                if (item.style.opacity === '0') {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'none';
                        item.style.transition = 'opacity 0.4s ease-out';
                    }, i * 50);
                }
            });
        }, 200);
        
        portfolioItems.forEach(item => {
            hideElement(item, 'translateY(20px)');
            inView(item, observePortfolio, { margin: "-100px" });
        });
    }
    
    // Testimonial Cards - CSS only
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach((card, i) => {
        hideElement(card, 'translateY(20px)');
        inView(card, throttle(() => {
            card.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200), { margin: "-100px" });
    });
    
    // Section Headings
    const sectionHeadings = document.querySelectorAll('h2:not(#heroTitle)');
    sectionHeadings.forEach(heading => {
        hideElement(heading, 'translateY(20px)');
        inView(heading, () => {
            animate(heading, {
                opacity: [0, 1],
                transform: ['translateY(20px)', 'translateY(0)']
            }, {
                duration: 0.6,
                easing: [0.22, 0.61, 0.36, 1]
            });
        }, { margin: "-100px" });
    });
    
    // Regular cards handled with allCards above
    
    // Filter Buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach((btn, i) => {
        hideElement(btn, 'translateY(20px)');
        inView(btn, () => {
            animate(btn, {
                opacity: [0, 1],
                transform: ['translateY(20px)', 'translateY(0)']
            }, {
                duration: 0.4,
                delay: i * 0.05
            });
        }, { margin: "-100px" });
    });
    
    // Specialty Headers
    const specialtyHeaders = document.querySelectorAll('.specialty-header');
    specialtyHeaders.forEach(header => {
        hideElement(header, 'translateX(-30px)');
        inView(header, () => {
            animate(header, {
                opacity: [0, 1],
                transform: ['translateX(-30px)', 'translateX(0)']
            }, {
                duration: 0.6,
                easing: [0.22, 0.61, 0.36, 1]
            });
        }, { margin: "-100px" });
    });
    
    // Service Icons - removed rotation animation
    
    // CTA Buttons
    const ctaButtons = document.querySelectorAll('.cta-primary');
    ctaButtons.forEach((btn, i) => {
        hideElement(btn, 'scale(0.9)');
        inView(btn, () => {
            animate(btn, {
                opacity: [0, 1],
                transform: ['scale(0.9)', 'scale(1)']
            }, {
                duration: 0.5,
                delay: i * 0.1,
                easing: [0.68, -0.55, 0.265, 1.55]
            });
        }, { margin: "-100px" });
    });
    
    // Hero Badge - Simple fade
    const heroBadge = document.querySelector('.hero-section .floating-badge');
    if (heroBadge) {
        heroBadge.style.opacity = '0';
        setTimeout(() => {
            heroBadge.style.transition = 'opacity 0.6s ease-out';
            heroBadge.style.opacity = '1';
        }, 800);
    }
    
    // Reveal Fade Elements
    const revealFadeElements = document.querySelectorAll('.reveal-fade');
    revealFadeElements.forEach((element, i) => {
        hideElement(element, 'translateY(30px)');
        inView(element, () => {
            animate(element, {
                opacity: [0, 1],
                transform: ['translateY(30px)', 'translateY(0)']
            }, {
                duration: 0.6,
                delay: i * 0.05,
                easing: [0.22, 0.61, 0.36, 1]
            });
        }, { margin: "-100px" });
    });
    
    // Image Reveal Elements
    const imageRevealElements = document.querySelectorAll('.image-reveal, .reveal-image');
    imageRevealElements.forEach((element) => {
        hideElement(element, 'scale(0.95)');
        inView(element, () => {
            animate(element, {
                opacity: [0, 1],
                transform: ['scale(0.95)', 'scale(1)']
            }, {
                duration: 0.8,
                easing: [0.22, 0.61, 0.36, 1]
            });
        }, { margin: "-100px" });
    });
    
    // Fleet Cards (Operational Excellence)
    const fleetCards = document.querySelectorAll('.fleet-card');
    fleetCards.forEach((card, i) => {
        hideElement(card, 'translateY(40px) scale(0.9)');
        inView(card, () => {
            animate(card, {
                opacity: [0, 1],
                transform: ['translateY(40px) scale(0.9)', 'translateY(0) scale(1)']
            }, {
                duration: 0.6,
                delay: i * 0.15,
                easing: [0.68, -0.55, 0.265, 1.55]
            });
        }, { margin: "-100px" });
    });
    
    // Section Dividers
    const sectionDividers = document.querySelectorAll('.section-divider');
    sectionDividers.forEach((divider) => {
        divider.style.transformOrigin = 'center';
        divider.style.transform = 'scaleX(0)';
        inView(divider, () => {
            animate(divider, {
                transform: ['scaleX(0)', 'scaleX(1)']
            }, {
                duration: 0.8,
                easing: [0.22, 0.61, 0.36, 1]
            });
        }, { margin: "-100px" });
    });
    
    // Navigation Bar - Immediate visibility
    const navbar = document.querySelector('#navbar');
    if (navbar) {
        navbar.style.opacity = '1';
        navbar.style.transform = 'none';
    }
    
    // Footer Animation
    const footer = document.querySelector('footer');
    if (footer) {
        hideElement(footer, 'translateY(50px)');
        inView(footer, () => {
            animate(footer, {
                opacity: [0, 1],
                transform: ['translateY(50px)', 'translateY(0)']
            }, {
                duration: 0.8,
                easing: [0.22, 0.61, 0.36, 1]
            });
        }, { margin: "-100px" });
    }
    
    // Mobile Menu - No animation needed, handled by CSS
    // Removed mobile menu animations to prevent jitter
    
    // ====================
    // 3. PARALLAX EFFECT - COMPLETELY DISABLED FOR PERFORMANCE
    // ====================
    // Parallax effects cause significant jitter, especially with many other animations
    // const heroBg = document.querySelector('.hero-bg');
    // Parallax disabled for performance
    
    // ====================
    // 4. HOVER ANIMATIONS - DISABLED FOR PERFORMANCE
    // ====================
    // Hover animations cause jitter during scroll
    // CSS :hover states are sufficient and more performant
    
    console.log('All animations initialized successfully!');
});