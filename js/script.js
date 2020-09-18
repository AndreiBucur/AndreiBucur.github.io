THREE.DeviceOrientationControls = function ( object ) {

	var scope = this;
	var changeEvent = { type: "change" };
	var EPS = 0.000001;

	this.object = object;
	this.object.rotation.reorder( 'YXZ' );

	this.enabled = true;

	this.deviceOrientation = {};
	this.screenOrientation = 0;

	this.alphaOffset = 0; // radians

	var onDeviceOrientationChangeEvent = function ( event ) {

		scope.deviceOrientation = event;

	};

	var onScreenOrientationChangeEvent = function () {

		scope.screenOrientation = window.orientation || 0;

	};

	// The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

	var setObjectQuaternion = function () {

		var zee = new THREE.Vector3( 0, 0, 1 );

		var euler = new THREE.Euler();

		var q0 = new THREE.Quaternion();

		var q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis

		return function ( quaternion, alpha, beta, gamma, orient ) {

			euler.set( beta, alpha, - gamma, 'YXZ' ); // 'ZXY' for the device, but 'YXZ' for us

			quaternion.setFromEuler( euler ); // orient the device

			quaternion.multiply( q1 ); // camera looks out the back of the device, not the top

			quaternion.multiply( q0.setFromAxisAngle( zee, - orient ) ); // adjust for screen orientation

		};

	}();

	this.connect = function () {

		onScreenOrientationChangeEvent(); // run once on load

		// iOS 13+

		if ( window.DeviceOrientationEvent !== undefined && typeof window.DeviceOrientationEvent.requestPermission === 'function' ) {

			window.DeviceOrientationEvent.requestPermission().then( function ( response ) {

				if ( response == 'granted' ) {

					window.addEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
					window.addEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

				}

			} ).catch( function ( error ) {

				console.error( 'THREE.DeviceOrientationControls: Unable to use DeviceOrientation API:', error );

			} );

		} else {

			window.addEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
			window.addEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

		}

		scope.enabled = true;

	};

	this.disconnect = function () {

		window.removeEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
		window.removeEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

		scope.enabled = false;

	};

	this.update = ( function () {

		var lastQuaternion = new THREE.Quaternion();

		return function () {

			if ( scope.enabled === false ) return;

			var device = scope.deviceOrientation;

			if ( device ) {

				var alpha = device.alpha ? THREE.MathUtils.degToRad( device.alpha ) + scope.alphaOffset : 0; // Z

				var beta = device.beta ? THREE.MathUtils.degToRad( device.beta ) : 0; // X'

				var gamma = device.gamma ? THREE.MathUtils.degToRad( device.gamma ) : 0; // Y''

				var orient = scope.screenOrientation ? THREE.MathUtils.degToRad( scope.screenOrientation ) : 0; // O

				setObjectQuaternion( scope.object.quaternion, alpha, beta, gamma, orient );

				if ( 8 * ( 1 - lastQuaternion.dot( scope.object.quaternion ) ) > EPS ) {

					lastQuaternion.copy( scope.object.quaternion );
					scope.dispatchEvent( changeEvent );

				}

			}

		};


	} )();

	this.dispose = function () {

		scope.disconnect();

	};

	this.connect();

};

THREE.DeviceOrientationControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.DeviceOrientationControls.prototype.constructor = THREE.DeviceOrientationControls;

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
  /*
    if (window.DeviceOrientationEvent) {
  
      window.addEventListener("deviceorientation", function (event) {
  
        camera.rotation.x = event.gamma * Math.PI;
        camera.rotation.y = event.beta * Math.PI;
        camera.rotation.z = event.alpha * Math.PI;
  
        infoX.innerHTML = event.gamma;
        infoY.innerHTML = event.beta;
        infoZ.innerHTML = event.alpha;
  
      }, true);
  
  
  
    } else {
      alert("Sorry, your browser doesn't support Device Orientation");
    }
  */

  const controls = new THREE.DeviceOrientationControls(camera, element);
  controls.update();

  function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    controls.update();

    infoX.innerHTML = camera.rotation.x;
    infoY.innerHTML = camera.rotation.y;
    infoZ.innerHTML = camera.rotation.z;
  }
  render();
}
window.addEventListener('load', startup, false);