// js/script.js

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
        element.innerHTML = data;
        console.log(`DEBUG: Component ${elementId} loaded successfully from ${url}.`);
        // Trả về phần tử header/footer thực sự bên trong placeholder
        return element.querySelector('header, footer');
    } catch (error) {
        console.error(`DEBUG: Error loading ${elementId} from ${url}:`, error);
        element.innerHTML = `<div style="text-align: center; padding: 10px; color: red;">Lỗi tải ${elementId}.</div>`;
        return null; // Trả về null nếu lỗi
    }
}


/**
 * Khởi tạo các sự kiện cho menu (phiên bản cho header dùng Tailwind).
 * Được gọi SAU KHI header đã được tải thành công.
 */
function initializeMenuEvents() {
    console.log("DEBUG: Initializing menu events (Tailwind version)...");
    const headerPlaceholder = document.getElementById('header-placeholder');
    const headerElement = headerPlaceholder?.querySelector('header'); // Header thực sự

    if (!headerElement) {
        console.error("DEBUG: Header element not found inside placeholder. Cannot initialize menu events.");
        return;
    }

    // --- Mobile Menu Toggle ---
    const mobileMenuButton = headerElement.querySelector('#mobile-menu-button');
    const mobileMenu = headerElement.querySelector('#mobile-menu');
    const menuIconOpen = headerElement.querySelector('#menu-icon-open');
    const menuIconClose = headerElement.querySelector('#menu-icon-close');

    if (mobileMenuButton && mobileMenu && menuIconOpen && menuIconClose) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden'); // Toggle hiển thị menu mobile
            menuIconOpen.classList.toggle('hidden'); // Toggle icon hamburger
            menuIconClose.classList.toggle('hidden'); // Toggle icon close
            document.body.classList.toggle('overflow-hidden', !mobileMenu.classList.contains('hidden')); // Ngăn cuộn body khi menu mở
            console.log(`DEBUG: Mobile menu toggled. Hidden: ${mobileMenu.classList.contains('hidden')}`);

            // Đóng tất cả submenu khi đóng menu chính
            if (mobileMenu.classList.contains('hidden')) {
                 closeAllMobileSubmenus(mobileMenu);
            }
        });
    } else {
        console.warn("DEBUG: Mobile menu toggle elements not found.");
    }

    // --- Mobile Submenu Toggle ---
    const mobileMenuItems = mobileMenu?.querySelectorAll('.mobile-menu-item'); // Lấy item trong mobile menu

    if (mobileMenuItems) {
        mobileMenuItems.forEach(item => {
            const button = item.querySelector(':scope > button'); // Nút để mở submenu (chỉ lấy nút con trực tiếp)
            const submenu = item.querySelector(':scope > .mobile-submenu'); // Nội dung submenu (chỉ lấy submenu con trực tiếp)

            if (button && submenu) {
                button.addEventListener('click', (event) => {
                    event.stopPropagation(); // Ngăn sự kiện lan tỏa

                    const isOpening = submenu.classList.contains('hidden');

                    // Đóng tất cả các submenu khác cùng cấp độ TRƯỚC KHI mở/đóng cái này
                    const parentContainer = item.parentElement;
                    if (parentContainer) {
                        const siblingItems = parentContainer.querySelectorAll(':scope > .mobile-menu-item');
                        siblingItems.forEach(sibling => {
                            if (sibling !== item) { // Chỉ đóng các item khác
                                const otherSubmenu = sibling.querySelector(':scope > .mobile-submenu');
                                if (otherSubmenu && !otherSubmenu.classList.contains('hidden')) {
                                    otherSubmenu.classList.add('hidden');
                                    sibling.classList.remove('open'); // Xóa class 'open' (dùng để xoay icon)
                                }
                            }
                        });
                    }

                    // Toggle submenu hiện tại
                    submenu.classList.toggle('hidden');
                    // Toggle class 'open' trên item cha để xoay icon (CSS xử lý)
                    item.classList.toggle('open', !submenu.classList.contains('hidden'));
                    console.log(`DEBUG: Toggled mobile submenu. Hidden: ${submenu.classList.contains('hidden')}`);

                     // Nếu đang đóng submenu cha, đóng luôn các submenu con cháu bên trong
                     if (submenu.classList.contains('hidden')) {
                        closeAllMobileSubmenus(submenu);
                     }
                });
            }
        });
    } else {
         console.warn("DEBUG: No mobile menu items found.");
    }

    // --- Desktop Submenu Hover (Đã xử lý bằng CSS :hover) ---
    // Chỉ cần đảm bảo cấu trúc HTML và CSS đúng

    // --- Đóng menu mobile khi click bên ngoài ---
    document.addEventListener('click', function(event) {
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            const isClickInsideHeader = headerElement.contains(event.target);

            if (!isClickInsideHeader) {
                mobileMenu.classList.add('hidden');
                menuIconOpen.classList.remove('hidden');
                menuIconClose.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
                closeAllMobileSubmenus(mobileMenu); // Đóng tất cả submenu khi đóng menu chính
                console.log("DEBUG: Clicked outside, closed mobile menu.");
            }
        }
    });

     // --- Đóng menu mobile khi nhấn phím Esc ---
     document.addEventListener('keydown', function(event) {
         if (event.key === 'Escape' && mobileMenu && !mobileMenu.classList.contains('hidden')) {
             mobileMenu.classList.add('hidden');
             menuIconOpen.classList.remove('hidden');
             menuIconClose.classList.add('hidden');
             document.body.classList.remove('overflow-hidden');
             closeAllMobileSubmenus(mobileMenu);
             console.log("DEBUG: Escape pressed, closed mobile menu.");
         }
     });

     // --- Active Menu Item Highlighting ---
     initializeActiveMenuHighlighting(); // Gọi hàm highlight

     console.log("DEBUG: Menu events initialized successfully (Tailwind version).");
}

