const HEADER_COMPONENT_URL = '../header.html';
const FOOTER_COMPONENT_URL = '../footer.html';
const POSTS_JSON_URL = 'posts.json';

const HEADER_PLACEHOLDER_ID = 'header-placeholder';
const FOOTER_PLACEHOLDER_ID = 'footer-placeholder';
const NEWS_CONTAINER_ID = 'news-container';

const appState = {
    isMenuInitialized: false,
    isLanguageSystemReady: false,
    isPerformingSearch: false
};

const domCache = {};

function cacheStaticElements() {
    domCache.headerPlaceholder = document.getElementById(HEADER_PLACEHOLDER_ID);
    domCache.footerPlaceholder = document.getElementById(FOOTER_PLACEHOLDER_ID);
    domCache.newsContainer = document.getElementById(NEWS_CONTAINER_ID);
}

function debounce(func, delay) {
    let debounceTimer;
    return function(...args) {
        const context = this;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
}

async function loadComponent(placeholderId, componentUrl) {
    try {
        const response = await fetch(componentUrl);
        if (!response.ok) {
            throw new Error(`Failed to load component from ${componentUrl}: ${response.statusText}`);
        }
        const html = await response.text();
        const placeholder = document.getElementById(placeholderId);
        if (placeholder) {
            placeholder.innerHTML = html;
        } else {
             console.error(`[Script] Placeholder element with id '${placeholderId}' not found.`);
        }

        if (placeholderId === HEADER_PLACEHOLDER_ID) {
            await initializeHeader();
        }
        if (placeholderId === FOOTER_PLACEHOLDER_ID) {
            initializeFooter();
        }

    } catch (error) {
        console.error(`[Script] Error loading component from ${componentUrl}:`, error);
        const placeholder = document.getElementById(placeholderId);
        if (placeholder) {
            placeholder.innerHTML = `<p style="color: red;">Error loading component: ${error.message || error}</p>`;
        }
    }
}

async function loadHeader() {
    if (domCache.headerPlaceholder) {
        await loadComponent(HEADER_PLACEHOLDER_ID, HEADER_COMPONENT_URL);
    } else {
        console.warn(`[Script] Header placeholder element not found.`);
    }
}

async function loadFooter() {
     if (domCache.footerPlaceholder) {
        await loadComponent(FOOTER_PLACEHOLDER_ID, FOOTER_COMPONENT_URL);
    } else {
        console.warn(`[Script] Footer placeholder element not found.`);
    }
}

async function loadInternalNews() {
    if (!domCache.newsContainer) {
        console.warn(`[Script] News container element not found.`);
        return;
    }

    try {
        const response = await fetch(POSTS_JSON_URL);
        if (!response.ok) {
            throw new Error(`Failed to load news posts from ${POSTS_JSON_URL}: ${response.statusText}`);
        }
        const posts = await response.json();
        let newsHTML = '';

        if (posts && Array.isArray(posts)) {
            for (const post of posts) {
                newsHTML += `
                    <article class="bg-white dark:bg-slate-800 dark:border-slate-700 p-6 rounded-lg shadow-md" data-aos="fade-up" data-aos-delay="100">
                        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">${post.title}</h3>
                        <p class="text-gray-700 dark:text-gray-400">${post.content}</p>
                        <a href="${post.link}" class="text-blue-500 hover:underline inline-block mt-4" target="_blank" rel="noopener">Đọc thêm</a>
                    </article>
                `;
            }
        } else {
            console.warn("[Script] No posts available or invalid format.");
            newsHTML = '<p class="text-gray-500 dark:text-gray-400">Không có tin tức nào.</p>';
        }

        domCache.newsContainer.innerHTML = newsHTML;
    } catch (error) {
        console.error("[Script] Error loading news:", error);
        domCache.newsContainer.innerHTML = '<p class="text-red-500 dark:text-red-400">Không thể tải tin tức.</p>';
    }
}

function initializeFabButtons() {
    const fabElements = {
        contactMainBtn: document.getElementById('contact-main-btn'),
        contactOptions: document.getElementById('contact-options'),
        shareMainBtn: document.getElementById('share-main-btn'),
        shareOptions: document.getElementById('share-options'),
        scrollToTopBtn: document.getElementById('scroll-to-top-btn')
    };

    if (!fabElements.contactMainBtn || !fabElements.contactOptions || !fabElements.shareMainBtn || !fabElements.shareOptions || !fabElements.scrollToTopBtn) {
        console.warn("[Script] One or more FAB elements not found. FAB functionality will be limited.");
        return;
    }

    function toggleSubmenu(button, submenu) {
        const isHidden = submenu.classList.contains('fab-hidden');
        [fabElements.contactOptions, fabElements.shareOptions].forEach(menu => {
            if (menu !== submenu && !menu.classList.contains('fab-hidden')) {
                menu.classList.add('fab-hidden');
                const associatedBtn = menu === fabElements.contactOptions ? fabElements.contactMainBtn : fabElements.shareMainBtn;
                associatedBtn.setAttribute('aria-expanded', 'false');
            }
        });
        submenu.classList.toggle('fab-hidden');
        button.setAttribute('aria-expanded', String(submenu.classList.contains('fab-hidden') ? 'false' : 'true'));
        if (!submenu.classList.contains('fab-hidden')) {
            const firstOption = submenu.querySelector('a');
            if (firstOption) firstOption.focus();
        } else {
            button.focus();
        }
    }

    fabElements.contactMainBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleSubmenu(fabElements.contactMainBtn, fabElements.contactOptions); });
    fabElements.shareMainBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleSubmenu(fabElements.shareMainBtn, fabElements.shareOptions); });

    const pageUrl = window.location.href;
    const pageTitle = document.title;
    const shareFacebook = document.getElementById('share-facebook');
    if(shareFacebook) { shareFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`; shareFacebook.target = '_blank';}
    const shareZalo = document.getElementById('share-zalo');
    if(shareZalo) { shareZalo.href = `https://zalo.me/share?text=${encodeURIComponent(pageTitle + " - " + pageUrl)}`; shareZalo.target = '_blank';}

    document.addEventListener('click', (e) => {
        if (!fabElements.contactOptions.classList.contains('fab-hidden') && !fabElements.contactMainBtn.contains(e.target) && !fabElements.contactOptions.contains(e.target)) {
            fabElements.contactOptions.classList.add('fab-hidden'); fabElements.contactMainBtn.setAttribute('aria-expanded', 'false');
        }
        if (!fabElements.shareOptions.classList.contains('fab-hidden') && !fabElements.shareMainBtn.contains(e.target) && !fabElements.shareOptions.contains(e.target)) {
            fabElements.shareOptions.classList.add('fab-hidden'); fabElements.shareMainBtn.setAttribute('aria-expanded', 'false');
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            [fabElements.contactOptions, fabElements.shareOptions].forEach(menu => {
                if (!menu.classList.contains('fab-hidden')) {
                    menu.classList.add('fab-hidden');
                    const associatedBtn = menu === fabElements.contactOptions ? fabElements.contactMainBtn : fabElements.shareMainBtn;
                    associatedBtn.setAttribute('aria-expanded', 'false'); associatedBtn.focus();
                }
            });
        }
    });
    window.addEventListener('scroll', () => {
        fabElements.scrollToTopBtn.classList.toggle('fab-hidden', window.pageYOffset <= 100);
        fabElements.scrollToTopBtn.classList.toggle('flex', window.pageYOffset > 100);
    }, { passive: true });
    fabElements.scrollToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

async function initializeHeader() {
    try {
        const headerPlaceholder = document.getElementById(HEADER_PLACEHOLDER_ID);
        if (!headerPlaceholder) {
            console.warn("[Script] Header placeholder not found. Header interactivity may not be initialized.");
            return;
        }

        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuIcon = mobileMenuButton ? mobileMenuButton.querySelector('i') : null;

        if (mobileMenuButton && mobileMenu && mobileMenuIcon) {
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
                if (mobileMenu.classList.contains('hidden')) {
                    mobileMenuIcon.classList.remove('fa-times');
                    mobileMenuIcon.classList.add('fa-bars');
                    const openSubmenu = mobileMenu.querySelector('.mobile-submenu:not(.hidden)');
                    if(openSubmenu) openSubmenu.classList.add('hidden');
                    const openSubmenuIcon = mobileMenu.querySelector('.fa-chevron-up');
                    if(openSubmenuIcon) {
                        openSubmenuIcon.classList.remove('fa-chevron-up');
                        openSubmenuIcon.classList.add('fa-chevron-down');
                    }
                } else {
                    mobileMenuIcon.classList.remove('fa-bars');
                    mobileMenuIcon.classList.add('fa-times');
                }
            });

            const mobileMenuLinks = mobileMenu.querySelectorAll('a');
            mobileMenuLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    if (!e.target.closest('button[onclick*="toggleMobileSubmenu"]')) {
                         if (!mobileMenu.classList.contains('hidden')) {
                            mobileMenu.classList.add('hidden');
                            mobileMenuIcon.classList.remove('fa-times');
                            mobileMenuIcon.classList.add('fa-bars');
                         }
                    }
                });
            });
        }

        const langViButton = document.getElementById('lang-vi');
        const langEnButton = document.getElementById('lang-en');

        function setActiveLangButton(lang) {
            if (!langViButton || !langEnButton) return;
            langViButton.classList.remove('active-lang', 'bg-primary', 'text-white');
            langEnButton.classList.remove('active-lang', 'bg-primary', 'text-white');
            langViButton.classList.add('text-neutral-700', 'dark:text-gray-300');
            langEnButton.classList.add('text-neutral-700', 'dark:text-gray-300');

            if (lang === 'vi') {
                langViButton.classList.add('active-lang');
            } else {
                langEnButton.classList.add('active-lang');
            }
        }

        let currentLanguage = localStorage.getItem('language') || document.documentElement.lang || 'vi';
        setActiveLangButton(currentLanguage);

        if(langViButton) {
            langViButton.addEventListener('click', () => {
                localStorage.setItem('language', 'vi');
                setActiveLangButton('vi');
                if (typeof updateLanguage === 'function') updateLanguage('vi');
                else location.reload();
            });
        }

        if(langEnButton) {
            langEnButton.addEventListener('click', () => {
                localStorage.setItem('language', 'en');
                setActiveLangButton('en');
                 if (typeof updateLanguage === 'function') updateLanguage('en');
                else location.reload();
            });
        }

        const headerDarkModeToggle = document.getElementById('dark-mode-toggle');
        const mobileHeaderDarkModeToggle = document.getElementById('mobile-dark-mode-toggle');

        function updateToggleIcon(button, isDark) {
            if (button && button.querySelector('i')) {
                button.querySelector('i').className = isDark ? 'fas fa-sun' : 'fas fa-moon';
            }
            if (button && button.id === 'mobile-dark-mode-toggle' && button.querySelector('span.ml-2')) {
                 button.querySelector('span.ml-2').textContent = isDark ? 'Chế độ Sáng' : 'Chế độ Tối';
            }
        }

        function setupThemeToggleListener(button) {
            if (button) {
                button.addEventListener('click', () => {
                    const isDarkMode = document.documentElement.classList.toggle('dark');
                    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
                    updateToggleIcon(headerDarkModeToggle, isDarkMode);
                    updateToggleIcon(mobileHeaderDarkModeToggle, isDarkMode);
                });
            }
        }
        setupThemeToggleListener(headerDarkModeToggle);
        setupThemeToggleListener(mobileHeaderDarkModeToggle);

        const isCurrentlyDark = document.documentElement.classList.contains('dark');
        updateToggleIcon(headerDarkModeToggle, isCurrentlyDark);
        updateToggleIcon(mobileHeaderDarkModeToggle, isCurrentlyDark);

    } catch (error) {
        console.error("[Script] Error initializing header:", error);
    }
}

