'use strict';

module.exports = {
    method: 'get',
    path: '/ping',
    options: {
        handler: () => ({ ok: Date.now() })
    }
};
