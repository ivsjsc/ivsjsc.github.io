let componentsLoadedAndInitialized = false;
let headerInitialized = false;
let fabInitialized = false;
let footerInitialized = false;

function componentLog(message, type = 'log') {
    const debugMode = false; 
    if (debugMode || type === 'error' || type === 'warn') {
        console[type](`[loadComponents.js] ${message}`);
    }
}

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

function initializeHeaderInternal() {
    if (headerInitialized) {
        componentLog("Header (Tailwind) already initialized. Skipping.", 'warn');
        return;
    }
    componentLog("Initializing header (Tailwind)...");

    const mainHeader = document.getElementById('main-header');
    if (!mainHeader) {
        componentLog("Main header element (#main-header) not found. Cannot initialize.", 'error');
        return;
    }

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
            document.body.classList.toggle('overflow-hidden', !isExpanded);
            componentLog(`Mobile menu toggled. Expanded: ${!isExpanded}`);
        });
    } else {
        componentLog("Mobile menu elements not all found for Tailwind header.", 'warn');
    }

    const mobileSubmenuToggles = mainHeader.querySelectorAll('.mobile-submenu-toggle');
    mobileSubmenuToggles.forEach(toggle => {
        const submenuContent = document.getElementById(toggle.getAttribute('aria-controls'));
        const icon = toggle.querySelector('.mobile-submenu-icon');

        if (submenuContent) {
            toggle.addEventListener('click', () => {
                const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                
                if (!isExpanded) {
                    mobileSubmenuToggles.forEach(otherToggle => {
                        if (otherToggle !== toggle) {
                            const otherSubmenu = document.getElementById(otherToggle.getAttribute('aria-controls'));
                            const otherIcon = otherToggle.querySelector('.mobile-submenu-icon');
                            if (otherSubmenu && !otherSubmenu.classList.contains('max-h-0')) {
                                otherSubmenu.classList.add('max-h-0');
                                otherSubmenu.classList.remove('max-h-screen');
                                otherToggle.setAttribute('aria-expanded', 'false');
                                if (otherIcon) {
                                    otherIcon.classList.remove('rotate-180');
                                }
                            }
                        }
                    });
                }
                submenuContent.classList.toggle('max-h-0', isExpanded);
                submenuContent.classList.toggle('max-h-screen', !isExpanded);
                toggle.setAttribute('aria-expanded', String(!isExpanded));
                if (icon) {
                    icon.classList.toggle('rotate-180', !isExpanded);
                }
            });
        }
    });

    const desktopNavGroups = mainHeader.querySelectorAll('nav.hidden.md\\:flex .group');
    desktopNavGroups.forEach(group => {
        const button = group.querySelector('button[aria-haspopup="true"]');
        const menu = group.querySelector('.mega-menu, .desktop-dropdown-menu');

        if (button && menu) {
            button.addEventListener('focus', () => {
                menu.style.opacity = '1';
                menu.style.visibility = 'visible';
                menu.style.pointerEvents = 'auto';
                menu.style.transform = 'translateY(0)';
                button.setAttribute('aria-expanded', 'true');
            });
             group.addEventListener('mouseenter', () => button.setAttribute('aria-expanded', 'true'));
             group.addEventListener('mouseleave', () => button.setAttribute('aria-expanded', 'false'));

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
    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            if (mobileMenuPanel && !mobileMenuPanel.classList.contains('hidden')) {
                mobileMenuButton.click(); 
            }
        }
    });

    headerInitialized = true;
    componentLog("Header (Tailwind) initialized successfully.");
    
    if (typeof window.initializeLanguageButtons === 'function') {
        window.initializeLanguageButtons(); 
    } else {
        componentLog("window.initializeLanguageButtons not found.", 'warn');
    }
}
window.initializeHeader = initializeHeaderInternal; 

