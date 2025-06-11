window.debounce = function(func, delay) {
    let debounceTimer;
    return function(...args) {
        const context = this;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
};
// stars.js
const starBackground = document.getElementById('star-background');
const numberOfStars = 200;

function createStar() {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + 'vw';
    star.style.top = Math.random() * 100 + 'vh';
    const size = Math.random() * 2 + 1;
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.animationDuration = Math.random() * 3 + 2 + 's';
    star.style.animationDelay = Math.random() * numberOfStars / 50 + 's';
    starBackground.appendChild(star);
}

window.onload = function () {
    for (let i = 0; i < numberOfStars; i++) {
        createStar();
    }
};