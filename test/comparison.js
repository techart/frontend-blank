var phantomcss = require('phantomcss');
var settings = require('../test.comparison.js');

phantomcss.init( {
    rebase: casper.cli.get("rebase"),
    casper: casper,
    screenshotRoot: settings.screenshotRoot,
    failedComparisonsRoot: false,
    addLabelToFailedImage: false,
    addIteratorToImage: false,
    mismatchTolerance: settings.mismatchTolerance,
    fileNameGetter: function(root, filename){
        return root + '/'+ filename;
    }
});



casper.on('remote.message', function ( msg ) {
    this.echo( msg );
});

casper.on('error', function ( err ) {
    this.die( "PhantomJS has errored: " + err );
});

casper.on('resource.error', function ( err ) {
    casper.log( 'Resource load error: ' + err, 'warning' );
});




var TestCase = function(pathName, width, height) {
    this.pathName = pathName;
    this.path = settings.paths[pathName];
    if (typeof this.path == 'string') {
        this.path = {path: this.path};
    }
    this.width = width;
    this.height = height;
};

TestCase.prototype.takeShot = function(file) {
    if (this.path.scroll) {
        casper.scrollTo(this.path.scroll);
    }
    var selector = this.path.selector || 'body';
    if (this.path.wait) {
        casper.wait(this.path.wait, function() {
            phantomcss.screenshot(selector, file);
        });
    } else {
        phantomcss.screenshot(selector, file);
    }
};

TestCase.prototype.getUrl = function(domainName) {
    return settings.domains[domainName] + "/" + this.path.path;
};

TestCase.prototype.getFileName = function(domainName) {
    return this.pathName + "/" + this.width + "/" + domainName + '.png';
};

TestCase.prototype.doTest = function(test) {
    var _this = this;
    var names = Object.keys(settings.domains);

    var mainDomain = names[0];
    var mainFile = this.getFileName(mainDomain);
    casper.start(this.getUrl(mainDomain));
    casper.viewport(this.width, this.height);
    casper.then(function() {
        _this.takeShot(mainFile);
    });

    for (var i = 1; i < names.length; i++) {
        var domainName = names[i];
        var currentFile = this.getFileName(domainName);
        casper.thenOpen(this.getUrl(domainName), function() {
            _this.takeShot(currentFile);
        });
        casper.then( function check_the_screenshots() {
            phantomcss.compareFiles(settings.screenshotRoot + "/" + currentFile, settings.screenshotRoot + "/" + mainFile);
        });
    }
    casper.run(function () {
        phantomcss.waitForTests();
        // phantomcss.getExitStatus() // pass or fail?
        test.done();
    });
};


var main = function() {
    var i = 1;
    for (var pathName in settings.paths) {
        var height = 800;
        for (var widthIndex in settings.screen_widths) {
            var width = settings.screen_widths[widthIndex];
            var test = new TestCase(pathName, width, height);
            casper.test.begin(pathName + '_x_' + width, i, test.doTest.bind(test));
        }
        i++;
    }
};


main();

