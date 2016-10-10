/*global THREE*/
import Texture from './texture';
import Raycaster from './raycaster';
import dispatcher from './dispatcher';
import monkey from '../resources/models/monkey.json';
import textureImg from '../resources/images/banana.jpg';

export default class Model
{
	constructor(loader, scene, name = '') {
		this.loader = loader;
		this.scene = scene;
		this.geometry = null;
		this.material = null;
		this.mesh = null;
		this.rotate = false;
		this.intersected = false;
		this.name = name;
		this.texture = new Texture();
	}

	load(source, texture) {
		return this.loader.load(source).then((geometry, material) => {
			return this._processModel(geometry, material, texture);
		}).then(this.toScene.bind(this));
	}

	loadFromFile(e) {
		this.scene.remove(this.mesh);
		let {geometry, material} = this.loader.parse(JSON.parse(e.result));
		return this._processModel(geometry, material).then(this.toScene.bind(this));
	}

	exampleLoad() {
		let {geometry, material} = this.loader.parse(monkey);
		return this._processModel(geometry, material, textureImg).then(this.toScene.bind(this));
	}

	_processModel(geometry, material, texture = '') {
		this.geometry = geometry;

		if (!material) {
			this.material = new THREE.MeshLambertMaterial({color: 0xffffff});
		} else {
			this.material = material;
		}
		if (texture) {
			return this.texture.applyTexture(texture, this.material);
		}

		return Promise.resolve();
	}

	toScene() {
		this.createMesh();
		this.scene.add(this.mesh);
		Raycaster.getInstance().addObjectToWatch(this.mesh);
		dispatcher.dispatchEvent({type: 'model.setCamera', center: this.objectCenter()});
		dispatcher.addEventListener('model.spinStart', this.startSpin.bind(this));
		dispatcher.addEventListener('model.spinStop', this.stopSpin.bind(this));
		dispatcher.addEventListener('app.animate', this.spin.bind(this));
		dispatcher.addEventListener('raycaster.intersect', this.intersect.bind(this));
		dispatcher.addEventListener('raycaster.notintersect', this.notIntersect.bind(this));
		dispatcher.addEventListener('settings.model.color', this.color.bind(this));
	}

	createMesh() {
		this.mesh = new THREE.Mesh(this.geometry, this.material);
	}

	objectCenter() {
		var centroid = new THREE.Vector3();
		if (this.geometry) {
			this.geometry.computeBoundingBox();
			centroid.addVectors(this.geometry.boundingBox.min, this.geometry.boundingBox.max);
			centroid.multiplyScalar(0.5);
			centroid.applyMatrix4(this.mesh.matrixWorld);
		}

		return centroid;
	}

	startSpin() {
		this.rotate = true;
	}
	stopSpin() {
		this.rotate = false;
	}
	spin(e) {
		if (this.rotate) {
			this.geometry.rotateY(e.delta);
		}
	}
	intersect(e) {
		if (e.mouseEvent == 'click' && e.object === this.mesh) {
			this.material.color.set(0x00FF00);
		}
		if (e.object === this.mesh && !this.intersected) {
			this.intersected = true;
			this.material.color.set(0xff0000);
		}
	}
	notIntersect(e) {
		if ((!e.object || e.object === this.mesh) && this.intersected) {
			this.intersected = false;
			this.material.color.set(0xffffff);
		}
	}
	color(e) {
		this.material.color.set(e.value);
	}
}
