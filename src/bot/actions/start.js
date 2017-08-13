import * as users from '../../models/users';
import { getLanguageKeyboardSettings } from '../utils/getKeyboardSettings';

const start = async context => {
  const { from: { id: userId } } = context.event._rawEvent.message;

  const user = await users.getUser(userId);
  if (!user) {
    await users.createUser(context.event._rawEvent.message);
  }

  const messageContent = getLanguageKeyboardSettings();

  context.sendMessageContent.push(
    {
      text: '*♥️♥️ 歡迎使用 PPAV ♥️♥️*\n*♥️♥️ Welcome to PPAV ♥️♥️*',
      options: { parse_mode: 'Markdown' },
    },
    messageContent
  );
};

export default start;
