'use strict';

module.exports = {
    method: 'post',
    path: '/games',
    options: {
        handler: async (request) => {

            const { gameService: { create, present } } = request.services();

            const game = await create();

            return present(game);
        }
    }
};
