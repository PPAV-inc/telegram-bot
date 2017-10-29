import { TelegramHandler } from 'bottender';
import {
  searchVideos,
  randomVideo,
  tutorial,
  setting,
  about,
  disclaimer,
  report,
  contactUs,
  unhandled,
  callbackQuery,
  // imageAnalytic,
  subscribe,
} from '../actions';

const mainHandlerMiddleware = new TelegramHandler()
  // PPAV
  .onText(/(^PPAV$|^PPAV 🔥$|^[#＃]PPAV)/i, randomVideo)
  // 搜尋 番號、標題、女優
  .onText(/[#＃]\s*\+*\s*(\S+)/, searchVideos)
  // 使用說明
  .onText(/(使用說明|Tutorial) 📖$/i, tutorial)
  // 設置
  .onText(/(設置|Setting) ⚙️$/i, setting)
  // 圖片分析
  // .onPhoto(imageAnalytic)
  // 訂閱推播
  .onText(/^(gginin|nogg)\s*(\d*)/i, subscribe)
  // 關於 PPAV
  .onText(/(關於 PPAV|About PPAV) 👀$/i, about)
  // 免責聲明
  .onText(/(免責聲明|Disclaimer) 📜$/i, disclaimer)
  // 意見回饋
  .onText(/(意見回饋|Report) 🙏$/i, report)
  // 聯絡我們
  .onText(/(聯絡我們|Contact PPAV) 📩$/i, contactUs)
  // callback_query
  .onCallbackQuery(callbackQuery)
  // unhandled
  .onEvent(unhandled);

export default mainHandlerMiddleware;
