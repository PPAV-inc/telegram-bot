import getDatabase from './database';

const escapeRegex = text => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

const getVideo = async (type, messageText, page) => {
  const text = escapeRegex(messageText);
  const query = {};
  query[type] = {
    $regex: text,
    $options: 'gi',
  };

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
          total_count: { $sum: 1 },
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
      { $skip: page },
      { $limit: 1 },
    ])
    .toArray();

  return {
    searchValue: text,
    type,
    results: results[0],
  };
};

const getRandomThreeVideos = async () => {
  const db = await getDatabase();
  const results = await db
    .collection('videos')
    .aggregate([
      { $sort: { count: -1 } },
      { $limit: 50 },
      { $sample: { size: 3 } },
    ])
    .toArray();
  return {
    searchValue: 'PPAV',
    results,
  };
};

export { getVideo, getRandomThreeVideos };
