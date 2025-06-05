'use strict';

window.componentState = window.componentState || {
    componentsLoadedAndInitialized: false,
    headerInitialized: false,
    fabInitialized: false,
    footerInitialized: false,
    headerElement: null,
    isMobileMenuOpen: false,
};

function componentLog(message, type = 'log') {
    const debugMode = true; // Enable for development
    if (debugMode || type === 'error' || type === 'warn') {
        console[type](`[loadComponents.js] ${message}`);
    }
}

function isMobileDevice() {
    return window.innerWidth < 768; // Changed to < 768 to align with Tailwind's 'md' breakpoint
}

function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const context = this;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

async function loadComponent(componentName, placeholderId, filePath) {
    componentLog(`Attempting to load: ${componentName} from ${filePath} into #${placeholderId}`);
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`HTTP ${response.status} for ${filePath}`);
        const html = await response.text();
        const placeholder = document.getElementById(placeholderId);
        if (placeholder) {
            placeholder.innerHTML = html;
            componentLog(`${componentName} injected into #${placeholderId}.`);
            return true;
        }
        throw new Error(`Placeholder #${placeholderId} not found.`);
    } catch (error) {
        componentLog(`Error loading ${componentName}: ${error.message}`, 'error');
        const placeholder = document.getElementById(placeholderId);
        if (placeholder) placeholder.innerHTML = `<div class="p-3 text-center text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 rounded-md">Error loading ${componentName}.</div>`;
        return false;
    }
}

function initializeHeaderInternal() {
    if (window.componentState.headerInitialized) {
        componentLog('Header already initialized.', 'warn');
        return;
    }
    try {
        const header = document.getElementById('main-header');
        if (!header) throw new Error('Main header element (#main-header) not found.');
        window.componentState.headerElement = header;

        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenuBottomButton = document.getElementById('mobile-menu-bottom-toggle'); // For bottom nav
        const mobileMenuPanel = document.getElementById('mobile-menu-panel');
        const mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop');
        const mobileMenuContainer = document.getElementById('mobile-menu-container');
        const mobileMenuCloseBtn = document.getElementById('mobile-menu-close-btn');
        const iconOpen = header.querySelector('.icon-menu-open');
        const iconClose = header.querySelector('.icon-menu-close');

        if (!mobileMenuButton || !mobileMenuPanel || !mobileMenuBackdrop || !mobileMenuContainer || !mobileMenuCloseBtn || !iconOpen || !iconClose) {
            componentLog('One or more mobile menu elements are missing. Mobile navigation may not function.', 'warn');
        } else {
            const openMobileMenu = () => {
                if (window.componentState.isMobileMenuOpen) return;
                mobileMenuPanel.classList.remove('hidden');
                mobileMenuPanel.classList.add('active'); // For CSS transition trigger
                mobileMenuContainer.style.transform = 'translateX(0%)';
                iconOpen.classList.add('hidden');
                iconClose.classList.remove('hidden');
                document.body.style.overflow = 'hidden'; // Prevent body scroll
                mobileMenuButton.setAttribute('aria-expanded', 'true');
                window.componentState.isMobileMenuOpen = true;
                componentLog('Mobile menu opened.');
            };

            const closeMobileMenu = () => {
                if (!window.componentState.isMobileMenuOpen) return;
                mobileMenuContainer.style.transform = 'translateX(100%)';
                 // Wait for transition to finish before hiding panel
                setTimeout(() => {
                    mobileMenuPanel.classList.add('hidden');
                    mobileMenuPanel.classList.remove('active');
                }, 400); // Match transition duration in CSS
                iconOpen.classList.remove('hidden');
                iconClose.classList.add('hidden');
                document.body.style.overflow = ''; // Restore body scroll
                mobileMenuButton.setAttribute('aria-expanded', 'false');
                window.componentState.isMobileMenuOpen = false;
                componentLog('Mobile menu closed.');
            };

            mobileMenuButton.addEventListener('click', () => window.componentState.isMobileMenuOpen ? closeMobileMenu() : openMobileMenu());
            if (mobileMenuBottomButton) { // If bottom nav toggle exists
                mobileMenuBottomButton.addEventListener('click', () => window.componentState.isMobileMenuOpen ? closeMobileMenu() : openMobileMenu());
            }
            mobileMenuBackdrop.addEventListener('click', closeMobileMenu);
            mobileMenuCloseBtn.addEventListener('click', closeMobileMenu);

            // Close menu on link click (if not a submenu toggle)
            mobileMenuContainer.querySelectorAll('a:not(.mobile-submenu-toggle)').forEach(link => {
                link.addEventListener('click', (e) => {
                    if (!link.closest('.mobile-submenu-toggle')) { // Ensure not part of a toggle button itself
                        closeMobileMenu();
                    }
                });
            });
            
            // Mobile submenu toggle logic
            mobileMenuContainer.querySelectorAll('.mobile-submenu-toggle').forEach(toggle => {
                const submenu = document.getElementById(toggle.getAttribute('aria-controls'));
                const icon = toggle.querySelector('.mobile-submenu-icon');
                if (submenu) {
                    submenu.style.transition = 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out, padding-bottom 0.3s ease-in-out';
                    submenu.style.maxHeight = '0';
                    submenu.style.opacity = '0';
                    submenu.style.overflow = 'hidden';

                    toggle.addEventListener('click', () => {
                        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                        toggle.setAttribute('aria-expanded', String(!isExpanded));
                        if (!isExpanded) { // Open
                            submenu.style.maxHeight = submenu.scrollHeight + "px";
                            submenu.style.opacity = '1';
                            submenu.style.paddingBottom = '0.25rem'; // From mobile-submenu-content
                            if(icon) icon.style.transform = 'rotate(90deg)';
                        } else { // Close
                            submenu.style.maxHeight = '0';
                            submenu.style.opacity = '0';
                            submenu.style.paddingBottom = '0';
                            if(icon) icon.style.transform = 'rotate(0deg)';
                        }
                    });
                }
            });
        }

        // Header show/hide on scroll (desktop only)
        let lastScrollTop = 0;
        const headerScrollThreshold = 100; 
        const handleHeaderScroll = () => {
            if (!window.componentState.headerElement || isMobileDevice()) { // Don't hide on mobile
                 if(window.componentState.headerElement) window.componentState.headerElement.classList.remove('header-hidden');
                return;
            }
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > lastScrollTop && scrollTop > headerScrollThreshold) {
                window.componentState.headerElement.classList.add('header-hidden');
            } else {
                window.componentState.headerElement.classList.remove('header-hidden');
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        };
        const debouncedHeaderScroll = debounce(handleHeaderScroll, 50); // Reduced debounce for smoother feel
        window.addEventListener('scroll', debouncedHeaderScroll, { passive: true });
        
        // Set header height CSS variable
        const updateHeaderHeightVar = () => {
            if (window.componentState.headerElement) {
                const height = window.componentState.headerElement.offsetHeight;
                document.documentElement.style.setProperty(
                    isMobileDevice() ? '--header-height-mobile' : '--header-height-desktop', 
                    `${height}px`
                );
                 document.documentElement.style.setProperty('--header-height', `${height}px`); // General one
                componentLog(`Header height set to ${height}px for ${isMobileDevice() ? 'mobile' : 'desktop'}`);
            }
        };
        updateHeaderHeightVar(); // Initial set
        window.addEventListener('resize', debounce(updateHeaderHeightVar, 200)); // Update on resize

        window.componentState.headerInitialized = true;
        componentLog('Header initialized successfully.');
    } catch (error) {
        componentLog(`Error initializing header: ${error.message}`, 'error');
        window.componentState.headerInitialized = false;
    }
}
window.initializeHeader = initializeHeaderInternal; // Make it globally accessible if needed by other scripts

