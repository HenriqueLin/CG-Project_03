var scene,
  renderer,
  cameras = [],
  currentCamera;
var keymap = {};
var clock, delta_t;
var globalLight, spotlights = [];
var podium, cybertruck;

const cameraSize = 300, rotateSpeed = Math.PI / 3;
const floorSize = 500, floorColor = 0xdcdfe4, floorShininess = 5;
const podiumRadius = 100, podiumHeight = 30, podiumColor = 0xc678dd, podiumShininess = 10;
const spotHeight = 100, spotDistance = 150;
const spotlightIntensity = 1.5, spotlightDistance = 300, spotlightAngle = 0.5, spotlightColor = 0xffffff;
const globalLightColor = 0xffffff, globalLightIntensity = 0.5;
const pCameraPosition = new THREE.Vector3(300, 300, 300), oCameraPosition = new THREE.Vector3(0, 50, 500);

function createFloor() {
  "use strict";
  var basic = new THREE.MeshBasicMaterial({ color: floorColor })
  var lambert = new THREE.MeshLambertMaterial({ color: floorColor })
  var phong = new THREE.MeshPhongMaterial({ color: floorColor, shininess: floorShininess })
  var mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(floorSize, floorSize),
    phong)
  mesh.userData = { basic: basic, lambert: lambert, phong: phong }

  mesh.rotateX(-Math.PI / 2);
  scene.add(mesh);
}

function createPodium() {
  "use strict";
  podium = new THREE.Object3D()
  var basic = new THREE.MeshBasicMaterial({ color: podiumColor })
  var lambert = new THREE.MeshLambertMaterial({ color: podiumColor })
  var phong = new THREE.MeshPhongMaterial({ color: podiumColor, shininess: podiumShininess })
  var mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(podiumRadius, podiumRadius, podiumHeight, 32, 32),
    phong)
  mesh.userData = { basic: basic, lambert: lambert, phong: phong }
  podium.position.set(0, podiumHeight / 2, 0)
  podium.add(mesh)
  scene.add(podium)
}

function createCybertruck() {
  "use strict";
  // TODO: chassis, body, window
  cybertruck = new THREE.Object3D();
  createTires(cybertruck)
  createChassis(cybertruck)
  createBody(cybertruck)
  createWindows(cybertruck)
  createFrontlight(cybertruck)
  createBacklight(cybertruck)
  cybertruck.position.set(0, podiumHeight / 2, 0)
  podium.add(cybertruck)
}

function createBacklight(obj) {
  var geometry = new THREE.Geometry()
  var basic = new THREE.MeshBasicMaterial({ color: 0xff0000 })
  var lambert = new THREE.MeshLambertMaterial({ color: 0xff0000 })
  var phong = new THREE.MeshPhongMaterial({ color: 0xff0000, emissive: 0x330000, shininess: 30 })

  geometry.vertices.push(
    new THREE.Vector3(-117, 49, 39), // 0 (13)
    new THREE.Vector3(-117, 53, 39), // 1 (14)

    new THREE.Vector3(-117, 49, -39), // 2 (16)
    new THREE.Vector3(-117, 53, -39), // 3 (17)

  )
  geometry.faces.push(
    new THREE.Face3(0, 1, 2),
    new THREE.Face3(1, 3, 2),

  )
  geometry.computeFaceNormals()
  var mesh = new THREE.Mesh(geometry, phong)
  mesh.userData = { basic: basic, lambert: lambert, phong: phong }
  obj.add(mesh)
}

function createFrontlight(obj) {
  var geometry = new THREE.Geometry()
  var basic = new THREE.MeshBasicMaterial({ color: 0xffffff })
  var lambert = new THREE.MeshLambertMaterial({ color: 0xffffff })
  var phong = new THREE.MeshPhongMaterial({ color: 0xffffff, emissive: 0xaaaaaa, shininess: 30 })

  geometry.vertices.push(
    new THREE.Vector3(114, 42, 29), // 0 (2)
    new THREE.Vector3(106, 43, 39), // 1 (3)
    new THREE.Vector3(114, 42, -29), // 2 (6)
    new THREE.Vector3(106, 43, -39), // 3 (7)

    new THREE.Vector3(106, 46, 39), // 4 (8)
    new THREE.Vector3(114, 44, 29), // 5 (9)
    new THREE.Vector3(106, 46, -39), // 6 (10)
    new THREE.Vector3(114, 44, -29), // 7 (11)

  )
  geometry.faces.push(
    new THREE.Face3(1, 0, 4),
    new THREE.Face3(4, 0, 5),
    new THREE.Face3(5, 0, 2),
    new THREE.Face3(5, 2, 7),
    new THREE.Face3(2, 3, 6),
    new THREE.Face3(2, 6, 7),

  )
  geometry.computeFaceNormals()
  var mesh = new THREE.Mesh(geometry, phong)
  mesh.userData = { basic: basic, lambert: lambert, phong: phong }
  obj.add(mesh)
}

