// navbar
const hamburgerIcon = document.querySelector(".hamburger-menu");
const navLinks = document.querySelector(".nav-links");

hamburgerIcon.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  hamburgerIcon.classList.toggle("active");
});

const apiUrl = "https://dog.ceo/api/breeds/image/random/9";
const randomDogImages = document.querySelector(".randomDogImages");

// dog ceo integration
async function getRandomDogImage() {
  try {
    randomDogImages.innerHTML = "";
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    data.message.forEach((imageUrl) => {
      // wrapper (no new custom class needed)
      const wrapper = document.createElement("div");
      wrapper.style.position = "relative";
      wrapper.style.display = "inline-block";

      const img = document.createElement("img");
      img.classList.add("dog-image");
      img.src = imageUrl;

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

      wrapper.appendChild(img);
      wrapper.appendChild(crossBtn);
      randomDogImages.appendChild(wrapper);
    });
  } catch (error) {
    console.log(error.message);
  }
}

getRandomDogImage();
