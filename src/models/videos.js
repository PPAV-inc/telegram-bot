import { ObjectId } from 'mongodb';
import { getMongoDatabase, getElasticsearchDatabase } from './database';
import config from '../../env/bot.config';

const escapeRegex = text => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

const getVideo = async (messageText, page) => {
  let result = {};
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
          fields: ['tags^80', 'title^50', 'models^100', 'code^1000'],
        },
      },
      min_score: 30,
      from: page - 1,
      size: 1,
    },
  });

  if (totalCount !== 0) {
    [{ _source: result }] = hits;
    result.videos = result.videos.map(video => ({
      ...video,
      url: `${config.url}/redirect/?url=${encodeURI(video.url)}&_id=${hits[0]
        ._id}`,
    }));
  }

  return {
    keyword,
    result,
    totalCount,
  };
};

// FIXME
const getOneRandomVideo = async () => {
  const db = await getMongoDatabase();
  const [result] = await db
    .collection('videos')
    .aggregate([
      { $sort: { total_view_count: -1 } },
      { $limit: 50 },
      { $sample: { size: 1 } },
    ])
    .toArray();

  result.videos = result.videos.map(video => ({
    ...video,
    url: `${config.url}/redirect/?url=${encodeURI(
      video.url
    )}&_id=${result._id}`,
  }));

  return {
    type: 'PPAV',
    result,
  };
};

const getAnalyticVideos = async candidates => {
  const db = await getMongoDatabase();
  const videosIds = candidates.map(candidate => ObjectId(candidate.video_id));
  return db.collection('videos').find({ _id: { $in: videosIds } }).toArray();
};

export { getVideo, getOneRandomVideo, getAnalyticVideos };
