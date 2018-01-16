if (typeof process != 'undefined') {
	var path = require('path');
	var child_process = require('child_process');
}

var settings = {
	site: "sitename",
	port: 80,
	docRoot: '../www',
	buildPath: '../www/builds',
	hotPort: 8889,
	mainStyleType: 'scss',
	entry: {
		// Для вынесения общих частей всех точек входа нужно раскомментировать эту строчку
		//common: ['jquery'], // По умолчанию все общие части собираеются в файл index.js
		index: ['./src/entry/index.js'],
		'.img': ['./src/entry/.img.js'],
		// Создания дополнительной точки входа нужно. До дополнительной тчки входа обязательно должен быть подключен файл с общими частями
		// main: ['./src/page/main/main.js']
		'admin-wysiwyg' : ['./src/style/layout/admin-wysiwyg.scss']
	},
	hash: {
		'dev': false,
		'prod': true
	},
	stats: {
		hash: false,
		version: false,
		timings: false,
		assets: false,
		chunks: false,
		modules: false,
		children: false,
		source: false,
		errors: true,
		errorDetails: true,
		warnings: true,
		colors: true,
	},

	images: {
		bypassOnDebug: true,
		gifsicle: {
			interlaced: false,
		},
		optipng: {
			optimizationLevel: 7
		},
		pngquant: {
			enabled: false,
		},
		mozjpeg: {
			quality: 93
		}
	},
	base64MaxFileSize: 10000,
	// Два следующих объекта использовать только в крайней необходимости
	aliases: { // Альтернативные имена для путей, например "my_plugin" : "src/component/alert"
	},
	providePlugin: { // Автоматическая подгрузка модулей через providePlugin
	},

	exposeGlobal: [{'module': 'jquery', 'names': ['jQuery', '$']}],

	getPublicPath: function getPublicPath(env) {
		env = env || 'prod';
		return this.getBuildPath(env).replace(path.resolve(this.docRoot), '');
	},
	getBuildPath: function getBuildPath(env) {
		env = env || 'prod';
		return path.resolve(this.buildPath, env != 'hot' ? env : 'dev') + '/';
	},
	getUserName: function getUserName() {
		try {
			return String(child_process.execSync("whoami", {encoding: 'utf8'})).trim();
		} catch (e) {
			return null;
		}
	},
	devHost: function () {
		return this.site + "." + this.getUserName() + ".techart.intranet";
	},
	devUrl: function () {
		return "http://" + this.devHost() + ":" + this.port;
	},
	titanHost: function () {
		return this.site + ".projects.techart.ru";
	},
	titanUrl: function () {
		return "http://" + this.titanHost();
	},
	hotHost: function () {
		return this.devHost();
	},
	hotUrl: function () {
		return 'http://' + this.hotHost() + (this.hotPort ? ':' + this.hotPort : '');
	}
};

module.exports = settings;
