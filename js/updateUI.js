import { Camera } from "./main.js";
import { modelDetect } from "./detection.js";
import { UI_BUTTONS, UI_MESSAGES } from "./init.js";

let cameraView = document.querySelector("#camera--view");
let cameraResult = document.querySelector("#camera--result");
let detectionsCanvas = document.querySelector("#detections--canvas");

let currentOrientation = window.screen.orientation.type;
const flexContainer = document.querySelector(".container");
const uiContainer = document.querySelector(".ui");

export const updateUI = (state) => {
  const [cameraTrigger, photoClose, submitTrigger, ldsGrid] = UI_BUTTONS;
  const [noneDetectedMessage] = UI_MESSAGES;

  switch (state) {
    case "SHOOT":
      noneDetectedMessage.hide();
      ldsGrid.hide();
      photoClose.hide();
      submitTrigger.hide();
      cameraTrigger.show();

      break;
    case "PHOTO":
      ldsGrid.hide();
      photoClose.show();

      break;
    case "NONE_DETECTED":
      noneDetectedMessage.show();
      break;
    case "DETECTED":
      submitTrigger.show();
      break;
    case "LOADING":
      photoClose.hide();
      submitTrigger.hide();
      ldsGrid.show();
      break;
    case "SWAPPED":
      ldsGrid.hide();
      photoClose.show();
      break;
  }
};

export const takePhoto = () => {
  const dim = Math.min(cameraView.videoWidth, cameraView.videoHeight);
  cameraResult.width = cameraView.videoWidth;
  cameraResult.height = cameraView.videoHeight;

  cameraResult.classList.remove("hidden");
  cameraResult.getContext("2d").drawImage(cameraView, 0, 0);
  modelDetect(cameraResult);
};

export const closePhoto = () => {
  cameraResult.classList.add("hidden");
};

export function switchCamera() {}

export const drawOnCanvas = (canvas, img) => {
  const ctx = canvas.getContext("2d");
  let image = new Image();
  image.onload = function () {
    ctx.drawOnCanvas(image, 0, 0);
  };
  image.src = img;
};

export function loadIcons() {}

window.screen.orientation.addEventListener("change", function () {
  currentOrientation = window.screen.orientation.type;

  if (
    currentOrientation === "portrait-primary" ||
    currentOrientation === "portrait-secondary"
  ) {
    flexContainer.classList.add("portrait");
    flexContainer.classList.remove("landscape");
    uiContainer.classList.add("landscape");
    flexContainer.classList.remove("portrait");
  } else if (
    currentOrientation === "landscape-primary" ||
    currentOrientation === "landscape-secondary"
  ) {
    flexContainer.classList.add("landscape");
    flexContainer.classList.remove("portrait");
    uiContainer.classList.add("portrait");
    uiContainer.classList.remove("landscape");
  }
});
