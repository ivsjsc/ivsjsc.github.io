/**
 * Loads an HTML component into a specified placeholder element or directly into the DOM.
 * @param {string} placeholderId The ID of the HTML element where the component will be loaded (optional for fixed elements).
 * @param {string} filePath The path to the HTML component file.
 * @param {string} targetElement The target element to append the component (defaults to 'body').
 */
async function loadComponent(placeholderId, filePath, targetElement = 'body') {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Failed to load component from ${filePath}: ${response.statusText}`);
        }
        const html = await response.text();

        if (targetElement === 'body') {
            document.body.insertAdjacentHTML('beforeend', html);
        } else {
            const placeholder = document.getElementById(placeholderId);
            if (placeholder) {
                placeholder.innerHTML = html;
            } else {
                console.error(`[loadComponents.js] Placeholder element with id '${placeholderId}' not found.`);
            }
        }
    } catch (error) {
        console.error(`[loadComponents.js] Error loading component from ${filePath}:`, error);
        if (targetElement !== 'body') {
            const placeholder = document.getElementById(placeholderId);
            if (placeholder) {
                // Optional: Display an error message in the placeholder
                // placeholder.innerHTML = `<p class="text-red-500">Error loading component: ${filePath}</p>`;
            }
        }
    }
}

/**
 * Initializes the Floating Action Buttons (FAB).
 * This function should be called after fab-container.html is loaded.
 */
function initializeFabButtonsInternal() { // Renamed to avoid global scope conflict if script.js also has it
    const fabElements = {
        contactMainBtn: document.getElementById('contact-main-btn'),
        contactOptions: document.getElementById('contact-options'),
        shareMainBtn: document.getElementById('share-main-btn'),
        shareOptions: document.getElementById('share-options'),
        scrollToTopBtn: document.getElementById('scroll-to-top-btn')
    };

    if (!fabElements.contactMainBtn || !fabElements.scrollToTopBtn) {
        // console.warn("[loadComponents.js] FAB elements not found, skipping initialization.");
        return;
    }

    // Contact menu toggle
    if (fabElements.contactMainBtn && fabElements.contactOptions) {
        fabElements.contactMainBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            fabElements.contactOptions.classList.toggle('fab-hidden');
            fabElements.contactMainBtn.setAttribute('aria-expanded', fabElements.contactOptions.classList.contains('fab-hidden') ? 'false' : 'true');
            // Hide share options if open
            if (fabElements.shareOptions && !fabElements.shareOptions.classList.contains('fab-hidden')) {
                fabElements.shareOptions.classList.add('fab-hidden');
                if (fabElements.shareMainBtn) fabElements.shareMainBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Share menu toggle (if exists)
    if (fabElements.shareMainBtn && fabElements.shareOptions) {
        fabElements.shareMainBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            fabElements.shareOptions.classList.toggle('fab-hidden');
            fabElements.shareMainBtn.setAttribute('aria-expanded', fabElements.shareOptions.classList.contains('fab-hidden') ? 'false' : 'true');
            // Hide contact options if open
            if (fabElements.contactOptions && !fabElements.contactOptions.classList.contains('fab-hidden')) {
                fabElements.contactOptions.classList.add('fab-hidden');
                if (fabElements.contactMainBtn) fabElements.contactMainBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    // Scroll to top button functionality
    fabElements.scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        fabElements.scrollToTopBtn.setAttribute('aria-pressed', 'true');
        setTimeout(() => fabElements.scrollToTopBtn.setAttribute('aria-pressed', 'false'), 1000);
    });

    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollPosition > 100) {
            fabElements.scrollToTopBtn.classList.remove('fab-hidden');
        } else {
            fabElements.scrollToTopBtn.classList.add('fab-hidden');
        }
    }, { passive: true });


    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (fabElements.shareMainBtn && fabElements.shareOptions && !fabElements.shareMainBtn.contains(e.target) && !fabElements.shareOptions.contains(e.target)) {
            fabElements.shareOptions.classList.add('fab-hidden');
            fabElements.shareMainBtn.setAttribute('aria-expanded', 'false');
        }
        if (fabElements.contactMainBtn && fabElements.contactOptions && !fabElements.contactMainBtn.contains(e.target) && !fabElements.contactOptions.contains(e.target)) {
            fabElements.contactOptions.classList.add('fab-hidden');
            fabElements.contactMainBtn.setAttribute('aria-expanded', 'false');
        }
    });

    // Keyboard accessibility for FAB menus
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (fabElements.contactOptions && !fabElements.contactOptions.classList.contains('fab-hidden')) {
                fabElements.contactOptions.classList.add('fab-hidden');
                fabElements.contactMainBtn.setAttribute('aria-expanded', 'false');
                fabElements.contactMainBtn.focus();
            }
            if (fabElements.shareOptions && !fabElements.shareOptions.classList.contains('fab-hidden')) {
                fabElements.shareOptions.classList.add('fab-hidden');
                fabElements.shareMainBtn.setAttribute('aria-expanded', 'false');
                fabElements.shareMainBtn.focus();
            }
        }
    });
}


/**
 * Main initialization logic for the header component.
 * This function should be called after header.html is loaded into the DOM.
 */
window.initializeHeader = function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileSubmenuToggles = document.querySelectorAll('.mobile-submenu-toggle');
    const headerElement = document.getElementById('main-header');
    const searchInputDesktop = document.getElementById('search-input-desktop');
    const searchInputMobile = document.getElementById('search-input-mobile');
    const mobileSearchButton = document.getElementById('mobile-search-button');
    const mobileSearchContainer = document.getElementById('mobile-search-container');

    // Toggle mobile menu
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            const isExpanded = mobileMenu.classList.toggle('hidden');
            mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
            if (mobileSearchContainer && !mobileSearchContainer.classList.contains('hidden')) {
                mobileSearchContainer.classList.add('hidden'); // Hide search if menu opens
            }
        });
    }

    // Toggle mobile submenus
    mobileSubmenuToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const submenuContent = toggle.nextElementSibling;
            const icon = toggle.querySelector('i.fa-chevron-down');
            if (submenuContent) {
                const isExpanded = submenuContent.style.maxHeight && submenuContent.style.maxHeight !== '0px';
                if (isExpanded) {
                    submenuContent.style.maxHeight = '0px';
                    toggle.setAttribute('aria-expanded', 'false');
                    if (icon) icon.classList.remove('rotate-180');
                } else {
                    submenuContent.style.maxHeight = submenuContent.scrollHeight + "px";
                    toggle.setAttribute('aria-expanded', 'true');
                    if (icon) icon.classList.add('rotate-180');
                }
            }
        });
    });
    
    // Desktop dropdown menu handlers
    const desktopDropdownButtons = document.querySelectorAll('.desktop-nav .group > button');
    desktopDropdownButtons.forEach(button => {
        const menu = button.nextElementSibling; // Assuming ul is the next sibling
        if (menu) {
            // Aria-expanded is handled by hover/focus via CSS for desktop
            // but good to set initial state
            button.setAttribute('aria-expanded', 'false');
            menu.addEventListener('mouseenter', () => button.setAttribute('aria-expanded', 'true'));
            menu.addEventListener('mouseleave', () => button.setAttribute('aria-expanded', 'false'));
            button.addEventListener('focus', () => menu.style.display = 'block'); // Show on focus
            // Basic keyboard nav for dropdowns
            const links = menu.querySelectorAll('a');
            links.forEach((link, index) => {
                link.addEventListener('keydown', (e) => {
                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        if (index < links.length - 1) links[index+1].focus();
                    } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        if (index > 0) links[index-1].focus();
                    } else if (e.key === 'Escape') {
                        e.preventDefault();
                        menu.style.display = 'none';
                        button.focus();
                        button.setAttribute('aria-expanded', 'false');
                    }
                });
            });
            // Hide menu when focus moves out
            document.addEventListener('focusin', (e) => {
                if (!button.contains(e.target) && !menu.contains(e.target)) {
                     // Only hide if not using hover
                    if (!menu.matches(':hover') && !button.matches(':hover')) {
                         menu.style.display = 'none';
                         button.setAttribute('aria-expanded', 'false');
                    }
                }
            });
        }
    });


    // Sticky header (basic version, no offset calculation)
    // Tailwind's `sticky` class handles this if applied directly.
    // If more complex logic is needed (e.g., changing style on scroll), it would go here.
    // For now, assuming Tailwind's 'sticky' class is sufficient.

    // Search functionality (placeholder console logs)
    if (searchInputDesktop) {
        searchInputDesktop.addEventListener('input', window.debounce(function() {
            console.log('Desktop search input:', this.value);
            // Implement actual search logic here
        }, 300));
    }
    if (searchInputMobile) {
        searchInputMobile.addEventListener('input', window.debounce(function() {
            console.log('Mobile search input:', this.value);
            // Implement actual search logic here
        }, 300));
    }
    if (mobileSearchButton && mobileSearchContainer) {
        mobileSearchButton.addEventListener('click', () => {
            mobileSearchContainer.classList.toggle('hidden');
            if (!mobileSearchContainer.classList.contains('hidden')) {
                searchInputMobile.focus();
                if(mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden'); // Hide menu if search opens
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                }
            }
        });
    }

    // Closing menus with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            // Close mobile menu
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                if (mobileMenuButton) mobileMenuButton.setAttribute('aria-expanded', 'false');
            }
            // Close mobile search
            if (mobileSearchContainer && !mobileSearchContainer.classList.contains('hidden')) {
                mobileSearchContainer.classList.add('hidden');
            }
            // Close desktop dropdowns (they should ideally handle this internally too)
            document.querySelectorAll('.desktop-submenu').forEach(submenu => {
                submenu.style.display = 'none';
                const btn = submenu.previousElementSibling;
                if (btn) btn.setAttribute('aria-expanded', 'false');
            });
        }
    });

    // Update language button active state - this part is now handled by language.js
    // The `initializeLanguageButtons` from `language.js` should handle this.
    // However, ensuring buttons get the 'active-lang' class initially might still be needed here
    // or preferably within language.js after translations are applied.
    // For now, ensure `language.js` handles setting the active class.
    // If `window.getCurrentLanguage` and `window.applyTranslations` are available here:
    if (typeof window.getCurrentLanguage === 'function') {
        const currentLang = window.getCurrentLanguage();
        document.querySelectorAll('.lang-button').forEach(button => {
            if (button.dataset.lang === currentLang) {
                button.classList.add('active-lang');
                button.setAttribute('aria-pressed', 'true');
            } else {
                button.classList.remove('active-lang');
                button.setAttribute('aria-pressed', 'false');
            }
        });
    } else {
        console.warn('[initializeHeader] window.getCurrentLanguage is not defined. Language buttons active state might not be set correctly at init.');
    }
    console.log("Header initialized via js/loadComponents.js");
};


/**
 * Loads header, footer, and FAB components and initializes them.
 */
window.loadHeaderAndFooter = async function() {
    try {
        await Promise.all([
            loadComponent('header-placeholder', '/components/header.html', 'placeholder'),
            loadComponent('footer-placeholder', '/components/footer.html', 'placeholder'),
            loadComponent(null, '/components/fab-container.html', 'body') // Loads FAB into body
        ]);

        // Call initialization functions AFTER components are loaded
        if (typeof window.initializeHeader === 'function') {
            window.initializeHeader();
        } else {
            console.error("initializeHeader function not found after loading header.");
        }
        
        // Footer specific initialization (if any) could be called here
        // if (typeof window.initializeFooter === 'function') { window.initializeFooter(); }

        initializeFabButtonsInternal(); // Call the internal FAB initializer

        // Initialize language system - this will also call initializeLanguageButtons from language.js
        if (typeof window.initializeLanguageSystem === 'function') {
            await window.initializeLanguageSystem();
        } else {
            console.error("initializeLanguageSystem function not found. Language features may not work.");
        }

    } catch (error) {
        console.error("[loadComponents.js] Error loading core components:", error);
    }
};

// Ensure loadHeaderAndFooter is called when the DOM is ready
// This replaces the individual component loaders in index.html or other pages.
// Pages should now only need to include this script and then this script handles loading all components.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.loadHeaderAndFooter);
} else {
    window.loadHeaderAndFooter(); // Already loaded
}