/**
 * Hàm tải nội dung HTML từ một URL và chèn vào phần tử có ID chỉ định.
 * @param {string} url Đường dẫn đến file HTML cần tải.
 * @param {string} elementId ID của phần tử HTML nơi nội dung sẽ được chèn.
 * @returns {Promise<void>} Promise hoàn thành khi nội dung được tải và chèn thành công, hoặc bị từ chối nếu có lỗi.
 */
function loadComponent(url, elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`DEBUG: Element with ID "${elementId}" not found.`);
        document.body.insertAdjacentHTML('afterbegin', `<div style="color: red; background: yellow; padding: 10px; text-align: center; position: fixed; top: 0; left: 0; width: 100%; z-index: 9999;">Lỗi nghiêm trọng: Không tìm thấy phần tử #${elementId} để tải component ${url}.</div>`);
        return Promise.reject(`Element with ID "${elementId}" not found.`);
    }
    element.innerHTML = `<p style="text-align: center; padding: 20px; color: #888;">Đang tải ${elementId}...</p>`;
    console.log(`DEBUG: Loading component ${url} into #${elementId}`);

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Không thể tải ${url}. Status: ${response.status} ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            element.innerHTML = data;
            console.log(`DEBUG: Component ${elementId} loaded successfully.`);
            if (elementId === 'header') {
                requestAnimationFrame(() => {
                    initializeMenuEvents(); // Gọi khởi tạo menu sau khi header tải xong
                });
            }
        })
        .catch(error => {
            console.error(`DEBUG: Lỗi khi tải ${elementId} từ ${url}:`, error);
            element.innerHTML = `<div style="text-align: center; padding: 20px; color: red; border: 1px solid red; border-radius: 5px; background: #ffebeb;">Lỗi khi tải ${elementId}. (${error.message}). Vui lòng kiểm tra đường dẫn hoặc kết nối mạng.</div>`;
            throw error;
        });
}

/**
 * Khởi tạo các sự kiện cho menu (desktop dropdown và mobile hamburger).
 */
