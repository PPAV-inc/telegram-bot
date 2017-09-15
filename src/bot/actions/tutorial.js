import locale from '../locale';

const about = async context => {
  const { user } = context;

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
    context.sendMessageContent.push({
      imageUrl: message[i].photo,
      options: message[i].options,
    });
  }
};

export default about;
