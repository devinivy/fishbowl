'use strict';

const Joi = require('@hapi/joi');

module.exports = {
    method: 'post',
    path: '/games/{id}/join',
    options: {
        validate: {
            payload: Joi.object({
                nickname: Joi.string().required()
            }),
        },
        handler: async (request) => {

            const {
                db: { transact },
                gameService: { join, present }
            } = request.services();

            const { id } = request.params;
            const { nickname } = request.payload;

            const game = await transact(join(id, { nickname }));

            return present(game, nickname);
        }
    }
};
