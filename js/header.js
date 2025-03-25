  <script>
    // Toggle Hamburger Menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const closeMenu = document.querySelector('.close-menu');

    hamburger.addEventListener('click', () => {
      navMenu.classList.add('active');
    });

    closeMenu.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });

    // Toggle Dropdown Menu (Mobile)
    document.querySelectorAll('.dropdown-toggle').forEach(item => {
      item.addEventListener('click', function (e) {
        e.preventDefault();

        // Đóng tất cả submenu khác
        document.querySelectorAll('.dropdown-menu').forEach(sub => {
          if (sub !== this.nextElementSibling) {
            sub.classList.remove('active');
          }
        });

        // Toggle submenu hiện tại
        const submenu = this.nextElementSibling;
        submenu.classList.toggle('active');
      });
    });

    // Ngăn chạm nhầm trên submenu (Mobile)
    document.querySelectorAll('.dropdown-menu a').forEach(link => {
      let touchStartTime;

      link.addEventListener('touchstart', function (e) {
        touchStartTime = new Date().getTime();
      });

      link.addEventListener('touchend', function (e) {
        const touchDuration = new Date().getTime() - touchStartTime;
        if (touchDuration < 200) {
          e.preventDefault();
        }
      });
    });
  </script>