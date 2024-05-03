function Listener() {
    this.listeners = [];
}
Listener.prototype = {
    listen(callback) {
        this.listeners.push(callback)
    },
    trigger(args) {
        this.listeners.forEach(cb => cb.apply(this, args))
    }
}

export default Listener