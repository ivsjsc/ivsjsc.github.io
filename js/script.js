/* ========================== */
/* Optimized JavaScript Logic */
/* Version: Refactored      */
/* ========================== */

// --- Constants ---
const HEADER_COMPONENT_URL = '../header.html';
const FOOTER_COMPONENT_URL = '../footer.html';
const POSTS_JSON_URL = 'posts.json'; // Relative to the main HTML file

const HEADER_PLACEHOLDER_ID = 'header-placeholder';
const FOOTER_PLACEHOLDER_ID = 'footer-placeholder';
const NEWS_CONTAINER_ID = 'news-container';
const FOOTER_YEAR_ID = 'current-year';
const SEARCH_HIGHLIGHT_CLASS = 'search-highlight';
const THEME_TOGGLE_ID = 'theme-toggle'; // For desktop
const THEME_TOGGLE_MOBILE_ID = 'theme-toggle-mobile'; // For mobile panel

// --- State ---
let menuInitialized = false; // To prevent multiple initializations of header logic
let isLanguageSystemReady = false;

// --- DOM Cache (elements that are static on the page or loaded once) ---
const domCache = {};

function cacheStaticElements() {
    domCache.headerPlaceholder = document.getElementById(HEADER_PLACEHOLDER_ID);
    domCache.footerPlaceholder = document.getElementById(FOOTER_PLACEHOLDER_ID);
    domCache.newsContainer = document.getElementById(NEWS_CONTAINER_ID);
    // Elements like theme toggle might be loaded dynamically with header/footer
}

// --- Utility Functions ---

/**
 * Debounce function to limit the rate at which a function can fire.
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The delay in milliseconds.
 * @returns {Function} - The debounced function.
 */
