var scene,
  renderer,
  cameras = [],
  currentCamera;
var keymap = {};
var clock, delta_t;
var globalLight, spotlights = [];
var podium;

const cameraSize = 500, rotateSpeed = Math.PI / 3

function createFloor() {
  "use strict";
  // TODO: another 2 types of material
  var basic = new THREE.MeshBasicMaterial({ color: 0xdcdfe4 })
  var lambert = new THREE.MeshLambertMaterial({ color: 0xdcdfe4 })
  var phong = new THREE.MeshPhongMaterial({ color: 0xdcdfe4, specular: 0x111111, shininess: 5 })
  var mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(500, 500),
    phong)
  mesh.userData = { basic: basic, lambert: lambert, phong: phong }

  mesh.rotateX(-Math.PI / 2);
  scene.add(mesh);
}

function createPodium() {
  "use strict";
  podium = new THREE.Object3D()
  var basic = new THREE.MeshBasicMaterial({ color: 0xc678dd })
  var lambert = new THREE.MeshLambertMaterial({ color: 0xc678dd })
  var phong = new THREE.MeshPhongMaterial({ color: 0xc678dd, specular: 0x111111, shininess: 10 })
  var mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(100, 100, 30, 32, 32),
    phong)
  mesh.userData = { basic: basic, lambert: lambert, phong: phong }
  mesh.position.set(0, 15, 0)
  podium.add(mesh)
  scene.add(podium)
}

function createCybertruck() {
  "use strict";
  // TODO: chassis, body, window
}

function createSpotlights() {
  createSpotlight(150, 150, 0, podium)
  createSpotlight(-Math.sin(Math.PI / 6) * 150, 150, Math.cos(Math.PI / 6) * 150, podium)
  createSpotlight(-Math.sin(Math.PI / 6) * 150, 150, -Math.cos(Math.PI / 6) * 150, podium)

}

function createSpotlight(x, y, z, target) {
  "use strict";
  // TODO:
  var spotlight = new THREE.Object3D();
  var sphere = new THREE.Mesh(
    new THREE.SphereGeometry(10, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xFFc379 }))

  var cone = new THREE.Mesh(
    new THREE.ConeGeometry(10.5, 20, 16),
    new THREE.MeshBasicMaterial({ color: 0x98c379 }))
  spotlight.add(sphere, cone)
  cone.rotateX(-Math.PI / 2)
  cone.position.set(0, 0, 10)
  spotlight.position.set(x, y, z)
  spotlight.lookAt(target.position)
  var light = new THREE.SpotLight(0xffffff, 1, 300, 0.5,)
  scene.add(new THREE.SpotLightHelper(light))
  light.lookAt(target.position)
  spotlight.add(light)
  spotlights.push(light)
  scene.add(spotlight)
}

function createGlobalLight() {
  "use strict";
  globalLight = new THREE.DirectionalLight(0xffc98e, 0.8);
  scene.add(globalLight);
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
  createGlobalLight();
  // TODO: add cybertruck
  createPodium();
  createSpotlights();
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
    case "Digit1":
      spotlights[0].visible = !spotlights[0].visible
      break;
    case "Digit2":
      spotlights[1].visible = !spotlights[1].visible
      break;
    case "Digit3":
      spotlights[2].visible = !spotlights[2].visible
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
      globalLight.visible = !globalLight.visible
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
  if (keymap["ArrowLeft"]) {
    podium.rotateY(-rotateSpeed * delta_t);
  }
  if (keymap["ArrowRight"]) {
    podium.rotateY(rotateSpeed * delta_t);
  }
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
