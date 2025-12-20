let currentCursor = "None";

const none = "None";
const short = "Short";
const medium = "Medium";
const long = "Long";

let isClicked = false;
let clickX = 0,
  clickY = 0;

window.onload = () => {
  const board = document.getElementById("board");
  board.addEventListener("mousedown", boardClick);

  const follower = document.querySelector(".cursor-follow");

  let mouseX = 0,
    mouseY = 0;
  let posX = 0,
    posY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    switch (currentCursor) {
      case "None":
        follower.style.display = "None";
        break;
      case "Short":
        follower.style.display = "Block";
        follower.style.width = "45px";
        follower.style.height = "45px";
        break;
      case "Medium":
        follower.style.display = "Block";
        follower.style.width = "60px";
        follower.style.height = "60px";
        break;
      case "Long":
        follower.style.display = "Block";
        follower.style.width = "75px";
        follower.style.height = "75px";
        break;
    }
    posX += (mouseX - posX) * 0.15;
    posY += (mouseY - posY) * 0.15;
    let targetX = posX;
    let targetY = posY;
    if (isClicked) {
      targetX += (clickX - posX) * 0.3;
      targetY += (clickY - posY) * 0.3;

      if (Math.hypot(clickX - posX, clickY - posY) < 5) {
        Place(clickX, clickY, currentCursor);
        currentCursor = none;
        isClicked = false;
      }
    }
    const angle = Math.atan2(mouseY - posY, mouseX - posX) * (180 / Math.PI);
    follower.style.transform = `translate(${posX}px, ${posY}px) translate(-50%, -50%) rotate(${angle}deg)`;
    requestAnimationFrame(animate);
  }

  animate();
};

function boardClick(e) {
  isClicked = true;
  clickX = e.clientX;
  clickY = e.clientY;
}

function Place(clickX, clickY, elementToPlace) {
  if (elementToPlace === none) {
    return;
  }
  const rect = board.getBoundingClientRect();
  const x = clickX - rect.left;
  const y = clickY - rect.top;

  const newDiv = document.createElement("div");
  newDiv.classList.add("board-child");

  newDiv.style.left = `${x}px`;
  newDiv.style.top = `${y}px`;

  board.appendChild(newDiv);
}

function shortGoalBtn() {
  currentCursor = short;
}

function mediumGoalBtn() {
  currentCursor = medium;
}

function longGoalBtn() {
  currentCursor = long;
}
