import { getSettingKeyboardSettings } from '../utils/getKeyboardSettings';

const setting = async context => {
  const { user } = context;
  const messageContent = getSettingKeyboardSettings(user.languageCode);

  context.sendMessageContent.push(messageContent);
};

export default setting;
