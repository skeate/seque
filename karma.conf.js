// Karma configuration
// Generated on Tue Jun 30 2015 22:19:03 GMT-0400 (EDT)
module.exports = (config) => {
  const browsers = ['PhantomJS'];
  const reporters = ['mocha', 'coverage'];

  config.set({
    basePath: '',

    frameworks: ['mocha', 'sinon-chai'],

    files: [
      'node_modules/babel-polyfill/dist/polyfill.js',
      'test/**/*.coffee',
      'src/**/*.js',
    ],

    exclude: [],

    preprocessors: {
      'src/**/*.js': ['babel', 'coverage'],
      'test/**/*.coffee': ['coffee'],
    },

    coverageReporter: {
      reporters: [
        { type: 'text-summary' },
        { type: 'html' },
        { type: 'lcov' },
      ],
    },

    reporters,

    port: 9876,

    colors: true,

    logLevel: config.LOG_DEBUG,

    autoWatch: true,

    browsers,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: process.env.CI || false,

    babelPreprocessor: {
      options: {
        presets: ['env'],
      },
    },

    client: {
      chai: {
        includeStack: true,
      },
    },
  });
};
