import "./styles.css";

let selectedElement;
let offset_x = 0;
let offset_y = 0;

var ctx = document.createElement("canvas").getContext("2d");

function checkImageCoord(img_element, event) {
  // Get click coordinates
  let bounds = img_element.getBoundingClientRect();

  let x = event.clientX - bounds.left;
  let y = event.clientY - bounds.top;
  let w = (ctx.canvas.width = img_element.width);
  let h = (ctx.canvas.height = img_element.height);

  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(img_element, 0, 0, w, h);
  let alpha = ctx.getImageData(x, y, 1, 1).data[3]; // [0]R [1]G [2]B [3]A

  // If pixel is transparent,
  // retrieve the element underneath and trigger it's click event
  console.log(alpha);
  if (alpha < 10) {
    img_element.style.pointerEvents = "none";

    let nextTarget = document.elementFromPoint(event.clientX, event.clientY);
    if (nextTarget.classList.contains("draggable")) {
      checkImageCoord(nextTarget, event);
    }
    img_element.style.pointerEvents = "auto";
  } else {
    //Start Selection
    selectedElement = img_element;
    offset_x = event.clientX - bounds.left;
    offset_y = event.clientY - bounds.top;
  }
}

function start(e) {
  if (e.target.classList.contains("draggable")) {
    checkImageCoord(e.target, e);
  }
}
document.body.addEventListener("mousedown", function (e) {
  start(e);
  e.preventDefault();
});

document.body.addEventListener("touchstart", function (e) {
  let touch = e.touches[0];
  e.clientX = touch.clientX;
  e.clientY = touch.clientY;
  start(e);
});

document.body.addEventListener("mouseup", function (e) {
  selectedElement = null;
});
document.body.addEventListener("touchend", function (e) {
  selectedElement = null;
});

function move(e) {
  let x = e.clientX - offset_x;
  let y = e.clientY - offset_y;
  if (selectedElement) {
    selectedElement.style.left = x + "px";
    selectedElement.style.top = y + "px";
  }
}
document.body.addEventListener("mousemove", function (e) {
  e.preventDefault();
  move(e);
});

document.body.addEventListener("touchmove", function (e) {
  let touch = e.touches[0];
  e.clientX = touch.clientX;
  e.clientY = touch.clientY;
  move(e);
});

let draggables = document.querySelectorAll(".draggable");
draggables.forEach((element) => {
  // position randomly
  let bounds = element.getBoundingClientRect();
  element.style.left =
    Math.random() * (window.innerWidth - bounds.width) + "px";
  element.style.top =
    Math.random() * (window.innerHeight - bounds.height) + "px";
});
