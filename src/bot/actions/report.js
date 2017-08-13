import locale from '../locale';

const report = async context => {
  context.sendMessageContent.push({
    text: locale().reportUrl,
    options: { parse_mode: 'Markdown' },
  });
};

export default report;
