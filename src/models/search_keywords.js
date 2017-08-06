import getDatabase from './database';

const saveSearchInfo = async (type, keyword) => {
  const db = await getDatabase();

  await db
    .collection('search_keywords')
    .update(
      { type, keyword },
      { $inc: { count: 1 }, $set: { updated_at: new Date() } },
      { upsert: true }
    );
};

export default saveSearchInfo;
