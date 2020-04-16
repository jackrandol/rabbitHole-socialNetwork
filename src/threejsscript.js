import * as THREE from "./three.js";

export default function spinningBall(imageurl) {
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(40, 200 / 200, 0.1, 50);
  camera.position.z = 30;

  var renderer = new THREE.WebGLRenderer({ alpha: true });

  renderer.setSize(200, 200);

  let canvasElement = document.querySelector(".animatedUserImage");
  canvasElement.appendChild(renderer.domElement);

  var light = new THREE.AmbientLight(0xffffff);
  scene.add(light);

  var geometry = new THREE.SphereGeometry(10, 32, 32);
  var material = new THREE.MeshPhongMaterial();

  var loader = new THREE.TextureLoader();

  material.map = loader.load(imageurl);

  var imageBall = new THREE.Mesh(geometry, material);
  scene.add(imageBall);
  var render = function () {
    requestAnimationFrame(render);
    imageBall.rotation.x += 0.005;
    imageBall.rotation.y += 0.005;
    renderer.render(scene, camera);
  };
  render();
}
