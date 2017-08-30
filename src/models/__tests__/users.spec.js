jest.mock('mongodb');
jest.mock('../database');
jest.mock('../../bot/');

const { getMongoDatabase } = require('../database');
const { createUser, getUser, updateUser } = require('../users');

describe('createUser', () => {
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
      findOne: jest.fn(),
    });
  });

  afterEach(() => {
    // eslint-disable-next-line no-global-assign
    Date = defaultDate;
  });

  it('should be defined', () => {
    expect(createUser).toBeDefined();
  });

  it('should call update', async () => {
    const message = {
      message_id: 1,
      from: {
        id: 123,
        first_name: 'first_name',
        last_name: 'last_name',
        username: 'username',
        language_code: 'en-TW',
      },
      chat: {
        id: 321,
        first_name: 'first_name',
        last_name: 'last_name',
        username: 'username',
        type: 'private',
      },
      date: 1501779605,
      text: '111',
    };

    const { id, first_name, last_name, language_code, username } = message.from;

    const user = {
      userId: id,
      firstName: first_name,
      lastName: last_name,
      username,
      acceptDisclaimer: false,
      autoDeleteMessages: false,
      languageCode: language_code,
      created_at: new Date(),
    };

    await createUser(message);

    expect(getMongoDatabase).toBeCalled();
    expect(getMongoDatabase().collection).toBeCalledWith('users');
    expect(getMongoDatabase().collection().update).toBeCalledWith(
      { userId: id },
      user,
      { upsert: true }
    );
  });
});

describe('getUser', () => {
  it('should be defined', () => {
    expect(getUser).toBeDefined();
  });

  it('should call findOne', async () => {
    const userId = 123;
    await getUser(userId);
    expect(getMongoDatabase).toBeCalled();
    expect(getMongoDatabase().collection).toBeCalledWith('users');
    expect(getMongoDatabase().collection().findOne).toBeCalledWith({ userId });
  });
});

describe('updateUser', () => {
  it('should be defined', () => {
    expect(updateUser).toBeDefined();
  });

  it('should call findOne', async () => {
    const userId = 123;
    const field = 'field';
    await updateUser(userId, field);
    expect(getMongoDatabase).toBeCalled();
    expect(getMongoDatabase().collection).toBeCalledWith('users');
    expect(getMongoDatabase().collection().update).toBeCalledWith(
      { userId },
      { $set: { ...field } },
      { upsert: true }
    );
  });
});
