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
        // Không ném lỗi ra ngoài nữa để Promise.all vẫn chạy tiếp nếu 1 cái lỗi
        // throw error;
        return null; // Trả về null nếu lỗi
    }
}

/**
 * Khởi tạo các sự kiện cho menu chính (mobile toggle và dropdowns).
 * Sử dụng cấu trúc HTML hợp nhất và event delegation.
 */
function initializeMainMenuEvents() {
    console.log("DEBUG: Initializing main menu events...");
    const headerPlaceholder = document.getElementById('header-placeholder');
    const headerElement = headerPlaceholder?.querySelector('header'); // Header thực sự
    const hamburger = headerElement?.querySelector('.hamburger'); // Nút burger
    const mainNav = headerElement?.querySelector('.main-navigation'); // Nav chính
    const overlay = document.querySelector('.overlay'); // Overlay chung

    if (!headerElement || !hamburger || !mainNav) {
        console.error("DEBUG: Header, hamburger, or main navigation element not found. Cannot initialize menu events.");
        return;
    }
     if (!overlay) {
         console.warn("DEBUG: Overlay element not found. Mobile menu closing via overlay might not work.");
     }

    // --- Mobile Menu Toggle (Hamburger Click) ---
    hamburger.addEventListener('click', (event) => {
        event.stopPropagation(); // Ngăn lan tỏa lên document click listener
        console.log("DEBUG: Hamburger clicked!");
        const isActive = mainNav.classList.contains('active');
        mainNav.classList.toggle('active', !isActive);
        hamburger.setAttribute('aria-expanded', String(!isActive));
        document.body.classList.toggle('mobile-menu-active', !isActive);
        if (overlay) overlay.classList.toggle('active', !isActive);

        // Đóng tất cả submenu khi đóng menu chính
        if (isActive) { // Nếu đang đóng menu (trạng thái trước đó là active)
             closeAllDropdownsWithin(mainNav);
        }
        console.log(`DEBUG: Main navigation toggled. Active: ${!isActive}`);
    });

    // --- Dropdown Toggle (Click on Toggle Link) ---
    // Sử dụng event delegation trên nav chính
    mainNav.addEventListener('click', function(event) {
        const toggleLink = event.target.closest('li.dropdown > a.dropdown-toggle, li.dropdown-submenu > a.dropdown-toggle');

        if (toggleLink) {
            event.preventDefault(); // Luôn ngăn chuyển trang khi click toggle
            event.stopPropagation(); // Ngăn lan tỏa lên document click listener
            console.log("--- Dropdown Toggle Click ---");
            console.log("DEBUG: Clicked Toggle:", toggleLink.textContent.trim());

            const parentLi = toggleLink.closest('li.dropdown, li.dropdown-submenu');
            if (!parentLi) {
                 console.error("DEBUG: Could not find parent li for toggle:", toggleLink.textContent.trim());
                 return;
            }

            const subMenu = parentLi.querySelector(':scope > .dropdown-menu');
            if (!subMenu) {
                console.error("DEBUG: Could not find submenu for toggle:", toggleLink.textContent.trim());
                return;
            }

            const isActive = parentLi.classList.contains('active');
            console.log(`DEBUG: Current state for ${toggleLink.textContent.trim()}: ${isActive ? 'active' : 'inactive'}`);

            // --- Đóng các siblings cùng cấp TRƯỚC KHI toggle mục hiện tại ---
            const parentUl = parentLi.parentElement;
            if (parentUl) {
                parentUl.querySelectorAll(':scope > li.active').forEach(li => {
                    if (li !== parentLi) {
                        closeSingleDropdown(li); // Dùng hàm trợ giúp để đóng
                    }
                });
            }

            // --- Toggle mục hiện tại ---
            parentLi.classList.toggle('active', !isActive);
            toggleLink.setAttribute('aria-expanded', String(!isActive));

            // Xử lý animation maxHeight cho mobile
            if (window.innerWidth < 768) { // Chỉ áp dụng cho mobile
                if (!isActive) { // Đang mở
                    subMenu.classList.add('show'); // Thêm show để tính scrollHeight
                     // Dùng setTimeout để đảm bảo trình duyệt cập nhật layout
                    setTimeout(() => {
                        const scrollHeight = subMenu.scrollHeight;
                        subMenu.style.maxHeight = scrollHeight + "px";
                        console.log(`DEBUG: Opening mobile submenu, set max-height: ${scrollHeight}px`);
                        // Lắng nghe transition kết thúc để có thể xóa maxHeight nếu cần (ít quan trọng khi mở)
                        // subMenu.addEventListener('transitionend', () => {
                        //     subMenu.style.maxHeight = ''; // Cho phép nội dung tự động giãn nở sau khi mở
                        // }, { once: true });
                    }, 10); // Delay nhỏ
                } else { // Đang đóng
                    subMenu.style.maxHeight = subMenu.scrollHeight + "px"; // Đảm bảo có maxHeight ban đầu
                    // Buộc reflow nhỏ trước khi đặt về 0
                    void subMenu.offsetWidth;
                    subMenu.style.maxHeight = "0"; // Bắt đầu transition đóng
                    console.log(`DEBUG: Closing mobile submenu, set max-height: 0`);
                    // Lắng nghe transition kết thúc để xóa class 'show'
                    removeShowClassAfterTransition(subMenu);
                }
            } else {
                 // Desktop chỉ cần toggle class 'active' trên li cha là đủ (CSS xử lý hiện/ẩn)
                 // Class 'show' không thực sự cần cho desktop nhưng có thể giữ để đồng bộ
                 subMenu.classList.toggle('show', !isActive);
            }
             console.log(`DEBUG: New state for ${toggleLink.textContent.trim()}: ${!isActive ? 'active' : 'inactive'}`);
             console.log("--- End Dropdown Toggle Click ---");
        }

        // --- Xử lý click vào link thường trong menu mobile (để đóng menu) ---
        const normalLink = event.target.closest('a:not(.dropdown-toggle)');
        if (window.innerWidth < 768 && normalLink && mainNav.classList.contains('active')) {
            const href = normalLink.getAttribute('href');
            // Chỉ đóng nếu link có href và không phải là link trống (#)
            if (href && href !== '#') {
                 console.log("DEBUG: Normal link clicked in active mobile menu, closing menu.");
                 // Dùng timeout nhỏ để trình duyệt có thời gian xử lý link
                 setTimeout(() => {
                     closeMobileNav(hamburger, mainNav, overlay);
                 }, 50);
            }
        }
    });

    // Handle dropdown toggle for mobile
    mainNav.addEventListener('click', function(event) {
        const toggleLink = event.target.closest('li.dropdown > a.dropdown-toggle, li.dropdown-submenu > a.dropdown-toggle');

        if (toggleLink) {
            event.preventDefault();
            const parentLi = toggleLink.closest('li.dropdown, li.dropdown-submenu');
            const subMenu = parentLi.querySelector(':scope > .dropdown-menu');

            if (window.innerWidth < 768) { // Only apply for mobile
                const isActive = parentLi.classList.contains('active');
                parentLi.classList.toggle('active', !isActive);

                if (!isActive) {
                    subMenu.style.maxHeight = subMenu.scrollHeight + "px"; // Expand menu
                } else {
                    subMenu.style.maxHeight = "0"; // Collapse menu
                }
            }
        }
    });

    // --- Đóng menu/dropdown khi click ra ngoài ---
    document.addEventListener('click', function(event) {
         // Nếu click bên ngoài header VÀ menu mobile đang mở -> đóng menu mobile
        if (headerElement && !headerElement.contains(event.target) && mainNav.classList.contains('active')) {
             console.log("DEBUG: Click outside header while mobile menu active. Closing mobile menu.");
             closeMobileNav(hamburger, mainNav, overlay);
        }
         // Nếu click bên ngoài một dropdown đang mở (trên desktop) -> đóng dropdown đó
         else if (headerElement && !headerElement.contains(event.target)) {
            console.log("DEBUG: Click outside header. Closing all dropdowns.");
            closeAllDropdownsWithin(mainNav);
         }
    });

     // --- Đóng menu mobile khi nhấn phím Esc ---
     document.addEventListener('keydown', function(event) {
         if (event.key === 'Escape' && mainNav.classList.contains('active')) {
             console.log("DEBUG: Escape key pressed. Closing mobile menu.");
             closeMobileNav(hamburger, mainNav, overlay);
         }
     });


    setActiveNavLink(); // Gọi hàm đánh dấu link active
    console.log("DEBUG: Main menu events initialized successfully.");
}

