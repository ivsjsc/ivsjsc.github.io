/**
 * Loads an HTML component into a specified placeholder element or directly into the DOM.
 * @param {string} placeholderId The ID of the HTML element where the component will be loaded (optional for fixed elements).
 * @param {string} filePath The path to the HTML component file.
 * @param {string} targetElement The target element to append the component (defaults to 'body').
 */
async function loadComponent(placeholderId, filePath, targetElement = 'body') {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Failed to load component from ${filePath}: ${response.statusText}`);
        }
        const html = await response.text();

        if (targetElement === 'body') {
            // For fixed elements like fab-container, append directly to body
            document.body.insertAdjacentHTML('beforeend', html);
        } else {
            const placeholder = document.getElementById(placeholderId);
            if (placeholder) {
                placeholder.innerHTML = html;
            } else {
                console.error(`[loadComponents.js] Placeholder element with id '${placeholderId}' not found.`);
            }
        }
    } catch (error) {
        console.error(`[loadComponents.js] Error loading component from ${filePath}:`, error);
        if (targetElement !== 'body') {
            const placeholder = document.getElementById(placeholderId);
            if (placeholder) {
                placeholder.innerHTML = `<p style="color: red;">Error loading component: ${error.message || error}</p>`;
            }
        }
    }
}

/**
 * Loads the header, footer, and fab-container components into their respective locations.
 * This function is exposed globally to be called from index.html.
 */
window.loadComponentsAndInitialize = async function() {
    const HEADER_COMPONENT_URL = '/components/header.html';
    const FOOTER_COMPONENT_URL = '/components/footer.html';
    const FAB_COMPONENT_URL = '/components/fab-container.html';

    // Load header, footer, and fab-container concurrently
    await Promise.all([
        loadComponent('header-placeholder', HEADER_COMPONENT_URL),
        loadComponent('footer-placeholder', FOOTER_COMPONENT_URL),
        loadComponent(null, FAB_COMPONENT_URL, 'body') // Load fab-container directly into body
    ]);

    // Initialize components after loading
    window.initializeHeader();
    window.initializeFooter();
    window.initializeFab();
};

/**
 * Initializes interactive elements within the header after it has been loaded.
 * This includes mobile menu toggling, language selection, and dark mode toggle.
 * This function is exposed globally to be called from index.html.
 */
window.initializeHeader = function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuIcon = mobileMenuButton ? mobileMenuButton.querySelector('i') : null;

    // Mobile menu toggle logic
    if (mobileMenuButton && mobileMenu && mobileMenuIcon) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            if (mobileMenu.classList.contains('hidden')) {
                mobileMenuIcon.classList.remove('fa-times');
                mobileMenuIcon.classList.add('fa-bars');
                const openSubmenu = mobileMenu.querySelector('.mobile-submenu:not(.hidden)');
                if (openSubmenu) openSubmenu.classList.add('hidden');
                const openSubmenuIcon = mobileMenu.querySelector('.fa-chevron-up');
                if (openSubmenuIcon) {
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

    if (langViButton) {
        langViButton.addEventListener('click', () => {
            localStorage.setItem('language', 'vi');
            setActiveLangButton('vi');
            if (typeof window.updateLanguage === 'function') window.updateLanguage('vi');
            else location.reload();
        });
    }

    if (langEnButton) {
        langEnButton.addEventListener('click', () => {
            localStorage.setItem('language', 'en');
            setActiveLangButton('en');
            if (typeof window.updateLanguage === 'function') window.updateLanguage('en');
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
};

/**
 * Initializes interactive elements within the footer after it has been loaded.
 * This includes setting the current year and handling newsletter form submission.
 * This function is exposed globally to be called from index.html.
 */
window.initializeFooter = function() {
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
                if (typeof window.getTranslation === 'function') {
                    return window.getTranslation(key) || fallback;
                }
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
                console.error('[loadComponents.js] Error submitting newsletter:', error);
                newsletterMessage.textContent = translations.error;
                newsletterMessage.className = 'text-sm mt-3 text-red-500 dark:text-red-400';
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    }
};

/**
 * Initializes interactive elements within the fab-container after it has been loaded.
 * This includes scroll-to-top, share, and contact menu toggling.
 * This function is exposed globally to be called from index.html.
 */
window.initializeFab = function() {
    // Scroll to top functionality
    const scrollToTopBtn = document.getElementById('scroll-to-top-btn');
    if (scrollToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.remove('fab-hidden');
            } else {
                scrollToTopBtn.classList.add('fab-hidden');
            }
        });

        // Scroll to top on click
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Share menu toggle
    const shareMainBtn = document.getElementById('share-main-btn');
    const shareOptions = document.getElementById('share-options');
    if (shareMainBtn && shareOptions) {
        shareMainBtn.addEventListener('click', () => {
            shareOptions.classList.toggle('fab-hidden');
            shareMainBtn.setAttribute('aria-expanded', shareOptions.classList.contains('fab-hidden') ? 'false' : 'true');
        });
    }

    // Contact menu toggle
    const contactMainBtn = document.getElementById('contact-main-btn');
    const contactOptions = document.getElementById('contact-options');
    if (contactMainBtn && contactOptions) {
        contactMainBtn.addEventListener('click', () => {
            contactOptions.classList.toggle('fab-hidden');
            contactMainBtn.setAttribute('aria-expanded', contactOptions.classList.contains('fab-hidden') ? 'false' : 'true');
        });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (shareMainBtn && shareOptions && !shareMainBtn.contains(e.target) && !shareOptions.contains(e.target)) {
            shareOptions.classList.add('fab-hidden');
            shareMainBtn.setAttribute('aria-expanded', 'false');
        }
        if (contactMainBtn && contactOptions && !contactMainBtn.contains(e.target) && !contactOptions.contains(e.target)) {
            contactOptions.classList.add('fab-hidden');
            contactMainBtn.setAttribute('aria-expanded', 'false');
        }
    });
};