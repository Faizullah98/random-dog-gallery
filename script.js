// Elements
const randomDogImages = document.querySelector(".randomDogImages");
const breedSelect = document.getElementById("breed-select");
const status = document.getElementById("status");
const toggleSlideshowBtn = document.getElementById("toggle-slideshow");
const showFavoritesBtn = document.getElementById("show-favorites");

let slideshow = null;
let slideshowOn = false;

// --- Load breeds ---
async function loadBreeds() {
  try {
    const res = await fetch("https://dog.ceo/api/breeds/list/all");
    const data = await res.json();

    Object.keys(data.message).forEach((breed) => {
      breedSelect.innerHTML += `<option value="${breed}">${breed}</option>`;
    });
  } catch (error) {
    status.textContent = "Error loading breeds";
    console.log(error.message);
  }
}

// --- Show random dogs with staggered fade-in ---
async function getRandomDogImage(count = 12) {
  try {
    status.textContent = "Loading dogs...";
    randomDogImages.innerHTML = "";

    const res = await fetch(`https://dog.ceo/api/breeds/image/random/${count}`);
    if (!res.ok) throw new Error("Network error");
    const data = await res.json();

    status.textContent = "";

    data.message.forEach((imageUrl, index) => {
      const wrapper = document.createElement("div");
      wrapper.style.position = "relative";
      wrapper.style.opacity = 0; // start hidden

      // Image
      const img = document.createElement("img");
      img.src = imageUrl;
      img.classList.add("dog-image");

      // Cross button for full-screen
      const crossBtn = document.createElement("button");
      crossBtn.textContent = "X";
      crossBtn.classList.add("removeDogBtn");
      crossBtn.style.display = "none";

      img.addEventListener("click", () => {
        img.classList.add("fullwidth");
        crossBtn.style.display = "block";
      });

      crossBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        img.classList.remove("fullwidth");
        crossBtn.style.display = "none";
      });

      // Breed label
      const breedName = imageUrl.split("/")[4].replace("-", " ");
      const label = document.createElement("span");
      label.textContent = breedName;
      label.classList.add("breed-label");

      // Favorite button
      const favBtn = document.createElement("button");
      favBtn.textContent = "❤";
      favBtn.classList.add("favBtn");
      favBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        saveFavorite(imageUrl);
      });

      wrapper.appendChild(img);
      wrapper.appendChild(crossBtn);
      wrapper.appendChild(label);
      wrapper.appendChild(favBtn);
      randomDogImages.appendChild(wrapper);

      // Staggered fade-in
      setTimeout(() => {
        wrapper.style.opacity = 1;
        wrapper.style.transition = "opacity 0.5s ease, transform 0.3s ease";
      }, index * 150); // 150ms delay per card
    });
  } catch (error) {
    status.textContent = "Error loading dogs";
    console.log(error.message);
  }
}

// --- Show dogs by breed with staggered fade-in ---
async function showDogs(breed) {
  if (!breed) return getRandomDogImage();

  try {
    status.textContent = "Loading breed...";
    randomDogImages.innerHTML = "";

    const res = await fetch(
      `https://dog.ceo/api/breed/${breed}/images/random/9`,
    );
    const data = await res.json();

    status.textContent = "";

    data.message.forEach((imgUrl, index) => {
      const wrapper = document.createElement("div");
      wrapper.style.position = "relative";
      wrapper.style.opacity = 0;

      const img = document.createElement("img");
      img.src = imgUrl;
      img.classList.add("dog-image");

      // Full-screen
      const crossBtn = document.createElement("button");
      crossBtn.textContent = "X";
      crossBtn.classList.add("removeDogBtn");
      crossBtn.style.display = "none";

      img.addEventListener("click", () => {
        img.classList.add("fullwidth");
        crossBtn.style.display = "block";
      });

      crossBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        img.classList.remove("fullwidth");
        crossBtn.style.display = "none";
      });

      // Breed label
      const label = document.createElement("span");
      label.textContent = breed;
      label.classList.add("breed-label");

      // Favorite button
      const favBtn = document.createElement("button");
      favBtn.textContent = "❤";
      favBtn.classList.add("favBtn");
      favBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        saveFavorite(imgUrl);
      });

      wrapper.appendChild(img);
      wrapper.appendChild(crossBtn);
      wrapper.appendChild(label);
      wrapper.appendChild(favBtn);
      randomDogImages.appendChild(wrapper);

      // Staggered fade-in
      setTimeout(() => {
        wrapper.style.opacity = 1;
        wrapper.style.transition = "opacity 0.5s ease, transform 0.3s ease";
      }, index * 150);
    });
  } catch (error) {
    status.textContent = "Error loading breed";
    console.log(error.message);
  }
}

// --- Favorites ---
function saveFavorite(url) {
  let favs = JSON.parse(localStorage.getItem("favorites")) || [];
  if (!favs.includes(url)) {
    favs.push(url);
    localStorage.setItem("favorites", JSON.stringify(favs));
    alert("Saved to favorites!");
  }
}

function showFavorites() {
  let favs = JSON.parse(localStorage.getItem("favorites")) || [];
  if (favs.length === 0) {
    alert("No favorites yet!");
    return;
  }

  randomDogImages.innerHTML = "";

  favs.forEach((imgUrl, index) => {
    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    wrapper.style.opacity = 0;

    const img = document.createElement("img");
    img.src = imgUrl;
    img.classList.add("dog-image");

    wrapper.appendChild(img);
    randomDogImages.appendChild(wrapper);

    setTimeout(() => {
      wrapper.style.opacity = 1;
      wrapper.style.transition = "opacity 0.5s ease, transform 0.3s ease";
    }, index * 150);
  });
}

// --- Slideshow ---
function startSlideshow() {
  slideshow = setInterval(getRandomDogImage, 3000);
}

function stopSlideshow() {
  clearInterval(slideshow);
}

// --- Event listeners ---
breedSelect.addEventListener("change", (e) => {
  showDogs(e.target.value);
});

// Toggle slideshow button
toggleSlideshowBtn.addEventListener("click", () => {
  slideshowOn = !slideshowOn;
  if (slideshowOn) {
    startSlideshow();
    toggleSlideshowBtn.textContent = "Auto Slideshow: ON";
  } else {
    stopSlideshow();
    toggleSlideshowBtn.textContent = "Auto Slideshow: OFF";
  }
});

// Show favorites button
showFavoritesBtn.addEventListener("click", showFavorites);

// --- Initialize page ---
loadBreeds();
getRandomDogImage();

// Update button text at start
toggleSlideshowBtn.textContent = "Auto Slideshow: OFF";