function initializeFooter() {
    try {
        const currentYearSpan = document.getElementById('current-year');
        if (currentYearSpan) {
          currentYearSpan.textContent = new Date().getFullYear();
        }

        const newsletterForm = document.getElementById('newsletterForm');
        const newsletterEmail = document.getElementById('newsletterEmail');
        const newsletterMessage = document.getElementById('newsletterMessage');

        if (newsletterForm && newsletterEmail && newsletterMessage) {
            newsletterForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const submitButton = newsletterForm.querySelector('button[type="submit"]');
                const originalButtonText = submitButton.textContent;

                const getTranslation = (key, fallback) => {
                    const langKey = key.replace(/_/g, '-') + '-text-key';
                    return submitButton.dataset[langKey] || fallback;
                };

                const translations = {
                    processing: getTranslation('newsletter_processing', 'Đang xử lý...'),
                    success: getTranslation('newsletter_success', 'Cảm ơn bạn đã đăng ký! Vui lòng kiểm tra email để xác nhận.'),
                    error: getTranslation('newsletter_error', 'Đã có lỗi xảy ra. Vui lòng thử lại sau.'),
                    invalidEmail: getTranslation('newsletter_invalid_email', 'Vui lòng nhập một địa chỉ email hợp lệ.')
                };

                newsletterMessage.textContent = '';
                newsletterMessage.className = 'text-sm mt-3';

                if (!newsletterEmail.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail.value)) {
                    newsletterMessage.textContent = translations.invalidEmail;
                    newsletterMessage.className = 'text-sm mt-3 text-red-500 dark:text-red-400';
                    return;
                }

                submitButton.disabled = true;
                submitButton.textContent = translations.processing;

                try {
                    const response = await fetch(newsletterForm.action, {
                        method: 'POST',
                        body: new FormData(newsletterForm),
                        headers: { 'Accept': 'application/json' }
                    });
                    if (response.ok) {
                        newsletterMessage.textContent = translations.success;
                        newsletterMessage.className = 'text-sm mt-3 text-green-500 dark:text-green-400';
                        newsletterEmail.value = '';
                    } else {
                        const data = await response.json().catch(() => ({}));
                        newsletterMessage.textContent = data.error || translations.error;
                        newsletterMessage.className = 'text-sm mt-3 text-red-500 dark:text-red-400';
                    }
                } catch (error) {
                    console.error('[Script] Error submitting newsletter:', error);
                    newsletterMessage.textContent = translations.error;
                    newsletterMessage.className = 'text-sm mt-3 text-red-500 dark:text-red-400';
                } finally {
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                }
            });
        }
    } catch (error) {
        console.error("[Script] Error initializing footer:", error);
    }
}

