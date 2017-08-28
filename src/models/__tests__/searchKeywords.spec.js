jest.mock('mongodb');
jest.mock('../database');

const getDatabase = require('../database').default;
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
    getDatabase.mockReturnValue({
      collection: jest.fn().mockReturnThis(),
    });
    getDatabase().collection.mockReturnValue({
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
    const type = 'code';
    const keyword = '123';
    const now = new Date();

    await insertSearchKeywords(type, keyword);

    expect(getDatabase).toBeCalled();
    expect(getDatabase().collection).toBeCalledWith('search_keywords');
    expect(getDatabase().collection().update).toBeCalledWith(
      { type, keyword },
      { $inc: { count: 1 }, $set: { updated_at: now } },
      { upsert: true }
    );
  });
});
