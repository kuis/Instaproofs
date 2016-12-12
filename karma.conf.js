"use strict";
// Karma configuration
// Generated on Sun Jul 20 2014 22:30:38 GMT+0400 (MSK)

var proxyquire = require('proxyquireify');

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['source-map-support', 'browserify', 'mocha', 'sinon-chai'],


    // list of files / patterns to load in the browser
    files: [
      // './app.js',
      './node_modules/app/specs.js',
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: 
    // https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      // './app.js': [ 'browserify' ],
      './node_modules/app/specs.js': [ 'browserify' ],
    },
    
    browserify: {
      debug: true,
      configure: function(bundle) {
        bundle
          .plugin(proxyquire.plugin)
          .require(require.resolve('./node_modules/app/specs.js'), { 
            entry: true,
          });
      },
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['live-html', 'progress', 'dots'],
    // reporters: ['progress'],
    
    htmlLiveReporter: {
      // pageTitle: 'OnePageCRM Mobile Spec', 
      colorScheme: 'earthborn', 
      defaultTab: 'summary', // 'summary' or 'failures': a tab to start with
      
      // only show one suite and fail log at a time, with keyboard navigation
      focusMode: true, 
    },
    
    

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || 
    // config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests 
    // whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: 
    // https://npmjs.org/browse/keyword/karma-launcher
    // browsers: ['Chrome'],
    browsers: ['PhantomJS', 'PhantomJS_custom', 'Chrome'],
 
    customLaunchers: {
      'PhantomJS_custom': {
        base: 'PhantomJS',
        options: {
          windowName: 'my-window',
          settings: {
            webSecurityEnabled: false
          },
        },
        flags: ['--load-images=true'],
        debug: true
      }
    },
 
    phantomjsLauncher: {
      // Have phantomjs exit if a ResourceError is encountered 
      // (useful if karma exits without killing phantom) 
      exitOnResourceError: true
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,
  });
};
