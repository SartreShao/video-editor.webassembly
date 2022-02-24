<template>
  <div class="timeline-container">
    <!-- 顶部操作按钮区域 -->
    <div class="button-container"></div>

    <!-- 底部核心操作区域 -->
    <div class="core-container">
      <!-- 左边按钮区域 -->
      <div class="left-container"></div>

      <!-- 时间轴核心区域 -->
      <div class="time-line"></div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scope>
.timeline-container {
  width: 100%;
  height: 288px;
  background: #202020;
  border-top: 1px solid #1a1a1a;
  display: flex;
  flex-direction: column;

  .button-container {
    height: 31px;
    width: 100%;
  }

  .core-container {
    width: 100%;
    height: calc(100% - 31px);
    display: flex;
    flex-direction: row;

    .left-container {
      width: 37px;
      height: 100%;
    }

    .time-line {
      width: calc(100% - 37px);
    }
  }
}
</style>