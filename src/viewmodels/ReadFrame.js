import WASM from "@/wasm";

const excuteReadFrameTask = (
  readFrameTaskStack,
  isReadFrameBusy,
  currentReadFrameVideoIndex,
  readFrameWorker,
  videoFrameWidth,
  videoFrameBuffer
) => {
  const task = readFrameTaskStack.value.pop();
  isReadFrameBusy.value = true;
  currentReadFrameVideoIndex.value = task.videoIndex;
  WASM.readFrame(
    readFrameWorker.value,
    task.file,
    videoFrameWidth,
    52,
    task.readFrameList,
    (blobUrl, frame, isWorkEnd) => {
      if (isWorkEnd) {
        isReadFrameBusy.value = false;
      } else {
        const key = JSON.stringify({
          videoIndex: currentReadFrameVideoIndex.value,
          frame: frame
        });

        const value = blobUrl;

        videoFrameBuffer.value.set(key, value);
      }
    }
  );
};

export default {
  excuteReadFrameTask
};
