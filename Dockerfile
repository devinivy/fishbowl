# Based on hapi pal boilerplate's Dockerfile
FROM node:12-alpine AS base

# install any packages we need from apt here
RUN apk add --update dumb-init

# set entrypoint to `dumb-init` as it handles being pid 1 and forwarding signals
# so that you dont need to bake that logic into your node app
ENTRYPOINT ["dumb-init", "--"]

# all of our code will live in `/app`
WORKDIR /app

RUN npm i lerna -g

# using the base image, create an image containing all of our files
# and dependencies installed, devDeps and test directory included
FROM base AS dependencies

COPY ./packages/frontend/package*.json ./packages/frontend/
COPY ./packages/api/package*.json ./packages/api/
COPY ./packages/deployment/package*.json ./packages/deployment/
COPY ./package*.json ./
COPY lerna.json .

RUN lerna bootstrap

COPY ./packages/frontend ./packages/frontend
RUN API_URL=/api lerna run build --scope fishbowl-frontend
COPY ./packages/api ./packages/api
COPY ./packages/deployment ./packages/deployment

# prune non-prod dependencies, remove test files
RUN npm prune --production \
    && rm -rf ./packages/*/test

ENV PORT=3000
ENV NODE_ENV=production
ENV SQLITE_DB_FILE=/data/app.db

RUN mkdir /data && touch /data/app.db && chown -R node:node /data
VOLUME /data

# `node` user is created in base node image
# we want to use this non-root user for running the server in case of attack
# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#non-root-user
USER node

EXPOSE 3000
CMD ["lerna", "run", "start", "--stream", "--scope", "fishbowl-deployment"]
