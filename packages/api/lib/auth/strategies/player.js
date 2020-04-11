'use strict';

module.exports = (server) => ({
    scheme: 'basic',
    options: {
        async validate(_, username, password) {

            const { gameService: { getById, hasPlayer } } = server.services();

            const nickname = username;
            const gameId = password;

            const game = await getById(gameId);

            return {
                isValid: hasPlayer(game, nickname),
                credentials: {
                    gameId,
                    nickname
                }
            };
        }
    }
});
