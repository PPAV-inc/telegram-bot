import { getMongoDatabase } from './database';

const insertHotSearchKeyword = async (keyword, user) => {
  const db = await getMongoDatabase();
  const now = new Date();

  // set expired time (7 days) to remove old document
  await db.collection('hot_search_keywords').insertOne({
    keyword,
    created_at: now,
    userId: user.userId,
  });
};

export default insertHotSearchKeyword;
