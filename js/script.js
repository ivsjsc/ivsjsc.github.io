// script.js
document.addEventListener('DOMContentLoaded', function () {
  // Tìm nút hamburger và phần nội dung điều hướng
  const hamburger = document.querySelector('.hamburger');
  const navContent = document.querySelector('.nav-content');

  // Thêm sự kiện click cho nút hamburger
  hamburger.addEventListener('click', function () {
    navContent.classList.toggle('active');
  });
});
