<template>
  <div class="video-player-container">
    <video></video>
    <div class="button-container">
      <span class="current-time">00:00:00:00</span>
      <span class="total-time">00:00:00:00</span>

      <div class="play">播放</div>
    </div>
  </div>
</template>

<script setup>
</script>

<style lang="scss" scope>
.video-player-container {
  width: 100%;
  height: 422px;
  background: #202020;
  display: flex;
  flex-direction: column;
  align-items: center;

  video {
    width: 658.86px;
    height: 370.61px;
    background: #000000;
    margin-top: 15px;
    margin-bottom: 10px;
  }

  .button-container {
    width: 658.86px;
    display: flex;
    justify-content: flex-start;
    position: relative;

    .current-time {
      font-size: 12px;
      margin-right: 14px;
      color: #7f72e5;
    }

    .total-time {
      font-size: 12px;
      margin-right: 14px;
      color: #bbbbbb;
    }

    .play {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      margin: auto;
      width: 30px;
      text-align: center;
      font-size: 12px;
      font-weight: bold;
      color: #efefef;
      cursor: pointer;
    }
  }
}
</style>