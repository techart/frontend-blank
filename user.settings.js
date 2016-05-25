var child_process = require('child_process');

var getusername = function() {
    try {
        return String(child_process.execSync("whoami", {encoding: 'utf8'})).trim();
    } catch (e) {
        return null;
    }
}

module.exports = {
    site: "milanodoors2.com",
    port: 8888,
    docroot: '../www',
    hotPort: 8889,
    entry: {
        index: ['./src/index.js'],
        img: ['./src/img.js']
        // main: ['./src/page/main/main.js']

    },
    hash: {
        'dev': false,
        'prod': true
    },
    
    name: getusername(),

    devHost: function() {
        return this.site + "." + this.name + ".techart.intranet";
    },
    devUrl: function() {
        return "http://" + this.devHost() + ":" + this.port;
    },
    titanHost: function() {
        return this.site + ".projects.techart.ru";
    },
    titanUrl: function() {
        return "http://" + this.titanHost();
    },
    hotHost: function() {
        return this.devHost();
    },
    hotUrl: function() {
        return 'http://' + this.hotHost() + (this.hotPort ? ':' + this.hotPort : '');
    }
}