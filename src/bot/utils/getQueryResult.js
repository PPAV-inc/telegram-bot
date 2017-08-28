import * as videos from '../../models/videos';

const getQueryResult = async (type, keyword = null, page = null) => {
  if (type.toUpperCase() === 'PPAV') {
    const { result } = await videos.getOneRandomVideo();
    return result;
  }

  let _keyword = keyword;
  for (let i = 0; i <= 2; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const { totalCount, result } = await videos.getVideo(_keyword, page);
    _keyword = _keyword.substring(0, _keyword.length - 1);

    if (totalCount !== 0 || i === 2) {
      return { totalCount, result };
    }
  }
};

export default getQueryResult;
