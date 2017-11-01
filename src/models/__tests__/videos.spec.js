import { ObjectId } from 'mongodb';
import config from '../../../env/bot.config';

jest.mock('mongodb');
jest.mock('../database');

const { getMongoDatabase, getElasticsearchDatabase } = require('../database');
const {
  getSearchVideos,
  getHotVideos,
  getAnalyticVideos,
} = require('../videos');

const video = {
  _id: ObjectId('598200798612d0d9c9cfaf7c'),
  title:
    '出会って4秒で即ハメされて最後は顔射！しかもお掃除フェラまでさせられて 南まゆ出会って4秒で即ハメされて最後は顔射！しかもお掃除フェラまでさせられて 雲乃亜美出会って4秒で即ハメされてイキまくり！ 長瀬麻美出会って4秒で即ハメされて最後は顔射！しかもお掃除フェラまでさせられて 長澤えりな出会って4秒で即ハメされて最後は顔射！しかもお掃除フェラまでさせられて 伊東紅出会って4秒で即ハメされて最後は顔射！しかもお掃除フェラまでさせられて 有沢杏出会って4秒で即ハメされて最後は顔射！しかもお掃除フェラまでさせられて 彩乃なな出会って4秒で即ハメされてイキまくり！そして最後は顔射フィニッシュ！ 宇沙城らん出会って4秒で即ハメされて最後は顔射！しかもお掃除フェラまでさせられて 澁谷果歩出会って4秒で即ハメされてイキまくり！そして最後は顔射フィニッシュ 皆野あい出会って即合体スペシャル4',
  models: ['南まゆ', '雲乃亜美', '長瀬麻美'],
  img_url:
    'http://pics.dmm.co.jp/digital/video/td005dvaj130h/td005dvaj130hpl.jpg',
  code: 'DVAJ-130',
  tags: ['中出', '制服', '長腿', '精選、綜合', '巨乳', '4小時以上作品', '紀錄片', '立即口交'],
  duration: 150,
  total_view_count: 666,
  videos: [
    {
      source: 'youav',
      url: 'https://www.youav.com/video/7032/dvaj-130-出会って即合体スペシャル4',
      view_count: 666,
    },
  ],
  score: 10,
  length: 240,
  publishedAt: new Date('2016-04-13T00:00:00.000Z'),
};

describe('getSearchVideos', () => {
  beforeEach(() => {
    getElasticsearchDatabase.mockReturnValue({
      search: jest.fn(),
    });

    getElasticsearchDatabase().search.mockReturnValue({
      hits: {
        total: 1,
        max_score: 111.308304,
        hits: [
          {
            _index: 'videos',
            _type: 'videos',
            _id: '598200798612d0d9c9cfaf7c',
            _score: 111.308304,
            _source: video,
          },
        ],
      },
    });
  });

  it('should be defined', () => {
    expect(getSearchVideos).toBeDefined();
  });

  it('should return an object when type is models', async () => {
    const messageText = '小美';
    const page = 1;

    const { results, totalCount } = await getSearchVideos(messageText, page);

    expect(getElasticsearchDatabase).toBeCalled();
    expect(getElasticsearchDatabase().search).toBeCalled();
    expect(results).toEqual([video]);
    expect(totalCount).toBe(1);
  });

  it('should return an empty object when total is 0', async () => {
    getElasticsearchDatabase().search.mockReturnValue({
      hits: {
        total: 0,
        hits: [],
      },
    });
    const messageText = '123';
    const page = 1;

    const { results, totalCount } = await getSearchVideos(messageText, page);
    expect(getElasticsearchDatabase).toBeCalled();
    expect(getElasticsearchDatabase().search).toBeCalled();
    expect(results).toEqual([]);
    expect(totalCount).toBe(0);
  });
});

describe('getHotVideos', () => {
  beforeEach(() => {
    const db = {
      collection: jest.fn().mockReturnThis(),
      find: jest.fn().mockReturnThis(),
      aggregate: jest.fn().mockReturnThis(),
      toArray: jest.fn(),
    };

    getMongoDatabase.mockReturnValue(db);
  });

  it('should be defined', () => {
    expect(getHotVideos).toBeDefined();
  });

  it('should return an object', async () => {
    const logs = {
      _id: ObjectId('59e0dce0b4af652780a56cd4'),
      userId: 123456789,
      videoId: video._id,
      url: video.videos[0].url,
      createdAt: new Date('2017-10-29T15:33:52.976Z'),
    };
    const videoRes = {
      ...video,
      videos: [
        {
          source: 'youav',
          url: `${config.url}/redirect/?url=${encodeURIComponent(
            video.videos[0].url
          )}&_id=${video._id}`,
          view_count: 666,
        },
      ],
    };

    getMongoDatabase()
      .collection()
      .aggregate()
      .toArray.mockReturnValue([logs]);
    getMongoDatabase()
      .collection()
      .aggregate()
      .toArray.mockReturnValue([video]);

    const res = await getHotVideos();

    expect(getMongoDatabase).toBeCalled();
    expect(getMongoDatabase().collection).toBeCalledWith('logs');
    expect(getMongoDatabase().collection().aggregate).toBeCalledWith([
      { $match: { createdAt: { $gte: expect.any(Date) } } },
      {
        $group: {
          _id: '$videoId',
          videoId: { $first: '$videoId' },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 100 },
      { $sample: { size: 5 } },
    ]);
    expect(getMongoDatabase().collection).toBeCalledWith('videos');
    expect(getMongoDatabase().collection().find).toBeCalledWith({
      _id: { $in: [video._id] },
    });
    expect(
      getMongoDatabase()
        .collection()
        .find().toArray
    ).toBeCalled();
    expect(res).toEqual({ results: [videoRes] });
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

    expect(getMongoDatabase).toBeCalled();
    expect(getMongoDatabase().collection).toBeCalledWith('videos');
    expect(getMongoDatabase().collection().find).toBeCalledWith({
      _id: { $in: videosIds },
    });
    expect(
      getMongoDatabase()
        .collection()
        .find().toArray
    ).toBeCalled();
  });
});