function createWindows(obj) {
  var geometry = new THREE.Geometry()
  var basic = new THREE.MeshBasicMaterial({ color: 0x141414 })
  var lambert = new THREE.MeshLambertMaterial({ color: 0x141414 })
  var phong = new THREE.MeshPhongMaterial({ color: 0x141414, shininess: 250 })

  geometry.vertices.push(
    new THREE.Vector3(74, 54, 34), // 0 (20)
    new THREE.Vector3(74, 54, -34), // 1 (21)
    new THREE.Vector3(18, 68, 31), // 2 (22)
    new THREE.Vector3(18, 68, -31), // 3 (23)

    new THREE.Vector3(10, 66, -34.14), // 4 (25)
    new THREE.Vector3(74, 50, -38.14), // 5 (27)
    new THREE.Vector3(-40, 60, -36.31), // 6 (29)
    new THREE.Vector3(-40, 54, -38.02), // 7 (31)

    new THREE.Vector3(10, 66, 34.14), // 8 (24)
    new THREE.Vector3(74, 50, 38.14), // 9 (26)
    new THREE.Vector3(-40, 60, 36.31), // 10 (28)
    new THREE.Vector3(-40, 54, 38.02), // 11 (30)

  )
  geometry.faces.push(
    new THREE.Face3(0, 1, 3),
    new THREE.Face3(0, 3, 2),

    new THREE.Face3(5, 7, 4),
    new THREE.Face3(4, 7, 6),

    new THREE.Face3(9, 8, 11),
    new THREE.Face3(8, 10, 11),
  )
  geometry.computeFaceNormals()
  var mesh = new THREE.Mesh(geometry, phong)
  mesh.userData = { basic: basic, lambert: lambert, phong: phong }
  obj.add(mesh)
}

function createBody(obj) {
  var geometry = new THREE.Geometry()
  var basic = new THREE.MeshBasicMaterial({ color: 0x9c9c9c })
  var lambert = new THREE.MeshLambertMaterial({ color: 0x9c9c9c })
  var phong = new THREE.MeshPhongMaterial({ color: 0x9c9c9c, specular: 0x333333, shininess: 30 })
  geometry.vertices.push(
    // front
    new THREE.Vector3(106, 32, 39), // 0
    new THREE.Vector3(114, 32, 29), // 1
    new THREE.Vector3(114, 42, 29), // 2
    new THREE.Vector3(106, 43, 39), // 3
    new THREE.Vector3(106, 32, -39), // 4
    new THREE.Vector3(114, 32, -29), // 5
    new THREE.Vector3(114, 42, -29), // 6
    new THREE.Vector3(106, 43, -39), // 7

    new THREE.Vector3(106, 46, 39), // 8
    new THREE.Vector3(114, 44, 29), // 9
    new THREE.Vector3(106, 46, -39), // 10
    new THREE.Vector3(114, 44, -29), // 11

    new THREE.Vector3(-116, 32, 39), // 12
    new THREE.Vector3(-117, 49, 39), // 13
    new THREE.Vector3(-117, 53, 39), // 14

    new THREE.Vector3(-116, 32, -39), // 15
    new THREE.Vector3(-117, 49, -39), // 16
    new THREE.Vector3(-117, 53, -39), // 17

    new THREE.Vector3(10, 70, 33), // 18
    new THREE.Vector3(10, 70, -33), // 19

    new THREE.Vector3(74, 54, 34), // 20
    new THREE.Vector3(74, 54, -34), // 21

    new THREE.Vector3(18, 68, 31), // 22
    new THREE.Vector3(18, 68, -31), // 23

    new THREE.Vector3(10, 66, 34.14), // 24
    new THREE.Vector3(10, 66, -34.14), // 25

    new THREE.Vector3(74, 50, 38.14), // 26
    new THREE.Vector3(74, 50, -38.14), // 27

    new THREE.Vector3(-40, 60, 36.31), // 28
    new THREE.Vector3(-40, 60, -36.31), // 29

    new THREE.Vector3(-40, 54, 38.02), // 30
    new THREE.Vector3(-40, 54, -38.02), // 31
  )
  geometry.faces.push(
    new THREE.Face3(0, 1, 2),
    new THREE.Face3(0, 2, 3),

    new THREE.Face3(4, 6, 5),
    new THREE.Face3(4, 7, 6),

    new THREE.Face3(4, 1, 0),
    new THREE.Face3(4, 5, 1),
    new THREE.Face3(1, 5, 2),
    new THREE.Face3(2, 5, 6),

    new THREE.Face3(8, 9, 10),
    new THREE.Face3(9, 11, 10),

    new THREE.Face3(0, 13, 12),
    new THREE.Face3(0, 3, 13),
    new THREE.Face3(13, 3, 8),
    new THREE.Face3(13, 8, 14),

    new THREE.Face3(4, 15, 16),
    new THREE.Face3(4, 16, 7),
    new THREE.Face3(16, 10, 7),
    new THREE.Face3(16, 17, 10),

    new THREE.Face3(15, 12, 13),
    new THREE.Face3(15, 13, 16),

    new THREE.Face3(10, 27, 19),
    new THREE.Face3(10, 17, 27),
    new THREE.Face3(27, 25, 19),
    new THREE.Face3(19, 25, 29),
    new THREE.Face3(19, 29, 17),
    new THREE.Face3(29, 31, 17),
    new THREE.Face3(31, 27, 17),

    new THREE.Face3(8, 18, 26),
    new THREE.Face3(26, 18, 24),
    new THREE.Face3(8, 26, 14),
    new THREE.Face3(18, 28, 24),
    new THREE.Face3(18, 14, 28),
    new THREE.Face3(28, 14, 30),
    new THREE.Face3(30, 14, 26),

    new THREE.Face3(19, 17, 18),
    new THREE.Face3(18, 17, 14),

    new THREE.Face3(20, 8, 10),
    new THREE.Face3(20, 10, 21),

    new THREE.Face3(18, 22, 23),
    new THREE.Face3(18, 23, 19),

    new THREE.Face3(20, 18, 8),
    new THREE.Face3(20, 22, 18),

    new THREE.Face3(21, 19, 23),
    new THREE.Face3(21, 10, 19),

  )

  geometry.computeFaceNormals()
  var mesh = new THREE.Mesh(geometry, phong)
  mesh.userData = { basic: basic, lambert: lambert, phong: phong }
  obj.add(mesh)
}

