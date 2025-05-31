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

// Removed window.initializeFabButtons as it's now handled by loadComponents.js
// Removed redundant handleHeaderScroll as loadComponents.js now handles header visibility
// Removed window.initializeUI as loadComponents.js is the orchestrator
// Removed fetchPosts as posts-loader.js now handles this and is called by loadComponents.js
