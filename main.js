import * as THREE from "https://cdn.skypack.dev/three@0.132.2/";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js";
import Stats from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/libs/stats.module.js";
import { GUI } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/libs/dat.gui.module.js";
import { RectAreaLightHelper } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/helpers/RectAreaLightHelper.js";
import { RectAreaLightUniformsLib } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/lights/RectAreaLightUniformsLib.js";

let renderer, scene, camera;

let rectLight, rectLightHelper;

let param = {};
let stats;

init();
animate();

function init() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(0, 20, 35);

  scene = new THREE.Scene();

  const ambient = new THREE.AmbientLight(0xffffff, 0.1);
  scene.add(ambient);

  RectAreaLightUniformsLib.init();
  rectLight = new THREE.RectAreaLight(0xffffff, 1, 10, 10);
  rectLight.position.set(5, 5, 10);
  scene.add(rectLight);

  rectLightHelper = new RectAreaLightHelper(rectLight);
  rectLight.add(rectLightHelper);

  const directionLight = new THREE.DirectionalLight(0xffffff, 0.5);
  scene.add(directionLight);

  const geoFloor = new THREE.BoxBufferGeometry(2000, 0.1, 2000);
  const matStdFloor = new THREE.MeshStandardMaterial({
    color: 0x808080,
    roughness: 0,
    metalness: 0,
  });

  const mshStdFloor = new THREE.Mesh(geoFloor, matStdFloor);
  scene.add(mshStdFloor);

  const matStdObject = new THREE.MeshStandardMaterial({
    color: 0xa00000,
    roughness: 0,
    metalness: 0,
  });

  const geoBox = new THREE.BoxBufferGeometry(Math.PI, Math.sqrt(2), Math.E);
  const mshStdBox = new THREE.Mesh(geoBox, matStdObject);
  mshStdBox.position.set(0, 5, 0);
  mshStdBox.rotation.set(0, Math.PI / 2.0, 0);
  mshStdBox.cashShadow = true;
  mshStdBox.receiveShadow = true;
  scene.add(mshStdBox);

  const geoSphere = new THREE.SphereBufferGeometry(1.5, 32, 32);
  const mshStdSphere = new THREE.Mesh(geoSphere, matStdObject);
  mshStdSphere.position.set(-5, 5, 0);
  mshStdSphere.cashShadow = true;
  mshStdSphere.receiveShadow = true;
  scene.add(mshStdSphere);

  const geoKnot = new THREE.TorusKnotBufferGeometry(1.5, 0.5, 100, 16);
  const mshStdKnot = new THREE.Mesh(geoKnot, matStdObject);
  mshStdKnot.position.set(5, 5, 0);
  mshStdKnot.cashShadow = true;
  mshStdKnot.receiveShadow = true;
  scene.add(mshStdKnot);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.copy(mshStdBox.position);
  controls.update();

  stats = new Stats();
  document.body.appendChild(stats.dom);

  // GUI

  const gui = new GUI({ width: 300 });
  gui.open();

  param = {
    motion: true,
    width: rectLight.width,
    height: rectLight.height,
    color: rectLight.color.getHex(),
    intensity: rectLight.intensity,
    light: true,
    ambient: ambient.intensity,
    "material color": matStdObject.color.getHex(),
    "floor color": matStdFloor.color.getHex(),
    "object color": matStdObject.color.getHex(),
    roughness: matStdFloor.roughness,
    metalness: matStdFloor.metalness,
  };
  gui.add(param, "motion");

  const lightFolder = gui.addFolder("Light");
  lightFolder.add(param, "light").onChange(function (val) {
    ambient.intensity = val;
  });

  lightFolder
    .add(param, "ambient", 0.0, 1)
    .step(0.01)
    .onChange(function (val) {
      ambient.intensity = val;
    });

  lightFolder
    .add(param, "width", 1, 20)
    .step(0.1)
    .onChange(function (val) {
      rectLight.width = val;
    });

  lightFolder
    .add(param, "height", 1, 20)
    .step(0.1)
    .onChange(function (val) {
      rectLight.height = val;
    });

  lightFolder.addColor(param, "color").onChange(function (val) {
    rectLight.color.setHex(val);
  });

  lightFolder
    .add(param, "intensity", 0.0, 4.0)
    .step(0.01)
    .onChange(function (val) {
      rectLight.intensity = val;
    });

  lightFolder.open();

  const standardFolder = gui.addFolder("Standard Material");

  standardFolder.addColor(param, "floor color").onChange(function (val) {
    matStdFloor.color.setHex(val);
  });

  standardFolder.addColor(param, "object color").onChange(function (val) {
    matStdObject.color.setHex(val);
  });

  standardFolder
    .add(param, "roughness", 0.0, 1.0)
    .step(0.01)
    .onChange(function (val) {
      matStdObject.roughness = val;
      matStdFloor.roughness = val;
    });

  standardFolder
    .add(param, "metalness", 0.0, 1.0)
    .step(0.01)
    .onChange(function (val) {
      matStdObject.metalness = val;
      matStdFloor.metalness = val;
    });

  standardFolder.open();
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  stats.update();
}
