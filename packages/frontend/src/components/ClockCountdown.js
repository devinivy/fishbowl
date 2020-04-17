const React = require('react');
const { useState, useEffect } = require('react');
const T = require('prop-types');
const { useTheme } = require('@material-ui/core/styles');
const { default: useUpdate } = require('react-use/lib/useUpdate');
const { default: useInterval } = require('react-use/lib/useInterval');
const ReactCountdownClock = require('react-countdown-clock');
const { useAppTime } = require('../containers/useAppTime');

module.exports = function ClockCountdown({ start, end, onEnd, ...others }) {

    const getTime = useAppTime();

    const computeSeconds = () => {

        const ms = Number(end) - Math.max(getTime(), Number(start));

        return Math.max(0, ms / 1000);
    };

    const theme = useTheme();
    const update = useUpdate();
    const [seconds, setSeconds] = useState(computeSeconds);
    const started = getTime() >= start;

    useInterval(update, [started ? null : 10]);

    useEffect(() => {

        setSeconds(computeSeconds);
    }, [Number(start), Number(end), started]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <ReactCountdownClock
            key={seconds}
            seconds={seconds}
            paused={!started || seconds === 0}
            font={theme.typography.fontFamily}
            onComplete={onEnd}
            {...others}
        />
    );
};

module.exports.propTypes = {
    end: T.instanceOf(Date).isRequired,
    start: T.instanceOf(Date).isRequired,
    onEnd: T.func
};
