FROM node:14.17.4-alpine

WORKDIR /home/app/

RUN mkdir -p /home/app


COPY . /home/app
COPY package.json .
COPY package-lock.json .
COPY ./server.js .
COPY ./auth_config.json .

ENV PATH /home/app/node_modules/bin:$PATH

RUN apk update && apk add git

RUN npm install
RUN npm install -g @angular/cli


ENV NODE_ENV=dev
ENV SERVER_PORT=4200

EXPOSE 4200

CMD ng serve
