require('babel-register');

require('dotenv').config();

const app = require('../lib/app').default;
const config = require('../env/production');

app.listen(config.port, () => {
  console.log(`App is running on port ${config.port} !`); // eslint-disable-line no-console
});
