import { TelegramHandler } from 'bottender';
import userAuthenticatedMiddleware from './userAuthenticatedMiddleware';
import {
  start,
  updateUserLanguage,
  disclaimer,
  acceptDisclaimer,
} from '../actions';

const startHandlerMiddleware = (context, next) =>
  new TelegramHandler()
    // 開始對話
    .onText(/\/start/, start)
    // 更新使用者語言
    .onText(/(繁體中文|English)$/i, innerContext =>
      updateUserLanguage(innerContext, next)
    )
    // 免責聲明
    .onText(/(點擊查看免責聲明|Check disclaimer)$/i, disclaimer)
    // 接受/不接受 免責聲明
    .onText(/(我已滿 18 歲|I am adult) ✅$/i, acceptDisclaimer)
    // 是否接受免責聲明
    .onEvent(innerContext => userAuthenticatedMiddleware(innerContext, next))
    .build()(context);

export default startHandlerMiddleware;
