import { addClick } from "./detection.js";
import { Camera } from "./main.js";
let faceapi;
let currentFacingMode = "environment";

export let UI_BUTTONS = [
  {
    id: "camera--trigger",
    dispatch: "shoot",
  },
  {
    id: "photo--close",
    dispatch: "close",
  },
  {
    id: "submit--trigger",
    dispatch: "submit",
  },
  { id: "lds-grid" },
];

const UI_CAMERA = ["camera--view", "camera--result", "detections--canvas"];
export const UI_MESSAGES = [{ id: "none--detected" }];

export function appInit() {
  const detectionOptions = {
    withLandmarks: true,
    withDescriptors: false,
  };
  //ml5 init
  faceapi = ml5.faceApi(detectionOptions, modelLoaded);
}

function modelLoaded() {
  console.log("Model Loaded!");
  cameraStart("environment");
  addListeners();
}

function cameraStart() {
  if (currentFacingMode === "user") {
    currentFacingMode = "environment";
    UI_CAMERA.forEach((elem) => {
      document.querySelector(`#${elem}`).classList.remove("flipped");
    });
  } else {
    currentFacingMode = "user";
    UI_CAMERA.forEach((elem) => {
      document.querySelector(`#${elem}`).classList.add("flipped");
    });
  }

  let constraints = {
    video: {
      facingMode: currentFacingMode,
      width: window.innerWidth,
      height: window.innerHeight,
      // width: 1920,
      // height: 1080,
    },
    audio: false,
  };
  let track = null;

  // Access the device camera and stream to cameraView
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      const cameraView = document.querySelector("#camera--view");
      cameraView.srcObject = stream;
    })
    .catch((error) => {
      console.error("Oops. Something is broken.", error);
    });
}

function addListeners() {
  addClick();
  UI_BUTTONS.forEach((element) => {
    const selector = document.querySelector(`#${element.id}`);
    selector.addEventListener("click", () => {
      Camera.dispatch(element.dispatch);
      console.log(element.id, element.dispatch);
    });
    element.show = () => selector.classList.remove("hidden");
    element.hide = () => selector.classList.add("hidden");
  });

  UI_MESSAGES.forEach((element) => {
    const selector = document.querySelector(`#${element.id}`);
    element.show = () => selector.classList.remove("hidden");
    element.hide = () => selector.classList.add("hidden");
  });

  window.addEventListener("keydown", (event) => {
    if (event.isComposing || event.keyCode === 83) {
      console.log(Camera.state);
    }
  });

  const switchCameraButton = document.querySelector("#switch--camera");
  switchCameraButton.src = "icons/switch-camera.png";
  switchCameraButton.addEventListener("click", () => cameraStart());
  const galleryButton = (document.querySelector("#gallery").src =
    "icons/gallery.png");

  Camera.dispatch("startCamera");

  setTimeout(function () {
    window.scrollTo(0, 1);
  }, 100);
}

export { faceapi };
