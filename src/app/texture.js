///* global THREE */
import TextureLoader from './loaders/TextureLoader';

export default class Texture
{
	constructor() {
		this.loader = new TextureLoader();
	}

	applyTexture(url, material) {
		return this.loader.load(url).then((texture) => {
			material.map = texture;
			material.needsUpdate = true;
		})
	}
}
