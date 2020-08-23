var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var element = document.getElementById('container')
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x3e3f3a);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

element.appendChild(renderer.domElement);

function startup() {
  controls = new THREE.DeviceOrientationControls( camera );

  var imgCircleGeometry = new THREE.SphereGeometry(2, 15, 15);
  var imgCircleMaterial = new THREE.MeshBasicMaterial({ color: 0x09AC8D });
  var imgCircle = new THREE.Mesh(imgCircleGeometry, imgCircleMaterial);
  scene.add(imgCircle); // add Mercury

  var t = 0;
  function render() {
    requestAnimationFrame(render);
    t += 0.01;

    imgCircle.position.x = 20 * Math.cos(t) + 0;
    imgCircle.position.z = 20 * Math.sin(t) + 0;

    renderer.render(scene, camera);
  }
  render();
}
window.addEventListener('load', startup, false);