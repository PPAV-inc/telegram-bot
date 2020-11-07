import path from 'path';
import axios from 'axios';
import chatbase from '@google/chatbase';

const { chatbaseToken, botToken } = require(path.resolve(
  __dirname,
  '../env/bot.config.js'
));

const parseMessage = async (data) => {
  if (data.message !== undefined) {
    const images = [];
    const text = data.message.text === undefined ? '' : data.message.text;
    const {
      update_id: updateId,
      message: {
        from: { id: userId },
        chat: { id: conversationId },
      },
    } = data;

    if (data.message.photo !== undefined && data.message.photo.length !== 0) {
      const {
        data: {
          result: { file_path: filePath },
        },
      } = await axios.post(`https://api.telegram.org/bot${botToken}/getFile`, {
        file_id: data.message.photo.pop().file_id,
      });
      images.push({
        url: `https://api.telegram.org/file/bot${botToken}/${filePath}`,
      });
    }

    return { updateId, text, images, userId, conversationId };
  }

  if (data.callback_query !== undefined) {
    const {
      update_id: updateId,
      callback_query: {
        data: text,
        from: { id: userId },
        message: {
          chat: { id: conversationId },
        },
      },
    } = data;

    return { updateId, text, userId, conversationId };
  }

  throw new Error('Cannot handle');
};

const sendLogIncoming = async (request) => {
  try {
    const { text, userId } = await parseMessage(request);

    await chatbase
      .newMessage(chatbaseToken, String(userId))
      .setAsTypeUser()
      .setPlatform('telegram')
      .setMessage(text)
      .setTimestamp(Date.now().toString())
      .setVersion('0.1')
      .send();
  } catch (err) {
    console.error(err);
  }
};

const sendLogOutgoing = async (rawEvent, message) => {
  try {
    const { userId } = await parseMessage(rawEvent);

    await chatbase
      .newMessage(chatbaseToken, String(userId))
      .setAsTypeAgent()
      .setPlatform('telegram')
      .setMessage(message)
      .setTimestamp(Date.now().toString())
      .setVersion('0.1')
      .send();
  } catch (err) {
    console.error(err);
  }
};

export { sendLogIncoming, sendLogOutgoing, chatbase, botToken };
