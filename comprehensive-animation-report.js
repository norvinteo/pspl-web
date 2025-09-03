const { chromium } = require('playwright');

async function generateAnimationReport() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 }
    });
    const page = await context.newPage();
    
    const report = {
        timestamp: new Date().toISOString(),
        url: 'https://norvinteo.github.io/pspl/',
        motionLibrary: {},
        pageStructure: {},
        animationBehavior: {},
        performance: {},
        errors: [],
        recommendations: []
    };
    
    // Collect all console messages
    const allMessages = [];
    page.on('console', msg => {
        allMessages.push({
            type: msg.type(),
            text: msg.text(),
            timestamp: Date.now()
        });
    });
    
    // Network monitoring
    const networkIssues = [];
    page.on('response', response => {
        if (!response.ok() && response.status() !== 302) {
            networkIssues.push({
                url: response.url(),
                status: response.status(),
                statusText: response.statusText()
            });
        }
    });
    
    try {
        console.log('🔍 Generating Comprehensive PSPL Animation Report...\n');
        
        const startTime = Date.now();
        
        // Navigate and wait for full load
        console.log('📥 Loading website...');
        await page.goto('https://norvinteo.github.io/pspl/', { 
            waitUntil: 'networkidle',
            timeout: 30000
        });
        await page.waitForTimeout(5000); // Extra time for animations to initialize
        
        const loadTime = Date.now() - startTime;
        report.performance.initialLoadTime = loadTime;
        
        // 1. Motion Library Analysis
        console.log('🎭 Analyzing Motion Library...');
        report.motionLibrary = await page.evaluate(() => {
            const hasMotion = typeof window.Motion !== 'undefined';
            if (!hasMotion) return { loaded: false };
            
            const Motion = window.Motion;
            return {
                loaded: true,
                version: Motion.version || 'unknown',
                availableFunctions: Object.keys(Motion),
                functionCount: Object.keys(Motion).length,
                animate: typeof Motion.animate === 'function',
                scroll: typeof Motion.scroll === 'function',
                inView: typeof Motion.inView === 'function',
                timeline: typeof Motion.timeline === 'function',
                stagger: typeof Motion.stagger === 'function'
            };
        });
        
        // 2. Page Structure Analysis
        console.log('🏗️ Analyzing page structure...');
        report.pageStructure = await page.evaluate(() => {
            return {
                title: document.title,
                totalElements: document.querySelectorAll('*').length,
                sections: document.querySelectorAll('section').length,
                sectionTypes: Array.from(document.querySelectorAll('section')).map(s => s.className),
                
                // Animation-related elements
                elementsWithDataAnimate: document.querySelectorAll('[data-animate]').length,
                hiddenElements: Array.from(document.querySelectorAll('*')).filter(el => {
                    const style = getComputedStyle(el);
                    return style.opacity === '0' || el.style.opacity === '0';
                }).length,
                
                // Specific element types that should be animated
                animatableElements: {
                    cards: document.querySelectorAll('.card, .service-card, .portfolio-item, .testimonial-card').length,
                    timelineItems: document.querySelectorAll('.timeline-item').length,
                    statWrappers: document.querySelectorAll('.stat-wrapper').length,
                    fleetCards: document.querySelectorAll('.fleet-card').length,
                    headings: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length,
                    buttons: document.querySelectorAll('button, .btn, .cta-primary').length
                },
                
                // Hero section elements
                heroElements: {
                    title: !!document.querySelector('#heroTitle'),
                    subtitle: !!document.querySelector('#heroSubtitle'),
                    value: !!document.querySelector('#heroValue'),
                    buttons: !!document.querySelector('#heroButtons')
                },
                
                // Page dimensions
                pageHeight: document.body.scrollHeight,
                viewportHeight: window.innerHeight
            };
        });
        
        // 3. Animation Behavior Testing
        console.log('🎬 Testing animation behavior...');
        
        // Test scroll-triggered animations
        const scrollTest = [];
        const testPositions = [0, 300, 800, 1500, 2500, 4000, 6000];
        
        for (let i = 0; i < testPositions.length; i++) {
            const position = testPositions[i];
            
            await page.evaluate(pos => {
                window.scrollTo({ top: pos, behavior: 'smooth' });
            }, position);
            
            await page.waitForTimeout(2000); // Wait for animations
            
            const visibilityData = await page.evaluate(() => {
                return {
                    scrollY: window.pageYOffset,
                    hiddenCount: Array.from(document.querySelectorAll('*')).filter(el => {
                        const style = getComputedStyle(el);
                        return style.opacity === '0' || el.style.opacity === '0';
                    }).length,
                    visibleSections: Array.from(document.querySelectorAll('section')).map((section, index) => {
                        const rect = section.getBoundingClientRect();
                        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                        const isFullyVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
                        return {
                            index,
                            className: section.className.split(' ').slice(0, 3).join(' '), // First 3 classes
                            isVisible,
                            isFullyVisible,
                            top: Math.round(rect.top),
                            bottom: Math.round(rect.bottom)
                        };
                    }).filter(s => s.isVisible)
                };
            });
            
            scrollTest.push({
                position,
                ...visibilityData
            });
            
            console.log(`  📍 Position ${position}px: ${visibilityData.hiddenCount} hidden, ${visibilityData.visibleSections.length} sections visible`);
        }
        
        report.animationBehavior.scrollTest = scrollTest;
        
        // Test manual animation triggering
        console.log('🔬 Testing manual animation trigger...');
        const manualAnimationTest = await page.evaluate(() => {
            if (!window.Motion || !window.Motion.animate) {
                return { success: false, error: 'Motion.animate not available' };
            }
            
            try {
                const testElement = document.querySelector('h1');
                if (!testElement) return { success: false, error: 'No test element found' };
                
                const originalOpacity = testElement.style.opacity;
                const originalTransform = testElement.style.transform;
                
                // Run test animation
                window.Motion.animate(
                    testElement,
                    { 
                        opacity: [0.5, 1],
                        transform: ['scale(0.95)', 'scale(1)']
                    },
                    { duration: 0.5, easing: 'ease-out' }
                );
                
                return {
                    success: true,
                    elementTag: testElement.tagName,
                    elementClass: testElement.className,
                    originalState: { originalOpacity, originalTransform }
                };
            } catch (error) {
                return { success: false, error: error.message };
            }
        });
        
        report.animationBehavior.manualTest = manualAnimationTest;
        
        // 4. Performance Analysis
        console.log('⚡ Analyzing performance...');
        
        const performanceMetrics = await page.evaluate(() => {
            const performance = window.performance;
            const navigation = performance.getEntriesByType('navigation')[0];
            const paintEntries = performance.getEntriesByType('paint');
            
            return {
                loadComplete: navigation ? navigation.loadEventEnd : 0,
                domContentLoaded: navigation ? navigation.domContentLoadedEventEnd : 0,
                firstPaint: paintEntries.find(entry => entry.name === 'first-paint')?.startTime || 0,
                firstContentfulPaint: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
                resourceCount: performance.getEntriesByType('resource').length
            };
        });
        
        report.performance = { ...report.performance, ...performanceMetrics };
        
        // 5. Error Analysis
        const errors = allMessages.filter(msg => msg.type === 'error');
        const warnings = allMessages.filter(msg => msg.type === 'warning');
        const animationLogs = allMessages.filter(msg => 
            msg.text.includes('animation') || 
            msg.text.includes('Motion') ||
            msg.text.includes('Checking elements') ||
            msg.text.includes('Queued')
        );
        
        report.errors = {
            jsErrors: errors.map(e => e.text),
            warnings: warnings.map(w => w.text),
            networkIssues: networkIssues,
            animationLogCount: animationLogs.length,
            recentAnimationLogs: animationLogs.slice(-10).map(log => log.text)
        };
        
        // 6. Generate Recommendations
        const recommendations = [];
        
        if (!report.motionLibrary.loaded) {
            recommendations.push({
                priority: 'HIGH',
                issue: 'Motion library not loaded',
                solution: 'Ensure Motion.js is properly loaded before animation scripts'
            });
        }
        
        if (report.errors.jsErrors.length > 0) {
            recommendations.push({
                priority: 'MEDIUM',
                issue: `${report.errors.jsErrors.length} JavaScript error(s) detected`,
                solution: 'Fix JavaScript errors to ensure animations work properly'
            });
        }
        
        if (report.animationBehavior.scrollTest.some(test => test.hiddenCount > 50)) {
            recommendations.push({
                priority: 'LOW',
                issue: 'Many elements remain hidden after scroll',
                solution: 'Review animation triggers and ensure all intended elements animate'
            });
        }
        
        if (report.performance.initialLoadTime > 5000) {
            recommendations.push({
                priority: 'MEDIUM',
                issue: 'Slow initial page load',
                solution: 'Optimize asset loading and consider lazy loading for animations'
            });
        }
        
        if (report.errors.animationLogCount > 1000) {
            recommendations.push({
                priority: 'LOW',
                issue: 'High number of animation debug logs',
                solution: 'Consider reducing debug output in production'
            });
        }
        
        report.recommendations = recommendations;
        
        // 7. Overall Assessment
        const assessment = {
            status: 'WORKING',
            confidence: 'HIGH'
        };
        
        if (!report.motionLibrary.loaded) {
            assessment.status = 'BROKEN';
            assessment.confidence = 'HIGH';
        } else if (report.errors.jsErrors.length > 2) {
            assessment.status = 'DEGRADED';
            assessment.confidence = 'MEDIUM';
        } else if (report.animationBehavior.manualTest.success && report.errors.animationLogCount > 0) {
            assessment.status = 'WORKING';
            assessment.confidence = 'HIGH';
        }
        
        report.assessment = assessment;
        
        // Generate console report
        console.log('\n📊 COMPREHENSIVE ANIMATION REPORT');
        console.log('='.repeat(50));
        
        console.log('\n🎭 MOTION LIBRARY:');
        console.log(`  Status: ${report.motionLibrary.loaded ? '✅ Loaded' : '❌ Missing'}`);
        if (report.motionLibrary.loaded) {
            console.log(`  Functions: ${report.motionLibrary.functionCount}`);
            console.log(`  Core Features: animate(${report.motionLibrary.animate ? '✅' : '❌'}), scroll(${report.motionLibrary.scroll ? '✅' : '❌'}), inView(${report.motionLibrary.inView ? '✅' : '❌'})`);
        }
        
        console.log('\n🏗️ PAGE STRUCTURE:');
        console.log(`  Total Elements: ${report.pageStructure.totalElements}`);
        console.log(`  Sections: ${report.pageStructure.sections}`);
        console.log(`  Currently Hidden: ${report.pageStructure.hiddenElements}`);
        console.log(`  Animatable Elements:`);
        Object.entries(report.pageStructure.animatableElements).forEach(([type, count]) => {
            console.log(`    - ${type}: ${count}`);
        });
        
        console.log('\n🎬 ANIMATION BEHAVIOR:');
        console.log(`  Scroll Animation Tests: ${report.animationBehavior.scrollTest.length}`);
        const initialHidden = report.animationBehavior.scrollTest[0]?.hiddenCount || 0;
        const finalHidden = report.animationBehavior.scrollTest[report.animationBehavior.scrollTest.length - 1]?.hiddenCount || 0;
        console.log(`  Elements Animated: ${initialHidden - finalHidden} (${initialHidden} → ${finalHidden})`);
        console.log(`  Manual Animation Test: ${report.animationBehavior.manualTest.success ? '✅ Success' : '❌ Failed'}`);
        
        console.log('\n⚡ PERFORMANCE:');
        console.log(`  Page Load Time: ${report.performance.initialLoadTime}ms`);
        console.log(`  First Contentful Paint: ${report.performance.firstContentfulPaint || 'N/A'}ms`);
        console.log(`  Resources Loaded: ${report.performance.resourceCount}`);
        
        console.log('\n🚨 ISSUES:');
        console.log(`  JavaScript Errors: ${report.errors.jsErrors.length}`);
        console.log(`  Warnings: ${report.errors.warnings.length}`);
        console.log(`  Network Issues: ${report.errors.networkIssues.length}`);
        console.log(`  Animation Activity: ${report.errors.animationLogCount} events`);
        
        if (report.recommendations.length > 0) {
            console.log('\n💡 RECOMMENDATIONS:');
            report.recommendations.forEach(rec => {
                console.log(`  ${rec.priority}: ${rec.issue}`);
                console.log(`    → ${rec.solution}`);
            });
        }
        
        console.log('\n🎯 FINAL ASSESSMENT:');
        console.log(`  Overall Status: ${assessment.status === 'WORKING' ? '✅' : assessment.status === 'DEGRADED' ? '⚠️' : '❌'} ${assessment.status}`);
        console.log(`  Confidence Level: ${assessment.confidence}`);
        
        const workingFeatures = [];
        const brokenFeatures = [];
        
        if (report.motionLibrary.loaded) workingFeatures.push('Motion Library');
        else brokenFeatures.push('Motion Library');
        
        if (report.animationBehavior.manualTest.success) workingFeatures.push('Animation System');
        else brokenFeatures.push('Animation System');
        
        if (report.errors.animationLogCount > 0) workingFeatures.push('Scroll Detection');
        else brokenFeatures.push('Scroll Detection');
        
        if (report.pageStructure.sections > 5) workingFeatures.push('Page Structure');
        else brokenFeatures.push('Page Structure');
        
        console.log(`  Working: ${workingFeatures.join(', ')}`);
        if (brokenFeatures.length > 0) {
            console.log(`  Issues: ${brokenFeatures.join(', ')}`);
        }
        
        console.log('\n🏁 Report generated successfully!');
        
    } catch (error) {
        console.error('❌ Report generation failed:', error.message);
        report.errors.push({
            type: 'CRITICAL',
            message: error.message,
            stack: error.stack
        });
    } finally {
        await browser.close();
    }
    
    return report;
}

// Run the comprehensive test
generateAnimationReport().then(report => {
    // Could save report to file here if needed
    console.log('\n📋 Report object generated with full details.');
}).catch(console.error);