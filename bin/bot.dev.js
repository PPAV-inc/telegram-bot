require('babel-register');

require('dotenv').config();

const app = require('../src/app').default;
const config = require('../env/development');

app.listen(config.port, () => {
  console.log(`App is running on port ${config.port} !`); // eslint-disable-line no-console
});
