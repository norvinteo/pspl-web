// ===================================
// PSPL Contact Page JavaScript
// Form handling and interactions
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Contact page styles
    const contactStyles = `
        <style>
        .contact-priority-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: var(--space-6);
            max-width: 900px;
            margin: 0 auto;
        }
        
        .priority-card {
            background: white;
            padding: var(--space-6);
            border-radius: var(--radius-xl);
            text-align: center;
            box-shadow: var(--shadow-lg);
            transition: all var(--transition-base);
            border: 3px solid transparent;
        }
        
        .priority-card:hover {
            transform: translateY(-8px);
            box-shadow: var(--shadow-xl);
        }
        
        .priority-card--emergency {
            border-color: #FF4444;
        }
        
        .priority-card--emergency:hover {
            background: linear-gradient(135deg, #FF4444, #CC0000);
            color: white;
        }
        
        .priority-card--corporate {
            border-color: var(--color-luxury-gold);
        }
        
        .priority-card--corporate:hover {
            background: linear-gradient(135deg, var(--color-luxury-gold), #DAA520);
            color: white;
        }
        
        .priority-card--consultation {
            border-color: var(--color-trust-blue);
        }
        
        .priority-card--consultation:hover {
            background: linear-gradient(135deg, var(--color-trust-blue), #002A40);
            color: white;
        }
        
        .priority-icon {
            font-size: 3rem;
            margin-bottom: var(--space-4);
            display: block;
        }
        
        .priority-card h3 {
            color: var(--color-coral);
            margin-bottom: var(--space-3);
            transition: color var(--transition-base);
        }
        
        .priority-card:hover h3 {
            color: white;
        }
        
        .bg-emergency {
            background: linear-gradient(135deg, #FF4444, #CC0000);
        }
        
        .bg-luxury-gold {
            background: var(--color-luxury-gold);
        }
        
        .bg-trust-blue {
            background: var(--color-trust-blue);
        }
        
        .emergency-contact-card,
        .corporate-contact-card,
        .general-contact-card {
            background: rgba(255, 255, 255, 0.1);
            padding: var(--space-6);
            border-radius: var(--radius-xl);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .contact-method {
            display: flex;
            align-items: center;
            gap: var(--space-4);
            margin-bottom: var(--space-4);
            padding: var(--space-3);
            background: rgba(255, 255, 255, 0.1);
            border-radius: var(--radius-lg);
        }
        
        .contact-icon {
            font-size: 1.5rem;
            width: 40px;
            text-align: center;
        }
        
        .emergency-guarantees,
        .corporate-guarantees,
        .general-guarantees {
            background: rgba(255, 255, 255, 0.1);
            padding: var(--space-4);
            border-radius: var(--radius-lg);
            margin: var(--space-4) 0;
        }
        
        .emergency-form,
        .corporate-form,
        .general-form {
            background: rgba(255, 255, 255, 0.95);
            padding: var(--space-6);
            border-radius: var(--radius-xl);
            backdrop-filter: blur(10px);
        }
        
        .checkbox-group {
            display: flex;
            flex-direction: column;
            gap: var(--space-2);
            margin-top: var(--space-2);
        }
        
        .checkbox-label {
            display: flex;
            align-items: center;
            gap: var(--space-2);
            cursor: pointer;
            padding: var(--space-1);
            border-radius: var(--radius-sm);
            transition: background var(--transition-base);
        }
        
        .checkbox-label:hover {
            background: rgba(255, 255, 255, 0.1);
        }
        
        .checkbox-label input[type="checkbox"] {
            width: 16px;
            height: 16px;
            accent-color: var(--color-coral);
        }
        
        .office-card {
            background: white;
            padding: var(--space-8);
            border-radius: var(--radius-xl);
            box-shadow: var(--shadow-lg);
            height: 100%;
        }
        
        .office-hours ul,
        .workshop-hours ul,
        .office-facilities ul {
            color: var(--color-corporate-charcoal);
            font-size: var(--text-sm);
        }
        
        .interactive-map {
            border-radius: var(--radius-xl);
            overflow: hidden;
            box-shadow: var(--shadow-lg);
        }
        
        .map-info {
            background: white;
            padding: var(--space-4);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-md);
        }
        
        .team-directory {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: var(--space-8);
        }
        
        .team-member-card {
            background: white;
            padding: var(--space-6);
            border-radius: var(--radius-xl);
            box-shadow: var(--shadow-lg);
            text-align: center;
            transition: all var(--transition-base);
        }
        
        .team-member-card:hover {
            transform: translateY(-6px);
            box-shadow: var(--shadow-xl);
        }
        
        .team-member-avatar {
            width: 100px;
            height: 100px;
            border-radius: var(--radius-full);
            overflow: hidden;
            margin: 0 auto var(--space-4);
            border: 4px solid var(--color-coral);
        }
        
        .team-member-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .team-member-info h3 {
            margin-bottom: var(--space-2);
            color: var(--color-corporate-charcoal);
        }
        
        .team-member-info h4 {
            margin-bottom: var(--space-4);
        }
        
        .team-contact-methods {
            margin-bottom: var(--space-4);
            text-align: left;
        }
        
        .team-contact-methods p {
            margin-bottom: var(--space-2);
            font-size: var(--text-sm);
        }
        
        .team-specialties {
            text-align: left;
            font-size: var(--text-sm);
            color: rgba(26, 26, 26, 0.8);
        }
        
        .team-specialties p {
            margin-bottom: var(--space-1);
        }
        
        .response-time-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: var(--space-6);
            max-width: 1000px;
            margin: 0 auto;
        }
        
        .response-time-card {
            text-align: center;
            padding: var(--space-4);
        }
        
        .response-icon {
            font-size: 2.5rem;
            margin-bottom: var(--space-3);
            display: block;
        }
        
        .response-time-card h4 {
            margin-bottom: var(--space-2);
        }
        
        .form-success {
            background: var(--color-success-green);
            color: white;
            padding: var(--space-4);
            border-radius: var(--radius-lg);
            margin-bottom: var(--space-4);
            text-align: center;
            display: none;
        }
        
        .form-error {
            background: #FF4444;
            color: white;
            padding: var(--space-4);
            border-radius: var(--radius-lg);
            margin-bottom: var(--space-4);
            text-align: center;
            display: none;
        }
        
        @media (max-width: 767px) {
            .contact-priority-grid {
                grid-template-columns: 1fr;
                gap: var(--space-4);
            }
            
            .team-directory {
                grid-template-columns: 1fr;
                gap: var(--space-6);
            }
            
            .response-time-grid {
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: var(--space-4);
            }
            
            .checkbox-group {
                gap: var(--space-3);
            }
        }
        </style>
    `;
    
    // Inject contact styles
    document.head.insertAdjacentHTML('beforeend', contactStyles);
    
    // Form handling
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formType = this.className;
            const formData = new FormData(this);
            
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                // Reset button
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                
                // Show success message
                showFormSuccess(this, formType);
                
                // Track form submission
                console.log('Form submitted:', formType, Object.fromEntries(formData));
                
                // In real implementation, this would send to backend
                // handleFormSubmission(formData, formType);
                
            }, 2000);
        });
    });
    
    function showFormSuccess(form, formType) {
        // Remove existing messages
        const existingMessages = form.querySelectorAll('.form-success, .form-error');
        existingMessages.forEach(msg => msg.remove());
        
        // Create success message
        const successMessage = document.createElement('div');
        successMessage.className = 'form-success';
        
        let message = '';
        if (formType.includes('emergency')) {
            message = '🚨 Emergency request submitted! Our team will contact you within 2 hours.';
        } else if (formType.includes('corporate')) {
            message = '🏢 Corporate inquiry received! We\'ll respond within 4 business hours.';
        } else {
            message = '✅ Message sent successfully! We\'ll get back to you within 24 hours.';
        }
        
        successMessage.textContent = message;
        
        // Insert at top of form
        form.insertBefore(successMessage, form.firstChild);
        
        // Show with animation
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(successMessage, {
                opacity: 0,
                y: -20
            }, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.out"
            });
        } else {
            successMessage.style.display = 'block';
        }
        
        // Reset form
        form.reset();
        
        // Hide message after 5 seconds
        setTimeout(() => {
            if (typeof gsap !== 'undefined') {
                gsap.to(successMessage, {
                    opacity: 0,
                    y: -20,
                    duration: 0.3,
                    ease: "power2.in",
                    onComplete: () => successMessage.remove()
                });
            } else {
                successMessage.remove();
            }
        }, 5000);
    }
    
    // Form validation
    function addFormValidation() {
        const requiredFields = document.querySelectorAll('input[required], select[required], textarea[required]');
        
        requiredFields.forEach(field => {
            field.addEventListener('blur', function() {
                validateField(this);
            });
            
            field.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    }
    
    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        
        // Remove existing error styling
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Check if required field is empty
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            showFieldError(field, 'This field is required');
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                showFieldError(field, 'Please enter a valid email address');
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                showFieldError(field, 'Please enter a valid phone number');
            }
        }
        
        return isValid;
    }
    
    function showFieldError(field, message) {
        field.classList.add('error');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #FF4444;
            font-size: var(--text-xs);
            margin-top: var(--space-1);
        `;
        
        field.parentNode.appendChild(errorElement);
    }
    
    // Enable form validation
    addFormValidation();
    
    // GSAP animations for contact page
    if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
        gsap.registerPlugin(ScrollTrigger);
        
        // Priority cards animation
        gsap.fromTo('.priority-card', {
            opacity: 0,
            y: 50,
            scale: 0.9
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "back.out(1.7)"
        });
        
        // Section animations
        gsap.utils.toArray('.fade-in-left').forEach(element => {
            gsap.fromTo(element, {
                opacity: 0,
                x: -50
            }, {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });
        });
        
        gsap.utils.toArray('.fade-in-right').forEach(element => {
            gsap.fromTo(element, {
                opacity: 0,
                x: 50
            }, {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });
        });
        
        // Team member cards animation
        gsap.fromTo('.team-member-card', {
            opacity: 0,
            y: 30,
            scale: 0.95
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.team-directory',
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
        
        // Response time cards animation
        gsap.fromTo('.response-time-card', {
            opacity: 0,
            scale: 0.8
        }, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: '.response-time-grid',
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    }
    
    // Enhanced interactions
    const priorityCards = document.querySelectorAll('.priority-card');
    priorityCards.forEach(card => {
        card.addEventListener('click', function() {
            const cardType = this.classList[1]; // Get the specific type class
            
            if (cardType === 'priority-card--emergency') {
                // Scroll to emergency section or trigger emergency call
                const emergencySection = document.getElementById('emergency');
                if (emergencySection) {
                    emergencySection.scrollIntoView({ behavior: 'smooth' });
                }
            } else if (cardType === 'priority-card--corporate') {
                // Scroll to corporate section
                const corporateSection = document.getElementById('corporate');
                if (corporateSection) {
                    corporateSection.scrollIntoView({ behavior: 'smooth' });
                }
            } else if (cardType === 'priority-card--consultation') {
                // Scroll to general section
                const generalSection = document.getElementById('general');
                if (generalSection) {
                    generalSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
    
    // Form field enhancements
    const formInputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('form-group--focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('form-group--focused');
        });
    });
    
    // Auto-resize textareas
    const textareas = document.querySelectorAll('.form-textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    });
    
    // Phone number formatting
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, ''); // Remove non-digits
            
            // Singapore phone number formatting
            if (value.startsWith('65')) {
                value = value.substring(2);
            }
            
            if (value.length >= 8) {
                value = value.substring(0, 8);
                value = value.replace(/(\d{4})(\d{4})/, '$1 $2');
                this.value = '+65 ' + value;
            } else {
                this.value = value;
            }
        });
    });
    
    // Emergency button interactions
    const emergencyButtons = document.querySelectorAll('.btn--emergency, .pulse-emergency');
    emergencyButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Track emergency button clicks
            console.log('Emergency button clicked');
            
            // Add urgency feedback
            if (typeof gsap !== 'undefined') {
                gsap.to(this, {
                    scale: 1.1,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1,
                    ease: "power2.inOut"
                });
            }
        });
    });
    
    // Map interaction enhancement
    const mapContainer = document.querySelector('.interactive-map');
    if (mapContainer) {
        mapContainer.addEventListener('click', function() {
            console.log('Map clicked - could open in new window or show larger view');
        });
    }
    
    console.log('Contact page initialized successfully');
});