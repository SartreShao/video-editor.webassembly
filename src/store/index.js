import { provide, ref, computed } from "vue";

/**
 * This file define global states in project
 */

// 帧宽度
const frameWidth = Symbol();

// 格子宽度
const gridWidth = Symbol();

// 格子内帧数
const gridFrame = Symbol();

// 组格子内帧数
const groupGridFrame = Symbol();

// 时间轴容器宽度
const timeLineContainer_width = Symbol();

// 时间轴宽度
const timeLine_width = Symbol();

// 时间轴刻度尺宽度
const timescale_width = Symbol();

// 时间轴偏移量
const timeLineOffsetLeft = Symbol();

function useProvider() {
  const timeLineContainer_width_value = ref(0);
  const timeLine_width_value = computed(
    () => timeLineContainer_width_value.value - 37
  );

  provide(timeLineContainer_width, timeLineContainer_width_value);
  provide(timeLine_width, timeLine_width_value);
  provide(timescale_width, ref(0));
  provide(frameWidth, ref(0.003));
  provide(timeLineOffsetLeft, ref(0));
  provide(gridWidth, ref(0));
  provide(gridFrame, ref(0));
  provide(groupGridFrame, ref(0));
}

export default {
  useProvider,
  timeLineContainer_width,
  timeLine_width,
  timescale_width,
  frameWidth,
  timeLineOffsetLeft,
  gridWidth,
  gridFrame,
  groupGridFrame
};
