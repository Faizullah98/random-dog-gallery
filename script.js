const apiUrl = "https://dog.ceo/api/breeds/image/random/6";
const inputField = document.getElementById("randomAPIInputField");
const randomDogImages = document.querySelector(".randomDogImages");

async function getRandomDogImage() {
  try {
    randomDogImages.innerHTML = "";
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    data.message.map((imageUrl) => {
      const img = document.createElement("img");
      img.classList.add("dog-image");
      img.src = imageUrl;
      randomDogImages.appendChild(img);
    });
  } catch (error) {
    console.log(error.message);
  }
}
getRandomDogImage();
