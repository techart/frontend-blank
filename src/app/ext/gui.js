import DatGui from 'dat.gui/build/dat.gui';
import dispatcher from '../dispatcher';
import _ from 'underscore';

export default class Gui
{
	constructor(settings) {
		this.gui = new DatGui.GUI();
		this.settings = settings;
	}

	create() {
		this._geometry();
	}

	_geometry() {
		let g = this.gui.addFolder('Geometry');
		g.addColor(this.settings.model, 'color')
				.onChange((val) => dispatcher.dispatchEvent({type:'settings.model.color', value: val}));

	}
	add (g, object, property, data) {
		var method = data ? data.method || 'add' : 'add';
		var item = g[method](object, property);
		if (data.name) {
			item.name(data.name);
		}
		item.onChange((v) => {
			data.property = property;
			data.value = v;
			data.gui = this;
			this.onSettingsChange(data);
			if (data.onChange) {
				data.onChange.apply(this, arguments);
			}
		});
		return item;
	}

	onSettingsChange (data) {
		var e = {type: 'settings.' + data.category};
		e = _.extend(e, data);
		dispatcher.dispatchEvent(e);
	}
}
