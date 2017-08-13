import locale from '../locale';

const about = async context => {
  const { user } = context;

  context.sendMessageContent.push({
    text: locale(user.languageCode).about,
    options: { parse_mode: 'Markdown' },
  });
};

export default about;
