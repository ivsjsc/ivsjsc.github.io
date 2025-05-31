'use strict';

// Utility functions (có thể tách ra một file riêng nếu dùng nhiều)
const utils = {
    log: (message, type = 'log') => {
        if (window.debugMode || type === 'error' || type === 'warn') {
            console[type](`[loadComponents.js] ${message}`);
        }
    },
    isMobile: () => window.innerWidth <= 768,
    debounce: (func, wait, immediate) => { // Giữ nguyên debounce của bạn },
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
    },
    $: (selector, context = document) => context.querySelector(selector),
    $$: (selector, context = document) => context.querySelectorAll(selector),
    loadHTML: async (filePath) => {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`HTTP error ${response.status} loading ${filePath}`);
        return await response.text();
    },
    handleFetchError: (componentName, placeholder, error) => {
        utils.log(`Error loading ${componentName}: ${error.message}`, 'error');
        if (placeholder) {
            placeholder.innerHTML = `<div class="p-4 text-center text-red-500 dark:text-red-400">Failed to load ${componentName}.</div>`;
        }
    }
};

const componentState = window.componentState = window.componentState || {
    componentsLoadedAndInitialized: false,
    headerInitialized: false,
    fabInitialized: false,
    footerInitialized: false,
    headerElement: null
};

const headerModule = {
    init: async () => {
        if (componentState.headerInitialized) {
            utils.log('Header already initialized', 'warn');
            return;
        }

        try {
            componentState.headerElement = utils.$('header#main-header');
            if (!componentState.headerElement) throw new Error('Header element not found');

            const elements = {
                panel: utils.$('#mobile-menu-panel'),
                button: utils.$('#mobile-menu-button'),
                openIcon: utils.$('#icon-menu-open'),
                closeIcon: utils.$('#icon-menu-close'),
                backdrop: utils.$('#mobile-menu-backdrop'),
                container: utils.$('.mobile-menu-container', utils.$('#mobile-menu-panel')),
                closeBtn: utils.$('.mobile-menu-close-btn', utils.$('#mobile-menu-panel')),
            };

            for (const key in elements) {
                if (!elements[key]) {
                    utils.log(`Mobile menu element #${key} not found`, 'warn');
                    return; // Hoặc throw error nếu cần
                }
            }

            // Initial state setup (chuyển vào CSS)
            // elements.openIcon.classList.remove('hidden');
            // elements.closeIcon.classList.add('hidden');
            // elements.panel.classList.add('hidden');
            // elements.backdrop.classList.add('hidden');
            // elements.container.style.transition = 'transform 0.3s ease-in-out';
            // elements.container.style.transform = 'translateX(100%)';

            const openMenu = () => {
                elements.panel.classList.remove('hidden');
                elements.backdrop.classList.remove('hidden');
                setTimeout(() => {
                    if (elements.container) elements.container.style.transform = 'translateX(0%)';
                }, 10);
                if (elements.openIcon) elements.openIcon.classList.add('hidden');
                if (elements.closeIcon) elements.closeIcon.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
                if (elements.button) elements.button.setAttribute('aria-expanded', 'true');
                utils.log('Mobile menu opened');
            };

            const closeMenu = () => {
                if (elements.container) elements.container.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (elements.panel) elements.panel.classList.add('hidden');
                    if (elements.backdrop) elements.backdrop.classList.add('hidden');
                }, 300);
                if (elements.openIcon) elements.openIcon.classList.remove('hidden');
                if (elements.closeIcon) elements.closeIcon.classList.add('hidden');
                document.body.style.overflow = '';
                if (elements.button) elements.button.setAttribute('aria-expanded', 'false');
                utils.log('Mobile menu closed');
            };

            if (elements.button) elements.button.addEventListener('click', () => elements.button.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu());
            if (elements.backdrop) elements.backdrop.addEventListener('click', closeMenu);
            if (elements.closeBtn) elements.closeBtn.addEventListener('click', closeMenu);

            utils.$$('nav a', elements.container).forEach(link => {
                link.addEventListener('click', () => {
                    if (!link.closest('.mobile-submenu-toggle') && !link.parentElement.classList.contains('mobile-submenu-toggle')) {
                        closeMenu();
                    }
                });
            });

            let lastScrollTop = 0;
            const headerScrollHandler = utils.debounce(() => {
                if (!componentState.headerElement || utils.isMobile()) return;
                const st = window.pageYOffset || document.documentElement.scrollTop;
                if (st > lastScrollTop && st > 100) {
                    componentState.headerElement.classList.add('header-hidden');
                } else {
                    componentState.headerElement.classList.remove('header-hidden');
                }
                lastScrollTop = st <= 0 ? 0 : st;
            }, 150);

            window.addEventListener('scroll', headerScrollHandler, { passive: true });

            componentState.headerInitialized = true;
            utils.log('Header initialized successfully');

        } catch (error) {
            utils.log(`Error initializing header: ${error.message}`, 'error');
            componentState.headerInitialized = false;
        }
    },
    load: async () => {
        try {
            const headerPlaceholder = utils.$('#header-placeholder');
            if (!headerPlaceholder) throw new Error('Header placeholder not found');

            headerPlaceholder.setAttribute('aria-busy', 'true');
            await utils.loadComponent('Header', '#header-placeholder', '/components/header.html');
            await headerModule.init();
            headerPlaceholder.setAttribute('aria-busy', 'false');
            utils.log('Header loaded and initialized');

        } catch (error) {
            utils.handleFetchError('Header', utils.$('#header-placeholder'), error);
        }
    }
};


