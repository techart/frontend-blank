/* global THREE */
import dispatcher from './dispatcher';

class Camera
{
	constructor(container, scene) {
		this.camera = new THREE.PerspectiveCamera( 55, container.width / container.height, 0.1, 1000 );
		this.container = container;
		this.setup(scene);
		dispatcher.addEventListener( 'resize', this.updateSize.bind(this) );
	}

	setup(scene) {
		this.camera.position.z = 350;
		this.camera.position.y = 0;
		this.camera.lookAt( scene.position );
		this.camera.origin_position = this.camera.position.clone();
	}
	updateSize() {
		this.camera.aspect = this.container.width / this.container.height;
		this.camera.updateProjectionMatrix();
	}
}

export default Camera;
