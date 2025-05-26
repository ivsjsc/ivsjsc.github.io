/**
 * @file loadComponents.js
 * Handles loading of shared HTML components (header, footer, FAB)
 * and initializes their respective JavaScript functionalities.
 */

// Flags to prevent multiple initializations
let componentsLoadedAndInitialized = false;
let headerInitialized = false;
let fabInitialized = false;

/**
 * Logs messages if debug mode is enabled.
 * @param {string} message The message to log.
 * @param {'log' | 'warn' | 'error'} type The type of log.
 */
function componentLog(message, type = 'log') {
    const debugMode = false; // Set to true to enable logs from this file
    if (debugMode || type === 'error' || type === 'warn') {
        console[type](`[loadComponents.js] ${message}`);
    }
}

/**
 * Loads an HTML component into a specified placeholder or directly into the DOM.
 * @param {string} componentName User-friendly name for logging.
 * @param {string | null} placeholderId ID of the placeholder element. Null if appending to body.
 * @param {string} filePath Path to the HTML component file.
 * @param {'placeholder' | 'body'} targetType Type of target for insertion.
 * @returns {Promise<boolean>} True if loaded successfully, false otherwise.
 */
async function loadComponent(componentName, placeholderId, filePath, targetType = 'placeholder') {
    componentLog(`Attempting to load component: ${componentName} from ${filePath}`);
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status} for ${filePath}`);
        }
        const html = await response.text();

        if (targetType === 'body' && placeholderId === null) {
            document.body.insertAdjacentHTML('beforeend', html);
            componentLog(`${componentName} appended to body.`);
        } else if (placeholderId) {
            const placeholder = document.getElementById(placeholderId);
            if (placeholder) {
                placeholder.innerHTML = html;
                componentLog(`${componentName} injected into #${placeholderId}.`);
            } else {
                componentLog(`Placeholder element #${placeholderId} for ${componentName} not found.`, 'error');
                return false;
            }
        } else {
            componentLog(`Invalid target or placeholderId for ${componentName}.`, 'error');
            return false;
        }
        return true;
    } catch (error) {
        componentLog(`Error loading ${componentName} from ${filePath}: ${error.message}`, 'error');
        return false;
    }
}

/**
 * Initializes the main header functionalities.
 */
