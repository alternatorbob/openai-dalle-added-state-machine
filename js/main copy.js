import "./style.css";
import { replace } from "./ai.js";
import { canvasToFile, urlToFile } from "./utils_seb.js";
import "./formdata-polyfill.js";

// erase part of canvas using globalCompositeOperation
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const img = new Image();
img.src = "./elon-orig.png";
img.onload = () => {
  ``;
  const { width, height } = img;

  const dim = Math.min(width, height);
  canvas.width = dim;
  canvas.height = dim;

  ctx.save();

  ctx.drawImage(img, 0, 0);
  ctx.globalCompositeOperation = "destination-out";

  const features = [
    { x: 182, y: 200 }, // left eye
    { x: 247, y: 203 }, // right eye
    { x: 221, y: 238 }, // nose
    { x: 220, y: 283 }, // mouse
  ];

  const radius = 32;

  // ctx.filter = "blur(5px)";

  features.forEach(({ x, y }) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
  });
  ctx.restore();
};

const btn = document.querySelector("#generate");
btn.onclick = async () => {
  const file = await canvasToFile(canvas);

  btn.disabled = true;
  // canvas to file
  // const file = await urlToFile('./elon.png')
  const imgSrc = await replace(file);
  const img = document.querySelector("#result");
  img.src = imgSrc;
  btn.disabled = false;
};
