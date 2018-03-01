require('babel-register');

const subDays = require('date-fns/sub_days');

const { getMongoDatabase } = require('../src/models/database');

async function main() {
  const db = await getMongoDatabase();

  let subscribedUsers = await db
    .collection('users')
    .find({ subscribe: true })
    .toArray();
  subscribedUsers = subscribedUsers.map(user => user.userId);

  const recUsers = await db
    .collection('logs')
    .aggregate([
      { $match: { userId: { $in: subscribedUsers } } },
      {
        $lookup: {
          from: 'videos',
          localField: 'videoId',
          foreignField: '_id',
          as: 'info',
        },
      },
      { $unwind: '$info' },
      { $unwind: '$info.models' },
      {
        $group: {
          _id: {
            userId: '$userId',
            model: '$info.models',
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.userId',
          models: {
            $push: {
              model: '$_id.model',
              count: '$count',
            },
          },
        },
      },
      {
        $project: {
          userId: '$_id',
          models: 1,
          updatedAt: new Date(),
        },
      },
    ])
    .toArray();

  await db.collection('rec_users').remove({});
  await db.collection('rec_users').insertMany(recUsers);

  const oneDaysBefore = subDays(new Date(), 1);

  const recVideos = await db
    .collection('videos')
    .aggregate([
      {
        $match: {
          updated_at: { $gte: oneDaysBefore },
          $or: [
            {
              'videos.1': { $exists: true },
            },
            { 'videos.source': { $ne: 'iavtv' } },
          ],
        },
      },
    ])
    .toArray();

  await db.collection('rec_videos').remove({});
  await db.collection('rec_videos').insertMany(recVideos);

  await db.close();
}

main();
