/* global NODE_ENV*/

class Settings
{
	constructor() {
		this.env = NODE_ENV;
		//this.env = 'dev';

		this.gui = {
			width : 300,
			breakPoint: 800,
			enabled: true,
			open: true
		};

		this.stats = {
			enabled: true
		};

		this.camera = {
			distance: 160
		};
		this.model = {
			color: 0xFFFFFF,
			src: 'models/monkey.json',
			texture: 'images/banana.jpg',
			geometry: {
				scale: 50
			}
		};

		this.setEnv();
	}

	setEnv() {
		if (this.env == 'prod') {
			this.gui.enabled = false;
			this.stats.enabled = false;
		}
	}
}

export default new Settings();