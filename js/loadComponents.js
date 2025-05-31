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
        const headerElement = document.querySelector('header#main-header');
        if (!headerElement) {
            throw new Error('Header element (header#main-header) not found');
        }
        window.componentState.headerElement = headerElement;

        const mobileMenuPanel = document.getElementById('mobile-menu-panel');
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const iconMenuOpen = document.getElementById('icon-menu-open');
        const iconMenuClose = document.getElementById('icon-menu-close');
        const mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop');
        const mobileMenuContainer = mobileMenuPanel ? mobileMenuPanel.querySelector('.mobile-menu-container') : null;

        if (!mobileMenuPanel || !mobileMenuButton || !iconMenuOpen || !iconMenuClose || !mobileMenuContainer) {
            componentLog('One or more mobile menu elements not found. Mobile menu may not function correctly.', 'warn');
        } else {
            iconMenuClose.classList.add('hidden'); 
            iconMenuOpen.classList.remove('hidden');
            
            if(mobileMenuContainer.style.transition === ''){
                 mobileMenuContainer.style.transition = 'transform 0.3s ease-in-out';
            }
            if(!mobileMenuPanel.classList.contains('hidden')){
                 mobileMenuPanel.classList.add('hidden');
            }
            if(mobileMenuContainer.style.transform === ''){
                 mobileMenuContainer.style.transform = 'translateX(100%)';
            }


            const openMobileMenu = () => {
                mobileMenuPanel.classList.remove('hidden');
                setTimeout(() => { 
                    if (mobileMenuContainer) mobileMenuContainer.style.transform = 'translateX(0%)';
                    mobileMenuPanel.classList.add('active'); 
                }, 10);
                iconMenuOpen.classList.add('hidden');
                iconMenuClose.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
                mobileMenuButton.setAttribute('aria-expanded', 'true');
                componentLog('Mobile menu opened');
            };

            const closeMobileMenu = () => {
                if (mobileMenuContainer) mobileMenuContainer.style.transform = 'translateX(100%)';
                mobileMenuPanel.classList.remove('active');
                setTimeout(() => { 
                    mobileMenuPanel.classList.add('hidden'); 
                }, 300); 
                iconMenuOpen.classList.remove('hidden');
                iconMenuClose.classList.add('hidden');
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

            if (mobileMenuBackdrop) {
                mobileMenuBackdrop.addEventListener('click', closeMobileMenu);
            }
            
            const mobileNavLinks = mobileMenuContainer.querySelectorAll('a');
            mobileNavLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (!mobileMenuPanel.classList.contains('hidden')) {
                         closeMobileMenu();
                    }
                });
            });
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
                        const data = await response.json().catch(() => ({}));
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
            scrollToTopBtn: fabContainer.querySelector('#scroll-to-top-btn')
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
                        // Consider adding user feedback, e.g., a temporary message
                        const copyButton = fabElements.shareOptions.querySelector('a[href="#"] > span');
                        if(copyButton && copyButton.textContent.includes('Copy link')){
                            const originalText = copyButton.textContent;
                            copyButton.textContent = 'Đã sao chép!';
                            setTimeout(() => { copyButton.textContent = originalText; }, 2000);
                        }
                    }).catch(err => {
                        componentLog('Failed to copy link: ' + err, 'error');
                         try { // Fallback for older browsers / insecure contexts
                            const tempInput = document.createElement('input');
                            tempInput.value = window.location.href;
                            document.body.appendChild(tempInput);
                            tempInput.select();
                            document.execCommand('copy');
                            document.body.removeChild(tempInput);
                            componentLog('Link copied to clipboard (fallback)!');
                        } catch (fallbackError) {
                            componentLog('Fallback copy method also failed: ' + fallbackError, 'error');
                        }
                    });
                }
            },
        ];

        const contactSubmenuItems = [
            { label: 'Hotline 1', icon: 'fas fa-phone-alt text-green-500 dark:text-green-400', action: 'tel:+84896920547' },
            { label: 'Hotline 2', icon: 'fas fa-phone-alt text-green-500 dark:text-green-400', action: 'tel:+84795555789' },
            { label: 'Messenger (IVS Academy)', icon: 'fab fa-facebook-messenger text-blue-500 dark:text-blue-400', action: 'https://m.me/hr.ivsacademy' },
            { label: 'Messenger (IVS JSC)', icon: 'fab fa-facebook-messenger text-blue-500 dark:text-blue-400', action: 'https://m.me/ivsmastery' },
            { label: 'Zalo OA', icon: 'fa-solid fa-comment-dots text-[#0068ff]', action: 'https://zalo.me/ivsjsc' },
            { label: 'WhatsApp', icon: 'fab fa-whatsapp text-green-600 dark:text-green-400', action: 'https://wa.me/84795555789' }
        ];
        
        function populateSubmenu(submenuElement, items) {
            if (!submenuElement) {
                componentLog(`Submenu element not found for populating.`, 'warn');
                return;
            }
            submenuElement.innerHTML = ''; // Clear previous items
            items.forEach(item => {
                const link = document.createElement('a');
                // Added 'fab-options-menu-item' for potential specific styling or selection
                link.className = 'fab-options-menu-item flex items-center px-3 py-2 text-sm text-gray-700 dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-md w-full text-left';
                let iconHtml = item.icon ? `<i class="${item.icon} w-5 h-5 mr-2.5 text-center"></i>` : (item.iconSvg || '');
                link.innerHTML = `${iconHtml}<span>${item.label}</span>`;

                if (typeof item.action === 'function') {
                    link.href = '#'; // Make it behave like a button
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        item.action();
                        // Close the menu after action
                        if (submenuElement.classList.contains('fab-options-menu')) {
                           submenuElement.classList.add('hidden');
                           const parentBtn = submenuElement.previousElementSibling;
                           if (parentBtn) parentBtn.setAttribute('aria-expanded', 'false');
                        }
                    });
                } else {
                    link.href = item.action;
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                }
                submenuElement.appendChild(link);
            });
        }

        if (fabElements.shareOptions) {
            fabElements.shareOptions.classList.add('fab-options-menu', 'hidden'); // Ensure class for selector and initially hidden
            populateSubmenu(fabElements.shareOptions, shareSubmenuItems);
        }
        if (fabElements.contactOptions) {
             fabElements.contactOptions.classList.add('fab-options-menu', 'hidden'); // Ensure class for selector and initially hidden
            populateSubmenu(fabElements.contactOptions, contactSubmenuItems);
        }


        const toggleFabMenu = (btn, menu) => {
            if (btn && menu) {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isCurrentlyHidden = menu.classList.contains('hidden');
                    
                    // Close all other FAB submenus
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

        // Scroll-to-top button logic
        if (fabElements.scrollToTopBtn) {
            // Initially hide it if not already styled by CSS to be hidden
            if(!fabElements.scrollToTopBtn.classList.contains('visible') && !fabElements.scrollToTopBtn.classList.contains('hidden') && !fabElements.scrollToTopBtn.classList.contains('fab-hidden')) {
                 // Assuming 'fab-hidden' or direct style handles initial state based on CSS
                 // If CSS uses '.visible', then it should be initially hidden by not having '.visible'
            }

            const fabScrollHandler = debounce(() => {
                if (fabElements.scrollToTopBtn) { // Check again inside debounced function
                     // Use 'visible' class as per optimized_styles.css
                    fabElements.scrollToTopBtn.classList.toggle('visible', window.scrollY > 300);
                }
            }, 150);

            window.addEventListener('scroll', fabScrollHandler, { passive: true });
            // Initial check
            fabScrollHandler();


            fabElements.scrollToTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        } else {
            componentLog('Scroll-to-top button #scroll-to-top-btn not found in FAB container.', 'warn');
        }


        document.addEventListener('click', (e) => {
            const openMenus = fabContainer.querySelectorAll('.fab-options-menu:not(.hidden)');
            openMenus.forEach(menu => {
                const btn = menu.previousElementSibling;
                // Check if the click is outside the button AND outside the menu
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
             if (fabLoaded) {
                await initializeFabButtonsInternal();
             } else {
                componentLog('FAB placeholder found, but failed to load FAB content. FABs might not work.', 'warn');
             }
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

    if (typeof window.loadPosts === 'function') {
        window.loadPosts();
    }
    if (typeof window.initSocialSharing === 'function') {
        window.initSocialSharing();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.loadComponentsAndInitialize);
} else {
    if (!window.componentState.componentsLoadedAndInitialized) {
        window.loadComponentsAndInitialize();
    }
}
async function loadComponent(url, placeholderId) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) {
        console.error(`Placeholder ${placeholderId} not found.`);
        return;
    }
    try {
        const response = await fetch(url);
        if (response.ok) {
            placeholder.innerHTML = await response.text();
            console.log(`Loaded ${url} successfully into ${placeholderId}`);
        } else {
            console.error(`Failed to load ${url}: ${response.status} ${response.statusText}`);
            placeholder.innerHTML = `<p class="text-red-500">Không thể tải ${url}. Vui lòng kiểm tra lại.</p>`;
        }
    } catch (error) {
        console.error(`Error loading ${url}: ${error.message}`);
        placeholder.innerHTML = `<p class="text-red-500">Lỗi tải ${url}: ${error.message}</p>`;
    }
}

async function loadHeader() {
    await loadComponent('/header.html', 'header-placeholder');
    initializeHeaderInternal();
}

function initializeHeaderInternal() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenuPanel = document.getElementById('mobile-menu-panel');
    const closeBtn = document.querySelector('.mobile-menu-close-btn');
    const iconOpen = document.getElementById('f-icon-menu-open');
    const iconClose = document.getElementById('f-icon-menu-close');
    const mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop');

    if (!(mobileMenuToggle && mobileMenuPanel && closeBtn && iconOpen && iconClose && mobileMenuBackdrop)) {
        console.warn('One or more mobile menu elements not found. Mobile menu may not function correctly.');
        return;
    }

    const toggleMenu = (isOpen) => {
        mobileMenuPanel.classList.toggle('hidden', !isOpen);
        mobileMenuPanel.classList.toggle('active', isOpen);
        iconOpen.classList.toggle('hidden', isOpen);
        iconClose.classList.toggle('hidden', !isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
        mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
    };

    mobileMenuToggle.addEventListener('click', () => {
        toggleMenu(mobileMenuToggle.getAttribute('aria-expanded') !== 'true');
    });

    mobileMenuBackdrop.addEventListener('click', () => toggleMenu(false));
    closeBtn.addEventListener('click', () => toggleMenu(false));

    const mobileNavLinks = mobileMenuPanel.querySelectorAll('a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });
}

async function loadComponentsAndInitialize() {
    await loadHeader();
    // Load các components khác nếu có (footer, FAB, v.v.)
}

document.addEventListener('DOMContentLoaded', () => {
    window.loadComponentsAndInitialize = loadComponentsAndInitialize;
    loadComponentsAndInitialize();
});
// Ensure the componentState is initialized