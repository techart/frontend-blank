var userSettings = require('./user.settings');

var env = process.env.NODE_ENV || 'hot';
var production = env === 'prod';

var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require("path");
var DirectoryNamedWebpackPlugin = require("directory-named-webpack-plugin");
var CleanWebpackPlugin = require('clean-webpack-plugin');
var SpritesmithPlugin = require('webpack-spritesmith');
var AssetsPlugin = require('assets-webpack-plugin');
var styleLintPlugin = require('stylelint-webpack-plugin');

var applyPolyfill = function applyBabelPolyfill(entry) {
    entry[Object.keys(entry)[0]].unshift('babel-polyfill');
    return entry;
};

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
var imageLoader = 'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false';
//'image?{bypassOnDebug: true, progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
var fileLimit = 10000;
var imgCommonFolder = 'img/common';

var plugins = [

    new styleLintPlugin({
        syntax: mainStyleType,
        files: ['/**/src/**/*.s?(a|c)ss', '/**/src/**/*.less']
    }),

    new SpritesmithPlugin({
        src: {
            cwd: path.resolve(__dirname, 'img/sprite/png'),
            glob: '**/*.*'
        },
        target: {
            image: path.resolve(__dirname, 'img/sprite/sprite.png'),
            css: path.resolve(__dirname, 'src/style/' + (mainStyleType == 'scss' ? '_' : '') + 'sprite.' + mainStyleType)
        },
        apiOptions: {
            cssImageRef: "~img/sprite/sprite.png"
        },
        spritesmithOptions: {
            padding: 2,
        }
    }),

    new webpack.DefinePlugin({
        NODE_ENV: JSON.stringify(env)
    }),

    new webpack.optimize.CommonsChunkPlugin({
        name: Object.keys(userSettings.entry)[0], // Move dependencies to our main file
        chunks: Object.keys(userSettings.entry),
        // children:  true, // Look for common dependencies in all children, // BUG!
        minChunks: 2 // How many times a dependency must come up before being extracted
    }),

    new ExtractTextPlugin({
            filename: addHash('css/[name].css', 'contenthash'),
            allChunks: true // false
        }
    ),

    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery"
    }),

    new AssetsPlugin({
        filename: path.join('assets', env + '.json'),
        path: __dirname,
        prettyPrint: true
    })
];
if (env != 'hot') {
    plugins = plugins.concat([
        new CleanWebpackPlugin(path.resolve(userSettings.getBuildPath(env)), {
            root: path.resolve(__dirname, '..')  //TODO: is this OK?
        }),
    ]);
}
if (production) {
    plugins = plugins.concat([
        // This plugin prevents Webpack from creating chunks
        // that would be too small to be worth loading separately
        // new webpack.optimize.MinChunkSizePlugin({
        //     minChunkSize: 1000, // ~5kb
        // }),

        // new webpack.optimize.AggressiveMergingPlugin(),

        // This plugin minifies all the Javascript code of the final bundle
        new webpack.optimize.UglifyJsPlugin({
            mangle: true,
        }),

        // This plugins defines various variables that we can set to false
        // in production to avoid code related to them from being compiled
        // in our final bundle
        new webpack.DefinePlugin({
            __SERVER__: !production,
            __DEVELOPMENT__: !production,
            __DEVTOOLS__: !production,
            'process.env': {
                BABEL_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        }),

        new webpack.NoEmitOnErrorsPlugin()

    ]);
} else {
    plugins = plugins.concat([
        new webpack.LoaderOptionsPlugin({
            debug: true
        })
    ]);
}

var _export = {
    devtool: production ? false : 'source-map',
    entry: applyPolyfill(userSettings.entry),
    output: {
        path: userSettings.getBuildPath(env),
        filename: addHash('js/[name].js', 'chunkhash', 'hash'),
        chunkFilename: addHash('js/[name].js', 'chunkhash', 'hash'),
        publicPath: userSettings.getPublicPath(env),
        devtoolModuleFilenameTemplate: "[absolute-resource-path]",
        devtoolFallbackModuleFilenameTemplate: "[absolute-resource-path]",
    },

    resolve: {
        extensions: ['.js', '.less', '.sass', '.scss'],
        alias: {
            img: 'img',
            font: 'font'
        },
        modules: [
            path.join(__dirname, "src"),
            '.',
            'img',
            path.join(__dirname, "node_modules", "@webtechart"),
            path.join(__dirname, "node_modules"),
            path.join(__dirname, "bower_components")
        ],
        plugins: [
            new DirectoryNamedWebpackPlugin(),
        ],
    },
    resolveLoader: {
        modules: [path.join(__dirname, "node_modules"), path.join(__dirname, "bower_components")]
    },

    plugins: plugins,
    profile: false,
    stats: userSettings.stats,
    node: {
        fs: 'empty',
        net: 'empty',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                enforce: "pre",
                loader: 'component-css-loader?ext='+ userSettings.mainStyleType
            },
            {
                test: /\.js$/,
                enforce: "pre",
                include: __dirname + '/src',
                loader: 'eslint-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: __dirname + '/src',
                query: {
                    presets: ['es2015']
                }
            },
            // Extract css files
            {
                test: /\.css$/,
                loader: env != 'hot' ? ExtractTextPlugin.extract({fallback: "style-loader", use: "css-loader"}) : 'style-loader!' + styles
            },
            {
                test: /\.(scss|sass)$/,
                // loader: 'style!css?sourceMap!sass?sourceMap'
                loader: env != 'hot' ? ExtractTextPlugin.extract({fallback: 'style-loader', use: sassStyle}) : 'style-loader!' + sassStyle
            },
            {
                test: /\.less$/,
                // loader: 'style!css?sourceMap!less?sourceMap'
                loader: env != 'hot' ? ExtractTextPlugin.extract({fallback: 'style-loader', use: lessStyle}) : 'style!' + lessStyle
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
            },
            {
                test: /\.(png|gif|jpe?g|svg)$/i,
                include: path.resolve(__dirname, imgCommonFolder),
                loaders: [
                    'file-loader?name=[path][name].[ext]',
                    imageLoader
                ]
            },
            {
                test: /\.(png|gif|jpe?g|svg)$/i,
                exclude: path.resolve(__dirname, imgCommonFolder),
                loaders: [
                    'url-loader?limit=' + fileLimit + '&name=[path][name].[ext]',
                    imageLoader
                ]
            },
            {
                test: /\.woff2?(\?\S*)?$/i,
                loader: 'url-loader?limit=' + fileLimit + ',name=[path][name].[ext]',
            },
            {
                test: /\.ttf|eot(\?\S*)?$/,
                loader: 'file-loader?name=[path][name].[ext]'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
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
            loader: query.join('!')
        })
    });
}

if (userSettings.aliasGlobal) {
    userSettings.aliasGlobal.forEach(function (name) {
        _export.resolve.alias[name] = require.resolve(name);
    });
}

module.exports = _export;
