import { ObjectId } from 'mongodb';

jest.mock('mongodb');
jest.mock('../database');

const getDatabase = require('../database').default;
const { getVideo, getOneRandomVideo, getAnalyticVideos } = require('../videos');

describe('getVideo', () => {
  beforeEach(() => {
    getDatabase.mockReturnValue({
      collection: jest.fn().mockReturnThis(),
    });
    getDatabase().collection.mockReturnValue({
      find: jest.fn(),
      aggregate: jest.fn(),
    });
    getDatabase().collection().aggregate.mockReturnValue({
      toArray: jest.fn(),
    });
    getDatabase().collection().find.mockReturnValue({
      toArray: jest.fn(),
    });
    getDatabase().collection().aggregate().toArray.mockReturnValue([
      {
        title: '出会って4秒で即ハメされて最後は顔射！しかもお掃除フェラまでさせられて',
        models: ['南まゆ'],
        img_url:
          'http://pics.dmm.co.jp/digital/video/td005dvaj130h/td005dvaj130hpl.jpg',
        code: 'DVAJ-130',
        url: 'https://www.youav.com/video/7032/dvaj-130-出会って即合体スペシャル4',
        source: 'youav',
        tags: ['制服', '長腿'],
        view_count: 666,
        score: 8.8,
        duration: 150,
      },
    ]);
  });

  it('should be defined', () => {
    expect(getVideo).toBeDefined();
  });

  it('should return an object when type is models', async () => {
    const type = 'models';
    const messageText = '小美';
    const page = 1;
    const query = {};
    query.models = { $in: [new RegExp('小美', 'gi')] };

    await getVideo(type, messageText, page);

    expect(getDatabase).toBeCalled();
    expect(getDatabase().collection).toBeCalledWith('videos');
    expect(getDatabase().collection().aggregate).toBeCalledWith([
      { $match: query },
      { $sort: { total_view_count: -1 } },
    ]);
    expect(getDatabase().collection().aggregate().toArray).toBeCalled();
  });

  it('should return an object when type is not models', async () => {
    const type = 'code';
    const messageText = '123';
    const page = 1;
    const query = {};
    query.code = {
      $regex: '123',
      $options: 'gi',
    };

    await getVideo(type, messageText, page);

    expect(getDatabase).toBeCalled();
    expect(getDatabase().collection).toBeCalledWith('videos');
    expect(getDatabase().collection().aggregate).toBeCalledWith([
      { $match: query },
      { $sort: { total_view_count: -1 } },
    ]);
    expect(getDatabase().collection().aggregate().toArray).toBeCalled();
  });
});

describe('getOneRandomVideo', () => {
  it('should be defined', () => {
    expect(getOneRandomVideo).toBeDefined();
  });

  it('should return an object', async () => {
    await getOneRandomVideo();

    expect(getDatabase).toBeCalled();
    expect(getDatabase().collection).toBeCalledWith('videos');
    expect(getDatabase().collection().aggregate).toBeCalledWith([
      { $sort: { total_view_count: -1 } },
      { $limit: 50 },
      { $sample: { size: 1 } },
    ]);
    expect(getDatabase().collection().aggregate().toArray).toBeCalled();
  });
});

describe('getAnalyticVideos', () => {
  it('should be defined', () => {
    expect(getAnalyticVideos).toBeDefined();
  });

  it('should return an video find by candidates', async () => {
    const candidates = [
      {
        video_id: '5972e2b0b8d6db6c3d64895c',
      },
      {
        video_id: '5972e2b0b8d6db6c3d64895d',
      },
    ];
    const videosIds = candidates.map(candidate => ObjectId(candidate.video_id));

    await getAnalyticVideos(candidates);

    expect(getDatabase).toBeCalled();
    expect(getDatabase().collection).toBeCalledWith('videos');
    expect(getDatabase().collection().find).toBeCalledWith({
      _id: { $in: videosIds },
    });
    expect(getDatabase().collection().find().toArray).toBeCalled();
  });
});
