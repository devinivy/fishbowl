const { useMiddleEnd } = require('../middle-end/react');

exports.useAppTime = function useAppTime() {

    const m = useMiddleEnd();

    return m ? m.select.app.time : Date.now;
};
