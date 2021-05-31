FROM node:10-alpine

RUN apk update && apk add make git apk add python make gcc linux-headers libc-dev g++ musl-dev

WORKDIR /usr/app

ENV USER=nodeusr
RUN addgroup --gid 1001 "$USER"
RUN adduser -HD --g "" -h "$(pwd)" -G "$USER" --u 1001 "$USER"
RUN chown -R "$USER:$USER" .
USER "$USER"

COPY --chown="$USER:$USER" package.json .
COPY --chown="$USER:$USER" yarn.lock .
COPY --chown="$USER:$USER" Makefile .
COPY --chown="$USER:$USER" make make
COPY --chown="$USER:$USER" lib lib
RUN mkdir -p ./.cache/yarn
RUN make node_modules

COPY --chown="$USER:$USER" . .
RUN make build

ENTRYPOINT ["node", "dist/src/index.js"]
