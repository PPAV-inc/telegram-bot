import traditionalChinese from './traditionalChinese';
import english from './english';

const locale = (languageCode = traditionalChinese) => {
  switch (languageCode) {
    case 'zh-TW':
      return traditionalChinese;
    case 'en':
      return english;
    default:
      return traditionalChinese;
  }
};

export default locale;
