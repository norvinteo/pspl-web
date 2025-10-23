// Advanced interactions for Apple-style PSPL website

// Magnetic button effect
class MagneticButton {
    constructor(element) {
        this.element = element;
        this.boundingRect = this.element.getBoundingClientRect();
        this.magnetStrength = 0.25;
        
        this.init();
    }
    
    init() {
        this.element.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.element.addEventListener('mouseleave', this.onMouseLeave.bind(this));
        window.addEventListener('resize', () => {
            this.boundingRect = this.element.getBoundingClientRect();
        });
    }
    
    onMouseMove(e) {
        const x = e.clientX - this.boundingRect.left - this.boundingRect.width / 2;
        const y = e.clientY - this.boundingRect.top - this.boundingRect.height / 2;
        
        const moveX = x * this.magnetStrength;
        const moveY = y * this.magnetStrength;
        
        this.element.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
    
    onMouseLeave() {
        this.element.style.transform = 'translate(0, 0)';
    }
}

// Ripple effect for clicks
class RippleEffect {
    constructor() {
        this.init();
    }
    
    init() {
        document.addEventListener('click', this.createRipple.bind(this));
    }
    
    createRipple(e) {
        const button = e.target.closest('.btn, .card, .nav-link');
        if (!button) return;
        
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transform: scale(0);
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            animation: rippleAnimation 600ms ease-out;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
}

// Add ripple animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleAnimation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Tilt effect for cards
class TiltEffect {
    constructor(element) {
        this.element = element;
        this.tiltAmount = 5;
        this.perspective = 1000;
        
        this.init();
    }
    
    init() {
        this.element.style.transformStyle = 'preserve-3d';
        this.element.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
        
        this.element.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.element.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    }
    
    onMouseMove(e) {
        const rect = this.element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * this.tiltAmount;
        const rotateY = ((centerX - x) / centerX) * this.tiltAmount;
        
        this.element.style.transform = `
            perspective(${this.perspective}px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale(1.02)
        `;
    }
    
    onMouseLeave() {
        this.element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    }
}

// Smooth image loading with blur effect
class SmoothImageLoader {
    constructor() {
        this.images = document.querySelectorAll('img:not([data-loaded])');
        this.init();
    }
    
    init() {
        this.images.forEach(img => {
            // Add loading state
            img.style.filter = 'blur(20px)';
            img.style.transition = 'filter 0.8s ease-out';
            
            // Create a new image to preload
            const tempImg = new Image();
            tempImg.src = img.src;
            
            tempImg.onload = () => {
                img.style.filter = 'blur(0)';
                img.dataset.loaded = 'true';
            };
        });
    }
}

// Cursor follower
class CursorFollower {
    constructor() {
        this.cursor = null;
        this.cursorInner = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.cursorX = 0;
        this.cursorY = 0;
        this.cursorInnerX = 0;
        this.cursorInnerY = 0;
        
        this.init();
    }
    
    init() {
        // Check if device has mouse
        if (!matchMedia('(pointer:fine)').matches) return;
        
        this.createCursor();
        this.addEventListeners();
        this.animateCursor();
    }
    
    createCursor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.cursor.style.cssText = `
            position: fixed;
            width: 40px;
            height: 40px;
            border: 2px solid var(--color-coral);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: width 0.3s, height 0.3s, border-color 0.3s;
            mix-blend-mode: difference;
        `;
        
        this.cursorInner = document.createElement('div');
        this.cursorInner.className = 'custom-cursor-inner';
        this.cursorInner.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: var(--color-coral);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            transition: width 0.1s, height 0.1s;
        `;
        
        document.body.appendChild(this.cursor);
        document.body.appendChild(this.cursorInner);
        
        // Hide default cursor
        document.body.style.cursor = 'none';
    }
    
    addEventListeners() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        // Hover effects
        const hoverElements = document.querySelectorAll('a, button, .card, .portfolio-item');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.style.width = '60px';
                this.cursor.style.height = '60px';
                this.cursor.style.borderColor = 'var(--color-coral)';
            });
            
            el.addEventListener('mouseleave', () => {
                this.cursor.style.width = '40px';
                this.cursor.style.height = '40px';
                this.cursor.style.borderColor = 'var(--color-coral)';
            });
        });
    }
    
    animateCursor() {
        // Smooth follow for outer cursor
        this.cursorX += (this.mouseX - this.cursorX) * 0.1;
        this.cursorY += (this.mouseY - this.cursorY) * 0.1;
        this.cursor.style.transform = `translate(${this.cursorX - 20}px, ${this.cursorY - 20}px)`;
        
        // Quick follow for inner dot
        this.cursorInnerX += (this.mouseX - this.cursorInnerX) * 0.6;
        this.cursorInnerY += (this.mouseY - this.cursorInnerY) * 0.6;
        this.cursorInner.style.transform = `translate(${this.cursorInnerX - 4}px, ${this.cursorInnerY - 4}px)`;
        
        requestAnimationFrame(() => this.animateCursor());
    }
}

// Text split animation
class TextSplitAnimation {
    constructor(element) {
        this.element = element;
        this.text = element.textContent;
        this.init();
    }
    
    init() {
        // Split text into spans
        const chars = this.text.split('').map((char, i) => {
            if (char === ' ') return ' ';
            return `<span class="char" style="display: inline-block; animation-delay: ${i * 0.03}s">${char}</span>`;
        }).join('');
        
        this.element.innerHTML = chars;
        this.element.classList.add('text-split');
        
        // Add CSS for animation
        if (!document.querySelector('#text-split-styles')) {
            const style = document.createElement('style');
            style.id = 'text-split-styles';
            style.textContent = `
                .text-split .char {
                    opacity: 0;
                    transform: translateY(30px);
                    animation: charFadeIn 0.6s ease-out forwards;
                }
                