function debounce(func, delay) {
    let debounceTimer;
    return function(...args) {
        const context = this;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
}

/**
 * Loads HTML content from a component file into a specified placeholder element.
 * @param {string} placeholderId - The ID of the HTML element.
 * @param {string} componentUrl - The URL to the HTML component file.
 * @returns {Promise<HTMLElement | null>} Placeholder element or null.
 */
async function loadComponent(placeholderId, componentUrl) {
    console.log(`[Script] Attempting to load: ${componentUrl} into #${placeholderId}`);
    const placeholder = document.getElementById(placeholderId);

    if (!placeholder) {
        console.error(`[Script] Placeholder "#${placeholderId}" not found.`);
        return null;
    }

    if (placeholder.innerHTML.trim() === '') {
        placeholder.innerHTML = `<p class="text-gray-500 text-center p-4" data-lang-key="loading_component" data-component-name="${componentUrl.split('/').pop()}">Đang tải ${componentUrl.split('/').pop()}...</p>`;
        // If language system is ready, try to translate the loading message
        if (isLanguageSystemReady && typeof window.applyTranslations === 'function') {
            // This is a bit tricky as applyTranslations might not catch this immediately
            // A more robust way would be to have applyTranslations re-scan after component load
        }
    }

    try {
        const response = await fetch(componentUrl);
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        const html = await response.text();
        // Re-check placeholder existence
        const currentPlaceholder = document.getElementById(placeholderId);
        if (!currentPlaceholder) {
            console.error(`[Script] Placeholder "#${placeholderId}" disappeared after fetch.`);
            return null;
        }
        currentPlaceholder.innerHTML = html;
        console.log(`[Script] Loaded ${componentUrl} into #${placeholderId}`);
        return currentPlaceholder;
    } catch (error) {
        console.error(`[Script] Error loading ${componentUrl}:`, error);
        const currentPlaceholder = document.getElementById(placeholderId);
        if (currentPlaceholder) {
            currentPlaceholder.innerHTML = `<p class="text-red-500 text-center p-4" data-lang-key="error_loading_component" data-error-message="${error.message}">Lỗi tải ${componentUrl.split('/').pop()}: ${error.message}.</p>`;
        }
        return null;
    }
}

// --- Initialization Functions ---

/**
 * Initializes logic for dynamically loaded header.
 * This function assumes header.html might have its own embedded script for menu logic.
 * This script.js will focus on functionalities that need to interact with language.js
 * or other global aspects after the header is loaded.
 * @param {HTMLElement} headerElement - The loaded header DOM element.
 */
function initializeLoadedHeader(headerElement) {
    if (!headerElement) return;
    console.log("[Script] Initializing loaded header specific logic.");

    // Attach language button listeners if language system is ready
    // The actual buttons are inside headerElement
    if (isLanguageSystemReady && typeof window.attachLanguageSwitcherEvents === 'function') {
        window.attachLanguageSwitcherEvents(headerElement); // Pass headerElement if attachLanguageSwitcherEvents expects a scope
    }

    // Initialize sticky navbar if the function exists and navbar is present
    if (typeof initializeStickyNavbar === 'function') {
        const navbar = headerElement.querySelector('#navbar');
        if (navbar) {
            initializeStickyNavbar(navbar);
        } else {
            console.warn("[Script] #navbar element not found within loaded header for sticky functionality.");
        }
    }

    // Initialize active menu highlighting if the function exists
    if (typeof initializeActiveMenuHighlighting === 'function') {
        initializeActiveMenuHighlighting(headerElement);
    }

    // Initialize theme toggles (if they exist within the header)
    // The theme toggle buttons are now expected to be part of header.html
    const desktopThemeToggle = headerElement.querySelector(`#${THEME_TOGGLE_ID}`);
    const mobileThemeToggle = headerElement.querySelector(`#${THEME_TOGGLE_MOBILE_ID}`);

    if (desktopThemeToggle && typeof setupThemeToggle === 'function') {
        setupThemeToggle(THEME_TOGGLE_ID, headerElement); // Pass scope
    }
    if (mobileThemeToggle && typeof setupThemeToggle === 'function') {
        setupThemeToggle(THEME_TOGGLE_MOBILE_ID, headerElement); // Pass scope
    }


    menuInitialized = true;
}

/**
 * Initializes logic for dynamically loaded footer.
 * @param {HTMLElement} footerElement - The loaded footer DOM element.
 */
function initializeLoadedFooter(footerElement) {
    if (!footerElement) return;
    console.log("[Script] Initializing loaded footer specific logic.");

    if (typeof updateFooterYear === 'function') {
        updateFooterYear(footerElement);
    }
}

/**
 * Handles language change triggered by language buttons.
 * This acts as a wrapper to ensure language.js functions are called.
 * @param {Event} event - The click event.
 */
function handleLanguageChangeWrapper(event) {
    const button = event.target.closest('.lang-button');
    if (!button) return;

    const lang = button.dataset.lang;
    if (lang) {
        console.log(`[Script] Language change requested to: ${lang}`);
        if (typeof window.setLanguage === 'function') {
            window.setLanguage(lang); // Preferred method from language.js
        } else {
            console.warn("[Script] window.setLanguage function not found. Language change might not fully apply.");
            // Fallback or localStorage update can be done here if necessary,
            // but language.js should be the source of truth.
            localStorage.setItem('userPreferredLanguage', lang); // Example fallback
            if (typeof window.applyTranslations === 'function') window.applyTranslations(lang);
        }
    }
}

// --- Main Application Logic ---

/**
 * Loads internal news from posts.json.
 */
async function loadInternalNews() {
    if (!domCache.newsContainer) {
        console.log("[Script] News container not found, skipping news load.");
        return;
    }

    const loadingKey = "loading_news";
    const errorKey = "news_load_error";
    const noNewsKey = "no_news";
    let loadingText = "Đang tải tin tức...";
    let errorText = "Không thể tải tin tức.";
    let noNewsText = "Chưa có tin tức nào.";

    if (isLanguageSystemReady && typeof window.getTranslation === 'function') {
        loadingText = window.getTranslation(loadingKey, loadingText);
        errorText = window.getTranslation(errorKey, errorText);
        noNewsText = window.getTranslation(noNewsKey, noNewsText);
    }

    domCache.newsContainer.innerHTML = `<p class="text-gray-500 col-span-full text-center">${loadingText}</p>`;

    try {
        const response = await fetch(POSTS_JSON_URL);
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const posts = await response.json();

        domCache.newsContainer.innerHTML = ''; // Clear loading/error

        if (!Array.isArray(posts) || posts.length === 0) {
            domCache.newsContainer.innerHTML = `<p class="text-gray-500 w-full text-center">${noNewsText}</p>`;
            return;
        }

        const currentLang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'vi';
        const readMoreText = isLanguageSystemReady && typeof window.getTranslation === 'function' ? window.getTranslation('read_more', 'Đọc thêm →') : 'Đọc thêm →';
        const newsTitleNaText = isLanguageSystemReady && typeof window.getTranslation === 'function' ? window.getTranslation('news_title_na', 'Tiêu đề không có sẵn') : 'Tiêu đề không có sẵn';
        const newsImageAltText = isLanguageSystemReady && typeof window.getTranslation === 'function' ? window.getTranslation('news_image_alt', 'Hình ảnh tin tức') : 'Hình ảnh tin tức';


        posts.slice(0, 6).forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'news-card bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 flex flex-col';

            const title = post.title?.[currentLang] || post.title?.vi || newsTitleNaText;
            const excerpt = post.excerpt?.[currentLang] || post.excerpt?.vi || '';
            const imageAlt = post.image_alt?.[currentLang] || post.image_alt?.vi || title || newsImageAltText;
            const link = post.link || '#';
            const imageSrc = post.image || `https://placehold.co/300x200/e2e8f0/cbd5e1?text=${encodeURIComponent(title.substring(0,15))}`;
            const hotBadge = post.hot ? `<span class="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full z-10">HOT</span>` : '';

            let postDate = '';
            if (post.date) {
                try {
                    const dateObj = new Date(post.date.split(' ')[0]); // Assuming "YYYY-MM-DD"
                    if (!isNaN(dateObj)) {
                        postDate = dateObj.toLocaleDateString(currentLang === 'vi' ? 'vi-VN' : 'en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
                    }
                } catch (e) { console.warn(`[Script] Invalid date format for post: ${post.title?.vi}`, e); }
            }

            postElement.innerHTML = `
                <a href="${link}" class="block group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg h-full flex flex-col">
                    <div class="relative">
                        <img src="${imageSrc}" alt="${imageAlt}" class="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/300x200/e2e8f0/cbd5e1?text=Error';">
                        ${hotBadge}
                    </div>
                    <div class="p-4 flex flex-col flex-grow">
                        <h3 class="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 line-clamp-2" title="${title}">
                            ${title}
                        </h3>
                        <p class="text-sm text-gray-600 mb-3 line-clamp-3 flex-grow">${excerpt}</p>
                        <div class="flex justify-between items-center text-xs text-gray-500 mt-auto pt-2 border-t border-gray-100">
                            <span>${postDate}</span>
                            <span class="text-blue-500 font-medium group-hover:underline">${readMoreText}</span>
                        </div>
                    </div>
                </a>`;
            domCache.newsContainer.appendChild(postElement);
        });
        console.log(`[Script] Displayed ${Math.min(posts.length, 6)} news posts.`);

    } catch (error) {
        console.error("[Script] Error loading internal news:", error);
        if (domCache.newsContainer) { // Check again in case it was removed
           domCache.newsContainer.innerHTML = `<p class="text-red-500 w-full text-center">${errorText}</p>`;
        }
    }
}

