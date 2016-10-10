/*global THREE*/

export default class JsonLoader extends THREE.JSONLoader
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


