const HEADER_COMPONENT_URL = '../header.html';
const FOOTER_COMPONENT_URL = '../footer.html';
const POSTS_JSON_URL = 'posts.json';

const HEADER_PLACEHOLDER_ID = 'header-placeholder';
const FOOTER_PLACEHOLDER_ID = 'footer-placeholder';
const NEWS_CONTAINER_ID = 'news-container';
const FOOTER_YEAR_ID = 'current-year';
const SEARCH_HIGHLIGHT_CLASS = 'search-highlight';
const THEME_TOGGLE_ID = 'theme-toggle';
const THEME_TOGGLE_MOBILE_ID = 'theme-toggle-mobile';

let isMenuInitialized = false;
let isLanguageSystemReady = false;
let isPerformingSearch = false;

const domCache = {};

function cacheStaticElements() {
    domCache.headerPlaceholder = document.getElementById(HEADER_PLACEHOLDER_ID);
    domCache.footerPlaceholder = document.getElementById(FOOTER_PLACEHOLDER_ID);
    domCache.newsContainer = document.getElementById(NEWS_CONTAINER_ID);
    domCache.mainThemeToggleButton = document.getElementById(THEME_TOGGLE_ID);
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
    console.log(`[Script] Loading component: ${componentUrl} into #${placeholderId}`);
    const placeholder = document.getElementById(placeholderId);

    if (!placeholder) {
        console.error(`[Script] Placeholder "#${placeholderId}" not found.`);
        return null;
    }

    const componentName = componentUrl.split('/').pop();
    if (placeholder.innerHTML.trim() === '') {
        placeholder.innerHTML = `<p class="text-gray-500 text-center p-4" data-lang-key="loading_component" data-component-name="${componentName}">Đang tải ${componentName}...</p>`;
    }

    try {
        const response = await fetch(componentUrl);
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        const html = await response.text();
        const currentPlaceholder = document.getElementById(placeholderId);
        if (!currentPlaceholder) {
            console.error(`[Script] Placeholder "#${placeholderId}" disappeared after fetch.`);
            return null;
        }
        currentPlaceholder.innerHTML = html;
        console.log(`[Script] Successfully loaded ${componentUrl} into #${placeholderId}`);
        return currentPlaceholder;
    } catch (error) {
        console.error(`[Script] Error loading ${componentUrl}:`, error);
        const currentPlaceholder = document.getElementById(placeholderId);
        if (currentPlaceholder) {
            currentPlaceholder.innerHTML = `<p class="text-red-500 text-center p-4" data-lang-key="error_loading_component" data-error-message="${error.message}">Lỗi tải ${componentName}: ${error.message}.</p>`;
        }
        return null;
    }
}

