<template>
  <div class="video-item" :style="{ width: width + 'px' }">
    <img
      class="video-frame"
      v-for="item in videoFrameList"
      :key="item"
      :src="item.url"
    />

    <!-- 分割线 -->
    <div class="placeholder"></div>
  </div>
</template>

<script setup>
import { defineProps, computed, inject } from "vue";
import Mapping from "@/map";
import Store from "@/store";

const props = defineProps({
  visionTrackMaterial: Object,
  videoFrameList: Array,
});

const frameWidth = inject(Store.frameWidth);

const width = computed(() =>
  props.visionTrackMaterial
    ? Mapping.getVideoItemWidth(
        props.visionTrackMaterial.timeLineIn,
        props.visionTrackMaterial.timeLineOut,
        frameWidth.value
      )
    : 0
);
</script>

<style scoped lang="scss">
.video-item {
  background: #000;
  position: relative;
  display: flex;
  overflow: hidden;
  align-items: center;

  .video-frame {
    flex-shrink: 0;
    width: 49px;
    height: 52px;
    object-fit: cover;
  }

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