/**
 * Hàm đóng tất cả các submenu mobile đang mở bên trong một phần tử cha.
 * @param {HTMLElement} parentElement Phần tử cha (ví dụ: #mobile-menu hoặc .mobile-submenu).
 */
function closeAllMobileSubmenus(parentElement) {
    if (!parentElement) return;
    const openSubmenus = parentElement.querySelectorAll('.mobile-submenu:not(.hidden)');
    openSubmenus.forEach(submenu => {
        submenu.classList.add('hidden');
        const parentItem = submenu.closest('.mobile-menu-item');
        if (parentItem) {
            parentItem.classList.remove('open');
        }
    });
     console.log(`DEBUG: Closed ${openSubmenus.length} mobile submenus within`, parentElement);
}


/**
 * Đánh dấu link điều hướng đang hoạt động (phiên bản cho header Tailwind).
 */
function initializeActiveMenuHighlighting() {
    console.log("DEBUG: Initializing active menu highlighting...");
    const headerPlaceholder = document.getElementById('header-placeholder');
    const headerElement = headerPlaceholder?.querySelector('header');
    if (!headerElement) {
        console.warn("DEBUG: Header element not found for active link highlighting.");
        return;
    }

    // Lấy đường dẫn trang hiện tại
    const currentPagePath = window.location.pathname;
    const currentHref = window.location.href; // Bao gồm cả hash và query params

    // Tìm tất cả các link trong menu (desktop và mobile, bao gồm cả submenus)
    const menuLinks = headerElement.querySelectorAll('nav a[href], #mobile-menu a[href]');

    // Xóa các lớp active cũ trước khi thêm mới
    menuLinks.forEach(link => {
       link.classList.remove('active-menu-item');
       // Tìm và xóa active khỏi nút cha (nếu có)
       const parentItem = link.closest('.main-menu-item, .mobile-menu-item, .sub-submenu-container');
       if (parentItem) {
           const parentButtonOrLink = parentItem.querySelector(':scope > button, :scope > a');
           if (parentButtonOrLink) {
               parentButtonOrLink.classList.remove('active-parent-item');
           }
       }
    });
     // Xóa active khỏi các li cha (mobile)
     const activeMobileItems = headerElement.querySelectorAll('#mobile-menu .mobile-menu-item.open');
     activeMobileItems.forEach(item => item.classList.remove('open'));


    let bestMatchLink = null;
    let highestSpecificity = -1; // -1: No match, 0: Path match (non-index), 1: Index path match, 2: Full href match

    menuLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (!linkHref || linkHref === '#') return; // Bỏ qua link trống

        // Tạo URL đầy đủ để so sánh chuẩn xác
        const linkUrl = new URL(linkHref, window.location.origin);
        const linkPath = linkUrl.pathname;
        const linkFullHref = linkUrl.href;

        let currentSpecificity = -1;

        // 1. Ưu tiên khớp chính xác href (cao nhất)
        if (linkFullHref === currentHref) {
            currentSpecificity = 2;
        }
        // 2. Khớp path (kiểm tra cả trường hợp / và /index.html)
        else {
             // Chuẩn hóa path (xóa index.html, đảm bảo có / ở đầu)
             const normalizePath = (path) => {
                 let p = path.endsWith('/index.html') ? path.substring(0, path.length - 'index.html'.length) : path;
                 if (p === '') p = '/';
                 return p;
             };
             const normalizedLinkPath = normalizePath(linkPath);
             const normalizedCurrentPath = normalizePath(currentPagePath);

             if (normalizedLinkPath === normalizedCurrentPath) {
                  // Ưu tiên khớp trang chủ hơn một chút nếu đang ở trang chủ
                 currentSpecificity = (normalizedCurrentPath === '/') ? 1 : 0;
             }
        }


        // Lưu lại link khớp tốt nhất
        if (currentSpecificity > highestSpecificity) {
            highestSpecificity = currentSpecificity;
            bestMatchLink = link;
            console.log(`DEBUG: New best match (Specificity ${currentSpecificity}): ${linkHref}`);
        }
    });

    // Đánh dấu active cho link khớp nhất và các mục cha
    if (bestMatchLink) {
        bestMatchLink.classList.add('active-menu-item'); // Highlight link trực tiếp
        console.log(`DEBUG: Final active link set for: ${bestMatchLink.getAttribute('href')}`);

        // Đánh dấu active cho các mục cha chứa nó
        let currentElement = bestMatchLink;
        while (currentElement && currentElement !== headerElement) {
             const parentMenuItem = currentElement.closest('.main-menu-item, .mobile-menu-item, .sub-submenu-container');
             if (parentMenuItem) {
                 const parentButtonOrLink = parentMenuItem.querySelector(':scope > button, :scope > a');
                 if (parentButtonOrLink) {
                     parentButtonOrLink.classList.add('active-parent-item'); // Highlight nút/link cha
                 }
                 // Nếu là mobile item, thêm class 'open' để mở submenu cha nếu cần
                 if (parentMenuItem.classList.contains('mobile-menu-item')) {
                      parentMenuItem.classList.add('open'); // Đảm bảo mục cha mở
                      const parentSubmenu = parentMenuItem.querySelector(':scope > .mobile-submenu');
                      if(parentSubmenu) parentSubmenu.classList.remove('hidden'); // Mở submenu chứa nó
                 }
                 currentElement = parentMenuItem; // Di chuyển lên cấp cha tiếp theo
             } else {
                 currentElement = currentElement.parentElement; // Di chuyển lên nếu không tìm thấy item menu
             }
        }
    } else {
        console.log("DEBUG: No suitable active link found.");
    }
}

