import WASM from "@/wasm";

const excuteReadFrameTask = (
  readFrameTaskStack,
  isReadFrameBusy,
  currentReadFrameVideoIndex,
  readFrameWorker,
  videoFrameWidth,
  videoFrameHeight,
  videoFrameBuffer
) => {
  if (
    isReadFrameBusy.value === false &&
    readFrameTaskStack.value.length !== 0
  ) {
    const task = readFrameTaskStack.value.pop();
    currentReadFrameVideoIndex.value = task.videoIndex;
    WASM.readFrame(
      readFrameWorker.value,
      task.file,
      videoFrameWidth,
      videoFrameHeight,
      task.readFrameList,
      isReadFrameBusy,
      (blobUrl, frame) => {
        const key = JSON.stringify({
          videoIndex: currentReadFrameVideoIndex.value,
          frame: frame
        });

        const value = blobUrl;
        if (!videoFrameBuffer.value.has(key)) {
          videoFrameBuffer.value.set(key, value);
        }
      }
    );
  }
};

export default {
  excuteReadFrameTask
};
