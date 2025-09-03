// PSPL Website - Simple Scroll-Based Animations
console.log('animations-simple.js loading...');

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

// Track animated elements
const animated = new Set();

// Simple visibility check
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top < window.innerHeight &&
        rect.bottom > 0
    );
}

// Animate element
function animateElement(element, delay = 0) {
    if (animated.has(element)) return;
    
    animated.add(element);
    element.setAttribute('data-animated', 'true');
    
    const { animate } = window.Motion;
    
    // Get animation type from classes
    const classes = element.className;
    let animProps = { opacity: [0, 1] };
    let transform = 'translateY(30px)';
    
    // Special cases
    if (classes.includes('timeline-item')) {
        const index = Array.from(element.parentElement.children).indexOf(element);
        if (window.innerWidth > 768) {
            transform = index % 2 === 0 ? 'translateX(-50px)' : 'translateX(50px)';
        } else {
            transform = 'translateX(-30px)';
        }
    } else if (classes.includes('portfolio-item')) {
        transform = 'scale(0.95)';
        animProps.transform = ['scale(0.95)', 'scale(1)'];
    } else if (classes.includes('stat-wrapper')) {
        transform = 'scale(0.9)';
        animProps.transform = ['scale(0.9)', 'scale(1)'];
    } else if (classes.includes('fleet-card')) {
        transform = 'translateY(40px) scale(0.9)';
        animProps.transform = ['translateY(40px) scale(0.9)', 'translateY(0) scale(1)'];
    } else {
        animProps.transform = ['translateY(30px)', 'translateY(0)'];
    }
    
    // Apply animation
    setTimeout(() => {
        animate(element, animProps, {
            duration: 0.6,
            easing: 'ease-out'
        });
    }, delay);
}

// Check and animate visible elements
function checkElements() {
    console.log('Checking elements...', window.scrollY);
    
    // All animatable elements
    const selectors = [
        'h2:not(#heroTitle)',
        '.purpose-card',
        '.service-card',
        '.pillar-card',
        '.promise-card',
        '.card:not(.purpose-card)',
        '.timeline-item',
        '.portfolio-item',
        '.testimonial-card',
        '.core-value-item',
        '.stat-wrapper',
        '.fleet-card'
    ];
    
    let foundInView = 0;
    
    selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            if (isInViewport(element)) {
                foundInView++;
                if (!animated.has(element)) {
                    console.log('Animating:', element.className);
                    // Stagger animations for elements in same group
                    const delay = (index % 3) * 100;
                    animateElement(element, delay);
                }
            }
        });
    });
    
    console.log(`Found ${foundInView} elements in viewport`);
}

// Initialize when ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Initializing simple scroll animations...');
    const { animate } = await waitForMotion();
    
    // Check for reduced motion
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) {
        console.log('Animations disabled - reduced motion preferred');
        return;
    }
    
    // Hide elements initially
    const selectors = [
        'h2:not(#heroTitle)',
        '.purpose-card',
        '.service-card',
        '.pillar-card',
        '.promise-card',
        '.card:not(.purpose-card)',
        '.timeline-item',
        '.portfolio-item',
        '.testimonial-card',
        '.core-value-item',
        '.stat-wrapper',
        '.fleet-card'
    ];
    
    selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            element.style.opacity = '0';
            
            // Set initial transform based on type
            const classes = element.className;
            if (classes.includes('timeline-item')) {
                const index = Array.from(element.parentElement.children).indexOf(element);
                if (window.innerWidth > 768) {
                    element.style.transform = index % 2 === 0 ? 'translateX(-50px)' : 'translateX(50px)';
                } else {
                    element.style.transform = 'translateX(-30px)';
                }
            } else if (classes.includes('portfolio-item')) {
                element.style.transform = 'scale(0.95)';
            } else if (classes.includes('stat-wrapper')) {
                element.style.transform = 'scale(0.9)';
            } else if (classes.includes('fleet-card')) {
                element.style.transform = 'translateY(40px) scale(0.9)';
            } else {
                element.style.transform = 'translateY(30px)';
            }
        });
    });
    
    // Hero animations (immediate)
    const heroTitle = document.querySelector('#heroTitle');
    const heroSubtitle = document.querySelector('#heroSubtitle');
    const heroValue = document.querySelector('#heroValue');
    const heroButtons = document.querySelector('#heroButtons');
    
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
    
    // Counters
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target || counter.getAttribute('data-target'));
        if (target && !isNaN(target)) {
            counter.textContent = '0';
            counter.dataset.target = target;
        }
    });
    
    // Check on scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(checkElements, 50);
    });
    
    // Also check on resize
    window.addEventListener('resize', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(checkElements, 50);
    });
    
    // Initial check after a short delay
    setTimeout(checkElements, 100);
    
    // Force check after page fully loads
    window.addEventListener('load', () => {
        setTimeout(checkElements, 200);
    });
    
    console.log('Simple scroll animations ready!');
});