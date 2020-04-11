'use strict';

module.exports = {
    method: 'get',
    path: '/games',
    options: {
        auth: {
            strategy: 'player',
            mode: 'optional'
        },
        handler: async (request) => {

            const { gameService: { getAll, present } } = request.services();
            const { credentials } = request.auth;

            const games = await getAll();

            return games.map((game) => {

                const nickname = (credentials && credentials.gameId === game.id) ? credentials.nickname : null;

                return present(game, nickname);
            });
        }
    }
};
