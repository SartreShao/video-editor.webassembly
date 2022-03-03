/* eslint-disable no-async-promise-executor */
/**
 * 获取一个视频的时长，单位微秒
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
        resolve(tempAudio.duration * 1000000);
      });
    } catch (error) {
      console.log("getVideoDuration error", error);
      throw error;
    }
  });

/**
 * 获取多个视频的时长，单位微秒
 * @param {*} videoFile
 * @returns
 */
const getVideoListDuration = videoFileList =>
  new Promise(async (resolve, reject) => {
    try {
      let totalDuration = 0;
      for (let i = 0; i < videoFileList.length; i++) {
        const videoFile = videoFileList[i];
        const duration = await getVideoDuration(videoFile);
        totalDuration += duration;
      }
      console.log("getVideoListDuration success", totalDuration);
      resolve(totalDuration * 1000000);
    } catch (error) {
      console.log("getVideoListDuration error", error);
      reject(error);
    }
  });

/**
 * 将 videoFileList 中的视频，加入到 CoreData 中去
 * @param {*} coreData
 * @param {*} videoFileList
 * @param {*} currentSectionIndex
 * @returns
 */
const addVideoToCoreData = (coreData, videoFileList, currentSectionIndex) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log("addVideoToCoreData", coreData, videoFileList);

      // 准备加入 CoreData 的视频素材
      const tempVisionTrackMaterials = [];

      // 获取视频素材中最大的 timeLineOut
      let maxTimeLineOut = 0;

      const visionTrackMaterials =
        coreData.sections[currentSectionIndex - 1].sectionTimeline.visionTrack
          .visionTrackMaterials;

      for (let i = 0; i < visionTrackMaterials.length; i++) {
        const timeLineOut = visionTrackMaterials[i].timeLineOut;
        if (timeLineOut > maxTimeLineOut) {
          maxTimeLineOut = timeLineOut;
        }
      }

      // 构建 tempVisionTrackMaterials
      for (let i = 0; i < videoFileList.length; i++) {
        const videoFile = videoFileList[i];

        // 当前素材的时长
        const duration = await getVideoDuration(videoFile);

        // 当前素材的 timeLineIn 为 maxTimeLineOut，当然如果没有前面的素材，timeLineIn 为 0
        const timeLineIn =
          i === 0
            ? maxTimeLineOut
            : tempVisionTrackMaterials[i - 1].timeLineOut;

        const timeLineOut = timeLineIn + duration;

        tempVisionTrackMaterials.push({
          duration: duration,
          timeLineIn: timeLineIn,
          timeLineOut: timeLineOut,
          url: URL.createObjectURL(videoFile)
        });
      }

      // 将 tempVisionTrackMaterials 加入 coreDataa
      for (let i = 0; i < tempVisionTrackMaterials.length; i++) {
        coreData.sections[
          currentSectionIndex - 1
        ].sectionTimeline.visionTrack.visionTrackMaterials.push(
          tempVisionTrackMaterials[i]
        );
      }

      console.log("addVideoToCoreData success");
      resolve();
    } catch (error) {
      console.log("addVideoToCoreData error", error);
      reject(error);
    }
  });

export default {
  getVideoDuration,
  getVideoListDuration,
  addVideoToCoreData
};
