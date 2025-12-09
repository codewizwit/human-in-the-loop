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
    await navigator.clipboard.writeText(block.textContent);
    block.classList.add('copied');
    setTimeout(() => block.classList.remove('copied'), 1500);
  });
});

// Copy links box on click
const linksBox = document.getElementById('links-box');
const copyHint = document.getElementById('copy-hint');

const linksText = `Human-in-the-Loop
by Alexandra Kelstrom

INSTALL
npm install -g @human-in-the-loop/cli

LINKS
npm:        https://www.npmjs.com/package/@human-in-the-loop/cli
GitHub:     https://github.com/codewizwit/human-in-the-loop
Docs:       https://github.com/codewizwit/human-in-the-loop/tree/main/docs
CLAUDE.md:  https://github.com/codewizwit/human-in-the-loop/blob/main/CLAUDE.md (main prompt)
Planning:   https://github.com/codewizwit/human-in-the-loop/tree/main/planning (Claude's output)
Prompts:    https://github.com/codewizwit/human-in-the-loop#-whats-inside (all 21 prompts)
Workflows:  https://github.com/codewizwit/human-in-the-loop/tree/main/.github/workflows (CI/CD)
Contribute: https://github.com/codewizwit/human-in-the-loop/blob/main/CONTRIBUTING.md

CONNECT
LinkedIn:   https://www.linkedin.com/in/akelstrom
Blog:       https://medium.com/@codewizwit
GitHub:     https://github.com/codewizwit`;

async function copyLinks() {
  await navigator.clipboard.writeText(linksText);
  copyHint.textContent = 'copied!';
  copyHint.style.opacity = '1';
  setTimeout(() => {
    copyHint.textContent = 'click to copy';
    copyHint.style.opacity = '0.6';
  }, 1500);
}

if (linksBox) linksBox.addEventListener('click', (e) => { e.preventDefault(); copyLinks(); });
if (copyHint) copyHint.addEventListener('click', copyLinks);

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
