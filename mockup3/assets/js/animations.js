// Apple-style animations for PSPL website

// Navigation scroll effects
const navHeader = document.querySelector('.nav-header');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navHeader.classList.add('scrolled');
    } else {
        navHeader.classList.remove('scrolled');
    }
    
    lastScrollY = window.scrollY;
});

// Mobile menu toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

mobileMenuToggle?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animate numbers for stats
            if (entry.target.classList.contains('stat')) {
                animateStatNumber(entry.target);
            }
        }
    });
}, observerOptions);

// Observe all scroll-animated elements
document.addEventListener('DOMContentLoaded', () => {
    const scrollElements = document.querySelectorAll('.scroll-fade-up, .scroll-fade-in, .scroll-scale');
    scrollElements.forEach(el => scrollObserver.observe(el));
});

// Animate stat numbers
function animateStatNumber(statElement) {
    const numberElement = statElement.querySelector('.stat-number');
    if (!numberElement || numberElement.dataset.animated) return;
    
    numberElement.dataset.animated = 'true';
    const finalText = numberElement.textContent;
    const finalNumber = parseInt(finalText.replace(/[^0-9]/g, ''));
    const suffix = finalText.replace(/[0-9]/g, '');
    const duration = 2000; // 2 seconds
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;
    
    const counter = setInterval(() => {
        frame++;
        const progress = easeOutQuart(frame / totalFrames);
        const currentNumber = Math.round(finalNumber * progress);
        
        numberElement.textContent = currentNumber.toLocaleString() + suffix;
        
        if (frame === totalFrames) {
            clearInterval(counter);
            numberElement.textContent = finalText;
        }
    }, frameDuration);
}

// Easing function for smooth animation
function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
}

// Parallax effects for hero section
const heroImage = document.querySelector('.hero-image');
const heroContent = document.querySelector('.hero-content');

window.addEventListener('scroll', () => {
    if (!heroImage || !heroContent) return;
    
    const scrolled = window.pageYOffset;
    const windowHeight = window.innerHeight;
    
    if (scrolled < windowHeight) {
        const parallaxSpeed = 0.5;
        heroImage.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.opacity = 1 - (scrolled / windowHeight);
    }
});

// Smooth hover effects for cards
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
    card.addEventListener('mouseenter', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Client logo carousel (if needed)
function initLogoCarousel() {
    const logoContainer = document.querySelector('.client-logos');
    if (!logoContainer) return;
    
    // Clone logos for infinite scroll
    const logos = logoContainer.querySelectorAll('.client-logo');
    logos.forEach(logo => {
        const clone = logo.cloneNode(true);
        logoContainer.appendChild(clone);
    });
}

// Page load animations
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Stagger hero content animations
    const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-actions');
    heroElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.2}s`;
    });
});

// Smooth scroll to anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 100;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Image lazy loading with fade-in effect
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// Spring physics for interactive elements
class SpringAnimation {
    constructor(element, options = {}) {
        this.element = element;
        this.stiffness = options.stiffness || 0.1;
        this.damping = options.damping || 0.8;
        this.mass = options.mass || 1;
        
        this.position = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.target = { x: 0, y: 0 };
        
        this.animating = false;
    }
    
    setTarget(x, y) {
        this.target.x = x;
        this.target.y = y;
        if (!this.animating) {
            this.animate();
        }
    }
    
    animate() {
        this.animating = true;
        
        const update = () => {
            // Calculate spring force
            const dx = this.target.x - this.position.x;
            const dy = this.target.y - this.position.y;
            
            const ax = (dx * this.stiffness) / this.mass;
            const ay = (dy * this.stiffness) / this.mass;
            
            this.velocity.x += ax;
            this.velocity.y += ay;
            
            this.velocity.x *= this.damping;
            this.velocity.y *= this.damping;
            
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
            
            // Apply transform
            this.element.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
            
            // Continue animation if not at rest
            if (Math.abs(this.velocity.x) > 0.01 || Math.abs(this.velocity.y) > 0.01 ||
                Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01) {
                requestAnimationFrame(update);
            } else {
                this.animating = false;
                this.position.x = this.target.x;
                this.position.y = this.target.y;
                this.element.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
            }
        };
        
        requestAnimationFrame(update);
    }
}

// Apply spring animations to interactive elements
const interactiveElements = document.querySelectorAll('.btn, .card');
interactiveElements.forEach(element => {
    const spring = new SpringAnimation(element, {
        stiffness: 0.15,
        damping: 0.85
    });
    
    element.addEventListener('mouseenter', () => {
        spring.setTarget(0, -2);
    });
    
    element.addEventListener('mouseleave', () => {
        spring.setTarget(0, 0);
    });
});