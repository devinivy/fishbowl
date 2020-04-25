'use strict';

const Schwifty = require('schwifty');
const Joi = require('@hapi/joi');
const Shortid = require('shortid');

module.exports = class Game extends Schwifty.Model {

    static tableName = 'Games';

    static joiSchema = Joi.object({
        id: Joi.string().default(() => Shortid()),
        version: Joi.number().integer().min(0).required(),
        createdAt: Joi.alternatives(
            Joi.date().iso(),
            Joi.date().timestamp()
        ).default(() => new Date()),
        state: Joi.object().prefs({ presence: 'required' }).keys({
            status: Joi.allow('initialized', 'in-progress', 'finished'),
            words: Joi.array().items(Joi.string()),
            players: Joi.object().pattern(Joi.any(),
                Joi.object({
                    nickname: Joi.string(),
                    team: Joi.allow('a', 'b'),
                    status: Joi.allow('ready', 'not-ready')
                })
            ),
            playerOrder: Joi.array().items(Joi.string()),
            turn: Joi.object({
                status: Joi.allow('initialized', 'in-progress'),
                round: Joi.number().integer().min(0),
                go: Joi.number().integer().min(0),
                roundWords: Joi.array().items(Joi.string()),
                player: Joi.string(),
                lastPlayer: Joi.string().allow(null),
                word: Joi.string().allow(null),
                lastWord: Joi.string().allow(null),
                start: Joi.date().iso().allow(null),
                end: Joi.date().iso().allow(null)
            }).allow(null),
            score: Joi.object({
                team: Joi.object({
                    a: Joi.array().items(Joi.number().integer().min(0)),
                    b: Joi.array().items(Joi.number().integer().min(0))
                }),
                player: Joi.object().pattern(Joi.any(),
                    Joi.array().items(
                        Joi.array().items(Joi.number().integer().min(0))
                    )
                )
            })
        })
    });
};
