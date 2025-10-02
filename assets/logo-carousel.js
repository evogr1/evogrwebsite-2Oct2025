// Logo Carousel Injection Script
(function() {
    'use strict';
    
    // Wait for the DOM to be ready
    function waitForElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
        } else {
            setTimeout(() => waitForElement(selector, callback), 100);
        }
    }
    
    // Create the logo carousel HTML
    function createLogoCarousel() {
        const carouselHTML = `
            <div class="logo-carousel-section">
                <div class="carousel-label">Trusted by leading organizations</div>
                <div class="logo-carousel">
                    <div class="logo-track">
                        <!-- First set of logos -->
                        <div class="logo-item">
                            <img src="assets/logos/schiebel.svg" alt="Schiebel">
                        </div>
                        <div class="logo-item">
                            <img src="assets/logos/mufin.svg" alt="Mufin">
                        </div>
                        <div class="logo-item">
                            <img src="assets/logos/chola-ms.svg" alt="Chola MS Risk Services">
                        </div>
                        <div class="logo-item">
                            <img src="assets/logos/manipal.svg" alt="Manipal Academy">
                        </div>
                        <div class="logo-item">
                            <img src="assets/logos/bennett.svg" alt="Bennett University">
                        </div>
                        <div class="logo-item">
                            <img src="assets/logos/tulip.svg" alt="Tulip Compression">
                        </div>
                        <div class="logo-item">
                            <img src="assets/logos/pharmeasy.svg" alt="PharmEasy">
                        </div>
                        <div class="logo-item">
                            <img src="assets/logos/hyundai.svg" alt="Hyundai">
                        </div>
                        <div class="logo-item">
                            <img src="assets/logos/gmr.svg" alt="GMR">
                        </div>
                        <div class="logo-item">
                            <img src="assets/logos/matrix.svg" alt="Matrix Smart Technologies">
                        </div>
                        <div class="logo-item">
                            <img src="assets/logos/vem.svg" alt="VEM">
                        </div>
                        
                        <!-- Duplicate set for seamless loop -->
                        <div class="logo-item">
                            <img src="assets/logos/schiebel.svg" alt="Schiebel">
                        </div>
                        <div class="logo-item">
                            <img src="assets/logos/mufin.svg" alt="Mufin">
                        </div>
                        <div class="logo-item">
                            <img src="assets/logos/chola-ms.svg" alt="Chola MS Risk Services">
                        </div>
                        <div class="logo-item">
                            <img src="assets/logos/manipal.svg" alt="Manipal Academy">
                        </div>
                        <div class="logo-item">
                            <img src="assets/logos/bennett.svg" alt="Bennett University">
                        </div>
                        <div class="logo-item">
                            <img src="assets/logos/tulip.svg" alt="Tulip Compression">
                        </div>
                        <div class="logo-item">
                            <img src="assets/logos/pharmeasy.svg" alt="PharmEasy">
                        </div>
                        <div class="logo-item">
                            <img src="assets/logos/hyundai.svg" alt="Hyundai">
                        </div>
                        <div class="logo-item">
                            <img src="assets/logos/gmr.svg" alt="GMR">
                        </div>
                        <div class="logo-item">
                            <img src="assets/logos/matrix.svg" alt="Matrix Smart Technologies">
                        </div>
                        <div class="logo-item">
                            <img src="assets/logos/vem.svg" alt="VEM">
                        </div>
                    </div>
                </div>
            </div>
        `;
        return carouselHTML;
    }
    
    // Function to replace bouncing animation with logo carousel
    function replaceBounceWithCarousel() {
        // Look for elements with animate-bounce class
        const bounceElements = document.querySelectorAll('.animate-bounce');
        
        if (bounceElements.length > 0) {
            // Replace the first bouncing element with our carousel
            const targetElement = bounceElements[0];
            const carouselContainer = document.createElement('div');
            carouselContainer.innerHTML = createLogoCarousel();
            
            // Replace the bouncing element with the carousel
            targetElement.parentNode.replaceChild(carouselContainer.firstElementChild, targetElement);
            
            console.log('✅ Logo carousel successfully replaced bouncing animation');
        } else {
            // If no bouncing animation found, try to find a suitable container
            const heroSection = document.querySelector('section') || 
                              document.querySelector('.hero') || 
                              document.querySelector('main') ||
                              document.querySelector('#root > div');
            
            if (heroSection) {
                const carouselContainer = document.createElement('div');
                carouselContainer.innerHTML = createLogoCarousel();
                heroSection.appendChild(carouselContainer.firstElementChild);
                console.log('✅ Logo carousel added to hero section');
            }
        }
    }
    
    // Function to inject CSS
    function injectCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'assets/logo-carousel.css';
        document.head.appendChild(link);
    }
    
    // Initialize when DOM is ready
    function init() {
        // Inject CSS first
        injectCSS();
        
        // Wait for React to render, then replace the bouncing animation
        setTimeout(() => {
            replaceBounceWithCarousel();
        }, 1000);
        
        // Also try again after a longer delay in case React takes time to load
        setTimeout(() => {
            if (!document.querySelector('.logo-carousel-section')) {
                replaceBounceWithCarousel();
            }
        }, 3000);
    }
    
    // Start when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
