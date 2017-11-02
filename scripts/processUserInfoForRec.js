require('babel-register');

const { ObjectId } = require('mongodb');
const { getMongoDatabase } = require('../src/models/database');

async function main() {
  const db = await getMongoDatabase();

  let subscribedUsers = await db
    .collection('users')
    .find({ subscribe: true })
    .toArray();
  subscribedUsers = subscribedUsers.map(user => user.userId);

  const res = await db
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
          _id: new ObjectId(),
          userId: '$_id',
          models: 1,
        },
      },
    ])
    .toArray();

  await db.collection('rec_users').remove({});
  await db.collection('rec_users').insertMany(res);

  db.close();
}

main();
