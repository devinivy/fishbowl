'use strict';

const Bounce = require('@hapi/bounce');
const Toys = require('toys');
const Schmervice = require('schmervice');

module.exports = Schmervice.withName('turnTimerService', (server) => {

    const services = () => server.services();
    const on = (...args) => server.events.on(...args);
    const initialize = (...args) => server.ext(Toys.onPreStart(...args));
    const teardown = (...args) => server.ext(Toys.onPostStop(...args));

    initialize(async () => {

        const {
            gameService: { getAll },
            turnTimerService: {
                syncTurn,
                scheduleTurn
            }
        } = services();

        const games = await getAll();

        games.forEach(({ id, state: { turn } }) => {

            scheduleTurn(id, turn);
        });

        on('game-updated', ({ id, state: { turn } }) => {

            syncTurn(id, turn);
        });
    }, {
        after: 'schwifty'
    });

    teardown(() => {

        const {
            turnTimerService: {
                turns,
                unscheduleTurn
            }
        } = services();

        turns.forEach(unscheduleTurn);
    });

    const timers = {};

    return {
        turns() {

            return Object.keys(timers);
        },
        syncTurn(id, turn) {

            const {
                turnTimerService: {
                    scheduleTurn,
                    unscheduleTurn
                }
            } = services();

            if (!turn || turn.status !== 'in-progress') {
                return unscheduleTurn(id);
            }

            return scheduleTurn(id, turn);
        },
        scheduleTurn(id, turn) {

            if (id in timers || !turn || turn.status !== 'in-progress') {
                return;
            }

            const {
                db: { transact },
                gameService: { endTurn }
            } = services();

            const ms = Math.max(0, new Date(turn.end).getTime() - Date.now());

            timers[id] = setTimeout(async () => {

                delete timers[id];

                try {
                    await transact((txn) => endTurn(id, null, txn));
                }
                catch (err) {
                    Bounce.rethrow(err, 'system');
                }
            }, ms);
        },
        unscheduleTurn(id) {

            const timer = timers[id];

            if (timer) {
                delete timers[id];
                clearTimeout(timer);
            }
        }
    };
});
