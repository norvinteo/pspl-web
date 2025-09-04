// Minimal JavaScript for essential functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            document.body.classList.toggle('overflow-hidden');
        });
        
        // Close mobile menu when clicking links
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
            });
        });
        
        // Close button in mobile menu
        const closeBtn = mobileMenu.querySelector('[data-close]');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
            });
        }
    }
    
    // Navigation background and color switch based on section visibility
    const navbar = document.getElementById('navbar');
    const navLogo = document.getElementById('navLogo');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactBtn = document.querySelector('.premium-button');
    const heroSection = document.getElementById('home'); // Hero section element
    
    if (navbar && heroSection) {
        // Create Intersection Observer to watch hero section
        const navbarObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // When hero section is NOT intersecting or less than 90% visible (scrolled past it)
                if (!entry.isIntersecting || entry.intersectionRatio < 0.9) {
                    // Apply white navbar styles
                    navbar.classList.add('bg-white', 'shadow-lg');
                    navbar.classList.remove('bg-transparent', 'bg-pspl-dark/95', 'backdrop-blur-lg');
                    
                    // Dark logo
                    if (navLogo) {
                        navLogo.src = 'logo.svg';
                    }
                    
                    // Dark text for nav links
                    navLinks.forEach(link => {
                        link.classList.remove('text-white', 'hover:text-pspl-gold');
                        link.classList.add('text-gray-800', 'hover:text-pspl-red');
                    });
                    
                    // Dark mobile menu button
                    if (mobileMenuBtn) {
                        mobileMenuBtn.classList.remove('text-white');
                        mobileMenuBtn.classList.add('text-gray-800');
                    }
                    
                    // Update contact button for white background
                    if (contactBtn) {
                        contactBtn.classList.add('shadow-md', 'hover:shadow-lg');
                    }
                } else {
                    // Apply transparent navbar styles (in hero section)
                    navbar.classList.remove('bg-white', 'shadow-lg');
                    navbar.classList.add('bg-transparent');
                    
                    // White logo
                    if (navLogo) {
                        navLogo.src = 'logo-white.svg';
                    }
                    
                    // White text for nav links
                    navLinks.forEach(link => {
                        link.classList.remove('text-gray-800', 'hover:text-pspl-red');
                        link.classList.add('text-white', 'hover:text-pspl-gold');
                    });
                    
                    // White mobile menu button
                    if (mobileMenuBtn) {
                        mobileMenuBtn.classList.remove('text-gray-800');
                        mobileMenuBtn.classList.add('text-white');
                    }
                    
                    // Remove extra shadow from contact button
                    if (contactBtn) {
                        contactBtn.classList.remove('shadow-md', 'hover:shadow-lg');
                    }
                }
            });
        }, {
            // Trigger when 90% of hero section is visible
            threshold: [0.9],
            rootMargin: '-80px 0px 0px 0px' // Account for navbar height
        });
        
        // Start observing the hero section
        navbarObserver.observe(heroSection);
    }
    
    // Simple fade-in animation for elements on scroll with performance optimization
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    // Batch observer callbacks for better performance
    let pendingEntries = [];
    let rafId = null;
    
    const processEntries = () => {
        pendingEntries.forEach(entry => {
            if (entry.isIntersecting) {
                // Use classes instead of inline styles to avoid overriding hover effects
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
        pendingEntries = [];
        rafId = null;
    };
    
    const observer = new IntersectionObserver((entries) => {
        pendingEntries.push(...entries);
        if (!rafId) {
            rafId = requestAnimationFrame(processEntries);
        }
    }, observerOptions);
    
    // Observe reveal elements
    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        // Add initial state class instead of inline styles
        el.classList.add('reveal-hidden');
        observer.observe(el);
    });
    
    // Simple counter animation
    const counters = document.querySelectorAll('.counter[data-target]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                let current = 0;
                const increment = target / 50;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    counter.textContent = Math.floor(current).toLocaleString();
                }, 30);
                
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counter.textContent = '0';
        counterObserver.observe(counter);
    });
    
    // Portfolio filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    let visibleItems = 9;
    let currentFilter = 'all';
    
    // Initialize portfolio
    function filterPortfolio(filter) {
        currentFilter = filter;
        let visibleCount = 0;
        
        portfolioItems.forEach((item, index) => {
            const category = item.getAttribute('data-category');
            const shouldShow = filter === 'all' || category.includes(filter);
            
            if (shouldShow) {
                if (visibleCount < visibleItems) {
                    item.style.display = 'block';
                    item.classList.remove('hidden');
                    visibleCount++;
                    // Add staggered animation with classes instead of inline styles
                    setTimeout(() => {
                        item.classList.add('portfolio-visible');
                    }, visibleCount * 50);
                } else {
                    item.style.display = 'none';
                    item.classList.add('hidden');
                }
            } else {
                item.style.display = 'none';
                item.classList.add('hidden');
            }
        });
        
        // Show/hide load more button
        if (loadMoreBtn) {
            const totalMatching = Array.from(portfolioItems).filter(item => {
                const category = item.getAttribute('data-category');
                return filter === 'all' || category.includes(filter);
            }).length;
            
            if (visibleItems < totalMatching) {
                loadMoreBtn.style.display = 'inline-block';
            } else {
                loadMoreBtn.style.display = 'none';
            }
        }
    }
    
    // Filter button click handlers
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            filterButtons.forEach(b => {
                b.classList.remove('active', 'bg-pspl-red', 'text-white');
                b.classList.add('border-2', 'border-gray-300');
            });
            this.classList.add('active', 'bg-pspl-red', 'text-white');
            this.classList.remove('border-2', 'border-gray-300');
            
            // Reset visible items when changing filters
            visibleItems = 9;
            
            // Apply filter
            const filter = this.getAttribute('data-filter');
            filterPortfolio(filter);
        });
    });
    
    // Load more button
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            visibleItems += 6;
            filterPortfolio(currentFilter);
            
            // Check if we should hide the button after loading more
            const totalMatching = Array.from(portfolioItems).filter(item => {
                const category = item.getAttribute('data-category');
                return currentFilter === 'all' || category.includes(currentFilter);
            }).length;
            
            if (visibleItems >= totalMatching) {
                loadMoreBtn.style.display = 'none';
            }
        });
    }
    
    // Initialize portfolio on load
    filterPortfolio('all');
    
    // Portfolio Modal
    const modal = document.getElementById('portfolioModal');
    let currentProjectIndex = 0;
    let currentImageIndex = 0;
    
    // Project data with multiple images
    const projectData = [
        {
            title: 'Capitol Tower Lobby',
            category: 'Commercial • Marble',
            images: [
                'images/Past Commercial Projects/Capital Tower.webp',
                'images/Past Commercial Projects/Capital Tower 2.webp',
                'images/Past Commercial Projects/Capital Tower 3.webp'
            ],
            description: 'Complete restoration of 5,000 sqft Carrara marble lobby. This prestigious project involved meticulous restoration of imported Italian marble, bringing back its original luster and elegance.',
            service: 'Marble Restoration & Polishing',
            location: 'Robinson Road, CBD',
            duration: '3 weeks'
        },
        {
            title: 'Club Street Heritage Shophouse',
            category: 'Heritage • Parquet',
            images: [
                'images/Club Street (Conservation Shophouse)/448278798_433793449414424_4873724001410576323_n.webp',
                'images/Club Street (Conservation Shophouse)/448298042_433793152747787_2523218675767481178_n.webp',
                'images/Club Street (Conservation Shophouse)/482006553_613025684824532_251287033583453409_n.webp',
                'images/Club Street (Conservation Shophouse)/482022469_613025981491169_7293032783404152723_n.webp',
                'images/Club Street (Conservation Shophouse)/482024263_613025648157869_825824160076031021_n.webp',
                'images/Club Street (Conservation Shophouse)/482051541_613025624824538_4130782867625009332_n.webp'
            ],
            description: '1920s teak parquet flooring brought back to original glory. Heritage conservation project requiring specialized techniques to preserve historical authenticity.',
            service: 'Parquet Restoration & Conservation',
            location: 'Club Street, Chinatown',
            duration: '4 weeks'
        },
        {
            title: 'An-Nahdhah Mosque',
            category: 'Heritage • Marble',
            images: [
                'images/Past Commercial Projects/An-Nahdhah Mosque Singapore 0.webp',
                'images/Past Commercial Projects/An-Nahdhah Mosque Singapore 1.webp', 
                'images/Past Commercial Projects/An-Nahdhah Mosque Singapore 2.webp',
                'images/Past Commercial Projects/An-Nahdhah Mosque Singapore 3.webp'
            ],
            description: 'Heritage building granite and marble restoration project. Careful restoration respecting religious significance and architectural heritage.',
            service: 'Granite & Marble Restoration',
            location: 'Bishan',
            duration: '6 weeks'
        },
        {
            title: 'MBFC Tower 3 Corporate Office',
            category: 'Commercial • Marble',
            images: [
                'images/Director/MBFC Tower 3 close.webp',
                'images/Director/MBFC Tower 3 far.webp',
                'images/Past Commercial Projects/MBFC Tower 3.webp'
            ],
            description: 'Grade A office building complete floor restoration. High-traffic commercial space requiring durable finish and minimal business disruption.',
            service: 'Commercial Marble Polishing',
            location: 'Marina Bay Financial Centre',
            duration: '2 weeks'
        },
        {
            title: 'Mount Pleasant British Colonial',
            category: 'Heritage • Parquet',
            images: [
                'images/Mount Pleasant Drive (British Colonial Bungalow)/474780228_1030991615504889_3680595854844797641_n.webp',
                'images/Mount Pleasant Drive (British Colonial Bungalow)/474948924_1031572122113505_647399842813823570_n.webp',
                'images/Mount Pleasant Drive (British Colonial Bungalow)/474950949_1031571888780195_1956536929514562494_n.webp',
                'images/Mount Pleasant Drive (British Colonial Bungalow)/474951409_1031572265446824_1251717352116059604_n.webp',
                'images/Mount Pleasant Drive (British Colonial Bungalow)/475133154_1031571885446862_1037691665932825306_n.webp'
            ],
            description: 'British colonial bungalow parquet restoration. Preserving the character of original 1930s teak flooring with modern protective treatments.',
            service: 'Heritage Parquet Restoration',
            location: 'Mount Pleasant',
            duration: '5 weeks'
        },
        {
            title: 'SPRUCE @ HillV2 Restaurant',
            category: 'Commercial',
            images: [
                'images/SPRUCE @ HillV2/342373522_602371615188445_51024111921149826_n.webp',
                'images/SPRUCE @ HillV2/342886339_3293969534248570_1227976711564094349_n.webp',
                'images/SPRUCE @ HillV2/473240813_1022155863055131_8558920594352500842_n.webp',
                'images/SPRUCE @ HillV2/473242865_1022155776388473_7705070839304022129_n.webp',
                'images/SPRUCE @ HillV2/473336533_1022155803055137_557286468691945205_n.webp'
            ],
            description: 'Fine dining restaurant floor restoration. Creating elegant ambiance through expertly restored natural stone surfaces.',
            service: 'Restaurant Floor Restoration',
            location: 'HillV2, Sembawang',
            duration: '10 days'
        },
        {
            title: 'Swettenham Colonial Bungalow',
            category: 'Heritage • Parquet',
            images: [
                'images/Swettenham Road (British Colonial Bungalow)/DSCF2260.webp',
                'images/Swettenham Road (British Colonial Bungalow)/DSCF2268.webp',
                'images/Swettenham Road (British Colonial Bungalow)/DSCF2370.webp',
                'images/Swettenham Road (British Colonial Bungalow)/DSCF2384.webp',
                'images/Swettenham Road (British Colonial Bungalow)/497738855_3908102889452751_9046911962136653947_n.webp'
            ],
            description: 'Comprehensive restoration of heritage parquet flooring in protected conservation bungalow. Museum-quality restoration techniques employed.',
            service: 'Conservation Parquet Restoration',
            location: 'Swettenham Road',
            duration: '7 weeks'
        },
        {
            title: 'Odette Restaurant',
            category: 'Commercial • Marble',
            images: [
                'images/Past Commercial Projects/Odette.webp'
            ],
            description: 'Michelin-starred restaurant marble restoration. Precision work ensuring flawless finish for Singapore\'s premier dining establishment.',
            service: 'Fine Dining Floor Restoration',
            location: 'National Gallery Singapore',
            duration: '2 weeks'
        },
        {
            title: 'Everitt Road Conservation',
            category: 'Heritage • Parquet',
            images: [
                'images/Everitt Road (Conservation Shophouse)/IMG_9303.webp',
                'images/Everitt Road (Conservation Shophouse)/IMG_9305.webp',
                'images/Everitt Road (Conservation Shophouse)/IMG_9306.webp',
                'images/Everitt Road (Conservation Shophouse)/IMG_9307.webp',
                'images/Everitt Road (Conservation Shophouse)/IMG_9310.webp'
            ],
            description: 'Conservation shophouse complete parquet restoration. Balancing heritage preservation with modern living requirements.',
            service: 'Shophouse Parquet Restoration',
            location: 'Everitt Road, Little India',
            duration: '4 weeks'
        },
        {
            title: 'Bukit Timah Stone Analysis',
            category: 'Consultation • Stone Analysis',
            images: [
                'images/Stone Consultation Inspection/Bukit Timah.webp'
            ],
            description: 'Comprehensive stone defect analysis for luxury residence. Detailed assessment of marble deterioration, staining patterns, and structural integrity with restoration recommendations.',
            service: 'Stone Defect Analysis & Consultation',
            location: 'Bukit Timah',
            duration: '2 days consultation'
        },
        {
            title: 'Camborne Road Marble Inspection',
            category: 'Consultation • Stone Analysis',
            images: [
                'images/Stone Consultation Inspection/Camborne Road.webp'
            ],
            description: 'Expert marble surface inspection and quality assessment. Identified causes of discoloration and provided detailed restoration plan with cost estimates.',
            service: 'Stone Defect Analysis & Consultation',
            location: 'Camborne Road',
            duration: '1 day consultation'
        },
        {
            title: 'River Valley Defect Analysis',
            category: 'Consultation • Stone Analysis',
            images: [
                'images/Stone Consultation Inspection/River Valley.webp'
            ],
            description: 'Professional stone defect diagnosis for condominium common areas. Comprehensive report on water damage, efflorescence, and preventive maintenance strategies.',
            service: 'Stone Defect Analysis & Consultation',
            location: 'River Valley',
            duration: '3 days consultation'
        },
        {
            title: 'Sungei Kadut Industrial Assessment',
            category: 'Consultation • Stone Analysis',
            images: [
                'images/Stone Consultation Inspection/Sungei Kadut.webp'
            ],
            description: 'Industrial facility floor assessment for heavy-duty applications. Analysis of wear patterns, chemical damage, and recommendations for industrial-grade restoration.',
            service: 'Stone Defect Analysis & Consultation',
            location: 'Sungei Kadut',
            duration: '2 days consultation'
        },
        {
            title: 'The Avenir Luxury Consultation',
            category: 'Consultation • Stone Analysis',
            images: [
                'images/Stone Consultation Inspection/The Avenir.webp'
            ],
            description: 'Premium condominium marble consultation service. Expert analysis of imported stone varieties with specialized care recommendations for long-term preservation.',
            service: 'Stone Defect Analysis & Consultation',
            location: 'River Valley',
            duration: '2 days consultation'
        },
        {
            title: 'Treasure @ Tampines Analysis',
            category: 'Consultation • Stone Analysis',
            images: [
                'images/Stone Consultation Inspection/Treasure @ Tampines.webp'
            ],
            description: 'Large-scale residential development stone assessment. Evaluation of common area marble installations with preventive maintenance program development.',
            service: 'Stone Defect Analysis & Consultation',
            location: 'Tampines',
            duration: '4 days consultation'
        },
        {
            title: 'OUE Downtown 2',
            category: 'Commercial • Marble',
            images: [
                'images/Past Commercial Projects/OUE Downtown 2.webp',
                'images/Past Commercial Projects/OUE Downtown 2 b.webp',
                'images/Past Commercial Projects/OUE Downtown 2 c.webp'
            ],
            description: 'Premium office tower marble restoration. Complete restoration of lobby and common areas maintaining Grade A office standards.',
            service: 'Commercial Marble Restoration',
            location: 'Shenton Way',
            duration: '3 weeks'
        },
        {
            title: 'Altro Zafferano Restaurant',
            category: 'Commercial • Marble',
            images: [
                'images/Past Commercial Projects/Altro Zafferano 10 Collyer Quay, Level 43, Singapore 049315.webp'
            ],
            description: 'Luxury rooftop restaurant marble restoration. Precision polishing for high-end dining establishment with panoramic city views.',
            service: 'Fine Dining Floor Restoration',
            location: 'Collyer Quay',
            duration: '1 week'
        },
        {
            title: 'Chinese Swimming Club',
            category: 'Commercial • Marble',
            images: [
                'images/Past Commercial Projects/Chinese Swimming Club.webp'
            ],
            description: 'Historic private club comprehensive restoration. Poolside and indoor marble surfaces restored to pristine condition.',
            service: 'Club Facility Restoration',
            location: 'Amber Road',
            duration: '4 weeks'
        },
        {
            title: 'Courtyard Singapore Novena',
            category: 'Commercial • Marble',
            images: [
                'images/Past Commercial Projects/Courtyard Singapore Novena.webp'
            ],
            description: 'International hotel chain marble maintenance. Lobby and guest area restoration maintaining brand standards.',
            service: 'Hotel Marble Restoration',
            location: 'Novena',
            duration: '2 weeks'
        },
        {
            title: 'Massimo Dutti VivoCity',
            category: 'Commercial • Marble',
            images: [
                'images/Past Commercial Projects/Massimo Dutti VivoCity Store.webp'
            ],
            description: 'Luxury retail store flooring restoration. After-hours work to minimize business disruption for flagship store.',
            service: 'Retail Floor Restoration',
            location: 'HarbourFront',
            duration: '1 week'
        },
        {
            title: 'One Devonshire',
            category: 'Commercial • Marble',
            images: [
                'images/Past Commercial Projects/One Devonshire.webp'
            ],
            description: 'Boutique office building complete restoration. Exclusive marble finishes restored to original European standards.',
            service: 'Premium Office Restoration',
            location: 'Devonshire Road',
            duration: '2 weeks'
        },
        {
            title: 'Singapore Land Tower',
            category: 'Commercial • Marble',
            images: [
                'images/Past Commercial Projects/Singapore Land Tower.webp'
            ],
            description: 'Iconic CBD tower marble maintenance. High-traffic lobby restoration with minimal disruption to tenants.',
            service: 'Commercial Tower Restoration',
            location: 'Raffles Place',
            duration: '3 weeks'
        },
        {
            title: "St Joseph's Home",
            category: 'Heritage • Marble',
            images: [
                "images/Past Commercial Projects/St Joseph's Home Singapore.webp"
            ],
            description: 'Heritage care facility restoration. Careful restoration respecting both heritage value and safety requirements.',
            service: 'Heritage Building Restoration',
            location: 'Jurong West',
            duration: '5 weeks'
        }
    ];
    
    // Add click handlers to portfolio items
    portfolioItems.forEach((item) => {
        item.addEventListener('click', () => {
            const projectId = item.getAttribute('data-project-id');
            if (projectId) {
                const projectIndex = projectData.findIndex(p => p.title === projectId);
                if (projectIndex !== -1) {
                    openModal(projectIndex);
                }
            }
        });
    });
    
    window.openModal = function(index) {
        currentProjectIndex = index;
        currentImageIndex = 0;
        const project = projectData[index];
        
        if (project) {
            // Load first image
            updateModalImage(project);
            
            // Update project details
            document.getElementById('modalTitle').textContent = project.title;
            document.getElementById('modalCategory').textContent = project.category;
            document.getElementById('modalDescription').textContent = project.description;
            document.getElementById('modalService').textContent = project.service;
            document.getElementById('modalLocation').textContent = project.location;
            document.getElementById('modalDuration').textContent = project.duration;
            
            // Create dots for image navigation
            createImageDots(project.images.length);
            
            // Update navigation visibility
            updateImageNavigation(project.images.length);
            
            modal.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
            
            // Reset scroll position for modal content on mobile
            const isMobile = window.innerWidth <= 768;
            if (isMobile) {
                const contentSection = modal.querySelector('.lg\\:w-1\\/3');
                if (contentSection) {
                    contentSection.scrollTop = 0;
                }
            }
            
            // Prevent background scroll on iOS
            if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
                document.body.style.position = 'fixed';
                document.body.style.width = '100%';
                document.body.style.top = `-${window.scrollY}px`;
            }
        }
    };
    
    function updateModalImage(project) {
        if (project && project.images && project.images[currentImageIndex]) {
            document.getElementById('modalImage').src = project.images[currentImageIndex];
            document.getElementById('currentImageNum').textContent = currentImageIndex + 1;
            document.getElementById('totalImageNum').textContent = project.images.length;
            updateActiveDot();
        }
    }
    
    function createImageDots(count) {
        const dotsContainer = document.getElementById('modalImageDots');
        dotsContainer.innerHTML = '';
        
        for (let i = 0; i < count; i++) {
            const dot = document.createElement('button');
            dot.className = 'w-2 h-2 rounded-full transition-all modal-dot-btn';
            dot.onclick = () => goToImage(i);
            dot.setAttribute('aria-label', `Go to image ${i + 1}`);
            dotsContainer.appendChild(dot);
        }
        updateActiveDot();
    }
    
    function updateActiveDot() {
        const dots = document.querySelectorAll('#modalImageDots button');
        dots.forEach((dot, index) => {
            if (index === currentImageIndex) {
                dot.className = 'w-2 h-2 bg-white rounded-full transition-all modal-dot-btn';
            } else {
                dot.className = 'w-2 h-2 bg-white/50 rounded-full transition-all hover:bg-white/70 modal-dot-btn';
            }
        });
    }
    
    function updateImageNavigation(imageCount) {
        const prevBtn = document.getElementById('modalPrevImage');
        const nextBtn = document.getElementById('modalNextImage');
        const dotsContainer = document.getElementById('modalImageDots');
        const counter = document.getElementById('modalImageCounter');
        
        if (imageCount <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            dotsContainer.style.display = 'none';
            counter.style.display = 'none';
        } else {
            prevBtn.style.display = 'block';
            nextBtn.style.display = 'block';
            dotsContainer.style.display = 'flex';
            counter.style.display = 'block';
        }
    }
    
    window.changeModalImage = function(direction) {
        const project = projectData[currentProjectIndex];
        if (!project || !project.images) return;
        
        currentImageIndex += direction;
        
        // Loop around
        if (currentImageIndex < 0) {
            currentImageIndex = project.images.length - 1;
        } else if (currentImageIndex >= project.images.length) {
            currentImageIndex = 0;
        }
        
        updateModalImage(project);
    };
    
    window.goToImage = function(index) {
        const project = projectData[currentProjectIndex];
        if (!project || !project.images || index < 0 || index >= project.images.length) return;
        
        currentImageIndex = index;
        updateModalImage(project);
    };
    
    window.closeModal = function() {
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
        
        // Restore scroll position on iOS
        if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.top = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
    };
    
    window.navigateProject = function(direction) {
        const newIndex = currentProjectIndex + direction;
        if (newIndex >= 0 && newIndex < projectData.length) {
            currentImageIndex = 0; // Reset to first image when switching projects
            openModal(newIndex);
        }
    };
    
    // Add swipe gesture support for mobile with improved touch handling
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    let isScrolling = null;
    
    const modalImageContainer = document.getElementById('modalImageContainer');
    if (modalImageContainer) {
        modalImageContainer.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
            isScrolling = null;
        }, { passive: true });
        
        modalImageContainer.addEventListener('touchmove', function(e) {
            if (isScrolling === null) {
                const diffX = Math.abs(e.changedTouches[0].screenX - touchStartX);
                const diffY = Math.abs(e.changedTouches[0].screenY - touchStartY);
                isScrolling = diffY > diffX;
            }
        }, { passive: true });
        
        modalImageContainer.addEventListener('touchend', function(e) {
            if (!isScrolling) {
                touchEndX = e.changedTouches[0].screenX;
                touchEndY = e.changedTouches[0].screenY;
                handleSwipeGesture();
            }
        }, { passive: true });
    }
    
    function handleSwipeGesture() {
        const swipeThreshold = 50; // Minimum distance for swipe
        const verticalThreshold = 100; // Maximum vertical movement allowed
        
        const horizontalDiff = touchEndX - touchStartX;
        const verticalDiff = Math.abs(touchEndY - touchStartY);
        
        // Only process horizontal swipes
        if (Math.abs(horizontalDiff) > swipeThreshold && verticalDiff < verticalThreshold) {
            if (horizontalDiff > 0) {
                // Swipe right - show previous image
                changeModalImage(-1);
            } else {
                // Swipe left - show next image
                changeModalImage(1);
            }
        }
    }
    
    window.openProjectWhatsApp = function() {
        const project = projectData[currentProjectIndex];
        const message = `Hi PSPL, I'm interested in ${project.service} similar to your ${project.title} project. Please provide more information.`;
        const phone = "6597677169";
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };
    
    // Keyboard navigation for modal
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('hidden')) {
            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowLeft') {
                changeModalImage(-1);
            } else if (e.key === 'ArrowRight') {
                changeModalImage(1);
            }
        }
    });

}); // Close DOMContentLoaded

// WhatsApp function
function openWhatsApp() {
    const message = "Hi PSPL, I'm interested in your stone and parquet restoration services.";
    const phone = "6597677169";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}