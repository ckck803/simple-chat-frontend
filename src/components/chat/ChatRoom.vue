<template>
  <div class="flex flex-col h-full">
    <div class="flex-1 flex-col h-full" v-if="status !== 'loading'">
      <div class="flex flex-col h-full px-28 py-5">
        <div v-if="pageStore.chatRoom" class="flex flex-col h-full scrollbar-hidden shadow rounded">
          <ChatRoomHeader class="border-b border-b-gray-200"
              :select-all="selectAll"
              :select-mode="selectMode"
              :handle-select-all="handleSelectAll"
              :handle-deselect-all="handleDeselectAll"
              :handle-close-select="handleCloseSelect"
          />
          <ChatMiddle/>
          <ChatBottom class="border-t border-t-gray-200" :selectedChatRoom="pageStore.chatRoom"/>
        </div>
        <div v-else class="flex items-center justify-center h-full">
          <p class="text-gray-500">Select a chat room to start chatting.</p>
        </div>
      </div>
    </div>
    <div v-else class="flex flex-col h-full">
      <Loading/>
    </div>
  </div>
</template>
<script setup lang="ts">
import {nextTick, onMounted, ref, watch} from "vue";
import axios from "axios";
import ChatBottom from "~components/chat/ChatRoomBottom/ChatRoomBottom.vue";
import usePageStore from "~store/usePageStore.ts";
import {storeToRefs} from "pinia";
import useChatRoomStore from "~store/useChatRoomStore.ts";
import ChatMiddle from "~components/chat/ChatRoomMiddle/ChatRoomMiddle.vue";
import Loading from "~components/loading/Loading.vue";
import ChatRoomHeader from "~components/chat/ChatRoomHeader/ChatRoomHeader.vue";

const pageStore = usePageStore();
const {chatRoom, status} = storeToRefs(pageStore);

const chatMessageStore = useChatRoomStore();
const {chatConversation} = storeToRefs(chatMessageStore);

axios.defaults.baseURL = "http://127.0.0.1:8080";

// determines whether select mode is enabled.
const selectMode = ref(false);
// determines whether all the messages are selected or not.
const selectAll = ref(false);
// (event) select all messages.
const handleSelectAll = () => {
  // if (activeConversation.value) {
  //   const messages = activeConversation.value.messages.map(
  //       (message) => message.id
  //   );
  //   selectedMessages.value = messages;
  //   selectAll.value = true;
  // }
};
// (event) remove the selected messages.
const handleDeselectAll = () => {
  selectAll.value = false;
  // selectedMessages.value = [];
};

// (event handle close Select)
const handleCloseSelect = () => {
  selectMode.value = false;
  selectAll.value = false;
  // selectedMessages.value = [];
};

// chatRoom이 변경될 때마다 getChatRoomMessages 호출
watch(chatRoom, async (newChatRoom, oldChatRoom) => {
  if (newChatRoom !== oldChatRoom) {
    console.log("채팅방 변경")
    await chatMessageStore.getChatRoomMessages(chatRoom.value!);
  }
});

onMounted(async () => {
  scrollToBottom(); // 초기화 시 스크롤
  status.value = "success";
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
