require('@babel/register');

require('dotenv').config();

const app = require('../src/app').default;

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`App is running on port ${port} !`);
});
