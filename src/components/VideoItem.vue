<template>
  <div class="video-item" :style="{ width: width + 'px' }">
    <!-- 分割线 -->
    <div class="placeholder"></div>
  </div>
</template>

<script setup>
import { defineProps, computed, inject } from "vue";
import Mapping from "@/map";
import Store from "@/store";

const props = defineProps({
  visionTrackMateril: Object,
});

const frameWidth = inject(Store.frameWidth);

const width = computed(() =>
  props.visionTrackMateril
    ? Mapping.getVideoItemWidth(
        props.visionTrackMateril.timeLineIn,
        props.visionTrackMateril.timeLineOut,
        frameWidth.value
      )
    : 0
);
</script>

<style scoped lang="scss">
.video-item {
  background: #000;
  position: relative;

  .placeholder {
    position: absolute;
    right: 0;
    width: 2px;
    background: #202020;
    height: 100%;
    top: 0;
    bottom: 0;
  }
}
</style>