const { schema: { Entity }, ...Normalizr } = require('normalizr');
const MiddleEnd = require('strange-middle-end');

module.exports = (m) => {

    const {
        GET_GAMES,
        CREATE_GAME,
        SUBSCRIBE_GAME,
        UNSUBSCRIBE_GAME,
        SUBSCRIPTION_GAME_UPDATE,
        JOIN_GAME,
        PLAYER_READY,
        BEGIN_GAME,
        END_GAME,
        BEGIN_TURN,
        CLAIM_WORD
    } = MiddleEnd.createTypes('app', {
        GET_GAMES: MiddleEnd.type.async,
        CREATE_GAME: MiddleEnd.type.async,
        SUBSCRIBE_GAME: MiddleEnd.type.async,
        UNSUBSCRIBE_GAME: MiddleEnd.type.async,
        SUBSCRIPTION_GAME_UPDATE: MiddleEnd.type.simple,
        JOIN_GAME: MiddleEnd.type.async,
        PLAYER_READY: MiddleEnd.type.async,
        BEGIN_GAME: MiddleEnd.type.async,
        END_GAME: MiddleEnd.type.async,
        BEGIN_TURN: MiddleEnd.type.async,
        CLAIM_WORD: MiddleEnd.type.async
    });

    const schema = {
        game: new Entity('games', {}, {
            processStrategy: ({ createdAt, turn, ...game }) => ({
                ...game,
                createdAt: new Date(createdAt),
                turn: turn && {
                    ...turn,
                    start: turn.start && new Date(turn.start),
                    end: turn.end && new Date(turn.end)
                }
            })
        })
    };

    return {
        actions: {
            getGames: MiddleEnd.createAction(GET_GAMES, {
                index: true,
                schema: [schema.game],
                async handler() {

                    const { client } = m.mods.app;
                    const { payload: game } = await client.request('games');

                    return game;
                }
            }),
            subscribeGame: MiddleEnd.createAction(SUBSCRIBE_GAME, {
                index: SUBSCRIBE_GAME.BASE,
                schema: {
                    game: schema.game
                },
                async handler(id) {

                    const { client } = m.mods.app;
                    const { payload: game } = await client.request(`/games/${id}`);

                    await client.subscribe(`/games/${id}`, m.dispatch.model.subscriptionGameUpdate);

                    return {
                        game,
                        nickname: null
                    };
                }
            }),
            unsubscribeGame: MiddleEnd.createAction(UNSUBSCRIBE_GAME, {
                index: SUBSCRIBE_GAME.BASE,
                async handler() {

                    const { client } = m.mods.app;
                    const subscription = m.select.model.gameSubscription();

                    if (subscription) {
                        await client.unsubscribe(`/games/${subscription.game}`, m.dispatch.model.subscriptionGameUpdate);
                    }

                    return null;
                }
            }),
            joinGame: MiddleEnd.createAction(JOIN_GAME, {
                index: SUBSCRIBE_GAME.BASE,
                schema: {
                    game: schema.game
                },
                async handler({ nickname }) {

                    const { client } = m.mods.app;
                    const subscription = m.select.model.gameSubscription();

                    if (!subscription) {
                        throw new Error('Cannot join game, as there is not an active game subscription.');
                    }

                    const { game: id } = subscription;

                    const { payload: game } = await client.request({
                        method: 'post',
                        path: `/games/${id}/join`,
                        payload: { nickname }
                    });

                    await client.reauthenticate({
                        headers: {
                            authorization: 'Basic ' + btoa(`${nickname}:${id}`)
                        }
                    });

                    return {
                        game,
                        nickname
                    };
                }
            }),
            playerReady: MiddleEnd.createAction(PLAYER_READY, {
                async handler({ words }) {

                    const { client } = m.mods.app;
                    const subscription = m.select.model.gameSubscription();

                    if (!subscription) {
                        throw new Error('Cannot make player ready, as there is not an active game subscription.');
                    }

                    const { game: id } = subscription;

                    await client.request({
                        method: 'post',
                        path: `/games/${id}/player-ready`,
                        payload: { words }
                    });
                }
            }),
            beginGame: MiddleEnd.createAction(BEGIN_GAME, {
                async handler() {

                    const { client } = m.mods.app;
                    const subscription = m.select.model.gameSubscription();

                    if (!subscription) {
                        throw new Error('Cannot begin game, as there is not an active game subscription.');
                    }

                    const { game: id } = subscription;

                    await client.request({
                        method: 'post',
                        path: `/games/${id}/begin`
                    });
                }
            }),
            endGame: MiddleEnd.createAction(END_GAME, {
                async handler() {

                    const { client } = m.mods.app;
                    const subscription = m.select.model.gameSubscription();

                    if (!subscription) {
                        throw new Error('Cannot end game, as there is not an active game subscription.');
                    }

                    const { game: id } = subscription;

                    await client.request({
                        method: 'post',
                        path: `/games/${id}/end`
                    });
                }
            }),
            beginTurn: MiddleEnd.createAction(BEGIN_TURN, {
                async handler() {

                    const { client } = m.mods.app;
                    const subscription = m.select.model.gameSubscription();

                    if (!subscription) {
                        throw new Error('Cannot start turn, as there is not an active game subscription.');
                    }

                    const { game: id } = subscription;

                    await client.request({
                        method: 'post',
                        path: `/games/${id}/begin-turn`
                    });
                }
            }),
            claimWord: MiddleEnd.createAction(CLAIM_WORD, {
                async handler() {

                    const { client } = m.mods.app;
                    const subscription = m.select.model.gameSubscription();

                    if (!subscription) {
                        throw new Error('Cannot claim word, as there is not an active game subscription.');
                    }

                    const { game: id } = subscription;

                    await client.request({
                        method: 'post',
                        path: `/games/${id}/claim-word`
                    });
                }
            }),
            subscriptionGameUpdate: MiddleEnd.createAction(SUBSCRIPTION_GAME_UPDATE, (game) => {

                const subscription = m.select.model.gameSubscription();
                const expected = {
                    game: game.id,
                    nickname: game.me && game.me.nickname || null
                };

                if (!subscription ||
                    subscription.game !== expected.game ||
                    subscription.nickname !== expected.nickname) {
                    // Ignore data out of date with our subscription
                    return null;
                }

                return Normalizr.normalize(game, schema.game);
            }),
            createGame: MiddleEnd.createAction(CREATE_GAME, {
                schema: schema.game,
                async handler() {

                    const { client } = m.mods.app;
                    const { payload: game } = await client.request('game-create');

                    return game;
                },
                after() {

                    m.dispatch.model.getGames();
                }
            })
        },
        selectors: {
            games({ model }) {

                const { [GET_GAMES.BASE]: index = {} } = model.indexes;
                const { result = [] } = index;

                return result.map((id) => m.selectors.model.gameById({ model }, id));
            },
            gameById({ model }, id) {

                const { [id]: game } = model.entities.games;

                return game || null;
            },
            gameSubscription({ model }) {

                const { [SUBSCRIBE_GAME.BASE]: index = {} } = model.indexes;
                const { result = null } = index;

                return result;
            }
        },
        reducer: MiddleEnd.createEntityReducer({ schema })
    };
};
