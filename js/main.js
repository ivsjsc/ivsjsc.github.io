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
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) {
        console.error(`[MainJS] Placeholder "#${placeholderId}" not found.`);
        return null;
    }
    const componentName = componentUrl.split('/').pop();
    if (placeholder.innerHTML.trim() === '') {
        placeholder.innerHTML = `<p class="text-gray-500 text-center p-4" data-lang-key="loading_component" data-component-name="${componentName}">Đang tải ${componentName}...</p>`;
    }
    try {
        const response = await fetch(componentUrl);
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const html = await response.text();
        const currentPlaceholder = document.getElementById(placeholderId);
        if (!currentPlaceholder) {
            console.error(`[MainJS] Placeholder "#${placeholderId}" disappeared after fetch.`);
            return null;
        }
        currentPlaceholder.innerHTML = html;
        console.log(`[MainJS] Loaded ${componentUrl} into #${placeholderId}`);
        return currentPlaceholder;
    } catch (error) {
        console.error(`[MainJS] Error loading ${componentUrl}:`, error);
        const currentPlaceholder = document.getElementById(placeholderId);
        if (currentPlaceholder) {
            currentPlaceholder.innerHTML = `<p class="text-red-500 text-center p-4" data-lang-key="error_loading_component" data-error-message="${error.message}">Lỗi tải ${componentName}: ${error.message}.</p>`;
        }
        return null;
    }
}

