/**
 * Hàm tải nội dung HTML từ một URL và chèn vào phần tử có ID chỉ định.
 * @param {string} url Đường dẫn tuyệt đối từ gốc đến file HTML (ví dụ: '/header.html').
 * @param {string} elementId ID của phần tử placeholder (ví dụ: 'header-placeholder').
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
        // Trả về phần tử header/footer thực sự bên trong placeholder để gắn sự kiện
        return element.querySelector('header, footer');
    } catch (error) {
        console.error(`DEBUG: Error loading ${elementId} from ${url}:`, error);
        element.innerHTML = `<div style="text-align: center; padding: 10px; color: red;">Lỗi tải ${elementId}.</div>`;
        throw error; // Ném lỗi ra ngoài để Promise.all biết
    }
}

/**
 * Khởi tạo các sự kiện cho menu (chủ yếu là mobile) sử dụng event delegation.
 */
function initializeMenuEventsDelegation() {
    console.log("DEBUG: Initializing menu events (mainly mobile)...");
    const headerPlaceholder = document.getElementById('header-placeholder');
    // Lấy phần tử header thực sự đã được load vào placeholder
    const headerElement = headerPlaceholder?.querySelector('header');
    let overlay = document.querySelector(".overlay"); // Tìm overlay trong toàn bộ document

    if (!headerElement) {
        console.error("DEBUG: Header content (<header>) not found inside #header-placeholder for delegation.");
        return;
    }
    // Đảm bảo overlay tồn tại
    if (!overlay) {
        console.warn("DEBUG: Overlay element (.overlay) not found. Creating one.");
        const newOverlay = document.createElement('div');
        newOverlay.className = 'overlay';
        document.body.appendChild(newOverlay);
        overlay = newOverlay;
    }

    // --- Mobile Menu Toggle (Delegated to placeholder) ---
    headerPlaceholder.addEventListener('click', function(event) {
        // Sử dụng headerElement (header thực sự) để tìm mobileMenu
        const mobileMenu = headerElement.querySelector(".mobile-menu");
        const hamburger = event.target.closest('.hamburger'); // Tìm nút hamburger được click

        if (hamburger && mobileMenu) {
            console.log("DEBUG: Hamburger clicked!");
            const isAlreadyActive = mobileMenu.classList.contains('active');
            if (!isAlreadyActive) {
                mobileMenu.classList.add('active');
                if (overlay) overlay.classList.add('active');
                document.body.classList.add('mobile-menu-active'); // Chặn scroll body
                hamburger.classList.add('is-active'); // Animation hamburger -> X
                hamburger.setAttribute('aria-expanded', 'true');
                console.log("DEBUG: Mobile menu opened.");
            } else {
                // Nếu đã active thì đóng lại (hành vi toggle)
                closeMobileMenu(mobileMenu, overlay, hamburger);
            }
        }
    });

    // --- Event Listener cho Mobile Menu Content (Close button, Links, Dropdowns) ---
    const mobileMenuElement = headerElement.querySelector(".mobile-menu");
    if (mobileMenuElement) {
        mobileMenuElement.addEventListener('click', function(event) {
            const closeMenuButton = event.target.closest('.close-menu');
            const link = event.target.closest('.mobile-nav-tabs a');
            const toggle = event.target.closest('.mobile-nav-tabs li > a.dropdown-toggle');
            const hamburgerButton = headerPlaceholder?.querySelector('.hamburger'); // Tìm lại hamburger

            // 1. Xử lý nút đóng
            if (closeMenuButton) {
                console.log("DEBUG: Close button clicked");
                closeMobileMenu(mobileMenuElement, overlay, hamburgerButton);
                return; // Dừng xử lý thêm
            }

            // 2. Xử lý click vào link không phải dropdown toggle (để đóng menu)
            if (link && !toggle && mobileMenuElement.classList.contains('active')) {
                console.log("DEBUG: Non-dropdown mobile link clicked, closing menu.");
                // Dùng setTimeout để cho phép trình duyệt bắt đầu điều hướng trước khi menu đóng
                setTimeout(() => closeMobileMenu(mobileMenuElement, overlay, hamburgerButton), 50);
                // Không return ở đây nếu link có href thực sự, để cho phép điều hướng
                if(link.getAttribute('href') === '#') {
                    event.preventDefault(); // Ngăn nhảy trang nếu chỉ là '#'
                }
                return; // Dừng xử lý dropdown nếu chỉ là link thường
            }

            // 3. Xử lý click vào dropdown toggle (Accordion)
            if (toggle) {
                console.log("--- Mobile Dropdown Click ---");
                console.log("DEBUG: Clicked Toggle:", toggle.textContent.trim());

                // Ngăn chặn điều hướng nếu là link #
                if (toggle.getAttribute('href') === '#') {
                    event.preventDefault();
                    console.log("DEBUG: Prevented default navigation for # link.");
                }

                const parentLi = toggle.closest('li.dropdown, li.dropdown-submenu');
                if (!parentLi) {
                    console.error("DEBUG: Could not find parent li for toggle:", toggle.textContent.trim());
                    return;
                }
                console.log("DEBUG: Parent li found:", parentLi);

                const subMenu = parentLi.querySelector(':scope > .dropdown-menu');
                if (!subMenu) {
                    console.error("DEBUG: Could not find submenu for toggle:", toggle.textContent.trim(), parentLi);
                    return;
                }
                console.log("DEBUG: Submenu found:", subMenu);

                const isActive = parentLi.classList.contains('active');
                console.log(`DEBUG: Current state for ${toggle.textContent.trim()}: ${isActive ? 'active' : 'inactive'}`);

                // --- Đóng các siblings cùng cấp ---
                const parentUl = parentLi.parentElement;
                if (parentUl) {
                    parentUl.querySelectorAll(':scope > li.active').forEach(li => {
                        if (li !== parentLi) {
                            const siblingToggle = li.querySelector(':scope > a.dropdown-toggle');
                            console.log("DEBUG: Closing sibling:", siblingToggle?.textContent.trim() || 'Unknown');
                            li.classList.remove('active');
                            const siblingSubMenu = li.querySelector(':scope > .dropdown-menu');
                            if (siblingSubMenu) {
                                siblingSubMenu.classList.remove('show');
                                siblingSubMenu.style.maxHeight = null; // Reset height ngay lập tức khi đóng
                            }
                            siblingToggle?.setAttribute('aria-expanded', 'false');
                        }
                    });
                } else {
                    console.warn("DEBUG: Could not find parent UL for sibling closing.");
                }
                // --- Kết thúc đóng siblings ---

                // --- Toggle mục hiện tại ---
                parentLi.classList.toggle('active', !isActive);
                toggle.setAttribute('aria-expanded', String(!isActive));

                if (!isActive) {
                    // --- Mở ---
                    console.log(`DEBUG: Opening submenu for ${toggle.textContent.trim()}`);
                    // Thêm class 'show' để nó có trong layout trước khi tính scrollHeight
                    subMenu.classList.add('show');
                    // Dùng setTimeout để đảm bảo 'show' được áp dụng trước khi tính scrollHeight
                    setTimeout(() => {
                        const scrollHeight = subMenu.scrollHeight;
                        console.log(`DEBUG: Calculated scrollHeight: ${scrollHeight}px`);
                        if (scrollHeight > 0) {
                            subMenu.style.maxHeight = scrollHeight + "px";
                            console.log(`DEBUG: Set max-height to ${scrollHeight}px`);
                        } else {
                            console.warn("DEBUG: scrollHeight is 0. Submenu might be empty or display:none.");
                            // Dự phòng nếu scrollHeight = 0 nhưng vẫn muốn mở
                            subMenu.style.maxHeight = "500px"; // Chiều cao đủ lớn
                        }
                    }, 10); // Delay nhỏ

                } else {
                    // --- Đóng ---
                    console.log(`DEBUG: Closing submenu for ${toggle.textContent.trim()}`);
                    // Đặt max-height về null/0 để bắt đầu transition đóng
                    subMenu.style.maxHeight = null;
                    // Lắng nghe sự kiện transition kết thúc để xóa class 'show'
                    // Thêm { once: true } để listener tự hủy sau khi chạy 1 lần
                    subMenu.addEventListener('transitionend', function handleTransitionEnd() {
                        // Chỉ xóa 'show' nếu nó vẫn đang trong trạng thái đóng (phòng trường hợp click nhanh)
                        if (!parentLi.classList.contains('active')) {
                            subMenu.classList.remove('show');
                            console.log(`DEBUG: Removed 'show' class after transition for ${toggle.textContent.trim()}`);
                        }
                         // Hủy listener sau khi chạy
                        subMenu.removeEventListener('transitionend', handleTransitionEnd);
                    });

                    // Dự phòng nếu transitionend không kích hoạt (ví dụ: không có transition CSS)
                    // Đặt thời gian dài hơn transition duration một chút (CSS là 0.35s = 350ms)
                    setTimeout(() => {
                        if (!parentLi.classList.contains('active')) {
                            subMenu.classList.remove('show');
                        }
                    }, 360);
                }
                console.log(`DEBUG: New state for ${toggle.textContent.trim()}: ${!isActive ? 'active' : 'inactive'}`);
                console.log("--- End Mobile Dropdown Click ---");
            }
        });
    } else {
         console.error("DEBUG: Mobile menu element (.mobile-menu) not found inside header content.");
    }

    // --- Event Listener cho Overlay Click ---
    if (overlay) {
        overlay.addEventListener('click', () => {
            console.log("DEBUG: Overlay clicked.");
            // Tìm lại mobileMenu và hamburger khi overlay được click
            const currentMobileMenu = headerElement?.querySelector(".mobile-menu");
            const currentHamburger = headerPlaceholder?.querySelector('.hamburger');
            closeMobileMenu(currentMobileMenu, overlay, currentHamburger);
        });
    }

    setActiveNavLink(); // Gọi hàm đánh dấu link active
    console.log("DEBUG: Menu events initialized (with hamburger animation toggle and improved accordion).");
}


