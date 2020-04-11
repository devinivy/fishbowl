const { useEffect } = require('react');
const { default: useError } = require('react-use/lib/useError');

module.exports = function BadImplementation() {

    const dispatchError = useError();

    useEffect(() => {

        dispatchError(new Error('Bad implementation'));
    }, [dispatchError]);

    return null;
};
