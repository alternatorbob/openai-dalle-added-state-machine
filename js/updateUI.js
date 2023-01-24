import { Camera } from "./main.js";
import { modelDetect } from "./detection.js";
import { UI_BUTTONS } from "./init.js";

let cameraView = document.querySelector("#camera--view");
let cameraResult = document.querySelector("#camera--result");
let detectionsCanvas = document.querySelector("#detections--canvas");

export const updateUI = (state) => {
  const [cameraTrigger, photoClose, submitTrigger] = UI_BUTTONS;

  switch (state) {
    case "SHOOT":
      photoClose.hide();
      submitTrigger.hide();
      cameraTrigger.show();

      break;
    case "PHOTO":
      cameraTrigger.hide();
      photoClose.show();
      submitTrigger.show();
      break;
    case "SWAPPED":
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

export const submitPhoto = () => {
  console.log("photo was submitted");
};

export const drawOnCanvas = (canvas, img) => {
  const ctx = canvas.getContext("2d");
  let image = new Image();
  image.onload = function () {
    ctx.drawOnCanvas(image, 0, 0);
  };
  image.src = img;
};
