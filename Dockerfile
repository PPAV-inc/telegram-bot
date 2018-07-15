FROM node:10

WORKDIR /home/app

COPY ./.babelrc ./.babelrc
COPY ./bin ./bin
COPY ./src ./src
COPY ./env ./env
COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock

RUN yarn

EXPOSE 3000
CMD yarn run build \
    && yarn start
