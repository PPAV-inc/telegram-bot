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

  if (action === 'changeLanguage') {
    const result = getLanguageKeyboardSettings();
    context.sendMessageContent.push(result);
  } else if (action === 'autoDeleteMessages') {
    const result = getAutoDeleteMessagesKeyboardSettings(languageCode);
    context.sendMessageContent.push(result);
  } else if (action === 'watchMoreHot') {
    await hotVideos(context);
  } else if (action === 'watchMoreNew') {
    await newVideos(context);
  } else if (regex.test(action)) {
    const data = regex.exec(action);
    const keyword = data[1];
    const page = parseInt(data[2], 10);

    const { totalCount, results: searchVideosResults } = await getSearchVideos(
      keyword,
      page
    );

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
};

export default callbackQuery;