const footerModule = {
    init: async () => {
        if (componentState.footerInitialized) {
            utils.log("Footer already initialized. Skipping.", 'warn');
            return;
        }

        try {
            const newsletterForm = utils.$('#newsletterForm');
            const newsletterMessage = utils.$('#newsletterMessage');
            const currentYearSpan = utils.$('#current-year');

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
                        utils.log(`Newsletter submission error: ${error.message}`, 'error');
                    }
                });
            }

            componentState.footerInitialized = true;
            utils.log("Footer initialized successfully");

        } catch (error) {
            utils.log(`Error initializing footer: ${error.message}`, 'error');
            componentState.footerInitialized = false;
        }
    },
    load: async () => {
        try {
            const footerPlaceholder = utils.$('#footer-placeholder');
            if (!footerPlaceholder) throw new Error('Footer placeholder not found');

            await utils.loadComponent('Footer', '#footer-placeholder', '/components/footer.html');
            await footerModule.init();

        } catch (error) {
            utils.handleFetchError('Footer', utils.$('#footer-placeholder'), error);
        }
    }
};

const fabModule = {
    init: async () => {
        if (componentState.fabInitialized) {
            utils.log("FABs already initialized. Skipping.", 'warn');
            return;
        }

        const fabContainer = utils.$('#fab-container');
        if (!fabContainer) {
            utils.log("FAB container #fab-container not found. Skipping FAB initialization.", 'warn');
            componentState.fabInitialized = true;
            return;
        }

        try {
            const fabElements = {
                contactMainBtn: utils.$('#contact-main-btn', fabContainer),
                contactOptions: utils.$('#contact-options', fabContainer),
                shareMainBtn: utils.$('#share-main-btn', fabContainer),
                shareOptions: utils.$('#share-options', fabContainer),
                scrollToTopBtn: utils.$('#scroll-to-top-btn', fabContainer)
            };

            const shareSubmenuItems = [
                { label: 'Facebook', icon: 'fab fa-facebook-f text-blue-600 dark:text-blue-400', action: () => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}` },
                { label: 'LinkedIn', icon: 'fab fa-linkedin-in text-blue-700 dark:text-blue-500', action: () => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}` },
                {
                    label: 'Copy link', icon: 'fas fa-link text-gray-500 dark:text-gray-400', action: () => {
                        const tempInput = document.createElement('textarea');
                        tempInput.value = window.location.href;
                        document.body.appendChild(tempInput);
                        tempInput.select();
                        try {
                            document.execCommand('copy');
                            utils.log('Link copied to clipboard!');
                            const copyButtonSpan = utils.$('a[href="#"] > span', fabElements.shareOptions);
                            if (copyButtonSpan && copyButtonSpan.textContent.includes('Copy link')) {
                                const originalText = copyButtonSpan.textContent;
                                copyButtonSpan.textContent = 'Đã sao chép!';
                                setTimeout(() => { copyButtonSpan.textContent = originalText; }, 2000);
                            }
                        } catch (err) {
                            utils.log('Failed to copy link: ' + err, 'error');
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

            const populateSubmenu = (submenuElement, items) => {
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
            };

            if (fabElements.shareOptions) {
                fabElements.shareOptions.classList.add('fab-options-menu', 'hidden');
                populateSubmenu(fabElements.shareOptions, shareSubmenuItems);
            }
            if (fabElements.contactOptions) {
                fabElements.contactOptions.classList.add('fab-options-menu', 'hidden');
                populateSubmenu(fabElements.contactOptions, contactSubmenuItems);
            }

            const toggleMenu = (btn, menu) => {
                if (btn && menu) {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const isHidden = menu.classList.contains('hidden');
                        utils.$$('.fab-options-menu', fabContainer).forEach(m => {
                            if (m !== menu) {
                                m.classList.add('hidden');
                                const prevBtn = m.previousElementSibling;
                                if (prevBtn) prevBtn.setAttribute('aria-expanded', 'false');
                            }
                        });
                        menu.classList.toggle('hidden', !isHidden);
                        btn.setAttribute('aria-expanded', String(!isHidden));
                    });
                }
            };

            if (fabElements.contactMainBtn) toggleMenu(fabElements.contactMainBtn, fabElements.contactOptions);
            if (fabElements.shareMainBtn) toggleMenu(fabElements.shareMainBtn, fabElements.shareOptions);

            if (fabElements.scrollToTopBtn) {
                const handleScroll = utils.debounce(() => {
                    fabElements.scrollToTopBtn.classList.toggle('visible', window.scrollY > (utils.isMobile() ? 250 : 150));
                }, 150);

                window.addEventListener('scroll', handleScroll, { passive: true });
                handleScroll();
                fabElements.scrollToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
            } else {
                utils.log('Scroll-to-top button not found', 'warn');
            }

            document.addEventListener('click', (e) => {
                utils.$$('.fab-options-menu:not(.hidden)', fabContainer).forEach(menu => {
                    const btn = menu.previousElementSibling;
                    if (btn && !btn.contains(e.target) && !menu.contains(e.target)) {
                        menu.classList.add('hidden');
                        btn.setAttribute('aria-expanded', 'false');
                    }
                });
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    utils.$$('.fab-options-menu:not(.hidden)', fabContainer).forEach(menu => {
                        menu.classList.add('hidden');
                        const btn = menu.previousElementSibling;
                        if (btn) { btn.setAttribute('aria-expanded', 'false'); btn.focus(); }
                    });
                }
            });

            componentState.fabInitialized = true;
            utils.log("FABs initialized");

        } catch (error) {
            utils.log(`Error initializing FABs: ${error.message}`, 'error');
            componentState.fabInitialized = false;
        }
    },
    load: async () => {
        try {
            const fabPlaceholder = utils.$('#fab-container-placeholder');
            if (!fabPlaceholder) throw new Error('FAB container placeholder not found');

            await utils.loadComponent('FABs', '#fab-container-placeholder', '/components/fab-container.html');
            await fabModule.init();

        } catch (error) {
            utils.handleFetchError('FABs', utils.$('#fab-container-placeholder'), error);
        }
    }
};


