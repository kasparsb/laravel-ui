var gulp = require('gulp');
var rename = require('gulp-rename');
var watch = require('gulp-watch');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream')
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');
var fs = require('fs').promises;

var babelify = require('babelify');

// Read package info
var pkg = require('./package.json');

var files = {
    js: './src/resources/js/app.js',
    less: './src/resources/less/app.less',
    lesss: './src/resources/less/**/*.less',
    dest: './public/dist'
}

/**
 * Configure browserify
 */
function getBrowserify(entry) {
    console.log('Browserify entry', entry);
    return browserify({
        entries: [entry],
        // These params are for watchify
        cache: {},
        packageCache: {}

        ,standalone: 'webit.ui'
    })
}

/**
 * Bundel js from browserify
 * If compress is true, then uglify js
 */
function bundleJs(browserify, compress, firstRun) {
    if (typeof compress == 'undefined') {
        compress = true;
    }

    if (typeof firstRun == 'undefined') {
        firstRun = true;
    }

    var handleError = function(er){
        console.log(er.message+' on line '+er.line+':'+er.column);
        console.log(er.annotated);
    }

    var destFileName = 'app.min-'+pkg.version+'.js';

    var s = browserify;

    /**
     * Watchify un Babel gadījumā vajag tikai vienreiz uzstādīt transfor
     * pretējā gadījumā ar katru watchify update eventu transform paliek lēnāks
     */
    if (firstRun) {
        s = s.transform(
            'babelify', {
                presets: [
                    '@babel/env'
                    ,[
                        '@babel/react',
                        {
                            "pragma": "jsx.h",
                            "pragmaFrag": "jsx.Fragment",
                            "throwIfNamespace": false
                        }
                    ]
                ],
                global: true,
                only: [
                    function(path) {
                        // Enter npm packages which should be compilded by babel
                        if (path.indexOf('/dom-helpers/') >= 0) {
                            return true;
                        }
                        if (path.indexOf('/calendar/') >= 0) {
                            return true;
                        }

                        // By default compile everything except node_modules
                        if (path.indexOf('/node_modules/') >= 0) {
                            return false;
                        }
                        return true;
                    }
                ]
            }
        )
    }

    s = s
        .bundle()
        .on('error', handleError)
        .pipe(source(destFileName));

    if (compress) {
        console.log('Uglify js');
        s = s.pipe(buffer()).pipe(uglify())
    }

    s.pipe(gulp.dest(files.dest));
}

function bundleLess(compress) {
    if (typeof compress == 'undefined') {
        compress = true;
    }

    if (compress) {
        console.log('Minify css');
    }

    gulp.src(files.less)
        .pipe(
            less({
                compress: compress
            })
                .on('error', function(er){
                    console.log(er.type+': '+er.message);
                    console.log(er.filename+':'+er.line);
                })
        )
        .pipe(rename('app.min-'+pkg.version+'.css'))
        .pipe(gulp.dest(files.dest));
}

function js(cb){
    bundleJs(getBrowserify(files.js));

    cb();
};

function watchjs(cb){

    var w = watchify(
        getBrowserify(files.js, false)
    );

    var first = true;
    w.on('update', function(){
        // bundle without compression for faster response
        bundleJs(w, false, first);

        first = false;

        console.log('js files updated');
    });

    w.bundle().on('data', function() {});

    cb();
};

function less2(cb){
    bundleLess();

    cb();
}

function watchless(cb){
    watch([files.lesss], function(){
        console.log('less files updated');
        bundleLess(false);
    });

    cb();
};

function isExistsAnyDistFile() {

    return new Promise((resolve, reject) => {
        getPackageJson()
            .then(package => {

                let filesToCheck = [];
                filesToCheck.push(files.dest+'/app.min-'+package.version+'.js')
                filesToCheck.push(files.dest+'/app.min-'+package.version+'.css')


                Promise.any(filesToCheck.map(fileName => fs.access(fileName)))
                    .then(resolve)
                    .catch(reject)
            })
    })

}

function incrementPackageVersion() {

    return fs.readFile('./package.json', 'utf8')
        .then(fileContent => {
            // Parse JSON
            let package = JSON.parse(fileContent);
            let p = package.version
                .split('.')
                .map(Number);

            // inc patch number
            p[2] += 1;

            package.version = p.join('.');

            return fs.writeFile(
                './package.json',
                JSON.stringify(package, null, 2) + '\n',
                'utf8'
            )
        })
        .catch(err => {
            throw err;
        });
}

function getPackageJson() {
    return new Promise((resolve, reject) => {
        fs.readFile('./package.json', 'utf8')
            .then(fileContent => {
                resolve(JSON.parse(fileContent))
            })
            .catch(err => {
                throw err;
            })
    })
}

let taskDefault = gulp.series(watchjs, watchless);
let taskDist = gulp.series(js, less2);

/**
 * Bump version and create new dist files
 * check if these dist files already exists
 * if exists, then do not bump version. Not to
 * accidentaly polute version number
 */
let taskBump = function(done){



    console.log('Start incrementing version');

    incrementPackageVersion()
        .finally(() => {

            console.log('Build new files');
            taskDist(() => {
                console.log('start default watch');
                taskDefault(done)
            })

        })
}

exports.default = taskDefault;
exports.dist = taskDist;
exports.bump = taskBump;

exports.test = function(done){
    isExistsAnyDistFile()
        .then(() => {
            console.log('GOOD');
            done()
        })
        .catch(() => {
            console.log('BAADD');
            done()
        })
}