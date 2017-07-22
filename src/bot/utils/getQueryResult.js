import * as videos from '../../models/videos';

const getQueryResult = async (message, messageText, type, page) => {
  let videosObj;
  let typeStr;

  if (type === 'code') {
    videosObj = await videos.getVideo(type, messageText, page);
    typeStr = '番號';
  } else if (type === 'models') {
    videosObj = await videos.getVideo(type, messageText, page);
    typeStr = '女優';
  } else if (type === 'title') {
    videosObj = await videos.getVideo(type, messageText, page);
    typeStr = '片名';
  } else {
    videosObj = await videos.getRandomThreeVideos();
    let urlStr = '';

    videosObj.results.forEach(video => {
      urlStr += `${video.url}\n`;
    });

    return [urlStr];
  }

  let str = '';
  if (!videosObj.results) {
    str = `搜尋不到此${typeStr}`;
    return [str];
  }
  str = `幫你搜尋${typeStr}：${videosObj.searchValue}`;

  const totalStr = `總共搜尋到：${videosObj.results.total_count} 個連結喔喔喔`;

  return [str, videosObj.results, totalStr];
};

export default getQueryResult;
