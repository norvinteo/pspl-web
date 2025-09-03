// PSPL Website - Reliable Scroll Animations
console.log('animations-reliable.js loading...');

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
const animated = new WeakSet();
const animationQueue = [];
let isAnimating = false;

// Get the actual scrolling element
function getScrollElement() {
    // Try document.scrollingElement first (standard)
    if (document.scrollingElement) {
        return document.scrollingElement;
    }
    // Fallback to document.documentElement
    return document.documentElement || document.body;
}

// Get reliable scroll position
function getScrollPosition() {
    const scrollEl = getScrollElement();
    return {
        y: window.pageYOffset || scrollEl.scrollTop || 0,
        x: window.pageXOffset || scrollEl.scrollLeft || 0
    };
}

// Check if element is in viewport with better calculation
function isElementVisible(element, threshold = 0.1) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    // Calculate how much of the element is visible
    const vertInView = (rect.top <= windowHeight) && ((rect.bottom - windowHeight * threshold) >= 0);
    const horInView = (rect.left <= windowWidth) && ((rect.right) >= 0);
    
    return vertInView && horInView;
}

// Process animation queue
async function processAnimationQueue() {
    if (isAnimating || animationQueue.length === 0) return;
    
    isAnimating = true;
    const Motion = window.Motion;
    if (!Motion || !Motion.animate) {
        console.error('Motion.animate not available in processAnimationQueue');
        return;
    }
    const animate = Motion.animate;
    
    while (animationQueue.length > 0) {
        const batch = animationQueue.splice(0, 5); // Process 5 at a time
        
        batch.forEach(({ element, delay }, index) => {
            setTimeout(() => {
                // Remove any forced opacity
                element.style.opacity = '';
                element.style.transform = '';
                
                // Determine animation based on element type
                const classes = element.className;
                let animProps = { opacity: [0, 1] };
                
                if (classes.includes('timeline-item')) {
                    const itemIndex = Array.from(element.parentElement.children).indexOf(element);
                    const direction = window.innerWidth > 768 
                        ? (itemIndex % 2 === 0 ? 'translateX(-50px)' : 'translateX(50px)')
                        : 'translateX(-30px)';
                    animProps.transform = [direction, 'translateX(0)'];
                } else if (classes.includes('portfolio-item')) {
                    animProps.transform = ['scale(0.95)', 'scale(1)'];
                } else if (classes.includes('stat-wrapper')) {
                    animProps.transform = ['scale(0.9)', 'scale(1)'];
                } else if (classes.includes('fleet-card')) {
                    animProps.transform = ['translateY(40px) scale(0.9)', 'translateY(0) scale(1)'];
                } else {
                    animProps.transform = ['translateY(30px)', 'translateY(0)'];
                }
                
                try {
                    if (typeof animate === 'function') {
                        animate(element, animProps, {
                            duration: 0.6,
                            easing: 'ease-out'
                        });
                    } else {
                        console.error('animate is not a function:', animate);
                    }
                } catch (e) {
                    console.error('Animation error:', e);
                }
            }, delay + (index * 100));
        });
        
        // Wait for batch to start
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    isAnimating = false;
}

// Check and queue animations
function checkElements() {
    const scrollPos = getScrollPosition();
    console.log(`Checking elements at scroll position: ${scrollPos.y}`);
    
    // All animatable selectors
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
    
    let foundNew = 0;
    
    selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            if (!animated.has(element) && isElementVisible(element)) {
                animated.add(element);
                animationQueue.push({
                    element,
                    delay: (foundNew % 3) * 50 // Stagger by groups of 3
                });
                foundNew++;
            }
        });
    });
    
    if (foundNew > 0) {
        console.log(`Queued ${foundNew} new animations`);
        processAnimationQueue();
    }
}

// Fallback visibility check using MutationObserver
function setupVisibilityFallback() {
    // Use MutationObserver as additional trigger
    const observer = new MutationObserver(() => {
        checkElements();
    });
    
    // Observe changes to style and class attributes
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section, {
            attributes: true,
            attributeFilter: ['style', 'class'],
            childList: true,
            subtree: true
        });
    });
}

// Initialize counter animation
function animateCounter(counter, target) {
    const duration = 2000;
    const startTime = performance.now();
    
    function updateCounter() {
        const currentTime = performance.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOutQuart * target);
        
        counter.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            counter.textContent = target.toLocaleString();
        }
    }
    
    updateCounter();
}

// Initialize when ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Initializing reliable scroll animations...');
    const Motion = await waitForMotion();
    console.log('Motion object:', Motion);
    console.log('Motion properties:', Object.keys(Motion || {}));
    
    // Motion.animate is the correct function
    if (!Motion || !Motion.animate) {
        console.error('Motion.animate not found!', Motion);
        return;
    }
    const animate = Motion.animate;
    
    // Check for reduced motion
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) {
        console.log('Animations disabled - reduced motion preferred');
        return;
    }
    
    // Log scroll element info
    const scrollEl = getScrollElement();
    console.log('Scroll element:', scrollEl.tagName, 'ScrollHeight:', scrollEl.scrollHeight);
    
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
    const heroElements = {
        title: document.querySelector('#heroTitle'),
        subtitle: document.querySelector('#heroSubtitle'),
        value: document.querySelector('#heroValue'),
        buttons: document.querySelector('#heroButtons')
    };
    
    if (typeof animate === 'function') {
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
    } else {
        console.error('animate function not available for hero animations');
    }
    
    // Setup counters
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target || counter.getAttribute('data-target'));
                if (target && !counter.dataset.animated) {
                    counter.dataset.animated = 'true';
                    animateCounter(counter, target);
                }
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target || counter.getAttribute('data-target'));
        if (target && !isNaN(target)) {
            counter.textContent = '0';
            counter.dataset.target = target;
            counterObserver.observe(counter);
        }
    });
    
    // Multiple scroll event listeners for reliability
    let scrollTimeout;
    const handleScroll = () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(checkElements, 50);
    };
    
    // Listen to multiple scroll sources
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    scrollEl.addEventListener('scroll', handleScroll, { passive: true });
    
    // Also listen to wheel events as backup
    window.addEventListener('wheel', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(checkElements, 100);
    }, { passive: true });
    
    // Resize handler
    window.addEventListener('resize', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(checkElements, 100);
    });
    
    // Setup additional fallbacks
    setupVisibilityFallback();
    
    // Initial checks with multiple attempts
    setTimeout(checkElements, 100);
    setTimeout(checkElements, 500);
    setTimeout(checkElements, 1000);
    
    // Force check on page load
    window.addEventListener('load', () => {
        console.log('Page fully loaded, checking elements...');
        checkElements();
        
        // One more check after images load
        setTimeout(checkElements, 500);
    });
    
    // Periodically check as ultimate fallback (every 2 seconds for first 10 seconds)
    let periodicCount = 0;
    const periodicCheck = setInterval(() => {
        checkElements();
        periodicCount++;
        if (periodicCount >= 5) {
            clearInterval(periodicCheck);
        }
    }, 2000);
    
    console.log('Reliable scroll animations ready!');
});