async function loadHeader() {
    const placeholder = document.getElementById('header-placeholder');
    if (!placeholder) {
        componentLog('Header placeholder not found.', 'error');
        return false;
    }
    placeholder.setAttribute('aria-busy', 'true');
    try {
        const loaded = await loadComponent('Header', 'header-placeholder', '/components/header.html');
        if (!loaded) throw new Error('Header HTML content failed to load.');
        await initializeHeaderInternal(); // Initialize after HTML is in place
        placeholder.setAttribute('aria-busy', 'false');
        componentLog('Header loaded and initialized.');
        return true;
    } catch (error) {
        componentLog(`Failed to load and initialize header: ${error.message}`, 'error');
        if(placeholder) placeholder.innerHTML = `<div class="p-3 text-center text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 rounded-md">Error loading header.</div>`;
        placeholder.setAttribute('aria-busy', 'false');
        return false;
    }
}

// Footer and FAB initialization (simplified, keep as is or adapt if they also have complex JS)
function initializeFooterInternal() {
    if (window.componentState.footerInitialized) return;
    componentLog("Initializing footer...");
    // ... (current footer logic, ensure it's robust)
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();
    window.componentState.footerInitialized = true;
    componentLog("Footer initialized.");
}
window.initializeFooter = initializeFooterInternal;

