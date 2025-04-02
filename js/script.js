// Hàm tải nội dung header và footer một cách an toàn
function loadComponent(url, elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`DEBUG: Element with ID "${elementId}" not found.`);
        return Promise.reject(`Element with ID "${elementId}" not found.`);
    }
    element.innerHTML = `<p style="text-align: center; padding: 20px; color: #888;">Đang tải ${elementId}...</p>`;
    console.log(`DEBUG: Loading component ${url} into #${elementId}`);

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Không thể tải ${url}. Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            element.innerHTML = data;
            console.log(`DEBUG: Component ${elementId} loaded successfully.`);
            // Nếu là header, khởi tạo sự kiện menu sau khi tải xong
            if (elementId === 'header') {
                // Đảm bảo DOM đã cập nhật hoàn toàn trước khi gắn sự kiện
                requestAnimationFrame(() => {
                    initializeMenuEvents();
                });
            }
        })
        .catch(error => {
            console.error(`DEBUG: Lỗi khi tải ${elementId}:`, error);
            element.innerHTML = `<div style="text-align: center; padding: 20px; color: red; border: 1px solid red; border-radius: 5px;">Lỗi khi tải ${elementId}. Vui lòng kiểm tra đường dẫn hoặc kết nối mạng.</div>`;
        });
}

// Khởi tạo các sự kiện cho menu (cả desktop và mobile)
function initializeMenuEvents() {
    console.log("DEBUG: Initializing menu events...");
    const hamburger = document.querySelector(".hamburger");
    const mobileMenu = document.querySelector(".mobile-menu"); // Đã sửa ở lần trước
    const closeMenu = document.querySelector(".close-menu");
    const overlay = document.querySelector(".overlay");
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    const submenuToggles = document.querySelectorAll('.dropdown-submenu > a');

    // Kiểm tra xem các phần tử có tồn tại không
    if (!hamburger) console.error("DEBUG: Hamburger button (.hamburger) not found.");
    if (!mobileMenu) console.error("DEBUG: Mobile menu element (.mobile-menu) not found.");
    if (!closeMenu) console.error("DEBUG: Close menu button (.close-menu) not found.");
    if (!overlay) console.error("DEBUG: Overlay element (.overlay) not found.");

    if (hamburger && mobileMenu && closeMenu && overlay) {
        console.log("DEBUG: Hamburger, Mobile Menu, Close Button, Overlay found. Attaching listeners.");
        // Mở menu mobile khi nhấn hamburger
        hamburger.addEventListener('click', (event) => {
            event.stopPropagation(); // Ngăn sự kiện click lan ra ngoài nếu cần
            console.log("DEBUG: Hamburger clicked!");
            mobileMenu.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            console.log("DEBUG: Mobile menu and overlay should be active.");
        });

        // Đóng menu mobile khi nhấn nút đóng
        closeMenu.addEventListener('click', () => {
            console.log("DEBUG: Close button clicked");
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Đóng menu mobile khi nhấn vào overlay
        overlay.addEventListener('click', () => {
            console.log("DEBUG: Overlay clicked");
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    } else {
        console.warn("DEBUG: Could not initialize mobile menu interactions because some elements are missing.");
    }

    // Xử lý dropdown (giữ nguyên logic đã sửa)
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#' || this.getAttribute('href') === 'javascript:void(0)') {
                e.preventDefault();
            }
            const parentLi = this.closest('li.dropdown, li.dropdown-submenu');
            if (!parentLi) return;
            const dropdownMenu = parentLi.querySelector(':scope > .dropdown-menu, :scope > .dropdown-submenu'); // Target menu con trực tiếp

            if (dropdownMenu) {
                const siblingMenus = parentLi.parentElement.querySelectorAll(':scope > li > .dropdown-menu, :scope > li > .dropdown-submenu');
                siblingMenus.forEach(menu => {
                    if (menu !== dropdownMenu && !menu.contains(dropdownMenu)) {
                         const li = menu.closest('li.dropdown, li.dropdown-submenu');
                         li?.classList.remove('active');
                         menu.classList.remove('show');
                         li?.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
                    }
                });

                const isCurrentlyActive = parentLi.classList.contains('active');
                parentLi.classList.toggle('active', !isCurrentlyActive);
                dropdownMenu.classList.toggle('show', !isCurrentlyActive);
                this.setAttribute('aria-expanded', !isCurrentlyActive);
                console.log(`DEBUG: Toggled dropdown for: ${this.textContent.trim()}. Active: ${!isCurrentlyActive}`);
            } else {
                 console.log(`DEBUG: No dropdown menu found for: ${this.textContent.trim()}`);
            }
        });
    });

    // Đóng dropdown khi click ra ngoài (cho desktop)
    document.addEventListener('click', function(event) {
        if (window.innerWidth > 992) {
            const openDropdown = document.querySelector('.nav-tabs .dropdown.active');
            if (openDropdown && !openDropdown.contains(event.target)) {
                openDropdown.classList.remove('active');
                const menu = openDropdown.querySelector('.dropdown-menu');
                if (menu) menu.classList.remove('show');
                const toggle = openDropdown.querySelector('.dropdown-toggle');
                if (toggle) toggle.setAttribute('aria-expanded', 'false');
                console.log("DEBUG: Closed dropdown on outside click (desktop).");
            }
        }
    });

    console.log("DEBUG: Menu events initialization complete.");
}

