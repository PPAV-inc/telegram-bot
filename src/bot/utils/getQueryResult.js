import * as videos from '../../models/videos';

const getQueryResult = async (type, keyword = null, page = null) => {
  if (type.toUpperCase() === 'PPAV') {
    const { result } = await videos.getRandomVideos();
    return result;
  }

  const { totalCount, result } = await videos.searchVideos(keyword, page);

  return { totalCount, result };
};

export default getQueryResult;
