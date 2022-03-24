<template>
  <input type="file" @change="inputFile($event)" />
</template>

<script setup>
import { inject } from "vue";
import Store from "@/store";
import WASM from "@/wasm";

const worker = inject(Store.readFrameWorker);

const inputFile = (e) => {
  // console.log("file", e.target.files);
};
</script>

<style>
</style>