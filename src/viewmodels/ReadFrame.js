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
    console.log("debug height", task.height);
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

const renderFramesMap = (oldFramesMap, flatFrameList, videoFrameBuffer) => {
  // crete newFramesMap
  const newFramesMap = createFramesMap(
    flatFrameList.value,
    videoFrameBuffer.value
  );

  updateFramesMap(oldFramesMap.value, newFramesMap);
};

const createFramesMap = (flatFrameList, videoFrameBuffer) => {
  const newFramesMap = new Map();

  for (let i = 0; i < flatFrameList.length; i++) {
    const flatFrame = flatFrameList[i];

    // construct FramesMap's Item: key is videoIndex which from flatFrame
    const currentFramesMapItem = newFramesMap.has(flatFrame.videoIndex)
      ? newFramesMap.get(flatFrame.videoIndex)
      : new Map();

    // get blobUrl from videoFrameBuffer: key is { videoIndex, frame } which from flatFrame
    const videoFrameBufferKey = JSON.stringify({
      videoIndex: flatFrame.videoIndex,
      frame: flatFrame.frame
    });

    const blobUrl = videoFrameBuffer.has(videoFrameBufferKey)
      ? videoFrameBuffer.get(videoFrameBufferKey)
      : "";

    // construct newFramesMap
    currentFramesMapItem.set(flatFrame.frame, {
      blobUrl: blobUrl,
      position: flatFrame.position
    });

    newFramesMap.set(flatFrame.videoIndex, currentFramesMapItem);
  }

  return newFramesMap;
};

const updateFramesMap = (oldFramesMap, newFramesMap) => {
  // 新无旧有，则旧删
  oldFramesMap.forEach((value, key) => {
    if (!newFramesMap.has(key)) {
      oldFramesMap.delete(key);
    }
  });

  // 新有旧无，则旧增
  newFramesMap.forEach((value, key) => {
    if (!oldFramesMap.has(key)) {
      oldFramesMap.set(key, value);
    }
  });

  // 增量更新子节点
  oldFramesMap.forEach((value, key) => {
    updateChildMap(oldFramesMap.get(key), newFramesMap.get(key));
  });
};

const updateChildMap = (oldChildMap, newChildMap) => {
  // 新无旧有，则旧删
  oldChildMap.forEach((value, key) => {
    if (!newChildMap.has(key)) {
      oldChildMap.delete(key);
    }
  });

  // 新有旧无，则旧增
  newChildMap.forEach((value, key) => {
    if (!oldChildMap.has(key)) {
      oldChildMap.set(key, value);
    }
  });

  // 遍历旧节点，如果 value 不对，则更新 value
  oldChildMap.forEach((value, key) => {
    if (!isBlobUrlSame(oldChildMap.get(key), newChildMap.get(key))) {
      oldChildMap.get(key).blobUrl = newChildMap.get(key).blobUrl;
    }

    if (!isPositionSame(oldChildMap.get(key), newChildMap.get(key))) {
      oldChildMap.get(key).position = newChildMap.get(key).position;
    }
  });
};

const isBlobUrlSame = (oldVal, newVal) => {
  return oldVal.blobUrl === newVal.blobUrl;
};

const isPositionSame = (oldVal, newVal) => {
  return oldVal.position === newVal.position;
};
export default {
  excuteReadFrameTask,
  renderFramesMap
};
