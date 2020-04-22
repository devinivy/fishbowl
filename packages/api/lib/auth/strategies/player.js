'use strict';

module.exports = (app) => ({
    scheme: 'basic',
    options: {
        async validate(_, username, password) {

            const { gameService: { getById, hasPlayer } } = app.services();

            const nickname = username;
            const gameId = password;

            const game = await getById(gameId);

            return {
                isValid: hasPlayer(game, nickname),
                credentials: {
                    gameId,
                    nickname,
                    scope: `game-${game.id}`
                }
            };
        }
    }
});
