var scene,
  renderer,
  cameras = [],
  currentCamera;
var keymap = {};
var clock, delta_t;
const cameraSize = 500

function createFloor() {
  "use strict";
  // TODO: another 2 types of material
  var mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(500, 500),
    new THREE.MeshBasicMaterial({ color: 0xdcdfe4 })
  )
  mesh.rotateX(-Math.PI / 2);
  scene.add(mesh);
}

function createPodium() {
  "use strict";
  var mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(100, 100, 30, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xc678dd })
  )
  mesh.position.set(0, 15, 0)
  scene.add(mesh)
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

  createFloor();
  // TODO: add global light
  // TODO: add cybertruck
  createPodium();
  // TODO: add spotlight 
}


function createCameras() {
  "use strict";
  var aspect = window.innerWidth / window.innerHeight;
  // PerspectiveCamera looking from top
  var camera = new THREE.PerspectiveCamera(45, aspect, 1, 1000);
  camera.position.set(0, 500, 0);
  camera.lookAt(scene.position);
  cameras.push(camera);
  // OrthographicCamera looking from side
  var camera = new THREE.OrthographicCamera(
    (cameraSize * aspect) / -2,
    (cameraSize * aspect) / 2,
    cameraSize / 2,
    cameraSize / -2,
    1,
    1000
  );
  camera.position.set(0, 50, 500);
  // FIXME: look to the podium's position
  camera.lookAt(scene.position);
  cameras.push(camera);

  // set the default camera
  currentCamera = cameras[0];
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
      currentCamera = cameras[0]
      break;

    case "Digit5":
      currentCamera = cameras[1]
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
  if (window.innerHeight > 0 && window.innerWidth > 0) {
    var aspect = window.innerWidth / window.innerHeight;
    for (let i = 0; i < cameras.length; i++) {
      const camera = cameras[i];

      // resize for OrthographicCamera
      if (camera instanceof THREE.OrthographicCamera) {
        camera.left = (cameraSize * aspect) / -2;
        camera.right = (cameraSize * aspect) / 2;
        camera.top = cameraSize / 2;
        camera.bottom = cameraSize / -2;
      }
      else if (camera instanceof THREE.PerspectiveCamera) {
        camera.aspect = window.innerWidth / window.innerHeight;
      }
      camera.updateProjectionMatrix();
    }
  }
}
