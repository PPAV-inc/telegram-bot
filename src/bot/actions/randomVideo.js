import { getRandomVideoKeyboardSettings } from '../utils/getKeyboardSettings';
import getQueryResult from '../utils/getQueryResult';

const randomVideo = async context => {
  const { user } = context;
  const result = await getQueryResult('PPAV');

  const { text, options } = await getRandomVideoKeyboardSettings(
    user.languageCode,
    result
  );

  context.sendMessageContent.push({
    text,
    options,
  });
};

export default randomVideo;
