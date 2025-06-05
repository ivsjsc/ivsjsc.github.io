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
    const debugMode = false; // Set to true for development debugging
    if (debugMode || type === 'error' || type === 'warn') {
        console[type](`[IVS Components] ${message}`);
    }
}

function isMobileDevice() {
    return window.innerWidth < 768; 
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const context = this;
        const later = () => {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

async function loadComponent(componentName, placeholderId, filePath) {
    componentLog(`Loading: ${componentName} from ${filePath} into #${placeholderId}`);
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`HTTP ${response.status} for ${filePath}`);
        const html = await response.text();
        const placeholder = document.getElementById(placeholderId);
        if (placeholder) {
            placeholder.innerHTML = html;
            componentLog(`${componentName} injected.`);
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
        if (!header) throw new Error('Main header (#main-header) not found.');
        window.componentState.headerElement = header;

        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenuBottomButton = document.getElementById('mobile-menu-bottom-toggle');
        const mobileMenuPanel = document.getElementById('mobile-menu-panel');
        const mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop');
        const mobileMenuContainer = document.getElementById('mobile-menu-container');
        const mobileMenuCloseBtn = document.getElementById('mobile-menu-close-btn');
        const iconOpen = header.querySelector('.icon-menu-open');
        const iconClose = header.querySelector('.icon-menu-close');

        if (!mobileMenuButton || !mobileMenuPanel || !mobileMenuBackdrop || !mobileMenuContainer || !mobileMenuCloseBtn || !iconOpen || !iconClose) {
            componentLog('Mobile menu elements missing. Navigation may be impaired.', 'warn');
        } else {
            const toggleMobileMenu = (forceClose = false) => {
                const isOpen = mobileMenuPanel.classList.contains('active');
                if (forceClose || isOpen) { // Close menu
                    if (!window.componentState.isMobileMenuOpen && !forceClose) return; // Already closing or closed
                    window.componentState.isMobileMenuOpen = false;
                    mobileMenuContainer.style.transform = 'translateX(100%)';
                    mobileMenuPanel.classList.remove('active'); // Start opacity/visibility transition for panel
                    setTimeout(() => { mobileMenuPanel.classList.add('hidden'); }, 300); // Hide after transition

                    iconOpen.classList.remove('hidden');
                    iconClose.classList.add('hidden');
                    document.body.style.overflow = '';
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                    componentLog('Mobile menu closed.');
                } else { // Open menu
                    if (window.componentState.isMobileMenuOpen) return; // Already opening or open
                    window.componentState.isMobileMenuOpen = true;
                    mobileMenuPanel.classList.remove('hidden');
                    requestAnimationFrame(() => { // Ensure 'hidden' is removed before starting transition
                        mobileMenuPanel.classList.add('active');
                        mobileMenuContainer.style.transform = 'translateX(0%)';
                    });
                    iconOpen.classList.add('hidden');
                    iconClose.classList.remove('hidden');
                    document.body.style.overflow = 'hidden';
                    mobileMenuButton.setAttribute('aria-expanded', 'true');
                    componentLog('Mobile menu opened.');
                }
            };

            mobileMenuButton.addEventListener('click', () => toggleMobileMenu());
            if (mobileMenuBottomButton) mobileMenuBottomButton.addEventListener('click', () => toggleMobileMenu());
            mobileMenuBackdrop.addEventListener('click', () => toggleMobileMenu(true));
            mobileMenuCloseBtn.addEventListener('click', () => toggleMobileMenu(true));

            mobileMenuContainer.querySelectorAll('a:not(.mobile-submenu-toggle), button:not(.mobile-submenu-toggle)').forEach(link => {
                link.addEventListener('click', (e) => {
                    if (!link.closest('.mobile-submenu-toggle')) {
                         // Do not close if it's a submenu item inside an already open submenu
                        if(!e.target.closest('.mobile-submenu-content.expanded')) {
                           toggleMobileMenu(true);
                        }
                    }
                });
            });
            
            mobileMenuContainer.querySelectorAll('.mobile-submenu-toggle').forEach(toggle => {
                const submenuId = toggle.getAttribute('aria-controls');
                const submenu = document.getElementById(submenuId);
                const icon = toggle.querySelector('.mobile-submenu-icon');
                if (submenu) {
                    submenu.style.maxHeight = '0'; // Initial state
                    submenu.style.opacity = '0';
                    submenu.style.overflow = 'hidden';
                    submenu.classList.remove('expanded');

                    toggle.addEventListener('click', () => {
                        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                        toggle.setAttribute('aria-expanded', String(!isExpanded));
                        if (!isExpanded) {
                            submenu.style.maxHeight = submenu.scrollHeight + "px";
                            submenu.style.opacity = '1';
                            submenu.style.paddingBottom = '0.25rem';
                            if(icon) icon.style.transform = 'rotate(90deg)';
                            submenu.classList.add('expanded');
                        } else {
                            submenu.style.maxHeight = '0';
                            submenu.style.opacity = '0';
                            submenu.style.paddingBottom = '0';
                            if(icon) icon.style.transform = 'rotate(0deg)';
                            submenu.classList.remove('expanded');
                        }
                    });
                }
            });
        }

        let lastScrollTop = 0;
        const headerScrollThreshold = 80; 
        const handleHeaderScroll = () => {
            if (!window.componentState.headerElement || isMobileDevice()) {
                 if(window.componentState.headerElement) window.componentState.headerElement.classList.remove('header-hidden');
                return;
            }
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > lastScrollTop && scrollTop > headerScrollThreshold) {
                window.componentState.headerElement.classList.add('header-hidden');
            } else if (scrollTop < lastScrollTop || scrollTop <= headerScrollThreshold) {
                window.componentState.headerElement.classList.remove('header-hidden');
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        };
        const debouncedHeaderScroll = debounce(handleHeaderScroll, 50);
        window.addEventListener('scroll', debouncedHeaderScroll, { passive: true });
        
        const updateHeaderHeightVar = () => {
            if (window.componentState.headerElement) {
                const height = window.componentState.headerElement.offsetHeight;
                const varName = isMobileDevice() ? '--header-height-mobile' : '--header-height-desktop';
                document.documentElement.style.setProperty(varName, `${height}px`);
                document.documentElement.style.setProperty('--header-height', `${height}px`); // General var
                // componentLog(`Header height var (${varName}) set to ${height}px`);
            }
        };
        // Use ResizeObserver for more reliable height updates if available and needed
        if (window.ResizeObserver && window.componentState.headerElement) {
            const resizeObserver = new ResizeObserver(debounce(updateHeaderHeightVar, 100));
            resizeObserver.observe(window.componentState.headerElement);
        } else {
            window.addEventListener('resize', debounce(updateHeaderHeightVar, 200));
        }
        updateHeaderHeightVar(); // Initial set

        // Desktop dropdown focus and hover persistence logic
        document.querySelectorAll('.desktop-dropdown-container, .mega-menu-dropdown-container').forEach(container => {
            const button = container.querySelector('button[aria-haspopup="true"]');
            const menu = container.querySelector('.desktop-dropdown-content, .mega-menu-content');
            if (!button || !menu) return;

            let menuTimeout;

            const openMenu = () => {
                clearTimeout(menuTimeout);
                menu.style.opacity = '1';
                menu.style.visibility = 'visible';
                menu.style.transform = menu.classList.contains('mega-menu-content') ? 'translateX(-50%) translateY(0) scale(1)' : 'translateY(0) scale(1)';
                menu.style.pointerEvents = 'auto';
                button.setAttribute('aria-expanded', 'true');
            };

            const closeMenu = (delay = 150) => { // Slightly longer delay to allow mouse travel
                menuTimeout = setTimeout(() => {
                    menu.style.opacity = '0';
                    menu.style.transform = menu.classList.contains('mega-menu-content') ? 'translateX(-50%) translateY(8px) scale(0.98)' : 'translateY(8px) scale(0.98)';
                    menu.style.pointerEvents = 'none';
                     setTimeout(() => { // Ensure visibility is changed after opacity transition
                        if (menu.style.opacity === '0') menu.style.visibility = 'hidden';
                    }, 150); // Match transition-fast
                    button.setAttribute('aria-expanded', 'false');
                }, delay);
            };

            container.addEventListener('mouseenter', openMenu);
            container.addEventListener('mouseleave', () => closeMenu());
            
            // For keyboard accessibility
            button.addEventListener('focus', openMenu);
            menu.addEventListener('focusout', (e) => {
                 // If focus moves outside the entire container (button + menu)
                if (!container.contains(e.relatedTarget)) {
                    closeMenu(50); // Quicker close if focus moves out completely
                }
            });
            // Close on escape key
            container.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
                    closeMenu(0);
                    button.focus();
                }
            });
        });


        window.componentState.headerInitialized = true;
        componentLog('Header initialized successfully.');
    } catch (error) {
        componentLog(`Error initializing header: ${error.message}`, 'error');
        window.componentState.headerInitialized = false;
    }
}
window.initializeHeader = initializeHeaderInternal;

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
        await initializeHeaderInternal(); 
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

