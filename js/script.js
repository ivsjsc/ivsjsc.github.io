/**
 * Hàm tải nội dung HTML từ một URL và chèn vào phần tử có ID chỉ định.
 * Lưu ý: Phương pháp này phụ thuộc vào JavaScript để tải cấu trúc cơ bản (header/footer).
 * Nếu JS lỗi hoặc fetch thất bại, header/footer sẽ không hiển thị.
 * @param {string} url Đường dẫn đến file HTML (ví dụ: 'header.html'). Nên dùng đường dẫn tuyệt đối từ gốc ('/header.html').
 * @param {string} elementId ID của phần tử placeholder (ví dụ: 'header-placeholder').
 * @returns {Promise<HTMLElement|null>} Promise trả về phần tử gốc chứa nội dung đã tải (ví dụ <header>) hoặc null nếu lỗi.
 */
function loadComponent(url, elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`DEBUG: Placeholder element #${elementId} not found.`);
        return Promise.resolve(null); // Resolve với null để không phá vỡ Promise.all
    }
    console.log(`DEBUG: Loading component ${url} into #${elementId}`);

    // Luôn sử dụng đường dẫn tuyệt đối từ gốc website
    const fetchUrl = url.startsWith('/') ? url : '/' + url;

    return fetch(fetchUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${fetchUrl}. Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            element.innerHTML = data;
            console.log(`DEBUG: Component ${elementId} loaded successfully from ${fetchUrl}.`);
            // Trả về phần tử con đầu tiên thực sự được chèn (thường là <header> hoặc <footer>)
            return element.firstElementChild || element;
        })
        .catch(error => {
            console.error(`DEBUG: Error loading ${elementId} from ${fetchUrl}:`, error);
            element.innerHTML = `<div style="text-align: center; padding: 10px; color: red;">Error loading ${elementId}.</div>`;
            // Quan trọng: Ném lỗi để Promise.all biết có vấn đề
            throw error;
        });
}

/**
 * Khởi tạo các sự kiện cho menu (chủ yếu là mobile) sử dụng event delegation.
 * Cần được gọi SAU KHI header đã được tải thành công.
 */
