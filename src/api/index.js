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

const addVideoToCoreData = (coreData, videoFileList, currentSectionIndex) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log("addVideoToCoreData", coreData, videoFileList);
      for (let i = 0; i < videoFileList.length; i++) {
        const videoFile = videoFileList[i];
        // 当前素材的时长
        const duration = await getVideoDuration(videoFile);

        // 当前素材的 timeLineIn 为前一个素材的 timeLineOut，当然如果没有前面的素材，timeLineIn 为 0
        const timeLineIn =
          coreData.sections[currentSectionIndex - 1].sectionTimeline.visionTrack
            .visionTrackMaterials.length === 0
            ? 0
            : coreData.sections[currentSectionIndex - 1].sectionTimeline
                .visionTrack.visionTrackMaterials[i - 1].timeLineOut;

        // 当前素材的 timeLineOut 为本素材的 timeLineIn + duration
        const timeLineOut = timeLineIn + duration;

        coreData.sections[
          currentSectionIndex - 1
        ].sectionTimeline.visionTrack.visionTrackMaterials.push({
          duration: duration,
          timeLineIn: timeLineIn,
          timeLineOut: timeLineOut
        });
        console.log(
          "duration、timeLineIn、timeLineOut",
          duration,
          timeLineIn,
          timeLineOut
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
