import { getSettingKeyboardSettings } from '../utils/getKeyboardSettings';

const setting = async context => {
  const { user } = context;
  const { text, options } = getSettingKeyboardSettings(user.languageCode);

  context.sendMessageContent.push({
    text,
    options,
  });
};

export default setting;
