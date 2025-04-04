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
        return element.querySelector('header, footer');
    } catch (error) {
        console.error(`DEBUG: Error loading ${elementId} from ${url}:`, error);
        element.innerHTML = `<div style="text-align: center; padding: 10px; color: red;">Lỗi tải ${elementId}.</div>`;
        return null;
    }
}


/**
 * Khởi tạo các sự kiện cho menu (phiên bản cho header dùng Tailwind - Tối ưu Mobile Animation).
 * Được gọi SAU KHI header đã được tải thành công.
 */
function initializeMenuEvents() {
    console.log("DEBUG: Initializing menu events (Tailwind version - Mobile Optimized)...");
    const headerPlaceholder = document.getElementById('header-placeholder');
    const headerElement = headerPlaceholder?.querySelector('header');

    if (!headerElement) {
        console.error("DEBUG: Header element not found inside placeholder. Cannot initialize menu events.");
        return;
    }

    // --- Mobile Menu Toggle (Main Menu) ---
    const mobileMenuButton = headerElement.querySelector('#mobile-menu-button');
    const mobileMenu = headerElement.querySelector('#mobile-menu');
    const menuIconOpen = headerElement.querySelector('#menu-icon-open');
    const menuIconClose = headerElement.querySelector('#menu-icon-close');

    if (mobileMenuButton && mobileMenu && menuIconOpen && menuIconClose) {
        mobileMenuButton.addEventListener('click', () => {
            const isOpening = mobileMenu.classList.contains('hidden'); // Kiểm tra trạng thái trước khi toggle

            mobileMenu.classList.toggle('hidden');
            menuIconOpen.classList.toggle('hidden');
            menuIconClose.classList.toggle('hidden');
            document.body.classList.toggle('overflow-hidden', !mobileMenu.classList.contains('hidden'));
            console.log(`DEBUG: Mobile menu toggled. Hidden: ${mobileMenu.classList.contains('hidden')}`);

            // Đóng tất cả submenu khi đóng menu chính
            if (!isOpening) { // Nếu đang đóng menu
                 closeAllMobileSubmenus(mobileMenu);
            }
        });
    } else {
        console.warn("DEBUG: Mobile menu toggle elements not found.");
    }

    // --- Mobile Submenu Toggle (With Animation) ---
    const mobileMenuItems = mobileMenu?.querySelectorAll('.mobile-menu-item');

    if (mobileMenuItems) {
        mobileMenuItems.forEach(item => {
            const button = item.querySelector(':scope > button');
            const submenu = item.querySelector(':scope > .mobile-submenu');

            if (button && submenu) {
                // Đặt trạng thái ban đầu cho transition (ẩn và maxHeight = 0)
                if (!submenu.classList.contains('submenu-initialized')) {
                    submenu.style.maxHeight = '0';
                    submenu.classList.add('hidden'); // Thêm hidden ban đầu để đảm bảo ẩn hoàn toàn
                    submenu.classList.add('submenu-initialized'); // Đánh dấu đã khởi tạo
                }

                button.addEventListener('click', (event) => {
                    event.stopPropagation();

                    const isOpening = submenu.classList.contains('hidden');

                    // --- Đóng các siblings cùng cấp TRƯỚC KHI toggle mục hiện tại ---
                    const parentContainer = item.parentElement;
                    if (parentContainer) {
                        const siblingItems = parentContainer.querySelectorAll(':scope > .mobile-menu-item');
                        siblingItems.forEach(sibling => {
                            if (sibling !== item) {
                                const otherSubmenu = sibling.querySelector(':scope > .mobile-submenu');
                                if (otherSubmenu && !otherSubmenu.classList.contains('hidden')) {
                                    closeSingleMobileSubmenu(sibling, otherSubmenu); // Dùng hàm đóng riêng lẻ
                                }
                            }
                        });
                    }

                    // --- Toggle submenu hiện tại ---
                    if (isOpening) {
                        // Mở submenu
                        submenu.classList.remove('hidden'); // Bỏ hidden để tính scrollHeight
                        // Đặt maxHeight để bắt đầu animation
                        // Dùng requestAnimationFrame để đảm bảo trình duyệt đã bỏ class 'hidden'
                        requestAnimationFrame(() => {
                            submenu.style.maxHeight = submenu.scrollHeight + "px";
                            item.classList.add('open'); // Xoay icon
                            console.log(`DEBUG: Opening mobile submenu, set max-height: ${submenu.scrollHeight}px`);
                            // Lắng nghe transition kết thúc để xóa maxHeight (cho phép nội dung tự giãn nở nếu cần)
                            submenu.addEventListener('transitionend', function handler() {
                                submenu.style.maxHeight = ''; // Xóa maxHeight sau khi mở xong
                                submenu.removeEventListener('transitionend', handler);
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
         console.warn("DEBUG: No mobile menu items found.");
    }

    // --- Desktop Submenu Hover ---
    // (CSS xử lý)

    // --- Đóng menu mobile khi click bên ngoài ---
    document.addEventListener('click', function(event) {
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            const isClickInsideHeader = headerElement.contains(event.target);
            if (!isClickInsideHeader) {
                mobileMenu.classList.add('hidden');
                menuIconOpen.classList.remove('hidden');
                menuIconClose.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
                closeAllMobileSubmenus(mobileMenu);
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
     initializeActiveMenuHighlighting();

     console.log("DEBUG: Menu events initialized successfully (Tailwind version - Mobile Optimized).");
}

/**
 * Hàm đóng một submenu mobile cụ thể với animation.
 * @param {HTMLElement} item - Phần tử .mobile-menu-item cha.
 * @param {HTMLElement} submenu - Phần tử .mobile-submenu cần đóng.
 */
function closeSingleMobileSubmenu(item, submenu) {
    if (!item || !submenu || submenu.classList.contains('hidden')) return;

    console.log(`DEBUG: Closing mobile submenu...`);
    // Đặt lại maxHeight về giá trị hiện tại (scrollHeight) để bắt đầu transition về 0
    submenu.style.maxHeight = submenu.scrollHeight + "px";
    item.classList.remove('open'); // Xoay icon lại

    // Buộc reflow nhỏ để trình duyệt nhận giá trị maxHeight mới trước khi đặt về 0
    requestAnimationFrame(() => {
        submenu.style.maxHeight = '0';
    });


    // Lắng nghe transition kết thúc để thêm lại class 'hidden'
    // và đóng các submenu con bên trong nếu có
    submenu.addEventListener('transitionend', function handler() {
        submenu.classList.add('hidden'); // Thêm hidden sau khi đóng xong
        closeAllMobileSubmenus(submenu); // Đóng các cấp con bên trong
        submenu.removeEventListener('transitionend', handler);
        console.log(`DEBUG: Finished closing mobile submenu, added 'hidden'.`);
    }, { once: true });

     // Fallback nếu transitionend không kích hoạt
     setTimeout(() => {
         if (!submenu.classList.contains('hidden') && !item.classList.contains('open')) {
            console.log("DEBUG: Closing mobile submenu via fallback timeout.");
            submenu.classList.add('hidden');
            closeAllMobileSubmenus(submenu);
            submenu.removeEventListener('transitionend', handler); // Hủy listener nếu còn
         }
     }, 400); // Thời gian nên lớn hơn transition duration một chút
}


/**
 * Hàm đóng tất cả các submenu mobile đang mở bên trong một phần tử cha (kể cả con cháu).
 * @param {HTMLElement} parentElement Phần tử cha.
 */
function closeAllMobileSubmenus(parentElement) {
    if (!parentElement) return;
    const openItems = parentElement.querySelectorAll('.mobile-menu-item.open');
    openItems.forEach(item => {
        const submenu = item.querySelector(':scope > .mobile-submenu');
        if (submenu) {
            closeSingleMobileSubmenu(item, submenu);
        } else {
             // Nếu không có submenu trực tiếp, chỉ xóa class open
             item.classList.remove('open');
        }
    });
    console.log(`DEBUG: Closed ${openItems.length} open mobile menu items within`, parentElement);
}


/**
 * Đánh dấu link điều hướng đang hoạt động (giữ nguyên logic khớp link).
 */
function initializeActiveMenuHighlighting() {
    console.log("DEBUG: Initializing active menu highlighting...");
    const headerPlaceholder = document.getElementById('header-placeholder');
    const headerElement = headerPlaceholder?.querySelector('header');
    if (!headerElement) {
        console.warn("DEBUG: Header element not found for active link highlighting.");
        return;
    }

    const currentPagePath = window.location.pathname;
    const currentHref = window.location.href;
    const menuLinks = headerElement.querySelectorAll('nav a[href], #mobile-menu a[href]');

    // Xóa active cũ
    menuLinks.forEach(link => {
       link.classList.remove('active-menu-item');
       const parentItem = link.closest('.main-menu-item, .mobile-menu-item, .sub-submenu-container');
       if (parentItem) {
           const parentButtonOrLink = parentItem.querySelector(':scope > button, :scope > a');
           if (parentButtonOrLink) {
               parentButtonOrLink.classList.remove('active-parent-item');
           }
           // Xóa class 'open' khỏi mobile item nếu không phải active
           if (parentItem.classList.contains('mobile-menu-item')) {
               // Sẽ được thêm lại nếu cần ở bước sau
               // parentItem.classList.remove('open');
           }
       }
    });
     // Xóa active khỏi các li cha (mobile) - Cẩn thận hơn, chỉ xóa nếu không có con active
     const activeMobileItems = headerElement.querySelectorAll('#mobile-menu .mobile-menu-item.open');
     activeMobileItems.forEach(item => {
        // Tạm thời không xóa 'open' ở đây, để logic highlight xử lý
        // item.classList.remove('open');
     });


    let bestMatchLink = null;
    let highestSpecificity = -1;

    menuLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (!linkHref || linkHref === '#') return;

        const linkUrl = new URL(linkHref, window.location.origin);
        const linkPath = linkUrl.pathname;
        const linkFullHref = linkUrl.href;
        let currentSpecificity = -1;

        if (linkFullHref === currentHref) {
            currentSpecificity = 2;
        } else {
             const normalizePath = (path) => {
                 let p = path.endsWith('/index.html') ? path.substring(0, path.length - 'index.html'.length) : path;
                 if (p === '') p = '/';
                 return p;
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
        }
    });

    if (bestMatchLink) {
        bestMatchLink.classList.add('active-menu-item');
        console.log(`DEBUG: Final active link set for: ${bestMatchLink.getAttribute('href')}`);

        let currentElement = bestMatchLink;
        while (currentElement && currentElement !== headerElement) {
             const parentMenuItem = currentElement.closest('.main-menu-item, .mobile-menu-item, .sub-submenu-container');
             if (parentMenuItem) {
                 const parentButtonOrLink = parentMenuItem.querySelector(':scope > button, :scope > a');
                 if (parentButtonOrLink) {
                     parentButtonOrLink.classList.add('active-parent-item');
                 }
                 // Nếu là mobile item và chứa link active, đảm bảo nó mở
                 if (parentMenuItem.classList.contains('mobile-menu-item')) {
                      parentMenuItem.classList.add('open'); // Thêm class open để xoay icon
                      const parentSubmenu = parentMenuItem.querySelector(':scope > .mobile-submenu');
                      if(parentSubmenu) {
                          // Mở submenu bằng cách bỏ hidden và đặt maxHeight
                          // (Cần đảm bảo nó không bị đóng lại bởi logic khác)
                          parentSubmenu.classList.remove('hidden');
                          // Đặt lại maxHeight nếu cần (có thể không cần nếu CSS không có transition)
                          // Hoặc nếu có transition, đặt thành 'auto' hoặc giá trị lớn
                          // parentSubmenu.style.maxHeight = parentSubmenu.scrollHeight + 'px'; // Mở ngay lập tức
                          parentSubmenu.style.maxHeight = ''; // Cho phép chiều cao tự nhiên
                          console.log(`DEBUG: Auto-opening active mobile submenu for: ${parentButtonOrLink?.textContent.trim()}`);
                      }
                 }
                 currentElement = parentMenuItem;
             } else {
                 currentElement = currentElement.parentElement;
             }
        }
    } else {
        console.log("DEBUG: No suitable active link found.");
    }
}


// --- Chạy các hàm khởi tạo chính khi DOM sẵn sàng ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DEBUG: DOM fully loaded. Initializing components.");

    Promise.all([
        loadComponent('/header.html','header-placeholder'),
        loadComponent('/footer.html', 'footer-placeholder')
    ]).then(([headerElement, footerElement]) => {
        console.log("DEBUG: Header and Footer loading promises resolved.");
        if (headerElement) {
            initializeMenuEvents(); // Gọi hàm khởi tạo menu mới
        } else {
            console.error("DEBUG: Header component failed to load. Menu events not initialized.");
        }
    }).catch(error => {
        console.error("DEBUG: Critical error during component loading.", error);
    });

    console.log("DEBUG: Initial component setup sequence started.");
});
