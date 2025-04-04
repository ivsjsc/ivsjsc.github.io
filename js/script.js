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
        // Sử dụng DOMParser để tránh thực thi script không mong muốn trong component
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        const componentContent = doc.body.firstElementChild; // Lấy phần tử đầu tiên trong body của component (thường là header hoặc footer)

        if (componentContent) {
            // Xóa nội dung cũ trước khi chèn mới
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
            element.appendChild(componentContent);
            console.log(`DEBUG: Component ${elementId} loaded successfully from ${url}.`);
            return componentContent; // Trả về phần tử đã được chèn
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
    const headerElement = document.getElementById('header-placeholder')?.querySelector('header#navbar'); // Sử dụng ID navbar từ HTML mới

    if (!headerElement) {
        console.error("DEBUG: Header element (#navbar) not found inside placeholder. Cannot initialize menu events.");
        return;
    }

    // --- Lấy các phần tử Menu Mobile Chính ---
    const mobileMenuButton = headerElement.querySelector('#mobile-menu-button');
    const mobileMenu = headerElement.querySelector('#mobile-menu'); // Panel menu
    const mobileMenuOverlay = headerElement.querySelector('#mobile-menu-overlay'); // Overlay
    const iconMenu = headerElement.querySelector('#icon-menu'); // Icon hamburger (Lucide)
    const iconClose = headerElement.querySelector('#icon-close'); // Icon close (Lucide)

    // --- Logic Toggle Menu Mobile Chính (Slide Animation) ---
    function toggleMobileMenuPanel() {
        if (!mobileMenu || !mobileMenuButton || !mobileMenuOverlay || !iconMenu || !iconClose) {
            console.error("DEBUG: Core mobile menu elements missing for toggle.");
            return;
        }
        const isOpening = mobileMenu.classList.contains('hidden'); // Kiểm tra trạng thái *trước* khi thay đổi
        console.log(`DEBUG: Toggling mobile menu panel. Currently hidden: ${isOpening}`);

        mobileMenuButton.setAttribute('aria-expanded', isOpening); // Cập nhật aria-expanded
        iconMenu.classList.toggle('hidden', isOpening);    // Hiện/ẩn icon hamburger
        iconClose.classList.toggle('hidden', !isOpening); // Hiện/ẩn icon close

        if (isOpening) {
            // Mở menu
            mobileMenuOverlay.classList.remove('hidden');
            mobileMenu.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Ngăn cuộn trang nền

            // Thêm độ trễ nhỏ để transition CSS hoạt động
            requestAnimationFrame(() => {
                mobileMenuOverlay.classList.remove('opacity-0');
                mobileMenu.classList.remove('translate-x-full');
                console.log("DEBUG: Mobile menu panel opening animation started.");
            });
        } else {
            // Đóng menu
            mobileMenuOverlay.classList.add('opacity-0');
            mobileMenu.classList.add('translate-x-full');
            document.body.style.overflow = ''; // Cho phép cuộn lại

            // Đợi transition hoàn thành trước khi ẩn hẳn bằng class 'hidden'
            // và đóng tất cả submenu con bên trong
            mobileMenu.addEventListener('transitionend', () => {
                if (mobileMenu.classList.contains('translate-x-full')) { // Chỉ ẩn nếu vẫn đang ở trạng thái đóng
                    mobileMenuOverlay.classList.add('hidden');
                    mobileMenu.classList.add('hidden');
                    closeAllMobileSubmenus(mobileMenu); // Đóng các submenu con
                    console.log("DEBUG: Mobile menu panel closing animation finished and elements hidden.");
                }
            }, { once: true });

             // Fallback nếu transitionend không kích hoạt (ví dụ: element bị remove khỏi DOM)
            setTimeout(() => {
                if (mobileMenu.classList.contains('translate-x-full')) {
                     if (!mobileMenu.classList.contains('hidden')) {
                        mobileMenuOverlay.classList.add('hidden');
                        mobileMenu.classList.add('hidden');
                        closeAllMobileSubmenus(mobileMenu);
                        console.log("DEBUG: Mobile menu panel hidden via fallback timeout.");
                     }
                }
            }, 350); // Thời gian > transition duration (300ms)
        }
    }

    // Gắn sự kiện cho nút toggle menu chính
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', toggleMobileMenuPanel);
    } else {
        console.warn("DEBUG: Mobile menu button (#mobile-menu-button) not found.");
    }

    // --- Logic Toggle Submenu Mobile (MaxHeight Animation) ---
    const mobileMenuItems = mobileMenu?.querySelectorAll('.mobile-menu-item'); // Sử dụng class này cho các li chứa submenu

    if (mobileMenuItems && mobileMenuItems.length > 0) {
        mobileMenuItems.forEach(item => {
            const button = item.querySelector(':scope > button.mobile-submenu-toggle'); // Nút toggle submenu
            const submenu = item.querySelector(':scope > .mobile-submenu'); // Div submenu

            if (button && submenu) {
                // Khởi tạo trạng thái ẩn và maxHeight=0 cho animation
                if (!submenu.classList.contains('submenu-initialized')) {
                    submenu.style.overflow = 'hidden'; // Quan trọng cho maxHeight
                    submenu.style.transition = 'max-height var(--menu-transition-duration, 0.3s) ease-in-out'; // Đảm bảo có transition
                    submenu.style.maxHeight = '0';
                    // Thêm hidden sau khi đặt maxHeight=0 để đảm bảo ẩn hoàn toàn ban đầu
                     requestAnimationFrame(() => {
                         if (submenu.style.maxHeight === '0px') { // Chỉ thêm hidden nếu thực sự đã co lại
                             submenu.classList.add('hidden');
                         }
                     });
                    submenu.classList.add('submenu-initialized');
                }

                button.addEventListener('click', (event) => {
                    event.stopPropagation(); // Ngăn sự kiện click lan ra ngoài

                    const isOpening = submenu.classList.contains('hidden');
                    console.log(`DEBUG: Toggling mobile submenu for "${button.textContent.trim()}". Currently hidden: ${isOpening}`);

                    // Đóng các submenu anh em cùng cấp TRƯỚC KHI toggle mục hiện tại
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
                    if (isOpening) {
                        // Mở submenu
                        submenu.classList.remove('hidden'); // Bỏ hidden để tính scrollHeight
                        requestAnimationFrame(() => { // Đảm bảo trình duyệt cập nhật DOM
                            submenu.style.maxHeight = submenu.scrollHeight + "px";
                            item.classList.add('open'); // Thêm class để xoay icon (cần CSS tương ứng)
                            console.log(`DEBUG: Opening mobile submenu, set max-height: ${submenu.scrollHeight}px`);

                            // Xóa maxHeight sau khi transition kết thúc để nội dung tự do giãn nở
                            submenu.addEventListener('transitionend', function onOpenEnd() {
                                // Chỉ xóa nếu nó vẫn đang mở (tránh trường hợp đóng nhanh)
                                if (item.classList.contains('open')) {
                                    submenu.style.maxHeight = ''; // Xóa maxHeight
                                }
                                submenu.removeEventListener('transitionend', onOpenEnd);
                            }, { once: true });
                        });
                    } else {
                        // Đóng submenu
                        closeSingleMobileSubmenu(item, submenu);
                    }
                });
            }
        });
    } else {
        console.warn("DEBUG: No mobile menu items (.mobile-menu-item) found for submenu toggling.");
    }

    // --- Đóng Menu Mobile Khi Click Bên Ngoài hoặc Nhấn Esc ---
    function closeMenuFromOutside(event) {
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) { // Chỉ xử lý khi menu đang mở
            const isClickInsideHeader = headerElement.contains(event.target);
             // Kiểm tra xem click có phải vào nút toggle không (để tránh đóng ngay khi vừa mở)
            const isClickOnToggleButton = mobileMenuButton.contains(event.target);

            if (!isClickInsideHeader && !isClickOnToggleButton) {
                console.log("DEBUG: Clicked outside header, closing mobile menu.");
                toggleMobileMenuPanel(); // Gọi hàm toggle để đóng
            }
        }
    }

    function closeMenuOnEscape(event) {
        if (event.key === 'Escape' && mobileMenu && !mobileMenu.classList.contains('hidden')) {
            console.log("DEBUG: Escape pressed, closing mobile menu.");
            toggleMobileMenuPanel(); // Gọi hàm toggle để đóng
        }
    }

    // Gắn listener (chỉ một lần)
    document.removeEventListener('click', closeMenuFromOutside); // Xóa listener cũ nếu có
    document.addEventListener('click', closeMenuFromOutside);
    document.removeEventListener('keydown', closeMenuOnEscape); // Xóa listener cũ nếu có
    document.addEventListener('keydown', closeMenuOnEscape);

    // Đóng menu khi click vào overlay (gắn lại nếu cần, đảm bảo không bị xóa bởi logic khác)
    if (mobileMenuOverlay) {
         mobileMenuOverlay.removeEventListener('click', toggleMobileMenuPanel); // Xóa listener cũ
         mobileMenuOverlay.addEventListener('click', toggleMobileMenuPanel);
    }


    // --- Active Menu Item Highlighting ---
    initializeActiveMenuHighlighting(headerElement); // Truyền headerElement vào

    // --- Sticky Navbar Logic (Optional) ---
    initializeStickyNavbar(headerElement);

    console.log("DEBUG: COMBINED menu events initialized successfully.");
}