function setupMobileMenu(headerElement) {
    const mobileMenuButton = headerElement.querySelector('#mobile-menu-button');
    const mobileMenuPanel = headerElement.querySelector('#mobile-menu-panel');
    const mobileMenuOverlay = headerElement.querySelector('#mobile-menu-overlay');
    const iconMenu = headerElement.querySelector('#icon-menu');
    const iconClose = headerElement.querySelector('#icon-close');
    const mobileCloseButton = headerElement.querySelector('#mobile-close-button');

    if (!mobileMenuButton || !mobileMenuPanel || !mobileMenuOverlay || !iconMenu || !iconClose || !mobileCloseButton) {
        console.warn("[Script] Mobile menu core elements not all found in header. Mobile menu might not work.");
        return;
    }

    const toggleMobileMenu = (forceOpenState) => {
        const isCurrentlyExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
        const shouldBeOpen = typeof forceOpenState === 'boolean' ? forceOpenState : !isCurrentlyExpanded;

        mobileMenuButton.setAttribute('aria-expanded', String(shouldBeOpen));
        iconMenu.classList.toggle('hidden', shouldBeOpen);
        iconClose.classList.toggle('hidden', !shouldBeOpen);

        if (shouldBeOpen) {
            mobileMenuOverlay.classList.remove('hidden');
            mobileMenuPanel.classList.remove('hidden');
            requestAnimationFrame(() => {
                mobileMenuOverlay.classList.add('active');
                mobileMenuPanel.classList.add('active');
            });
            document.body.classList.add('overflow-hidden');
        } else {
            mobileMenuOverlay.classList.remove('active');
            mobileMenuPanel.classList.remove('active');
            const transitionEndHandler = () => {
                if (!mobileMenuPanel.classList.contains('active')) {
                    mobileMenuPanel.classList.add('hidden');
                    mobileMenuOverlay.classList.add('hidden');
                }
                mobileMenuPanel.removeEventListener('transitionend', transitionEndHandler);
            };
            mobileMenuPanel.addEventListener('transitionend', transitionEndHandler);
            setTimeout(() => {
                if (!mobileMenuPanel.classList.contains('active')) {
                     mobileMenuPanel.classList.add('hidden');
                     mobileMenuOverlay.classList.add('hidden');
                }
            }, 350);
            document.body.classList.remove('overflow-hidden');
        }
    };

    mobileMenuButton.addEventListener('click', () => toggleMobileMenu());
    mobileCloseButton.addEventListener('click', () => toggleMobileMenu(false));
    mobileMenuOverlay.addEventListener('click', () => toggleMobileMenu(false));

    mobileMenuPanel.querySelectorAll('a[href]:not(.mobile-submenu-toggle)').forEach(link => {
        if (!link.closest('.mobile-submenu-toggle')) {
             link.addEventListener('click', () => setTimeout(() => toggleMobileMenu(false), 150));
        }
    });

    const mobileSubmenuItems = mobileMenuPanel.querySelectorAll('.mobile-menu-item');
    mobileSubmenuItems.forEach(item => {
        const button = item.querySelector(':scope > button.mobile-submenu-toggle');
        const submenu = item.querySelector(':scope > .mobile-submenu');
        const arrow = button?.querySelector('.submenu-arrow');

        if (!button || !submenu) return;

        submenu.style.maxHeight = '0px';
        submenu.style.overflow = 'hidden';
        item.classList.remove('open');
        button.setAttribute('aria-expanded', 'false');
        if(arrow) arrow.classList.remove('rotate-90');

        button.addEventListener('click', function (e) {
            e.stopPropagation();
            const parentItem = this.closest('.mobile-menu-item');
            if (!parentItem) return;

            const isOpen = parentItem.classList.toggle('open');
            this.setAttribute('aria-expanded', String(isOpen));
            if (arrow) arrow.classList.toggle('rotate-90', isOpen);

            if (isOpen) {
                submenu.style.maxHeight = submenu.scrollHeight + "px";
                if(isOpen) {
                    submenu.addEventListener('transitionend', function onOpenTransitionEnd() {
                        if (submenu.style.maxHeight !== '0px') submenu.style.overflow = 'visible';
                        submenu.removeEventListener('transitionend', onOpenTransitionEnd);
                    }, { once: true });
                }

                const siblings = Array.from(parentItem.parentNode.children)
                    .filter(child => child !== parentItem && child.classList.contains('mobile-menu-item') && child.classList.contains('open'));

                siblings.forEach(sibling => {
                    sibling.classList.remove('open');
                    const siblingSubmenu = sibling.querySelector(':scope > .mobile-submenu');
                    const siblingButton = sibling.querySelector(':scope > button.mobile-submenu-toggle');
                    const siblingArrow = siblingButton?.querySelector('.submenu-arrow');

                    if (siblingSubmenu) {
                        siblingSubmenu.style.maxHeight = '0px';
                        siblingSubmenu.style.overflow = 'hidden';
                    }
                    if (siblingButton) siblingButton.setAttribute('aria-expanded', 'false');
                    if (siblingArrow) siblingArrow.classList.remove('rotate-90');
                });
            } else {
                submenu.style.maxHeight = '0px';
                submenu.style.overflow = 'hidden';
                parentItem.querySelectorAll('.mobile-menu-item.open').forEach(nestedOpenItem => {
                     nestedOpenItem.classList.remove('open');
                     const nestedSubmenu = nestedOpenItem.querySelector(':scope > .mobile-submenu');
                     const nestedButton = nestedOpenItem.querySelector(':scope > button.mobile-submenu-toggle');
                     const nestedArrow = nestedButton?.querySelector('.submenu-arrow');
                     if(nestedSubmenu) {
                         nestedSubmenu.style.maxHeight = '0px';
                         nestedSubmenu.style.overflow = 'hidden';
                     }
                     if(nestedButton) nestedButton.setAttribute('aria-expanded', 'false');
                     if(nestedArrow) nestedArrow.classList.remove('rotate-90');
                });
            }
        });
    });
    console.log("[Script] Mobile menu logic initialized.");
}

