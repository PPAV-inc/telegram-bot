import path from 'path';
import axios from 'axios';

const { dashbotToken, botToken } = require(path.resolve(
  __dirname,
  '../env/bot.config.js'
));

const dashbot = require('dashbot')(dashbotToken).generic;

const parseMessage = async data => {
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

const sendLogIncoming = async request => {
  try {
    const { text, userId, conversationId, images } = await parseMessage(
      request
    );
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
    const buttons = [];
    const images = [];
    const { updateId, userId, conversationId } = await parseMessage(rawEvent);

    if (
      options.reply_markup !== undefined &&
      options.reply_markup.inline_keyboard !== undefined
    ) {
      options.reply_markup.inline_keyboard.forEach(row => {
        row.forEach(button => {
          buttons.push({
            id: updateId,
            label: button.text,
            value: button.url !== undefined ? button.url : button.callback_data,
          });
        });
      });
    }

    if (options.imageUrl !== undefined) {
      images.push({
        url: options.imageUrl,
      });
    }

    dashbot.logOutgoing({
      text,
      userId,
      conversationId,
      images,
      buttons,
      platformJson: rawEvent,
    });
  } catch (err) {
    console.log(err);
  }
};

export { sendLogIncoming, sendLogOutgoing, dashbot, botToken };
