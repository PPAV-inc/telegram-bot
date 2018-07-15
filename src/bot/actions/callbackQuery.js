import hotVideos from './hotVideos';
import newVideos from './newVideos';
import locale from '../locale';
import {
  getLanguageKeyboardSettings,
  getAutoDeleteMessagesKeyboardSettings,
  getSearchVideoKeyboardSettings,
  getWatchMoreKeyboardSettings,
} from '../utils/getKeyboardSettings';
import { getSearchVideos } from '../../models/videos';

const regex = /keyword="(.+)"&page="(\d+)"/;

const callbackQuery = async context => {
  const { data: action } = context.event.callbackQuery;
  const { languageCode } = context.user;

  let result;
  switch (action) {
    case 'changLanguage':
      result = getLanguageKeyboardSettings();
      context.sendMessageContent.push(result);
      break;
    case 'autoDeleteMessages':
      result = getAutoDeleteMessagesKeyboardSettings(languageCode);
      context.sendMessageContent.push(result);
      break;
    case 'watchMoreHot':
      await hotVideos(context);
      break;
    case 'watchMoreNew':
      await newVideos(context);
      break;
    default: {
      const data = await regex.exec(action);
      const keyword = data[1];
      const page = parseInt(data[2], 10);

      const {
        totalCount,
        results: searchVideosResults,
      } = await getSearchVideos(keyword, page);

      for (let i = 0; i < searchVideosResults.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        const messageContent = await getSearchVideoKeyboardSettings(
          languageCode,
          searchVideosResults[i]
        );
        context.sendMessageContent.push(messageContent);
      }

      if (totalCount >= page + 5) {
        const watchMore = await getWatchMoreKeyboardSettings(
          languageCode,
          keyword,
          page
        );
        context.sendMessageContent.push(watchMore);
      } else {
        const messageContent = {
          text: `${locale(languageCode).videos.searchingKeyword}#${keyword}\n${
            locale(languageCode).videos.noWatchMore
          }`,
          options: { parse_mode: 'Markdown' },
        };
        context.sendMessageContent.push(messageContent);
      }
    }
  }
};

export default callbackQuery;
