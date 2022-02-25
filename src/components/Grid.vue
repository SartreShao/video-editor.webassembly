<template>
  <div
    style="position: relative; flex-shrink: 0"
    :style="{ width: width + 'px', height: '22px' }"
  >
    <!-- 小格 -->
    <div
      class="grid-container"
      :style="{ width: width + 'px', height: height + 'px' }"
    ></div>

    <!-- 数字 -->
    <div
      class="grid-number"
      :style="{ marginTop: height + 2 + 'px' }"
      v-if="showNumber"
    >
      {{ time }}
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect, defineProps, computed } from "vue";
import Mapping from "@/map";

// 接收参数
const props = defineProps({
  width: Number,
  frame: Number,
  showNumber: Boolean,
});

// 小格的高度
const height = computed(() => (props.showNumber ? 5 : 3));

// 小格的显示时间
const time = computed(() =>
  Mapping.frame2Time(props.frame ? props.frame : 0, 30)
);
</script>

<style>
.grid-container {
  position: absolute;
  bottom: 0;
  left: 0;
  background: #202020;
  border-left: 1.5px solid #707070;
}

.grid-number {
  position: absolute;
  left: 0;
  bottom: 7px;
  color: #979797;
  font-weight: bold;
  font-size: 12px;
  transform: scale(0.83333333);
  transform-origin: left center;
  line-height: 18px;
}
</style>
