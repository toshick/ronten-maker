FROM node:10.13-alpine

WORKDIR /app

RUN apk --update add pcre-dev openssl-dev \
 && apk add --virtual build-dependencies build-base curl

COPY gateway ./gateway
COPY src ./src
COPY generate.sh ./generate.sh
COPY package*.json ./
COPY tsconfig.json ./tsconfig.json
COPY webpack.config.js ./webpack.config.js

RUN ls
RUN npm install 
RUN npm rebuild

EXPOSE 50051

CMD [ "npm", "run", "server" ]
