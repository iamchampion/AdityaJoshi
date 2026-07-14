const words = [
  "160+ Student Selections",
  "Career Mentor",
  "SSC Expert",
  "CDS Faculty",
  "AFCAT Mentor",
  "Educator",
  "Department Head"
];

const testimonials = [
  "Sir's guidance completely transformed my preparation strategy.",
  "His mentorship helped me crack SSC CGL.",
  "The best faculty for CDS preparation."
];

const typingText = document.querySelector("#typing-text");
const reveals = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-count]");
const testimonialText = document.querySelector("#testimonial-text");
const testimonialDots = document.querySelectorAll(".testimonial-dots button");
const themeToggle = document.querySelector(".theme-toggle");
const menuButton = document.querySelector(".menu-button");
const sidePanel = document.querySelector(".side-panel");
const closePanel = document.querySelector(".close-panel");
const panelBackdrop = document.querySelector(".panel-backdrop");
const panelLinks = document.querySelectorAll(".side-panel a");
const canvas = document.querySelector("#particles");
const ctx = canvas.getContext("2d");

let wordIndex = 0;
let quoteIndex = 0;
let particles = [];

function typeWord() {
  const word = words[wordIndex % words.length];
  let position = 0;
  typingText.textContent = "";
  const timer = setInterval(() => {
    position += 1;
    typingText.textContent = word.slice(0, position);
    if (position === word.length) {
      clearInterval(timer);
      setTimeout(() => {
        wordIndex += 1;
        typeWord();
      }, 1100);
    }
  }, 46);
}

function animateCounter(element) {
  if (element.dataset.done) return;
  element.dataset.done = "true";
  const target = Number(element.dataset.count);
  const start = performance.now();
  const duration = 1450;

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(target * eased);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      if (entry.target.id === "success") counters.forEach(animateCounter);
    });
  },
  { threshold: 0.16 }
);

reveals.forEach((item) => observer.observe(item));

function setQuote(index) {
  quoteIndex = index;
  testimonialText.textContent = testimonials[quoteIndex];
  testimonialDots.forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === quoteIndex));
}

setInterval(() => setQuote((quoteIndex + 1) % testimonials.length), 3800);
testimonialDots.forEach((dot, index) => dot.addEventListener("click", () => setQuote(index)));

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "Light" : "Dark";
});

function openPanel() {
  sidePanel.classList.add("open");
  panelBackdrop.classList.add("open");
  sidePanel.setAttribute("aria-hidden", "false");
  menuButton.setAttribute("aria-expanded", "true");
}

function closeSidePanel() {
  sidePanel.classList.remove("open");
  panelBackdrop.classList.remove("open");
  sidePanel.setAttribute("aria-hidden", "true");
  menuButton.setAttribute("aria-expanded", "false");
}

menuButton.addEventListener("click", openPanel);
closePanel.addEventListener("click", closeSidePanel);
panelBackdrop.addEventListener("click", closeSidePanel);

panelLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href") || "";
    closeSidePanel();
    if (href.startsWith("#")) {
      event.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        // Let the panel-close animation start before scrolling so the
        // jump isn't fought by the overlay's own transition on mobile.
        setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
      }
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSidePanel();
  }
});

document.addEventListener("mousemove", (event) => {
  document.documentElement.style.setProperty("--x", `${event.clientX}px`);
  document.documentElement.style.setProperty("--y", `${event.clientY}px`);
});

const slideshow = document.querySelector("#gallery-slideshow");
if (slideshow) {
  const track = slideshow.querySelector(".slideshow-track");
  const slides = slideshow.querySelectorAll(".slide");
  const prevBtn = slideshow.querySelector(".slide-prev");
  const nextBtn = slideshow.querySelector(".slide-next");
  const counter = slideshow.querySelector(".slide-counter");
  const dotsWrap = slideshow.querySelector(".slide-dots");
  let current = 0;

  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.setAttribute("aria-label", `Go to photo ${index + 1}`);
    dot.addEventListener("click", () => goToSlide(index));
    dotsWrap.appendChild(dot);
  });
  const dots = dotsWrap.querySelectorAll("button");

  function renderSlide() {
    track.style.transform = `translateX(-${current * 100}%)`;
    counter.textContent = `${current + 1} / ${slides.length}`;
    dots.forEach((dot, index) => dot.classList.toggle("active", index === current));
  }

  function goToSlide(index) {
    current = (index + slides.length) % slides.length;
    renderSlide();
  }

  prevBtn.addEventListener("click", () => goToSlide(current - 1));
  nextBtn.addEventListener("click", () => goToSlide(current + 1));

  let touchStartX = 0;
  track.addEventListener("touchstart", (event) => {
    touchStartX = event.touches[0].clientX;
  }, { passive: true });

  track.addEventListener("touchend", (event) => {
    const diff = event.changedTouches[0].clientX - touchStartX;
    if (diff > 40) goToSlide(current - 1);
    else if (diff < -40) goToSlide(current + 1);
  });

  renderSlide();
}

function resizeCanvas() {
  canvas.width = canvas.offsetWidth * window.devicePixelRatio;
  canvas.height = canvas.offsetHeight * window.devicePixelRatio;
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  particles = Array.from({ length: 54 }, () => ({
    x: Math.random() * canvas.offsetWidth,
    y: Math.random() * canvas.offsetHeight,
    r: Math.random() * 1.6 + 0.5,
    vx: (Math.random() - 0.5) * 0.14,
    vy: (Math.random() - 0.5) * 0.14
  }));
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
  ctx.fillStyle = document.body.classList.contains("dark") ? "rgba(255,255,255,0.45)" : "rgba(17,17,17,0.22)";
  particles.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    if (particle.x < 0 || particle.x > canvas.offsetWidth) particle.vx *= -1;
    if (particle.y < 0 || particle.y > canvas.offsetHeight) particle.vy *= -1;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(drawParticles);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
drawParticles();
typeWord();
