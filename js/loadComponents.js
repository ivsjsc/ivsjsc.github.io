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

function initializeHeaderInternal() {
    if (headerInitialized) {
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
            mobileMenuPanel.classList.toggle('active'); // Toggles 'active' class
            iconMenuOpen.classList.toggle('hidden'); // Toggles 'hidden' class
            iconMenuClose.classList.toggle('hidden'); // Toggles 'hidden' class
            document.body.classList.toggle('overflow-hidden', !isExpanded);
        });

        // Close menu when clicking outside the mobile menu panel
        mobileMenuPanel.addEventListener('click', function(e) {
            if (e.target === mobileMenuPanel) {
                const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
                if (isExpanded) { // Only toggle if currently open
                    mobileMenuButton.setAttribute('aria-expanded', String(!isExpanded));
                    mobileMenuPanel.classList.toggle('active');
                    iconMenuOpen.classList.toggle('hidden');
                    iconMenuClose.classList.toggle('hidden');
                    document.body.classList.toggle('overflow-hidden', !isExpanded);
                }
            }
        });

        // Close menu when Escape key is pressed
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenuPanel.classList.contains('active')) {
                const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
                mobileMenuButton.setAttribute('aria-expanded', String(!isExpanded));
                mobileMenuPanel.classList.toggle('active');
                iconMenuOpen.classList.toggle('hidden');
                iconMenuClose.classList.toggle('hidden');
                document.body.classList.toggle('overflow-hidden', !isExpanded);
                mobileMenuButton.focus(); // Return focus to the button
            }
        });
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
                                if (otherIcon) otherIcon.classList.remove('rotate-180');
                            }
                        }
                    });
                }
                submenuContent.classList.toggle('max-h-0', isExpanded);
                submenuContent.classList.toggle('max-h-screen', !isExpanded);
                toggle.setAttribute('aria-expanded', String(!isExpanded));
                if (icon) icon.classList.toggle('rotate-180', !isExpanded);
            });
        }
    });

    const desktopNavGroups = mainHeader.querySelectorAll('nav.hidden.md\\:flex .group');
    desktopNavGroups.forEach(group => {
        const button = group.querySelector('button[aria-haspopup="true"]');
        const menu = group.querySelector('.mega-menu, .desktop-dropdown-menu');
        if (button && menu) {
            button.addEventListener('focus', () => {
                menu.style.opacity = '1'; menu.style.visibility = 'visible'; menu.style.pointerEvents = 'auto'; menu.style.transform = 'translateY(0)'; button.setAttribute('aria-expanded', 'true');
            });
            group.addEventListener('mouseenter', () => button.setAttribute('aria-expanded', 'true'));
            group.addEventListener('mouseleave', () => button.setAttribute('aria-expanded', 'false'));
            menu.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    menu.style.opacity = '0'; menu.style.visibility = 'hidden'; menu.style.pointerEvents = 'none'; menu.style.transform = 'translateY(5px)'; button.setAttribute('aria-expanded', 'false'); button.focus();
                }
            });
            group.addEventListener('focusout', (e) => {
                if (!group.contains(e.relatedTarget)) {
                    menu.style.opacity = '0'; menu.style.visibility = 'hidden'; menu.style.pointerEvents = 'none'; menu.style.transform = 'translateY(5px)'; button.setAttribute('aria-expanded', 'false');
                }
            });
        }
    });
    
    headerInitialized = true;
    componentLog("Header (Tailwind) initialized successfully.");
}
window.initializeHeader = initializeHeaderInternal; 

