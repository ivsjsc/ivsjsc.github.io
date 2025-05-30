// Global state tracking
window.componentState = window.componentState || {
    componentsLoadedAndInitialized: false,
    headerInitialized: false,
    fabInitialized: false,
    footerInitialized: false,
    headerElement: null,
    initialized: false
};

function componentLog(message, type = 'log') {
    const debugMode = false; // Đặt thành true để bật console logs cho debug
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
        const headerElement = document.querySelector('header');
        if (!headerElement) {
            throw new Error('Header element not found');
        }
        window.componentState.headerElement = headerElement;
        
        // Initialize header scroll behavior
        let lastScrollTop = 0;
        window.addEventListener('scroll', window.debounce(() => {
            if (!window.componentState.headerElement) return;
            
            const st = window.pageYOffset || document.documentElement.scrollTop;
            if (st > lastScrollTop && st > 100) {
                window.componentState.headerElement.classList.add('header-hidden');
            } else {
                window.componentState.headerElement.classList.remove('header-hidden');
            }
            lastScrollTop = st <= 0 ? 0 : st;
        }, 100));

        // Initialize mobile menu
        const mobileMenuBtn = headerElement.querySelector('#mobile-menu-button');
        const mobileMenu = headerElement.querySelector('#mobile-menu-panel');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
                mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
                mobileMenu.classList.toggle('active');
                document.body.classList.toggle('overflow-hidden');
            });

            // Close mobile menu when clicking outside of it
            mobileMenu.addEventListener('click', function(e) {
                if (e.target === mobileMenu) {
                    const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
                    if (isExpanded) {
                        mobileMenuBtn.setAttribute('aria-expanded', 'false');
                        mobileMenu.classList.remove('active');
                        document.body.classList.remove('overflow-hidden');
                    }
                }
            });

            // Close mobile menu on ESC key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    mobileMenu.classList.remove('active');
                    document.body.classList.remove('overflow-hidden');
                }
            });
        }

        window.componentState.headerInitialized = true;
        componentLog('Header initialized successfully');
    } catch (error) {
        componentLog(`Error initializing header: ${error.message}`, 'error');
        window.componentState.headerInitialized = false;
    }
}

// Make header initialization available globally
window.initializeHeader = initializeHeaderInternal;

