/*global THREE*/
export default class TextureLoader extends THREE.TextureLoader
{
	constructor() {
		super();
	}

	load(url, onProgress = () => {}) {
		return new Promise((resolve, reject) => {
			super.load(url, resolve, onProgress, reject);
		})
	}
}
