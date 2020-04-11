exports.watch = ({ store }, selector, onChange) => {

    let lastValue = selector(store.getState());

    onChange(lastValue, lastValue);

    return store.subscribe((state) => {

        const value = selector(store.getState());

        if (value !== lastValue) {
            onChange(value, lastValue);
            lastValue = value;
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
