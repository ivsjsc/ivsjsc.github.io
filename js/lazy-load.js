<link rel="preload" href="/fonts/Inter-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/Merriweather-var.woff2" as="font" type="font/woff2" crossorigin>

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.src = entry.target.dataset.src;
      observer.unobserve(entry.target);
    }
  });
});

document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));