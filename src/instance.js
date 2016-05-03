let instance;

module.exports = {
    get() {
        return instance;
    },
    set(inst) {
        instance = inst;
        if (instance && this.callback) { this.callback(instance); }
    }
};