// PSPL Website - Animations with Native IntersectionObserver
console.log('animations-native.js loading...');

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

// Track animated elements to prevent re-animation
const animatedElements = new WeakSet();

// Create a reliable animation trigger
function setupAnimation(element, animationConfig) {
    // Skip if already animated
    if (animatedElements.has(element)) return;
    
    // Set initial state
    element.style.opacity = '0';
    if (animationConfig.transform) {
        element.style.transform = animationConfig.transform.from;
    }
    
    // Create observer for this element
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animatedElements.has(entry.target)) {
                console.log('Animating element:', entry.target.className);
                
                // Mark as animated
                animatedElements.add(entry.target);
                entry.target.setAttribute('data-animating', 'true');
                entry.target.removeAttribute('data-animate-pending');
                
                // Trigger animation after a microtask to ensure styles are applied
                setTimeout(() => {
                    const { animate } = window.Motion;
                    const animProps = {
                        opacity: [0, 1]
                    };
                    
                    if (animationConfig.transform) {
                        animProps.transform = [animationConfig.transform.from, animationConfig.transform.to];
                    }
                    
                    animate(entry.target, animProps, {
                        duration: animationConfig.duration || 0.6,
                        delay: animationConfig.delay || 0,
                        easing: animationConfig.easing || 'ease-out'
                    });
                }, 0);
                
                // Disconnect after animation triggers
                observer.disconnect();
            }
        });
    }, {
        threshold: 0.01, // Lower threshold for better detection
        rootMargin: '0px 0px -10% 0px' // Trigger slightly before fully in view
    });
    
    observer.observe(element);
}

