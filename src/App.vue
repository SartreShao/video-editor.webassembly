<template>
  <video-editor></video-editor>
</template>

<script setup>
import Store from "@/store";
import VideoEditor from "@/views/VideoEditor.vue";

// 依赖注入
Store.useProvider();
</script>

<style>
body {
  margin: 0;
}

#app {
  width: 100vw;
  height: 100vh;
}
</style>