function setupDesktopMenus(headerElement) {
    const desktopMenuItems = headerElement.querySelectorAll('#menu-items > .main-menu-item');
    if (desktopMenuItems.length === 0) {
        return;
    }

    const closeAllDesktopMenus = (exceptThisMenu) => {
        desktopMenuItems.forEach(item => {
            const toggleButton = item.querySelector('.desktop-menu-toggle');
            const submenu = item.querySelector('.submenu');
            if (submenu && submenu !== exceptThisMenu && submenu.classList.contains('open')) {
                submenu.classList.remove('open');
                submenu.classList.add('hidden');
                if (toggleButton) {
                    toggleButton.setAttribute('aria-expanded', 'false');
                    toggleButton.classList.remove('active');
                }
                submenu.querySelectorAll('.sub-submenu-container.open').forEach(container => {
                    container.classList.remove('open');
                    container.querySelector('.sub-submenu')?.classList.add('hidden');
                    container.querySelector('.desktop-submenu-toggle')?.setAttribute('aria-expanded', 'false');
                });
            }
        });
    };

    desktopMenuItems.forEach(item => {
        const toggleButton = item.querySelector('.desktop-menu-toggle');
        const submenu = item.querySelector('.submenu');

        if (toggleButton && submenu) {
            toggleButton.addEventListener('click', function (event) {
                event.stopPropagation();
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                if (!isExpanded) closeAllDesktopMenus(submenu);

                submenu.classList.toggle('hidden', isExpanded);
                requestAnimationFrame(() => submenu.classList.toggle('open', !isExpanded));
                this.setAttribute('aria-expanded', String(!isExpanded));
                this.classList.toggle('active', !isExpanded);

                if (isExpanded) {
                    submenu.querySelectorAll('.sub-submenu-container.open').forEach(container => {
                        container.classList.remove('open');
                        container.querySelector('.sub-submenu')?.classList.add('hidden');
                        container.querySelector('.desktop-submenu-toggle')?.setAttribute('aria-expanded', 'false');
                    });
                }
            });

            submenu.querySelectorAll('.sub-submenu-container').forEach(container => {
                const subToggleButton = container.querySelector('.desktop-submenu-toggle');
                const subSubmenu = container.querySelector('.sub-submenu');
                if (subToggleButton && subSubmenu) {
                    subToggleButton.addEventListener('click', function(event) {
                        event.stopPropagation();
                        const isSubExpanded = this.getAttribute('aria-expanded') === 'true';
                        if (!isSubExpanded) {
                            submenu.querySelectorAll('.sub-submenu-container.open').forEach(openContainer => {
                                if (openContainer !== container) {
                                    openContainer.classList.remove('open');
                                    openContainer.querySelector('.sub-submenu')?.classList.add('hidden');
                                    openContainer.querySelector('.desktop-submenu-toggle')?.setAttribute('aria-expanded', 'false');
                                }
                            });
                        }
                        subSubmenu.classList.toggle('hidden', isSubExpanded);
                        requestAnimationFrame(() => subSubmenu.classList.toggle('open', !isSubExpanded));
                        this.setAttribute('aria-expanded', String(!isSubExpanded));
                        this.classList.toggle('active', !isSubExpanded);
                    });
                }
            });
        } else if (item.classList.contains('group')) {
                 item.addEventListener('focusin', () => {
                    item.querySelector('.submenu')?.classList.remove('hidden');
                    item.querySelector('.submenu')?.classList.add('open');
                 });
                 item.addEventListener('focusout', (e) => {
                    if (!item.contains(e.relatedTarget)) {
                        item.querySelector('.submenu')?.classList.add('hidden');
                        item.querySelector('.submenu')?.classList.remove('open');
                    }
                 });

                 submenu?.querySelectorAll('.sub-submenu-container.group\\/sub').forEach(subContainer => {
                    subContainer.addEventListener('focusin', () => {
                        subContainer.querySelector('.sub-submenu')?.classList.remove('hidden');
                        subContainer.querySelector('.sub-submenu')?.classList.add('open');
                    });
                    subContainer.addEventListener('focusout', (e) => {
                        if (!subContainer.contains(e.relatedTarget)) {
                             subContainer.querySelector('.sub-submenu')?.classList.add('hidden');
                             subContainer.querySelector('.sub-submenu')?.classList.remove('open');
                        }
                    });
                 });
            }
    });
    document.addEventListener('click', (event) => {
        let clickedInsideADesktopMenu = false;
        desktopMenuItems.forEach(item => {
            if (item.contains(event.target)) clickedInsideADesktopMenu = true;
        });
        if (!clickedInsideADesktopMenu) closeAllDesktopMenus(null);
    });
    console.log("[Script] Desktop menu logic initialized.");
}