function initializeMenuEvents() {
    console.log("DEBUG: Initializing menu events...");

    // --- Mobile Menu Toggle ---
    const hamburger = document.querySelector(".hamburger");
    const mobileMenu = document.querySelector(".mobile-menu");
    const closeMenu = document.querySelector(".close-menu");
    const overlay = document.querySelector(".overlay");

    if (hamburger && mobileMenu && closeMenu && overlay) {
        console.log("DEBUG: Mobile menu elements found. Attaching listeners.");
        hamburger.addEventListener('click', (event) => {
            event.stopPropagation();
            mobileMenu.classList.add('active');
            overlay.classList.add('active');
            document.body.classList.add('mobile-menu-active');
        });

        const closeMobileMenu = () => {
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('mobile-menu-active');
            // Đóng tất cả submenu mobile khi đóng menu chính
            mobileMenu.querySelectorAll('.mobile-nav-tabs li.active').forEach(li => {
                li.classList.remove('active');
                li.querySelector(':scope > .dropdown-menu')?.classList.remove('show');
                li.querySelector(':scope > a')?.setAttribute('aria-expanded', 'false');
            });
        };

        closeMenu.addEventListener('click', closeMobileMenu);
        overlay.addEventListener('click', closeMobileMenu);

        // --- Mobile Dropdown (Accordion) Logic ---
        const mobileDropdownToggles = mobileMenu.querySelectorAll('.mobile-nav-tabs li > a.dropdown-toggle');
        mobileDropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                if (this.getAttribute('href') === '#' || !this.getAttribute('href')) {
                    e.preventDefault();
                } else {
                    closeMobileMenu();
                    return;
                }
                const parentLi = this.closest('li.dropdown, li.dropdown-submenu');
                if (!parentLi) return;
                const subMenu = parentLi.querySelector(':scope > .dropdown-menu');
                if (!subMenu) return;
                const isActive = parentLi.classList.contains('active');
                // Đóng siblings
                const parentUl = parentLi.parentElement;
                const siblingLis = parentUl.querySelectorAll(':scope > li.active');
                siblingLis.forEach(li => {
                    if (li !== parentLi) {
                        li.classList.remove('active');
                        li.querySelector(':scope > .dropdown-menu')?.classList.remove('show');
                        li.querySelector(':scope > a')?.setAttribute('aria-expanded', 'false');
                    }
                });
                // Toggle current
                parentLi.classList.toggle('active', !isActive);
                subMenu.classList.toggle('show', !isActive);
                this.setAttribute('aria-expanded', !isActive);
            });
        });
        // Đóng menu khi bấm link thường
        const nonDropdownLinks = mobileMenu.querySelectorAll('.mobile-nav-tabs a:not(.dropdown-toggle)');
        nonDropdownLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

    } else {
        console.warn("DEBUG: Could not initialize mobile menu interactions. Missing elements.");
    }

    // --- Desktop Dropdown (Hover/Focus - JS Controlled) ---
    const desktopNavTabs = document.querySelector(".nav-tabs"); // Chọn container của nav desktop
    if (desktopNavTabs) {
        const desktopDropdownItems = desktopNavTabs.querySelectorAll('li.dropdown'); // Chọn các mục li có dropdown

        desktopDropdownItems.forEach(item => {
            // Sử dụng mouseenter/mouseleave để kiểm soát hover
            item.addEventListener('mouseenter', function() {
                // Chỉ thực hiện nếu là màn hình desktop
                if (window.innerWidth > 992) {
                    this.classList.add('show-desktop-dropdown');
                    const menu = this.querySelector('.dropdown-menu');
                    if(menu) menu.style.display = 'block'; // Đảm bảo display block trước khi transition
                    // requestAnimationFrame(() => { // Đảm bảo display đã áp dụng
                    //     this.classList.add('show-desktop-dropdown');
                    // });
                }
            });

            item.addEventListener('mouseleave', function() {
                if (window.innerWidth > 992) {
                     // Thêm độ trễ nhỏ trước khi ẩn để cho phép di chuột vào menu con
                    setTimeout(() => {
                        // Kiểm tra lại xem chuột có còn trên item hoặc menu con không
                        if (!item.matches(':hover')) {
                             this.classList.remove('show-desktop-dropdown');
                        }
                    }, 100); // 100ms delay
                }
            });

            // Thêm xử lý focus/blur cho khả năng truy cập bằng bàn phím (tùy chọn)
            const mainLink = item.querySelector(':scope > a');
            const subLinks = item.querySelectorAll('.dropdown-menu a');

            mainLink?.addEventListener('focus', () => {
                 if (window.innerWidth > 992) {
                    item.classList.add('show-desktop-dropdown');
                 }
            });

            // Khi focus rời khỏi mục cuối cùng trong dropdown, ẩn nó đi
            if (subLinks.length > 0) {
                subLinks[subLinks.length - 1].addEventListener('blur', () => {
                     // Dùng setTimeout để kiểm tra xem focus có chuyển sang mục khác trong cùng dropdown không
                     setTimeout(() => {
                        if (!item.contains(document.activeElement)) {
                             item.classList.remove('show-desktop-dropdown');
                        }
                    }, 0);
                });
            } else {
                 mainLink?.addEventListener('blur', () => {
                     setTimeout(() => {
                        if (!item.contains(document.activeElement)) {
                             item.classList.remove('show-desktop-dropdown');
                        }
                    }, 0);
                 });
            }


        });

         // Đóng dropdown desktop khi click ra ngoài
         document.addEventListener('click', function(event) {
            if (window.innerWidth > 992) { // Chỉ áp dụng cho desktop
                desktopDropdownItems.forEach(item => {
                    if (!item.contains(event.target)) {
                        item.classList.remove('show-desktop-dropdown');
                    }
                });
            }
        });


    } else {
        console.warn("DEBUG: Desktop nav tabs container (.nav-tabs) not found.");
    }

    console.log("DEBUG: Menu events initialization complete.");
}


// --- Các hàm khác (startRedirectCountdown, loadPosts, createPostElement, initCarousel, cleanupCarousel, handleResize) giữ nguyên như phiên bản trước ---

/**
 * Khởi tạo đồng hồ đếm ngược và chuyển hướng.
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
            redirectTimerContainer.innerHTML = '<p style="color: red;">Lỗi: Không tìm thấy phần tử hiển thị thời gian.</p>';
            return;
        }

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
 * Tải và hiển thị các bài viết nổi bật từ posts.json.
 */
