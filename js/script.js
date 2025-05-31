// General utility functions and FAB button initialization
// This file should NOT contain logic for loading header/footer components or language initialization
// as that is handled by loadComponents.js and language.js respectively.

/**
 * Debounces a function call, ensuring it's only executed after a specified delay.
 * Useful for events like window resizing or search input to limit execution frequency.
 * @param {Function} func The function to debounce.
 * @param {number} delay The delay in milliseconds.
 * @returns {Function} The debounced function.
 */
window.debounce = function(func, delay) {
    let debounceTimer;
    return function(...args) {
        const context = this;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
};

/**
 * Initializes the Floating Action Buttons (FAB) for contact, share, and scroll-to-top.
 * Attaches event listeners and manages their visibility and submenu toggling.
 */
window.initializeFabButtons = function() {
    const fabElements = {
        contactMainBtn: document.getElementById('contact-main-btn'),
        contactOptions: document.getElementById('contact-options'),
        shareMainBtn: document.getElementById('share-main-btn'),
        shareOptions: document.getElementById('share-options'),
        scrollToTopBtn: document.getElementById('scroll-to-top-btn')
    };

    // Check if all necessary FAB elements exist before proceeding
    if (!fabElements.contactMainBtn || !fabElements.contactOptions || !fabElements.shareMainBtn || !fabElements.shareOptions || !fabElements.scrollToTopBtn) {
        console.warn("[script.js] One or more FAB elements not found. FAB functionality will be limited.");
        return;
    }

    /**
     * Toggles the visibility of a submenu and updates aria-expanded attribute.
     * Hides other open submenus to ensure only one is active at a time.
     * @param {HTMLElement} button The main button that triggers the submenu.
     * @param {HTMLElement} submenu The submenu element to toggle.
     */
    function toggleSubmenu(button, submenu) {
        const isHidden = submenu.classList.contains('fab-hidden');
        // Hide other submenus if they are open
        [fabElements.contactOptions, fabElements.shareOptions].forEach(menu => {
            if (menu !== submenu && !menu.classList.contains('fab-hidden')) {
                menu.classList.add('fab-hidden');
                const associatedBtn = menu === fabElements.contactOptions ? fabElements.contactMainBtn : fabElements.shareMainBtn;
                associatedBtn.setAttribute('aria-expanded', 'false');
            }
        });
        // Toggle the target submenu
        submenu.classList.toggle('fab-hidden');
        button.setAttribute('aria-expanded', String(submenu.classList.contains('fab-hidden') ? 'false' : 'true'));
        // Focus on the first option if submenu is shown, or back on the button if hidden
        if (!submenu.classList.contains('fab-hidden')) {
            const firstOption = submenu.querySelector('a');
            if (firstOption) firstOption.focus();
        } else {
            button.focus();
        }
    }

    // Event listeners for main contact and share buttons
    fabElements.contactMainBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleSubmenu(fabElements.contactMainBtn, fabElements.contactOptions); });
    fabElements.shareMainBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleSubmenu(fabElements.shareMainBtn, fabElements.shareOptions); });
    
    // Set up share links for Facebook and Zalo
    const pageUrl = window.location.href;
    const pageTitle = document.title;
    const shareFacebook = document.getElementById('share-facebook');
    if(shareFacebook) { 
        shareFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`; 
        shareFacebook.target = '_blank';
    }
    const shareZalo = document.getElementById('share-zalo');
    if(shareZalo) { 
        shareZalo.href = `https://zalo.me/share?text=${encodeURIComponent(pageTitle + " - " + pageUrl)}`; 
        shareZalo.target = '_blank';
    }

    // Close submenus when clicking outside
    document.addEventListener('click', (e) => {
        if (!fabElements.contactOptions.classList.contains('fab-hidden') && !fabElements.contactMainBtn.contains(e.target) && !fabElements.contactOptions.contains(e.target)) {
            fabElements.contactOptions.classList.add('fab-hidden'); 
            fabElements.contactMainBtn.setAttribute('aria-expanded', 'false');
        }
        if (!fabElements.shareOptions.classList.contains('fab-hidden') && !fabElements.shareMainBtn.contains(e.target) && !fabElements.shareOptions.contains(e.target)) {
            fabElements.shareOptions.classList.add('fab-hidden'); 
            fabElements.shareMainBtn.setAttribute('aria-expanded', 'false');
        }
    });

    // Close submenus when Escape key is pressed
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            [fabElements.contactOptions, fabElements.shareOptions].forEach(menu => {
                if (!menu.classList.contains('fab-hidden')) {
                    menu.classList.add('fab-hidden');
                    const associatedBtn = menu === fabElements.contactOptions ? fabElements.contactMainBtn : fabElements.shareMainBtn;
                    associatedBtn.setAttribute('aria-expanded', 'false'); 
                    associatedBtn.focus(); // Return focus to the main button
                }
            });
        }
    });

    // Toggle scroll-to-top button visibility based on scroll position
    window.addEventListener('scroll', () => {
        fabElements.scrollToTopBtn.classList.toggle('fab-hidden', window.pageYOffset <= 100);
        fabElements.scrollToTopBtn.classList.toggle('flex', window.pageYOffset > 100);
    }, { passive: true });

    // Scroll to top when the button is clicked
    fabElements.scrollToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
};

// Removed redundant handleHeaderScroll as loadComponents.js now handles header visibility
// Removed window.initializeUI as loadComponents.js is the orchestrator
// Removed fetchPosts as posts-loader.js now handles this and is called by loadComponents.js
