<template>
  <textarea
      :class="classes"
      ref="textarea"
      :value="props.value"
      @input="$event =>{handleAutoResize(); $emit('update:modelValue', ($event.target as HTMLInputElement).value)}"
      @keydown.enter.prevent="handleEnterEvent"
  ></textarea>
</template>

<script setup lang="ts">
import type {Ref} from "vue";

import {twMerge} from "tailwind-merge";
import {computed, ref} from "vue";

const props = defineProps<{
  class: any;
  variant?: string;
  value?: string;
  autoResize?: boolean;
  onEnter: () => void;
}>();

const emit = defineEmits(['update:modelValue']);
const textarea: Ref<HTMLTextAreaElement | null> = ref(null);

const baseClasses = `max-w-full w-full px-5 py-4 rounded-sm content-center outline-none text-sm
        placeholder:text-black placeholder:opacity-40 text-opacity-70 dark:placeholder:text-white 
        dark:placeholder:opacity-70 focus:outline-none transition duration-200 
        ease-out`;

const variantClasses = computed(() => {
  if (props.variant === "bordered") {
    return `border border-gray-200 text-black bg-gray-50 dark:bg-gray-700
            dark:text-white dark:bg-opacity-70 dark:focus:bg-opacity-0 focus:bg-opacity-0
            focus:border-indigo-300 dark:border-gray-600`;
  } else {
    return `text-black bg-gray-50 dark:text-white border-opacity-0 
            dark:bg-gray-700 dark:bg-opacity-70 dark:border-opacity-70 dark:border-gray-700`;
  }
});

const classes = twMerge(baseClasses, variantClasses.value, props.class);

const handleAutoResize = () => {
  if (props.autoResize && textarea.value) {
    textarea.value.style.height = "auto";
    textarea.value.style.height = textarea.value.scrollHeight + "px";
  }
};

const handleEnterEvent = async (event: KeyboardEvent): Promise<void> => {
  if (event.isComposing) {
    return;
  }

  if (event.ctrlKey) {
    // Ctrl + Enter: 개행 추가
    // props.value += '\n';
    await emit('update:modelValue', '\n')
    handleAutoResize();
  } else {
    // Enter: 메시지 서버로 전송
    if (!props.onEnter) {
      return;
    }
    props.onEnter();
  }

};


// const onInput = (event:InputEvent) => {
//   if (!event.isComposing) {
//     return;
//   }
//
//   const target = event.target as HTMLTextAreaElement;
//   handleAutoResize();
//   emit('update:modelValue', target.value);
// };

</script>

