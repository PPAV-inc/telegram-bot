import path from 'path';

const { delayMiliseconds } = require(path.resolve(
  __dirname,
  '../../../env/bot.config'
));

const sleep = () =>
  new Promise(resolve => setTimeout(resolve, delayMiliseconds));

const deleteMessage = async (sentMessageId, context) => {
  await sleep();
  await context.deleteMessage(sentMessageId);
};

export default deleteMessage;
