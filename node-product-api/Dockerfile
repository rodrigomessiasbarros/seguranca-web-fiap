FROM node:14.17.4-alpine
EXPOSE 3001

WORKDIR /home/app

COPY . /home/app

ENV PATH /home/node_modules/bin:$PATH

RUN npm config set prefix "/home/node_modules" \
    && npm i \
    && npm i express \
    && npm i express-rate-limit \
    && npm i mysql2 \
    && npm i express-oauth2-jwt-bearer \
    && npm i -g nodemon

CMD nodemon app.js
