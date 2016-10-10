/*global THREE*/
import _ from 'underscore';

export default class SceneComposer
{
	constructor(options, scene, camera, renderer) {
		this.options = options;
		this.composers = {};
		this.scene = scene;
		this.camera = camera;
		this.renderer = renderer;
		this.renderTargets = [];
	}

	create() {
		this.setRenderTargets();
		this._createMainComposer();
	}

	setRenderTargets() {
		let renderTargetParameters = {
			minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
			format: THREE.RGBFormat, stencilBufer: false
		};
		this.renderTargets.push( new THREE.WebGLRenderTarget( this.container.width,
				this.container.height, renderTargetParameters ) );
	}

	_createMainComposer() {
		this.composers.mainComposer = new THREE.EffectComposer( this.renderer, this.renderTargets[0]);
		let renderPass = new THREE.RenderPass( this.scene, this.camera );
		this.composers.mainComposer.addPass( renderPass );
		this._mainShaders(this.composers.mainComposer);
	}

	_mainShaders(composer, addCopy = true) {
		if (addCopy) {
			let copyPass = new THREE.ShaderPass( THREE.CopyShader );
			composer.addPass( copyPass );
			copyPass.renderToScreen = true;
		}
	}

	onResize() {
		_.each(this.renderTargets, (renderTarget) => {
			renderTarget.setSize( this.container.width, this.container.height );
		});
		_.each(this.composers, (composer) => {
			composer.setSize( this.container.width, this.container.height );
		});
	}

	render(delta) {
		_.each(this.composers, function(composer){
			// composer.render();
			composer.render(delta);
		});
	}
}
