docker build -t angular-spa .
docker run --init -p 4200:4200 -it angular-spa