import "../style.css";
import { appInit } from "./init.js";
import { modelDetect, clearDetections } from "./detection.js";
import { closePhoto, takePhoto, updateUI } from "./updateUI.js";
import { swapFace } from "./swapFace.js";
import { selectedFeatures } from "./detection.js";

import { replace } from "./ai.js";
import { canvasToFile, urlToFile } from "./utils.js";
import "./formdata-polyfill.js";

const machine = {
  state: "START",
  transitions: {
    //initialise model
    //launch video
    //attach events to UI buttons
    START: {
      init: function () {
        appInit();
        //UPDATE CAMERA_UI
      },
      startCamera: function () {
        this.changeState("SHOOT");
      },
    },
    SHOOT: {
      shoot: function () {
        takePhoto();
        this.changeState("PHOTO");
      },
    },
    PHOTO: {
      //wait that user selects faces to be replaced
      //display message telling user to select faces
      //submit button as soon as face is selected
      close: function () {
        closePhoto();
        clearDetections();
        this.changeState("SHOOT");
      },
      selected: function () {
        this.changeState("SELECTED");
      },
      async submit() {
        await swapFace(selectedFeatures);
      },
      //   selected: function (e) {
      //     this.changeState("SELECTED");
      //     detectionsFromFaces = e;
      //   },
    },
    SWAPPED: {
      //display image with replaced faces
      //call base64 to img
      //update camera--result canvas with new image
      display: function (result) {
        console.log(result.result);
      },
    },
  },

  dispatch(actionName, ...payload) {
    const actions = this.transitions[this.state];
    const action = this.transitions[this.state][actionName];

    if (action) {
      action.apply(machine, ...payload);
    } else {
      //action is not valid for current state
      console.log(`${action}  not valid for current state`);
    }
  },
  changeState(newState) {
    //validate that newState actually exists
    if (newState !== undefined) {
      this.state = newState;
      updateUI(newState);
    }
  },
};

export let Camera = Object.create(machine, {
  name: {
    writable: false,
    enumerable: true,
    value: "Camera",
  },
});

window.onload = (event) => Camera.dispatch("init");