/**
 * Hàm đóng menu mobile chính.
 */
function closeMobileNav(hamburger, mainNav, overlay) {
    if (mainNav && mainNav.classList.contains('active')) {
        mainNav.classList.remove('active');
        if(hamburger) hamburger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('mobile-menu-active');
        if (overlay) overlay.classList.remove('active');
        closeAllDropdownsWithin(mainNav); // Đóng các submenu con
        console.log("DEBUG: Mobile navigation closed.");
    }
}

/**
 * Hàm đóng một dropdown cụ thể.
 * @param {HTMLElement} dropdownLi Phần tử li.dropdown hoặc li.dropdown-submenu cần đóng.
 */
function closeSingleDropdown(dropdownLi) {
    if (!dropdownLi || !dropdownLi.classList.contains('active')) return;

    dropdownLi.classList.remove('active');
    const toggle = dropdownLi.querySelector(':scope > a.dropdown-toggle');
    const subMenu = dropdownLi.querySelector(':scope > .dropdown-menu');

    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    if (subMenu) {
        subMenu.classList.remove('show'); // Có thể không cần thiết cho desktop
        if (window.innerWidth < 768) { // Reset maxHeight cho mobile
            subMenu.style.maxHeight = "0"; // Đóng ngay lập tức hoặc có transition nếu CSS định nghĩa
             // Vẫn nên gọi remove show sau transition để đảm bảo
             removeShowClassAfterTransition(subMenu);
        }
        // Đệ quy đóng các submenu con bên trong
        closeAllDropdownsWithin(subMenu);
    }
     console.log(`DEBUG: Closed single dropdown: ${toggle?.textContent.trim() || 'Unknown'}`);
}

