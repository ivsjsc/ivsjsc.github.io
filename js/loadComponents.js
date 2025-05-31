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
        const iconMenuOpen = headerElement.querySelector('#icon-menu-open');
        const iconMenuClose = headerElement.querySelector('#icon-menu-close');

        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
                mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
                mobileMenu.classList.toggle('active');
                if (iconMenuOpen && iconMenuClose) {
                    iconMenuOpen.classList.toggle('hidden');
                    iconMenuClose.classList.toggle('hidden');
                }
                document.body.classList.toggle('overflow-hidden');
            });

            // Close mobile menu when a link inside it is clicked
            const mobileNavLinks = mobileMenu.querySelectorAll('a');
            mobileNavLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (mobileMenu.classList.contains('active')) {
                        mobileMenuBtn.click(); // Simulate click on menu button to close
                    }
                });
            });
        }

        // Initialize dropdowns
        const dropdowns = headerElement.querySelectorAll('.group');
        dropdowns.forEach(dropdown => {
            const button = dropdown.querySelector('[aria-haspopup="true"]');
            const menu = dropdown.querySelector('[role="menu"]');
            if (!button || !menu) return;

            button.addEventListener('click', (e) => {
                e.preventDefault();
                const isExpanded = button.getAttribute('aria-expanded') === 'true';
                button.setAttribute('aria-expanded', !isExpanded);
                menu.classList.toggle('hidden');
            });

            // Close on outside click
            document.addEventListener('click', (e) => {
                if (!dropdown.contains(e.target)) {
                    button.setAttribute('aria-expanded', 'false');
                    menu.classList.add('hidden');
                }
            });
        });

        window.componentState.headerInitialized = true;
        componentLog('Header initialized successfully');
    } catch (error) {
        componentLog(`Error initializing header: ${error.message}`, 'error');
        window.componentState.headerInitialized = false;
    }
}

// Make header initialization available globally
window.initializeHeader = initializeHeaderInternal;

async function loadHeader() {
    try {
        const header = document.getElementById('header-placeholder');
        if (!header) {
            throw new Error('Header placeholder not found');
        }

        // Show loading state
        header.setAttribute('aria-busy', 'true');
        
        const success = await loadComponent('Header', 'header-placeholder', '/components/header.html');
        if (!success) {
            throw new Error('Failed to load header component');
        }

        // Initialize header functionality
        await initializeHeaderInternal();
        
        header.setAttribute('aria-busy', 'false');
        window.componentState.headerInitialized = true;
        
        componentLog('Header successfully loaded and initialized');
    } catch (error) {
        componentLog(`Error in loadHeader: ${error.message}`, 'error');
        const header = document.getElementById('header-placeholder');
        if (header) {
            header.innerHTML = `<div class="p-4 text-center text-red-500">Failed to load header: ${error.message}</div>`;
            header.setAttribute('aria-busy', 'false');
        }
    }
}

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
        const newsletterForm = document.getElementById('newsletterForm'); // Changed from newsletter-form
        const newsletterMessage = document.getElementById('newsletterMessage'); // Changed from newsletter-message
        const currentYearSpan = document.getElementById('current-year'); // Changed from currentYearFooter
        
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
        if (fabElements.shareMainBtn) toggleFabMenu(fabElements.shareMainBtn, fabElements.shareOptions);

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

        // Add FAB container dynamically if needed
        const fabContainerHtml = `
        <div id="fab-container" class="fixed bottom-5 right-5 z-[999] flex flex-col items-end space-y-3">
            <button id="scroll-to-top-btn" title="Lên đầu trang" aria-label="Lên đầu trang"
                class="fab-hidden items-center justify-center w-12 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg transition-opacity duration-300">
                <i class="fas fa-arrow-up"></i>
            </button>
            <div class="relative">
                <button id="contact-main-btn" title="Liên hệ" aria-label="Mở menu liên hệ" aria-haspopup="true" aria-expanded="false"
                    class="flex items-center justify-center w-12 h-12 bg-primary hover:bg-primary-dark text-white rounded-full shadow-lg">
                    <i class="fas fa-phone"></i>
                </button>
                <div id="contact-options" class="fab-hidden absolute bottom-full right-0 mb-2 w-auto min-w-max p-2 bg-white dark:bg-gray-800 rounded-md shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col items-start space-y-1">
                </div>
            </div>
            <div class="relative">
                <button id="share-main-btn" title="Chia sẻ" aria-label="Mở menu chia sẻ" aria-haspopup="true" aria-expanded="false"
                    class="flex items-center justify-center w-12 h-12 bg-secondary hover:bg-secondary-dark text-white rounded-full shadow-lg">
                    <i class="fas fa-share-alt"></i>
                </button>
                <div id="share-options" class="fab-hidden absolute bottom-full right-0 mb-2 w-auto min-w-max p-2 bg-white dark:bg-gray-800 rounded-md shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col items-start space-y-1">
                </div>
            </div>
        </div>`;

        if (!document.getElementById('fab-container')) {
            document.body.insertAdjacentHTML('beforeend', fabContainerHtml);
            componentLog('FAB container HTML structure injected into body');
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
        window.onPageComponentsLoadedCallback = async () => {
            componentLog('Executing page-specific initialization callback');
            // Ensure applyLanguage is called here after language system is initialized
            if (typeof applyLanguage === 'function') {
                applyLanguage();
            } else {
                componentLog('applyLanguage function not found in global scope.', 'error');
            }
            // Assuming loadPosts is also page-specific and needs to run after components
            if (typeof loadPosts === 'function') {
                loadPosts();
            } else {
                componentLog('loadPosts function not found in global scope.', 'error');
            }
            // Initialize social sharing if it's exposed globally by script.js or other
            if (typeof window.initSocialSharing === 'function') {
                window.initSocialSharing();
            } else {
                componentLog("window.initSocialSharing is not defined. Social sharing might not work.", 'warn');
            }

            // Initialize AOS after all components and page-specific scripts are loaded
            if (typeof AOS !== 'undefined' && AOS.init) {
                AOS.init({
                    offset: 100,
                    duration: 700,
                    easing: 'ease-out-quad',
                    once: true,
                    mirror: false,
                    anchorPlacement: 'top-bottom',
                });
                componentLog('AOS initialized via onPageComponentsLoadedCallback');
            } else {
                componentLog('AOS library not found or not initialized.', 'warn');
            }
        };

        // Execute the page-specific callback if DOM is already loaded
        if (document.readyState !== 'loading') {
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