// --- Chạy các hàm khởi tạo chính khi DOM sẵn sàng ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DEBUG: DOM fully loaded. Initializing components.");

    // Tải header và footer, sau đó khởi tạo menu
    Promise.all([
        loadComponent('/header.html','header-placeholder'), // Đảm bảo đường dẫn đúng từ gốc site
        loadComponent('/footer.html', 'footer-placeholder')  // Đảm bảo đường dẫn đúng từ gốc site
    ]).then(([headerElement, footerElement]) => {
        console.log("DEBUG: Header and Footer loading promises resolved.");
        // Khởi tạo menu chỉ khi headerElement tồn tại (load thành công)
        if (headerElement) {
            // Quan trọng: Khởi tạo menu events SAU KHI header đã được tải vào DOM
            initializeMenuEvents(); // Gọi hàm khởi tạo menu mới
        } else {
            console.error("DEBUG: Header component failed to load. Menu events not initialized.");
        }
    }).catch(error => {
        console.error("DEBUG: Critical error during component loading.", error);
    });

    // Các hàm khởi tạo khác (nếu có và không phụ thuộc header/footer) có thể đặt ở đây
    // Ví dụ: startRedirectCountdown();
    // Ví dụ: loadLatestPosts(); // Nếu loadNews trong index.html xử lý rồi thì không cần gọi ở đây

    console.log("DEBUG: Initial component setup sequence started.");
});
