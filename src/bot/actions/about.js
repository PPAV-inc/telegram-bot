import locale from '../locale';

const about = async context => {
  const { user } = context;
  await context.sendMessage(locale(user.languageCode).about, {
    parse_mode: 'Markdown',
  });
};

export default about;
