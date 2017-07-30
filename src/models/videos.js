import { ObjectId } from 'mongodb';
import getDatabase from './database';

const escapeRegex = text => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

const getVideo = async (type, messageText, page) => {
  const keyword = escapeRegex(messageText);
  const query = {};

  if (type === 'models') {
    query[type] = {
      $in: [new RegExp(keyword, 'gi')],
    };
  } else {
    query[type] = {
      $regex: keyword,
      $options: 'gi',
    };
  }

  const db = await getDatabase();
  const results = await db
    .collection('videos')
    .aggregate([
      { $match: query },
      {
        $group: {
          _id: '$code',
          title: { $first: '$title' },
          models: { $first: '$models' },
          img_url: { $first: '$img_url' },
          code: { $first: '$code' },
          tags: { $first: '$tags' },
          duration: { $first: '$duration' },
          total_view_count: { $sum: 'view_count' },
          videos: {
            $push: {
              source: '$source',
              url: '$url',
              view_count: '$view_count',
            },
          },
        },
      },
      { $sort: { total_view_count: -1 } },
    ])
    .toArray();

  return {
    keyword,
    type,
    result: results[page - 1],
    total_count: results.length,
  };
};

// FIXME
const getOneRandomVideo = async () => {
  const db = await getDatabase();
  const results = await db
    .collection('videos')
    .aggregate([
      { $sort: { count: -1 } },
      { $limit: 50 },
      { $sample: { size: 1 } },
    ])
    .toArray();
  return {
    keyword: 'PPAV',
    result: results[0],
  };
};

const getAnalyticVideos = async candidates => {
  const db = await getDatabase();
  const videosIds = candidates.map(candidate => ObjectId(candidate.video_id));
  return db.collection('videos').find({ _id: { $in: videosIds } }).toArray();
};

export { getVideo, getOneRandomVideo, getAnalyticVideos };
