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
} from '../actions';

const mainHandlerMiddleware = context =>
  new TelegramHandlerBuilder()
    // 搜尋 番號、標題、女優
    .onText(/([#＃]|[%％]|[@＠])\s*\+*\s*(\S+)/, searchVideos)
    // PPAV
    .onText(/^PPAV$/i, randomVideo)
    // 接受/不接受 免責聲明
    .onText(/(設置|Setting) ⚙️$/i, setting)
    // 關於 PPAV
    .onText(/(關於 PPAV|About PPAV) 👀$/i, about)
    // 免責聲明
    .onText(/(免責聲明|Disclaimer) 📜$/i, disclaimer)
    // 意見回饋
    .onText(/(意見回饋|Report) 🙏$/i, report)
    // 聯絡我們
    .onText(/(聯絡我們|Contact PPAV) 📩$/i, contactUs)
    // unhandled
    .onUnhandled(unhandled)
    // callback_query
    .onCallbackQuery(/.*/, callbackQuery)
    .build()(context);

export default mainHandlerMiddleware;
