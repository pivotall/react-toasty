const React = require('react');
const Toast = require('./Toast.jsx');
const instance = require('./instance');

const remove = function(id) {
    const inst = instance.instance;
    if (!inst) { return; }

    const toasts = inst.state.toasts;
    inst.setState({ toasts: toasts.filter(item => item.id !== id) });
};

const generateToast = toast => <Toast {...toast} remove={ remove } key={ toast.id } />;

module.exports = React.createClass({
    getInitialState() {
        return {
            toasts: [],
            position: 'top-right',
            type: '',
            className: '',
            title: '',
            message: '',
            fade: 5 * 1000,
            duration: 15 * 1000,
            nofade: false,
            persist: false
        };
    },

    componentWillMount() {
        instance.set(this);
    },
    componentWillUnmount() {
        instance.set();
    },

    render() {
        const {
            toasts,
            position
        } = this.state;

        return (
            <div className="toasty-er" toasty-mounting={ position }>
                { toasts.map(generateToast) }
            </div>
        );
    }
});