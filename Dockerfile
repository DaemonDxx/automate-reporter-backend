FROM node:14.11.0-alpine

WORKDIR /usr/src/backend

COPY ./ ./

RUN npm install

EXPOSE 3000

ENTRYPOINT npm run start:dev
