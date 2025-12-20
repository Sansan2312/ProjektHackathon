let currentCursor = "None";

const none = "None";
const short = "Short";
const medium = "Medium";
const long = "Long";
const remove = "Remove";

let isClicked = false;
let clickX = 0,
  clickY = 0;

let selectedGoal = null;
const connections = [];
let board;
let hoveredElement = null;

window.onload = () => {
  board = document.getElementById("board");
  board.addEventListener("mousedown", boardClick);

  setInterval(connectAllBoardElements, 100);

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
      case "Remove":
        follower.style.display = "Block";
        follower.style.width = "15px";
        follower.style.height = "15px";
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
  if (currentCursor === remove) {
    const target = e.target;

    if (
      target.classList.contains("board-child-sh") ||
      target.classList.contains("board-child-md") ||
      target.classList.contains("board-child-lo")
    ) {
      deleteElement(target);
    }

    return;
  }
  isClicked = true;
  clickX = e.clientX;
  clickY = e.clientY;
}
function deleteElement(element) {
  elementTexts.delete(element);
  document.querySelector(".temp-textbox")?.remove();
  document.querySelector(".temp-line")?.remove();

  element.style.transition = "all 0.4s ease";
  element.style.background = "lightgreen";
  element.style.boxShadow = "0 0 15px rgba(0, 255, 0, 0.8)";

  setTimeout(() => {
    element.style.transform = "scale(0)";
    element.style.opacity = "0";
  }, 200);

  setTimeout(() => {
    element.remove();
    connectAllBoardElements();
    currentCursor = none;
  }, 600);
}
const elementTexts = new WeakMap();

let shCounter = 0;
let mdCounter = 0;
let loCounter = 0;

function Place(clickX, clickY, elementToPlace) {
  if (elementToPlace === none) {
    return;
  }
  const rect = board.getBoundingClientRect();
  const x = clickX - rect.left;
  const y = clickY - rect.top;

  const newDiv = document.createElement("div");

  let addon;
  let counter;

  switch (currentCursor) {
    case short:
      addon = "-sh";
      shCounter++;
      counter = shCounter;
      break;
    case medium:
      addon = "-md";
      mdCounter++;
      counter = mdCounter;
      break;
    case long:
      addon = "-lo";
      loCounter++;
      counter = loCounter;
      break;
  }

  newDiv.classList.add("board-child" + addon);

  newDiv.style.left = `${x}px`;
  newDiv.style.top = `${y}px`;

  newDiv.addEventListener("click", (e) => {
    e.stopPropagation();
    showTextbox(newDiv, x, y);
  });

  newDiv.innerHTML = counter;

  board.appendChild(newDiv);

  connectAllBoardElements();
}
function showTextbox(element, x, y) {
  if (currentCursor === remove) {
    return;
  }
  const existingBox = document.querySelector(".temp-textbox");
  const existingLine = document.querySelector(".temp-line");
  if (existingBox) existingBox.remove();
  if (existingLine) existingLine.remove();

  const input = document.createElement("textarea");
  input.className = "temp-textbox";
  input.style.position = "absolute";
  input.style.left = `${x}px`;
  input.style.top = `${y - 150}px`;
  input.style.transform = "translate(-50%, 0)";
  input.style.zIndex = "1000";
  input.style.width = "200px";
  input.style.height = "80px";
  input.style.resize = "none";
  input.value = elementTexts.get(element) || "";
  board.appendChild(input);
  input.focus();

  const svgLine = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgLine.classList.add("temp-line");
  svgLine.style.position = "absolute";
  svgLine.style.left = "0";
  svgLine.style.top = "0";
  svgLine.style.width = "100%";
  svgLine.style.height = "100%";
  svgLine.style.pointerEvents = "none";
  svgLine.style.zIndex = -1;
  board.appendChild(svgLine);

  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("stroke", "#333");
  line.setAttribute("stroke-width", "3");

  const rectElement = element.getBoundingClientRect();
  const rectBoard = board.getBoundingClientRect();
  const startX = rectElement.left + rectElement.width / 2 - rectBoard.left;
  const startY = rectElement.top + rectElement.height / 2 - rectBoard.top;
  const endX = x - rectBoard.left - input.offsetWidth / 2;
  const endY = y - 70 - rectBoard.top + input.offsetHeight;

  line.setAttribute("x1", startX);
  line.setAttribute("y1", startY);
  line.setAttribute("x2", endX);
  line.setAttribute("y2", endY + 70);

  svgLine.appendChild(line);

  function saveText() {
    elementTexts.set(element, input.value);
    input.remove();
    svgLine.remove();
    document.removeEventListener("click", saveText);
  }

  setTimeout(() => {
    document.addEventListener("click", saveText);
  }, 0);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveText();
  });
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
function removeBtn() {
  currentCursor = remove;
}

function getOrCreateGlobalSVG() {
  let svg = document.querySelector(".global-connections");
  if (!svg) {
    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("global-connections");
    svg.style.position = "absolute";
    svg.style.left = "0";
    svg.style.top = "0";
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.style.pointerEvents = "none";
    svg.style.zIndex = 0;
    board.appendChild(svg);
  }
  return svg;
}

