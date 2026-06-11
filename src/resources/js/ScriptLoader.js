window.webit = window.webit || {};
window.webit.ui = window.webit.ui || {};
window.webit.ui.components = window.webit.ui.components || {};
window.webit.ui.loadingComponents = window.webit.ui.loadingComponents || {};
window.webit.ui.loadedComponents = window.webit.ui.loadedComponents || {};
window.webit.ui.loadingSvgIcons = window.webit.ui.loadingSvgIcons || {};
window.webit.ui.loadedSvgIcons = window.webit.ui.loadedSvgIcons || {};

var config = window.webit.ui.scriptLoaderConfig || {};
var componentBaseUrl = config.componentBaseUrl || '';
var packageVersion = config.packageVersion || '';
var cacheBuster = config.cacheBuster || '';
var svgsUrl = config.svgsUrl || '';

function componentUrl(componentName) {
    return componentBaseUrl+'/'+componentName+'.min-'+packageVersion+'.js'+cacheBuster;
}

function normalizeRoots(root) {
    if (!root) {
        return [document];
    }

    if (root instanceof Element || root instanceof Document || root instanceof DocumentFragment) {
        return [root];
    }

    return Array.from(root);
}

function collectMarkerValues(root, selector, datasetKey) {
    var names = [];
    var roots = normalizeRoots(root);

    roots.forEach(function(rootEl) {
        var els = [];

        if (rootEl.matches && rootEl.matches(selector)) {
            els.push(rootEl);
        }

        if (rootEl.querySelectorAll) {
            els = els.concat(Array.from(rootEl.querySelectorAll(selector)));
        }

        els.forEach(function(el) {
            el.dataset[datasetKey].split(/\s+/).forEach(function(name) {
                if (name && names.indexOf(name) < 0) {
                    names.push(name);
                }
            });
        });
    });

    return names;
}

function collectComponentNames(root) {
    return collectMarkerValues(root, '[data-ui-component-scripts]', 'uiComponentScripts');
}

function collectSvgIconNames(root) {
    return collectMarkerValues(root, '[data-ui-svg-icons]', 'uiSvgIcons');
}

function loadComponentScript(componentName) {
    if (window.webit.ui.components[componentName] || window.webit.ui.loadedComponents[componentName]) {
        return Promise.resolve();
    }

    if (window.webit.ui.loadingComponents[componentName]) {
        return window.webit.ui.loadingComponents[componentName];
    }

    window.webit.ui.loadingComponents[componentName] = new Promise(function(resolve, reject) {
        var src = componentUrl(componentName);
        var script = document.createElement('script');
        script.src = src;
        script.defer = true;
        script.onload = function() {
            window.webit.ui.loadedComponents[componentName] = true;
            resolve();
        };
        script.onerror = function() {
            reject(new Error('Failed to load '+src));
        };
        document.head.appendChild(script);
    });

    return window.webit.ui.loadingComponents[componentName];
}

window.webit.ui.loadComponentScripts = function(root) {
    return collectComponentNames(root).reduce(function(promise, componentName) {
        return promise.then(function() {
            return loadComponentScript(componentName);
        });
    }, Promise.resolve());
};

window.webit.ui.loadSvgIcons = function(root) {
    var iconNames = collectSvgIconNames(root);
    var promises = [];
    var missingIconNames = [];

    iconNames.forEach(function(iconName) {
        if (document.getElementById(iconName) || window.webit.ui.loadedSvgIcons[iconName]) {
            return;
        }

        if (window.webit.ui.loadingSvgIcons[iconName]) {
            promises.push(window.webit.ui.loadingSvgIcons[iconName]);
            return;
        }

        missingIconNames.push(iconName);
    });

    if (!missingIconNames.length) {
        return Promise.all(promises);
    }

    var url = new URL(svgsUrl, window.location.origin);
    missingIconNames.forEach(function(iconName) {
        url.searchParams.append('icons[]', iconName);
    });

    var loadingPromise = fetch(url.toString())
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Failed to load SVG icons '+url.toString());
            }

            return response.text();
        })
        .then(function(svgsHtml) {
            var div = document.createElement('div');
            div.style.display = 'none';
            div.innerHTML = svgsHtml;
            document.body.append(div);

            missingIconNames.forEach(function(iconName) {
                window.webit.ui.loadedSvgIcons[iconName] = true;
            });
        });

    missingIconNames.forEach(function(iconName) {
        window.webit.ui.loadingSvgIcons[iconName] = loadingPromise;
    });

    promises.push(loadingPromise);

    return Promise.all(promises);
};

window.webit.ui.loadSvgIcons(document)
    .then(function() {
        return window.webit.ui.loadComponentScripts(document);
    })
    .catch(function(error) {
        console.error(error);
    });
