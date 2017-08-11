import axios from 'axios';
import sleep from 'sleep-promise';
import path from 'path';

import locale from '../locale';
import { getImageAnalyticKeyboardSettings } from '../utils/getKeyboardSettings';
import { getAnalyticVideos } from '../../models/videos';

const { imageAnalyticUrl } = require(path.resolve(
  __dirname,
  '../../../env/bot.config'
));
const imageAnalytic = async context => {
  const { user } = context;
  const { prePostText, searchingGifUrl } = locale(
    user.languageCode
  ).imageAnalytic;

  await context.sendDocument(searchingGifUrl, { caption: prePostText });

  const { result: fileInfo } = await context._client.getFile(
    context.event._rawEvent.message.photo.pop().file_id
  );
  const image = `https://api.telegram.org/file/bot${context._client
    ._token}/${fileInfo.file_path}`;

  try {
    const { data: analyticResult } = await axios.post(
      imageAnalyticUrl,
      {
        image,
      },
      {
        timeout: 30000,
      }
    );

    switch (analyticResult.isFaceExist) {
      case 1: {
        const result = await getAnalyticVideos(analyticResult.candidate);
        const photos = await getImageAnalyticKeyboardSettings(
          user.languageCode,
          result
        );

        /* eslint-disable */
        for (let i = 0; i < photos.length; i += 1) {
          const { message_id: sentMessageId } = await context.sendMessage(
            photos[i].text,
            photos[i].options
          );

          // if (user.autoDeleteMessages) {
          //   await deleteMessage(sentMessageId, context);
          // }

          await sleep(500);
        }
        /* eslint-enable */

        break;
      }
      case 0: {
        const { notFound } = locale(user.languageCode).imageAnalytic;
        await context.sendMessage(notFound, { parse_mode: 'Markdown' });
        break;
      }
      case -1: {
        const { foundMoreThanOne } = locale(user.languageCode).imageAnalytic;
        await context.sendMessage(foundMoreThanOne, {
          parse_mode: 'Markdown',
        });
        break;
      }
      default: {
        const { notFound } = locale(user.languageCode).imageAnalytic;
        await context.sendMessage(notFound, { parse_mode: 'Markdown' });
        break;
      }
    }
  } catch (err) {
    console.log(err);
  }
};

export default imageAnalytic;
