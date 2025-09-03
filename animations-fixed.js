// PSPL Website - Fixed Animations with Proper Reveal Effects
console.log('animations-fixed.js loading...');

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
    const Motion = await waitForMotion();
    console.log('Motion object:', Motion);
    console.log('Motion.inView:', Motion.inView);
    const { animate, scroll, inView, stagger } = Motion;
    
    // Mobile and accessibility detection
    const isMobile = window.innerWidth <= 768;
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Skip all animations if reduced motion is preferred
    if (isReducedMotion) {
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
        // Hide initially
        heading.style.opacity = '0';
        heading.style.transform = 'translateY(30px)';
        
        inView(heading, () => {
            heading.setAttribute('data-animating', 'true');
            
            animate(heading, {
                opacity: [0, 1],
                transform: ['translateY(30px)', 'translateY(0)']
            }, {
                duration: 0.6,
                easing: [0.22, 0.61, 0.36, 1]
            });
        }, { margin: "0px" });
    });
    
    // Core Values
    const coreValueItems = document.querySelectorAll('.core-value-item');
    coreValueItems.forEach((item, i) => {
        // Hide initially
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        
        inView(item, () => {
            item.setAttribute('data-animating', 'true');
            
            animate(item, {
                opacity: [0, 1],
                transform: ['translateY(30px)', 'translateY(0)']
            }, {
                duration: 0.5,
                delay: i * 0.1,
                easing: 'ease-out'
            });
        }, { margin: "0px" });
    });
    
    // Cards - avoiding duplicates by being specific
    // Purpose cards already have .card class, so skip them in .card selector
    const purposeCards = document.querySelectorAll('.purpose-card');
    const serviceCards = document.querySelectorAll('.service-card');
    const pillarCards = document.querySelectorAll('.pillar-card');
    const promiseCards = document.querySelectorAll('.promise-card');
    const otherCards = document.querySelectorAll('.card:not(.purpose-card)');
    
    // Combine all unique cards
    const allCards = [...purposeCards, ...serviceCards, ...pillarCards, ...promiseCards, ...otherCards];
    
    allCards.forEach((card, i) => {
        // Hide initially
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        inView(card, () => {
            card.setAttribute('data-animating', 'true');
            
            // Now animate
            animate(card, {
                opacity: [0, 1],
                transform: ['translateY(30px)', 'translateY(0)']
            }, {
                duration: 0.5,
                delay: (i % 3) * 0.1,
                easing: 'ease-out'
            });
        }, { margin: "0px" });
    });
    
    // Timeline Items - Alternating animations for desktop
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, i) => {
        // Hide initially based on device
        if (isMobile) {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-30px)';
        } else {
            const isEven = i % 2 === 0;
            const startTransform = isEven ? 'translateX(-50px)' : 'translateX(50px)';
            item.style.opacity = '0';
            item.style.transform = startTransform;
        }
        
        inView(item, () => {
            item.setAttribute('data-animating', 'true');
            
            // Check if mobile
            if (isMobile) {
                // Mobile: all items come from left
                animate(item, {
                    opacity: [0, 1],
                    transform: ['translateX(-30px)', 'translateX(0)']
                }, {
                    duration: 0.6,
                    delay: i * 0.1,
                    easing: [0.22, 0.61, 0.36, 1]
                });
            } else {
                // Desktop: alternate sides
                const isEven = i % 2 === 0;
                const startTransform = isEven ? 'translateX(-50px)' : 'translateX(50px)';
                
                animate(item, {
                    opacity: [0, 1],
                    transform: [startTransform, 'translateX(0)']
                }, {
                    duration: 0.6,
                    delay: i * 0.1,
                    easing: [0.22, 0.61, 0.36, 1]
                });
            }
        }, { margin: "0px" });
    });
    
    // Portfolio Items
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach((item, i) => {
        // Hide initially
        item.style.opacity = '0';
        item.style.transform = 'scale(0.95)';
        
        inView(item, () => {
            item.setAttribute('data-animating', 'true');
            
            animate(item, {
                opacity: [0, 1],
                transform: ['scale(0.95)', 'scale(1)']
            }, {
                duration: 0.5,
                delay: (i % 3) * 0.1,
                easing: 'ease-out'
            });
        }, { margin: "0px" });
    });
    
    // Testimonial Cards
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach((card, i) => {
        // Hide initially
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        inView(card, () => {
            card.setAttribute('data-animating', 'true');
            
            animate(card, {
                opacity: [0, 1],
                transform: ['translateY(30px)', 'translateY(0)']
            }, {
                duration: 0.6,
                delay: i * 0.15,
                easing: [0.22, 0.61, 0.36, 1]
            });
        }, { margin: "0px" });
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
        }, { margin: "0px" });
    });
    
    // Statistics
    const statWrappers = document.querySelectorAll('.stat-wrapper');
    statWrappers.forEach((wrapper, i) => {
        // Hide initially
        wrapper.style.opacity = '0';
        wrapper.style.transform = 'scale(0.9)';
        
        inView(wrapper, () => {
            wrapper.setAttribute('data-animating', 'true');
            
            animate(wrapper, {
                opacity: [0, 1],
                transform: ['scale(0.9)', 'scale(1)']
            }, {
                duration: 0.5,
                delay: i * 0.1,
                easing: [0.68, -0.55, 0.265, 1.55]
            });
        }, { margin: "0px" });
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
        }, { margin: "0px" });
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
        }, { margin: "0px" });
    });
    
    // Fleet Cards (Operational Excellence)
    const fleetCards = document.querySelectorAll('.fleet-card');
    fleetCards.forEach((card, i) => {
        // Hide initially
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px) scale(0.9)';
        
        inView(card, () => {
            card.setAttribute('data-animating', 'true');
            
            animate(card, {
                opacity: [0, 1],
                transform: ['translateY(40px) scale(0.9)', 'translateY(0) scale(1)']
            }, {
                duration: 0.6,
                delay: i * 0.15,
                easing: [0.68, -0.55, 0.265, 1.55]
            });
        }, { margin: "0px" });
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
        }, { margin: "0px" });
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
        }, { margin: "0px" });
    }
    
    // ====================
    // 4. PARALLAX EFFECT (Disabled for performance)
    // ====================
    // Parallax can cause jitter, especially on mobile
    // Keeping it disabled for smoother performance
    
    console.log('All animations initialized successfully!');
    
    // Force IntersectionObservers to check by causing a layout change
    setTimeout(() => {
        // Force reflow
        document.body.style.display = 'none';
        document.body.offsetHeight; // Force reflow
        document.body.style.display = '';
        console.log('Forced layout recalculation');
    }, 100);
});