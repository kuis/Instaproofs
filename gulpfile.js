"use strict";

var gulp = require('gulp');
// var aliasify = require('aliasify');
var assign = require('lodash.assign');
var browserify = require('browserify');
var buffer = require('gulp-buffer');
var connectLivereload = require('connect-livereload');
var exit = require('gulp-exit');
var gulpif = require('gulp-if');
var jade = require('gulp-jade');
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var livereload = require('gulp-livereload');
var localSettings;
var lrHost; // host for the injected LR script to look for LR server at 
var deployDest; // path to deploy the build for 'deploy' task 
var nightlyDest; // path to deploy the build for 'nightly' task 
try { 
  localSettings = require('./local-settings'); 
  lrHost = localSettings.liveReloadHost;
  deployDest = localSettings.deployDest;
  nightlyDest = localSettings.nightlyDest;
}
catch (e) { 
  lrHost = 'localhost'; 
  deployDest = './build/production';
}
var minifyCSS = require('gulp-cssnano');
var path = require('path');
var prefix = require('gulp-autoprefixer');
var serve = require('gulp-serve');
var source = require("vinyl-source-stream");
var sourcemaps = require('gulp-sourcemaps');
var templatizer = require('templatizer');
var uglify = require('gulp-uglify');
var watchify = require('watchify');

var dev = false;
var buildDest = './build/production';



/*==========================================================================*\
  Less compilation and Autoprefixing
\*==========================================================================*/
gulp.task('css', function() { // compile and prefix CSS with sourcemaps
  return gulp.src(['node_modules/app/index.less'])
    .pipe(gulpif(dev, sourcemaps.init()))
    
    // compile Less
    .pipe(less({ 
      paths: [ path.join(__dirname, 'less', 'includes') ],
      compress: !dev,
    }).on("error", handleError))
    
    // Autoprefix
    .pipe(prefix(
      ["> 1%", "last 4 versions", "android >= 4", "Explorer >= 10"], 
      (dev ? { cascade: true, map: true } : {})
    ).on("error", handleError))
    
    .pipe(gulpif(dev, sourcemaps.write()))
    // .pipe(gulpif(!dev, minifyCSS()))
    .pipe(gulp.dest(buildDest +'/css'))
    .pipe(gulpif(dev, livereload()));
    console.log(buildDest +'/css');
});



/*==========================================================================*\
  Jade compilation
\*==========================================================================*/
gulp.task('html', function() { // compile and render index.html
  return gulp.src(['index.jade'])
    .pipe(jade({ pretty: !!dev || true }).on("error", handleError))
    .pipe(gulp.dest(buildDest))
    .pipe(gulpif(dev, livereload()));
});

gulp.task('templates', function(done) { // compile templates
  templatizer('node_modules/app', 'node_modules/app/templates.js', done);
});



/*==========================================================================*\
  Bundling JS with Browserify
  + Uglifying in production 
\*==========================================================================*/
function bundleJS(bundler) {
  // in dev mode, bundler is from watchify
  bundler = bundler || browserify('./app.js');
  return bundler
    // .transform({global: true}, aliasify)
    .bundle()
    .on('error', handleError)
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(gulpif(!dev, uglify()))
    .pipe(gulp.dest(buildDest +'/js'))
    .pipe(gulpif(dev, livereload()))
    .pipe(gulpif(!dev, exit()));
}



/*==========================================================================*\
  Watching for changes and rebuilding incrementally
  Watchify allows for updating only changed parts of the JS bundle 
\*==========================================================================*/
gulp.task('watch', function() { // watch and build 
  dev = true;
  buildDest = './build/dev';
  gulp.watch(['node_modules/app/**/*.less'], ['css']);
  gulp.watch(['node_modules/app/index.jade'], ['html']);
  gulp.watch(['node_modules/app/**/*.jade'], ['templates']);
  livereload.listen();
  
  var bundler = watchify(browserify('./app.js', 
    assign(watchify.args, { debug: true, })
  ));
  bundler.on('update', function () {
    return bundleJS(bundler);
  });
  bundler.on('log', function (msg) {
    console.log(msg);
  });

  return bundleJS(bundler);
});



/*==========================================================================*\
  Serve files at localhost:3000 with injection of live-reload snippet
\*==========================================================================*/
gulp.task('serve', serve({
  root: 'build',
  middleware: connectLivereload({
    src: 'http://'+ (lrHost || 'localhost') +':35729/livereload.js?snipver=1'
  }),
}));



/*==========================================================================*\
  Linting Javascript with JSHint
\*==========================================================================*/
gulp.task('lint', function() {
  return gulp.src(['./node_modules/app/**/*.js', 
                   '!./node_modules/app/templates.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});




gulp.task('default', ['watch', 'css', 'html', 'templates', 'serve']);
gulp.task('production', ['templates', 'css', 'html'], function () {
  return bundleJS();
});

gulp.task('preDeploy', function() {
  buildDest = deployDest;
  console.log('Deploying to ' + buildDest);
});
gulp.task('preNightly', function() {
  buildDest = nightlyDest;
  console.log('Deploying to ' + buildDest);
});

gulp.task('deploy', ['preDeploy', 'css', 'html', 'templates', 'production'], 
    function () {
  return bundleJS();
});
gulp.task('nightly', ['preNightly', 'css', 'html', 'templates', 'production'], 
    function () {
  return bundleJS();
});


function handleError(err) { // avoid watch breaking on errors 
  console.log(err.toString());
  this.emit('end');
}
