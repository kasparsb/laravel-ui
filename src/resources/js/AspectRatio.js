function calcPaddingBottom(ratio) {
    // Padota malu attiecība kā number
    if (!isNaN(ratio)) {
        return `${ratio * 100}%`;
    }

    let ar = validateAspectRatio(ratio);
    if (ar) {
        return `${(ar.y / ar.x) * 100}%`;
    }
}

function validateAspectRatio(ratio) {
    let delimiters = [':', '/', 'x', '*'];
    for (let delimiter of delimiters) {
        let parts = ratio.split(delimiter);
        if (parts.length > 1) {
            return {
                x: parseFloat(parts[0]),
                y: parseFloat(parts[1])
            }
        }
    }
}

export default {
    init() {

    },
    setRatio(aspectRatioEl, ratio) {
        let ar = validateAspectRatio(ratio)
        aspectRatioEl.style.aspectRatio = ar ? ar.x+'/'+ar.y : '';
    },
    setRatioFromDimensions(aspectRatioEl, {width, height}) {
        aspectRatioEl.style.aspectRatio = width+'/'+height;
    }
}