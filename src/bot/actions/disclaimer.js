import locale from '../locale';

const disclaimer = async context => {
  const { user } = context;

  context.sendMessageContent.push({
    text: locale(user.languageCode).disclaimer,
    options: { parse_mode: 'Markdown' },
  });
};

export default disclaimer;
