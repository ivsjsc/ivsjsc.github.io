'use strict';

window.componentState = window.componentState || {
    componentsLoadedAndInitialized: false,
    headerInitialized: false,
    fabInitialized: false,
    footerInitialized: false,
    headerElement: null,
    initialized: false 
};

function componentLog(message, type = 'log') {
    const debugMode = false; 
    if (debugMode || type === 'error' || type === 'warn') {
        console[type](`[loadComponents.js] ${message}`);
    }
}

function isMobileDevice() {
    return window.innerWidth <= 768;
}

function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
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

async function loadComponent(componentName, placeholderId, filePath, targetType = 'placeholder') {
    componentLog(`Attempting to load component: ${componentName} from ${filePath}`);
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status} loading ${filePath}`);
        }
        const html = await response.text();

        if (targetType === 'body' && placeholderId === null) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            while (tempDiv.firstChild) {
                document.body.appendChild(tempDiv.firstChild);
            }
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

async function initializeHeaderInternal() {
    if (window.componentState.headerInitialized) {
        componentLog('Header already initialized', 'warn');
        return;
    }

    try {
        const headerElement = document.querySelector('header#main-header'); // More specific selector
        if (!headerElement) {
            throw new Error('Header element (header#main-header) not found');
        }
        window.componentState.headerElement = headerElement;

        const mobileMenuPanel = document.getElementById('mobile-menu-panel');
        const mobileMenuButton = document.getElementById('mobile-menu-button'); // Matches current header.html
        const iconMenuOpen = document.getElementById('icon-menu-open');
        const iconMenuClose = document.getElementById('icon-menu-close');
        const mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop');
        const mobileMenuContainer = mobileMenuPanel ? mobileMenuPanel.querySelector('.mobile-menu-container') : null;


        if (!mobileMenuPanel || !mobileMenuButton || !iconMenuOpen || !iconMenuClose || !mobileMenuBackdrop || !mobileMenuContainer) {
            componentLog('One or more mobile menu elements not found. Skipping mobile menu initialization.', 'warn');
        } else {
            iconMenuClose.style.display = 'none';
            iconMenuOpen.style.display = 'inline-block';
            mobileMenuContainer.style.transition = 'transform 0.3s ease-in-out';
            mobileMenuContainer.style.transform = 'translateX(100%)';
            mobileMenuPanel.classList.add('hidden');


            const openMobileMenu = () => {
                mobileMenuPanel.classList.remove('hidden');
                setTimeout(() => { mobileMenuContainer.style.transform = 'translateX(0%)'; }, 10);
                iconMenuOpen.style.display = 'none';
                iconMenuClose.style.display = 'inline-block';
                document.body.style.overflow = 'hidden';
                mobileMenuButton.setAttribute('aria-expanded', 'true');
                componentLog('Mobile menu opened');
            };

            const closeMobileMenu = () => {
                mobileMenuContainer.style.transform = 'translateX(100%)';
                setTimeout(() => { mobileMenuPanel.classList.add('hidden'); }, 300);
                iconMenuOpen.style.display = 'inline-block';
                iconMenuClose.style.display = 'none';
                document.body.style.overflow = '';
                mobileMenuButton.setAttribute('aria-expanded', 'false');
                componentLog('Mobile menu closed');
            };

            mobileMenuButton.addEventListener('click', () => {
                const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
                if (isExpanded) {
                    closeMobileMenu();
                } else {
                    openMobileMenu();
                }
            });
            if(mobileMenuBackdrop) mobileMenuBackdrop.addEventListener('click', closeMobileMenu);
        }


        let lastScrollTop = 0;
        const headerScrollHandler = debounce(() => {
            if (!window.componentState.headerElement || isMobileDevice()) return;
            const st = window.pageYOffset || document.documentElement.scrollTop;
            if (st > lastScrollTop && st > 100) {
                window.componentState.headerElement.classList.add('header-hidden');
            } else {
                window.componentState.headerElement.classList.remove('header-hidden');
            }
            lastScrollTop = st <= 0 ? 0 : st;
        }, 150);
        
        window.addEventListener('scroll', headerScrollHandler, { passive: true });

        window.componentState.headerInitialized = true;
        componentLog('Header initialized successfully');
    } catch (error) {
        componentLog(`Error initializing header: ${error.message}`, 'error');
        window.componentState.headerInitialized = false;
    }
}
window.initializeHeader = initializeHeaderInternal; 

async function loadHeader() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (!headerPlaceholder) {
        componentLog('Header placeholder #header-placeholder not found. Cannot load header.', 'error');
        return;
    }
    headerPlaceholder.setAttribute('aria-busy', 'true');
    try {
        const success = await loadComponent('Header', 'header-placeholder', '/components/header.html');
        if (!success) throw new Error('Failed to load header HTML content');
        
        await initializeHeaderInternal();
        
        headerPlaceholder.setAttribute('aria-busy', 'false');
        componentLog('Header successfully loaded and initialized');
    } catch (error) {
        componentLog(`Error in loadHeader: ${error.message}`, 'error');
        headerPlaceholder.innerHTML = `<div class="p-4 text-center text-red-500 dark:text-red-400">Failed to load header: ${error.message}</div>`;
        headerPlaceholder.setAttribute('aria-busy', 'false');
    }
}

function initializeFooterInternal() {
    if (window.componentState.footerInitialized) {
        componentLog("Footer already initialized. Skipping.", 'warn');
        return;
    }
    componentLog("Initializing footer...");
    const footerElement = document.querySelector('footer');
    if (!footerElement) {
        componentLog("Footer element not found", 'error');
        return;
    }

    try {
        const newsletterForm = document.getElementById('newsletterForm');
        const newsletterMessage = document.getElementById('newsletterMessage');
        const currentYearSpan = document.getElementById('current-year');

        if (currentYearSpan) {
            currentYearSpan.textContent = new Date().getFullYear();
        }

        if (newsletterForm && newsletterMessage) {
            newsletterForm.addEventListener('submit', async function(event) {
                event.preventDefault();
                const formData = new FormData(newsletterForm);
                const email = formData.get('email');

                if (!email || !email.trim()) {
                    newsletterMessage.textContent = 'Vui lòng nhập địa chỉ email hợp lệ.';
                    newsletterMessage.className = 'mt-2 text-sm text-red-500 dark:text-red-400';
                    return;
                }

                newsletterMessage.textContent = 'Đang gửi...';
                newsletterMessage.className = 'mt-2 text-sm text-yellow-500 dark:text-yellow-400';

                try {
                    const response = await fetch(newsletterForm.action, {
                        method: 'POST',
                        body: formData,
                        headers: { 'Accept': 'application/json' }
                    });

                    if (response.ok) {
                        newsletterMessage.textContent = 'Cảm ơn bạn đã đăng ký!';
                        newsletterMessage.className = 'mt-2 text-sm text-green-500 dark:text-green-400';
                        newsletterForm.reset();
                    } else {
                        const data = await response.json().catch(() => ({})); // Graceful JSON parsing
                        newsletterMessage.textContent = Object.hasOwn(data, 'errors') && data.errors.length > 0
                            ? data.errors.map(error => error.message).join(", ")
                            : 'Đã có lỗi xảy ra khi đăng ký. Vui lòng thử lại.';
                        newsletterMessage.className = 'mt-2 text-sm text-red-500 dark:text-red-400';
                    }
                } catch (error) {
                    newsletterMessage.textContent = 'Lỗi kết nối. Vui lòng thử lại.';
                    newsletterMessage.className = 'mt-2 text-sm text-red-500 dark:text-red-400';
                    componentLog(`Newsletter submission error: ${error.message}`, 'error');
                }
            });
        }
        window.componentState.footerInitialized = true;
        componentLog("Footer initialized successfully");
    } catch (error) {
        componentLog(`Error initializing footer: ${error.message}`, 'error');
        window.componentState.footerInitialized = false;
    }
}
window.initializeFooter = initializeFooterInternal;

function initializeFabButtonsInternal() {
    if (window.componentState.fabInitialized) {
        componentLog("FABs already initialized. Skipping.", 'warn');
        return;
    }

    const fabContainer = document.getElementById('fab-container');
    if (!fabContainer) {
        componentLog("FAB container #fab-container not found. Skipping FAB initialization.", 'warn');
        window.componentState.fabInitialized = true; 
        return;
    }

    try {
        componentLog("Initializing FABs...");
        const fabElements = {
            contactMainBtn: fabContainer.querySelector('#contact-main-btn'),
            contactOptions: fabContainer.querySelector('#contact-options'),
            shareMainBtn: fabContainer.querySelector('#share-main-btn'),
            shareOptions: fabContainer.querySelector('#share-options'),
        };

        const shareSubmenuItems = [
            { label: 'Facebook', icon: 'fab fa-facebook-f text-blue-600 dark:text-blue-400', action: () => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}` },
            { label: 'Twitter', icon: 'fab fa-twitter text-sky-500 dark:text-sky-400', action: () => `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(document.title)}` },
            { label: 'LinkedIn', icon: 'fab fa-linkedin-in text-blue-700 dark:text-blue-500', action: () => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}` },
            {
                label: 'Copy link',
                icon: 'fas fa-link text-gray-500 dark:text-gray-400',
                action: () => {
                    navigator.clipboard.writeText(window.location.href).then(() => {
                        componentLog('Link copied to clipboard!');
                        // Add user feedback here, e.g., show a temporary message
                    }).catch(err => {
                        componentLog('Failed to copy link: ', 'error', err);
                    });
                }
            },
        ];

        const contactSubmenuItems = [
            { label: 'Hotline 1', icon: 'fas fa-phone-alt text-green-500 dark:text-green-400', action: 'tel:+84896920547' },
            { label: 'Hotline 2', icon: 'fas fa-phone-alt text-green-500 dark:text-green-400', action: 'tel:+84795555789' },
            { label: 'Messenger (IVS Academy)', icon: 'fab fa-facebook-messenger text-blue-500 dark:text-blue-400', action: 'https://m.me/hr.ivsacademy' },
            { label: 'Messenger (IVS JSC)', icon: 'fab fa-facebook-messenger text-blue-500 dark:text-blue-400', action: 'https://m.me/ivsmastery' },
            { label: 'Zalo OA', icon: 'fa-solid fa-comment-dots text-[#0068ff]', action: 'https://zalo.me/ivsjsc' }, // Zalo icon using a solid comment and color
            { label: 'WhatsApp', icon: 'fab fa-whatsapp text-green-600 dark:text-green-400', action: 'https://wa.me/84795555789' }
        ];
        
        function populateSubmenu(submenuElement, items) {
            if (!submenuElement) return;
            submenuElement.innerHTML = '';
            items.forEach(item => {
                const link = document.createElement('a');
                link.className = 'flex items-center px-3 py-2 text-sm text-gray-700 dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-md w-full text-left';
                let iconHtml = item.icon ? `<i class="${item.icon} w-5 h-5 mr-2.5 text-center"></i>` : (item.iconSvg || '');
                link.innerHTML = `${iconHtml}<span>${item.label}</span>`;

                if (typeof item.action === 'function') {
                    link.href = '#';
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        item.action();
                        const parentMenu = link.closest('.fab-options-menu');
                        const parentBtn = parentMenu ? parentMenu.previousElementSibling : null;
                        if (parentMenu) parentMenu.classList.add('hidden');
                        if (parentBtn) parentBtn.setAttribute('aria-expanded', 'false');
                    });
                } else {
                    link.href = item.action;
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                }
                submenuElement.appendChild(link);
            });
        }

        if (fabElements.shareOptions) populateSubmenu(fabElements.shareOptions, shareSubmenuItems);
        if (fabElements.contactOptions) populateSubmenu(fabElements.contactOptions, contactSubmenuItems);

        const toggleFabMenu = (btn, menu) => {
            if (btn && menu) {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isCurrentlyHidden = menu.classList.contains('hidden');
                    document.querySelectorAll('#fab-container .fab-options-menu').forEach(m => {
                        if (m !== menu) {
                            m.classList.add('hidden');
                            const associatedBtn = m.previousElementSibling;
                            if (associatedBtn) associatedBtn.setAttribute('aria-expanded', 'false');
                        }
                    });
                    menu.classList.toggle('hidden', !isCurrentlyHidden);
                    btn.setAttribute('aria-expanded', String(!menu.classList.contains('hidden')));
                });
            }
        };

        if (fabElements.contactMainBtn) toggleFabMenu(fabElements.contactMainBtn, fabElements.contactOptions);
        if (fabElements.shareMainBtn) toggleFabMenu(fabElements.shareMainBtn, fabElements.shareOptions);

        document.addEventListener('click', (e) => {
            const openMenus = fabContainer.querySelectorAll('.fab-options-menu:not(.hidden)');
            openMenus.forEach(menu => {
                const btn = menu.previousElementSibling;
                if (btn && !btn.contains(e.target) && !menu.contains(e.target)) {
                    menu.classList.add('hidden');
                    btn.setAttribute('aria-expanded', 'false');
                }
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openMenus = fabContainer.querySelectorAll('.fab-options-menu:not(.hidden)');
                openMenus.forEach(menu => {
                    menu.classList.add('hidden');
                    const btn = menu.previousElementSibling;
                    if (btn) {
                        btn.setAttribute('aria-expanded', 'false');
                        btn.focus();
                    }
                });
            }
        });
        window.componentState.fabInitialized = true;
        componentLog("FABs initialized");
    } catch (error) {
        componentLog(`Error initializing FABs: ${error.message}`, 'error');
        window.componentState.fabInitialized = false;
    }
}
window.initializeFabButtons = initializeFabButtonsInternal;


window.loadComponentsAndInitialize = async function() {
    if (window.componentState.componentsLoadedAndInitialized) {
        componentLog('Components already loaded and initialized. Skipping.', 'warn');
        return;
    }

    try {
        componentLog('Starting component initialization sequence...');
        await loadHeader();
        
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            const footerLoaded = await loadComponent('Footer', 'footer-placeholder', '/components/footer.html');
            if (footerLoaded) await initializeFooterInternal();
            else componentLog('Footer placeholder found, but failed to load footer content.', 'warn');
        } else {
             componentLog('Footer placeholder #footer-placeholder not found. Skipping footer load.', 'warn');
        }
        
        const fabPlaceholder = document.getElementById('fab-container-placeholder');
        if (fabPlaceholder) {
             const fabLoaded = await loadComponent('FABs', 'fab-container-placeholder', '/components/fab-container.html');
             if (fabLoaded) await initializeFabButtonsInternal();
             else componentLog('FAB placeholder found, but failed to load FAB content.', 'warn');
        } else {
            componentLog('FAB placeholder #fab-container-placeholder not found. Skipping FAB load.', 'warn');
        }


        if (typeof window.initializeLanguageSystem === 'function') {
            try {
                await window.initializeLanguageSystem();
                componentLog('Language system initialized');
            } catch (error) {
                componentLog(`Error initializing language system: ${error.message}`, 'error');
            }
        } else {
            componentLog('window.initializeLanguageSystem not found', 'warn');
        }

        window.componentState.componentsLoadedAndInitialized = true;
        componentLog('Core components (Header, Footer, FABs, Language) loading sequence complete.');

        if (typeof window.onPageComponentsLoadedCallback === 'function') {
           if (document.readyState !== 'loading') {
                await window.onPageComponentsLoadedCallback();
           } else {
                document.addEventListener('DOMContentLoaded', async () => {
                    await window.onPageComponentsLoadedCallback();
                });
           }
        } else {
            componentLog('window.onPageComponentsLoadedCallback is not defined. Page-specific initializations might be missed.', 'warn');
        }

    } catch (error) {
        componentLog(`Error in component initialization sequence: ${error.message}`, 'error');
        window.componentState.componentsLoadedAndInitialized = false;
    }
};

window.onPageComponentsLoadedCallback = async () => {
    componentLog('Executing common page-specific initializations (AOS, etc.)');
    
    if (typeof AOS !== 'undefined' && AOS.init) {
        AOS.init({
            offset: isMobileDevice() ? 50 : 80,
            duration: isMobileDevice() ? 500 : 700,
            easing: 'ease-out-quad',
            once: true,
            mirror: false,
            anchorPlacement: 'top-bottom',
        });
        componentLog('AOS initialized via onPageComponentsLoadedCallback');
    } else {
        componentLog('AOS library not found or not initialized.', 'warn');
    }

    if (typeof window.applyLanguage === 'function') {
        window.applyLanguage(); 
    }

    if (typeof window.loadPosts === 'function') { // Example for a blog or news page
        window.loadPosts();
    }
     if (typeof window.initSocialSharing === 'function') { // Example for social sharing buttons
        window.initSocialSharing();
    }

};


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.loadComponentsAndInitialize);
} else {
    if (!window.componentState.componentsLoadedAndInitialized) {
        window.loadComponentsAndInitialize();
    }
}

async function loadComponentsAndInitialize() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        try {
            const response = await fetch('/header.html');
            if (response.ok) {
                headerPlaceholder.innerHTML = await response.text();
                initializeHeaderInternal();
            } else {
                componentLog(`Failed to load header.html: ${response.status}`, 'error');
            }
        } catch (error) {
            componentLog(`Error loading header.html: ${error.message}`, 'error');
        }
    }

    const fabPlaceholder = document.getElementById('fab-container-placeholder');
    if (fabPlaceholder) {
        fabPlaceholder.innerHTML = `
            <div id="fab-container" class="fixed bottom-4 right-4 z-[999] flex flex-col items-end space-y-2">
                <button id="scroll-to-top-btn" title="Lên đầu trang" aria-label="Lên đầu trang"
                        class="flex items-center justify-center w-10 h-10 bg-ivs-orange-500 hover:bg-ivs-orange-600 text-white rounded-full shadow-md transition-all duration-300">
                    <i class="fas fa-arrow-up text-sm"></i>
                </button>
            </div>
        `;
        initializeFabButtonsInternal();
    }
}

function initializeHeaderInternal() {
    if (window.componentState.headerInitialized) return;
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenuPanel = document.getElementById('mobile-menu-panel');
    const closeBtn = document.querySelector('.mobile-menu-close-btn');

    if (!mobileMenuToggle || !mobileMenuPanel) {
        componentLog('One or more mobile menu elements not found. Skipping mobile menu initialization.', 'warn');
        return;
    }

    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuPanel.classList.toggle('active');
        mobileMenuToggle.setAttribute('aria-expanded', mobileMenuPanel.classList.contains('active'));
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            mobileMenuPanel.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        });
    }

    window.componentState.headerInitialized = true;
    componentLog('Header initialized successfully');
}

function initializeFabButtonsInternal() {
    if (window.componentState.fabInitialized) return;
    const scrollToTopBtn = document.getElementById('scroll-to-top-btn');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            scrollToTopBtn.classList.toggle('visible', window.scrollY > 300);
        });
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    window.componentState.fabInitialized = true;
    componentLog('FAB initialized successfully');
}

document.addEventListener('DOMContentLoaded', loadComponentsAndInitialize);