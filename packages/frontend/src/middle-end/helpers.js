exports.watch = ({ store }, selector, onChange) => {

    let lastValueRef = selector(store.getState());

    onChange(lastValueRef, lastValueRef);

    return store.subscribe(() => {

        const value = selector(store.getState());

        if (value !== lastValueRef) {
            const lastValue = lastValueRef;
            lastValueRef = value;
            onChange(value, lastValue);
        }
    });
};

exports.waitFor = (m, selector, { success }) => {

    success = [].concat(success);

    return new Promise((resolve) => {

        let complete = false;

        const unsubscribe = exports.watch(m, selector, (value, lastValue) => {

            if (success.includes(value)) {

                if (value !== lastValue) {
                    unsubscribe();
                }
                else {
                    complete = true;
                }

                return resolve(value);
            }
        });

        if (complete) {
            unsubscribe();
        }
    });
};

exports.timeout = async (ms, promise) => {

    if (!ms) {
        return await promise;
    }

    const { TimeoutError } = exports;

    const timeout = new Promise((_, reject) => {

        setTimeout(() => reject(new TimeoutError(`Timed-out after ${ms}ms.`)), ms);
    });

    // A lot of the time these will throw and be ignored
    // due to intentional usage with Promise.race().
    // TODO cancel before rejecting.
    timeout.catch(() => null);

    return await Promise.race([promise, timeout]);
};

exports.TimeoutError = class TimeoutError extends Error {};
