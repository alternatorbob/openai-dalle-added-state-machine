import { Configuration, OpenAIApi } from "openai";
import { clearDetections } from "./detection";
import { canvasToFile, draw64_OnCanvas } from "./utils";
import { Camera } from "./main";

const configuration = new Configuration({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const defaultPrompt = "a portrait of a man's face";
const res = 1024;

export async function swapFace(selectedFeatures) {
  if (selectedFeatures !== undefined && selectedFeatures.length > 0) {
    const responses = await Promise.all(
      selectedFeatures.map(async (element) => {
        const tempCanvas = extractFaces(element);
        const srcCanvas = document.querySelector("#camera--result");
        const file = await canvasToFile(tempCanvas);
        const imgSrc = await replace(file);
        draw64_OnCanvas(srcCanvas, imgSrc, element);
      })
    );

    Camera.dispatch("swapped");
    clearDetections();
  }
}

export function extractFaces(element) {
  const srcCanvas = document.querySelector("#camera--result");
  const destCanvas = document.createElement("canvas");

  if (!element.wasClicked) {
    const tempCanvas = removeParts(srcCanvas, element);
    destCanvas.setAttribute("class", "face-detection-selected-canvas");
    const { x, y, width, height } = element.faceBox;
    const dim = Math.min(width, height);
    destCanvas.width = destCanvas.height = dim;

    destCanvas.getContext("2d").drawImage(
      tempCanvas,
      x,
      y,
      dim,
      dim, // source rect with content to crop
      0,
      0,
      dim,
      dim
    );
    document.body.appendChild(destCanvas);
    return destCanvas;
  }
}

export function removeParts(srcCanvas, element) {
  const tempCanvas = srcCanvas.cloneNode(false);
  tempCanvas.id = `${srcCanvas.id}--temp`;
  const ctx = tempCanvas.getContext("2d");
  ctx.drawImage(srcCanvas, 0, 0);

  let radius = element.faceBox.width / 7;

  ctx.save();
  ctx.globalCompositeOperation = "destination-out";

  for (const part in element.parts) {
    const x = element.parts[part]._x;
    const y = element.parts[part]._y;
    ctx.beginPath();
    if (part == "mouth") {
      radius = element.faceBox.width / 3.5;
    }
    if (part == "nose") {
      radius = element.faceBox.width / 5.5;
    }
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
  }
  ctx.restore();
  return tempCanvas;
}

export async function replace(file, prompt = defaultPrompt) {
  console.log("generating...");
  const response = await openai.createImageEdit(
    file,
    file, // mask
    prompt,
    1,
    `${res}x${res}`,
    "b64_json"
  );
  const { b64_json } = response.data.data[0];
  return `data:image/png;base64,${b64_json}`;
}
