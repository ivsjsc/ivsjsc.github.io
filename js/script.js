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
        return null; // Trả về null thay vì throw lỗi ngay lập tức
    }
    console.log(`DEBUG: Loading component ${url} into #${elementId}`);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            // Log lỗi chi tiết hơn
            console.error(`Failed to load ${url}. Status: ${response.status} ${response.statusText}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();
        element.innerHTML = data;
        console.log(`DEBUG: Component ${elementId} loaded successfully from ${url}.`);
        // Trả về phần tử con đầu tiên thực sự được chèn (thường là <header> hoặc <footer>)
        return element.firstElementChild || element;
    } catch (error) {
        console.error(`DEBUG: Error loading ${elementId} from ${url}:`, error);
        element.innerHTML = `<div style="text-align: center; padding: 10px; color: red;">Lỗi tải ${elementId}.</div>`;
        // Ném lỗi để Promise.all biết
        throw error;
    }
}

/**
 * Khởi tạo các sự kiện cho menu (chủ yếu là mobile) sử dụng event delegation.
 * Cần được gọi SAU KHI header đã được tải thành công.
 */
function initializeMenuEventsDelegation() {
    console.log("DEBUG: Initializing menu events (mainly mobile)...");
    const headerPlaceholder = document.getElementById('header-placeholder');
    // Nội dung thực sự của header (thẻ <header> hoặc thẻ div bao ngoài trong header.html)
    const headerElement = headerPlaceholder?.querySelector('header'); // Tìm thẻ header bên trong
    const overlay = document.querySelector(".overlay");

    if (!headerElement) {
        console.error("DEBUG: Header content (<header>) not found inside #header-placeholder for delegation.");
        return;
    }
    if (!overlay) {
        console.warn("DEBUG: Overlay element (.overlay) not found.");
    }

    // --- Mobile Menu Toggle (Delegated) ---
    // Gắn sự kiện vào placeholder để bắt cả nút hamburger
    headerPlaceholder.addEventListener('click', function(event) {
        const hamburger = event.target.closest('.hamburger');
        const mobileMenu = headerElement.querySelector(".mobile-menu"); // Tìm mobile menu bên trong nội dung header

        if (hamburger && mobileMenu) {
            console.log("DEBUG: Hamburger clicked!");
            mobileMenu.classList.add('active');
            if (overlay) overlay.classList.add('active');
            document.body.classList.add('mobile-menu-active'); // Thêm class vào body để có thể khóa cuộn trang bằng CSS
        }
    });

    // Gắn sự kiện đóng vào chính mobile menu (vì nút close nằm trong đó)
    const mobileMenuElement = headerElement.querySelector(".mobile-menu");
    if (mobileMenuElement) {
        mobileMenuElement.addEventListener('click', function(event) {
            const closeMenu = event.target.closest('.close-menu');
            if (closeMenu) {
                console.log("DEBUG: Close button clicked");
                closeMobileMenu(mobileMenuElement, overlay); // Đóng menu
            }

            // Đóng menu khi bấm link không phải dropdown trong mobile menu
            if (mobileMenuElement.classList.contains('active')) {
                const link = event.target.closest('.mobile-nav-tabs a');
                // Chỉ đóng nếu link không phải là toggle dropdown
                if (link && !link.classList.contains('dropdown-toggle')) {
                    console.log("DEBUG: Non-dropdown mobile link clicked");
                    closeMobileMenu(mobileMenuElement, overlay);
                }
            }
        });
    }

     // Đóng menu khi bấm overlay
     if(overlay) {
         overlay.addEventListener('click', () => closeMobileMenu(mobileMenuElement, overlay));
     }

    // --- Mobile Dropdown (Accordion - Delegated) ---
    if (mobileMenuElement) {
        mobileMenuElement.addEventListener('click', function(event) {
            const toggle = event.target.closest('.mobile-nav-tabs li > a.dropdown-toggle');
            if (!toggle) return; // Không phải toggle mobile dropdown thì dừng

            // Ngăn hành vi mặc định CHỈ khi là link # hoặc không có href
             // Nếu là link thật thì không ngăn, để nó điều hướng và menu sẽ tự đóng bởi logic ở trên
            if (toggle.getAttribute('href') === '#' || !toggle.getAttribute('href')) {
                event.preventDefault();
            } else {
                return; // Cho phép điều hướng nếu là link thật
            }


            const parentLi = toggle.closest('li.dropdown, li.dropdown-submenu');
            if (!parentLi) return;
            const subMenu = parentLi.querySelector(':scope > .dropdown-menu');
            if (!subMenu) return;

            const isActive = parentLi.classList.contains('active');

            // Đóng siblings cùng cấp (anh em ruột)
            const parentUl = parentLi.parentElement;
            parentUl.querySelectorAll(':scope > li.active').forEach(li => {
                if (li !== parentLi) { // Chỉ đóng những thằng khác, không đóng chính nó
                    li.classList.remove('active');
                    const siblingSubMenu = li.querySelector(':scope > .dropdown-menu');
                    if (siblingSubMenu) {
                         siblingSubMenu.classList.remove('show');
                         siblingSubMenu.style.maxHeight = null; // Reset max-height
                    }
                    li.querySelector(':scope > a.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current (mở hoặc đóng mục hiện tại)
            parentLi.classList.toggle('active', !isActive);
            subMenu.classList.toggle('show', !isActive);
            toggle.setAttribute('aria-expanded', String(!isActive));

            // Set max-height for CSS transition
             if (!isActive) {
                 // Mở menu: đặt max-height bằng chiều cao thực tế của nó
                 subMenu.style.maxHeight = subMenu.scrollHeight + "px";
             } else {
                 // Đóng menu: đặt max-height về 0 (hoặc null để CSS transition hoạt động)
                 subMenu.style.maxHeight = null;
             }

            console.log(`DEBUG: Toggled mobile dropdown for: ${toggle.textContent.trim()}. Active: ${!isActive}`);
        });
    }

    // --- Desktop Dropdown ---
    // Logic hover/focus giờ đây được xử lý chính bằng CSS trong styles.css
    // Không cần JS cho việc hiện/ẩn menu desktop nữa.

    // Cập nhật link active khi menu đã được tải
    setActiveNavLink();

    console.log("DEBUG: Menu events initialized.");
}

// Hàm đóng menu mobile (cần tham chiếu đến menu và overlay)
function closeMobileMenu(mobileMenu, overlay) {
    if(mobileMenu) mobileMenu.classList.remove('active');
    if(overlay) overlay.classList.remove('active');
    document.body.classList.remove('mobile-menu-active'); // Xóa class khỏi body
     // Đóng tất cả submenu mobile khi đóng menu chính
     mobileMenu?.querySelectorAll('.mobile-nav-tabs li.active').forEach(li => {
        li.classList.remove('active');
        const subMenu = li.querySelector(':scope > .dropdown-menu');
         if (subMenu) {
             subMenu.classList.remove('show');
             subMenu.style.maxHeight = null; // Reset max-height
         }
        li.querySelector(':scope > a.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
    });
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

    // Bao gồm cả link desktop và mobile, loại trừ các toggle dropdown
    const navLinks = headerContent.querySelectorAll('.nav-tabs a:not(.dropdown-toggle), .mobile-nav-tabs a:not(.dropdown-toggle)');
    let currentPath = window.location.pathname;

    // Chuẩn hóa currentPath
    if (currentPath.endsWith('/index.html')) {
        currentPath = currentPath.substring(0, currentPath.length - 'index.html'.length);
    }
    if (currentPath === '' || !currentPath.startsWith('/')) {
        currentPath = '/' + currentPath.replace(/^\/+/, ''); // Đảm bảo bắt đầu bằng /
    }
     // Đảm bảo thư mục gốc và các thư mục khác có dấu / cuối
    if (currentPath === '/') {
       // Giữ nguyên là /
    } else if (!currentPath.endsWith('/') && !currentPath.substring(currentPath.lastIndexOf('/') + 1).includes('.')) {
         currentPath += '/'; // Thêm / nếu là thư mục
    }


    console.log(`DEBUG: Current Path for Active Link: ${currentPath}`);

    let directMatchFound = false;

    // Xóa active cũ trước khi đặt mới
    navLinks.forEach(link => link.classList.remove('active'));
    headerContent.querySelectorAll('.nav-tabs > li > a.dropdown-toggle, .mobile-nav-tabs > li > a.dropdown-toggle').forEach(toggle => toggle.classList.remove('active'));


    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (!linkHref || linkHref === '#') return;

        // Chuẩn hóa link href
        let normalizedLinkHref = linkHref;
        if (!normalizedLinkHref.startsWith('/') && !normalizedLinkHref.startsWith('http')) {
             normalizedLinkHref = '/' + normalizedLinkHref; // Thêm / nếu là đường dẫn tương đối từ gốc
        }
         if (normalizedLinkHref.endsWith('/index.html')) {
            normalizedLinkHref = normalizedLinkHref.substring(0, normalizedLinkHref.length - 'index.html'.length);
        }
        if (normalizedLinkHref === '') {
             normalizedLinkHref = '/';
        } else if (!normalizedLinkHref.endsWith('/') && !normalizedLinkHref.substring(normalizedLinkHref.lastIndexOf('/') + 1).includes('.')) {
             normalizedLinkHref += '/';
        }

        // So sánh đường dẫn đã chuẩn hóa
        if (normalizedLinkHref === currentPath) {
            link.classList.add('active');
            directMatchFound = true;
            console.log(`DEBUG: Direct active link set for: ${linkHref} (Normalized: ${normalizedLinkHref})`);

            // Đánh dấu active cho menu cha (cả desktop và mobile)
            const parentDropdownLi = link.closest('.nav-tabs > li.dropdown, .mobile-nav-tabs > li.dropdown');
            if (parentDropdownLi) {
                parentDropdownLi.querySelector(':scope > a.dropdown-toggle')?.classList.add('active');
            }
            // Đánh dấu active cho menu cha cấp 2 (nếu có)
            const parentSubmenuLi = link.closest('.dropdown-submenu');
            if(parentSubmenuLi){
                 parentSubmenuLi.querySelector(':scope > a.dropdown-toggle')?.classList.add('active');
                 // Và cả menu cha cấp 1 của submenu đó
                 const topLevelParent = parentSubmenuLi.closest('.nav-tabs > li.dropdown, .mobile-nav-tabs > li.dropdown');
                 topLevelParent?.querySelector(':scope > a.dropdown-toggle')?.classList.add('active');
            }
        }
    });

     // Nếu không có link con nào khớp trực tiếp, thử khớp menu cha dựa trên phần đầu của path
     if (!directMatchFound) {
         console.log("DEBUG: No direct match found, checking parent paths...");
         let bestMatchLength = 0;
         let bestMatchToggle = null;

         // Chỉ kiểm tra các toggle cấp 1
         const topLevelToggles = headerContent.querySelectorAll('.nav-tabs > li.dropdown > a.dropdown-toggle, .mobile-nav-tabs > li.dropdown > a.dropdown-toggle');

         topLevelToggles.forEach(toggle => {
             const parentLi = toggle.closest('li.dropdown');
             const childLinks = parentLi.querySelectorAll('.dropdown-menu a'); // Lấy tất cả link con, kể cả trong submenu

             childLinks.forEach(childLink => {
                 const linkHref = childLink.getAttribute('href');
                 if (!linkHref || linkHref === '#' || linkHref.startsWith('http')) return; // Bỏ qua link ngoài

                 // Chuẩn hóa link con
                 let normalizedChildHref = linkHref;
                 if (!normalizedChildHref.startsWith('/')) {
                     normalizedChildHref = '/' + normalizedChildHref;
                 }
                  if (normalizedChildHref.endsWith('/index.html')) {
                     normalizedChildHref = normalizedChildHref.substring(0, normalizedChildHref.length - 'index.html'.length);
                 }
                 if (normalizedChildHref === '') normalizedChildHref = '/';
                 else if (!normalizedChildHref.endsWith('/') && !normalizedChildHref.substring(normalizedChildHref.lastIndexOf('/') + 1).includes('.')) {
                      normalizedChildHref += '/';
                 }

                 // Kiểm tra xem currentPath có bắt đầu bằng đường dẫn của link con không
                 // và chọn khớp dài nhất (chính xác hơn), bỏ qua khớp thư mục gốc '/' trừ khi currentPath cũng là '/'
                 if (currentPath.startsWith(normalizedChildHref) && normalizedChildHref.length > bestMatchLength) {
                     if (!(currentPath !== '/' && normalizedChildHref === '/')) { // Chỉ khớp gốc nếu currentPath cũng là gốc
                          bestMatchLength = normalizedChildHref.length;
                          bestMatchToggle = toggle; // Đánh dấu toggle cha cần active
                          console.log(`DEBUG: Potential parent match found: ${toggle.textContent.trim()} based on child ${linkHref}`);
                     }
                 }
             });
         });

         if (bestMatchToggle) {
             bestMatchToggle.classList.add('active');
             console.log(`DEBUG: Setting parent active based on best match: ${bestMatchToggle.textContent.trim()}`);
         } else if (currentPath === '/') {
             // Trường hợp đặc biệt: Active link HOME nếu đang ở trang chủ
              const homeLink = headerContent.querySelector('.nav-tabs a[href="index.html"], .mobile-nav-tabs a[href="index.html"]');
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
    const countdownDuration = 120; // 120 giây
    const redirectTimerContainer = document.getElementById('redirect-timer');
    const cancelButton = document.getElementById("cancel-redirect");

    if (redirectTimerContainer && cancelButton) {
        console.log("DEBUG: Redirect timer elements found.");
        const timerDisplayElement = redirectTimerContainer.querySelector('p'); // Lấy thẻ p bên trong

        if (!timerDisplayElement) {
            console.error("DEBUG: Timer display element (<p>) inside #redirect-timer not found.");
            return;
        }
        redirectTimerContainer.style.display = 'block'; // Hiển thị container

        let timeLeft = countdownDuration;
        let redirectIntervalId = null;

        const updateTimer = () => {
            if (timeLeft <= 0) {
                clearInterval(redirectIntervalId);
                console.log("DEBUG: Timer finished.");
                // Chỉ chuyển hướng nếu nút Hủy chưa được bấm
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

        // Gọi lần đầu để hiển thị ngay
        updateTimer();
        // Bắt đầu bộ đếm
        redirectIntervalId = setInterval(updateTimer, 1000);
        console.log("DEBUG: Redirect timer started with interval ID:", redirectIntervalId);

        // Gắn sự kiện hủy một lần duy nhất
        cancelButton.addEventListener("click", () => {
            clearInterval(redirectIntervalId);
            cancelButton.textContent = "Đã hủy chuyển hướng";
            cancelButton.disabled = true; // Vô hiệu hóa nút sau khi bấm
            timerDisplayElement.textContent = "Chuyển hướng đã bị hủy.";
            console.log("DEBUG: Redirect cancelled by user.");
        }, { once: true }); // Đảm bảo sự kiện chỉ chạy 1 lần

    } else {
        // Log nếu không tìm thấy phần tử
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
        return; // Không làm gì nếu không có container này
    }
    console.log("DEBUG: Loading latest posts...");
    // Có thể thêm hiệu ứng loading ở đây nếu muốn
    // postsContainer.innerHTML = '<div class="loading-spinner"></div>';

    try {
        const response = await fetch('/posts.json'); // Đường dẫn tuyệt đối từ gốc
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status} while fetching posts.json`);
        }
        const posts = await response.json();

        // Kiểm tra xem posts có phải là mảng không
        if (!Array.isArray(posts)) {
            throw new Error("Invalid format: posts.json did not return an array.");
        }

        postsContainer.innerHTML = ''; // Xóa placeholder hoặc spinner

        if (posts.length === 0) {
            postsContainer.innerHTML = '<p class="no-posts" style="text-align: center; color: var(--text-light);">Chưa có tin nổi bật nào.</p>';
            return;
        }

        // Sắp xếp bài viết theo ngày giảm dần (mới nhất trước)
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Chỉ lấy 3 bài viết mới nhất
        const latestPosts = posts.slice(0, 3);

        latestPosts.forEach(post => {
            // Kiểm tra post có hợp lệ không trước khi tạo element
            if (post && typeof post === 'object' && post.title && post.url) {
                postsContainer.appendChild(createPostElement(post));
            } else {
                console.warn("DEBUG: Invalid post data found in posts.json:", post);
            }
        });
        console.log("DEBUG: Latest posts loaded and displayed.");

    } catch (error) {
        console.error('DEBUG: Error loading or processing latest posts:', error);
        postsContainer.innerHTML = `<p class="error" style="text-align: center; color: red;">Không thể tải tin nổi bật. Vui lòng thử lại sau.</p>`;
    }
}

