import { MongoClient } from 'mongodb';
import elasticsearch from 'elasticsearch';

let _mongodb;
let _elasticsearchdb;

const getMongoDatabase = async () => {
  if (_mongodb) {
    return _mongodb;
  }

  const db = await MongoClient.connect(process.env.MONGO_URL);
  _mongodb = db;

  return _mongodb;
};

const getElasticsearchDatabase = () => {
  if (_elasticsearchdb) {
    return _elasticsearchdb;
  }

  const db = new elasticsearch.Client({
    host: process.env.ELASTICSEARCH_URL,
    log: 'error',
  });
  _elasticsearchdb = db;

  return _elasticsearchdb;
};

export { getMongoDatabase, getElasticsearchDatabase };
