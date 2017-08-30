jest.mock('mongodb');
jest.mock('../database');

const { getMongoDatabase } = require('../database');
const insertSearchKeywords = require('../searchKeywords').default;

describe('insertSearchKeywords', () => {
  let defaultDate;
  beforeEach(() => {
    defaultDate = Date;
    const constantDate = new Date('2017-06-13T04:41:20');
    // eslint-disable-next-line no-global-assign
    Date = class extends Date {
      constructor() {
        super();
        return constantDate;
      }
    };
    getMongoDatabase.mockReturnValue({
      collection: jest.fn().mockReturnThis(),
    });
    getMongoDatabase().collection.mockReturnValue({
      update: jest.fn(),
      insertOne: jest.fn(),
      createIndex: jest.fn(),
    });
  });

  afterEach(() => {
    // eslint-disable-next-line no-global-assign
    Date = defaultDate;
  });

  it('should be defined', () => {
    expect(insertSearchKeywords).toBeDefined();
  });

  it('should call update', async () => {
    const keyword = '123';
    const now = new Date();

    await insertSearchKeywords(keyword);

    expect(getMongoDatabase).toBeCalled();
    expect(getMongoDatabase().collection).toBeCalledWith('search_keywords');
    expect(getMongoDatabase().collection().update).toBeCalledWith(
      { keyword },
      { $inc: { count: 1 }, $set: { updated_at: now } },
      { upsert: true }
    );
  });
});
