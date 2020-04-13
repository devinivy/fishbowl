const { useState, useCallback, useEffect } = require('react');
const { default: useTimeoutFn } = require('react-use/lib/useTimeoutFn');

exports.useFlasher = function useFlasher(value, ms = 1000) {

    const [show, setShow] = useState(false);
    const [, clearTimeoutFn, reset] = useTimeoutFn(() => setShow(false), ms);

    useEffect(() => {

        if (value) {
            setShow(true);
            reset();
        }
    }, [value, reset]);

    const clear = useCallback(() => {

        setShow(false);
        clearTimeoutFn();
    }, [clearTimeoutFn]);

    return [show, clear];
};
