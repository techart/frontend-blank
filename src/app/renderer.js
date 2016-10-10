/* global THREE */
import dispatcher from './dispatcher';

class Renderer
{
	constructor() {
		this.renderer = new THREE.WebGLRenderer({alpha: true, antialias: true });
	}

	init(container) {
		this.renderer.autoClear = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( container.width, container.height );
		this.renderer.setClearColor(0x000000);
		this.appendCanvas(container);
		this.updateSize(container);

		dispatcher.addEventListener( 'resize', this.updateSize.bind(this, container) );
	}

	appendCanvas(container) {
		container.element.appendChild(this.renderer.domElement );
	}

	updateSize(container) {
		//console.log(container);
		this.renderer.setSize( container.width, container.height );
	}

	render(scene, camera) {
		this.renderer.render(scene, camera);
	}
}

export default Renderer;
