const uniqueId = require('./unique-id');
const Component = require('./Component.jsx');
const instance = require('./instance');
const isString = require('./is-string');

let configs = [];
let queue = [];

const emptyQueue = () => {
    const inst = instance.get();
    if (!inst) { return; }

    if (configs.length) {
        configs.unshift(inst.state);
        inst.setState(Object.assign.apply(null, configs));

        // kill the configs
        configs.length = 0;
    }

    if (queue.length) {
        const toasts = inst.state.toasts;
        queue.forEach(toast => {
            toasts.push(
                Object.assign({}, inst.state, toast)
            );
        });

        inst.setState({ toasts });
        // empty the queue
        queue.length = 0;
    }
};

const pushToast = function(toast) {
    queue.push(toast);
    emptyQueue();
};

const generateToast = function(title, message, obj) {
    // if we have a title and it's not a string,
    // then we've been passed an object to use as a toast
    if (title && !isString(title)) {
        return pushToast(
            // if we've been passen an obj, then it's probably
            // from generateToastType and we want to include
            // the type
            obj ? Object.assign({}, title, obj) : title
        );
    }

    // standard: title, message, obj passing
    pushToast(
        Object.assign({
            title,
            message,
            id: uniqueId()
        }, obj)
    );
};

const generateToastType = function(typeStr) {
    const type = { type: typeStr };
    return (title, message, obj) => {
        generateToast(title, message, obj ? Object.assign({}, obj, type) : type);
    };
};

// when the instance mounts, the queue will be processed
instance.callback = emptyQueue;

module.exports = Object.assign(generateToast, {
    Component,

    config(opts) {
        configs.push(opts);
        emptyQueue();
    },

    warning: generateToastType('warning'),
    success: generateToastType('success'),
    error: generateToastType('danger'),
    info: generateToastType('info'),

    remove() {
        const inst = instance.get();
        // success! lol, they're already gone
        if (!inst) { return; }
        // otherwise, set the toasts to be empty
        inst.setState({ toasts: [] });
    }
});