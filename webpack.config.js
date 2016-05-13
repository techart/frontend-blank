var userSettings  = require('./user.settings');

var env = process.env.NODE_ENV || 'hot';
var production = env === 'prod';

var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require("path");
var precss = require('precss');
var autoprefixer = require('autoprefixer');
var BowerWebpackPlugin = require("bower-webpack-plugin");
var ComponentResolverPlugin = require('component-resolver-webpack');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var SvgStore = require('webpack-svgstore-plugin');
var SpritesmithPlugin = require('webpack-spritesmith');
var AssetsPlugin = require('assets-webpack-plugin');

var addHash = function(template, hash, devHash) {
    devHash = devHash || hash;
    return  (production ? template.replace(/\.[^.]+$/, `.[${hash}]$&`) : `${template}?h=[${devHash}]`)
};

var plugins = [

    new SvgStore(
        [
            path.join('.', 'img', 'sprite', 'svg', '**/*.svg')
        ],
        'img',
        {
            name: 'sprite/sprite.svg',
            prefix: 's-',
            svgoOptions: {
                plugins: [
                    {removeTitle: true}
                ]
            }
        }
    ),

    new SpritesmithPlugin({
        src: {
            cwd: path.resolve(__dirname, 'img/sprite/png'),
            glob: '**/*.*'
        },
        target: {
            image: path.resolve(__dirname, 'img/sprite/sprite.png'),
            css: path.resolve(__dirname, 'src/style/sprite.less')
        },
        apiOptions: {
            cssImageRef: "~img/sprite/sprite.png"
        }
    }),

    new CleanWebpackPlugin(path.resolve(__dirname + '/' + userSettings.docroot + '/builds/' + env), {
        root: path.resolve(__dirname, '..')
    }),

    new BowerWebpackPlugin({
        searchResolveModulesDirectories: false
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

    new ExtractTextPlugin(
        addHash('css/[name].css', 'contenthash'), {
            allChunks: false
        }
    ),

    new webpack.NoErrorsPlugin(),

    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery"
    }),

    new webpack.ResolverPlugin([
        new ComponentResolverPlugin(
            ['js', 'jsx', 'less']
            // array of extensions e.g `['js']` (default: `['jsx', 'js']`)
        )
    ]),

    new AssetsPlugin({
        filename: path.join('assets', env + '.json'),
        path: __dirname,
        prettyPrint: true
    })

];

var styles = 'css?sourceMap!postcss?sourceMap';
var sassStyle = styles + '!sass?sourceMap';
var lessStyle = styles + '!less?sourceMap';

if (production) {
    plugins = plugins.concat([

        // This plugin looks for similar chunks and files
        // and merges them for better caching by the user
        new webpack.optimize.DedupePlugin(),

        // This plugins optimizes chunks and modules by
        // how much they are used in your app
        new webpack.optimize.OccurenceOrderPlugin(),

        // This plugin prevents Webpack from creating chunks
        // that would be too small to be worth loading separately
        // new webpack.optimize.MinChunkSizePlugin({
        //     minChunkSize: 1000, // ~5kb
        // }),

        // new webpack.optimize.AggressiveMergingPlugin(),

        // This plugin minifies all the Javascript code of the final bundle
        new webpack.optimize.UglifyJsPlugin({
            mangle: true,
            compress: {
                warnings: false // Suppress uglification warnings
            }
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
        })

    ]);
} else {
    // pligins = plugins.concat([
    //     new webpack.SourceMapDevToolPlugin({
    //         filename: '[file].map',
    //         // columns: false,
    //         module: true,
    //         moduleFilenameTemplate: "[absolute-resource-path]",
    //         fallbackModuleFilenameTemplate: "[absolute-resource-path]"
    //     }
    //         // '[file].map', null,
    //         // "[absolute-resource-path]", "[absolute-resource-path]"
    //     )
    // ]);
}


module.exports = {
    debug: !production,
    devtool: production ? false : 'source-map',
    devtoolModuleFilenameTemplate: "[absolute-resource-path]",
    devtoolFallbackModuleFilenameTemplate: "[absolute-resource-path]",
    entry: userSettings.entry,
    output: {
        path: __dirname + '/' + userSettings.docroot + (production ? '/builds/prod' : '/builds/dev'),
        filename: addHash('js/[name].js', 'chunkhash', 'hash'),
        chunkFilename: addHash('js/[name].js', 'chunkhash', 'hash'),
        publicPath: production ? '/builds/prod/' : '/builds/dev/'
    },

    resolve: {
        root: path.resolve('./src'),
        extensions: ['', '.js', '.less'],
        alias: {
            img: 'img',
            font: 'font'
        },
        fallback: ['.', 'img']
        //     modulesDirectories: ["web_modules", "node_modules", "bower_components"]
    },

    plugins: plugins,
    module: {
        // noParse: [],
        preLoaders: [
            {
                test: /\.js$/,
                loader: 'component-css?ext=less!eslint'
            }
        ],
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                include: __dirname + '/src',
                query: {
                    presets: ['es2015']
                }
            },
            // Extract css files
            {
                test: /\.css$/,
                loader: env != 'hot' ? ExtractTextPlugin.extract("style", "css") : 'style!' + styles
            },
            {
                test: /\.scss$/,
                // loader: 'style!css?sourceMap!sass?sourceMap'
                loader: env != 'hot' ? ExtractTextPlugin.extract('style', sassStyle) : 'style!' + sassStyle
            },
            {
                test: /\.less$/,
                // loader: 'style!css?sourceMap!less?sourceMap'
                loader: env != 'hot' ? ExtractTextPlugin.extract('style', lessStyle) : 'style!' + lessStyle
            },
            {
                test: /\.html$/,
                loader: 'html',
            },
            {
                test: /\.(png|gif|jpe?g|svg)$/i,
                loaders: [
                    'url?limit=10000&name=' + addHash('[path][name].[ext]', 'hash:6'),
                    'image?bypassOnDebug&optimizationLevel=7&interlaced=false'
                    //'image?{bypassOnDebug: true, progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
                ]
            },
            {
                test: /\.woff2?(\?\S*)?$/i,
                loader: 'url?limit=10000,name=' + addHash('[path][name].[ext]', 'hash:6'),
            },
            {
                test: /\.ttf|eot(\?\S*)?$/,
                loader: 'file?name=' + addHash('[path][name].[ext]', 'hash:6')
            }
        ]
    },

    postcss: function () {
        return [precss, autoprefixer];
    }
};
