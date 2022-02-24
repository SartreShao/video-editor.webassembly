<template>
  <div class="video-editor-container" :style="{ width: timeLineWidth + 'px' }">
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
    <div>时间轴宽度：{{ timeLineWidth }}</div>
  </div>
</template>

<script setup>
import VideoPlayer from "@/components/VideoPlayer.vue";
import TimeLine from "@/components/TimeLine.vue";

import Store from "@/store";
import { inject } from "vue";
import Mapping from "@/map";

// 常量：时间轴的宽度
const timeLineWidth = inject(Store.timeLineWidth);

// 初始化：时间轴组件的宽度
timeLineWidth.value = Mapping.calcTimeLineWidth(document.body.clientWidth);

// 动态监听：窗口变化 -> 时间轴组件的宽度
window.onresize = () =>
  (() => {
    timeLineWidth.value = Mapping.calcTimeLineWidth(document.body.clientWidth);
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