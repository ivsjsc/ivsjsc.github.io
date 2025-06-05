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
    const debugMode = false; 
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
        if (!header) throw new Error('Main header element (#main-header) not found.');
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
                if (forceClose || isOpen) { 
                    if (!window.componentState.isMobileMenuOpen && !forceClose) return; 
                    window.componentState.isMobileMenuOpen = false;
                    mobileMenuContainer.style.transform = 'translateX(100%)';
                    mobileMenuPanel.classList.remove('active'); 
                    setTimeout(() => { mobileMenuPanel.classList.add('hidden'); }, 400); 

                    iconOpen.classList.remove('hidden');
                    iconClose.classList.add('hidden');
                    document.body.style.overflow = '';
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                    componentLog('Mobile menu closed.');
                } else { 
                    if (window.componentState.isMobileMenuOpen) return; 
                    window.componentState.isMobileMenuOpen = true;
                    mobileMenuPanel.classList.remove('hidden');
                    requestAnimationFrame(() => { 
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
                    submenu.style.transition = 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out, padding-bottom 0.3s ease-in-out';
                    submenu.style.maxHeight = '0'; 
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
            if (!window.componentState.headerElement) return;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (isMobileDevice() || scrollTop < lastScrollTop || scrollTop <= headerScrollThreshold) {
                window.componentState.headerElement.classList.remove('header-hidden');
            } else if (scrollTop > lastScrollTop && scrollTop > headerScrollThreshold) { 
                window.componentState.headerElement.classList.add('header-hidden');
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        };
        const debouncedHeaderScroll = debounce(handleHeaderScroll, 50);
        window.addEventListener('scroll', debouncedHeaderScroll, { passive: true });
        
        const updateHeaderHeightVar = () => {
            if (window.componentState.headerElement) {
                const wasHidden = window.componentState.headerElement.classList.contains('header-hidden');
                if(wasHidden) window.componentState.headerElement.classList.remove('header-hidden');
                
                const height = window.componentState.headerElement.offsetHeight;
                
                if(wasHidden) window.componentState.headerElement.classList.add('header-hidden');

                if (height > 0) { 
                    document.documentElement.style.setProperty('--header-actual-height', `${height}px`);
                    const placeholder = document.getElementById('header-placeholder');
                    if (placeholder) placeholder.style.minHeight = `${height}px`; 
                }
            }
        };

        if (window.ResizeObserver && window.componentState.headerElement) {
            const resizeObserver = new ResizeObserver(debounce(updateHeaderHeightVar, 50)); 
            resizeObserver.observe(window.componentState.headerElement);
        } else {
            window.addEventListener('resize', debounce(updateHeaderHeightVar, 200));
        }
        setTimeout(updateHeaderHeightVar, 50);


        document.querySelectorAll('.desktop-dropdown-container, .mega-menu-dropdown-container').forEach(container => {
            const button = container.querySelector('button[aria-haspopup="true"]');
            const menu = container.querySelector('.desktop-dropdown-content, .mega-menu-content');
            if (!button || !menu) return;

            let menuTimeout;

            const openMenu = () => {
                clearTimeout(menuTimeout);
                menu.style.opacity = '1';
                menu.style.visibility = 'visible';
                let transformBase = menu.classList.contains('mega-menu-content') ? 'translateX(-50%)' : '';
                menu.style.transform = `${transformBase} translateY(0) scale(1)`;
                menu.style.pointerEvents = 'auto';
                button.setAttribute('aria-expanded', 'true');
            };

            const closeMenu = (delay = 200) => { 
                menuTimeout = setTimeout(() => {
                    menu.style.opacity = '0';
                    let transformBase = menu.classList.contains('mega-menu-content') ? 'translateX(-50%)' : '';
                    menu.style.transform = `${transformBase} translateY(5px) scale(0.98)`;
                    menu.style.pointerEvents = 'none';
                    setTimeout(() => { 
                        if (menu.style.opacity === '0') menu.style.visibility = 'hidden';
                    }, parseFloat(getComputedStyle(menu).transitionDuration.replace('s',''))*1000 || 150);
                    button.setAttribute('aria-expanded', 'false');
                }, delay);
            };
            
            container.addEventListener('mouseenter', openMenu);
            container.addEventListener('mouseleave', () => closeMenu());
            
            button.addEventListener('focus', openMenu);
            container.addEventListener('focusout', (e) => {
                if (!container.contains(e.relatedTarget)) {
                    closeMenu(50); 
                }
            });
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
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();
    
    const newsletterForm = document.getElementById('newsletterForm'); 
    if (newsletterForm) {
        const newsletterMessage = document.getElementById('newsletterMessage'); 
        newsletterForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const emailInput = newsletterForm.querySelector('input[name="email"]');
            if (!emailInput || !emailInput.value.trim()) {
                if(newsletterMessage) {
                    newsletterMessage.textContent = 'Please enter a valid email address.'; 
                    newsletterMessage.className = 'mt-2 text-sm text-ivs-danger dark:text-ivs-danger';
                } return;
            }
            if(newsletterMessage) {
                 newsletterMessage.textContent = 'Thank you for subscribing!';
                 newsletterMessage.className = 'mt-2 text-sm text-ivs-success dark:text-ivs-success';
                 newsletterForm.reset();
                 setTimeout(() => { newsletterMessage.textContent = ''; }, 3000);
            }
        });
    }
    window.componentState.footerInitialized = true;
    componentLog("Footer initialized.");
}
window.initializeFooter = initializeFooterInternal;

function initializeFabButtonsInternal() {
    if (window.componentState.fabInitialized) return;
    const fabContainerHost = document.getElementById('fab-container-placeholder');
    if (!fabContainerHost || !fabContainerHost.querySelector('#contact-main-btn')) { 
        componentLog("FAB container or main FAB buttons not found after load attempt. Skipping.", 'warn');
        window.componentState.fabInitialized = true; 
        return;
    }
    const fabContainer = fabContainerHost.firstChild; 

    const scrollToTopFab = fabContainer.querySelector('#scroll-to-top-btn'); 
    if (scrollToTopFab) {
        const fabScrollHandler = debounce(() => {
            const isVisible = window.scrollY > (isMobileDevice() ? 200 : 120);
            scrollToTopFab.classList.toggle('fab-visible', isVisible);
            scrollToTopFab.classList.toggle('fab-hidden-alt', !isVisible);
        }, 100);
        window.addEventListener('scroll', fabScrollHandler, { passive: true });
        fabScrollHandler(); 
        scrollToTopFab.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    const fabButtonsWithSubmenu = fabContainer.querySelectorAll('button[aria-haspopup="true"]');
    fabButtonsWithSubmenu.forEach(btn => {
        const menuId = btn.getAttribute('aria-controls');
        const menu = fabContainer.querySelector(`#${menuId}`); 
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
                    setTimeout(() => menu.classList.add('hidden'), 150); 
                    btn.setAttribute('aria-expanded', 'false');
                }, delay);
            }
            btn.addEventListener('click', (e) => { // Changed to click for FABs
                e.stopPropagation();
                const isCurrentlyOpen = btn.getAttribute('aria-expanded') === 'true';
                fabButtonsWithSubmenu.forEach(otherBtn => {
                    if (otherBtn !== btn) {
                        const otherMenuId = otherBtn.getAttribute('aria-controls');
                        const otherMenu = fabContainer.querySelector(`#${otherMenuId}`);
                        if (otherMenu && otherBtn.getAttribute('aria-expanded') === 'true') {
                            otherMenu.classList.remove('opacity-100', 'scale-100', 'fab-visible');
                            otherMenu.classList.add('opacity-0', 'scale-95', 'fab-hidden-alt');
                            setTimeout(() => otherMenu.classList.add('hidden'),150);
                            otherBtn.setAttribute('aria-expanded', 'false');
                        }
                    }
                });
                if(isCurrentlyOpen) closeFabMenu(0); else openFabMenu();
            });
            // Keep menu open if mouse enters it (optional, can be removed for click-only)
            // menu.addEventListener('mouseenter', () => clearTimeout(fabMenuTimeout));
            // btn.addEventListener('mouseleave', () => { if (!menu.matches(':hover')) closeFabMenu();}); // If using hover
            // menu.addEventListener('mouseleave', () => { if (!btn.matches(':hover')) closeFabMenu();});
            
            btn.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeFabMenu(0); });
            // menu.addEventListener('focusout', (e) => { if (!menu.contains(e.relatedTarget) && !btn.contains(e.relatedTarget)) closeFabMenu(50); });
        }
    });
     
    document.addEventListener('click', (e) => { 
        let clickedInsideFab = false;
        fabButtonsWithSubmenu.forEach(btn => {
            const menuId = btn.getAttribute('aria-controls');
            const menu = fabContainer.querySelector(`#${menuId}`);
            if (btn.contains(e.target) || (menu && menu.contains(e.target))) {
                clickedInsideFab = true;
            }
        });
        if(!clickedInsideFab){
            fabButtonsWithSubmenu.forEach(btn => {
                 const menuId = btn.getAttribute('aria-controls');
                 const menu = fabContainer.querySelector(`#${menuId}`);
                 if (menu && !menu.classList.contains('hidden')) {
                    menu.classList.add('hidden', 'opacity-0', 'scale-95', 'fab-hidden-alt');
                    btn.setAttribute('aria-expanded', 'false');
                 }
            });
        }
    });

    window.componentState.fabInitialized = true;
    componentLog("FABs initialized.");
}
window.initializeFabButtons = initializeFabButtonsInternal;

async function loadCommonComponents() {
    if (window.componentState.componentsLoadedAndInitialized) {
        return;
    }
    componentLog('Loading common components sequence initiated...');
    
    // Load Header first, then initialize it, then initialize language system
    const headerLoaded = await loadHeader(); 

    if(headerLoaded && window.componentState.headerInitialized) {
        if (typeof window.initializeLanguageSystem === 'function') {
            try {
                await window.initializeLanguageSystem(); 
                componentLog('Language system initialized after header.');
            } catch (langError) { componentLog(`Error initializing language system: ${langError.message}`, 'error'); }
        } else { 
            componentLog('initializeLanguageSystem function not found.', 'warn');
        }
    } else {
        componentLog('Header failed to load or initialize. Language system might not bind correctly.', 'error');
         // Attempt to initialize language system anyway if language.js is loaded
        if (typeof window.initializeLanguageSystem === 'function') {
            try { await window.initializeLanguageSystem(); } catch (e) { console.error(e); }
        }
    }

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
    
    window.componentState.componentsLoadedAndInitialized = true;
    componentLog('All common components loading sequence complete.');

    if (typeof window.onPageComponentsLoaded === 'function') {
        try {
            await window.onPageComponentsLoaded();
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
