/**
 * 计算时间轴包裹器宽度
 * @param {number} clientWidth 请传入 document.body.clientWidth
 * @returns 时间轴的宽度
 */
const calcTimeLineContainerWidth = clientWidth => {
  // 常量：除了时间轴外其他组件的宽度
  const OTHER_WIDTH = 783;
  return clientWidth - OTHER_WIDTH;
};

/**
 * 将帧数转换为时间
 * @param {number} frame 当前要转换的帧数
 * @param {number} fps 帧率
 * @returns 格式化的时间
 */
const frame2Time = (frame, fps) =>
  frame % fps === 0 ? second2hms(frame / fps) : (frame % fps) + "f";

const second2hms = second => {
  const h =
    Math.floor(second / 3600) >= 10
      ? String(Math.floor(second / 3600))
      : "0" + Math.floor(second / 3600);
  const m =
    Math.floor((second / 60) % 60) >= 10
      ? String(Math.floor((second / 60) % 60))
      : "0" + Math.floor((second / 60) % 60);
  const s =
    Math.floor(second % 60) >= 10
      ? String(Math.floor(second % 60))
      : "0" + Math.floor(second % 60);

  return h === "00" ? m + ":" + s : h + ":" + m + ":" + s;
};

/**
 * 格子渲染器需要把帧，渲染为格子：
 * @param {number} frameWidth 帧宽度
 * @returns {Object}
 *  result.gridWidth 格子宽度
 *  result.gridFrame 格子所包含的帧数
 *  result.groupGridFrame 格子组所包含的帧数
 */
const frameWidth2Grid = frameWidth => {
  // 常量，用于表明渲染分段函数
  const gridSegmentList = [
    // level1
    {
      maxWidth: 200,
      minWidth: 43,
      gridFrame: 1,
      groupGridFrame: 2
    },
    // level2
    {
      maxWidth: 43,
      minWidth: 33,
      gridFrame: 1,
      groupGridFrame: 3
    },
    // level3
    {
      maxWidth: 33,
      minWidth: 27,
      gridFrame: 1,
      groupGridFrame: 5
    },
    // level4
    {
      maxWidth: 27,
      minWidth: 20,
      gridFrame: 1,
      groupGridFrame: 10
    },
    // level5
    {
      maxWidth: 20,
      minWidth: 10,
      gridFrame: 3,
      groupGridFrame: 15
    },
    // level6
    {
      maxWidth: 10,
      minWidth: 5,
      gridFrame: 3,
      groupGridFrame: 30
    },
    // level7
    {
      maxWidth: 5,
      minWidth: 30 / 9,
      gridFrame: 6,
      groupGridFrame: 60
    },
    // level8
    {
      maxWidth: 30 / 9,
      minWidth: 2,
      gridFrame: 9,
      groupGridFrame: 90
    },
    // level9
    {
      maxWidth: 2,
      minWidth: 1,
      gridFrame: 15,
      groupGridFrame: 150
    },
    // level10
    {
      maxWidth: 1,
      minWidth: 30 / 90,
      gridFrame: 30,
      groupGridFrame: 300
    },
    // level11
    {
      maxWidth: 30 / 90,
      minWidth: 30 / 180,
      gridFrame: 90,
      groupGridFrame: 900
    },
    // level12
    {
      maxWidth: 30 / 180,
      minWidth: 30 / 360,
      gridFrame: 180,
      groupGridFrame: 1800
    },
    // level13
    {
      maxWidth: 30 / 360,
      minWidth: 30 / 540,
      gridFrame: 360,
      groupGridFrame: 3600
    },
    // level14
    {
      maxWidth: 30 / 540,
      minWidth: 30 / 900,
      gridFrame: 540,
      groupGridFrame: 5400
    },
    // level15
    {
      maxWidth: 30 / 900,
      minWidth: 30 / 1800,
      gridFrame: 900,
      groupGridFrame: 9000
    },
    // level16
    {
      maxWidth: 30 / 1800,
      minWidth: 30 / 5400,
      gridFrame: 1800,
      groupGridFrame: 18000
    },
    // level17
    {
      maxWidth: 30 / 5400,
      minWidth: 30 / 21600,
      gridFrame: 5400,
      groupGridFrame: 54000
    },
    // level18
    {
      maxWidth: 30 / 21600,
      minWidth: 30 / 32400,
      gridFrame: 21600,
      groupGridFrame: 216000
    },
    // level19
    {
      maxWidth: 30 / 32400,
      minWidth: 30 / 54000,
      gridFrame: 32400,
      groupGridFrame: 324000
    },
    // level20
    {
      maxWidth: 30 / 54000,
      minWidth: 30 / 108000,
      gridFrame: 54000,
      groupGridFrame: 540000
    },
    // level21
    {
      maxWidth: 30 / 108000,
      minWidth: 30 / 324000,
      gridFrame: 108000,
      groupGridFrame: 1080000
    },
    // level22
    {
      maxWidth: 30 / 324000,
      minWidth: 30 / 32400000000000000000,
      gridFrame: 324000,
      groupGridFrame: 3240000
    }
  ];

  // 临时变量，用于存储函数结果
  let tempGridSegment;

  // 遍历常量，查找 frameWidth 所在的分段函数
  for (const gridSegment of gridSegmentList) {
    if (
      frameWidth <= gridSegment.maxWidth &&
      frameWidth > gridSegment.minWidth
    ) {
      tempGridSegment = gridSegment;
      break;
    }
  }

  if (!tempGridSegment) {
    throw new Error("Please input frameWidth in [0,200]");
  }

  return {
    gridWidth: tempGridSegment.gridFrame * frameWidth,
    gridFrame: tempGridSegment.gridFrame,
    groupGridFrame: tempGridSegment.groupGridFrame
  };
};