function initializeFooterInternal() {
    if (window.componentState.footerInitialized) return;
    // componentLog("Initializing footer...");
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();
    
    // Example: Newsletter form (if it exists and is part of the standard footer)
    const newsletterForm = document.getElementById('newsletterForm'); // Assume this ID exists in footer.html
    if (newsletterForm) {
        const newsletterMessage = document.getElementById('newsletterMessage'); // Assume this ID exists
        newsletterForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const emailInput = newsletterForm.querySelector('input[name="email"]');
            if (!emailInput || !emailInput.value.trim()) {
                if(newsletterMessage) {
                    newsletterMessage.textContent = 'Please enter a valid email address.'; // Make sure this key exists in lang files
                    newsletterMessage.className = 'mt-2 text-sm text-ivs-danger dark:text-ivs-danger';
                } return;
            }
            // ... rest of your newsletter submission logic ...
        });
    }

    window.componentState.footerInitialized = true;
    componentLog("Footer initialized.");
}
window.initializeFooter = initializeFooterInternal;

function initializeFabButtonsInternal() {
    if (window.componentState.fabInitialized) return;
    // componentLog("Initializing FABs...");
    const fabContainerHost = document.getElementById('fab-container-placeholder');
    if (!fabContainerHost || !fabContainerHost.querySelector('#contact-main-btn')) {
        componentLog("FAB container or main FAB buttons not found after load attempt. Skipping.", 'warn');
        window.componentState.fabInitialized = true; 
        return;
    }
    const fabContainer = fabContainerHost.firstChild; // Assuming the actual div is the first child after loading

    const scrollToTopFab = fabContainer.querySelector('#scroll-to-top-btn'); 
    if (scrollToTopFab) {
        const fabScrollHandler = debounce(() => {
            const visibleClass = 'fab-visible'; 
            const hiddenClass = 'fab-hidden-alt'; 
            
            if (window.scrollY > (isMobileDevice() ? 250 : 150)) {
                scrollToTopFab.classList.add(visibleClass);
                scrollToTopFab.classList.remove(hiddenClass);
            } else {
                scrollToTopFab.classList.remove(visibleClass);
                scrollToTopFab.classList.add(hiddenClass);
            }
        }, 100);
        window.addEventListener('scroll', fabScrollHandler, { passive: true });
        fabScrollHandler(); 
        scrollToTopFab.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    const fabButtonsWithSubmenu = fabContainer.querySelectorAll('button[aria-haspopup="true"]');
    fabButtonsWithSubmenu.forEach(btn => {
        const menuId = btn.getAttribute('aria-controls');
        const menu = fabContainer.querySelector(`#${menuId}`); // Ensure menu is queried within FAB container
        if (menu) {
            let fabMenuTimeout;
            const openFabMenu = () => {
                clearTimeout(fabMenuTimeout);
                menu.classList.remove('hidden', 'opacity-0', 'scale-95', 'fab-hidden-alt');
                menu.classList.add('opacity-100', 'scale-100', 'fab-visible');
                btn.setAttribute('aria-expanded', 'true');
            }
            const closeFabMenu = (delay = 200) => {
                 fabMenuTimeout = setTimeout(() => {
                    menu.classList.remove('opacity-100', 'scale-100', 'fab-visible');
                    menu.classList.add('opacity-0', 'scale-95', 'fab-hidden-alt');
                    setTimeout(() => menu.classList.add('hidden'), 150); // Match transition
                    btn.setAttribute('aria-expanded', 'false');
                }, delay);
            }
            btn.addEventListener('mouseenter', openFabMenu);
            btn.addEventListener('focus', openFabMenu);
            menu.addEventListener('mouseenter', () => clearTimeout(fabMenuTimeout)); // Keep open if mouse moves to menu
            btn.addEventListener('mouseleave', () => closeFabMenu());
            menu.addEventListener('mouseleave', () => closeFabMenu());

            // Close on escape or if focus moves out
            btn.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeFabMenu(0); });
            menu.addEventListener('focusout', (e) => { if (!menu.contains(e.relatedTarget) && !btn.contains(e.relatedTarget)) closeFabMenu(50); });
        }
    });
     
    document.addEventListener('click', (e) => {
        fabButtonsWithSubmenu.forEach(btn => {
            const menuId = btn.getAttribute('aria-controls');
            const menu = fabContainer.querySelector(`#${menuId}`);
            if (menu && !menu.classList.contains('hidden') && !btn.contains(e.target) && !menu.contains(e.target)) {
                menu.classList.add('hidden', 'opacity-0', 'scale-95', 'fab-hidden-alt');
                btn.setAttribute('aria-expanded', 'false');
            }
        });
    });

    window.componentState.fabInitialized = true;
    componentLog("FABs initialized.");
}
window.initializeFabButtons = initializeFabButtonsInternal;

