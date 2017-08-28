import { MongoClient } from 'mongodb';
import elasticsearch from 'elasticsearch';
import path from 'path';

export const getConfig = env =>
  require(path.resolve(__dirname, `../../env/${env || 'development'}`)); // eslint-disable-line global-require

let _mongodb;
let _elasticsearchdb;
const getMongoDatabase = async () => {
  if (_mongodb) {
    return _mongodb;
  }

  const db = await MongoClient.connect(
    getConfig(process.env.NODE_ENV).mongodbPath
  );
  _mongodb = db;
  return _mongodb;
};

const getElasticsearchDatabase = () => {
  if (_elasticsearchdb) {
    return _elasticsearchdb;
  }

  const db = new elasticsearch.Client({
    host: getConfig(process.env.NODE_ENV).elasticsearchUrl,
    log: 'error',
  });

  _elasticsearchdb = db;
  return _elasticsearchdb;
};

export { getMongoDatabase, getElasticsearchDatabase };