function initializeHeaderInteractions(headerElement) {
    if (!headerElement || isMenuInitialized) {
        if (isMenuInitialized) console.warn("[MainJS] Header interactions already initialized.");
        return;
    }
    console.log("[MainJS] Initializing header interactions...");

    const elements = {
        navbar: headerElement.querySelector('#navbar') || headerElement,
        mobileMenuButton: headerElement.querySelector('#mobile-menu-button'),
        mobileMenuPanel: headerElement.querySelector('#mobile-menu-panel'),
        mobileMenuOverlay: headerElement.querySelector('#mobile-menu-overlay'),
        iconMenu: headerElement.querySelector('#icon-menu'),
        iconClose: headerElement.querySelector('#icon-close'),
        mobileCloseButton: headerElement.querySelector('#mobile-close-button'),
        desktopMenuItems: headerElement.querySelectorAll('#menu-items > .main-menu-item'),
        desktopSearchButton: headerElement.querySelector('#desktop-search-button'),
        desktopSearchContainer: headerElement.querySelector('#desktop-search-container'),
        desktopSearchInput: headerElement.querySelector('#desktop-search-input'),
        desktopSearchClose: headerElement.querySelector('#desktop-search-close'),
        desktopThemeToggle: headerElement.querySelector('#theme-toggle'),
        mobileThemeToggle: headerElement.querySelector('#mobile-menu-panel #theme-toggle-mobile'),
        consultationButton: headerElement.querySelector('.cta-button'),
        desktopLangToggle: headerElement.querySelector('#desktop-lang-toggle'),
        desktopLangOptions: headerElement.querySelector('#desktop-lang-options'),
        mobileLangToggle: headerElement.querySelector('#mobile-menu-panel #mobile-lang-toggle'),
        mobileLangOptions: headerElement.querySelector('#mobile-menu-panel #mobile-lang-options'),
        body: document.body
    };

    if (!elements.navbar || !elements.mobileMenuButton || !elements.mobileMenuPanel || !elements.mobileMenuOverlay) {
        console.error("[MainJS] Essential header elements for menu not found. Aborting header script initialization.");
        return;
    }
    
    let isMobileMenuOpen = false;

    function toggleMobileMenu(forceOpenState) {
        const shouldBeOpen = typeof forceOpenState === 'boolean' ? forceOpenState : !isMobileMenuOpen;
        if (!elements.mobileMenuButton || !elements.mobileMenuPanel || !elements.mobileMenuOverlay || !elements.iconMenu || !elements.iconClose) return;

        elements.mobileMenuButton.setAttribute('aria-expanded', String(shouldBeOpen));
        elements.iconMenu.classList.toggle('hidden', shouldBeOpen);
        elements.iconClose.classList.toggle('hidden', !shouldBeOpen);
        
        elements.mobileMenuOverlay.classList.toggle('hidden', !shouldBeOpen);
        elements.mobileMenuPanel.classList.toggle('hidden', !shouldBeOpen);

        requestAnimationFrame(() => {
            elements.mobileMenuOverlay.classList.toggle('opacity-0', !shouldBeOpen);
            elements.mobileMenuPanel.classList.toggle('translate-x-full', !shouldBeOpen);
        });
        
        elements.body.classList.toggle('overflow-hidden', shouldBeOpen);
        isMobileMenuOpen = shouldBeOpen;

        if (shouldBeOpen && elements.mobileMenuPanel.querySelector('a, button')) {
            elements.mobileMenuPanel.querySelector('a, button').focus();
        } else if (!shouldBeOpen && elements.mobileMenuButton) {
            elements.mobileMenuButton.focus();
        }
    }

    if(elements.mobileMenuButton) elements.mobileMenuButton.addEventListener('click', () => toggleMobileMenu());
    if(elements.mobileCloseButton) elements.mobileCloseButton.addEventListener('click', () => toggleMobileMenu(false));
    if(elements.mobileMenuOverlay) elements.mobileMenuOverlay.addEventListener('click', () => toggleMobileMenu(false));

    if(elements.mobileMenuPanel) {
        elements.mobileMenuPanel.querySelectorAll('a[href]:not(.mobile-submenu-toggle)').forEach(link => {
            if (!link.closest('.mobile-submenu-toggle')) {
                 link.addEventListener('click', () => setTimeout(() => toggleMobileMenu(false), 150));
            }
        });

        elements.mobileMenuPanel.querySelectorAll('.mobile-menu-item').forEach(item => {
            const button = item.querySelector(':scope > button.mobile-submenu-toggle');
            const submenu = item.querySelector(':scope > .mobile-submenu');
            const arrow = button?.querySelector('.submenu-arrow');

            if (button && submenu) {
                submenu.style.maxHeight = '0px';
                submenu.style.overflow = 'hidden';
                button.setAttribute('aria-expanded', 'false');
                if (arrow) arrow.classList.remove('rotate-90');

                button.addEventListener('click', function (e) {
                    e.stopPropagation();
                    const parentItem = this.closest('.mobile-menu-item');
                    const currentlyOpen = parentItem.classList.contains('open');
                    
                    if (!currentlyOpen) {
                        elements.mobileMenuPanel.querySelectorAll('.mobile-menu-item.open').forEach(sibling => {
                            if (sibling !== parentItem) {
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
                            }
                        });
                    }
                    
                    parentItem.classList.toggle('open', !currentlyOpen);
                    this.setAttribute('aria-expanded', String(!currentlyOpen));
                    if (arrow) arrow.classList.toggle('rotate-90', !currentlyOpen);

                    if (!currentlyOpen) {
                        submenu.style.maxHeight = submenu.scrollHeight + "px";
                        submenu.style.overflow = 'visible';
                        submenu.addEventListener('transitionend', function onOpen() {
                            if (parentItem.classList.contains('open')) submenu.style.overflow = 'visible';
                            submenu.removeEventListener('transitionend', onOpen);
                        }, {once: true});
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
            }
        });
         elements.mobileMenuPanel.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMobileMenuOpen) {
                toggleMobileMenu(false);
            }
        });
    }

    function setupDesktopMenus() {
        if (!elements.desktopMenuItems || elements.desktopMenuItems.length === 0) return;
        const closeAllDesktopMenus = (exceptThisMenu) => {
            elements.desktopMenuItems.forEach(item => {
                const submenu = item.querySelector('.submenu');
                if (submenu && submenu !== exceptThisMenu && submenu.classList.contains('open')) {
                    submenu.classList.remove('open');
                    submenu.classList.add('hidden');
                    const toggleButton = item.querySelector('.desktop-menu-toggle');
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

        elements.desktopMenuItems.forEach(item => {
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
                            submenu.querySelectorAll('.sub-submenu-container.open').forEach(otherContainer => {
                                if (otherContainer !== container) {
                                    otherContainer.classList.remove('open');
                                    otherContainer.querySelector('.sub-submenu')?.classList.add('hidden');
                                    otherContainer.querySelector('.desktop-submenu-toggle')?.setAttribute('aria-expanded', 'false');
                                }
                            });
                            subSubmenu.classList.toggle('hidden', isSubExpanded);
                            requestAnimationFrame(() => subSubmenu.classList.toggle('open', !isSubExpanded));
                            this.setAttribute('aria-expanded', String(!isSubExpanded));
                        });
                    }
                });
            }
        });
        document.addEventListener('click', (event) => {
            let clickedInsideADesktopMenu = false;
            elements.desktopMenuItems.forEach(item => {
                if (item.contains(event.target)) clickedInsideADesktopMenu = true;
            });
            if (!clickedInsideADesktopMenu) closeAllDesktopMenus(null);
        });
    }
    setupDesktopMenus();
    
    function setupDesktopSearch() {
        if (!elements.desktopSearchButton || !elements.desktopSearchContainer || !elements.desktopSearchInput || !elements.desktopSearchClose) return;
        const elementsToHide = [elements.consultationButton, elements.desktopLangToggle, elements.desktopThemeToggle].filter(el => el);

        const toggleSearchVisibility = (show) => {
            elements.desktopSearchContainer.classList.toggle('hidden', !show);
            elements.desktopSearchContainer.classList.toggle('flex', show);
            elements.desktopSearchButton.classList.toggle('hidden', show);
            elementsToHide.forEach(el => el.classList.toggle('hidden', show));
            if (show) {
                requestAnimationFrame(() => elements.desktopSearchContainer.classList.add('active'));
                elements.desktopSearchInput.focus();
            } else {
                elements.desktopSearchContainer.classList.remove('active');
                elements.desktopSearchInput.value = '';
                elements.desktopSearchContainer.addEventListener('transitionend', () => {
                    if(!elements.desktopSearchContainer.classList.contains('active')) {
                        elements.desktopSearchContainer.classList.add('hidden');
                        elements.desktopSearchContainer.classList.remove('flex');
                    }
                }, {once: true});
                 setTimeout(() => { 
                    if(!elements.desktopSearchContainer.classList.contains('active')) {
                        elements.desktopSearchContainer.classList.add('hidden');
                        elements.desktopSearchContainer.classList.remove('flex');
                    }
                }, 350);
            }
        };
        elements.desktopSearchButton.addEventListener('click', (e) => { e.stopPropagation(); toggleSearchVisibility(true); });
        elements.desktopSearchClose.addEventListener('click', (e) => { e.stopPropagation(); toggleSearchVisibility(false); });
        elements.desktopSearchContainer.addEventListener('click', e => e.stopPropagation());
        elements.desktopSearchInput.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggleSearchVisibility(false); });
        document.addEventListener('click', (e) => {
            if (elements.desktopSearchContainer && !elements.desktopSearchContainer.classList.contains('hidden') && !elements.desktopSearchContainer.contains(e.target) && e.target !== elements.desktopSearchButton) {
                toggleSearchVisibility(false);
            }
        });
    }
    setupDesktopSearch();

    function setupLanguageDropdown(toggleBtn, optionsDiv) {
        if (!toggleBtn || !optionsDiv) return;
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
            optionsDiv.classList.toggle('hidden', isExpanded);
            optionsDiv.classList.toggle('show', !isExpanded);
            toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
            toggleBtn.classList.toggle('active', !isExpanded);
        });
        optionsDiv.querySelectorAll('.lang-button').forEach(button => {
            button.addEventListener('click', function() {
                const lang = this.dataset.lang;
                if (typeof window.setLanguage === 'function') {
                    window.setLanguage(lang);
                } else { console.warn("[MainJS] window.setLanguage not available."); }
                optionsDiv.classList.add('hidden');
                optionsDiv.classList.remove('show');
                toggleBtn.setAttribute('aria-expanded', 'false');
                toggleBtn.classList.remove('active');
            });
        });
    }
    if (elements.desktopLangToggle && elements.desktopLangOptions) setupLanguageDropdown(elements.desktopLangToggle, elements.desktopLangOptions);
    if (elements.mobileLangToggle && elements.mobileLangOptions) setupLanguageDropdown(elements.mobileLangToggle, elements.mobileLangOptions);
    
    document.addEventListener('click', () => { 
        [elements.desktopLangOptions, elements.mobileLangOptions].forEach(options => {
            if (options && !options.classList.contains('hidden')) {
                options.classList.add('hidden');
                options.classList.remove('show');
                const toggle = options.id === 'desktop-lang-options' ? elements.desktopLangToggle : elements.mobileLangToggle;
                if (toggle) {
                    toggle.setAttribute('aria-expanded', 'false');
                    toggle.classList.remove('active');
                }
            }
        });
    });
    
    function setupThemeToggleForHeader(buttonElement) {
        if (!buttonElement) return;
        const iconElement = buttonElement.querySelector('i');
        const textElement = buttonElement.id === 'theme-toggle-mobile' ? buttonElement.querySelector('span:not(.sr-only)') : null;

        function updateButtonUI(theme) {
            const isDark = theme === 'dark';
            if (iconElement) {
                iconElement.classList.toggle('fa-sun', isDark);
                iconElement.classList.toggle('fa-moon', !isDark);
            }
            if (textElement) {
                const key = isDark ? "theme_toggle_light_mobile" : "theme_toggle_dark_mobile";
                let buttonText = isDark ? "Chế độ sáng" : "Chế độ tối";
                if (typeof window.getTranslation === 'function') {
                    buttonText = window.getTranslation(key, buttonText);
                }
                textElement.textContent = buttonText;
            }
             const ariaLabelKey = isDark ? 'aria_switch_light' : 'aria_switch_dark';
             const ariaLabelFallback = isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối';
             const ariaLabelText = typeof window.getTranslation === 'function' ? window.getTranslation(ariaLabelKey, ariaLabelFallback) : ariaLabelFallback;
             buttonElement.setAttribute('aria-label', ariaLabelText);
        }

        let currentTheme = localStorage.getItem("theme") || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(currentTheme);
        updateButtonUI(currentTheme);

        buttonElement.addEventListener("click", () => {
            let newTheme = document.documentElement.classList.contains("dark") ? "light" : "dark";
            document.documentElement.classList.remove("light", "dark");
            document.documentElement.classList.add(newTheme);
            localStorage.setItem("theme", newTheme);
            updateButtonUI(newTheme);
        });
    }
    if (elements.desktopThemeToggle) setupThemeToggleForHeader(elements.desktopThemeToggle);
    if (elements.mobileThemeToggle) setupThemeToggleForHeader(elements.mobileThemeToggle);

    const handleScroll = () => {
        if(elements.navbar) elements.navbar.classList.toggle('shrinked', window.scrollY > 50);
    };
    window.addEventListener('scroll', debounce(handleScroll, 10), { passive: true });
    handleScroll();

    isMenuInitialized = true;
    console.log("[MainJS] Header interactions initialized successfully.");
}