function setupDesktopSearch(headerElement) {
    const searchButton = headerElement.querySelector('#desktop-search-button');
    const searchContainer = headerElement.querySelector('#desktop-search-container');
    const searchInput = headerElement.querySelector('#desktop-search-input');
    const searchClose = headerElement.querySelector('#desktop-search-close');
    const consultationButton = headerElement.querySelector('.cta-button');
    const langDropdown = headerElement.querySelector('#desktop-language-dropdown');
    const themeToggle = headerElement.querySelector(`#${THEME_TOGGLE_ID}`);

    if (!searchButton || !searchContainer || !searchInput || !searchClose) {
        return;
    }

    const debouncedSearch = debounce(query => {
        if (typeof performSearch === 'function') performSearch(query);
        else console.warn("[Script] performSearch function not found.");
    }, 300);

    const toggleSearchVisibility = (show) => {
        desktopSearchContainer.classList.toggle('hidden', !show);
        desktopSearchContainer.classList.toggle('flex', show);
        searchButton.classList.toggle('hidden', show);
        [consultationButton, langDropdown, themeToggle].filter(el => el).forEach(el => el.classList.toggle('hidden', show));

        if (show) {
            requestAnimationFrame(() => searchContainer.classList.add('active'));
            searchInput.focus();
        } else {
            searchContainer.classList.remove('active');
            searchInput.value = '';
            if (typeof clearSearchHighlights === 'function') clearSearchHighlights();
            searchContainer.addEventListener('transitionend', () => {
                if(!searchContainer.classList.contains('active')) {
                    searchContainer.classList.add('hidden');
                    searchContainer.classList.remove('flex');
                }
            }, {once: true});
             setTimeout(() => {
                if(!searchContainer.classList.contains('active')) {
                    searchContainer.classList.add('hidden');
                    searchContainer.classList.remove('flex');
                }
            }, 350);
        }
    };

    searchButton.addEventListener('click', (e) => { e.stopPropagation(); toggleSearchVisibility(true); });
    searchClose.addEventListener('click', (e) => { e.stopPropagation(); toggleSearchVisibility(false); });
    searchContainer.addEventListener('click', (e) => e.stopPropagation());
    searchInput.addEventListener('input', () => {
        if (searchInput.value.trim().length >= 2) debouncedSearch(searchInput.value);
        else if (typeof clearSearchHighlights === 'function') clearSearchHighlights();
    });
    searchInput.closest('form')?.addEventListener('submit', e => {
        e.preventDefault();
        if (typeof performSearch === 'function') performSearch(searchInput.value);
    });
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') toggleSearchVisibility(false);
    });
    document.addEventListener('click', (event) => {
        if (searchContainer.classList.contains('active') && !searchContainer.contains(event.target) && event.target !== searchButton) {
            toggleSearchVisibility(false);
        }
    });
    console.log("[Script] Desktop search logic initialized.");
}

function setupMobileSearch(headerElement){
    const mobileSearchInput = headerElement.querySelector('#mobile-search-input');
    if (!mobileSearchInput) return;

    const debouncedSearch = debounce(query => {
        if (typeof performSearch === 'function') performSearch(query);
        else console.warn("[Script] performSearch function not found.");
    }, 300);

    mobileSearchInput.addEventListener('input', () => {
        if (mobileSearchInput.value.trim().length >= 2) debouncedSearch(mobileSearchInput.value);
        else if (typeof clearSearchHighlights === 'function') clearSearchHighlights();
    });
    mobileSearchInput.closest('form')?.addEventListener('submit', e => {
        e.preventDefault();
        if (typeof performSearch === 'function') performSearch(mobileSearchInput.value);
    });
    console.log("[Script] Mobile search logic initialized.");
}