const languageModule = {
    init: async () => {
        if (typeof window.initializeLanguageSystem === 'function') {
            try {
                await window.initializeLanguageSystem();
                utils.log('Language system initialized');
            } catch (error) {
                utils.log(`Error initializing language system: ${error.message}`, 'error');
            }
        } else {
            utils.log('window.initializeLanguageSystem not found', 'warn');
        }
    }
};

const pageCallbacks = {
    init: async () => {
        if (typeof window.onPageComponentsLoadedCallback === 'function') {
            if (document.readyState !== 'loading') {
                await window.onPageComponentsLoadedCallback();
            } else {
                document.addEventListener('DOMContentLoaded', () => window.onPageComponentsLoadedCallback());
            }
        } else {
            utils.log('window.onPageComponentsLoadedCallback not defined.', 'warn');
        }
    }
};


window.loadComponentsAndInitialize = async function() {
    if (componentState.componentsLoadedAndInitialized) {
        utils.log('Components already loaded. Skipping.', 'warn');
        return;
    }

    try {
        utils.log('Starting component initialization...');

        await headerModule.load();
        await footerModule.load();
        await fabModule.load();
        await languageModule.init();
        await pageCallbacks.init();

        componentState.componentsLoadedAndInitialized = true;
        utils.log('All components initialized.');

    } catch (error) {
        utils.log(`Initialization failed: ${error.message}`, 'error');
        componentState.componentsLoadedAndInitialized = false;
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.loadComponentsAndInitialize);
} else {
    if (!componentState.componentsLoadedAndInitialized) {
        window.loadComponentsAndInitialize();
    }
}