async function loadCommonComponents() {
    if (window.componentState.componentsLoadedAndInitialized) {
        // componentLog('All common components already loaded.', 'warn');
        return;
    }
    componentLog('Loading common components sequence initiated...');
    
    await loadHeader();

    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        const footerLoaded = await loadComponent('Footer', 'footer-placeholder', '/components/footer.html');
        if (footerLoaded) initializeFooterInternal();
    } else { componentLog('Footer placeholder not found.', 'info'); }
    
    const fabPlaceholder = document.getElementById('fab-container-placeholder');
    if (fabPlaceholder) {
        const fabLoaded = await loadComponent('FABs', 'fab-container-placeholder', '/components/fab-container.html');
        if (fabLoaded) initializeFabButtonsInternal();
    } else { componentLog('FAB placeholder not found.', 'info'); }

    if (typeof window.initializeLanguageSystem === 'function') {
        try {
            await window.initializeLanguageSystem(); 
            // componentLog('Language system initialized and language applied.');
        } catch (langError) { componentLog(`Error initializing language system: ${langError.message}`, 'error'); }
    } else { 
        componentLog('initializeLanguageSystem function not found. Attempting fallback.', 'warn');
        if (typeof window.applyLanguage === 'function') {
            window.applyLanguage(); 
            // componentLog('Fallback applyLanguage called.');
        } else {
            componentLog('applyLanguage function also not found.', 'error');
        }
    }
    
    window.componentState.componentsLoadedAndInitialized = true;
    componentLog('All common components loaded and core systems initialized.');

    if (typeof window.onPageComponentsLoaded === 'function') {
        try {
            await window.onPageComponentsLoaded();
            // componentLog('Page-specific onPageComponentsLoaded callback executed.');
        } catch(pageCallbackError) {
            componentLog(`Error in onPageComponentsLoaded callback: ${pageCallbackError.message}`, 'error');
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCommonComponents);
} else {
    if (!window.componentState.componentsLoadedAndInitialized) { 
        loadCommonComponents();
    }
}
