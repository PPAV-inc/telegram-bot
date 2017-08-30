import * as videos from '../../models/videos';

const MAX_TOTAL_COUNT = 30;

const getQueryResult = async (type, keyword = null, page = null) => {
  if (type.toUpperCase() === 'PPAV') {
    const { result } = await videos.getOneRandomVideo();
    return result;
  }

  const { totalCount, result } = await videos.getVideo(keyword, page);

  if (totalCount > MAX_TOTAL_COUNT) {
    return { totalCount: MAX_TOTAL_COUNT, result };
  }

  return { totalCount, result };
};

export default getQueryResult;
