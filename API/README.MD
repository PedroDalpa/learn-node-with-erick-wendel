docker run \
--name postgres \
-e POSTGRES_USER=user \
-e POSTGRES_PASSWORD=admin \
-e POSTGRES_DB=heroes \
-p 5432:5432 \
-d \
postgres

 docker exec -it postgres /bin/bash

 docker run \
 --name adminer \
 -p 8080:8080 \
 --link postgres:postgres \
 -d \
 adminer

docker run \
--name mongodb \
-p 27017:27017 \
-e MONGO_INITDB_ROOT_USERNAME=user \
-e MONGO_INITDB_ROOT_PASSWORD=admin \
-d \
mongo


 docker run \
 --name mongoclient \
 -p 3000:3000 \
 --link mongodb:mongodb \
 -d \
 mongoclient/mongoclient

 docker exec -it mongodb \
 mongo --host localhost -u user -p admin --authenticationDatabase admin \
 -eval "db.getSiblingDB('heroes').createUser({user:'pedro', pwd:'12345', roles: [{role:'readWrite',db:'heroes'}]})"