import hotVideos from './hotVideos';
import ourshd from './ourshd';
import locale from '../locale';
import aesEncrypt from '../utils/aesEncrypt';
import {
  getSearchVideoKeyboardSettings,
  getWatchMoreKeyboardSettings,
} from '../utils/getKeyboardSettings';
import { insertSearchKeyword } from '../../models/searchKeywords';
import insertHotSearchKeyword from '../../models/hotSearchKeywords';
import insertNotFoundLog from '../../models/notFoundLogs';
import { getSearchVideos } from '../../models/videos';

const searchVideos = async context => {
  const match = context.event._rawEvent.message.text.match(
    /[#＃]\s*\+*\s*(\S+)/i
  );
  const { user } = context;
  const keyword = match[1];
  const firstPage = 1;

  const { totalCount, results: searchVideosResults } = await getSearchVideos(
    keyword,
    firstPage
  );

  const encryptUserId = aesEncrypt(`${user.userId}`);
  /* eslint-disable no-param-reassign */
  const results = searchVideosResults.map(res => {
    res.videos = res.videos.map(video => {
      video.url += `&user=${encodeURIComponent(encryptUserId)}`;
      return video;
    });
    return res;
  });
  /* eslint-enable no-param-reassign */

  let messageContent;
  if (totalCount === 0) {
    insertNotFoundLog(keyword);

    messageContent = {
      text: `${locale(user.languageCode).videos.searchingKeyword}#${keyword}\n${
        locale(user.languageCode).videos.notFound
      }`,
      options: { parse_mode: 'Markdown' },
    };
    context.sendMessageContent.push(messageContent);

    await ourshd(context);
    await hotVideos(context);
  } else {
    for (let i = 0; i < results.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      messageContent = await getSearchVideoKeyboardSettings(
        user.languageCode,
        results[i]
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
        text: `${
          locale(user.languageCode).videos.searchingKeyword
        }#${keyword}\n${locale(user.languageCode).videos.noWatchMore}`,
        options: { parse_mode: 'Markdown' },
      };
      context.sendMessageContent.push(messageContent);
    }

    insertSearchKeyword(keyword);
    insertHotSearchKeyword(keyword, user);
  }
};

export default searchVideos;
