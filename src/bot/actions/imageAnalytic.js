import axios from 'axios';
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

        for (let i = 0; i < photos.length; i += 1) {
          context.sendMessageContent.push({
            text: photos[i].text,
            options: photos[i].options,
          });
        }

        break;
      }
      case 0: {
        context.sendMessageContent.push({
          text: locale(user.languageCode).imageAnalytic.notFound,
          options: { parse_mode: 'Markdown' },
        });
        break;
      }
      case -1: {
        context.sendMessageContent.push({
          text: locale(user.languageCode).imageAnalytic.foundMoreThanOne,
          options: { parse_mode: 'Markdown' },
        });
        break;
      }
      default: {
        context.sendMessageContent.push({
          text: locale(user.languageCode).imageAnalytic.notFound,
          options: { parse_mode: 'Markdown' },
        });
        break;
      }
    }
  } catch (err) {
    console.log(err);
  }
};

export default imageAnalytic;
