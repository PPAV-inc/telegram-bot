import * as videos from '../../models/videos';

const getQueryResult = async (type, query = null, page = null) => {
  if (type !== 'PPAV') {
    const { keyword, result } = await videos.getVideo(type, query, page);
    console.log({ result });

    if (result.count === 0) {
      return false;
    }
    return { keyword, result };
  }

  const { keyword, result } = await videos.getOneRandomVideo();
  return { keyword, result };
};

export default getQueryResult;
