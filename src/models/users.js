import { getMongoDatabase } from './database';

const createUser = async (message) => {
  const {
    id,
    first_name: firstName,
    last_name: lastName,
    language_code: languageCode,
    username,
  } = message.from;
  const user = {
    userId: id,
    firstName,
    lastName,
    username,
    acceptDisclaimer: false,
    autoDeleteMessages: false,
    languageCode,
    subscribe: false,
    subscribeHour: 22,
    created_at: new Date(),
  };

  const db = await getMongoDatabase();
  await db.collection('users').update({ userId: id }, user, { upsert: true });
  return user;
};

const getUser = async (userId) => {
  const db = await getMongoDatabase();
  const user = await db.collection('users').findOne({ userId });
  return user;
};

const updateUser = async (userId, field) => {
  const db = await getMongoDatabase();
  await db
    .collection('users')
    .update({ userId }, { $set: { ...field } }, { upsert: true });
};

export { createUser, getUser, updateUser };
