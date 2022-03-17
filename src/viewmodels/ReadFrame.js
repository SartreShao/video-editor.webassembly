import WASM from "@/wasm";

const excuteReadFrameTask = (
  readFrameTaskStack,
  isReadFrameBusy,
  currentReadFrameVideoIndex,
  readFrameWorker,
  videoFrameWidth,
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
      52,
      task.readFrameList,
      isReadFrameBusy,
      (blobUrl, frame) => {
        const key = JSON.stringify({
          videoIndex: currentReadFrameVideoIndex.value,
          frame: frame
        });

        const value = blobUrl;

        videoFrameBuffer.value.set(key, value);
      }
    );
  }
};

export default {
  excuteReadFrameTask
};