function initializeMenuEventsDelegation() {
    console.log("DEBUG: Initializing menu events (mainly mobile)...");
    // Lấy thẻ header gốc đã được tải nội dung vào placeholder
    const headerPlaceholder = document.getElementById('header-placeholder');
    // Nội dung thực sự của header (thẻ <header> hoặc thẻ div bao ngoài trong header.html)
    const headerElement = headerPlaceholder?.querySelector('header, .header-container'); // Tìm thẻ header hoặc container chính
    const overlay = document.querySelector(".overlay");

    if (!headerElement) {
        console.error("DEBUG: Header content not found inside #header-placeholder for delegation.");
        return;
    }
    if (!overlay) {
        console.warn("DEBUG: Overlay element (.overlay) not found.");
    }

    // --- Mobile Menu Toggle (Delegated) ---
    // Gắn sự kiện vào placeholder để bắt cả nút hamburger (nếu nó nằm ngoài thẻ <header> bên trong)
    headerPlaceholder.addEventListener('click', function(event) {
        const hamburger = event.target.closest('.hamburger');
        const mobileMenu = headerElement.querySelector(".mobile-menu"); // Tìm mobile menu bên trong nội dung header

        if (hamburger && mobileMenu) {
            console.log("DEBUG: Hamburger clicked!");
            mobileMenu.classList.add('active');
            if (overlay) overlay.classList.add('active');
            document.body.classList.add('mobile-menu-active'); // Thêm class vào body
        }
    });

    // Gắn sự kiện đóng vào chính mobile menu (vì nút close nằm trong đó)
    const mobileMenuElement = headerElement.querySelector(".mobile-menu");
    if (mobileMenuElement) {
        mobileMenuElement.addEventListener('click', function(event) {
            const closeMenu = event.target.closest('.close-menu');
            if (closeMenu) {
                console.log("DEBUG: Close button clicked");
                closeMobileMenu(mobileMenuElement, overlay); // Truyền mobileMenu và overlay vào
            }

            // Đóng menu khi bấm link không phải dropdown trong mobile menu
            if (mobileMenuElement.classList.contains('active')) {
                const link = event.target.closest('.mobile-nav-tabs a');
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
            if (toggle.getAttribute('href') === '#' || !toggle.getAttribute('href')) {
                event.preventDefault();
            } else {
                // Nếu là link thật, không ngăn chặn, để nó điều hướng
                // Menu sẽ tự đóng do event click vào link ở trên
                 return;
            }

            const parentLi = toggle.closest('li.dropdown, li.dropdown-submenu');
            if (!parentLi) return;
            const subMenu = parentLi.querySelector(':scope > .dropdown-menu');
            if (!subMenu) return;

            const isActive = parentLi.classList.contains('active');

            // Đóng siblings cùng cấp
            const parentUl = parentLi.parentElement;
            parentUl.querySelectorAll(':scope > li.active').forEach(li => {
                if (li !== parentLi) {
                    li.classList.remove('active');
                    li.querySelector(':scope > .dropdown-menu')?.classList.remove('show');
                    li.querySelector(':scope > a.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current
            parentLi.classList.toggle('active', !isActive);
            subMenu.classList.toggle('show', !isActive);
            toggle.setAttribute('aria-expanded', String(!isActive));
            console.log(`DEBUG: Toggled mobile dropdown for: ${toggle.textContent.trim()}. Active: ${!isActive}`);
        });
    }

    // --- Desktop Dropdown ---
    // Logic hover/focus giờ đây được xử lý chính bằng CSS trong styles.css
    // Không cần JS cho việc hiện/ẩn menu desktop nữa.

    // Cập nhật link active khi menu đã được tải
    setActiveNavLink();

    console.log("DEBUG: Mobile menu events initialized.");
}

// Hàm đóng menu mobile (cần tham chiếu đến menu và overlay)
function closeMobileMenu(mobileMenu, overlay) {
    if(mobileMenu) mobileMenu.classList.remove('active');
    if(overlay) overlay.classList.remove('active');
    document.body.classList.remove('mobile-menu-active'); // Xóa class khỏi body
     // Đóng tất cả submenu mobile khi đóng menu chính
     mobileMenu?.querySelectorAll('.mobile-nav-tabs li.active').forEach(li => {
        li.classList.remove('active');
        li.querySelector(':scope > .dropdown-menu')?.classList.remove('show');
        li.querySelector(':scope > a.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
    });
}


/**
 * Đánh dấu link điều hướng đang hoạt động dựa trên trang hiện tại.
 * Cần được gọi sau khi header đã được tải và DOM sẵn sàng.
 */
function setActiveNavLink() {
    // Tìm bên trong placeholder đã được tải nội dung
    const headerContent = document.querySelector('#header-placeholder header, #header-placeholder .header-container');
    if (!headerContent) {
        console.warn("DEBUG: Header content not found for setActiveNavLink.");
        return;
    }

    const navLinks = headerContent.querySelectorAll('.nav-tabs a:not(.dropdown-toggle), .mobile-nav-tabs a:not(.dropdown-toggle)');
    // Lấy đường dẫn tương đối từ gốc, loại bỏ tên tệp nếu là index.html
    let currentPath = window.location.pathname;
    if (currentPath.endsWith('/index.html')) {
        currentPath = currentPath.substring(0, currentPath.length - 'index.html'.length);
    }
     // Đảm bảo luôn có dấu / ở cuối cho thư mục gốc
    if (currentPath === '' || currentPath === '/') {
        currentPath = '/';
    } else if (!currentPath.endsWith('/')) {
         // Xử lý trường hợp không có dấu / cuối nhưng không phải file
         // Cách đơn giản là kiểm tra xem có dấu chấm trong phần cuối không
         if (!currentPath.substring(currentPath.lastIndexOf('/') + 1).includes('.')) {
              currentPath += '/';
         }
    }


    console.log(`DEBUG: Current Path for Active Link: ${currentPath}`);

    let directMatchFound = false;

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (!linkHref || linkHref === '#') return;

        // Chuẩn hóa link href (giả định link trong HTML là tuyệt đối từ gốc)
        let normalizedLinkHref = linkHref.startsWith('/') ? linkHref : '/' + linkHref;
         if (normalizedLinkHref.endsWith('/index.html')) {
            normalizedLinkHref = normalizedLinkHref.substring(0, normalizedLinkHref.length - 'index.html'.length);
        }
        if (normalizedLinkHref === '') {
             normalizedLinkHref = '/';
        } else if (!normalizedLinkHref.endsWith('/') && !normalizedLinkHref.substring(normalizedLinkHref.lastIndexOf('/') + 1).includes('.')) {
             normalizedLinkHref += '/';
        }


        link.classList.remove('active');
        link.closest('li.dropdown, li.dropdown-submenu')?.querySelector(':scope > a.dropdown-toggle')?.classList.remove('active');


        // So sánh đường dẫn đã chuẩn hóa
        if (normalizedLinkHref === currentPath) {
            link.classList.add('active');
            directMatchFound = true; // Tìm thấy khớp trực tiếp
            console.log(`DEBUG: Direct active link set for: ${linkHref}`);

            // Đánh dấu active cho menu cha
            const parentLi = link.closest('li.dropdown, li.dropdown-submenu');
            if (parentLi) {
                 const parentToggle = parentLi.querySelector(':scope > a.dropdown-toggle');
                 parentToggle?.classList.add('active');

                 // Nếu là submenu, đánh dấu cả cấp 1
                 const topLevelDropdown = parentLi.closest('.nav-tabs > li.dropdown, .mobile-nav-tabs > li.dropdown');
                 topLevelDropdown?.querySelector(':scope > a.dropdown-toggle')?.classList.add('active');
            }
        }
    });

     // Nếu không có link con nào khớp trực tiếp, thử khớp menu cha dựa trên phần đầu của path
     if (!directMatchFound) {
         console.log("DEBUG: No direct match found, checking parent paths...");
         let bestMatchLength = 0;
         let bestMatchLink = null;

         const topLevelToggles = headerContent.querySelectorAll('.nav-tabs > li.dropdown > a.dropdown-toggle, .mobile-nav-tabs > li.dropdown > a.dropdown-toggle');

         topLevelToggles.forEach(toggle => {
             // Lấy href của các link con bên trong dropdown này
             const parentLi = toggle.closest('li.dropdown');
             const childLinks = parentLi.querySelectorAll('.dropdown-menu a');

             childLinks.forEach(childLink => {
                 const linkHref = childLink.getAttribute('href');
                 if (!linkHref || linkHref === '#') return;

                 let normalizedLinkHref = linkHref.startsWith('/') ? linkHref : '/' + linkHref;
                  if (normalizedLinkHref.endsWith('/index.html')) {
                     normalizedLinkHref = normalizedLinkHref.substring(0, normalizedLinkHref.length - 'index.html'.length);
                 }
                 if (normalizedLinkHref === '') normalizedLinkHref = '/';
                 else if (!normalizedLinkHref.endsWith('/') && !normalizedLinkHref.substring(normalizedLinkHref.lastIndexOf('/') + 1).includes('.')) {
                      normalizedLinkHref += '/';
                 }


                 // Kiểm tra xem currentPath có bắt đầu bằng đường dẫn của link con không
                 // và chọn khớp dài nhất (chính xác hơn)
                 if (currentPath.startsWith(normalizedLinkHref) && normalizedLinkHref.length > bestMatchLength) {
                     // Kiểm tra xem có phải chỉ là thư mục gốc không, nếu cả 2 là gốc thì không tính
                     if(!(currentPath === '/' && normalizedLinkHref === '/')) {
                          bestMatchLength = normalizedLinkHref.length;
                          bestMatchLink = toggle; // Đánh dấu toggle cha cần active
                          console.log(`DEBUG: Potential parent match found: ${toggle.textContent.trim()} based on child ${linkHref}`);
                     }
                 }
             });
         });

         if (bestMatchLink) {
             bestMatchLink.classList.add('active');
             console.log(`DEBUG: Setting parent active based on best match: ${bestMatchLink.textContent.trim()}`);
         }
     }
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
                    try { window.location.href = redirectUrl; }
                    catch (e) {
                        console.error("DEBUG: Redirect failed.", e);
                        timerDisplayElement.textContent = "Lỗi khi chuyển hướng.";
                    }
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
 * Chỉ chạy nếu tìm thấy container '#latest-posts-container'.
 */
async function loadLatestPosts() {
    const postsContainer = document.getElementById('latest-posts-container');
    if (!postsContainer) {
        return; // Không làm gì nếu không có container này
    }
    console.log("DEBUG: Loading latest posts...");
    // postsContainer.innerHTML = '<p class="loading-placeholder">Đang tải...</p>'; // Bỏ placeholder để tránh FOUC

    try {
        const response = await fetch('/posts.json'); // Đường dẫn tuyệt đối
        if (!response.ok) throw new Error(`HTTP ${response.status} loading posts.json`);
        const posts = await response.json();
        if (!Array.isArray(posts)) throw new Error("Invalid posts.json format");

        postsContainer.innerHTML = ''; // Xóa placeholder (nếu có)

        if (posts.length === 0) {
            postsContainer.innerHTML = '<p class="no-posts">Chưa có tin nổi bật nào.</p>';
            return;
        }

        posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        const latestPosts = posts.slice(0, 3); // Lấy 3 bài

        latestPosts.forEach(post => {
            if (post && typeof post === 'object') {
                postsContainer.appendChild(createPostElement(post));
            }
        });
        console.log("DEBUG: Latest posts loaded.");

    } catch (error) {
        console.error('DEBUG: Error loading latest posts:', error);
        postsContainer.innerHTML = `<p class="error">Không thể tải tin nổi bật.</p>`;
    }
}

/**
 * Tạo phần tử HTML cho một bài viết.
 * @param {object} post Dữ liệu bài viết.
 * @returns {HTMLElement} Phần tử div.post-card.
 */
function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post-card'; // Sử dụng class thống nhất
    const fallbackImage = 'https://placehold.co/600x400/eee/ccc?text=IVS+Post';
    // Đảm bảo đường dẫn ảnh là tuyệt đối từ gốc
    const imageUrl = post.image ? (post.image.startsWith('/') ? post.image : '/' + post.image) : fallbackImage;
    const postUrl = post.url ? (post.url.startsWith('/') ? post.url : '/' + post.url) : '#';
    const title = post.title || 'Tiêu đề bài viết';
    const excerpt = post.excerpt || 'Nội dung tóm tắt...';
    const postDate = post.date ? new Date(post.date).toLocaleDateString('vi-VN') : 'Không rõ';

    postDiv.innerHTML = `
        <img src="${imageUrl}" alt="${title}" loading="lazy" onerror="this.onerror=null; this.src='${fallbackImage}';">
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
        loadComponent('/header.html', 'header-placeholder'), // Dùng đường dẫn tuyệt đối
        loadComponent('/footer.html', 'footer-placeholder')  // Dùng đường dẫn tuyệt đối
    ]).then(([headerElement, footerElement]) => { // Nhận về phần tử con đầu tiên đã tải
        console.log("DEBUG: Header and Footer loading promises resolved.");
        if (headerElement) {
             // Khởi tạo menu ngay sau khi header được chèn vào DOM
             initializeMenuEventsDelegation();
        } else {
            console.error("DEBUG: Header component failed to load or returned null, cannot initialize menu.");
        }

        // Tải bài viết mới nhất (nếu có container)
        // Có thể gọi ngay đây vì không phụ thuộc header/footer nữa
        loadLatestPosts();

    }).catch(error => {
        console.error("DEBUG: Critical error during component loading. Menu or other features might be broken.", error);
        // Cân nhắc hiển thị thông báo lỗi thân thiện hơn cho người dùng cuối
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder && headerPlaceholder.innerHTML.includes('Error loading')) {
             // Đã có thông báo lỗi từ loadComponent
        } else if (headerPlaceholder) {
             headerPlaceholder.innerHTML = '<p style="color:red; text-align:center;">Lỗi tải menu chính.</p>';
        }
    });

    // Khởi tạo các chức năng không phụ thuộc header/footer
    startRedirectCountdown();

    console.log("DEBUG: Initial dynamic load setup sequence started.");
});
