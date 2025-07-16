// ===================================
// PSPL Timeline Animation
// Interactive Heritage Timeline
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Timeline styles
    const timelineStyles = `
        <style>
        .timeline {
            position: relative;
            max-width: 1000px;
            margin: 0 auto;
            padding: var(--space-8) 0;
        }
        
        .timeline::before {
            content: '';
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 4px;
            height: 100%;
            background: linear-gradient(to bottom, var(--color-coral), var(--color-luxury-gold));
            border-radius: var(--radius-full);
        }
        
        .timeline-item {
            position: relative;
            margin: var(--space-12) 0;
            opacity: 0;
            transform: translateY(30px);
        }
        
        .timeline-item:nth-child(odd) {
            text-align: right;
            padding-right: 60%;
        }
        
        .timeline-item:nth-child(even) {
            text-align: left;
            padding-left: 60%;
        }
        
        .timeline-year {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 4px solid var(--color-coral);
            border-radius: var(--radius-full);
            width: 80px;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: var(--font-weight-bold);
            font-size: var(--text-lg);
            color: var(--color-coral);
            box-shadow: var(--shadow-lg);
            z-index: 2;
        }
        
        .timeline-content {
            background: white;
            padding: var(--space-6);
            border-radius: var(--radius-xl);
            box-shadow: var(--shadow-md);
            position: relative;
            border: 1px solid var(--color-carrara-grey);
        }
        
        .timeline-content h3 {
            margin-bottom: var(--space-2);
            font-size: var(--text-xl);
        }
        
        .timeline-content h4 {
            margin-bottom: var(--space-3);
            color: var(--color-corporate-charcoal);
            font-size: var(--text-lg);
        }
        
        .timeline-content p {
            color: rgba(26, 26, 26, 0.8);
            line-height: 1.6;
            margin-bottom: 0;
        }
        
        /* Arrow pointing to timeline */
        .timeline-item:nth-child(odd) .timeline-content::after {
            content: '';
            position: absolute;
            top: 50%;
            right: -15px;
            transform: translateY(-50%);
            width: 0;
            height: 0;
            border: 15px solid transparent;
            border-left-color: white;
        }
        
        .timeline-item:nth-child(even) .timeline-content::after {
            content: '';
            position: absolute;
            top: 50%;
            left: -15px;
            transform: translateY(-50%);
            width: 0;
            height: 0;
            border: 15px solid transparent;
            border-right-color: white;
        }
        
        /* Mobile responsive */
        @media (max-width: 767px) {
            .timeline::before {
                left: 30px;
                transform: none;
            }
            
            .timeline-item {
                text-align: left !important;
                padding-left: 80px !important;
                padding-right: 0 !important;
            }
            
            .timeline-year {
                left: 30px !important;
                transform: translateY(-50%) !important;
                width: 60px;
                height: 60px;
                font-size: var(--text-base);
            }
            
            .timeline-item .timeline-content::after {
                top: 50% !important;
                left: -15px !important;
                right: auto !important;
                border: 15px solid transparent !important;
                border-right-color: white !important;
                border-left-color: transparent !important;
            }
        }
        </style>
    `;
    
    // Inject timeline styles
    document.head.insertAdjacentHTML('beforeend', timelineStyles);
    
    // Timeline animation with GSAP
    if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
        gsap.registerPlugin(ScrollTrigger);
        
        // Animate timeline items
        gsap.utils.toArray('.timeline-item').forEach((item, index) => {
            gsap.fromTo(item, {
                opacity: 0,
                y: 50,
                scale: 0.9
            }, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%",
                    end: "bottom 15%",
                    toggleActions: "play none none reverse"
                }
            });
            
            // Animate the year badge separately for extra effect
            const yearBadge = item.querySelector('.timeline-year');
            if (yearBadge) {
                gsap.fromTo(yearBadge, {
                    scale: 0,
                    rotation: -180
                }, {
                    scale: 1,
                    rotation: 0,
                    duration: 0.6,
                    ease: "back.out(1.7)",
                    delay: 0.2,
                    scrollTrigger: {
                        trigger: item,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                });
            }
        });
        
        // Animate the timeline line
        const timelineLine = document.querySelector('.timeline::before');
        if (timelineLine) {
            gsap.fromTo('.timeline', {
                '--timeline-height': '0%'
            }, {
                '--timeline-height': '100%',
                duration: 2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: '.timeline',
                    start: "top 80%",
                    end: "bottom 20%",
                    scrub: 1
                }
            });
        }
    }
    
    // Add hover effects to timeline items
    document.querySelectorAll('.timeline-item').forEach(item => {
        const content = item.querySelector('.timeline-content');
        const year = item.querySelector('.timeline-year');
        
        if (content && year) {
            item.addEventListener('mouseenter', function() {
                if (typeof gsap !== 'undefined') {
                    gsap.to(content, {
                        scale: 1.02,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                    gsap.to(year, {
                        scale: 1.1,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });
            
            item.addEventListener('mouseleave', function() {
                if (typeof gsap !== 'undefined') {
                    gsap.to(content, {
                        scale: 1,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                    gsap.to(year, {
                        scale: 1,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });
        }
    });
    
    console.log('Timeline animations initialized');
});