async function initializeActiveMenuHighlighting(headerElement) {
    if (!headerElement) {
        console.warn("[Script] initializeActiveMenuHighlighting: Header element is null or undefined.");
        return;
    }

    const navLinks = headerElement.querySelectorAll('nav a');
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
        const linkPath = new URL(link.href, window.location.origin).pathname;
        if (currentPath === linkPath) {
            link.classList.add('active-menu-link');
        } else {
            link.classList.remove('active-menu-link');
        }
    });
}

async function initializeApp() {
    cacheStaticElements();

    try {
        await Promise.all([loadHeader(), loadFooter()]);

        const headerLoadedElement = document.getElementById(HEADER_PLACEHOLDER_ID);
        if (headerLoadedElement && typeof initializeActiveMenuHighlighting === 'function' && !appState.isLanguageSystemReady) {
            initializeActiveMenuHighlighting(headerLoadedElement);
        }

        initializeFabButtons();

        if (typeof window.initializeLanguageSystem === 'function') {
            try {
                await window.initializeLanguageSystem();
                appState.isLanguageSystemReady = true;
                if (headerLoadedElement && typeof initializeActiveMenuHighlighting === 'function') {
                    initializeActiveMenuHighlighting(headerLoadedElement);
                }
            } catch (langInitError) {
                console.error("[Script] Error initializing language system:", langInitError);
            }

        } else {
            console.warn("[Script] window.initializeLanguageSystem function not found.");
        }

        if (domCache.newsContainer) {
            await loadInternalNews();
        }
        if (headerLoadedElement && typeof initializeActiveMenuHighlighting === 'function' && !appState.isLanguageSystemReady) {
            initializeActiveMenuHighlighting(headerLoadedElement);
        }

        console.log("[Script] Application initialization complete.");
    } catch (appError) {
        console.error("[Script] Application initialization failed:", appError);
    }
}

document.addEventListener('DOMContentLoaded', initializeApp);

document.addEventListener('click', (event) => {
    const activeDesktopLangDropdown = document.querySelector('#desktop-language-dropdown.open');
    if (activeDesktopLangDropdown && !activeDesktopLangDropdown.contains(event.target)) {
        const toggle = activeDesktopLangDropdown.querySelector('#desktop-lang-toggle');
        const options = activeDesktopLangDropdown.querySelector('#desktop-lang-options');
        if (toggle && options) {
            options.classList.add('hidden');
            options.classList.remove('show');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.classList.remove('active');
            activeDesktopLangDropdown.classList.remove('open');
        }
    }
});
