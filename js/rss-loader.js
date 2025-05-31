// Expose setupTabs function globally
window.setupTabs = function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    const rssFeeds = {
        'education-news': {
            id: 'education-rss-container',
            url: 'https://vnexpress.net/rss/giao-duc.rss',
            title: 'Tin Giáo dục - VnExpress',
            maxItems: 5
        },
        'economy-news': {
            id: 'economy-rss-container',
            url: 'https://vnexpress.net/rss/kinh-doanh.rss',
            title: 'Tin Kinh tế - VnExpress',
            maxItems: 5
        },
        'technology-news': {
            id: 'technology-rss-container',
            url: 'https://vnexpress.net/rss/khoa-hoc.rss',
            title: 'Tin Công nghệ - VnExpress',
            maxItems: 5
        },
        'other-news': {
            id: 'other-rss-container',
            url: 'https://vnexpress.net/rss/the-gioi.rss',
            title: 'Tin Thế Giới - VnExpress',
            maxItems: 5
        }
    };

    // CORS Proxy to avoid cross-origin issues when fetching RSS
    const corsProxy = 'https://api.allorigins.win/raw?url=';

    async function fetchGenericRssFeed(feedConfig) {
        const container = document.getElementById(feedConfig.id);
        if (!container) {
            console.error(`[rss-loader.js] RSS container element #${feedConfig.id} not found.`);
            return;
        }

        // Display loading state
        container.innerHTML = `
            <div class="skeleton-loader news-card p-6 rounded-lg"><div class="h-40 mb-4"></div> <div class="h-6 w-3/4 mb-2"></div> <div class="h-4 w-full"></div> <div class="h-4 w-5/6 mt-1"></div> <div class="h-4 w-1/2 mt-4"></div> </div>
            <div class="skeleton-loader news-card p-6 rounded-lg hidden md:block"><div class="h-40 mb-4"></div> <div class="h-6 w-3/4 mb-2"></div> <div class="h-4 w-full"></div> <div class="h-4 w-5/6 mt-1"></div> <div class="h-4 w-1/2 mt-4"></div> </div>
            <div class="skeleton-loader news-card p-6 rounded-lg hidden lg:block"><div class="h-40 mb-4"></div> <div class="h-6 w-3/4 mb-2"></div> <div class="h-4 w-full"></div> <div class="h-4 w-5/6 mt-1"></div> <div class="h-4 w-1/2 mt-4"></div> </div>
        `;

        try {
            const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedConfig.url)}`);
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const data = await response.json();

            container.innerHTML = ''; // Clear loading state

            if (data.status === 'ok' && data.items) {
                const items = data.items.slice(0, feedConfig.maxItems);
                items.forEach(item => {
                    const articleDiv = document.createElement('div');
                    articleDiv.className = 'news-card p-6 rounded-lg shadow-md hover:shadow-xl transition-transform duration-300 ease-in-out hover:scale-105';
                    articleDiv.setAttribute('data-aos', 'fade-up');

                    const titleLink = document.createElement('a');
                    titleLink.href = item.link;
                    titleLink.target = '_blank';
                    titleLink.rel = 'noopener noreferrer';
                    titleLink.className = 'text-lg font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline block mb-1';
                    titleLink.textContent = item.title;

                    const pubDate = new Date(item.pubDate);
                    const dateString = pubDate.toLocaleDateString('vi-VN', {
                        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    });
                    const dateParagraph = document.createElement('p');
                    dateParagraph.className = 'text-sm text-gray-500 dark:text-gray-400 mb-2';
                    dateParagraph.textContent = `Ngày đăng: ${dateString}`;
                    
                    let descriptionText = '';
                    let imageUrl = '';
                    if (item.description) {
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = item.description;
                        descriptionText = tempDiv.textContent || tempDiv.innerText || "";
                        
                        const imgElement = tempDiv.querySelector('img');
                        if (imgElement && imgElement.src) {
                            imageUrl = imgElement.src;
                        }
                        
                        const summaryLimit = 150; 
                        descriptionText = descriptionText.length > summaryLimit ? descriptionText.substring(0, summaryLimit) + "..." : descriptionText;
                    }

                    const imgTag = imageUrl ? `<img src="${imageUrl}" alt="${item.title}" class="rounded-md mb-4 object-cover w-full h-48">` : '';

                    articleDiv.innerHTML = `
                        ${imgTag}
                        ${titleLink.outerHTML}
                        ${dateParagraph.outerHTML}
                        <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed flex-grow line-clamp-3">${descriptionText}</p>
                        <a href="${item.link}" class="mt-auto text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500 font-medium inline-flex items-center">
                            ${(window.currentLang || 'vi') === 'vi' ? 'Đọc thêm' : 'Read more'}
                            <i class="fas fa-arrow-right ml-1"></i>
                        </a>
                    `;
                    container.appendChild(articleDiv);
                });
            } else {
                container.innerHTML = `<p class="text-red-600 dark:text-red-400 col-span-full text-center">Không thể tải tin tức từ ${feedConfig.title} (Lỗi API: ${data.message || 'Unknown error'}).</p>`;
            }
        } catch (error) {
            console.error(`[rss-loader.js] Error fetching RSS feed for ${feedConfig.title}:`, error);
            container.innerHTML = `<p class="text-red-600 dark:text-red-400 col-span-full text-center">Đã xảy ra lỗi khi tải tin tức từ ${feedConfig.title}. Vui lòng thử lại sau.</p>`;
        }
    }

    async function fetchIvsNews() {
        const ivsNewsContainer = document.getElementById('ivs-news-container');
        if (!ivsNewsContainer) {
            console.error("[rss-loader.js] IVS News container element not found.");
            return;
        }

        ivsNewsContainer.innerHTML = `
            <div class="skeleton-loader news-card p-6 rounded-lg"><div class="h-40 mb-4"></div> <div class="h-6 w-3/4 mb-2"></div> <div class="h-4 w-full"></div> <div class="h-4 w-5/6 mt-1"></div> <div class="h-4 w-1/2 mt-4"></div> </div>
            <div class="skeleton-loader news-card p-6 rounded-lg hidden md:block"><div class="h-40 mb-4"></div> <div class="h-6 w-3/4 mb-2"></div> <div class="h-4 w-full"></div> <div class="h-4 w-5/6 mt-1"></div> <div class="h-4 w-1/2 mt-4"></div> </div>
            <div class="skeleton-loader news-card p-6 rounded-lg hidden lg:block"><div class="h-40 mb-4"></div> <div class="h-6 w-3/4 mb-2"></div> <div class="h-4 w-full"></div> <div class="h-4 w-5/6 mt-1"></div> <div class="h-4 w-1/2 mt-4"></div> </div>
        `;

        try {
            const response = await fetch(window.location.origin + '/posts.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const posts = await response.json();

            ivsNewsContainer.innerHTML = ''; // Clear loading state

            if (posts && posts.length > 0) {
                posts.forEach(post => {
                    const currentLang = window.currentLang || 'vi';

                    let displayTitle = post.title;
                    if (typeof post.title === 'object' && post.title !== null) {
                        displayTitle = post.title[currentLang] || post.title['vi'] || '';
                    }

                    let displayExcerpt = post.excerpt;
                    if (typeof post.excerpt === 'object' && post.excerpt !== null) {
                        displayExcerpt = post.excerpt[currentLang] || post.excerpt['vi'] || '';
                    }

                    const displayDate = new Date(post.date).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });

                    const postElement = document.createElement('div');
                    postElement.className = 'news-card p-6 rounded-lg shadow-md hover:shadow-xl transition-transform duration-300 ease-in-out hover:scale-105';
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
                    ivsNewsContainer.appendChild(postElement);
                });
            } else {
                ivsNewsContainer.innerHTML = `
                    <p class="text-gray-500 dark:text-gray-400 col-span-full text-center" data-lang-key="no_news_available">
                        ${currentLang === 'vi' ? 'Không có tin tức nào để hiển thị.' : 'No news available.'}
                    </p>`;
            }
        } catch (error) {
            console.error('[rss-loader.js] Error fetching or processing posts.json:', error);
            ivsNewsContainer.innerHTML = `
                <p class="text-red-500 dark:text-red-400 col-span-full text-center" data-lang-key="news_load_error">
                    ${(window.currentLang || 'vi') === 'vi' ? 
                      `Lỗi tải tin tức: ${error.message}. Vui lòng thử lại sau.` : 
                      `Error loading news: ${error.message}. Please try again later.`}
                </p>`;
        }
    }

    function setupTabs() {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTabId = button.dataset.tab;

                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.add('hidden'));

                button.classList.add('active');
                document.getElementById(targetTabId).classList.remove('hidden');

                if (targetTabId === 'ivs-news') {
                    fetchIvsNews();
                } else if (targetTabId === 'public-services-news') {
                    // Load public service feeds if not already loaded
                    loadPublicServiceFeeds();
                } else if (rssFeeds[targetTabId]) {
                    fetchGenericRssFeed(rssFeeds[targetTabId]);
                }
            });
        });

        // Initial load for IVS news tab
        fetchIvsNews();
    }

    // Public Service RSS feeds specific to news-archive.html
    function loadPublicServiceFeeds() {
        const publicServiceFeeds = [
            {
                id: 'congbao-feed',
                url: 'https://congbao.chinhphu.vn/cac_so_cong_bao_moi_dang.rss',
                title: 'Công Báo Chính Phủ',
                maxItems: 5
            },
            {
                id: 'nhandan-law-feed', 
                url: 'https://nhandan.vn/rss/phapluat-1287.rss',
                title: 'Tin Pháp Luật - Nhân Dân',
                maxItems: 5
            }
        ];

        publicServiceFeeds.forEach(feed => {
            const container = document.getElementById(feed.id);
            if (!container) return;

            container.innerHTML = `
                <div class="animate-pulse">
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                </div>
            `;

            fetch(corsProxy + encodeURIComponent(feed.url))
                .then(response => response.text())
                .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
                .then(data => {
                    const items = data.querySelectorAll("item");
                    let html = `<h3 class="text-lg font-semibold mb-4">${feed.title}</h3>`;
                    
                    items.forEach((item, index) => {
                        if (index >= feed.maxItems) return;
                        
                        const title = item.querySelector("title")?.textContent || '';
                        const link = item.querySelector("link")?.textContent || '';
                        const pubDate = item.querySelector("pubDate")?.textContent || '';
                        const date = new Date(pubDate).toLocaleDateString('vi-VN');

                        html += `
                            <div class="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                                <a href="${link}" target="_blank" rel="noopener noreferrer" 
                                   class="block group">
                                    <h4 class="text-sm font-medium text-gray-800 dark:text-gray-200 
                                             group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                        ${title}
                                    </h4>
                                    <div class="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                                        <i class="far fa-clock mr-2"></i>
                                        ${date}
                                    </div>
                                </a>
                            </div>
                        `;
                    });

                    container.innerHTML = html;
                })
                .catch(error => {
                    console.error(`[rss-loader.js] Error fetching ${feed.title}:`, error);
                    container.innerHTML = `
                        <div class="text-red-500 dark:text-red-400">
                            Không thể tải tin tức. Vui lòng thử lại sau.
                        </div>
                    `;
                });
        });
    }

    // Removed DOMContentLoaded listener as it's now handled by loadComponents.js
};
