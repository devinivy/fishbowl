'use strict';

const Joi = require('@hapi/joi');

module.exports = {
    method: 'post',
    path: '/games/{id}/player-ready',
    options: {
        auth: {
            strategy: 'player',
            access: {
                scope: 'game-{params.id}'
            }
        },
        validate: {
            payload: Joi.object({
                words: Joi.array().items(Joi.string()).min(1)
            })
        },
        handler: async (request) => {

            const {
                db: { transact },
                gameService: { playerReady, present }
            } = request.services();

            const { id } = request.params;
            const { words } = request.payload;
            const { credentials: { nickname } } = request.auth;

            const game = await transact(playerReady(id, { nickname, words }));

            return present(game, nickname);
        }
    }
};
