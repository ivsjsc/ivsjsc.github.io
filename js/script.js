document.addEventListener('DOMContentLoaded', function () {
  // Hàm để kiểm tra và gắn sự kiện sau khi header được load
  function initializeMenuEvents() {
      const hamburger = document.querySelector('.hamburger');
      const mobileMenu = document.querySelector('.mobile-menu');
      const closeMenu = document.querySelector('.close-menu');
      const overlay = document.querySelector('.overlay');
      const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
      const submenuToggles = document.querySelectorAll('.dropdown-submenu > a');

      // Kiểm tra xem các phần tử đã tồn tại chưa
      if (!hamburger || !mobileMenu || !overlay) {
          console.error('Một hoặc nhiều phần tử không tồn tại:', {
              hamburger,
              mobileMenu,
              overlay,
          });
          return;
      }

      // Toggle mobile menu
      hamburger.addEventListener('click', () => {
          mobileMenu.classList.add('active');
          overlay.classList.add('active');
          document.body.style.overflow = 'hidden';
      });

      if (closeMenu) {
          closeMenu.addEventListener('click', () => {
              mobileMenu.classList.remove('active');
              overlay.classList.remove('active');
              document.body.style.overflow = '';
          });
      }

      overlay.addEventListener('click', () => {
          mobileMenu.classList.remove('active');
          overlay.classList.remove('active');
          document.body.style.overflow = '';
      });

      // Dropdown toggle
      dropdownToggles.forEach(toggle => {
          toggle.addEventListener('click', function (e) {
              e.preventDefault();
              const dropdownMenu = this.nextElementSibling;
              if (dropdownMenu) {
                  dropdownMenu.classList.toggle('show');
                  const parent = this.closest('.dropdown');
                  parent.classList.toggle('active');
              }
          });
      });

      // Submenu toggle (mobile only)
      submenuToggles.forEach(toggle => {
          toggle.addEventListener('click', function (e) {
              if (window.innerWidth <= 992) {
                  e.preventDefault();
                  const submenu = this.nextElementSibling;
                  submenu.classList.toggle('show');
              }
          });
      });
  }

  // Chờ header được load
  const headerElement = document.getElementById('header');
  if (headerElement.innerHTML) {
      // Nếu header đã được load, chạy ngay
      initializeMenuEvents();
  } else {
      // Nếu header chưa được load, chờ fetch hoàn tất
      const checkHeader = setInterval(() => {
          if (headerElement.innerHTML) {
              clearInterval(checkHeader);
              initializeMenuEvents();
          }
      }, 100);
  }

  // Preserve existing redirect logic
  const redirectUrl = "https://facebook.com/hr.ivsacademy";
  const countdownDuration = 120000;
  const redirectTimer = document.getElementById('redirect-timer');
  const cancelButton = document.getElementById("cancel-redirect");

  function startRedirectCountdown() {
      if (redirectTimer && cancelButton) {
          let timeLeft = countdownDuration / 1000;
          const redirectTimeout = setInterval(() => {
              if (timeLeft <= 0) {
                  clearInterval(redirectTimeout);
                  window.location.href = redirectUrl;
              } else {
                  redirectTimer.textContent = `Website sẽ tự động chuyển đến Fanpage IVS Academy trong ${Math.floor(timeLeft / 60)} phút ${timeLeft % 60} giây...`;
                  timeLeft--;
              }
          }, 1000);

          cancelButton.addEventListener("click", () => {
              clearInterval(redirectTimeout);
              cancelButton.textContent = "Đã hủy chuyển hướng";
              cancelButton.disabled = true;
              redirectTimer.textContent = "Chuyển hướng đã bị hủy.";
          });
      }
  }

  startRedirectCountdown();

  // Preserve existing carousel and other scripts
  // Load and display posts
  async function loadPosts() {
      try {
          const response = await fetch('posts.json');
          if (!response.ok) throw new Error('Failed to load posts');
          const posts = await response.json();
          
          const postList = document.getElementById('post-list');
          if (!postList) return;
          
          if (posts.length === 0) {
              postList.innerHTML = '<p class="no-posts">No featured posts available</p>';
              return;
          }
          
          // Clear existing content
          postList.innerHTML = '';
          
          // Create post elements
          posts.forEach(post => {
              const postElement = createPostElement(post);
              postList.appendChild(postElement);
          });
          
          // Initialize carousel if desktop
          if (window.innerWidth > 768) {
              initCarousel();
          }
      } catch (error) {
          console.error('Error loading posts:', error);
          const postList = document.getElementById('post-list');
          if (postList) {
              postList.innerHTML = '<p class="error">Error loading featured posts</p>';
          }
      }
  }

  function createPostElement(post) {
      const postDiv = document.createElement('div');
      postDiv.className = 'post-preview';
      
      postDiv.innerHTML = `
          <div class="post-image">
              <img src="${post.image}" alt="${post.title}" loading="lazy">
              ${post.hot ? '<span class="hot-label">HOT</span>' : ''}
          </div>
          <div class="post-content">
              <h3><a href="${post.url}">${post.title}</a></h3>
              <p>${post.excerpt}</p>
              <a href="${post.url}" class="view-more">Xem thêm</a>
          </div>
      `;
      
      return postDiv;
  }

  function initCarousel() {
      const postList = document.getElementById('post-list');
      const posts = document.querySelectorAll('.post-preview');
      const prevBtn = document.getElementById('prev-slide');
      const nextBtn = document.getElementById('next-slide');
      
      if (!postList || posts.length === 0 || !prevBtn || !nextBtn) return;
      
      let currentIndex = 0;
      const totalPosts = posts.length;
      
      // Position posts
      posts.forEach((post, index) => {
          post.style.transform = `translateX(${index * 100}%)`;
      });
      
      // Show current slide
      function showSlide(index) {
          if (index >= totalPosts) currentIndex = 0;
          if (index < 0) currentIndex = totalPosts - 1;
          
          posts.forEach((post, i) => {
              post.style.transform = `translateX(${(i - currentIndex) * 100}%)`;
          });
      }
      
      // Navigation buttons
      prevBtn.addEventListener('click', () => {
          currentIndex--;
          showSlide(currentIndex);
      });
      
      nextBtn.addEventListener('click', () => {
          currentIndex++;
          showSlide(currentIndex);
      });
      
      // Auto slide
      let slideInterval = setInterval(() => {
          currentIndex++;
          showSlide(currentIndex);
      }, 5000);
      
      // Pause on hover
      postList.addEventListener('mouseenter', () => {
          clearInterval(slideInterval);
      });
      
      postList.addEventListener('mouseleave', () => {
          slideInterval = setInterval(() => {
              currentIndex++;
              showSlide(currentIndex);
          }, 5000);
      });
  }
  function startRedirectCountdown() {
    if (redirectTimer && cancelButton) {
        let timeLeft = countdownDuration / 1000;
        const redirectTimeout = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(redirectTimeout);
                window.location.href = redirectUrl;
            } else {
                redirectTimer.textContent = `Website sẽ tự động chuyển đến Fanpage IVS Academy trong ${Math.floor(timeLeft / 60)} phút ${timeLeft % 60} giây...`;
                timeLeft--;
            }
        }, 1000);

        cancelButton.addEventListener("click", () => {
            clearInterval(redirectTimeout);
            cancelButton.textContent = "Đã hủy chuyển hướng";
            cancelButton.disabled = true;
            redirectTimer.textContent = "Chuyển hướng đã bị hủy.";
        });
    }
  // Responsive adjustments
  window.addEventListener('resize', () => {
      if (window.innerWidth <= 768) {
          const postList = document.getElementById('post-list');
          if (postList) {
              postList.style.height = 'auto';
              const posts = document.querySelectorAll('.post-preview');
              posts.forEach(post => {
                  post.style.transform = 'none';
                  post.style.position = 'relative';
              });
          }
      }
  });
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
});

