import dispatcher from './dispatcher';
import _ from 'underscore';
import Scenes from './scene';
// import Model from './model';

export default class Controller
{
	constructor() {
		this.models = {};
		this.activeModel = false;
		this.count = 0;
		this.scene = Scenes.scene;

		dispatcher.addEventListener('model.change', this.onModelChange.bind(this));
		dispatcher.addEventListener("texture.change", this.onTextureChange.bind(this));
	}

	createModels() {
		// _.each( settings.models, ( options, name ) => {
		// 	this.models[name] = new Model(options, name);
		// });
	}

	show(obj) {
		if (this.activeModel) {
			var current = this.scene.getObjectByName(this.activeModel);
			this.scene.remove(current);
		}
		obj.cameraOnObject();
		this.scene.add(obj.group);
		this.activeModel = obj.name;
	}

	process() {
		var model = _.find(this.models, function(elem) {
			return elem.enabled;
		});
		model.create(this.show.bind(this), true);
	}

	start() {
		this.createModels();
		this.process();
	}

	/**
	 * замена и загрузка модели
	 */
	onModelChange(e) {
		var model = this.models[e.model];
		if (!model.isLoaded) {
			model.create(this.show.bind(this), false);
		} else {
			model.applyTexture("");
			this.show(model);
		}
	}

	activeModelObj() {
		return this.models[this.activeModel];
	}

	onTextureChange(e) {
		var active = this.activeModelObj();
		active.applyTexture(e.src);
	}

}

