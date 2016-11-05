// Karma configuration
module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        files: [
            'https://code.createjs.com/createjs-2015.11.26.min.js',
            'node_modules/socket.io-client/socket.io.js',
            'bower_components/jquery/dist/jquery.min.js',

            'www/js/release/bs/definitions/bsdata.js',
            'www/js/release/bs/exceptions/bs.factory.exception.js',
            'www/js/release/bs/exceptions/bs.invalid-value.exception.js',
            'www/js/release/bs/exceptions/bs.missing-property.exception.js',
            'www/js/release/bs/exceptions/bs.invalid-coordinates.exception.js',
            'www/js/release/bs/services/bs.utils.service.js',
            'www/js/release/bs/services/bs.events.service.js',
            'www/js/release/bs/core/bs.core.js',
            'www/js/release/bs/core/bs.map.core.js',
            'www/js/release/bs/core/bs.gui.core.js',
            'www/js/release/bs/core/bs.game.core.js',
            'www/js/release/bs/core/bs.board.core.js',
            'www/js/release/bs/core/bs.loader.core.js',
            'www/js/release/bs/core/bs.socket.core.js',
            'www/js/release/bs/core/bs.constants.core.js',
            'www/js/release/bs/components/bs.hints.component.js',
            'www/js/release/bs/components/bs.counter.component.js',
            'www/js/release/bs/ships/bs.abstract.ship.js',
            'www/js/release/bs/ships/bs.cruiser.ship.js',
            'www/js/release/bs/ships/bs.carrier.ship.js',
            'www/js/release/bs/ships/bs.destroyer.ship.js',
            'www/js/release/bs/ships/bs.submarine.ship.js',
            'www/js/release/bs/ships/bs.battleship.ship.js',

            'tests/common-helpers.js',
            'tests/bs/**/*.test.js'
        ],


        // list of files to exclude
        exclude: [
            '**/*.swp'
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
        },

        client: {
            captureConsole: false
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['dots'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // setup these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    })
}