/**
 * Hàm đóng tất cả các dropdown đang mở bên trong một phần tử cha.
 * @param {HTMLElement} parentElement Phần tử cha (ví dụ: nav.main-navigation hoặc ul.dropdown-menu).
 */
function closeAllDropdownsWithin(parentElement) {
    if (!parentElement) return;
    parentElement.querySelectorAll('.dropdown.active, .dropdown-submenu.active').forEach(li => {
        closeSingleDropdown(li);
    });
}


/**
 * Hàm trợ giúp để xóa class 'show' khỏi submenu sau khi transition đóng kết thúc.
 * @param {HTMLElement} subMenuElement Phần tử ul.dropdown-menu.
 */
function removeShowClassAfterTransition(subMenuElement) {
    const handleEnd = (event) => {
        // Chỉ xử lý khi transition của max-height kết thúc (quan trọng cho mobile)
        // Hoặc nếu không phải mobile, có thể xóa ngay hoặc dựa vào transition khác
        if (event.target === subMenuElement && (event.propertyName === 'max-height' || window.innerWidth >= 768)) {
            // Kiểm tra lại xem li cha có còn active không (phòng trường hợp click mở lại nhanh)
            const parentLi = subMenuElement.closest('li.dropdown, li.dropdown-submenu');
            if (!parentLi || !parentLi.classList.contains('active')) {
                subMenuElement.classList.remove('show');
                 console.log(`DEBUG: Removed 'show' class after transition for submenu.`);
            }
            subMenuElement.removeEventListener('transitionend', handleEnd); // Hủy listener
        }
    };
    // Hủy listener cũ trước khi thêm mới
    subMenuElement.removeEventListener('transitionend', handleEnd);
    subMenuElement.addEventListener('transitionend', handleEnd, { once: true }); // Tự hủy sau 1 lần chạy

     // Fallback timeout nếu transitionend không xảy ra
     setTimeout(() => {
         const parentLi = subMenuElement.closest('li.dropdown, li.dropdown-submenu');
         if (subMenuElement.classList.contains('show') && (!parentLi || !parentLi.classList.contains('active'))) {
             console.log(`DEBUG: Removing 'show' class via fallback timeout.`);
             subMenuElement.classList.remove('show');
             subMenuElement.removeEventListener('transitionend', handleEnd); // Hủy listener nếu còn
         }
     }, 500); // Thời gian chờ (phải lớn hơn transition duration)
}


/**
 * Đánh dấu link điều hướng đang hoạt động dựa trên trang hiện tại.
 * Cần được gọi sau khi header đã tải xong.
 */
