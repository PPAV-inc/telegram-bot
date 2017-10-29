import { getRandomVideoKeyboardSettings } from '../utils/getKeyboardSettings';
import aesEncrypt from '../utils/aesEncrypt';
import { getNewVideos } from '../../models/videos';

const newVideos = async context => {
  const { user } = context;
  let { results } = await getNewVideos();

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
      results[i]
    );

    context.sendMessageContent.push(messageContent);
  }
};

export default newVideos;
