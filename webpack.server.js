var webpack = require('webpack'),
	WebpackDevServer = require('webpack-dev-server'),
	webpackConfig = require('./webpack.config'),
	userSettings = require('./user.settings')
	;

var url = userSettings.hotUrl();

webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

for (var name in webpackConfig.entry) {
	webpackConfig.entry[name] = webpackConfig.entry[name].concat([
		'webpack-dev-server/client?' + url,
		'webpack/hot/dev-server'
	]);
}

webpackConfig.output.publicPath = url + userSettings.getPublicPath('dev');

// webpackConfig.devtool =  "eval-source-map";

var webpackServer = new WebpackDevServer(webpack(webpackConfig), {
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
});

webpackServer.listen(userSettings.hotPort, userSettings.hotHost(), function (err) {
	if (err) {
		console.log(err);
	}
});
