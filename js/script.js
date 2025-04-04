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
        const componentContent = doc.body.firstElementChild;

        if (componentContent) {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
            element.appendChild(componentContent);
            console.log(`DEBUG: Component ${elementId} loaded successfully from ${url}.`);
            return componentContent;
        } else {
            console.error(`DEBUG: No valid content found in ${url}.`);
            element.innerHTML = `<div style="text-align: center; padding: 10px; color: orange;">Nội dung ${elementId} trống.</div>`;
            return null;
        }
    } catch (error) {
        console.error(`DEBUG: Error loading ${elementId} from ${url}:`, error);
        element.innerHTML = `<div style="text-align: center; padding: 10px; color: red;">Lỗi tải ${elementId}.</div>`;
        return null;
    }
}

/**
 * Khởi tạo các sự kiện cho menu (Phiên bản kết hợp: Slide cho main menu, MaxHeight cho submenu).
 * Được gọi SAU KHI header đã được tải thành công.
 */
function initializeCombinedMenuEvents() {
    console.log("DEBUG: Initializing COMBINED menu events...");
    const headerElement = document.getElementById('header-placeholder')?.querySelector('header#navbar');

    if (!headerElement) {
        console.error("DEBUG: Header element (#navbar) not found. Cannot initialize menu events.");
        return;
    }

    const mobileMenuButton = headerElement.querySelector('#mobile-menu-button');
    const mobileMenu = headerElement.querySelector('#mobile-menu');
    const mobileMenuOverlay = headerElement.querySelector('#mobile-menu-overlay');
    const iconMenu = headerElement.querySelector('#icon-menu');
    const iconClose = headerElement.querySelector('#icon-close');

    // --- Logic Toggle Menu Mobile Chính (Slide Animation) ---
    function toggleMobileMenuPanel() {
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

    // --- Logic Toggle Submenu Mobile (MaxHeight Animation) ---
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
                    submenu.classList.add('hidden');
                    submenu.classList.add('submenu-initialized');
                }

                button.addEventListener('click', (event) => {
                    event.stopPropagation();

                    const isCurrentlyHidden = submenu.classList.contains('hidden');
                    console.log(`DEBUG: Toggling mobile submenu for "${button.textContent.trim()}". Currently hidden: ${isCurrentlyHidden}`);

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

    console.log("DEBUG: COMBINED menu events initialized successfully.");
}

// --- Chạy các hàm khởi tạo chính khi DOM sẵn sàng ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DEBUG: DOM fully loaded. Initializing components.");

    Promise.all([
        loadComponent('/header.html', 'header-placeholder'),
        loadComponent('/footer.html', 'footer-placeholder')
    ]).then(([headerElement, footerElement]) => {
        console.log("DEBUG: Header and Footer loading promises resolved.");
        if (headerElement && headerElement.id === 'navbar') {
            initializeCombinedMenuEvents();
        } else {
            console.error("DEBUG: Header component (#navbar) failed to load or missing ID. Menu events not initialized.");
        }
    }).catch(error => {
        console.error("DEBUG: Critical error during component loading.", error);
    });

    console.log("DEBUG: Initial component setup sequence started.");
});