closeMenu.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
});
  // Load posts
  async function loadPosts() {
    try {
        const response = await fetch('posts.json');
        if (!response.ok) throw new Error('Failed to load posts');
        const posts = await response.json();
        
        const postList = document.getElementById('post-list');
        if (!postList) return;
        
        if (posts.length === 0) {
            postList.innerHTML = '<p class="no-posts">No featured posts available</p>';
            return;
        }
        
        postList.innerHTML = '';
        
        posts.forEach(post => {
            const postElement = createPostElement(post);
            postList.appendChild(postElement);
        });
        
        if (window.innerWidth > 768) {
            initCarousel();
        }
    } catch (error) {
        console.error('Error loading posts:', error);
        const postList = document.getElementById('post-list');
        if (postList) {
            postList.innerHTML = '<p class="error">Error loading featured posts</p>';
        }
    }
}
function createPostElement(post) {
  const postDiv = document.createElement('div');
  postDiv.className = 'post-preview';
  
  postDiv.innerHTML = `
      <div class="post-image">
          <img src="${post.image}" alt="${post.title}" loading="lazy" onerror="this.src='/images/fallback.jpg';">
          ${post.hot ? '<span class="hot-label">HOT</span>' : ''}
      </div>
      <div class="post-content">
          <h3><a href="${post.url}">${post.title}</a></h3>
          <p>${post.excerpt}</p>
          <a href="${post.url}" class="view-more">Xem thêm</a>
      </div>
  `;
  
  return postDiv;
}
fetch('footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer').innerHTML = data;
    })
    .catch(error => console.error('Error loading footer:', error));
    fetch('footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer').innerHTML = data;
    })
    .catch(error => {
        console.error('Error loading footer:', error);
        document.getElementById('footer').innerHTML = '<footer><p style="text-align: center; color: red;">Không thể tải footer. Vui lòng thử lại sau.</p></footer>';
    });
    dropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', function (e) {
          e.preventDefault();
          const dropdownMenu = this.nextElementSibling;
          if (dropdownMenu) {
              const isExpanded = dropdownMenu.classList.contains('show');
              this.setAttribute('aria-expanded', !isExpanded);
              dropdownMenu.classList.toggle('show');
              const parent = this.closest('.dropdown');
              parent.classList.toggle('active');
          }
      });
  });
});