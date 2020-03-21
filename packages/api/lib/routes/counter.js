'use strict';

module.exports = {
    method: 'get',
    path: '/counter',
    options: {
        handler: async (request) => {

            const { Counter } = request.models();

            const counter = await Counter.query().first();

            if (!counter) {
                const { count } = await Counter.query().insert({ count: 0 }).returning('*');
                return { count };
            }

            const { count } = await Counter.query().increment('count', 1).first().returning('*');
            return { count };
        }
    }
};
