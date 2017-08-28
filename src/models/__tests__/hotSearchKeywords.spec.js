jest.mock('mongodb');
jest.mock('../database');

const getDatabase = require('../database').default;
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
    getDatabase.mockReturnValue({
      collection: jest.fn().mockReturnThis(),
    });
    getDatabase().collection.mockReturnValue({
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
    const type = 'code';
    const keyword = '123';
    const now = new Date();

    await insertHotSearchKeywords(type, keyword);

    expect(getDatabase).toBeCalled();
    expect(getDatabase().collection).toBeCalledWith('hot_search_keywords');
    expect(getDatabase().collection().insertOne).toBeCalledWith({
      type,
      keyword,
      created_at: now,
    });
  });
});