/**
 * 时间轴总格数
 * input @帧宽度 frameWidth
 * input @时间轴宽度 timeLineWidth
 * input @素材最大时刻 materialMaxFrame
 * output @时间轴格子数量 girdTotalNumber
 */
const gridTotalNumber = (frameWidth, timeLineWidth, materialMaxFrame) => {
  // 格宽度
  const gridWidth = frameWidth2Grid(frameWidth).gridWidth;

  // 计算一屏幕有多少格
  const oneScreenGridNumber = Math.floor(timeLineWidth / gridWidth);

  // 计算空白处有多少格
  const emptyScreenGridNumber = Math.floor(oneScreenGridNumber / 3);

  // 计算素材有多少格
  const materialGridNumber = (materialMaxFrame, frameWidth, gridWidth) => {
    // 素材宽度
    const materialWidth = materialMaxFrame * frameWidth;

    // 素材格数（向上取整）
    const materialGridNumber = Math.ceil(materialWidth / gridWidth);

    return materialGridNumber;
  };

  // 总格数
  const gridTotalNumber =
    emptyScreenGridNumber +
    materialGridNumber(materialMaxFrame, frameWidth, gridWidth);

  return gridTotalNumber;
};

/**
 * 时间刻度总宽度
 * input @帧宽度 frameWidth
 * input @时间轴宽度 timeLineWidth
 * input @素材最大时刻 materialMaxFrame
 * output @时间轴格子数量 girdTotalNumber
 */
const getTimeScaleWidth = (frameWidth, timeLineWidth, materialMaxFrame) => {
  console.log("getTimeScaleWidth called");
  // 格宽度
  const gridWidth = frameWidth2Grid(frameWidth).gridWidth;

  // 计算一屏幕有多少格
  const oneScreenGridNumber = Math.floor(timeLineWidth / gridWidth);

  // 计算空白处有多少格
  const emptyScreenGridNumber = Math.floor(oneScreenGridNumber / 3);

  // 计算素材有多少格
  const materialGridNumber = (materialMaxFrame, frameWidth, gridWidth) => {
    // 素材宽度
    const materialWidth = materialMaxFrame * frameWidth;

    // 素材格数（向上取整）
    const materialGridNumber = Math.ceil(materialWidth / gridWidth);

    return materialGridNumber;
  };

  // 总格数
  const gridTotalNumber =
    emptyScreenGridNumber +
    materialGridNumber(materialMaxFrame, frameWidth, gridWidth);

  const result = gridTotalNumber * gridWidth;
  return timeLineWidth >= result ? timeLineWidth : result;
};

const getTimeScalePlaceHolderWidth = (offsetLeft, gridWidth) =>
  Math.floor(offsetLeft / gridWidth) * gridWidth;

// 当前绘制的是第几个格子
const gridBufferFirstIndex = (offsetLeft, gridWidth) => {
  const placeholderWidth = Math.floor(offsetLeft / gridWidth) * gridWidth;
  return Math.floor(placeholderWidth / gridWidth) + 1;
};

// 格子缓存数量
const getGridBufferNumber = (timescale_width, gridWidth) =>
  Math.ceil(timescale_width / gridWidth) + 1;

/**
 * 渲染格子
 * @param {ref<List>} gridBufferList 最终要渲染的 GridBufferList
 * @param {*} gridWidth 每个格子的宽度
 * @param {number} groupGridFrame 每个 GridGroup 里包含多少 Frame
 * @param {number} gridFrame 每个 Grid 里包含多少 Frame
 * @param {width} timeLineOffsetLeft 时间轴的左偏移量
 * @param {*} timescale_width 时间轴的实际宽度（不是显示宽度）
 */
