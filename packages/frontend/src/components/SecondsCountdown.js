const { useState, useEffect } = require('react');
const { default: useInterval } = require('react-use/lib/useInterval');
const T = require('prop-types');

module.exports = function SecondsCountdown({ now, ends, onEnd }) {

    const computeSeconds = () => {

        const ms = Number(ends) - Number(now || new Date());

        return Math.max(0, Math.ceil(ms / 1000));
    };

    const [seconds, setSeconds] = useState(computeSeconds);

    useInterval(
        () => setSeconds(computeSeconds),
        seconds !== 0 ? 10 : null
    );

    useEffect(() => {

        if (seconds === 0 && onEnd) {
            onEnd();
        }
    }, [seconds, onEnd]);

    if (seconds === 0) {
        return null;
    }

    return seconds;
};

module.exports.propTypes = {
    now: T.instanceOf(Date),
    ends: T.instanceOf(Date).isRequired,
    onEnd: T.func
};
