export default function(value) {
    if (typeof Array.isArray != 'undefined') {
        return Array.isArray(value);
    }

    return Object.prototype.toString.call(value) === '[object Array]';
}