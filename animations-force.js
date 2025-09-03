// PSPL Website - Force Animations (Debug)
console.log('animations-force.js loading...');

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

// Initialize when ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Initializing force animations...');
    const { animate } = await waitForMotion();
    
    // Check for reduced motion
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) {
        console.log('Animations disabled - reduced motion preferred');
        return;
    }
    
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
    
    // Force animate ALL elements after a delay
    console.log('Setting up forced animations...');
    
    const animateAll = () => {
        console.log('FORCING ALL ANIMATIONS NOW!');
        
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
        
        let totalAnimated = 0;
        
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element, index) => {
                // Make sure it starts hidden
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                
                // Animate with stagger
                setTimeout(() => {
                    animate(element, {
                        opacity: [0, 1],
                        transform: ['translateY(30px)', 'translateY(0)']
                    }, {
                        duration: 0.6,
                        easing: 'ease-out'
                    });
                }, index * 50);
                
                totalAnimated++;
            });
        });
        
        console.log(`Forced animation on ${totalAnimated} elements`);
    };
    
    // Force all animations after 2 seconds
    setTimeout(animateAll, 2000);
    
    console.log('Force animations initialized - will trigger in 2 seconds!');
});