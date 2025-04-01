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
  
    // Redirect logic (giữ nguyên)
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
  });