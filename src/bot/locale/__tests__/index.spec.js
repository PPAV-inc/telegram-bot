import locale from '../../locale';
import traditionalChinese from '../traditionalChinese';
import english from '../english';

describe('locale', () => {
  it('should be defined', () => {
    expect(locale).toBeDefined();
  });

  it('should return traditionalChinese as default', () => {
    const language = locale();
    expect(language).toEqual(traditionalChinese);
  });

  it('should return traditionalChinese', () => {
    const language = locale('zh-TW');
    expect(language).toEqual(traditionalChinese);
  });

  it('should return english', () => {
    const language = locale('en');
    expect(language).toEqual(english);
  });
});
