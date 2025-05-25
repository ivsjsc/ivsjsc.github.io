// js/about-page.js - Scripts specific to the About Us page

// Function to toggle mobile submenus, needs to be globally accessible
// if called via onclick attribute in dynamically loaded header.
window.toggleMobileSubmenu = function(button) {
    const submenu = button.nextElementSibling;
    // Check if the submenu element exists and has the correct class
    if (submenu && submenu.classList.contains('mobile-submenu-content')) {
        const icon = button.querySelector('i.mobile-submenu-icon');
        const isExpanded = button.getAttribute('aria-expanded') === 'true';

        if (isExpanded) {
            // Collapse the submenu
            submenu.style.maxHeight = '0px';
            if (icon) {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
            button.setAttribute('aria-expanded', 'false');
        } else {
            // Expand the submenu
            // Ensure submenu is visible to calculate scrollHeight correctly if it was display:none
            // submenu.style.display = 'block'; // Temporarily ensure it's block for scrollHeight
            submenu.style.maxHeight = submenu.scrollHeight + 'px';
            // submenu.style.removeProperty('display'); // Clean up if needed, though max-height handles visibility
            if (icon) {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            }
            button.setAttribute('aria-expanded', 'true');
        }
    } else {
        console.warn('[Script - about-page.js] Submenu element not found or missing class for toggle button:', button);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            offset: 120, 
            duration: 800, 
            easing: 'ease-in-out-cubic', 
            once: true, 
            mirror: false, 
            anchorPlacement: 'top-bottom',
        });
    } else {
        console.warn('[Script - about-page.js] AOS library not found.');
    }
    
    // Initialize Scroll-to-Top Button
    const scrollToTopBtnExisting = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtnExisting) {
        scrollToTopBtnExisting.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        window.addEventListener('scroll', () => {
            const btn = document.getElementById('scrollToTopBtn'); // Re-fetch in case it's removed/re-added
            if (btn) {
                btn.style.display = (window.pageYOffset > 100) ? 'flex' : 'none';
            }
        }, { passive: true });
    } else {
        // console.warn('[Script - about-page.js] scrollToTopBtn not found.');
    }
    
    // Load shared components (header, footer) and initialize their scripts
    if (typeof window.loadComponentsAndInitialize === 'function') {
        window.loadComponentsAndInitialize().then(() => {
            // Actions to perform after components are loaded and initialized
            if (typeof AOS !== 'undefined') {
                AOS.refresh(); 
            }
            // Initialize language settings if applicable and functions are available
            if (typeof window.updateLanguage === 'function' && typeof window.translations === 'object') {
                const currentLang = localStorage.getItem('language') || document.documentElement.lang || 'vi';
                window.updateLanguage(currentLang, window.translations);
            } else {
                // console.log("[Script - about-page.js] updateLanguage function or translations object not found on window. Language update skipped post component load.");
            }
        }).catch(error => {
            console.error("[Script - about-page.js] Error occurred during execution of loadComponentsAndInitialize:", error);
        });
    } else {
        console.error("[Script - about-page.js] 'window.loadComponentsAndInitialize' is not a function or not found. Ensure '/js/loadComponents.js' is loaded correctly and defines this function globally.");
    }
});