                @keyframes charFadeIn {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Hover image reveal
class HoverImageReveal {
    constructor(trigger, image) {
        this.trigger = trigger;
        this.image = image;
        this.init();
    }
    
    init() {
        this.image.style.cssText = `
            position: fixed;
            width: 300px;
            height: 200px;
            object-fit: cover;
            pointer-events: none;
            z-index: 100;
            opacity: 0;
            transform: scale(0.8);
            transition: opacity 0.3s, transform 0.3s;
            border-radius: var(--radius-lg);
            box-shadow: 0 20px 40px var(--color-shadow-heavy);
        `;
        
        document.body.appendChild(this.image);
        
        this.trigger.addEventListener('mouseenter', () => {
            this.image.style.opacity = '1';
            this.image.style.transform = 'scale(1)';
        });
        
        this.trigger.addEventListener('mousemove', (e) => {
            const x = e.clientX + 20;
            const y = e.clientY - 100;
            
            this.image.style.left = `${x}px`;
            this.image.style.top = `${y}px`;
        });
        
        this.trigger.addEventListener('mouseleave', () => {
            this.image.style.opacity = '0';
            this.image.style.transform = 'scale(0.8)';
        });
    }
}

// Smooth counter animation
class CounterAnimation {
    constructor(element) {
        this.element = element;
        this.target = parseInt(element.textContent.replace(/[^0-9]/g, ''));
        this.duration = 2000;
        this.start = 0;
        this.startTime = null;
        
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.element.dataset.counted) {
                    this.element.dataset.counted = 'true';
                    this.animate();
                    observer.unobserve(this.element);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(this.element);
    }
    
    animate() {
        const step = (timestamp) => {
            if (!this.startTime) this.startTime = timestamp;
            const progress = Math.min((timestamp - this.startTime) / this.duration, 1);
            
            const current = Math.floor(this.easeOutQuart(progress) * this.target);
            this.element.textContent = current.toLocaleString() + this.getSuffix();
            
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                this.element.textContent = this.target.toLocaleString() + this.getSuffix();
            }
        };
        
        requestAnimationFrame(step);
    }
    
    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }
    
    getSuffix() {
        const originalText = this.element.textContent;
        const match = originalText.match(/[^0-9,]+$/);
        return match ? match[0] : '';
    }
}

// Initialize all interactions
document.addEventListener('DOMContentLoaded', () => {
    // Magnetic buttons
    document.querySelectorAll('.btn').forEach(btn => {
        new MagneticButton(btn);
    });
    
    // Ripple effects
    new RippleEffect();
    
    // Tilt effects for cards
    document.querySelectorAll('.card, .portfolio-item').forEach(card => {
        new TiltEffect(card);
    });
    
    // Smooth image loading
    new SmoothImageLoader();
    
    // Custom cursor (optional - can be enabled by uncommenting)
    // new CursorFollower();
    
    // Text split animations for hero titles
    document.querySelectorAll('.hero-title').forEach(title => {
        new TextSplitAnimation(title);
    });
    
    // Counter animations
    document.querySelectorAll('.stat-number').forEach(counter => {
        new CounterAnimation(counter);
    });
    
    // Smooth link hovering
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transition = 'color 0.3s ease';
        });
    });
    
    // Form input animations
    const formInputs = document.querySelectorAll('.form-input, .form-textarea, .form-select');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('input-focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('input-focused');
            }
        });
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
    
    // Add hover sound effect (optional)
    const hoverSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBT');
    
    document.querySelectorAll('.btn, .nav-link').forEach(el => {
        el.addEventListener('mouseenter', () => {
            // Uncomment to enable sound
            // hoverSound.currentTime = 0;
            // hoverSound.play();
        });
    });
});

// Parallax for images
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    parallaxElements.forEach(el => {
        const speed = el.dataset.parallax || 0.5;
        const yPos = -(scrolled * speed);
        el.style.transform = `translateY(${yPos}px)`;
    });
});

// Smooth page transitions
class PageTransition {
    constructor() {
        this.init();
    }
    
    init() {
        // Create transition overlay
        const overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--color-white);
            z-index: 10000;
            transform: translateY(100%);
            transition: transform 0.6s cubic-bezier(0.85, 0, 0.15, 1);
        `;
        document.body.appendChild(overlay);
        
        // Intercept link clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href && !link.href.includes('#') && link.host === window.location.host) {
                e.preventDefault();
                overlay.style.transform = 'translateY(0)';
                
                setTimeout(() => {
                    window.location.href = link.href;
                }, 600);
            }
        });
        
        // Animate in on page load
        window.addEventListener('load', () => {
            overlay.style.transform = 'translateY(-100%)';
            setTimeout(() => {
                overlay.style.transform = 'translateY(100%)';
            }, 600);
        });
    }
}

// Initialize page transitions
new PageTransition();