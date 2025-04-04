/**
 * Hàm tải nội dung HTML từ một URL và chèn vào phần tử có ID chỉ định.
 * @param {string} url Đường dẫn tuyệt đối từ gốc đến file HTML.
 * @param {string} elementId ID của phần tử placeholder.
 * @returns {Promise<HTMLElement|null>} Promise trả về phần tử gốc chứa nội dung đã tải hoặc null nếu lỗi.
 */
async function loadComponent(url, elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`DEBUG: Placeholder element #${elementId} not found.`);
        return null;
    }
    console.log(`DEBUG: Loading component ${url} into #${elementId}`);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Failed to load ${url}. Status: ${response.status} ${response.statusText}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        // Lấy phần tử header hoặc footer đầu tiên trong body của file component
        const componentContent = doc.querySelector('body > header, body > footer');

        if (componentContent) {
            // Xóa nội dung cũ trước khi chèn mới
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
            element.appendChild(componentContent); // Chèn trực tiếp header/footer element
            console.log(`DEBUG: Component ${elementId} loaded successfully from ${url}.`);
            // Trả về chính phần tử header/footer vừa được chèn vào DOM thực
            return element.querySelector('header, footer');
        } else {
             console.error(`DEBUG: No valid <header> or <footer> tag found directly inside <body> of ${url}.`);
             element.innerHTML = `<div style="text-align: center; padding: 10px; color: orange;">Nội dung ${elementId} không hợp lệ.</div>`;
             return null;
        }
    } catch (error) {
        console.error(`DEBUG: Error loading ${elementId} from ${url}:`, error);
        element.innerHTML = `<div style="text-align: center; padding: 10px; color: red;">Lỗi tải ${elementId}.</div>`;
        return null;
    }
}

// --- Cờ để đảm bảo menu chỉ được khởi tạo một lần ---
let menuInitialized = false;

/**
 * Khởi tạo các sự kiện cho menu (Phiên bản kết hợp: Slide cho main menu, MaxHeight cho submenu).
 * Được gọi SAU KHI header đã được tải thành công.
 */
