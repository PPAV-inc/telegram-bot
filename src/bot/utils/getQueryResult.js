import * as videos from '../../models/videos';

const getQueryResult = async (type, keyword = null, page = null) => {
  if (type.toUpperCase() === 'PPAV') {
    const { result } = await videos.getOneRandomVideo();
    return result;
  }

  const { totalCount, result } = await videos.getVideo(keyword, page);

  return { totalCount, result };
};

export default getQueryResult;
