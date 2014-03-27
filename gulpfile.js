var fs = require("fs");
var requirejs = require("requirejs");

var gulp = require("gulp");
var clean = require("gulp-clean");
var sass = require("gulp-ruby-sass");
var react = require("gulp-react");
var replace = require("gulp-replace");
var runSequence = require("run-sequence");

gulp.task("clean", function() {
  return gulp.src("build", {read: false})
    .pipe(clean());
});


gulp.task("css", function() {
  gulp.src("src/css/sass/easy.scss")
    .pipe(sass({style: "compressed"}))
    .pipe(gulp.dest("build"));
});


gulp.task("js-copy", function() {
  return gulp.src("src/js/**/*")
    .pipe(gulp.dest("build/js"));
});


gulp.task("js-jsx", ["js-copy"], function() {
  return gulp.src("build/js/**/*.jsx")
    .pipe(react())
    .pipe(gulp.dest("build/js"));
});


gulp.task("js-jsx-clean", ["js-jsx"], function() {
  return gulp.src("build/js/**/*.jsx")
    .pipe(clean());
});


gulp.task("js-jsx-replace", ["js-jsx-clean"], function() {
  return gulp.src("build/js/**/*.js")
    .pipe(replace(/jsx\!/g, ""))
    .pipe(gulp.dest("build/js"));
});


gulp.task("js-optimize", ["js-jsx-replace"], function(callback) {
  var config = {
    baseUrl: "build/js/",
    name: "vendor/almond.0.2.9",
    out: "build/easy.0.0.1.js",

    mainConfigFile: "build/js/easy.js",
    include: [
      "easy"
    ],

    preserveLicenseComments: false,
    wrap: true
  };

  requirejs.optimize(config, function(buildResponse) {
    return callback();
  });
});


gulp.task("build", function(callback) {
  runSequence("clean", ["js-optimize", "css"], callback);
});