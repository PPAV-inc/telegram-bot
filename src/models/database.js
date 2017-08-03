import { MongoClient } from 'mongodb';
import path from 'path';

const config = require(path.resolve(
  __dirname,
  `../../env/${process.env.NODE_ENV || 'development'}`
));

let _db;
const getDatabase = async () => {
  if (_db) {
    return _db;
  }

  const db = await MongoClient.connect(config.mongodbPath);
  _db = db;
  return _db;
};

export default getDatabase;
