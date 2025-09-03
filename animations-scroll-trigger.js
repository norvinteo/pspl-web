// PSPL Website - Scroll Trigger Animations
console.log('animations-scroll-trigger.js loading...');

// Global animate function
let animateFn = null;

// Wait for Motion library
function waitForMotion() {
    return new Promise((resolve) => {
        const checkMotion = () => {
            if (window.Motion) {
                resolve(window.Motion);
            } else {
                setTimeout(checkMotion, 10);
            }
        };
        checkMotion();
    });
}

// Track what we've animated
const animated = new Set();

// Animate an element
function animateElement(element, delay = 0) {
    const key = element.className + element.textContent?.substring(0, 20);
    if (animated.has(key)) return;
    animated.add(key);
    
    if (!animateFn) {
        console.error('Animate function not available!');
        return;
    }
    
    // Set initial state
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    
    // Animate after delay
    setTimeout(() => {
        animateFn(element, {
            opacity: [0, 1],
            transform: ['translateY(30px)', 'translateY(0)']
        }, {
            duration: 0.6,
            easing: 'ease-out'
        });
        console.log(`Animated ${element.className}`);
    }, delay);
}

// Check scroll and animate
function onScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    const viewportHeight = window.innerHeight;
    console.log(`onScroll called: scrollY=${scrollY}, viewport=${viewportHeight}`);
    
    let animatedCount = 0;
    
    // Get all elements that should animate
    document.querySelectorAll('h2:not(#heroTitle), .purpose-card, .service-card, .pillar-card, .promise-card, .card:not(.purpose-card), .timeline-item, .portfolio-item, .testimonial-card, .core-value-item, .stat-wrapper, .fleet-card').forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + scrollY;
        
        // Check if element should be visible (scroll position is past element top minus some offset)
        if (scrollY + viewportHeight * 0.8 > elementTop) {
            const delay = (index % 5) * 50; // Stagger by groups of 5
            animateElement(element, delay);
            animatedCount++;
        }
    });
    
    console.log(`Animated ${animatedCount} elements`);
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Initializing scroll trigger animations...');
    const { animate } = await waitForMotion();
    animateFn = animate; // Store globally
    
    // Check for reduced motion
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) {
        console.log('Animations disabled - reduced motion preferred');
        return;
    }
    
    // Hide all animatable elements initially
    document.querySelectorAll('h2:not(#heroTitle), .purpose-card, .service-card, .pillar-card, .promise-card, .card:not(.purpose-card), .timeline-item, .portfolio-item, .testimonial-card, .core-value-item, .stat-wrapper, .fleet-card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
    });
    
    // Hero animations (always visible, animate immediately)
    const heroElements = {
        title: document.querySelector('#heroTitle'),
        subtitle: document.querySelector('#heroSubtitle'),
        value: document.querySelector('#heroValue'),
        buttons: document.querySelector('#heroButtons')
    };
    
    if (heroElements.title) {
        animate(heroElements.title, 
            { opacity: [0, 1], transform: ['translateY(40px)', 'translateY(0)'] },
            { duration: 0.8, easing: 'ease-out' }
        );
    }
    
    if (heroElements.subtitle) {
        animate(heroElements.subtitle,
            { opacity: [0, 1], transform: ['translateY(40px)', 'translateY(0)'] },
            { duration: 0.8, delay: 0.2, easing: 'ease-out' }
        );
    }
    
    if (heroElements.value) {
        animate(heroElements.value,
            { opacity: [0, 1], transform: ['translateY(30px)', 'translateY(0)'] },
            { duration: 0.8, delay: 0.3, easing: 'ease-out' }
        );
    }
    
    if (heroElements.buttons) {
        animate(heroElements.buttons,
            { opacity: [0, 1], transform: ['translateY(30px)', 'translateY(0)'] },
            { duration: 0.8, delay: 0.4, easing: 'ease-out' }
        );
    }
    
    // Setup scroll listener with debouncing
    let scrollTimeout;
    const handleScroll = () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(onScroll, 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Initial check for elements already in view
    console.log('Setting up initial check...');
    setTimeout(() => {
        console.log('Running initial onScroll...');
        onScroll();
    }, 500);
    
    // Force check after page fully loads
    window.addEventListener('load', () => {
        console.log('Page loaded, running onScroll...');
        setTimeout(onScroll, 100);
    });
    
    // Also force after a longer delay as fallback
    setTimeout(() => {
        console.log('Fallback onScroll after 2s...');
        onScroll();
    }, 2000);
    
    console.log('Scroll trigger animations ready!');
});