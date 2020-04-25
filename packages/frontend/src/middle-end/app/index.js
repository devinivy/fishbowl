const MiddleEnd = require('strange-middle-end');
const Timesync = require('timesync');
const Client = require('./client');
const Helpers = require('../helpers');

module.exports = (m, { api }) => {

    const client = new Client(m, { api });

    const {
        CONNECT,
        DISCONNECT,
        RECEIVE_TIME_OFFSET
    } = MiddleEnd.createTypes('app', {
        CONNECT: MiddleEnd.type.simple,
        DISCONNECT: MiddleEnd.type.simple,
        RECEIVE_TIME_OFFSET: MiddleEnd.type.simple
    });

    return {
        client,
        async initialize() {

            client.onConnect = m.dispatch.app.connect;
            client.onDisconnect = m.dispatch.app.disconnect;

            await client.connect();

            const ts = Timesync.create({
                peers: [client],
                interval: 20000
            });

            ts.send = async (peer, { id }, timeout) => {

                const { payload: data } = await Helpers.timeout(
                    timeout,
                    peer.request({
                        path: `/timesync?id=${encodeURIComponent(id)}`
                    })
                );

                ts.receive(peer, data);
            };

            ts.on('change', m.dispatch.app.receiveTimeOffset);
        },
        actions: {
            connect: MiddleEnd.createAction(CONNECT),
            disconnect: MiddleEnd.createAction(DISCONNECT, (willReconnect) => ({ willReconnect })),
            receiveTimeOffset: MiddleEnd.createAction(RECEIVE_TIME_OFFSET, (timeOffset) => ({ timeOffset }))
        },
        selectors: {
            connection: ({ app }) => app.connection,
            time: ({ app }, time = Date.now()) => time + app.timeOffset
        },
        reducer: MiddleEnd.createReducer({ mutable: true }, {
            timeOffset: 0,
            connection: 'connecting'
        }, {
            [CONNECT]: (draft) => {

                draft.connection = 'connected';
            },
            [DISCONNECT]: (draft, { payload: { willReconnect } }) => {

                draft.connection = willReconnect ? 'connecting' : 'disconnected';
            },
            [RECEIVE_TIME_OFFSET]: (draft, { payload: { timeOffset } }) => {

                draft.timeOffset = timeOffset;
            }
        })
    };
};
