// General utility functions
// This file should NOT contain logic for loading header/footer components or language initialization
// as that is handled by loadComponents.js and language.js respectively.

window.debounce = function(func, delay) {
    let debounceTimer;
    return function(...args) {
        const context = this;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
};

// Page-specific initializations (like AOS) that depend on components being loaded
// will now be called from loadComponents.js via onPageComponentsLoaded callback.

// Example structure for page-specific initialization (to be defined ON THE ACTUAL PAGE or in a page-specific JS file):
/*
if (typeof window.onPageComponentsLoaded === 'undefined') {
    window.onPageComponentsLoaded = async () => {
        // console.log('[Script.js onPageCallback] All common components are loaded and initialized.');
        
        // Initialize AOS for this page (example)
        if (typeof AOS !== 'undefined' && AOS.init) {
            AOS.init({
                offset: window.innerWidth < 768 ? 50 : 80, // Adjusted for mobile
                duration: window.innerWidth < 768 ? 500 : 600, // Faster on mobile
                easing: 'ease-out-quad',
                once: true, // Animate elements only once
            });
            // console.log('[Script.js onPageCallback] AOS initialized for the page.');
        } else {
            // console.warn('[Script.js onPageCallback] AOS library not found.');
        }

        // Example: Initialize a page-specific slider if a function for it exists
        // if (typeof window.initPageSpecificSlider === 'function') {
        //     window.initPageSpecificSlider();
        //     console.log('[Script.js onPageCallback] Page-specific slider initialized.');
        // }
    };
}
*/
