import { getMongoDatabase, getElasticsearchDatabase } from '../database';

jest.mock('mongodb');
jest.mock('elasticsearch');

const { MongoClient } = require('mongodb');
const elasticsearch = require('elasticsearch');

elasticsearch.Client = jest.fn();

describe('getMongoDatabase', () => {
  it('should be defined', () => {
    expect(getMongoDatabase).toBeDefined();
  });

  it('should return _mongodb if called more than one time', async () => {
    MongoClient.connect.mockClear();
    MongoClient.connect.mockReturnValue({
      domain: null,
      s: {
        databaseName: 'PPAV',
        logger: { Logger: { className: 'Db' } },
      },
    });

    await getMongoDatabase();
    await getMongoDatabase();

    expect(MongoClient.connect).toHaveBeenCalledTimes(1);
  });

  it('should call MongoClient.connect with test MONGO_URL env', async () => {
    await getMongoDatabase();
    expect(MongoClient.connect).toBeCalledWith('TEST_MONGO_URL');
  });
});

describe('getElasticsearchDatabase', () => {
  it('should be defined', () => {
    expect(getElasticsearchDatabase).toBeDefined();
  });

  it('should return _elasticsearchdb if called more than one time', async () => {
    await getElasticsearchDatabase();
    await getElasticsearchDatabase();

    expect(elasticsearch.Client).toHaveBeenCalledTimes(1);
  });

  it('should call elasticsearch.Client with test elasticsearch env', async () => {
    await getElasticsearchDatabase();
    expect(elasticsearch.Client).toBeCalledWith({
      host: 'TEST_ELASTICSEARCH_URL',
      log: 'error',
    });
  });
});
