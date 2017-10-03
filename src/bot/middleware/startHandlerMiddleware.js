import { TelegramHandlerBuilder } from 'toolbot-core-experiment';
import userAuthenticatedMiddleware from './userAuthenticatedMiddleware';
import { start, updateUserLanguage, acceptDisclaimer } from '../actions';

const startHandlerMiddleware = (context, next) =>
  new TelegramHandlerBuilder()
    // 開始對話
    .onText(/\/start/, start)
    // 更新使用者語言
    .onText(/(繁體中文|English)$/i, innerContext =>
      updateUserLanguage(innerContext, next)
    )
    // 接受/不接受 免責聲明
    .onText(/(接受|Accept) ✅$/i, acceptDisclaimer)
    // 是否接受免責聲明
    .onEvent(innerContext => userAuthenticatedMiddleware(innerContext, next))
    .build()(context);

export default startHandlerMiddleware;
