import { getRandomVideos, searchVideos } from '../../models/videos';

const getQueryResult = async (type, keyword = null, page = null) => {
  if (type.toUpperCase() === 'PPAV') {
    const { result } = await getRandomVideos();
    return result;
  }

  const { totalCount, result } = await searchVideos(keyword, page);

  return { totalCount, result };
};

export default getQueryResult;
