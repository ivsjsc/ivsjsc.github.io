// Expose loadPosts function globally
window.loadPosts = async function() {
    const postsContainer = document.getElementById('local-posts-feed'); // Ensure this ID is consistent with HTML
    if (!postsContainer) {
        console.error("[posts-loader.js] News container element with ID 'local-posts-feed' not found.");
        return;
    }
    
    try {
        const response = await fetch(window.location.origin + '/posts.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const posts = await response.json();
        
        postsContainer.innerHTML = ''; 

        if (posts && posts.length > 0) {
            const latestPosts = posts.slice(0, 3); // Display only the first 3 posts
            latestPosts.forEach(post => {
                const currentLang = window.currentLang || 'vi'; // Get current language from global state

                // Handle multilingual title
                let displayTitle = post.title;
                if (typeof post.title === 'object' && post.title !== null) {
                    displayTitle = post.title[currentLang] || post.title['vi'] || '';
                }

                // Handle multilingual excerpt
                let displayExcerpt = post.excerpt;
                if (typeof post.excerpt === 'object' && post.excerpt !== null) {
                    displayExcerpt = post.excerpt[currentLang] || post.excerpt['vi'] || '';
                }

                // Format date
                const displayDate = new Date(post.date).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                const postElement = document.createElement('div');
                postElement.className = 'bg-white dark:bg-slate-800 dark:border-slate-700 p-6 rounded-lg shadow-md flex flex-col transition-transform duration-300 ease-in-out hover:scale-105';
                postElement.setAttribute('data-aos', 'fade-up');
                postElement.innerHTML = `
                    <img src="${post.image || 'https://placehold.co/400x250/cccccc/333333?text=Tin+tức'}" 
                         alt="${post.image_alt?.[currentLang] || post.image_alt?.['vi'] || displayTitle}" 
                         class="rounded-md mb-4 object-cover w-full h-48">
                    <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">${displayTitle}</h3>
                    <p class="text-gray-600 dark:text-gray-400 text-sm mb-3">${displayDate}</p>
                    <p class="text-gray-700 dark:text-gray-300 mb-4 flex-grow line-clamp-3">${displayExcerpt}</p>
                    <a href="${post.link}" 
                       class="mt-auto text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500 font-medium inline-flex items-center">
                        ${currentLang === 'vi' ? 'Đọc thêm' : 'Read more'}
                        <i class="fas fa-arrow-right ml-1"></i>
                    </a>
                `;
                postsContainer.appendChild(postElement);
            });
        } else {
            postsContainer.innerHTML = `
                <p class="text-gray-500 dark:text-gray-400 col-span-full text-center" data-lang-key="no_news_available">
                    ${currentLang === 'vi' ? 'Không có tin tức nào để hiển thị.' : 'No news available.'}
                </p>`;
        }
    } catch (error) {
        console.error('[posts-loader.js] Error fetching or processing posts.json:', error);
        postsContainer.innerHTML = `
            <p class="text-red-500 dark:text-red-400 col-span-full text-center" data-lang-key="news_load_error">
                ${(window.currentLang || 'vi') === 'vi' ? 
                  `Lỗi tải tin tức: ${error.message}. Vui lòng thử lại sau.` : 
                  `Error loading news: ${error.message}. Please try again later.`}
            </p>`;
    }
};

// Removed DOMContentLoaded listener as it's now handled by loadComponents.js