function setupLanguageDropdowns(headerElement) {
    const setupDropdown = (toggleId, optionsId) => {
        const toggle = headerElement.querySelector(`#${toggleId}`);
        const options = headerElement.querySelector(`#${optionsId}`);
        if (!toggle || !options) {
            return;
        }

        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            options.classList.toggle('hidden', isExpanded);
            options.classList.toggle('show', !isExpanded);
            toggle.setAttribute('aria-expanded', String(!isExpanded));
            toggle.classList.toggle('active', !isExpanded);
        });

        options.querySelectorAll('.lang-button').forEach(button => {
            button.addEventListener('click', handleLanguageChangeWrapper);
        });
        document.addEventListener('click', (event) => {
            if (!options.classList.contains('hidden') && !toggle.contains(event.target) && !options.contains(event.target)) {
                options.classList.add('hidden');
                options.classList.remove('show');
                toggle.setAttribute('aria-expanded', 'false');
                toggle.classList.remove('active');
            }
        });
    };

    setupDropdown('desktop-lang-toggle', 'desktop-lang-options');
    setupDropdown('mobile-lang-toggle', 'mobile-lang-options');
    console.log("[Script] Language dropdowns logic initialized.");
}

function initializeLoadedHeader(headerEl) {
    if (!headerEl || isMenuInitialized) {
        if(isMenuInitialized) console.warn("[Script] Header logic already initialized.");
        return;
    }
    console.log("[Script] Initializing specific logic for loaded header.");

    setupMobileMenu(headerEl);
    setupDesktopMenus(headerEl);
    setupDesktopSearch(headerEl);
    setupMobileSearch(headerEl);
    setupLanguageDropdowns(headerEl);

    if (typeof setupThemeToggle === 'function') {
        setupThemeToggle(THEME_TOGGLE_ID, headerEl);
        setupThemeToggle(THEME_TOGGLE_MOBILE_ID, headerEl);
    }

    if (typeof initializeStickyNavbar === 'function') {
        const navbar = headerEl.querySelector('#navbar');
        if (navbar) initializeStickyNavbar(navbar);
    }
    if (typeof initializeActiveMenuHighlighting === 'function') {
        initializeActiveMenuHighlighting(headerEl);
    }

    if (isLanguageSystemReady && typeof window.attachLanguageSwitcherEvents === 'function') {
        window.attachLanguageSwitcherEvents(headerEl);
    }

    isMenuInitialized = true;
    console.log("[Script] Loaded header initialization complete.");
}

function initializeLoadedFooter(footerEl) {
    if (!footerEl) return;
    console.log("[Script] Initializing specific logic for loaded footer.");
    if (typeof updateFooterYear === 'function') {
        updateFooterYear(footerEl);
    }
}

function handleLanguageChangeWrapper(event) {
    const button = event.target.closest('.lang-button');
    if (!button) return;

    const lang = button.dataset.lang;
    if (lang) {
        console.log(`[Script] Language change requested to: ${lang}`);
        if (typeof window.setLanguage === 'function') {
            window.setLanguage(lang);
        } else {
            console.warn("[Script] window.setLanguage function not found. Language change might not fully apply.");
            localStorage.setItem('userPreferredLanguage', lang);
            if (typeof window.applyTranslations === 'function') window.applyTranslations(lang);
        }
    }
}

