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
        // Hiển thị lỗi trực tiếp trên trang nếu phần tử không tồn tại
        document.body.insertAdjacentHTML('afterbegin', `<div style="color: red; background: yellow; padding: 10px; text-align: center; position: fixed; top: 0; left: 0; width: 100%; z-index: 9999;">Lỗi nghiêm trọng: Không tìm thấy phần tử #${elementId} để tải component ${url}.</div>`);
        return Promise.reject(`Element with ID "${elementId}" not found.`);
    }
    // Hiển thị trạng thái đang tải
    element.innerHTML = `<p style="text-align: center; padding: 20px; color: #888;">Đang tải ${elementId}...</p>`;
    console.log(`DEBUG: Loading component ${url} into #${elementId}`);

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                // Ném lỗi cụ thể hơn
                throw new Error(`Không thể tải ${url}. Status: ${response.status} ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            // Chèn nội dung vào phần tử
            element.innerHTML = data;
            console.log(`DEBUG: Component ${elementId} loaded successfully.`);
        })
        .catch(error => {
            // Ghi log lỗi và hiển thị thông báo lỗi rõ ràng hơn trên trang
            console.error(`DEBUG: Lỗi khi tải ${elementId} từ ${url}:`, error);
            element.innerHTML = `<div style="text-align: center; padding: 20px; color: red; border: 1px solid red; border-radius: 5px; background: #ffebeb;">Lỗi khi tải ${elementId}. (${error.message}). Vui lòng kiểm tra đường dẫn hoặc kết nối mạng.</div>`;
            // Ném lại lỗi để Promise.all có thể bắt được
            throw error;
        });
}

/**
 * Khởi tạo các sự kiện cho menu (desktop dropdown và mobile hamburger).
 * Hàm này nên được gọi SAU KHI header đã được tải và chèn vào DOM thành công.
 */
function initializeMenuEvents() {
    console.log("DEBUG: Initializing menu events...");

    // --- Mobile Menu ---
    const hamburger = document.querySelector(".hamburger");
    const mobileMenu = document.querySelector(".mobile-menu"); // Sử dụng class đã có trong header.html
    const closeMenu = document.querySelector(".close-menu");
    const overlay = document.querySelector(".overlay"); // Giả sử có div.overlay trong HTML chính

    // Kiểm tra sự tồn tại của các phần tử mobile menu
    if (hamburger && mobileMenu && closeMenu && overlay) {
        console.log("DEBUG: Mobile menu elements found. Attaching listeners.");
        hamburger.addEventListener('click', (event) => {
            event.stopPropagation();
            console.log("DEBUG: Hamburger clicked!");
            mobileMenu.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Ngăn cuộn trang nền
        });

        closeMenu.addEventListener('click', () => {
            console.log("DEBUG: Close button clicked");
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = ''; // Cho phép cuộn lại
        });

        overlay.addEventListener('click', () => {
            console.log("DEBUG: Overlay clicked");
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = ''; // Cho phép cuộn lại
        });

        // Xử lý dropdown trong mobile menu (Accordion style)
        const mobileDropdownToggles = mobileMenu.querySelectorAll('.dropdown > .dropdown-toggle, .dropdown-submenu > a');
        mobileDropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                // Chỉ ngăn chặn hành vi mặc định nếu là link '#'
                if (this.getAttribute('href') === '#' || !this.getAttribute('href')) {
                    e.preventDefault();
                }
                const parentLi = this.closest('li.dropdown, li.dropdown-submenu');
                if (!parentLi) return;

                // Đóng tất cả các menu con cùng cấp khác
                const siblingLis = parentLi.parentElement.querySelectorAll(':scope > li.active');
                siblingLis.forEach(li => {
                    if (li !== parentLi) {
                        li.classList.remove('active');
                        li.querySelector(':scope > .dropdown-menu')?.classList.remove('show');
                        li.querySelector(':scope > a')?.setAttribute('aria-expanded', 'false');
                    }
                });

                // Toggle menu hiện tại
                parentLi.classList.toggle('active');
                const dropdownMenu = parentLi.querySelector(':scope > .dropdown-menu');
                dropdownMenu?.classList.toggle('show'); // Có thể dùng class 'show' để điều khiển CSS transition
                this.setAttribute('aria-expanded', parentLi.classList.contains('active'));
                console.log(`DEBUG: Toggled mobile dropdown for: ${this.textContent.trim()}. Active: ${parentLi.classList.contains('active')}`);
            });
        });

    } else {
        console.warn("DEBUG: Could not initialize mobile menu interactions. Missing elements:", {
            hamburger: !!hamburger,
            mobileMenu: !!mobileMenu,
            closeMenu: !!closeMenu,
            overlay: !!overlay
        });
    }

    // --- Desktop Dropdown (Hover - Giữ nguyên logic CSS hover) ---
    // Không cần thêm JS cho hover trên desktop nếu CSS đã xử lý :hover
    // Tuy nhiên, nếu muốn thêm logic phức tạp hơn (ví dụ: giữ menu mở khi di chuột vào menu con), cần JS.
    // Hiện tại, CSS trong styles.css đã xử lý hover cho desktop.

    console.log("DEBUG: Menu events initialization complete.");
}


/**
 * Khởi tạo đồng hồ đếm ngược và chuyển hướng.
 */
function startRedirectCountdown() {
    console.log("DEBUG: Attempting to start redirect countdown...");
    const redirectUrl = "https://facebook.com/hr.ivsacademy"; // URL chuyển hướng
    const countdownDuration = 120; // 120 giây = 2 phút
    const redirectTimerContainer = document.getElementById('redirect-timer'); // Container chứa đồng hồ
    const cancelButton = document.getElementById("cancel-redirect"); // Nút hủy

    // Chỉ chạy nếu cả hai phần tử tồn tại
    if (redirectTimerContainer && cancelButton) {
        console.log("DEBUG: Redirect timer elements found.");
        // Tìm phần tử hiển thị thời gian (giả sử là thẻ <p> đầu tiên bên trong)
        const timerDisplayElement = redirectTimerContainer.querySelector('p');

        if (!timerDisplayElement) {
            console.error("DEBUG: Timer display element (<p>) inside #redirect-timer not found.");
            redirectTimerContainer.innerHTML = '<p style="color: red;">Lỗi: Không tìm thấy phần tử hiển thị thời gian.</p>'; // Báo lỗi trên UI
            return; // Dừng nếu không tìm thấy
        }

        let timeLeft = countdownDuration;
        let redirectIntervalId = null; // Đổi tên biến để tránh nhầm lẫn

        const updateTimer = () => {
            if (timeLeft <= 0) {
                clearInterval(redirectIntervalId);
                console.log("DEBUG: Timer finished.");
                // Chỉ chuyển hướng nếu nút hủy chưa được nhấn
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
                // Cập nhật nội dung phần tử hiển thị
                timerDisplayElement.textContent = `Website sẽ tự động chuyển đến Fanpage IVS Academy trong ${minutes} phút ${seconds < 10 ? '0' : ''}${seconds} giây...`;
                timeLeft--;
            }
        };

        // Gọi lần đầu để hiển thị ngay lập tức
        updateTimer();
        // Bắt đầu interval
        redirectIntervalId = setInterval(updateTimer, 1000);
        console.log("DEBUG: Redirect timer started with interval ID:", redirectIntervalId);

        // Gắn sự kiện cho nút hủy
        cancelButton.addEventListener("click", () => {
            clearInterval(redirectIntervalId); // Dừng đếm ngược
            cancelButton.textContent = "Đã hủy chuyển hướng";
            cancelButton.disabled = true; // Vô hiệu hóa nút
            timerDisplayElement.textContent = "Chuyển hướng đã bị hủy."; // Cập nhật thông báo
            console.log("DEBUG: Redirect cancelled by user.");
        }, { once: true }); // Đảm bảo sự kiện chỉ chạy 1 lần

    } else {
        // Ghi log nếu thiếu phần tử
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
    const carouselControls = document.querySelector('.carousel-controls'); // Lấy container của nút

    if (!postListElement) {
        console.log("DEBUG: Post list element #post-list not found, skipping post loading.");
        return;
    }
    console.log("DEBUG: Loading posts...");
    // Hiển thị trạng thái đang tải
    postListElement.innerHTML = '<p style="text-align: center; color: #888; padding: 20px;">Đang tải bài viết...</p>';
    // Ẩn nút điều khiển carousel ban đầu
    if (carouselControls) carouselControls.style.display = 'none';


    try {
        const response = await fetch('posts.json');
        if (!response.ok) {
            throw new Error(`Không thể tải file posts.json (Status: ${response.status})`);
        }
        const posts = await response.json();
        console.log("DEBUG: Posts data fetched:", posts);

        // Kiểm tra dữ liệu trả về
        if (!Array.isArray(posts)) {
             throw new Error("Dữ liệu posts.json không phải là một mảng.");
        }

        postListElement.innerHTML = ''; // Xóa thông báo "Đang tải..."

        if (posts.length === 0) {
            postListElement.innerHTML = '<p class="no-posts" style="text-align: center; color: #888; padding: 20px;">Hiện chưa có bài viết nổi bật nào.</p>';
            console.log("DEBUG: No posts found.");
            if (carouselControls) carouselControls.style.display = 'none'; // Ẩn nút nếu không có post
            return;
        }

        // Tạo và chèn các phần tử bài viết
        posts.forEach((post, index) => {
            if (!post || typeof post !== 'object') {
                console.warn(`DEBUG: Invalid post data at index ${index}. Skipping.`);
                return; // Bỏ qua bài viết không hợp lệ
            }
            const postElement = createPostElement(post);
            postListElement.appendChild(postElement);
        });
        console.log("DEBUG: Post elements created and appended.");

        // Khởi tạo carousel hoặc grid layout dựa trên kích thước màn hình ban đầu
        handleResize(); // Gọi handleResize để áp dụng layout đúng

    } catch (error) {
        console.error('DEBUG: Lỗi khi tải hoặc xử lý bài viết:', error);
        postListElement.innerHTML = `<p class="error" style="text-align: center; color: red; padding: 20px;">Không thể tải danh sách bài viết. (${error.message})</p>`;
        if (carouselControls) carouselControls.style.display = 'none'; // Ẩn nút nếu có lỗi
    }
}

/**
 * Tạo phần tử HTML cho một bài viết.
 * @param {object} post Dữ liệu bài viết (title, excerpt, url, image, hot).
 * @returns {HTMLElement} Phần tử div.post-preview.
 */
function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post-preview';

    // Sử dụng ảnh mặc định nếu ảnh gốc bị lỗi hoặc không có
    const fallbackImage = 'https://placehold.co/400x250/cccccc/ffffff?text=IVS+Image'; // Ảnh placeholder
    const imageUrl = post.image || fallbackImage;
    const postUrl = post.url || '#'; // Đảm bảo luôn có href
    const title = post.title || 'Tiêu đề bài viết';
    const excerpt = post.excerpt || 'Nội dung tóm tắt...';

    postDiv.innerHTML = `
        <div class="post-image">
            <img src="${imageUrl}"
                 alt="${title}"
                 loading="lazy"
                 onerror="this.onerror=null; this.src='${fallbackImage}'; console.warn('DEBUG: Image failed to load, using fallback: ${imageUrl}')">
            ${post.hot ? '<span class="hot-label">HOT</span>' : ''}
        </div>
        <div class="post-content">
            <h3><a href="${postUrl}">${title}</a></h3>
            <p>${excerpt}</p>
            <a href="${postUrl}" class="view-more">Xem thêm</a>
        </div>
    `;
    return postDiv;
}


/**
 * Khởi tạo chức năng carousel cho danh sách bài viết trên desktop.
 */
let slideIntervalId = null; // Biến toàn cục để lưu ID của interval
let carouselInitialized = false; // Cờ để kiểm tra đã khởi tạo chưa

function initCarousel() {
    if (carouselInitialized) {
        console.log("DEBUG: Carousel already initialized. Skipping.");
        return; // Không khởi tạo lại nếu đã chạy
    }
    console.log("DEBUG: Attempting to initialize carousel...");
    const postList = document.getElementById('post-list');
    const posts = postList?.querySelectorAll('.post-preview');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    const carouselControls = document.querySelector('.carousel-controls');

    // Dọn dẹp interval cũ nếu có (phòng trường hợp gọi lại)
    if (slideIntervalId) {
        clearInterval(slideIntervalId);
        slideIntervalId = null;
        console.log("DEBUG: Cleared previous slide interval before re-init.");
    }

    // Kiểm tra điều kiện cần thiết
    if (!postList || !posts || posts.length <= 1 || !prevBtn || !nextBtn || !carouselControls) {
        console.log(`DEBUG: Carousel initialization skipped. Conditions not met: postList=${!!postList}, posts.length=${posts?.length}, prevBtn=${!!prevBtn}, nextBtn=${!!nextBtn}, controls=${!!carouselControls}`);
        // Ẩn nút điều khiển nếu không đủ slide hoặc thiếu phần tử
        if (carouselControls) carouselControls.style.display = 'none';
        // Nếu chỉ có 1 slide, đảm bảo nó hiển thị đúng
        if (posts && posts.length === 1) {
             posts[0].style.transform = 'translateX(0%)';
             posts[0].style.position = 'relative'; // Chuyển về relative để chiếm không gian
             postList.style.height = 'auto'; // Chiều cao tự động
             postList.style.minHeight = ''; // Bỏ min-height nếu cần
        }
        carouselInitialized = false; // Đánh dấu chưa khởi tạo
        return;
    }

    console.log("DEBUG: Initializing carousel with", posts.length, "posts.");
    carouselControls.style.display = 'flex'; // Hiển thị nút điều khiển
    carouselInitialized = true; // Đánh dấu đã khởi tạo

    let currentIndex = 0;
    const totalPosts = posts.length;

    // --- Reset và Thiết lập style cho Carousel ---
    postList.style.display = 'block'; // Đảm bảo là block để position absolute hoạt động
    postList.style.position = 'relative'; // Cần cho position absolute của slide
    postList.style.overflow = 'hidden'; // Ẩn các slide khác
    // Đặt chiều cao cố định hoặc min-height cho container carousel (QUAN TRỌNG)
    // Lấy chiều cao của slide đầu tiên làm chuẩn hoặc set cứng trong CSS
    postList.style.minHeight = '250px'; // Giữ min-height từ CSS hoặc tính toán
    postList.style.height = ''; // Bỏ height tự động nếu có

    posts.forEach((post, index) => {
        post.style.position = 'absolute';
        post.style.width = '100%';
        post.style.height = '100%'; // Slide chiếm toàn bộ chiều cao container
        post.style.top = '0';
        post.style.left = '0';
        post.style.transform = `translateX(${index * 100}%)`; // Định vị ban đầu
        post.style.transition = 'transform 0.5s ease'; // Hiệu ứng chuyển slide
        // Đảm bảo chỉ slide đầu tiên hiển thị ban đầu (các slide khác bị ẩn bởi overflow)
        post.style.opacity = '1'; // Đảm bảo slide nhìn thấy được
    });
    // --- Kết thúc Reset và Thiết lập style ---


    function showSlide(index) {
        // Chuẩn hóa index
        currentIndex = (index + totalPosts) % totalPosts;

        // console.log(`DEBUG: Showing slide ${currentIndex}`);
        posts.forEach((post, i) => {
            // Tính toán vị trí translateX cho từng slide
            post.style.transform = `translateX(${(i - currentIndex) * 100}%)`;
        });
    }

    // Hàm xử lý sự kiện click (tạo một lần, tái sử dụng)
    const handlePrevClick = () => {
        console.log("DEBUG: Prev button clicked.");
        showSlide(currentIndex - 1);
        resetInterval();
    };
    const handleNextClick = () => {
        console.log("DEBUG: Next button clicked.");
        showSlide(currentIndex + 1);
        resetInterval();
    };

    // Gắn sự kiện (nên gỡ bỏ sự kiện cũ trước khi gắn mới nếu có khả năng gọi lại init)
    prevBtn.removeEventListener('click', handlePrevClick); // Gỡ bỏ nếu đã tồn tại
    prevBtn.addEventListener('click', handlePrevClick);

    nextBtn.removeEventListener('click', handleNextClick); // Gỡ bỏ nếu đã tồn tại
    nextBtn.addEventListener('click', handleNextClick);


    // Hàm reset interval tự động chuyển slide
    function resetInterval() {
        clearInterval(slideIntervalId); // Xóa interval cũ
        slideIntervalId = setInterval(() => {
            // console.log("DEBUG: Auto sliding to next...");
            showSlide(currentIndex + 1);
        }, 5000); // 5 giây
        // console.log("DEBUG: Slide interval reset/started with ID:", slideIntervalId);
    }

    // Tạm dừng khi hover (nên gỡ bỏ sự kiện cũ trước khi gắn mới)
    const handleMouseEnter = () => {
        clearInterval(slideIntervalId);
        // console.log("DEBUG: Slide interval paused on hover.");
    };
    const handleMouseLeave = () => {
        resetInterval();
        // console.log("DEBUG: Slide interval resumed on mouse leave.");
    };

    postList.removeEventListener('mouseenter', handleMouseEnter);
    postList.addEventListener('mouseenter', handleMouseEnter);

    postList.removeEventListener('mouseleave', handleMouseLeave);
    postList.addEventListener('mouseleave', handleMouseLeave);

    // Hiển thị slide đầu tiên và bắt đầu tự động chạy
    showSlide(0);
    resetInterval();
    console.log("DEBUG: Carousel initialized successfully.");
}

/**
 * Dọn dẹp carousel (xóa style, gỡ bỏ event listener, dừng interval).
 */
function cleanupCarousel() {
    if (!carouselInitialized) return; // Chỉ dọn dẹp nếu đã khởi tạo
    console.log("DEBUG: Cleaning up carousel...");
    const postList = document.getElementById('post-list');
    const posts = postList?.querySelectorAll('.post-preview');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    const carouselControls = document.querySelector('.carousel-controls');

    // Dừng interval
    if (slideIntervalId) {
        clearInterval(slideIntervalId);
        slideIntervalId = null;
        console.log("DEBUG: Cleared slide interval during cleanup.");
    }

    // Gỡ bỏ event listeners khỏi nút và container
    if (prevBtn) prevBtn.removeEventListener('click', handlePrevClick); // Cần định nghĩa handlePrevClick ở scope rộng hơn hoặc truyền vào
    if (nextBtn) nextBtn.removeEventListener('click', handleNextClick); // Cần định nghĩa handleNextClick ở scope rộng hơn hoặc truyền vào
    if (postList) {
         postList.removeEventListener('mouseenter', handleMouseEnter); // Cần định nghĩa handleMouseEnter ở scope rộng hơn hoặc truyền vào
         postList.removeEventListener('mouseleave', handleMouseLeave); // Cần định nghĩa handleMouseLeave ở scope rộng hơn hoặc truyền vào
    }


    // Reset style của container và các slide
    if (postList) {
        postList.style.position = '';
        postList.style.overflow = '';
        postList.style.height = '';
        postList.style.minHeight = '';
        postList.style.display = ''; // Để CSS quyết định (ví dụ: grid)
    }
    if (posts) {
        posts.forEach(post => {
            post.style.position = '';
            post.style.width = '';
            post.style.height = '';
            post.style.top = '';
            post.style.left = '';
            post.style.transform = '';
            post.style.transition = '';
            post.style.opacity = '';
        });
    }

    // Ẩn nút điều khiển
    if (carouselControls) carouselControls.style.display = 'none';

    carouselInitialized = false; // Đánh dấu đã dọn dẹp
    console.log("DEBUG: Carousel cleanup complete.");
}


// Cần định nghĩa các hàm xử lý sự kiện ở scope rộng hơn để removeEventListener hoạt động
let handlePrevClick, handleNextClick, handleMouseEnter, handleMouseLeave;


/**
 * Xử lý thay đổi kích thước màn hình để chuyển đổi giữa carousel và grid.
 */
function handleResize() {
    console.log("DEBUG: Handling resize event. Window width:", window.innerWidth);
    const postList = document.getElementById('post-list');
    if (!postList) return;

    const isMobileView = window.innerWidth <= 768;

    if (isMobileView) {
        console.log("DEBUG: Mobile view detected in resize.");
        // --- Chuyển sang Grid Layout ---
        cleanupCarousel(); // Dọn dẹp carousel trước khi áp dụng grid

        // Áp dụng style grid (có thể dùng class CSS thay vì style inline)
        postList.style.display = 'grid';
        postList.style.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))';
        postList.style.gap = '15px';
        // Đảm bảo các style khác của carousel đã được xóa bởi cleanupCarousel

    } else {
        console.log("DEBUG: Desktop view detected in resize.");
        // --- Khởi tạo Carousel ---
        // Dọn dẹp style grid nếu có (đảm bảo container sẵn sàng cho carousel)
        postList.style.display = 'block'; // Carousel cần display block
        postList.style.gridTemplateColumns = '';
        postList.style.gap = '';

        // Chỉ khởi tạo carousel nếu chưa được khởi tạo và có đủ slide
        if (!carouselInitialized && postList.querySelectorAll('.post-preview').length > 1) {
            initCarousel();
        } else if (postList.querySelectorAll('.post-preview').length <= 1) {
             cleanupCarousel(); // Đảm bảo dọn dẹp nếu chỉ còn 1 slide
        }
    }
}


// --- Chạy các hàm khởi tạo khi DOM sẵn sàng ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DEBUG: DOM fully loaded. Starting initial setup.");

    // Tạo overlay nếu chưa có
    if (!document.querySelector('.overlay')) {
        const overlayDiv = document.createElement('div');
        overlayDiv.className = 'overlay';
        document.body.appendChild(overlayDiv);
        console.log("DEBUG: Overlay element created and appended.");
    }

    // Load header và footer, sau đó khởi tạo các chức năng khác
    Promise.all([
        loadComponent('header.html', 'header'),
        loadComponent('footer.html', 'footer')
    ]).then(() => {
        console.log("DEBUG: Header and Footer loading process finished successfully.");
        // initializeMenuEvents() ĐÃ ĐƯỢC GỌI TRONG loadComponent('header.html')
        // Chỉ cần gọi các hàm khác phụ thuộc vào DOM chung
        startRedirectCountdown(); // Khởi tạo đếm ngược
        loadPosts(); // Tải bài viết và tự động xử lý layout ban đầu (carousel/grid)

        // Lắng nghe sự kiện resize sau khi mọi thứ đã sẵn sàng
        // Gỡ bỏ listener cũ trước khi thêm mới để tránh trùng lặp
        window.removeEventListener('resize', handleResize);
        window.addEventListener('resize', handleResize);
        console.log("DEBUG: Resize listener attached.");

    }).catch(error => {
        // Lỗi nghiêm trọng khi tải header/footer đã được xử lý trong loadComponent
        console.error("DEBUG: Critical error during initial component loading. Some functionalities might be broken.", error);
        // Có thể hiển thị thông báo lỗi tổng quát hơn ở đây nếu cần
        // document.body.insertAdjacentHTML('afterbegin', `<div style="color: red; background: yellow; padding: 10px; text-align: center;">Lỗi tải thành phần trang. Một số chức năng có thể không hoạt động.</div>`);
    });

    console.log("DEBUG: Initial setup sequence started.");
});
