<script>
  // Hamburger Menu Functionality
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const closeMenu = document.querySelector('.close-menu');

  // Mở menu khi click vào hamburger
  hamburger.addEventListener('click', () => {
    navMenu.classList.add('active');
  });

  // Đóng menu khi click vào nút close
  closeMenu.addEventListener('click', () => {
    navMenu.classList.remove('active');
  });

  // Dropdown Menu Functionality (Mobile)
  document.querySelectorAll('.dropdown-toggle').forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();

      // Đóng tất cả các submenu khác trước khi mở submenu mới
      document.querySelectorAll('.dropdown-menu').forEach(sub => {
        if (sub !== this.nextElementSibling) {
          sub.classList.remove('active');
        }
      });

      // Toggle trạng thái submenu hiện tại
      const submenu = this.nextElementSibling;
      submenu.classList.toggle('active');
    });
  });

  // Xử lý sự kiện touch để ngăn chạm nhầm trên mobile
  document.querySelectorAll('.dropdown-menu a').forEach(link => {
    let touchStartTime;

    // Ghi lại thời điểm bắt đầu chạm
    link.addEventListener('touchstart', function(e) {
      touchStartTime = new Date().getTime();
    });

    // Kiểm tra thời gian chạm để ngăn hành vi không mong muốn
    link.addEventListener('touchend', function(e) {
      const touchDuration = new Date().getTime() - touchStartTime;
      if (touchDuration < 200) {
        e.preventDefault();
      }
    });
  });
</script>