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
const openModalBtn = document.getElementById("openModal");
const closeBtn = document.querySelector(".modal .close");

openModalBtn.addEventListener("click", () => {
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
});

closeBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

function closeModal() {
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

const form = document.getElementById("bookingForm");
const messageEl = document.getElementById("formMessage");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  messageEl.textContent = "";

  try {
    const response = await fetch(this.action, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      messageEl.textContent = "Thank you! Your session request has been sent.";
      messageEl.style.color = "green";
      this.reset();

      setTimeout(() => {
        closeModal();
        messageEl.textContent = "";
      }, 1800);
    } else {
      const data = await response.json();
      messageEl.textContent = data.errors
        ? data.errors.map((err) => err.message).join(", ")
        : "Oops! Something went wrong, try again.";
      messageEl.style.color = "red";
    }
  } catch {
    messageEl.textContent = "Error submitting form. Check your connection.";
    messageEl.style.color = "red";
  }
});
const timeSelect = document.getElementById("time");

function generateTimeSlots(startHour = 9, endHour = 18) {
  timeSelect.innerHTML = '<option value="">Select time</option>';

  for (let hour = startHour; hour <= endHour; hour++) {
    const h = String(hour).padStart(2, "0");

    timeSelect.innerHTML += `
      <option value="${h}:00">${h}:00</option>
      <option value="${h}:30">${h}:30</option>
    `;
  }
}

generateTimeSlots(9, 18);

const dateInput = document.getElementById("date");

function updateMinDate() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");

  dateInput.min = `${yyyy}-${mm}-${dd}`;

  if (dateInput.value === dateInput.min) {
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    timeInput.min = `${hh}:${min}`;
  } else {
    timeInput.min = "00:00";
  }
}

updateMinDate();
dateInput.addEventListener("change", updateMinDate);

const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");

hamburger.addEventListener("click", (e) => {
  e.stopPropagation();
  menu.classList.toggle("active");
});

document.addEventListener("click", (e) => {
  if (!menu.contains(e.target) && !hamburger.contains(e.target)) {
    menu.classList.remove("active");
  }
});
