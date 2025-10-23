// ===================================
// PSPL Portfolio Page JavaScript
// Advanced filtering and interactions
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Portfolio filter styles
    const portfolioStyles = `
        <style>
        .portfolio-filters {
            display: flex;
            justify-content: center;
            margin-bottom: var(--space-8);
        }
        
        .filter-group {
            display: flex;
            gap: var(--space-2);
            flex-wrap: wrap;
            justify-content: center;
        }
        
        .filter-btn {
            padding: var(--space-3) var(--space-6);
            border: 2px solid var(--color-carrara-grey);
            background: white;
            color: var(--color-corporate-charcoal);
            border-radius: var(--radius-lg);
            font-weight: var(--font-weight-medium);
            font-size: var(--text-sm);
            cursor: pointer;
            transition: all var(--transition-base);
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        .filter-btn:hover {
            border-color: var(--color-coral);
            color: var(--color-coral);
            transform: translateY(-2px);
        }
        
        .filter-btn.active {
            background: var(--color-coral);
            border-color: var(--color-coral);
            color: white;
            box-shadow: var(--shadow-md);
        }
        
        .portfolio-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(200, 84, 80, 0.9), rgba(201, 169, 97, 0.9));
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity var(--transition-base);
        }
        
        .portfolio-item:hover .portfolio-overlay {
            opacity: 1;
        }
        
        .portfolio-overlay__content {
            text-align: center;
            color: white;
            padding: var(--space-4);
        }
        
        .portfolio-overlay__content h4 {
            font-size: var(--text-xl);
            font-weight: var(--font-weight-bold);
            margin-bottom: var(--space-2);
            color: white;
        }
        
        .portfolio-overlay__content p {
            font-size: var(--text-base);
            margin-bottom: var(--space-3);
            opacity: 0.9;
        }
        
        .portfolio-value {
            display: inline-block;
            background: rgba(255, 255, 255, 0.2);
            padding: var(--space-1) var(--space-3);
            border-radius: var(--radius-md);
            font-size: var(--text-sm);
            font-weight: var(--font-weight-semibold);
        }
        
        .portfolio-tags {
            display: flex;
            gap: var(--space-2);
            flex-wrap: wrap;
            margin-bottom: var(--space-3);
        }
        
        .tag {
            padding: var(--space-1) var(--space-2);
            border-radius: var(--radius-sm);
            font-size: var(--text-xs);
            font-weight: var(--font-weight-medium);
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        .tag--emergency { background: #FFE5E5; color: #C53030; }
        .tag--heritage { background: #E6F3FF; color: #2B6CB0; }
        .tag--premium { background: #FFF5CC; color: #C69320; }
        .tag--maintenance { background: #E6FFFA; color: #00A896; }
        .tag--corporate { background: #F0F4F8; color: #4A5568; }
        .tag--hotel { background: #FAF5FF; color: #805AD5; }
        .tag--government { background: #F0FFF4; color: #22543D; }
        .tag--residential { background: #FFF0F5; color: #B83280; }
        .tag--scale { background: #EDF2F7; color: #2D3748; }
        .tag--marble { background: #F7FAFC; color: #1A202C; }
        .tag--traffic { background: #FFFAF0; color: #C05621; }
        .tag--innovation { background: #E0F2FE; color: #0C4A6E; }
        .tag--retail { background: #FEF3C7; color: #92400E; }
        .tag--ongoing { background: #ECFDF5; color: #059669; }
        .tag--complex { background: #FDF2F8; color: #BE185D; }
        .tag--precision { background: #F1F5F9; color: #334155; }
        .tag--luxury { background: #FDF4FF; color: #A21CAF; }
        .tag--comprehensive { background: #F0F9FF; color: #0369A1; }
        .tag--cultural { background: #F5F3FF; color: #6D28D9; }
        
        .portfolio-stats {
            display: grid;
            grid-template-columns: 1fr;
            gap: var(--space-2);
            margin-bottom: var(--space-4);
            padding: var(--space-3);
            background: var(--color-carrara-grey);
            border-radius: var(--radius-md);
        }
        
        .stat-item {
            font-size: var(--text-xs);
            color: var(--color-corporate-charcoal);
        }
        
        .stat-item strong {
            color: var(--color-coral);
            font-weight: var(--font-weight-semibold);
        }
        
        @media (max-width: 767px) {
            .filter-group {
                gap: var(--space-1);
            }
            
            .filter-btn {
                padding: var(--space-2) var(--space-4);
                font-size: var(--text-xs);
            }
            
            .portfolio-tags {
                gap: var(--space-1);
            }
            
            .tag {
                font-size: 10px;
                padding: 2px 6px;
            }
        }
        </style>
    `;
    
    // Inject portfolio styles
    document.head.insertAdjacentHTML('beforeend', portfolioStyles);
    
    // Portfolio filtering functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter portfolio items
            portfolioItems.forEach(item => {
                if (filter === 'all') {
                    item.style.display = 'block';
                    if (typeof gsap !== 'undefined') {
                        gsap.fromTo(item, {
                            opacity: 0,
                            scale: 0.8
                        }, {
                            opacity: 1,
                            scale: 1,
                            duration: 0.5,
                            ease: "power2.out"
                        });
                    }
                } else {
                    const categories = item.getAttribute('data-category') || '';
                    if (categories.includes(filter)) {
                        item.style.display = 'block';
                        if (typeof gsap !== 'undefined') {
                            gsap.fromTo(item, {
                                opacity: 0,
                                scale: 0.8
                            }, {
                                opacity: 1,
                                scale: 1,
                                duration: 0.5,
                                ease: "power2.out"
                            });
                        }
                    } else {
                        if (typeof gsap !== 'undefined') {
                            gsap.to(item, {
                                opacity: 0,
                                scale: 0.8,
                                duration: 0.3,
                                ease: "power2.in",
                                onComplete: () => {
                                    item.style.display = 'none';
                                }
                            });
                        } else {
                            item.style.display = 'none';
                        }
                    }
                }
            });
        });
    });
    
    // Enhanced hover effects for portfolio items
    portfolioItems.forEach(item => {
        const image = item.querySelector('.portfolio-item__image img');
        const overlay = item.querySelector('.portfolio-overlay');
        
        item.addEventListener('mouseenter', function() {
            if (typeof gsap !== 'undefined') {
                gsap.to(image, {
                    scale: 1.1,
                    duration: 0.4,
                    ease: "power2.out"
                });
                gsap.to(overlay, {
                    opacity: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (typeof gsap !== 'undefined') {
                gsap.to(image, {
                    scale: 1,
                    duration: 0.4,
                    ease: "power2.out"
                });
                gsap.to(overlay, {
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
    });
    
    // Advanced GSAP animations for portfolio
    if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
        gsap.registerPlugin(ScrollTrigger);
        
        // Staggered portfolio grid animation
        gsap.fromTo('.portfolio-item', {
            opacity: 0,
            y: 50,
            scale: 0.9
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: {
                amount: 1.2,
                grid: "auto",
                from: "start"
            },
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.portfolio-grid',
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            }
        });
        
        // Filter buttons animation
        gsap.fromTo('.filter-btn', {
            opacity: 0,
            y: 20
        }, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.portfolio-filters',
                start: "top 90%",
                toggleActions: "play none none reverse"
            }
        });
        
        // Success stories cards animation
        gsap.utils.toArray('.card').forEach((card, index) => {
            gsap.fromTo(card, {
                opacity: 0,
                x: index % 2 === 0 ? -50 : 50,
                rotation: index % 2 === 0 ? -5 : 5
            }, {
                opacity: 1,
                x: 0,
                rotation: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });
        });
    }
    
    // Portfolio search functionality (if needed)
    function createSearchFunctionality() {
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search projects...';
        searchInput.classList.add('portfolio-search');
        
        const searchStyles = `
            <style>
            .portfolio-search {
                width: 100%;
                max-width: 400px;
                padding: var(--space-3) var(--space-4);
                border: 2px solid var(--color-carrara-grey);
                border-radius: var(--radius-lg);
                font-size: var(--text-base);
                margin-bottom: var(--space-6);
                transition: border-color var(--transition-base);
            }
            
            .portfolio-search:focus {
                outline: none;
                border-color: var(--color-coral);
                box-shadow: 0 0 0 3px rgba(200, 84, 80, 0.1);
            }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', searchStyles);
        
        // Insert search input before filters
        const filtersSection = document.querySelector('.portfolio-filters');
        filtersSection.parentNode.insertBefore(searchInput, filtersSection);
        
        // Search functionality
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            portfolioItems.forEach(item => {
                const title = item.querySelector('.portfolio-item__title').textContent.toLowerCase();
                const description = item.querySelector('.portfolio-item__description').textContent.toLowerCase();
                const tags = Array.from(item.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase()).join(' ');
                
                if (title.includes(searchTerm) || description.includes(searchTerm) || tags.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
    
    // Uncomment to enable search functionality
    // createSearchFunctionality();
    
    // Portfolio performance tracking
    function trackPortfolioInteractions() {
        // Track filter usage
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                console.log('Portfolio filter used:', filter);
                // Analytics tracking would go here
            });
        });
        
        // Track project clicks
        portfolioItems.forEach(item => {
            item.addEventListener('click', function() {
                const projectTitle = this.querySelector('.portfolio-item__title').textContent;
                console.log('Portfolio project viewed:', projectTitle);
                // Analytics tracking would go here
            });
        });
        
        // Track hover interactions
        portfolioItems.forEach(item => {
            let hoverStartTime;
            
            item.addEventListener('mouseenter', function() {
                hoverStartTime = Date.now();
            });
            
            item.addEventListener('mouseleave', function() {
                const hoverDuration = Date.now() - hoverStartTime;
                if (hoverDuration > 1000) { // Only track significant hovers
                    const projectTitle = this.querySelector('.portfolio-item__title').textContent;
                    console.log('Portfolio project hovered:', projectTitle, 'Duration:', hoverDuration + 'ms');
                    // Analytics tracking would go here
                }
            });
        });
    }
    
    // Enable interaction tracking
    trackPortfolioInteractions();
    
    // Lazy loading for portfolio images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                    }
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px'
        });
        
        document.querySelectorAll('.portfolio-item img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    console.log('Portfolio page initialized successfully');
});