/**
 * Hàm đóng một submenu mobile cụ thể với animation maxHeight.
 * @param {HTMLElement} item - Phần tử .mobile-menu-item cha.
 * @param {HTMLElement} submenu - Phần tử .mobile-submenu cần đóng.
 */
function closeSingleMobileSubmenu(item, submenu) {
    if (!item || !submenu || submenu.classList.contains('hidden')) return;

    console.log(`DEBUG: Closing single mobile submenu for "${item.querySelector(':scope > button')?.textContent.trim()}"`);
    // Đặt lại maxHeight về giá trị hiện tại (scrollHeight) để bắt đầu transition về 0
    submenu.style.maxHeight = submenu.scrollHeight + "px";
    item.classList.remove('open'); // Xoay icon lại (cần CSS)

    // Buộc reflow nhỏ và bắt đầu transition về 0
    requestAnimationFrame(() => {
        submenu.style.maxHeight = '0';
    });

    // Lắng nghe transition kết thúc để thêm lại class 'hidden'
    submenu.addEventListener('transitionend', function onCloseEnd() {
        // Chỉ thêm hidden nếu maxHeight thực sự là 0 (tránh trường hợp mở lại nhanh)
        if (submenu.style.maxHeight === '0px') {
            submenu.classList.add('hidden');
            // Quan trọng: Đóng tất cả các submenu con cháu bên trong khi cha đóng
            closeAllMobileSubmenus(submenu);
            console.log(`DEBUG: Finished closing mobile submenu, added 'hidden'.`);
        }
         submenu.removeEventListener('transitionend', onCloseEnd);
    }, { once: true });

     // Fallback nếu transitionend không kích hoạt
     setTimeout(() => {
         if (!submenu.classList.contains('hidden') && !item.classList.contains('open')) {
             console.log("DEBUG: Closing mobile submenu via fallback timeout.");
             submenu.classList.add('hidden');
             closeAllMobileSubmenus(submenu);
             submenu.removeEventListener('transitionend', onCloseEnd); // Hủy listener nếu còn
         }
     }, 350); // Thời gian > transition duration
}

