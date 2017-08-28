import { getMongoDatabase } from './database';

const insertHotSearchKeyword = async (type, keyword) => {
  const db = await getMongoDatabase();
  const now = new Date();

  // set expired time (7 days) to remove old document
  await db.collection('hot_search_keywords').insertOne({
    keyword,
    type,
    created_at: now,
  });
};

export default insertHotSearchKeyword;
