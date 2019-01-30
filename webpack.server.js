let fs = require("fs");
let path = require("path");

var webpack = require('webpack'),
	WebpackDevServer = require('webpack-dev-server'),
	webpackConfig = require('./webpack.config'),
	userSettings = require('./user.settings')
	;
let utils = require("./webpack/utils");

webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

for (var name in webpackConfig.entry) {
	webpackConfig.entry[name] = webpackConfig.entry[name].concat([
		'webpack-dev-server/client?' + utils.hotUrl(),
		'webpack/hot/dev-server'
	]);
}

webpackConfig.output.publicPath = utils.hotUrl() + utils.publicPath('dev');

// webpackConfig.devtool =  "eval-source-map";

var serverSettings = {
	publicPath: webpackConfig.output.publicPath,
	hot: true,
	historyApiFallback: true,
	stats: userSettings.stats,
	headers: {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Headers": "*",
		"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
		"Access-Control-Allow-Credentials": "true",
		"Access-Control-Expose-Headers": "*"
	}
};
if (userSettings.https === true) {
	serverSettings.https = {
		key: fs.readFileSync('/opt/techart/projectclone/config/ssl/server.key'),
		cert: fs.readFileSync('/opt/techart/projectclone/config/ssl/hot.crt'),
		ca: fs.readFileSync('/opt/techart/projectclone/config/ssl/generate/rootCA.pem'),
	};
} else if (userSettings.https !== false) {
	serverSettings.https = userSettings.https;
}

var webpackServer = new WebpackDevServer(webpack(webpackConfig), serverSettings);
webpackServer.listen(userSettings.hotPort, utils.hotHost(), function (err) {
	if (err) {
		console.log(err);
	}
});