function setActiveNavLink() {
    const headerContent = document.querySelector('#header-placeholder header');
    if (!headerContent) {
        console.warn("DEBUG: Header content not found for setActiveNavLink.");
        return;
    }
    // Lấy tất cả link trong nav chính (không phải toggle)
    const navLinks = headerContent.querySelectorAll('.main-navigation a:not(.dropdown-toggle)');
    let currentPath = window.location.pathname;
    let currentHref = window.location.href; // Dùng để so sánh cả query string/hash

    // --- Chuẩn hóa currentPath ---
    if (currentPath.endsWith('/index.html')) currentPath = currentPath.substring(0, currentPath.length - 'index.html'.length) || '/';
    if (!currentPath.startsWith('/')) currentPath = '/' + currentPath;
    // Không tự động thêm / cuối cho thư mục nữa, để khớp chính xác hơn
    // if (currentPath !== '/' && !currentPath.endsWith('/') && !/\.[^/]+$/.test(currentPath)) currentPath += '/';
    if (currentPath === '') currentPath = '/';
    console.log(`DEBUG: Current Path for Active Link: ${currentPath}, Current Href: ${currentHref}`);

    let bestMatchLink = null;
    let highestSpecificity = -1; // 0: Trang chủ, 1: Khớp path, 2: Khớp path + hash/query

    // Xóa active class cũ trên tất cả links và toggles trước khi đánh dấu lại
    headerContent.querySelectorAll('.main-navigation a').forEach(link => link.classList.remove('active'));

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (!linkHref || linkHref === '#' || linkHref.startsWith('mailto:') || linkHref.startsWith('tel:')) return;

        // Xử lý link tuyệt đối và tương đối
        const linkUrl = new URL(linkHref, window.location.origin); // Tạo URL đầy đủ
        let linkPath = linkUrl.pathname;
        const linkFullHref = linkUrl.href;

        // --- Chuẩn hóa linkPath ---
        if (linkPath.endsWith('/index.html')) linkPath = linkPath.substring(0, linkPath.length - 'index.html'.length) || '/';
        if (!linkPath.startsWith('/')) linkPath = '/' + linkPath;
        if (linkPath === '') linkPath = '/';

        let currentSpecificity = -1;

        // Ưu tiên khớp chính xác href (bao gồm query string và hash)
        if (linkFullHref === currentHref) {
            currentSpecificity = 2;
        }
        // Nếu không khớp href, kiểm tra khớp path
        else if (linkPath === currentPath) {
             // Nếu là trang chủ thì độ ưu tiên thấp hơn khớp path cụ thể
            currentSpecificity = (linkPath === '/') ? 0 : 1;
        }

        // Lưu lại link khớp tốt nhất
        if (currentSpecificity > highestSpecificity) {
            highestSpecificity = currentSpecificity;
            bestMatchLink = link;
             console.log(`DEBUG: New best match (Specificity ${currentSpecificity}): ${linkHref} (Path: ${linkPath})`);
        }
    });

    // Đánh dấu active cho link khớp nhất
    if (bestMatchLink) {
        bestMatchLink.classList.add('active');
        console.log(`DEBUG: Final active link set for: ${bestMatchLink.getAttribute('href')}`);

        // Đánh dấu active cho toggle cha (nếu có)
        const parentLi = bestMatchLink.closest('li.dropdown, li.dropdown-submenu');
        if (parentLi) {
            const parentToggle = parentLi.querySelector(':scope > a.dropdown-toggle');
            if(parentToggle) parentToggle.classList.add('active');

            // Nếu là submenu, đánh dấu cả toggle cấp cao nhất
            const topLevelParentLi = bestMatchLink.closest('.nav-tabs > li.dropdown');
             if (topLevelParentLi && topLevelParentLi !== parentLi) { // Đảm bảo không phải chính nó
                 const topLevelToggle = topLevelParentLi.querySelector(':scope > a.dropdown-toggle');
                 if(topLevelToggle) topLevelToggle.classList.add('active');
             }
        }
    } else {
         console.log("DEBUG: No suitable active link found.");
         // Có thể thêm logic đánh dấu active cho mục cha nếu không có con nào khớp chính xác
         // (Tương tự logic cũ nhưng phức tạp hơn, tạm bỏ qua)
    }
}


/**
 * Khởi tạo đồng hồ đếm ngược và chuyển hướng (nếu có các phần tử).
 * (Giữ nguyên logic từ file bạn cung cấp)
 */
