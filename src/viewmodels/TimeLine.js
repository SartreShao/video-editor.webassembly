/**
 * 放大时间轴
 * @param {*} frameWidth
 * @param {*} minFrameWidth
 * @param {*} maxFrameWidth
 */
const zoomIn = (frameWidth, maxFrameWidth) => {
  const targetFrameWidth = frameWidth.value * 2;
  frameWidth.value =
    targetFrameWidth > maxFrameWidth.value
      ? maxFrameWidth.value
      : targetFrameWidth;
};

/**
 * 缩小时间轴
 * @param {*} frameWidth
 * @param {*} minFrameWidth
 * @param {*} maxFrameWidth
 */
const zoomOut = (frameWidth, minFrameWidth) => {
  const targetFrameWidth = frameWidth.value / 2;
  frameWidth.value =
    targetFrameWidth < minFrameWidth.value
      ? minFrameWidth.value
      : targetFrameWidth;
};

/**
 * 缩放时间轴到合适距离
 * @param {*} frameWidth
 * @param {*} fitFrameWidth
 */
const zoomFit = (frameWidth, fitFrameWidth) => {
  frameWidth.value = fitFrameWidth.value;
};

export default { zoomIn, zoomOut, zoomFit };
