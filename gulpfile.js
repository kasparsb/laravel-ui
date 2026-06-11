var gulp = require('gulp');
var rename = require('gulp-rename');
var watch = require('gulp-watch');
var less = require('gulp-less');
var esbuild = require('esbuild');
var fs = require('fs').promises;
var { exec, execSync } = require('child_process');
var path = require('path');

// Read package info
var pkg = require('./package.json');
var packageVersion = pkg.version;

var files = {
    app: {
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

function isComponentJsFile(fileName) {
    return /^[A-Z].+\.js$/.test(fileName);
}

function getComponentNames() {
    return fs.readdir('./src/resources/js')
        .then(files => {
            return files
                .filter(isComponentJsFile)
                .map(file => file.replace(/\.js$/, ''))
                .sort();
        });
}

function getComponentNameFromPath(filePath) {
    let srcJsDir = path.resolve('./src/resources/js');
    let resolvedFilePath = path.resolve(filePath);
    let relativeFilePath = path.relative(srcJsDir, resolvedFilePath);
    let pathParts = relativeFilePath.split(path.sep);

    if (pathParts.length !== 1) {
        return null;
    }

    let fileName = pathParts[0];
    if (!isComponentJsFile(fileName)) {
        return null;
    }

    return fileName.replace(/\.js$/, '');
}

function getComponentOutputPath(componentName) {
    return './public/dist/components/'+componentName+'.min-'+packageVersion+'.js';
}

function isPlainComponentBundle(componentName) {
    return componentName == 'ScriptLoader';
}

function getComponentEntrySource(componentName, modulePath) {
    if (isPlainComponentBundle(componentName)) {
        return `
            import ${JSON.stringify(modulePath)};
        `;
    }

    return `
        import Component from ${JSON.stringify(modulePath)};

        window.webit = window.webit || {};
        window.webit.ui = window.webit.ui || {};
        window.webit.ui.components = window.webit.ui.components || {};
        window.webit.ui[${JSON.stringify(componentName)}] = Component;
        window.webit.ui.components[${JSON.stringify(componentName)}] = Component;

        if (Component && typeof Component.init == 'function') {
            Component.init();
        }
    `;
}

function handleRollupError(er) {
    if (er.loc) {
        console.log(er.message+' on line '+er.loc.line+':'+er.loc.column);
        return;
    }

    console.log(er.message || er);
}

function buildComponentJsWithEsbuild(componentName, minify) {
    let modulePath = process.cwd().replace(/\\/g, '/')+'/src/resources/js/'+componentName+'.js';

    let buildOptions = {
        stdin: {
            contents: getComponentEntrySource(componentName, modulePath),
            resolveDir: process.cwd(),
            sourcefile: componentName+'.entry.js',
            loader: 'js'
        },
        bundle: true,
        outfile: getComponentOutputPath(componentName),
        format: 'iife',
        platform: 'browser',
        loader: {
            '.js': 'jsx'
        },
        jsxFactory: 'jsx.h',
        jsxFragment: 'jsx.Fragment',
        minify: minify,
        logLevel: 'warning'
    };

    if (!isPlainComponentBundle(componentName)) {
        buildOptions.globalName = 'webit.ui.components.'+componentName;
    }

    return esbuild.build(buildOptions);
}

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

function bundleComponentJsAll(cb) {
    getComponentNames()
        .then(componentNames => {
            let i = 0;

            function nextComponent() {
                if (componentNames.length <= i) {
                    cb();
                    return;
                }

                let componentName = componentNames[i];

                bundleComponentJs(componentName, true)
                    .then(() => {
                        i++;
                        nextComponent();
                    })
                    .catch(er => {
                        handleRollupError(er);
                        cb();
                    });
            }

            nextComponent();
        })
        .catch(er => {
            handleRollupError(er);
            cb();
        });
}

function bundleComponentJs(componentName, compress) {
    if (compress) {
        console.log(componentName.padEnd(28, '.')+' js component esbuild');
    }

    return buildComponentJsWithEsbuild(componentName, compress);
}

function componentOutputExists(componentName) {
    return fs.access(getComponentOutputPath(componentName))
        .then(() => true)
        .catch(() => false);
}

function bundleMissingComponentJsAll(cb) {
    getComponentNames()
        .then(componentNames => {
            let i = 0;

            function nextComponent() {
                if (componentNames.length <= i) {
                    cb();
                    return;
                }

                let componentName = componentNames[i];

                componentOutputExists(componentName)
                    .then(exists => {
                        if (exists) {
                            i++;
                            nextComponent();
                            return;
                        }

                        console.log(componentName.padEnd(28, '.')+' js component missing');

                        buildComponentJsWithEsbuild(componentName, false)
                            .then(() => {
                                i++;
                                nextComponent();
                            })
                            .catch(er => {
                                handleRollupError(er);
                                cb();
                            });
                    })
                    .catch(er => {
                        handleRollupError(er);
                        cb();
                    });
            }

            nextComponent();
        })
        .catch(er => {
            handleRollupError(er);
            cb();
        });
}

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

function watchComponentJsAll(cb) {
    let runningComponents = {};
    let queuedComponents = {};

    function rebuild(componentName, done) {
        done = done || function() {};

        if (!componentName) {
            done();
            return;
        }

        if (runningComponents[componentName]) {
            queuedComponents[componentName] = true;
            done();
            return;
        }

        runningComponents[componentName] = true;

        buildComponentJsWithEsbuild(componentName, false)
            .then(() => {
                runningComponents[componentName] = false;
                console.log(componentName.padEnd(28, '.')+' js updated');

                if (queuedComponents[componentName]) {
                    queuedComponents[componentName] = false;
                    rebuild(componentName);
                }

                done();
            })
            .catch(er => {
                runningComponents[componentName] = false;
                handleRollupError(er);
                done();
            });
    }

    console.log('component'.padEnd(28, '.')+' js watch');

    bundleMissingComponentJsAll(function() {});

    gulp.watch(
        jsWatchFiles,
        {
            usePolling: true,
            interval: 250,
            awaitWriteFinish: {
                stabilityThreshold: 100,
                pollInterval: 50
            }
        }
    )
        .on('change', filePath => {
            let componentName = getComponentNameFromPath(filePath);
            //console.log('change: '+filePath);
            rebuild(componentName);
        })
        .on('add', filePath => {
            let componentName = getComponentNameFromPath(filePath);
            //console.log('add: '+filePath);
            rebuild(componentName);
        });

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
    watchComponentJsAll,
    watchLessAll
);
let taskBundle = gulp.series(
    bundleComponentJsAll,
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

                    let cssFileName = file.dest+'/'+file.destFileName+'.min-'+package.version+'.css';
                    let componentJsFiles = file.dest+'/components/*.min-'+package.version+'.js';

                    execSync('git add -f '+cssFileName, { encoding: 'utf8' });
                    execSync('git add -f '+componentJsFiles, { encoding: 'utf8' });
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
