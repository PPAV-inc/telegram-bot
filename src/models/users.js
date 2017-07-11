import getDatabase from './database';

const createUser = async message => {
  const { id, first_name, last_name, language_code, username } = message.from;
  const user = {
    userId: id,
    firstName: first_name,
    lastName: last_name,
    username,
    acceptDisclaimer: false,
    languageCode: language_code,
    created_at: new Date(),
  };

  const db = await getDatabase();
  await db.collection('users').update({ userId: id }, user, { upsert: true });
};

const getUser = async userId => {
  const db = await getDatabase();
  await db.collection('users').findOne({ userId });
};

const updateUserLanguage = async (userId, languageCode) => {
  const db = await getDatabase();
  await db
    .collection('users')
    .update({ userId }, { $set: { languageCode } }, { upsert: true });
};

export { createUser, getUser, updateUserLanguage };
