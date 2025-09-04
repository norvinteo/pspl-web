// Simple animation trigger - Just 30 lines, no dependencies

// Create observer for scroll animations
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // Optional: stop observing after animation
                // observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: '0px 0px -50px 0px' // Start slightly before fully in view
    }
);

// Observe all elements that should animate
document.addEventListener('DOMContentLoaded', () => {
    // DISABLED: Headers don't need animations/hover effects
    // document.querySelectorAll('h2:not(#heroTitle)').forEach(el => {
    //     el.classList.add('animate-on-scroll');
    //     observer.observe(el);
    // });
    
    // Temporarily comment out card animations to fix hover issues
    // document.querySelectorAll('.purpose-card, .service-card, .pillar-card, .promise-card, .card:not(.purpose-card)').forEach(el => {
    //     el.classList.add('animate-on-scroll');
    //     observer.observe(el);
    // });
    
    document.querySelectorAll('.timeline-item:nth-child(odd)').forEach(el => {
        el.classList.add('animate-on-scroll', 'slide-left');
        observer.observe(el);
    });
    
    document.querySelectorAll('.timeline-item:nth-child(even)').forEach(el => {
        el.classList.add('animate-on-scroll', 'slide-right');
        observer.observe(el);
    });
    
    // Temporarily comment out to fix hover issues
    // document.querySelectorAll('.portfolio-item, .stat-wrapper, .fleet-card').forEach(el => {
    //     el.classList.add('animate-on-scroll', 'scale');
    //     observer.observe(el);
    // });
    
    // document.querySelectorAll('.testimonial-card, .core-value-item').forEach(el => {
    //     el.classList.add('animate-on-scroll');
    //     observer.observe(el);
    // });
});

// Simple counter animation
document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.counter');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.counted) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target || counter.textContent);
                
                if (target && !isNaN(target)) {
                    counter.dataset.counted = 'true';
                    counter.textContent = '0';
                    
                    let current = 0;
                    const increment = target / 50;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            counter.textContent = target.toLocaleString();
                            clearInterval(timer);
                        } else {
                            counter.textContent = Math.floor(current).toLocaleString();
                        }
                    }, 30);
                }
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
});