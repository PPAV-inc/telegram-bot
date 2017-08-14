import path from 'path';
import axios from 'axios';

const { dashbotToken, botToken } = require(path.resolve(
  __dirname,
  '../env/bot.config.js'
));

const dashbot = require('dashbot')(dashbotToken).generic;

const getMessage = async data => {
  if (data.message !== undefined) {
    const images = [];
    const { from: { id: userId }, chat: { conversationId } } = data.message;
    const text = data.message.text === undefined ? '' : data.message.text;

    if (data.message.photo !== undefined && data.message.photo.length !== 0) {
      const {
        data: { result: { file_path: filePath } },
      } = await axios.post(`https://api.telegram.org/bot${botToken}/getFile`, {
        file_id: data.message.photo.pop().file_id,
      });
      images.push({
        url: `https://api.telegram.org/file/bot${botToken}/${filePath}`,
      });
    }

    return { text, images, userId, conversationId };
  } else if (data.callback_query !== undefined) {
    const {
      data: text,
      from: { id: userId },
      message: { chat: { id: conversationId } },
    } = data.callback_query;
    return { text, userId, conversationId };
  }

  throw new Error('Cannot handle');
};

const sendLogIncoming = async request => {
  try {
    const { text, userId, conversationId, images } = await getMessage(request);
    dashbot.logIncoming({
      text,
      userId,
      conversationId,
      images,
      platformJson: request,
    });
  } catch (err) {
    console.log(err);
  }
};

const sendLogOutgoing = async (rawEvent, text, options) => {
  try {
    const { userId, conversationId, images } = await getMessage(rawEvent);

    dashbot.logOutgoing({
      text,
      userId,
      conversationId,
      images,
      platformJson: options,
    });
  } catch (err) {
    console.log(err);
  }
};

export { sendLogIncoming, sendLogOutgoing };
