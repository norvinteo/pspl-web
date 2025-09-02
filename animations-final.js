// PSPL Website - Final Fixed Animations
console.log('animations-final.js loading...');

// IMMEDIATELY hide elements that should animate in (before page renders)
const hideSelectors = [
    '.timeline-item',
    '.portfolio-item',
    '.testimonial-card',
    '.purpose-card',
    '.service-card',
    '.pillar-card',
    '.promise-card',
    '.stat-item',
    '.stat-wrapper',
    '.filter-btn',
    '.specialty-header',
    '.core-value-item',
    '.reveal-fade',
    '.image-reveal',
    '.reveal-image',
    '.fleet-card',
    '.section-divider',
    '.mobile-menu-link',
    'footer',
    'h2:not(#heroTitle)',
    '.card:not(.purpose-card):not(.service-card):not(.pillar-card):not(.testimonial-card):not(.promise-card)'
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
    
    // Adjust animation settings for mobile and reduced motion
    const getAnimationDuration = (desktopDuration) => {
        if (isReducedMotion) return 0.01;
        return isMobile ? Math.min(desktopDuration * 0.6, 0.4) : desktopDuration;
    };
    
    const getAnimationDelay = (desktopDelay) => {
        if (isReducedMotion) return 0;
        if (typeof desktopDelay === 'function') {
            return isMobile ? stagger(0.02) : desktopDelay;
        }
        return isMobile ? desktopDelay * 0.5 : desktopDelay;
    };
    
    // Helper to set initial state
    function hideElement(el, transform = 'translateY(30px)') {
        el.style.opacity = '0';
        el.style.transform = transform;
    }
    
    // Helper to check viewport
    function isInViewport(el) {
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }
    
    // ====================
    // 1. HERO SECTION (immediate animations)
    // ====================
    const heroTitle = document.querySelector('#heroTitle');
    if (heroTitle) {
        // Preserve the original HTML structure including <br> tags
        const html = heroTitle.innerHTML;
        // Split by <br> to handle line breaks
        const lines = html.split(/<br\s*\/?>/i);
        
        // Process each line separately
        const processedLines = lines.map(line => {
            const words = line.trim().split(/\s+/);
            return words.map((word, index) => {
                // Add space after each word except the last one in the line
                const spacing = index < words.length - 1 ? ' ' : '';
                return `<span style="display: inline-block; opacity: 0">${word}${spacing}</span>`;
            }).join('');
        });
        
        // Rejoin with <br> tags
        heroTitle.innerHTML = processedLines.join('<br>');
        
        const spans = heroTitle.querySelectorAll('span');
        animate(spans, {
            opacity: [0, 1],
            transform: [
                isMobile ? 'translateY(10px)' : 'translateY(20px) scale(0.95)',
                isMobile ? 'translateY(0)' : 'translateY(0) scale(1)'
            ]
        }, {
            duration: getAnimationDuration(0.8),
            delay: getAnimationDelay(stagger(0.05)),
            easing: [0.22, 0.61, 0.36, 1]
        });
    }
    
    const heroSubtitle = document.querySelector('#heroSubtitle');
    if (heroSubtitle) {
        hideElement(heroSubtitle, 'translateX(-50px)');
        animate(heroSubtitle, {
            opacity: [0, 1],
            transform: ['translateX(-50px)', 'translateX(0)']
        }, {
            duration: 0.8,
            delay: 0.5
        });
    }
    
    const heroButtons = document.querySelectorAll('.hero-section .premium-button');
    heroButtons.forEach((btn, i) => {
        const transform = isMobile ? 'translateY(15px)' : 'translateY(30px) scale(0.8)';
        hideElement(btn, transform);
        animate(btn, {
            opacity: [0, 1],
            transform: [transform, isMobile ? 'translateY(0)' : 'translateY(0) scale(1)']
        }, {
            duration: getAnimationDuration(0.5),
            delay: getAnimationDelay(0.8 + (i * 0.1)),
            easing: isMobile ? [0.22, 0.61, 0.36, 1] : [0.68, -0.55, 0.265, 1.55]
        });
    });
    
    // ====================
    // 2. SCROLL-TRIGGERED ANIMATIONS
    // ====================
    
    // Core Values - Staggered Animation
    const coreValueItems = document.querySelectorAll('.core-value-item');
    coreValueItems.forEach((item, i) => {
        hideElement(item, 'translateY(40px) scale(0.8)');
        inView(item, () => {
            animate(item, {
                opacity: [0, 1],
                transform: ['translateY(40px) scale(0.8)', 'translateY(0) scale(1)']
            }, {
                duration: 0.6,
                delay: i * 0.15,
                easing: [0.68, -0.55, 0.265, 1.55]
            });
        }, { margin: "-100px" });
    });
    
    // Statistics Wrappers
    const statWrappers = document.querySelectorAll('.stat-wrapper');
    statWrappers.forEach((wrapper, i) => {
        hideElement(wrapper, 'translateY(30px)');
        inView(wrapper, () => {
            animate(wrapper, {
                opacity: [0, 1],
                transform: ['translateY(30px)', 'translateY(0)']
            }, {
                duration: 0.5,
                delay: i * 0.15,
                easing: [0.22, 0.61, 0.36, 1]
            });
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
    
    // All Cards (including promise cards)
    const allCards = document.querySelectorAll('.purpose-card, .service-card, .pillar-card, .promise-card');
    allCards.forEach((card, i) => {
        hideElement(card, 'translateY(50px) scale(0.95)');
        inView(card, () => {
            animate(card, {
                opacity: [0, 1],
                transform: ['translateY(50px) scale(0.95)', 'translateY(0) scale(1)']
            }, {
                duration: 0.6,
                delay: (i % 3) * 0.15,
                easing: [0.22, 0.61, 0.36, 1]
            });
        }, { margin: "-100px" });
    });
    
    // Timeline Items
    const timelineItems = document.querySelectorAll('.timeline-item');
    console.log(`Found ${timelineItems.length} timeline items`);
    timelineItems.forEach((item, i) => {
        // On mobile, all items come from the right. On desktop, alternate left/right
        const fromX = isMobile ? '50px' : (i % 2 === 0 ? '-100px' : '100px');
        hideElement(item, `translateX(${fromX})`);
        inView(item, () => {
            console.log(`Animating timeline item ${i}`);
            animate(item, {
                opacity: [0, 1],
                transform: [`translateX(${fromX})`, 'translateX(0)']
            }, {
                duration: getAnimationDuration(0.8),
                delay: getAnimationDelay(i * 0.1),
                easing: [0.22, 0.61, 0.36, 1]
            });
        }, { margin: "-100px" });
    });
    
    // Portfolio Items
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    console.log(`Found ${portfolioItems.length} portfolio items`);
    portfolioItems.forEach((item, i) => {
        hideElement(item, 'scale(0.8) rotate(5deg)');
        inView(item, () => {
            console.log(`Animating portfolio item ${i}`);
            animate(item, {
                opacity: [0, 1],
                transform: ['scale(0.8) rotate(5deg)', 'scale(1) rotate(0)']
            }, {
                duration: 0.5,
                delay: (i % 3) * 0.1,
                easing: [0.68, -0.55, 0.265, 1.55]
            });
        }, { margin: "-100px" });
    });
    
    // Testimonial Cards
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    console.log(`Found ${testimonialCards.length} testimonial cards`);
    testimonialCards.forEach((card, i) => {
        hideElement(card, 'perspective(1000px) rotateX(-10deg) translateY(30px)');
        inView(card, () => {
            console.log(`Animating testimonial ${i}`);
            animate(card, {
                opacity: [0, 1],
                transform: [
                    'perspective(1000px) rotateX(-10deg) translateY(30px)',
                    'perspective(1000px) rotateX(0) translateY(0)'
                ]
            }, {
                duration: 0.8,
                delay: i * 0.2,
                easing: [0.22, 0.61, 0.36, 1]
            });
        }, { margin: "-100px" });
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
    
    // Regular Cards
    const regularCards = document.querySelectorAll('.card:not(.purpose-card):not(.service-card):not(.pillar-card):not(.testimonial-card):not(.promise-card)');
    regularCards.forEach((card, i) => {
        hideElement(card, 'translateY(30px)');
        inView(card, () => {
            animate(card, {
                opacity: [0, 1],
                transform: ['translateY(30px)', 'translateY(0)']
            }, {
                duration: 0.5,
                delay: (i % 3) * 0.1
            });
        }, { margin: "-100px" });
    });
    
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
    
    // Hero Badge
    const heroBadge = document.querySelector('.hero-section .floating-badge');
    if (heroBadge) {
        hideElement(heroBadge, 'scale(0) rotate(-180deg)');
        animate(heroBadge, {
            opacity: [0, 1],
            transform: ['scale(0) rotate(-180deg)', 'scale(1) rotate(0)']
        }, {
            duration: 0.8,
            delay: 1.2,
            easing: [0.68, -0.55, 0.265, 1.55]
        });
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
    
    // Navigation Bar Animation
    const navbar = document.querySelector('#navbar');
    if (navbar) {
        hideElement(navbar, 'translateY(-100%)');
        animate(navbar, {
            opacity: [0, 1],
            transform: ['translateY(-100%)', 'translateY(0)']
        }, {
            duration: 0.6,
            delay: 0.2,
            easing: [0.22, 0.61, 0.36, 1]
        });
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
    
    // Mobile Menu Links
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
    mobileMenuLinks.forEach((link, i) => {
        link.addEventListener('click', () => {
            // Animation handled by menu toggle
        });
        // Add staggered animation when menu opens
        const mobileMenu = document.querySelector('#mobileMenu');
        if (mobileMenu) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.target.classList && !mutation.target.classList.contains('hidden')) {
                        hideElement(link, 'translateX(-50px)');
                        animate(link, {
                            opacity: [0, 1],
                            transform: ['translateX(-50px)', 'translateX(0)']
                        }, {
                            duration: 0.4,
                            delay: i * 0.05,
                            easing: [0.22, 0.61, 0.36, 1]
                        });
                    }
                });
            });
            observer.observe(mobileMenu, { attributes: true, attributeFilter: ['class'] });
        }
    });
    
    // ====================
    // 3. PARALLAX EFFECT
    // ====================
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        scroll(animate(heroSection, {
            transform: ['translateY(0)', 'translateY(-80px)']
        }), {
            target: heroSection,
            offset: ['start start', 'end start']
        });
    }
    
    // ====================
    // 4. HOVER ANIMATIONS
    // ====================
    const allButtons = document.querySelectorAll('.premium-button');
    allButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            animate(button, {
                transform: 'scale(1.05) translateY(-2px)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
            }, { duration: 0.2 });
        });
        
        button.addEventListener('mouseleave', () => {
            animate(button, {
                transform: 'scale(1) translateY(0)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }, { duration: 0.2 });
        });
    });
    
    [...allCards, ...portfolioItems].forEach(card => {
        card.addEventListener('mouseenter', () => {
            animate(card, {
                transform: 'translateY(-5px)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
            }, { duration: 0.3 });
        });
        
        card.addEventListener('mouseleave', () => {
            animate(card, {
                transform: 'translateY(0)',
                boxShadow: ''
            }, { duration: 0.3 });
        });
    });
    
    console.log('All animations initialized successfully!');
});