/**
 * Hàm đóng menu mobile.
 * @param {HTMLElement|null} mobileMenu Phần tử menu mobile.
 * @param {HTMLElement|null} overlay Phần tử overlay.
 * @param {HTMLElement|null} hamburgerButton Nút hamburger (tùy chọn).
 */
function closeMobileMenu(mobileMenu, overlay, hamburgerButton = null) {
    // Nếu không truyền hamburgerButton, thử tìm lại trong placeholder
    if (!hamburgerButton) {
         const headerPlaceholder = document.getElementById('header-placeholder');
         hamburgerButton = headerPlaceholder?.querySelector('.hamburger');
    }

    if (mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        // Đóng tất cả submenu con khi đóng menu chính
        mobileMenu.querySelectorAll('.mobile-nav-tabs li.active').forEach(li => {
            li.classList.remove('active');
            const subMenu = li.querySelector(':scope > .dropdown-menu');
            if (subMenu) {
                subMenu.classList.remove('show');
                subMenu.style.maxHeight = null; // Reset max-height
            }
            li.querySelector(':scope > a.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
        });
        console.log("DEBUG: Mobile menu closed.");
    } else {
         console.log("DEBUG: closeMobileMenu called but menu was not active or not found.");
    }

    if(overlay) overlay.classList.remove('active');
    document.body.classList.remove('mobile-menu-active'); // Cho phép scroll lại

    if(hamburgerButton) {
        hamburgerButton.classList.remove('is-active'); // Reset animation hamburger
        hamburgerButton.setAttribute('aria-expanded', 'false');
    }
}


/**
 * Đánh dấu link điều hướng đang hoạt động dựa trên trang hiện tại.
 */
function setActiveNavLink() {
    const headerContent = document.querySelector('#header-placeholder header');
    if (!headerContent) {
        console.warn("DEBUG: Header content not found for setActiveNavLink.");
        return;
    }
    // Lấy tất cả link trong cả menu desktop và mobile (không phải dropdown toggle)
    const navLinks = headerContent.querySelectorAll('.nav-tabs a:not(.dropdown-toggle), .mobile-nav-tabs a:not(.dropdown-toggle)');
    let currentPath = window.location.pathname;

    // Chuẩn hóa currentPath
    // Nếu là index.html -> /
    if (currentPath.endsWith('/index.html')) {
        currentPath = currentPath.substring(0, currentPath.length - 'index.html'.length) || '/';
    }
    // Đảm bảo bắt đầu bằng /
    if (!currentPath.startsWith('/')) {
        currentPath = '/' + currentPath;
    }
    // Đảm bảo kết thúc bằng / nếu là thư mục (không có phần mở rộng file)
    if (currentPath !== '/' && !currentPath.endsWith('/') && !/\.[^/]+$/.test(currentPath)) {
        currentPath += '/';
    }
     // Trường hợp gốc "/"
     if (currentPath === '') {
         currentPath = '/';
     }


    console.log(`DEBUG: Current Path for Active Link: ${currentPath}`);

    let directMatchFound = false;

    // Xóa active class cũ
    navLinks.forEach(link => link.classList.remove('active'));
    headerContent.querySelectorAll('.nav-tabs > li > a.dropdown-toggle, .mobile-nav-tabs > li > a.dropdown-toggle').forEach(toggle => toggle.classList.remove('active'));

    // Tìm link khớp trực tiếp
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        // Bỏ qua link trống, #, link ngoài, mailto, tel
        if (!linkHref || linkHref === '#' || linkHref.startsWith('http') || linkHref.startsWith('mailto:') || linkHref.startsWith('tel:')) return;

        let normalizedLinkHref = linkHref;
        // Chuẩn hóa linkHref tương tự currentPath
        if (!normalizedLinkHref.startsWith('/')) {
             normalizedLinkHref = '/' + normalizedLinkHref;
        }
        if (normalizedLinkHref.endsWith('/index.html')) {
            normalizedLinkHref = normalizedLinkHref.substring(0, normalizedLinkHref.length - 'index.html'.length) || '/';
        }
        // Đảm bảo kết thúc bằng / nếu là thư mục
        if (normalizedLinkHref !== '/' && !normalizedLinkHref.endsWith('/') && !/\.[^/]+$/.test(normalizedLinkHref)) {
             normalizedLinkHref += '/';
        }
        // Trường hợp gốc "/"
        if (normalizedLinkHref === '') {
             normalizedLinkHref = '/';
        }


        // So sánh đã chuẩn hóa
        if (normalizedLinkHref === currentPath) {
            link.classList.add('active');
            directMatchFound = true;
            console.log(`DEBUG: Direct active link set for: ${linkHref} (Normalized: ${normalizedLinkHref})`);

            // Đánh dấu active cho toggle cha (nếu có)
            const parentDropdownLi = link.closest('.nav-tabs > li.dropdown, .mobile-nav-tabs > li.dropdown');
            parentDropdownLi?.querySelector(':scope > a.dropdown-toggle')?.classList.add('active');

            // Đánh dấu active cho submenu toggle cha (nếu có)
            const parentSubmenuLi = link.closest('.dropdown-submenu');
            if(parentSubmenuLi){
                 parentSubmenuLi.querySelector(':scope > a.dropdown-toggle')?.classList.add('active');
                 // Và cả toggle cấp cao nhất chứa submenu này
                 const topLevelParent = parentSubmenuLi.closest('.nav-tabs > li.dropdown, .mobile-nav-tabs > li.dropdown');
                 topLevelParent?.querySelector(':scope > a.dropdown-toggle')?.classList.add('active');
            }
        }
    });

    // Nếu không có khớp trực tiếp, thử tìm khớp cha
     if (!directMatchFound) {
         console.log("DEBUG: No direct match found, checking parent paths...");
         let bestMatchLength = 0;
         let bestMatchToggle = null;

         // Lấy tất cả toggle cấp 1 (desktop và mobile)
         const topLevelToggles = headerContent.querySelectorAll('.nav-tabs > li.dropdown > a.dropdown-toggle, .mobile-nav-tabs > li.dropdown > a.dropdown-toggle');

         topLevelToggles.forEach(toggle => {
             const parentLi = toggle.closest('li.dropdown');
             if (!parentLi) return;

             // Lấy tất cả link con trong dropdown của toggle này
             const childLinks = parentLi.querySelectorAll('.dropdown-menu a');

             childLinks.forEach(childLink => {
                 const linkHref = childLink.getAttribute('href');
                 if (!linkHref || linkHref === '#' || linkHref.startsWith('http') || linkHref.startsWith('mailto:') || linkHref.startsWith('tel:')) return;

                 let normalizedChildHref = linkHref;
                 // Chuẩn hóa link con
                 if (!normalizedChildHref.startsWith('/')) { normalizedChildHref = '/' + normalizedChildHref; }
                 if (normalizedChildHref.endsWith('/index.html')) { normalizedChildHref = normalizedChildHref.substring(0, normalizedChildHref.length - 'index.html'.length) || '/'; }
                 if (normalizedChildHref !== '/' && !normalizedChildHref.endsWith('/') && !/\.[^/]+$/.test(normalizedChildHref)) { normalizedChildHref += '/'; }
                  if (normalizedChildHref === '') normalizedChildHref = '/';

                 // Kiểm tra xem currentPath có bắt đầu bằng link con không
                 // và link con đó dài hơn bestMatch hiện tại
                 // và không phải trường hợp currentPath khác '/' nhưng link con là '/'
                 if (currentPath.startsWith(normalizedChildHref) && normalizedChildHref.length > bestMatchLength) {
                      if (!(currentPath !== '/' && normalizedChildHref === '/')) { // Tránh khớp cha là trang chủ khi đang ở trang con
                          bestMatchLength = normalizedChildHref.length;
                          bestMatchToggle = toggle;
                          console.log(`DEBUG: Potential parent match: ${toggle.textContent.trim()} based on child ${linkHref} (Normalized: ${normalizedChildHref})`);
                      }
                 }
             });
         });

         // Nếu tìm thấy toggle cha phù hợp nhất
         if (bestMatchToggle) {
             bestMatchToggle.classList.add('active');
             console.log(`DEBUG: Setting parent active based on best match: ${bestMatchToggle.textContent.trim()}`);
         }
         // Nếu không có khớp nào và đang ở trang chủ, đánh dấu HOME
         else if (currentPath === '/') {
              const homeLink = headerContent.querySelector('.nav-tabs a[href$="index.html"], .mobile-nav-tabs a[href$="index.html"], .nav-tabs a[href="/"], .mobile-nav-tabs a[href="/"]');
              homeLink?.classList.add('active');
              console.log("DEBUG: Setting HOME active for root path.");
         }
     }
}