/**
 * Tạo phần tử HTML cho một bài viết.
 * @param {object} post Dữ liệu bài viết.
 * @returns {HTMLElement} Phần tử div.post-card.
 */
function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post-card card'; // Sử dụng class chung .card và .post-card

    // Ảnh fallback nếu ảnh gốc lỗi hoặc không có
    const fallbackImage = 'https://placehold.co/600x400/eee/ccc?text=IVS+Post';
    // Đảm bảo đường dẫn ảnh là tuyệt đối từ gốc
    const imageUrl = post.image ? (post.image.startsWith('/') ? post.image : '/' + post.image) : fallbackImage;
    // Đảm bảo URL bài viết là tuyệt đối hoặc tương đối đúng
    const postUrl = post.url ? (post.url.startsWith('/') || post.url.startsWith('http') ? post.url : '/' + post.url) : '#';

    const title = post.title || 'Tiêu đề bài viết';
    const excerpt = post.excerpt || 'Nội dung tóm tắt...';
    // Định dạng ngày tháng cho dễ đọc
    let postDate = 'Không rõ';
    try {
        if (post.date) {
            postDate = new Date(post.date).toLocaleDateString('vi-VN', {
                day: '2-digit', month: '2-digit', year: 'numeric'
            });
        }
    } catch (e) { console.warn("DEBUG: Invalid date format for post:", post.title, post.date)}

    postDiv.innerHTML = `
        <img src="${imageUrl}" alt="${title}" loading="lazy" onerror="this.onerror=null; this.src='${fallbackImage}';">
        <div class="post-content">
            <h3><a href="${postUrl}">${title}</a></h3>
            <p class="post-meta">Ngày đăng: ${postDate}</p>
            <p>${excerpt}</p>
            <a href="${postUrl}" class="read-more btn btn-primary btn-sm">Đọc thêm</a> </div>`;
    return postDiv;
}


