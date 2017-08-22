import app from '../src/app';
import config from '../env/development';

app.listen(config.port, () => {
  console.log(`App is running on port ${config.port} !`); // eslint-disable-line no-console
});
