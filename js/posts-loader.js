// posts-loader.js
// This script is responsible for fetching and displaying IVS news posts from a JSON file.

window.loadPosts = async function(containerId = 'news-container') {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Posts container #${containerId} not found.`);
        return;
    }

    container.innerHTML = `<p class="text-gray-500 dark:text-gray-400 col-span-full text-center" data-lang-key="loading_news">Đang tải tin tức...</p>`; // Show loading

    try {
        const response = await fetch('/data/ivs-posts.json'); // Assuming your IVS posts are in this path
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const posts = await response.json();

        if (posts.length === 0) {
            container.innerHTML = `<p class="text-gray-500 dark:text-gray-400 col-span-full text-center" data-lang-key="no_news_available">Không có tin tức nào để hiển thị.</p>`;
            return;
        }

        let htmlContent = '';
        posts.forEach(post => {
            // Ensure all properties exist or provide fallbacks
            const title = post.title || 'No Title';
            const link = post.link || '#';
            const imageUrl = post.imageUrl || 'https://placehold.co/400x200/cccccc/333333?text=No+Image'; // Placeholder if no image
            const snippet = post.snippet || 'No description available.';
            const date = post.date ? new Date(post.date).toLocaleDateString('vi-VN') : 'N/A';
            const category = post.category || 'General';

            htmlContent += `
                <div class="news-card bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col">
                    <img src="${imageUrl}" alt="${title}" class="w-full h-40 object-cover rounded-t-lg" onerror="this.onerror=null; this.src='https://placehold.co/400x200/cccccc/333333?text=Image+Error';">
                    <div class="p-4 flex flex-col flex-grow">
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2 line-clamp-2">${title}</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">${snippet}</p>
                        <span class="text-xs text-gray-500 dark:text-gray-400 mb-3 block">Ngày đăng: ${date}</span>
                        <a href="${link}" target="_blank" rel="noopener noreferrer" class="mt-auto inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm">
                            Đọc thêm <i class="fas fa-arrow-right ml-1 text-xs"></i>
                        </a>
                    </div>
                </div>
            `;
        });
        container.innerHTML = htmlContent;
    } catch (error) {
        console.error("Error loading IVS posts:", error);
        container.innerHTML = `<p class="text-red-500 dark:text-red-400 col-span-full text-center" data-lang-key="news_load_error">Lỗi tải tin tức: ${error.message}. Vui lòng thử lại sau.</p>`;
    }
};

// Ensure this function is available globally if needed by other scripts
// window.loadPosts = loadPosts; // Already assigned above