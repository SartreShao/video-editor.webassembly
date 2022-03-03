<template>
  <div class="video-item" :style="{ width: width + 'px' }"></div>
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
    ? Mapping.μs2Frame(
        props.visionTrackMateril.timeLineOut -
          props.visionTrackMateril.timeLineIn,
        30
      ) * frameWidth.value
    : 0
);
</script>

<style scoped>
.video-item {
  background: #000;
}
</style>