function initializeFabButtonsInternal() {
    if (window.componentState.fabInitialized) return;
    componentLog("Initializing FABs...");
    // ... (current FAB logic, ensure it's robust and uses updated CSS classes if necessary)
    const fabContainer = document.getElementById('fab-container-placeholder'); // FABs are loaded into this
    if (!fabContainer || !fabContainer.querySelector('#contact-main-btn')) { // Check if FABs actually loaded
        componentLog("FAB container or main FAB buttons not found after load. Skipping FAB initialization.", 'warn');
        window.componentState.fabInitialized = true; // Mark as "done" to not retry
        return;
    }
     // Scroll to top FAB specific logic (if part of the loaded fab-container.html)
    const scrollToTopFab = document.getElementById('scroll-to-top-btn'); // Assuming this ID is inside fab-container.html
    if (scrollToTopFab) {
        const fabScrollHandler = debounce(() => {
            const visibleClass = 'fab-visible'; // Use a generic visibility class
            const hiddenClass = 'fab-hidden-alt'; // Different from .hidden to avoid conflict
            
            if (window.scrollY > (isMobileDevice() ? 200 : 120)) {
                scrollToTopFab.classList.add(visibleClass);
                scrollToTopFab.classList.remove(hiddenClass);
            } else {
                scrollToTopFab.classList.remove(visibleClass);
                scrollToTopFab.classList.add(hiddenClass);
            }
        }, 100);
        window.addEventListener('scroll', fabScrollHandler, { passive: true });
        fabScrollHandler(); // Initial check
        scrollToTopFab.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    } else {
        componentLog('Scroll-to-top button #scroll-to-top-btn not found inside FAB container.', 'warn');
    }


    // Simplified FAB menu toggle (assuming structure loaded from fab-container.html)
    const fabButtonsWithSubmenu = fabContainer.querySelectorAll('button[aria-haspopup="true"]');
    fabButtonsWithSubmenu.forEach(btn => {
        const menuId = btn.getAttribute('aria-controls');
        const menu = document.getElementById(menuId);
        if (menu) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isExpanded = btn.getAttribute('aria-expanded') === 'true';
                // Close other open FAB menus
                fabButtonsWithSubmenu.forEach(otherBtn => {
                    if (otherBtn !== btn) {
                        const otherMenuId = otherBtn.getAttribute('aria-controls');
                        const otherMenu = document.getElementById(otherMenuId);
                        if (otherMenu) otherMenu.classList.add('hidden'); // Use Tailwind's hidden
                        otherBtn.setAttribute('aria-expanded', 'false');
                    }
                });
                menu.classList.toggle('hidden', isExpanded);
                btn.setAttribute('aria-expanded', String(!isExpanded));
            });
        }
    });
     // Global click to close FAB submenus
    document.addEventListener('click', (e) => {
        fabButtonsWithSubmenu.forEach(btn => {
            const menuId = btn.getAttribute('aria-controls');
            const menu = document.getElementById(menuId);
            if (menu && !menu.classList.contains('hidden') && !btn.contains(e.target) && !menu.contains(e.target)) {
                menu.classList.add('hidden');
                btn.setAttribute('aria-expanded', 'false');
            }
        });
    });


    window.componentState.fabInitialized = true;
    componentLog("FABs initialized.");
}
window.initializeFabButtons = initializeFabButtonsInternal;


// Main Orchestration
async function loadCommonComponents() {
    if (window.componentState.componentsLoadedAndInitialized) {
        componentLog('All common components already loaded.', 'warn');
        return;
    }
    componentLog('Loading common components...');
    
    await loadHeader(); // This now includes initialization

    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        const footerLoaded = await loadComponent('Footer', 'footer-placeholder', '/components/footer.html');
        if (footerLoaded) initializeFooterInternal();
    } else { componentLog('Footer placeholder not found.', 'warn'); }
    
    const fabPlaceholder = document.getElementById('fab-container-placeholder');
    if (fabPlaceholder) {
        const fabLoaded = await loadComponent('FABs', 'fab-container-placeholder', '/components/fab-container.html');
        if (fabLoaded) initializeFabButtonsInternal();
    } else { componentLog('FAB placeholder not found.', 'warn'); }

    // Initialize language system after main components are in DOM
    if (typeof window.initializeLanguageSystem === 'function') {
        try {
            await window.initializeLanguageSystem(); // This should handle applying the language
            componentLog('Language system initialized and language applied.');
        } catch (langError) { componentLog(`Error initializing language system: ${langError.message}`, 'error'); }
    } else { 
        componentLog('initializeLanguageSystem function not found. Manual language application might be needed.', 'warn');
        // Fallback to applyLanguage if initializeLanguageSystem is missing (e.g. old language.js)
        if (typeof window.applyLanguage === 'function') {
            window.applyLanguage(); 
            componentLog('Fallback applyLanguage called.');
        }
    }
    
    window.componentState.componentsLoadedAndInitialized = true;
    componentLog('All common components loaded and core systems initialized.');

    // Call page-specific callback if defined
    if (typeof window.onPageComponentsLoaded === 'function') {
        try {
            await window.onPageComponentsLoaded();
            componentLog('Page-specific onPageComponentsLoaded callback executed.');
        } catch(pageCallbackError) {
            componentLog(`Error in onPageComponentsLoaded callback: ${pageCallbackError.message}`, 'error');
        }
    } else {
        componentLog('onPageComponentsLoaded callback not defined for this page.', 'info');
    }
}

// Execute loading when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCommonComponents);
} else {
    if (!window.componentState.componentsLoadedAndInitialized) { // Ensure it only runs once
        loadCommonComponents();
    }
}
