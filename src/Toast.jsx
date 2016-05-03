const React = require('react');
const classnames = require('classnames');

module.exports = React.createClass({
    getInitialState() {
        return {
            active: false,
            fade: false
        };
    },

    componentDidMount() {
        this.timeouts = {};
        this.startClock();
        this.startIn();
        this.startFadeOut();
    },

    componentWillUnmount() {
        clearTimeout(this.timeouts.fade);
        clearTimeout(this.timeouts.clock);
    },

    startFadeOut() {
        const { nofade, fade } = this.props;
        if (nofade) { return; }
        this.timeouts.fade = setTimeout(() => {
            this.endFadeOut();
        }, fade);
    },
    endFadeOut() {
        this.setState({ fade: true });
    },
    startFadeIn() {
        clearTimeout(this.timeouts.fade);
        this.setState({ fade: false });
    },

    startClock() {
        const { persist, duration } = this.props;
        if (persist) { return; }
        this.timeouts.clock = setTimeout(() => {
            this.startOut();
        }, duration);
    },
    stopClock() {
        clearTimeout(this.timeouts.clock);
    },

    mouseover() {
        this.stopClock();
        this.startFadeIn();
    },
    mouseout() {
        this.startClock();
        this.startFadeOut();
    },

    startIn() {
        setTimeout(() => {
            this.endIn();
        }, 0);
    },
    endIn() {
        this.setState({ active: true });
    },

    startOut() {
        this.setState({ active: false });
        setTimeout(() => {
            this.endOut();
        }, 300);
    },
    endOut() {
        this.props.remove(this.props.id);
    },

    render() {
        const {
            fade,
            active
        } = this.state;

        const {
            type,
            className,
            title,
            message,
        } = this.props;

        return (
            <div className={
                    classnames('toasty', className, {
                        active,
                        fade
                    })
                }
                toasty-type={ type }
                onMouseOver={ this.mouseover }
                onMouseOut={ this.mouseout }
                onClick={ this.startOut }>

                {title ?
                <div className="toasty-title">
                    { title }
                </div>
                : undefined }

                {message ?
                <div className="toasty-message">
                    { message }
                </div>
                : undefined }
            </div>
        );
    }
});

// TODO: propTypes