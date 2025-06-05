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

// Example of a page-specific callback that might be defined on individual HTML pages:
/*
window.onPageComponentsLoaded = async () => {
    console.log('All common components are loaded and initialized on this specific page.');
    // Initialize AOS for this page
    if (typeof AOS !== 'undefined' && AOS.init) {
        AOS.init({
            offset: window.innerWidth < 768 ? 50 : 80,
            duration: window.innerWidth < 768 ? 500 : 600,
            easing: 'ease-out-quad',
            once: true,
        });
        console.log('[script.js] AOS initialized for the page.');
    } else {
        console.warn('[script.js] AOS library not found on this page.');
    }

    // Other page-specific initializations can go here
    // e.g., if (typeof window.initPageSpecificSlider === 'function') window.initPageSpecificSlider();
};
*/
