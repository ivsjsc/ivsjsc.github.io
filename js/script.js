/**
 * Hàm tải nội dung HTML từ một URL và chèn vào phần tử có ID chỉ định.
 * @param {string} url Đường dẫn đến file HTML cần tải (ví dụ: 'header.html'). Lưu ý đường dẫn này phải đúng từ vị trí tệp HTML đang gọi script.
 * @param {string} elementId ID của phần tử HTML placeholder (ví dụ: 'header-placeholder').
 * @returns {Promise<HTMLElement|null>} Promise hoàn thành trả về phần tử đã được chèn nội dung, hoặc null nếu có lỗi.
 */
function loadComponent(url, elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`DEBUG: Element with ID "${elementId}" not found.`);
        // Không hiển thị lỗi trực tiếp lên giao diện để tránh làm rối
        return Promise.resolve(null); // Trả về null để Promise.all không bị reject
    }
    // Hiển thị trạng thái đang tải (tùy chọn)
    // element.innerHTML = `<p style="text-align: center; padding: 10px; color: #aaa;">Loading ${elementId}...</p>`;
    console.log(`DEBUG: Loading component ${url} into #${elementId}`);

    // Sử dụng đường dẫn tuyệt đối từ gốc website nếu header/footer luôn ở gốc
    // Nếu header/footer nằm cùng cấp với các trang con thì không cần '/'
    const fetchUrl = '/' + url; // Giả định header.html, footer.html nằm ở gốc

    return fetch(fetchUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${fetchUrl}. Status: ${response.status} ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            element.innerHTML = data;
            console.log(`DEBUG: Component ${elementId} loaded successfully from ${fetchUrl}.`);
            // Trả về phần tử gốc chứa nội dung vừa tải (ví dụ: thẻ <header> hoặc <footer> bên trong placeholder)
            // Điều này quan trọng để các script khác biết khi nào nội dung thực sự sẵn sàng
             return element.firstElementChild || element;
        })
        .catch(error => {
            console.error(`DEBUG: Error loading ${elementId} from ${fetchUrl}:`, error);
            element.innerHTML = `<div style="text-align: center; padding: 10px; color: red; border: 1px solid red; border-radius: 5px; background: #ffebeb;">Failed to load ${elementId}.</div>`;
            // return null; // Trả về null để Promise.all không bị reject
             throw error; // Hoặc ném lỗi để Promise.all biết có vấn đề
        });
}


/**
 * Khởi tạo các sự kiện cho menu sử dụng event delegation.
 * Cần được gọi SAU KHI header đã được tải thành công.
 */
