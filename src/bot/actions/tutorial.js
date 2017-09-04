import locale from '../locale';

const about = async context => {
  const { user } = context;
  const chatId = context.event._rawEvent.message.chat.id;

  const message = [
    {
      photo: locale(user.languageCode).tutorial.randomVideo_photo,
      options: {
        caption: locale(user.languageCode).tutorial.randomVideo,
      },
    },
    {
      photo: locale(user.languageCode).tutorial.searchVideos_photo_1,
      options: {
        caption: locale(user.languageCode).tutorial.searchVideos_caption_1,
      },
    },
    {
      photo: locale(user.languageCode).tutorial.searchVideos_photo_2,
      options: {
        caption: locale(user.languageCode).tutorial.searchVideos_caption_2,
      },
    },
  ];

  for (let i = 0; i < message.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await context._client.sendPhoto(
      chatId,
      message[i].photo,
      message[i].options
    );
  }
  // await context._client.sendPhoto(
  //   chatId,
  //   locale(user.languageCode).tutorial.randomVideo_photo,
  //   {
  //     caption: locale(user.languageCode).tutorial.randomVideo,
  //   }
  // );
  //
  // await context._client.sendPhoto({
  //   photo: locale(user.languageCode).tutorial.searchVideos_photo_1,
  //   caption: locale(user.languageCode).tutorial.searchVideos_caption_1,
  //   options: { parse_mode: 'Markdown' },
  // });
  //
  // await context._client.sendPhoto({
  //   photo: locale(user.languageCode).tutorial.searchVideos_photo_2,
  //   caption: locale(user.languageCode).tutorial.searchVideos_caption_2,
  //   options: { parse_mode: 'Markdown' },
  // });
};

export default about;
