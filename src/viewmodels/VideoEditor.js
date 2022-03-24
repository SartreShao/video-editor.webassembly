import Api from "@/api";

/**
 * 上传 VideoList
 * @param {*} videoList
 * @param {*} currentVideoUrl
 * @param {*} coreData
 * @param {*} frameWidth
 * @param {*} fitFrameWidth
 */
const addVideoOnCurrentSection = async (
  videoList,
  currentVideoUrl,
  coreData,
  frameWidth,
  fitFrameWidth,
  currentSectionIndex,
  videoInputElement
) => {
  // 暂时先仅加载第一个视频的 URL
  if (videoList.length > 0) {
    currentVideoUrl.value = URL.createObjectURL(videoList[0]);
  }

  // console.log("currentVideoUrl loaded", currentVideoUrl.value);

  await Api.addVideoToCoreData(coreData, videoList, currentSectionIndex.value);
  
  frameWidth.value = fitFrameWidth.value;

  videoInputElement.value.value = null;
};

const clearVideoOfCurrentSection = async (
  currentVideoUrl,
  coreData,
  currentSectionIndex,
  frameWidth,
  fitFrameWidth
) => {
  // 清空当前的 currentVideoUrl
  currentVideoUrl.value = null;

  // 清空当前的 coreDaata
  coreData.sections[
    currentSectionIndex.value - 1
  ].sectionTimeline.visionTrack.visionTrackMaterials = [];

  frameWidth.value = fitFrameWidth.value;
};

export default { addVideoOnCurrentSection, clearVideoOfCurrentSection };
