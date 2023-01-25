import "../style.css";
import "../ui.css";
import { appInit } from "./init.js";
import { clearDetections } from "./detection.js";
import { closePhoto, takePhoto, updateUI } from "./updateUI.js";
import { swapFace } from "./swapFace.js";
import { selectedFeatures } from "./detection.js";

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
      close: function () {
        closePhoto();
        clearDetections();
        this.changeState("SHOOT");
      },
      noneDetected: function () {
        this.changeState("NONE_DETECTED");
      },
      detected: function () {
        this.changeState("DETECTED");
      },
    },
    NONE_DETECTED: {
      close: function () {
        closePhoto();
        clearDetections();
        this.changeState("SHOOT");
      },
    },
    DETECTED: {
      close: function () {
        closePhoto();
        clearDetections();
        this.changeState("SHOOT");
      },
      async submit() {
        this.changeState("LOADING");
        await swapFace(selectedFeatures);
      },
    },

    LOADING: {
      swapped: function () {
        this.changeState("SWAPPED");
      },
    },
    SWAPPED: {
      close: function () {
        closePhoto();
        clearDetections();
        this.changeState("SHOOT");
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