function startRedirectCountdown() {
    console.log("DEBUG: Attempting to start redirect countdown...");
    const redirectUrl = "https://facebook.com/hr.ivsacademy";
    const countdownDuration = 120; // 120 giây = 2 phút
    const redirectTimerContainer = document.getElementById('redirect-timer');
    const cancelButton = document.getElementById("cancel-redirect");

    if (redirectTimerContainer && cancelButton) {
        console.log("DEBUG: Redirect timer elements found.");
        const timerDisplayElement = redirectTimerContainer.querySelector('p');

        if (!timerDisplayElement) {
            console.error("DEBUG: Timer display element (<p>) inside #redirect-timer not found.");
            return;
        }

        redirectTimerContainer.style.display = 'block';
        let timeLeft = countdownDuration;
        let redirectIntervalId = null;

        const updateTimer = () => {
            if (timeLeft <= 0) {
                clearInterval(redirectIntervalId);
                console.log("DEBUG: Timer finished.");
                if (!cancelButton.disabled) {
                    console.log(`DEBUG: Redirecting to ${redirectUrl}`);
                    try {
                        window.location.href = redirectUrl;
                    } catch (e) {
                        console.error("DEBUG: Redirect failed.", e);
                        timerDisplayElement.textContent = "Lỗi khi chuyển hướng.";
                    }
                } else {
                    console.log("DEBUG: Redirect cancelled, not redirecting.");
                }
            } else {
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                timerDisplayElement.textContent = `Website sẽ tự động chuyển đến Fanpage IVS Academy trong ${minutes} phút ${seconds < 10 ? '0' : ''}${seconds} giây...`;
                timeLeft--;
            }
        };

        updateTimer();
        redirectIntervalId = setInterval(updateTimer, 1000);
        console.log("DEBUG: Redirect timer started with interval ID:", redirectIntervalId);

        cancelButton.addEventListener("click", () => {
            clearInterval(redirectIntervalId);
            cancelButton.textContent = "Đã hủy chuyển hướng";
            cancelButton.disabled = true;
            timerDisplayElement.textContent = "Chuyển hướng đã bị hủy.";
            console.log("DEBUG: Redirect cancelled by user.");
        }, { once: true });

    } else {
        if (!redirectTimerContainer) console.log("DEBUG: Redirect timer container (#redirect-timer) not found.");
        if (!cancelButton) console.log("DEBUG: Cancel redirect button (#cancel-redirect) not found.");
        console.log("DEBUG: Redirect countdown initialization skipped.");
    }
}


/**
 * Tải và hiển thị các bài viết (Tin nổi bật) từ posts.json.
 * (Giữ nguyên logic từ file bạn cung cấp, có thể cần điều chỉnh selector nếu HTML thay đổi)
 */
async function loadLatestPosts() {
    // Giả sử container có id là 'latest-posts-container'
    const postsContainer = document.getElementById('latest-posts-container');
    if (!postsContainer) {
        // console.log("DEBUG: #latest-posts-container not found, skipping post loading.");
        return; // Thoát nhẹ nhàng nếu không có container
    }
    console.log("DEBUG: Loading latest posts...");
    postsContainer.innerHTML = '<p style="text-align:center; padding: 20px; color: var(--text-medium);">Đang tải bài viết...</p>';

    try {
        const response = await fetch('/posts.json'); // Đường dẫn từ gốc
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const posts = await response.json();
        if (!Array.isArray(posts)) throw new Error("Invalid format: posts.json did not return an array.");

        postsContainer.innerHTML = '';

        if (posts.length === 0) {
            postsContainer.innerHTML = '<p style="text-align: center; color: var(--text-medium);">Chưa có tin nổi bật nào.</p>';
            return;
        }

        // Sắp xếp và lấy 3 bài mới nhất (logic sắp xếp giữ nguyên)
         posts.sort((a, b) => {
             try {
                 const dateA = a && a.date ? new Date(a.date) : null;
                 const dateB = b && b.date ? new Date(b.date) : null;
                 const isValidDateA = dateA instanceof Date && !isNaN(dateA);
                 const isValidDateB = dateB instanceof Date && !isNaN(dateB);
                 if (isValidDateA && isValidDateB) return dateB - dateA;
                 else if (isValidDateA) return -1;
                 else if (isValidDateB) return 1;
                 else return 0;
             } catch(e) { return 0; }
         });
        const latestPosts = posts.slice(0, 3);

        // Tạo element (giữ nguyên hàm createPostElement)
        latestPosts.forEach(post => {
            if (post && typeof post === 'object' && post.title && post.url) {
                postsContainer.appendChild(createPostElement(post));
            } else {
                 console.warn("DEBUG: Skipping invalid post data:", post);
            }
        });
        console.log("DEBUG: Latest posts loaded.");

    } catch (error) {
        console.error('DEBUG: Error loading posts:', error);
        postsContainer.innerHTML = `<p style="text-align: center; color: red;">Không thể tải tin nổi bật.</p>`;
    }
}

