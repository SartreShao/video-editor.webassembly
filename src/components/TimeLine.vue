<template>
  <div
    class="timeline-container"
    :style="{ width: timeLineContainer_width + 'px' }"
  >
    <!-- 顶部操作区域 -->
    <section class="top-operation-area"></section>

    <section
      style="
        width: 100%;
        height: calc(100% - 31px);
        display: flex;
        flex-direction: row;
      "
    >
      <!-- 左部操作区域 -->
      <div class="left-operation-area" :style="{ width: '37px' }"></div>

      <!-- 时间轴 -->
      <div
        class="timeline"
        :style="{ width: timeLine_width + 'px' }"
        ref="timeLine"
      >
        <div class="timescale" :style="{ width: timescale_width + 'px' }">
          <!-- 宽度占位 -->
          <div
            style="flex-shrink: 0"
            :style="{ width: timescale_placeholder_width + 'px' }"
          ></div>

          <!-- 时间轴的格子 -->
          <grid
            v-for="grid in timeScaleGridList"
            v-bind:key="grid"
            :frame="grid.frame"
            :width="grid.width"
            :showNumber="grid.showNumber"
          ></grid>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import Store from "@/store";
import { inject, ref, onMounted, computed, watchEffect } from "vue";
import Grid from "@/components/Grid.vue";
import Mapping from "@/map";

// 帧宽度：决定了时间轴的比例
const frameWidth = inject(Store.frameWidth);
console.log("shit", frameWidth);

// 时间轴容器的宽度
const timeLineContainer_width = inject(Store.timeLineContainer_width);

// 时间轴
const timeLine = ref(null);

// 时间轴滚动轴左偏移量
const timeLineOffsetLeft = inject(Store.timeLineOffsetLeft);

// 时间轴宽度：用户能看见的宽度
const timeLine_width = inject(Store.timeLine_width);

// 时间刻度总宽度：包含用户看不见的宽度
const timescale_width = inject(Store.timescale_width);

// 时间刻度左侧占位的宽度
const timescale_placeholder_width = ref(0);

// 计算 timeLineOffsetLeft
onMounted(() => {
  if (timeLine.value) {
    timeLine.value.addEventListener("scroll", (event) => {
      if (event.target) {
        if (
          event.target.scrollLeft <=
          timescale_width.value - timeLine_width.value
        ) {
          // doing nothing
          timeLineOffsetLeft.value = event.target.scrollLeft;
        }
      }
    });
  } else {
    console.log("error: timeLine.value is", timeLine.value);
  }
});

// timescale's grid
const timeScaleGridList = ref([]);

// 常量，素材最大帧数 (3min = 5400f)
const MATERIAL_MAX_FRAME = 5400;

// 当前格子宽度
const gridWidth = inject(Store.gridWidth);

// 格子内帧数
const gridFrame = inject(Store.gridFrame);

// 每组格子内的帧数
const groupGridFrame = inject(Store.groupGridFrame);

watchEffect(() => {
  try {
    // 获取格子宽度、格子内帧数、每组格子内帧数
    gridWidth.value = Mapping.frameWidth2Grid(frameWidth.value).gridWidth;
    gridFrame.value = Mapping.frameWidth2Grid(frameWidth.value).gridFrame;
    groupGridFrame.value = Mapping.frameWidth2Grid(
      frameWidth.value
    ).groupGridFrame;

    // 获取格子数量
    const gridTotalNumber = Mapping.gridTotalNumber(
      frameWidth.value,
      timeLine_width.value,
      MATERIAL_MAX_FRAME
    );

    console.log("gridTotalNumber", gridTotalNumber);

    // 获取 TimeScale's width
    timescale_width.value = Mapping.getTimeScaleWidth(
      frameWidth.value,
      timeLine_width.value,
      MATERIAL_MAX_FRAME
    );

    // 获取 PlaceHolder 宽度
    timescale_placeholder_width.value = Mapping.getTimeScalePlaceHolderWidth(
      timeLineOffsetLeft.value,
      gridWidth.value
    );

    // 获取格子倍数；例如：2 倍，就是 2 的倍数都会绘制大格
    const gridMultiple = groupGridFrame.value / gridFrame.value;

    // 初始位置
    const firstIndex = Mapping.gridBufferFirstIndex(
      timeLineOffsetLeft.value,
      gridWidth.value
    );

    // 结束位置
    const gridBufferNumber = Mapping.gridBufferNumber(
      timescale_width.value,
      gridWidth.value
    );

    timeScaleGridList.value = [];

    // 动态计算数组长度
    if (gridBufferNumber > timeScaleGridList.value.length) {
      const dValue = gridBufferNumber - timeScaleGridList.value.length;
      for (let i = 1; i <= dValue; i++) {
        timeScaleGridList.value.push({
          frame: 0,
          showNumber: false,
          width: 0,
        });
      }
    } else if (gridBufferNumber < timeScaleGridList.value.length) {
      const dValue = timeScaleGridList.value.length - gridBufferNumber;
      timeScaleGridList.value.splice(
        timeScaleGridList.value.length - dValue,
        dValue
      );
    } else {
      // doing nothing
    }

    // 渲染过程
    console.log("开始渲染");
    console.log("gridWidth", gridWidth.value);
    console.log("第一个格子", firstIndex);
    console.log("格子列表数量", timeScaleGridList.value.length);
    for (let i = firstIndex; i <= gridBufferNumber + firstIndex - 1; i++) {
      console.log("渲染过程", i);
      const grid = timeScaleGridList.value[i - firstIndex];
      if (i - 1 === 0) {
        grid.frame = 0;
        grid.showNumber = true;
        grid.width = gridWidth.value;
      } else if ((i - 1) % gridMultiple === 0) {
        grid.frame = (i - 1) * gridFrame.value;
        grid.showNumber = true;
        grid.width = gridWidth.value;
      } else {
        grid.frame = (i - 1) * gridFrame.value;
        grid.showNumber = false;
        grid.width = gridWidth.value;
      }
    }

    console.log("结束渲染", timeScaleGridList.value);
  } catch (error) {
    // doing nothing
  }
});
</script>

<style lang="scss" scope>
.timeline-container {
  width: 100%;
  height: 288px;
  background: #202020;
  border-top: 1px solid #1a1a1a;
  display: flex;
  flex-direction: column;

  .top-operation-area {
    height: 31px;
    width: 100%;
  }

  .left-operation-area {
    height: 100%;
  }

  .timeline {
    width: calc(100% - 37px);
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-x: scroll;

    .timescale {
      display: flex;
      flex-direction: row;
    }
  }
}
</style>