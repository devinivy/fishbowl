'use strict';

const Boom = require('@hapi/boom');

module.exports = {
    method: 'post',
    path: '/games/{id}/begin-turn',
    options: {
        auth: {
            strategy: 'player',
            access: {
                scope: 'game-{params.id}'
            }
        },
        handler: async (request) => {

            const {
                db: { transact },
                gameService: {
                    currentPlayerTurn,
                    getById,
                    beginTurn,
                    present
                }
            } = request.services();

            const { id } = request.params;
            const { credentials: { nickname } } = request.auth;

            const game = await transact(async (txn) => {

                const initial = await getById(id, txn);

                if (currentPlayerTurn(initial) !== nickname) {
                    throw Boom.forbidden();
                }

                return await beginTurn(id, null, txn);
            });

            return present(game, nickname);
        }
    }
};
