import { getRandomVideoKeyboardSettings } from '../utils/getKeyboardSettings';
import getQueryResult from '../utils/getQueryResult';

const randomVideo = async context => {
  const { user } = context;
  const result = await getQueryResult('PPAV');

  const messageContent = await getRandomVideoKeyboardSettings(
    user.languageCode,
    result
  );

  context.sendMessageContent.push(messageContent);
};

export default randomVideo;
