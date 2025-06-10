/**
 * posts-loader.js
 * Kịch bản này chịu trách nhiệm tải và hiển thị các bài viết tin tức của IVS từ một tệp JSON,
 * với khả năng giới hạn số lượng bài viết và hỗ trợ đa ngôn ngữ.
 * © 2025 IVS JSC. All rights reserved.
 */

/**
 * Lấy ngôn ngữ hiện tại từ thẻ HTML.
 * @returns {string} Mã ngôn ngữ hiện tại ('vi' hoặc 'en').
 */
function getCurrentLanguage() {
    return document.documentElement.lang || 'vi';
}

/**
 * Tải và hiển thị các bài viết tin tức của IVS.
 * @param {string} [containerId='news-container'] - ID của phần tử container để chèn tin tức vào.
 * @param {string} [jsonPath='data/posts.json'] - Đường dẫn đến tệp JSON chứa dữ liệu bài viết.
 * @param {number|null} [limit=null] - Số lượng bài viết tối đa để hiển thị. Nếu null, tất cả sẽ được hiển thị.
 */
window.loadPosts = async function(containerId = 'news-container', jsonPath = '/data/posts.json', limit = null) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Posts container #${containerId} not found.`);
        return;
    }

    // Hiển thị thông báo đang tải.
    const loadingText = document.documentElement.lang === 'vi' ? 'Đang tải tin tức...' : 'Loading news...';
    container.innerHTML = `<p class="col-span-full text-center text-ivs-text-secondary">${loadingText}</p>`;

    try {
        const response = await fetch(jsonPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let posts = await response.json();

        // Sắp xếp bài viết theo ngày giảm dần (mới nhất trước).
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Áp dụng giới hạn nếu được chỉ định.
        if (limit && typeof limit === 'number' && limit > 0) {
            posts = posts.slice(0, limit);
        }

        if (posts.length === 0) {
            const noNewsText = document.documentElement.lang === 'vi' ? 'Không có tin tức nào để hiển thị.' : 'No news available to display.';
            container.innerHTML = `<p class="col-span-full text-center text-ivs-text-secondary">${noNewsText}</p>`;
            return;
        }

        const lang = getCurrentLanguage();
        let htmlContent = '';

        posts.forEach((post, index) => {
            // Truy cập an toàn các thuộc tính đa ngôn ngữ với fallback.
            const title = post.title?.[lang] || post.title?.['vi'] || 'Tiêu đề không có sẵn';
            const link = post.link || '#';
            const imageUrl = post.image || `https://placehold.co/600x400/161B22/c9d1d9?text=IVS+News`;
            const imageAlt = post.image_alt?.[lang] || post.image_alt?.['vi'] || title;
            const snippet = post.excerpt?.[lang] || post.excerpt?.['vi'] || 'Nội dung không có sẵn.';
            const date = post.date ? new Date(post.date).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';
            const hotLabel = post.hot ? `<span class="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg z-10">HOT</span>` : '';

            htmlContent += `
                <div class="glass-card flex flex-col overflow-hidden rounded-2xl h-full" data-aos="fade-up" data-aos-delay="${index * 100}">
                    <a href="${link}" class="block relative group">
                        ${hotLabel}
                        <img src="${imageUrl}" alt="${imageAlt}" class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" onerror="this.onerror=null; this.src='https://placehold.co/600x400/161B22/c9d1d9?text=Image+Error'; this.alt='Image load error';">
                    </a>
                    <div class="p-6 flex flex-col flex-grow">
                        <p class="text-xs text-ivs-text-secondary mb-2">${date}</p>
                        <h3 class="text-lg font-semibold text-white mb-3 line-clamp-2">
                            <a href="${link}" class="hover:text-ivs-blue transition-colors">${title}</a>
                        </h3>
                        <p class="text-sm text-ivs-text-secondary mb-4 line-clamp-3 flex-grow">${snippet}</p>
                        <a href="${link}" class="mt-auto font-semibold text-ivs-blue hover:text-ivs-blue-darker text-sm self-start">
                            <span data-lang-key="news_read_more">Đọc thêm</span> <i class="fas fa-arrow-right ml-1 text-xs"></i>
                        </a>
                    </div>
                </div>
            `;
        });
        container.innerHTML = htmlContent;
    } catch (error) {
        console.error("Error loading IVS posts:", error);
        const errorText = document.documentElement.lang === 'vi' ? 'Lỗi tải tin tức. Vui lòng thử lại sau.' : 'Failed to load news. Please try again later.';
        container.innerHTML = `<p class="col-span-full text-center text-red-500">${errorText}</p>`;
    }
};