function connectAllBoardElements() {
  const board = document.getElementById("board");
  const elements = board.querySelectorAll(
    ".board-child-sh, .board-child-md, .board-child-lo"
  );

  const svg = getOrCreateGlobalSVG();
  svg.innerHTML = "";

  const boardRect = board.getBoundingClientRect();

  for (let i = 0; i < elements.length; i++) {
    for (let j = i + 1; j < elements.length; j++) {
      const a = elements[i];
      const b = elements[j];

      const aRect = a.getBoundingClientRect();
      const bRect = b.getBoundingClientRect();

      const ax = aRect.left + aRect.width / 2 - boardRect.left;
      const ay = aRect.top + aRect.height / 2 - boardRect.top;
      const bx = bRect.left + bRect.width / 2 - boardRect.left;
      const by = bRect.top + bRect.height / 2 - boardRect.top;
      const defs =
        svg.querySelector("defs") ||
        (() => {
          const d = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "defs"
          );
          svg.appendChild(d);
          return d;
        })();

      const gradientId = "flow-gradient";

      if (!document.getElementById(gradientId)) {
        const gradient = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "linearGradient"
        );
        gradient.setAttribute("id", gradientId);
        gradient.setAttribute("gradientUnits", "userSpaceOnUse");

        const stop1 = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "stop"
        );
        stop1.setAttribute("offset", "0%");
        stop1.setAttribute("stop-color", "#ff9f43");

        const stop2 = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "stop"
        );
        stop2.setAttribute("offset", "100%");
        stop2.setAttribute("stop-color", "#8b0000");

        const anim = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "animateTransform"
        );
        anim.setAttribute("attributeName", "gradientTransform");
        anim.setAttribute("type", "translate");
        anim.setAttribute("from", "0 0");
        anim.setAttribute("to", "200 0");
        anim.setAttribute("dur", "3s");
        anim.setAttribute("repeatCount", "indefinite");

        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        gradient.appendChild(anim);
        defs.appendChild(gradient);
      }

      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );

      line.setAttribute("x1", ax);
      line.setAttribute("y1", ay);
      line.setAttribute("x2", bx);
      line.setAttribute("y2", by);
      line.setAttribute("stroke", "url(#flow-gradient)");
      line.setAttribute("stroke-width", "6");
      line.setAttribute("stroke-linecap", "round");
      line.setAttribute("opacity", "0.75");

      line.setAttribute("stroke-dasharray", "20 10");
      line.setAttribute("stroke-dashoffset", "0");

      const dashAnim = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "animate"
      );

      dashAnim.setAttribute("attributeName", "stroke-dashoffset");
      dashAnim.setAttribute("from", "0");
      dashAnim.setAttribute("to", "-60");
      dashAnim.setAttribute("dur", "2s");
      dashAnim.setAttribute("repeatCount", "indefinite");
      dashAnim.setAttribute("fill", "freeze");

      line.appendChild(dashAnim);

      const pulse = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "animate"
      );
      pulse.setAttribute("attributeName", "stroke-width");
      pulse.setAttribute("from", "5");
      pulse.setAttribute("to", "8");

      pulse.setAttribute("dur", "1.5s");

      pulse.setAttribute("repeatCount", "indefinite");
      pulse.setAttribute("direction", "alternate");

      const filter = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "filter"
      );
      filter.setAttribute("id", "glow");

      const blur = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "feGaussianBlur"
      );
      blur.setAttribute("stdDeviation", "2");

      blur.setAttribute("result", "coloredBlur");

      const merge = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "feMerge"
      );
      merge.innerHTML = `
  <feMergeNode in="coloredBlur"/>
  <feMergeNode in="SourceGraphic"/>
`;

      filter.appendChild(blur);
      filter.appendChild(merge);
      defs.appendChild(filter);

      line.setAttribute("filter", "url(#glow)");

      line.appendChild(pulse);

      const glowLine = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );

      glowLine.setAttribute("x1", ax);
      glowLine.setAttribute("y1", ay);
      glowLine.setAttribute("x2", bx);
      glowLine.setAttribute("y2", by);
      glowLine.setAttribute("stroke", "url(#flow-gradient)");
      glowLine.setAttribute("stroke-width", "6");
      glowLine.setAttribute("opacity", "0.35");
      glowLine.setAttribute("filter", "url(#glow)");

      glowLine.setAttribute("stroke-dasharray", "20 10");

      const glowDashAnim = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "animate"
      );

      glowDashAnim.setAttribute("attributeName", "stroke-dashoffset");
      glowDashAnim.setAttribute("from", "0");
      glowDashAnim.setAttribute("to", "-60");
      glowDashAnim.setAttribute("dur", "2s");
      glowDashAnim.setAttribute("repeatCount", "indefinite");

      glowLine.appendChild(glowDashAnim);

      svg.appendChild(glowLine);

      svg.appendChild(line);
    }
  }
}
