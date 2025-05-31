'use strict';

window.componentState = window.componentState || {
    componentsLoadedAndInitialized: false,
    headerInitialized: false,
    fabInitialized: false,
    footerInitialized: false,
    headerElement: null
};

function componentLog(message, type = 'log') {
    const debugMode = false; // Set to true for detailed console logs
    if (debugMode || type === 'error' || type === 'warn') {
        console[type](`[loadComponents.js] ${message}`);
    }
}

function isMobileDevice() {
    return window.innerWidth <= 768; // Standard breakpoint for mobile
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

async function loadComponent(componentName, placeholderId, filePath) {
    componentLog(`Attempting to load component: ${componentName} from ${filePath} into #${placeholderId}`);
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status} loading ${filePath}`);
        }
        const html = await response.text();
        const placeholder = document.getElementById(placeholderId);

        if (placeholder) {
            placeholder.innerHTML = html;
            componentLog(`${componentName} injected into #${placeholderId}.`);
        } else {
            componentLog(`Placeholder element #${placeholderId} for ${componentName} not found.`, 'error');
            return false;
        }
        return true;
    } catch (error) {
        componentLog(`Error loading ${componentName} from ${filePath}: ${error.message}`, 'error');
        const placeholder = document.getElementById(placeholderId);
        if (placeholder) {
            placeholder.innerHTML = `<div class="p-4 text-center text-red-500 dark:text-red-400">Failed to load ${componentName}.</div>`;
        }
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
        const closeBtnInsidePanel = mobileMenuPanel ? mobileMenuPanel.querySelector('.mobile-menu-close-btn') : null;

        if (!mobileMenuPanel || !mobileMenuButton || !iconMenuOpen || !iconMenuClose || !mobileMenuContainer || !mobileMenuBackdrop || !closeBtnInsidePanel) {
            componentLog('One or more mobile menu elements not found. Mobile menu may not function correctly.', 'warn');
        } else {
            // Initial state setup
            iconMenuOpen.classList.remove('hidden');
            iconMenuClose.classList.add('hidden');
            mobileMenuPanel.classList.add('hidden');
            mobileMenuBackdrop.classList.add('hidden');
            mobileMenuContainer.style.transition = 'transform 0.3s ease-in-out';
            mobileMenuContainer.style.transform = 'translateX(100%)';

            const openMobileMenu = () => {
                mobileMenuPanel.classList.remove('hidden');
                mobileMenuBackdrop.classList.remove('hidden');
                // Ensure the mobile menu panel and backdrop have high z-index in CSS
                // e.g., mobile-menu-panel { position: fixed; z-index: 50; }
                // e.g., mobile-menu-backdrop { position: fixed; z-index: 40; }
                setTimeout(() => { // Small delay for smooth transition start
                    mobileMenuContainer.style.transform = 'translateX(0%)';
                }, 10);
                iconMenuOpen.classList.add('hidden');
                iconMenuClose.classList.remove('hidden');
                document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
                mobileMenuButton.setAttribute('aria-expanded', 'true');
                componentLog('Mobile menu opened');
            };

            const closeMobileMenu = () => {
                mobileMenuContainer.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    mobileMenuPanel.classList.add('hidden');
                    mobileMenuBackdrop.classList.add('hidden');
                }, 300); // Match CSS transition duration
                iconMenuOpen.classList.remove('hidden');
                iconMenuClose.classList.add('hidden');
                document.body.style.overflow = ''; // Restore scrolling
                mobileMenuButton.setAttribute('aria-expanded', 'false');
                componentLog('Mobile menu closed');
            };

            mobileMenuButton.addEventListener('click', () => {
                const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
                if (isExpanded) closeMobileMenu();
                else openMobileMenu();
            });
            mobileMenuBackdrop.addEventListener('click', closeMobileMenu);
            closeBtnInsidePanel.addEventListener('click', closeMobileMenu);
            
            const mobileNavLinks = mobileMenuContainer.querySelectorAll('nav a');
            mobileNavLinks.forEach(link => {
                link.addEventListener('click', () => {
                    // Close menu if it's not a submenu toggle
                    if (!link.closest('.mobile-submenu-toggle') && !link.parentElement.classList.contains('mobile-submenu-toggle')) {
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
                window.componentState.headerElement.classList.add('header-hidden'); // Ensure .header-hidden hides the header
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
        return false; 
    }
    headerPlaceholder.setAttribute('aria-busy', 'true');
    try {
        const success = await loadComponent('Header', 'header-placeholder', '/components/header.html');
        if (!success) throw new Error('Failed to load header HTML content');
        await initializeHeaderInternal();
        headerPlaceholder.setAttribute('aria-busy', 'false');
        componentLog('Header successfully loaded and initialized');
        return true;
    } catch (error) {
        componentLog(`Error in loadHeader: ${error.message}`, 'error');
        headerPlaceholder.innerHTML = `<div class="p-4 text-center text-red-500 dark:text-red-400">Failed to load header.</div>`;
        headerPlaceholder.setAttribute('aria-busy', 'false');
        return false;
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
        componentLog("Footer element not found, cannot initialize.", 'error');
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
            { label: 'LinkedIn', icon: 'fab fa-linkedin-in text-blue-700 dark:text-blue-500', action: () => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}` },
            {
                label: 'Copy link', icon: 'fas fa-link text-gray-500 dark:text-gray-400', action: () => {
                    // Using document.execCommand('copy') for better iframe compatibility
                    const tempInput = document.createElement('textarea');
                    tempInput.value = window.location.href;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    try {
                        document.execCommand('copy');
                        componentLog('Link copied to clipboard!');
                        const copyButtonSpan = fabElements.shareOptions.querySelector('a[href="#"] > span');
                        if (copyButtonSpan && copyButtonSpan.textContent.includes('Copy link')) {
                            const originalText = copyButtonSpan.textContent;
                            copyButtonSpan.textContent = 'Đã sao chép!';
                            setTimeout(() => { copyButtonSpan.textContent = originalText; }, 2000);
                        }
                    } catch (err) {
                        componentLog('Failed to copy link: ' + err, 'error');
                    } finally {
                        document.body.removeChild(tempInput);
                    }
                }
            }
        ];
        const contactSubmenuItems = [
            { label: 'Hotline 1', icon: 'fas fa-phone-alt text-green-500 dark:text-green-400', action: 'tel:+84896920547' },
            { label: 'Zalo OA', icon: 'fa-solid fa-comment-dots text-[#0068ff]', action: 'https://zalo.me/ivsjsc' }
        ];

        function populateSubmenu(submenuElement, items) {
            if (!submenuElement) return;
            submenuElement.innerHTML = '';
            items.forEach(item => {
                const link = document.createElement('a');
                link.className = 'fab-options-menu-item flex items-center px-3 py-2 text-sm text-gray-700 dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-md w-full text-left';
                let iconHtml = item.icon ? `<i class="${item.icon} w-5 h-5 mr-2.5 text-center"></i>` : (item.iconSvg || '');
                link.innerHTML = `${iconHtml}<span>${item.label}</span>`;
                if (typeof item.action === 'function') {
                    link.href = '#';
                    link.addEventListener('click', (e) => {
                        e.preventDefault(); item.action();
                        if (submenuElement.classList.contains('fab-options-menu')) {
                            submenuElement.classList.add('hidden');
                            const parentBtn = submenuElement.previousElementSibling;
                            if (parentBtn) parentBtn.setAttribute('aria-expanded', 'false');
                        }
                    });
                } else {
                    link.href = item.action; link.target = '_blank'; link.rel = 'noopener noreferrer';
                }
                submenuElement.appendChild(link);
            });
        }

        if (fabElements.shareOptions) { 
            fabElements.shareOptions.classList.add('fab-options-menu', 'hidden'); 
            populateSubmenu(fabElements.shareOptions, shareSubmenuItems); 
        }
        if (fabElements.contactOptions) { 
            fabElements.contactOptions.classList.add('fab-options-menu', 'hidden'); 
            populateSubmenu(fabElements.contactOptions, contactSubmenuItems); 
        }

        const toggleFabMenu = (btn, menu) => {
            if (btn && menu) {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent document click from closing immediately
                    const isCurrentlyHidden = menu.classList.contains('hidden');
                    // Close other open FAB menus
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
        
        if (fabElements.scrollToTopBtn) {
            const fabScrollHandler = debounce(() => {
                if (fabElements.scrollToTopBtn) {
                    fabElements.scrollToTopBtn.classList.toggle('visible', window.scrollY > (isMobileDevice() ? 250 : 150));
                }
            }, 150);
            window.addEventListener('scroll', fabScrollHandler, { passive: true });
            fabScrollHandler(); // Initial check
            fabElements.scrollToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        } else {
            componentLog('Scroll-to-top button #scroll-to-top-btn not found in FAB container.', 'warn');
        }

        // Close FAB menus when clicking outside
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
        // Close FAB menus on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openMenus = fabContainer.querySelectorAll('.fab-options-menu:not(.hidden)');
                openMenus.forEach(menu => {
                    menu.classList.add('hidden');
                    const btn = menu.previousElementSibling;
                    if (btn) { btn.setAttribute('aria-expanded', 'false'); btn.focus(); }
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
        await loadHeader(); // Ensure header is loaded and initialized first

        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            const footerLoaded = await loadComponent('Footer', 'footer-placeholder', '/components/footer.html');
            if (footerLoaded) await initializeFooterInternal();
        } else { componentLog('Footer placeholder not found.', 'warn'); }
        
        const fabPlaceholder = document.getElementById('fab-container-placeholder');
        if (fabPlaceholder) {
            const fabLoaded = await loadComponent('FABs', 'fab-container-placeholder', '/components/fab-container.html');
            if (fabLoaded) await initializeFabButtonsInternal();
        } else { componentLog('FAB placeholder not found.', 'warn'); }

        if (typeof window.initializeLanguageSystem === 'function') {
            try {
                await window.initializeLanguageSystem();
                componentLog('Language system initialized');
            } catch (error) { componentLog(`Error initializing language system: ${error.message}`, 'error'); }
        } else { componentLog('window.initializeLanguageSystem not found', 'warn'); }

        window.componentState.componentsLoadedAndInitialized = true;
        componentLog('Core components loading sequence complete.');

        if (typeof window.onPageComponentsLoadedCallback === 'function') {
           if (document.readyState !== 'loading') {
                await window.onPageComponentsLoadedCallback();
           } else {
                document.addEventListener('DOMContentLoaded', () => window.onPageComponentsLoadedCallback());
           }
        } else { componentLog('window.onPageComponentsLoadedCallback not defined.', 'warn'); }
    } catch (error) {
        componentLog(`Error in main initialization sequence: ${error.message}`, 'error');
        window.componentState.componentsLoadedAndInitialized = false;
    }
};

window.onPageComponentsLoadedCallback = async () => {
    componentLog('Executing common page-specific initializations (AOS, applyLanguage etc.)');
    if (typeof AOS !== 'undefined' && AOS.init) {
        AOS.init({
            offset: isMobileDevice() ? 50 : 80,
            duration: isMobileDevice() ? 500 : 600,
            easing: 'ease-out-quad',
            once: true,
            mirror: false,
            anchorPlacement: 'top-bottom',
        });
        componentLog('AOS initialized.');
    } else { componentLog('AOS library not found.', 'warn'); }

    if (typeof window.applyLanguage === 'function') {
        window.applyLanguage(); 
        componentLog('Language applied.');
    } else { componentLog('applyLanguage function not found.', 'warn');}
    
    // Example page-specific functions
    if (typeof window.loadPosts === 'function') window.loadPosts();
    if (typeof window.initSocialSharing === 'function') window.initSocialSharing();
};

// Ensure components load after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.loadComponentsAndInitialize);
} else {
    // If DOM is already ready (e.g., script loaded asynchronously or at end of body)
    if (!window.componentState.componentsLoadedAndInitialized) {
        window.loadComponentsAndInitialize();
    }
}