async function loadInternalNews() {
    if (!domCache.newsContainer) {
        console.log("[Script] News container not found, skipping news load.");
        return;
    }

    const defaultTexts = {
        loading: "Đang tải tin tức...",
        error: "Không thể tải tin tức.",
        noNews: "Chưa có tin tức nào.",
        readMore: "Đọc thêm →",
        titleNA: "Tiêu đề không có sẵn",
        imageAlt: "Hình ảnh tin tức"
    };

    const getText = (key) => (isLanguageSystemReady && typeof window.getTranslation === 'function')
        ? window.getTranslation(key, defaultTexts[key])
        : defaultTexts[key];

    domCache.newsContainer.innerHTML = `<p class="text-gray-500 col-span-full text-center">${getText('loading')}</p>`;

    try {
        const response = await fetch(POSTS_JSON_URL);
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const posts = await response.json();
        domCache.newsContainer.innerHTML = '';

        if (!posts || posts.length === 0) {
            domCache.newsContainer.innerHTML = `<p class="text-gray-500 w-full text-center">${getText('noNews')}</p>`;
            return;
        }

        const currentLang = (isLanguageSystemReady && typeof window.getCurrentLanguage === 'function') ? window.getCurrentLanguage() : 'vi';
        const readMoreText = getText('readMore');
        const newsTitleNaText = getText('titleNA');
        const newsImageAltText = getText('imageAlt');


        posts.slice(0, 6).forEach(post => {
            const card = document.createElement('div');
            card.className = 'news-card bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 flex flex-col';

            const title = post.title?.[currentLang] || post.title?.vi || newsTitleNaText;
            const excerpt = post.excerpt?.[currentLang] || post.excerpt?.vi || '';
            const imageAlt = post.image_alt?.[currentLang] || post.image_alt?.vi || title || newsImageAltText;
            const link = post.link || '#';
            const imageSrc = post.image || `https://placehold.co/300x200/e2e8f0/cbd5e1?text=${encodeURIComponent(title.substring(0,10))}`;
            const hotBadge = post.hot ? `<span class="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full z-10">HOT</span>` : '';
            let dateDisplay = '';
            if (post.date) {
                try {
                    dateDisplay = new Date(post.date.split(' ')[0]).toLocaleDateString(currentLang === 'vi' ? 'vi-VN' : 'en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
                } catch (e) { }
            }

            card.innerHTML = `
                <a href="${link}" class="block group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg h-full flex flex-col">
                    <div class="relative">
                        <img src="${imageSrc}" alt="${imageAlt}" class="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/300x200/e2e8f0/cbd5e1?text=Error';">
                        ${hotBadge}
                    </div>
                    <div class="p-4 flex flex-col flex-grow">
                        <h3 class="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 line-clamp-2" title="${title}">${title}</h3>
                        <p class="text-sm text-gray-600 mb-3 line-clamp-3 flex-grow">${excerpt}</p>
                        <div class="flex justify-between items-center text-xs text-gray-500 mt-auto pt-2 border-t border-gray-100">
                            <span>${dateDisplay}</span>
                            <span class="text-blue-500 font-medium group-hover:underline">${readMoreText}</span>
                        </div>
                    </div>
                </a>`;
            domCache.newsContainer.appendChild(card);
        });
    } catch (error) {
        console.error("[Script] Error loading internal news:", error);
        if(domCache.newsContainer) domCache.newsContainer.innerHTML = `<p class="text-red-500 w-full text-center">${getText('error')}</p>`;
    }
}

function updateFooterYear(scope = document) {
    const yearElement = scope.querySelector(`#${FOOTER_YEAR_ID}`);
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

function setupThemeToggle(buttonId, scope = document) {
    const themeToggleButton = scope.querySelector(`#${buttonId}`);
    if (!themeToggleButton) {
        return;
    }

    const iconElement = themeToggleButton.querySelector('i');
    const textElement = buttonId === THEME_TOGGLE_MOBILE_ID ? themeToggleButton.querySelector('span:not(.sr-only)') : null;

    function updateButtonAppearance(theme) {
        const isDark = theme === 'dark';
        if (iconElement) {
            iconElement.classList.toggle('fa-sun', isDark);
            iconElement.classList.toggle('fa-moon', !isDark);
        }
        if (textElement) {
            const key = isDark ? "theme_toggle_light" : "theme_toggle_dark";
            let buttonText = isDark ? "Chế độ sáng" : "Chế độ tối";
            if (isLanguageSystemReady && typeof window.getTranslation === 'function') {
                buttonText = window.getTranslation(key, buttonText);
            }
            textElement.textContent = buttonText;
        }
        themeToggleButton.setAttribute('aria-label', isDark ? (window.getTranslation?.('aria_switch_light', 'Chuyển sang chế độ sáng') || 'Chuyển sang chế độ sáng')
                                                                 : (window.getTranslation?.('aria_switch_dark', 'Chuyển sang chế độ tối') || 'Chuyển sang chế độ tối'));
    }

    let currentTheme = localStorage.getItem('theme');
    if (!currentTheme) {
        currentTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    document.documentElement.classList.remove('light', 'dark');
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

function initializeStickyNavbar(navbarElement) {
    if (!navbarElement) return;
    const shrinkThreshold = 50;
    const handleScroll = () => {
        navbarElement.classList.toggle('shrinked', window.scrollY > shrinkThreshold);
    };
    window.addEventListener('scroll', debounce(handleScroll, 10), { passive: true });
    handleScroll();
    console.log("[Script] Sticky navbar initialized.");
}

function initializeActiveMenuHighlighting(scope = document) {
    if (!scope) return;
    console.log("[Script] Initializing active menu highlighting.");

    const currentFullHref = window.location.href.split('#')[0].split('?')[0];
    const currentPathname = (window.location.pathname.replace(/\/$/, '') || "/").replace(/\/index\.html$/, '') || "/";


    const links = scope.querySelectorAll('a[href]');
    let bestMatch = null;
    let bestMatchSpecificity = -1;


    links.forEach(link => {
        link.classList.remove('active-menu-item');
        const parentMenuItem = link.closest('.main-menu-item, .mobile-menu-item');
        parentMenuItem?.classList.remove('active-parent-item');


        const linkHref = link.getAttribute('href');
        if (!linkHref || linkHref.startsWith('#') || linkHref.startsWith('javascript:')) return;

        try {
            const linkUrl = new URL(linkHref, document.baseURI);
            const linkFullHref = linkUrl.href.split('#')[0].split('?')[0];
            let linkPathname = (linkUrl.pathname.replace(/\/$/, '') || "/").replace(/\/index\.html$/, '') || "/";

            let currentSpecificity = -1;

            if (linkFullHref === currentFullHref) {
                currentSpecificity = 3; // Exact full URL match
            } else if (linkPathname === currentPathname) {
                 currentSpecificity = 2; // Pathname match
                 if (currentPathname === "/" && linkPathname === "/") { // Boost for explicit root link
                     currentSpecificity = 2.5;
                 }
            } else if (currentPathname.startsWith(linkPathname) && linkPathname !== "/") {
                 currentSpecificity = 1; // Parent path match
            }


            if (currentSpecificity > bestMatchSpecificity) {
                bestMatchSpecificity = currentSpecificity;
                bestMatch = link;
            } else if (currentSpecificity === bestMatchSpecificity && currentSpecificity > -1) {
                // If specificity is the same, prefer longer (more specific) hrefs
                if (linkHref.length > bestMatch.getAttribute('href').length) {
                    bestMatch = link;
                }
            }

        } catch (e) { /* Ignore invalid URLs */ }
    });

    if (bestMatch) {
        bestMatch.classList.add('active-menu-item');
        let parentItem = bestMatch.closest('.main-menu-item, .mobile-menu-item');
        while(parentItem) {
            parentItem.classList.add('active-parent-item');
            const parentToggle = parentItem.querySelector(':scope > .desktop-menu-toggle, :scope > .mobile-submenu-toggle');
            if (parentToggle) parentToggle.classList.add('active');


            if (parentItem.classList.contains('mobile-menu-item') && !parentItem.classList.contains('open')) {
                const toggle = parentItem.querySelector(':scope > button.mobile-submenu-toggle');
                const submenu = parentItem.querySelector(':scope > .mobile-submenu');
                if (toggle && submenu) {
                    parentItem.classList.add('open');
                    toggle.setAttribute('aria-expanded', 'true');
                    submenu.style.maxHeight = submenu.scrollHeight + 'px';
                    submenu.style.overflow = 'visible';
                    const arrow = toggle.querySelector('.submenu-arrow');
                    if(arrow) arrow.classList.add('rotate-90');
                }
            }
            parentItem = parentItem.parentElement?.closest('.main-menu-item, .mobile-menu-item');
        }
        console.log("[Script] Active menu item highlighted:", bestMatch.href);
    }
}

function clearSearchHighlights() {
    if (isPerformingSearch) return;
    const highlights = document.querySelectorAll(`mark.${SEARCH_HIGHLIGHT_CLASS}`);
    highlights.forEach(mark => {
        const parent = mark.parentNode;
        if (parent) {
            parent.replaceChild(document.createTextNode(mark.textContent), mark);
            parent.normalize();
        }
    });
}

function performSearch(query) {
    if (isPerformingSearch) return;
    isPerformingSearch = true;

    clearSearchHighlights();
    const mainContent = document.querySelector('main');
    if (!mainContent || !query || query.trim().length < 2) {
        isPerformingSearch = false;
        return;
    }

    const queryLower = query.trim().toLowerCase();
    const walker = document.createTreeWalker(mainContent, NodeFilter.SHOW_TEXT, {
        acceptNode: function(node) {
            if (node.parentElement && ['SCRIPT', 'STYLE', 'NOSCRIPT', 'MARK'].includes(node.parentElement.tagName.toUpperCase())) {
                return NodeFilter.FILTER_REJECT;
            }
            if (node.nodeValue.trim() === '') { // Skip empty or whitespace-only text nodes
                return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
        }
    });

    let node;
    const nodesToProcess = [];
    while (node = walker.nextNode()) {
        nodesToProcess.push(node);
    }

    let firstMatchElement = null;
    nodesToProcess.forEach(textNode => {
        const textContent = textNode.nodeValue;
        const textLower = textContent.toLowerCase();
        let matchIndex = textLower.indexOf(queryLower);
        let currentNode = textNode;

        while (matchIndex !== -1) {
            const matchText = currentNode.nodeValue.substring(matchIndex, matchIndex + query.length);
            const mark = document.createElement('mark');
            mark.className = SEARCH_HIGHLIGHT_CLASS;
            mark.textContent = matchText;

            const afterNode = currentNode.splitText(matchIndex);
            afterNode.nodeValue = afterNode.nodeValue.substring(query.length);
            currentNode.parentNode.insertBefore(mark, afterNode);

            if (!firstMatchElement) firstMatchElement = mark;
            
            currentNode = afterNode; // Continue with the remaining part of the text node
            matchIndex = currentNode.nodeValue.toLowerCase().indexOf(queryLower); // Search again in the new current node
        }
    });

    if (firstMatchElement) {
        firstMatchElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    isPerformingSearch = false;
}

function setupGlobalThemeToggle() {
    if (domCache.mainThemeToggleButton && typeof setupThemeToggle === 'function') {
        setupThemeToggle(THEME_TOGGLE_ID);
        console.log("[Script] Global theme toggle initialized.");
    }
}

async function initializeApp() {
    console.log("[Script] Initializing application...");
    cacheStaticElements();
    setupGlobalThemeToggle();

    const [headerLoadedElement, footerLoadedElement] = await Promise.all([
        loadComponent(HEADER_PLACEHOLDER_ID, HEADER_COMPONENT_URL),
        loadComponent(FOOTER_PLACEHOLDER_ID, FOOTER_COMPONENT_URL)
    ]);

    if (headerLoadedElement) initializeLoadedHeader(headerLoadedElement);
    if (footerLoadedElement) initializeLoadedFooter(footerLoadedElement);

    if (typeof window.initializeLanguageSystem === 'function') {
        try {
            await window.initializeLanguageSystem();
            isLanguageSystemReady = true;
            console.log("[Script] Language system reported ready by language.js.");

            if (typeof window.applyTranslations === 'function') {
                window.applyTranslations();
            }
            if (headerLoadedElement && typeof window.attachLanguageSwitcherEvents === 'function') {
                window.attachLanguageSwitcherEvents(headerLoadedElement);
            }
             if (footerLoadedElement && typeof window.attachLanguageSwitcherEvents === 'function') { // If footer has lang switchers
                window.attachLanguageSwitcherEvents(footerLoadedElement);
            }
             // Re-apply active menu highlighting after translations might have changed menu text affecting layout
             if (headerLoadedElement && typeof initializeActiveMenuHighlighting === 'function') {
                initializeActiveMenuHighlighting(headerLoadedElement);
            }


        } catch (error) {
            console.error("[Script] Error during language system initialization:", error);
        }
    } else {
        console.warn("[Script] window.initializeLanguageSystem function not found.");
    }

    if (domCache.newsContainer) {
        await loadInternalNews();
    }
    // Ensure active menu highlighting is called once more if not called after lang init
    if (headerLoadedElement && typeof initializeActiveMenuHighlighting === 'function' && !isLanguageSystemReady) {
        initializeActiveMenuHighlighting(headerLoadedElement);
    }


    console.log("[Script] Application initialization complete.");
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