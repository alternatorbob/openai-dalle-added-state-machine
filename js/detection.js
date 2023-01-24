import { Camera } from "./main.js";
import { toBase64, toDataURL } from "./utils.js";
import { faceapi } from "./init.js";
import { swapFace } from "./swapFace.js";
let ctx, selectedFeatures, myImage, width, height;

//called when photo is taken
export const modelDetect = (img) => {
  myImage = img;
  const srcCanvas = document.querySelector("#camera--result");
  const canvas = document.querySelector("#detections--canvas");
  ctx = canvas.getContext("2d", { willReadFrequently: true });
  canvas.width = width = srcCanvas.width;
  canvas.height = height = srcCanvas.height;

  faceapi.detect(img, gotResults);
};

function gotResults(err, results) {
  if (err) {
    console.log(err);
    return;
  }

  selectedFeatures = selectFeatures(results);

  if (results.length == 0) {
    console.log("no faces detected");
    return;
  }
  drawBoxes(selectedFeatures);
}

function drawBoxes(selectedFeatures) {
  ctx.clearRect(0, 0, width, height);
  if (selectedFeatures.length > 0) {
    selectedFeatures.forEach((element) => {
      const { x, y, width, height } = element.faceBox;
      ctx.beginPath();
      element.wasClicked
        ? (ctx.strokeStyle = "green")
        : (ctx.strokeStyle = "red");
      ctx.rect(x, y, width, height);
      ctx.stroke();
      ctx.closePath();
    });
  }
}

export function addClick() {
  document.querySelector("#detections--canvas").addEventListener(
    "click",
    (e) => {
      if (selectedFeatures !== undefined && selectedFeatures.length > 0) {
        selectedFeatures.forEach((element) => {
          const { x, y, width, height } = element.faceBox;
          if (
            e.offsetX > x &&
            e.offsetX < x + width &&
            e.offsetY > y &&
            e.offsetY < y + height
          ) {
            element.wasClicked = !element.wasClicked;
            console.log("TOUCH BOX");
          }
        });
        drawBoxes(selectedFeatures);
      }
    },
    false
  );
}

function selectFeatures(detections) {
  if (detections.length > 0) {
    let myFeatures = [];
    const featureCenter = 2;
    detections.forEach((face) => {
      const { _x, _y, _width, _height } = face.alignedRect._box;
      const { leftEye, rightEye, nose, mouth } = face.parts;

      const feature = {
        faceBox: {
          x: _x,
          y: _y,
          width: _width,
          height: _height,
        },
        parts: {
          leftEye: leftEye[featureCenter],
          rightEye: rightEye[featureCenter],
          nose: nose[featureCenter],
          mouth: mouth[featureCenter],
        },
        wasClicked: false,
      };
      myFeatures.push(feature);
    });
    return myFeatures;
  }
}

export function clearDetections() {
  ctx.clearRect(0, 0, width, height);
  selectedFeatures = [];
}

export { selectedFeatures };