const renderGridBufferList = (
  gridBufferList,
  gridWidth,
  groupGridFrame,
  gridFrame,
  timeLineOffsetLeft,
  timescale_width
) => {
  try {
    // 获取格子倍数；例如：2 倍，就是 2 的倍数都会绘制大格
    const gridMultiple = groupGridFrame / gridFrame;

    // 初始位置
    const firstIndex = gridBufferFirstIndex(timeLineOffsetLeft, gridWidth);

    // 结束位置
    const gridBufferNumber = getGridBufferNumber(timescale_width, gridWidth);

    // 动态计算数组长度
    if (gridBufferNumber > gridBufferList.value.length) {
      const dValue = gridBufferNumber - gridBufferList.value.length;
      for (let i = 1; i <= dValue; i++) {
        gridBufferList.value.push({
          frame: 0,
          showNumber: false,
          width: 0
        });
      }
    } else if (gridBufferNumber < gridBufferList.value.length) {
      const dValue = gridBufferList.value.length - gridBufferNumber;
      gridBufferList.value.splice(gridBufferList.value.length - dValue, dValue);
    } else {
      // doing nothing
    }

    // 渲染过程
    for (let i = firstIndex; i <= gridBufferNumber + firstIndex - 1; i++) {
      const grid = gridBufferList.value[i - firstIndex];
      if (i - 1 === 0) {
        grid.frame = 0;
        grid.showNumber = true;
        grid.width = gridWidth;
      } else if ((i - 1) % gridMultiple === 0) {
        grid.frame = (i - 1) * gridFrame;
        grid.showNumber = true;
        grid.width = gridWidth;
      } else {
        grid.frame = (i - 1) * gridFrame;
        grid.showNumber = false;
        grid.width = gridWidth;
      }
    }
  } catch (error) {
    // doing nothing
    console.log(error);
  }
};

/**
 * 获取时间轴最小帧宽度
 * @param {number} maxMaterialFrame 时间轴上素材的最大帧数，单位 frame
 * @param {number} timeLineWidth 时间轴的长度，单位 px
 * @returns
 */
const getMinFrameWidth = (maxMaterialFrame, timeLineWidth) => {
  const maxMaterialFrameWidth = timeLineWidth * (1 / 3);
  return maxMaterialFrameWidth / maxMaterialFrame;
};

/**
 * 获取时间轴合适帧宽度
 * 常量：200px
 */
const getMaxFrameWidth = () => 200;

/**
 * 获取时间轴合适帧宽度
 * @param {number} maxMaterialFrame
 * @param {number} timeLineWidth
 * @returns
 */
const getFitFrameWidth = (maxMaterialFrame, timeLineWidth) => {
  const maxMaterialFrameWidth = timeLineWidth * (4 / 5);
  return maxMaterialFrameWidth / maxMaterialFrame;
};

/**
 * 微秒转帧数
 * @param {*} μs 需要转换的微秒数
 * @param {number} fps 帧率
 * @returns 帧数
 */
const μs2Frame = (ms, fps) => ms * (fps / 1000000);

/**
 * 获取时间轴上，视觉素材的宽度
 * @param {number} timeLineIn 素材在时间轴上的入点
 * @param {*} timeLineOut 素材在时间轴上的出点
 * @param {*} frameWidth 帧宽度
 * @returns
 */
const getVideoItemWidth = (timeLineIn, timeLineOut, frameWidth) =>
  μs2Frame(timeLineOut - timeLineIn, 30) * frameWidth;

/**
 *  获取当前最大的素材占据的帧
 * @param {Object} coreData 核心数据
 */
// TODO 本函数目前仅仅计算了视频中的最大素材，实际上应该计算全部素材的最大素材
const getMaxFrameOfMaterial = (coreData, currentSectionIndex) => {
  const visionTrackMaterials =
    coreData.sections[currentSectionIndex - 1].sectionTimeline.visionTrack
      .visionTrackMaterials;

  console.log("visionTrackMaterials", visionTrackMaterials);

  const audioTrackMaterials =
    coreData.sections[currentSectionIndex - 1].sectionTimeline.audioTrack
      .audioTrackMaterials;

  console.log("audioTrackMaterials", audioTrackMaterials);

  let maxTimeLineOut = 0;
  if (visionTrackMaterials) {
    for (let i = 0; i < visionTrackMaterials.length; i++) {
      const timeLineOut = visionTrackMaterials[i].timeLineOut;
      if (timeLineOut > maxTimeLineOut) {
        maxTimeLineOut = timeLineOut;
      }
    }
  }

  if (audioTrackMaterials) {
    for (let i = 0; i < audioTrackMaterials.length; i++) {
      if (audioTrackMaterials[i].voiceType !== "bgm") {
        const timeLineOut = audioTrackMaterials[i].timeLineOut;
        if (timeLineOut > maxTimeLineOut) {
          maxTimeLineOut = timeLineOut;
        }
      }
    }
  }

  return visionTrackMaterials.length === 0 && audioTrackMaterials.length === 0
    ? 0
    : μs2Frame(maxTimeLineOut, 30);
};

export default {
  calcTimeLineContainerWidth,
  frame2Time,
  frameWidth2Grid,
  gridTotalNumber,
  getTimeScaleWidth,
  getTimeScalePlaceHolderWidth,
  gridBufferFirstIndex,
  renderGridBufferList,
  getMinFrameWidth,
  getMaxFrameWidth,
  getFitFrameWidth,
  μs2Frame,
  getVideoItemWidth,
  getMaxFrameOfMaterial
};
