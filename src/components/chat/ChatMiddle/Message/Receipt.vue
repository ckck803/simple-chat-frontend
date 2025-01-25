
<template>
  <ClockIcon
      v-if="props.state === 'waiting'"
      class="w-[14px] h-[14px] text-gray-300"
  />
  <CheckIcon
      v-else-if="props.state === 'sent'"
      class="w-[14px] h-[14px] text-gray-300"
  />
  <DoubleChecks v-else :state="props.state" />
</template>

<script setup lang="ts">
import { CheckIcon, ClockIcon } from "@heroicons/vue/24/outline";
import DoubleChecks from "~components/chat/ChatMiddle/Message/DoubleChecks.vue";

const props = defineProps<{
  state: string;
}>();

</script>
