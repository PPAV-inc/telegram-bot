import randomVideo from './randomVideo';
import locale from '../locale';
import getQueryResult from '../utils/getQueryResult';
import { getVideoSourcesKeyboardSettings } from '../utils/getKeyboardSettings';
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
      text: locale(user.languageCode).videos.notFound,
      options: { parse_mode: 'Markdown' },
    };
    context.sendMessageContent.push(messageContent);

    await randomVideo(context);
  } else {
    messageContent = await getVideoSourcesKeyboardSettings(
      user.languageCode,
      keyword,
      result,
      firstPage,
      totalCount
    );

    insertSearchKeyword(keyword);
    insertHotSearchKeyword(keyword);

    context.sendMessageContent.push(messageContent);
  }
};

export default searchVideos;
