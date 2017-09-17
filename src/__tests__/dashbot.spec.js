import {
  sendLogIncoming,
  sendLogOutgoing,
  dashbot,
  botToken,
} from '../dashbot';

jest.mock('axios');

const axios = require('axios');

const textMessage = {
  update_id: 109322655,
  message: {
    message_id: 3299,
    from: {
      id: 12345,
      first_name: 'Homer',
      last_name: 'Chen',
      username: 'xxhomey19',
      language_code: 'en-TW',
    },
    chat: {
      id: 12345,
      first_name: 'Homer',
      last_name: 'Chen',
      username: 'xxhomey19',
      type: 'private',
    },
    date: 1502371822,
    text: 'text',
  },
};

const photoMessage = {
  update_id: 109322655,
  message: {
    message_id: 3299,
    from: {
      id: 12345,
      first_name: 'Homer',
      last_name: 'Chen',
      username: 'xxhomey19',
      language_code: 'en-TW',
    },
    chat: {
      id: 12345,
      first_name: 'Homer',
      last_name: 'Chen',
      username: 'xxhomey19',
      type: 'private',
    },
    date: 1502371822,
    photo: [
      {
        file_id: '54321',
      },
      {
        file_id: '98765',
      },
    ],
  },
};

const callbackQuery = {
  update_id: 109322656,
  callback_query: {
    id: '1068230107531367617',
    from: {
      id: 12345,
      first_name: 'Homer',
      last_name: 'Chen',
      username: 'xxhomey19',
      language_code: 'en-TW',
    },
    message: {
      message_id: 3300,
      from: {
        id: 12345,
        first_name: 'Homer',
        last_name: 'Chen',
        username: 'xxhomey19',
        language_code: 'en-TW',
      },
      chat: {
        id: 12345,
        first_name: 'Homer',
        last_name: 'Chen',
        username: 'xxhomey19',
        type: 'private',
      },
      date: 1502371827,
      text: 'text',
    },
    chat_instance: '-1828607021492040088',
    data: 'watchMore',
  },
};

beforeEach(() => {
  dashbot.logIncoming = jest.fn();
  dashbot.logOutgoing = jest.fn();
  axios.post = jest.fn();
  console.log = jest.fn();
});

describe('sendLogIncoming', () => {
  it('should be defined', () => {
    expect(sendLogIncoming).toBeDefined();
  });

  it('should call logIncoming with textMessage', async () => {
    await sendLogIncoming(textMessage);

    expect(dashbot.logIncoming).toBeCalledWith({
      text: 'text',
      userId: 12345,
      conversationId: 12345,
      images: [],
      platformJson: textMessage,
    });
  });

  it('should call logIncoming with photoMessage', async () => {
    axios.post.mockReturnValue({
      data: {
        result: {
          file_path: 'url/image.jpg',
        },
      },
    });

    await sendLogIncoming(photoMessage);

    expect(dashbot.logIncoming).toBeCalledWith({
      text: '',
      userId: 12345,
      conversationId: 12345,
      images: [
        {
          url: `https://api.telegram.org/file/bot${botToken}/url/image.jpg`,
        },
      ],
      platformJson: photoMessage,
    });
  });

  it('should call logIncoming with callbackQuery', async () => {
    await sendLogIncoming(callbackQuery);

    expect(dashbot.logIncoming).toBeCalledWith({
      text: 'watchMore',
      userId: 12345,
      conversationId: 12345,
      platformJson: callbackQuery,
    });
  });

  it('should not call logIncoming with unhandle message', async () => {
    await sendLogIncoming({
      unhandle: {
        text: 'strange message',
      },
    });

    expect(dashbot.logIncoming).not.toBeCalled();
  });
});

describe('sendLogOutgoing', () => {
  const text = 'Hi user';
  let options = { parse_mode: 'Markdown' };

  it('should be defined', () => {
    expect(sendLogOutgoing).toBeDefined();
  });

  it('should call logOutgoing with textMessage', async () => {
    await sendLogOutgoing(textMessage, text, options);

    expect(dashbot.logOutgoing).toBeCalledWith({
      text,
      userId: 12345,
      conversationId: 12345,
      images: [],
      buttons: [],
      platformJson: textMessage,
    });
  });

  it('should call logOutgoing with photoMessage', async () => {
    axios.post.mockReturnValue({
      data: {
        result: {
          file_path: 'url/image.jpg',
        },
      },
    });

    await sendLogOutgoing(photoMessage, text, options);

    expect(dashbot.logOutgoing).toBeCalledWith({
      text,
      userId: 12345,
      conversationId: 12345,
      images: [],
      buttons: [],
      platformJson: photoMessage,
    });
  });

  it('should call logOutgoing with callbackQuery', async () => {
    await sendLogOutgoing(callbackQuery, text, options);

    expect(dashbot.logOutgoing).toBeCalledWith({
      text,
      userId: 12345,
      conversationId: 12345,
      images: [],
      buttons: [],
      platformJson: callbackQuery,
    });
  });

  it('should call logOutgoing with reply_markup options', async () => {
    options = {
      imageUrl: 'http://example/ppav.jpg',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '🔞 myavsuper',
              url: 'https://myavsuper.com/abc/',
            },
          ],
          [
            {
              text: '🙌 給我更多 🙌',
              callback_data: 'watchMore',
            },
          ],
        ],
      },
      parse_mode: 'Markdown',
      disable_web_page_preview: false,
    };
    await sendLogOutgoing(callbackQuery, text, options);

    expect(dashbot.logOutgoing).toBeCalledWith({
      text,
      userId: 12345,
      conversationId: 12345,
      images: [
        {
          url: 'http://example/ppav.jpg',
        },
      ],
      buttons: [
        {
          id: 109322656,
          label: '🔞 myavsuper',
          value: 'https://myavsuper.com/abc/',
        },
        { id: 109322656, label: '🙌 給我更多 🙌', value: 'watchMore' },
      ],
      platformJson: callbackQuery,
    });
  });

  it('should not call logOutgoing with unhandle message', async () => {
    await sendLogOutgoing({
      unhandle: {
        text: 'strange message',
      },
    });

    expect(dashbot.logOutgoing).not.toBeCalled();
  });
});
