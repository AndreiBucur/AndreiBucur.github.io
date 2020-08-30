var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// info
infoX = document.getElementById("xinfo");
infoY = document.getElementById("yinfo");
infoZ = document.getElementById("zinfo");

var element = document.getElementById('container')
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x3e3f3a);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

element.appendChild(renderer.domElement);

function startup() {
  var loader = new THREE.TextureLoader();
  loader.load('exampleVR1.jpg', function (texture) {

    var geometry = new THREE.SphereGeometry(200, 20, 20);

    var imgCrcleGeometry = new THREE.SphereGeometry(5, 15, 15);
    var imgCrcleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, map: texture, side: THREE.BackSide, });
    var imgCrcle = new THREE.Mesh(imgCrcleGeometry, imgCrcleMaterial);
    scene.add(imgCrcle);

  });
  var imgCircleGeometry = new THREE.SphereGeometry(2, 15, 15);
  var imgCircleMaterial = new THREE.MeshBasicMaterial({ color: 0x09AC8D });
  var imgCircle = new THREE.Mesh(imgCircleGeometry, imgCircleMaterial);
  scene.add(imgCircle);

  if (window.DeviceOrientationEvent) {

    window.addEventListener("deviceorientation", function (event) {

      camera.rotation.x = event.gamma * 0.01;
      camera.rotation.y = event.beta * 0.01;
      camera.rotation.z = event.alpha * 0.01;

      infoX.innerHTML = event.gamma + " <--> " + camera.rotation.x;
      infoY.innerHTML = event.beta + " <--> " + camera.rotation.y;
      infoZ.innerHTML = event.alpha + " <--> " + camera.rotation.z;

    }, true);



  } else {
    alert("Sorry, your browser doesn't support Device Orientation");
  }

  function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
  render();
}
window.addEventListener('load', startup, false);