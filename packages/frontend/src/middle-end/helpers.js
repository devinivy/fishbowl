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