// Redirect timer logic (chỉ chạy nếu các phần tử tồn tại)
function startRedirectCountdown() {
    console.log("DEBUG: Attempting to start redirect countdown...");
    const redirectUrl = "https://facebook.com/hr.ivsacademy"; // Đường dẫn chính xác
    const countdownDuration = 120; // 120 giây
    const redirectTimerContainer = document.getElementById('redirect-timer'); // Container div
    const cancelButton = document.getElementById("cancel-redirect");

    if (redirectTimerContainer && cancelButton) {
        console.log("DEBUG: Redirect timer elements found.");
        const timerDisplayElement = redirectTimerContainer.querySelector('p'); // Tìm thẻ <p> bên trong

        if (!timerDisplayElement) {
            console.error("DEBUG: Timer display paragraph (<p>) inside #redirect-timer not found.");
            return; // Dừng nếu không tìm thấy thẻ p
        }

        let timeLeft = countdownDuration;
        let redirectTimeoutId = null;

        const updateTimer = () => {
            console.log(`DEBUG: Timer update. Time left: ${timeLeft}`);
            if (timeLeft <= 0) {
                clearInterval(redirectTimeoutId);
                console.log("DEBUG: Timer finished.");
                if (!cancelButton.disabled) {
                    console.log(`DEBUG: Redirecting to ${redirectUrl}`);
                    window.location.href = redirectUrl;
                } else {
                    console.log("DEBUG: Redirect cancelled, not redirecting.");
                }
            } else {
                 timerDisplayElement.textContent = `Website sẽ tự động chuyển đến Fanpage IVS Academy trong ${Math.floor(timeLeft / 60)} phút ${timeLeft % 60} giây...`;
                timeLeft--;
            }
        };

        updateTimer(); // Gọi lần đầu
        redirectTimeoutId = setInterval(updateTimer, 1000); // Bắt đầu interval
        console.log("DEBUG: Redirect timer started.");

        cancelButton.addEventListener("click", () => {
            clearInterval(redirectTimeoutId);
            cancelButton.textContent = "Đã hủy chuyển hướng";
            cancelButton.disabled = true;
            timerDisplayElement.textContent = "Chuyển hướng đã bị hủy.";
            console.log("DEBUG: Redirect cancelled by user.");
        });
    } else {
        if (!redirectTimerContainer) console.log("DEBUG: Redirect timer container (#redirect-timer) not found.");
        if (!cancelButton) console.log("DEBUG: Cancel redirect button (#cancel-redirect) not found.");
        console.log("DEBUG: Redirect countdown initialization skipped.");
    }
}


