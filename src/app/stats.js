import dispatcher from './dispatcher';
import Stats from 'stats.js';

export default class StatsWindow
{
	constructor(settings, container) {
		this.stats = new Stats();
		this.settings = settings;
		this.container = container;
	}

	create() {
		this.stats.domElement.style.position = 'absolute';
		this.stats.domElement.style.top = '0px';
		if (this.settings.stats.enabled) {
			this.container.element.appendChild( this.stats.domElement );
		}
		dispatcher.addEventListener('app.animate', () => {
			this.stats.update();
		});
	}

}
