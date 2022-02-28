/* eslint-disable no-async-promise-executor */
/**
 * 获取一个视频的时长，单位毫秒
 * @param {*} videoFile
 * @returns
 */
const getVideoDuration = videoFile =>
  new Promise((resolve, reject) => {
    try {
      const url = URL.createObjectURL(videoFile);
      const tempAudio = new Audio(url);
      tempAudio.addEventListener("loadedmetadata", () => {
        console.log("getVideoDuration success", tempAudio.duration);
        resolve(tempAudio.duration * 1000);
      });
    } catch (error) {
      console.log("getVideoDuration error", error);
      throw error;
    }
  });

/**
 * 获取多个视频的时长，单位毫秒
 * @param {*} videoFile
 * @returns
 */
const getVideoListDuration = videoFileList =>
  new Promise(async (resolve, reject) => {
    try {
      let totalDuration = 0;
      for (let i = 0; i < videoFileList.length; i++) {
        const videoFile = videoFileList[i];
        console.log("videoFile", typeof videoFile);
        const duration = await getVideoDuration(videoFile);
        totalDuration += duration;
      }
      console.log("getVideoListDuration success", totalDuration);
      resolve(totalDuration * 1000);
    } catch (error) {
      console.log("getVideoListDuration error", error);
      reject(error);
    }
  });

export default {
  getVideoDuration,
  getVideoListDuration
};