async function loadPosts() {
    const postListElement = document.getElementById('post-list');
    const carouselControls = document.querySelector('.carousel-controls');

    if (!postListElement) {
        console.log("DEBUG: Post list element #post-list not found, skipping post loading.");
        return;
    }
    console.log("DEBUG: Loading posts...");
    postListElement.innerHTML = '<p style="text-align: center; color: #888; padding: 20px;">Đang tải bài viết...</p>';
    if (carouselControls) carouselControls.style.display = 'none';


    try {
        const response = await fetch('posts.json');
        if (!response.ok) {
            throw new Error(`Không thể tải file posts.json (Status: ${response.status})`);
        }
        const posts = await response.json();
        console.log("DEBUG: Posts data fetched:", posts);

        if (!Array.isArray(posts)) {
             throw new Error("Dữ liệu posts.json không phải là một mảng.");
        }

        postListElement.innerHTML = '';

        if (posts.length === 0) {
            postListElement.innerHTML = '<p class="no-posts" style="text-align: center; color: #888; padding: 20px;">Hiện chưa có bài viết nổi bật nào.</p>';
            console.log("DEBUG: No posts found.");
            if (carouselControls) carouselControls.style.display = 'none';
            return;
        }

        posts.forEach((post, index) => {
            if (!post || typeof post !== 'object') {
                console.warn(`DEBUG: Invalid post data at index ${index}. Skipping.`);
                return;
            }
            const postElement = createPostElement(post);
            postListElement.appendChild(postElement);
        });
        console.log("DEBUG: Post elements created and appended.");

        handleResize();

    } catch (error) {
        console.error('DEBUG: Lỗi khi tải hoặc xử lý bài viết:', error);
        postListElement.innerHTML = `<p class="error" style="text-align: center; color: red; padding: 20px;">Không thể tải danh sách bài viết. (${error.message})</p>`;
        if (carouselControls) carouselControls.style.display = 'none';
    }
}

/**
 * Tạo phần tử HTML cho một bài viết.
 * @param {object} post Dữ liệu bài viết.
 * @returns {HTMLElement} Phần tử div.post-preview.
 */
function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post-preview';
    const fallbackImage = 'https://placehold.co/400x250/cccccc/ffffff?text=IVS+Image';
    const imageUrl = post.image || fallbackImage;
    const postUrl = post.url || '#';
    const title = post.title || 'Tiêu đề bài viết';
    const excerpt = post.excerpt || 'Nội dung tóm tắt...';
    postDiv.innerHTML = `
        <div class="post-image">
            <img src="${imageUrl}" alt="${title}" loading="lazy" onerror="this.onerror=null; this.src='${fallbackImage}'; console.warn('DEBUG: Image failed to load, using fallback: ${imageUrl}')">
            ${post.hot ? '<span class="hot-label">HOT</span>' : ''}
        </div>
        <div class="post-content">
            <h3><a href="${postUrl}">${title}</a></h3>
            <p>${excerpt}</p>
            <a href="${postUrl}" class="view-more">Xem thêm</a>
        </div>`;
    return postDiv;
}

/**
 * Khởi tạo chức năng carousel cho danh sách bài viết trên desktop.
 */
let slideIntervalId = null;
let carouselInitialized = false;
let handlePrevClick, handleNextClick, handleMouseEnter, handleMouseLeave; // Khai báo ở scope rộng hơn

function initCarousel() {
    // ... (Giữ nguyên nội dung hàm initCarousel từ phiên bản trước) ...
    if (carouselInitialized) { return; }
    console.log("DEBUG: Attempting to initialize carousel...");
    const postList = document.getElementById('post-list');
    const posts = postList?.querySelectorAll('.post-preview');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    const carouselControls = document.querySelector('.carousel-controls');
    if (slideIntervalId) { clearInterval(slideIntervalId); slideIntervalId = null; }
    if (!postList || !posts || posts.length <= 1 || !prevBtn || !nextBtn || !carouselControls) {
        if (carouselControls) carouselControls.style.display = 'none';
        if (posts && posts.length === 1) {
             posts[0].style.transform = 'translateX(0%)'; posts[0].style.position = 'relative';
             postList.style.height = 'auto'; postList.style.minHeight = '';
        }
        carouselInitialized = false; return;
    }
    console.log("DEBUG: Initializing carousel with", posts.length, "posts.");
    carouselControls.style.display = 'flex'; carouselInitialized = true;
    let currentIndex = 0; const totalPosts = posts.length;
    postList.style.display = 'block'; postList.style.position = 'relative';
    postList.style.overflow = 'hidden'; postList.style.minHeight = '250px'; postList.style.height = '';
    posts.forEach((post, index) => {
        post.style.position = 'absolute'; post.style.width = '100%'; post.style.height = '100%';
        post.style.top = '0'; post.style.left = '0'; post.style.transform = `translateX(${index * 100}%)`;
        post.style.transition = 'transform 0.5s ease'; post.style.opacity = '1';
    });
    function showSlide(index) {
        currentIndex = (index + totalPosts) % totalPosts;
        posts.forEach((post, i) => { post.style.transform = `translateX(${(i - currentIndex) * 100}%)`; });
    }
    handlePrevClick = () => { showSlide(currentIndex - 1); resetInterval(); };
    handleNextClick = () => { showSlide(currentIndex + 1); resetInterval(); };
    prevBtn.removeEventListener('click', handlePrevClick); prevBtn.addEventListener('click', handlePrevClick);
    nextBtn.removeEventListener('click', handleNextClick); nextBtn.addEventListener('click', handleNextClick);
    function resetInterval() {
        clearInterval(slideIntervalId);
        slideIntervalId = setInterval(() => { showSlide(currentIndex + 1); }, 5000);
    }
    handleMouseEnter = () => { clearInterval(slideIntervalId); };
    handleMouseLeave = () => { resetInterval(); };
    postList.removeEventListener('mouseenter', handleMouseEnter); postList.addEventListener('mouseenter', handleMouseEnter);
    postList.removeEventListener('mouseleave', handleMouseLeave); postList.addEventListener('mouseleave', handleMouseLeave);
    showSlide(0); resetInterval(); console.log("DEBUG: Carousel initialized successfully.");
}