// Fallback: Check visibility on scroll
function checkVisibleElements() {
    const allElements = document.querySelectorAll('[data-animate-pending]');
    
    allElements.forEach(element => {
        if (animatedElements.has(element)) {
            element.removeAttribute('data-animate-pending');
            return;
        }
        
        const rect = element.getBoundingClientRect();
        const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (inViewport) {
            // Get animation config from data attributes
            const config = {
                duration: parseFloat(element.dataset.animateDuration) || 0.6,
                delay: parseFloat(element.dataset.animateDelay) || 0,
                easing: element.dataset.animateEasing || 'ease-out',
                transform: element.dataset.animateTransform ? JSON.parse(element.dataset.animateTransform) : null
            };
            
            // Mark as animated
            animatedElements.add(element);
            element.setAttribute('data-animating', 'true');
            element.removeAttribute('data-animate-pending');
            
            // Animate
            const { animate } = window.Motion;
            const animProps = { opacity: [0, 1] };
            
            if (config.transform) {
                animProps.transform = [config.transform.from, config.transform.to];
            }
            
            animate(element, animProps, {
                duration: config.duration,
                delay: config.delay,
                easing: config.easing
            });
        }
    });
}

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Initializing native observer animations...');
    const { animate, scroll, stagger } = await waitForMotion();
    
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
            
            setupAnimation(counter, {
                duration: 0,
                transform: null
            });
            
            // Also setup the counter animation
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.target.textContent === '0') {
                        animate((progress) => {
                            entry.target.textContent = Math.round(progress * target).toLocaleString();
                        }, {
                            duration: 2,
                            easing: [0.22, 0.61, 0.36, 1]
                        });
                        observer.disconnect();
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(counter);
        }
    });
    
    // ====================
    // 3. SCROLL-TRIGGERED ANIMATIONS
    // ====================
    
    // Section Headings
    const sectionHeadings = document.querySelectorAll('h2:not(#heroTitle)');
    sectionHeadings.forEach(heading => {
        heading.setAttribute('data-animate-pending', '');
        heading.dataset.animateDuration = '0.6';
        heading.dataset.animateTransform = JSON.stringify({
            from: 'translateY(30px)',
            to: 'translateY(0)'
        });
        setupAnimation(heading, {
            duration: 0.6,
            easing: [0.22, 0.61, 0.36, 1],
            transform: { from: 'translateY(30px)', to: 'translateY(0)' }
        });
    });
    
    // Core Values
    const coreValueItems = document.querySelectorAll('.core-value-item');
    coreValueItems.forEach((item, i) => {
        item.setAttribute('data-animate-pending', '');
        item.dataset.animateDelay = (i * 0.1).toString();
        item.dataset.animateTransform = JSON.stringify({
            from: 'translateY(30px)',
            to: 'translateY(0)'
        });
        setupAnimation(item, {
            duration: 0.5,
            delay: i * 0.1,
            easing: 'ease-out',
            transform: { from: 'translateY(30px)', to: 'translateY(0)' }
        });
    });
    
    // Cards
    const purposeCards = document.querySelectorAll('.purpose-card');
    const serviceCards = document.querySelectorAll('.service-card');
    const pillarCards = document.querySelectorAll('.pillar-card');
    const promiseCards = document.querySelectorAll('.promise-card');
    const otherCards = document.querySelectorAll('.card:not(.purpose-card)');
    
    const allCards = [...purposeCards, ...serviceCards, ...pillarCards, ...promiseCards, ...otherCards];
    
    allCards.forEach((card, i) => {
        card.setAttribute('data-animate-pending', '');
        card.dataset.animateDelay = ((i % 3) * 0.1).toString();
        card.dataset.animateTransform = JSON.stringify({
            from: 'translateY(30px)',
            to: 'translateY(0)'
        });
        setupAnimation(card, {
            duration: 0.5,
            delay: (i % 3) * 0.1,
            easing: 'ease-out',
            transform: { from: 'translateY(30px)', to: 'translateY(0)' }
        });
    });
    
    // Timeline Items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, i) => {
        const isEven = i % 2 === 0;
        const startTransform = isMobile ? 'translateX(-30px)' : (isEven ? 'translateX(-50px)' : 'translateX(50px)');
        
        item.setAttribute('data-animate-pending', '');
        item.dataset.animateDelay = (i * 0.1).toString();
        item.dataset.animateTransform = JSON.stringify({
            from: startTransform,
            to: 'translateX(0)'
        });
        
        setupAnimation(item, {
            duration: 0.6,
            delay: i * 0.1,
            easing: [0.22, 0.61, 0.36, 1],
            transform: { from: startTransform, to: 'translateX(0)' }
        });
    });
    
    // Portfolio Items
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach((item, i) => {
        item.setAttribute('data-animate-pending', '');
        item.dataset.animateDelay = ((i % 3) * 0.1).toString();
        item.dataset.animateTransform = JSON.stringify({
            from: 'scale(0.95)',
            to: 'scale(1)'
        });
        setupAnimation(item, {
            duration: 0.5,
            delay: (i % 3) * 0.1,
            easing: 'ease-out',
            transform: { from: 'scale(0.95)', to: 'scale(1)' }
        });
    });
    
    // Testimonial Cards
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach((card, i) => {
        card.setAttribute('data-animate-pending', '');
        card.dataset.animateDelay = (i * 0.15).toString();
        card.dataset.animateTransform = JSON.stringify({
            from: 'translateY(30px)',
            to: 'translateY(0)'
        });
        setupAnimation(card, {
            duration: 0.6,
            delay: i * 0.15,
            easing: [0.22, 0.61, 0.36, 1],
            transform: { from: 'translateY(30px)', to: 'translateY(0)' }
        });
    });
    
    // Statistics
    const statWrappers = document.querySelectorAll('.stat-wrapper');
    statWrappers.forEach((wrapper, i) => {
        wrapper.setAttribute('data-animate-pending', '');
        wrapper.dataset.animateDelay = (i * 0.1).toString();
        wrapper.dataset.animateTransform = JSON.stringify({
            from: 'scale(0.9)',
            to: 'scale(1)'
        });
        setupAnimation(wrapper, {
            duration: 0.5,
            delay: i * 0.1,
            easing: [0.68, -0.55, 0.265, 1.55],
            transform: { from: 'scale(0.9)', to: 'scale(1)' }
        });
    });
    
    // Fleet Cards
    const fleetCards = document.querySelectorAll('.fleet-card');
    fleetCards.forEach((card, i) => {
        card.setAttribute('data-animate-pending', '');
        card.dataset.animateDelay = (i * 0.15).toString();
        card.dataset.animateTransform = JSON.stringify({
            from: 'translateY(40px) scale(0.9)',
            to: 'translateY(0) scale(1)'
        });
        setupAnimation(card, {
            duration: 0.6,
            delay: i * 0.15,
            easing: [0.68, -0.55, 0.265, 1.55],
            transform: { from: 'translateY(40px) scale(0.9)', to: 'translateY(0) scale(1)' }
        });
    });
    
    // Setup fallback scroll listener
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(checkVisibleElements, 100);
    });
    
    // Initial check for elements already in view
    setTimeout(checkVisibleElements, 100);
    
    console.log('All animations initialized with native observers!');
});