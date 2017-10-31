import { getRandomVideoKeyboardSettings } from '../utils/getKeyboardSettings';
import aesEncrypt from '../utils/aesEncrypt';
import { getHotVideos } from '../../models/videos';

const hotVideos = async context => {
  const { user } = context;
  let { results } = await getHotVideos();

  const encryptUserId = aesEncrypt(`${user.userId}`);
  /* eslint-disable no-param-reassign */
  results = results.map(result => {
    result.videos = result.videos.map(video => {
      video.url += `&user=${encodeURIComponent(encryptUserId)}`;
      return video;
    });
    return result;
  });
  /* eslint-enable no-param-reassign */

  for (let i = 0; i < results.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const messageContent = await getRandomVideoKeyboardSettings(
      user.languageCode,
      results[i],
      'hot'
    );

    context.sendMessageContent.push(messageContent);
  }
};

export default hotVideos;
