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

// 时间轴左偏移占位宽度
const timescale_placeholder_width = Symbol();

// 时间轴素材最大帧数
const maxFrameOfMaterial = Symbol();

function useProvider() {
  // init data
  const $maxFrameOfMaterial = ref(5400);
  const $timeLineContainer_width = ref(0);
  const $frameWidth = ref(0.003);
  const $timeLineOffsetLeft = ref(0);

  // computed data
  const $gridWidth = computed(
    () => Mapping.frameWidth2Grid($frameWidth.value).gridWidth
  );
  const $gridFrame = computed(
    () => Mapping.frameWidth2Grid($frameWidth.value).gridFrame
  );
  const $groupGridFrame = computed(
    () => Mapping.frameWidth2Grid($frameWidth.value).groupGridFrame
  );
  const $timeLine_width = computed(() => $timeLineContainer_width.value - 37);
  const $timescale_width = computed(() =>
    Mapping.getTimeScaleWidth(
      $frameWidth.value,
      $timeLine_width.value,
      $maxFrameOfMaterial.value
    )
  );
  const $timescale_placeholder_width = computed(() =>
    Mapping.getTimeScalePlaceHolderWidth(
      $timeLineOffsetLeft.value,
      $gridWidth.value
    )
  );

  // provide
  provide(timeLineContainer_width, $timeLineContainer_width);
  provide(timeLine_width, $timeLine_width);
  provide(timescale_width, $timescale_width);
  provide(frameWidth, $frameWidth);
  provide(timeLineOffsetLeft, $timeLineOffsetLeft);
  provide(gridWidth, $gridWidth);
  provide(gridFrame, $gridFrame);
  provide(groupGridFrame, $groupGridFrame);
  provide(maxFrameOfMaterial, $maxFrameOfMaterial);
  provide(timescale_placeholder_width, $timescale_placeholder_width);
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
  maxFrameOfMaterial,
  timescale_placeholder_width
};
