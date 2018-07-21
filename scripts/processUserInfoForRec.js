require('babel-register');

const subDays = require('date-fns/sub_days');

const { getMongoDatabase } = require('../src/models/database');

let db;

async function main() {
  db = await getMongoDatabase();

  let subscribedUsers = await db
    .collection('users')
    .find({ subscribe: true })
    .toArray();

  // FIXME: userId in logs should be int not string
  subscribedUsers = subscribedUsers.map(user => user.userId.toString());

  const recUsers = await db
    .collection('logs')
    .aggregate(
      [
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
      ],
      { allowDiskUse: true }
    )
    .toArray();

  if (recUsers.length > 0) {
    await db.collection('rec_users').remove({});
    await db.collection('rec_users').insertMany(recUsers);
  }

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

  if (recVideos.length > 0) {
    await db.collection('rec_videos').remove({});
    await db.collection('rec_videos').insertMany(recVideos);
  }
}

main()
  .catch(console.error)
  .then(() => db.close());