function initializeFooterInternal() {
    if (footerInitialized) {
        return;
    }
    componentLog("Initializing footer...");
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterMessage = document.getElementById('newsletter-message');
    const currentYearSpan = document.getElementById('currentYearFooter');
    if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();
    if (newsletterForm && newsletterMessage) {
        newsletterForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const formData = new FormData(newsletterForm);
            const email = formData.get('email');
            if (!email) {
                newsletterMessage.textContent = 'Vui lòng nhập địa chỉ email.'; newsletterMessage.className = 'mt-2 text-sm text-red-400'; return;
            }
            newsletterMessage.textContent = 'Đang gửi...'; newsletterMessage.className = 'mt-2 text-sm text-yellow-400';
            try {
                const response = await fetch(newsletterForm.action, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } });
                if (response.ok) {
                    newsletterMessage.textContent = 'Cảm ơn bạn đã đăng ký!'; newsletterMessage.className = 'mt-2 text-sm text-green-400'; newsletterForm.reset();
                } else {
                    const data = await response.json();
                    newsletterMessage.textContent = Object.hasOwn(data, 'errors') ? data["errors"].map(error => error["message"]).join(", ") : 'Đã có lỗi xảy ra. Vui lòng thử lại.';
                    newsletterMessage.className = 'mt-2 text-sm text-red-400';
                }
            } catch (error) {
                newsletterMessage.textContent = 'Đã có lỗi xảy ra. Vui lòng thử lại.'; newsletterMessage.className = 'mt-2 text-sm text-red-400';
            }
        });
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
    const fabContainer = document.getElementById('fab-container');
    if (!fabContainer) {
        componentLog("FAB container #fab-container not found. Skipping FAB initialization.", 'warn');
        fabInitialized = true;
        return;
    }
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
        { label: 'Zalo OA', iconSvg: '<svg class="w-5 h-5 mr-2" viewBox="0 0 50 50" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M9 4C6.2504839 4 4 6.2504839 4 9v32c0 2.749516 2.2504839 5 5 5h32c2.749516 0 5-2.250484 5-5V9c0-2.749516-2.250484-5-5-5H9zm0 2h6.58C12.009 9.716 10 14.518 10 19.5c0 5.16 2.11 10.099 5.91 13.84.12.21.22 1.24-.24 2.43-.29.75-.87 1.73-1.99 2.1.03.45.36.83.8.92 2.87.57 4.73-.29 6.23-.97 1.35-.62 2.24-1.04 3.61.52 2.8 1.09 5.78 1.66 8.86 1.66 4.094 0 8.031-.999 11.5-2.887V41c0 1.668-.332 3-2 3H9c-1.669 0-3-1.332-3-3V9c0-1.669 1.331-3 3-3zM33 15c.55 0 1 .45 1 1v9c0 .55-.45 1-1 1s-1-.45-1-1v-9c0-.55.45-1 1-1zm-15 1l5 0c.36 0 .7.2.88.52.17.31.16.7-.03 1.01L19.8 24H23c.55 0 1 .45 1 1s-.45 1-1 1h-5c-.36 0-.7-.2-.88-.52-.17-.31-.16-.7.03-1.01L21.2 18H18c-.55 0-1-.45-1-1s.45-1 1-1z"/></svg>', action: 'https://zalo.me/ivsjsc' },
        { label: 'Zalo Tư vấn', iconSvg: '<svg class="w-5 h-5 mr-2" viewBox="0 0 50 50" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M9 4C6.2504839 4 4 6.2504839 4 9v32c0 2.749516 2.2504839 5 5 5h32c2.749516 0 5-2.250484 5-5V9c0-2.749516-2.250484-5-5-5H9zm0 2h6.58C12.009 9.716 10 14.518 10 19.5c0 5.16 2.11 10.099 5.91 13.84.12.21.22 1.24-.24 2.43-.29.75-.87 1.73-1.99 2.1.03.45.36.83.8.92 2.87.57 4.73-.29 6.23-.97 1.35-.62 2.24-1.04 3.61.52 2.8 1.09 5.78 1.66 8.86 1.66 4.094 0 8.031-.999 11.5-2.887V41c0 1.668-.332 3-2 3H9c-1.669 0-3-1.332-3-3V9c0-1.669 1.331-3 3-3zM33 15c.55 0 1 .45 1 1v9c0 .55-.45 1-1 1s-1-.45-1-1v-9c0-.55.45-1 1-1zm-15 1l5 0c.36 0 .7.2.88.52.17.31.16.7-.03 1.01L19.8 24H23c.55 0 1 .45 1 1s-.45 1-1 1h-5c-.36 0-.7-.2-.88-.52-.17-.31-.16-.7.03-1.01L21.2 18H18c-.55 0-1-.45-1-1s.45-1 1-1z"/></svg>', action: 'https://zalo.me/nmt5555789' },
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
    
    if (fabElements.scrollToTopBtn) {
        fabElements.scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        const handleScroll = window.debounce(() => {
            if(fabElements.scrollToTopBtn){
                 fabElements.scrollToTopBtn.classList.toggle('fab-hidden', window.pageYOffset <= 100);
                 fabElements.scrollToTopBtn.classList.toggle('flex', window.pageYOffset > 100);
            }
        }, 150);
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
    }

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
    fabInitialized = true;
    componentLog("FABs initialized.");
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
    
    const fabContainerHtml = `
    <div id="fab-container" class="fixed bottom-5 right-5 z-[999] flex flex-col items-end space-y-3">
        <button id="scroll-to-top-btn" title="Lên đầu trang" aria-label="Lên đầu trang"
            class="fab-hidden items-center justify-center w-12 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg transition-opacity duration-300">
            <i class="fas fa-arrow-up"></i>
        </button>
        <div class="relative">
            <button id="share-main-btn" title="Chia sẻ" aria-label="Mở menu chia sẻ" aria-haspopup="true" aria-expanded="false"
                class="w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-transform duration-200 ease-in-out">
                <i class="fas fa-share-alt"></i>
            </button>
            <div id="share-options" class="fab-hidden absolute bottom-full right-0 mb-2 w-auto min-w-max p-2 bg-white dark:bg-gray-800 rounded-md shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col items-start space-y-1">
            </div>
        </div>
        <div class="relative">
            <button id="contact-main-btn" title="Liên hệ nhanh" aria-label="Mở menu liên hệ nhanh" aria-haspopup="true" aria-expanded="false"
                class="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-transform duration-200 ease-in-out">
                <i class="fas fa-comment-dots"></i>
            </button>
            <div id="contact-options" class="fab-hidden absolute bottom-full right-0 mb-2 w-auto min-w-max p-2 bg-white dark:bg-gray-800 rounded-md shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col items-start space-y-1">
            </div>
        </div>
    </div>`;
    if (!document.getElementById('fab-container')) {
        document.body.insertAdjacentHTML('beforeend', fabContainerHtml);
        componentLog("FAB container HTML structure injected into body.");
    }


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
    
    initializeFabButtonsInternal(); 

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

    if (typeof window.onPageComponentsLoadedCallback === 'function') {
        componentLog("Executing onPageComponentsLoadedCallback().");
        window.onPageComponentsLoadedCallback();
    } else {
        componentLog("onPageComponentsLoadedCallback() not defined globally.", "warn");
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.loadHeaderFooterAndFab);
} else {
    if (!componentsLoadedAndInitialized) { 
        window.loadHeaderFooterAndFab();
    }
}
