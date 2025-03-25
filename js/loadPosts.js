const loadPosts = async () => {
    const postList = document.getElementById("post-list");
    if (!postList) {
      console.warn("Không tìm thấy post-list!");
      return;
    }
  
    try {
      const response = await fetch('posts.json');
      if (!response.ok) throw new Error('Không thể tải file posts.json');
      const posts = await response.json();
  
      posts.forEach(post => {
        const postDiv = document.createElement("div");
        postDiv.className = "post-preview";
        postDiv.innerHTML = `
          <div class="post-image">
            <img src="${post.image}" alt="${post.title}" loading="lazy">
            <span class="hot-label">HOT</span>
          </div>
          <div class="content">
            <h3><a href="${post.url}" target="_blank">${post.title}</a></h3>
            <p>${post.excerpt}</p>
            <a href="${post.url}" class="view-more" target="_blank">Xem thêm</a>
          </div>
        `;
        postList.appendChild(postDiv);
      });
  
      if (window.innerWidth > 600) initCarousel();
      window.addEventListener("resize", () => {
        if (window.innerWidth > 600) initCarousel();
      });
    } catch (error) {
      console.error('Lỗi khi tải posts:', error);
      postList.innerHTML = "<p>Không thể tải danh sách bài viết.</p>";
    }
    let touchStartX = 0;
let touchEndX = 0;

postList.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
});

postList.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  if (touchStartX - touchEndX > 50) showSlide(++currentSlide); // Swipe left
  if (touchEndX - touchStartX > 50) showSlide(--currentSlide); // Swipe right
});