/**
 * Hàm đóng tất cả các submenu mobile đang mở bên trong một phần tử cha (kể cả con cháu).
 * @param {HTMLElement} parentElement Phần tử cha (ví dụ: #mobile-menu hoặc một .mobile-submenu).
 */
function closeAllMobileSubmenus(parentElement) {
    if (!parentElement) return;
    // Tìm các item đang mở TRỰC TIẾP bên trong parentElement
    const openItems = parentElement.querySelectorAll(':scope > .mobile-menu-item.open, :scope > div > .mobile-menu-item.open'); // Mở rộng selector
    let closedCount = 0;
    openItems.forEach(item => {
        const submenu = item.querySelector(':scope > .mobile-submenu');
        if (submenu && !submenu.classList.contains('hidden')) {
            closeSingleMobileSubmenu(item, submenu);
            closedCount++;
        } else {
             // Nếu item có class 'open' nhưng không có submenu hoặc submenu đã ẩn, chỉ cần xóa class 'open'
             item.classList.remove('open');
        }
    });
    if (closedCount > 0) {
        console.log(`DEBUG: Closed ${closedCount} open mobile submenus within`, parentElement);
    }
}

/**
 * Đánh dấu link điều hướng đang hoạt động.
 * @param {HTMLElement} headerElement Phần tử header chứa menu.
 */
