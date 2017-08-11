import { TelegramHandlerBuilder } from 'toolbot-core-experiment';
import {
  searchVideos,
  randomVideo,
  setting,
  about,
  disclaimer,
  report,
  contactUs,
  unhandled,
  callbackQuery,
  imageAnalytic,
} from '../actions';

const mainHandlerMiddleware = context =>
  new TelegramHandlerBuilder()
    // 搜尋 番號、標題、女優
    .onText(/([#＃]|[%％]|[@＠])\s*\+*\s*(\S+)/, searchVideos)
    // PPAV
    .onText(/^PPAV$/i, randomVideo)
    // 設置
    .onText(/(設置|Setting) ⚙️$/i, setting)
    // 圖片分析
    .onPhoto(imageAnalytic)
    // 關於 PPAV
    .onText(/(關於 PPAV|About PPAV) 👀$/i, about)
    // 免責聲明
    .onText(/(免責聲明|Disclaimer) 📜$/i, disclaimer)
    // 意見回饋
    .onText(/(意見回饋|Report) 🙏$/i, report)
    // 聯絡我們
    .onText(/(聯絡我們|Contact PPAV) 📩$/i, contactUs)
    // callback_query
    .onCallbackQuery(/.*/, callbackQuery)
    // unhandled
    .onUnhandled(unhandled)
    .build()(context);

export default mainHandlerMiddleware;
