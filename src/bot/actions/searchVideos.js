import randomVideo from './randomVideo';
import locale from '../locale';
import getQueryResult from '../utils/getQueryResult';
import {
  getSearchVideoKeyboardSettings,
  getWatchMoreKeyboardSettings,
} from '../utils/getKeyboardSettings';
import insertSearchKeyword from '../../models/searchKeywords';
import insertHotSearchKeyword from '../../models/hotSearchKeywords';
import insertNotFoundLog from '../../models/notFoundLogs';

const searchVideos = async context => {
  const match = context.event._rawEvent.message.text.match(
    /[#＃]\s*\+*\s*(\S+)/i
  );
  const { user } = context;
  const keyword = match[1];
  const firstPage = 1;

  const { totalCount, result } = await getQueryResult(
    'search',
    keyword,
    firstPage
  );

  let messageContent;
  if (totalCount === 0) {
    insertNotFoundLog(keyword);

    messageContent = {
      text: `${locale(user.languageCode).videos
        .searchingKeyword}#${keyword}\n${locale(user.languageCode).videos
        .notFound}`,
      options: { parse_mode: 'Markdown' },
    };
    context.sendMessageContent.push(messageContent);

    await randomVideo(context);
  } else {
    for (let i = 0; i < result.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      messageContent = await getSearchVideoKeyboardSettings(
        user.languageCode,
        result[i]
      );
      context.sendMessageContent.push(messageContent);
    }

    if (totalCount >= 5) {
      const watchMore = await getWatchMoreKeyboardSettings(
        user.languageCode,
        keyword,
        firstPage
      );
      context.sendMessageContent.push(watchMore);
    } else {
      messageContent = {
        text: `${locale(user.languageCode).videos
          .searchingKeyword}#${keyword}\n${locale(user.languageCode).videos
          .noWatchMore}`,
        options: { parse_mode: 'Markdown' },
      };
      context.sendMessageContent.push(messageContent);
    }

    insertSearchKeyword(keyword);
    insertHotSearchKeyword(keyword);
  }
};

export default searchVideos;
