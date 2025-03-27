// js.js
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const closeMenu = document.querySelector('.close-menu');
const overlay = document.querySelector('.overlay');
const navLinks = document.querySelectorAll('.nav-menu .nav-tabs a');
const dropdownToggles = document.querySelectorAll('.nav-tabs .dropdown-toggle');
const dropdownMenus = document.querySelectorAll('.nav-tabs .dropdown-menu');
const postList = document.getElementById('post-list');
const prevButton = document.getElementById('prev-btn');
const nextButton = document.getElementById('next-btn');
let postsData = [];

function toggleMenu() {
    navMenu.classList.toggle('active');
    overlay.classList.toggle('active');
}

hamburger.addEventListener('click', toggleMenu);
closeMenu.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });
});

dropdownToggles.forEach((toggle, index) => {
    toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const currentMenu = dropdownMenus[index];
        if (currentMenu) {
            currentMenu.classList.toggle('show');
            // Thêm hiệu ứng fade in/out cho dropdown
            currentMenu.style.transition = 'opacity 0.3s ease';
            if (currentMenu.classList.contains('show')) {
                currentMenu.style.opacity = '1';
            } else {
                currentMenu.style.opacity = '0';
            }
        }
    });
});

document.addEventListener('click', (e) => {
    dropdownMenus.forEach(menu => {
        if (menu.classList.contains('show') && !menu.contains(e.target) && e.target.className !== 'dropdown-toggle') {
            menu.classList.remove('show');
            // Thêm hiệu ứng fade in/out cho dropdown
            menu.style.transition = 'opacity 0.3s ease';
            menu.style.opacity = '0';
            setTimeout(() => {
                menu.style.transition = ''; // reset transition sau khi ẩn
            }, 300);
        }
    });
});


let redirectTimeout;
const redirectUrl = "https://facebook.com/hr.ivsacademy";
const countdownDuration = 120000;

function startRedirectCountdown() {
    redirectTimeout = setTimeout(() => {
        window.location.href = redirectUrl;
    }, countdownDuration);
}

function cancelRedirect() {
    clearTimeout(redirectTimeout);
    document.getElementById('redirect-timer').textContent = "Chuyển hướng đã bị hủy.";
    cancelBtn.textContent = "Đã hủy chuyển hướng";
    cancelBtn.disabled = true;
}

startRedirectCountdown();

const cancelBtn = document.getElementById("cancel-redirect");
cancelBtn.addEventListener("click", cancelRedirect);


let currentIndex = 0;
let intervalId;

function showPost(index) {
    postPreviews.forEach((post, i) => {
        post.style.transform = `translateX(${(i - index) * 100}%)`;
    });
}

function nextPost() {
    currentIndex = (currentIndex + 1) % postPreviews.length;
    showPost(currentIndex);
}

function prevPost() {
    currentIndex = (currentIndex - 1 + postPreviews.length) % postPreviews.length;
    showPost(currentIndex);
}

function startCarousel() {
    intervalId = setInterval(nextPost, 5000);
}

function stopCarousel() {
    clearInterval(intervalId);
}

function createPostElement(post) {
    const postPreview = document.createElement('div');
    postPreview.className = 'post-preview';

    const postImage = document.createElement('div');
    postImage.className = 'post-image';
    const img = document.createElement('img');
    img.src = post.imageUrl;
    img.alt = post.title;
    postImage.appendChild(img);

    if (post.hot) {
        const hotLabel = document.createElement('span');
        hotLabel.className = 'hot-label';
        hotLabel.textContent = 'Hot';
        postImage.appendChild(hotLabel);
    }

    const content = document.createElement('div');
    content.className = 'content';
    const h3 = document.createElement('h3');
    const a = document.createElement('a');
    a.href = post.url;
    a.textContent = post.title;
    h3.appendChild(a);
    content.appendChild(h3);

    const p = document.createElement('p');
    p.textContent = post.description;
    content.appendChild(p);

    const viewMore = document.createElement('a');
    viewMore.href = post.url;
    viewMore.className = 'view-more';
    viewMore.textContent = 'Xem thêm';
    content.appendChild(viewMore);

    postPreview.appendChild(postImage);
    postPreview.appendChild(content);

    return postPreview;
}

function loadPosts() {
    fetch('posts.json')
        .then(response => response.json())
        .then(data => {
            postsData = data;
            if (postsData.length > 0) {
                postsData.forEach(post => {
                    const postElement = createPostElement(post);
                    postList.appendChild(postElement);
                });
                postPreviews = document.querySelectorAll('.post-preview');
                showPost(currentIndex);
                if (postPreviews.length > 1) {
                    startCarousel();
                    prevButton.addEventListener('click', () => {
                        stopCarousel();
                        prevPost();
                        startCarousel();
                    });
                    nextButton.addEventListener('click', () => {
                        stopCarousel();
                        nextPost();
                        startCarousel();
                    });
                    postList.addEventListener('mouseenter', stopCarousel);
                    postList.addEventListener('mouseleave', startCarousel);
                }
            } else {
                postList.innerHTML = '<p>Không có bài viết nào.</p>';
            }
        })
        .catch(error => {
            console.error('Lỗi khi tải bài viết:', error);
            postList.innerHTML = '<p>Đã xảy ra lỗi khi tải bài viết.</p>';
        });
}

loadPosts();