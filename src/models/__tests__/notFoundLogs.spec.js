jest.mock('mongodb');
jest.mock('../database');

const { getMongoDatabase } = require('../database');
const insertNotFoundLog = require('../notFoundLogs').default;

describe('insertNotFoundLog', () => {
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
    expect(insertNotFoundLog).toBeDefined();
  });

  it('should call update', async () => {
    const keyword = 'xxxyyyzzz';
    const now = new Date();

    await insertNotFoundLog(keyword);

    expect(getMongoDatabase).toBeCalled();
    expect(getMongoDatabase().collection).toBeCalledWith('not_found_logs');
    expect(getMongoDatabase().collection().update).toBeCalledWith(
      { keyword },
      { $inc: { count: 1 }, $set: { updated_at: now } },
      { upsert: true }
    );
  });
});
