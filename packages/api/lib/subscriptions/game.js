'use strict';

module.exports = (server) => {

    server.events.on('game-updated', (game) => {

        server.publish(`/game/${game.id}`, game);
    });

    return {
        path: '/game/{id}',
        options: {
            auth: { mode: 'optional' },
            filter(game, { credentials, params: { id } }) {

                const { gameService: { present } } = server.services();
                const nickname = (credentials && credentials.gameId === id) ? credentials.nickname : null;

                return {
                    override: present(game, nickname)
                };
            }
        }
    };
};
