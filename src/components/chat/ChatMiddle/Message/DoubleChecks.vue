<template>
  <img
      v-if="props.state === 'delivered'"
      :src="GrayChecks"
      class="w-[14px] h-[14px]"
  />
  <img
      v-else-if="props.state === 'read'"
      :src="GreenChecks"
      class="w-[14px] h-[14px]"
  />
</template>

<script setup lang="ts">
import GreenChecks from "~assets/vectors/green_checks.svg";
import GrayChecks from "~assets/vectors/gray_checks.svg";

const props = defineProps<{
  state: string;
}>();
</script>

