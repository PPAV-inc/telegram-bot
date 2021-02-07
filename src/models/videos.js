import { ObjectId } from 'mongodb';
import subDays from 'date-fns/subDays';
import { getMongoDatabase, getElasticsearchDatabase } from './database';

const url = process.env.URL;

const escapeRegex = (text) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

const getSearchVideos = async (messageText, page) => {
  const results = [];
  const keyword = escapeRegex(messageText);

  const esClient = getElasticsearchDatabase();

  const {
    hits: { total: totalCount, hits },
  } = await esClient.search({
    index: 'videos',
    type: 'videos',
    body: {
      query: {
        multi_match: {
          query: keyword,
          type: 'cross_fields',
          fields: ['tags^200', 'title^50', 'models^100', 'code^1000'],
        },
      },
      min_score: 50,
      from: page - 1,
      size: 5,
    },
  });

  if (totalCount !== 0) {
    hits.forEach((hit) => {
      const { _source: source } = hit;
      source.videos = source.videos.map((video) => ({
        ...video,
        url: `${url}/redirect/?url=${encodeURIComponent(video.url)}&_id=${
          hit._id
        }`,
      }));
      results.push(source);
    });
  }

  return {
    keyword,
    results,
    totalCount,
  };
};

const getNewVideos = async () => {
  const db = await getMongoDatabase();

  const oneDaysBefore = subDays(new Date(), 1);

  const results = await db
    .collection('videos')
    .aggregate([
      { $match: { updated_at: { $gte: oneDaysBefore } } },
      { $sort: { publishedAt: -1, total_view_count: -1 } },
      { $limit: 100 },
      { $sample: { size: 5 } },
    ])
    .toArray();

  results.forEach((eachResult) => {
    // eslint-disable-next-line no-param-reassign
    eachResult.videos = eachResult.videos.map((video) => ({
      ...video,
      url: `${url}/redirect/?url=${encodeURIComponent(video.url)}&_id=${
        eachResult._id
      }`,
    }));
  });

  return {
    results,
  };
};

const getHotVideos = async () => {
  const db = await getMongoDatabase();

  let results;
  if (process.env.NODE_ENV === 'development') {
    results = await db
      .collection('videos')
      .aggregate([{ $sample: { size: 5 } }])
      .toArray();
  } else {
    const sevenDaysBefore = subDays(new Date(), 7);
    let hotVideos = await db
      .collection('logs')
      .aggregate([
        { $match: { createdAt: { $gte: sevenDaysBefore } } },
        {
          $group: {
            _id: '$videoId',
            videoId: { $first: '$videoId' },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 100 },
        { $sample: { size: 5 } },
      ])
      .toArray();

    hotVideos = hotVideos.map((video) => ObjectId(video.videoId));

    results = await db
      .collection('videos')
      .find({ _id: { $in: hotVideos } })
      .toArray();
  }

  results.forEach((eachResult) => {
    // eslint-disable-next-line no-param-reassign
    eachResult.videos = eachResult.videos.map((video) => ({
      ...video,
      url: `${url}/redirect/?url=${encodeURIComponent(video.url)}&_id=${
        eachResult._id
      }`,
    }));
  });

  return {
    results,
  };
};

const getAnalyticVideos = async (candidates) => {
  const db = await getMongoDatabase();
  const videosIds = candidates.map((candidate) => ObjectId(candidate.video_id));
  return db
    .collection('videos')
    .find({ _id: { $in: videosIds } })
    .toArray();
};

export { getSearchVideos, getHotVideos, getNewVideos, getAnalyticVideos };