function initializeActiveMenuHighlighting(headerElement) {
     if (!headerElement) {
        console.warn("DEBUG: Header element not provided for active link highlighting.");
        return;
    }
    console.log("DEBUG: Initializing active menu highlighting...");

    const currentPagePath = window.location.pathname;
    const currentHref = window.location.href;
    // Tìm link trong cả desktop và mobile menu bên trong header đã load
    const menuLinks = headerElement.querySelectorAll('.hidden.md\\:flex a[href], #mobile-menu a[href]');

    // Xóa active cũ
    menuLinks.forEach(link => {
        link.classList.remove('active-menu-item', 'font-semibold', 'text-blue-600'); // Xóa class active chung
        link.closest('.mobile-menu-item')?.classList.remove('open'); // Đóng mobile item trước
         link.closest('.mobile-menu-item')?.querySelector(':scope > button')?.classList.remove('active-parent-item', 'font-semibold', 'text-blue-600', 'bg-gray-100');
         link.closest('.main-menu-item')?.querySelector(':scope > button')?.classList.remove('active-parent-item', 'font-semibold', 'text-blue-600');
         link.closest('.sub-submenu-container')?.querySelector(':scope > button')?.classList.remove('active-parent-item', 'font-semibold', 'text-blue-600');

         // Đảm bảo submenu mobile đóng nếu không active
         const parentMobileSubmenu = link.closest('.mobile-submenu');
         if (parentMobileSubmenu && !parentMobileSubmenu.querySelector('.active-menu-item')) {
             // Logic đóng sẽ được xử lý sau khi xác định link active
         }
    });
     // Đóng tất cả submenu mobile trước khi highlight
     const allMobileSubmenus = headerElement.querySelectorAll('#mobile-menu .mobile-submenu');
     allMobileSubmenus.forEach(sub => {
         if (!sub.classList.contains('hidden')) {
             const parentItem = sub.closest('.mobile-menu-item');
             if (parentItem) closeSingleMobileSubmenu(parentItem, sub);
         }
     });


    let bestMatchLink = null;
    let highestSpecificity = -1; // Mức độ ưu tiên: 2 = href full match, 1 = path match ('/'), 0 = path match (khác '/')

    menuLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (!linkHref || linkHref === '#') return;

        // Xử lý link tương đối và tuyệt đối
        let linkUrl;
        try {
            linkUrl = new URL(linkHref, window.location.origin);
        } catch (e) {
            console.warn(`DEBUG: Invalid URL format for link: ${linkHref}`);
            return; // Bỏ qua link không hợp lệ
        }

        const linkPath = linkUrl.pathname;
        const linkFullHref = linkUrl.href.split('#')[0]; // So sánh không tính hash
        const currentFullHref = currentHref.split('#')[0];
        let currentSpecificity = -1;

        // Ưu tiên 1: So sánh href đầy đủ (không tính hash)
        if (linkFullHref === currentFullHref) {
            currentSpecificity = 2;
        } else {
            // Ưu tiên 2: So sánh path đã chuẩn hóa
            const normalizePath = (path) => {
                let p = path.endsWith('/') ? path.slice(0, -1) : path; // Bỏ dấu / cuối cùng
                if (p === '/index.html') p = '/'; // Chuẩn hóa index.html
                 else if (p.endsWith('/index.html')) p = p.substring(0, p.length - '/index.html'.length);
                return p === '' ? '/' : p; // Trả về '/' nếu rỗng
            };
            const normalizedLinkPath = normalizePath(linkPath);
            const normalizedCurrentPath = normalizePath(currentPagePath);

            if (normalizedLinkPath === normalizedCurrentPath) {
                 // Ưu tiên trang chủ ('/') hơn các trang khác nếu path trùng
                currentSpecificity = (normalizedCurrentPath === '/') ? 1 : 0;
            }
        }

        if (currentSpecificity > highestSpecificity) {
            highestSpecificity = currentSpecificity;
            bestMatchLink = link;
        }
        // Trường hợp đặc biệt: Nếu đã có match path (specificity 0 hoặc 1),
        // và link hiện tại cũng match path nhưng dài hơn -> ưu tiên link dài hơn (chính xác hơn)
        else if (currentSpecificity === highestSpecificity && currentSpecificity >= 0) {
             if (bestMatchLink && linkPath.length > bestMatchLink.pathname.length) {
                 bestMatchLink = link;
             }
        }
    });

    // Áp dụng class active cho link tốt nhất và các mục cha
    if (bestMatchLink) {
        bestMatchLink.classList.add('active-menu-item', 'font-semibold', 'text-blue-600'); // Thêm class active
        console.log(`DEBUG: Final active link set for: ${bestMatchLink.getAttribute('href')}`);

        let currentElement = bestMatchLink;
        while (currentElement && currentElement !== headerElement) {
             // Tìm li hoặc div cha gần nhất là một menu item
            const parentMenuItem = currentElement.closest('.main-menu-item, .mobile-menu-item, .sub-submenu-container');
            if (parentMenuItem) {
                 // Tìm button hoặc link toggle trực tiếp của item cha đó
                const parentToggle = parentMenuItem.querySelector(':scope > button, :scope > a.nav-link'); // Ưu tiên button
                if (parentToggle) {
                    parentToggle.classList.add('active-parent-item', 'font-semibold', 'text-blue-600');
                     if (parentMenuItem.classList.contains('mobile-menu-item')) {
                         parentToggle.classList.add('bg-gray-100'); // Thêm nền cho mobile parent
                     }
                }

                // Nếu là mobile item và chứa link active, đảm bảo nó và các cha của nó mở ra
                if (parentMenuItem.classList.contains('mobile-menu-item')) {
                    parentMenuItem.classList.add('open'); // Đảm bảo item cha mở (xoay icon)
                    const parentSubmenu = parentMenuItem.querySelector(':scope > .mobile-submenu');
                    if (parentSubmenu && parentSubmenu.classList.contains('hidden')) {
                        // Mở submenu ngay lập tức (không cần animation khi load trang)
                        parentSubmenu.classList.remove('hidden');
                        parentSubmenu.style.maxHeight = ''; // Cho phép chiều cao tự nhiên
                        console.log(`DEBUG: Auto-opening active mobile submenu for: ${parentToggle?.textContent.trim()}`);
                    }
                }
                currentElement = parentMenuItem.parentElement; // Di chuyển lên cây DOM để tìm cha tiếp theo
            } else {
                // Nếu không tìm thấy menu item cha, di chuyển lên bình thường
                currentElement = currentElement.parentElement;
            }
        }
    } else {
        console.log("DEBUG: No suitable active link found.");
    }
}


