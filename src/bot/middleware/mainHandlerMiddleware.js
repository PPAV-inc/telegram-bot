import { TelegramHandlerBuilder } from 'toolbot-core-experiment';
import {
  searchVideos,
  randomVideo,
  tutorial,
  setting,
  about,
  report,
  contactUs,
  unhandled,
  callbackQuery,
  // imageAnalytic,
  subscribe,
} from '../actions';

const mainHandlerMiddleware = context =>
  new TelegramHandlerBuilder()
    // 搜尋 番號、標題、女優
    .onText(/[#＃]\s*\+*\s*(\S+)/, searchVideos)
    // PPAV
    .onText(/(^PPAV$|^PPAV 🔥$)/i, randomVideo)
    // 設置
    .onText(/(使用說明|Tutorial) 📖$/i, tutorial)
    // 設置
    .onText(/(設置|Setting) ⚙️$/i, setting)
    // 圖片分析
    // .onPhoto(imageAnalytic)
    // 訂閱推播
    .onText(/^(gginin|nogg)\s*(\d*)/i, subscribe)
    // 關於 PPAV
    .onText(/(關於 PPAV|About PPAV) 👀$/i, about)
    // 意見回饋
    .onText(/(意見回饋|Report) 🙏$/i, report)
    // 聯絡我們
    .onText(/(聯絡我們|Contact PPAV) 📩$/i, contactUs)
    // callback_query
    .onCallbackQuery(/.*/, callbackQuery)
    // unhandled
    .onEvent(unhandled)
    .build()(context);

export default mainHandlerMiddleware;
