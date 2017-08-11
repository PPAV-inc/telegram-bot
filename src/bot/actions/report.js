import locale from '../locale';

const report = async context => {
  await context.sendMessage(locale().reportUrl, {
    parse_mode: 'Markdown',
  });
};

export default report;
