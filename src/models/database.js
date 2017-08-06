import { MongoClient } from 'mongodb';
import path from 'path';

export const getConfig = env =>
  require(path.resolve(__dirname, `../../env/${env || 'development'}`)); // eslint-disable-line global-require

let _db;
const getDatabase = async () => {
  if (_db) {
    return _db;
  }

  const db = await MongoClient.connect(
    getConfig(process.env.NODE_ENV).mongodbPath
  );
  _db = db;
  return _db;
};

export default getDatabase;