function updateFooterYear(scope = document) {
    const yearElement = scope.querySelector(`#${FOOTER_YEAR_ID}`);
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

async function loadInternalNews() {
    if (!domCache.newsContainer) return;
    const defaultTexts = { loading: "Đang tải tin tức...", error: "Không thể tải tin tức.", noNews: "Chưa có tin tức nào.", readMore: "Đọc thêm →", titleNA: "Tiêu đề không có sẵn", imageAlt: "Hình ảnh tin tức" };
    const getText = (key) => (isLanguageSystemReady && typeof window.getTranslation === 'function') ? window.getTranslation(key, defaultTexts[key]) : defaultTexts[key];
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
        posts.slice(0, 6).forEach(post => {
            const card = document.createElement('div');
            card.className = 'news-card bg-white dark:bg-slate-800 dark:border dark:border-slate-700 rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 flex flex-col';
            const title = post.title?.[currentLang] || post.title?.vi || getText('titleNA');
            const excerpt = post.excerpt?.[currentLang] || post.excerpt?.vi || '';
            const imageAlt = post.image_alt?.[currentLang] || post.image_alt?.vi || title || getText('imageAlt');
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
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2" title="${title}">${title}</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3 flex-grow">${excerpt}</p>
                        <div class="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-auto pt-2 border-t border-gray-100 dark:border-gray-700">
                            <span>${dateDisplay}</span>
                            <span class="text-blue-500 dark:text-blue-400 font-medium group-hover:underline">${getText('readMore')}</span>
                        </div>
                    </div>
                </a>`;
            domCache.newsContainer.appendChild(card);
        });
    } catch (error) {
        console.error("[MainJS] Error loading internal news:", error);
        if(domCache.newsContainer) domCache.newsContainer.innerHTML = `<p class="text-red-500 w-full text-center">${getText('error')}</p>`;
    }
}

function initializeActiveMenuHighlighting(scope = document) {
    if (!scope) return;
    const currentFullHref = window.location.href.split('#')[0].split('?')[0];
    const currentPathname = (window.location.pathname.replace(/\/$/, "") || "/").replace(/\/index\.html$/, '') || "/";
    const isIndexPage = currentPathname === "/";

    const links = scope.querySelectorAll('a.nav-link, .submenu a, .sub-submenu a, #mobile-menu-panel a.nav-link');
    let bestMatch = null;
    let bestMatchSpecificity = -1;

    links.forEach(link => {
        link.classList.remove('active-menu-item');
        const parentMenuItem = link.closest('.main-menu-item, .mobile-menu-item');
        parentMenuItem?.classList.remove('active-parent-item');
        const parentToggle = parentMenuItem?.querySelector(':scope > .desktop-menu-toggle, :scope > .mobile-submenu-toggle');
        parentToggle?.classList.remove('active');


        const linkHref = link.getAttribute('href');
        if (!linkHref || linkHref.startsWith('#') || linkHref.startsWith('javascript:')) return;

        try {
            const linkUrl = new URL(linkHref, document.baseURI);
            const linkFullHref = linkUrl.href.split('#')[0].split('?')[0];
            let linkPathname = (linkUrl.pathname.replace(/\/$/, "") || "/").replace(/\/index\.html$/, '') || "/";
            
            let currentSpecificity = -1;

            if (linkFullHref === currentFullHref) {
                currentSpecificity = 3;
            } else if (linkPathname === currentPathname) {
                 currentSpecificity = 2;
                 if (currentPathname === "/" && linkPathname === "/") {
                     currentSpecificity = 2.5;
                 }
            } else if (currentPathname.startsWith(linkPathname) && linkPathname !== "/") {
                 currentSpecificity = 1;
            }
            
            if (currentSpecificity > bestMatchSpecificity) {
                bestMatchSpecificity = currentSpecificity;
                bestMatch = link;
            } else if (currentSpecificity === bestMatchSpecificity && currentSpecificity > -1) {
                if (linkHref.length > (bestMatch?.getAttribute('href')?.length || 0) ) {
                    bestMatch = link;
                }
            }
        } catch (e) { }
    });

    if (bestMatch) {
        bestMatch.classList.add('active-menu-item');
        let parentItem = bestMatch.closest('.main-menu-item, .mobile-menu-item');
        while(parentItem) {
            parentItem.classList.add('active-parent-item');
            const parentToggle = parentItem.querySelector(':scope > .desktop-menu-toggle, :scope > .mobile-submenu-toggle');
            if(parentToggle) parentToggle.classList.add('active');

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
            if (node.parentElement && ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT', 'SELECT'].includes(node.parentElement.tagName.toUpperCase())) {
                return NodeFilter.FILTER_REJECT;
            }
             if (node.parentElement && node.parentElement.closest('header, footer, .no-search')) { // Exclude header, footer, or specific sections
                return NodeFilter.FILTER_REJECT;
            }
            if (node.nodeValue.trim() === '') {
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
            currentNode = afterNode;
            matchIndex = currentNode.nodeValue.toLowerCase().indexOf(queryLower);
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
    }
}

async function initializeApp() {
    console.log("[MainJS] Initializing application...");
    cacheStaticElements();
    setupGlobalThemeToggle();

    const [headerLoadedElement, footerLoadedElement] = await Promise.all([
        loadComponent(HEADER_PLACEHOLDER_ID, HEADER_COMPONENT_URL),
        loadComponent(FOOTER_PLACEHOLDER_ID, FOOTER_COMPONENT_URL)
    ]);

    if (headerLoadedElement) initializeHeaderInteractions(headerLoadedElement);
    if (footerLoadedElement) {
        updateFooterYear(footerLoadedElement);
        const fabScript = footerLoadedElement.querySelector('script');
        if (fabScript && !document.getElementById('footer-fab-script')) {
            const newFabScript = document.createElement('script');
            newFabScript.id = 'footer-fab-script';
            newFabScript.textContent = fabScript.textContent;
            document.body.appendChild(newFabScript);
        }
    }

    if (typeof window.initializeLanguageSystem === 'function') {
        try {
            await window.initializeLanguageSystem();
            isLanguageSystemReady = true;
            console.log("[MainJS] Language system reported ready.");
            if (typeof window.applyTranslations === 'function') window.applyTranslations();
            if (headerLoadedElement && typeof window.attachLanguageSwitcherEvents === 'function') {
                window.attachLanguageSwitcherEvents(headerLoadedElement);
            }
            if (footerLoadedElement && typeof window.attachLanguageSwitcherEvents === 'function') {
                window.attachLanguageSwitcherEvents(footerLoadedElement);
            }
            if (headerLoadedElement && typeof initializeActiveMenuHighlighting === 'function') {
                initializeActiveMenuHighlighting(headerLoadedElement);
            }
        } catch (error) {
            console.error("[MainJS] Error during language system initialization:", error);
        }
    } else {
        console.warn("[MainJS] window.initializeLanguageSystem function not found.");
    }

    if (domCache.newsContainer) {
        await loadInternalNews();
    }
    if (headerLoadedElement && typeof initializeActiveMenuHighlighting === 'function' && !isLanguageSystemReady) {
        initializeActiveMenuHighlighting(headerLoadedElement);
    }
    console.log("[MainJS] Application initialization complete.");
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
