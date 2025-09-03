// PSPL Website - Fixed Animations with Proper Reveal Effects
console.log('animations-fixed.js loading...');

// Hide elements initially for reveal animations
const hideSelectors = [
    '.timeline-item',
    '.portfolio-item',
    '.testimonial-card',
    '.card',
    '.purpose-card',
    '.service-card',
    '.pillar-card',
    '.promise-card',
    '.core-value-item',
    '.stat-wrapper',
    '.fleet-card',
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
    console.log('Initializing fixed animations...');
    const { animate, scroll, inView, stagger } = await waitForMotion();
    
    // Remove the hide style after a brief delay to allow animations to initialize
    setTimeout(() => {
        hideStyle.remove();
    }, 100);
    
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
        console.log('Animations disabled - reduced motion preferred');
        return;
    }
    
    // ====================
    // 1. HERO SECTION (immediate animations)
    // ====================
    const heroTitle = document.querySelector('#heroTitle');
    const heroSubtitle = document.querySelector('#heroSubtitle');
    const heroValue = document.querySelector('#heroValue');
    const heroButtons = document.querySelector('#heroButtons');
    
    // Animate hero elements immediately
    if (heroTitle) {
        animate(heroTitle, 
            { opacity: [0, 1], transform: ['translateY(40px)', 'translateY(0)'] },
            { duration: 0.8, easing: 'ease-out' }
        );
    }
    
    if (heroSubtitle) {
        animate(heroSubtitle,
            { opacity: [0, 1], transform: ['translateY(40px)', 'translateY(0)'] },
            { duration: 0.8, delay: 0.2, easing: 'ease-out' }
        );
    }
    
    if (heroValue) {
        animate(heroValue,
            { opacity: [0, 1], transform: ['translateY(30px)', 'translateY(0)'] },
            { duration: 0.8, delay: 0.3, easing: 'ease-out' }
        );
    }
    
    if (heroButtons) {
        animate(heroButtons,
            { opacity: [0, 1], transform: ['translateY(30px)', 'translateY(0)'] },
            { duration: 0.8, delay: 0.4, easing: 'ease-out' }
        );
    }
    
    // ====================
    // 2. COUNTERS
    // ====================
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target || counter.getAttribute('data-target'));
        if (target && !isNaN(target)) {
            counter.textContent = '0';
            
            inView(counter, () => {
                animate((progress) => {
                    counter.textContent = Math.round(progress * target).toLocaleString();
                }, {
                    duration: 2,
                    easing: [0.22, 0.61, 0.36, 1]
                });
            }, { margin: "0px" });
        }
    });
    
    // ====================
    // 3. SCROLL-TRIGGERED ANIMATIONS
    // ====================
    
    // Section Headings - Animate on scroll
    const sectionHeadings = document.querySelectorAll('h2:not(#heroTitle)');
    sectionHeadings.forEach(heading => {
        inView(heading, () => {
            animate(heading, {
                opacity: [0, 1],
                transform: ['translateY(30px)', 'translateY(0)']
            }, {
                duration: 0.6,
                easing: [0.22, 0.61, 0.36, 1]
            });
        }, { margin: "0px", amount: 0.1 });
    });
    
    // Core Values
    const coreValueItems = document.querySelectorAll('.core-value-item');
    coreValueItems.forEach((item, i) => {
        inView(item, () => {
            animate(item, {
                opacity: [0, 1],
                transform: ['translateY(30px)', 'translateY(0)']
            }, {
                duration: 0.5,
                delay: i * 0.1,
                easing: 'ease-out'
            });
        }, { margin: "0px", amount: 0.1 });
    });
    
    // All Cards
    const allCards = document.querySelectorAll('.purpose-card, .service-card, .pillar-card, .promise-card, .card');
    allCards.forEach((card, i) => {
        inView(card, () => {
            animate(card, {
                opacity: [0, 1],
                transform: ['translateY(30px)', 'translateY(0)']
            }, {
                duration: 0.5,
                delay: (i % 3) * 0.1,
                easing: 'ease-out'
            });
        }, { margin: "0px", amount: 0.1 });
    });
    
    // Timeline Items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, i) => {
        inView(item, () => {
            animate(item, {
                opacity: [0, 1],
                transform: ['translateX(-30px)', 'translateX(0)']
            }, {
                duration: 0.6,
                delay: i * 0.1,
                easing: [0.22, 0.61, 0.36, 1]
            });
        }, { margin: "0px", amount: 0.1 });
    });
    
    // Portfolio Items
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach((item, i) => {
        inView(item, () => {
            animate(item, {
                opacity: [0, 1],
                transform: ['scale(0.95)', 'scale(1)']
            }, {
                duration: 0.5,
                delay: (i % 3) * 0.1,
                easing: 'ease-out'
            });
        }, { margin: "0px", amount: 0.1 });
    });
    
    // Testimonial Cards
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach((card, i) => {
        inView(card, () => {
            animate(card, {
                opacity: [0, 1],
                transform: ['translateY(30px)', 'translateY(0)']
            }, {
                duration: 0.6,
                delay: i * 0.15,
                easing: [0.22, 0.61, 0.36, 1]
            });
        }, { margin: "0px", amount: 0.1 });
    });
    
    // Filter Buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach((btn, i) => {
        inView(btn, () => {
            animate(btn, {
                opacity: [0, 1],
                transform: ['translateY(20px)', 'translateY(0)']
            }, {
                duration: 0.4,
                delay: i * 0.05
            });
        }, { margin: "0px", amount: 0.5 });
    });
    
    // Statistics
    const statWrappers = document.querySelectorAll('.stat-wrapper');
    statWrappers.forEach((wrapper, i) => {
        inView(wrapper, () => {
            animate(wrapper, {
                opacity: [0, 1],
                transform: ['scale(0.9)', 'scale(1)']
            }, {
                duration: 0.5,
                delay: i * 0.1,
                easing: [0.68, -0.55, 0.265, 1.55]
            });
        }, { margin: "0px", amount: 0.1 });
    });
    
    // Reveal Fade Elements
    const revealFadeElements = document.querySelectorAll('.reveal-fade');
    revealFadeElements.forEach((element, i) => {
        inView(element, () => {
            animate(element, {
                opacity: [0, 1],
                transform: ['translateY(30px)', 'translateY(0)']
            }, {
                duration: 0.6,
                delay: i * 0.05,
                easing: [0.22, 0.61, 0.36, 1]
            });
        }, { margin: "0px", amount: 0.1 });
    });
    
    // Image Reveal Elements
    const imageRevealElements = document.querySelectorAll('.image-reveal, .reveal-image');
    imageRevealElements.forEach((element) => {
        inView(element, () => {
            animate(element, {
                opacity: [0, 1],
                transform: ['scale(0.95)', 'scale(1)']
            }, {
                duration: 0.8,
                easing: [0.22, 0.61, 0.36, 1]
            });
        }, { margin: "0px", amount: 0.1 });
    });
    
    // Fleet Cards (Operational Excellence)
    const fleetCards = document.querySelectorAll('.fleet-card');
    fleetCards.forEach((card, i) => {
        inView(card, () => {
            animate(card, {
                opacity: [0, 1],
                transform: ['translateY(40px) scale(0.9)', 'translateY(0) scale(1)']
            }, {
                duration: 0.6,
                delay: i * 0.15,
                easing: [0.68, -0.55, 0.265, 1.55]
            });
        }, { margin: "0px", amount: 0.1 });
    });
    
    // CTA Buttons
    const ctaButtons = document.querySelectorAll('.cta-primary');
    ctaButtons.forEach((btn, i) => {
        inView(btn, () => {
            animate(btn, {
                opacity: [0, 1],
                transform: ['scale(0.9)', 'scale(1)']
            }, {
                duration: 0.5,
                delay: i * 0.1,
                easing: [0.68, -0.55, 0.265, 1.55]
            });
        }, { margin: "0px", amount: 0.5 });
    });
    
    // Footer Animation
    const footer = document.querySelector('footer');
    if (footer) {
        inView(footer, () => {
            animate(footer, {
                opacity: [0, 1],
                transform: ['translateY(50px)', 'translateY(0)']
            }, {
                duration: 0.8,
                easing: [0.22, 0.61, 0.36, 1]
            });
        }, { margin: "0px", amount: 0.1 });
    }
    
    // ====================
    // 4. PARALLAX EFFECT (Disabled for performance)
    // ====================
    // Parallax can cause jitter, especially on mobile
    // Keeping it disabled for smoother performance
    
    console.log('All animations initialized successfully!');
});