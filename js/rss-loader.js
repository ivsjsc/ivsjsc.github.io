document.addEventListener('DOMContentLoaded', function() {
    // URL của RSS feed VnExpress Giáo dục
    const rssUrl = 'https://vnexpress.net/rss/giao-duc.rss';
    // URL của dịch vụ rss2json
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    // Phần tử div để hiển thị feed
    const feedContainer = document.getElementById('vnexpress-rss-feed');

    if (feedContainer) {
        // Gọi API để lấy dữ liệu JSON
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                // Xóa thông báo "Đang tải..."
                feedContainer.innerHTML = '';

                // Kiểm tra trạng thái trả về từ API
                if (data.status === 'ok') {
                    // Lấy danh sách các bài viết (giới hạn 5 bài đầu tiên)
                    const items = data.items.slice(0, 5);

                    // Lặp qua từng bài viết và tạo HTML
                    items.forEach(item => {
                        const articleDiv = document.createElement('div');
                        articleDiv.className = 'border-b border-gray-200 pb-4 mb-4'; // Sử dụng class CSS của bạn

                        // Tiêu đề bài viết (là link trỏ đến bài gốc)
                        const titleLink = document.createElement('a');
                        titleLink.href = item.link;
                        titleLink.target = '_blank'; // Mở link trong tab mới
                        titleLink.rel = 'noopener noreferrer';
                        titleLink.className = 'text-lg font-semibold text-blue-600 hover:text-blue-800 hover:underline block mb-1'; // Class CSS
                        titleLink.textContent = item.title;

                        // Ngày đăng (có thể định dạng lại nếu muốn)
                        const pubDate = new Date(item.pubDate);
                        const dateString = pubDate.toLocaleDateString('vi-VN', {
                            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        });
                        const dateParagraph = document.createElement('p');
                        dateParagraph.className = 'text-sm text-gray-500 mb-2'; // Class CSS
                        dateParagraph.textContent = `Ngày đăng: ${dateString}`;

                        // Mô tả ngắn (lấy từ description, cần xử lý HTML)
                        // Tạm thời chỉ hiển thị tiêu đề và ngày đăng cho đơn giản và an toàn
                        // Nếu muốn hiển thị description, cần cẩn thận với HTML bên trong
                        // const descriptionParagraph = document.createElement('p');
                        // descriptionParagraph.className = 'text-gray-700 text-sm'; // Class CSS
                        // descriptionParagraph.innerHTML = item.description; // Cẩn thận XSS nếu dùng innerHTML

                        // Thêm tiêu đề và ngày đăng vào div bài viết
                        articleDiv.appendChild(titleLink);
                        articleDiv.appendChild(dateParagraph);
                        // articleDiv.appendChild(descriptionParagraph); // Bỏ comment nếu muốn hiển thị mô tả (và chấp nhận rủi ro/xử lý HTML)

                        // Thêm div bài viết vào container chính
                        feedContainer.appendChild(articleDiv);
                    });
                } else {
                    // Hiển thị lỗi nếu API trả về status không phải 'ok'
                    feedContainer.innerHTML = `<p class="text-red-600">Không thể tải tin tức từ VnExpress (Lỗi API: ${data.message || 'Unknown error'}).</p>`;
                }
            })
            .catch(error => {
                // Hiển thị lỗi nếu fetch thất bại (lỗi mạng, CORS nếu không dùng proxy,...)
                console.error('Error fetching RSS feed:', error);
                feedContainer.innerHTML = '<p class="text-red-600">Đã xảy ra lỗi khi tải tin tức. Vui lòng thử lại sau.</p>';
            });
    } else {
        console.error('Feed container element not found!');
    }
});