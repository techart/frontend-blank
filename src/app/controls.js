/*global THREE*/
import dispatcher from './dispatcher';
import './lib/OrbitControls';

class Controls
{
	constructor(camera, renderer) {
		this.orbit = null;
		this.defaultPosition = null;
		this.camera = camera;
		this.renderer = renderer;
	}

	init() {
		this.createOrbitControls();

		dispatcher.addEventListener('app.animate', this.animate.bind(this));
		dispatcher.addEventListener('controls.rotate', this.rotate.bind(this));
		dispatcher.addEventListener('model.setCamera', this.lookAt.bind(this));
	}

	createOrbitControls() {
		this.orbit = new THREE.OrbitControls(this.camera, this.renderer.domElement);
		this.orbit.maxPolarAngle = Math.PI / 2 - 0.2;
		this.orbit.noPan = true;
		this.orbit.target.set(0, 0, 0);
		this.defaultPosition = this.orbit.position0;
	}

	animate() {
		this.orbit.update();
	}

	lookAt( e ) {
		this.camera.lookAt(e.center);
		this.orbit.target = e.center;
		//this.target = e.center;
		//this.orbit.object.position.set(position.x, position.y, position.z);
		//this.defaultPosition.copy(this.orbit.object.position);
	}

	distanceChange(e) {
		this.orbit.minDistance = e.value;
	}

	reset() {
		this.orbit.object.position.copy(this.defaultPosition);
	}

	rotate(e) {
		switch (e.action) {
			case 'up':
				this.orbit.rotateUp(e.angle);
				break;
			case 'down':
				this.orbit.rotateUp(-(e.angle));
				break;
			case 'right':
				this.orbit.rotateLeft(-(e.angle));
				break;
			case 'left':
				this.orbit.rotateLeft(e.angle);
				break;
			case 'reset':
				this.reset();
				break;
			case 'in':
				this.orbit.dollyOut();
				break;
			case 'out':
				this.orbit.dollyIn();
				break;
		}
	}
}

export default Controls;
