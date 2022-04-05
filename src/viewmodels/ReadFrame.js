import WASM from "@/wasm";
import Mapping from "@/map";

const excuteReadFrameTask = (
  readFrameTaskStack,
  isReadFrameBusy,
  currentReadFrameVideoIndex,
  readFrameWorker,
  videoFrameWidth,
  videoFrameHeight,
  videoFrameBuffer,
  rightCount,
  errorCount
) => {
  if (
    isReadFrameBusy.value === false &&
    readFrameTaskStack.value.length !== 0
  ) {
    const task = readFrameTaskStack.value.pop();
    const readFrameList = task.readFrameList
      .map(frame => Mapping.frame2ms(frame, 30))
      .join(",");
    currentReadFrameVideoIndex.value = task.videoIndex;
    WASM.readFrame(
      readFrameWorker.value,
      task.file,
      videoFrameWidth,
      videoFrameHeight,
      readFrameList,
      isReadFrameBusy,
      currentReadFrameVideoIndex,
      (blobUrl, frame, videoIndex) => {
        // if (videoIndex !== currentReadFrameVideoIndex.value) {
        //   console.log("shit", videoIndex, currentReadFrameVideoIndex.value);
        // }
        const key = JSON.stringify({
          videoIndex: videoIndex,
          frame: frame
        });

        const value = blobUrl;

        // console.log("key: " + key);
        // console.log("value: " + value);

        if (!videoFrameBuffer.value.has(key)) {
          videoFrameBuffer.value.set(key, value);
          rightCount.value++;
        } else {
          errorCount.value++;
        }
      }
    );
  }
};

export default {
  excuteReadFrameTask
};
