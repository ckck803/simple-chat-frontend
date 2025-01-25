<template>
  <div class="w-full my-7 flex items-center justify-center whitespace-nowrap">
    <div
        class="w-full h-0 border-t border-dashed dark:border-gray-600 dark:bg-opacity-0"
    ></div>

<!--    <Typography variant="body-4" class="mx-5"> Today </Typography>-->
    <Typography variant="body-4" class="mx-5"> {{ timeLineDividerDate }} </Typography>

    <div
        class="w-full h-0 border-t border-dashed dark:border-gray-600 dark:bg-opacity-0"
    ></div>
  </div>
</template>

<script setup lang="ts">
import Typography from "~ui/data-display/Typography.vue";
import {computed} from "vue";

const props = defineProps<{
  date: string
}>();

const timeLineDividerDate = computed(() => {
  const date = new Date(props.date);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}년 ${month}월 ${day}일`
})
</script>

