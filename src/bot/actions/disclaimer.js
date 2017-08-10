import locale from '../locale';

const disclaimer = async context => {
  const { user } = context;
  await context.sendMessage(locale(user.languageCode).disclaimer, {
    parse_mode: 'Markdown',
  });
};

export default disclaimer;
