import locale from '../locale';
import getQueryResult from '../utils/getQueryResult';
import { getVideoSourcesKeyboardSettings } from '../utils/getKeyboardSettings';
import insertSearchKeywords from '../../models/searchKeywords';
import insertHotSearchKeywords from '../../models/hotSearchKeywords';

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
    messageContent = {
      text: locale(user.languageCode).videos.notFound,
      options: { parse_mode: 'Markdown' },
    };
  } else {
    messageContent = await getVideoSourcesKeyboardSettings(
      user.languageCode,
      keyword,
      result,
      firstPage,
      totalCount
    );

    await insertSearchKeywords(keyword);
    await insertHotSearchKeywords(keyword);
  }

  context.sendMessageContent.push(messageContent);
};

export default searchVideos;
