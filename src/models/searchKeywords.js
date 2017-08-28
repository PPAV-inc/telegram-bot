import getDatabase from './database';

const insertSearchKeyword = async (type, keyword) => {
  const db = await getDatabase();
  const now = new Date();

  await db
    .collection('search_keywords')
    .update(
      { type, keyword },
      { $inc: { count: 1 }, $set: { updated_at: now } },
      { upsert: true }
    );
};

export default insertSearchKeyword;