/**
 * Khởi tạo logic cho sticky navbar (ẩn khi cuộn xuống, hiện khi cuộn lên).
 * @param {HTMLElement} navbarElement Phần tử header (navbar).
 */
function initializeStickyNavbar(navbarElement) {
    if (!navbarElement) {
        console.warn("DEBUG: Navbar element not provided for sticky behavior.");
        return;
    }
    console.log("DEBUG: Initializing sticky navbar behavior...");

    let lastScrollTop = 0;
    const scrollThreshold = 50; // Chỉ ẩn/hiện sau khi cuộn một khoảng nhất định

    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > navbarElement.offsetHeight) {
            // Scroll Down - Hide navbar
            navbarElement.style.top = `-${navbarElement.offsetHeight}px`;
        } else {
            // Scroll Up or near top - Show navbar
            navbarElement.style.top = '0';
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, { passive: true }); // Sử dụng passive listener để tối ưu hiệu năng cuộn
}


// --- Chạy các hàm khởi tạo chính khi DOM sẵn sàng ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DEBUG: DOM fully loaded. Initializing components.");

    Promise.all([
        loadComponent('/header.html', 'header-placeholder'), // Đảm bảo đường dẫn đúng
        loadComponent('/footer.html', 'footer-placeholder')  // Đảm bảo đường dẫn đúng
    ]).then(([headerElement, footerElement]) => {
        console.log("DEBUG: Header and Footer loading promises resolved.");
        if (headerElement && headerElement.id === 'navbar') { // Kiểm tra header đã load đúng chưa
            initializeCombinedMenuEvents(); // Gọi hàm khởi tạo menu KẾT HỢP mới
        } else {
            console.error("DEBUG: Header component (#navbar) failed to load or missing ID. Menu events not initialized.");
        }
        // Có thể thêm khởi tạo cho footer nếu cần
        // if (footerElement) { ... }
    }).catch(error => {
        console.error("DEBUG: Critical error during component loading.", error);
    });

    console.log("DEBUG: Initial component setup sequence started.");
});