// Load và hiển thị bài viết nổi bật (giữ nguyên logic đã sửa)
async function loadPosts() {
    const postListElement = document.getElementById('post-list');
    if (!postListElement) {
        console.log("DEBUG: Post list element #post-list not found, skipping post loading.");
        return;
    }
    console.log("DEBUG: Loading posts...");

    try {
        const response = await fetch('posts.json');
        if (!response.ok) throw new Error('Không thể tải file posts.json');
        const posts = await response.json();
        console.log("DEBUG: Posts data fetched:", posts);

        if (!Array.isArray(posts) || posts.length === 0) {
            postListElement.innerHTML = '<p class="no-posts" style="text-align: center; color: #888;">Hiện chưa có bài viết nổi bật nào.</p>';
            console.log("DEBUG: No posts found or invalid data format.");
            return;
        }

        postListElement.innerHTML = ''; // Xóa nội dung cũ

        posts.forEach((post, index) => {
             // Kiểm tra dữ liệu post cơ bản
             if (!post || typeof post !== 'object') {
                 console.warn(`DEBUG: Invalid post data at index ${index}. Skipping.`);
                 return; // Bỏ qua bài viết không hợp lệ
             }
             const postElement = createPostElement(post);
             postListElement.appendChild(postElement);
         });
        console.log("DEBUG: Post elements created and appended.");

        // Khởi tạo carousel hoặc grid layout
        handleResize(); // Gọi handleResize để áp dụng layout đúng

    } catch (error) {
        console.error('DEBUG: Lỗi khi tải hoặc xử lý bài viết:', error);
        postListElement.innerHTML = '<p class="error" style="text-align: center; color: red;">Không thể tải danh sách bài viết. Vui lòng thử lại sau.</p>';
    }
}


// Hàm tạo phần tử HTML cho một bài viết (giữ nguyên logic đã sửa)
function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post-preview';

    const fallbackImage = 'images/fallback.jpg';
    const imageUrl = post.image || fallbackImage;
    const postUrl = post.url || '#'; // Đảm bảo luôn có href
    const title = post.title || 'Tiêu đề bài viết';
    const excerpt = post.excerpt || 'Nội dung tóm tắt...';

    postDiv.innerHTML = `
        <div class="post-image">
            <img src="${imageUrl}"
                 alt="${title}"
                 loading="lazy"
                 onerror="this.onerror=null; this.src='${fallbackImage}'; console.warn('DEBUG: Image failed to load: ${imageUrl}')">
            ${post.hot ? '<span class="hot-label">HOT</span>' : ''}
        </div>
        <div class="post-content">
            <h3><a href="${postUrl}">${title}</a></h3>
            <p>${excerpt}</p>
            <a href="${postUrl}" class="view-more">Xem thêm</a>
        </div>
    `;
    // console.log(`DEBUG: Created post element for: ${title}`);
    return postDiv;
}


// Khởi tạo carousel (chỉ cho desktop - giữ nguyên logic đã sửa)
function initCarousel() {
    console.log("DEBUG: Attempting to initialize carousel...");
    const postList = document.getElementById('post-list');
    const posts = postList?.querySelectorAll('.post-preview'); // Lấy lại posts bên trong
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');

    // Dọn dẹp interval cũ nếu có
    if (window.slideIntervalId) {
        clearInterval(window.slideIntervalId);
        window.slideIntervalId = null;
        console.log("DEBUG: Cleared previous slide interval.");
    }

    if (!postList || !posts || posts.length <= 1 || !prevBtn || !nextBtn) {
        console.log(`DEBUG: Carousel initialization skipped. Reason: postList=${!!postList}, posts.length=${posts?.length}, prevBtn=${!!prevBtn}, nextBtn=${!!nextBtn}`);
        if(prevBtn) prevBtn.style.display = 'none';
        if(nextBtn) nextBtn.style.display = 'none';
        if (posts && posts.length === 1) {
             posts[0].style.transform = 'translateX(0%)';
             posts[0].style.position = 'relative';
             postList.style.height = 'auto';
        }
        return;
    }

    console.log("DEBUG: Initializing carousel with", posts.length, "posts.");
    prevBtn.style.display = 'flex'; // Đảm bảo nút hiển thị dạng flex
    nextBtn.style.display = 'flex';

    let currentIndex = 0;
    const totalPosts = posts.length;

    // Reset styles và định vị posts
    postList.style.display = 'block';
    postList.style.gridTemplateColumns = '';
    postList.style.gap = '';
    // Cần set chiều cao lại cho #post-list dựa trên nội dung hoặc CSS
    postList.style.minHeight = '250px'; // Giữ min-height từ CSS
    postList.style.height = ''; // Bỏ height cố định nếu có

    posts.forEach((post, index) => {
        post.style.position = 'absolute';
        post.style.width = '100%';
        post.style.height = '100%'; // Quan trọng: đảm bảo slide chiếm hết chiều cao container
        post.style.transform = `translateX(${index * 100}%)`;
        post.style.transition = 'transform 0.5s ease'; // Thêm transition
    });

    function showSlide(index) {
        if (index >= totalPosts) currentIndex = 0;
        else if (index < 0) currentIndex = totalPosts - 1;
        else currentIndex = index;

        // console.log(`DEBUG: Showing slide ${currentIndex}`);
        posts.forEach((post, i) => {
            post.style.transform = `translateX(${(i - currentIndex) * 100}%)`;
        });
    }

    prevBtn.onclick = () => {
        console.log("DEBUG: Prev button clicked.");
        showSlide(currentIndex - 1);
        resetInterval();
    };

    nextBtn.onclick = () => {
        console.log("DEBUG: Next button clicked.");
        showSlide(currentIndex + 1);
        resetInterval();
    };

    function resetInterval() {
        clearInterval(window.slideIntervalId);
        window.slideIntervalId = setInterval(() => {
            // console.log("DEBUG: Auto sliding to next...");
            showSlide(currentIndex + 1);
        }, 5000);
        // console.log("DEBUG: Slide interval reset/started.");
    }

    postList.addEventListener('mouseenter', () => {
        clearInterval(window.slideIntervalId);
        // console.log("DEBUG: Slide interval paused on hover.");
    });

    postList.addEventListener('mouseleave', () => {
        resetInterval();
        // console.log("DEBUG: Slide interval resumed on mouse leave.");
    });

    // Hiển thị slide đầu tiên
    showSlide(0);
    // Bắt đầu auto slide
    resetInterval();
    console.log("DEBUG: Carousel initialized successfully.");
}


