<template>
  <div class="video-editor-container">
    <!-- 顶部按钮 -->
    <section class="controller-section">
      <div class="button-container">
        <div class="button">上传视频</div>
        <div class="button">清空视频</div>
      </div>

      <div class="button-container">
        <div class="button">上传音乐</div>
        <div class="button">清空音乐</div>
      </div>

      <div class="button-container">
        <div class="button">上传配音</div>
        <div class="button">清空配音</div>
      </div>
    </section>

    <!-- 中部视频预览器 -->
    <video-player></video-player>

    <!-- 底部时间轴 -->
    <time-line></time-line>
  </div>

  <div class="info-container">
    <div>时间轴容器宽度：{{ timeLineContainer_width }}</div>
    <div>时间轴宽度：{{ timeLine_width }}</div>
    <div>时间刻度尺宽度：{{ timescale_width }}</div>
    <div>时间轴左偏移量：{{ timeLineOffsetLeft }}</div>
    <div>帧宽度：{{ frameWidth }}</div>
    <div>格子宽度：{{ gridWidth }}</div>
    <div>格子内帧数：{{ gridFrame }}</div>
    <div>每组格子内帧数：{{ groupGridFrame }}</div>
  </div>
</template>

<script setup>
import VideoPlayer from "@/components/VideoPlayer.vue";
import TimeLine from "@/components/TimeLine.vue";

import Store from "@/store";
import { inject, computed } from "vue";
import Mapping from "@/map";

// 时间轴的宽度
const timeLineContainer_width = inject(Store.timeLineContainer_width);

// 时间轴滚动轴左偏移量
const timeLineOffsetLeft = inject(Store.timeLineOffsetLeft);

// 帧宽度：决定了时间轴的比例
const frameWidth = inject(Store.frameWidth);

// 当前格子宽度
const gridWidth = inject(Store.gridWidth);

// 格子内帧数
const gridFrame = inject(Store.gridFrame);

// 每组格子内的帧数
const groupGridFrame = inject(Store.groupGridFrame);

// 时间轴宽度：用户能看见的宽度
const timeLine_width = inject(Store.timeLine_width);

// 时间刻度总宽度：包含用户看不见的宽度
const timescale_width = inject(Store.timescale_width);

// 初始化：时间轴组件的宽度
timeLineContainer_width.value = Mapping.calcTimeLineContainerWidth(
  document.body.clientWidth
);

// 动态监听：窗口变化 -> 时间轴组件的宽度
window.onresize = () =>
  (() => {
    timeLineContainer_width.value = Mapping.calcTimeLineContainerWidth(
      document.body.clientWidth
    );
  })();
</script>

<style lang="scss" scope>
.info-container {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  color: #efefef;
  font-size: 14px;
}

.video-editor-container {
  height: 100%;
  background: #1a1a1a;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.controller-section {
  height: 80px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.button-container {
  display: flex;
  flex-direction: row;
  width: 170px;
  justify-content: space-between;

  .button {
    width: 80px;
    height: 27px;
    background: #222222;
    color: #efefef;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
  }
}
</style>