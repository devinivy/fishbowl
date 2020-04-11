'use strict';

module.exports = {
    method: 'post',
    path: '/games/{id}/begin',
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
                gameService: { begin, present }
            } = request.services();

            const { id } = request.params;
            const { credentials: { nickname } } = request.auth;

            const game = await transact((txn) => begin(id, null, txn));

            return present(game, nickname);
        }
    }
};