function initializeCombinedMenuEvents() {
    // --- Thêm Guard ở đầu hàm ---
    if (menuInitialized) {
        console.warn("DEBUG: Menu events already initialized. Skipping.");
        return;
    }
    // ---------------------------

    console.log("DEBUG: Initializing COMBINED menu events...");
    const headerElement = document.getElementById('header-placeholder')?.querySelector('header#navbar');

    if (!headerElement) {
        console.error("DEBUG: Header element (#navbar) not found. Cannot initialize menu events.");
        return; // Thoát nếu không tìm thấy header
    }

    const mobileMenuButton = headerElement.querySelector('#mobile-menu-button');
    const mobileMenu = headerElement.querySelector('#mobile-menu');
    const mobileMenuOverlay = headerElement.querySelector('#mobile-menu-overlay');
    const iconMenu = headerElement.querySelector('#icon-menu');
    const iconClose = headerElement.querySelector('#icon-close');

    // --- Logic Toggle Menu Mobile Chính (Slide Animation) ---
    function toggleMobileMenuPanel() {
        // ... (Giữ nguyên logic toggle menu chính) ...
        if (!mobileMenu || !mobileMenuButton || !mobileMenuOverlay || !iconMenu || !iconClose) {
            console.error("DEBUG: Core mobile menu elements missing for toggle.");
            return;
        }
        const isOpening = mobileMenu.classList.contains('hidden');
        console.log(`DEBUG: Toggling mobile menu panel. Currently hidden: ${isOpening}`);

        mobileMenuButton.setAttribute('aria-expanded', isOpening);
        iconMenu.classList.toggle('hidden', isOpening);
        iconClose.classList.toggle('hidden', !isOpening);

        if (isOpening) {
            mobileMenuOverlay.classList.remove('hidden');
            mobileMenu.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            requestAnimationFrame(() => {
                mobileMenuOverlay.classList.remove('opacity-0');
                mobileMenu.classList.remove('translate-x-full');
                console.log("DEBUG: Mobile menu panel opening animation started.");
            });
        } else {
            mobileMenuOverlay.classList.add('opacity-0');
            mobileMenu.classList.add('translate-x-full');
            document.body.style.overflow = '';

            const handler = () => {
                 if (mobileMenu.classList.contains('translate-x-full')) {
                    mobileMenuOverlay.classList.add('hidden');
                    mobileMenu.classList.add('hidden');
                    closeAllMobileSubmenus(mobileMenu);
                    console.log("DEBUG: Mobile menu panel closing animation finished and elements hidden.");
                 }
                 mobileMenu.removeEventListener('transitionend', handler);
            };
            mobileMenu.addEventListener('transitionend', handler, { once: true });

            setTimeout(() => {
                if (mobileMenu.classList.contains('translate-x-full') && !mobileMenu.classList.contains('hidden')) {
                    mobileMenuOverlay.classList.add('hidden');
                    mobileMenu.classList.add('hidden');
                    closeAllMobileSubmenus(mobileMenu);
                    console.log("DEBUG: Mobile menu panel hidden via fallback timeout.");
                    mobileMenu.removeEventListener('transitionend', handler);
                }
            }, 350);
        }
    }

    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', toggleMobileMenuPanel);
    } else {
        console.warn("DEBUG: Mobile menu button (#mobile-menu-button) not found.");
    }

    // --- Logic Toggle Submenu Mobile (MaxHeight Animation - REFINED) ---
    const mobileMenuItems = mobileMenu?.querySelectorAll('.mobile-menu-item');

    if (mobileMenuItems && mobileMenuItems.length > 0) {
        mobileMenuItems.forEach(item => {
            const button = item.querySelector(':scope > button.mobile-submenu-toggle');
            const submenu = item.querySelector(':scope > .mobile-submenu');

            if (button && submenu) {
                if (!submenu.classList.contains('submenu-initialized')) {
                    submenu.style.overflow = 'hidden';
                    submenu.style.transition = 'max-height 0.3s ease-in-out';
                    submenu.style.maxHeight = '0';
                    if (!submenu.classList.contains('hidden')) {
                         submenu.classList.add('hidden');
                    }
                    submenu.classList.add('submenu-initialized');
                }

                button.addEventListener('click', (event) => {
                    event.stopPropagation();
                    const isCurrentlyHidden = submenu.classList.contains('hidden');
                    // ... (Giữ nguyên logic đóng siblings và toggle submenu) ...
                     // Đóng các submenu anh em cùng cấp
                    const parentContainer = item.parentElement;
                    if (parentContainer) {
                        const siblingItems = parentContainer.querySelectorAll(':scope > .mobile-menu-item');
                        siblingItems.forEach(sibling => {
                            if (sibling !== item) {
                                const otherSubmenu = sibling.querySelector(':scope > .mobile-submenu');
                                if (otherSubmenu && !otherSubmenu.classList.contains('hidden')) {
                                    closeSingleMobileSubmenu(sibling, otherSubmenu);
                                }
                            }
                        });
                    }
                     // Toggle submenu hiện tại
                    if (isCurrentlyHidden) {
                        submenu.classList.remove('hidden');
                        submenu.style.maxHeight = submenu.scrollHeight + "px";
                        item.classList.add('open');
                        console.log(`DEBUG: Opening mobile submenu, set max-height: ${submenu.scrollHeight}px`);
                         const openTransitionHandler = () => {
                            if (item.classList.contains('open')) {
                                submenu.style.maxHeight = '';
                                console.log(`DEBUG: Removed max-height after opening submenu.`);
                            }
                            submenu.removeEventListener('transitionend', openTransitionHandler);
                        };
                        submenu.addEventListener('transitionend', openTransitionHandler, { once: true });
                    } else {
                        closeSingleMobileSubmenu(item, submenu);
                    }
                });
            }
        });
    } else {
        console.warn("DEBUG: No mobile menu items (.mobile-menu-item) found for submenu toggling.");
    }

    // --- Đóng Menu Mobile Khi Click Bên Ngoài hoặc Nhấn Esc ---
    // ... (Giữ nguyên logic này) ...
     function closeMenuFromOutside(event) {
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            // Phải kiểm tra headerElement tồn tại trước khi dùng contains
            const isClickInsideHeader = headerElement && headerElement.contains(event.target);
             // Phải kiểm tra mobileMenuButton tồn tại
            const isClickOnToggleButton = mobileMenuButton && mobileMenuButton.contains(event.target);
            if (!isClickInsideHeader && !isClickOnToggleButton) {
                console.log("DEBUG: Clicked outside header, closing mobile menu.");
                toggleMobileMenuPanel();
            }
        }
    }
    function closeMenuOnEscape(event) {
        if (event.key === 'Escape' && mobileMenu && !mobileMenu.classList.contains('hidden')) {
            console.log("DEBUG: Escape pressed, closing mobile menu.");
            toggleMobileMenuPanel();
        }
    }
    // Gắn listener một cách an toàn hơn, chỉ khi các element tồn tại
    if (headerElement && mobileMenuButton && mobileMenu && mobileMenuOverlay) {
        document.removeEventListener('click', closeMenuFromOutside);
        document.addEventListener('click', closeMenuFromOutside);
        document.removeEventListener('keydown', closeMenuOnEscape);
        document.addEventListener('keydown', closeMenuOnEscape);
        mobileMenuOverlay.removeEventListener('click', toggleMobileMenuPanel);
        mobileMenuOverlay.addEventListener('click', toggleMobileMenuPanel);
    }


    // --- Active Menu Item Highlighting ---
    initializeActiveMenuHighlighting(headerElement);

    // --- Sticky Navbar Logic (Optional) ---
    initializeStickyNavbar(headerElement);

    // --- Đặt cờ báo đã khởi tạo thành công ---
    menuInitialized = true;
    console.log("DEBUG: COMBINED menu events initialized successfully.");
}

