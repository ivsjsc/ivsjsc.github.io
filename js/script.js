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
        return element.firstElementChild || element;
    } catch (error) {
        console.error(`DEBUG: Error loading ${elementId} from ${url}:`, error);
        element.innerHTML = `<div style="text-align: center; padding: 10px; color: red;">Lỗi tải ${elementId}.</div>`;
        throw error;
    }
}

/**
 * Khởi tạo các sự kiện cho menu (chủ yếu là mobile) sử dụng event delegation.
 */
function initializeMenuEventsDelegation() {
    console.log("DEBUG: Initializing menu events (mainly mobile)...");
    const headerPlaceholder = document.getElementById('header-placeholder');
    const headerElement = headerPlaceholder?.querySelector('header');
    let overlay = document.querySelector(".overlay");

    if (!headerElement) {
        console.error("DEBUG: Header content (<header>) not found inside #header-placeholder for delegation.");
        return;
    }
    if (!overlay) {
        console.warn("DEBUG: Overlay element (.overlay) not found. Creating one.");
        const newOverlay = document.createElement('div');
        newOverlay.className = 'overlay';
        document.body.appendChild(newOverlay);
        overlay = newOverlay;
    }

    // --- Mobile Menu Toggle (Delegated) ---
    headerPlaceholder.addEventListener('click', function(event) {
        const hamburger = event.target.closest('.hamburger');
        const mobileMenu = headerElement.querySelector(".mobile-menu");

        if (hamburger && mobileMenu) {
            console.log("DEBUG: Hamburger clicked!");
            const isAlreadyActive = mobileMenu.classList.contains('active');
            if (!isAlreadyActive) {
                mobileMenu.classList.add('active');
                if (overlay) overlay.classList.add('active');
                document.body.classList.add('mobile-menu-active');
                hamburger.classList.add('is-active');
                hamburger.setAttribute('aria-expanded', 'true');
            } else {
                 closeMobileMenu(mobileMenu, overlay, hamburger); // Truyền cả hamburger vào
            }
        }
    });

    const mobileMenuElement = headerElement.querySelector(".mobile-menu");
    if (mobileMenuElement) {
        mobileMenuElement.addEventListener('click', function(event) {
            const closeMenu = event.target.closest('.close-menu');
            const hamburgerButton = headerPlaceholder?.querySelector('.hamburger'); // Thêm ? để tránh lỗi nếu placeholder chưa load

            if (closeMenu) {
                console.log("DEBUG: Close button clicked");
                closeMobileMenu(mobileMenuElement, overlay, hamburgerButton);
            }

            if (mobileMenuElement.classList.contains('active')) {
                const link = event.target.closest('.mobile-nav-tabs a');
                if (link && !link.classList.contains('dropdown-toggle')) {
                    console.log("DEBUG: Non-dropdown mobile link clicked");
                    setTimeout(() => closeMobileMenu(mobileMenuElement, overlay, hamburgerButton), 100);
                }
            }
        });
    }

     if(overlay) {
         overlay.addEventListener('click', () => {
             const hamburgerButton = headerPlaceholder?.querySelector('.hamburger');
             closeMobileMenu(mobileMenuElement, overlay, hamburgerButton);
         });
     }

    // --- Mobile Dropdown (Accordion - Delegated) - THÊM DEBUG LOG ---
    if (mobileMenuElement) {
        mobileMenuElement.addEventListener('click', function(event) {
            const toggle = event.target.closest('.mobile-nav-tabs li > a.dropdown-toggle');

            // *** BẮT ĐẦU DEBUG LOG ***
            if (toggle) {
                 console.log("--- Mobile Dropdown Click ---");
                 console.log("DEBUG: Clicked Toggle:", toggle.textContent.trim());

                 // Ngăn chặn điều hướng nếu là link # hoặc không có href
                 if (toggle.getAttribute('href') === '#' || !toggle.getAttribute('href')) {
                    event.preventDefault();
                    console.log("DEBUG: Prevented default navigation.");
                 } else {
                    console.log("DEBUG: Allowing default navigation for link:", toggle.getAttribute('href'));
                    // Logic đóng menu khi bấm link đã xử lý ở trên, không cần return
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

                // Đóng siblings cùng cấp
                const parentUl = parentLi.parentElement;
                parentUl.querySelectorAll(':scope > li.active').forEach(li => {
                    if (li !== parentLi) {
                        console.log("DEBUG: Closing sibling:", li.querySelector(':scope > a.dropdown-toggle')?.textContent.trim());
                        li.classList.remove('active');
                        const siblingSubMenu = li.querySelector(':scope > .dropdown-menu');
                        if (siblingSubMenu) {
                             siblingSubMenu.classList.remove('show');
                             siblingSubMenu.style.maxHeight = null;
                        }
                        li.querySelector(':scope > a.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
                    }
                });

                // Toggle current
                parentLi.classList.toggle('active', !isActive);
                subMenu.classList.toggle('show', !isActive);
                toggle.setAttribute('aria-expanded', String(!isActive));

                // Set max-height for CSS transition
                 if (!isActive) {
                     requestAnimationFrame(() => {
                        const scrollHeight = subMenu.scrollHeight;
                        subMenu.style.maxHeight = scrollHeight + "px";
                        console.log(`DEBUG: Setting max-height for submenu of ${toggle.textContent.trim()} to ${scrollHeight}px`);
                     });
                 } else {
                     subMenu.style.maxHeight = null;
                     console.log(`DEBUG: Resetting max-height for submenu of ${toggle.textContent.trim()}`);
                 }
                 console.log(`DEBUG: New state for ${toggle.textContent.trim()}: ${!isActive ? 'active' : 'inactive'}`);
                 console.log("--- End Mobile Dropdown Click ---");
             }
             // *** KẾT THÚC DEBUG LOG ***
        });
    }

    setActiveNavLink();
    console.log("DEBUG: Menu events initialized (with hamburger animation toggle and debug logs).");
}

/**
 * Hàm đóng menu mobile.
 * @param {HTMLElement|null} mobileMenu Phần tử menu mobile.
 * @param {HTMLElement|null} overlay Phần tử overlay.
 * @param {HTMLElement|null} hamburgerButton Nút hamburger (tùy chọn).
 */
function closeMobileMenu(mobileMenu, overlay, hamburgerButton = null) {
    // Nếu không truyền hamburgerButton, thử tìm lại
    if (!hamburgerButton) {
         const headerPlaceholder = document.getElementById('header-placeholder');
         hamburgerButton = headerPlaceholder?.querySelector('.hamburger');
    }

    if(mobileMenu) mobileMenu.classList.remove('active');
    if(overlay) overlay.classList.remove('active');
    document.body.classList.remove('mobile-menu-active');

    if(hamburgerButton) {
        hamburgerButton.classList.remove('is-active');
        hamburgerButton.setAttribute('aria-expanded', 'false');
    }

     mobileMenu?.querySelectorAll('.mobile-nav-tabs li.active').forEach(li => {
        li.classList.remove('active');
        const subMenu = li.querySelector(':scope > .dropdown-menu');
         if (subMenu) {
             subMenu.classList.remove('show');
             subMenu.style.maxHeight = null;
         }
        li.querySelector(':scope > a.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
    });
    console.log("DEBUG: Mobile menu closed.");
}

// ... (Các hàm setActiveNavLink, startRedirectCountdown, loadLatestPosts, createPostElement giữ nguyên) ...
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
    navLinks.forEach(link => link.classList.remove('active'));
    headerContent.querySelectorAll('.nav-tabs > li > a.dropdown-toggle, .mobile-nav-tabs > li > a.dropdown-toggle').forEach(toggle => toggle.classList.remove('active'));
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (!linkHref || linkHref === '#' || linkHref.startsWith('http') || linkHref.startsWith('mailto:') || linkHref.startsWith('tel:')) return;
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
        if (normalizedLinkHref === currentPath) {
            link.classList.add('active');
            directMatchFound = true;
            console.log(`DEBUG: Direct active link set for: ${linkHref} (Normalized: ${normalizedLinkHref})`);
            const parentDropdownLi = link.closest('.nav-tabs > li.dropdown, .mobile-nav-tabs > li.dropdown');
            parentDropdownLi?.querySelector(':scope > a.dropdown-toggle')?.classList.add('active');
            const parentSubmenuLi = link.closest('.dropdown-submenu');
            if(parentSubmenuLi){
                 parentSubmenuLi.querySelector(':scope > a.dropdown-toggle')?.classList.add('active');
                 const topLevelParent = parentSubmenuLi.closest('.nav-tabs > li.dropdown, .mobile-nav-tabs > li.dropdown');
                 topLevelParent?.querySelector(':scope > a.dropdown-toggle')?.classList.add('active');
            }
        }
    });
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
                    try { window.location.href = redirectUrl; } catch (e) { console.error("DEBUG: Redirect failed.", e); timerDisplayElement.textContent = "Lỗi khi chuyển hướng."; }
                } else { console.log("DEBUG: Redirect cancelled, not redirecting."); }
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
        if (!response.ok) { throw new Error(`HTTP error ${response.status} while fetching posts.json`); }
        const posts = await response.json();
        if (!Array.isArray(posts)) { throw new Error("Invalid format: posts.json did not return an array."); }
        postsContainer.innerHTML = '';
        if (posts.length === 0) {
            postsContainer.innerHTML = '<p class="no-posts" style="text-align: center; color: var(--text-light);">Chưa có tin nổi bật nào.</p>';
            return;
        }
        posts.sort((a, b) => { try { return new Date(b.date) - new Date(a.date); } catch(e) { console.warn("Error comparing dates during sort:", a.date, b.date); return 0; } });
        const latestPosts = posts.slice(0, 3);
        latestPosts.forEach(post => {
            if (post && typeof post === 'object' && post.title && post.url) { postsContainer.appendChild(createPostElement(post)); } else { console.warn("DEBUG: Skipping invalid/incomplete post data in posts.json:", post); }
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
    try { if (post.date) { postDate = new Date(post.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }); } } catch (e) { console.warn("DEBUG: Invalid date format for post:", post.title, post.date)}
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
