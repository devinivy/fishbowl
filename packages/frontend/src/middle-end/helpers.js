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

    const result = await Promise.race([promise, timeout]);

    timeout.catch(() => null);

    return result;
};

exports.TimeoutError = class TimeoutError extends Error {};
