// js/main.js

/**
 * Chèn nội dung HTML từ các file bên ngoài vào các phần tử
 * có thuộc tính 'w3-include-html'.
 * @returns {Promise<void>} Một promise sẽ resolve khi tất cả các file đã được chèn.
 */
function includeHTML() {
    // Trả về một Promise để có thể đợi hoàn thành việc include
    return new Promise((resolve) => {
        let z, i, elmnt, file;
        // Lấy tất cả các phần tử trong trang
        z = document.getElementsByTagName("*");
        let promises = []; // Mảng chứa các promise của việc fetch từng file

        // Lặp qua tất cả các phần tử
        for (i = 0; i < z.length; i++) {
            elmnt = z[i];
            // Lấy giá trị thuộc tính 'w3-include-html' (đường dẫn file)
            file = elmnt.getAttribute("w3-include-html");
            if (file) {
                // Xóa thuộc tính để tránh lặp lại
                elmnt.removeAttribute("w3-include-html");
                // Tạo một promise cho việc fetch và chèn nội dung file này
                promises.push(
                    fetch(file)
                        .then(response => {
                            // Kiểm tra xem fetch có thành công không
                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status} for file ${file}`);
                            }
                            return response.text(); // Lấy nội dung text của file
                        })
                        .then(data => {
                            // Chèn nội dung vào phần tử
                            elmnt.innerHTML = data;
                        })
                        .catch(error => {
                            // Nếu có lỗi, hiển thị thông báo và log lỗi
                            elmnt.innerHTML = "Lỗi khi tải nội dung.";
                            console.error('Lỗi khi chèn HTML:', file, error);
                        })
                );
            }
        }

        // Đợi tất cả các promise fetch hoàn thành
        Promise.all(promises)
            .then(() => {
                // console.log('Tất cả HTML đã được chèn thành công.');
                resolve(); // Resolve promise chính khi tất cả hoàn tất
            })
            .catch((error) => {
                // Log lỗi nếu có vấn đề với Promise.all (ít xảy ra nếu các catch riêng đã xử lý)
                console.error('Lỗi trong quá trình chèn HTML:', error);
                resolve(); // Vẫn resolve để các tiến trình khác có thể tiếp tục
            });
    });
}

/**
 * Thiết lập chức năng chuyển đổi ngôn ngữ.
 */
function setupLanguageSwitcher() {
    const languageSwitcher = document.getElementById('language-switcher');
    if (languageSwitcher) {
        languageSwitcher.addEventListener('change', (event) => {
            const selectedLang = event.target.value;
            // Lưu ngôn ngữ đã chọn vào localStorage hoặc cookie nếu cần
            localStorage.setItem('preferredLanguage', selectedLang);
            // Tải lại trang hoặc cập nhật nội dung dựa trên ngôn ngữ mới
            // Ví dụ đơn giản: tải lại trang
            window.location.reload();
            // Hoặc gọi hàm cập nhật nội dung (nếu có)
            // updateContentLanguage(selectedLang);
            console.log(`Ngôn ngữ được chọn: ${selectedLang}`);
        });

        // Đặt giá trị mặc định cho dropdown dựa trên ngôn ngữ đã lưu (nếu có)
        const preferredLanguage = localStorage.getItem('preferredLanguage') || 'vi'; // Mặc định là 'vi'
        languageSwitcher.value = preferredLanguage;
    } else {
        console.warn('Không tìm thấy phần tử #language-switcher.');
    }
}

/**
 * Tải và hiển thị các bài đăng (tin tức/sự kiện) từ posts.json.
 */
function loadPosts() {
    const postsContainer = document.getElementById('posts-container');

    // Kiểm tra xem phần tử container có tồn tại không
    if (!postsContainer) {
        console.error('Lỗi: Không tìm thấy phần tử với ID "posts-container".');
        return; // Thoát hàm nếu không tìm thấy container
    }

    // Fetch file posts.json
    fetch('posts.json') // Đường dẫn tương đối đến file JSON
        .then(response => {
            // Kiểm tra xem yêu cầu fetch có thành công không
            if (!response.ok) {
                // Ném lỗi nếu có vấn đề với HTTP request
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // Phân tích dữ liệu JSON từ response
            return response.json();
        })
        .then(posts => {
            // Log dữ liệu posts đã tải để kiểm tra
            console.log('Posts đã tải:', posts);

            // Xóa nội dung cũ trong container (đề phòng trường hợp gọi lại hàm)
            postsContainer.innerHTML = '';

            // Kiểm tra xem posts có phải là mảng và có phần tử không
            if (!Array.isArray(posts) || posts.length === 0) {
                // Hiển thị thông báo nếu không có bài đăng hoặc dữ liệu không hợp lệ
                postsContainer.innerHTML = '<p class="text-center text-gray-500">Hiện chưa có tin tức hay sự kiện nào.</p>';
                console.log('Không tìm thấy bài đăng hoặc dữ liệu không phải là mảng.');
                return; // Thoát hàm
            }

            // Chỉ lấy 3 bài đăng đầu tiên để hiển thị trên trang chủ
            posts.slice(0, 3).forEach(post => {
                // Tạo các phần tử HTML cho mỗi bài đăng
                const article = document.createElement('article');
                // Thêm class Tailwind để tạo kiểu dáng cơ bản
                article.className = 'mb-6 p-4 border border-gray-200 rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700';

                const title = document.createElement('h3');
                title.className = 'text-xl font-semibold mb-2 text-gray-900 dark:text-white';
                title.textContent = post.title; // Đặt tiêu đề bài đăng

                const date = document.createElement('p');
                date.className = 'text-sm text-gray-500 dark:text-gray-400 mb-2';
                // Định dạng ngày nếu cần, ở đây dùng trực tiếp từ JSON
                date.textContent = `Ngày đăng: ${post.date}`; // Đặt ngày đăng

                const summary = document.createElement('p');
                summary.className = 'text-gray-700 dark:text-gray-300 mb-3';
                summary.textContent = post.summary; // Đặt tóm tắt bài đăng

                const link = document.createElement('a');
                link.className = 'text-blue-600 hover:underline dark:text-blue-500';
                link.href = post.link; // Đặt link chi tiết
                link.textContent = 'Đọc thêm...'; // Văn bản cho link
                link.target = '_blank'; // Mở link trong tab mới
                link.rel = 'noopener noreferrer'; // Bảo mật khi mở tab mới

                // Gắn các phần tử con vào article
                article.appendChild(title);
                article.appendChild(date);
                article.appendChild(summary);
                article.appendChild(link);

                // Gắn article vào container chính
                postsContainer.appendChild(article);
            });
        })
        .catch(error => {
            // Bắt và log lỗi nếu có vấn đề trong quá trình fetch hoặc xử lý JSON
            console.error('Lỗi khi tải hoặc xử lý posts:', error);
            // Hiển thị thông báo lỗi cho người dùng trong container
            if (postsContainer) {
                postsContainer.innerHTML = '<p class="text-red-500 text-center">Đã xảy ra lỗi khi tải tin tức. Vui lòng thử lại sau.</p>';
            }
        });
}

/**
 * Kích hoạt link điều hướng của trang hiện tại.
 */
function activateCurrentNavLink() {
    // Lấy phần cuối của URL (tên file hoặc rỗng nếu là trang chủ)
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    // Lấy tất cả các link trong thẻ nav
    const navLinks = document.querySelectorAll('nav a'); // Giả sử menu nằm trong <nav>

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        // So sánh href của link với trang hiện tại
        // Xử lý trường hợp href là "/" hoặc "/index.html" cho trang chủ
        const isActive = (linkHref === currentPage) ||
                         (currentPage === 'index.html' && (linkHref === '/' || linkHref === './' || linkHref === 'index.html'));

        if (isActive) {
            // Thêm class active (ví dụ: thay đổi màu nền, chữ)
            link.classList.add('bg-sky-700', 'text-white', 'dark:bg-sky-600');
            link.classList.remove('text-gray-300', 'hover:bg-gray-700', 'hover:text-white', 'dark:hover:bg-gray-700');
             // Thêm thuộc tính aria-current nếu muốn (tốt cho accessibility)
            link.setAttribute('aria-current', 'page');
        } else {
            // Xóa class active khỏi các link khác
            link.classList.remove('bg-sky-700', 'text-white', 'dark:bg-sky-600');
            link.classList.add('text-gray-300', 'hover:bg-gray-700', 'hover:text-white', 'dark:hover:bg-gray-700');
            link.removeAttribute('aria-current');
        }
    });
}


// --- MAIN EXECUTION ---

// Lắng nghe sự kiện DOMContentLoaded để đảm bảo HTML đã được tải xong
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Đợi includeHTML hoàn thành trước khi làm việc khác
        await includeHTML();
        console.log('HTML includes completed.');

        // Sau khi HTML được chèn (đặc biệt là header/footer), mới chạy các hàm khác
        setupLanguageSwitcher(); // Thiết lập chuyển đổi ngôn ngữ
        activateCurrentNavLink(); // Kích hoạt link nav hiện tại
        loadPosts(); // Tải tin tức/sự kiện

        // Các hàm khởi tạo khác có thể gọi ở đây
        // initDarkMode(); // Ví dụ: Khởi tạo dark mode nếu có

    } catch (error) {
        console.error("Lỗi trong quá trình khởi tạo trang:", error);
    }
});

// Có thể thêm các hàm khởi tạo khác ở đây nếu cần
// Ví dụ: Hàm khởi tạo dark mode
/*
function initDarkMode() {
    // Logic kiểm tra localStorage hoặc cài đặt hệ thống để bật/tắt dark mode
    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classL