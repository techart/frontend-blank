/*global THREE*/

class Light
{
	constructor(scene) {
		this.pointLights = [];
		this.scene = scene;
		this.ambientLight = new THREE.AmbientLight( 0xffffff );
	}

	create() {
		this.scene.add(this.ambientLight);
	}
}

export default Light;
