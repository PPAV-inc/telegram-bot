import { ObjectId } from 'mongodb';
import subDays from 'date-fns/sub_days';
import { getMongoDatabase, getElasticsearchDatabase } from './database';
import config from '../../env/bot.config';

const escapeRegex = text => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

const getSearchVideos = async (messageText, page) => {
  const result = [];
  const keyword = escapeRegex(messageText);

  const esClient = getElasticsearchDatabase();

  const { hits: { total: totalCount, hits } } = await esClient.search({
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
    hits.forEach(hit => {
      const { _source: source } = hit;
      source.videos = source.videos.map(video => ({
        ...video,
        url: `${config.url}/redirect/?url=${encodeURIComponent(
          video.url
        )}&_id=${hit._id}`,
      }));
      result.push(source);
    });
  }

  return {
    keyword,
    result,
    totalCount,
  };
};

const getRandomVideos = async () => {
  const db = await getMongoDatabase();

  const sevenDaysBefore = subDays(new Date(), 7);
  let hotVideos = await db
    .collection('logs')
    .aggregate([
      { $match: { createdAt: { $gte: sevenDaysBefore } } },
      { $group: { _id: '$videoId', videoId: '$videoId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 100 },
      { $sample: { size: 3 } },
    ])
    .toArray();

  hotVideos = hotVideos.map(video => ObjectId(video.videoId));

  const result = await db
    .collection('videos')
    .find({ _id: { $in: hotVideos } })
    .toArray();

  result.forEach(eachResult => {
    // eslint-disable-next-line no-param-reassign
    eachResult.videos = eachResult.videos.map(video => ({
      ...video,
      url: `${config.url}/redirect/?url=${encodeURIComponent(
        video.url
      )}&_id=${eachResult._id}`,
    }));
  });

  return {
    result,
  };
};

const getAnalyticVideos = async candidates => {
  const db = await getMongoDatabase();
  const videosIds = candidates.map(candidate => ObjectId(candidate.video_id));
  return db
    .collection('videos')
    .find({ _id: { $in: videosIds } })
    .toArray();
};

export { getSearchVideos, getRandomVideos, getAnalyticVideos };
