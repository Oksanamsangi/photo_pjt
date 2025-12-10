const track = document.querySelector(".carousel-track");
const items = Array.from(document.querySelectorAll(".carousel-item"));
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");


const firstClone = items[0].cloneNode(true);
const lastClone = items[items.length - 1].cloneNode(true);

track.appendChild(firstClone);
track.insertBefore(lastClone, items[0]);

const allItems = Array.from(track.children);
let currentIndex = 1; // стартуємо з першого реального слайду
track.style.transform = `translateX(-${currentIndex * 100}%)`;

function updateCarousel(animate = true) {
  track.style.transition = animate ? "transform 0.4s ease" : "none";
  track.style.transform = `translateX(-${currentIndex * 100}%)`;
}

nextBtn.addEventListener("click", () => {
  currentIndex++;
  updateCarousel();
});
prevBtn.addEventListener("click", () => {
  currentIndex--;
  updateCarousel();
});

track.addEventListener("transitionend", () => {
  if (allItems[currentIndex] === firstClone) {
    currentIndex = 1;
    updateCarousel(false);
  }
  if (allItems[currentIndex] === lastClone) {
    currentIndex = items.length;
    updateCarousel(false);
  }
});

let startX = 0;
let isDragging = false;

track.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
  isDragging = true;
  track.style.transition = "none";
});

track.addEventListener("touchmove", (e) => {
  if (!isDragging) return;
  const diff = e.touches[0].clientX - startX;
  track.style.transform = `translateX(calc(-${
    currentIndex * 100
  }% + ${diff}px))`;
});

track.addEventListener("touchend", (e) => {
  if (!isDragging) return;
  isDragging = false;
  const diff = e.changedTouches[0].clientX - startX;
  if (diff < -50) nextBtn.click();
  else if (diff > 50) prevBtn.click();
  else updateCarousel();
});

let wheelTimeout = null;
track.addEventListener("wheel", (e) => {
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
    e.preventDefault();
    if (wheelTimeout) return;
    if (e.deltaX > 10) nextBtn.click();
    else if (e.deltaX < -10) prevBtn.click();
    wheelTimeout = setTimeout(() => {
      wheelTimeout = null;
    }, 300);
  }
});

const modal = document.getElementById("bookingModal");
const btn = document.getElementById("openModal");
const closeBtn = document.querySelector(".modal .close");
btn.addEventListener("click", () => (modal.style.display = "block"));
closeBtn.addEventListener("click", () => (modal.style.display = "none"));
window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

document.getElementById("bookingForm").addEventListener("submit", function (e) {
  e.preventDefault();
  alert("Your session request has been sent!");
  modal.style.display = "none";
  this.reset();
});

const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");

function updateMinDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  dateInput.min = `${yyyy}-${mm}-${dd}`;
  if (dateInput.value === dateInput.min) {
    const hh = String(today.getHours()).padStart(2, "0");
    const min = String(today.getMinutes()).padStart(2, "0");
    timeInput.min = `${hh}:${min}`;
  } else {
    timeInput.min = "00:00";
  }
}

updateMinDate();
dateInput.addEventListener("change", updateMinDate);

const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");

hamburger.addEventListener("click", () => {
  menu.classList.toggle("active");
});