// Điều chỉnh responsive cho carousel (giữ nguyên logic đã sửa)
function handleResize() {
    console.log("DEBUG: Handling resize event.");
    const postList = document.getElementById('post-list');
    if (!postList) return;

     // Dọn dẹp interval cũ khi resize
     if (window.slideIntervalId) {
        clearInterval(window.slideIntervalId);
        window.slideIntervalId = null;
        console.log("DEBUG: Cleared slide interval due to resize.");
    }

    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');

    if (window.innerWidth <= 768) {
        console.log("DEBUG: Mobile view detected in resize.");
        // Mobile view: Dọn dẹp carousel, chuyển sang grid/flex
        postList.style.display = 'grid';
        postList.style.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))';
        postList.style.gap = '15px';
        postList.style.height = 'auto';
        postList.style.overflow = 'visible'; // Đảm bảo hiển thị
        postList.style.position = 'static'; // Reset position
        const posts = postList.querySelectorAll('.post-preview');
        posts.forEach(post => {
            post.style.position = 'relative';
            post.style.transform = 'none';
            post.style.width = 'auto';
            post.style.height = 'auto';
            post.style.transition = ''; // Bỏ transition của carousel
        });
        if(prevBtn) prevBtn.style.display = 'none';
        if(nextBtn) nextBtn.style.display = 'none';
    } else {
        console.log("DEBUG: Desktop view detected in resize.");
        // Desktop view: Khởi tạo lại carousel
        // Cần đảm bảo các post đã được load xong trước khi gọi initCarousel
        if (postList.querySelectorAll('.post-preview').length > 0) {
             // Chỉ gọi initCarousel nếu layout hiện tại không phải là block (tránh gọi lại liên tục)
             if (postList.style.display !== 'block') {
                 initCarousel();
             }
        } else {
            console.log("DEBUG: Posts not ready yet for carousel re-initialization on resize.");
        }
    }
}

// Lắng nghe sự kiện resize
window.addEventListener('resize', handleResize);


// --- Chạy các hàm khởi tạo khi DOM sẵn sàng ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DEBUG: DOM fully loaded. Starting initial setup.");
    // Load header và footer, sau đó khởi tạo các chức năng khác
    Promise.all([
        loadComponent('header.html', 'header'),
        loadComponent('footer.html', 'footer')
    ]).then(() => {
        console.log("DEBUG: Header and Footer loading process finished.");
        // Các hàm này cần chạy sau khi header/footer đã chắc chắn load xong
        // initializeMenuEvents() đã được gọi trong callback của loadComponent header
        startRedirectCountdown(); // Khởi tạo đếm ngược
        // Load posts và áp dụng layout ban đầu
        loadPosts(); // loadPosts sẽ tự gọi handleResize bên trong nó sau khi load xong

    }).catch(error => {
        console.error("DEBUG: Error during initial component loading:", error);
    });
});
