<template>
  <div class="bg-white dark:bg-gray-800 transition-colors duration-500" :style="{ height: height }">
    <router-view/>
  </div>
</template>

<script setup lang="ts">
// and add the resize event when the component mounts.
import {onMounted, onUnmounted, ref} from "vue";

// the app height
const height = ref(`${window.innerHeight}px`);

// change the app height to the window hight.
const resizeWindow = () => {
  height.value = `${window.innerHeight}px`;
};

onMounted(() => {
  window.addEventListener("resize", resizeWindow);
});

// remove the event when un-mounting the component.
onUnmounted(() => {
  window.removeEventListener("resize", resizeWindow);
});
</script>

<style scoped>
</style>
