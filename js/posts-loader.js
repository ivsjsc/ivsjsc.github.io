document.addEventListener('DOMContentLoaded', function() {
    const postsContainer = document.getElementById('local-posts-feed');

    if (postsContainer) {
        fetch('posts.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Lỗi tải dữ liệu: ${response.statusText}`);
                }
                return response.json();
            })
            .then(posts => {
                postsContainer.innerHTML = '';

                if (posts && posts.length > 0) {
                    posts.forEach(post => {
                        const postDiv = document.createElement('div');
                        postDiv.className = 'border-b border-gray-300 dark:border-gray-700 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0';

                        const titleLink = document.createElement('a');
                        titleLink.href = post.link;
                        titleLink.target = '_blank';
                        titleLink.rel = 'noopener noreferrer';
                        titleLink.className = 'text-lg font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline block mb-1';
                        titleLink.textContent = post.title.vi; // Lấy tiêu đề tiếng Việt

                        const dateParagraph = document.createElement('p');
                        dateParagraph.className = 'text-sm text-gray-500 dark:text-gray-400 mb-2';
                        dateParagraph.textContent = `Ngày đăng: ${post.date}`;

                        const excerptParagraph = document.createElement('p');
                        excerptParagraph.className = 'text-gray-700 dark:text-gray-300 text-sm leading-relaxed';
                        excerptParagraph.textContent = post.excerpt.vi; // Lấy nội dung tóm tắt tiếng Việt

                        postDiv.appendChild(titleLink);
                        postDiv.appendChild(dateParagraph);
                        postDiv.appendChild(excerptParagraph);
                        
                        postsContainer.appendChild(postDiv);
                    });
                } else {
                    postsContainer.innerHTML = '<p class="text-gray-600 dark:text-gray-400">Không có bài viết nào để hiển thị.</p>';
                }
            })
            .catch(error => {
                console.error('Lỗi khi tải bài viết:', error);
                postsContainer.innerHTML = '<p class="text-red-600 dark:text-red-400">Đã xảy ra lỗi khi tải bài viết. Vui lòng thử lại sau.</p>';
            });
    } else {
        console.error('Không tìm thấy phần tử chứa bài viết có ID #local-posts-feed!');
    }
});