/**
 * Tạo phần tử HTML cho một bài viết.
 * (Giữ nguyên logic từ file bạn cung cấp)
 * @param {object} post Đối tượng bài viết.
 * @returns {HTMLElement} Phần tử div.post-card.
 */
function createPostElement(post) {
    const postDiv = document.createElement('div');
    // Cần đảm bảo class 'post-card' và 'card' được định nghĩa trong CSS
    postDiv.className = 'post-card card bg-white rounded-lg shadow-md overflow-hidden';

    const fallbackImage = 'https://placehold.co/600x400/eee/ccc?text=IVS+Post';
    const imageUrl = post.image ? ((post.image.startsWith('/') || post.image.startsWith('http')) ? post.image : '/' + post.image) : fallbackImage;
    const postUrl = post.url ? ((post.url.startsWith('/') || post.url.startsWith('http')) ? post.url : '#') : '#';
    const title = post.title || 'Tiêu đề bài viết';
    const excerpt = post.excerpt || 'Nội dung tóm tắt...';
    let postDate = 'Không rõ';
    try {
        if (post.date) {
            const dateObj = new Date(post.date);
            if (dateObj instanceof Date && !isNaN(dateObj)) {
                postDate = dateObj.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
            }
        }
    } catch (e) { /* Ignore date formatting errors */ }

    postDiv.innerHTML = `
        <a href="${postUrl}" class="block hover:opacity-90 transition-opacity duration-300">
             <img src="${imageUrl}" alt="${title}" loading="lazy" class="w-full h-48 object-cover" onerror="this.onerror=null; this.src='${fallbackImage}';">
        </a>
        <div class="post-content p-4">
            <p class="post-meta text-sm text-gray-500 mb-1">Ngày đăng: ${postDate}</p>
            <h3 class="text-lg font-semibold mb-2 leading-tight"><a href="${postUrl}" class="text-gray-800 hover:text-primary-color transition-colors duration-300">${title}</a></h3>
            <p class="text-sm text-gray-600 mb-3">${excerpt}</p>
            <a href="${postUrl}" class="read-more text-sm text-primary-color hover:text-secondary-color font-medium transition-colors duration-300">Đọc thêm →</a>
        </div>`;
    return postDiv;
}


// --- Chạy các hàm khởi tạo chính khi DOM sẵn sàng ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DEBUG: DOM fully loaded. Initializing components.");

    // Đảm bảo overlay tồn tại (nếu cần dùng chung)
    if (!document.querySelector('.overlay')) {
        const overlayDiv = document.createElement('div');
        overlayDiv.className = 'overlay';
        // overlayDiv.style.display = 'none'; // Có thể ẩn ban đầu nếu CSS chưa xử lý
        document.body.appendChild(overlayDiv);
        console.log("DEBUG: Overlay element created dynamically.");
    }

    // Tải header và footer, sau đó khởi tạo menu
    Promise.all([
        loadComponent('/header.html','header-placeholder'), // Đảm bảo đường dẫn đúng
        loadComponent('/footer.html', 'footer-placeholder')  // Đảm bảo đường dẫn đúng
    ]).then(([headerElement, footerElement]) => {
        console.log("DEBUG: Header and Footer loading promises resolved.");
        // Khởi tạo menu chỉ khi headerElement tồn tại (load thành công)
        if (headerElement) {
            initializeMainMenuEvents();
        } else {
            console.error("DEBUG: Header component failed to load. Menu events not initialized.");
        }
    }).catch(error => {
        console.error("DEBUG: Critical error during component loading.", error);
    });

    // Khởi tạo các thành phần khác không phụ thuộc header/footer
    loadLatestPosts();
    startRedirectCountdown();

    console.log("DEBUG: Initial component setup sequence started.");
});
