import * as users from '../../models/users';
import { getLanguageKeyboardSettings } from '../utils/getKeyboardSettings';

const start = async context => {
  const { from: { id: userId } } = context.event._rawEvent.message;

  const user = await users.getUser(userId);
  if (!user) {
    await users.createUser(context.event._rawEvent.message);
  }

  await context.sendMessage(
    '*♥️♥️ 歡迎使用 PPAV ♥️♥️*\n*♥️♥️ Welcome to PPAV ♥️♥️*',
    { parse_mode: 'Markdown' }
  );

  const { text, options } = getLanguageKeyboardSettings();
  await context.sendMessage(text, options);
};

export default start;
