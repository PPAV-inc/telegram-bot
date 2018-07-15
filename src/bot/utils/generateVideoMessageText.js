import dateFormat from 'dateformat';
import locale from '../locale';

const generateVideoMessageText = (languageCode, result) => {
  const videoWord = locale(languageCode).videos;

  const models =
    result.models.length !== 0
      ? `${videoWord.model}: ${result.models.join(', ')}\n`
      : '';
  const tags = result.tags
    ? `${videoWord.tag}: ${result.tags.join(', ')}\n`
    : '';
  const score = result.score ? `${videoWord.score}: ${result.score}\n` : '';
  const length = result.length
    ? `${videoWord.length}: ${result.length} ${videoWord.minute}\n`
    : '';
  const publishedAt = result.publishedAt
    ? `${videoWord.publishedAt}: ${dateFormat(
        result.publishedAt,
        'yyyy/mm/dd'
      )}\n`
    : '';

  const title = result.title.replace(/[*_]/g, '').substr(0, 100);

  return `
    ${videoWord.code}: ${result.code}\n${
    videoWord.title
  }: ${title}\n${models}${tags}${score}${length}${publishedAt}
  `;
};

export default generateVideoMessageText;