/**
 * Hàm đóng một submenu mobile cụ thể với animation maxHeight (REFINED).
 * @param {HTMLElement} item - Phần tử .mobile-menu-item cha.
 * @param {HTMLElement} submenu - Phần tử .mobile-submenu cần đóng.
 */
function closeSingleMobileSubmenu(item, submenu) {
    // ... (Giữ nguyên logic này) ...
    if (!item || !submenu || submenu.classList.contains('hidden')) return;

    const button = item.querySelector(':scope > button.mobile-submenu-toggle');
    const buttonText = button ? button.textContent.trim() : 'unknown';
    console.log(`DEBUG: Closing single mobile submenu for "${buttonText}"`);

    submenu.style.maxHeight = submenu.scrollHeight + "px";
    item.classList.remove('open');

    requestAnimationFrame(() => {
        submenu.style.maxHeight = '0';
        console.log(`DEBUG: Closing animation started for "${buttonText}", set max-height: 0`);
    });

    const closeTransitionHandler = () => {
         if (!submenu.classList.contains('hidden') && !item.classList.contains('open')) {
            submenu.classList.add('hidden');
            closeAllMobileSubmenus(submenu);
            console.log(`DEBUG: Finished closing mobile submenu for "${buttonText}", added 'hidden'.`);
        }
        submenu.removeEventListener('transitionend', closeTransitionHandler);
    };
     submenu.addEventListener('transitionend', closeTransitionHandler, { once: true });

     setTimeout(() => {
         if (!submenu.classList.contains('hidden') && !item.classList.contains('open')) {
             console.log(`DEBUG: Closing mobile submenu for "${buttonText}" via fallback timeout.`);
             submenu.classList.add('hidden');
             closeAllMobileSubmenus(submenu);
             submenu.removeEventListener('transitionend', closeTransitionHandler);
         }
     }, 350);
}

