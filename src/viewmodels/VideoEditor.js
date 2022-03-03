import Api from "@/api";

/**
 * 上传 VideoList
 * @param {*} videoList 
 * @param {*} currentVideoUrl 
 * @param {*} coreData 
 * @param {*} frameWidth 
 * @param {*} fitFrameWidth 
 */
const uploadVideoList = async (
  videoList,
  currentVideoUrl,
  coreData,
  frameWidth,
  fitFrameWidth
) => {
  // 暂时先仅加载第一个视频的 URL
  if (videoList.length > 0) {
    currentVideoUrl.value = URL.createObjectURL(videoList[0]);
  }

  console.log("currentVideoUrl loaded", currentVideoUrl.value);

  await Api.addVideoToCoreData(coreData, videoList);
  frameWidth.value = fitFrameWidth.value;
};

export default { uploadVideoList };
