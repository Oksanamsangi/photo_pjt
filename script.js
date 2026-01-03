// ——————— CAROUSEL ———————

const track = document.querySelector(".carousel-track");
const items = Array.from(document.querySelectorAll(".carousel-item"));
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

const firstClone = items[0].cloneNode(true);
const lastClone = items[items.length - 1].cloneNode(true);

track.appendChild(firstClone);
track.insertBefore(lastClone, items[0]);

const allItems = Array.from(track.children);
let currentIndex = 1;
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

// ——————— Swipe / Drag ———————

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

// ——————— Mouse Wheel ———————

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

// ——————— MODAL ———————

const modal = document.getElementById("bookingModal");
const openModalBtn = document.getElementById("openModal");
const closeBtn = document.querySelector(".modal .close");

// Відкриття модалки
openModalBtn.addEventListener("click", () => {
  modal.classList.add("active");
  document.body.style.overflow = "hidden"; // блокуємо скрол сторінки
});

// Закриття через Х
closeBtn.addEventListener("click", () => {
  modal.classList.remove("active");
  document.body.style.overflow = ""; // повертаємо скрол
});

// Закриття при кліку на фон
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
});

// ——————— FORM SUBMIT ———————

document
  .getElementById("bookingForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const messageEl = document.getElementById("formMessage");
    messageEl.textContent = ""; // очищаємо повідомлення

    try {
      const response = await fetch(this.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        // Показуємо успішне повідомлення
        messageEl.textContent =
          "Thank you! Your session request has been sent.";
        messageEl.style.color = "green";

        // очищення форми
        this.reset();

        // Після затримки закриваємо модалку
        setTimeout(() => {
          modal.classList.remove("active");
          document.body.style.overflow = ""; // дозволити скрол
          messageEl.textContent = ""; // очистити текст
        }, 1800);
      } else {
        // Якщо прийшла помилка від сервера
        const data = await response.json();
        if (data.errors) {
          messageEl.textContent = data.errors
            .map((err) => err.message)
            .join(", ");
        } else {
          messageEl.textContent = "Oops! Something went wrong, try again.";
        }
        messageEl.style.color = "red";
      }
    } catch (error) {
      // Якщо мережа або інша помилка
      messageEl.textContent = "Error submitting form. Check your connection.";
      messageEl.style.color = "red";
    }
  });


// ——————— DATE & TIME ———————

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

// ——————— HAMBURGER MENU ———————

const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");

// Відкриття/закриття меню по кліку на гамбургер
hamburger.addEventListener("click", (e) => {
  e.stopPropagation(); // зупиняємо сплив для уникнення миттєвого закриття
  menu.classList.toggle("active");
});

// Закриття меню при кліку поза ним
document.addEventListener("click", (e) => {
  // Якщо клік не всередині меню і не по самій іконці гамбургера
  if (!menu.contains(e.target) && !hamburger.contains(e.target)) {
    menu.classList.remove("active");
  }
});

