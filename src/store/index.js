import { provide, ref, computed } from "vue";
import Mapping from "@/map";

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

// 时间轴素材最大帧数
const maxFrameOfMaterial = Symbol();

function useProvider() {
  const $maxFrameOfMaterial = ref(5400);
  const $timeLineContainer_width = ref(0);
  const $timeLine_width = computed(() => $timeLineContainer_width.value - 37);
  const $timescale_width = computed(() =>
    Mapping.getTimeScaleWidth(
      $frameWidth.value,
      $timeLine_width.value,
      $maxFrameOfMaterial.value
    )
  );
  const $frameWidth = ref(0.3);

  provide(timeLineContainer_width, $timeLineContainer_width);
  provide(timeLine_width, $timeLine_width);
  provide(timescale_width, $timescale_width);
  provide(frameWidth, $frameWidth);
  provide(timeLineOffsetLeft, ref(0));
  provide(gridWidth, ref(0));
  provide(gridFrame, ref(0));
  provide(groupGridFrame, ref(0));
  provide(maxFrameOfMaterial, $maxFrameOfMaterial);
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
  groupGridFrame,
  maxFrameOfMaterial
};
