import path from 'path';

const { delayMiliseconds } = require(path.resolve(
  __dirname,
  '../../../env/bot.config'
));

const sleep = () =>
  new Promise(resolve => setTimeout(resolve, delayMiliseconds));

const deleteMessage = async (chatId, sentMessageId, bot) => {
  await sleep();
  await bot.deleteMessage(chatId, sentMessageId);
};

export default deleteMessage;
