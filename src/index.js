import App from 'app/app';
import settings from 'app/settings';
import Container from 'app/container';
import 'layout/work';
import 'block/common';

(function() {
	var app = new App(settings, new Container('container'));
	app.init();
	app.animate();
})();
