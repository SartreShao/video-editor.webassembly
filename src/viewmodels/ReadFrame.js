import WASM from "@/wasm";
import Mapping from "@/map";

/**
 * 优化 TaskStack 栈：去掉其中重复阅读的帧
 * @param {*} currentTask 
 * @param {*} readFrameTaskStack 
 * @param {*} videoFrameBuffer 
 * @returns 
 */
const optimizeTaskStack = (
  currentTask,
  readFrameTaskStack,
  videoFrameBuffer
) => {
  const currentTaskHashMap = new Map();
  currentTask.readFrameList.forEach(frame =>
    currentTaskHashMap.set(
      JSON.stringify({ videoIndex: currentTask.videoIndex, frame: frame }),
      ""
    )
  );

  for (let i = 0; i < readFrameTaskStack.length; i++) {
    const task = readFrameTaskStack[i];
    const readFrameList = task.readFrameList.filter(frame => {
      const isFrameInVideoFrameBuffer = videoFrameBuffer.has(
        JSON.stringify({ videoIndex: task.videoIndex, frame: frame })
      );
      const isFrameInCurrentTask = currentTaskHashMap.has(
        JSON.stringify({ videoIndex: task.videoIndex, frame: frame })
      );
      return !isFrameInVideoFrameBuffer && !isFrameInCurrentTask;
    });
    task.readFrameList = readFrameList;
  }

  return readFrameTaskStack.filter(task => task.readFrameList.length !== 0);
};

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
    // 优化 readFrameTaskStack
    // debugger;
    readFrameTaskStack.value = optimizeTaskStack(
      task,
      readFrameTaskStack.value,
      videoFrameBuffer.value
    );
    // 优化完成
    // debugger;

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
