// Industrial Theme - Main JavaScript

// Image fallback system
function setupImageFallbacks() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Skip if already has onerror handler
        if (img.onerror) return;
        
        img.onerror = function() {
            const altText = this.alt || 'IMAGE UNAVAILABLE';
            const width = this.width || 800;
            const height = this.height || 600;
            
            // Create SVG fallback
            const svg = `data:image/svg+xml;base64,${btoa(`
                <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="${width}" height="${height}" fill="#4A4A4A"/>
                    <rect x="${width*0.25}" y="${height*0.33}" width="${width*0.5}" height="${height*0.33}" fill="#1C1C1C"/>
                    <text x="${width*0.5}" y="${height*0.48}" fill="#FFB700" font-family="monospace" font-size="18" text-anchor="middle">${altText.substring(0, 30)}</text>
                    <text x="${width*0.5}" y="${height*0.53}" fill="#FFB700" font-family="monospace" font-size="14" text-anchor="middle">// IMAGE FALLBACK</text>
                </svg>
            `)}`;
            
            this.src = svg;
            this.onerror = null; // Prevent infinite loop
        };
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize image fallbacks
    setupImageFallbacks();
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.industrial-nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = menuToggle.querySelectorAll('span');
            menuToggle.classList.toggle('active');
            
            if (menuToggle.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(10px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
    
    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add Industrial Hover Effects
    const cards = document.querySelectorAll('.industrial-card, .portfolio-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add slight rotation on hover
            const randomRotation = Math.random() * 4 - 2; // -2 to 2 degrees
            this.style.transform = `translate(-6px, -6px) rotate(${randomRotation}deg)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Typewriter Effect for Mono Text
    const typewriterElements = document.querySelectorAll('.mono-text');
    
    typewriterElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.style.visibility = 'visible';
        
        let index = 0;
        const typeWriter = () => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, 50);
            }
        };
        
        // Start typewriter when element is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeWriter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(element);
    });
    
    // Number Counter Animation
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateNumber = (element) => {
        const originalText = element.textContent;
        const cleanText = originalText.replace(/[^\d]/g, ''); // Remove non-numeric characters
        const target = parseInt(cleanText);
        
        // Skip animation if target is not a valid number
        if (isNaN(target)) {
            return;
        }
        
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateNumber = () => {
            current += increment;
            if (current < target) {
                // Reconstruct the text with the animated number
                const animatedText = originalText.replace(/\d+/, Math.floor(current));
                element.textContent = animatedText;
                requestAnimationFrame(updateNumber);
            } else {
                // Restore original text
                element.textContent = originalText;
            }
        };
        
        // Store original text and start animation
        element.setAttribute('data-original', originalText);
        updateNumber();
    };
    
    // Observe stat numbers
    const numberObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                animateNumber(entry.target);
            }
        });
    });
    
    statNumbers.forEach(number => {
        numberObserver.observe(number);
    });
    
    // Industrial Loading Animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
    
    // Add random glitch effect to headers
    const glitchElements = document.querySelectorAll('.section-title, .hero-title span');
    
    glitchElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.classList.add('glitch');
            setTimeout(() => {
                this.classList.remove('glitch');
            }, 300);
        });
    });
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero-industrial');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        });
    }
    
    // Form validation (if contact form exists)
    const form = document.querySelector('.form-industrial');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            let valid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.classList.add('error');
                    valid = false;
                } else {
                    input.classList.remove('error');
                }
            });
            
            if (valid) {
                // Show success message
                const successMsg = document.createElement('div');
                successMsg.className = 'form-success';
                successMsg.textContent = 'MESSAGE SENT. WE\'LL BE IN TOUCH WITHIN 2 HOURS.';
                form.appendChild(successMsg);
                
                // Reset form
                form.reset();
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMsg.remove();
                }, 5000);
            }
        });
    }
});

// Add CSS for glitch effect dynamically
const style = document.createElement('style');
style.textContent = `
    .glitch {
        position: relative;
        animation: glitch 0.3s ease-in-out;
    }
    
    @keyframes glitch {
        0%, 100% {
            transform: translate(0);
            filter: hue-rotate(0deg);
        }
        25% {
            transform: translate(-2px, 2px);
            filter: hue-rotate(90deg);
        }
        50% {
            transform: translate(2px, -2px);
            filter: hue-rotate(180deg);
        }
        75% {
            transform: translate(-2px, -2px);
            filter: hue-rotate(270deg);
        }
    }
    
    .form-success {
        background-color: var(--safety-green, #27AE60);
        color: white;
        padding: var(--space-md, 16px);
        text-align: center;
        font-family: var(--font-display, sans-serif);
        font-size: var(--text-md, 1.125rem);
        margin-top: var(--space-lg, 32px);
        box-shadow: var(--shadow-brutal, 8px 8px 0px rgba(28, 28, 28, 0.9));
    }
    
    input.error,
    textarea.error {
        border-color: var(--warning-orange, #FF6B35) !important;
        box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.2) !important;
    }
`;
document.head.appendChild(style);