/**
 * Hàm đóng tất cả các submenu mobile đang mở bên trong một phần tử cha (kể cả con cháu).
 * @param {HTMLElement} parentElement Phần tử cha (ví dụ: #mobile-menu hoặc một .mobile-submenu).
 */
function closeAllMobileSubmenus(parentElement) {
    // ... (Giữ nguyên logic này) ...
    if (!parentElement) return;
    const openItems = parentElement.querySelectorAll(':scope > .mobile-menu-item.open, :scope > div > .mobile-menu-item.open');
    let closedCount = 0;
    openItems.forEach(item => {
        const submenu = item.querySelector(':scope > .mobile-submenu');
        if (submenu && !submenu.classList.contains('hidden')) {
            closeSingleMobileSubmenu(item, submenu);
            closedCount++;
        } else if (item.classList.contains('open')) {
             item.classList.remove('open');
        }
    });
}

/**
 * Đánh dấu link điều hướng đang hoạt động.
 * @param {HTMLElement} headerElement Phần tử header chứa menu.
 */
function initializeActiveMenuHighlighting(headerElement) {
    // ... (Giữ nguyên logic này) ...
     if (!headerElement) {
        console.warn("DEBUG: Header element not provided for active link highlighting.");
        return;
    }
    console.log("DEBUG: Initializing active menu highlighting...");

    const currentPagePath = window.location.pathname;
    const currentHref = window.location.href;
    const menuLinks = headerElement.querySelectorAll('.hidden.md\\:flex a[href], #mobile-menu a[href]');

    // --- Xóa trạng thái active cũ ---
    menuLinks.forEach(link => {
        link.classList.remove('active-menu-item', 'font-semibold', 'text-blue-600');
        const mobileItem = link.closest('.mobile-menu-item');
        if (mobileItem) {
            mobileItem.classList.remove('open');
            mobileItem.querySelector(':scope > button')?.classList.remove('active-parent-item', 'font-semibold', 'text-blue-600', 'bg-gray-100');
            const submenu = mobileItem.querySelector(':scope > .mobile-submenu');
            // Chỉ đóng nếu nó đã được khởi tạo và đang không ẩn
            if (submenu && submenu.classList.contains('submenu-initialized') && !submenu.classList.contains('hidden')) {
                 // Tạm thời không đóng ở đây, để logic active xử lý việc mở lại nếu cần
                 // closeSingleMobileSubmenu(mobileItem, submenu);
            }
        }
        link.closest('.main-menu-item')?.querySelector(':scope > button')?.classList.remove('active-parent-item', 'font-semibold', 'text-blue-600');
        link.closest('.sub-submenu-container')?.querySelector(':scope > button')?.classList.remove('active-parent-item', 'font-semibold', 'text-blue-600');
    });


    // --- Tìm link khớp nhất ---
    let bestMatchLink = null;
    let highestSpecificity = -1;

    menuLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (!linkHref || linkHref === '#') return;
        let linkUrl;
        try { linkUrl = new URL(linkHref, window.location.origin); }
        catch (e) { console.warn(`DEBUG: Invalid URL: ${linkHref}`); return; }

        const linkPath = linkUrl.pathname;
        const linkFullHref = linkUrl.href.split('#')[0];
        const currentFullHref = currentHref.split('#')[0];
        let currentSpecificity = -1;

        if (linkFullHref === currentFullHref) {
            currentSpecificity = 2;
        } else {
            const normalizePath = (path) => {
                let p = path.endsWith('/') ? path.slice(0, -1) : path;
                if (p === '/index.html') p = '/';
                else if (p.endsWith('/index.html')) p = p.substring(0, p.length - '/index.html'.length);
                return p === '' ? '/' : p;
            };
            const normalizedLinkPath = normalizePath(linkPath);
            const normalizedCurrentPath = normalizePath(currentPagePath);

            if (normalizedLinkPath === normalizedCurrentPath) {
                currentSpecificity = (normalizedCurrentPath === '/') ? 1 : 0;
            }
        }

        if (currentSpecificity > highestSpecificity) {
            highestSpecificity = currentSpecificity;
            bestMatchLink = link;
        } else if (currentSpecificity === highestSpecificity && currentSpecificity >= 0) {
            if (bestMatchLink && linkPath.length > (new URL(bestMatchLink.href, window.location.origin)).pathname.length) {
                bestMatchLink = link;
            }
        }
    });

    // --- Áp dụng class active ---
    if (bestMatchLink) {
        bestMatchLink.classList.add('active-menu-item', 'font-semibold', 'text-blue-600');
        console.log(`DEBUG: Final active link set for: ${bestMatchLink.getAttribute('href')}`);

        let currentElement = bestMatchLink;
        while (currentElement && currentElement !== headerElement) {
            const parentMenuItem = currentElement.closest('.main-menu-item, .mobile-menu-item, .sub-submenu-container');
            if (parentMenuItem) {
                const parentToggle = parentMenuItem.querySelector(':scope > button.nav-link, :scope > a.nav-link');
                if (parentToggle) {
                    parentToggle.classList.add('active-parent-item', 'font-semibold', 'text-blue-600');
                     if (parentMenuItem.classList.contains('mobile-menu-item')) {
                         parentToggle.classList.add('bg-gray-100');
                     }
                }

                if (parentMenuItem.classList.contains('mobile-menu-item')) {
                    const parentSubmenu = parentMenuItem.querySelector(':scope > .mobile-submenu');
                    // Chỉ mở nếu nó đã được khởi tạo và đang ẩn
                    if (parentSubmenu && parentSubmenu.classList.contains('submenu-initialized') && parentSubmenu.classList.contains('hidden')) {
                        parentMenuItem.classList.add('open');
                        parentSubmenu.classList.remove('hidden');
                        parentSubmenu.style.maxHeight = ''; // Mở ngay
                        console.log(`DEBUG: Auto-opening active mobile submenu for: ${parentToggle?.textContent.trim()}`);
                    }
                }
                currentElement = parentMenuItem.parentElement;
            } else {
                currentElement = currentElement.parentElement;
            }
        }
    } else {
        console.log("DEBUG: No suitable active link found.");
    }
}


