import * as THREE from '../three.js-master/build/three.module.js'
import { DeviceOrientationControls } from '../three.js-master/examples/jsm/controls/DeviceOrientationControls.js';


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var element = document.getElementById('container')
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x3e3f3a);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const infoX = document.getElementById("infoX");
const infoY = document.getElementById("infoY");
const infoZ = document.getElementById("infoZ");

element.appendChild(renderer.domElement);

function startup() {
  var loader = new THREE.TextureLoader();
  loader.load('exampleVR1.jpg', function (texture) {

    var imgCrcleGeometry = new THREE.SphereGeometry(5, 15, 15);
    var imgCrcleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, map: texture, side: THREE.BackSide, });
    var imgCrcle = new THREE.Mesh(imgCrcleGeometry, imgCrcleMaterial);
    scene.add(imgCrcle);

  });
  var imgCircleGeometry = new THREE.SphereGeometry(2, 15, 15);
  var imgCircleMaterial = new THREE.MeshBasicMaterial({ color: 0x09AC8D });
  var imgCircle = new THREE.Mesh(imgCircleGeometry, imgCircleMaterial);
  scene.add(imgCircle);

  const controls = new DeviceOrientationControls(camera);
  controls.update();

  window.addEventListener( 'resize', onWindowResize, false );
  function onWindowResize() {
  
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  
    renderer.setSize(window.innerWidth, window.innerHeight);
  
}

  function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    controls.update();

    infoX.innerHTML = Math.round(THREE.Math.radToDeg(camera.rotation.x));
    infoY.innerHTML = Math.round(THREE.Math.radToDeg(camera.rotation.y));
    infoZ.innerHTML = Math.round(THREE.Math.radToDeg(camera.rotation.z));

  }
  render();

}
window.addEventListener('load', startup, false);