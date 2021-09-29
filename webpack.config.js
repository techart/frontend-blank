var userSettings = require('./user.settings');
let utils = require('./webpack/utils');

var env = process.env.NODE_ENV || 'hot';
var production = env === 'prod';

var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var AssetsPlugin = require('assets-webpack-plugin');
var styleLintPlugin = require('stylelint-webpack-plugin');
var CompressionPlugin = require('compression-webpack-plugin');
var FlowBabelWebpackPlugin = require('flow-babel-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

var addHash = function addTemplateHash(template, hash, devHash) {
	devHash = devHash || hash;
	return (production && userSettings.hash.prod ? template.replace(/\.[^.]+$/, `/[${hash}:3]/[${hash}]$&`) :
		(userSettings.hash.dev ? `${template}?h=[${devHash}]` : template));
};

var mainStyleType = userSettings.mainStyleType;
var cssloader = (production ? 'css-loader?sourceMap&minimize' : 'css-loader?sourceMap');
var styles = cssloader + '!postcss-loader?sourceMap';
var sassStyle = styles + '!resolve-url-loader!sass-loader?sourceMap&precision=6';
var lessStyle = styles + '!less-loader?sourceMap';
var provideVariables = {
	BEM: ['@webtechart/tao-bem', 'default'],
	Vue: ['vue', 'default'],
	$: 'jquery',
	jQuery: 'jquery',
};
provideVariables = Object.assign(provideVariables, userSettings.providePlugin);

var plugins = [

	new styleLintPlugin({
		syntax: mainStyleType,
		emitErrors: false, //Считать ошибки предупреждениями
		quiet: false, //С v0.6.0 по дефолту true
		files: ['/**/src/**/*.s?(a|c)ss', '/**/src/**/*.less'],
	}),

	new FlowBabelWebpackPlugin({
		warn: true,
	}),

	new webpack.DefinePlugin({
		NODE_ENV: JSON.stringify(env),
	}),

	new webpack.optimize.CommonsChunkPlugin({
		name: Object.keys(userSettings.entry)[0], // Move dependencies to our main file
		chunks: Object.keys(userSettings.entry),
		minChunks: 2, // How many times a dependency must come up before being extracted
	}),

	new ExtractTextPlugin({
		filename: addHash('css/[name].css', 'contenthash'),
		allChunks: true, // false
	}),

	new webpack.ProvidePlugin(provideVariables),

	new AssetsPlugin({
		filename: path.join('assets', env + '.json'),
		path: __dirname,
		prettyPrint: true,
	}),
];
if (env != 'hot') {
	plugins = plugins.concat([
		new CleanWebpackPlugin(path.resolve(utils.buildPath(env)), {
			root: path.resolve(__dirname, '..'),  //TODO: is this OK?
		}),
	]);
}
if (production) {
	plugins = plugins.concat([
		new UglifyJsPlugin({
			"uglifyOptions":
			{
				mangle: true,
			}
		}),

		new webpack.DefinePlugin({
			__SERVER__: !production,
			__DEVELOPMENT__: !production,
			__DEVTOOLS__: !production,
			'process.env': {
				BABEL_ENV: JSON.stringify(process.env.NODE_ENV),
			},
		}),

		new webpack.NoEmitOnErrorsPlugin(),

		new CompressionPlugin({
			test: [/\.js/, /\.css/, /\.svg/],
			level: 9,
		}),

	]);
} else {
	plugins = plugins.concat([
		new webpack.LoaderOptionsPlugin({
			debug: true,
		}),
	]);
}

let stats = {
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
};
Object.assign(stats, userSettings.stats);

var _export = {
	devtool: production ? false : 'source-map',
	entry: userSettings.entry,
	output: {
		path: utils.buildPath(env),
		filename: addHash('js/[name].js', 'chunkhash', 'hash'),
		chunkFilename: addHash('js/[name].js', 'chunkhash', 'hash'),
		publicPath: utils.publicPath(env),
		devtoolModuleFilenameTemplate: '[absolute-resource-path]',
		devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]',
	},

	resolve: {
		extensions: ['.js', '.vue', '.scss', '.less', '.css', '.sass'],
		alias: {
			'vue$': 'vue/dist/vue.esm.js',
			'tao-bem': '@webtechart/tao-bem',
			font: 'font',
		},
		modules: [
			path.join(__dirname, 'src'),
			'.',
			'img',
			path.join(__dirname, 'node_modules'),
		],
		plugins: [
			new DirectoryNamedWebpackPlugin({
				honorPackage: false,
			}),
		],
	},
	resolveLoader: {
		modules: [path.join(__dirname, 'node_modules')],
	},

	plugins: plugins,
	profile: false,
	stats,
	node: {
		fs: 'empty',
		net: 'empty',
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				enforce: 'pre',
				include: __dirname + '/src',
				loader: 'component-css-loader?ext=css!component-css-loader?ext=' + userSettings.mainStyleType,
			},
			{
				test: /\.js$/,
				enforce: 'pre',
				include: __dirname + '/src',
				loader: 'eslint-loader',
				options: {
					emitWarning: true,
				},
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				include: __dirname + '/src',
			},
			{
				test: /\.vue$/,
				use: [{
					loader: 'vue-loader',
					options: {
						productionTip: false,
						loaders: {
							js: 'babel-loader',
						},
						preLoaders: {
							js: 'component-css-loader?ext=' + userSettings.mainStyleType,
						},
					},
				}],
			},
			{
				test: /\.css$/,
				loader: env != 'hot' ? ExtractTextPlugin.extract({fallback: 'style-loader', use: cssloader}) : 'style-loader!' + styles,
			},
			{
				test: /\.(scss|sass)$/,
				// loader: 'style!css?sourceMap!sass?sourceMap'
				loader: env != 'hot' ? ExtractTextPlugin.extract({fallback: 'style-loader', use: sassStyle}) : 'style-loader!' + sassStyle,
			},
			{
				test: /\.less$/,
				// loader: 'style!css?sourceMap!less?sourceMap'
				loader: env != 'hot' ? ExtractTextPlugin.extract({fallback: 'style-loader', use: lessStyle}) : 'style!' + lessStyle,
			},
			{
				test: /\.html$/,
				loader: 'html-loader',
			},
			{
				test: /\.(png|gif|jpe?g|svg|cur)$/i,
				include: [path.resolve(__dirname, 'img'), path.resolve(__dirname, 'node_modules')],
				loaders: [{
					loader: 'url-loader',
					options: {
						limit: userSettings.base64MaxFileSize,
						name: '[path][name].[ext]',
					},
				}, {
					loader: 'image-webpack-loader',
					options: userSettings.images,
				}],
			},
			{
				test: /\.woff2?(\?\S*)?$/i,
				loader: 'url-loader?limit=' + userSettings.base64MaxFileSize + ',name=[path][name].[ext]',
			},
			{
				test: /\.ttf|eot|svg(\?\S*)?$/,
				exclude: path.resolve(__dirname, 'img'),
				loader: 'file-loader?name=[path][name].[ext]',
			},
		],
	},
};

if (userSettings.exposeGlobal) {
	userSettings.exposeGlobal.forEach(function (item) {
		var query = [];
		item.names.forEach(function (name) {
			query.push('expose-loader?' + name);
		});
		_export.module.loaders.unshift({
			test: require.resolve(item.module),
			loader: query.join('!'),
		});
	});
}

if (userSettings.aliases) {
	_export.resolve.alias = Object.assign(_export.resolve.alias, userSettings.aliases);
}

module.exports = _export;
