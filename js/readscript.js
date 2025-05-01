// Chapter Navigation Logic
const chapters = document.querySelectorAll('.chapter');
const chapterLinks = document.querySelectorAll('#chapter-modal ul li a');
const modal = document.getElementById('chapter-modal');
const closeModal = document.getElementById('close-modal');
const chapterListButton = document.getElementById('chapter-list');
let currentChapterIndex = 0;

function showChapter(index) {
    if (index < 0 || index >= chapters.length) return;

    chapters.forEach((chapter, i) => {
        chapter.classList.toggle('active', i === index);
    });

    const prevButton = document.getElementById('prev-chapter');
    const nextButton = document.getElementById('next-chapter');
    if (prevButton) prevButton.disabled = index === 0;
    if (nextButton) nextButton.disabled = index === chapters.length - 1;

    currentChapterIndex = index;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Event listeners for navigation buttons
const prevButton = document.getElementById('prev-chapter');
const nextButton = document.getElementById('next-chapter');

if (prevButton) {
    prevButton.addEventListener('click', () => {
        if (currentChapterIndex > 0) {
            showChapter(currentChapterIndex - 1);
        }
    });
}

if (nextButton) {
    nextButton.addEventListener('click', () => {
        if (currentChapterIndex < chapters.length - 1) {
            showChapter(currentChapterIndex + 1);
        }
    });
}

// Modal logic
if (chapterListButton) {
    chapterListButton.addEventListener('click', () => {
        modal.style.display = 'flex';
    });
}

if (closeModal) {
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Handle chapter link clicks
chapterLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const chapterId = link.getAttribute('href').substring(1); // Remove '#'
        const chapterElement = document.getElementById(chapterId);
        if (chapterElement) {
            const index = Array.from(chapters).indexOf(chapterElement);
            if (index !== -1) {
                showChapter(index);
                modal.style.display = 'none';
            }
        }
    });
});

// Show the first chapter initially
if (chapters.length > 0) {
    showChapter(0);
} else {
    console.warn("No chapters found to display.");
    if (prevButton) prevButton.disabled = true;
    if (nextButton) nextButton.disabled = true;
}
function showChapter(index) {
    if (index < 0 || index >= chapters.length) return;

    chapters.forEach((chapter, i) => {
        chapter.classList.toggle('active', i === index);
    });

    // Update active chapter link in modal
    chapterLinks.forEach((link) => {
        const chapterId = link.getAttribute('href').substring(1);
        link.classList.toggle('active', chapters[index].id === chapterId);
    });

    const prevButton = document.getElementById('prev-chapter');
    const nextButton = document.getElementById('next-chapter');
    if (prevButton) prevButton.disabled = index === 0;
    if (nextButton) nextButton.disabled = index === chapters.length - 1;

    currentChapterIndex = index;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}