/**
 * Khởi tạo logic cho sticky navbar.
 * @param {HTMLElement} navbarElement Phần tử header (navbar).
 */
function initializeStickyNavbar(navbarElement) {
    // ... (Giữ nguyên logic này) ...
     if (!navbarElement) {
        console.warn("DEBUG: Navbar element not provided for sticky behavior.");
        return;
    }
    console.log("DEBUG: Initializing sticky navbar behavior...");
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > navbarElement.offsetHeight) {
            navbarElement.style.top = `-${navbarElement.offsetHeight}px`;
        } else {
            navbarElement.style.top = '0';
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, { passive: true });
}


// --- Chạy các hàm khởi tạo chính khi DOM sẵn sàng ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DEBUG: DOM fully loaded. Initializing components.");

    Promise.all([
        loadComponent('/header.html', 'header-placeholder'),
        loadComponent('/footer.html', 'footer-placeholder')
    ]).then(([headerElement, footerElement]) => {
        console.log("DEBUG: Header and Footer loading promises resolved.");
        // Thêm log để xem headerElement là gì
        console.log("DEBUG: Resolved headerElement:", headerElement);
        if (headerElement && headerElement.id === 'navbar') {
            initializeCombinedMenuEvents(); // Gọi hàm khởi tạo menu KẾT HỢP mới
        } else {
            // Log chi tiết hơn nếu check fail
            console.error("DEBUG: Header component check failed.");
            if(!headerElement) console.error("DEBUG: Reason: headerElement is null or undefined.");
            else if(headerElement.id !== 'navbar') console.error(`DEBUG: Reason: headerElement ID is "${headerElement.id}", expected "navbar".`);
            console.error("DEBUG: Menu events not initialized.");
        }
    }).catch(error => {
        console.error("DEBUG: Critical error during component loading.", error);
    });

    console.log("DEBUG: Initial component setup sequence started.");
});
