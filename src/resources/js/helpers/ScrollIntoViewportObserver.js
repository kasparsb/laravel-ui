
let observers = {};
let onScrollIntoViewportHandler = function(){}

let observerGroupName = 'scrollIntoViewport';
let observerGroupNameIsAlreadySet = observerGroupName+'IsSet';

function getOrCreateObserver(observerName) {

    if (typeof observers[observerName] == 'undefined') {
        observers[observerName] = new IntersectionObserver(
            entries => {
                entries.forEach(ev => {
                    if (ev.isIntersecting) {
                        onScrollIntoViewportHandler(ev.target)
                    }
                })
            },
            {
                root: null,
                rootMargin: '1000px 0px 1000px 0px',
            }
        )
    }

    return observers[observerName];
}

export default {
    setHandler(cb) {
        onScrollIntoViewportHandler = cb
    },
    observe(el) {
        if (observerGroupNameIsAlreadySet in el.dataset) {
            return;
        }

        /**
         * Jāuzliek pazīme, ka šis jau ir uzlikts uz observe
         * savādāk sanāk, kad nosubmitojas kāds no šiem, tad
         * atkārtoti ielasām jaunos uz observe un
         * šajā mirklī jau esošais atkārtoti tiek uzlikts uz observe
         */
        el.dataset[observerGroupNameIsAlreadySet] = '';

        getOrCreateObserver(observerGroupName).observe(el)
    },
    unobserve(el) {
        getOrCreateObserver(observerGroupName).unobserve(el)
    }
}