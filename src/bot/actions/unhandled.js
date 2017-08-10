import locale from '../locale';

const unhandled = async context => {
  const { user } = context;
  await context.sendMessage(locale(user.languageCode).unhandled, {
    parse_mode: 'Markdown',
  });
};

export default unhandled;
