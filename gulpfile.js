"use strict";

var gulp = require('gulp');
var _ = require('lodash');
var aliasify = require('aliasify');
var browserify = require('browserify');
var buffer = require('gulp-buffer');
var gulpif = require('gulp-if');
var jade = require('gulp-jade');
var less = require('gulp-less');
var livereload = require('gulp-livereload');
var lrHost; // host for the injected LR script to look for LR server at 
try { lrHost = require('./live-reload-host'); }
catch (e) { lrHost = 'localhost'; }
var path = require('path');
var prefix = require('gulp-autoprefixer');
var serve = require('gulp-serve');
var source = require("vinyl-source-stream");
var sourcemaps = require('gulp-sourcemaps');
var templatizer = require('templatizer');
var uglify = require('gulp-uglify');
var watchify = require('watchify');

var dev = false;



/*==========================================================================*\
  Less compilation and Autoprefixing
\*==========================================================================*/
gulp.task('css', function() { // compile and prefix CSS with sourcemaps
  return gulp.src(['less/*.less', '!src/less/_*'])
    .pipe(gulpif(dev, sourcemaps.init()))
    
    // compile Less
    .pipe(less({ 
      paths: [ path.join(__dirname, 'less', 'includes') ],
      compress: !dev,
    }).on("error", handleError))
    
    // Autoprefix
    .pipe(prefix(
      ["> 1%", "last 2 versions", "android >= 4", "Explorer >= 9"], 
      (dev ? { cascade: true, map: true } : {})
    ).on("error", handleError))
    
    .pipe(gulpif(dev, sourcemaps.write()))
    .pipe(gulp.dest('./build/'+ (dev ? 'dev' : 'production') +'/css'))
    .pipe(gulpif(dev, livereload()));
});



/*==========================================================================*\
  Jade compilation
\*==========================================================================*/
gulp.task('html', function() { // compile and render index.html
  return gulp.src(['jade/*.jade', '!jade/_*'])
    .pipe(jade({ pretty: !!dev }).on("error", handleError))
    .pipe(gulp.dest('./build/'+ (dev ? 'dev' : 'production')))
    .pipe(livereload());
});

gulp.task('templates', function() { // compile templates
  templatizer('jade/templates', 'node_modules/app/templates.js');
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
    .pipe(gulp.dest('./build/'+ (dev ? 'dev' : 'production') +'/js'))
    .pipe(livereload());
}



/*==========================================================================*\
  Watching for changes and rebuilding incrementally
  Watchify allows for updating only changed parts of the JS bundle 
\*==========================================================================*/
gulp.task('watch', function() { // watch and build 
  dev = true;
  gulp.watch(['less/**/*.less'], ['css']);
  gulp.watch(['jade/*.jade'], ['html']);
  gulp.watch(['jade/templates/**/*.jade'], ['templates']);
  livereload.listen();
  
  var bundler = watchify(browserify('./app.js', 
    _.extend(watchify.args, { debug: true, })
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
  root: 'build/dev',
  middleware: require('connect-livereload')({
    src: 'http://'+ (lrHost || 'localhost') +':35729/livereload.js?snipver=1'
  }),
}));





gulp.task('default', ['watch', 'css', 'html', 'templates', 'serve']);
gulp.task('production', ['css', 'html', 'templates'], function () {
  return bundleJS();
});


function handleError(err) { // avoid watch breaking on errors 
  console.log(err.toString());
  this.emit('end');
}
