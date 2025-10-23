// ===================================
// PSPL Encyclopedia Page JavaScript
// Advanced search and filtering
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Encyclopedia styles
    const encyclopediaStyles = `
        <style>
        .search-interface {
            background: white;
            padding: var(--space-8);
            border-radius: var(--radius-xl);
            box-shadow: var(--shadow-lg);
            margin-bottom: var(--space-8);
        }
        
        .search-bar-container {
            position: relative;
            max-width: 600px;
            margin: 0 auto;
        }
        
        .marble-search {
            width: 100%;
            padding: var(--space-4) var(--space-6);
            padding-right: 60px;
            border: 2px solid var(--color-carrara-grey);
            border-radius: var(--radius-lg);
            font-size: var(--text-lg);
            transition: all var(--transition-base);
        }
        
        .marble-search:focus {
            outline: none;
            border-color: var(--color-coral);
            box-shadow: 0 0 0 3px rgba(200, 84, 80, 0.1);
        }
        
        .search-btn {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: var(--color-coral);
            border: none;
            padding: var(--space-2) var(--space-3);
            border-radius: var(--radius-md);
            cursor: pointer;
            font-size: var(--text-lg);
            transition: background var(--transition-base);
        }
        
        .search-btn:hover {
            background: var(--color-luxury-gold);
        }
        
        .search-filters {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: var(--space-4);
            max-width: 800px;
            margin: 0 auto;
        }
        
        .filter-group {
            display: flex;
            flex-direction: column;
            gap: var(--space-2);
        }
        
        .filter-group label {
            font-weight: var(--font-weight-semibold);
            color: var(--color-corporate-charcoal);
            font-size: var(--text-sm);
        }
        
        .filter-select {
            padding: var(--space-2) var(--space-3);
            border: 1px solid var(--color-carrara-grey);
            border-radius: var(--radius-md);
            background: white;
            font-size: var(--text-sm);
            transition: border-color var(--transition-base);
        }
        
        .filter-select:focus {
            outline: none;
            border-color: var(--color-coral);
        }
        
        .marble-category-card {
            background: white;
            padding: var(--space-6);
            border-radius: var(--radius-xl);
            box-shadow: var(--shadow-md);
            text-align: center;
            transition: all var(--transition-base);
            border: 1px solid var(--color-carrara-grey);
        }
        
        .marble-category-card:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-xl);
        }
        
        .category-icon {
            font-size: 3rem;
            margin-bottom: var(--space-4);
            display: block;
        }
        
        .marble-category-card h3 {
            color: var(--color-coral);
            margin-bottom: var(--space-3);
        }
        
        .marble-list {
            list-style: none;
            padding: 0;
            margin: var(--space-4) 0;
            text-align: left;
        }
        
        .marble-list li {
            padding: var(--space-1) 0;
            color: var(--color-corporate-charcoal);
            font-size: var(--text-sm);
        }
        
        .marble-list li::before {
            content: '💎';
            margin-right: var(--space-2);
        }
        
        .marble-section {
            margin-bottom: var(--space-12);
        }
        
        .section-title {
            color: var(--color-coral);
            font-size: var(--text-2xl);
            margin-bottom: var(--space-6);
            padding-bottom: var(--space-3);
            border-bottom: 2px solid var(--color-carrara-grey);
        }
        
        .marble-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: var(--space-6);
        }
        
        .marble-card {
            background: white;
            border-radius: var(--radius-xl);
            overflow: hidden;
            box-shadow: var(--shadow-md);
            transition: all var(--transition-base);
            border: 1px solid var(--color-carrara-grey);
        }
        
        .marble-card:hover {
            transform: translateY(-6px);
            box-shadow: var(--shadow-xl);
        }
        
        .marble-image {
            position: relative;
            height: 200px;
            overflow: hidden;
        }
        
        .marble-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform var(--transition-slow);
        }
        
        .marble-card:hover .marble-image img {
            transform: scale(1.1);
        }
        
        .marble-rating {
            position: absolute;
            top: var(--space-3);
            right: var(--space-3);
            background: rgba(255, 255, 255, 0.95);
            padding: var(--space-2);
            border-radius: var(--radius-md);
            text-align: center;
        }
        
        .corporate-rating {
            color: var(--color-luxury-gold);
            font-size: var(--text-sm);
            display: block;
        }
        
        .rating-label {
            font-size: var(--text-xs);
            color: var(--color-corporate-charcoal);
            font-weight: var(--font-weight-semibold);
        }
        
        .marble-info {
            padding: var(--space-6);
        }
        
        .marble-info h4 {
            color: var(--color-coral);
            margin-bottom: var(--space-2);
            font-size: var(--text-lg);
        }
        
        .marble-origin {
            color: var(--color-trust-blue);
            font-size: var(--text-sm);
            font-weight: var(--font-weight-medium);
            margin-bottom: var(--space-3);
        }
        
        .marble-specs {
            display: flex;
            gap: var(--space-4);
            margin-bottom: var(--space-3);
            flex-wrap: wrap;
        }
        
        .spec {
            font-size: var(--text-xs);
            color: var(--color-corporate-charcoal);
            background: var(--color-carrara-grey);
            padding: var(--space-1) var(--space-2);
            border-radius: var(--radius-sm);
        }
        
        .marble-tags {
            display: flex;
            gap: var(--space-2);
            margin-bottom: var(--space-4);
            flex-wrap: wrap;
        }
        
        .marble-description {
            font-size: var(--text-sm);
            line-height: 1.6;
            color: rgba(26, 26, 26, 0.8);
            margin-bottom: var(--space-4);
        }
        
        .marble-actions {
            display: flex;
            gap: var(--space-3);
            justify-content: space-between;
        }
        
        .tools-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: var(--space-6);
        }
        
        .tool-card {
            background: white;
            padding: var(--space-6);
            border-radius: var(--radius-xl);
            text-align: center;
            box-shadow: var(--shadow-md);
            border: 1px solid var(--color-carrara-grey);
            transition: all var(--transition-base);
        }
        
        .tool-card:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-lg);
        }
        
        .tool-icon {
            font-size: 2.5rem;
            margin-bottom: var(--space-4);
            display: block;
        }
        
        .tool-card h4 {
            color: var(--color-coral);
            margin-bottom: var(--space-3);
        }
        
        .resource-card {
            background: white;
            padding: var(--space-8);
            border-radius: var(--radius-xl);
            box-shadow: var(--shadow-md);
            text-align: center;
            transition: all var(--transition-base);
            border: 1px solid var(--color-carrara-grey);
        }
        
        .resource-card:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-xl);
        }
        
        .resource-icon {
            font-size: 3rem;
            margin-bottom: var(--space-4);
            display: block;
        }
        
        .resource-card h3 {
            color: var(--color-coral);
            margin-bottom: var(--space-4);
        }
        
        .resource-list {
            list-style: none;
            padding: 0;
            margin: var(--space-4) 0;
            text-align: left;
        }
        
        .resource-list li {
            padding: var(--space-1) 0;
            color: var(--color-corporate-charcoal);
            font-size: var(--text-sm);
        }
        
        .resource-list li::before {
            content: '📝';
            margin-right: var(--space-2);
        }
        
        .marble-card.hidden {
            display: none;
        }
        
        @media (max-width: 767px) {
            .search-filters {
                grid-template-columns: 1fr;
            }
            
            .marble-actions {
                flex-direction: column;
            }
            
            .marble-specs {
                flex-direction: column;
                gap: var(--space-2);
            }
        }
        </style>
    `;
    
    // Inject encyclopedia styles
    document.head.insertAdjacentHTML('beforeend', encyclopediaStyles);
    
    // Search functionality
    const searchInput = document.getElementById('marbleSearch');
    const filterSelects = document.querySelectorAll('.filter-select');
    const marbleCards = document.querySelectorAll('.marble-card');
    
    // Search function
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const filters = {};
        
        // Get all filter values
        filterSelects.forEach(select => {
            const filterType = select.getAttribute('data-filter');
            filters[filterType] = select.value;
        });
        
        marbleCards.forEach(card => {
            let visible = true;
            
            // Check search term
            if (searchTerm) {
                const title = card.querySelector('h4').textContent.toLowerCase();
                const description = card.querySelector('.marble-description').textContent.toLowerCase();
                const origin = card.querySelector('.marble-origin').textContent.toLowerCase();
                
                if (!title.includes(searchTerm) && 
                    !description.includes(searchTerm) && 
                    !origin.includes(searchTerm)) {
                    visible = false;
                }
            }
            
            // Check filters
            Object.keys(filters).forEach(filterType => {
                if (filters[filterType] && visible) {
                    const cardValue = card.getAttribute(`data-${filterType}`);
                    if (cardValue !== filters[filterType]) {
                        visible = false;
                    }
                }
            });
            
            // Show/hide card with animation
            if (visible) {
                card.classList.remove('hidden');
                if (typeof gsap !== 'undefined') {
                    gsap.fromTo(card, {
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
                    gsap.to(card, {
                        opacity: 0,
                        scale: 0.8,
                        duration: 0.3,
                        ease: "power2.in",
                        onComplete: () => {
                            card.classList.add('hidden');
                        }
                    });
                } else {
                    card.classList.add('hidden');
                }
            }
        });
    }
    
    // Add search event listeners
    searchInput.addEventListener('input', performSearch);
    filterSelects.forEach(select => {
        select.addEventListener('change', performSearch);
    });
    
    // Interactive tools functionality
    const toolCards = document.querySelectorAll('.tool-card');
    toolCards.forEach(card => {
        const button = card.querySelector('button');
        button.addEventListener('click', function() {
            const toolType = card.querySelector('h4').textContent;
            console.log('Tool activated:', toolType);
            
            // Placeholder functionality - would integrate with actual tools
            switch(toolType) {
                case 'Marble Identifier':
                    alert('Photo upload feature would be implemented here');
                    break;
                case 'Comparison Tool':
                    alert('Marble comparison interface would open here');
                    break;
                case 'Cost Calculator':
                    alert('Cost calculator form would open here');
                    break;
                case 'Maintenance Schedule':
                    alert('Maintenance schedule generator would open here');
                    break;
            }
        });
    });
    
    // GSAP animations for encyclopedia
    if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
        gsap.registerPlugin(ScrollTrigger);
        
        // Search interface animation
        gsap.fromTo('.search-interface', {
            opacity: 0,
            y: 50
        }, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out"
        });
        
        // Category cards stagger animation
        gsap.fromTo('.marble-category-card', {
            opacity: 0,
            y: 50,
            scale: 0.9
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.marble-category-card',
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
        
        // Marble cards animation
        gsap.utils.toArray('.marble-card').forEach((card, index) => {
            gsap.fromTo(card, {
                opacity: 0,
                y: 30,
                rotation: index % 2 === 0 ? -3 : 3
            }, {
                opacity: 1,
                y: 0,
                rotation: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 90%",
                    toggleActions: "play none none reverse"
                }
            });
        });
        
        // Tool cards animation
        gsap.fromTo('.tool-card', {
            opacity: 0,
            scale: 0.8,
            y: 20
        }, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: '.tools-grid',
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
        
        // Resource cards animation
        gsap.fromTo('.resource-card', {
            opacity: 0,
            x: (index) => index % 2 === 0 ? -50 : 50
        }, {
            opacity: 1,
            x: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.resource-card',
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    }
    
    // Enhanced hover effects for marble cards
    marbleCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const image = this.querySelector('.marble-image img');
            const rating = this.querySelector('.marble-rating');
            
            if (typeof gsap !== 'undefined') {
                gsap.to(image, {
                    scale: 1.1,
                    duration: 0.4,
                    ease: "power2.out"
                });
                gsap.to(rating, {
                    scale: 1.1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const image = this.querySelector('.marble-image img');
            const rating = this.querySelector('.marble-rating');
            
            if (typeof gsap !== 'undefined') {
                gsap.to(image, {
                    scale: 1,
                    duration: 0.4,
                    ease: "power2.out"
                });
                gsap.to(rating, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
    });
    
    // Analytics tracking for encyclopedia interactions
    function trackEncyclopediaUsage() {
        // Track search usage
        searchInput.addEventListener('input', function() {
            if (this.value.length > 2) {
                console.log('Encyclopedia search:', this.value);
                // Analytics tracking would go here
            }
        });
        
        // Track filter usage
        filterSelects.forEach(select => {
            select.addEventListener('change', function() {
                const filterType = this.getAttribute('data-filter');
                console.log('Encyclopedia filter used:', filterType, this.value);
                // Analytics tracking would go here
            });
        });
        
        // Track marble card interactions
        marbleCards.forEach(card => {
            card.addEventListener('click', function() {
                const marbleName = this.querySelector('h4').textContent;
                console.log('Marble card clicked:', marbleName);
                // Analytics tracking would go here
            });
        });
    }
    
    // Enable usage tracking
    trackEncyclopediaUsage();
    
    // Auto-suggest functionality for search
    const marbleNames = [
        'Carrara White', 'Calacatta Gold', 'Statuario', 'Emperador Dark',
        'Nero Marquina', 'Thassos White', 'Volakas', 'Crema Marfil',
        'Rosso Verona', 'Pentelicon', 'Roman Travertine', 'Afyon White'
    ];
    
    function createAutoSuggest() {
        const suggestionsList = document.createElement('div');
        suggestionsList.className = 'search-suggestions';
        suggestionsList.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 50px;
            background: white;
            border: 1px solid var(--color-carrara-grey);
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            max-height: 200px;
            overflow-y: auto;
            z-index: 1000;
            display: none;
        `;
        
        searchInput.parentNode.appendChild(suggestionsList);
        
        searchInput.addEventListener('input', function() {
            const value = this.value.toLowerCase();
            if (value.length < 2) {
                suggestionsList.style.display = 'none';
                return;
            }
            
            const matches = marbleNames.filter(name => 
                name.toLowerCase().includes(value)
            );
            
            if (matches.length > 0) {
                suggestionsList.innerHTML = matches.map(name => 
                    `<div class="suggestion-item" style="padding: var(--space-2) var(--space-3); cursor: pointer; border-bottom: 1px solid var(--color-carrara-grey);">${name}</div>`
                ).join('');
                suggestionsList.style.display = 'block';
                
                // Add click handlers for suggestions
                suggestionsList.querySelectorAll('.suggestion-item').forEach(item => {
                    item.addEventListener('click', function() {
                        searchInput.value = this.textContent;
                        suggestionsList.style.display = 'none';
                        performSearch();
                    });
                });
            } else {
                suggestionsList.style.display = 'none';
            }
        });
        
        // Hide suggestions when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !suggestionsList.contains(e.target)) {
                suggestionsList.style.display = 'none';
            }
        });
    }
    
    // Enable auto-suggest
    createAutoSuggest();
    
    console.log('Encyclopedia page initialized successfully');
});