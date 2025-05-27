document.addEventListener('DOMContentLoaded', function() {
    const rssUrl = 'https://vnexpress.net/rss/giao-duc.rss';
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
    const feedContainer = document.getElementById('vnexpress-rss-feed');

    if (feedContainer) {
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                feedContainer.innerHTML = '';

                if (data.status === 'ok') {
                    const items = data.items.slice(0, 5);

                    items.forEach(item => {
                        const articleDiv = document.createElement('div');
                        articleDiv.className = 'border-b border-gray-300 dark:border-gray-700 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0';

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
                        if (item.description) {
                            const tempDiv = document.createElement('div');
                            tempDiv.innerHTML = item.description;
                            descriptionText = tempDiv.textContent || tempDiv.innerText || "";
                            
                            const imgRegex = /<img src="([^"]+)"[^>]*>/;
                            const imgMatch = item.description.match(imgRegex);
                            if (imgMatch && imgMatch[1]) {
                                const imgElement = document.createElement('img');
                                imgElement.src = imgMatch[1];
                                imgElement.alt = item.title;
                                imgElement.className = 'my-2 rounded-md max-w-full h-auto md:max-w-xs float-left mr-3';
                                articleDiv.appendChild(imgElement);
                            }
                            
                            const summaryLimit = 150; 
                            descriptionText = descriptionText.length > summaryLimit ? descriptionText.substring(0, summaryLimit) + "..." : descriptionText;
                        }

                        const descriptionParagraph = document.createElement('p');
                        descriptionParagraph.className = 'text-gray-700 dark:text-gray-300 text-sm leading-relaxed';
                        descriptionParagraph.textContent = descriptionText;


                        articleDiv.appendChild(titleLink);
                        articleDiv.appendChild(dateParagraph);
                        if (descriptionText) {
                             articleDiv.appendChild(descriptionParagraph);
                        }
                        
                        const clearDiv = document.createElement('div');
                        clearDiv.style.clear = 'both';
                        articleDiv.appendChild(clearDiv);

                        feedContainer.appendChild(articleDiv);
                    });
                } else {
                    feedContainer.innerHTML = `<p class="text-red-600 dark:text-red-400">Không thể tải tin tức từ VnExpress (Lỗi API: ${data.message || 'Unknown error'}).</p>`;
                }
            })
            .catch(error => {
                console.error('Error fetching RSS feed:', error);
                feedContainer.innerHTML = '<p class="text-red-600 dark:text-red-400">Đã xảy ra lỗi khi tải tin tức. Vui lòng thử lại sau.</p>';
            });
    } else {
        console.error('Feed container element #vnexpress-rss-feed not found!');
    }

    function loadPublicServiceFeeds() {
        // Cấu hình RSS feeds
        const rssFeeds = [
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

        // CORS Proxy để tránh lỗi cross-origin
        const corsProxy = 'https://api.allorigins.win/raw?url=';

        rssFeeds.forEach(feed => {
            const container = document.getElementById(feed.id);
            if (!container) return;

            // Hiển thị loading state
            container.innerHTML = `
                <div class="animate-pulse">
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                </div>
            `;

            // Fetch RSS feed
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
                    console.error(`Error fetching ${feed.title}:`, error);
                    container.innerHTML = `
                        <div class="text-red-500 dark:text-red-400">
                            Không thể tải tin tức. Vui lòng thử lại sau.
                        </div>
                    `;
                });
        });
    }

    // Thêm containers vào trang HTML
    const publicServiceTemplate = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div id="congbao-feed" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"></div>
            <div id="nhandan-law-feed" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"></div>
        </div>
    `;

    // Thêm vào DOM khi trang đã load
    document.addEventListener('DOMContentLoaded', () => {
        const container = document.querySelector('#public-services-content');
        if (container) {
            container.insertAdjacentHTML('beforeend', publicServiceTemplate);
            loadPublicServiceFeeds();
        }
    });
});
