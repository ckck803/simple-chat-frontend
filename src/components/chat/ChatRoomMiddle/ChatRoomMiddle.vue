<template>
    <div
        class="flex flex-col grow bg-white p-6 rounded shadow overflow-y-auto mb-4 "
        ref="messageContainer"
    >
<!--  <div-->
<!--      class="grow px-5 py-5 flex flex-col overflow-y-scroll scrollbar-hidden"-->
<!--  >-->
    <div
        v-for="(message, index) in chatConversation.messageList.slice().reverse()"
        :key="index"
    >
      <TimelineDivider :date="message.sendDate"
                       v-if="isDateChanged(index, chatConversation.messageList.slice().reverse())"/>
      <Message
          :message="message"
          :self="isSelf(message)"
          :follow-up="isFollowUp(index, index - 1)"
          :divider="isSenderSwitched(index, chatConversation.messageList.slice().reverse())"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import Message from "~components/chat/ChatRoomMiddle/Message/Message.vue";
import TimelineDivider from "~components/chat/ChatRoomMiddle/Message/TimelineDivider.vue";
import useChatConversationStore from "~store/useChatConversationStore.ts";
import {storeToRefs} from "pinia";
import {IChatMessage} from "~types/IChatMessage.ts";
import usePageStore from "~store/usePageStore.ts";
import useUserInfoStore from "~store/useUserInfoStore.ts";
import {nextTick, onMounted, Ref, ref, watch} from "vue";

const pageStore = usePageStore();
const {chatRoom} = storeToRefs(pageStore);

const userInfoStore = useUserInfoStore();
const {userInfo} = storeToRefs(userInfoStore)

const chatMessageStore = useChatConversationStore();
const {chatConversation} = storeToRefs(chatMessageStore);
// const messageContainer = ref<HTMLDivElement | null>(null); // ref 추가

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

const isSelf = (message: IChatMessage): boolean => {
  return Boolean(userInfo.value.userId && message.userId === userInfo.value.userId);
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