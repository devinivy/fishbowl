'use strict';

module.exports = (app) => {

    app.events.on('game-updated', (game) => {

        app.publish(`/games/${game.id}`, game);
    });

    return {
        path: '/games/{id}',
        options: {
            auth: { mode: 'optional' },
            filter(_, game, { credentials, params: { id } }) {

                const { gameService: { present } } = app.services();
                const nickname = (credentials && credentials.gameId === id) ? credentials.nickname : null;

                return {
                    override: present(game, nickname)
                };
            }
        }
    };
};
