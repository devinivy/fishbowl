'use strict';

module.exports = (server) => {

    server.events.on('game-updated', (game) => {

        server.publish(`/games/${game.id}`, game);
    });

    return {
        path: '/games/{id}',
        options: {
            auth: { mode: 'optional' },
            filter(_, game, { credentials, params: { id } }) {

                const { gameService: { present } } = server.services();
                const nickname = (credentials && credentials.gameId === id) ? credentials.nickname : null;

                return {
                    override: present(game, nickname)
                };
            }
        }
    };
};
