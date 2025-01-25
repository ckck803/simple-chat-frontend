<template>
  <!-- 오른쪽 패널: 채팅 인터페이스 -->
  <!--  <div class="w-3/4 p-6">-->
  <div class="w-full p-6 px-20">
    <div v-if="pageStore.chatRoom" class="flex flex-col h-full scrollbar-hidden">
      <h2 class="text-2xl font-bold mb-4">
        채팅방: {{ pageStore.chatRoom.name }}
      </h2>
      <div
          class="flex-1 bg-white p-6 rounded shadow overflow-y-auto mb-4  max-h-[calc(100vh-190px)]"
           ref="messageContainer"
      >
        <div class="overflow-auto"
             v-if="store.status !== 'loading'"
             v-for="(message, index) in chatConversation.messageList.slice().reverse()"
             :key="index"
        >
          <TimelineDivider :date="message.sendDate" v-if="isDateChanged(index, chatConversation.messageList.slice().reverse())"/>
          <Message
              :message="message"
              :self="isSelf(message)"
              :follow-up="isFollowUp(index, index - 1)"
              :divider="isSenderSwitched(index, chatConversation.messageList.slice().reverse())"
          />
        </div>
      </div>
      <ChatBottom :selectedChatRoom="pageStore.chatRoom"/>
    </div>
    <div v-else class="flex items-center justify-center h-full">
      <p class="text-gray-500">Select a chat room to start chatting.</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { nextTick, onMounted, ref, watch} from "vue";
import axios from "axios";
import ChatBottom from "~components/chat/ChatBottom/ChatBottom.vue";
import useStore from "~store/store.ts";
import Message from "~components/chat/ChatMiddle/Message/Message.vue";
import usePageStore from "~store/usePageStore.ts";
import {storeToRefs} from "pinia";
import useUserInfoStore from "~store/useUserInfoStore.ts";
import {IChatMessage} from "~types/IChatMessage.ts";
import useChatConversationStore from "~store/useChatConversationStore.ts";
import TimelineDivider from "~components/chat/ChatMiddle/Message/TimelineDivider.vue";

const pageStore = usePageStore();
const userInfoStore = useUserInfoStore();
const chatMessageStore = useChatConversationStore();

const {chatConversation} = storeToRefs(chatMessageStore);
const {chatRoom} = storeToRefs(pageStore);
const {userInfo} = storeToRefs(userInfoStore)
// const messegeListLength = computed(() => messageList.value.length)


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


const getCurrentDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

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

const isSelf = (message: IChatMessage): boolean => {
  return Boolean(userInfo.value.userId && message.userId === userInfo.value.userId);
};


const store = useStore();

const messageDivide = (sendDate: string): boolean => {

  if (sendDate === getCurrentDate()) {
    return true;
  } else {
    return false;
  }
};

const isDateChanged = (index: number, list: IChatMessage[]): boolean => {
  if (index - 1 < 0) {
    return false;
  }

  if (list![index].sendDate !== list![index - 1].sendDate) {
    return true;
  } else {
    return false;
  }
};

const isSenderSwitched = (index: number, list: IChatMessage[]): boolean => {
  if (index - 1 < 0) {
    return false;
  }

  if (list![index].userId !== list![index - 1].userId) {
    return true;
  } else {
    return false;
  }
};

const isFollowUp = (index: number, previousIndex: number): boolean => {
  if (previousIndex < 0) {
    return false;
  } else {
    // let previousSender = activeConversation.messages[previousIndex].sender.id;
    // let currentSender = activeConversation.messages[index].sender.id;
    // return previousSender === currentSender;
    return true;
  }
};

</script>

<style scoped></style>
