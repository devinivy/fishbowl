'use strict';

module.exports = (server) => ({
    scheme: 'basic',
    options: {
        async validate(request, username, password) {

            // TODO consider auto-joining the game

            const { gameService: { getById } } = server.services();

            const nickname = username;
            const gameId = password;

            const game = await getById(gameId);

            return {
                isValid: nickname in game.state.players,
                credentials: { gameId, nickname }
            };
        }
    }
});
