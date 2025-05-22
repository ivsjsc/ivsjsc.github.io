const CACHE_NAME = 'legnaxe-cache-v1';
const urlsToCache = [
  '/css/author-about.min.css',
  '/js/author-about.min.js',
  '/images/pages/novels/author-legnaxe.webp'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

<meta name="description" content="Discover LEGNAXE's author NMT - A visionary storyteller blending cosmic balance with human emotion in an epic saga">
<meta name="keywords" content="LEGNAXE, NMT, author, novel, fantasy, angels">
<meta property="og:type" content="article">
<meta property="og:title" content="About LEGNAXE's Author - NMT">
<meta property="og:description" content="Meet NMT, the creative force behind LEGNAXE">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "NMT",
  "jobTitle": "Author",
  "worksFor": {
    "@type": "Organization",
    "name": "IVS JSC"
  },
  "url": "https://ivs.id.vn/author-about.html"
}
</script>

<picture>
  <source srcset="/images/pages/novels/author-legnaxe.webp" type="image/webp">
  <source srcset="/images/pages/novels/author-legnaxe.jpg" type="image/jpeg">
  <img src="/images/pages/novels/author-legnaxe.jpg" alt="Author NMT" loading="lazy">
</picture>