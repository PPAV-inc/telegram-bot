jest.mock('mongodb');
jest.mock('../database');

const { getMongoDatabase } = require('../database');
const insertHotSearchKeywords = require('../hotSearchKeywords').default;

describe('insertHotSearchKeywords', () => {
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
    });
  });

  afterEach(() => {
    // eslint-disable-next-line no-global-assign
    Date = defaultDate;
  });

  it('should be defined', () => {
    expect(insertHotSearchKeywords).toBeDefined();
  });

  it('should call insertOne', async () => {
    const keyword = '123';
    const user = {
      userId: '666',
    };
    const now = new Date();

    await insertHotSearchKeywords(keyword, user);

    expect(getMongoDatabase).toBeCalled();
    expect(getMongoDatabase().collection).toBeCalledWith('hot_search_keywords');
    expect(getMongoDatabase().collection().insertOne).toBeCalledWith({
      keyword,
      created_at: now,
      userId: user.userId,
    });
  });
});