function initializeHeaderInternal() {
    if (headerInitialized) {
        componentLog("Header already initialized. Skipping.", 'warn');
        return;
    }
    componentLog("Initializing header...");

    const mainHeader = document.getElementById('main-header');
    if (!mainHeader) {
        componentLog("Main header element (#main-header) not found. Cannot initialize.", 'error');
        return;
    }

    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenuPanel = document.getElementById('mobile-menu-panel');
    const iconMenuOpen = document.getElementById('icon-menu-open');
    const iconMenuClose = document.getElementById('icon-menu-close');

    if (mobileMenuButton && mobileMenuPanel && iconMenuOpen && iconMenuClose) {
        mobileMenuButton.addEventListener('click', () => {
            const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
            mobileMenuButton.setAttribute('aria-expanded', String(!isExpanded));
            mobileMenuPanel.classList.toggle('hidden');
            iconMenuOpen.classList.toggle('hidden');
            iconMenuClose.classList.toggle('hidden');
            document.body.classList.toggle('overflow-hidden', !isExpanded); // Add when menu is open
            componentLog(`Mobile menu toggled. Expanded: ${!isExpanded}`);
        });
    } else {
        componentLog("Mobile menu elements not all found. Functionality may be limited.", 'warn');
    }

    // Mobile Submenu Toggles
    const mobileSubmenuToggles = mainHeader.querySelectorAll('.mobile-submenu-toggle');
    mobileSubmenuToggles.forEach(toggle => {
        const submenuContent = document.getElementById(toggle.getAttribute('aria-controls'));
        const icon = toggle.querySelector('.mobile-submenu-icon');

        if (submenuContent) {
            toggle.addEventListener('click', () => {
                const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                
                // Close other open submenus
                if (!isExpanded) { // Only close others if we are about to open this one
                    mobileSubmenuToggles.forEach(otherToggle => {
                        if (otherToggle !== toggle) {
                            const otherSubmenu = document.getElementById(otherToggle.getAttribute('aria-controls'));
                            const otherIcon = otherToggle.querySelector('.mobile-submenu-icon');
                            if (otherSubmenu && !otherSubmenu.classList.contains('max-h-0')) {
                                otherSubmenu.classList.add('max-h-0');
                                otherSubmenu.classList.remove('max-h-screen'); // Or a sufficiently large max-height
                                otherToggle.setAttribute('aria-expanded', 'false');
                                if (otherIcon) {
                                    otherIcon.classList.remove('rotate-180');
                                }
                            }
                        }
                    });
                }

                // Toggle current submenu
                submenuContent.classList.toggle('max-h-0', isExpanded);
                submenuContent.classList.toggle('max-h-screen', !isExpanded); // Use a large enough max-height
                toggle.setAttribute('aria-expanded', String(!isExpanded));
                if (icon) {
                    icon.classList.toggle('rotate-180', !isExpanded);
                }
                componentLog(`Mobile submenu '${submenuContent.id}' toggled. Expanded: ${!isExpanded}`);
            });
        } else {
            componentLog(`Submenu content for toggle '${toggle.textContent.trim()}' not found.`, 'warn');
        }
    });

    // Desktop Dropdown/Mega Menu (CSS driven via group-hover, but JS for ARIA and Esc key)
    const desktopNavGroups = mainHeader.querySelectorAll('nav.hidden.md\\:flex .group');
    desktopNavGroups.forEach(group => {
        const button = group.querySelector('button[aria-haspopup="true"]');
        const menu = group.querySelector('.mega-menu, .desktop-dropdown-menu');

        if (button && menu) {
            button.addEventListener('focus', () => { // Show on focus for keyboard nav
                menu.style.opacity = '1';
                menu.style.visibility = 'visible';
                menu.style.pointerEvents = 'auto';
                menu.style.transform = 'translateY(0)';
                button.setAttribute('aria-expanded', 'true');
            });
            
            // Handling mouseenter/mouseleave for ARIA (visuals by CSS)
             group.addEventListener('mouseenter', () => button.setAttribute('aria-expanded', 'true'));
             group.addEventListener('mouseleave', () => button.setAttribute('aria-expanded', 'false'));


            // Close with Escape key
            menu.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    menu.style.opacity = '0';
                    menu.style.visibility = 'hidden';
                    menu.style.pointerEvents = 'none';
                    menu.style.transform = 'translateY(5px)';
                    button.setAttribute('aria-expanded', 'false');
                    button.focus();
                }
            });
            // Hide menu when focus moves out of the group
            group.addEventListener('focusout', (e) => {
                if (!group.contains(e.relatedTarget)) {
                    menu.style.opacity = '0';
                    menu.style.visibility = 'hidden';
                    menu.style.pointerEvents = 'none';
                    menu.style.transform = 'translateY(5px)';
                    button.setAttribute('aria-expanded', 'false');
                }
            });
        }
    });
    
    // Close mobile menu with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            if (mobileMenuPanel && !mobileMenuPanel.classList.contains('hidden')) {
                mobileMenuButton.click(); // Simulate click to close and reset states
            }
        }
    });

    headerInitialized = true;
    componentLog("Header initialized successfully.");
    
    // Call language button initialization from here if it's tightly coupled with header elements
    // This ensures language buttons within the header are set up after header is ready.
    if (typeof window.initializeLanguageButtons === 'function') {
        window.initializeLanguageButtons(); // From language.js
    } else {
        componentLog("window.initializeLanguageButtons not found. Language buttons in header might not work.", 'warn');
    }
}
window.initializeHeader = initializeHeaderInternal; // Expose for potential direct calls if absolutely needed elsewhere


/**
 * Initializes Floating Action Buttons (FAB).
 */
