<template>
  <div
    style="position: relative; flex-shrink: 0"
    :style="{ width: width + 'px', height: height + 'px' }"
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
const height = computed(() => (props.showNumber ? 4 : 2));

// 小格的显示时间
const time = computed(() =>
  Mapping.frame2Time(props.frame ? props.frame : 0, 30)
);
</script>

<style>
.grid-container {
  position: absolute;
  top: 0;
  left: 0;
  background: #202020;
  border-left: 1px solid #707070;
}

.grid-number {
  position: absolute;
  left: 0;
  top: 0;
  color: #979797;
  font-size: 10px;
  margin-left: 2.5px;
  font-weight: bold;
}
</style>
