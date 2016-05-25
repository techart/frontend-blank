var child_process = require('child_process');
var path = require('path');

module.exports = {
	site: "sitename",
	port: 8888,
	docRoot: '../../../..', // '../www'
	buildPath: '../builds', // '../www/builds'
	hotPort: 8889,
	entry: {
		index: ['./src/index.js'],
		img: ['./src/img.js']
		// main: ['./src/page/main/main.js']

	},
	getPublicPath: function getPublicPath(env = 'prod') {
		return this.getBuildPath(env).replace(path.resolve(this.docRoot), '');
	},
	getBuildPath: function getBuildPath(env = 'prod') {
		return path.resolve(this.buildPath, env != 'hot' ? env : 'dev');
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