function initializeMenuEventsDelegation() {
    console.log("DEBUG: Initializing menu events using DELEGATION...");
    // Lấy thẻ header gốc đã được tải nội dung vào placeholder
    const headerElement = document.getElementById('header-placeholder')?.firstElementChild;
    const overlay = document.querySelector(".overlay");

    if (!headerElement) {
        console.error("DEBUG: Header content not found inside #header-placeholder for delegation.");
        return;
    }
     if (!overlay) {
        console.warn("DEBUG: Overlay element (.overlay) not found.");
    }

    // --- Mobile Menu Toggle (Delegated) ---
    headerElement.addEventListener('click', function(event) {
        const hamburger = event.target.closest('.hamburger');
        const closeMenu = event.target.closest('.close-menu');
        // Tìm mobile menu bên trong header đã tải
        const mobileMenu = headerElement.querySelector(".mobile-menu");

        if (hamburger && mobileMenu) {
            console.log("DEBUG: Hamburger clicked (delegated)!");
            mobileMenu.classList.add('active');
            if (overlay) overlay.classList.add('active');
            document.body.classList.add('mobile-menu-active');
        }

        if (closeMenu && mobileMenu) {
             console.log("DEBUG: Close button clicked (delegated)");
             closeMobileMenu();
        }

        if (mobileMenu?.classList.contains('active')) {
            const link = event.target.closest('.mobile-nav-tabs a');
            if (link && !link.classList.contains('dropdown-toggle')) {
                console.log("DEBUG: Non-dropdown mobile link clicked (delegated)");
                closeMobileMenu();
            }
        }
    });

     if(overlay) {
         overlay.addEventListener('click', closeMobileMenu);
     }


    // --- Mobile Dropdown (Accordion - Delegated) ---
    headerElement.addEventListener('click', function(event) {
        const toggle = event.target.closest('.mobile-menu .mobile-nav-tabs li > a.dropdown-toggle');
        if (!toggle) return;

        if (toggle.getAttribute('href') === '#' || !toggle.getAttribute('href')) {
            event.preventDefault();
        } else {
             closeMobileMenu();
             return;
        }

        const parentLi = toggle.closest('li.dropdown, li.dropdown-submenu');
        if (!parentLi) return;
        const subMenu = parentLi.querySelector(':scope > .dropdown-menu');
        if (!subMenu) return;

        const isActive = parentLi.classList.contains('active');

        const parentUl = parentLi.parentElement;
        const siblingLis = parentUl.querySelectorAll(':scope > li.active');
        siblingLis.forEach(li => {
            if (li !== parentLi) {
                li.classList.remove('active');
                li.querySelector(':scope > .dropdown-menu')?.classList.remove('show');
                li.querySelector(':scope > a.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
            }
        });

        parentLi.classList.toggle('active', !isActive);
        subMenu.classList.toggle('show', !isActive);
        toggle.setAttribute('aria-expanded', String(!isActive));
        console.log(`DEBUG: Toggled mobile dropdown (delegated) for: ${toggle.textContent.trim()}. Active: ${!isActive}`);
    });


    // --- Desktop Dropdown (Hover/Focus - Delegated JS) ---
    let leaveTimeout = null;

    headerElement.addEventListener('mouseover', function(event) {
        if (window.innerWidth <= 992) return;
        const dropdownLi = event.target.closest('.nav-tabs > li.dropdown');
        if (dropdownLi) {
            clearTimeout(leaveTimeout);
            closeOtherDesktopDropdowns(dropdownLi);
            dropdownLi.classList.add('show-desktop-dropdown');
            dropdownLi.querySelector(':scope > a.dropdown-toggle')?.setAttribute('aria-expanded', 'true');
        }
    });

    headerElement.addEventListener('mouseout', function(event) {
        if (window.innerWidth <= 992) return;
        const dropdownLi = event.target.closest('.nav-tabs > li.dropdown');
        if (dropdownLi) {
            leaveTimeout = setTimeout(() => {
                 const isHoveringLi = dropdownLi.matches(':hover');
                 const subMenu = dropdownLi.querySelector(':scope > .dropdown-menu');
                 const isHoveringSubMenu = subMenu ? subMenu.matches(':hover') : false;
                if (!isHoveringLi && !isHoveringSubMenu) {
                    dropdownLi.classList.remove('show-desktop-dropdown');
                     dropdownLi.querySelector(':scope > a.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
                }
            }, 150);
        }
    });

    headerElement.addEventListener('mouseover', function(event) {
        if (window.innerWidth <= 992) return;
        const submenuLi = event.target.closest('.dropdown-menu > li.dropdown-submenu');
        if (submenuLi) {
            submenuLi.classList.add('show-desktop-dropdown');
            submenuLi.querySelector(':scope > a.dropdown-toggle')?.setAttribute('aria-expanded', 'true');
        }
    });
    headerElement.addEventListener('mouseout', function(event) {
        if (window.innerWidth <= 992) return;
        const submenuLi = event.target.closest('.dropdown-menu > li.dropdown-submenu');
         if (submenuLi) {
             submenuLi.classList.remove('show-desktop-dropdown');
             submenuLi.querySelector(':scope > a.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
         }
    });

    document.addEventListener('click', function(event) {
         // Cần kiểm tra headerElement có tồn tại không trước khi dùng contains
        if (window.innerWidth > 992 && headerElement && !headerElement.contains(event.target)) {
            closeOtherDesktopDropdowns(null);
        }
    });

    // Cập nhật link active khi menu đã được tải
    setActiveNavLink();

    console.log("DEBUG: Delegated menu events initialized.");
}

// Hàm đóng tất cả các dropdown desktop khác
function closeOtherDesktopDropdowns(exceptElement) {
    // Tìm bên trong placeholder đã được tải nội dung
    const headerContent = document.getElementById('header-placeholder')?.firstElementChild;
    if (!headerContent) return;
    const openDropdowns = headerContent.querySelectorAll('.nav-tabs li.show-desktop-dropdown');
    openDropdowns.forEach(item => {
        if (item !== exceptElement) {
            item.classList.remove('show-desktop-dropdown');
             item.querySelector(':scope > a.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
             item.querySelectorAll('.dropdown-submenu.show-desktop-dropdown').forEach(subItem => {
                 subItem.classList.remove('show-desktop-dropdown');
                 subItem.querySelector(':scope > a.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
             });
        }
    });
}

// Hàm đóng menu mobile
function closeMobileMenu() {
    // Tìm mobile menu bên trong header đã tải
    const mobileMenu = document.querySelector("#header-placeholder .mobile-menu");
    const overlay = document.querySelector(".overlay");
    if(mobileMenu) mobileMenu.classList.remove('active');
    if(overlay) overlay.classList.remove('active');
    document.body.classList.remove('mobile-menu-active');
     mobileMenu?.querySelectorAll('.mobile-nav-tabs li.active').forEach(li => {
        li.classList.remove('active');
        li.querySelector(':scope > .dropdown-menu')?.classList.remove('show');
        li.querySelector(':scope > a.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
    });
}


/**
 * Đánh dấu link điều hướng đang hoạt động.
 */
function setActiveNavLink() {
    // Tìm bên trong placeholder đã được tải nội dung
    const headerContent = document.querySelector('#header-placeholder header, #header-placeholder .header-container'); // Tìm thẻ header hoặc container bên trong
    if (!headerContent) {
        console.warn("DEBUG: Header content not found for setActiveNavLink.");
        return;
    }

    // Đợi một chút để đảm bảo DOM hoàn chỉnh sau khi nhúng header
    // setTimeout(() => {
        const navLinks = headerContent.querySelectorAll('.nav-tabs a:not(.dropdown-toggle), .mobile-nav-tabs a:not(.dropdown-toggle)');
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const currentFullPath = window.location.pathname; // Lấy cả đường dẫn đầy đủ

        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (!linkHref) return;

            // So sánh đường dẫn tuyệt đối hoặc tên tệp
            const linkPath = linkHref.startsWith('/') ? linkHref : (linkHref.split('/').pop() || 'index.html');
            const linkFullPath = linkHref.startsWith('/') ? linkHref : `/${linkHref}`; // Tạo đường dẫn tuyệt đối giả định

            link.classList.remove('active'); // Xóa active cũ

            // Ưu tiên so sánh đường dẫn đầy đủ, sau đó đến tên tệp
            if (linkFullPath === currentFullPath || (!currentFullPath.endsWith('/') && linkPath === currentPath)) {
                link.classList.add('active');
                console.log(`DEBUG: Active link set for: ${linkHref}`);

                // Đánh dấu active cho menu cha (dropdown)
                const parentDropdownLi = link.closest('li.dropdown');
                parentDropdownLi?.querySelector(':scope > a.dropdown-toggle')?.classList.add('active');

                 // Đánh dấu active cho submenu cha (nếu có)
                 const parentSubmenuLi = link.closest('li.dropdown-submenu');
                 parentSubmenuLi?.querySelector(':scope > a.dropdown-toggle')?.classList.add('active');
                 // Và cả dropdown cấp 1 chứa submenu đó
                 parentSubmenuLi?.closest('li.dropdown')?.querySelector(':scope > a.dropdown-toggle')?.classList.add('active');
            }
        });
    // }, 100); // Chờ 100ms
}

/**
 * Khởi tạo đồng hồ đếm ngược và chuyển hướng (nếu có các phần tử).
 */
function startRedirectCountdown() {
    console.log("DEBUG: Attempting to start redirect countdown...");
    const redirectUrl = "https://facebook.com/hr.ivsacademy";
    const countdownDuration = 120;
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
 * Chỉ chạy nếu tìm thấy container '#latest-posts-container'.
 */
async function loadLatestPosts() {
    const postsContainer = document.getElementById('latest-posts-container');
    if (!postsContainer) {
        // console.log("DEBUG: Posts container #latest-posts-container not found on this page.");
        return; // Không làm gì nếu không có container này
    }
    console.log("DEBUG: Loading latest posts...");
    // postsContainer.innerHTML = '<p class="loading-placeholder" style="text-align: center; padding: 20px; color: #888;">Đang tải tin nổi bật...</p>';

    try {
        const response = await fetch('/posts.json'); // Giả định posts.json ở gốc
        if (!response.ok) {
            throw new Error(`Không thể tải file posts.json (Status: ${response.status})`);
        }
        const posts = await response.json();
        console.log("DEBUG: Latest posts data fetched:", posts);

        if (!Array.isArray(posts)) {
             throw new Error("Dữ liệu posts.json không phải là một mảng.");
        }

        postsContainer.innerHTML = ''; // Xóa placeholder

        if (posts.length === 0) {
            postsContainer.innerHTML = '<p class="no-posts" style="text-align: center; color: #888; padding: 20px;">Hiện chưa có tin nổi bật nào.</p>';
            console.log("DEBUG: No latest posts found.");
            return;
        }

        // Sắp xếp và lấy bài mới nhất (ví dụ: 3 bài)
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        const latestPosts = posts.slice(0, 3);

        latestPosts.forEach((post, index) => {
            if (!post || typeof post !== 'object') {
                console.warn(`DEBUG: Invalid post data at index ${index}. Skipping.`);
                return;
            }
            const postElement = createPostElement(post); // Sử dụng hàm tạo phần tử
            postsContainer.appendChild(postElement);
        });
        console.log("DEBUG: Latest post elements created and appended.");

    } catch (error) {
        console.error('DEBUG: Lỗi khi tải hoặc xử lý bài viết mới nhất:', error);
        postsContainer.innerHTML = `<p class="error" style="text-align: center; color: red; padding: 20px;">Không thể tải tin nổi bật. (${error.message})</p>`;
    }
}

/**
 * Tạo phần tử HTML cho một bài viết (Dùng chung cho cả featured và latest).
 * @param {object} post Dữ liệu bài viết.
 * @returns {HTMLElement} Phần tử div.post-card.
 */
function createPostElement(post) {
    const postDiv = document.createElement('div');
    // Sử dụng class .post-card thay vì .post-preview để nhất quán
    postDiv.className = 'post-card';
    const fallbackImage = 'https://placehold.co/600x400/eee/ccc?text=IVS+Post';
    // Sử dụng đường dẫn tuyệt đối cho ảnh nếu cần
    const imageUrl = post.image ? (post.image.startsWith('/') ? post.image : '/' + post.image) : fallbackImage;
    const postUrl = post.url || '#';
    const title = post.title || 'Tiêu đề bài viết';
    const excerpt = post.excerpt || 'Nội dung tóm tắt...';
    const postDate = post.date ? new Date(post.date).toLocaleDateString('vi-VN') : 'Không rõ';

    postDiv.innerHTML = `
        <img src="${imageUrl}" alt="${title}" loading="lazy" onerror="this.onerror=null; this.src='${fallbackImage}'; console.warn('DEBUG: Image failed to load, using fallback: ${imageUrl}')">
        <div class="post-content">
            <h3><a href="${postUrl}">${title}</a></h3>
            <p class="post-meta">Ngày đăng: ${postDate}</p>
            <p>${excerpt}</p>
            <a href="${postUrl}" class="read-more">Đọc thêm</a>
        </div>`;
    return postDiv;
}


// --- Chạy các hàm khởi tạo khi DOM sẵn sàng ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DEBUG: DOM fully loaded. Starting dynamic load setup.");

    // Đảm bảo có phần tử overlay
    if (!document.querySelector('.overlay')) {
        const overlayDiv = document.createElement('div');
        overlayDiv.className = 'overlay';
        document.body.appendChild(overlayDiv);
        console.log("DEBUG: Overlay created.");
    }

    // Tải header và footer động
    Promise.all([
        loadComponent('header.html', 'header-placeholder'),
        loadComponent('footer.html', 'footer-placeholder')
    ]).then(([headerLoaded, footerLoaded]) => {
        console.log("DEBUG: Header and Footer loading promises resolved.");
        // Chỉ khởi tạo menu nếu header thực sự được tải vào DOM
        if (headerLoaded) {
             // Đợi một chút để trình duyệt render xong header rồi mới gắn event
             // setTimeout(initializeMenuEventsDelegation, 50); // Thử bỏ timeout
             initializeMenuEventsDelegation();
        } else {
            console.error("DEBUG: Header component failed to load, cannot initialize menu.");
        }

        // Tải bài viết mới nhất (nếu có container) sau khi header/footer xong
        // Việc này đảm bảo layout không bị nhảy khi bài viết tải
        loadLatestPosts();

    }).catch(error => {
        console.error("DEBUG: Critical error during component loading. Menu or other features might be broken.", error);
        // Có thể hiển thị thông báo lỗi chung cho người dùng ở đây nếu muốn
    });

    // Khởi tạo các chức năng không phụ thuộc header/footer
    startRedirectCountdown();

    console.log("DEBUG: Initial dynamic load setup sequence started.");
});
