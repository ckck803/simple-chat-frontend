<template>
  <SlideTransition animation="shelf-up">
    <div
        class="absolute bottom-0 w-full px-5 py-2 bg-white dark:bg-gray-800 flex items-center justify-between transition-all duration-200"
        v-if="chatConversation?.replyMessage"
    >
      <!--selected message overview-->
      <MessagePreview :message="chatConversation?.replyMessage" />

      <!--close selected Message-->
      <IconButton
          @click="removeReplyMessage"
          class="group w-7 h-7"
          title="remove reply"
          aria-label="remove reply"
      >
        <XCircleIcon
            class="w-[16px] h-[16px] text-gray-300 group-hover:text-red-300"
        />
      </IconButton>
    </div>
  </SlideTransition>
</template>

<script setup lang="ts">
import { XCircleIcon } from "@heroicons/vue/24/outline";
import MessagePreview from "~components/chat/MessagePreview.vue";
import IconButton from "~ui/inputs/IconButton.vue";
import SlideTransition from "~ui/transitions/SlideTransition.vue";
import useChatConversationStore from "~store/useChatConversationStore.ts";
import {storeToRefs} from "pinia";

// const store = useStore();
// const activeConversation = <IConversation>inject("activeConversation");

const chatConversationStore = useChatConversationStore();
const {chatConversation} = storeToRefs(chatConversationStore);

const removeReplyMessage = () => {
  if (chatConversation.value.messageList) {
    chatConversation.value.replyMessage = undefined;
  }
};
</script>
