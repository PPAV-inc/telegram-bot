import { getContactUsKeyboardSettings } from '../utils/getKeyboardSettings';

const contactUs = async context => {
  const { user } = context;
  const { text, options } = getContactUsKeyboardSettings(user.languageCode);

  await context.sendMessage(text, options);
};

export default contactUs;