/**
 * Updates the current year in the footer.
 * @param {HTMLElement} [scopeElement=document] - The element to search within for the year ID.
 */
function updateFooterYear(scopeElement = document) {
    const yearElement = scopeElement.querySelector(`#${FOOTER_YEAR_ID}`);
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
        console.log("[Script] Footer year updated.");
    } else {
        // console.warn(`[Script] Footer year element (#${FOOTER_YEAR_ID}) not found.`);
    }
}

/**
 * Sets up the theme toggle functionality.
 * @param {string} buttonId - The ID of the theme toggle button.
 * @param {Document|HTMLElement} [scope=document] - The scope to search for the button.
 */
function setupThemeToggle(buttonId, scope = document) {
    const themeToggleButton = scope.querySelector(`#${buttonId}`);
    if (!themeToggleButton) {
        // It's fine if a specific theme toggle (e.g., mobile) isn't on every page/component
        // console.log(`[Script] Theme toggle button #${buttonId} not found in scope.`);
        return;
    }

    const iconElement = themeToggleButton.querySelector('i'); // Assumes FontAwesome <i> tag
    const textElement = buttonId === THEME_TOGGLE_MOBILE_ID ? themeToggleButton.querySelector('span:not(.sr-only)') : null;


    function updateButtonAppearance(theme) {
        const isDark = theme === 'dark';
        if (iconElement) {
            iconElement.classList.toggle('fa-sun', isDark);
            iconElement.classList.toggle('fa-moon', !isDark);
        }
        if (textElement) { // For mobile button that might have text
            const key = isDark ? "theme_toggle_light" : "theme_toggle_dark";
            let buttonText = isDark ? "Chế độ sáng" : "Chế độ tối";
            if (isLanguageSystemReady && typeof window.getTranslation === 'function') {
                buttonText = window.getTranslation(key, buttonText);
            }
            textElement.textContent = buttonText;
        }
        themeToggleButton.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }

    // Apply initial theme based on localStorage or system preference
    let currentTheme = localStorage.getItem('theme');
    if (!currentTheme) {
        currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    document.documentElement.classList.remove('light', 'dark'); // Clean up
    document.documentElement.classList.add(currentTheme);
    updateButtonAppearance(currentTheme);

    themeToggleButton.addEventListener('click', () => {
        let newTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(newTheme);
        localStorage.setItem('theme', newTheme);
        updateButtonAppearance(newTheme);
        console.log(`[Script] Theme switched to ${newTheme} by #${buttonId}`);
    });
    console.log(`[Script] Theme toggle for #${buttonId} initialized with theme: ${currentTheme}.`);
}


/**
 * Initializes common functionalities like sticky navbar and active menu highlighting.
 * These are often dependent on the header being loaded.
 * @param {HTMLElement} headerElement - The loaded header DOM element.
 */
function initializeStickyNavbar(navbarElement) {
    if (!navbarElement) {
        console.warn("[Script] Navbar element not provided for sticky initialization.");
        return;
    }
    console.log("[Script] Initializing sticky navbar.");
    const shrinkThreshold = 50;
    let lastScrollTop = 0;

    const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        navbarElement.classList.toggle('shrinked', scrollTop > shrinkThreshold); // Use a distinct class like 'shrinked'

        // Optional: Hide on scroll down, show on scroll up (can be complex with 'shrinked' state)
        // if (scrollTop > lastScrollTop && scrollTop > navbarElement.offsetHeight) {
        //     navbarElement.classList.add('navbar-hidden');
        // } else {
        //     navbarElement.classList.remove('navbar-hidden');
        // }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };

    window.addEventListener('scroll', debounce(handleScroll, 50), { passive: true }); // Debounce scroll
    handleScroll(); // Initial check
}

function initializeActiveMenuHighlighting(headerElement) {
    if (!headerElement) {
        console.warn("[Script] Header element not provided for active menu highlighting.");
        return;
    }
    console.log("[Script] Initializing active menu highlighting.");

    const currentPath = window.location.pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/'; // Normalize current path

    const menuLinks = headerElement.querySelectorAll('a[href]');

    menuLinks.forEach(link => {
        link.classList.remove('active-menu-item'); // Clear previous active states
        const parentLi = link.closest('.main-menu-item, .mobile-menu-item');
        if (parentLi) {
            parentLi.classList.remove('active-parent-item');
        }

        let linkPath = link.getAttribute('href');
        if (linkPath && !linkPath.startsWith('http') && !linkPath.startsWith('#')) {
            linkPath = linkPath.replace(/\/$/, '').replace(/\.html$/, '') || '/'; // Normalize link path

            if (linkPath === currentPath || (currentPath === '/index' && linkPath === '/')) {
                link.classList.add('active-menu-item');
                if (parentLi) {
                    parentLi.classList.add('active-parent-item');

                    // Expand parent submenus in mobile view
                    let current = parentLi;
                    while(current && current !== headerElement) {
                        if (current.classList.contains('mobile-menu-item')) {
                            const subToggle = current.querySelector(':scope > .mobile-submenu-toggle');
                            const subMenu = current.querySelector(':scope > .mobile-submenu');
                            if (subToggle && subMenu && !current.classList.contains('open')) {
                                current.classList.add('open');
                                subToggle.setAttribute('aria-expanded', 'true');
                                subMenu.style.maxHeight = subMenu.scrollHeight + "px";
                                const arrow = subToggle.querySelector('.submenu-arrow');
                                if(arrow) arrow.classList.add('rotate-90');
                            }
                        }
                        current = current.parentElement?.closest('.mobile-menu-item');
                    }
                }
            }
        }
    });
}

/**
 * Main function to initialize the application.
 */
async function initializeApp() {
    console.log("[Script] Initializing application...");
    cacheStaticElements();

    // Load header and footer
    const [headerLoaded, footerLoaded] = await Promise.all([
        loadComponent(HEADER_PLACEHOLDER_ID, HEADER_COMPONENT_URL),
        loadComponent(FOOTER_PLACEHOLDER_ID, FOOTER_COMPONENT_URL)
    ]);

    if (headerLoaded) {
        // If header.html has its own script for menu, it would have run.
        // Otherwise, call a refined initialization function for script.js specific logic.
        initializeLoadedHeader(headerLoaded);
    }
    if (footerLoaded) {
        initializeLoadedFooter(footerLoaded);
    }

    // Initialize language system (assuming language.js defines window.initializeLanguageSystem)
    if (typeof window.initializeLanguageSystem === 'function') {
        try {
            await window.initializeLanguageSystem(); // This should set window.translations and apply initial translations
            isLanguageSystemReady = true;
            console.log("[Script] Language system initialized by language.js.");
            // Re-apply translations for any dynamically loaded components or refresh news
            if (headerLoaded && typeof window.attachLanguageSwitcherEvents === 'function') {
                 window.attachLanguageSwitcherEvents(headerLoaded); // Ensure listeners are attached
            }
             if (typeof window.applyTranslations === 'function') { // Apply to whole page after components are ready
                 window.applyTranslations();
             }
        } catch (error) {
            console.error("[Script] Error initializing language system:", error);
        }
    } else {
        console.warn("[Script] window.initializeLanguageSystem function not found. Language features may be limited.");
    }

    // Load news (now it can use translations if language system is ready)
    if (domCache.newsContainer) {
        loadInternalNews();
    }

    // Setup theme toggles (these might be in the main document or loaded with header/footer)
    // If they are inside header/footer, initializeLoadedHeader/Footer should handle them.
    // If one is directly in index.html, it can be initialized here.
    // For now, assuming theme toggles are part of header component.
    // setupThemeToggle(THEME_TOGGLE_ID); // Example if it was in index.html body

    console.log("[Script] Application initialization complete.");
}


// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', initializeApp);

// Global click listener for specific cases like closing dropdowns (if not handled by component scripts)
document.addEventListener('click', function(event) {
    // Example: Close desktop language dropdown if open and click is outside
    const desktopLangDropdown = document.querySelector('#desktop-language-dropdown.open'); // More specific selector
    if (desktopLangDropdown && !desktopLangDropdown.contains(event.target)) {
        const toggle = desktopLangDropdown.querySelector('#desktop-lang-toggle');
        const options = desktopLangDropdown.querySelector('#desktop-lang-options');
        if (toggle && options) {
            options.classList.add('hidden');
            options.classList.remove('show');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.classList.remove('active');
            desktopLangDropdown.classList.remove('open'); // Assuming 'open' class manages general state
            console.log('[Script] Desktop language dropdown closed by global click.');
        }
    }
    // Add similar logic for other global close behaviors if needed
});