function initializeFabButtonsInternal() {
    if (fabInitialized) {
        componentLog("FABs already initialized. Skipping.", 'warn');
        return;
    }
    componentLog("Initializing FABs...");
    const fabElements = {
        contactMainBtn: document.getElementById('contact-main-btn'),
        contactOptions: document.getElementById('contact-options'),
        shareMainBtn: document.getElementById('share-main-btn'),
        shareOptions: document.getElementById('share-options'),
        scrollToTopBtn: document.getElementById('scroll-to-top-btn')
    };

    if (!fabElements.scrollToTopBtn) { // Check for a core FAB element
        componentLog("Scroll-to-top button not found, assuming FABs are not present or core FAB elements missing.", 'warn');
        return; // Don't proceed if essential FABs aren't there
    }

    const toggleFabMenu = (btn, menu) => {
        if (btn && menu) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isHidden = menu.classList.toggle('fab-hidden'); // fab-hidden should control visibility
                btn.setAttribute('aria-expanded', String(!isHidden));
                // Auto-close other FAB menu if open
                if (!isHidden) { // If current menu was opened
                    if (btn === fabElements.contactMainBtn && fabElements.shareOptions && !fabElements.shareOptions.classList.contains('fab-hidden')) {
                        fabElements.shareOptions.classList.add('fab-hidden');
                        if(fabElements.shareMainBtn) fabElements.shareMainBtn.setAttribute('aria-expanded', 'false');
                    } else if (btn === fabElements.shareMainBtn && fabElements.contactOptions && !fabElements.contactOptions.classList.contains('fab-hidden')) {
                        fabElements.contactOptions.classList.add('fab-hidden');
                        if(fabElements.contactMainBtn) fabElements.contactMainBtn.setAttribute('aria-expanded', 'false');
                    }
                }
            });
        }
    };

    toggleFabMenu(fabElements.contactMainBtn, fabElements.contactOptions);
    toggleFabMenu(fabElements.shareMainBtn, fabElements.shareOptions);
    
    fabElements.scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', window.debounce(() => {
        if (fabElements.scrollToTopBtn) {
            fabElements.scrollToTopBtn.classList.toggle('fab-hidden', window.pageYOffset <= 100);
        }
    }, 150), { passive: true });


    document.addEventListener('click', (e) => {
        if (fabElements.contactOptions && !fabElements.contactOptions.classList.contains('fab-hidden') && fabElements.contactMainBtn && !fabElements.contactMainBtn.contains(e.target) && !fabElements.contactOptions.contains(e.target)) {
            fabElements.contactOptions.classList.add('fab-hidden');
            fabElements.contactMainBtn.setAttribute('aria-expanded', 'false');
        }
        if (fabElements.shareOptions && !fabElements.shareOptions.classList.contains('fab-hidden') && fabElements.shareMainBtn && !fabElements.shareMainBtn.contains(e.target) && !fabElements.shareOptions.contains(e.target)) {
            fabElements.shareOptions.classList.add('fab-hidden');
            fabElements.shareMainBtn.setAttribute('aria-expanded', 'false');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (fabElements.contactOptions && !fabElements.contactOptions.classList.contains('fab-hidden')) {
                fabElements.contactOptions.classList.add('fab-hidden');
                if(fabElements.contactMainBtn) {
                    fabElements.contactMainBtn.setAttribute('aria-expanded', 'false');
                    fabElements.contactMainBtn.focus();
                }
            }
            if (fabElements.shareOptions && !fabElements.shareOptions.classList.contains('fab-hidden')) {
                fabElements.shareOptions.classList.add('fab-hidden');
                if(fabElements.shareMainBtn) {
                    fabElements.shareMainBtn.setAttribute('aria-expanded', 'false');
                    fabElements.shareMainBtn.focus();
                }
            }
        }
    });
    fabInitialized = true;
    componentLog("FABs initialized successfully.");
}
// Expose to window if script.js or other files need to call it directly (though ideally not)
window.initializeFabButtons = initializeFabButtonsInternal;


/**
 * Main function to load all core components and initialize them.
 * This should be the primary entry point called by pages.
 */
window.loadHeaderFooterAndFab = async function() {
    if (componentsLoadedAndInitialized) {
        componentLog("Core components already loaded and initialized. Skipping.", 'warn');
        return;
    }
    componentLog("Starting to load core components (Header, Footer, FAB)...");

    // Load HTML components
    // Ensure placeholder IDs match those in your main HTML files (e.g., index.html)
    const headerLoaded = await loadComponent('Header', 'header-placeholder', '/components/header.html', 'placeholder');
    // const footerLoaded = await loadComponent('Footer', 'footer-placeholder', '/components/footer.html', 'placeholder');
    const fabLoaded = await loadComponent('FAB', null, '/components/fab-container.html', 'body');

    // Initialize components after their HTML is loaded
    if (headerLoaded) {
        initializeHeaderInternal(); // Use internal function to respect the flag
    } else {
        componentLog("Header HTML failed to load, skipping its initialization.", 'error');
    }

    // if (footerLoaded && typeof window.initializeFooter === 'function') {
    //     window.initializeFooter();
    // } else if (footerLoaded) {
    //     componentLog("Footer loaded but window.initializeFooter function not found.", 'warn');
    // } else {
    //     componentLog("Footer HTML failed to load, skipping its initialization.", 'error');
    // }

    if (fabLoaded) {
        initializeFabButtonsInternal(); // Use internal function
    } else {
        componentLog("FAB container HTML failed to load, skipping FAB initialization.", 'error');
    }

    // Initialize language system (should be defined in language.js)
    // This should be called after components that contain translatable text are loaded.
    if (typeof window.initializeLanguageSystem === 'function') {
        try {
            await window.initializeLanguageSystem(); // This will also call initializeLanguageButtons
            componentLog("Language system initialized.");
        } catch (error) {
            componentLog(`Error initializing language system: ${error.message}`, 'error');
        }
    } else {
        componentLog("window.initializeLanguageSystem not found. Language features may not work.", 'error');
    }
    
    componentsLoadedAndInitialized = true;
    componentLog("Core components loading and initialization process finished.");
};

// Automatically load components when the DOM is ready.
// This should be the ONLY entry point for loading these components.
// Ensure your main HTML (e.g., index.html) does NOT call loadHeaderFooterAndFab or initializeHeader directly.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.loadHeaderFooterAndFab);
} else {
    // DOMContentLoaded has already fired
    if (!componentsLoadedAndInitialized) { // Check flag before calling if script is loaded dynamically later
        window.loadHeaderFooterAndFab();
    }
}
