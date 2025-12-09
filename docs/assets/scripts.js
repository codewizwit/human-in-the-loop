let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  showSlide(currentSlide);
}

// Copy code on click
document.querySelectorAll('code').forEach(block => {
  block.addEventListener('click', async () => {
    let text = block.textContent;

    // Special handling for Copy Links button
    if (block.id === 'copy-links') {
      text = `Human-in-the-Loop
by Alexandra Kelstrom

INSTALL
npm install -g @human-in-the-loop/cli

LINKS
npm:       https://www.npmjs.com/package/@human-in-the-loop/cli
GitHub:    https://github.com/codewizwit/human-in-the-loop
Docs:      https://github.com/codewizwit/human-in-the-loop/tree/main/docs
CLAUDE.md: https://github.com/codewizwit/human-in-the-loop/blob/main/CLAUDE.md
Planning:  https://github.com/codewizwit/human-in-the-loop/tree/main/planning
Prompts:   https://github.com/codewizwit/human-in-the-loop#-whats-inside

CONNECT
LinkedIn:  https://www.linkedin.com/in/akelstrom
Blog:      https://medium.com/@codewizwit
GitHub:    https://github.com/codewizwit`;
    }

    await navigator.clipboard.writeText(text);
    block.classList.add('copied');
    setTimeout(() => block.classList.remove('copied'), 1500);
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === ' ') {
    e.preventDefault();
    nextSlide();
  } else if (e.key === 'ArrowLeft') {
    prevSlide();
  } else if (e.key === 'f' || e.key === 'F') {
    document.documentElement.requestFullscreen?.();
  }
});

// Touch support for mobile
let touchStartX = 0;
document.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
});
document.addEventListener('touchend', (e) => {
  const diff = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(diff) > 50) {
    diff > 0 ? prevSlide() : nextSlide();
  }
});
