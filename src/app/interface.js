/*global $*/
import buttons from './templates/buttons.html';
import dispatcher from './dispatcher';
import Keyboard from './keyboard';


export default class Interface
{
	constructor(container) {
		this.container = container;
	}

	init() {
		this.applyButtons();
		this.initEvents();
	}

	applyButtons() {
		$(this.container.container).append(buttons);
	}

	keyboardControl() {
		let codes = Keyboard.getInstance().keyCodes;
		if (codes['16'] && codes['82']) {
			dispatcher.dispatchEvent({type: 'model.spinStart'});
		}
		if (codes['16'] && codes['83']) {
			dispatcher.dispatchEvent({type: 'model.spinStop'});
		}
	}

	initEvents() {
		$('.spin-monkey').click(function() {
			dispatcher.dispatchEvent({type: 'model.spinStart'});
		});
		$('.stop-monkey').click(function() {
			dispatcher.dispatchEvent({type: 'model.spinStop'});
		})
		dispatcher.addEventListener('key.pressed', this.keyboardControl);
		$('#file').change(function() {
			let file = this.files[0];
			var reader = new FileReader();
			reader.onloadend = function() {
				dispatcher.dispatchEvent({type: 'model.fileLoad', result: this.result});
				//console.log(this.result);
				//resolve(this.result);
			};
			reader.readAsText(file);
		})

	}
}