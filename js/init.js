import { addClick } from "./detection.js";
import { Camera } from "./main.js";
let faceapi;

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
];

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
  cameraStart();
}

function cameraStart() {
  // Set constraints for the video stream
  let constraints = {
    video: {
      // facingMode: "user",
      //   width: 1920,
      //   height: 1080,

      width: window.innerWidth,
      height: window.innerHeight,
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
    .then(() => {
      addListeners();
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

  window.addEventListener("keydown", (event) => {
    if (event.isComposing || event.keyCode === 83) {
      console.log(Camera.state);
    }
  });

  Camera.dispatch("startCamera");
}

export { faceapi };
