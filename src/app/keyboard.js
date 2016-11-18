import dispatcher from './dispatcher';

export default class Keyboard
{
	constructor() {
		this.keyCodes = [];
		this.instance = null;
	}

	static getInstance() {
		if (!this.instance) {
			this.instance = new Keyboard();
			document.addEventListener("keydown", this.instance._onKeyDown.bind(this.instance), false);
			document.addEventListener("keyup", this.instance._onKeyUp.bind(this.instance), false);
		}
		return this.instance;
	}
	onKeyChange(event, pressed) {
		let keyCode = event.keyCode;
		this.keyCodes[keyCode] = pressed;
		if (pressed) {
			dispatcher.dispatchEvent({type: 'key.pressed', keyCodes: this.keyCodes});
		}
	}

	_onKeyDown(event) {
		this.onKeyChange(event, true);
	}
	_onKeyUp(event) {
		this.onKeyChange(event, false);
	}
}
