var user = require('./user.settings');

module.exports = {
    domains: {
        titan: user.titanUrl(),
        dev: user.devUrl()
    },
    screen_widths: [1280],
    // screen_widths: [320, 480, 640, 768, 1024, 1280, 1600]
    paths: {
        services: {
            path: "services.html",
            scrollTo: 500,
            wait: 150
        },
        about: {
            path: "about.html",
            wait: 500,
            scrollTo: 500,
            selector: "body"
        }
    },
    mismatchTolerance: 0.05,
    screenshotRoot: "test/comparison"
};