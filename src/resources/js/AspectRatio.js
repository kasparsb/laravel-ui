function calcPaddingBottom(ratio) {
    // Padota malu attiecība kā number
    if (!isNaN(ratio)) {
        return `${ratio * 100}%`;
    }

    let delimiters = [':', '/', 'x', '*'];
    for (let delimiter of delimiters) {
        let parts = ratio.split(delimiter);
        if (parts.length > 1) {
            return `${(parseFloat(parts[1]) / parseFloat(parts[0])) * 100}%`;
        }
    }
}

export default {
    setRatio(aspectRatioEl, ratio) {
        aspectRatioEl.style.paddingBottom = calcPaddingBottom(ratio);
    },
    setRatioFromDimensions(aspectRatioEl, {width, height}) {
        aspectRatioEl.style.paddingBottom = calcPaddingBottom(height / width);
    }
}