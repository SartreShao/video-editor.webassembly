<template>
  <router-view />
</template>

<script setup>
import Store from "@/store";

// 提供全局依赖注入
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