/* global THREE */

import TWEEN from 'tween';
import Renderer from './renderer';
import dispatcher from './dispatcher';
import Camera from './camera';
import Scenes from './scene';
import Light from './light';
import JsonLoader from './loaders/JSON';
import Model from './model';
import Controls from './controls';
import Interface from './interface';
import Raycaster from './raycaster';
import Gui from './ext/gui';
import Stats from './stats';

export default class App
{
	constructor(settings, container)
	{
		this.settings = settings;
		this.clock = new THREE.Clock();
		this.delta = 0;
		this.container = container;
		this.renderer = new Renderer(container);
		this.scenes = new Scenes();
		this.camera = new Camera(container, this.scenes.scene);
		this.light = new Light(this.scenes.scene);
		this.model = new Model(new JsonLoader(), this.scenes.scene);
		this.controls = new Controls(this.camera.camera, this.renderer);
		this.interface = new Interface(container);
		this.stats = new Stats(this.settings, this.container);
		this.gui = new Gui(this.settings);
	}

	init() {
		this.setupEvents();
		this.renderer.init(this.container);
		this.light.create();
		Raycaster.getInstance().init(this.camera.camera, this.container);
		this.controls.init();
		this.interface.init();
		// real load
		// this.model.load(this.settings.model.src, this.settings.model.texture);

		// example load
		this.model.exampleLoad();
		this.gui.create();
		this.stats.create();
	}
	
	setupEvents() {
		dispatcher.addEventListener('model.fileLoad', this.model.loadFromFile.bind(this.model));
	}

	animate() {
		this.delta = this.clock.getDelta();
		this.time = Date.now();
		TWEEN.update(this.time);
		this.render();
		requestAnimationFrame( this.animate.bind(this) );
	}

	render() {
		this.time = Date.now() * 0.00005;
		dispatcher.dispatchEvent({type: 'app.animate', time: this.time, delta: this.delta});
		this.renderer.render(this.scenes.scene, this.camera.camera);
	}
}
