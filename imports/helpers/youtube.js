import { CATEGORY_TO_VIDEO } from '../constants/categories.js';

export const parseYoutubeUrl = (url) => {
  // youtube url can come in different forms:
  // i think these are the two i should worry about supporting for now
  // 1) https://www.youtube.com/watch?v=A3aC2OL1LBw
  // 1.5) https://www.youtube.com/watch?v=A3aC2OL1LBw&t=650s (could be more parameters)
  // 2) https://youtu.be/A3aC2OL1LBw
  let result = {
    youtubeVideoId: '',
    isValid: false
  }

  if (url && url.includes('www.youtube.com')) {
    const split = url.split('v=')
    if (split.length > 1) {
      const target = split[1]
      const targetSplit = target.split('&')
      result.youtubeVideoId = targetSplit[0]
      result.isValid = true
    }
  } else if (url && url.includes('youtu.be')) {
    const split = url.split('be/')
    if (split.length > 1) {
      const target = split[1]
      const targetSplit = target.split('&')
      result.youtubeVideoId = targetSplit[0]
      result.isValid = true
    }
  }

  return result
}

export const getRandomVideoUrlFromCategory = (category) => {
  let videoUrl = '';

  if (CATEGORY_TO_VIDEO[category]) {
    const videoList = CATEGORY_TO_VIDEO[category]['video_urls'];
    videoUrl = videoList[Math.floor(Math.random() * videoList.length)];
  }

  return videoUrl;
}
