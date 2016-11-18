/*global THREE*/
import dispatcher from './dispatcher';

export default class Raycaster
{
	constructor() {
		this.raycaster = this.raycaster = new THREE.Raycaster();
		this.mouse = {
			x : 0,
			y : 0,
			pos : new THREE.Vector2(),
			projection : new THREE.Vector3()
		};
		this.objects = [];
		this.container = null;
		this.camera = null;
		this.instance = null;
	}

	static getInstance() {
		if (!this.instance) {
			this.instance = new Raycaster();
			document.addEventListener( 'mousemove', this.instance.processEvent.bind(this.instance), false );
			document.addEventListener( 'touchstart', this.instance.processEvent.bind(this.instance), false );
			document.addEventListener( 'touchmove', this.instance.processEvent.bind(this.instance), false );
			document.addEventListener( 'click', this.instance.processEvent.bind(this.instance), false );
		}
		return this.instance;
	}

	init(camera, container) {
		this.camera = camera;
		this.container = container;
	}

	addObjectToWatch(object) {
		this.objects.push(object);
	}

	checkIntersection(event, recursive = false) {
		if (!this.mouse.pos.length()) {
			return;
		}
		this.raycaster.setFromCamera(this.mouse.pos, this.camera);
		let intersection = this.raycaster.intersectObjects(this.objects, recursive);
		if (intersection.length) {
			this._dispatchIntersections(intersection, event);
		} else {
			dispatcher.dispatchEvent({
				type: 'raycaster.notintersect',
				object: null
			});
		}
	}
	_dispatchIntersections(intersection, event) {
		let indexes = [];
		for ( var i = 0; i < intersection.length; i++ ) {
			let index = this.objects.indexOf(intersection[ i ].object);
			if (index != -1) {
				dispatcher.dispatchEvent({
					type: 'raycaster.intersect',
					object: intersection[i].object,
					mouseEvent: event.type,
					intersectionObj: intersection[i]
				});
			} else {
				indexes.push(index);
			}
		}
		indexes.map((curIndex) => {
			dispatcher.dispatchEvent({
				type: 'raycaster.notintersect',
				object: this.objects[curIndex]
			});
		});
	}

	processEvent(e) {
		this.checkInstance();
		switch (e.type) {
			case 'mousemove':
				this._onDocumentMouseMove(e);
				break;
			case 'touchstart':
				this._onDocumentTouchStart(e);
				break;
			case 'touchmove':
				this._onDocumentTouchMove(e);
				break;
			default: break;

		}
		this.checkIntersection(e);
	}

	checkInstance() {
		if (!(this.camera || this.container)) {
			throw 'Please set camera and container. Use init(camera, container)';
		}
	}

	_onDocumentMouseMove(event) {
		this.mouse.x = event.clientX - this.container.windowHalfX;
		this.mouse.y = event.clientY - this.container.windowHalfY;
		this.mouse.pos = this._mousePosition(event.clientX, event.clientY);
		this.calcProjection(event.clientX, event.clientY);
	}

	_mousePosition(x, y) {
		return new THREE.Vector2(
			( x / this.container.width ) * 2 - 1,
			- ( y / this.container.height ) * 2 + 1
		)
	}

	_onDocumentTouchStart(event) {
		if ( event.touches.length == 1 ) {
			event.preventDefault();
			this.x = event.touches[ 0 ].pageX - this.container.windowHalfX;
			this.mouse.y = event.touches[ 0 ].pageY - this.container.windowHalfY;
			this.mouse.pos = this._mousePosition(event.touches[ 0 ].pageX, event.touches[ 0 ].pageY);
			this.calcProjection(event.touches[ 0 ].pageX, event.touches[ 0 ].pageY);
		}
	}

	_onDocumentTouchMove(event) {
		if ( event.touches.length == 1 ) {
			event.preventDefault();
			this.mouse.x = event.touches[ 0 ].pageX - this.container.windowHalfX;
			this.mouse.y = event.touches[ 0 ].pageY - this.container.windowHalfY;
			this.mouse.pos = this._mousePosition(event.touches[ 0 ].pageX, event.touches[ 0 ].pageY);
			this.calcProjection(event.touches[ 0 ].pageX, event.touches[ 0 ].pageY);
		}
	}

	calcProjection(x, y) {
		var vector = new THREE.Vector3();

		vector.set(
			( x / this.container.width ) * 2 - 1,
			- ( y / this.container.height ) * 2 + 1,
			0.5 );
		vector.unproject( this.camera );
		var dir = vector.sub( this.camera.position ).normalize();
		var distance = - this.camera.position.z / dir.z;
		this.mouse.projection = this.camera.position.clone().add( dir.multiplyScalar( distance ) );
		dispatcher.dispatchEvent({type: 'mouse.3dpostion', projection: this.projection});
	}
}
