'use strict';

module.exports = {
    method: 'get',
    path: '/games',
    options: {
        handler: async (request) => {

            const { gameService: { getAll, present } } = request.services();

            const games = await getAll();

            return games.map((game) => present(game));
        }
    }
};
