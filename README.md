# PPAV Telegram Bot

## Install
```js
$ yarn
```

## Seed
```js
$ yarn run seed-setup
```  
edit `seed.json` in root folder  
```js
$ yarn run seed
```  


## Run
> Before run server, remember to create bot.config.js in **`/env`**  

`Development`
```js
$ yarn run dev
```  

`Production`
```js
$ yarn run start
```

## Dokcer
> Before docker run, remember to run ealsticsearch and mongo containers

### build
```js
$ docker build -t telegram-bot .
```

### Run
```js
$ docker run -p 3000:3000 -d --link elasticsearch:elasticsearch --link mongo:mongo --name telegram-bot --restart always telegram-bot:latest
```  
