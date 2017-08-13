import { getContactUsKeyboardSettings } from '../utils/getKeyboardSettings';

const contactUs = async context => {
  const { user } = context;
  const messageContent = getContactUsKeyboardSettings(user.languageCode);

  context.sendMessageContent.push(messageContent);
};

export default contactUs;
