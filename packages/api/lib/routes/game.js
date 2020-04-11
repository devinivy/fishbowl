'use strict';

module.exports = {
    method: 'get',
    path: '/games/{id}',
    options: {
        auth: {
            strategy: 'player',
            mode: 'optional'
        },
        handler: async (request) => {

            const { gameService: { getById, present } } = request.services();
            const { id } = request.params;
            const { credentials } = request.auth;

            const game = await getById(id);
            const nickname = (credentials && credentials.gameId === id) ? credentials.nickname : null;

            return present(game, nickname);
        }
    }
};
