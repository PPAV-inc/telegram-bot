import { url } from '../../../env/bot.config';

const ourshd = async (context) => {
  context.sendMessageContent.push({
    imageUrl: 'https://i.imgur.com/ygsx5S3.jpg',
    options: {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '🆓 PPAV X 奧視免費專區',
              url: `${url}/redirect/?url=${encodeURIComponent(
                'http://ourshdtv.com/ad/click?code=1551ef9cbae61a7d089c49979b4fac97'
              )}`,
            },
          ],
        ],
      },
      parse_mode: 'Markdown',
      disable_web_page_preview: false,
      caption: `
PPAV x 奧視 今日免費看

PPAV 獨家取得奧視影片，每日一部，千萬不要錯過！
立刻點擊觀看👇`,
    },
  });
};

export default ourshd;
