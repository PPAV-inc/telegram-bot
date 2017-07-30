import getDatabase from './database';

const createUser = async message => {
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

  const db = await getDatabase();
  await db.collection('users').update({ userId: id }, user, { upsert: true });
};

const getUser = async userId => {
  const db = await getDatabase();
  const user = await db.collection('users').findOne({ userId });
  return user;
};

const updateUser = async (userId, field) => {
  const db = await getDatabase();
  await db
    .collection('users')
    .update({ userId }, { $set: { ...field } }, { upsert: true });
};

export { createUser, getUser, updateUser };
