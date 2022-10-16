#!/usr/bin/env bash
docker build -t auth0-angular .
docker run --init -p 4200:4200
#docker run --init -p 4200:4200 -p 3001:3001 -it auth0-angular-sample
