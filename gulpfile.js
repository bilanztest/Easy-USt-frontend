var fs = require("fs");
var args   = require("yargs").argv;
var requirejs = require("requirejs");
var rsync = require("rsyncwrapper").rsync;

var gulp = require("gulp");
var clean = require("gulp-clean");
var sass = require("gulp-ruby-sass");
var react = require("gulp-react");
var replace = require("gulp-replace");
var eslint = require("gulp-eslint");
var runSequence = require("run-sequence");

var pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
var env = args.env;
var config = require("./config")();



gulp.task("pre-clean", function() {
  return gulp.src("build", {read: false})
    .pipe(clean());
});

gulp.task("post-clean", function() {
  return gulp.src("build/js/**")
    .pipe(clean());
});


gulp.task("css", function() {
  return gulp.src("src/css/sass/easy.scss")
    .pipe(sass({style: "compressed"}))
    .pipe(gulp.dest("build"));
});

gulp.task("css-dev", function() {
  return gulp.src("src/css/sass/*.scss")
    .pipe(sass({
      trace: false,
      style: "compressed"
    }).on("error", function() {
      console.error("SASS error", arguments);
    }))
    .pipe(gulp.dest("src/css/"));
});


gulp.task("html-copy", function() {
  return gulp.src("src/index.html")
    .pipe(replace("/css/easy.css", "/easy.css"))
    .pipe(replace("data-main=\"/js/easy\"", ""))
    .pipe(replace("/js/vendor/require.2.1.11", "easy." + pkg.version))
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
    out: "build/easy." + pkg.version + ".js",
    mainConfigFile: "build/js/easy.js",
    include: ["easy"],
    preserveLicenseComments: false,
    wrap: true
  };

  requirejs.optimize(config, function(buildResponse) {
    return callback();
  }, function(err) {
    return callback(err);
  });
});


gulp.task("eslint", function() {
  return gulp.src(["build/js/easy.js", "build/js/app/**"])
    .pipe(eslint({
      rulesdir: "eslint_rules/",
      config: "./.eslintrc"
    }))
    .pipe(eslint.format());
});

gulp.task("lint", function(callback) {
  runSequence(
    "pre-clean",
    "js-jsx-clean",
    "eslint",
    // "post-clean",
    callback
  );
});


gulp.task("deploy", ["build"], function(callback) {
  rsync({
    args: ["--verbose"],
    src: "./build/*.*",
    exclude: [],
    ssh: true,
    dest: config.rsync.dest,
    recursive: true,
    syncDestIgnoreExcl: true,
    dryRun: false
  }, function (err, stdout, stderr, cmd) {
    console.log("Shell command was: " + cmd);
    
    if (err) {
      callback(err);
    } else {
      console.log(stdout);
      callback();
    }
  });
});


gulp.task("build", function(callback) {
  // stop build task if it is a dependency of deploy and the ENV is empty
  if (gulp.seq.indexOf("deploy") !== -1 && typeof env === "undefined") {
    return callback(new Error("ENV not set"));
  }

  runSequence(
    "pre-clean",
    ["js-optimize", "css", "html-copy"],
    "post-clean",
    callback
  );
});

gulp.task("watch", function() {
  gulp.watch("src/css/sass/**/*.scss", ["css-dev"]);
});