/**
 * Dọn dẹp carousel (xóa style, gỡ bỏ event listener, dừng interval).
 */
function cleanupCarousel() {
    // ... (Giữ nguyên nội dung hàm cleanupCarousel từ phiên bản trước) ...
    if (!carouselInitialized) return; console.log("DEBUG: Cleaning up carousel...");
    const postList = document.getElementById('post-list');
    const posts = postList?.querySelectorAll('.post-preview');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    const carouselControls = document.querySelector('.carousel-controls');
    if (slideIntervalId) { clearInterval(slideIntervalId); slideIntervalId = null; }
    if (prevBtn && handlePrevClick) prevBtn.removeEventListener('click', handlePrevClick);
    if (nextBtn && handleNextClick) nextBtn.removeEventListener('click', handleNextClick);
    if (postList) {
         if (handleMouseEnter) postList.removeEventListener('mouseenter', handleMouseEnter);
         if (handleMouseLeave) postList.removeEventListener('mouseleave', handleMouseLeave);
    }
    if (postList) { postList.style.position = ''; postList.style.overflow = ''; postList.style.height = ''; postList.style.minHeight = ''; postList.style.display = ''; }
    if (posts) { posts.forEach(post => { post.style.position = ''; post.style.width = ''; post.style.height = ''; post.style.top = ''; post.style.left = ''; post.style.transform = ''; post.style.transition = ''; post.style.opacity = ''; }); }
    if (carouselControls) carouselControls.style.display = 'none';
    carouselInitialized = false; console.log("DEBUG: Carousel cleanup complete.");
}

/**
 * Xử lý thay đổi kích thước màn hình để chuyển đổi giữa carousel và grid.
 */
function handleResize() {
    // ... (Giữ nguyên nội dung hàm handleResize từ phiên bản trước) ...
    console.log("DEBUG: Handling resize event. Window width:", window.innerWidth);
    const postList = document.getElementById('post-list'); if (!postList) return;
    const isMobileView = window.innerWidth <= 768;
    if (isMobileView) {
        console.log("DEBUG: Mobile view detected in resize.");
        cleanupCarousel(); postList.classList.add('grid-layout'); postList.classList.remove('carousel-layout');
    } else {
        console.log("DEBUG: Desktop view detected in resize.");
        postList.classList.remove('grid-layout'); postList.classList.add('carousel-layout');
        const currentPosts = postList.querySelectorAll('.post-preview');
        if (!carouselInitialized && currentPosts.length > 1) { initCarousel(); }
        else if (currentPosts.length <= 1) { cleanupCarousel(); }
    }
}


// --- Chạy các hàm khởi tạo khi DOM sẵn sàng ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DEBUG: DOM fully loaded. Starting initial setup.");
    if (!document.querySelector('.overlay')) {
        const overlayDiv = document.createElement('div');
        overlayDiv.className = 'overlay';
        document.body.appendChild(overlayDiv);
    }
    Promise.all([
        loadComponent('header.html', 'header'), // Tải header trước
        loadComponent('footer.html', 'footer')
    ]).then(() => {
        console.log("DEBUG: Header and Footer loading process finished successfully.");
        // initializeMenuEvents() ĐÃ ĐƯỢC GỌI TRONG loadComponent('header.html')
        startRedirectCountdown();
        loadPosts(); // Tải posts sau khi header/footer xong
        window.removeEventListener('resize', handleResize); // Gỡ listener cũ
        window.addEventListener('resize', handleResize); // Gắn listener mới
    }).catch(error => {
        console.error("DEBUG: Critical error during initial component loading.", error);
    });
    console.log("DEBUG: Initial setup sequence started.");
});
