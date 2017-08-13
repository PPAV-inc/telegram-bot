import getDatabase from './database';

const saveSearchInfo = async (type, keyword) => {
  const db = await getDatabase();
  const now = new Date();

  await db
    .collection('search_keywords')
    .update(
      { type, keyword },
      { $inc: { count: 1 }, $set: { updated_at: now } },
      { upsert: true }
    );

  await db.collection('hot_search_keywords').insertOne({
    keyword,
    type,
    created_at: now,
  });
};

export default saveSearchInfo;
