import dispatcher from './dispatcher';

class Container
{
	constructor(id) {
		this.id = id;
		this.element = document.getElementById(id).firstElementChild;
		this.container = document.getElementById(id);

		this.onResize();
		window.addEventListener( 'resize', this.onResize.bind(this), false );
	}

	clear() {
		this.container.style.height = 0;
		this.container.innerHTML = "";
	}
	onResize() {
		this.width = this.element.offsetWidth;
		this.height = this.element.offsetHeight;
		this.windowHalfX = this.width / 2;
		this.windowHalfY = this.height / 2;
		dispatcher.dispatchEvent({type: 'resize'});
	}
}

export default Container;
