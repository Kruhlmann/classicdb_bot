FROM node:18 as base_image
RUN apt update \
    && apt-get install -y --no-install-recommends make git \
    && npm install --global pnpm
WORKDIR /usr/app
COPY Makefile .
COPY package.json .
COPY pnpm-lock.yaml .

FROM base_image as build_image
COPY tsconfig.json .
COPY src ./src
RUN mkdir -p ./.cache/pnpm
RUN INSTALL_FLAGS="--frozen-lockfile --reporter=silent" make

FROM base_image as production_image
COPY --from=build_image /usr/app/dist ./dist
RUN INSTALL_FLAGS="--production --frozen-lockfile --reporter=silent" make node_modules
ENTRYPOINT ["node", "dist/index.js"]
