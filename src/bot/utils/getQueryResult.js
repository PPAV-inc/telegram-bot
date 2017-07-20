import * as videos from '../../models/videos';

const getQueryResult = async (type, query) => {
  const result = await videos.getVideo(type, query);

  if (result.count === 0) {
    return false;
  }

  return result;
};

export default getQueryResult;
