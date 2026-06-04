var gulp = require('gulp');
var rename = require('gulp-rename');
var watch = require('gulp-watch');
var less = require('gulp-less');
var rollup = require('rollup');
var babel = require('@babel/core');
var { nodeResolve } = require('@rollup/plugin-node-resolve');
var commonjs = require('@rollup/plugin-commonjs');
var terser = require('@rollup/plugin-terser');
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

var jsWatchFiles = [
    './src/resources/js/**/*.js',
    './node_modules/dom-helpers/**/*.js',
    './node_modules/calendar/**/*.js'
];

function shouldTransformWithBabel(path) {
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

function babelTransform() {
    let cache = new Map();

    return {
        name: 'babel-transform',
        load(id) {
            if (!shouldTransformWithBabel(id)) {
                return null;
            }
            if (!id.endsWith('.js')) {
                return null;
            }

            return fs.stat(id)
                .then(stat => {
                    let cached = cache.get(id);

                    if (
                        cached &&
                        cached.mtimeMs === stat.mtimeMs &&
                        cached.size === stat.size
                    ) {
                        return cached.result;
                    }

                    return fs.readFile(id, 'utf8')
                        .then(code => {
                            return babel.transformAsync(code, {
                                filename: id,
                                babelrc: false,
                                configFile: false,
                                sourceMaps: true,
                                presets: [
                                    [
                                        '@babel/env',
                                        {
                                            modules: false
                                        }
                                    ],
                                    [
                                        '@babel/react',
                                        {
                                            "pragma": "jsx.h",
                                            "pragmaFrag": "jsx.Fragment",
                                            "throwIfNamespace": false
                                        }
                                    ]
                                ]
                            });
                        })
                        .then(result => {
                            result = {
                                code: result.code,
                                map: result.map
                            };

                            cache.set(id, {
                                mtimeMs: stat.mtimeMs,
                                size: stat.size,
                                result: result
                            });

                            return result;
                        });
                });
        }
    };
}

function getRollupPlugins(compress) {
    let plugins = [
        nodeResolve({
            browser: true
        }),
        commonjs(),
        babelTransform()
    ];

    if (compress) {
        plugins.push(terser());
    }

    return plugins;
}

function getRollupConfig(filesName, compress) {
    let destFileName = files[filesName].destFileName+'.min-'+packageVersion+'.js';

    return {
        input: files[filesName].js,
        treeshake: true,
        jsx: {
            mode: 'classic',
            factory: 'jsx.h',
            fragment: 'jsx.Fragment'
        },
        plugins: getRollupPlugins(compress),
        output: {
            file: files[filesName].dest+'/'+destFileName,
            format: 'iife',
            name: 'webit.ui',
            exports: 'named'
        }
    };
}

function handleRollupError(er) {
    if (er.loc) {
        console.log(er.message+' on line '+er.loc.line+':'+er.loc.column);
        return;
    }

    console.log(er.message || er);
}

function bundleJs(compress, filesName, doneCb) {
    if (compress) {
        console.log(filesName.padEnd(28, '.')+' js terser');
    }

    let config = getRollupConfig(filesName, compress);

    return buildRollup(config)
        .then(() => {
            if (doneCb) {
                doneCb()
            }
        })
        .catch(handleRollupError)
}

function buildRollup(config) {
    return rollup.rollup(config)
        .then(bundle => {
            return bundle.write(config.output)
                .then(() => {
                    let cache = bundle.cache;
                    return bundle.close()
                        .then(() => cache);
                });
        });
}

function watchJs(filesName){
    let cache = null;
    let isRunning = false;
    let shouldRunAgain = false;
    let config = getRollupConfig(filesName, false);

    function rebuild(done) {
        done = done || function() {};

        if (isRunning) {
            shouldRunAgain = true;
            done();
            return;
        }

        isRunning = true;

        config.cache = cache;

        buildRollup(config)
            .then(newCache => {
                cache = newCache;
                isRunning = false;
                console.log(filesName.padEnd(28, '.')+' js updated');

                if (shouldRunAgain) {
                    shouldRunAgain = false;
                    rebuild();
                }

                done();
            })
            .catch(er => {
                isRunning = false;
                handleRollupError(er);
                done();
            });
    }

    console.log(filesName.padEnd(28, '.')+' js watch');

    rebuild();

    gulp.watch(
        jsWatchFiles,
        {
            usePolling: true,
            interval: 250,
            awaitWriteFinish: {
                stabilityThreshold: 100,
                pollInterval: 50
            }
        },
        rebuild
    );
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

        bundleJs(true, entrypoints[i], () => {
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
