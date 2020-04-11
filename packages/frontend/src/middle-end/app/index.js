const MiddleEnd = require('strange-middle-end');
const Client = require('./client');

module.exports = (m, { api }) => {

    const client = new Client(m, { api });

    const { CONNECT, DISCONNECT } = MiddleEnd.createTypes('app', {
        CONNECT: MiddleEnd.type.simple,
        DISCONNECT: MiddleEnd.type.simple
    });

    return {
        client,
        async initialize() {

            client.onConnect = m.dispatch.app.connect;
            client.onDisconnect = m.dispatch.app.disconnect;

            await client.connect();
        },
        actions: {
            connect: MiddleEnd.createAction(CONNECT),
            disconnect: MiddleEnd.createAction(DISCONNECT, (willReconnect) => ({ willReconnect }))
        },
        selectors: {
            connection: ({ app }) => app.connection
        },
        reducer: MiddleEnd.createReducer({ mutable: true }, {
            connection: 'connecting'
        }, {
            [CONNECT]: (draft) => {

                draft.connection = 'connected';
            },
            [DISCONNECT]: (draft, { payload: { willReconnect } }) => {

                draft.connection = willReconnect ? 'connecting' : 'disconnected';
            }
        })
    };
};
