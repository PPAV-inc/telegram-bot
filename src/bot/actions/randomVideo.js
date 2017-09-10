import { getRandomVideoKeyboardSettings } from '../utils/getKeyboardSettings';
import getQueryResult from '../utils/getQueryResult';

const randomVideo = async context => {
  const { user } = context;
  const result = await getQueryResult('PPAV');

  for (let i = 0; i < result.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const messageContent = await getRandomVideoKeyboardSettings(
      user.languageCode,
      result[i]
    );

    context.sendMessageContent.push(messageContent);
  }
};

export default randomVideo;
