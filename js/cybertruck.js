var scene,
  renderer,
  cameras = [],
  currentCamera;
var keymap = {};
var clock, delta_t;

function createFloor() {
  "use strict";
  // TODO:
}

function createpodium() {
  "use strict";
  // TODO:
}

function createCybertruck() {
  "use strict";
  // TODO: chassis, body, window
}

function createSpotlight() {
  "use strict";
  // TODO:
}

function createGlobalLight() {
  "use strict";
  // TODO:
}

function createClock() {
  "use strict";
  clock = new THREE.Clock();
}

function createScene() {
  "use strict";

  scene = new THREE.Scene();
  scene.add(new THREE.AxesHelper(10));

  // TODO: add floor
  // TODO: add global light
  // TODO: add cybertruck
  // TODO: add podium
  // TODO: add spotlight 
}


function createCameras() {
  "use strict";
  // TODO: create a PerspectiveCamera looking from top
  // TODO: create a OrthographicCamera looking from side

  // set the default camera
  // currentCamera = cameras[0];
}


function render() {
  "use strict";
  renderer.render(scene, currentCamera);
}

function init() {
  "use strict";
  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  // set background color
  renderer.setClearColor(0x282c34, 1);
  document.body.appendChild(renderer.domElement);

  // create the clock, scene and cameras
  createClock();
  createScene();
  createCameras();

  // add event listeners
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("resize", onResize);
}

function animate() {
  "use strict";

  // get the time since last animate
  delta_t = clock.getDelta();
  rotation();

  render();
  requestAnimationFrame(animate);
}

function onKeyDown(e) {
  "use strict";
  switch (e.code) {
    // change camera
    case "Digit1":
      // TODO: turn off/on the 1st spotlight
      break;
    case "Digit2":
      // TODO: turn off/on the 2nd spotlight
      break;
    case "Digit3":
      // TODO: turn off/on the 3rd spotlight
      break;

    case "Digit4":
      // TODO: switch to top camera
      break;

    case "Digit5":
      // TODO: switch to side camera
      break;

    // rotate
    case "ArrowLeft":
    case "ArrowRight":
      keymap[e.code] = true;
      break;

    case "KeyQ":
      // TODO: turn off/on global illumination
      break;
    case "KeyW":
      // TODO: turn off/on calculate of illumination
      break;
    case "KeyE":
      // TODO: switch between "Gouraud" and "Phong"
      break;
  }
}

function onKeyUp(e) {
  "use strict";
  switch (e.code) {
    case "ArrowLeft":
    case "ArrowRight":
      keymap[e.code] = false;
      break;
  }
}

function rotation() {
  // TODO: Rotate the podium
}

function onResize() {
  "use strict";
  renderer.setSize(window.innerWidth, window.innerHeight);

  // resize for OrthographicCamera
  // if (window.innerHeight > 0 && window.innerWidth > 0) {
  //   var aspect = window.innerWidth / window.innerHeight;
  //   for (let i = 0; i < cameras.length; i++) {
  //     const camera = cameras[i];
  //     camera.left = (cameraSize * aspect) / -2;
  //     camera.right = (cameraSize * aspect) / 2;
  //     camera.top = cameraSize / 2;
  //     camera.bottom = cameraSize / -2;
  //     camera.updateProjectionMatrix();
  //   }
  // }

  // TODO: add resize for PerspectiveCamera
}
