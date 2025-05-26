/**
 * Loads an HTML component into a specified placeholder element.
 * @param {string} placeholderId The ID of the HTML element where the component will be loaded.
 * @param {string} filePath The path to the HTML component file.
 */
async function loadComponent(placeholderId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Failed to load component from ${filePath}: ${response.statusText}`);
        }
        const html = await response.text();
        const placeholder = document.getElementById(placeholderId);
        if (placeholder) {
            placeholder.innerHTML = html;
        } else {
            console.error(`[loadComponents.js] Placeholder element with id '${placeholderId}' not found.`);
        }
    } catch (error) {
        console.error(`[loadComponents.js] Error loading component from ${filePath}:`, error);
        const placeholder = document.getElementById(placeholderId);
        if (placeholder) {
            placeholder.innerHTML = `<p style="color: red;">Error loading component: ${error.message || error}</p>`;
        }
    }
}

/**
 * Loads the header and footer components into their respective placeholders.
 * This function is exposed globally to be called from index.html.
 */
window.loadComponentsAndInitialize = async function() {
    const HEADER_COMPONENT_URL = '/components/header.html';
    const FOOTER_COMPONENT_URL = '/components/footer.html';

    // Load header and footer concurrently
    await Promise.all([
        loadComponent('header-placeholder', HEADER_COMPONENT_URL),
        loadComponent('footer-placeholder', FOOTER_COMPONENT_URL)
    ]);
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
                // Hide any open submenus when closing the main mobile menu
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

        // Close mobile menu when a link inside it is clicked (unless it's a submenu toggle)
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Prevent closing if the click is on a submenu toggle button
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

    // Language selection buttons logic
    const langViButton = document.getElementById('lang-vi');
    const langEnButton = document.getElementById('lang-en');

    /**
     * Sets the active state for language buttons.
     * @param {string} lang The language code ('vi' or 'en').
     */
    function setActiveLangButton(lang) {
        if (!langViButton || !langEnButton) return;
        // Remove active classes from both buttons
        langViButton.classList.remove('active-lang', 'bg-primary', 'text-white');
        langEnButton.classList.remove('active-lang', 'bg-primary', 'text-white');
        // Add default text colors
        langViButton.classList.add('text-neutral-700', 'dark:text-gray-300');
        langEnButton.classList.add('text-neutral-700', 'dark:text-gray-300');

        // Apply active classes to the selected language button
        if (lang === 'vi') {
            langViButton.classList.add('active-lang');
        } else {
            langEnButton.classList.add('active-lang');
        }
    }

    // Set initial active language button based on stored preference or browser setting
    let currentLanguage = localStorage.getItem('language') || document.documentElement.lang || 'vi';
    setActiveLangButton(currentLanguage);

    // Event listeners for language buttons
    if(langViButton) {
        langViButton.addEventListener('click', () => {
            localStorage.setItem('language', 'vi');
            setActiveLangButton('vi');
            // Call the global updateLanguage function from language.js
            if (typeof window.updateLanguage === 'function') window.updateLanguage('vi');
            else location.reload(); // Fallback if updateLanguage is not defined
        });
    }

    if(langEnButton) {
        langEnButton.addEventListener('click', () => {
            localStorage.setItem('language', 'en');
            setActiveLangButton('en');
            // Call the global updateLanguage function from language.js
            if (typeof window.updateLanguage === 'function') window.updateLanguage('en');
            else location.reload(); // Fallback if updateLanguage is not defined
        });
    }

    // Dark mode toggle logic
    const headerDarkModeToggle = document.getElementById('dark-mode-toggle');
    const mobileHeaderDarkModeToggle = document.getElementById('mobile-dark-mode-toggle');

    /**
     * Updates the icon and text of a dark mode toggle button.
     * @param {HTMLElement} button The toggle button element.
     * @param {boolean} isDark True if dark mode is active, false otherwise.
     */
    function updateToggleIcon(button, isDark) {
        if (button && button.querySelector('i')) {
            button.querySelector('i').className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        }
        if (button && button.id === 'mobile-dark-mode-toggle' && button.querySelector('span.ml-2')) {
             button.querySelector('span.ml-2').textContent = isDark ? 'Chế độ Sáng' : 'Chế độ Tối';
        }
    }

    /**
     * Sets up the event listener for a theme toggle button.
     * @param {HTMLElement} button The theme toggle button.
     */
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

    // Set initial dark mode toggle icon based on current theme
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
    // Set current year in footer
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
      currentYearSpan.textContent = new Date().getFullYear();
    }

    // Newsletter form submission logic
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterEmail = document.getElementById('newsletterEmail');
    const newsletterMessage = document.getElementById('newsletterMessage');

    if (newsletterForm && newsletterEmail && newsletterMessage) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission
            const submitButton = newsletterForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            
            /**
             * Helper function to get translation for a key, with a fallback.
             * Assumes window.getTranslation might be available from language.js.
             * @param {string} key The translation key.
             * @param {string} fallback The fallback text if translation is not found.
             * @returns {string} The translated text or fallback.
             */
            const getTranslation = (key, fallback) => {
                if (typeof window.getTranslation === 'function') { 
                    return window.getTranslation(key) || fallback;
                }
                // Fallback to data-lang-key attribute if global getTranslation is not available
                const langKey = key.replace(/_/g, '-') + '-text-key';
                return submitButton.dataset[langKey] || fallback;
            };

            const translations = {
                processing: getTranslation('newsletter_processing', 'Đang xử lý...'),
                success: getTranslation('newsletter_success', 'Cảm ơn bạn đã đăng ký! Vui lòng kiểm tra email để xác nhận.'),
                error: getTranslation('newsletter_error', 'Đã có lỗi xảy ra. Vui lòng thử lại sau.'),
                invalidEmail: getTranslation('newsletter_invalid_email', 'Vui lòng nhập một địa chỉ email hợp lệ.')
            };

            newsletterMessage.textContent = ''; // Clear previous messages
            newsletterMessage.className = 'text-sm mt-3'; // Reset class

            // Basic email validation
            if (!newsletterEmail.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail.value)) {
                newsletterMessage.textContent = translations.invalidEmail;
                newsletterMessage.className = 'text-sm mt-3 text-red-500 dark:text-red-400';
                return;
            }

            submitButton.disabled = true; // Disable button during submission
            submitButton.textContent = translations.processing; // Update button text

            try {
                // Simulate form submission (replace with actual backend endpoint if available)
                const response = await fetch(newsletterForm.action, {
                    method: 'POST',
                    body: new FormData(newsletterForm),
                    headers: { 'Accept': 'application/json' }
                });
                if (response.ok) {
                    newsletterMessage.textContent = translations.success;
                    newsletterMessage.className = 'text-sm mt-3 text-green-500 dark:text-green-400';
                    newsletterEmail.value = ''; // Clear email input
                } else {
                    const data = await response.json().catch(() => ({})); // Try to parse error response
                    newsletterMessage.textContent = data.error || translations.error;
                    newsletterMessage.className = 'text-sm mt-3 text-red-500 dark:text-red-400';
                }
            } catch (error) {
                console.error('[loadComponents.js] Error submitting newsletter:', error);
                newsletterMessage.textContent = translations.error;
                newsletterMessage.className = 'text-sm mt-3 text-red-500 dark:text-red-400';
            } finally {
                submitButton.disabled = false; // Re-enable button
                submitButton.textContent = originalButtonText; // Restore original button text
            }
        });
    }
};
