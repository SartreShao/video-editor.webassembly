<template>
  <!-- <video-editor></video-editor> -->
  <router-view></router-view>
</template>

<script setup>
import Store from "@/store";

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
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1a1a;
}
</style>