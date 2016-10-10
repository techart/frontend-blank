/* global THREE */

class Scenes
{
	constructor()
	{
		this.scene = new THREE.Scene();

		var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 50 );
		camera.position.z = 10;

		this.scenes = [this.scene];
	}
}

export default Scenes;
