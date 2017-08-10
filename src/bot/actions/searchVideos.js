import locale from '../locale';
import getQueryResult from '../utils/getQueryResult';
import { getVideoSourcesKeyboardSettings } from '../utils/getKeyboardSettings';
import saveSearchInfo from '../../models/search_keywords';

const searchVideos = async context => {
  const match = context.event._rawEvent.message.text.match(
    /([#＃]|[%％]|[@＠])\s*\+*\s*(\S+)/i
  );
  const { user } = context;
  let type = match[1];
  const keyword = match[2];
  const firstPage = 1;

  if (match[1] === '#' || match[1] === '＃') {
    type = 'code';
  } else if (match[1] === '%' || match[1] === '％') {
    type = 'models';
  } else {
    type = 'title';
  }

  const { totalCount, result } = await getQueryResult(type, keyword, firstPage);

  if (totalCount === 0) {
    await context.sendMessage(locale(user.languageCode).videos.notFound, {
      parse_mode: 'Markdown',
    });
  } else {
    const { text, options } = await getVideoSourcesKeyboardSettings(
      user.languageCode,
      keyword,
      result,
      type,
      firstPage,
      totalCount
    );

    // FIXME
    // const { message_id: sentMessageId } = await context.sendMessage(
    //   text,
    //   options
    // );
    //
    // if (user.autoDeleteMessages) {
    //   await deleteMessage(sentMessageId, context);
    // }

    await context.sendMessage(text, options);
    await saveSearchInfo(keyword, type);
  }
};

export default searchVideos;
