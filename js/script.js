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
        // Quan trọng: Phải đảm bảo file HTML được tải (header.html, footer.html) có một phần tử gốc duy nhất.
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
 * Bao gồm xử lý đóng/mở menu mobile, hiệu ứng accordion và toggle class cho nút hamburger.
 * Cần được gọi SAU KHI header đã được tải thành công.
 */
function initializeMenuEventsDelegation() {
    console.log("DEBUG: Initializing menu events (mainly mobile)...");
    const headerPlaceholder = document.getElementById('header-placeholder');
    // Nội dung thực sự của header (thẻ <header> bên trong placeholder)
    const headerElement = headerPlaceholder?.querySelector('header'); // Tìm thẻ header cụ thể
    let overlay = document.querySelector(".overlay"); // Dùng let để có thể gán lại

    if (!headerElement) {
        console.error("DEBUG: Header content (<header>) not found inside #header-placeholder for delegation.");
        return;
    }
    if (!overlay) {
        // Nếu chưa có overlay, tạo và thêm vào body
        console.warn("DEBUG: Overlay element (.overlay) not found. Creating one.");
        const newOverlay = document.createElement('div');
        newOverlay.className = 'overlay';
        document.body.appendChild(newOverlay);
        overlay = newOverlay; // Gán lại biến overlay
    }

    // --- Mobile Menu Toggle (Delegated) ---
    // Gắn sự kiện vào headerPlaceholder để bắt cả nút hamburger
    headerPlaceholder.addEventListener('click', function(event) {
        const hamburger = event.target.closest('.hamburger');
        // Tìm mobile menu bên trong nội dung header đã được tải
        const mobileMenu = headerElement.querySelector(".mobile-menu");

        if (hamburger && mobileMenu) {
            console.log("DEBUG: Hamburger clicked!");
            // --- THÊM/XÓA CLASS CHO NÚT HAMBURGER ---
            const isAlreadyActive = mobileMenu.classList.contains('active');
            if (!isAlreadyActive) {
                // Mở menu
                mobileMenu.classList.add('active');
                if (overlay) overlay.classList.add('active');
                document.body.classList.add('mobile-menu-active'); // Khóa cuộn trang
                hamburger.classList.add('is-active'); // Thêm class active cho nút hamburger (để tạo hiệu ứng X)
                hamburger.setAttribute('aria-expanded', 'true'); // Cập nhật ARIA
            } else {
                // Nếu bấm hamburger khi menu đang mở -> đóng menu
                 closeMobileMenu(mobileMenu, overlay);
                 hamburger.classList.remove('is-active'); // Xóa class active khỏi nút hamburger
                 hamburger.setAttribute('aria-expanded', 'false'); // Cập nhật ARIA
            }
            // --- KẾT THÚC THÊM/XÓA CLASS ---
        }
    });

    // Gắn sự kiện đóng vào chính mobile menu (vì nút close nằm trong đó)
    const mobileMenuElement = headerElement.querySelector(".mobile-menu");
    if (mobileMenuElement) {
        mobileMenuElement.addEventListener('click', function(event) {
            const closeMenu = event.target.closest('.close-menu');
            const hamburgerButton = headerPlaceholder.querySelector('.hamburger'); // Tìm lại nút hamburger để xóa class

            if (closeMenu) {
                console.log("DEBUG: Close button clicked");
                closeMobileMenu(mobileMenuElement, overlay); // Đóng menu
                // --- XÓA CLASS KHI ĐÓNG BẰNG NÚT X ---
                if(hamburgerButton) {
                    hamburgerButton.classList.remove('is-active');
                    hamburgerButton.setAttribute('aria-expanded', 'false');
                }
                // --- KẾT THÚC XÓA CLASS ---
            }

            // Đóng menu khi bấm link không phải dropdown trong mobile menu
            if (mobileMenuElement.classList.contains('active')) {
                const link = event.target.closest('.mobile-nav-tabs a');
                // Chỉ đóng nếu link không phải là toggle dropdown
                if (link && !link.classList.contains('dropdown-toggle')) {
                    console.log("DEBUG: Non-dropdown mobile link clicked");
                    // Thêm độ trễ nhỏ để người dùng thấy link được nhấn trước khi menu đóng
                    setTimeout(() => {
                        closeMobileMenu(mobileMenuElement, overlay);
                         // --- XÓA CLASS KHI ĐÓNG BẰNG LINK ---
                         if(hamburgerButton) {
                            hamburgerButton.classList.remove('is-active');
                            hamburgerButton.setAttribute('aria-expanded', 'false');
                         }
                        // --- KẾT THÚC XÓA CLASS ---
                    }, 100);
                }
            }
        });
    }

     // Đóng menu khi bấm overlay
     if(overlay) {
         overlay.addEventListener('click', () => {
             const hamburgerButton = headerPlaceholder.querySelector('.hamburger'); // Tìm lại nút hamburger
             closeMobileMenu(mobileMenuElement, overlay);
             // --- XÓA CLASS KHI ĐÓNG BẰNG OVERLAY ---
              if(hamburgerButton) {
                 hamburgerButton.classList.remove('is-active');
                 hamburgerButton.setAttribute('aria-expanded', 'false');
              }
             // --- KẾT THÚC XÓA CLASS ---
         });
     }

    // --- Mobile Dropdown (Accordion - Delegated) ---
    if (mobileMenuElement) {
        mobileMenuElement.addEventListener('click', function(event) {
            const toggle = event.target.closest('.mobile-nav-tabs li > a.dropdown-toggle');
            if (!toggle) return; // Không phải toggle mobile dropdown thì dừng

            // Ngăn hành vi mặc định CHỈ khi là link # hoặc không có href
            if (toggle.getAttribute('href') === '#' || !toggle.getAttribute('href')) {
                event.preventDefault();
            } else {
                // Cho phép điều hướng nếu là link thật, menu sẽ đóng bởi logic khác
            }

            const parentLi = toggle.closest('li.dropdown, li.dropdown-submenu');
            if (!parentLi) return;
            const subMenu = parentLi.querySelector(':scope > .dropdown-menu');
            if (!subMenu) return;

            const isActive = parentLi.classList.contains('active');

            // Đóng siblings cùng cấp (anh em ruột)
            const parentUl = parentLi.parentElement;
            parentUl.querySelectorAll(':scope > li.active').forEach(li => {
                if (li !== parentLi) { // Chỉ đóng những thằng khác
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
                 // Sử dụng requestAnimationFrame để đảm bảo class 'show' được áp dụng trước khi tính scrollHeight
                 requestAnimationFrame(() => {
                    subMenu.style.maxHeight = subMenu.scrollHeight + "px";
                 });
             } else {
                 // Đóng menu: đặt max-height về 0 (hoặc null)
                 subMenu.style.maxHeight = null;
             }

            console.log(`DEBUG: Toggled mobile dropdown for: ${toggle.textContent.trim()}. Active: ${!isActive}`);
        });
    }

    // --- Desktop Dropdown ---
    // Được xử lý bằng CSS :hover và :focus-within

    // Cập nhật link active khi menu đã được tải
    setActiveNavLink();

    console.log("DEBUG: Menu events initialized (with hamburger animation toggle).");
}

/**
 * Hàm đóng menu mobile.
 * @param {HTMLElement} mobileMenu Phần tử menu mobile.
 * @param {HTMLElement} overlay Phần tử overlay.
 */
function closeMobileMenu(mobileMenu, overlay) {
    const headerPlaceholder = document.getElementById('header-placeholder'); // Cần tìm lại placeholder
    const hamburgerButton = headerPlaceholder?.querySelector('.hamburger'); // Tìm nút hamburger trong placeholder

    if(mobileMenu) mobileMenu.classList.remove('active');
    if(overlay) overlay.classList.remove('active');
    document.body.classList.remove('mobile-menu-active'); // Mở khóa cuộn trang

    // Xóa class active khỏi nút hamburger
    if(hamburgerButton) {
        hamburgerButton.classList.remove('is-active');
        hamburgerButton.setAttribute('aria-expanded', 'false');
    }

     // Đóng tất cả submenu mobile đang mở
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

    const navLinks = headerContent.querySelectorAll('.nav-tabs a:not(.dropdown-toggle), .mobile-nav-tabs a:not(.dropdown-toggle)');
    let currentPath = window.location.pathname;

    // Chuẩn hóa currentPath (giữ nguyên logic chuẩn hóa)
    if (currentPath.endsWith('/index.html')) {
        currentPath = currentPath.substring(0, currentPath.length - 'index.html'.length);
    }
    if (!currentPath.startsWith('/')) {
        currentPath = '/' + currentPath;
    }
    if (currentPath !== '/' && !currentPath.endsWith('/') && !/\.[^/]+$/.test(currentPath)) {
        currentPath += '/';
    }
    if (currentPath === '') {
        currentPath = '/';
    }

    console.log(`DEBUG: Current Path for Active Link: ${currentPath}`);

    let directMatchFound = false;

    // Xóa active cũ
    navLinks.forEach(link => link.classList.remove('active'));
    headerContent.querySelectorAll('.nav-tabs > li > a.dropdown-toggle, .mobile-nav-tabs > li > a.dropdown-toggle').forEach(toggle => toggle.classList.remove('active'));

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (!linkHref || linkHref === '#' || linkHref.startsWith('http') || linkHref.startsWith('mailto:') || linkHref.startsWith('tel:')) return;

        // Chuẩn hóa linkHref (giữ nguyên logic chuẩn hóa)
        let normalizedLinkHref = linkHref;
        if (!normalizedLinkHref.startsWith('/')) {
             normalizedLinkHref = '/' + normalizedLinkHref;
        }
         if (normalizedLinkHref.endsWith('/index.html')) {
            normalizedLinkHref = normalizedLinkHref.substring(0, normalizedLinkHref.length - 'index.html'.length);
        }
        if (normalizedLinkHref === '') {
             normalizedLinkHref = '/';
        } else if (normalizedLinkHref !== '/' && !normalizedLinkHref.endsWith('/') && !/\.[^/]+$/.test(normalizedLinkHref)) {
             normalizedLinkHref += '/';
        }

        // So sánh và đặt active
        if (normalizedLinkHref === currentPath) {
            link.classList.add('active');
            directMatchFound = true;
            console.log(`DEBUG: Direct active link set for: ${linkHref} (Normalized: ${normalizedLinkHref})`);

            // Active menu cha cấp 1
            const parentDropdownLi = link.closest('.nav-tabs > li.dropdown, .mobile-nav-tabs > li.dropdown');
            parentDropdownLi?.querySelector(':scope > a.dropdown-toggle')?.classList.add('active');

            // Active menu cha cấp 2 (nếu có)
            const parentSubmenuLi = link.closest('.dropdown-submenu');
            if(parentSubmenuLi){
                 parentSubmenuLi.querySelector(':scope > a.dropdown-toggle')?.classList.add('active');
                 const topLevelParent = parentSubmenuLi.closest('.nav-tabs > li.dropdown, .mobile-nav-tabs > li.dropdown');
                 topLevelParent?.querySelector(':scope > a.dropdown-toggle')?.classList.add('active');
            }
        }
    });

     // Active menu cha nếu không có khớp trực tiếp (giữ nguyên logic)
     if (!directMatchFound) {
         console.log("DEBUG: No direct match found, checking parent paths...");
         let bestMatchLength = 0;
         let bestMatchToggle = null;
         const topLevelToggles = headerContent.querySelectorAll('.nav-tabs > li.dropdown > a.dropdown-toggle, .mobile-nav-tabs > li.dropdown > a.dropdown-toggle');

         topLevelToggles.forEach(toggle => {
             const parentLi = toggle.closest('li.dropdown');
             const childLinks = parentLi.querySelectorAll('.dropdown-menu a');
             childLinks.forEach(childLink => {
                 const linkHref = childLink.getAttribute('href');
                 if (!linkHref || linkHref === '#' || linkHref.startsWith('http') || linkHref.startsWith('mailto:') || linkHref.startsWith('tel:')) return;
                 let normalizedChildHref = linkHref;
                 if (!normalizedChildHref.startsWith('/')) { normalizedChildHref = '/' + normalizedChildHref; }
                 if (normalizedChildHref.endsWith('/index.html')) { normalizedChildHref = normalizedChildHref.substring(0, normalizedChildHref.length - 'index.html'.length); }
                 if (normalizedChildHref === '') normalizedChildHref = '/';
                 else if (normalizedChildHref !== '/' && !normalizedChildHref.endsWith('/') && !/\.[^/]+$/.test(normalizedChildHref)) { normalizedChildHref += '/'; }

                 if (currentPath.startsWith(normalizedChildHref) && normalizedChildHref.length > bestMatchLength) {
                      if (!(currentPath !== '/' && normalizedChildHref === '/')) {
                          bestMatchLength = normalizedChildHref.length;
                          bestMatchToggle = toggle;
                          console.log(`DEBUG: Potential parent match: ${toggle.textContent.trim()} based on child ${linkHref}`);
                      }
                 }
             });
         });

         if (bestMatchToggle) {
             bestMatchToggle.classList.add('active');
             console.log(`DEBUG: Setting parent active based on best match: ${bestMatchToggle.textContent.trim()}`);
         } else if (currentPath === '/') {
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
    const countdownDuration = 120; // 120 giây
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
 */
async function loadLatestPosts() {
    const postsContainer = document.getElementById('latest-posts-container');
    if (!postsContainer) {
        console.log("DEBUG: #latest-posts-container not found, skipping post loading.");
        return;
    }
    console.log("DEBUG: Loading latest posts...");
    postsContainer.innerHTML = '<p style="text-align:center; padding: 20px; color: var(--text-light);">Đang tải bài viết...</p>';

    try {
        const response = await fetch('/posts.json');
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status} while fetching posts.json`);
        }
        const posts = await response.json();

        if (!Array.isArray(posts)) {
            throw new Error("Invalid format: posts.json did not return an array.");
        }

        postsContainer.innerHTML = '';

        if (posts.length === 0) {
            postsContainer.innerHTML = '<p class="no-posts" style="text-align: center; color: var(--text-light);">Chưa có tin nổi bật nào.</p>';
            return;
        }

        posts.sort((a, b) => {
             try {
                 return new Date(b.date) - new Date(a.date);
             } catch(e) {
                 console.warn("Error comparing dates during sort:", a.date, b.date);
                 return 0;
             }
        });

        const latestPosts = posts.slice(0, 3);

        latestPosts.forEach(post => {
            if (post && typeof post === 'object' && post.title && post.url) { // Chỉ cần title và url là tối thiểu
                postsContainer.appendChild(createPostElement(post));
            } else {
                console.warn("DEBUG: Skipping invalid/incomplete post data in posts.json:", post);
            }
        });
        console.log("DEBUG: Latest posts loaded and displayed.");

    } catch (error) {
        console.error('DEBUG: Error loading or processing latest posts:', error);
        postsContainer.innerHTML = `<p class="error" style="text-align: center; color: red;">Không thể tải tin nổi bật. Vui lòng kiểm tra lại file posts.json.</p>`;
    }
}

/**
 * Tạo phần tử HTML cho một bài viết.
 */
function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post-card card';

    const fallbackImage = 'https://placehold.co/600x400/eee/ccc?text=IVS+Post';
    const imageUrl = post.image ? (post.image.startsWith('/') ? post.image : '/' + post.image) : fallbackImage;
    const postUrl = post.url ? (post.url.startsWith('/') || post.url.startsWith('http') ? post.url : '/' + post.url) : '#';
    const title = post.title || 'Tiêu đề bài viết';
    const excerpt = post.excerpt || 'Nội dung tóm tắt...';
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
            <a href="${postUrl}" class="read-more btn btn-primary btn-sm">Đọc thêm</a>
        </div>`;
    return postDiv;
}


// --- Chạy các hàm khởi tạo khi DOM sẵn sàng ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DEBUG: DOM fully loaded. Starting dynamic load setup.");

    if (!document.querySelector('.overlay')) {
        const overlayDiv = document.createElement('div');
        overlayDiv.className = 'overlay';
        document.body.appendChild(overlayDiv);
        console.log("DEBUG: Overlay element created dynamically.");
    }

    Promise.all([
        loadComponent('/header.html', 'header-placeholder'),
        loadComponent('/footer.html', 'footer-placeholder')
    ]).then(([headerElement, footerElement]) => {
        console.log("DEBUG: Header and Footer loading promises resolved.");
        if (headerElement) {
             initializeMenuEventsDelegation();
        } else {
            console.error("DEBUG: Header component failed to load or returned null, cannot initialize menu.");
        }
    }).catch(error => {
        console.error("DEBUG: Critical error during component loading. Menu or other features might be broken.", error);
    });

    loadLatestPosts();
    startRedirectCountdown();

    console.log("DEBUG: Initial dynamic load setup sequence started.");
});
