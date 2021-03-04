FROM node:14.11.0-alpine

WORKDIR /usr/app

COPY package*.json ./
RUN npm install

COPY ./ ./

RUN npm run build

EXPOSE 3000

ENTRYPOINT node ./dist/main.js
