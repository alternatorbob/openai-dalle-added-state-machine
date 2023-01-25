//SEB
export async function urlToFile(url) {
  const blob = await fetch(url).then((res) => res.blob());
  return blobToFile(blob);
}

// function to convert canvas to file
export async function canvasToFile(canvas) {
  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/png")
  );
  return blobToFile(blob);
}

export function blobToFile(blob) {
  const file = new File([blob], "image.png", blob);
  return file;
}

export function toBase64(source) {
  const dataURL = source.toDataURL();
  return dataURL;
  // Logs data:image/png;base64,wL2dvYWwgbW9yZ...
  // Convert to Base64 string
  // const base64 = getBase64StringFromDataURL(dataURL);
  // return base64;
}

export function toDataURL(url) {
  let xhRequest = new XMLHttpRequest();
  xhRequest.onload = function () {
    let reader = new FileReader();
    reader.onloadend = function () {
      // console.log(reader.result);
      //   callback(reader.result);
    };
    reader.readAsDataURL(xhRequest.response);
  };
  xhRequest.open("GET", url);
  xhRequest.responseType = "blob";
  xhRequest.send();
}

export function draw64_OnCanvas(canvas, imgSrc, element) {
  const { x, y, width, height } = element.faceBox;
  const ctx = canvas.getContext("2d");
  const image = new Image();
  const dim = Math.min(width, height);

  image.onload = () => {
    ctx.drawImage(image, x, y, dim, dim);
  };
  //og
  image.src = imgSrc;
}

export function base64ToImg(img) {
  var canvas = document.getElementById("c");
  var ctx = canvas.getContext("2d");

  var image = new Image();
  image.onload = function () {
    ctx.drawImage(image, 0, 0);
  };
  image.src = img;

  return canvas;
}
