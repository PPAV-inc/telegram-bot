import { MongoClient } from 'mongodb';

const config = require(`../../env/${process.env.NODE_ENV || 'development'}`);

const getDatabase = async () => {
  const db = await MongoClient.connect(config.mongodbPath);
  return db;
};

export default getDatabase;
