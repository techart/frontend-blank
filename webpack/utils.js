const settings = require("../user.settings");
const shell = require("child_process");
const path = require("path");

module.exports = {
	hotHost: function () {
		const userName = String(shell.execSync("whoami", {encoding: "utf8", timeout: 500})).trim();
		let domain = userName + ".techart.intranet";
		let resolve = shell.spawnSync("host", [domain], {encoding: "utf8", timeout: 500});
		if(resolve.status !== 0) {
			domain = "localhost";
		}
		return domain;
	},
	hotUrl: function () {
		return (settings.https ? "https" : "http") + '://' + this.hotHost() + ":" + settings.hotPort;
	},
	publicPath: function(env) {
		env = env || "prod";
		return this.buildPath(env).replace(path.resolve(settings.docRoot), "");
	},
	buildPath: function(env) {
		env = env || "prod";
		if(env === "hot") {
			env = "dev";
		}
		return path.resolve(settings.buildPath, env) + "/";
	},
};