/**
 * Khởi tạo đồng hồ đếm ngược và chuyển hướng (nếu có các phần tử).
 */
function startRedirectCountdown() {
    console.log("DEBUG: Attempting to start redirect countdown...");
    const redirectUrl = "https://facebook.com/hr.ivsacademy";
    const countdownDuration = 120; // 120 giây = 2 phút
    const redirectTimerContainer = document.getElementById('redirect-timer'); // Container chứa thông báo
    const cancelButton = document.getElementById("cancel-redirect"); // Nút hủy

    // Chỉ chạy nếu cả hai phần tử tồn tại
    if (redirectTimerContainer && cancelButton) {
        console.log("DEBUG: Redirect timer elements found.");
        const timerDisplayElement = redirectTimerContainer.querySelector('p'); // Phần tử <p> để hiển thị đếm ngược

        if (!timerDisplayElement) {
            console.error("DEBUG: Timer display element (<p>) inside #redirect-timer not found.");
            return; // Dừng nếu không tìm thấy chỗ hiển thị
        }

        redirectTimerContainer.style.display = 'block'; // Hiển thị container
        let timeLeft = countdownDuration;
        let redirectIntervalId = null; // Biến lưu ID của interval

        // Hàm cập nhật đồng hồ
        const updateTimer = () => {
            if (timeLeft <= 0) {
                clearInterval(redirectIntervalId); // Dừng đếm ngược
                console.log("DEBUG: Timer finished.");
                // Chỉ chuyển hướng nếu nút hủy chưa được nhấn
                if (!cancelButton.disabled) {
                    console.log(`DEBUG: Redirecting to ${redirectUrl}`);
                    try {
                        window.location.href = redirectUrl; // Thực hiện chuyển hướng
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
                // Cập nhật nội dung hiển thị
                timerDisplayElement.textContent = `Website sẽ tự động chuyển đến Fanpage IVS Academy trong ${minutes} phút ${seconds < 10 ? '0' : ''}${seconds} giây...`;
                timeLeft--; // Giảm thời gian
            }
        };

        updateTimer(); // Chạy lần đầu để hiển thị ngay
        redirectIntervalId = setInterval(updateTimer, 1000); // Bắt đầu đếm ngược mỗi giây
        console.log("DEBUG: Redirect timer started with interval ID:", redirectIntervalId);

        // Thêm sự kiện cho nút hủy
        // { once: true } để sự kiện chỉ chạy 1 lần
        cancelButton.addEventListener("click", () => {
            clearInterval(redirectIntervalId); // Dừng đếm ngược
            cancelButton.textContent = "Đã hủy chuyển hướng"; // Đổi chữ trên nút
            cancelButton.disabled = true; // Vô hiệu hóa nút
            timerDisplayElement.textContent = "Chuyển hướng đã bị hủy."; // Cập nhật thông báo
            console.log("DEBUG: Redirect cancelled by user.");
        }, { once: true });

    } else {
        // Ghi log nếu không tìm thấy phần tử
        if (!redirectTimerContainer) console.log("DEBUG: Redirect timer container (#redirect-timer) not found.");
        if (!cancelButton) console.log("DEBUG: Cancel redirect button (#cancel-redirect) not found.");
        console.log("DEBUG: Redirect countdown initialization skipped.");
    }
}


/**
 * Tải và hiển thị các bài viết (Tin nổi bật) từ posts.json.
 */
async function loadLatestPosts() {
    const postsContainer = document.getElementById('latest-posts-container');
    if (!postsContainer) {
        console.log("DEBUG: #latest-posts-container not found, skipping post loading.");
        return;
    }
    console.log("DEBUG: Loading latest posts...");

    // Hiển thị trạng thái đang tải
    postsContainer.innerHTML = '<p style="text-align:center; padding: 20px; color: var(--text-light);">Đang tải bài viết...</p>';

    try {
        // Lấy dữ liệu từ file JSON (đảm bảo đường dẫn đúng)
        const response = await fetch('/posts.json'); // Sử dụng đường dẫn tuyệt đối từ gốc

        // Kiểm tra nếu fetch thất bại
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status} while fetching posts.json`);
        }

        const posts = await response.json();

        // Kiểm tra dữ liệu có phải là mảng không
        if (!Array.isArray(posts)) {
            throw new Error("Invalid format: posts.json did not return an array.");
        }

        // Xóa nội dung đang tải
        postsContainer.innerHTML = '';

        // Nếu không có bài viết nào
        if (posts.length === 0) {
            postsContainer.innerHTML = '<p class="no-posts" style="text-align: center; color: var(--text-light);">Chưa có tin nổi bật nào.</p>';
            return;
        }

        // Sắp xếp bài viết theo ngày giảm dần (mới nhất trước)
        // Thêm try-catch để xử lý ngày không hợp lệ
        posts.sort((a, b) => {
            try {
                // Đảm bảo cả a.date và b.date tồn tại trước khi tạo Date object
                const dateA = a.date ? new Date(a.date) : null;
                const dateB = b.date ? new Date(b.date) : null;
                if (dateA && dateB) {
                    return dateB - dateA; // Sắp xếp giảm dần
                } else if (dateA) {
                    return -1; // a có ngày, b không có -> a trước
                } else if (dateB) {
                    return 1; // b có ngày, a không có -> b trước
                } else {
                    return 0; // Cả hai không có ngày
                }
            } catch(e) {
                console.warn("Error comparing dates during sort:", a?.date, b?.date, e);
                return 0; // Không thay đổi thứ tự nếu lỗi
            }
        });


        // Chỉ lấy 3 bài mới nhất (hoặc ít hơn nếu không đủ)
        const latestPosts = posts.slice(0, 3);

        // Tạo và thêm phần tử HTML cho mỗi bài viết
        latestPosts.forEach(post => {
            // Kiểm tra post có hợp lệ không trước khi tạo element
            if (post && typeof post === 'object' && post.title && post.url) {
                postsContainer.appendChild(createPostElement(post));
            } else {
                console.warn("DEBUG: Skipping invalid/incomplete post data in posts.json:", post);
            }
        });

        console.log("DEBUG: Latest posts loaded and displayed.");

    } catch (error) {
        console.error('DEBUG: Error loading or processing latest posts:', error);
        // Hiển thị lỗi cho người dùng
        postsContainer.innerHTML = `<p class="error" style="text-align: center; color: red;">Không thể tải tin nổi bật. Vui lòng kiểm tra lại file posts.json hoặc đường dẫn.</p>`;
    }
}


/**
 * Tạo phần tử HTML cho một bài viết.
 * @param {object} post Đối tượng bài viết chứa title, url, image, excerpt, date.
 * @returns {HTMLElement} Phần tử div chứa thông tin bài viết.
 */
function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post-card card'; // Sử dụng class card chung

    // Ảnh fallback nếu ảnh gốc lỗi hoặc không có
    const fallbackImage = 'https://placehold.co/600x400/eee/ccc?text=IVS+Post';
    // Đảm bảo đường dẫn ảnh đúng (thêm / nếu cần)
    const imageUrl = post.image ? (post.image.startsWith('/') ? post.image : '/' + post.image) : fallbackImage;
    // Đảm bảo đường dẫn URL đúng
    const postUrl = post.url ? (post.url.startsWith('/') || post.url.startsWith('http') ? post.url : '/' + post.url) : '#';

    const title = post.title || 'Tiêu đề bài viết'; // Tiêu đề mặc định
    const excerpt = post.excerpt || 'Nội dung tóm tắt...'; // Nội dung mặc định

    // Định dạng ngày tháng (thêm try-catch để an toàn)
    let postDate = 'Không rõ';
    try {
        if (post.date) {
            postDate = new Date(post.date).toLocaleDateString('vi-VN', {
                day: '2-digit', month: '2-digit', year: 'numeric'
            });
        }
    } catch (e) {
        console.warn("DEBUG: Invalid date format for post:", post.title, post.date, e);
    }


    postDiv.innerHTML = `
        <img src="${imageUrl}" alt="${title}" loading="lazy" onerror="this.onerror=null; this.src='${fallbackImage}';">
        <div class="post-content">
            <h3><a href="${postUrl}">${title}</a></h3>
            <p class="post-meta">Ngày đăng: ${postDate}</p>
            <p>${excerpt}</p>
            <a href="${postUrl}" class="read-more btn btn-primary btn-sm">Đọc thêm</a>
        </div>`;
    return postDiv;
}


// --- Chạy các hàm khởi tạo khi DOM sẵn sàng ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DEBUG: DOM fully loaded. Starting dynamic load setup.");

    // Đảm bảo overlay tồn tại trước khi gắn sự kiện
    if (!document.querySelector('.overlay')) {
        const overlayDiv = document.createElement('div');
        overlayDiv.className = 'overlay';
        document.body.appendChild(overlayDiv);
        console.log("DEBUG: Overlay element created dynamically.");
    }

    // Tải header và footer đồng thời
    Promise.all([
        loadComponent('/header.html', 'header-placeholder'),
        loadComponent('/footer.html', 'footer-placeholder')
    ]).then(([headerElement, footerElement]) => {
        console.log("DEBUG: Header and Footer loading promises resolved.");
        // Chỉ khởi tạo menu nếu header đã được tải thành công
        if (headerElement) {
             initializeMenuEventsDelegation(); // Khởi tạo sự kiện menu sau khi header load xong
        } else {
            console.error("DEBUG: Header component failed to load or returned null, cannot initialize menu.");
        }
        // Có thể thêm xử lý khác sau khi footer load xong nếu cần
        // if (footerElement) { ... }

    }).catch(error => {
        // Xử lý lỗi nghiêm trọng nếu không tải được header/footer
        console.error("DEBUG: Critical error during component loading. Menu or other features might be broken.", error);
    });

    // Tải các phần khác không phụ thuộc header/footer
    loadLatestPosts();
    startRedirectCountdown(); // Nếu trang có phần tử đếm ngược

    console.log("DEBUG: Initial dynamic load setup sequence started.");
});
``