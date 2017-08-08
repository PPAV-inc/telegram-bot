import getDatabase, { getConfig } from '../database';

jest.mock('mongodb');

const { MongoClient } = require('mongodb');

describe('getDatabase', () => {
  it('should be defined', () => {
    expect(getDatabase).toBeDefined();
  });

  it('should require /env/development.js if process.env.NODE_ENV is null', async () => {
    const config = getConfig(null);
    expect(config.env).toBe('development');
  });

  it('should return _db if called more than one time', async () => {
    MongoClient.connect.mockClear();
    MongoClient.connect.mockReturnValue({
      domain: null,
      s: {
        databaseName: 'PPAV',
        logger: { Logger: { className: 'Db' } },
      },
    });

    await getDatabase();
    await getDatabase();

    expect(MongoClient.connect).toHaveBeenCalledTimes(1);
  });

  it("should call MongoClient.connect with getConfig('test').mongodbPath", async () => {
    await getDatabase();
    expect(MongoClient.connect).toBeCalledWith(getConfig('test').mongodbPath);
  });
});
