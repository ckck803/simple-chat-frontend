<template>
  <!--  <div class="w-full p-6 px-20">-->
  <!--    <div v-if="pageStore.chatRoom" class="flex flex-col h-full scrollbar-hidden">-->
  <!--      <h2 class="text-2xl font-bold mb-4">-->
  <!--        채팅방: {{ pageStore.chatRoom.name }}-->
  <!--      </h2>-->
  <!--      <ChatRoomMiddle />-->
  <!--      <ChatRoomBottom :selectedChatRoom="pageStore.chatRoom"/>-->
  <!--    </div>-->
  <!--    <div v-else class="flex items-center justify-center h-full">-->
  <!--      <p class="text-gray-500">Select a chat room to start chatting.</p>-->
  <!--    </div>-->
  <!--  </div>-->
  <div class="flex flex-col h-full px-28">
    <div v-if="pageStore.chatRoom" class="flex flex-col h-full scrollbar-hidden">
      <h2 class="text-2xl font-bold mb-4">
        채팅방: {{ pageStore.chatRoom.name }}
      </h2>
      <ChatMiddle/>
      <ChatBottom :selectedChatRoom="pageStore.chatRoom"/>
    </div>
    <div v-else class="flex items-center justify-center h-full">
      <p class="text-gray-500">Select a chat room to start chatting.</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import {nextTick, onMounted, ref, watch} from "vue";
import axios from "axios";
import ChatBottom from "~components/chat/ChatRoomBottom/ChatRoomBottom.vue";
import usePageStore from "~store/usePageStore.ts";
import {storeToRefs} from "pinia";
import useChatConversationStore from "~store/useChatConversationStore.ts";
import ChatMiddle from "~components/chat/ChatRoomMiddle/ChatRoomMiddle.vue";

const pageStore = usePageStore();
const {chatRoom} = storeToRefs(pageStore);

const chatMessageStore = useChatConversationStore();
const {chatConversation} = storeToRefs(chatMessageStore);

axios.defaults.baseURL = "http://127.0.0.1:8080";

// chatRoom이 변경될 때마다 getChatRoomMessages 호출
watch(chatRoom, async (newChatRoom, oldChatRoom) => {
  if (newChatRoom !== oldChatRoom) {
    console.log("채팅방 변경")
    await chatMessageStore.getChatRoomMessages(chatRoom.value!);
  }
});

onMounted(async () => {
  scrollToBottom(); // 초기화 시 스크롤
});

const messageContainer = ref<HTMLDivElement | null>(null); // ref 추가

// chatRoom이 변경될 때마다 getChatRoomMessages 호출

watch(chatRoom, async (newChatRoom, oldChatRoom) => {
  if (newChatRoom !== oldChatRoom) {
    console.log("채팅방 변경");
    await chatMessageStore.getChatRoomMessages(chatRoom.value!);
    scrollToBottom(); // 새 메시지를 불러오면 스크롤
  }
});
// 메시지 목록 변경을 감지하여 스크롤

watch(chatConversation, async () => {
  await nextTick(); // DOM 업데이트 후 실행
  scrollToBottom();
}, {deep: true});
// 최신 메시지로 스크롤

const scrollToBottom = () => {
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
  }
};


</script>

<style scoped></style>
