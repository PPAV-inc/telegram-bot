require('babel-polyfill');
const app = require('../lib/app').default;
const config = require('../env/production');

app.listen(config.port);