function createChassis(obj) {
  var basic = new THREE.MeshBasicMaterial({ color: 0x9c9c9c })
  var lambert = new THREE.MeshLambertMaterial({ color: 0x9c9c9c })
  var phong = new THREE.MeshPhongMaterial({ color: 0x9c9c9c, specular: 0x333333, shininess: 30 })
  var geometry = new THREE.BoxGeometry(222, 14, 78)

  var mesh = new THREE.Mesh(geometry, phong)
  mesh.userData = { basic: basic, lambert: lambert, phong: phong }
  mesh.position.set(-5, 25, 0)
  obj.add(mesh)
}

function createTires(obj) {
  createTire(obj, 76, 20, 35)
  createTire(obj, -76, 20, 35)
  createTire(obj, 76, 20, -35)
  createTire(obj, -76, 20, -35)
}

function createTire(obj, x, y, z) {
  var basic = new THREE.MeshBasicMaterial({ color: 0x282c34 })
  var lambert = new THREE.MeshLambertMaterial({ color: 0x282c34 })
  var phong = new THREE.MeshPhongMaterial({ color: 0x282c34, shininess: 1 })
  var geometry = new THREE.CylinderGeometry(20, 20, 10, 32, 32)

  var mesh = new THREE.Mesh(geometry, phong)
  mesh.userData = { basic: basic, lambert: lambert, phong: phong }
  mesh.position.set(x, y, z)
  mesh.rotateX(Math.PI / 2)
  obj.add(mesh)
}

function createSpotlights() {
  createSpotlight(spotDistance, spotHeight, 0, podium)
  createSpotlight(-Math.sin(Math.PI / 6) * spotDistance, spotHeight, Math.cos(Math.PI / 6) * spotDistance, podium)
  createSpotlight(-Math.sin(Math.PI / 6) * spotDistance, spotHeight, -Math.cos(Math.PI / 6) * spotDistance, podium)

}

function createSpotlight(x, y, z, target) {
  "use strict";
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
  var light = new THREE.SpotLight(spotlightColor, spotlightIntensity, spotlightDistance, spotlightAngle)
  light.lookAt(target.position)
  spotlight.add(light)
  spotlights.push(light)
  scene.add(spotlight)
}

function createGlobalLight() {
  "use strict";
  globalLight = new THREE.DirectionalLight(globalLightColor, globalLightIntensity);
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
  createPodium();
  createCybertruck();
  createSpotlights();
}


function createCameras() {
  "use strict";
  var aspect = window.innerWidth / window.innerHeight;
  // PerspectiveCamera looking from top
  var camera = new THREE.PerspectiveCamera(45, aspect, 1, 1000);
  camera.position.copy(pCameraPosition);
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
  camera.position.copy(oCameraPosition);
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
