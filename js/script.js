var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var element = document.getElementById('container')
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x3e3f3a);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

element.appendChild(renderer.domElement);

function startup() {
  var imgCircleGeometry = new THREE.SphereGeometry(2, 15, 15);
  var imgCircleMaterial = new THREE.MeshBasicMaterial({ color: 0x09AC8D });
  var imgCircle = new THREE.Mesh(imgCircleGeometry, imgCircleMaterial);
  scene.add(imgCircle);
  var imgCrcleGeometry = new THREE.SphereGeometry(5, 15, 15);
  var imgCrcleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.BackSide, wireframe: true });
  var imgCrcle = new THREE.Mesh(imgCrcleGeometry, imgCrcleMaterial);
  scene.add(imgCrcle);

  if (window.DeviceOrientationEvent) {
		
		window.addEventListener("deviceorientation", function(event) 
		{
			
			camera.rotation.x = Math.PI(Math.round(event.gamma));
			camera.rotation.y = Math.PI(Math.round(event.beta));
			camera.rotation.z = Math.PI(Math.round(event.alpha));
			
		}, true);
		
		
		
	} else {
	alert("Sorry, your browser doesn't support Device Orientation");
	}

  var t = 0;
  function render() {
    requestAnimationFrame(render);
    t += 0.05;

    //imgCircle.position.x = 20 * Math.cos(t) + 0;
    //imgCircle.position.z = 20 * Math.sin(t) + 0;

    renderer.render(scene, camera);
  }
  render();
}
window.addEventListener('load', startup, false);