function initializeFooterInternal() {
    if (window.componentState.footerInitialized) {
        componentLog("Footer already initialized. Skipping.", 'warn');
        return;
    }
    
    componentLog("Initializing footer...");
    const footer = document.querySelector('footer');
    if (!footer) {
        componentLog("Footer element not found", 'error');
        return;
    }

    try {
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
                        headers: { 'Accept': 'application/json' }
                    });
                    
                    if (response.ok) {
                        newsletterMessage.textContent = 'Cảm ơn bạn đã đăng ký!';
                        newsletterMessage.className = 'mt-2 text-sm text-green-400';
                        newsletterForm.reset();
                    } else {
                        const data = await response.json();
                        newsletterMessage.textContent = Object.hasOwn(data, 'errors') 
                            ? data.errors.map(error => error.message).join(", ") 
                            : 'Đã có lỗi xảy ra. Vui lòng thử lại.';
                        newsletterMessage.className = 'mt-2 text-sm text-red-400';
                    }
                } catch (error) {
                    newsletterMessage.textContent = 'Đã có lỗi xảy ra. Vui lòng thử lại.';
                    newsletterMessage.className = 'mt-2 text-sm text-red-400';
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
            { label: 'Facebook', icon: 'fab fa-facebook-f text-blue-600', action: () => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}` },
            { label: 'Twitter', icon: 'fab fa-twitter text-blue-400', action: () => `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(document.title)}` },
            { label: 'LinkedIn', icon: 'fab fa-linkedin-in text-blue-700', action: () => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}` },
        ];

        const contactSubmenuItems = [
            { label: 'Hotline 1', icon: 'fas fa-phone-alt text-green-500', action: 'tel:+84896920547' },
            { label: 'Hotline 2', icon: 'fas fa-phone-alt text-green-500', action: 'tel:+84795555789' },
            { label: 'Messenger (HR)', icon: 'fab fa-facebook-messenger text-blue-500', action: 'https://m.me/hr.ivsacademy' },
            { label: 'Messenger (Mastery)', icon: 'fab fa-facebook-messenger text-blue-500', action: 'https://m.me/ivsmastery' },
            { label: 'Zalo OA', iconSvg: '<svg class="w-5 h-5 mr-2" viewBox="0 0 50 50" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M9 4C6.2504839 4 4 6.2504839 4 9v32c0 2.749516 2.2504839 5 5 5h32c2.749516 0 5-2.250484 5-5V9c0-2.749516-2.250484-5-5-5H9z"/></svg>', action: 'https://zalo.me/0896920547' },
            { label: 'WhatsApp', icon: 'fab fa-whatsapp text-green-600', action: 'https://wa.me/84795555789' }
        ];

        function populateSubmenu(submenuElement, items) {
            if (!submenuElement) return;
            submenuElement.innerHTML = ''; // Clear existing items
            items.forEach(item => {
                const link = document.createElement('a');
                link.href = typeof item.action === 'function' ? item.action() : item.action;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.className = 'flex items-center px-3 py-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md w-full text-left';
                let iconHtml = item.icon ? `<i class="${item.icon} w-5 h-5 mr-2"></i>` : (item.iconSvg || '');
                link.innerHTML = `${iconHtml} ${item.label}`;
                submenuElement.appendChild(link);
            });
        }

        if (fabElements.shareOptions) populateSubmenu(fabElements.shareOptions, shareSubmenuItems);
        if (fabElements.contactOptions) populateSubmenu(fabElements.contactOptions, contactSubmenuItems);

        const toggleFabMenu = (btn, menu) => {
            if (btn && menu) {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isCurrentlyHidden = menu.classList.contains('fab-hidden');
                    document.querySelectorAll('#fab-container .relative > div').forEach(m => {
                        if (m !== menu) {
                            m.classList.add('fab-hidden');
                            const associatedBtn = m.previousElementSibling;
                            if (associatedBtn) associatedBtn.setAttribute('aria-expanded', 'false');
                        }
                    });
                    menu.classList.toggle('fab-hidden', !isCurrentlyHidden);
                    btn.setAttribute('aria-expanded', String(!menu.classList.contains('fab-hidden')));
                });
            }
        };

        if (fabElements.contactMainBtn) toggleFabMenu(fabElements.contactMainBtn, fabElements.contactOptions);
        if (fabElements.shareMainBtn) toggleFabMenu(fabElements.shareMainBtn, fabElements.elements.shareOptions); // Lỗi: elements.shareOptions thay vì fabElements.shareOptions

        // Initialize scroll to top
        if (fabElements.scrollToTopBtn) {
            fabElements.scrollToTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            const handleScroll = window.debounce(() => {
                if (fabElements.scrollToTopBtn) {
                    fabElements.scrollToTopBtn.classList.toggle('fab-hidden', window.pageYOffset <= 100);
                    fabElements.scrollToTopBtn.classList.toggle('flex', window.pageYOffset > 100);
                }
            }, 150);

            window.addEventListener('scroll', handleScroll, { passive: true });
            handleScroll(); // Initial check
        }

        // Close menus on outside click
        document.addEventListener('click', (e) => {
            const openMenus = fabContainer.querySelectorAll('.relative > div:not(.fab-hidden)');
            openMenus.forEach(menu => {
                const btn = menu.previousElementSibling;
                if (btn && !btn.contains(e.target) && !menu.contains(e.target)) {
                    menu.classList.add('fab-hidden');
                    btn.setAttribute('aria-expanded', 'false');
                }
            });
        });

        // Close menus on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openMenus = fabContainer.querySelectorAll('.relative > div:not(.fab-hidden)');
                openMenus.forEach(menu => {
                    menu.classList.add('fab-hidden');
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

// Load and initialize all components in proper sequence
window.loadComponentsAndInitialize = async function() {
    if (window.componentState.componentsLoadedAndInitialized) {
        componentLog('Components already loaded and initialized. Skipping.', 'warn');
        return;
    }

    try {
        componentLog('Starting component initialization sequence...');

        // Load header first
        const headerLoaded = await loadComponent('Header', 'header-placeholder', '/components/header.html', 'placeholder');
        if (!headerLoaded) {
            throw new Error('Failed to load header component');
        }

        // Initialize header functionality
        await initializeHeaderInternal();

        // Load footer
        const footerLoaded = await loadComponent('Footer', 'footer-placeholder', '/components/footer.html', 'placeholder');
        if (!footerLoaded) {
            throw new Error('Failed to load footer component');
        }

        // Initialize footer functionality
        await initializeFooterInternal();

        // Load FAB container dynamically into body
        const fabLoaded = await loadComponent('FAB Container', null, '/components/fab-container.html', 'body');
        if (!fabLoaded) {
            throw new Error('Failed to load FAB container component');
        }

        // Initialize FAB buttons
        await initializeFabButtonsInternal();

        // Initialize language system if available
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
        componentLog('All components loaded and initialized successfully');

        // Run any page-specific initialization callback
        if (typeof window.onPageComponentsLoadedCallback === 'function') {
            componentLog('Executing page-specific initialization callback');
            await window.onPageComponentsLoadedCallback();
        }

    } catch (error) {
        componentLog(`Error in component initialization sequence: ${error.message}`, 'error');
        window.componentState.componentsLoadedAndInitialized = false;
        throw error;
    }
};

// Auto-initialize components when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.loadComponentsAndInitialize);
} else {
    if (!window.componentState.componentsLoadedAndInitialized) {
        window.loadComponentsAndInitialize();
    }
}
