  if (
    !"mediaDevices" in navigator ||
    !"getUserMedia" in navigator.mediaDevices
  ) {
    alert("Camera API is not available in your browser");
  }

  // get page elements
  const video = document.querySelector("#video");
  const btnPlay = document.querySelector("#btnPlay");
  const btnPause = document.querySelector("#btnPause");
  const btnScreenshot = document.querySelector("#btnScreenshot");
  const btnChangeCamera = document.querySelector("#btnChangeCamera");
  const screenshotsContainer = document.querySelector("#screenshots");
  const canvas = document.querySelector("#canvas");
  const devicesSelect = document.querySelector("#devicesSelect");

  // video constraints
  const constraints = {
    video: {
      width: {
        //min: 1280,
        ideal: 1920,
      },
      height: {
        //min: 720,
        ideal: 1080,
      },
    },
  };

  // use front face camera
  let useFrontCamera = true;

  // current video stream
  let videoStream;

  // handle events
  // play
  btnPlay.addEventListener("click", function () {
    video.play();
    btnPlay.classList.add("is-hidden");
    btnPause.classList.remove("is-hidden");
  });

  // pause
  btnPause.addEventListener("click", function () {
    video.pause();
    btnPause.classList.add("is-hidden");
    btnPlay.classList.remove("is-hidden");
  });

  function takeAScreenShot() {
    const img = document.createElement("img");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    img.src = canvas.toDataURL("image/png");
    screenshotsContainer.prepend(img);
    
    var link = document.createElement('a');
    link.href = canvas.toDataURL("image/png");
    link.download = 'Download.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // take screenshot
  btnScreenshot.addEventListener("click", function () {
    takeAScreenShot();
  });

  // switch camera
  btnChangeCamera.addEventListener("click", function () {
    useFrontCamera = !useFrontCamera;

    initializeCamera();
  });

  // stop video stream
  function stopVideoStream() {
    if (videoStream) {
      videoStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  }

  // initialize
  async function initializeCamera() {
    stopVideoStream();
    constraints.video.facingMode = useFrontCamera ? "user" : "environment";

    try {
      videoStream = await navigator.mediaDevices.getUserMedia(constraints);
      video.srcObject = videoStream;
    } catch (err) {
      alert("Could not access the camera //" + err);
    }
  }

  initializeCamera();

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
const infoPhoto = document.getElementById("infoPhoto");
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
  const horizontalIncrement = 45;
  let previousHorizontalIncrement = 0;

  function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    controls.update();

    infoX.innerHTML = "X: " + Math.round(THREE.Math.radToDeg(camera.rotation.x));
    infoY.innerHTML = "Y: " + Math.round(THREE.Math.radToDeg(camera.rotation.y));
    infoZ.innerHTML = "Z: " + Math.round(THREE.Math.radToDeg(camera.rotation.z));

    if(Math.round(THREE.Math.radToDeg(camera.rotation.y)) >= horizontalIncrement + previousHorizontalIncrement){
      infoPhoto.innerHTML = "Just took a PHOTO! " + previousHorizontalIncrement / horizontalIncrement;
      previousHorizontalIncrement += horizontalIncrement;
    }
  }
  render();
}
window.addEventListener('load', startup, false);