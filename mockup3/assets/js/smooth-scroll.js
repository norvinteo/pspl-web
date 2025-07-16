// Apple-style smooth scrolling implementation

class SmoothScroll {
    constructor() {
        this.currentY = window.scrollY;
        this.targetY = window.scrollY;
        this.ease = 0.08; // Lower = smoother
        this.isScrolling = false;
        this.rafId = null;
        
        this.init();
    }
    
    init() {
        // Override default scroll behavior
        this.handleWheel = this.handleWheel.bind(this);
        this.animate = this.animate.bind(this);
        
        // Add event listeners
        window.addEventListener('wheel', this.handleWheel, { passive: false });
        window.addEventListener('touchmove', this.handleTouch.bind(this), { passive: true });
        
        // Handle keyboard navigation
        window.addEventListener('keydown', this.handleKeyboard.bind(this));
        
        // Handle click on scroll links
        this.initScrollLinks();
    }
    
    handleWheel(e) {
        e.preventDefault();
        
        // Calculate scroll distance with acceleration
        const delta = e.deltaY;
        const acceleration = Math.abs(delta) > 100 ? 2 : 1;
        
        this.targetY += delta * acceleration;
        
        // Clamp to page bounds
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        this.targetY = Math.max(0, Math.min(this.targetY, maxScroll));
        
        if (!this.isScrolling) {
            this.isScrolling = true;
            this.animate();
        }
    }
    
    handleTouch(e) {
        // Let mobile handle native touch scrolling
        // but still apply smooth animations to elements
    }
    
    handleKeyboard(e) {
        const keys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down',
            32: 'space',
            33: 'pageup',
            34: 'pagedown',
            35: 'end',
            36: 'home'
        };
        
        const key = keys[e.keyCode];
        if (!key) return;
        
        switch(key) {
            case 'up':
                this.targetY -= 100;
                break;
            case 'down':
                this.targetY += 100;
                break;
            case 'space':
                if (e.shiftKey) {
                    this.targetY -= window.innerHeight * 0.9;
                } else {
                    this.targetY += window.innerHeight * 0.9;
                }
                e.preventDefault();
                break;
            case 'pageup':
                this.targetY -= window.innerHeight * 0.9;
                break;
            case 'pagedown':
                this.targetY += window.innerHeight * 0.9;
                break;
            case 'home':
                this.targetY = 0;
                break;
            case 'end':
                this.targetY = document.body.scrollHeight - window.innerHeight;
                break;
        }
        
        // Clamp to bounds
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        this.targetY = Math.max(0, Math.min(this.targetY, maxScroll));
        
        if (!this.isScrolling) {
            this.isScrolling = true;
            this.animate();
        }
    }
    
    animate() {
        // Calculate distance to target
        const distance = this.targetY - this.currentY;
        
        // Apply easing
        this.currentY += distance * this.ease;
        
        // Apply scroll position
        window.scrollTo(0, this.currentY);
        
        // Continue animation if not at target
        if (Math.abs(distance) > 0.5) {
            this.rafId = requestAnimationFrame(this.animate);
        } else {
            this.currentY = this.targetY;
            window.scrollTo(0, this.currentY);
            this.isScrolling = false;
        }
    }
    
    initScrollLinks() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                if (!target) return;
                
                const offset = 100; // Account for fixed header
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                
                this.scrollToPosition(targetPosition);
            });
        });
    }
    
    scrollToPosition(position, duration = 1000) {
        const start = window.pageYOffset;
        const distance = position - start;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Apple-style easing curve
            const easeProgress = this.easeInOutCubic(progress);
            
            window.scrollTo(0, start + distance * easeProgress);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    easeInOutCubic(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    destroy() {
        window.removeEventListener('wheel', this.handleWheel);
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
    }
}

// Initialize smooth scroll
let smoothScroll;

document.addEventListener('DOMContentLoaded', () => {
    // Only enable on desktop
    // DISABLED: Custom smooth scrolling to allow normal browser scrolling
    // if (window.innerWidth > 768 && !('ontouchstart' in window)) {
    //     smoothScroll = new SmoothScroll();
    // }
});

// Momentum scrolling for touch devices
if ('ontouchstart' in window) {
    let touchStartY = 0;
    let touchEndY = 0;
    let touchStartTime = 0;
    let touchEndTime = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].clientY;
        touchEndTime = Date.now();
        
        const distance = touchStartY - touchEndY;
        const time = touchEndTime - touchStartTime;
        const velocity = distance / time;
        
        // Apply momentum if swipe was fast enough
        if (Math.abs(velocity) > 0.5) {
            applyMomentum(velocity);
        }
    }, { passive: true });
    
    function applyMomentum(velocity) {
        const friction = 0.95;
        let currentVelocity = velocity * 300; // Scale up
        
        const animate = () => {
            window.scrollBy(0, currentVelocity);
            currentVelocity *= friction;
            
            if (Math.abs(currentVelocity) > 0.5) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// Scroll progress indicator
class ScrollProgress {
    constructor() {
        this.createProgressBar();
        this.updateProgress();
        window.addEventListener('scroll', () => this.updateProgress());
    }
    
    createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 2px;
            background: var(--color-coral);
            z-index: var(--z-tooltip);
            transition: width 0.1s ease-out;
        `;
        document.body.appendChild(progressBar);
        this.progressBar = progressBar;
    }
    
    updateProgress() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;
        
        this.progressBar.style.width = `${progress}%`;
    }
}

// Initialize scroll progress
new ScrollProgress();

// Smooth reveal animations on scroll
class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('[data-scroll-reveal]');
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.scrollDelay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        
        this.elements.forEach(el => observer.observe(el));
    }
}

// Initialize scroll reveal
new ScrollReveal();