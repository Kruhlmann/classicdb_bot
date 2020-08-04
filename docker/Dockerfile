FROM node:10-alpine

RUN apk update && apk add python make gcc linux-headers libc-dev g++ musl-dev git
WORKDIR /usr/app
COPY . .
RUN rm -rf node_modules
RUN npm install
