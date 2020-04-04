const { useState, useEffect } = require('react');
const { default: useQueue } = require('react-use/lib/useQueue');
const { default: useTimeoutFn } = require('react-use/lib/useTimeoutFn');

exports.useFlasher = function useFlasher(value, ms = 1000) {

    const [show, setShow] = useState(false);
    const { add, remove, first } = useQueue();
    const [, , reset] = useTimeoutFn(() => {

        setShow(false);
        remove();
    }, ms);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => add(value), [value]);

    useEffect(() => {

        if (first) {
            setShow(true);
            reset();
        }
    }, [first]); // eslint-disable-line react-hooks/exhaustive-deps

    return show;
};
