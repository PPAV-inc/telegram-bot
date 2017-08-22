import { getLanguageKeyboardSettings } from '../utils/getKeyboardSettings';

const start = async context => {
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
