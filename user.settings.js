module.exports = {
	docRoot: '../www',
	buildPath: '../www/builds',
	hotPort: 8889,
	mainStyleType: 'scss',
	mainTemplateType: 'blade',
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
	stats: {},
	https: true,
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
};