/*global THREE*/

export default class CubeImageLoader extends THREE.CubeTextureLoader {
	load(urls, onProgress = () => {}) {
		return new Promise((resolve, reject) => {
			super.load(urls, resolve, onProgress, reject)
		});
	}
}
