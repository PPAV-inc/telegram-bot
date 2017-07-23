import * as videos from '../../models/videos';

const getQueryResult = async (type, keyword = null, page = null) => {
  if (type !== 'PPAV') {
    const { total_count: totalCount, result } = await videos.getVideo(
      type,
      keyword,
      page
    );

    return { totalCount, result };
  }

  const { result } = await videos.getOneRandomVideo();
  return result;
};

export default getQueryResult;