function initializeFooterInternal() {
    if (footerInitialized) {
        componentLog("Footer already initialized. Skipping.", 'warn');
        return;
    }
    componentLog("Initializing footer...");
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterMessage = document.getElementById('newsletter-message');
    const currentYearSpan = document.getElementById('currentYearFooter');

    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    if (newsletterForm && newsletterMessage) {
        newsletterForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const formData = new FormData(newsletterForm);
            const email = formData.get('email');

            if (!email) {
                newsletterMessage.textContent = 'Vui lòng nhập địa chỉ email.';
                newsletterMessage.className = 'mt-2 text-sm text-red-400';
                return;
            }

            newsletterMessage.textContent = 'Đang gửi...';
            newsletterMessage.className = 'mt-2 text-sm text-yellow-400';

            try {
                const response = await fetch(newsletterForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    newsletterMessage.textContent = 'Cảm ơn bạn đã đăng ký!';
                    newsletterMessage.className = 'mt-2 text-sm text-green-400';
                    newsletterForm.reset();
                } else {
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                        newsletterMessage.textContent = data["errors"].map(error => error["message"]).join(", ");
                    } else {
                        newsletterMessage.textContent = 'Đã có lỗi xảy ra. Vui lòng thử lại.';
                    }
                    newsletterMessage.className = 'mt-2 text-sm text-red-400';
                }
            } catch (error) {
                newsletterMessage.textContent = 'Đã có lỗi xảy ra. Vui lòng thử lại.';
                newsletterMessage.className = 'mt-2 text-sm text-red-400';
            }
        });
    } else {
        componentLog("Newsletter form or message element not found in footer.", "warn");
    }
    footerInitialized = true;
    componentLog("Footer initialized successfully.");
}
window.initializeFooter = initializeFooterInternal;


function initializeFabButtonsInternal() {
    if (fabInitialized) {
        componentLog("FABs already initialized. Skipping.", 'warn');
        return;
    }
    const fabContainer = document.querySelector('.fab-container'); 
    if (!fabContainer && !document.getElementById('scroll-to-top-btn')) { 
        componentLog("FAB container/elements not found. Skipping FAB initialization.", 'warn');
        fabInitialized = true; 
        return;
    }
    componentLog("Initializing FABs (if present)...");

    const fabElements = {
        contactMainBtn: document.getElementById('contact-main-btn'),
        contactOptions: document.getElementById('contact-options'),
        shareMainBtn: document.getElementById('share-main-btn'),
        shareOptions: document.getElementById('share-options'),
        scrollToTopBtn: document.getElementById('scroll-to-top-btn')
    };

    if (!fabElements.scrollToTopBtn && !fabElements.contactMainBtn && !fabElements.shareMainBtn) {
        componentLog("No core FAB elements found. FAB initialization skipped.", 'warn');
        fabInitialized = true;
        return;
    }
    
    const toggleFabMenu = (btn, menu) => {
        if (btn && menu) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isHidden = menu.classList.toggle('fab-hidden'); 
                btn.setAttribute('aria-expanded', String(!isHidden));
                if (!isHidden) { 
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

    if (fabElements.contactMainBtn) toggleFabMenu(fabElements.contactMainBtn, fabElements.contactOptions);
    if (fabElements.shareMainBtn) toggleFabMenu(fabElements.shareMainBtn, fabElements.shareOptions);
    
    if (fabElements.scrollToTopBtn) {
        fabElements.scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        window.addEventListener('scroll', window.debounce(() => {
            if(fabElements.scrollToTopBtn){
                 fabElements.scrollToTopBtn.classList.toggle('fab-hidden', window.pageYOffset <= 100);
            }
        }, 150), { passive: true });
    }


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
    componentLog("FABs initialized (if present).");
}
window.initializeFabButtons = initializeFabButtonsInternal;


window.loadHeaderFooterAndFab = async function() {
    if (componentsLoadedAndInitialized) {
        componentLog("Core components already loaded and initialized. Skipping.", 'warn');
        return;
    }
    componentLog("Starting to load core components (Header, Footer, FAB)...");

    const headerLoaded = await loadComponent('Header', 'header-placeholder', '/components/header.html', 'placeholder');
    const footerLoaded = await loadComponent('Footer', 'footer-placeholder', '/components/footer.html', 'placeholder'); 
    const fabLoaded = await loadComponent('FAB', null, '/components/fab-container.html', 'body'); 

    if (headerLoaded) {
        initializeHeaderInternal();
    } else {
        componentLog("Header HTML (/components/header.html) failed to load.", 'error');
    }

    if (footerLoaded) {
        initializeFooterInternal();
    } else {
        componentLog("Footer HTML (/components/footer.html) failed to load.", 'error');
    }

    if (fabLoaded) { 
        initializeFabButtonsInternal(); 
    } else {
        componentLog("FAB container HTML failed to load.", 'warn');
    }

    if (typeof window.initializeLanguageSystem === 'function') {
        try {
            await window.initializeLanguageSystem(); 
            componentLog("Language system initialized.");
        } catch (error) {
            componentLog(`Error initializing language system: ${error.message}`, 'error');
        }
    } else {
        componentLog("window.initializeLanguageSystem not found.", 'error');
    }
    
    componentsLoadedAndInitialized = true;
    componentLog("Core components loading and initialization process finished.");
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.loadHeaderFooterAndFab);
} else {
    if (!componentsLoadedAndInitialized) { 
        window.loadHeaderFooterAndFab();
    }
}
