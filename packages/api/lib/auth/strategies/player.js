'use strict';

module.exports = {
    scheme: 'basic',
    options: {
        async validate(request, username, password) {

            const { gameService } = request.services();

            const nickname = username;
            const gameId = password;

            const game = await gameService.getById(gameId);

            return {
                isValid: nickname in game.players,
                credentials: { gameId, nickname }
            };
        }
    }
};