// --- Chạy các hàm khởi tạo khi DOM sẵn sàng ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DEBUG: DOM fully loaded. Starting dynamic load setup.");

    // Đảm bảo có phần tử overlay trong DOM
    if (!document.querySelector('.overlay')) {
        const overlayDiv = document.createElement('div');
        overlayDiv.className = 'overlay';
        document.body.appendChild(overlayDiv);
        console.log("DEBUG: Overlay element created dynamically.");
    }

    // Tải header và footer động, sau đó khởi tạo menu và link active
    Promise.all([
        loadComponent('/header.html', 'header-placeholder'),
        loadComponent('/footer.html', 'footer-placeholder')
    ]).then(([headerElement, footerElement]) => {
        console.log("DEBUG: Header and Footer loading promises resolved.");
        if (headerElement) {
             // Khởi tạo menu ngay sau khi header được chèn vào DOM
             initializeMenuEventsDelegation();
        } else {
            console.error("DEBUG: Header component failed to load or returned null, cannot initialize menu.");
        }
        // Các hành động khác sau khi cả header và footer đã tải xong (nếu có)

    }).catch(error => {
        console.error("DEBUG: Critical error during component loading. Menu or other features might be broken.", error);
        // Có thể hiển thị thông báo lỗi chung cho người dùng ở đây
    });

    // Tải bài viết mới nhất (có thể chạy song song với tải header/footer)
    loadLatestPosts();

    // Khởi tạo các chức năng không phụ thuộc header/footer
    startRedirectCountdown();

    console.log("DEBUG: Initial dynamic load setup sequence started.");
});
