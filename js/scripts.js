const loadContent = async (elementId, url, errorMessage) => {
  const element = document.getElementById(elementId);
  if (!element) return;
  element.innerHTML = `<p style="text-align: center; padding: 20px;">Đang tải ${elementId}...</p>`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Không thể tải ${url}`);
    const data = await response.text();
    element.innerHTML = data;
    if (elementId === "header") initHeaderEvents();
  } catch (error) {
    console.error(`Lỗi khi tải ${elementId}:`, error);
    element.innerHTML = `<p style="text-align: center; color: red;">${errorMessage}</p>`;
  }
};

const initHeaderEvents = () => {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const closeMenu = document.querySelector(".close-menu");
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  document.body.appendChild(overlay);

  if (!hamburger || !navMenu || !closeMenu) {
    console.warn("Không tìm thấy một số phần tử trong header!");
    return;
  }

  hamburger.addEventListener("click", () => {
    if (window.innerWidth <= 600) {
      navMenu.classList.toggle("active");
      overlay.classList.toggle("active");
    }
  });

  closeMenu.addEventListener("click", () => {
    navMenu.classList.remove("active");
    overlay.classList.remove("active");
  });

  overlay.addEventListener("click", () => {
    navMenu.classList.remove("active");
    overlay.classList.remove("active");
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 600 && navMenu.classList.contains("active")) {
      navMenu.classList.remove("active");
      overlay.classList.remove("active");
    }
  });

  const dropdowns = document.querySelectorAll(".nav-menu .dropdown > a");
  dropdowns.forEach(dropdown => {
    dropdown.addEventListener("click", function(e) {
      e.preventDefault();
      const parent = this.parentElement;
      parent.classList.toggle("active");
    });
  });
};

const startRedirectTimer = () => {
  let timeLeft = 120;
  const timerElement = document.getElementById("redirect-timer");
  const cancelButton = document.getElementById("cancel-redirect");

  if (!timerElement || !cancelButton) {
    console.warn("Không tìm thấy redirect-timer hoặc cancel-redirect!");
    return;
  }

  const updateTimerDisplay = () => {
    timerElement.textContent = `Website sẽ tự động chuyển đến Fanpage IVS Academy trong ${Math.floor(timeLeft / 60)} phút ${timeLeft % 60} giây...`;
  };

  const timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timer);
      window.location.href = "https://facebook.com/hr.ivsacademy";
    }
  }, 1000);

  cancelButton.addEventListener("click", () => {
    clearInterval(timer);
    cancelButton.textContent = "Đã hủy chuyển hướng";
    cancelButton.disabled = true;
    timerElement.textContent = "Chuyển hướng đã bị hủy.";
  });

  updateTimerDisplay();
};

document.addEventListener("DOMContentLoaded", () => {
  loadContent("header", "header.html", "Lỗi khi tải header!");
  loadContent("footer", "footer.html", "Lỗi khi tải footer!");
  startRedirectTimer();
});