import { getSettingKeyboardSettings } from '../utils/getKeyboardSettings';

const setting = async context => {
  const { user } = context;
  const { text, options } = getSettingKeyboardSettings(user.languageCode);

  await context.sendMessage(text, options);
};

export default setting;
