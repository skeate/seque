// Karma configuration
// Generated on Tue Jun 30 2015 22:19:03 GMT-0400 (EDT)
module.exports = function(config) {
  var customLaunchers = {
    slChrome: {
      base: 'SauceLabs',
      browserName: 'chrome'
    },
    slFirefox: {
      base: 'SauceLabs',
      browserName: 'firefox'
    },
    //slIE9: {
      //base: 'SauceLabs',
      //browserName: 'internet explorer',
      //version: '9'
    //},
    slIE10: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      version: '10'
    },
    slIE11: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      version: '11'
    }
  };
  var browsers = process.env.CI ?
    Object.keys(customLaunchers) :
    ['Chrome', 'Firefox', 'PhantomJS'];
  var reporters = process.env.CI ?
    ['dots', 'saucelabs', 'coverage'] :
    ['mocha', 'coverage'];

  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'sinon-chai'],

    // list of files / patterns to load in the browser
    files: [
      'node_modules/bluebird/js/browser/bluebird.min.js',
      'test/**/*.coffee',
      'src/**/*.js'
    ],

    // list of files to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/**/*.js': ['babel', 'coverage'],
      'test/**/*.coffee': ['coffee']
    },

    coverageReporter: {
      reporters: [
        {type: 'text-summary'},
        {type: 'html'},
        {type: 'lcov'}
      ]
    },

    reporters: reporters,

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_ERROR,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: browsers,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: process.env.CI || false,

    sauceLabs: {
      testName: 'Seque tests'
    },

    customLaunchers: customLaunchers
  });
};
