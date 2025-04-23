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
var { exec, execSync } = require('child_process');

// Read package info
var pkg = require('./package.json');
var packageVersion = pkg.version;

var files = {
    app: {
        js: './src/resources/js/app.js',
        less: './src/resources/less/app.less',
        dest: './public/dist',
        destFileName: 'app'
    },

    /**
     * Visi less faili
     * Less nemāks klausīties uz no entry point iekļauto
     * less failu izmaiņām. Tāpēc klausās visu less failu
     * izmaiņas un rebuild katru no less entry point
     */
    lesss: './src/resources/less/**/*.less',
}

/**
 * Šie ir no files objekta
 * visi entry points (js un less), kuru watch un build
 */
var entrypoints = [
    'app'
]


/**
 * Configure browserify
 */
function getBrowserify(entry) {
    return browserify({
        entries: [entry],
        // These params are for watchify
        cache: {},
        packageCache: {},
        standalone: 'webit.ui'
    })
}

/**
 * Bundel js from browserify
 * If compress is true, then uglify js
 *
 * browserify - watch komanda padod watchify
 * ja nav padots, tad uztaisām browserify
 */
function bundleJs(browserify, compress, firstRun, filesName, doneCb) {

    if (!browserify) {
        browserify = getBrowserify(files[filesName].js)
    }

    var handleError = function(er){
        console.log(er.annotated);
        console.log(er.message+' on line '+er.line+':'+er.column);
    }

    var destFileName = files[filesName].destFileName+'.min-'+packageVersion+'.js';

    var s = browserify;

    /**
     * Watchify un Babel gadījumā vajag tikai vienreiz uzstādīt transfor
     * pretējā gadījumā ar katru watchify update eventu transform paliek lēnāks
     */
    if (firstRun) {
        s = s.transform(
            'babelify', {
                presets: [
                    '@babel/env',
                    [
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
                        if (path.indexOf('/node_modules/dom-helpers/') >= 0) {
                            return true;
                        }
                        if (path.indexOf('/node_modules/calendar/') >= 0) {
                            return true;
                        }


                        if (path.indexOf('/node_modules/') < 0) {
                            return true;
                        }
                        return false;
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
        console.log(filesName.padEnd(28, '.')+' js uglify');
        s = s.pipe(buffer()).pipe(uglify())
    }

    s
        .pipe(gulp.dest(files[filesName].dest))
        .on('finish', function() {
            if (doneCb) {
                doneCb()
            }
        })
}

function watchJs(filesName){

    var w = watchify(
        getBrowserify(files[filesName].js, false)
    );

    var first = true;
    w.on('update', function(){
        // bundle without compression for faster response
        bundleJs(w, false, first, filesName);

        first = false;

        console.log(filesName.padEnd(28, '.')+' js updated');
    });

    w.bundle().on('data', function() {});
};

function bundleLess(compress, filesName, doneCb) {
    if (typeof compress == 'undefined') {
        compress = true;
    }

    if (compress) {
        console.log(filesName.padEnd(28, '.')+' css minify');
    }

    let destFileName = files[filesName].destFileName+'.min-'+packageVersion+'.css';

    gulp.src(files[filesName].less)
        .pipe(
            less({
                compress: compress
                //,math: 'always'
            })
                .on('error', function(er){
                    console.log(er.type+': '+er.message);
                    console.log(er.filename+':'+er.line);
                })
        )
        .pipe(rename(destFileName))
        .pipe(gulp.dest(files[filesName].dest))
        .on('finish', function() {
            if (doneCb) {
                doneCb()
            }
        })
}



function bundleJsAll(cb){
    let i = 0;

    function nextEntrypoint() {
        if (entrypoints.length <= i) {
            // Visi entrypoints izpildīti
            cb();
            return;
        }

        bundleJs(false, true, true, entrypoints[i], () => {
            i++;
            nextEntrypoint();
        });
    }

    nextEntrypoint()
};

function bundleLessAll(cb){

    let lessEntrypoints = entrypoints.filter(filesName => {
        return typeof files[filesName].less != 'undefined'
    });

    let i = 0;

    function nextEntrypoint() {
        if (lessEntrypoints.length <= i) {
            // Visi entrypoints izpildīti
            cb();
            return;
        }

        bundleLess(true, lessEntrypoints[i], () => {
            i++;
            nextEntrypoint();
        });
    }

    nextEntrypoint()
}

function watchJsAll(cb) {
    entrypoints.forEach(filesName => {
        watchJs(filesName);
    })

    cb();
}

function watchLessAll(cb) {
    // klausamies visu less failu izmaiņas, jo less nemāk klausīties
    // iekļauto files izmaiņas
    watch([files.lesss], function(){

        // rebuilds visus less entry points
        entrypoints
            .filter(filesName => {
                return typeof files[filesName].less != 'undefined'
            })
            .forEach(filesName => {
                console.log(filesName.padEnd(28, '.')+' less updated');
                bundleLess(false, filesName);
            })
    });

    cb();
}

function getPackageJson() {
    return new Promise(resolve => {
        fs.readFile('./package.json', 'utf8')
            .then(fileContent => {
                resolve(JSON.parse(fileContent))
            })
            .catch(err => {
                throw err;
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

            return new Promise((resolve, reject) => {
                fs.writeFile(
                    './package.json',
                    JSON.stringify(package, null, 2) + '\n',
                    'utf8'
                )
                    .then(() => resolve(package.version))
                    .catch(reject)
            })
        })
        .catch(err => {
            throw err;
        });
}

/**
 * Pretēji file exists. Resolve promise, tikai, ja faila nav
 */
function fileDoesNotExist(filePath) {
    return new Promise((resolve, reject) => {
        fs.access(filePath)
            .then(reject)
            .catch(resolve)
    })
}

function isFileTrackedAndClean(filePath) {

    return new Promise((resolve, reject) => {
        filePath = filePath.trim();
        if (filePath.startsWith('./')) {
            filePath = filePath.substr(2);
        }

        // Check if file is tracked (in version control)
        let isTrackedResult = execSync(`git ls-files -- "${filePath}"`, { encoding: 'utf8' });

        if (isTrackedResult.trim().startsWith(filePath)) {

            // Pārbaudām vai ir labojumi
            let hasChangesResult = execSync(`git status --porcelain -- "${filePath}"`, { encoding: 'utf8' });

            // ja result ir tukšs, tad fails nav labots
            if (hasChangesResult.trim() === '') {

                resolve();

                return;
            }
        }

        reject()
    })
}

function incrementTag() {
    let nextTag = 'v0.0.1';

    let lastTag = execSync(`git tag --sort=-v:refname | head -n 1`, { encoding: 'utf8' });
    lastTag = lastTag ? lastTag.trim() : null;
    if (lastTag) {
        let parts = lastTag.trim().split('.');
        // Pēdējo daļu increment
        parts[parts.length - 1] = parseInt(parts[parts.length - 1], 10) + 1;

        nextTag = parts.join('.');
    }

    console.log(`New tag ${nextTag}`);
    execSync(`git tag -a ${nextTag} -m "Version ${nextTag}"`)
}

/**
 * Tasks
 */
let taskWatch = gulp.series(
    watchJsAll,
    watchLessAll
);
let taskBundle = gulp.series(
    bundleJsAll,
    bundleLessAll
);

/**
 * Sapako dist failus
 * Uztaisa versijas commit
 */
function taskDist(done) {
    taskBundle(() => {
        getPackageJson()
            .then(package => {

                console.log(`Bundle version ${package.version}`);

                execSync('git add package.json', { encoding: 'utf8' });

                entrypoints.forEach(filesName => {

                    let file = files[filesName];

                    let jsFileName = file.dest+'/'+file.destFileName+'.min-'+package.version+'.js';
                    let cssFileName = file.dest+'/'+file.destFileName+'.min-'+package.version+'.css';

                    execSync('git add -f '+jsFileName, { encoding: 'utf8' });
                    execSync('git add -f '+cssFileName, { encoding: 'utf8' });
                })

                execSync(`git commit -m "Bundle version ${package.version}"`, { encoding: 'utf8' });

                done();
            })
    })
}

function taskDefault(done) {
    let destFiles = [];
    entrypoints.forEach(entry => {
        destFiles.push(
            `${files[entry].dest}/${files[entry].destFileName}.min-${packageVersion}.css`
        );
        destFiles.push(
            `${files[entry].dest}/${files[entry].destFileName}.min-${packageVersion}.js`
        );
    })


    Promise.any([
        // Nav neviena dist faila
        Promise.all(
            destFiles.map(fileDoesNotExist)
        ),
        // Visi dist faili ir tracked un bez izmaiņām
        Promise.all(
            destFiles.map(isFileTrackedAndClean)
        )
    ])
        .then(() => {
            console.log('Increment package version');
            incrementPackageVersion()
                .then((newPackageVersion) => {
                    packageVersion = newPackageVersion;
                    console.log('Bundle new version '+packageVersion);
                    taskBundle(() => {
                        console.log('Start watch');
                        taskWatch(done)
                    })
                })
        })
        .catch(() => {
            console.log('Start watch');
            taskWatch(done)
        })
}

function taskIncrementTag(done) {
    incrementTag()
    done();
}


exports.tag = taskIncrementTag;
exports.default = taskDefault;
exports.dist = taskDist;
exports.watch = taskWatch;
exports.bundle = taskBundle;