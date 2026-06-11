
function getImageDimensionsFromFile(file) {
    return new Promise((resolve, reject) => {
        let fr = new FileReader;

        fr.onload = function() {
            let img = new Image;

            img.onload = function() {
                resolve({
                    width: img.width,
                    height: img.height,
                    ratio: img.height / img.width,
                })
            };

            img.src = fr.result;
        };

        fr.readAsDataURL(file);
    })
}

export default getImageDimensionsFromFile