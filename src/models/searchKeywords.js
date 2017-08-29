import { getMongoDatabase } from './database';

const insertSearchKeyword = async keyword => {
  const db = await getMongoDatabase();
  const now = new Date();

  await db
    .collection('search_keywords')
    .update(
      { keyword },
      { $inc: { count: 1 }, $set: { updated_at: now } },
      { upsert: true }
    );
};

export default insertSearchKeyword;
