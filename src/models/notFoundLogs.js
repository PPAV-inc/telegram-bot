import { getMongoDatabase } from './database';

const insertNotFoundLog = async keyword => {
  const db = await getMongoDatabase();
  const now = new Date();

  await db
    .collection('not_found_logs')
    .update(
      { keyword },
      { $inc: { count: 1 }, $set: { updated_at: now } },
      { upsert: true }
    );
};

export default insertNotFoundLog;
