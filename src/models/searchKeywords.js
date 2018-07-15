import subDays from 'date-fns/sub_days';
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

const getSearchKeywords = async () => {
  const db = await getMongoDatabase();
  const oneMonthBefore = subDays(new Date(), 30);

  const keywords = await db
    .collection('search_keywords')
    .aggregate([
      { $match: { updated_at: { $gte: oneMonthBefore } } },
      { $sort: { count: -1 } },
      { $limit: 50 },
      { $sample: { size: 5 } },
    ])
    .toArray();

  return keywords.map(arr => arr.keyword);
};

export { insertSearchKeyword, getSearchKeywords };
