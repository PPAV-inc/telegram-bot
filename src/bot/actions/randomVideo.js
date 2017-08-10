import { getRandomVideoKeyboardSettings } from '../utils/getKeyboardSettings';
import getQueryResult from '../utils/getQueryResult';

const randomVideo = async context => {
  const { user } = context;
  const result = await getQueryResult('PPAV');

  const { text, options } = await getRandomVideoKeyboardSettings(
    user.languageCode,
    result
  );

  await context.sendMessage(text, options);
  //   const { message_id: sentMessageId } = await context.sendMessage(
  //     text,
  //     options
  //   );
  //
  //   if (user.autoDeleteMessages) {
  //     await deleteMessage(chatId, sentMessageId, bot);
  //   }
};

export default randomVideo;
